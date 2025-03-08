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
            ProductCategorySeeder::class,
            ProductSeeder::class,
            BranchSeeder::class,
            LocationSeeder::class,


            // EmployeeSeeder::class,
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
