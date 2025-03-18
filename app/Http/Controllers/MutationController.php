<?php

namespace App\Http\Controllers;

use App\Http\Requests\MutationRequest;
use App\Http\Resources\BranchResource;
use App\Http\Resources\EmployeeResource;
use App\Models\Branch;
use App\Models\Employee;
use App\Models\Mutation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;
use Illuminate\Support\Facades\Session;
class MutationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index() {
        Gate::authorize('viewAny', Mutation::class);
        return Inertia::render('Employees/Mutations/IndexMutation');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response {
        Gate::authorize('create', Mutation::class);
        return Inertia::render('Employees/Mutations/CreateMutation', [
            'employees' => EmployeeResource::collection(Employee::all()),
            'branches' => BranchResource::collection(Branch::all())
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
        $check = Employee::where('id', $request->employee_id['id'])->first();
        $check->update([
            'branch_id' => $request->to_branch_id['id']
        ]);
        Session::flash('toast', [
            'message' => 'Data berhasil ditambahkan.'
        ]);
        return to_route('mutations.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Mutation $mutation)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Mutation $mutation)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Mutation $mutation)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Mutation $mutation): RedirectResponse {
        Gate::authorize('delete', $mutation);
        $employee = Employee::where('id', $mutation->employee_id)->first();
        $employee->update([
            'branch_id' => $mutation->from_branch_id
        ]);
        $mutation->delete();
        Session::flash('toast', ['message' => 'Data berhasil dihapus.']);
        return back();
    }
}
