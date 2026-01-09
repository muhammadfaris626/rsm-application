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
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;

class SaleController extends Controller
{
    protected function applySearch($query, $search) {
        return $query->when($search, function($query, $search) {
            $query->where('invoice_number', 'LIKE', '%' . $search . '%')
                ->orWhere('date', 'LIKE', '%' . $search . '%')
                ->orWhereHas('managementStructure', function($q) use($search) {
                    $q->whereHas('employee', function($q2) use($search) {
                        $q2->where('name', 'LIKE', '%' . $search . '%');
                    });
                });
        });
    }

    public function index(Request $request): Response {
        Gate::authorize('viewAny', Sale::class);
        $user = Auth::user();
        
        // Cache employee data for non-root users
        $employee = null;
        if ($user->roles[0]['name'] !== 'root') {
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
                'listSale:id,sale_id,total_price'
            ])
            ->when($user->roles[0]['name'] !== 'root' && $employee, 
                fn($query) => $query->where('branch_id', $employee->branch_id))
            ->when($request->branch, 
                fn($query) => $query->where('branch_id', $request->branch))
            ->when($request->start_date && $request->end_date, 
                fn($query) => $query->whereBetween('date', [$request->start_date, $request->end_date]))
            ->when($request->technician, 
                fn($query) => $query->where('management_structure_id', $request->technician))
            ->latest();
        
        $this->applySearch($searchQuery, $request->search);
        
        $data = SaleResource::collection($searchQuery->paginate(12));
        
        // Cache branches for filter
        $branches = Cache::remember("branches_for_user_{$user->id}", 300, function() use ($user, $employee) {
            return $user->roles[0]['name'] == 'root' 
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
        $technicians = Cache::remember("technicians_branch_{$employee?->branch_id}", 300, function() use ($user, $employee) {
            $teknisiPosition = Position::select('id')->where('position_name', 'Teknisi')->first();
            
            $techniciansQuery = ManagementStructure::query()
                ->select('id', 'employee_id', 'position_id', 'branch_id')
                ->with('employee:id,name');
            
            if ($user->roles[0]['name'] !== 'root' && $employee) {
                $techniciansQuery->where('branch_id', $employee->branch_id);
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
            'branches' => BranchResource::collection($branches),
            'technicians' => $technicians,
            'selectedBranch' => $request->branch ?? null,
            'selectedStartDate' => $request->start_date ?? null,
            'selectedEndDate' => $request->end_date ?? null,
            'selectedTechnician' => $request->technician ?? null,
        ]);
    }

    public function create(): Response {
        Gate::authorize('create', Sale::class);
        $employee = Employee::where('employee_number', Auth::user()->username)->first();
        $branch = Auth::user()->roles[0]['name'] == 'root' ? Branch::all() : Branch::where('status', 'Aktif')->where('id', $employee->branch_id)->get();
        $teknisiPosition = Position::where('position_name', 'Teknisi')->first();
        $employees = $teknisiPosition 
            ? ManagementStructureResource::collection(ManagementStructure::where('branch_id', $employee->branch_id)->where('position_id', $teknisiPosition->id)->get())
            : ManagementStructureResource::collection(collect());
        return Inertia::render('Products/Sales/CreateSale', [
            'branches' => BranchResource::collection($branch),
            'products' => BranchProductResource::collection(BranchProduct::where('branch_id', $employee->branch_id)->with('product')->get()),
            'employees' => $employees,
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
