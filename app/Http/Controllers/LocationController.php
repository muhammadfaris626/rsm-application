<?php

namespace App\Http\Controllers;

use App\Http\Resources\BranchResource;
use App\Models\Branch;
use App\Models\Location;
use App\Traits\OptimizedQueries;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;
use Illuminate\Support\Facades\Session;

class LocationController extends Controller
{
    use OptimizedQueries;

    public function index()
    {
        Gate::authorize('viewAny', Location::class);
        return Inertia::render('Database/Locations/IndexLocation');
    }

    public function create(): Response {
        Gate::authorize('create', Location::class);
        
        // Use cached branches
        $branches = $this->getCachedActiveBranches();
        
        return Inertia::render('Database/Locations/CreateLocation', [
            'branches' => BranchResource::collection($branches),
        ]);
    }

    public function destroy(Location $location): RedirectResponse {
        Gate::authorize('delete', $location);
        $location->delete();
        Session::flash('toast', [
            'message' => 'Data berhasil dihapus.'
        ]);
        return back();
    }
}
