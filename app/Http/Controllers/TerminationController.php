<?php

namespace App\Http\Controllers;

use App\Http\Resources\EmployeeResource;
use App\Models\Employee;
use App\Models\Termination;
use App\Models\User;
use App\Traits\OptimizedQueries;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Session;

class TerminationController extends Controller
{
    use OptimizedQueries;

    private function fieldIdFromRequest($value): ?int {
        if (is_array($value)) {
            return $value['id'] ?? $value[0]['id'] ?? null;
        }

        return $value;
    }

    public function index() {
        Gate::authorize('viewAny', Termination::class);
        return Inertia::render('Employees/Terminations/IndexTermination');
    }

    public function create(): Response {
        Gate::authorize('create', Termination::class);
        
        // Use cached employees
        $employees = $this->getCachedActiveEmployees();
        
        return Inertia::render('Employees/Terminations/CreateTermination', [
            'employees' => EmployeeResource::collection($employees)
        ]);
    }

    public function store(Request $request): RedirectResponse {
        Gate::authorize('create', Termination::class);
        $request->validate([
            'employee_id' => ['required'],
            'termination_date' => ['required', 'date'],
            'reason' => ['required'],
        ], [
            'employee_id.required' => 'Kolom karyawan wajib diisi.',
            'termination_date.required' => 'Kolom tanggal pemberhentian wajib diisi.',
            'reason.required' => 'Kolom keterangan pemberhentian wajib diisi.',
        ]);

        $employeeId = $this->fieldIdFromRequest($request->employee_id);
        $employee = Employee::select('id', 'employee_number')
            ->where('id', $employeeId)
            ->where('status', 'Aktif')
            ->first();

        if (!$employee) {
            Session::flash('toast', ['message' => 'Karyawan aktif tidak ditemukan.', 'type' => 'error']);
            return back();
        }
        
        Termination::create([
            'employee_id' => $employee->id,
            'termination_date' => $request->termination_date,
            'reason' => $request->reason
        ]);

        // Update employee status
        $employee->update(['status' => 'Tidak Aktif']);

        // Delete user
        User::where('username', $employee->employee_number)->delete();

        // Clear caches
        $this->clearRelatedCaches(['active_employees', "employee_{$employee->employee_number}"]);
        
        Session::flash('toast', ['message' => 'Data berhasil ditambahkan.']);
        return to_route('terminations.index');
    }

    public function show(Termination $termination)
    {
        //
    }

    public function edit(Termination $termination)
    {
        //
    }

    public function update(Request $request, Termination $termination)
    {
        //
    }

    public function destroy(Termination $termination): RedirectResponse {
        Gate::authorize('delete', $termination);
        
        // Update employee status
        Employee::where('id', $termination->employee_id)
            ->update(['status' => 'Aktif']);
        $employee = Employee::select('employee_number')->find($termination->employee_id);
        
        $termination->delete();
        
        // Clear employee cache
        $this->clearRelatedCaches(array_filter(['active_employees', $employee ? "employee_{$employee->employee_number}" : null]));
        
        Session::flash('toast', ['message' => 'Data berhasil dihapus.']);
        return back();
    }
}
