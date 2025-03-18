<?php

namespace App\Http\Controllers;

use App\Http\Requests\OperationalBranchRequest;
use App\Http\Resources\BranchResource;
use App\Http\Resources\ExpenditureResource;
use App\Http\Resources\OperationalBranchResource;
use App\Models\Branch;
use App\Models\Employee;
use App\Models\Expenditure;
use App\Models\OperationalBranch;
use App\Models\UpdateOperationalBranchHistory;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;

class OperationalBranchController extends Controller
{
    protected function applySearch($query, $search) {
        return $query->when($search, function($query, $search) {
            $query->where('total_cost', 'LIKE', '%' . $search . '%')
                ->orWhere('description', 'LIKE', '%' . $search . '%')
                ->orWhereHas('expenditure', function($query) use($search) {
                    $query->where('type_of_fee', 'LIKE', '%' . $search . '%');
                })
                ->orWhereHas('user', function($query) use($search) {
                    $query->where('name', 'LIKE', '%' . $search . '%');
                })
                ->orWhereHas('branch', function($query) use($search) {
                    $query->where('branch_name', 'LIKE', '%' . $search . '%');
                });
        });
    }

    public function index(Request $request): Response{
        Gate::authorize('viewAny', OperationalBranch::class);
        $user = Auth::user();
        $employee = Employee::where('employee_number', $user->username)->first();
        $searchQuery = OperationalBranch::query()->when($user->roles[0]['name'] !== 'root', fn($query) => $query->where('branch_id', $employee->branch_id))->latest();
        $branch = Auth::user()->roles[0]['name'] == 'root' ? Branch::all() : Branch::where('status', 'Aktif')->where('id', $employee->branch_id)->get();
        $this->applySearch($searchQuery, $request->search);
        $data = OperationalBranchResource::collection($searchQuery->paginate(12));
        return Inertia::render('Operationals/Branches/IndexOperationalBranch', [
            'fetchData' => $data,
            'search' => $request->search ?? '',
            'expenditures' => ExpenditureResource::collection(Expenditure::all()),
            'branches' => BranchResource::collection($branch)
        ]);
    }

    public function create()
    {
        //
    }

    public function store(OperationalBranchRequest $request): RedirectResponse {
        Gate::authorize('create', OperationalBranch::class);
        $operationalBranch = OperationalBranch::create([
            'branch_id' => $request->branch_id['id'],
            'date' => $request->date,
            'expenditure_id' => $request->expenditure_id['id'],
            'total_cost' => $request->total_cost,
            'description' => $request->description,
            'user_id' => Auth::user()->id,
        ]);
        UpdateOperationalBranchHistory::create([
            'op_branch_id' => $operationalBranch->id,
            'user_id' => Auth::user()->id
        ]);
        Session::flash('toast', [
            'message' => 'Data berhasil ditambahkan.'
        ]);
        return back();
    }

    public function show(OperationalBranch $operationalBranch)
    {
        //
    }

    public function edit(OperationalBranch $operationalBranch)
    {
        //
    }

    public function update(OperationalBranchRequest $request, OperationalBranch $operationalBranch): RedirectResponse {
        Gate::authorize('update', $operationalBranch);
        $operationalBranch->update([
            'branch_id' => $request->branch_id,
            'date' => $request->date,
            'expenditure_id' => $request->expenditure_id,
            'total_cost' => $request->total_cost,
            'description' => $request->description,
            'user_id' => Auth::user()->id,
        ]);
        UpdateOperationalBranchHistory::create([
            'op_branch_id' => $operationalBranch->id,
            'user_id' => Auth::user()->id
        ]);
        Session::flash('toast', [
            'message' => 'Data berhasil diubah.'
        ]);
        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(OperationalBranch $operationalBranch): RedirectResponse{
        Gate::authorize('delete', $operationalBranch);
        UpdateOperationalBranchHistory::where('op_branch_id', $operationalBranch->id)->delete();
        $operationalBranch->delete();
        Session::flash('toast', [
            'message' => 'Data berhasil dihapus.'
        ]);
        return back();
    }
}
