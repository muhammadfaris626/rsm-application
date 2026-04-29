<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EmployeeResource;
use App\Models\Employee;
use Illuminate\Http\Request;

class ApiEmployeeAttendanceController extends Controller {

    private function applySearch($query, $search) {
        if (!empty($search)) {
            $query->where(function($query) use($search) {
                $query->where('employee_number', 'LIKE', "%{$search}%")
                    ->orWhere('name', 'LIKE', "%{$search}%");
            });
        }
    }

    public function index(Request $request) {
        // Optimized with select and eager loading
        $query = Employee::query()
            ->select('id', 'employee_number', 'name', 'branch_id', 'status')
            ->with([
                'attendances:id,employee_id,work_date,check_in,check_out',
                'branch:id,branch_name'
            ]);
        
        $this->applySearch($query, $request->search);
        $perPage = $request->get('per_page', 12);
        $data = $query->paginate($perPage);
        
        return response()->json([
            'data' => EmployeeResource::collection($data)->response()->getData(true)
        ]);
    }

    public function show(Request $request, $id) {
        // Optimized with select and eager loading
        $query = Employee::query()
            ->select('id', 'employee_number', 'name', 'branch_id', 'status')
            ->with([
                'attendances:id,employee_id,work_date,check_in,check_out,check_in_photo,check_out_photo',
                'branch:id,branch_name'
            ])
            ->where('id', $id)
            ->first();
        
        return response()->json($query);
    }
}
