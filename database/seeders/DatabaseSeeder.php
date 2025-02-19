<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RolesAndPermissionsSeeder::class,
            ApprovalTypeSeeder::class,
            BranchSeeder::class,
            EmployeeSeeder::class,
            // ProductCategorySeeder::class,
            // ProductSeeder::class,
            // ExpenditureSeeder::class,
            // PositionSeeder::class,
            // SupplierSeeder::class,
            // ManagementStructureSeeder::class,
            // InventoryPurchaseSeeder::class,
            // OperationalCenterSeeder::class,
            // OperationalBranchSeeder::class,

            // RequestOrderSeeder::class,
            // BranchProductSeeder::class,
            // SaleSeeder::class
        ]);
    }
}
