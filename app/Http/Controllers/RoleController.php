<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoleRequest;
use App\Http\Resources\PermissionResource;
use App\Http\Resources\RoleResource;
use App\Models\Permission;
use App\Models\Role;
use App\Traits\OptimizedQueries;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;

class RoleController extends Controller {
    use OptimizedQueries;

    protected function applySearch($query, $search) {
        return $query->when($search, function($query, $search) {
            $query->where('name', 'LIKE', '%' . $search . '%');
        });
    }

    public function index(Request $request): Response {
        Gate::authorize('viewAny', Role::class);
        
        // Optimized query
        $searchQuery = Role::query()
            ->select('id', 'name', 'guard_name', 'created_at', 'updated_at')
            ->latest();
        
        $this->applySearch($searchQuery, $request->search);
        $data = RoleResource::collection($searchQuery->paginate(12));
        
        // Cache permissions
        $permissions = Cache::remember('all_permissions', 600, function() {
            return Permission::select('id', 'name')->get();
        });
        
        return Inertia::render('Settings/Roles/IndexRole', [
            'fetchData' => $data,
            'permissions' => PermissionResource::collection($permissions),
            'search' => $request->search ?? ''
        ]);
    }

    public function create()
    {
        //
    }

    public function store(RoleRequest $request): RedirectResponse {
        Gate::authorize('create', Role::class);
        $peran = Role::create(['name' => $request->name]);
        if ($request->has('permissions')) {
            $peran->syncPermissions($request->input('permissions.*.name'));
        }
        
        // Clear role cache
        $this->clearRelatedCaches(['all_roles']);
        
        Session::flash('toast', ['message' => 'Data berhasil ditambahkan.']);
        return back();
    }

    public function show(Role $role): Response {
        Gate::authorize('view', $role);

        $list = $this->buildPermissionsList($role);

        return Inertia::render('Settings/Roles/ReadRole', [
            'fetchData' => $list,
            'namaRole' => str_replace("-", " ", strtoupper($role->name))
        ]);
    }

    private function buildPermissionsList(Role $role): array {
        $allPermissions = [
            'USER', 'ROLE', 'PERMISSION', 'PRODUCT-CATEGORY', 'PRODUCT', 'EMPLOYEE', 'BRANCH', 'EXPENDITURE', 'POSITION', 'SUPPLIER', 'LOCATION', 'OPERATIONAL-CENTER', 'OPERATIONAL-BRANCH',
            'MANAGEMENT-STRUCTURE', 'INVENTORY-PURCHASE', 'REQUEST-ORDER', 'BRANCH-PRODUCT', 'CENTER-STOCK', 'SALE', 'REPORT', 'REPORT-BRANCH', 'PERFORMANCE', 'REQUEST-RETURN', 'ATTENDANCE',
            'MUTATION', 'TERMINATION', 'APPROVAL-TYPE'
        ];

        $categoryNames = [
            'USER'                    => 'AKUN',
            'ROLE'                    => 'PERAN',
            'PERMISSION'              => 'IZIN',
            'PRODUCT-CATEGORY'        => 'KATEGORI BARANG',
            'PRODUCT'                 => 'BARANG',
            'EMPLOYEE'                => 'KARYAWAN',
            'BRANCH'                  => 'CABANG',
            'EXPENDITURE'             => 'PENGELUARAN',
            'POSITION'                => 'JABATAN',
            'SUPPLIER'                => 'SUPPLIER',
            'LOCATION'                => 'LOKASI',
            'OPERATIONAL-CENTER'      => 'OPERASIONAL PUSAT',
            'OPERATIONAL-BRANCH'      => 'OPERASIONAL CABANG',
            'MANAGEMENT-STRUCTURE'    => 'STRUKTUR MANAJEMEN',
            'INVENTORY-PURCHASE'      => 'PEMBELIAN PERSEDIAAN',
            'REQUEST-ORDER'           => 'PERMINTAAN PESANAN',
            'REQUEST-RETURN'          => 'PERMINTAAN RETUR',
            'BRANCH-PRODUCT'          => 'BARANG CABANG',
            'CENTER-STOCK'            => 'BARANG PUSAT',
            'SALE'                    => 'PENJUALAN',
            'REPORT'                  => 'LAPORAN',
            'REPORT-BRANCH'           => 'LAPORAN CABANG',
            'PERFORMANCE'             => 'KINERJA',
            'ATTENDANCE'              => 'ABSENSI',
            'MUTATION'                => 'MUTASI',
            'TERMINATION'             => 'PEMBERHENTIAN',
            'APPROVAL-TYPE'           => 'JENIS PERSETUJUAN',
        ];

        // Get all role permissions in one query
        $rolePermissionIds = DB::table('role_has_permissions')
            ->where('role_id', $role->id)
            ->pluck('permission_id')
            ->toArray();

        $list = [];

        foreach ($allPermissions as $key => $value) {
            $displayName = $categoryNames[$value] ?? $value;
            $list[$key] = ['role_id' => $role->id, 'category' => $displayName];

            $query = Permission::query()->select('id', 'name');

            if ($value === 'PRODUCT-CATEGORY') {
                $query->where('name', 'LIKE', '%PRODUCT-CATEGORY%');
            } elseif ($value === 'PRODUCT') {
                $query->where('name', 'LIKE', '%PRODUCT%')
                    ->where('name', 'NOT LIKE', '%CATEGORY%')
                    ->where('name', 'NOT LIKE', '%BRANCH-PRODUCT%');
            } elseif ($value === 'BRANCH') {
                $query->where(function ($q) {
                    $q->where('name', 'LIKE', '%BRANCH%')
                        ->where('name', 'NOT LIKE', '%OPERATIONAL%')
                        ->where('name', 'NOT LIKE', '%BRANCH-PRODUCT%')
                        ->where('name', 'NOT LIKE', '%REPORT%');
                });
            } elseif ($value === 'OPERATIONAL-BRANCH') {
                $query->where('name', 'LIKE', '%OPERATIONAL-BRANCH%');
            } elseif ($value === 'BRANCH-PRODUCT') {
                $query->where('name', 'LIKE', '%BRANCH-PRODUCT%');
            } elseif ($value === 'REPORT') {
                $query->where('name', 'LIKE', '%REPORT%')
                    ->where('name', 'NOT LIKE', '%BRANCH%');
            } elseif ($value === 'REPORT-BRANCH') {
                $query->where('name', 'LIKE', '%REPORT-BRANCH%');
            } else {
                $query->where('name', 'LIKE', '%' . $value . '%');
            }

            $permissions = $query->get();

            if ($permissions->isEmpty()) {
                $list[$key][$displayName] = [];
                continue;
            }

            foreach ($permissions as $data) {
                $status = in_array($data->id, $rolePermissionIds) ? 1 : 0;
                $list[$key][$displayName][$data->id] = [
                    'id' => $data->id,
                    'name' => $data->name,
                    'status' => $status
                ];
            }
        }

        return $list;
    }

    public function edit(Role $role)
    {
        //
    }

    public function update(RoleRequest $request, $id): RedirectResponse
    {
        $data = Role::findOrFail($id);
        Gate::authorize('update', $data);
        $data->update(['name' => $request->name]);
        
        // Clear role caches
        $this->clearRelatedCaches(['all_roles', "role_permissions_{$id}"]);
        
        Session::flash('toast', ['message' => 'Data berhasil diubah.']);
        return back();
    }

    public function destroy($id): RedirectResponse {
        $data = Role::findOrFail($id);
        Gate::authorize('delete', $data);
        if ($data->users()->exists()) {
            Session::flash('toast', [
                'message' => 'Gagal menghapus! Peran ini masih digunakan oleh akun.',
                'type' => 'error'
            ]);
            return back();
        }

        $data->delete();
        
        // Clear role caches
        $this->clearRelatedCaches(['all_roles', "role_permissions_{$id}"]);
        
        Session::flash('toast', ['message' => 'Data berhasil dihapus.']);
        return back();
    }

    public function updateRolePermission($role, $permission) {
        $checkRolePermission = DB::table('role_has_permissions')
            ->where('role_id', $role)
            ->where('permission_id', $permission)
            ->first();
        
        $searchRole = Role::find($role);
        $searchPermission = Permission::find($permission);
        if (!$searchRole || !$searchPermission) {
            Session::flash('toast', [
                'message' => 'Peran atau perizinan tidak ditemukan.',
                'type' => 'error'
            ]);
            return back();
        }
        
        if (empty($checkRolePermission)) {
            $searchRole->givePermissionTo($searchPermission);
            $searchPermission->assignRole($searchRole);
            Session::flash('toast', ['message' => 'Perizinan berhasil ditambahkan.']);
        } else {
            $searchRole->revokePermissionTo($searchPermission);
            $searchPermission->removeRole($searchRole);
            Session::flash('toast', ['message' => 'Perizinan berhasil dihapus.']);
        }
        
        // Clear role permission cache
        Cache::forget("role_permissions_{$role}");
        
        return back();
    }
}
