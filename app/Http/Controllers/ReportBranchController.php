<?php

namespace App\Http\Controllers;

use App\Exports\OmzetExport;
use App\Exports\PembelianPersediaanExport;
use App\Exports\PengeluaranExport;
use App\Exports\PermintaanReturnExport;
use App\Exports\PermintaanStokExport;
use App\Http\Resources\BranchResource;
use App\Models\Branch;
use App\Models\Employee;
use App\Models\InventoryPurchase;
use App\Models\OperationalBranch;
use App\Models\ReportBranch;
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

class ReportBranchController extends Controller
{
    use OptimizedQueries;

    private function emptyYearlySales(): array {
        return [
            'Jan' => 0, 'Feb' => 0, 'Mar' => 0, 'Apr' => 0,
            'Mei' => 0, 'Jun' => 0, 'Jul' => 0, 'Aug' => 0,
            'Sep' => 0, 'Okt' => 0, 'Nov' => 0, 'Des' => 0
        ];
    }

    private function selectedBranchId($requestedBranchId = null): ?int {
        $user = Auth::user();

        if ($user->hasRole(['root', 'admin-pusat'])) {
            if ($requestedBranchId && Branch::where('id', $requestedBranchId)->exists()) {
                return (int) $requestedBranchId;
            }

            return Branch::where('status', 'Aktif')->value('id');
        }

        return $this->getCachedEmployee($user->username, true)?->branch_id;
    }

    private function branchesForUser(?int $branchId) {
        $user = Auth::user();

        if ($user->hasRole(['root', 'admin-pusat'])) {
            return $this->getCachedActiveBranches();
        }

        return $branchId
            ? Branch::select('id', 'branch_code', 'branch_name', 'status')->where('id', $branchId)->get()
            : collect();
    }

    public function index(Request $request): Response {
        Gate::authorize('viewAny', ReportBranch::class);
        
        $branchId = $this->selectedBranchId($request->branch);
        
        $startDate = $request->start_date 
            ? Carbon::parse($request->start_date)->startOfDay() 
            : Carbon::today()->startOfDay();
        $endDate = $request->end_date 
            ? Carbon::parse($request->end_date)->endOfDay() 
            : Carbon::today()->endOfDay();

        if (!$branchId) {
            return Inertia::render('Managements/Reports/IndexReportBranch', [
                'cabangSendiri' => BranchResource::collection(collect()),
                'sales' => collect(),
                'expenditures' => collect(),
                'orders' => collect(),
                'returns' => collect(),
                'selectBranch' => $request->selectBranch ?? 'CABANG',
                'selectedBranch' => null,
                'penjualanTahunan' => $this->emptyYearlySales(),
            ]);
        }
        
        // Optimized: Use withSum instead of map + sum
        $sales = Sale::query()
            ->select('id', 'branch_id', 'updated_at')
            ->withSum('listSale', 'total_price')
            ->where('branch_id', $branchId)
            ->whereBetween('updated_at', [$startDate, $endDate])
            ->get()
            ->map(fn($sale) => [
                'total_price' => $sale->list_sale_sum_total_price ?? 0,
                'date' => Carbon::parse($sale->updated_at)->timezone('Asia/Makassar')->format('Y-m-d\TH:i:s.v\Z'),
            ]);
        
        $expenditures = OperationalBranch::query()
            ->select('id', 'branch_id', 'total_cost', 'updated_at')
            ->where('branch_id', $branchId)
            ->whereBetween('updated_at', [$startDate, $endDate])
            ->get()
            ->map(fn($exp) => [
                'total_cost' => $exp->total_cost,
                'date' => Carbon::parse($exp->updated_at)->timezone('Asia/Makassar')->format('Y-m-d\TH:i:s.v\Z'),
            ]);
        
        // Optimized: Use withSum
        $orders = RequestOrder::query()
            ->select('id', 'branch_id', 'updated_at')
            ->withSum('listRequestOrder', 'quantity')
            ->where('branch_id', $branchId)
            ->whereBetween('updated_at', [$startDate, $endDate])
            ->get()
            ->map(fn($o) => ['total' => $o->list_request_order_sum_quantity ?? 0]);
        
        // Optimized: Use withSum
        $returns = RequestReturn::query()
            ->select('id', 'branch_id', 'updated_at')
            ->withSum('listRequestReturn', 'quantity')
            ->where('branch_id', $branchId)
            ->whereBetween('updated_at', [$startDate, $endDate])
            ->get()
            ->map(fn($r) => ['total' => $r->list_request_return_sum_quantity ?? 0]);
        
        // Optimized: Calculate yearly sales with DB aggregate for branch
        $penjualanTahunan = $this->getYearlySalesForBranch($branchId);
        
        $cabangSendiri = $this->branchesForUser($branchId);
        
        return Inertia::render('Managements/Reports/IndexReportBranch', [
            'cabangSendiri' => BranchResource::collection($cabangSendiri),
            'sales' => $sales,
            'expenditures' => $expenditures,
            'orders' => $orders,
            'returns' => $returns,
            'selectBranch' => $request->selectBranch ?? 'CABANG',
            'selectedBranch' => $branchId,
            'penjualanTahunan' => $penjualanTahunan,
        ]);
    }

    private function getYearlySalesForBranch(?int $branchId): array {
        $months = $this->emptyYearlySales();
        if (!$branchId) {
            return $months;
        }
        
        $monthMap = [
            1 => 'Jan', 2 => 'Feb', 3 => 'Mar', 4 => 'Apr',
            5 => 'Mei', 6 => 'Jun', 7 => 'Jul', 8 => 'Aug',
            9 => 'Sep', 10 => 'Okt', 11 => 'Nov', 12 => 'Des'
        ];
        
        // Single optimized query using DB aggregate
        $salesByMonth = DB::table('sales')
            ->join('list_sales', 'sales.id', '=', 'list_sales.sale_id')
            ->select(DB::raw('MONTH(sales.created_at) as month'), DB::raw('SUM(list_sales.total_price) as total'))
            ->where('sales.branch_id', $branchId)
            ->whereYear('sales.created_at', Carbon::now()->year)
            ->groupBy(DB::raw('MONTH(sales.created_at)'))
            ->get();
        
        foreach ($salesByMonth as $row) {
            if (isset($monthMap[$row->month])) {
                $months[$monthMap[$row->month]] = $row->total;
            }
        }
        
        return $months;
    }

    public function cetak(Request $request): Response {
        $branchId = $this->selectedBranchId($request->branch_id);
        $branch = Branch::find($branchId)?->branch_name;
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
        $branchId = $this->selectedBranchId($request->branch_id);
        if (!$branchId) {
            Session::flash('toast', ['message' => 'Cabang laporan tidak ditemukan.', 'type' => 'error']);
            return back();
        }

        $branch = Branch::find($branchId)?->branch_name;
        $tanggalMulai = $request->tanggal_mulai ? Carbon::parse($request->tanggal_mulai)->format('d-m-Y') : now()->format('d-m-Y');
        $tanggalSelesai = $request->tanggal_selesai ? Carbon::parse($request->tanggal_selesai)->format('d-m-Y') : now()->format('d-m-Y');
        $data = [
            'pilihan' => $request->pilihan,
            'branch' => $branchId,
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
        
        $branchId = $this->selectedBranchId($request->branch_id);
        if (!$branchId) {
            return [];
        }
        
        return match ($request->pilihan) {
            "Omzet" => Sale::query()
                ->where('branch_id', $branchId)
                ->with(['listSale.branchProduct.product', 'listSale.branchProduct.branch'])
                ->when($request->tanggal_mulai && $request->tanggal_selesai, fn($query) => $query->whereBetween('updated_at', $dateRange))
                ->when(!$request->tanggal_mulai || !$request->tanggal_selesai, fn($query) => $query->whereDate('updated_at', Carbon::today()))
                ->get()
                ->flatMap(fn($sale) => $sale->listSale)
                ->toArray(),

            "Pengeluaran" => OperationalBranch::query()
                ->where('branch_id', $branchId)
                ->with(['branch:id,branch_name', 'expenditure:id,type_of_fee'])
                ->when($request->tanggal_mulai && $request->tanggal_selesai, fn($query) => $query->whereBetween('updated_at', $dateRange))
                ->when(!$request->tanggal_mulai || !$request->tanggal_selesai, fn($query) => $query->whereDate('updated_at', Carbon::today()))
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
                ->where('branch_id', $branchId)
                ->with(['branch:id,branch_name', 'listRequestOrder.centerStock.product'])
                ->when($request->tanggal_mulai && $request->tanggal_selesai, fn($query) => $query->whereBetween('updated_at', $dateRange))
                ->when(!$request->tanggal_mulai || !$request->tanggal_selesai, fn($query) => $query->whereDate('updated_at', Carbon::today()))
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
                ->where('branch_id', $branchId)
                ->with(['branch:id,branch_name', 'requestOrder:id,ro_number', 'listRequestReturn.branchProduct.product'])
                ->when($request->tanggal_mulai && $request->tanggal_selesai, fn($query) => $query->whereBetween('updated_at', $dateRange))
                ->when(!$request->tanggal_mulai || !$request->tanggal_selesai, fn($query) => $query->whereDate('updated_at', Carbon::today()))
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
            default => []
        };
    }
}
