<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Http\Resources\ProductCategoryResource;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\UpdateProductHistory;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    protected function applySearch($query, $search) {
        return $query->when($search, function($query, $search) {
            $query->where('product_name', 'LIKE', '%' . $search . '%')
                ->orWhere('serial_barcode', 'LIKE', '%' . $search . '%')
                ->orWhereHas('productCategory', function($query) use($search) {
                    $query->where('product_category_name', 'LIKE', '%' . $search . '%');
                });
        });
    }

    public function index(Request $request): Response {
        Gate::authorize('viewAny', Product::class);
        $searchQuery = Product::query()->latest();
        $this->applySearch($searchQuery, $request->search);
        $data = ProductResource::collection($searchQuery->paginate(12));
        return Inertia::render('Database/Products/IndexProduct', [
            'fetchData' => $data,
            'search' => $request->search ?? '',
            'productCategories' => ProductCategoryResource::collection(ProductCategory::all())
        ]);
    }

    public function create()
    {
        //
    }

    public function store(ProductRequest $request): RedirectResponse {
        Gate::authorize('create', Product::class);
        $product = Product::create([
            'product_category_id' => $request->product_category_id['id'],
            'product_name' => $request->product_name,
            'serial_barcode' => $request->serial_barcode
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
            'product_category_id' => $request->product_category_id['id'],
            'product_name' => $request->product_name,
            'serial_barcode' => $request->serial_barcode
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
        UpdateProductHistory::where('product_id', $product->id)->delete();
        $product->delete();
        Session::flash('toast', ['message' => 'Data berhasil dihapus.']);
        return back();
    }
}
