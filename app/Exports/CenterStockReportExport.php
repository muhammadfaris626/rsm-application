<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithCustomValueBinder;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithStrictNullComparison;
use Maatwebsite\Excel\DefaultValueBinder;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Cell\Cell;
use PhpOffice\PhpSpreadsheet\Cell\DataType;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\PageSetup;

class CenterStockReportExport extends DefaultValueBinder implements FromArray, WithCustomValueBinder, WithEvents, WithStrictNullComparison
{
    public function __construct(private readonly Collection $rows, private readonly string $period) {}

    public function bindValue(Cell $cell, $value): bool
    {
        $totalRow = $this->rows->count() + 5;
        if (is_string($value) && str_starts_with($value, '=') && $cell->getRow() === $totalRow) {
            return parent::bindValue($cell, $value);
        }
        if (($cell->getColumn() === 'A' || in_array($cell->getColumn(), ['D', 'E', 'F'], true)) && is_numeric($value)) {
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
            ['LAPORAN BARANG PUSAT'],
            ['Periode', $this->period],
            [''],
            ['No', 'Kategori', 'Barang', 'Stok Awal', 'Pembelian', 'Stok Akhir'],
        ];

        foreach ($this->rows as $index => $row) {
            $data[] = [$index + 1, $row['category'], $row['product'], $row['initial_stock'], $row['purchased_stock'], $row['final_stock']];
        }

        $totalRow = count($data) + 1;
        $lastDataRow = $totalRow - 1;
        $formula = fn (string $column) => $this->rows->isEmpty() ? '=0' : "=SUM({$column}5:{$column}{$lastDataRow})";
        $data[] = ['', '', 'TOTAL', $formula('D'), $formula('E'), $formula('F')];

        return $data;
    }

    public function registerEvents(): array
    {
        return [AfterSheet::class => function (AfterSheet $event): void {
            $sheet = $event->sheet->getDelegate();
            $lastRow = $sheet->getHighestDataRow();
            $sheet->mergeCells('A1:F1');
            $sheet->freezePane('A5');
            $sheet->setAutoFilter('A4:F'.max(4, $lastRow - 1));
            $sheet->getPageSetup()->setOrientation(PageSetup::ORIENTATION_LANDSCAPE)->setFitToWidth(1)->setFitToHeight(0);
            $sheet->getStyle('A1:F1')->applyFromArray([
                'font' => ['bold' => true, 'size' => 16, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '047857']],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
            ]);
            $sheet->getStyle('A4:F4')->applyFromArray([
                'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '059669']],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
                'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'CBD5E1']]],
            ]);
            $sheet->getStyle("A5:F{$lastRow}")->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN)->getColor()->setRGB('E2E8F0');
            $sheet->getStyle("D5:F{$lastRow}")->getNumberFormat()->setFormatCode('#,##0');
            $sheet->getStyle("A{$lastRow}:F{$lastRow}")->getFont()->setBold(true);
            $sheet->getStyle("A{$lastRow}:F{$lastRow}")->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setRGB('D1FAE5');
            foreach (['A' => 7, 'B' => 24, 'C' => 38, 'D' => 15, 'E' => 15, 'F' => 15] as $column => $width) {
                $sheet->getColumnDimension($column)->setWidth($width);
            }
            $sheet->getRowDimension(1)->setRowHeight(28);
            $sheet->getRowDimension(4)->setRowHeight(25);
        }];
    }
}
