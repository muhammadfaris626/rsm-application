<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (! Schema::hasTable('permissions') || ! Schema::hasTable('roles') || ! Schema::hasTable('role_has_permissions')) {
            return;
        }

        $entities = [
            'branch-product', 'inventory-purchase', 'request-order', 'sale', 'center-stock', 'request-return',
            'operational-center', 'operational-branch',
            'report', 'report-branch', 'management-structure',
            'attendance', 'performance', 'mutation', 'termination',
            'branch', 'employee', 'product-category', 'product', 'expenditure', 'position', 'supplier', 'location',
            'user', 'role', 'permission', 'approval-type',
        ];
        $actions = ['menu', 'create', 'read', 'update', 'delete'];
        $permissionNames = [];

        foreach ($entities as $entity) {
            foreach ($actions as $action) {
                $permissionNames[] = "{$entity}: {$action}";
            }
        }

        $now = now();
        $existingPermissions = DB::table('permissions')
            ->whereIn('name', $permissionNames)
            ->pluck('name')
            ->all();

        $missingPermissions = array_diff($permissionNames, $existingPermissions);
        foreach ($missingPermissions as $permissionName) {
            DB::table('permissions')->insert([
                'name' => $permissionName,
                'guard_name' => 'web',
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        $permissionIds = DB::table('permissions')
            ->whereIn('name', $permissionNames)
            ->pluck('id')
            ->all();
        $roleIds = DB::table('roles')
            ->whereIn('name', ['root', 'admin-pusat'])
            ->pluck('id')
            ->all();

        foreach ($roleIds as $roleId) {
            foreach ($permissionIds as $permissionId) {
                DB::table('role_has_permissions')->insertOrIgnore([
                    'permission_id' => $permissionId,
                    'role_id' => $roleId,
                ]);
            }
        }

        app('cache')
            ->store(config('permission.cache.store') !== 'default' ? config('permission.cache.store') : null)
            ->forget(config('permission.cache.key'));
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
