<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EmployeeResource;
use App\Models\Employee;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ApiEmployeeAttendanceController extends Controller {
    private function checkoutStatus($branch, ?string $attendanceDateTime): array
    {
        if (!$attendanceDateTime || !$branch?->close_time) {
            return [
                'early_leave_minutes' => 0,
                'checkout_status' => $attendanceDateTime ? 'Sesuai jam' : null,
            ];
        }

        $checkOut = Carbon::parse($attendanceDateTime);
        $limit = Carbon::parse($checkOut->toDateString() . ' ' . $branch->close_time);
        $earlyLeaveMinutes = $checkOut->lessThan($limit) ? (int) $checkOut->diffInMinutes($limit) : 0;

        return [
            'early_leave_minutes' => $earlyLeaveMinutes,
            'checkout_status' => $earlyLeaveMinutes > 0 ? 'Pulang cepat' : 'Sesuai jam',
        ];
    }

    private function applySearch($query, $search) {
        if (!empty($search)) {
            $query->where(function($query) use($search) {
                $query->where('employee_number', 'LIKE', "%{$search}%")
                    ->orWhere('name', 'LIKE', "%{$search}%")
                    ->orWhereHas('branch', function ($query) use ($search) {
                        $query->where('branch_name', 'LIKE', "%{$search}%");
                    });
            });
        }
    }

    public function index(Request $request) {
        // Optimized with select and eager loading
        $query = Employee::query()
            ->select('id', 'employee_number', 'name', 'branch_id', 'status')
            ->with([
                'attendances:id,employee_id,work_date,attendance_type,check_in,check_out,late_minutes,attendance_status,attendance_note',
                'branch:id,branch_name,open_time,close_time,late_tolerance_minutes'
            ])
            ->when($request->filled('branch_id'), function ($query) use ($request) {
                $query->where('branch_id', $request->branch_id);
            });
        
        $this->applySearch($query, $request->search);
        $perPage = $request->get('per_page', 12);
        $data = $query->paginate($perPage)->withQueryString();
        
        return response()->json([
            'data' => EmployeeResource::collection($data)->response()->getData(true)
        ]);
    }

    public function show(Request $request, $id) {
        // Optimized with select and eager loading
        $query = Employee::query()
            ->select('id', 'employee_number', 'name', 'branch_id', 'status')
            ->with([
                'attendances' => function ($query) use ($request) {
                    $query->select('id', 'employee_id', 'work_date', 'attendance_type', 'check_in', 'check_out', 'check_in_photo', 'check_out_photo', 'late_minutes', 'attendance_status', 'attendance_note')
                        ->when($request->filled('start_date'), function ($query) use ($request) {
                            $query->whereDate('work_date', '>=', $request->start_date);
                        })
                        ->when($request->filled('end_date'), function ($query) use ($request) {
                            $query->whereDate('work_date', '<=', $request->end_date);
                        })
                        ->orderBy('work_date');
                },
                'branch:id,branch_name,open_time,close_time,late_tolerance_minutes'
            ])
            ->where('id', $id)
            ->first();

        if ($query) {
            $query->attendances->each(function ($attendance) use ($query) {
                $checkoutStatus = $this->checkoutStatus($query->branch, $attendance->check_out);
                $attendance->setAttribute('early_leave_minutes', $checkoutStatus['early_leave_minutes']);
                $attendance->setAttribute('checkout_status', $checkoutStatus['checkout_status']);
            });
        }
        
        return response()->json($query);
    }
}
