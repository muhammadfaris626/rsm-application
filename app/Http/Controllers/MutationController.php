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
        
        Mutation::create([
            'employee_id' => $request->employee_id['id'],
            'from_branch_id' => $request->from_branch_id[0]['id'],
            'to_branch_id' => $request->to_branch_id['id'],
            'transfer_date' => $request->transfer_date,
            'reason' => $request->reason
        ]);
        
        // Use single update query
        Employee::where('id', $request->employee_id['id'])
            ->update(['branch_id' => $request->to_branch_id['id']]);
        
        // Clear employee cache
        $this->clearRelatedCaches(['active_employees']);
        
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
        
        $mutation->delete();
        
        // Clear employee cache
        $this->clearRelatedCaches(['active_employees']);
        
        Session::flash('toast', ['message' => 'Data berhasil dihapus.']);
        return back();
    }
}
