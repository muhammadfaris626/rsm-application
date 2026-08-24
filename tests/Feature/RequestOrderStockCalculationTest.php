<?php

namespace Tests\Feature;

use App\Models\Branch;
use App\Models\BranchProduct;
use App\Models\CenterStock;
use App\Models\InventoryPurchase;
use App\Models\ListRequestOrder;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\RequestOrder;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Gate;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class RequestOrderStockCalculationTest extends TestCase
{
    use RefreshDatabase;

    private User $root;

    protected function setUp(): void
    {
        parent::setUp();
        $this->root = User::factory()->create();
        Role::create(['name' => 'root']);
        $this->root->assignRole('root');
        Gate::before(fn (User $user, string $ability): bool => true);
    }

    public function test_used_and_final_stock_are_calculated_from_branch_stock(): void
    {
        $data = $this->stockScenario();

        $response = $this->actingAs($this->root)->post(route('requestOrders.store'), [
            'branch_id' => ['id' => $data['branch']->id],
            'date' => '2026-08-24',
            'products' => [[
                'product_id' => [
                    'id' => $data['centerStock']->id,
                    'serial_barcode' => $data['centerStock']->serial_barcode,
                ],
                'initial_stock' => 6,
                'damaged_quantity' => 2,
                'used_quantity' => 999,
                'quantity' => 8,
            ]],
        ]);

        $response->assertRedirect(route('requestOrders.index'));
        $item = ListRequestOrder::latest('id')->firstOrFail();
        $this->assertSame(6, (int) $item->initial_stock);
        $this->assertSame(12, (int) $item->used_quantity);
        $this->assertSame(2, (int) $item->damaged_quantity);
        $this->assertSame(8, (int) $item->quantity);
        $this->assertSame(6, (int) $item->final_stock);
    }

    public function test_approval_adds_only_the_approved_request_to_remaining_stock(): void
    {
        $data = $this->stockScenario();
        $order = RequestOrder::create([
            'ro_number' => 'RO-TEST-2',
            'branch_id' => $data['branch']->id,
            'date' => '2026-08-24',
            'status' => 'Sedang diverifikasi',
        ]);
        $item = ListRequestOrder::create([
            'request_order_id' => $order->id,
            'center_stock_id' => $data['centerStock']->id,
            'quantity' => 8,
            'initial_stock' => 6,
            'used_quantity' => 12,
            'damaged_quantity' => 2,
            'final_stock' => 6,
            'serial_barcode' => $data['centerStock']->serial_barcode,
        ]);

        $this->actingAs($this->root)->put(route('approval', $order), [
            'approval' => 'Disetujui',
            'listData' => [[
                'id' => $item->id,
                'approved_quantity' => 5,
            ]],
        ])->assertRedirect();

        $item->refresh();
        $this->assertSame(5, (int) $item->approved_quantity);
        $this->assertSame(11, (int) $item->final_stock);
    }

    public function test_remaining_and_damaged_stock_cannot_exceed_branch_stock(): void
    {
        $data = $this->stockScenario();

        $response = $this->actingAs($this->root)->from(route('requestOrders.create'))
            ->post(route('requestOrders.store'), [
                'branch_id' => ['id' => $data['branch']->id],
                'date' => '2026-08-24',
                'products' => [[
                    'product_id' => [
                        'id' => $data['centerStock']->id,
                        'serial_barcode' => $data['centerStock']->serial_barcode,
                    ],
                    'initial_stock' => 19,
                    'damaged_quantity' => 2,
                    'quantity' => 8,
                ]],
            ]);

        $response->assertRedirect(route('requestOrders.create'))
            ->assertSessionHasErrors('products.0.initial_stock');
        $this->assertDatabaseMissing('request_orders', ['date' => '2026-08-24']);
    }

    private function stockScenario(): array
    {
        $category = ProductCategory::create([
            'product_category_code' => 'KBL',
            'product_category_name' => 'Kabel',
        ]);
        $product = Product::create([
            'product_category_id' => $category->id,
            'product_name' => 'Kabel Data',
        ]);
        $supplier = Supplier::create([
            'name' => 'Supplier',
            'phone' => '0812',
            'address' => 'Makassar',
        ]);
        $purchase = InventoryPurchase::create([
            'invoice_number' => 'INV-REQ-1',
            'date' => '2026-08-20',
            'supplier_id' => $supplier->id,
        ]);
        $centerStock = CenterStock::create([
            'inventory_purchase_id' => $purchase->id,
            'product_id' => $product->id,
            'stock' => 100,
            'serial_barcode' => 'CENTER-REQ-1',
        ]);
        $branch = Branch::create([
            'branch_code' => 'MKS',
            'branch_name' => 'Makassar',
            'branch_address' => 'Makassar',
        ]);
        $stockOrder = RequestOrder::create([
            'ro_number' => 'RO-STOCK-1',
            'branch_id' => $branch->id,
            'date' => '2026-08-20',
            'status' => 'Selesai',
        ]);
        BranchProduct::create([
            'branch_id' => $branch->id,
            'product_id' => $product->id,
            'quantity' => 20,
            'serial_barcode' => 'CENTER-REQ-1',
            'request_order_id' => $stockOrder->id,
        ]);

        return compact('branch', 'centerStock');
    }
}
