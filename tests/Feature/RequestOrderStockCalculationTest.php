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

    public function test_initial_and_final_stock_follow_the_latest_branch_stock(): void
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
                'damaged_quantity' => 2,
                'used_quantity' => 12,
                'quantity' => 8,
            ]],
        ]);

        $response->assertRedirect(route('requestOrders.index'));
        $item = ListRequestOrder::latest('id')->firstOrFail();
        $this->assertSame(20, (int) $item->initial_stock);
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
            'initial_stock' => 20,
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

    public function test_completion_reconciles_branch_stock_before_adding_approved_stock(): void
    {
        $data = $this->stockScenario();
        $order = RequestOrder::create([
            'ro_number' => 'RO-TEST-COMPLETE',
            'branch_id' => $data['branch']->id,
            'date' => '2026-08-24',
            'status' => 'Pengecekan barang',
        ]);
        ListRequestOrder::create([
            'request_order_id' => $order->id,
            'center_stock_id' => $data['centerStock']->id,
            'quantity' => 8,
            'initial_stock' => 20,
            'used_quantity' => 12,
            'damaged_quantity' => 2,
            'approved_quantity' => 5,
            'final_stock' => 11,
            'serial_barcode' => $data['centerStock']->serial_barcode,
            'status' => 1,
        ]);

        $this->actingAs($this->root)->put(route('approval', $order), [
            'approval' => 'Selesai',
        ])->assertRedirect();

        $this->assertSame('Selesai', $order->fresh()->status);
        $this->assertSame(95, (int) $data['centerStock']->fresh()->stock);
        $this->assertSame(11, (int) BranchProduct::where('branch_id', $data['branch']->id)
            ->where('product_id', $data['centerStock']->product_id)
            ->sum('quantity'));
        $this->assertDatabaseHas('branch_products', [
            'request_order_id' => $order->id,
            'quantity' => 5,
        ]);
    }

    public function test_completed_order_cannot_change_stock_twice(): void
    {
        $data = $this->stockScenario();
        $order = RequestOrder::create([
            'ro_number' => 'RO-TEST-DUPLICATE',
            'branch_id' => $data['branch']->id,
            'date' => '2026-08-24',
            'status' => 'Selesai',
        ]);
        ListRequestOrder::create([
            'request_order_id' => $order->id,
            'center_stock_id' => $data['centerStock']->id,
            'quantity' => 5,
            'initial_stock' => 20,
            'used_quantity' => 5,
            'damaged_quantity' => 0,
            'approved_quantity' => 5,
            'final_stock' => 20,
            'serial_barcode' => $data['centerStock']->serial_barcode,
            'status' => 1,
        ]);

        $response = $this->actingAs($this->root)->from(route('requestOrders.index'))
            ->put(route('approval', $order), ['approval' => 'Selesai']);

        $response->assertRedirect(route('requestOrders.index'))->assertSessionHasErrors('approval');
        $this->assertSame(100, (int) $data['centerStock']->fresh()->stock);
        $this->assertSame(20, (int) BranchProduct::where('branch_id', $data['branch']->id)
            ->where('product_id', $data['centerStock']->product_id)
            ->sum('quantity'));
        $this->assertDatabaseMissing('branch_products', ['request_order_id' => $order->id]);
    }

    public function test_completion_rolls_back_when_branch_stock_changed_during_process(): void
    {
        $data = $this->stockScenario();
        $order = RequestOrder::create([
            'ro_number' => 'RO-TEST-CHANGED-STOCK',
            'branch_id' => $data['branch']->id,
            'date' => '2026-08-24',
            'status' => 'Pengecekan barang',
        ]);
        ListRequestOrder::create([
            'request_order_id' => $order->id,
            'center_stock_id' => $data['centerStock']->id,
            'quantity' => 5,
            'initial_stock' => 20,
            'used_quantity' => 10,
            'damaged_quantity' => 0,
            'approved_quantity' => 5,
            'final_stock' => 15,
            'serial_barcode' => $data['centerStock']->serial_barcode,
            'status' => 1,
        ]);
        BranchProduct::where('branch_id', $data['branch']->id)
            ->where('product_id', $data['centerStock']->product_id)
            ->update(['quantity' => 19]);

        $response = $this->actingAs($this->root)->from(route('requestOrders.index'))
            ->put(route('approval', $order), ['approval' => 'Selesai']);

        $response->assertRedirect(route('requestOrders.index'))->assertSessionHasErrors('approval');
        $this->assertSame('Pengecekan barang', $order->fresh()->status);
        $this->assertSame(100, (int) $data['centerStock']->fresh()->stock);
        $this->assertSame(19, (int) BranchProduct::where('branch_id', $data['branch']->id)
            ->where('product_id', $data['centerStock']->product_id)
            ->sum('quantity'));
        $this->assertDatabaseMissing('branch_products', ['request_order_id' => $order->id]);
    }

    public function test_central_admin_cannot_complete_a_branch_confirmation_step(): void
    {
        $data = $this->stockScenario();
        $centralAdmin = User::factory()->create();
        Role::create(['name' => 'admin-pusat']);
        $centralAdmin->assignRole('admin-pusat');
        $order = RequestOrder::create([
            'ro_number' => 'RO-TEST-ROLE-BOUNDARY',
            'branch_id' => $data['branch']->id,
            'date' => '2026-08-24',
            'status' => 'Pengecekan barang',
        ]);

        $this->actingAs($centralAdmin)->put(route('approval', $order), [
            'approval' => 'Selesai',
        ])->assertForbidden();

        $this->assertSame('Pengecekan barang', $order->fresh()->status);
        $this->assertSame(100, (int) $data['centerStock']->fresh()->stock);
    }

    public function test_duplicate_product_cannot_be_submitted_in_one_request(): void
    {
        $data = $this->stockScenario();
        $product = [
            'product_id' => [
                'id' => $data['centerStock']->id,
                'serial_barcode' => 'BARCODE-YANG-DIUBAH',
            ],
            'used_quantity' => 10,
            'damaged_quantity' => 0,
            'quantity' => 5,
        ];

        $response = $this->actingAs($this->root)->from(route('requestOrders.create'))
            ->post(route('requestOrders.store'), [
                'branch_id' => ['id' => $data['branch']->id],
                'date' => '2026-08-24',
                'products' => [$product, $product],
            ]);

        $response->assertRedirect(route('requestOrders.create'))
            ->assertSessionHasErrors('products.1.product_id');
        $this->assertDatabaseMissing('request_orders', ['date' => '2026-08-24']);
    }

    public function test_used_and_damaged_stock_cannot_exceed_initial_stock(): void
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
                    'used_quantity' => 19,
                    'damaged_quantity' => 2,
                    'quantity' => 8,
                ]],
            ]);

        $response->assertRedirect(route('requestOrders.create'))
            ->assertSessionHasErrors('products.0.used_quantity');
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
