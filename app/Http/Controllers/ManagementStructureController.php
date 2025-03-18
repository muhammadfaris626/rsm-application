<?php

namespace App\Http\Controllers;

use App\Http\Requests\ManagementStructureRequest;
use App\Http\Resources\BranchResource;
use App\Http\Resources\EmployeeResource;
use App\Http\Resources\ManagementStructureResource;
use App\Http\Resources\PositionResource;
use App\Models\Branch;
use App\Models\Employee;
use App\Models\ManagementStructure;
use App\Models\Position;
use App\Models\UpdateManagementStructureHistory;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;

class ManagementStructureController extends Controller
{
    protected function applySearch($query, $search) {
        return $query->when($search, function($query, $search) {
            $query->whereHas('employee', function($query) use($search) {
                    $query->where('name', 'LIKE', '%' . $search . '%');
                })
                ->orWhereHas('position', function($query) use($search) {
                    $query->where('position_name', 'LIKE', '%' . $search . '%');
                })
                ->orWhereHas('branch', function($query) use($search) {
                    $query->where('branch_name', 'LIKE', '%' . $search . '%');
                });
        });
    }

    public function index(Request $request): Response {
        Gate::authorize('viewAny', ManagementStructure::class);
        $searchQuery = ManagementStructure::query()->latest();
        $this->applySearch($searchQuery, $request->search);
        $data = ManagementStructureResource::collection($searchQuery->paginate(12));

        return Inertia::render('Managements/ManagementStructures/IndexManagementStructure', [
            'fetchData' => $data,
            'search' => $request->search ?? '',
            'employees' => EmployeeResource::collection(Employee::where('status', 'Aktif')->get()),
            'positions' => PositionResource::collection(Position::all()),
            'branches' => BranchResource::collection(Branch::where('status', 'Aktif')->get())
        ]);
    }

    public function create()
    {
        //
    }

    public function store(ManagementStructureRequest $request): RedirectResponse {
        Gate::authorize('create', ManagementStructure::class);
        $managementStructure = ManagementStructure::create([
            'employee_id' => $request->employee_id,
            'position_id' => $request->position_id,
            'branch_id'   => $request->branch_id
        ]);
        UpdateManagementStructureHistory::create([
            'management_structure_id' => $managementStructure->id,
            'user_id' => Auth::user()->id
        ]);
        Session::flash('toast', [
            'message' => 'Data berhasil ditambahkan.'
        ]);
        return back();
    }

    public function show(ManagementStructure $managementStructure)
    {
        //
    }

    public function edit(ManagementStructure $managementStructure)
    {
        //
    }

    public function update(ManagementStructureRequest $request, ManagementStructure $managementStructure): RedirectResponse {
        Gate::authorize('update', $managementStructure);
        $managementStructure->update([
            'employee_id' => $request->employee_id,
            'position_id' => $request->position_id,
            'branch_id'   => $request->branch_id
        ]);
        UpdateManagementStructureHistory::create([
            'management_structure_id' => $managementStructure->id,
            'user_id' => Auth::user()->id
        ]);
        Session::flash('toast', [
            'message' => 'Data berhasil diubah.'
        ]);
        return back();
    }

    public function destroy(ManagementStructure $managementStructure): RedirectResponse {
        Gate::authorize('delete', $managementStructure);
        UpdateManagementStructureHistory::where('management_structure_id', $managementStructure->id)->delete();
        $managementStructure->delete();
        Session::flash('toast', [
            'message' => 'Data berhasil dihapus.'
        ]);
        return back();
    }
}
