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
    }

    public function index(Request $request): Response {
        Gate::authorize('viewAny', Employee::class);
        
        // Optimized query with eager loading
        $searchQuery = Employee::query()
            ->select('id', 'employee_number', 'name', 'place_of_birth', 'date_of_birth', 'phone', 'branch_id', 'status', 'created_at', 'updated_at')
            ->with('branch:id,branch_name,branch_code')
            ->latest();
        
        $this->applySearch($searchQuery, $request->search);
        $data = EmployeeResource::collection($searchQuery->paginate(12));
        
        // Use cached branches
        $branches = $this->getCachedActiveBranches();
        
        return Inertia::render('Database/Employees/IndexEmployee', [
            'fetchData' => $data,
            'search' => $request->search ?? '',
            'branches' => BranchResource::collection($branches)
        ]);
    }

    public function create()
    {
        //
    }

    public function store(EmployeeRequest $request): RedirectResponse {
        Gate::authorize('create', Employee::class);
        $employee = Employee::create([
            'employee_number' => $request->employee_number,
            'name' => $request->name,
            'place_of_birth' => $request->place_of_birth,
            'date_of_birth' => $request->date_of_birth,
            'phone' => $request->phone,
            'branch_id' => $request->branch_id['id'],
            'status' => $request->status
        ]);
        UpdateEmployeeHistory::create([
            'employee_id' => $employee->id,
            'user_id' => Auth::user()->id
        ]);
        User::create([
            'name' => $request->name,
            'username' => $request->employee_number,
            'email' => $request->employee_number . '@gmail.com',
            'email_verified_at' => now(),
            'password' => bcrypt('12345678'),
            'remember_token' => Str::random(10)
        ])->assignRole('karyawan');
        
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
        
        $employee->update([
            'employee_number' => $request->employee_number,
            'name' => $request->name,
            'place_of_birth' => $request->place_of_birth,
            'date_of_birth' => $request->date_of_birth,
            'phone' => $request->phone,
            'branch_id' => $request->branch_id[0]['id'],
            'status' => $request->status
        ]);
        UpdateEmployeeHistory::create([
            'employee_id' => $employee->id,
            'user_id' => Auth::user()->id
        ]);
        
        // Jika username (employee_number) berubah, update data user terkait
        if ($oldEmployeeNumber !== $request->employee_number) {
            $user = User::where('username', $oldEmployeeNumber)->first();
            if ($user) {
                $user->update([
                    'name' => $request->name,
                    'username' => $request->employee_number,
                    'email' => $request->employee_number . '@gmail.com',
                ]);
            }
        }
        
        // Clear employee caches
        $this->clearRelatedCaches(['active_employees', "employee_{$oldEmployeeNumber}", "employee_{$request->employee_number}"]);
        
        Session::flash('toast', [ 'message' => 'Data berhasil diubah.' ]);
        return back();
    }

    public function destroy(Employee $employee): RedirectResponse {
        Gate::authorize('delete', $employee);
        
        $employeeNumber = $employee->employee_number;

        UpdateEmployeeHistory::where('employee_id', $employee->id)->delete();
        $employee->delete();

        $user = User::where('username', $employeeNumber)->first();
        if ($user) {
            $user->delete();
        }
        
        // Clear employee caches
        $this->clearRelatedCaches(['active_employees', "employee_{$employeeNumber}"]);

        Session::flash('toast', [ 'message' => 'Data karyawan berhasil dihapus.' ]);
        return back();
    }
}
