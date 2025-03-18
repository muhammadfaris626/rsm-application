<?php

namespace App\Http\Controllers;

use App\Http\Requests\InventoryPurchaseRequest;
use App\Http\Resources\InventoryPurchaseResource;
use App\Http\Resources\ProductResource;
use App\Http\Resources\SupplierResource;
use App\Models\CenterStock;
use App\Models\InventoryPurchase;
use App\Models\ListInventoryPurchase;
use App\Models\Product;
use App\Models\Supplier;
use App\Models\UpdateInventoryPurchaseHistory;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;

class InventoryPurchaseController extends Controller
{
    protected function applySearch($query, $search) {
        return $query->when($search, function($query, $search) {
            $query->where('invoice_number', 'LIKE', '%' . $search . '%')
                ->orWhere('date', 'LIKE', '%' . $search . '%')
                ->orWhereHas('supplier', function($query) use($search) {
                    $query->where('name', 'LIKE', '%' . $search . '%');
                });
        });
    }

    public function index(Request $request): Response {
        Gate::authorize('viewAny', InventoryPurchase::class);
        $searchQuery = InventoryPurchase::query()->latest();
        $this->applySearch($searchQuery, $request->search);
        $data = InventoryPurchaseResource::collection($searchQuery->paginate(12));
        return Inertia::render('Products/InventoryPurchases/IndexInventoryPurchase', [
            'fetchData' => $data,
            'search' => $request->search ?? '',
        ]);
    }

    public function create(): Response {
        Gate::authorize('create', InventoryPurchase::class);
        return Inertia::render('Products/InventoryPurchases/CreateInventoryPurchase', [
            'suppliers' => SupplierResource::collection(Supplier::all()),
            'products' => ProductResource::collection(Product::all()),
            // 'invoice' => "INV-RSM-" . date('mdY') . "-XXXX"
        ]);
    }

    public function store(InventoryPurchaseRequest $request): RedirectResponse {
        Gate::authorize('create', InventoryPurchase::class);
        // $count = (InventoryPurchase::max('id') ?? 0) + 1;
        // $invoiceFormat = 'INV-RSM-' . date('mdY') . "-" . str_pad($count, 4, '0', STR_PAD_LEFT);
        if (empty($request->products)) {
            Session::flash('toast', [ 'message' => 'Silahkan tambah produk terlebih dahulu.', 'type' => 'error' ]);
            return back();
        } else {
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
            for ($i=0; $i < count($request->products); $i++) {
                ListInventoryPurchase::create([
                    'inventory_purchase_id' => $create->id,
                    'product_id' => $request->products[$i]['product_id']['id'],
                    'price' => $request->products[$i]['price'],
                    'quantity' => $request->products[$i]['quantity'],
                    'total_price' => $request->products[$i]['total_price'],
                ]);
                $count = (CenterStock::max('id') ?? 0) + 1;
                CenterStock::create([
                    'inventory_purchase_id' => $create->id,
                    'product_id' => $request->products[$i]['product_id']['id'],
                    'stock' => $request->products[$i]['quantity'],
                    'serial_barcode' => $request->products[$i]['product_id']['product_category_id'][0]['product_category_code'] . 'B' . date('mdY') . str_pad($count, 4, '0', STR_PAD_LEFT)
                ]);
            }
        }
        Session::flash('toast', ['message' => 'Data berhasil ditambahkan.']);
        return to_route('inventoryPurchases.index');
    }

    public function show(InventoryPurchase $inventoryPurchase): Response {
        return Inertia::render('Products/InventoryPurchases/ShowInventoryPurchase', [
            'inventoryPurchase' => new InventoryPurchaseResource($inventoryPurchase)
        ]);
    }

    public function edit(InventoryPurchase $inventoryPurchase): Response {
        Gate::authorize('update', $inventoryPurchase);
        return Inertia::render('Products/InventoryPurchases/EditInventoryPurchase', [
            'inventoryPurchase' => new InventoryPurchaseResource($inventoryPurchase),
            'suppliers' => SupplierResource::collection(Supplier::all()),
            'products' => ProductResource::collection(Product::all())
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

        CenterStock::where('inventory_purchase_id', $inventoryPurchase->id)
            ->whereNotIn('product_id', $existingProductIds)
            ->delete();

        foreach ($request->products as $product) {
            $productId = is_array($product['product_id']) ? $product['product_id']['id'] : $product['product_id'];

            // Cari kategori produk
            $categoryCode = '';
            if (is_array($product['product_id']) && isset($product['product_id']['product_category_id'][0]['product_category_code'])) {
                $categoryCode = $product['product_id']['product_category_id'][0]['product_category_code'];
            } else {
                // Jika product_id berupa integer, ambil data dari database
                $productData = Product::with('productCategory')->find($productId);
                if ($productData && isset($productData->productCategory->product_category_code)) {
                    $categoryCode = $productData->productCategory->product_category_code;
                }
            }
            ListInventoryPurchase::updateOrCreate(
                [
                    'inventory_purchase_id' => $inventoryPurchase->id,
                    'product_id' => $product['product_id']['id']
                ],
                [
                    'price' => $product['price'],
                    'quantity' => $product['quantity'],
                    'total_price' => $product['total_price']
                ]
            );

            $count = (CenterStock::max('id') ?? 0) + 1;
            $serialBarcode = $categoryCode . 'B' . date('mdY') . str_pad($count, 4, '0', STR_PAD_LEFT);
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

        // Hapus data di tabel list_inventory_purchases terlebih dahulu
        foreach ($inventoryPurchase->listInventoryPurchase as $item) {
            $item->delete();
        }

        foreach ($inventoryPurchase->centerStock as $item) {
            $item->delete();
        }

        // Hapus riwayat perubahan
        UpdateInventoryPurchaseHistory::where('inventory_purchase_id', $inventoryPurchase->id)->delete();

        // Hapus data utama
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
