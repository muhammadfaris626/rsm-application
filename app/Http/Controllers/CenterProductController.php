<?php

namespace App\Http\Controllers;

use App\Http\Resources\CenterProductResource;
use App\Models\CenterStock;
use App\Traits\OptimizedQueries;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;

class CenterProductController extends Controller
{
    use OptimizedQueries;

    protected function applySearch($query, $search) {
        return $query->when($search, function($query, $search) {
            $query->whereHas('product', function($query) use($search) {
                $query->where('product_name', 'LIKE', '%' . $search . '%');
            })
            ->orWhere('stock', 'LIKE', '%' . $search . '%');
        });
    }

    public function index(Request $request): Response {
        Gate::authorize('viewAny', CenterStock::class);
        
        // Optimized query with eager loading
        $searchQuery = CenterStock::query()
            ->select('id', 'inventory_purchase_id', 'product_id', 'stock', 'serial_barcode', 'created_at', 'updated_at')
            ->with([
                'product:id,product_name,product_category_id',
                'product.productCategory:id,product_category_name'
            ]);
        
        $this->applySearch($searchQuery, $request->search);
        $data = CenterProductResource::collection($searchQuery->paginate(12));
        
        return Inertia::render('Products/CenterProducts/IndexCenterProduct', [
            'fetchData' => $data,
            'search' => $request->search ?? ''
        ]);
    }
}
