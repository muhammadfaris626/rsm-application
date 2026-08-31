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
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;

class SaleController extends Controller
{
    protected function applySearch($query, $search) {
        return $query->when($search, function($query, $search) {
            $query->where(function($query) use($search) {
                $query->where('invoice_number', 'LIKE', '%' . $search . '%')
                    ->orWhere('date', 'LIKE', '%' . $search . '%')
                    ->orWhereHas('managementStructure', function($q) use($search) {
                        $q->whereHas('employee', function($q2) use($search) {
                            $q2->where('name', 'LIKE', '%' . $search . '%');
                        });
                    });
            });
        });
    }

    public function index(Request $request): Response {
        Gate::authorize('viewAny', Sale::class);
        $user = Auth::user();
        $isCentralUser = $user->hasRole(['root', 'admin-pusat']);
        
        // Cache employee data for non-root users
        $employee = null;
        if (!$isCentralUser) {
            $employee = Cache::remember("employee_{$user->username}", 300, function() use ($user) {
                return Employee::select('id', 'employee_number', 'branch_id')
                    ->where('employee_number', $user->username)
                    ->first();
            });
        }
        
        // Optimized query with eager loading
        $searchQuery = Sale::query()
            ->select('id', 'branch_id', 'invoice_number', 'date', 'management_structure_id', 'created_at', 'updated_at')
            ->with([
                'branch:id,branch_name,branch_code',
                'managementStructure:id,employee_id,position_id',
                'managementStructure.employee:id,name',
                'listSale:id,sale_id,branch_product_id,quantity,total_price',
                'listSale.branchProduct:id,product_id,quantity,serial_barcode',
                'listSale.branchProduct.product:id,product_name',
                'latestUpdateSaleHistory.user:id,name'
            ])
            ->when(!$isCentralUser && $employee,
                fn($query) => $query->where('branch_id', $employee->branch_id))
            ->when(!$isCentralUser && !$employee,
                fn($query) => $query->whereRaw('1 = 0'))
            ->when($request->branch, 
                fn($query) => $query->where('branch_id', $request->branch))
            ->when($request->start_date && $request->end_date, 
                fn($query) => $query->whereBetween('date', [$request->start_date, $request->end_date]))
            ->when($request->technician, 
                fn($query) => $query->where('management_structure_id', $request->technician))
            ->latest();
        
        $this->applySearch($searchQuery, $request->search);
        
        $data = SaleResource::collection($searchQuery->paginate(12)->withQueryString());
        
        // Cache branches for filter
        $branches = fn () => Cache::remember("branches_for_user_{$user->id}", 300, function() use ($isCentralUser, $employee) {
            return $isCentralUser
                ? Branch::select('id', 'branch_code', 'branch_name', 'status')
                    ->where('status', 'Aktif')
                    ->get() 
                : ($employee 
                    ? Branch::select('id', 'branch_code', 'branch_name', 'status')
                        ->where('status', 'Aktif')
                        ->where('id', $employee->branch_id)
                        ->get() 
                    : collect());
        });
        
        // Cache technicians
        $techniciansCacheKey = $isCentralUser ? 'central' : ($employee?->branch_id ?? 'none');
        $technicians = fn () => Cache::remember("technicians_branch_{$techniciansCacheKey}", 300, function() use ($isCentralUser, $employee) {
            $teknisiPosition = Position::select('id')->where('position_name', 'Teknisi')->first();
            
            $techniciansQuery = ManagementStructure::query()
                ->select('id', 'employee_id', 'position_id', 'branch_id')
                ->with('employee:id,name');
            
            if (!$isCentralUser && $employee) {
                $techniciansQuery->where('branch_id', $employee->branch_id);
            }
            if (!$isCentralUser && !$employee) {
                $techniciansQuery->whereRaw('1 = 0');
            }
            if ($teknisiPosition) {
                $techniciansQuery->where('position_id', $teknisiPosition->id);
            }
            
            return $techniciansQuery->get()->map(function($item) {
                return [
                    'id' => $item->id,
                    'employee_id' => $item->employee_id,
                    'label' => $item->employee?->name ?? 'N/A',
                ];
            })->toArray();
        });
        
        return Inertia::render('Products/Sales/IndexSale', [
            'fetchData' => $data,
            'search' => $request->search ?? '',
            'branches' => fn () => BranchResource::collection($branches()),
            'technicians' => fn () => $technicians(),
            'selectedBranch' => $request->branch ?? null,
            'selectedStartDate' => $request->start_date ?? null,
            'selectedEndDate' => $request->end_date ?? null,
            'selectedTechnician' => $request->technician ?? null,
        ]);
    }

    public function create(): Response {
        Gate::authorize('create', Sale::class);
        $user = Auth::user();
        $isCentralUser = $user->hasRole(['root', 'admin-pusat']);
        $employee = $isCentralUser ? null : Employee::where('employee_number', $user->username)->first();
        $branch = $isCentralUser
            ? Branch::where('status', 'Aktif')->get()
            : ($employee
                ? Branch::where('status', 'Aktif')->where('id', $employee->branch_id)->get()
                : collect());
        $branchIds = $branch->pluck('id');
        $teknisiPosition = Position::where('position_name', 'Teknisi')->first();
        $employeesQuery = ManagementStructure::query()
            ->with(['employee', 'position', 'branch'])
            ->when($branchIds->isNotEmpty(), fn($query) => $query->whereIn('branch_id', $branchIds))
            ->when(!$isCentralUser && !$employee, fn($query) => $query->whereRaw('1 = 0'));

        if ($teknisiPosition) {
            $employeesQuery->where('position_id', $teknisiPosition->id);
        } else {
            $employeesQuery->whereRaw('1 = 0');
        }

        $products = BranchProduct::query()
            ->with(['branch', 'product.productCategory'])
            ->when($branchIds->isNotEmpty(), fn($query) => $query->whereIn('branch_id', $branchIds))
            ->when($branchIds->isEmpty(), fn($query) => $query->whereRaw('1 = 0'))
            ->get();

        return Inertia::render('Products/Sales/CreateSale', [
            'branches' => BranchResource::collection($branch),
            'products' => BranchProductResource::collection($products),
            'employees' => ManagementStructureResource::collection($employeesQuery->get()),
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
            $branchId = $request->branch_id['id'];
            $technician = ManagementStructure::find($request->management_structure_id['id']);
            if (!$technician || (int) $technician->branch_id !== (int) $branchId) {
                Session::flash('toast', [
                    'message' => 'Teknisi harus sesuai dengan cabang penjualan.',
                    'type' => 'error'
                ]);
                return back();
            }

            $branchProductIds = collect($request->products)
                ->pluck('branch_product_id.id')
                ->filter()
                ->values();

            $hasInvalidBranchProduct = BranchProduct::whereIn('id', $branchProductIds)
                ->where('branch_id', '!=', $branchId)
                ->exists();

            if ($hasInvalidBranchProduct) {
                Session::flash('toast', [
                    'message' => 'Barang penjualan harus berasal dari cabang yang dipilih.',
                    'type' => 'error'
                ]);
                return back();
            }

            $branchProducts = BranchProduct::query()
                ->select('id', 'product_id', 'quantity')
                ->with('product:id,product_name')
                ->whereIn('id', $branchProductIds)
                ->get()
                ->keyBy('id');
            $insufficientStock = [];
            foreach ($request->products as $product) {
                $productId = $product['branch_product_id']['id'];
                $requestedQuantity = $product['quantity'];
                $branchProduct = $branchProducts->get($productId);
                $availableStock = $branchProduct?->quantity ?? 0;
                if ($requestedQuantity > $availableStock) {
                    $insufficientStock[] = $branchProduct?->product?->product_name ?? 'Barang tidak ditemukan';
                }
            }
            if (!empty($insufficientStock)) {
                Session::flash('toast', [
                    'message' => 'Stok tidak mencukupi untuk produk: ' . implode(", ", $insufficientStock),
                    'type' => 'error'
                ]);
                return back();
            }
            DB::transaction(function () use ($request, $branchId, $invoiceFormat, $technician, $branchProducts): void {
                $create = Sale::create([
                    'branch_id' => $branchId,
                    'invoice_number' => $invoiceFormat,
                    'date' => $request->date,
                    'management_structure_id' => $technician->id
                ]);
                UpdateSaleHistory::create([
                    'sale_id' => $create->id,
                    'user_id' => Auth::id(),
                ]);
                foreach ($request->products as $item) {
                    $branchProduct = $branchProducts->get($item['branch_product_id']['id']);
                    ListSale::create([
                        'sale_id' => $create->id,
                        'branch_product_id' => $branchProduct->id,
                        'price' => $item['price'],
                        'quantity' => $item['quantity'],
                        'total_price' => $item['total_price'],
                    ]);
                    $branchProduct->update([
                        'quantity' => (int) $branchProduct->quantity - (int) $item['quantity'],
                    ]);
                }
            });
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
    public function destroy(Sale $sale): RedirectResponse
    {
        Gate::authorize('delete', $sale);

        foreach ($sale->listSale as $item) {
            BranchProduct::where('id', $item->branch_product_id)
                ->increment('quantity', (int) $item->quantity);
        }

        ListSale::where('sale_id', $sale->id)->delete();
        UpdateSaleHistory::where('sale_id', $sale->id)->delete();
        $sale->delete();

        Session::flash('toast', ['message' => 'Data penjualan berhasil dihapus.']);
        return back();
    }
}
