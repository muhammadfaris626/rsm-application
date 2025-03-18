<?php

namespace App\Http\Controllers;

use App\Http\Resources\CenterProductResource;
use App\Models\CenterStock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;

class CenterProductController extends Controller
{
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
        $searchQuery = CenterStock::query();
        $this->applySearch($searchQuery, $request->search);
        $data = CenterProductResource::collection($searchQuery->paginate(12));
        return Inertia::render('Products/CenterProducts/IndexCenterProduct', [
            'fetchData' => $data,
            'search' => $request->search ?? ''
        ]);
    }
}
