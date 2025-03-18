<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Http\Resources\RoleResource;
use App\Http\Resources\UserResource;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Session;

class UserController extends Controller {

    protected function applySearch($query, $search) {
        return $query->when($search, function($query, $search) {
            $query->where('name', 'LIKE', '%' . $search . '%');
        });
    }

    public function index(Request $request): Response {
        Gate::authorize('viewAny', User::class);
        $searchQuery = User::query()->latest();
        $this->applySearch($searchQuery, $request->search);
        $data = UserResource::collection($searchQuery->paginate(12));
        return Inertia::render('Settings/Users/IndexUser', [
            'fetchData' => $data,
            'search' => $request->search ?? '',
            'roles' => RoleResource::collection(Role::all())
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
    public function store(UserRequest $request): RedirectResponse {
        Gate::authorize('create', User::class);
        $data = User::create($request->validated());
        $role = Role::find($request->roles);
        $data->syncRoles($role->name);
        Session::flash('toast', ['message' => 'Data berhasil ditambahkan.']);
        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserRequest $request, $id): RedirectResponse {
        // Temukan data User berdasarkan ID
        $data = User::findOrFail($id);

        // Pastikan pengguna yang melakukan aksi memiliki izin untuk mengupdate
        Gate::authorize('update', $data);

        // Update data user yang diterima dari form request (selain password)
        $data->update([
            'name' => $request->name,
            'username' => $request->username,
            'email' => $request->email,
        ]);

        // Periksa apakah ada perubahan role dan sync role baru
        if ($request->has('roles')) {
            $role = Role::findOrFail($request->roles);
            $data->syncRoles($role->name);
        }

        // Periksa apakah password baru ada dalam request dan valid
        if ($request->filled('password')) {
            // Validasi password dan konfirmasi password
            $validated = $request->validate([
                'password' => 'required|min:8|confirmed',
            ]);

            // Periksa apakah password dan konfirmasi password sama
            if ($request->password !== $request->password_confirmation) {
                Session::flash('toast', ['message' => 'Password dan konfirmasi password tidak cocok.', 'type' => 'error']);
                return back();
            }

            // Update password
            $data->password = bcrypt($validated['password']);
            $data->save();
        }

        // Memberikan notifikasi berhasil
        Session::flash('toast', ['message' => 'Data berhasil diubah.']);

        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id): RedirectResponse
    {
        $data = User::find($id);
        Gate::authorize('delete', $data);
        $data->delete();
        Session::flash('toast', ['message' => 'Data berhasil dihapus.']);
        return back();
    }
}
