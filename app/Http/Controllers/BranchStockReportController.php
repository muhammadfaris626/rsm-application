<?php

namespace App\Http\Controllers;

use App\Exports\BranchStockReportExport;
use App\Models\Branch;
use App\Models\ReportBranch;
use App\Services\StockReportService;
use App\Traits\OptimizedQueries;
use Carbon\Carbon;
use Dompdf\Dompdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class BranchStockReportController extends Controller
{
    use OptimizedQueries;

    public function __construct(private readonly StockReportService $reports) {}

    public function index(Request $request): Response
    {
        [$startDate, $endDate, $branchId] = $this->filters($request);
        $rows = $this->reports->branchReport($startDate, $endDate, $branchId);

        return Inertia::render('Managements/Reports/StockReport', [
            'reportType' => 'branch',
            'title' => 'Laporan Barang Cabang',
            'rows' => $rows,
            'filters' => ['start_date' => $startDate->toDateString(), 'end_date' => $endDate->toDateString(), 'branch' => $branchId],
            'branches' => $this->branchesForUser($branchId),
            'totals' => $this->totals($rows),
        ]);
    }

    public function excel(Request $request): BinaryFileResponse
    {
        [$startDate, $endDate, $branchId] = $this->filters($request);
        $rows = $this->reports->branchReport($startDate, $endDate, $branchId);

        return Excel::download(
            new BranchStockReportExport($rows, $this->period($startDate, $endDate), $this->branchName($branchId)),
            'laporan-barang-cabang-'.$startDate->format('Ymd').'-'.$endDate->format('Ymd').'.xlsx'
        );
    }

    public function pdf(Request $request): HttpResponse
    {
        [$startDate, $endDate, $branchId] = $this->filters($request);
        $rows = $this->reports->branchReport($startDate, $endDate, $branchId);

        return $this->pdfResponse('Laporan Barang Cabang', $rows, [
            ['key' => 'initial_stock', 'label' => 'Stok Awal'],
            ['key' => 'additional_stock', 'label' => 'Tambahan Stok'],
            ['key' => 'used_stock', 'label' => 'Terpakai'],
            ['key' => 'damaged_stock', 'label' => 'Rusak'],
            ['key' => 'final_stock', 'label' => 'Stok Akhir'],
        ], $startDate, $endDate, $this->branchName($branchId), 'laporan-barang-cabang');
    }

    private function filters(Request $request): array
    {
        Gate::authorize('viewAny', ReportBranch::class);
        $validated = $request->validate([
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'branch' => ['nullable', 'integer', 'exists:branches,id'],
        ]);
        $startDate = Carbon::parse($validated['start_date'] ?? today()->toDateString())->startOfDay();
        $endDate = Carbon::parse($validated['end_date'] ?? today()->toDateString())->endOfDay();
        $user = Auth::user();
        if ($user->hasRole(['root', 'admin-pusat'])) {
            $branchId = isset($validated['branch']) ? (int) $validated['branch'] : null;
        } else {
            $branchId = $this->getCachedEmployeeByUser($user, true)?->branch_id;
            abort_if(! $branchId, 403, 'Data cabang pengguna tidak ditemukan.');
        }

        return [$startDate, $endDate, $branchId];
    }

    private function branchesForUser(?int $branchId)
    {
        if (Auth::user()->hasRole(['root', 'admin-pusat'])) {
            return Branch::query()->select('id', 'branch_name')->where('status', 'Aktif')->orderBy('branch_name')->get();
        }

        return Branch::query()->select('id', 'branch_name')->when($branchId, fn ($query) => $query->whereKey($branchId))->get();
    }

    private function branchName(?int $branchId): string
    {
        return $branchId ? (Branch::find($branchId)?->branch_name ?? '-') : 'Semua Cabang';
    }

    private function period(Carbon $startDate, Carbon $endDate): string
    {
        return $startDate->format('d-m-Y').' s/d '.$endDate->format('d-m-Y');
    }

    private function totals($rows): array
    {
        return collect(['initial_stock', 'additional_stock', 'used_stock', 'damaged_stock', 'final_stock'])
            ->mapWithKeys(fn ($key) => [$key => (int) $rows->sum($key)])->all();
    }

    private function pdfResponse(string $title, $rows, array $stockColumns, Carbon $startDate, Carbon $endDate, string $branchName, string $filename): HttpResponse
    {
        $dompdf = new Dompdf(['isRemoteEnabled' => false]);
        $dompdf->loadHtml(view('reports.stock-report', [
            'title' => $title, 'rows' => $rows, 'stockColumns' => $stockColumns,
            'period' => $this->period($startDate, $endDate), 'branchName' => $branchName,
            'isBranch' => true, 'totals' => $this->totals($rows),
        ])->render());
        $dompdf->setPaper('a4', 'landscape');
        $dompdf->render();

        return response($dompdf->output(), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="'.$filename.'-'.$startDate->format('Ymd').'-'.$endDate->format('Ymd').'.pdf"',
        ]);
    }
}
