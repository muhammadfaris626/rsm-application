<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EmployeeResource;
use App\Models\Employee;
use Illuminate\Http\Request;

class ApiEmployeeAttendanceController extends Controller {

    private function applySearch($query, $search) {
        if (!empty($search)) {
            $query->where('employee_number', 'LIKE', "%{$search}%")
                ->orWhere('name', 'LIKE', "%{$search}%");
        }
    }

    public function index(Request $request) {
        $query = Employee::with('attendances');
        $this->applySearch($query, $request->search);
        $perPage = $request->get('per_page', 12);
        $data = $query->paginate($perPage);
        return response()->json([
            'data' => EmployeeResource::collection($data)->response()->getData(true)
        ]);
    }

    public function show(Request $request, $id) {
        $query = Employee::with('attendances')->where('id', $id)->first();
        return response()->json($query);
    }

}
