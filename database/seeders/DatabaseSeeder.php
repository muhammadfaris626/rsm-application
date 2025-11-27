<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed roles and permissions first
        $this->call([
            RolesAndPermissionsSeeder::class,
        ]);

        // Seed users (needed for history tables)
        $this->call([
            UserSeeder::class,
        ]);

        // Seed master data
        $this->call([
            ApprovalTypeSeeder::class,
            ProductCategorySeeder::class,
            ProductSeeder::class,
            BranchSeeder::class,
            LocationSeeder::class,
            PositionSeeder::class,
            EmployeeSeeder::class,
            SupplierSeeder::class,
            ExpenditureSeeder::class,
        ]);

        // Seed operational data
        $this->call([
            ManagementStructureSeeder::class,
            OperationalCenterSeeder::class,
            OperationalBranchSeeder::class,
        ]);

        // Seed inventory and purchase
        $this->call([
            InventoryPurchaseSeeder::class,
            CenterStockSeeder::class,
        ]);

        // Seed request orders
        $this->call([
            RequestOrderSeeder::class,
            ListRequestOrderSeeder::class,
            BranchProductSeeder::class,
        ]);

        // Seed sales
        $this->call([
            SaleSeeder::class,
            ListSaleSeeder::class,
        ]);

        // Seed request returns
        $this->call([
            RequestReturnSeeder::class,
            ListRequestReturnSeeder::class,
        ]);

        // Seed HR data
        $this->call([
            AttendanceSeeder::class,
            MutationSeeder::class,
            TerminationSeeder::class,
        ]);
    }
}
