<?php

namespace App\Exports;

use Carbon\Carbon;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithCustomValueBinder;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithStrictNullComparison;
use Maatwebsite\Excel\DefaultValueBinder;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Cell\Cell;
use PhpOffice\PhpSpreadsheet\Cell\DataType;
use PhpOffice\PhpSpreadsheet\Shared\Date;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\PageSetup;

class BranchStockReportExport extends DefaultValueBinder implements FromArray, WithCustomValueBinder, WithEvents, WithStrictNullComparison
{
    public function __construct(
        private readonly Collection $rows,
        private readonly string $period,
        private readonly string $branchName,
    ) {}

    public function bindValue(Cell $cell, $value): bool
    {
        $totalRow = $this->rows->count() + 6;
        if (is_string($value) && str_starts_with($value, '=') && $cell->getRow() === $totalRow) {
            return parent::bindValue($cell, $value);
        }
        if (in_array($cell->getColumn(), ['A', 'B', 'G', 'H', 'I', 'J', 'K'], true) && is_numeric($value)) {
            $cell->setValueExplicit((int) $value, DataType::TYPE_NUMERIC);

            return true;
        }
        if (is_string($value)) {
            $cell->setValueExplicit($value, DataType::TYPE_STRING);

            return true;
        }

        return parent::bindValue($cell, $value);
    }

    public function array(): array
    {
        $data = [
            ['LAPORAN BARANG CABANG'],
            ['Periode', $this->period],
            ['Cabang', $this->branchName],
            [''],
            ['No', 'Tanggal', 'No. Permintaan', 'Cabang', 'Kategori', 'Barang', 'Stok Awal', 'Tambahan Stok', 'Terpakai', 'Rusak', 'Stok Akhir'],
        ];

        foreach ($this->rows as $index => $row) {
            $data[] = [
                $index + 1,
                Date::dateTimeToExcel(Carbon::parse($row['date'])),
                $row['reference'],
                $row['branch'],
                $row['category'],
                $row['product'],
                $row['initial_stock'],
                $row['additional_stock'],
                $row['used_stock'],
                $row['damaged_stock'],
                $row['final_stock'],
            ];
        }

        $totalRow = count($data) + 1;
        $firstDataRow = 6;
        $lastDataRow = $totalRow - 1;
        $formula = fn (string $column) => $this->rows->isEmpty() ? '=0' : "=SUM({$column}{$firstDataRow}:{$column}{$lastDataRow})";
        $data[] = ['', '', '', '', '', 'TOTAL',
            $formula('G'), $formula('H'), $formula('I'), $formula('J'), $formula('K'),
        ];

        return $data;
    }

    public function registerEvents(): array
    {
        return [AfterSheet::class => function (AfterSheet $event): void {
            $sheet = $event->sheet->getDelegate();
            $lastRow = $sheet->getHighestDataRow();
            $sheet->mergeCells('A1:K1');
            $sheet->freezePane('A6');
            $sheet->setAutoFilter('A5:K'.max(5, $lastRow - 1));
            $sheet->getPageSetup()->setOrientation(PageSetup::ORIENTATION_LANDSCAPE)->setFitToWidth(1)->setFitToHeight(0);
            $sheet->getPageMargins()->setTop(0.4)->setRight(0.3)->setBottom(0.4)->setLeft(0.3);
            $sheet->getStyle('A1:K1')->applyFromArray([
                'font' => ['bold' => true, 'size' => 16, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '1D4ED8']],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
            ]);
            $sheet->getStyle('A5:K5')->applyFromArray([
                'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '2563EB']],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER, 'wrapText' => true],
                'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'CBD5E1']]],
            ]);
            $sheet->getStyle("A6:K{$lastRow}")->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN)->getColor()->setRGB('E2E8F0');
            $sheet->getStyle("G6:K{$lastRow}")->getNumberFormat()->setFormatCode('#,##0');
            $sheet->getStyle("B6:B{$lastRow}")->getNumberFormat()->setFormatCode('dd-mm-yyyy');
            $sheet->getStyle("A{$lastRow}:K{$lastRow}")->getFont()->setBold(true);
            $sheet->getStyle("A{$lastRow}:K{$lastRow}")->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setRGB('DBEAFE');
            foreach (['A' => 7, 'B' => 13, 'C' => 18, 'D' => 22, 'E' => 22, 'F' => 32, 'G' => 13, 'H' => 16, 'I' => 12, 'J' => 12, 'K' => 13] as $column => $width) {
                $sheet->getColumnDimension($column)->setWidth($width);
            }
            $sheet->getRowDimension(1)->setRowHeight(28);
            $sheet->getRowDimension(5)->setRowHeight(30);
        }];
    }
}
