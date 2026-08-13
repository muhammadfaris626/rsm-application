<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductCategoryRequest;
use App\Http\Resources\ProductCategoryResource;
use App\Imports\ProductCategoryImport;
use App\Models\ProductCategory;
use App\Models\UpdateProductCategoryHistory;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Session;
use Illuminate\Http\RedirectResponse;
use Maatwebsite\Excel\Facades\Excel;

class ProductCategoryController extends Controller
{
    protected function applySearch($query, $search) {
        return $query->when($search, function($query, $search) {
            $query->where(function($query) use($search) {
                $query->where('product_category_code', 'LIKE', '%' . $search . '%')
                    ->orWhere('product_category_name', 'LIKE', '%' . $search . '%');
            });
        });
    }

    public function index(Request $request): Response {
        Gate::authorize('viewAny', ProductCategory::class);
        $searchQuery = ProductCategory::query()
            ->with('updateProductCategoryHistory.user')
            ->latest();
        $this->applySearch($searchQuery, $request->search);
        $data = ProductCategoryResource::collection($searchQuery->paginate(12)->withQueryString());
        return Inertia::render('Database/ProductCategories/IndexProductCategory', [
            'fetchData' => $data,
            'search' => $request->search ?? '',
        ]);
    }

    public function create()
    {
        //
    }

    public function store(ProductCategoryRequest $request): RedirectResponse {
        Gate::authorize('create', ProductCategory::class);
        $count = (ProductCategory::max('id') ?? 0) + 1;
        $generateCategory = 'RSM' . str_pad($count, 4, '0', STR_PAD_LEFT);
        $productCategory = ProductCategory::create([
            'product_category_code' => $generateCategory,
            'product_category_name' => $request->product_category_name
        ]);
        UpdateProductCategoryHistory::create([
            'product_category_id' => $productCategory->id,
            'user_id' => Auth::user()->id
        ]);
        Cache::forget('product_categories');
        Session::flash('toast', [
            'message' => 'Data berhasil ditambahkan.'
        ]);
        return back();
    }

    public function show(ProductCategory $productCategory) {
        //
    }

    public function edit(ProductCategory $productCategory)
    {
        //
    }

    public function update(ProductCategoryRequest $request, ProductCategory $productCategory): RedirectResponse {
        Gate::authorize('update', $productCategory);
        $productCategory->update($request->validated());
        UpdateProductCategoryHistory::create([
            'product_category_id' => $productCategory->id,
            'user_id' => Auth::user()->id
        ]);
        Cache::forget('product_categories');
        Session::flash('toast', ['message' => 'Data berhasil diubah.']);
        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductCategory $productCategory): RedirectResponse {
        Gate::authorize('delete', $productCategory);
        if ($productCategory->product()->exists()) {
            Session::flash('toast', [
                'message' => 'Gagal menghapus! Kategori barang ini masih digunakan oleh data barang.',
                'type' => 'error'
            ]);
            return back();
        }

        UpdateProductCategoryHistory::where('product_category_id', $productCategory->id)->delete();
        $productCategory->delete();
        Cache::forget('product_categories');
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
        // Ambil user_id dari user yang sedang login
        $userId = Auth::id();

        // Jalankan import dan kirim user_id
        Excel::import(new ProductCategoryImport($userId), $request->file('fileUpload'));
        Cache::forget('product_categories');
        return back();
    }
}
