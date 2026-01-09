<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * This migration adds indexes to frequently queried columns
     * to significantly improve query performance.
     */
    public function up(): void
    {
        // Add indexes to sales table
        Schema::table('sales', function (Blueprint $table) {
            // Index for filtering by branch and date
            $table->index(['branch_id', 'updated_at'], 'sales_branch_updated_idx');
            $table->index('updated_at', 'sales_updated_idx');
        });

        // Add indexes to operational_branches table
        Schema::table('operational_branches', function (Blueprint $table) {
            $table->index(['branch_id', 'updated_at'], 'op_branch_branch_updated_idx');
            $table->index('updated_at', 'op_branch_updated_idx');
        });

        // Add indexes to employees table
        Schema::table('employees', function (Blueprint $table) {
            $table->index(['status', 'branch_id'], 'employees_status_branch_idx');
            $table->index('employee_number', 'employees_number_idx');
        });

        // Add indexes to branches table
        Schema::table('branches', function (Blueprint $table) {
            $table->index('status', 'branches_status_idx');
        });

        // Add indexes to request_orders table
        Schema::table('request_orders', function (Blueprint $table) {
            $table->index(['branch_id', 'created_at'], 'req_orders_branch_created_idx');
            $table->index('status', 'req_orders_status_idx');
        });

        // Add indexes to list_sales table for sum calculations
        Schema::table('list_sales', function (Blueprint $table) {
            $table->index(['sale_id', 'total_price'], 'list_sales_sale_price_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->dropIndex('sales_branch_updated_idx');
            $table->dropIndex('sales_updated_idx');
        });

        Schema::table('operational_branches', function (Blueprint $table) {
            $table->dropIndex('op_branch_branch_updated_idx');
            $table->dropIndex('op_branch_updated_idx');
        });

        Schema::table('employees', function (Blueprint $table) {
            $table->dropIndex('employees_status_branch_idx');
            $table->dropIndex('employees_number_idx');
        });

        Schema::table('branches', function (Blueprint $table) {
            $table->dropIndex('branches_status_idx');
        });

        Schema::table('request_orders', function (Blueprint $table) {
            $table->dropIndex('req_orders_branch_created_idx');
            $table->dropIndex('req_orders_status_idx');
        });

        Schema::table('list_sales', function (Blueprint $table) {
            $table->dropIndex('list_sales_sale_price_idx');
        });
    }
};
