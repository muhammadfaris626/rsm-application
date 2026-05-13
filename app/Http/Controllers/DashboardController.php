<?php

namespace App\Http\Controllers;

use App\Http\Resources\BranchResource;
use App\Models\Attendance;
use App\Models\Branch;
use App\Models\Employee;
use App\Models\OperationalBranch;
use App\Models\RequestOrder;
use App\Models\Sale;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller {
    public function index(Request $request): Response {
        $user = Auth::user();
        $userRole = $user->roles->first()?->name;
        $employee = null;

        if ($user->hasRole('karyawan')) {
            return $this->employeeAttendanceDashboard($request, $userRole);
        }

        // Cache key untuk data user
        $cachePrefix = "dashboard_{$user->id}_{$request->branch}_{$request->start_date}_{$request->end_date}";
        
        // Parse dates once
        $startDate = $request->start_date && $request->end_date 
            ? Carbon::parse($request->start_date)->startOfDay() 
            : Carbon::today()->startOfDay();
        $endDate = $request->start_date && $request->end_date 
            ? Carbon::parse($request->end_date)->endOfDay() 
            : Carbon::today()->endOfDay();
        
        if ($userRole == 'admin-branch') {
            // Cache employee data
            $employee = Cache::remember("employee_{$user->username}", 300, function() use ($user) {
                return Employee::select('id', 'employee_number', 'branch_id')
                    ->where('employee_number', $user->username)
                    ->first();
            });
            
            $branchId = $employee?->branch_id;
            
            // Optimized sales query with eager loading and withSum
            $sales = Sale::query()
                ->select('id', 'branch_id', 'updated_at')
                ->where('branch_id', $branchId)
                ->whereBetween('updated_at', [$startDate, $endDate])
                ->withSum('listSale', 'total_price')
                ->get()
                ->map(fn($sale) => [
                    'total_price' => $sale->list_sale_sum_total_price ?? 0,
                    'date' => $sale->updated_at->timezone('Asia/Makassar')->format('Y-m-d\TH:i:s.v\Z'),
                ]);
            
            $expenditures = OperationalBranch::query()
                ->select('id', 'branch_id', 'total_cost', 'updated_at')
                ->where('branch_id', $branchId)
                ->whereBetween('updated_at', [$startDate, $endDate])
                ->get()
                ->map(fn($expenditure) => [
                    'total_cost' => $expenditure->total_cost,
                    'date' => $expenditure->updated_at->timezone('Asia/Makassar')->format('Y-m-d\TH:i:s.v\Z'),
                ]);
            
            $employeeActive = Employee::where('status', 'Aktif')
                ->where('branch_id', $branchId)
                ->count();
            
            $profileBranch = Cache::remember("branch_{$branchId}", 300, function() use ($branchId) {
                return Branch::select('id', 'branch_code', 'branch_name', 'branch_address', 'status')
                    ->find($branchId);
            });
        } else {
            $branchId = $request->branch;
            
            // Optimized sales query with eager loading and withSum
            $sales = Sale::query()
                ->select('id', 'branch_id', 'updated_at')
                ->whereBetween('updated_at', [$startDate, $endDate])
                ->when($branchId, fn($query) => $query->where('branch_id', $branchId))
                ->withSum('listSale', 'total_price')
                ->get()
                ->map(fn($sale) => [
                    'total_price' => $sale->list_sale_sum_total_price ?? 0,
                    'date' => $sale->updated_at->timezone('Asia/Makassar')->format('Y-m-d\TH:i:s.v\Z'),
                ]);
            
            $expenditures = OperationalBranch::query()
                ->select('id', 'branch_id', 'total_cost', 'updated_at')
                ->whereBetween('updated_at', [$startDate, $endDate])
                ->when($branchId, fn($query) => $query->where('branch_id', $branchId))
                ->get()
                ->map(fn($expenditure) => [
                    'total_cost' => $expenditure->total_cost,
                    'date' => $expenditure->updated_at->timezone('Asia/Makassar')->format('Y-m-d\TH:i:s.v\Z'),
                ]);
            
            $employeeActive = Employee::where('status', 'Aktif')
                ->when($branchId, fn($query) => $query->where('branch_id', $branchId))
                ->count();
            
            $profileBranch = $branchId 
                ? Cache::remember("branch_{$branchId}", 300, function() use ($branchId) {
                    return Branch::select('id', 'branch_code', 'branch_name', 'branch_address', 'status')
                        ->find($branchId);
                })
                : null;
        }
        
        // Cache active branches (same for all users)
        $branchActiveCount = Cache::remember('active_branches_count', 300, function() {
            return Branch::where('status', 'Aktif')->count();
        });
        
        // Cache active branches for dropdown
        $activeBranches = Cache::remember('active_branches', 300, function() {
            return Branch::select('id', 'branch_code', 'branch_name', 'status')
                ->where('status', 'Aktif')
                ->get();
        });

        // Get recent sales with optimized eager loading
        $recentSalesQuery = Sale::query()
            ->select('id', 'branch_id', 'invoice_number', 'date', 'updated_at')
            ->when($userRole == 'admin-branch' && $employee, 
                fn($query) => $query->where('branch_id', $employee->branch_id))
            ->when($request->branch, 
                fn($query) => $query->where('branch_id', $request->branch))
            ->withSum('listSale', 'total_price')
            ->latest()
            ->limit(10)
            ->get()
            ->map(fn($sale) => [
                'id' => $sale->id,
                'invoice_number' => $sale->invoice_number,
                'date' => Carbon::parse($sale->date)->format('d M Y'),
                'total_price' => $sale->list_sale_sum_total_price ?? 0,
            ]);

        // Get recent request orders with optimized query
        $recentOrdersQuery = RequestOrder::query()
            ->select('id', 'branch_id', 'ro_number', 'date', 'status')
            ->when($userRole == 'admin-branch' && $employee, 
                fn($query) => $query->where('branch_id', $employee->branch_id))
            ->when($request->branch, 
                fn($query) => $query->where('branch_id', $request->branch))
            ->latest()
            ->limit(10)
            ->get()
            ->map(fn($order) => [
                'id' => $order->id,
                'ro_number' => $order->ro_number,
                'date' => Carbon::parse($order->date)->format('d M Y'),
                'status' => $order->status,
            ]);

        return Inertia::render('Dashboards/IndexDashboardFull', [
            'branches' => BranchResource::collection($activeBranches),
            'sales' => $sales,
            'expenditures' => $expenditures,
            'employeeActive' => $employeeActive,
            'branchActive' => $branchActiveCount,
            'profile' => $profileBranch,
            'userRoleVisitor' => $userRole,
            'recentSales' => $recentSalesQuery,
            'recentOrders' => $recentOrdersQuery,
        ]);
    }

    private function employeeAttendanceDashboard(Request $request, ?string $userRole): Response
    {
        $user = Auth::user();
        $startDate = $request->start_date && $request->end_date
            ? Carbon::parse($request->start_date)->startOfDay()
            : Carbon::now()->startOfMonth()->startOfDay();
        $endDate = $request->start_date && $request->end_date
            ? Carbon::parse($request->end_date)->endOfDay()
            : Carbon::now()->endOfMonth()->endOfDay();

        $employee = Employee::query()
            ->select('id', 'employee_number', 'name', 'branch_id')
            ->with('branch:id,branch_name,open_time,close_time,late_tolerance_minutes')
            ->where('user_id', $user->id)
            ->orWhere('employee_number', $user->username)
            ->first();

        $employeeQuery = Employee::query()
            ->select('id', 'employee_number', 'name', 'branch_id')
            ->with('branch:id,branch_name')
            ->where('status', 'Aktif')
            ->when($employee?->branch_id, fn ($query) => $query->where('branch_id', $employee->branch_id))
            ->withCount([
                'attendances as present_count' => fn ($query) => $query
                    ->whereBetween('work_date', [$startDate->toDateString(), $endDate->toDateString()])
                    ->where(function ($query) {
                        $query->where(function ($query) {
                            $query->where('attendance_type', 'Hadir')
                                ->whereNotNull('check_in');
                        })->orWhere('attendance_type', 'Tugas Luar');
                    }),
                'attendances as late_count' => fn ($query) => $query
                    ->whereBetween('work_date', [$startDate->toDateString(), $endDate->toDateString()])
                    ->where('attendance_status', 'Terlambat'),
                'attendances as sick_count' => fn ($query) => $query
                    ->whereBetween('work_date', [$startDate->toDateString(), $endDate->toDateString()])
                    ->where('attendance_type', 'Sakit'),
                'attendances as permit_count' => fn ($query) => $query
                    ->whereBetween('work_date', [$startDate->toDateString(), $endDate->toDateString()])
                    ->where('attendance_type', 'Izin'),
                'attendances as outside_duty_count' => fn ($query) => $query
                    ->whereBetween('work_date', [$startDate->toDateString(), $endDate->toDateString()])
                    ->where('attendance_type', 'Tugas Luar'),
                'attendances as incomplete_count' => fn ($query) => $query
                    ->whereBetween('work_date', [$startDate->toDateString(), $endDate->toDateString()])
                    ->whereNotNull('check_in')
                    ->whereNull('check_out'),
            ]);

        $employees = $employeeQuery->get();

        $mapEmployee = fn (Employee $item) => [
            'id' => $item->id,
            'name' => $item->name,
            'employee_number' => $item->employee_number,
            'branch_name' => $item->branch?->branch_name ?? '-',
            'present_count' => $item->present_count,
            'late_count' => $item->late_count,
            'sick_count' => $item->sick_count,
            'permit_count' => $item->permit_count,
            'outside_duty_count' => $item->outside_duty_count,
            'incomplete_count' => $item->incomplete_count,
            'attention_score' => $item->late_count + $item->sick_count + $item->permit_count + $item->incomplete_count,
        ];

        $topDiligentEmployees = $employees
            ->sort(function (Employee $first, Employee $second) {
                return [$second->present_count, $first->late_count, $first->incomplete_count, $first->name]
                    <=> [$first->present_count, $second->late_count, $second->incomplete_count, $second->name];
            })
            ->take(10)
            ->values()
            ->map($mapEmployee);

        $topAttentionEmployees = $employees
            ->sort(function (Employee $first, Employee $second) {
                $firstScore = $first->late_count + $first->sick_count + $first->permit_count + $first->incomplete_count;
                $secondScore = $second->late_count + $second->sick_count + $second->permit_count + $second->incomplete_count;

                return [$secondScore, $first->present_count, $first->name]
                    <=> [$firstScore, $second->present_count, $second->name];
            })
            ->take(10)
            ->values()
            ->map($mapEmployee);

        $myAttendances = $employee
            ? Attendance::query()
                ->where('employee_id', $employee->id)
                ->whereBetween('work_date', [$startDate->toDateString(), $endDate->toDateString()])
                ->get()
            : collect();

        return Inertia::render('Dashboards/IndexDashboardFull', [
            'branches' => [],
            'sales' => [],
            'expenditures' => [],
            'employeeActive' => 0,
            'branchActive' => 0,
            'profile' => null,
            'userRoleVisitor' => $userRole,
            'dashboardType' => 'employee-attendance',
            'currentEmployee' => $employee ? [
                'id' => $employee->id,
                'name' => $employee->name,
                'employee_number' => $employee->employee_number,
                'branch_name' => $employee->branch?->branch_name ?? '-',
                'open_time' => $employee->branch?->open_time,
                'close_time' => $employee->branch?->close_time,
                'late_tolerance_minutes' => $employee->branch?->late_tolerance_minutes ?? 0,
            ] : null,
            'attendancePeriod' => [
                'start_date' => $startDate->toDateString(),
                'end_date' => $endDate->toDateString(),
            ],
            'attendanceSummary' => [
                'present' => $myAttendances->where('attendance_type', 'Hadir')->whereNotNull('check_in')->count()
                    + $myAttendances->where('attendance_type', 'Tugas Luar')->count(),
                'late' => $myAttendances->where('attendance_status', 'Terlambat')->count(),
                'sick' => $myAttendances->where('attendance_type', 'Sakit')->count(),
                'permit' => $myAttendances->where('attendance_type', 'Izin')->count(),
                'outside_duty' => $myAttendances->where('attendance_type', 'Tugas Luar')->count(),
                'incomplete' => $myAttendances->whereNotNull('check_in')->whereNull('check_out')->count(),
            ],
            'topDiligentEmployees' => $topDiligentEmployees,
            'topAttentionEmployees' => $topAttentionEmployees,
            'recentSales' => [],
            'recentOrders' => [],
        ]);
    }
}
