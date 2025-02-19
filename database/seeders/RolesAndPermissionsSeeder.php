<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\PermissionRegistrar;
use Illuminate\Support\Str;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
    app(PermissionRegistrar::class)->forgetCachedPermissions();
        app()['cache']->forget('spatie.permission.cache');

        // Define entities and actions
        $entities = [
            // Product
            'branch-product', 'inventory-purchase', 'request-order', 'sale', 'center-stock', 'request-return',
            // Operational
            'operational-center', 'operational-branch',
            // Management
            'report','report-branch', 'management-structure',
            // Karyawan
            'performance',
            // Database
            'branch', 'employee', 'product-category', 'product', 'expenditure', 'position', 'supplier',
            // Pengaturan
            'user', 'role', 'permission',
            // 'approval-type',
        ];
        $actions = ['menu', 'create', 'read', 'update', 'delete'];
        // Create permissions and store them in an associative array
        $permissions = [];
        foreach ($entities as $entity) {
            foreach ($actions as $action) {
                $permissions["{$entity}: {$action}"] = Permission::create(['name' => "{$entity}: {$action}"]);
            }
        }
        // Define roles and their permissions
        $roles = [
            'root' => [
                $permissions['branch-product: menu'], $permissions['branch-product: create'], $permissions['branch-product: read'], $permissions['branch-product: update'], $permissions['branch-product: delete'],
                $permissions['center-stock: menu'], $permissions['center-stock: create'], $permissions['center-stock: read'], $permissions['center-stock: update'], $permissions['center-stock: delete'],
                $permissions['inventory-purchase: menu'], $permissions['inventory-purchase: create'], $permissions['inventory-purchase: read'], $permissions['inventory-purchase: update'], $permissions['inventory-purchase: delete'],
                $permissions['request-order: menu'], $permissions['request-order: create'], $permissions['request-order: read'], $permissions['request-order: update'], $permissions['request-order: delete'],
                $permissions['request-return: menu'], $permissions['request-return: read'], $permissions['request-return: update'], $permissions['request-return: delete'],
                $permissions['sale: menu'], $permissions['sale: read'], $permissions['sale: update'], $permissions['sale: delete'],
                $permissions['operational-center: menu'], $permissions['operational-center: create'], $permissions['operational-center: read'], $permissions['operational-center: update'], $permissions['operational-center: delete'],
                $permissions['operational-branch: menu'], $permissions['operational-branch: read'], $permissions['operational-branch: update'], $permissions['operational-branch: delete'],
                $permissions['report: menu'], $permissions['report: create'], $permissions['report: read'], $permissions['report: update'], $permissions['report: delete'],
                $permissions['management-structure: menu'], $permissions['management-structure: create'], $permissions['management-structure: read'], $permissions['management-structure: update'], $permissions['management-structure: delete'],
                $permissions['branch: menu'], $permissions['branch: create'], $permissions['branch: read'], $permissions['branch: update'], $permissions['branch: delete'],
                $permissions['employee: menu'], $permissions['employee: create'], $permissions['employee: read'], $permissions['employee: update'], $permissions['employee: delete'],
                $permissions['product-category: menu'], $permissions['product-category: create'], $permissions['product-category: read'], $permissions['product-category: update'], $permissions['product-category: delete'],
                $permissions['product: menu'], $permissions['product: create'], $permissions['product: read'], $permissions['product: update'], $permissions['product: delete'],
                $permissions['expenditure: menu'], $permissions['expenditure: create'], $permissions['expenditure: read'], $permissions['expenditure: update'], $permissions['expenditure: delete'],
                $permissions['position: menu'], $permissions['position: create'], $permissions['position: read'], $permissions['position: update'], $permissions['position: delete'],
                $permissions['supplier: menu'], $permissions['supplier: create'], $permissions['supplier: read'], $permissions['supplier: update'], $permissions['supplier: delete'],
                $permissions['user: menu'], $permissions['user: create'], $permissions['user: read'], $permissions['user: update'], $permissions['user: delete'],
                $permissions['role: menu'], $permissions['role: create'], $permissions['role: read'], $permissions['role: update'], $permissions['role: delete'],
                $permissions['permission: menu'], $permissions['permission: create'], $permissions['permission: read'], $permissions['permission: update'], $permissions['permission: delete'],
                $permissions['performance: menu'], $permissions['performance: create'], $permissions['performance: read'], $permissions['performance: update'], $permissions['performance: delete'],
            ], // Root has all permissions
            'admin-pusat' => [
                $permissions['branch-product: menu'], $permissions['branch-product: create'], $permissions['branch-product: read'], $permissions['branch-product: update'], $permissions['branch-product: delete'],
                $permissions['center-stock: menu'], $permissions['center-stock: create'], $permissions['center-stock: read'], $permissions['center-stock: update'], $permissions['center-stock: delete'],
                $permissions['inventory-purchase: menu'], $permissions['inventory-purchase: create'], $permissions['inventory-purchase: read'], $permissions['inventory-purchase: update'], $permissions['inventory-purchase: delete'],
                $permissions['request-order: menu'], $permissions['request-order: create'], $permissions['request-order: read'], $permissions['request-order: update'], $permissions['request-order: delete'],
                $permissions['request-return: menu'], $permissions['request-return: read'], $permissions['request-return: update'], $permissions['request-return: delete'],
                $permissions['sale: menu'], $permissions['sale: read'], $permissions['sale: update'], $permissions['sale: delete'],
                $permissions['operational-center: menu'], $permissions['operational-center: create'], $permissions['operational-center: read'], $permissions['operational-center: update'], $permissions['operational-center: delete'],
                $permissions['operational-branch: menu'], $permissions['operational-branch: read'], $permissions['operational-branch: update'], $permissions['operational-branch: delete'],
                $permissions['report: menu'], $permissions['report: create'], $permissions['report: read'], $permissions['report: update'], $permissions['report: delete'],
                $permissions['management-structure: menu'], $permissions['management-structure: create'], $permissions['management-structure: read'], $permissions['management-structure: update'], $permissions['management-structure: delete'],
                $permissions['branch: menu'], $permissions['branch: create'], $permissions['branch: read'], $permissions['branch: update'], $permissions['branch: delete'],
                $permissions['employee: menu'], $permissions['employee: create'], $permissions['employee: read'], $permissions['employee: update'], $permissions['employee: delete'],
                $permissions['product-category: menu'], $permissions['product-category: create'], $permissions['product-category: read'], $permissions['product-category: update'], $permissions['product-category: delete'],
                $permissions['product: menu'], $permissions['product: create'], $permissions['product: read'], $permissions['product: update'], $permissions['product: delete'],
                $permissions['expenditure: menu'], $permissions['expenditure: create'], $permissions['expenditure: read'], $permissions['expenditure: update'], $permissions['expenditure: delete'],
                $permissions['position: menu'], $permissions['position: create'], $permissions['position: read'], $permissions['position: update'], $permissions['position: delete'],
                $permissions['supplier: menu'], $permissions['supplier: create'], $permissions['supplier: read'], $permissions['supplier: update'], $permissions['supplier: delete'],
                $permissions['user: menu'], $permissions['user: create'], $permissions['user: read'], $permissions['user: update'], $permissions['user: delete'],
                $permissions['role: menu'], $permissions['role: create'], $permissions['role: read'], $permissions['role: update'], $permissions['role: delete'],
                $permissions['permission: menu'], $permissions['permission: create'], $permissions['permission: read'], $permissions['permission: update'], $permissions['permission: delete'],
                $permissions['performance: menu'], $permissions['performance: create'], $permissions['performance: read'], $permissions['performance: update'], $permissions['performance: delete'],
            ],
            'karyawan' => [],
            'admin-branch' => [
                $permissions['request-order: menu'], $permissions['request-order: create'], $permissions['request-order: read'], $permissions['request-order: update'],
                $permissions['request-return: menu'], $permissions['request-return: create'], $permissions['request-return: read'], $permissions['request-return: update'],
                $permissions['operational-branch: menu'], $permissions['operational-branch: create'], $permissions['operational-branch: read'], $permissions['operational-branch: update'],
                $permissions['sale: menu'], $permissions['sale: create'], $permissions['sale: read'], $permissions['sale: update'],
                $permissions['report-branch: menu'],
                $permissions['branch-product: menu'], $permissions['branch-product: read'],
                $permissions['performance: menu'], $permissions['performance: read'],
            ]
            // 'instructor' => [
            //     $permissions['course: menu'], $permissions['course: create'], $permissions['course: read'], $permissions['course: update'],
            //     $permissions['lesson: menu'], $permissions['lesson: create'], $permissions['lesson: read'], $permissions['lesson: update'],
            //     $permissions['test: menu'], $permissions['test: create'], $permissions['test: read'], $permissions['test: update'],
            //     $permissions['question: menu'], $permissions['question: create'], $permissions['question: read'], $permissions['question: update'],
            //     $permissions['employee: menu'], $permissions['employee: create'], $permissions['employee: read'],
            //     $permissions['tracking: menu'], $permissions['tracking: create'], $permissions['tracking: read'],
            // ],
            // 'employee' => [], // Define employee permissions if needed
        ];
        // Create roles and assign permissions
        foreach ($roles as $roleName => $rolePermissions) {
            $role = Role::create(['name' => $roleName]);
            $role->syncPermissions($rolePermissions);
        }
        // Define users and their roles
        $users = [
            [
                'name'     => 'Root',
                'username' => 'root',
                'email'    => 'root@system.com',
                'password' => 'password',
                'role'     => 'root'
            ],
            [
                'name'     => 'Admin Pusat',
                'username' => 'admin_pusat',
                'email'    => 'admin_pusat@system.com',
                'password' => 'password',
                'role'     => 'admin-pusat'
            ],
            [
                'name'     => 'Cabang Maros',
                'username' => 'cabang_maros',
                'email'    => 'cabang_maros@system.com',
                'password' => 'password',
                'role'     => 'admin-branch'
            ],
            [
                'name'     => 'Cabang Sudiang',
                'username' => 'cabang_sudiang',
                'email'    => 'cabang_sudiang@system.com',
                'password' => 'password',
                'role'     => 'admin-branch'
            ],
            [
                'name'     => 'Teknisi Cabang Sudiang',
                'username' => 'teknisi_cabang_sudiang',
                'email'    => 'teknisi_cabang_sudiang@system.com',
                'password' => 'password',
                'role'     => 'karyawan'
            ],
        ];

        // Create users and assign roles
        foreach ($users as $userData) {
            $user = User::create([
                'name'              => $userData['name'],
                'username'          => $userData['username'],
                'email'             => $userData['email'],
                'email_verified_at' => now(),
                'password'          => Hash::make($userData['password']),
                'remember_token'    => Str::random(10),
            ])->assignRole($userData['role']);
            $user->createToken($userData['name']);
        }
    }
}
