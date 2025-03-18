<?php

namespace App\Http\Controllers;

use App\Http\Resources\BranchProductResource;
use App\Models\BranchProduct;
use App\Models\Employee;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;

class BranchProductController extends Controller
{
    protected function applySearch($query, $search) {
        return $query->when($search, function($query, $search) {
            $query->whereHas('branch', function($query) use($search) {
                $query->where('branch_name', 'LIKE', '%' . $search . '%');
            })
            ->orWhereHas('product', function($query) use($search) {
                $query->where('product_name', 'LIKE', '%' . $search . '%');
            })
            ->orWhere('quantity', 'LIKE', '%' . $search . '%');
        });
    }

    public function index(Request $request): Response {
        Gate::authorize('viewAny', BranchProduct::class);
        $user = Auth::user();
        $employee = Employee::where('employee_number', $user->username)->first();
        // $searchQuery = BranchProduct::query()
        //     ->when($user->roles[0]['name'] !== 'root', fn($query) => $query->where('branch_id', $employee->branch_id))
        //     ->latest();
        // $this->applySearch($searchQuery, $request->search);
        // $data = BranchProductResource::collection($searchQuery->paginate(12));
        $searchQuery = BranchProduct::query()
            ->with(['product', 'branch'])
            ->when($user->roles[0]['name'] !== 'root', fn($query) => $query->where('branch_id', $employee->branch_id))
            ->selectRaw('branch_id, product_id, SUM(quantity) as total_stock, MAX(created_at) as latest_created_at')
            ->groupBy('branch_id', 'product_id')
            ->orderByDesc('latest_created_at'); // Urutkan berdasarkan created_at terbaru

        $this->applySearch($searchQuery, $request->search);

        $data = $searchQuery->paginate(12);
        return Inertia::render('Products/BranchProducts/IndexBranchProduct', [
            'fetchData' => [
                'data' => $data->items(), // Hanya data produk
                'meta' => [
                    'current_page' => $data->currentPage(),
                    'from' => $data->firstItem(),
                    'last_page' => $data->lastPage(),
                    'links' => $data->linkCollection()->toArray(), // Pastikan links dalam bentuk array
                    'path' => request()->url(),
                    'per_page' => $data->perPage(),
                    'to' => $data->lastItem(),
                    'total' => $data->total(),
                ],
            ],
            'search' => $request->search ?? ''
        ]);

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(BranchProduct $branchProduct)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BranchProduct $branchProduct)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, BranchProduct $branchProduct)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BranchProduct $branchProduct)
    {
        //
    }
}
