<?php

namespace App\Imports;

use App\Models\Branch;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class BranchImport implements ToModel, WithHeadingRow {

    protected $userId;

    // Constructor untuk menangkap user_id
    public function __construct($userId) {
        $this->userId = $userId;
    }

    public function model(array $row) {
        $existingBranch = Branch::where('branch_name', $row['nama_cabang'])->first();
        if ($existingBranch) {
            return null;
        }

        $lastBranch = Branch::latest('id')->first();
        $lastId = $lastBranch ? $lastBranch->id : 0;
        $newCode = 'CABANG' . str_pad($lastId + 1, 3, '0', STR_PAD_LEFT);

        $branch = Branch::create([
            'branch_code' => $newCode,
            'branch_name' => $row['nama_cabang'],
            'branch_address' => $row['alamat']
        ]);
        return $branch;
    }
}
