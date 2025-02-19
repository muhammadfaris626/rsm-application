<?php

namespace App\Http\Controllers;

use App\Http\Requests\SaleRequest;
use App\Http\Resources\BranchProductResource;
use App\Http\Resources\BranchResource;
use App\Http\Resources\EmployeeResource;
use App\Http\Resources\ManagementStructureResource;
use App\Http\Resources\SaleResource;
use App\Models\Branch;
use App\Models\BranchProduct;
use App\Models\Employee;
use App\Models\ListSale;
use App\Models\ManagementStructure;
use App\Models\Position;
use App\Models\Sale;
use App\Models\UpdateSaleHistory;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;

class SaleController extends Controller
{
    protected function applySearch($query, $search) {
        return $query->when($search, function($query, $search) {
            $query->where('invoice_number', 'LIKE', '%' . $search . '%')
                ->orWhere('date', 'LIKE', '%' . $search . '%');
        });
    }

    public function index(Request $request): Response {
        Gate::authorize('viewAny', Sale::class);
        $user = Auth::user();
        $employee = Employee::where('employee_number', $user->username)->first();
        $searchQuery = Sale::query()->when($user->roles[0]['name'] !== 'root', fn($query) => $query->where('branch_id', $employee->branch_id))->latest();
        $this->applySearch($searchQuery, $request->search);
        $data = SaleResource::collection($searchQuery->paginate(12));
        return Inertia::render('Products/Sales/IndexSale', [
            'fetchData' => $data,
            'search' => $request->search ?? '',
        ]);
    }

    public function create(): Response {
        Gate::authorize('create', Sale::class);
        $employee = Employee::where('employee_number', Auth::user()->username)->first();
        $branch = Auth::user()->roles[0]['name'] == 'root' ? Branch::all() : Branch::where('status', 'Aktif')->where('id', $employee->branch_id)->get();
        return Inertia::render('Products/Sales/CreateSale', [
            'branches' => BranchResource::collection($branch),
            'products' => BranchProductResource::collection(BranchProduct::where('branch_id', $employee->branch_id)->with('product')->get()),
            'employees' => ManagementStructureResource::collection(ManagementStructure::where('branch_id', $employee->branch_id)->where('position_id', Position::where('position_name', 'Teknisi')->first()->id)->get()),
            'invoice' => 'INV-P-RSM-' . date('mdY') . '-XXXX'
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SaleRequest $request): RedirectResponse {
        Gate::authorize('create', Sale::class);
        $count = (Sale::max('id') ?? 0) + 1;
        $invoiceFormat = 'INV-P-RSM-' . date('mdY') . '-' . str_pad($count, 4, '0', STR_PAD_LEFT);
        if (empty($request->products)) {
            Session::flash('toast', ['message' => 'Silahkan tambah barang terlebih dahulu.', 'type' => 'error']);
            return back();
        } else {
            $request->validate([
                'products.*.branch_product_id' => 'required',
                'products.*.price' => 'required',
                'products.*.quantity' => 'required'
            ], [
                'products.*.branch_product_id.required' => 'Kolom barang wajib diisi.',
                'products.*.price.required' => 'Kolom harga barang wajib diisi.',
                'products.*.quantity.required' => 'Kolom total barang wajib diisi.'
            ]);
            $insufficientStock = [];
            foreach ($request->products as $product) {
                $productId = $product['branch_product_id']['id'];
                $requestedQuantity = $product['quantity'];
                $availableStock = BranchProduct::find($productId)->quantity ?? 0;
                if ($requestedQuantity > $availableStock) {
                    $insufficientStock[] = BranchProduct::find($productId)->product->product_name;
                }
            }
            if (!empty($insufficientStock)) {
                Session::flash('toast', [
                    'message' => 'Stok tidak mencukupi untuk produk: ' . implode(", ", $insufficientStock),
                    'type' => 'error'
                ]);
                return back();
            }
            $create = Sale::create([
                'branch_id' => $request->branch_id['id'],
                'invoice_number' => $invoiceFormat,
                'date' => $request->date,
                'management_structure_id' => $request->management_structure_id['id']
            ]);
            UpdateSaleHistory::create([
                'sale_id' => $create->id,
                'user_id' => Auth::user()->id,
            ]);
            for ($i=0; $i < count($request->products); $i++) {
                ListSale::create([
                    'sale_id' => $create->id,
                    'branch_product_id' => $request->products[$i]['branch_product_id']['id'],
                    'price' => $request->products[$i]['price'],
                    'quantity' => $request->products[$i]['quantity'],
                    'total_price' => $request->products[$i]['total_price']
                ]);
                $product = BranchProduct::where('id', $request->products[$i]['branch_product_id']['id'])->first();
                $product->update([
                    'quantity' => $product->quantity - $request->products[$i]['quantity']
                ]);
            }
        }
        Session::flash('toast', ['message' => 'Data penjualan berhasil ditambahkan.']);
        return to_route('sales.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Sale $sale)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Sale $sale)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Sale $sale)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Sale $sale)
    {
        //
    }
}
