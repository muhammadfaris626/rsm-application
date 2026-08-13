<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Http\Resources\ProductCategoryResource;
use App\Http\Resources\ProductResource;
use App\Imports\ProductImport;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\UpdateProductHistory;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;

class ProductController extends Controller
{
    protected function applySearch($query, $search) {
        return $query->when($search, function($query, $search) {
            $query->where(function($query) use($search) {
                $query->where('product_name', 'LIKE', '%' . $search . '%')
                    ->orWhereHas('productCategory', function($query) use($search) {
                        $query->where('product_category_name', 'LIKE', '%' . $search . '%');
                    });
                });
        });
    }

    private function fieldIdFromRequest($value): mixed
    {
        if (is_array($value)) {
            return $value['id'] ?? $value[0]['id'] ?? null;
        }

        if (is_object($value)) {
            return $value->id ?? null;
        }

        return $value;
    }

    public function index(Request $request): Response {
        Gate::authorize('viewAny', Product::class);
        
        // Optimized query with eager loading
        $searchQuery = Product::query()
            ->select('id', 'product_category_id', 'product_name', 'created_at', 'updated_at')
            ->with([
                'productCategory:id,product_category_name',
                'updateProductHistory.user',
            ])
            ->latest();
        
        $this->applySearch($searchQuery, $request->search);
        $data = ProductResource::collection(
            $searchQuery->paginate(12)->withQueryString()
        );
        
        // Cache product categories
        $productCategories = Cache::remember('product_categories', 600, function() {
            return ProductCategory::select('id', 'product_category_name')->get();
        });
        
        return Inertia::render('Database/Products/IndexProduct', [
            'fetchData' => $data,
            'search' => $request->search ?? '',
            'productCategories' => ProductCategoryResource::collection($productCategories)
        ]);
    }

    public function create()
    {
        //
    }

    public function store(ProductRequest $request): RedirectResponse {
        Gate::authorize('create', Product::class);
        $product = Product::create([
            'product_category_id' => $this->fieldIdFromRequest($request->product_category_id),
            'product_name' => $request->product_name
        ]);
        UpdateProductHistory::create([
            'product_id' => $product->id,
            'user_id' => Auth::user()->id
        ]);
        Session::flash('toast', ['message' => 'Data berhasil ditambahkan.']);
        return back();
    }

    public function show(Product $product)
    {
        //
    }

    public function edit(Product $product)
    {
        //
    }

    public function update(ProductRequest $request, Product $product): RedirectResponse {
        Gate::authorize('update', $product);
        $product->update([
            'product_category_id' => $this->fieldIdFromRequest($request->product_category_id),
            'product_name' => $request->product_name
        ]);
        UpdateProductHistory::create([
            'product_id' => $product->id,
            'user_id' => Auth::user()->id
        ]);
        Session::flash('toast', ['message' => 'Data berhasil diubah.']);
        return back();
    }

    public function destroy(Product $product): RedirectResponse {
        Gate::authorize('delete', $product);
        if ($product->listInventoryPurchase()->exists() ||
            $product->branchProduct()->exists() ||
            $product->centerStock()->exists()) {
            Session::flash('toast', [
                'message' => 'Gagal menghapus! Barang ini masih digunakan pada stok atau transaksi.',
                'type' => 'error'
            ]);
            return back();
        }

        UpdateProductHistory::where('product_id', $product->id)->delete();
        $product->delete();
        Session::flash('toast', ['message' => 'Data berhasil dihapus.']);
        return back();
    }

    public function upload(Request $request): RedirectResponse {
        $request->validate([
            'fileUpload' => 'required|mimes:xlsx,xls|mimetypes:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel',
        ], [
            'fileUpload.required' => 'Kolom unggah berkas wajib diisi.',
            'fileUpload.mimes' => 'Berkas yang diunggah harus berupa file Excel (xlsx, xls).'
        ]);
        $userId = Auth::id();
        Excel::import(new ProductImport($userId), $request->file('fileUpload'));
        return back();
    }
}
