<?php

namespace Tests\Feature;

use App\Models\Branch;
use App\Models\CenterStock;
use App\Models\Employee;
use App\Models\InventoryPurchase;
use App\Models\ListRequestOrder;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\RequestOrder;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class DeliveryNoteTest extends TestCase
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

    public function test_delivery_note_can_be_printed_when_shipping_has_started(): void
    {
        $order = $this->shippingOrder();

        $response = $this->actingAs($this->root)->get(route('requestOrders.deliveryNote', $order));

        $response->assertOk()->assertHeader('content-type', 'application/pdf');
        $this->assertStringContainsString(
            'inline; filename="surat-jalan-SJ-RSM-08242026-0001.pdf"',
            $response->headers->get('content-disposition')
        );
        $this->assertStringStartsWith('%PDF-', $response->getContent());
    }

    public function test_delivery_note_cannot_be_printed_before_shipping(): void
    {
        $order = $this->shippingOrder();
        $order->update(['status' => 'Disetujui']);

        $this->actingAs($this->root)
            ->get(route('requestOrders.deliveryNote', $order))
            ->assertStatus(409);
    }

    public function test_branch_user_cannot_print_another_branch_delivery_note(): void
    {
        $order = $this->shippingOrder();
        $otherBranch = Branch::create([
            'branch_code' => 'GOW',
            'branch_name' => 'Cabang Gowa',
            'branch_address' => 'Gowa',
        ]);
        $branchUser = User::factory()->create(['username' => 'EMP-002']);
        Employee::create([
            'employee_number' => 'EMP-002',
            'user_id' => $branchUser->id,
            'name' => 'Pegawai Gowa',
            'place_of_birth' => 'Gowa',
            'date_of_birth' => '2000-01-01',
            'phone' => '0813',
            'branch_id' => $otherBranch->id,
            'status' => 'Aktif',
        ]);

        $this->actingAs($branchUser)
            ->get(route('requestOrders.deliveryNote', $order))
            ->assertForbidden();
    }

    private function shippingOrder(): RequestOrder
    {
        $category = ProductCategory::create([
            'product_category_code' => 'KBL',
            'product_category_name' => 'Kabel',
        ]);
        $product = Product::create([
            'product_category_id' => $category->id,
            'product_name' => 'Kabel Data USB',
        ]);
        $supplier = Supplier::create([
            'name' => 'Supplier Utama',
            'phone' => '0812',
            'address' => 'Makassar',
        ]);
        $purchase = InventoryPurchase::create([
            'invoice_number' => 'INV-001',
            'date' => '2026-08-20',
            'supplier_id' => $supplier->id,
        ]);
        $centerStock = CenterStock::create([
            'inventory_purchase_id' => $purchase->id,
            'product_id' => $product->id,
            'stock' => 50,
            'serial_barcode' => 'CENTER-001',
        ]);
        $branch = Branch::create([
            'branch_code' => 'MRS',
            'branch_name' => 'Cabang Maros',
            'branch_address' => 'Jl. Poros Maros No. 10',
        ]);
        $order = RequestOrder::create([
            'ro_number' => 'RO-RSM-08242026-0001',
            'branch_id' => $branch->id,
            'date' => '2026-08-23',
            'status' => 'Pengiriman barang',
        ]);
        ListRequestOrder::create([
            'request_order_id' => $order->id,
            'center_stock_id' => $centerStock->id,
            'quantity' => 12,
            'initial_stock' => 3,
            'used_quantity' => 2,
            'damaged_quantity' => 0,
            'final_stock' => 13,
            'approved_quantity' => 12,
            'serial_barcode' => 'CENTER-001',
            'status' => 1,
        ]);
        DB::table('request_order_logs')->insert([
            'request_order_id' => $order->id,
            'user_id' => $this->root->id,
            'status' => 'Pengiriman barang',
            'description' => null,
            'created_at' => '2026-08-24 09:30:00',
            'updated_at' => '2026-08-24 09:30:00',
        ]);

        return $order;
    }
}
