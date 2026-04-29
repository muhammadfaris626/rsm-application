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
            'attendance', 'performance', 'mutation', 'termination',
            // Database
            'branch', 'employee', 'product-category', 'product', 'expenditure', 'position', 'supplier', 'location',
            // Pengaturan
            'user', 'role', 'permission', 'approval-type',
        ];
        $actions = ['menu', 'create', 'read', 'update', 'delete'];
        // Create permissions and store them in an associative array
        $permissions = [];
        foreach ($entities as $entity) {
            foreach ($actions as $action) {
                $permissionName = "{$entity}: {$action}";
                $permissions[$permissionName] = Permission::firstOrCreate([
                    'name' => $permissionName,
                    'guard_name' => 'web',
                ]);
            }
        }
        $allPermissions = array_values($permissions);

        // Define roles and their permissions
        $roles = [
            'root' => $allPermissions, // Root has all permissions
            'admin-pusat' => $allPermissions,
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
            $role = Role::firstOrCreate([
                'name' => $roleName,
                'guard_name' => 'web',
            ]);
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
            $user = User::firstOrCreate(
                ['username' => $userData['username']],
                [
                    'name'              => $userData['name'],
                    'email'             => $userData['email'],
                    'email_verified_at' => now(),
                    'password'          => Hash::make($userData['password']),
                    'remember_token'    => Str::random(10),
                ]
            );

            $user->syncRoles([$userData['role']]);
            $user->createToken($userData['name']);
        }
    }
}
