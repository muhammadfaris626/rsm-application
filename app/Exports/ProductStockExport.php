<?php

namespace App\Exports;

use App\Models\Product;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithCustomValueBinder;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStrictNullComparison;
use Maatwebsite\Excel\DefaultValueBinder;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Cell\Cell;
use PhpOffice\PhpSpreadsheet\Cell\DataType;
use PhpOffice\PhpSpreadsheet\Shared\Date;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class ProductStockExport extends DefaultValueBinder implements FromQuery, WithCustomValueBinder, WithEvents, WithHeadings, WithMapping, WithStrictNullComparison
{
    private int $rowNumber = 0;

    public function bindValue(Cell $cell, $value): bool
    {
        if (in_array($cell->getColumn(), ['A', 'B', 'F', 'G', 'H'], true) && is_numeric($value)) {
            $cell->setValueExplicit((int) $value, DataType::TYPE_NUMERIC);

            return true;
        }

        if (is_string($value)) {
            $cell->setValueExplicit($value, DataType::TYPE_STRING);

            return true;
        }

        return parent::bindValue($cell, $value);
    }

    public function query(): Builder
    {
        return Product::query()
            ->select('id', 'product_category_id', 'product_name', 'created_at', 'updated_at')
            ->with('productCategory:id,product_category_code,product_category_name')
            ->withSum('centerStock as center_stock_total', 'stock')
            ->withSum('branchProduct as branch_stock_total', 'quantity')
            ->orderBy('product_name');
    }

    public function headings(): array
    {
        return [
            'No',
            'ID Barang',
            'Kode Kategori',
            'Kategori Barang',
            'Nama Barang',
            'Stok Pusat',
            'Stok Cabang',
            'Total Sisa Stok',
            'Dibuat Pada',
            'Diperbarui Pada',
        ];
    }

    public function map($product): array
    {
        $centerStock = (int) ($product->center_stock_total ?? 0);
        $branchStock = (int) ($product->branch_stock_total ?? 0);

        return [
            ++$this->rowNumber,
            $product->id,
            $product->productCategory?->product_category_code ?? '-',
            $product->productCategory?->product_category_name ?? '-',
            $product->product_name,
            $centerStock,
            $branchStock,
            $centerStock + $branchStock,
            Date::dateTimeToExcel($product->created_at),
            Date::dateTimeToExcel($product->updated_at),
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event): void {
                $sheet = $event->sheet->getDelegate();
                $lastRow = max(1, $sheet->getHighestDataRow());

                $sheet->freezePane('A2');
                $sheet->setAutoFilter("A1:J{$lastRow}");
                $sheet->getRowDimension(1)->setRowHeight(24);

                $sheet->getStyle('A1:J1')->applyFromArray([
                    'font' => [
                        'bold' => true,
                        'color' => ['rgb' => 'FFFFFF'],
                    ],
                    'fill' => [
                        'fillType' => Fill::FILL_SOLID,
                        'startColor' => ['rgb' => '059669'],
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                    'borders' => [
                        'bottom' => [
                            'borderStyle' => Border::BORDER_MEDIUM,
                            'color' => ['rgb' => '047857'],
                        ],
                    ],
                ]);

                $sheet->getStyle("A2:B{$lastRow}")->getAlignment()
                    ->setHorizontal(Alignment::HORIZONTAL_CENTER);
                $sheet->getStyle("F2:H{$lastRow}")->getNumberFormat()->setFormatCode('#,##0');
                $sheet->getStyle("F2:H{$lastRow}")->getAlignment()
                    ->setHorizontal(Alignment::HORIZONTAL_RIGHT);
                $sheet->getStyle("I2:J{$lastRow}")->getNumberFormat()
                    ->setFormatCode('yyyy-mm-dd hh:mm:ss');

                foreach ([
                    'A' => 7,
                    'B' => 11,
                    'C' => 16,
                    'D' => 24,
                    'E' => 34,
                    'F' => 14,
                    'G' => 14,
                    'H' => 18,
                    'I' => 21,
                    'J' => 21,
                ] as $column => $width) {
                    $sheet->getColumnDimension($column)->setWidth($width);
                }
            },
        ];
    }
}
