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
use App\Models\Sale;
use App\Models\UpdateManagementStructureHistory;
use App\Traits\OptimizedQueries;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;

class ManagementStructureController extends Controller
{
    use OptimizedQueries;

    protected function applySearch($query, $search) {
        return $query->when($search, function($query, $search) {
            $query->where(function($query) use($search) {
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
        });
    }

    private function fieldIdFromRequest($value): ?int {
        if (is_array($value)) {
            return $value['id'] ?? $value[0]['id'] ?? null;
        }

        return $value;
    }

    public function index(Request $request): Response {
        Gate::authorize('viewAny', ManagementStructure::class);
        
        // Optimized query with eager loading
        $searchQuery = ManagementStructure::query()
            ->select('id', 'employee_id', 'position_id', 'branch_id', 'created_at', 'updated_at')
            ->with([
                'employee:id,name,employee_number',
                'position:id,position_name',
                'branch:id,branch_name,branch_code',
                'updateManagementStructureHistory.user:id,name'
            ])
            ->latest();
        
        $this->applySearch($searchQuery, $request->search);
        $data = ManagementStructureResource::collection($searchQuery->paginate(12)->withQueryString());

        // Use cached data
        $employees = $this->getCachedActiveEmployees();
        $positions = $this->getCachedPositions();
        $branches = $this->getCachedActiveBranches();

        return Inertia::render('Managements/ManagementStructures/IndexManagementStructure', [
            'fetchData' => $data,
            'search' => $request->search ?? '',
            'employees' => EmployeeResource::collection($employees),
            'positions' => PositionResource::collection($positions),
            'branches' => BranchResource::collection($branches)
        ]);
    }

    public function create()
    {
        //
    }

    public function store(ManagementStructureRequest $request): RedirectResponse {
        Gate::authorize('create', ManagementStructure::class);
        $managementStructure = ManagementStructure::create([
            'employee_id' => $this->fieldIdFromRequest($request->employee_id),
            'position_id' => $this->fieldIdFromRequest($request->position_id),
            'branch_id'   => $this->fieldIdFromRequest($request->branch_id)
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
            'employee_id' => $this->fieldIdFromRequest($request->employee_id),
            'position_id' => $this->fieldIdFromRequest($request->position_id),
            'branch_id'   => $this->fieldIdFromRequest($request->branch_id)
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
        if (Sale::where('management_structure_id', $managementStructure->id)->exists()) {
            Session::flash('toast', [
                'message' => 'Struktur manajemen tidak dapat dihapus karena sudah dipakai pada data penjualan.',
                'type' => 'error'
            ]);
            return back();
        }

        UpdateManagementStructureHistory::where('management_structure_id', $managementStructure->id)->delete();
        $managementStructure->delete();
        Session::flash('toast', [
            'message' => 'Data berhasil dihapus.'
        ]);
        return back();
    }
}
