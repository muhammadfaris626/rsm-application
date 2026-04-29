<?php

namespace App\Http\Controllers;

use App\Http\Resources\BranchResource;
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
}
