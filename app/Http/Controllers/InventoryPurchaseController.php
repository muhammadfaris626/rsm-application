<?php

namespace App\Http\Controllers;

use App\Http\Requests\InventoryPurchaseRequest;
use App\Http\Resources\InventoryPurchaseResource;
use App\Http\Resources\ProductResource;
use App\Http\Resources\SupplierResource;
use App\Models\CenterStock;
use App\Models\InventoryPurchase;
use App\Models\ListInventoryPurchase;
use App\Models\ListRequestOrder;
use App\Models\Product;
use App\Models\Supplier;
use App\Models\UpdateInventoryPurchaseHistory;
use App\Traits\OptimizedQueries;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;

class InventoryPurchaseController extends Controller
{
    use OptimizedQueries;

    protected function applySearch($query, $search) {
        return $query->when($search, function($query, $search) {
            $query->where(function($query) use($search) {
                $query->where('invoice_number', 'LIKE', '%' . $search . '%')
                    ->orWhere('date', 'LIKE', '%' . $search . '%')
                    ->orWhereHas('supplier', function($query) use($search) {
                        $query->where('name', 'LIKE', '%' . $search . '%');
                    });
            });
        });
    }

    public function index(Request $request): Response {
        Gate::authorize('viewAny', InventoryPurchase::class);
        
        // Optimized query with eager loading
        $searchQuery = InventoryPurchase::query()
            ->select('id', 'invoice_number', 'date', 'supplier_id', 'created_at', 'updated_at')
            ->with([
                'supplier:id,name',
                'listInventoryPurchase:id,inventory_purchase_id,product_id,price,quantity,total_price',
                'listInventoryPurchase.product:id,product_name',
                'latestUpdateInventoryPurchaseHistory.user:id,name'
            ])
            ->latest();
        
        $this->applySearch($searchQuery, $request->search);
        $data = InventoryPurchaseResource::collection($searchQuery->paginate(12)->withQueryString());
        
        return Inertia::render('Products/InventoryPurchases/IndexInventoryPurchase', [
            'fetchData' => $data,
            'search' => $request->search ?? '',
        ]);
    }

    public function create(): Response {
        Gate::authorize('create', InventoryPurchase::class);
        
        // Use cached data
        $suppliers = $this->getCachedSuppliers();
        $products = $this->getCachedProducts();
        
        return Inertia::render('Products/InventoryPurchases/CreateInventoryPurchase', [
            'suppliers' => SupplierResource::collection($suppliers),
            'products' => ProductResource::collection($products),
        ]);
    }

    public function store(InventoryPurchaseRequest $request): RedirectResponse {
        Gate::authorize('create', InventoryPurchase::class);
        
        if (empty($request->products)) {
            Session::flash('toast', [ 'message' => 'Silahkan tambah produk terlebih dahulu.', 'type' => 'error' ]);
            return back();
        }
        
        $request->validate([
            'products.*.product_id' => 'required',
            'products.*.price' => 'required',
            'products.*.quantity' => 'required'
        ], [
            'products.*.product_id.required' => 'Kolom barang wajib diisi.',
            'products.*.price.required' => 'Kolom harga barang wajib diisi.',
            'products.*.quantity.required' => 'Kolom total barang wajib diisi.'
        ]);
        
        $create = InventoryPurchase::create([
            'invoice_number' => $request->invoice_number,
            'date' => $request->date,
            'supplier_id' => $request->supplier_id['id'],
        ]);
        
        UpdateInventoryPurchaseHistory::create([
            'inventory_purchase_id' => $create->id,
            'user_id' => Auth::user()->id
        ]);
        
        $nextCenterStockId = (CenterStock::max('id') ?? 0) + 1;
        foreach ($request->products as $product) {
            ListInventoryPurchase::create([
                'inventory_purchase_id' => $create->id,
                'product_id' => $product['product_id']['id'],
                'price' => $product['price'],
                'quantity' => $product['quantity'],
                'total_price' => $product['total_price'],
            ]);
            
            CenterStock::create([
                'inventory_purchase_id' => $create->id,
                'product_id' => $product['product_id']['id'],
                'stock' => $product['quantity'],
                'serial_barcode' => $product['product_id']['product_category_id'][0]['product_category_code'] . 'B' . date('mdY') . str_pad($nextCenterStockId++, 4, '0', STR_PAD_LEFT)
            ]);
        }
        
        Session::flash('toast', ['message' => 'Data berhasil ditambahkan.']);
        return to_route('inventoryPurchases.index');
    }

    public function show(InventoryPurchase $inventoryPurchase): Response {
        return Inertia::render('Products/InventoryPurchases/ShowInventoryPurchase', [
            'inventoryPurchase' => new InventoryPurchaseResource($inventoryPurchase->load([
                'supplier:id,name',
                'listInventoryPurchase.product:id,product_name'
            ]))
        ]);
    }

    public function edit(InventoryPurchase $inventoryPurchase): Response {
        Gate::authorize('update', $inventoryPurchase);
        
        // Use cached data
        $suppliers = $this->getCachedSuppliers();
        $products = $this->getCachedProducts();
        
        return Inertia::render('Products/InventoryPurchases/EditInventoryPurchase', [
            'inventoryPurchase' => new InventoryPurchaseResource($inventoryPurchase->load([
                'supplier:id,name',
                'listInventoryPurchase.product:id,product_name,product_category_id'
            ])),
            'suppliers' => SupplierResource::collection($suppliers),
            'products' => ProductResource::collection($products)
        ]);
    }

    public function update(InventoryPurchaseRequest $request, InventoryPurchase $inventoryPurchase): RedirectResponse {
        Gate::authorize('update', $inventoryPurchase);

        if (empty($request->products)) {
            Session::flash('toast', ['message' => 'Silahkan tambah produk terlebih dahulu.', 'type' => 'error']);
            return back();
        }

        $request->validate([
            'products.*.product_id' => 'required',
            'products.*.price' => 'required',
            'products.*.quantity' => 'required'
        ], [
            'products.*.product_id.required' => 'Kolom barang wajib diisi.',
            'products.*.price.required' => 'Kolom harga barang wajib diisi.',
            'products.*.quantity.required' => 'Kolom total barang wajib diisi.'
        ]);

        $inventoryPurchase->update([
            'invoice_number' => $request->invoice_number,
            'date' => $request->date,
            'supplier_id' => isset($request->supplier_id['id']) ? $request->supplier_id['id'] : $request->supplier_id[0]['id'],
        ]);

        UpdateInventoryPurchaseHistory::create([
            'inventory_purchase_id' => $inventoryPurchase->id,
            'user_id' => Auth::user()->id
        ]);

        // Hapus produk lama yang tidak ada di request
        $existingProductIds = collect($request->products)->pluck('product_id.id')->toArray();
        ListInventoryPurchase::where('inventory_purchase_id', $inventoryPurchase->id)
            ->whereNotIn('product_id', $existingProductIds)
            ->delete();

        $removedCenterStockIds = CenterStock::where('inventory_purchase_id', $inventoryPurchase->id)
            ->whereNotIn('product_id', $existingProductIds)
            ->pluck('id');

        if ($removedCenterStockIds->isNotEmpty() && ListRequestOrder::whereIn('center_stock_id', $removedCenterStockIds)->exists()) {
            Session::flash('toast', [
                'message' => 'Barang tidak dapat dihapus dari pembelian karena sudah dipakai pada permintaan stok.',
                'type' => 'error'
            ]);
            return back();
        }

        CenterStock::whereIn('id', $removedCenterStockIds)->delete();

        $productIds = collect($request->products)
            ->map(fn ($product) => is_array($product['product_id']) ? $product['product_id']['id'] : $product['product_id'])
            ->filter()
            ->unique();
        $productCategoryCodes = Product::query()
            ->with('productCategory:id,product_category_code')
            ->whereIn('id', $productIds)
            ->get()
            ->mapWithKeys(fn (Product $product) => [
                $product->id => $product->productCategory?->product_category_code ?? '',
            ]);
        $nextCenterStockId = (CenterStock::max('id') ?? 0) + 1;

        foreach ($request->products as $product) {
            $productId = is_array($product['product_id']) ? $product['product_id']['id'] : $product['product_id'];

            $categoryCode = '';
            if (is_array($product['product_id']) && isset($product['product_id']['product_category_id'][0]['product_category_code'])) {
                $categoryCode = $product['product_id']['product_category_id'][0]['product_category_code'];
            } else {
                $categoryCode = $productCategoryCodes->get($productId, '');
            }
            
            ListInventoryPurchase::updateOrCreate(
                [
                    'inventory_purchase_id' => $inventoryPurchase->id,
                    'product_id' => $productId
                ],
                [
                    'price' => $product['price'],
                    'quantity' => $product['quantity'],
                    'total_price' => $product['total_price']
                ]
            );

            $serialBarcode = $categoryCode . 'B' . date('mdY') . str_pad($nextCenterStockId++, 4, '0', STR_PAD_LEFT);
            CenterStock::updateOrCreate(
                [
                    'inventory_purchase_id' => $inventoryPurchase->id,
                    'product_id' => $productId
                ],
                [
                    'stock' => $product['quantity'],
                    'serial_barcode' => $serialBarcode
                ]
            );
        }

        Session::flash('toast', ['message' => 'Data berhasil diperbarui.']);
        return to_route('inventoryPurchases.index');
    }

    public function destroy(InventoryPurchase $inventoryPurchase): RedirectResponse {
        Gate::authorize('delete', $inventoryPurchase);
        $centerStockIds = CenterStock::where('inventory_purchase_id', $inventoryPurchase->id)->pluck('id');
        if ($centerStockIds->isNotEmpty() && ListRequestOrder::whereIn('center_stock_id', $centerStockIds)->exists()) {
            Session::flash('toast', [
                'message' => 'Pembelian persediaan tidak dapat dihapus karena stoknya sudah dipakai pada permintaan stok.',
                'type' => 'error'
            ]);
            return back();
        }

        // Delete related records
        ListInventoryPurchase::where('inventory_purchase_id', $inventoryPurchase->id)->delete();
        CenterStock::whereIn('id', $centerStockIds)->delete();
        UpdateInventoryPurchaseHistory::where('inventory_purchase_id', $inventoryPurchase->id)->delete();
        
        $inventoryPurchase->delete();

        Session::flash('toast', ['message' => 'Data berhasil dihapus.']);
        return back();
    }

    public function printBarcode(Request $request): Response {
        return Inertia::render('Products/InventoryPurchases/PrintBarcode', [
            'selectedCheckbox' => $request->selectedCheckbox,
            'jumlahCetak' => $request->jumlahCetak
        ]);
    }
}
