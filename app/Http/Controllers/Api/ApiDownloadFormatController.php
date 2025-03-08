<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ApiDownloadFormatController extends Controller
{
    public function downloadFormatCategoryProduct() {
        $filePath = public_path('format-kategori-barang.xlsx');
        return response()->download($filePath, 'format-kategori-barang.xlsx');
    }

    public function downloadFormatProduct() {
        $filePath = public_path('format-barang.xlsx');
        return response()->download($filePath, 'format-barang.xlsx');
    }

    public function downloadFormatBranch() {
        $filePath = public_path('format-cabang.xlsx');
        return response()->download($filePath, 'format-cabang.xlsx');
    }
}
