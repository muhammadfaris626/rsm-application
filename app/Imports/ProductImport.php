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
        $categoryName = preg_replace('/\s+/u', ' ', trim((string) ($row['kategori_barang'] ?? ''))) ?? '';
        $productName = preg_replace('/\s+/u', ' ', trim((string) ($row['nama_barang'] ?? ''))) ?? '';

        if ($categoryName === '' || $productName === '') {
            return null;
        }

       // Cek apakah kategori produk sudah ada berdasarkan nama kategori
        $category = ProductCategory::whereRaw(
            'LOWER(TRIM(product_category_name)) = ?',
            [mb_strtolower($categoryName)]
        )->first();

        if (!$category) {
            // Jika kategori tidak ditemukan, buat kategori baru
            $category = ProductCategory::create([
                'product_category_code' => $this->generateCategoryCode(),
                'product_category_name' => $categoryName
            ]);

            // Simpan history pembuatan kategori baru
            UpdateProductCategoryHistory::create([
                'product_category_id' => $category->id,
                'user_id' => $this->userId
            ]);
        }

        // Cek apakah produk sudah ada dalam kategori tersebut
        $existingProduct = Product::where('product_category_id', $category->id)
            ->whereRaw('LOWER(TRIM(product_name)) = ?', [mb_strtolower($productName)])
            ->exists();

        if ($existingProduct) {
            return null; // Produk sudah ada, lewati insert
        }

        // Input produk baru ke dalam database
        $product = Product::create([
            'product_category_id' => $category->id,
            'product_name'        => $productName,
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
