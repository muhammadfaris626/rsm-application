<?php

namespace App\Exports;

use App\Models\RequestReturn;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Events\AfterSheet;
use Maatwebsite\Excel\Events\BeforeSheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

class PermintaanReturnExport implements FromCollection, WithEvents
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

        $data = RequestReturn::query()
            ->with(['listRequestReturn.branchProduct.product'])
            ->when($this->data['mulai'] && $this->data['selesai'], fn($query) => $query->whereBetween('updated_at', $dateRange))
            ->when(!$this->data['mulai'] || !$this->data['selesai'], fn($query) => $query->whereDate('updated_at', Carbon::today()))
            ->when($this->data['branch'], fn($query) => $query->where('branch_id', $this->data['branch']))
            ->get()
            ->flatMap(fn($return) => $return->listRequestReturn->map(fn($list, $index) => [
                'nomor' => $index + 1,
                'cabang' => $return->branch->branch_name,
                'tanggal' => $list->updated_at,
                'nomor_ro' => $return->requestOrder->ro_number,
                'nomor_return' => $return->request_number,
                'kategori_barang' => $list->branchProduct->product->productCategory->product_category_name,
                'barang' => $list->branchProduct->product->product_name,
                'jumlah' => $list->quantity
            ]))->toArray();

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

    public function registerEvents(): array {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();
                $sheet->mergeCells('A1:B1');
                $sheet->setCellValue('A1', 'Jenis Laporan');
                $sheet->setCellValue('A2', 'Nama Cabang');
                $sheet->setCellValue('A3', 'Dari Tanggal');
                $sheet->setCellValue('A4', 'Sampai Tanggal');

                $headings = ['No', 'Cabang', 'Tanggal', 'Nomor RO', 'Nomor Return', 'Kategori Barang', 'Barang', 'Jumlah'];
                $sheet->fromArray($headings, null, 'A6');

                foreach (range('B', 'H') as $column) {
                    $sheet->getColumnDimension($column)->setAutoSize(true);
                }
                $sheet->getStyle('A6:H6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
                $sheet->getStyle('A7:A1000')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
                $sheet->getStyle('H7:H1000')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

                $dataRowCount = count($this->collection()) + 6;

                $sheet->getStyle("A6:H{$dataRowCount}")->applyFromArray([
                    'borders' => [
                        'allBorders' => [
                            'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                            'color' => ['argb' => '000000'],
                        ],
                    ]
                ]);
                // **Menambahkan bold pada header**
                $sheet->getStyle('A6:H6')->applyFromArray([
                    'font' => [
                        'bold' => true,
                    ],
                ]);
                $sheet->getStyle('A1:B4')->applyFromArray([
                    'font' => [
                        'bold' => true,
                    ],
                ]);
            }
        ];
    }
}
