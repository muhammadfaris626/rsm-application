<?php

namespace Tests\Feature;

use App\Models\Branch;
use App\Models\BranchProduct;
use App\Models\CenterStock;
use App\Models\Employee;
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
use App\Services\StockReportService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Testing\AssertableInertia as Assert;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class StockReportTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        Role::create(['name' => 'root']);
        $this->user->assignRole('root');
        Gate::before(fn (User $user, string $ability): bool => true);
    }

    public function test_branch_and_center_stock_calculations_are_historical(): void
    {
        $data = $this->stockScenario();
        $service = app(StockReportService::class);

        $branchRows = $service->branchReport(Carbon::parse('2026-08-01'), Carbon::parse('2026-08-31'), $data['branch']->id);
        $this->assertCount(1, $branchRows);
        $this->assertSame(80, $branchRows[0]['initial_stock']);
        $this->assertSame(50, $branchRows[0]['additional_stock']);
        $this->assertSame(20, $branchRows[0]['used_stock']);
        $this->assertSame(5, $branchRows[0]['damaged_stock']);
        $this->assertSame(105, $branchRows[0]['final_stock']);

        $centerRows = $service->centerReport(Carbon::parse('2026-08-01'), Carbon::parse('2026-08-31'));
        $row = $centerRows->firstWhere('product', 'Kabel Data');
        $this->assertSame(100, $row['initial_stock']);
        $this->assertSame(40, $row['purchased_stock']);
        $this->assertSame(100, $row['final_stock']);
    }

    public function test_report_pages_and_downloads_are_available(): void
    {
        $this->stockScenario();
        $filters = ['start_date' => '2026-08-01', 'end_date' => '2026-08-31'];

        $this->actingAs($this->user)->get(route('branchStockReports.index', $filters))
            ->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component('Managements/Reports/StockReport')
            ->where('reportType', 'branch')->has('rows', 1));
        $this->actingAs($this->user)->get(route('centerStockReports.index', $filters))
            ->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component('Managements/Reports/StockReport')
            ->where('reportType', 'center')->has('rows', 1));

        $branchExcel = $this->actingAs($this->user)->get(route('branchStockReports.excel', $filters));
        $branchExcel->assertOk();
        $branchSheet = IOFactory::load($branchExcel->baseResponse->getFile()->getPathname())->getActiveSheet();
        $this->assertSame('LAPORAN BARANG CABANG', $branchSheet->getCell('A1')->getValue());
        $this->assertSame('Tambahan Stok', $branchSheet->getCell('H5')->getValue());
        $this->assertSame(50, $branchSheet->getCell('H6')->getValue());

        $centerExcel = $this->actingAs($this->user)->get(route('centerStockReports.excel', $filters));
        $centerExcel->assertOk();
        $centerSheet = IOFactory::load($centerExcel->baseResponse->getFile()->getPathname())->getActiveSheet();
        $this->assertSame('LAPORAN BARANG PUSAT', $centerSheet->getCell('A1')->getValue());
        $this->assertSame(40, $centerSheet->getCell('E5')->getValue());

        foreach (['branchStockReports.pdf', 'centerStockReports.pdf'] as $routeName) {
            $pdf = $this->actingAs($this->user)->get(route($routeName, $filters));
            $pdf->assertOk()->assertHeader('content-type', 'application/pdf');
            $this->assertStringStartsWith('%PDF-', $pdf->getContent());
        }
    }

    public function test_branch_user_cannot_request_another_branch_report(): void
    {
        $data = $this->stockScenario();
        $otherBranch = Branch::create(['branch_code' => 'GOW', 'branch_name' => 'Gowa', 'branch_address' => 'Gowa']);
        $branchUser = User::factory()->create(['username' => 'EMP-001']);
        Employee::create([
            'employee_number' => 'EMP-001', 'user_id' => $branchUser->id, 'name' => 'Pegawai Cabang',
            'place_of_birth' => 'Makassar', 'date_of_birth' => '2000-01-01', 'phone' => '0813',
            'branch_id' => $data['branch']->id, 'status' => 'Aktif',
        ]);

        $this->actingAs($branchUser)->get(route('branchStockReports.index', [
            'start_date' => '2026-08-01', 'end_date' => '2026-08-31', 'branch' => $otherBranch->id,
        ]))->assertOk()->assertInertia(fn (Assert $page) => $page
            ->where('filters.branch', $data['branch']->id)
            ->where('rows.0.branch', 'Makassar')
            ->has('branches', 1));
    }

    private function stockScenario(): array
    {
        $category = ProductCategory::create(['product_category_code' => 'KBL', 'product_category_name' => 'Kabel']);
        $product = Product::create(['product_category_id' => $category->id, 'product_name' => 'Kabel Data']);
        $supplier = Supplier::create(['name' => 'Supplier', 'phone' => '0812', 'address' => 'Makassar']);
        $branch = Branch::create(['branch_code' => 'MKS', 'branch_name' => 'Makassar', 'branch_address' => 'Makassar']);

        $purchaseBefore = InventoryPurchase::create(['invoice_number' => 'INV-1', 'date' => '2026-07-15', 'supplier_id' => $supplier->id]);
        ListInventoryPurchase::create(['inventory_purchase_id' => $purchaseBefore->id, 'product_id' => $product->id, 'price' => 1000, 'quantity' => 100, 'total_price' => 100000]);
        $purchaseDuring = InventoryPurchase::create(['invoice_number' => 'INV-2', 'date' => '2026-08-10', 'supplier_id' => $supplier->id]);
        ListInventoryPurchase::create(['inventory_purchase_id' => $purchaseDuring->id, 'product_id' => $product->id, 'price' => 1000, 'quantity' => 40, 'total_price' => 40000]);

        $centerStock = CenterStock::create(['inventory_purchase_id' => $purchaseBefore->id, 'product_id' => $product->id, 'stock' => 100, 'serial_barcode' => 'CENTER-1']);
        $order = RequestOrder::create(['ro_number' => 'RO-1', 'branch_id' => $branch->id, 'date' => '2026-08-15', 'status' => 'Selesai']);
        ListRequestOrder::create([
            'request_order_id' => $order->id, 'center_stock_id' => $centerStock->id, 'quantity' => 50,
            'initial_stock' => 55, 'approved_quantity' => 50, 'used_quantity' => 20,
            'damaged_quantity' => 5, 'final_stock' => 105, 'serial_barcode' => 'CENTER-1', 'status' => 1,
        ]);
        DB::table('request_order_logs')->insert([
            'request_order_id' => $order->id, 'user_id' => $this->user->id, 'status' => 'Selesai',
            'description' => null, 'created_at' => '2026-08-15 12:00:00', 'updated_at' => '2026-08-15 12:00:00',
        ]);

        $branchProduct = BranchProduct::create([
            'branch_id' => $branch->id, 'product_id' => $product->id, 'quantity' => 105,
            'serial_barcode' => 'CENTER-1', 'request_order_id' => $order->id, 'total_return' => 10,
        ]);
        $return = RequestReturn::create([
            'request_order_id' => $order->id, 'branch_id' => $branch->id, 'request_number' => 'RR-1',
            'date' => '2026-08-20', 'status' => 'Selesai',
        ]);
        ListRequestReturn::create(['request_return_id' => $return->id, 'branch_product_id' => $branchProduct->id, 'quantity' => 10, 'serial_barcode' => 'CENTER-1']);
        DB::table('request_return_logs')->insert([
            'request_return_id' => $return->id, 'user_id' => $this->user->id, 'status' => 'Selesai',
            'description' => null, 'created_at' => '2026-08-20 12:00:00', 'updated_at' => '2026-08-20 12:00:00',
        ]);

        return compact('branch', 'product');
    }
}
