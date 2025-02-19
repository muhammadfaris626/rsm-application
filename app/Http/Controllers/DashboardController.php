<?php

namespace App\Http\Controllers;

use App\Http\Resources\AttendanceResource;
use App\Http\Resources\BranchResource;
use App\Http\Resources\CourseResource;
use App\Http\Resources\EmployeeResource;
use App\Models\Attendance;
use App\Models\Branch;
use App\Models\CountEmployee;
use App\Models\Course;
use App\Models\Employee;
use App\Models\Location;
use App\Models\OperationalBranch;
use App\Models\Position;
use App\Models\Sale;
use App\Models\TestRecord;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller {
    public function index(Request $request): Response {
        $userRole = Auth::user()->roles[0]['name'];
        if ($userRole == 'admin-branch') {
            $employee = Employee::where('employee_number', Auth::user()->username)->first();
            $sales = Sale::query()
                ->where('branch_id', $employee->branch_id)
                ->when($request->start_date && $request->end_date, function($query) use($request) {
                    $query->whereBetween('updated_at', [
                        Carbon::parse($request->start_date)->startOfDay(),
                        Carbon::parse($request->end_date)->endOfDay(),
                    ]);
                }, function($query) {
                    $query->whereDate('updated_at', Carbon::today());
                })
                ->get()
                ->map(function ($sale) {
                    return [
                        'total_price' => $sale->listSale->sum('total_price'),
                        'date' => Carbon::parse($sale->updated_at)->timezone('Asia/Makassar')->format('Y-m-d\TH:i:s.v\Z'),
                    ];
                });
            $expenditures = OperationalBranch::query()
                ->where('branch_id', $employee->branch_id)
                ->when($request->start_date && $request->end_date, function($query) use($request) {
                    $query->whereBetween('updated_at', [
                        Carbon::parse($request->start_date)->startOfDay(),
                        Carbon::parse($request->end_date)->endOfDay(),
                    ]);
                }, function($query) {
                    $query->whereDate('updated_at', Carbon::today());
                })
                ->get()
                ->map(function ($expenditure) {
                    return [
                        'total_cost' => $expenditure->total_cost,
                        'date' => Carbon::parse($expenditure->updated_at)->timezone('Asia/Makassar')->format('Y-m-d\TH:i:s.v\Z'),
                    ];
                });
            $employeeActive = Employee::query()
                ->where('status', 'Aktif')
                ->where('branch_id', $employee->branch_id)
                ->when($request->start_date && $request->end_date, function($query) use($request) {
                    $query->whereBetween('updated_at', [
                        Carbon::parse($request->start_date)->startOfDay(),
                        Carbon::parse($request->end_date)->endOfDay(),
                    ]);
                }, function($query) {
                    $query->whereDate('updated_at', Carbon::today());
                })
                ->get()
                ->map(function ($employee) {
                    return [
                        'total' => $employee
                    ];
                });
            $branchActive = Branch::query()
                ->where('status', 'Aktif')
                ->get()
                ->map(function ($branch) {
                    return [
                        'total' => $branch
                    ];
                });
            $profileBranch = Branch::query()
                ->where('id', $employee->branch_id)
                ->first();
        } else {
            $sales = Sale::query()
                ->when($request->start_date && $request->end_date, function($query) use($request) {
                    $query->whereBetween('updated_at', [
                        Carbon::parse($request->start_date)->startOfDay(),
                        Carbon::parse($request->end_date)->endOfDay(),
                    ]);
                }, function($query) {
                    $query->whereDate('updated_at', Carbon::today());
                })
                ->when($request->branch, function($query) use($request) {
                    $query->where('branch_id', $request->branch);
                })
                ->get()
                ->map(function ($sale) {
                    return [
                        'total_price' => $sale->listSale->sum('total_price'),
                        'date' => Carbon::parse($sale->updated_at)->timezone('Asia/Makassar')->format('Y-m-d\TH:i:s.v\Z'),
                    ];
                });
            $expenditures = OperationalBranch::query()
                ->when($request->start_date && $request->end_date, function($query) use($request) {
                    $query->whereBetween('updated_at', [
                        Carbon::parse($request->start_date)->startOfDay(),
                        Carbon::parse($request->end_date)->endOfDay(),
                    ]);
                }, function($query) {
                    $query->whereDate('updated_at', Carbon::today());
                })
                ->when($request->branch, function($query) use($request) {
                    $query->where('branch_id', $request->branch);
                })
                ->get()
                ->map(function ($expenditure) {
                    return [
                        'total_cost' => $expenditure->total_cost,
                        'date' => Carbon::parse($expenditure->updated_at)->timezone('Asia/Makassar')->format('Y-m-d\TH:i:s.v\Z'),
                    ];
                });
            $employeeActive = Employee::query()
                ->where('status', 'Aktif')
                ->when($request->start_date && $request->end_date, function($query) use($request) {
                    $query->whereBetween('updated_at', [
                        Carbon::parse($request->start_date)->startOfDay(),
                        Carbon::parse($request->end_date)->endOfDay(),
                    ]);
                }, function($query) {
                    $query->whereDate('updated_at', Carbon::today());
                })
                ->when($request->branch, function($query) use($request) {
                    $query->where('branch_id', $request->branch);
                })
                ->get()
                ->map(function ($employee) {
                    return [
                        'total' => $employee
                    ];
                });
            $branchActive = Branch::query()
                ->where('status', 'Aktif')
                ->get()
                ->map(function ($branch) {
                    return [
                        'total' => $branch
                    ];
                });
            $profileBranch = Branch::query()
                ->when($request->branch, function($query) use($request) {
                    $query->where('id', $request->branch);
                })
                ->when(!$request->branch, function($query) {
                    return $query->whereRaw('1 = 0');
                })
                ->first();
        }


        return Inertia::render('Dashboards/IndexDashboardFull', [
            'branches' => BranchResource::collection(Branch::where('status', 'Aktif')->get()),
            'sales' => $sales,
            'expenditures' => $expenditures,
            'employeeActive' => $employeeActive->count(),
            'branchActive' => $branchActive->count(),
            'profile' => $profileBranch,
            'userRoleVisitor' => $userRole
        ]);
    }
}
