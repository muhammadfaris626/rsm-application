<?php

namespace App\Imports;

use App\Models\ProductCategory;
use App\Models\UpdateProductCategoryHistory;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class ProductCategoryImport implements ToModel, WithHeadingRow {
    protected $userId;

    // Constructor untuk menangkap user_id
    public function __construct($userId) {
        $this->userId = $userId;
    }

    public function model(array $row) {
        // Cek apakah kategori sudah ada
        $existingCategory = ProductCategory::where('product_category_name', $row['kategori_barang'])->first();
        if ($existingCategory) {
            return null;
        }

        // Generate kode kategori baru
        $lastCategory = ProductCategory::latest('id')->first();
        $lastId = $lastCategory ? $lastCategory->id : 0;
        $newCode = 'RSM' . str_pad($lastId + 1, 4, '0', STR_PAD_LEFT);

        // Simpan kategori baru ke database
        $productCategory = ProductCategory::create([
            'product_category_code' => $newCode,
            'product_category_name' => $row['kategori_barang']
        ]);

        // Simpan ke tabel update_product_category_history
        UpdateProductCategoryHistory::create([
            'product_category_id' => $productCategory->id,
            'user_id' => $this->userId
        ]);

        return $productCategory;
    }
}
