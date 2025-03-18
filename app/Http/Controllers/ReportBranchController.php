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
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;
use Maatwebsite\Excel\Facades\Excel;

class ReportBranchController extends Controller
{
    public function index(Request $request): Response {
        Gate::authorize('viewAny', ReportBranch::class);
        $employee = Employee::where('employee_number', Auth::user()->username)->first();
        $sales = Sale::query()
            ->where('branch_id', $employee->branch_id)
            ->when($request->start_date && $request->end_date, function($query) use($request) {
                $query->whereBetween('updated_at', [
                    Carbon::parse($request->start_date)->startOfDay(),
                    Carbon::parse($request->end_date)->endOfDay(),
                ]);
            }, function($query) {
                $query->whereDate('updated_at', Carbon::today());
            })
            ->get()
            ->map(function ($sale) {
                return [
                    'total_price' => $sale->listSale->sum('total_price'),
                    'date' => Carbon::parse($sale->updated_at)->timezone('Asia/Makassar')->format('Y-m-d\TH:i:s.v\Z'),
                ];
            });
        $expenditures = OperationalBranch::query()
            ->where('branch_id', $employee->branch_id)
            ->when($request->start_date && $request->end_date, function($query) use($request) {
                $query->whereBetween('updated_at', [
                    Carbon::parse($request->start_date)->startOfDay(),
                    Carbon::parse($request->end_date)->endOfDay(),
                ]);
            }, function($query) {
                $query->whereDate('updated_at', Carbon::today());
            })
            ->get()
            ->map(function ($expenditure) {
                return [
                    'total_cost' => $expenditure->total_cost,
                    'date' => Carbon::parse($expenditure->updated_at)->timezone('Asia/Makassar')->format('Y-m-d\TH:i:s.v\Z'),
                ];
            });
        $orders = RequestOrder::query()
            ->where('branch_id', $employee->branch_id)
            ->when($request->start_date && $request->end_date, function($query) use($request) {
                $query->whereBetween('updated_at', [
                    Carbon::parse($request->start_date)->startOfDay(),
                    Carbon::parse($request->end_date)->endOfDay(),
                ]);
            }, function($query) {
                $query->whereDate('updated_at', Carbon::today());
            })
            ->get()
            ->map(function ($order) {
                return [
                    'total' => $order->listRequestOrder->sum('quantity')
                ];
            });
        $returns = RequestReturn::query()
            ->where('branch_id', $employee->branch_id)
            ->when($request->start_date && $request->end_date, function($query) use($request) {
                $query->whereBetween('updated_at', [
                    Carbon::parse($request->start_date)->startOfDay(),
                    Carbon::parse($request->end_date)->endOfDay()
                ]);
            }, function($query) {
                $query->whereDate('updated_at', Carbon::today());
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
        $penjualanTahunan = Sale::query()->where('branch_id', $employee->branch_id)->with('listSale')->get();
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
        return Inertia::render('Managements/Reports/IndexReportBranch', [
            'cabangSendiri' => BranchResource::collection(Branch::where('id', $employee->branch_id)->get()),
            'sales' => $sales,
            'expenditures' => $expenditures,
            'orders' => $orders,
            'returns' => $returns,
            'selectBranch' => $request->selectBranch ?? 'CABANG',
            'penjualanTahunan' => $months,
        ]);
    }

    public function cetak(Request $request): Response {
        $employee = Employee::where('employee_number', Auth::user()->username)->first();
        $branch = Branch::find($employee->branch_id)?->branch_name;
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
        $employee = Employee::where('employee_number', Auth::user()->username)->first();
        $branch = Branch::find($employee->branch_id)?->branch_name;
        $tanggalMulai = $request->tanggal_mulai ? Carbon::parse($request->tanggal_mulai)->format('d-m-Y') : now()->format('d-m-Y');
        $tanggalSelesai = $request->tanggal_selesai ? Carbon::parse($request->tanggal_selesai)->format('d-m-Y') : now()->format('d-m-Y');
        $data = [
            'pilihan' => $request->pilihan,
            'branch' => $employee->branch_id,
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
        $employee = Employee::where('employee_number', Auth::user()->username)->first();
        return match ($request->pilihan) {
            "Omzet" => Sale::query()
                ->where('branch_id', $employee->branch_id)
                ->with(['listSale.branchProduct.product', 'listSale.branchProduct.branch'])
                ->when($request->tanggal_mulai && $request->tanggal_selesai, fn($query) => $query->whereBetween('updated_at', $dateRange))
                ->when(!$request->tanggal_mulai || !$request->tanggal_selesai, fn($query) => $query->whereDate('updated_at', Carbon::today()))
                ->get()
                ->flatMap(fn($sale) => $sale->listSale)
                ->toArray(),

            "Pengeluaran" => OperationalBranch::query()
                ->where('branch_id', $employee->branch_id)
                ->with(['branch', 'expenditure'])
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
                ->where('branch_id', $employee->branch_id)
                ->with(['listRequestOrder.product'])
                ->when($request->tanggal_mulai && $request->tanggal_selesai, fn($query) => $query->whereBetween('updated_at', $dateRange))
                ->when(!$request->tanggal_mulai || !$request->tanggal_selesai, fn($query) => $query->whereDate('updated_at', Carbon::today()))
                ->get()
                ->flatMap(fn($order) => $order->listRequestOrder->map(fn($list) => [
                    'cabang' => $order->branch->branch_name,
                    'tanggal' => $list->updated_at,
                    'nomor_permintaan' => $order->ro_number,
                    'barang' => $list->product->product_name,
                    'jumlah' => $list->quantity
                ]))
                ->toArray(),

            "Permintaan Return" => RequestReturn::query()
                ->where('branch_id', $employee->branch_id)
                ->with(['listRequestReturn.branchProduct.product'])
                ->when($request->tanggal_mulai && $request->tanggal_selesai, fn($query) => $query->whereBetween('updated_at', $dateRange))
                ->when(!$request->tanggal_mulai || !$request->tanggal_selesai, fn($query) => $query->whereDate('updated_at', Carbon::today()))
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
            default => []
        };
    }
}
