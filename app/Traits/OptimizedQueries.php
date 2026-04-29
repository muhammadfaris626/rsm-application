<?php

namespace App\Traits;

use Illuminate\Support\Facades\Cache;

/**
 * Trait untuk optimasi query yang umum digunakan di controller
 */
trait OptimizedQueries
{
    /**
     * Cache employee data berdasarkan username
     */
    protected function getCachedEmployee($username, $branchIdOnly = false)
    {
        $cacheKey = "employee_{$username}";
        
        return Cache::remember($cacheKey, 300, function() use ($username, $branchIdOnly) {
            $query = \App\Models\Employee::query();
            
            if ($branchIdOnly) {
                $query->select('id', 'employee_number', 'branch_id');
            }
            
            return $query->where('employee_number', $username)->first();
        });
    }

    /**
     * Cache active branches
     */
    protected function getCachedActiveBranches($selectFields = ['id', 'branch_code', 'branch_name', 'status'])
    {
        return Cache::remember('active_branches', 300, function() use ($selectFields) {
            return \App\Models\Branch::select($selectFields)
                ->where('status', 'Aktif')
                ->get();
        });
    }

    /**
     * Cache all branches
     */
    protected function getCachedAllBranches($selectFields = ['id', 'branch_code', 'branch_name', 'status'])
    {
        return Cache::remember('all_branches', 300, function() use ($selectFields) {
            return \App\Models\Branch::select($selectFields)->get();
        });
    }

    /**
     * Cache active employees
     */
    protected function getCachedActiveEmployees()
    {
        return Cache::remember('active_employees', 300, function() {
            return \App\Models\Employee::select('id', 'employee_number', 'name', 'branch_id')
                ->with('branch:id,branch_code,branch_name,status')
                ->where('status', 'Aktif')
                ->get();
        });
    }

    /**
     * Cache all positions
     */
    protected function getCachedPositions()
    {
        return Cache::remember('all_positions', 600, function() {
            return \App\Models\Position::select('id', 'position_name')->get();
        });
    }

    /**
     * Cache all expenditures
     */
    protected function getCachedExpenditures()
    {
        return Cache::remember('all_expenditures', 600, function() {
            return \App\Models\Expenditure::select('id', 'type_of_fee')->get();
        });
    }

    /**
     * Cache all suppliers
     */
    protected function getCachedSuppliers()
    {
        return Cache::remember('all_suppliers', 600, function() {
            return \App\Models\Supplier::select('id', 'name', 'address', 'phone')->get();
        });
    }

    /**
     * Cache all products
     */
    protected function getCachedProducts()
    {
        return Cache::remember('all_products', 300, function() {
            return \App\Models\Product::select('id', 'product_category_id', 'product_name')
                ->with('productCategory:id,product_category_name,product_category_code')
                ->get();
        });
    }

    /**
     * Cache all product categories
     */
    protected function getCachedProductCategories()
    {
        return Cache::remember('product_categories', 600, function() {
            return \App\Models\ProductCategory::select('id', 'product_category_name', 'product_category_code')->get();
        });
    }

    /**
     * Cache all roles
     */
    protected function getCachedRoles()
    {
        return Cache::remember('all_roles', 600, function() {
            return \App\Models\Role::select('id', 'name')->get();
        });
    }

    /**
     * Cache approval types
     */
    protected function getCachedApprovalTypes()
    {
        return Cache::remember('approval_types', 600, function() {
            return \App\Models\ApprovalType::select('id', 'approval_type_name')->get();
        });
    }

    /**
     * Clear related caches when data is modified
     */
    protected function clearRelatedCaches(array $cacheKeys)
    {
        foreach ($cacheKeys as $key) {
            Cache::forget($key);
        }
    }
}
