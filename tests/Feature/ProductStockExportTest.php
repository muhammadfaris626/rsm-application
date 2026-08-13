<?php

namespace Tests\Feature;

use App\Models\Branch;
use App\Models\BranchProduct;
use App\Models\CenterStock;
use App\Models\InventoryPurchase;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\RequestOrder;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Gate;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Tests\TestCase;

class ProductStockExportTest extends TestCase
{
    use RefreshDatabase;

    public function test_all_products_are_exported_with_remaining_stock(): void
    {
        $user = User::factory()->create();
        Gate::before(fn (User $user, string $ability): bool => true);

        $category = ProductCategory::create([
            'product_category_code' => 'ELC',
            'product_category_name' => 'Elektronik',
        ]);
        $product = Product::create([
            'product_category_id' => $category->id,
            'product_name' => 'Kabel HDMI',
        ]);
        $productWithoutStock = Product::create([
            'product_category_id' => $category->id,
            'product_name' => 'Adaptor USB',
        ]);

        $supplier = Supplier::create([
            'name' => 'Supplier Utama',
            'phone' => '08123456789',
            'address' => 'Makassar',
        ]);
        $purchase = InventoryPurchase::create([
            'invoice_number' => 'INV-001',
            'date' => '2026-08-13',
            'supplier_id' => $supplier->id,
        ]);

        CenterStock::create([
            'inventory_purchase_id' => $purchase->id,
            'product_id' => $product->id,
            'stock' => 5,
            'serial_barcode' => 'CENTER-001',
        ]);
        CenterStock::create([
            'inventory_purchase_id' => $purchase->id,
            'product_id' => $product->id,
            'stock' => 3,
            'serial_barcode' => 'CENTER-002',
        ]);

        $branch = Branch::create([
            'branch_code' => 'MKS',
            'branch_name' => 'Makassar',
            'branch_address' => 'Jalan Makassar',
        ]);
        $requestOrder = RequestOrder::create([
            'ro_number' => 'RO-001',
            'branch_id' => $branch->id,
            'date' => '2026-08-13',
            'status' => 'Selesai',
        ]);

        BranchProduct::create([
            'branch_id' => $branch->id,
            'product_id' => $product->id,
            'quantity' => 4,
            'serial_barcode' => 'BRANCH-001',
            'request_order_id' => $requestOrder->id,
        ]);
        BranchProduct::create([
            'branch_id' => $branch->id,
            'product_id' => $product->id,
            'quantity' => 2,
            'serial_barcode' => 'BRANCH-002',
            'request_order_id' => $requestOrder->id,
        ]);

        $response = $this->actingAs($user)->get(route('products.export'));

        $response->assertOk();
        $this->assertStringContainsString(
            'data-barang-'.now()->format('Y-m-d').'.xlsx',
            $response->headers->get('content-disposition')
        );

        $spreadsheet = IOFactory::load($response->baseResponse->getFile()->getPathname());
        $sheet = $spreadsheet->getActiveSheet();
        $rows = $sheet->toArray(null, true, false, false);

        $this->assertSame([
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
        ], $rows[0]);

        $this->assertCount(3, $rows);
        $this->assertSame('Adaptor USB', $rows[1][4]);
        $this->assertSame(0, $rows[1][5]);
        $this->assertSame(0, $rows[1][6]);
        $this->assertSame(0, $rows[1][7]);
        $this->assertSame('Kabel HDMI', $rows[2][4]);
        $this->assertSame(8, $rows[2][5]);
        $this->assertSame(6, $rows[2][6]);
        $this->assertSame(14, $rows[2][7]);

        $this->assertSame($productWithoutStock->id, $rows[1][1]);
        $this->assertSame($product->id, $rows[2][1]);
        $this->assertSame('A2', $sheet->getFreezePane());
        $this->assertSame('A1:J3', $sheet->getAutoFilter()->getRange());
        $this->assertSame('FF059669', $sheet->getStyle('A1')->getFill()->getStartColor()->getARGB());
    }
}
