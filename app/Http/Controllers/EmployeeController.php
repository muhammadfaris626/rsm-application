<?php

namespace App\Http\Controllers;

use App\Http\Requests\EmployeeRequest;
use App\Http\Resources\BranchResource;
use App\Http\Resources\EmployeeResource;
use App\Models\Branch;
use App\Models\Employee;
use App\Models\UpdateEmployeeHistory;
use App\Models\User;
use App\Traits\OptimizedQueries;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;

class EmployeeController extends Controller
{
    use OptimizedQueries;

    protected function applySearch($query, $search) {
        return $query->when($search, function($query, $search) {
            $query->where(function($query) use($search) {
                $query->where('employee_number', 'LIKE', '%' . $search . '%')
                    ->orWhere('name', 'LIKE', '%' . $search . '%')
                    ->orWhere('place_of_birth', 'LIKE', '%' . $search . '%')
                    ->orWhere('date_of_birth', 'LIKE', '%' . $search . '%')
                    ->orWhere('phone', 'LIKE', '%' . $search . '%')
                    ->orWhere('status', 'LIKE', '%' . $search . '%')
                    ->orWhereHas('branch', function($query) use($search) {
                        $query->where('branch_name', 'LIKE', '%' . $search . '%');
                    });
            });
        });
    }

    private function fieldIdFromRequest($value): mixed
    {
        if (is_array($value)) {
            return $value['id'] ?? $value[0]['id'] ?? null;
        }

        if (is_object($value)) {
            return $value->id ?? null;
        }

        return $value;
    }

    private function userOptions()
    {
        return User::select('id', 'name', 'username', 'email')
            ->orderBy('name')
            ->get()
            ->map(fn ($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'email' => $user->email,
                'label' => "{$user->name} ({$user->username})",
            ]);
    }

    public function index(Request $request): Response {
        Gate::authorize('viewAny', Employee::class);
        
        // Optimized query with eager loading
        $searchQuery = Employee::query()
            ->select('id', 'employee_number', 'user_id', 'name', 'place_of_birth', 'date_of_birth', 'phone', 'branch_id', 'status', 'created_at', 'updated_at')
            ->with([
                'branch:id,branch_name,branch_code',
                'user:id,name,username,email',
                'updateEmployeeHistory.user',
            ])
            ->latest();
        
        $this->applySearch($searchQuery, $request->search);
        $data = EmployeeResource::collection($searchQuery->paginate(12)->withQueryString());
        
        // Use cached branches
        $branches = $this->getCachedActiveBranches();
        
        return Inertia::render('Database/Employees/IndexEmployee', [
            'fetchData' => $data,
            'search' => $request->search ?? '',
            'branches' => BranchResource::collection($branches),
            'users' => $this->userOptions(),
        ]);
    }

    public function create()
    {
        //
    }

    public function store(EmployeeRequest $request): RedirectResponse {
        Gate::authorize('create', Employee::class);
        $userId = $this->fieldIdFromRequest($request->user_id);
        if ($userId && Employee::where('user_id', $userId)->exists()) {
            Session::flash('toast', [
                'message' => 'Akun user yang dipilih sudah terhubung dengan karyawan lain.',
                'type' => 'error'
            ]);
            return back();
        }

        $user = $userId
            ? User::find($userId)
            : User::firstOrCreate(
                ['username' => $request->employee_number],
                [
                    'name' => $request->name,
                    'email' => $request->employee_number . '@gmail.com',
                    'email_verified_at' => now(),
                    'password' => bcrypt('12345678'),
                    'remember_token' => Str::random(10),
                ]
            );

        if ($user && ! $user->hasRole('karyawan')) {
            $user->assignRole('karyawan');
        }

        $employee = Employee::create([
            'employee_number' => $request->employee_number,
            'user_id' => $user?->id,
            'name' => $request->name,
            'place_of_birth' => $request->place_of_birth,
            'date_of_birth' => $request->date_of_birth,
            'phone' => $request->phone,
            'branch_id' => $this->fieldIdFromRequest($request->branch_id),
            'status' => $request->status
        ]);
        UpdateEmployeeHistory::create([
            'employee_id' => $employee->id,
            'user_id' => Auth::user()->id
        ]);
        
        // Clear employee cache
        $this->clearRelatedCaches(['active_employees']);
        
        Session::flash('toast', [ 'message' => 'Data berhasil ditambahkan.' ]);
        return back();
    }

    public function show(Employee $employee)
    {
        //
    }

    public function edit(Employee $employee)
    {
        //
    }

    public function update(EmployeeRequest $request, Employee $employee): RedirectResponse {
        Gate::authorize('update', $employee);
        $oldEmployeeNumber = $employee->employee_number;
        $oldUserId = $employee->user_id;
        $userId = $this->fieldIdFromRequest($request->user_id);

        if ($userId && Employee::where('user_id', $userId)->where('id', '!=', $employee->id)->exists()) {
            Session::flash('toast', [
                'message' => 'Akun user yang dipilih sudah terhubung dengan karyawan lain.',
                'type' => 'error'
            ]);
            return back();
        }
        
        $employee->update([
            'employee_number' => $request->employee_number,
            'user_id' => $userId,
            'name' => $request->name,
            'place_of_birth' => $request->place_of_birth,
            'date_of_birth' => $request->date_of_birth,
            'phone' => $request->phone,
            'branch_id' => $this->fieldIdFromRequest($request->branch_id),
            'status' => $request->status
        ]);
        UpdateEmployeeHistory::create([
            'employee_id' => $employee->id,
            'user_id' => Auth::user()->id
        ]);
        
        $linkedUser = $userId ? User::find($userId) : null;
        if ($linkedUser && ! $linkedUser->hasRole('karyawan')) {
            $linkedUser->assignRole('karyawan');
        }
        
        // Clear employee caches
        $this->clearRelatedCaches(array_filter([
            'active_employees',
            "employee_{$oldEmployeeNumber}",
            "employee_{$request->employee_number}",
            $oldUserId ? "employee_user_{$oldUserId}" : null,
            $userId ? "employee_user_{$userId}" : null,
        ]));
        
        Session::flash('toast', [ 'message' => 'Data berhasil diubah.' ]);
        return back();
    }

    public function destroy(Employee $employee): RedirectResponse {
        Gate::authorize('delete', $employee);
        
        // Cek data terkait untuk mencegah integrity error
        if (\App\Models\Attendance::where('employee_id', $employee->id)->exists() || 
            \App\Models\Mutation::where('employee_id', $employee->id)->exists() ||
            \App\Models\Termination::where('employee_id', $employee->id)->exists() ||
            \App\Models\ManagementStructure::where('employee_id', $employee->id)->exists()) {
            Session::flash('toast', [
                'message' => 'Gagal menghapus! Karyawan ini memiliki data terkait (Absensi/Mutasi/PHK/Struktur Manajemen).',
                'type' => 'error'
            ]);
            return back();
        }
        
        $employeeNumber = $employee->employee_number;
        $userId = $employee->user_id;

        UpdateEmployeeHistory::where('employee_id', $employee->id)->delete();
        $employee->delete();

        $user = $employee->user_id ? User::find($employee->user_id) : User::where('username', $employeeNumber)->first();
        if ($user && $user->username === $employeeNumber) {
            $user->delete();
        }
        
        // Clear employee caches
        $this->clearRelatedCaches(array_filter(['active_employees', "employee_{$employeeNumber}", $userId ? "employee_user_{$userId}" : null]));

        Session::flash('toast', [ 'message' => 'Data karyawan berhasil dihapus.' ]);
        return back();
    }
}
