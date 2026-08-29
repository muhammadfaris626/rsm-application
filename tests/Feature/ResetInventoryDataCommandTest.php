<?php

namespace Tests\Feature;

use App\Models\Branch;
use App\Models\BranchProduct;
use App\Models\CenterStock;
use App\Models\InventoryPurchase;
use App\Models\ListInventoryPurchase;
use App\Models\ListRequestOrder;
use App\Models\ListRequestReturn;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\RequestOrder;
use App\Models\RequestReturn;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class ResetInventoryDataCommandTest extends TestCase
{
    use RefreshDatabase;

    public function test_command_cancels_without_confirmation(): void
    {
        $category = ProductCategory::create([
            'product_category_code' => 'CAT-SAFE',
            'product_category_name' => 'Kategori Aman',
        ]);

        $this->artisan('inventory:reset')
            ->expectsConfirmation('Anda yakin ingin menghapus SEMUA data tersebut?', 'no')
            ->assertSuccessful();

        $this->assertDatabaseHas('product_categories', ['id' => $category->id]);
    }

    public function test_command_deletes_all_inventory_data_and_keeps_unrelated_master_data(): void
    {
        $user = User::factory()->create();
        $branch = Branch::create([
            'branch_code' => 'MKS',
            'branch_name' => 'Makassar',
            'branch_address' => 'Makassar',
        ]);
        $supplier = Supplier::create([
            'name' => 'Supplier Tetap',
            'phone' => '08123456789',
            'address' => 'Makassar',
        ]);
        $category = ProductCategory::create([
            'product_category_code' => 'CAT-1',
            'product_category_name' => 'Kategori Lama',
        ]);
        $product = Product::create([
            'product_category_id' => $category->id,
            'product_name' => 'Barang Lama',
        ]);
        $purchase = InventoryPurchase::create([
            'invoice_number' => 'INV-RESET-1',
            'date' => '2026-08-29',
            'supplier_id' => $supplier->id,
        ]);
        ListInventoryPurchase::create([
            'inventory_purchase_id' => $purchase->id,
            'product_id' => $product->id,
            'price' => 10000,
            'quantity' => 10,
            'total_price' => 100000,
        ]);
        $centerStock = CenterStock::create([
            'inventory_purchase_id' => $purchase->id,
            'product_id' => $product->id,
            'stock' => 5,
            'serial_barcode' => 'RESET-001',
        ]);
        $order = RequestOrder::create([
            'ro_number' => 'RO-RESET-1',
            'branch_id' => $branch->id,
            'date' => '2026-08-29',
            'status' => 'Selesai',
        ]);
        ListRequestOrder::create([
            'request_order_id' => $order->id,
            'center_stock_id' => $centerStock->id,
            'quantity' => 5,
            'initial_stock' => 0,
            'used_quantity' => 0,
            'damaged_quantity' => 0,
            'approved_quantity' => 5,
            'final_stock' => 5,
            'serial_barcode' => 'RESET-001',
            'status' => 1,
        ]);
        $branchProduct = BranchProduct::create([
            'branch_id' => $branch->id,
            'product_id' => $product->id,
            'quantity' => 5,
            'serial_barcode' => 'RESET-001',
            'request_order_id' => $order->id,
        ]);
        $return = RequestReturn::create([
            'request_order_id' => $order->id,
            'branch_id' => $branch->id,
            'request_number' => 'RR-RESET-1',
            'date' => '2026-08-29',
            'status' => 'Selesai',
        ]);
        ListRequestReturn::create([
            'request_return_id' => $return->id,
            'branch_product_id' => $branchProduct->id,
            'quantity' => 1,
            'serial_barcode' => 'RESET-001',
        ]);

        DB::table('update_product_category_histories')->insert([
            'product_category_id' => $category->id,
            'user_id' => $user->id,
        ]);
        DB::table('update_product_histories')->insert([
            'product_id' => $product->id,
            'user_id' => $user->id,
        ]);
        DB::table('update_inventory_purchase_histories')->insert([
            'inventory_purchase_id' => $purchase->id,
            'user_id' => $user->id,
        ]);
        DB::table('update_request_order_histories')->insert([
            'request_order_id' => $order->id,
            'user_id' => $user->id,
        ]);
        DB::table('update_request_return_histories')->insert([
            'request_return_id' => $return->id,
            'user_id' => $user->id,
        ]);

        $this->artisan('inventory:reset', ['--force' => true])
            ->assertSuccessful();

        foreach ([
            'product_categories',
            'products',
            'inventory_purchases',
            'list_inventory_purchases',
            'center_stocks',
            'request_orders',
            'list_request_orders',
            'branch_products',
            'request_returns',
            'list_request_returns',
        ] as $table) {
            $this->assertSame(0, DB::table($table)->count(), "Tabel {$table} belum kosong.");
        }

        $this->assertDatabaseHas('users', ['id' => $user->id]);
        $this->assertDatabaseHas('branches', ['id' => $branch->id]);
        $this->assertDatabaseHas('suppliers', ['id' => $supplier->id]);

        $newCategory = ProductCategory::create([
            'product_category_code' => 'CAT-NEW',
            'product_category_name' => 'Kategori Baru',
        ]);
        $this->assertSame(1, $newCategory->id);
    }
}
