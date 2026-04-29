<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Employee;
use App\Models\Mutation;
use App\Models\Performance;
use App\Models\Termination;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class PerformanceController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Performance::class);

        $monthStart = now()->startOfMonth()->toDateString();
        $monthEnd = now()->endOfMonth()->toDateString();

        $employees = Employee::query()
            ->select('id', 'employee_number', 'name', 'branch_id', 'status')
            ->with('branch:id,branch_name')
            ->withCount([
                'attendances as attendance_count' => fn ($query) => $query->whereBetween('work_date', [$monthStart, $monthEnd]),
                'mutations as mutation_count',
                'terminations as termination_count',
            ])
            ->when($request->search, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('employee_number', 'LIKE', "%{$search}%")
                        ->orWhere('name', 'LIKE', "%{$search}%");
                });
            })
            ->orderBy('name')
            ->paginate(12)
            ->withQueryString()
            ->through(fn ($employee) => [
                'id' => $employee->id,
                'employee_number' => $employee->employee_number,
                'name' => $employee->name,
                'branch_name' => $employee->branch?->branch_name,
                'status' => $employee->status,
                'attendance_count' => $employee->attendance_count,
                'mutation_count' => $employee->mutation_count,
                'termination_count' => $employee->termination_count,
            ]);

        return Inertia::render('Employees/Performances/IndexPerformance', [
            'fetchData' => $employees,
            'search' => $request->search ?? '',
            'summary' => [
                'active_employees' => Employee::where('status', 'Aktif')->count(),
                'attendance_this_month' => Attendance::whereBetween('work_date', [$monthStart, $monthEnd])->count(),
                'mutations' => Mutation::count(),
                'terminations' => Termination::count(),
            ],
        ]);
    }
}
