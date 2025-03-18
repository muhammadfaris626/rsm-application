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
use App\Models\OperationalBranch;
use App\Models\Report;
use App\Models\RequestOrder;
use App\Models\RequestReturn;
use App\Models\Sale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;
use Maatwebsite\Excel\Facades\Excel;

class ReportController extends Controller {

    public function index(Request $request): Response {
        Gate::authorize('viewAny', Report::class);
        $sales = Sale::query()
            ->when($request->start_date && $request->end_date, function($query) use($request) {
                $query->whereBetween('updated_at', [
                    Carbon::parse($request->start_date)->startOfDay(),
                    Carbon::parse($request->end_date)->endOfDay(),
                ]);
            }, function($query) {
                $query->whereDate('updated_at', Carbon::today());
            })
            ->when($request->branch, function($query) use($request) {
                $query->where('branch_id', $request->branch);
            })
            ->get()
            ->map(function ($sale) {
                return [
                    'total_price' => $sale->listSale->sum('total_price'),
                    'date' => Carbon::parse($sale->updated_at)->timezone('Asia/Makassar')->format('Y-m-d\TH:i:s.v\Z'),
                ];
            });
        $expenditures = OperationalBranch::query()
            ->when($request->start_date && $request->end_date, function($query) use($request) {
                $query->whereBetween('updated_at', [
                    Carbon::parse($request->start_date)->startOfDay(),
                    Carbon::parse($request->end_date)->endOfDay(),
                ]);
            }, function($query) {
                $query->whereDate('updated_at', Carbon::today());
            })
            ->when($request->branch, function($query) use($request) {
                $query->where('branch_id', $request->branch);
            })
            ->get()
            ->map(function ($expenditure) {
                return [
                    'total_cost' => $expenditure->total_cost,
                    'date' => Carbon::parse($expenditure->updated_at)->timezone('Asia/Makassar')->format('Y-m-d\TH:i:s.v\Z'),
                ];
            });
        $purchases = InventoryPurchase::query()
            ->when($request->start_date && $request->end_date, function($query) use($request) {
                $query->whereBetween('updated_at', [
                    Carbon::parse($request->start_date)->startOfDay(),
                    Carbon::parse($request->end_date)->endOfDay(),
                ]);
            }, function($query) {
                $query->whereDate('updated_at', Carbon::today());
            })
            ->get()
            ->map(function ($purchase) {
                return [
                    'total_price' => $purchase->listInventoryPurchase->sum('total_price')
                ];
            });
        $orders = RequestOrder::query()
            ->when($request->start_date && $request->end_date, function($query) use($request) {
                $query->whereBetween('updated_at', [
                    Carbon::parse($request->start_date)->startOfDay(),
                    Carbon::parse($request->end_date)->endOfDay(),
                ]);
            }, function($query) {
                $query->whereDate('updated_at', Carbon::today());
            })
            ->when($request->branch, function($query) use($request) {
                $query->where('branch_id', $request->branch);
            })
            ->get()
            ->map(function ($order) {
                return [
                    'total' => $order->listRequestOrder->sum('quantity')
                ];
            });
        $returns = RequestReturn::query()
            ->when($request->start_date && $request->end_date, function($query) use($request) {
                $query->whereBetween('updated_at', [
                    Carbon::parse($request->start_date)->startOfDay(),
                    Carbon::parse($request->end_date)->endOfDay(),
                ]);
            }, function($query) {
                $query->whereDate('updated_at', Carbon::today());
            })
            ->when($request->branch, function($query) use($request) {
                $query->where('branch_id', $request->branch);
            })
            ->get()
            ->map(function ($return) {
                return [
                    'total' => $return->listRequestReturn->sum('quantity')
                ];
            });
        $months = [
            'Jan' => 0,
            'Feb' => 0,
            'Mar' => 0,
            'Apr' => 0,
            'Mei' => 0,
            'Jun' => 0,
            'Jul' => 0,
            'Aug' => 0,
            'Sep' => 0,
            'Okt' => 0,
            'Nov' => 0,
            'Des' => 0
        ];
        $penjualanTahunan = Sale::query()->when($request->branch, function($query) use($request) {
            $query->where('branch_id', $request->branch);
        })->with('listSale')->get();
        foreach ($penjualanTahunan as $tahunan) {
            $month = Carbon::parse($tahunan->created_at)->format('M');
            $mapBulan = [
                'Jan' => 'Jan', 'Feb' => 'Feb', 'Mar' => 'Mar', 'Apr' => 'Apr',
                'May' => 'Mei', 'Jun' => 'Jun', 'Jul' => 'Jul', 'Aug' => 'Aug',
                'Sep' => 'Sep', 'Oct' => 'Okt', 'Nov' => 'Nov', 'Dec' => 'Des'
            ];
            if (isset($mapBulan[$month])) {
                $bulanFormatted = $mapBulan[$month];
                $months[$bulanFormatted] += $tahunan->listSale->sum('total_price');
            }
        }
        $topPenjualan = Branch::leftJoinSub(
            Sale::leftJoin('list_sales', 'sales.id', '=', 'list_sales.sale_id')
                ->selectRaw('sales.branch_id, COALESCE(SUM(list_sales.total_price), 0) as total_sales')
                ->groupBy('sales.branch_id'),
            'sales_summary',
            'branches.id',
            '=',
            'sales_summary.branch_id'
        )
        ->select('branches.id as branch_id', 'branches.branch_name as branch_name', 'sales_summary.total_sales')
        ->orderByDesc('sales_summary.total_sales')
        ->get();

        $allData = Branch::query()
            ->get()
            ->map(function ($data) {
                return [
                    'branch_name' => $data->branch_name,
                    'omzet' => $data->sale->flatMap->listSale->sum('total_price'),
                    'pengeluaran' => $data->operationalBranch->sum('total_cost'),
                    'permintaan_pesanan' => $data->requestOrder
                ];
            });
        return Inertia::render('Managements/Reports/IndexReport', [
            'branches' => BranchResource::collection(Branch::all()),
            'sales' => $sales,
            'expenditures' => $expenditures,
            'purchases' => $purchases,
            'orders' => $orders,
            'returns' => $returns,
            'selectBranch' => $request->selectBranch ?? 'CABANG',
            'penjualanTahunan' => $months,
            'topPenjualan' => $topPenjualan,
            'allData' => $allData
        ]);
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
        if ($request->pilihan == 'Omzet') {
            return Excel::download(new OmzetExport($data), now() . '-omzet.xlsx');
        } elseif ($request->pilihan == 'Pengeluaran') {
            return Excel::download(new PengeluaranExport($data), now() . '-pengeluaran.xlsx');
        } elseif ($request->pilihan == 'Pembelian Persediaan') {
            return Excel::download(new PembelianPersediaanExport($data), now() . '-pembelian-persediaan.xlsx');
        } elseif ($request->pilihan == 'Permintaan Stok') {
            return Excel::download(new PermintaanStokExport($data), now() . '-permintaan-stok.xlsx');
        } elseif ($request->pilihan == 'Permintaan Return') {
            return Excel::download(new PermintaanReturnExport($data), now() . '-permintaan-return.xlsx');
        }
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
                ->with(['branch', 'expenditure'])
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
                ->with(['listRequestOrder.centerStock.product'])
                ->when($request->tanggal_mulai && $request->tanggal_selesai, fn($query) => $query->whereBetween('updated_at', $dateRange))
                ->when(!$request->tanggal_mulai || !$request->tanggal_selesai, fn($query) => $query->whereDate('updated_at', Carbon::today()))
                ->when($request->branch_id, fn($query) => $query->where('branch_id', $request->branch_id))
                ->get()
                ->flatMap(fn($order) => $order->listRequestOrder->map(fn($list) => [
                    'cabang' => $order->branch->branch_name,
                    'tanggal' => $list->updated_at,
                    'nomor_permintaan' => $order->ro_number,
                    'barang' => $list->centerStock->product->product_name,
                    'jumlah' => $list->quantity
                ]))
                ->toArray(),

            "Permintaan Return" => RequestReturn::query()
                ->with(['listRequestReturn.branchProduct.product'])
                ->when($request->tanggal_mulai && $request->tanggal_selesai, fn($query) => $query->whereBetween('updated_at', $dateRange))
                ->when(!$request->tanggal_mulai || !$request->tanggal_selesai, fn($query) => $query->whereDate('updated_at', Carbon::today()))
                ->when($request->branch_id, fn($query) => $query->where('branch_id', $request->branch_id))
                ->get()
                ->flatMap(fn($return) => $return->listRequestReturn->map(fn($list) => [
                    'cabang' => $return->branch->branch_name,
                    'tanggal' => $list->updated_at,
                    'nomor_ro' => $return->requestOrder->ro_number,
                    'nomor_return' => $return->request_number,
                    'barang' => $list->branchProduct->product->product_name,
                    'jumlah' => $list->quantity
                ]))
                ->toArray(),

            "Pembelian Persediaan" => InventoryPurchase::query()
                ->when($request->tanggal_mulai && $request->tanggal_selesai, fn($query) => $query->whereBetween('updated_at', $dateRange))
                ->when(!$request->tanggal_mulai || !$request->tanggal_selesai, fn($query) => $query->whereDate('updated_at', Carbon::today()))
                ->get()
                ->flatMap(fn($inventory) => $inventory->listInventoryPurchase->map(fn($list) => [
                    'invoice_number' => $inventory->invoice_number,
                    'tanggal' => $inventory->updated_at,
                    'supplier' => $inventory->supplier->name,
                    'barang' => $list->product->product_name,
                    'harga' => $list->price,
                    'jumlah' => $list->quantity,
                    'total_harga' => $list->total_price
                ]))
                ->toArray(),
            default => []
        };
    }

}
