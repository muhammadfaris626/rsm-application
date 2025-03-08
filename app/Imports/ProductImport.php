<?php

namespace App\Imports;

use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\UpdateProductCategoryHistory;
use App\Models\UpdateProductHistory;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class ProductImport implements ToModel, WithHeadingRow {

    protected $userId;

    // Constructor untuk menangkap user_id
    public function __construct($userId) {
        $this->userId = $userId;
    }

    public function model(array $row) {
       // Cek apakah kategori produk sudah ada berdasarkan nama kategori
        $category = ProductCategory::where('product_category_name', $row['kategori_barang'])->first();

        if (!$category) {
            // Jika kategori tidak ditemukan, buat kategori baru
            $category = ProductCategory::create([
                'product_category_code' => $this->generateCategoryCode(),
                'product_category_name' => $row['kategori_barang']
            ]);

            // Simpan history pembuatan kategori baru
            UpdateProductCategoryHistory::create([
                'product_category_id' => $category->id,
                'user_id' => $this->userId
            ]);
        }

        // Cek apakah produk sudah ada dalam kategori tersebut
        $existingProduct = Product::where('product_name', $row['nama_barang'])
            ->where('product_category_id', $category->id)
            ->exists();

        if ($existingProduct) {
            return null; // Produk sudah ada, lewati insert
        }

        // Input produk baru ke dalam database
        $product = Product::create([
            'product_category_id' => $category->id,
            'product_name'        => $row['nama_barang'],
        ]);

        // Simpan history pembuatan produk baru
        UpdateProductHistory::create([
            'product_id' => $product->id,
            'user_id' => $this->userId
        ]);

        return $product;
    }

    private function generateCategoryCode() {
        $lastCategory = ProductCategory::latest('id')->first();
        $nextId = $lastCategory ? $lastCategory->id + 1 : 1;
        return 'RSM' . str_pad($nextId, 4, '0', STR_PAD_LEFT);
    }
}
