<?php

namespace App\Http\Controllers;

use App\Exports\OmzetExport;
use App\Exports\PembelianPersediaanExport;
use App\Exports\PengeluaranExport;
use App\Exports\PermintaanReturnExport;
use App\Exports\PermintaanStokExport;
use App\Http\Resources\BranchResource;
use App\Http\Resources\InventoryPurchaseResource;
use App\Http\Resources\OperationalBranchResource;
use App\Http\Resources\RequestOrderResource;
use App\Http\Resources\SaleResource;
use App\Models\Branch;
use App\Models\Employee;
use App\Models\InventoryPurchase;
use App\Models\ListInventoryPurchase;
use App\Models\ListRequestOrder;
use App\Models\ListRequestReturn;
use App\Models\ListSale;
use App\Models\OperationalBranch;
use App\Models\Report;
use App\Models\RequestOrder;
use App\Models\RequestReturn;
use App\Models\Sale;
use App\Traits\OptimizedQueries;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;
use Maatwebsite\Excel\Facades\Excel;

class ReportController extends Controller {
    use OptimizedQueries;

    public function index(Request $request): Response {
        Gate::authorize('viewAny', Report::class);
        
        $startDate = $request->start_date 
            ? Carbon::parse($request->start_date)->startOfDay() 
            : Carbon::today()->startOfDay();
        $endDate = $request->end_date 
            ? Carbon::parse($request->end_date)->endOfDay() 
            : Carbon::today()->endOfDay();
        
        // Optimized: Use withSum instead of map + sum
        $sales = Sale::query()
            ->select('id', 'branch_id', 'updated_at')
            ->withSum('listSale', 'total_price')
            ->whereBetween('updated_at', [$startDate, $endDate])
            ->when($request->branch, fn($query) => $query->where('branch_id', $request->branch))
            ->get()
            ->map(fn($sale) => [
                'total_price' => $sale->list_sale_sum_total_price ?? 0,
                'date' => Carbon::parse($sale->updated_at)->timezone('Asia/Makassar')->format('Y-m-d\TH:i:s.v\Z'),
            ]);
        
        $expenditures = OperationalBranch::query()
            ->select('id', 'branch_id', 'total_cost', 'updated_at')
            ->whereBetween('updated_at', [$startDate, $endDate])
            ->when($request->branch, fn($query) => $query->where('branch_id', $request->branch))
            ->get()
            ->map(fn($exp) => [
                'total_cost' => $exp->total_cost,
                'date' => Carbon::parse($exp->updated_at)->timezone('Asia/Makassar')->format('Y-m-d\TH:i:s.v\Z'),
            ]);
        
        // Optimized: Use withSum
        $purchases = InventoryPurchase::query()
            ->select('id', 'updated_at')
            ->withSum('listInventoryPurchase', 'total_price')
            ->whereBetween('updated_at', [$startDate, $endDate])
            ->get()
            ->map(fn($p) => ['total_price' => $p->list_inventory_purchase_sum_total_price ?? 0]);
        
        // Optimized: Use withSum
        $orders = RequestOrder::query()
            ->select('id', 'branch_id', 'updated_at')
            ->withSum('listRequestOrder', 'quantity')
            ->whereBetween('updated_at', [$startDate, $endDate])
            ->when($request->branch, fn($query) => $query->where('branch_id', $request->branch))
            ->get()
            ->map(fn($o) => ['total' => $o->list_request_order_sum_quantity ?? 0]);
        
        // Optimized: Use withSum
        $returns = RequestReturn::query()
            ->select('id', 'branch_id', 'updated_at')
            ->withSum('listRequestReturn', 'quantity')
            ->whereBetween('updated_at', [$startDate, $endDate])
            ->when($request->branch, fn($query) => $query->where('branch_id', $request->branch))
            ->get()
            ->map(fn($r) => ['total' => $r->list_request_return_sum_quantity ?? 0]);
        
        // Optimized: Calculate yearly sales with DB aggregate
        $penjualanTahunan = $this->getYearlySalesData($request->branch);
        
        // Optimized: Single query for top sales
        $topPenjualan = DB::table('branches')
            ->leftJoin('sales', 'branches.id', '=', 'sales.branch_id')
            ->leftJoin('list_sales', 'sales.id', '=', 'list_sales.sale_id')
            ->select('branches.id as branch_id', 'branches.branch_name', DB::raw('COALESCE(SUM(list_sales.total_price), 0) as total_sales'))
            ->groupBy('branches.id', 'branches.branch_name')
            ->orderByDesc('total_sales')
            ->get();
        
        // Optimized: Get all branch data with aggregates
        $allData = $this->getAllBranchData();
        
        // Cache branches
        $branches = $this->getCachedAllBranches();
        
        return Inertia::render('Managements/Reports/IndexReport', [
            'branches' => BranchResource::collection($branches),
            'sales' => $sales,
            'expenditures' => $expenditures,
            'purchases' => $purchases,
            'orders' => $orders,
            'returns' => $returns,
            'selectBranch' => $request->selectBranch ?? 'CABANG',
            'penjualanTahunan' => $penjualanTahunan,
            'topPenjualan' => $topPenjualan,
            'allData' => $allData
        ]);
    }

    private function getYearlySalesData($branchId = null): array {
        $months = [
            'Jan' => 0, 'Feb' => 0, 'Mar' => 0, 'Apr' => 0,
            'Mei' => 0, 'Jun' => 0, 'Jul' => 0, 'Aug' => 0,
            'Sep' => 0, 'Okt' => 0, 'Nov' => 0, 'Des' => 0
        ];
        
        $monthMap = [
            1 => 'Jan', 2 => 'Feb', 3 => 'Mar', 4 => 'Apr',
            5 => 'Mei', 6 => 'Jun', 7 => 'Jul', 8 => 'Aug',
            9 => 'Sep', 10 => 'Okt', 11 => 'Nov', 12 => 'Des'
        ];
        
        // Single optimized query using DB aggregate
        $salesByMonth = DB::table('sales')
            ->join('list_sales', 'sales.id', '=', 'list_sales.sale_id')
            ->select(DB::raw('MONTH(sales.created_at) as month'), DB::raw('SUM(list_sales.total_price) as total'))
            ->whereYear('sales.created_at', Carbon::now()->year)
            ->when($branchId, fn($q) => $q->where('sales.branch_id', $branchId))
            ->groupBy(DB::raw('MONTH(sales.created_at)'))
            ->get();
        
        foreach ($salesByMonth as $row) {
            if (isset($monthMap[$row->month])) {
                $months[$monthMap[$row->month]] = $row->total;
            }
        }
        
        return $months;
    }

    private function getAllBranchData(): array {
        // Single optimized query instead of N+1
        return DB::table('branches')
            ->leftJoin('sales', 'branches.id', '=', 'sales.branch_id')
            ->leftJoin('list_sales', 'sales.id', '=', 'list_sales.sale_id')
            ->leftJoin('operational_branches', 'branches.id', '=', 'operational_branches.branch_id')
            ->leftJoin('request_orders', 'branches.id', '=', 'request_orders.branch_id')
            ->select(
                'branches.id',
                'branches.branch_name',
                DB::raw('COALESCE(SUM(DISTINCT list_sales.total_price), 0) as omzet'),
                DB::raw('COALESCE(SUM(DISTINCT operational_branches.total_cost), 0) as pengeluaran'),
                DB::raw('COUNT(DISTINCT request_orders.id) as permintaan_pesanan')
            )
            ->groupBy('branches.id', 'branches.branch_name')
            ->get()
            ->map(fn($row) => [
                'branch_name' => $row->branch_name,
                'omzet' => $row->omzet,
                'pengeluaran' => $row->pengeluaran,
                'permintaan_pesanan' => $row->permintaan_pesanan
            ])
            ->toArray();
    }

    public function cetak(Request $request): Response {
        $branch = Branch::find($request->branch_id)?->branch_name ?? 'SEMUA CABANG';
        $tanggalMulai = $request->tanggal_mulai ?? now();
        $tanggalSelesai = $request->tanggal_selesai ?? now();
        $fetchData = $this->getData($request);
        $file = str_replace(' ', '', $request->pilihan);
        return Inertia::render("Managements/Reports/{$file}", [
            'fetchData' => $fetchData,
            'branch' => $branch,
            'tanggalMulai' => $tanggalMulai,
            'tanggalSelesai' => $tanggalSelesai
        ]);
    }

    public function export(Request $request) {
        $branch = Branch::find($request->branch_id)?->branch_name ?? 'SEMUA CABANG';
        $tanggalMulai = $request->tanggal_mulai ? Carbon::parse($request->tanggal_mulai)->format('d-m-Y') : now()->format('d-m-Y');
        $tanggalSelesai = $request->tanggal_selesai ? Carbon::parse($request->tanggal_selesai)->format('d-m-Y') : now()->format('d-m-Y');
        $data = [
            'pilihan' => $request->pilihan,
            'branch' => $request->branch_id,
            'cabang' => $branch,
            'mulai' => $tanggalMulai,
            'selesai' => $tanggalSelesai
        ];
        
        return match($request->pilihan) {
            'Omzet' => Excel::download(new OmzetExport($data), now() . '-omzet.xlsx'),
            'Pengeluaran' => Excel::download(new PengeluaranExport($data), now() . '-pengeluaran.xlsx'),
            'Pembelian Persediaan' => Excel::download(new PembelianPersediaanExport($data), now() . '-pembelian-persediaan.xlsx'),
            'Permintaan Stok' => Excel::download(new PermintaanStokExport($data), now() . '-permintaan-stok.xlsx'),
            'Permintaan Return' => Excel::download(new PermintaanReturnExport($data), now() . '-permintaan-return.xlsx'),
            default => back()
        };
    }

    private function getData($request) {
        $dateRange = [
            Carbon::parse($request->tanggal_mulai)->startOfDay(),
            Carbon::parse($request->tanggal_selesai)->endOfDay()
        ];
        
        return match ($request->pilihan) {
            "Omzet" => Sale::query()
                ->with(['listSale.branchProduct.product', 'listSale.branchProduct.branch'])
                ->when($request->tanggal_mulai && $request->tanggal_selesai, fn($query) => $query->whereBetween('updated_at', $dateRange))
                ->when(!$request->tanggal_mulai || !$request->tanggal_selesai, fn($query) => $query->whereDate('updated_at', Carbon::today()))
                ->when($request->branch_id, fn($query) => $query->where('branch_id', $request->branch_id))
                ->get()
                ->flatMap(fn($sale) => $sale->listSale)
                ->toArray(),

            "Pengeluaran" => OperationalBranch::query()
                ->with(['branch:id,branch_name', 'expenditure:id,type_of_fee'])
                ->when($request->tanggal_mulai && $request->tanggal_selesai, fn($query) => $query->whereBetween('updated_at', $dateRange))
                ->when(!$request->tanggal_mulai || !$request->tanggal_selesai, fn($query) => $query->whereDate('updated_at', Carbon::today()))
                ->when($request->branch_id, fn($query) => $query->where('branch_id', $request->branch_id))
                ->get()
                ->map(fn($list) => [
                    'cabang' => $list->branch->branch_name,
                    'tanggal' => $list->date,
                    'jenis_pengeluaran'=> $list->expenditure->type_of_fee,
                    'biaya' => $list->total_cost,
                    'keterangan' => $list->description
                ])
                ->toArray(),

            "Permintaan Stok" => RequestOrder::query()
                ->with(['branch:id,branch_name', 'listRequestOrder.centerStock.product'])
                ->when($request->tanggal_mulai && $request->tanggal_selesai, fn($query) => $query->whereBetween('updated_at', $dateRange))
                ->when(!$request->tanggal_mulai || !$request->tanggal_selesai, fn($query) => $query->whereDate('updated_at', Carbon::today()))
                ->when($request->branch_id, fn($query) => $query->where('branch_id', $request->branch_id))
                ->get()
                ->flatMap(fn($order) => $order->listRequestOrder->map(fn($list) => [
                    'cabang' => $order->branch->branch_name,
                    'tanggal' => $list->updated_at,
                    'nomor_permintaan' => $order->ro_number,
                    'barang' => $list->centerStock->product->product_name ?? 'N/A',
                    'jumlah' => $list->quantity
                ]))
                ->toArray(),

            "Permintaan Return" => RequestReturn::query()
                ->with(['branch:id,branch_name', 'requestOrder:id,ro_number', 'listRequestReturn.branchProduct.product'])
                ->when($request->tanggal_mulai && $request->tanggal_selesai, fn($query) => $query->whereBetween('updated_at', $dateRange))
                ->when(!$request->tanggal_mulai || !$request->tanggal_selesai, fn($query) => $query->whereDate('updated_at', Carbon::today()))
                ->when($request->branch_id, fn($query) => $query->where('branch_id', $request->branch_id))
                ->get()
                ->flatMap(fn($return) => $return->listRequestReturn->map(fn($list) => [
                    'cabang' => $return->branch->branch_name,
                    'tanggal' => $list->updated_at,
                    'nomor_ro' => $return->requestOrder->ro_number ?? 'N/A',
                    'nomor_return' => $return->request_number,
                    'barang' => $list->branchProduct->product->product_name ?? 'N/A',
                    'jumlah' => $list->quantity
                ]))
                ->toArray(),

            "Pembelian Persediaan" => InventoryPurchase::query()
                ->with(['supplier:id,name', 'listInventoryPurchase.product:id,product_name'])
                ->when($request->tanggal_mulai && $request->tanggal_selesai, fn($query) => $query->whereBetween('updated_at', $dateRange))
                ->when(!$request->tanggal_mulai || !$request->tanggal_selesai, fn($query) => $query->whereDate('updated_at', Carbon::today()))
                ->get()
                ->flatMap(fn($inventory) => $inventory->listInventoryPurchase->map(fn($list) => [
                    'invoice_number' => $inventory->invoice_number,
                    'tanggal' => $inventory->updated_at,
                    'supplier' => $inventory->supplier->name ?? 'N/A',
                    'barang' => $list->product->product_name ?? 'N/A',
                    'harga' => $list->price,
                    'jumlah' => $list->quantity,
                    'total_harga' => $list->total_price
                ]))
                ->toArray(),
            default => []
        };
    }
}
