<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoleRequest;
use App\Http\Resources\PermissionResource;
use App\Http\Resources\RoleResource;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;

class RoleController extends Controller {

    protected function applySearch($query, $search) {
        return $query->when($search, function($query, $search) {
            $query->where('name', 'LIKE', '%' . $search . '%');
        });
    }

    public function index(Request $request): Response {
        Gate::authorize('viewAny', Role::class);
        $searchQuery = Role::query()->latest();
        $this->applySearch($searchQuery, $request->search);
        $data = RoleResource::collection($searchQuery->paginate(12));
        return Inertia::render('Settings/Roles/IndexRole', [
            'fetchData' => $data,
            'permissions' => PermissionResource::collection(Permission::all()),
            'search' => $request->search ?? ''
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(RoleRequest $request): RedirectResponse {
        Gate::authorize('create', Role::class);
        $peran = Role::create(['name' => $request->name]);
        if ($request->has('permissions')) {
            $peran->syncPermissions($request->input('permissions.*.name'));
        }
        Session::flash('toast', ['message' => 'Data berhasil ditambahkan.']);
        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show(Role $role): Response {
        Gate::authorize('view', $role);

        $allPermissions = [
            'USER', 'ROLE', 'PERMISSION', 'PRODUCT-CATEGORY', 'PRODUCT', 'EMPLOYEE', 'BRANCH', 'EXPENDITURE', 'POSITION', 'SUPPLIER', 'OPERATIONAL-CENTER', 'OPERATIONAL-BRANCH',
            'MANAGEMENT-STRUCTURE', 'INVENTORY-PURCHASE', 'REQUEST-ORDER', 'BRANCH-PRODUCT', 'CENTER-STOCK', 'SALE', 'REPORT', 'REPORT-BRANCH', 'PERFORMANCE', 'REQUEST-RETURN'
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
            'PERFORMANCE'             => 'KINERJA'
        ];

        $list = [];

        foreach ($allPermissions as $key => $value) {
            $displayName = $categoryNames[$value] ?? $value;
            $list[$key] = ['role_id' => $role->id, 'category' => $displayName];

            // Query untuk mendapatkan permissions berdasarkan kategori
            $query = Permission::query();

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

            // Jika tidak ada permission yang ditemukan, tambahkan data kosong untuk debugging
            if ($permissions->isEmpty()) {
                $list[$key][$displayName] = [];
                continue;
            }

            // Tambahkan permission ke dalam list berdasarkan kategori
            foreach ($permissions as $data) {
                $check = DB::table('role_has_permissions')
                    ->where('role_id', $role->id)
                    ->where('permission_id', $data->id)
                    ->exists();

                $status = $check ? 1 : 0;

                // Gunakan ID sebagai key untuk menghindari duplikasi
                $list[$key][$displayName][$data->id] = [
                    'id' => $data->id,
                    'name' => $data->name,
                    'status' => $status
                ];
            }
        }

        return Inertia::render('Settings/Roles/ReadRole', [
            'fetchData' => $list
        ]);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Role $role)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(RoleRequest $request, $id): RedirectResponse
    {
        $data = Role::find($id);
        Gate::authorize('update', $data);
        $data->update([
            'name' => $request->name
        ]);
        Session::flash('toast', ['message' => 'Data berhasil diubah.']);
        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id): RedirectResponse {
        $data = Role::find($id);
        Gate::authorize('delete', $data);
        Role::where('id', $id)->delete();
        Session::flash('toast', 'Data berhasil dihapus.');
        return back();
    }

    public function updateRolePermission($role, $permission) {
        $checkRolePermission = DB::table('role_has_permissions')->where('role_id', $role)->where('permission_id', $permission)->first();
        $searchRole = Role::where('id', $role)->first();
        $searchPermission = Permission::where('id', $permission)->first();
        if (empty($checkRolePermission)) {
            $searchRole->givePermissionTo($searchPermission);
            $searchPermission->assignRole($searchRole);
            Session::flash('toast', ['message' => 'Perizinan berhasil ditambahkan.']);
        }else{
            $searchRole->revokePermissionTo($searchPermission);
            $searchPermission->removeRole($searchRole);
            Session::flash('toast', ['message' => 'Perizinan berhasil dihapus.']);
        }
        return back();
    }
}
