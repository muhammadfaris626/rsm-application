<?php

namespace App\Exports;

use App\Models\OperationalBranch;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Events\AfterSheet;
use Maatwebsite\Excel\Events\BeforeSheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

class PengeluaranExport implements FromCollection, WithEvents
{
    protected $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function collection()
    {
        $dateRange = [
            Carbon::parse($this->data['mulai'])->startOfDay(),
            Carbon::parse($this->data['selesai'])->endOfDay()
        ];

        $data = OperationalBranch::query()
            ->with(['branch', 'expenditure'])
            ->when($this->data['mulai'] && $this->data['selesai'], fn($query) => $query->whereBetween('updated_at', $dateRange))
            ->when(!$this->data['mulai'] || !$this->data['selesai'], fn($query) => $query->whereDate('updated_at', Carbon::today()))
            ->when($this->data['branch'], fn($query) => $query->where('branch_id', $this->data['branch']))
            ->get()
            ->map(fn($sale, $index) => [
                'nomor' => $index + 1,
                'cabang' => $sale->branch->branch_name,
                'tanggal' => $sale->updated_at->format('d-m-Y'),
                'jenis_biaya' => $sale->expenditure->type_of_fee,
                'nomimal' => $sale->total_cost,
                'keterangan' => $sale->description
            ])
            ->toArray();

        $emptyRows = collect([
            ['', '', $this->data['pilihan']],
            ['', '', $this->data['cabang']],
            ['', '', $this->data['mulai']],
            ['', '', $this->data['selesai']],
            [''],
            ['']
        ]);

        return $emptyRows->concat($data);
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();

                // **Menggabungkan Kolom A dan B di Baris 1**
                $sheet->mergeCells('A1:B1');

                // **Menambahkan teks di sel yang digabungkan**
                $sheet->setCellValue('A1', 'Jenis Laporan');
                $sheet->setCellValue('A2', 'Nama Cabang');
                $sheet->setCellValue('A3', 'Dari Tanggal');
                $sheet->setCellValue('A4', 'Sampai Tanggal');

                // **Tambahkan heading di baris ke-6**
                $headings = ['No', 'Cabang', 'Tanggal', 'Jenis Biaya', 'Nominal', 'Keterangan'];
                $sheet->fromArray($headings, null, 'A6');

                // **Auto size semua kolom dari A sampai G**
                foreach (range('B', 'G') as $column) {
                    $sheet->getColumnDimension($column)->setAutoSize(true);
                }
                $sheet->getStyle('A6:G6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
                $sheet->getStyle('A7:A1000')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
                $sheet->getStyle('E7:E1000')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

                // **Menghitung jumlah baris data**
                $dataRowCount = count($this->collection()) + 6; // +6 untuk heading dan empty rows

                // **Menambahkan border pada sel dari A6 sampai G{dataRowCount}**
                $sheet->getStyle("A6:F{$dataRowCount}")->applyFromArray([
                    'borders' => [
                        'allBorders' => [
                            'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                            'color' => ['argb' => '000000'],
                        ],
                    ],
                ]);
                // **Menambahkan bold pada header**
                $sheet->getStyle('A6:F6')->applyFromArray([
                    'font' => [
                        'bold' => true,
                    ],
                ]);
                $sheet->getStyle('A1:B4')->applyFromArray([
                    'font' => [
                        'bold' => true,
                    ],
                ]);
            },
        ];
    }
}
