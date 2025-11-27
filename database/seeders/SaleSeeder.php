<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\ListSale;
use App\Models\ManagementStructure;
use App\Models\Sale;
use App\Models\UpdateSaleHistory;
use App\Models\User;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class SaleSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        $branches = Branch::pluck('id')->toArray();
        $managementStructures = ManagementStructure::pluck('id')->toArray();
        $users = User::pluck('id')->toArray();

        if (empty($branches) || empty($managementStructures) || empty($users)) {
            $this->command->warn('SaleSeeder: Required data not found. Skipping...');
            return;
        }

        for ($i = 0; $i < 50; $i++) {
            $count = $i + 1;
            $invoiceNumber = 'INV-P-RSM-' . date('mdY', strtotime("-{$i} days")) . '-' . str_pad($count, 4, '0', STR_PAD_LEFT);
            
            $sale = Sale::create([
                'branch_id' => $faker->randomElement($branches),
                'invoice_number' => $invoiceNumber,
                'date' => $faker->dateTimeBetween('-1 year', 'now')->format('Y-m-d'),
                'management_structure_id' => $faker->randomElement($managementStructures)
            ]);

            UpdateSaleHistory::create([
                'sale_id' => $sale->id,
                'user_id' => $faker->randomElement($users)
            ]);
        }
    }
}
