<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\LocationResource;
use App\Models\Location;
use Illuminate\Http\Request;

class ApiLocationController extends Controller
{
    private function applySearch($query, $search) {
        if (!empty($search)) {
            $query->whereHas('branch', function($q) use($search) {
                $q->where('branch_name', 'LIKE', "%{$search}%");
            })->orWhere('coordinates', 'LIKE', "%{$search}%");
        }
    }

    public function index(Request $request) {
        $query = Location::with('branch');
        $this->applySearch($query, $request->search);
        $perPage = $request->get('per_page', 12);
        $locations = $query->paginate($perPage);
        return response()->json([
            'data' => LocationResource::collection($locations)->response()->getData(true),
        ]);
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'branch_id' => 'required',
            'coordinates' => 'required'
        ]);
        $create = Location::create($validated);
        return response()->json([
            'data' => $create
        ]);
    }

}
