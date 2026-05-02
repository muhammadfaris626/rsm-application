<?php

namespace App\Http\Controllers;

use App\Http\Resources\EmployeeResource;
use App\Models\Attendance;
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

    public function index() {
        Gate::authorize('viewAny', Attendance::class);
        return Inertia::render('Employees/Attendances/IndexAttendance');
    }

    public function selfAttendance(): Response
    {
        $employee = Employee::select('id', 'employee_number', 'user_id', 'name', 'branch_id')
            ->with('branch:id,branch_name')
            ->where('user_id', Auth::id())
            ->orWhere('employee_number', Auth::user()->username)
            ->first();

        $todayAttendance = $employee
            ? Attendance::select('id', 'employee_id', 'work_date', 'check_in', 'check_out', 'check_in_photo', 'check_out_photo')
                ->where('employee_id', $employee->id)
                ->whereDate('work_date', now()->toDateString())
                ->first()
            : null;

        return Inertia::render('Employees/Attendances/SelfAttendance', [
            'employee' => $employee,
            'todayAttendance' => $todayAttendance,
            'serverTime' => now()->toDateTimeString(),
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

        Attendance::updateOrCreate(
            [
                'employee_id' => $request->employee_id['id'],
                'work_date' => $request->work_date,
            ],
            [
                'check_in' => $request->filled('check_in') ? Carbon::parse($request->check_in) : null,
                'check_out' => $request->filled('check_out') ? Carbon::parse($request->check_out) : null,
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
