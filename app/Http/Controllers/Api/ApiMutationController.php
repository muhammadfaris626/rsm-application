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
            $query->where(function($query) use($search) {
                $query->whereHas('employee', function($q) use($search) {
                    $q->where('employee_number', 'LIKE', "%{$search}%")
                        ->orWhere('name', 'LIKE', "%{$search}%");
                })->orWhereHas('fromBranch', function($q) use($search) {
                    $q->where('branch_name', 'LIKE', "%{$search}%");
                })->orWhereHas('toBranch', function($q) use($search) {
                    $q->where('branch_name', 'LIKE', "%{$search}%");
                })
                ->orWhere('transfer_date', 'LIKE', "%{$search}%")
                ->orWhere('status', 'LIKE', "%{$search}%");
            });
        }
    }

    public function index(Request $request) {
        // Optimized with select and eager loading
        $query = Mutation::query()
            ->select('id', 'employee_id', 'from_branch_id', 'to_branch_id', 'transfer_date', 'reason', 'approved_by', 'status', 'created_at', 'updated_at')
            ->with([
                'employee:id,employee_number,name',
                'fromBranch:id,branch_name,branch_code',
                'toBranch:id,branch_name,branch_code',
                'approvedBy:id,employee_number,name'
            ])
            ->latest();
        
        $this->applySearch($query, $request->search);
        $perPage = $request->get('per_page', 12);
        $data = $query->paginate($perPage)->withQueryString();
        
        return response()->json([
            'data' => MutationResource::collection($data)->response()->getData(true)
        ]);
    }
}
