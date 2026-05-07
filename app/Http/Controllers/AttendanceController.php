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

    public function summary(Request $request): Response
    {
        Gate::authorize('viewAny', Attendance::class);

        $user = Auth::user();
        abort_if($user->hasRole('karyawan'), 403);

        $startDate = $request->filled('start_date')
            ? Carbon::parse($request->start_date)->startOfDay()
            : Carbon::now()->startOfMonth()->startOfDay();
        $endDate = $request->filled('end_date')
            ? Carbon::parse($request->end_date)->endOfDay()
            : Carbon::today()->endOfDay();

        if ($endDate->greaterThan(Carbon::today()->endOfDay())) {
            $endDate = Carbon::today()->endOfDay();
        }

        if ($startDate->greaterThan($endDate)) {
            $startDate = $endDate->copy()->startOfDay();
        }

        $adminBranchId = null;
        if ($user->hasRole('admin-branch')) {
            $adminBranchId = Employee::where('employee_number', $user->username)->value('branch_id');
        }

        $selectedBranchId = $adminBranchId ?: $request->branch_id;
        $days = (int) $startDate->diffInDays($endDate) + 1;

        $branches = Branch::query()
            ->select('id', 'branch_code', 'branch_name', 'status')
            ->where('status', 'Aktif')
            ->when($adminBranchId, fn ($query) => $query->where('id', $adminBranchId))
            ->orderBy('branch_name')
            ->get();

        $employees = Employee::query()
            ->select('id', 'employee_number', 'name', 'branch_id')
            ->where('status', 'Aktif')
            ->whereNotNull('branch_id')
            ->when($selectedBranchId, fn ($query) => $query->where('branch_id', $selectedBranchId))
            ->get();

        $employeeIds = $employees->pluck('id');
        $attendances = Attendance::query()
            ->select('id', 'employee_id', 'work_date', 'attendance_type', 'attendance_status', 'attendance_note', 'late_minutes', 'check_in', 'check_out')
            ->whereIn('employee_id', $employeeIds)
            ->whereBetween('work_date', [$startDate->toDateString(), $endDate->toDateString()])
            ->get();

        $employeesByBranch = $employees->groupBy('branch_id');
        $employeeMap = $employees->keyBy('id');
        $employeeBranchMap = $employees->pluck('branch_id', 'id');
        $branchNameMap = $branches->pluck('branch_name', 'id');
        $attendancesByBranch = $attendances->groupBy(fn ($attendance) => $employeeBranchMap->get($attendance->employee_id));
        $attendedDateKeys = $attendances
            ->filter(fn ($attendance) => $attendance->check_in || in_array($attendance->attendance_type, ['Sakit', 'Izin']))
            ->mapWithKeys(fn ($attendance) => [$attendance->employee_id . '-' . $attendance->work_date => true]);

        $notAbsentDetails = collect();
        $dateCursor = $startDate->copy();
        while ($dateCursor->lessThanOrEqualTo($endDate)) {
            $workDate = $dateCursor->toDateString();

            foreach ($employees as $employee) {
                if (! $attendedDateKeys->has($employee->id . '-' . $workDate)) {
                    $notAbsentDetails->push([
                        'branch_id' => $employee->branch_id,
                        'branch_name' => $branchNameMap->get($employee->branch_id, '-'),
                        'employee_id' => $employee->id,
                        'employee_number' => $employee->employee_number,
                        'employee_name' => $employee->name,
                        'work_date' => $workDate,
                    ]);
                }
            }

            $dateCursor->addDay();
        }

        $attendanceDetails = [
            'on_time' => collect(),
            'late' => collect(),
            'sick' => collect(),
            'permit' => collect(),
            'incomplete_checkout' => collect(),
        ];

        foreach ($attendances as $attendance) {
            $employee = $employeeMap->get($attendance->employee_id);

            if (! $employee) {
                continue;
            }

            $detail = [
                'branch_id' => $employee->branch_id,
                'branch_name' => $branchNameMap->get($employee->branch_id, '-'),
                'employee_id' => $employee->id,
                'employee_number' => $employee->employee_number,
                'employee_name' => $employee->name,
                'work_date' => $attendance->work_date,
                'attendance_type' => $attendance->attendance_type,
                'attendance_status' => $attendance->attendance_status,
                'attendance_note' => $attendance->attendance_note,
                'late_minutes' => $attendance->late_minutes,
                'check_in' => $attendance->check_in ? Carbon::parse($attendance->check_in)->format('H:i') : null,
                'check_out' => $attendance->check_out ? Carbon::parse($attendance->check_out)->format('H:i') : null,
            ];

            if ($attendance->attendance_type === 'Hadir' && $attendance->check_in && $attendance->attendance_status !== 'Terlambat') {
                $attendanceDetails['on_time']->push($detail);
            }

            if ($attendance->attendance_status === 'Terlambat') {
                $attendanceDetails['late']->push($detail);
            }

            if ($attendance->attendance_type === 'Sakit') {
                $attendanceDetails['sick']->push($detail);
            }

            if ($attendance->attendance_type === 'Izin') {
                $attendanceDetails['permit']->push($detail);
            }

            if ($attendance->check_in && ! $attendance->check_out) {
                $attendanceDetails['incomplete_checkout']->push($detail);
            }
        }

        $branchSummaries = $branches
            ->when($selectedBranchId, fn ($collection) => $collection->where('id', (int) $selectedBranchId))
            ->values()
            ->map(function (Branch $branch) use ($employeesByBranch, $attendancesByBranch, $days) {
                $branchEmployees = $employeesByBranch->get($branch->id, collect());
                $branchAttendances = $attendancesByBranch->get($branch->id, collect());
                $totalSlots = $branchEmployees->count() * $days;
                $attendedSlots = $branchAttendances
                    ->filter(fn ($attendance) => $attendance->check_in || in_array($attendance->attendance_type, ['Sakit', 'Izin']))
                    ->unique(fn ($attendance) => $attendance->employee_id . '-' . $attendance->work_date)
                    ->count();
                $late = $branchAttendances->where('attendance_status', 'Terlambat')->count();
                $onTime = $branchAttendances
                    ->filter(fn ($attendance) => $attendance->attendance_type === 'Hadir'
                        && $attendance->check_in
                        && $attendance->attendance_status !== 'Terlambat')
                    ->count();
                $sick = $branchAttendances->where('attendance_type', 'Sakit')->count();
                $permit = $branchAttendances->where('attendance_type', 'Izin')->count();
                $incompleteCheckout = $branchAttendances
                    ->filter(fn ($attendance) => $attendance->check_in && !$attendance->check_out)
                    ->count();
                $notAbsent = max($totalSlots - $attendedSlots, 0);

                return [
                    'branch_id' => $branch->id,
                    'branch_name' => $branch->branch_name,
                    'employee_count' => $branchEmployees->count(),
                    'total_slots' => $totalSlots,
                    'on_time' => $onTime,
                    'late' => $late,
                    'sick' => $sick,
                    'permit' => $permit,
                    'not_absent' => $notAbsent,
                    'incomplete_checkout' => $incompleteCheckout,
                    'on_time_percentage' => $this->percentage($onTime, $totalSlots),
                    'late_percentage' => $this->percentage($late, $totalSlots),
                    'not_absent_percentage' => $this->percentage($notAbsent, $totalSlots),
                    'discipline_percentage' => $this->percentage($onTime, max($onTime + $late + $notAbsent, 0)),
                ];
            });

        $overall = [
            'employee_count' => $branchSummaries->sum('employee_count'),
            'total_slots' => $branchSummaries->sum('total_slots'),
            'on_time' => $branchSummaries->sum('on_time'),
            'late' => $branchSummaries->sum('late'),
            'sick' => $branchSummaries->sum('sick'),
            'permit' => $branchSummaries->sum('permit'),
            'not_absent' => $branchSummaries->sum('not_absent'),
            'incomplete_checkout' => $branchSummaries->sum('incomplete_checkout'),
        ];

        $overall['on_time_percentage'] = $this->percentage($overall['on_time'], $overall['total_slots']);
        $overall['late_percentage'] = $this->percentage($overall['late'], $overall['total_slots']);
        $overall['not_absent_percentage'] = $this->percentage($overall['not_absent'], $overall['total_slots']);

        return Inertia::render('Employees/Attendances/SummaryAttendance', [
            'branches' => $branches,
            'selectedBranchId' => $selectedBranchId ? (int) $selectedBranchId : null,
            'period' => [
                'start_date' => $startDate->toDateString(),
                'end_date' => $endDate->toDateString(),
                'days' => $days,
            ],
            'overall' => $overall,
            'branchSummaries' => $branchSummaries,
            'notAbsentDetails' => $notAbsentDetails->values(),
            'attendanceDetails' => collect($attendanceDetails)
                ->map(fn ($details) => $details->values())
                ->all(),
            'isBranchAdmin' => (bool) $adminBranchId,
        ]);
    }

    private function percentage(int|float $value, int|float $total): float
    {
        return $total > 0 ? round(($value / $total) * 100, 1) : 0;
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
