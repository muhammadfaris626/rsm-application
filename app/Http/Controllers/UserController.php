<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Http\Resources\RoleResource;
use App\Http\Resources\UserResource;
use App\Models\Role;
use App\Models\User;
use App\Traits\OptimizedQueries;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Session;

class UserController extends Controller {
    use OptimizedQueries;

    protected function applySearch($query, $search) {
        return $query->when($search, function($query, $search) {
            $query->where('name', 'LIKE', '%' . $search . '%');
        });
    }

    public function index(Request $request): Response {
        Gate::authorize('viewAny', User::class);
        
        // Optimized query with eager loading
        $searchQuery = User::query()
            ->select('id', 'name', 'username', 'email', 'created_at', 'updated_at')
            ->with('roles:id,name')
            ->latest();
        
        $this->applySearch($searchQuery, $request->search);
        $data = UserResource::collection($searchQuery->paginate(12));
        
        // Use cached roles
        $roles = $this->getCachedRoles();
        
        return Inertia::render('Settings/Users/IndexUser', [
            'fetchData' => $data,
            'search' => $request->search ?? '',
            'roles' => RoleResource::collection($roles)
        ]);
    }

    public function create()
    {
        //
    }

    public function store(UserRequest $request): RedirectResponse {
        Gate::authorize('create', User::class);
        $data = User::create($request->validated());
        $role = Role::find($request->roles);
        $data->syncRoles($role->name);
        Session::flash('toast', ['message' => 'Data berhasil ditambahkan.']);
        return back();
    }

    public function show(User $user)
    {
        //
    }

    public function edit(User $user)
    {
        //
    }

    public function update(UserRequest $request, $id): RedirectResponse {
        $data = User::findOrFail($id);
        Gate::authorize('update', $data);

        $data->update([
            'name' => $request->name,
            'username' => $request->username,
            'email' => $request->email,
        ]);

        if ($request->has('roles')) {
            $role = Role::findOrFail($request->roles);
            $data->syncRoles($role->name);
        }

        if ($request->filled('password')) {
            $validated = $request->validate([
                'password' => 'required|min:8|confirmed',
            ]);

            if ($request->password !== $request->password_confirmation) {
                Session::flash('toast', ['message' => 'Password dan konfirmasi password tidak cocok.', 'type' => 'error']);
                return back();
            }

            $data->password = bcrypt($validated['password']);
            $data->save();
        }

        Session::flash('toast', ['message' => 'Data berhasil diubah.']);
        return back();
    }

    public function destroy($id): RedirectResponse
    {
        $data = User::find($id);
        Gate::authorize('delete', $data);
        $data->delete();
        Session::flash('toast', ['message' => 'Data berhasil dihapus.']);
        return back();
    }
}
