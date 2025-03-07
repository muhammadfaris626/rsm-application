<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TerminationResource;
use App\Models\Termination;
use Illuminate\Http\Request;

class ApiTerminationController extends Controller
{
    private function applySearch($query, $search) {
        if (!empty($search)) {
            $query->whereHas('employee', function($q) use($search) {
                $q->where('employee_number', 'LIKE', "%{$search}%")
                    ->orWhere('name', 'LIKE', "%{$search}%");
            })->orWhere('termination_date', 'LIKE', "%{$search}%")
            ->orWhere('reason', 'LIKE', "%{$search}%");
        }
    }

    public function index(Request $request) {
        $query = Termination::query();
        $this->applySearch($query, $request->search);
        $perPage = $request->get('per_page', 12);
        $data = $query->paginate($perPage);
        return response()->json([
            'data' => TerminationResource::collection($data)->response()->getData(true)
        ]);
    }
}
