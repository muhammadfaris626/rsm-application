<?php

namespace App\Http\Controllers;

use App\Http\Requests\MutationRequest;
use App\Http\Resources\BranchResource;
use App\Http\Resources\EmployeeResource;
use App\Models\Branch;
use App\Models\Employee;
use App\Models\Mutation;
use App\Traits\OptimizedQueries;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;
use Illuminate\Support\Facades\Session;

class MutationController extends Controller
{
    use OptimizedQueries;

    private function fieldIdFromRequest($value): ?int {
        if (is_array($value)) {
            return $value['id'] ?? $value[0]['id'] ?? null;
        }

        return $value;
    }

    public function index() {
        Gate::authorize('viewAny', Mutation::class);
        return Inertia::render('Employees/Mutations/IndexMutation');
    }

    public function create(): Response {
        Gate::authorize('create', Mutation::class);
        
        // Use cached data
        $employees = $this->getCachedActiveEmployees();
        $branches = $this->getCachedAllBranches();
        
        return Inertia::render('Employees/Mutations/CreateMutation', [
            'employees' => EmployeeResource::collection($employees),
            'branches' => BranchResource::collection($branches)
        ]);
    }

    public function store(MutationRequest $request): RedirectResponse {
        Gate::authorize('create', Mutation::class);
        $employee = Employee::select('id', 'employee_number', 'branch_id')
            ->where('id', $this->fieldIdFromRequest($request->employee_id))
            ->where('status', 'Aktif')
            ->first();
        $toBranchId = $this->fieldIdFromRequest($request->to_branch_id);

        if (!$employee) {
            Session::flash('toast', ['message' => 'Karyawan aktif tidak ditemukan.', 'type' => 'error']);
            return back();
        }

        if ((int) $employee->branch_id === (int) $toBranchId) {
            Session::flash('toast', ['message' => 'Cabang tujuan harus berbeda dari cabang asal.', 'type' => 'error']);
            return back();
        }
        
        Mutation::create([
            'employee_id' => $employee->id,
            'from_branch_id' => $employee->branch_id,
            'to_branch_id' => $toBranchId,
            'transfer_date' => $request->transfer_date,
            'reason' => $request->reason
        ]);
        
        // Use single update query
        Employee::where('id', $employee->id)
            ->update(['branch_id' => $toBranchId]);
        
        // Clear employee cache
        $this->clearRelatedCaches(['active_employees', "employee_{$employee->employee_number}"]);
        
        Session::flash('toast', ['message' => 'Data berhasil ditambahkan.']);
        return to_route('mutations.index');
    }

    public function show(Mutation $mutation)
    {
        //
    }

    public function edit(Mutation $mutation)
    {
        //
    }

    public function update(Request $request, Mutation $mutation)
    {
        //
    }

    public function destroy(Mutation $mutation): RedirectResponse {
        Gate::authorize('delete', $mutation);
        
        // Use single update query
        Employee::where('id', $mutation->employee_id)
            ->update(['branch_id' => $mutation->from_branch_id]);

        $employee = Employee::select('employee_number')->find($mutation->employee_id);
        
        $mutation->delete();
        
        // Clear employee cache
        $this->clearRelatedCaches(array_filter(['active_employees', $employee ? "employee_{$employee->employee_number}" : null]));
        
        Session::flash('toast', ['message' => 'Data berhasil dihapus.']);
        return back();
    }
}
