<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\MutationResource;
use App\Models\Mutation;
use Illuminate\Http\Request;

class ApiMutationController extends Controller
{
    private function applySearch($query, $search) {
        if (!empty($search)) {
            $query->whereHas('employee', function($q) use($search) {
                $q->where('employee_number', 'LIKE', "%{$search}%")
                    ->orWhere('name', 'LIKE', "%{$search}%");
            })->orWhereHas('branch', function($q) use($search) {
                $q->where('branch_name', 'LIKE', "%{$search}%");
            })
            ->orWhere('transfer_data', 'LIKE', "%{$search}%")
            ->orWhere('status', 'LIKE', "%{$search}%");
        }
    }

    public function index(Request $request) {
        $query = Mutation::query();
        $this->applySearch($query, $request->search);
        $perPage = $request->get('per_page', 12);
        $data = $query->paginate($perPage);
        return response()->json([
            'data' => MutationResource::collection($data)->response()->getData(true)
        ]);
    }
}
