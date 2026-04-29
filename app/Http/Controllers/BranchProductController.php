<?php

namespace App\Http\Controllers;

use App\Http\Resources\BranchProductResource;
use App\Models\BranchProduct;
use App\Models\Employee;
use App\Traits\OptimizedQueries;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;

class BranchProductController extends Controller
{
    use OptimizedQueries;

    protected function applySearch($query, $search) {
        return $query->when($search, function($query, $search) {
            $query->where(function($query) use($search) {
                $query->whereHas('branch', function($query) use($search) {
                    $query->where('branch_name', 'LIKE', '%' . $search . '%');
                })
                ->orWhereHas('product', function($query) use($search) {
                    $query->where('product_name', 'LIKE', '%' . $search . '%');
                })
                ->orWhere('quantity', 'LIKE', '%' . $search . '%');
            });
        });
    }

    public function index(Request $request): Response {
        Gate::authorize('viewAny', BranchProduct::class);
        $user = Auth::user();
        $isCentralUser = $user->hasRole(['root', 'admin-pusat']);
        
        // Use cached employee
        $employee = !$isCentralUser
            ? $this->getCachedEmployee($user->username, true) 
            : null;
        
        $searchQuery = BranchProduct::query()
            ->with([
                'product:id,product_name,product_category_id', 
                'branch:id,branch_name,branch_code'
            ])
            ->when(!$isCentralUser && $employee,
                fn($query) => $query->where('branch_id', $employee->branch_id))
            ->when(!$isCentralUser && !$employee,
                fn($query) => $query->whereRaw('1 = 0'))
            ->selectRaw('MIN(id) as id, branch_id, product_id, SUM(quantity) as total_stock, MAX(serial_barcode) as serial_barcode, MAX(created_at) as latest_created_at')
            ->groupBy('branch_id', 'product_id')
            ->orderByDesc('latest_created_at');

        $this->applySearch($searchQuery, $request->search);

        $data = $searchQuery->paginate(12);
        
        return Inertia::render('Products/BranchProducts/IndexBranchProduct', [
            'fetchData' => [
                'data' => $data->items(),
                'meta' => [
                    'current_page' => $data->currentPage(),
                    'from' => $data->firstItem(),
                    'last_page' => $data->lastPage(),
                    'links' => $data->linkCollection()->toArray(),
                    'path' => request()->url(),
                    'per_page' => $data->perPage(),
                    'to' => $data->lastItem(),
                    'total' => $data->total(),
                ],
            ],
            'search' => $request->search ?? ''
        ]);
    }

    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        //
    }

    public function show(BranchProduct $branchProduct)
    {
        //
    }

    public function edit(BranchProduct $branchProduct)
    {
        //
    }

    public function update(Request $request, BranchProduct $branchProduct)
    {
        //
    }

    public function destroy(BranchProduct $branchProduct)
    {
        //
    }
}
