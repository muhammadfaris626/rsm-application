<?php

namespace App\Http\Controllers;

use App\Http\Requests\EmployeeRequest;
use App\Http\Resources\BranchResource;
use App\Http\Resources\EmployeeResource;
use App\Models\Branch;
use App\Models\Employee;
use App\Models\UpdateEmployeeHistory;
use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;

class EmployeeController extends Controller
{
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
        $searchQuery = Employee::query()->latest();
        $this->applySearch($searchQuery, $request->search);
        $data = EmployeeResource::collection($searchQuery->paginate(12));
        return Inertia::render('Database/Employees/IndexEmployee', [
            'fetchData' => $data,
            'search' => $request->search ?? '',
            'branches' => BranchResource::collection(Branch::where('status', 'Aktif')->get())
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
        Session::flash('toast', [ 'message' => 'Data berhasil ditambahkan.' ]);
        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show(Employee $employee)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Employee $employee)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(EmployeeRequest $request, Employee $employee): RedirectResponse {
        Gate::authorize('update', $employee);
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
        if ($employee->employee_number !== $request->employee_number) {
            // Cari user berdasarkan employee_number (username)
            $user = User::where('username', $employee->employee_number)->first();

            // Jika user ditemukan, update data user
            if ($user) {
                $user->update([
                    'name' => $request->name,
                    'username' => $request->employee_number,
                    'email' => $request->employee_number . '@gmail.com',
                ]);
            }
        }
        Session::flash('toast', [ 'message' => 'Data berhasil diubah.' ]);
        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Employee $employee): RedirectResponse {
        Gate::authorize('delete', $employee); // Pastikan user punya izin untuk menghapus data

        // Hapus data riwayat pengubahan karyawan
        UpdateEmployeeHistory::where('employee_id', $employee->id)->delete();

        // Hapus data Employee
        $employee->delete();

        // Jika user terkait dengan employee (misalnya menggunakan employee_number sebagai username)
        $user = User::where('username', $employee->employee_number)->first();

        if ($user) {
            // Hapus data user jika ditemukan
            $user->delete();
        }

        Session::flash('toast', [ 'message' => 'Data karyawan berhasil dihapus.' ]);
        return back();
    }
}
