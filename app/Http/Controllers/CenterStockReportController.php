<?php

namespace App\Http\Controllers;

use App\Exports\CenterStockReportExport;
use App\Models\Report;
use App\Services\StockReportService;
use Carbon\Carbon;
use Dompdf\Dompdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class CenterStockReportController extends Controller
{
    public function __construct(private readonly StockReportService $reports) {}

    public function index(Request $request): Response
    {
        [$startDate, $endDate] = $this->filters($request);
        $rows = $this->reports->centerReport($startDate, $endDate);

        return Inertia::render('Managements/Reports/StockReport', [
            'reportType' => 'center',
            'title' => 'Laporan Barang Pusat',
            'rows' => $rows,
            'filters' => ['start_date' => $startDate->toDateString(), 'end_date' => $endDate->toDateString()],
            'branches' => [],
            'totals' => $this->totals($rows),
        ]);
    }

    public function excel(Request $request): BinaryFileResponse
    {
        [$startDate, $endDate] = $this->filters($request);
        $rows = $this->reports->centerReport($startDate, $endDate);

        return Excel::download(new CenterStockReportExport($rows, $this->period($startDate, $endDate)),
            'laporan-barang-pusat-'.$startDate->format('Ymd').'-'.$endDate->format('Ymd').'.xlsx');
    }

    public function pdf(Request $request): HttpResponse
    {
        [$startDate, $endDate] = $this->filters($request);
        $rows = $this->reports->centerReport($startDate, $endDate);
        $dompdf = new Dompdf(['isRemoteEnabled' => false]);
        $dompdf->loadHtml(view('reports.stock-report', [
            'title' => 'Laporan Barang Pusat', 'rows' => $rows,
            'stockColumns' => [
                ['key' => 'initial_stock', 'label' => 'Stok Awal'],
                ['key' => 'purchased_stock', 'label' => 'Pembelian'],
                ['key' => 'final_stock', 'label' => 'Stok Akhir'],
            ],
            'period' => $this->period($startDate, $endDate), 'branchName' => null,
            'isBranch' => false, 'totals' => $this->totals($rows),
        ])->render());
        $dompdf->setPaper('a4', 'landscape');
        $dompdf->render();

        return response($dompdf->output(), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="laporan-barang-pusat-'.$startDate->format('Ymd').'-'.$endDate->format('Ymd').'.pdf"',
        ]);
    }

    private function filters(Request $request): array
    {
        Gate::authorize('viewAny', Report::class);
        $validated = $request->validate([
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
        ]);

        return [
            Carbon::parse($validated['start_date'] ?? today()->toDateString())->startOfDay(),
            Carbon::parse($validated['end_date'] ?? today()->toDateString())->endOfDay(),
        ];
    }

    private function period(Carbon $startDate, Carbon $endDate): string
    {
        return $startDate->format('d-m-Y').' s/d '.$endDate->format('d-m-Y');
    }

    private function totals($rows): array
    {
        return collect(['initial_stock', 'purchased_stock', 'final_stock'])
            ->mapWithKeys(fn ($key) => [$key => (int) $rows->sum($key)])->all();
    }
}
