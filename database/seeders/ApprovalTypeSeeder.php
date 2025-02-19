<?php

namespace Database\Seeders;

use App\Models\ApprovalType;
use App\Models\UpdateApprovalTypeHistory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ApprovalTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'approval_type_name' => 'Sedang diverifikasi'
            ],
            [
                'approval_type_name' => 'Disetujui'
            ],
            [
                'approval_type_name' => 'Pengiriman barang'
            ],
            [
                'approval_type_name' => 'Tiba di lokasi'
            ],
            [
                'approval_type_name' => 'Pengecekan barang'
            ],
            [
                'approval_type_name' => 'Selesai'
            ],
        ];
        foreach ($data as $key => $value) {
            ApprovalType::create($value);
        }
        $history = [
            [
                'approval_type_id' => 1,
                'user_id'          => 1
            ],
            [
                'approval_type_id' => 2,
                'user_id'          => 1
            ],
            [
                'approval_type_id' => 3,
                'user_id'          => 1
            ],
            [
                'approval_type_id' => 4,
                'user_id'          => 1
            ],
            [
                'approval_type_id' => 5,
                'user_id'          => 1
            ],
            [
                'approval_type_id' => 6,
                'user_id'          => 1
            ],
        ];
        foreach ($history as $key => $value) {
            UpdateApprovalTypeHistory::create($value);
        }
    }
}
