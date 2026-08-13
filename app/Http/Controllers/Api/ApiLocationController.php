<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\LocationResource;
use App\Models\Location;
use Illuminate\Http\Request;

class ApiLocationController extends Controller
{
    private function fieldIdFromRequest($value): mixed
    {
        if (is_array($value)) {
            return $value['id'] ?? $value[0]['id'] ?? null;
        }

        if (is_object($value)) {
            return $value->id ?? null;
        }

        return $value;
    }

    private function applySearch($query, $search) {
        if (!empty($search)) {
            $query->where(function($query) use($search) {
                $query->whereHas('branch', function($q) use($search) {
                    $q->where('branch_name', 'LIKE', "%{$search}%");
                })->orWhere('coordinates', 'LIKE', "%{$search}%");
            });
        }
    }

    public function index(Request $request) {
        // Optimized with select and eager loading
        $query = Location::query()
            ->select('id', 'branch_id', 'coordinates')
            ->with('branch:id,branch_name,branch_code');
        
        $this->applySearch($query, $request->search);
        $perPage = $request->get('per_page', 12);
        $locations = $query->paginate($perPage)->withQueryString();
        
        return response()->json([
            'data' => LocationResource::collection($locations)->response()->getData(true),
        ]);
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'branch_id' => 'required',
            'coordinates' => 'required'
        ]);
        $validated['branch_id'] = $this->fieldIdFromRequest($request->branch_id);
        $create = Location::create($validated);
        return response()->json([
            'data' => $create
        ]);
    }
}
