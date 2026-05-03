<?php

namespace App\Http\Controllers;

use App\Http\Resources\EmployeeResource;
use App\Models\Attendance;
use App\Models\Branch;
use App\Models\Employee;
use App\Traits\OptimizedQueries;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceController extends Controller {
    use OptimizedQueries;

    private function attendanceStatus(Employee $employee, string $attendanceDateTime): array
    {
        $employee->loadMissing('branch:id,open_time,late_tolerance_minutes');
        $branch = $employee->branch;

        if (!$branch?->open_time) {
            return [
                'late_minutes' => 0,
                'attendance_status' => 'Tepat waktu',
            ];
        }

        $checkIn = Carbon::parse($attendanceDateTime);
        $limit = Carbon::parse($checkIn->toDateString() . ' ' . $branch->open_time)
            ->addMinutes((int) $branch->late_tolerance_minutes);
        $lateMinutes = $checkIn->greaterThan($limit) ? (int) $limit->diffInMinutes($checkIn) : 0;

        return [
            'late_minutes' => $lateMinutes,
            'attendance_status' => $lateMinutes > 0 ? 'Terlambat' : 'Tepat waktu',
        ];
    }

    private function checkoutStatus(Employee $employee, string $attendanceDateTime): array
    {
        $employee->loadMissing('branch:id,close_time');
        $branch = $employee->branch;

        if (!$branch?->close_time) {
            return [
                'early_leave_minutes' => 0,
                'checkout_status' => 'Sesuai jam',
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

    public function index() {
        Gate::authorize('viewAny', Attendance::class);
        return Inertia::render('Employees/Attendances/IndexAttendance', [
            'branches' => Branch::select('id', 'branch_code', 'branch_name')
                ->where('status', 'Aktif')
                ->orderBy('branch_name')
                ->get(),
        ]);
    }

    public function selfAttendance(): Response
    {
        $employee = Employee::select('id', 'employee_number', 'user_id', 'name', 'branch_id')
            ->with('branch:id,branch_name,open_time,close_time,late_tolerance_minutes')
            ->where('user_id', Auth::id())
            ->orWhere('employee_number', Auth::user()->username)
            ->first();

        $todayAttendance = $employee
            ? Attendance::select('id', 'employee_id', 'work_date', 'attendance_type', 'check_in', 'check_out', 'check_in_photo', 'check_out_photo', 'late_minutes', 'attendance_status', 'attendance_note')
                ->where('employee_id', $employee->id)
                ->whereDate('work_date', now()->toDateString())
                ->first()
            : null;

        if ($employee && $todayAttendance?->check_out) {
            $checkoutStatus = $this->checkoutStatus($employee, $todayAttendance->check_out);
            $todayAttendance->setAttribute('early_leave_minutes', $checkoutStatus['early_leave_minutes']);
            $todayAttendance->setAttribute('checkout_status', $checkoutStatus['checkout_status']);
        }

        return Inertia::render('Employees/Attendances/SelfAttendance', [
            'employee' => $employee,
            'todayAttendance' => $todayAttendance,
            'serverTime' => now()->toDateTimeString(),
        ]);
    }

    public function submitAbsence(Request $request)
    {
        $validated = $request->validate([
            'work_date' => ['required', 'date'],
            'attendance_type' => ['required', 'in:Sakit,Izin'],
            'attendance_note' => ['required', 'string'],
        ], [
            'work_date.required' => 'Tanggal wajib diisi.',
            'attendance_type.required' => 'Jenis absensi wajib dipilih.',
            'attendance_type.in' => 'Jenis absensi tidak valid.',
            'attendance_note.required' => 'Keterangan wajib diisi.',
        ]);

        $employee = Employee::select('id', 'employee_number', 'user_id', 'name', 'branch_id')
            ->where('user_id', Auth::id())
            ->orWhere('employee_number', Auth::user()->username)
            ->first();

        if (!$employee) {
            return response()->json([
                'message' => 'Akun ini belum terhubung dengan data karyawan.',
            ], 422);
        }

        $attendance = Attendance::where('employee_id', $employee->id)
            ->whereDate('work_date', $validated['work_date'])
            ->first();

        if ($attendance?->check_in || $attendance?->check_out) {
            return response()->json([
                'message' => 'Tanggal ini sudah memiliki data absen masuk/keluar.',
            ], 422);
        }

        Attendance::updateOrCreate(
            [
                'employee_id' => $employee->id,
                'work_date' => $validated['work_date'],
            ],
            [
                'attendance_type' => $validated['attendance_type'],
                'attendance_status' => $validated['attendance_type'],
                'attendance_note' => $validated['attendance_note'],
                'check_in' => null,
                'check_out' => null,
                'check_in_photo' => null,
                'check_out_photo' => null,
                'late_minutes' => 0,
            ],
        );

        return response()->json([
            'message' => 'Data ' . strtolower($validated['attendance_type']) . ' berhasil dikirim.',
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        Gate::authorize('create', Attendance::class);

        return Inertia::render('Employees/Attendances/CreateAttendance', [
            'employees' => EmployeeResource::collection($this->getCachedActiveEmployees()),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        Gate::authorize('create', Attendance::class);

        $request->validate([
            'employee_id.id' => ['required', 'exists:employees,id'],
            'work_date' => ['required', 'date'],
            'check_in' => ['nullable', 'date'],
            'check_out' => ['nullable', 'date', 'after_or_equal:check_in'],
        ]);

        $employee = Employee::with('branch:id,open_time,close_time,late_tolerance_minutes')->findOrFail($request->employee_id['id']);
        $attendanceStatus = $request->filled('check_in')
            ? $this->attendanceStatus($employee, $request->check_in)
            : ['late_minutes' => 0, 'attendance_status' => null];

        Attendance::updateOrCreate(
            [
                'employee_id' => $request->employee_id['id'],
                'work_date' => $request->work_date,
            ],
            [
                'check_in' => $request->filled('check_in') ? Carbon::parse($request->check_in) : null,
                'check_out' => $request->filled('check_out') ? Carbon::parse($request->check_out) : null,
                'attendance_type' => 'Hadir',
                'late_minutes' => $attendanceStatus['late_minutes'],
                'attendance_status' => $attendanceStatus['attendance_status'],
            ],
        );

        Session::flash('toast', ['message' => 'Data berhasil disimpan.']);
        return to_route('attendances.index');
    }

    /**
     * Display the specified resource.
     */
    public function show($id) {
        Gate::authorize('viewAny', Attendance::class);

        return Inertia::render('Employees/Attendances/ShowAttendance', [
            'id' => $id
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Attendance $attendance)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Attendance $attendance)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Attendance $attendance)
    {
        //
    }
}
