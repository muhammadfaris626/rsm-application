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
use App\Traits\OptimizedQueries;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;

class OperationalBranchController extends Controller
{
    use OptimizedQueries;

    protected function applySearch($query, $search) {
        return $query->when($search, function($query, $search) {
            $query->where(function($query) use($search) {
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
        });
    }

    private function isCentralUser($user): bool {
        return $user->hasRole(['root', 'admin-pusat']);
    }

    private function fieldIdFromRequest($value): ?int {
        if (is_array($value)) {
            return $value['id'] ?? $value[0]['id'] ?? null;
        }

        return $value;
    }

    private function authorizeBranchAccess(?int $branchId, $user, ?Employee $employee): ?RedirectResponse {
        if (!$branchId) {
            Session::flash('toast', ['message' => 'Cabang wajib dipilih.', 'type' => 'error']);
            return back();
        }

        if (!$this->isCentralUser($user) && (!$employee || (int) $employee->branch_id !== (int) $branchId)) {
            Session::flash('toast', ['message' => 'Anda tidak memiliki akses ke cabang yang dipilih.', 'type' => 'error']);
            return back();
        }

        return null;
    }

    public function index(Request $request): Response{
        Gate::authorize('viewAny', OperationalBranch::class);
        $user = Auth::user();
        $isCentralUser = $this->isCentralUser($user);
        
        // Use cached employee
        $employee = !$isCentralUser
            ? $this->getCachedEmployee($user->username, true) 
            : null;
        
        // Optimized query with eager loading
        $searchQuery = OperationalBranch::query()
            ->select('id', 'branch_id', 'date', 'expenditure_id', 'total_cost', 'description', 'user_id', 'created_at', 'updated_at')
            ->with([
                'branch:id,branch_name,branch_code',
                'expenditure:id,type_of_fee',
                'user:id,name',
                'updateOperationalBranchHistory.user:id,name'
            ])
            ->when(!$isCentralUser && $employee,
                fn($query) => $query->where('branch_id', $employee->branch_id))
            ->when(!$isCentralUser && !$employee,
                fn($query) => $query->whereRaw('1 = 0'))
            ->latest();
        
        $this->applySearch($searchQuery, $request->search);
        $data = OperationalBranchResource::collection($searchQuery->paginate(12)->withQueryString());
        
        // Use cached data
        $expenditures = $this->getCachedExpenditures();
        
        // Get appropriate branches
        $branches = $isCentralUser
            ? $this->getCachedActiveBranches()
            : ($employee 
                ? Branch::select('id', 'branch_code', 'branch_name', 'status')
                    ->where('status', 'Aktif')
                    ->where('id', $employee->branch_id)
                    ->get() 
                : collect());
        
        return Inertia::render('Operationals/Branches/IndexOperationalBranch', [
            'fetchData' => $data,
            'search' => $request->search ?? '',
            'expenditures' => ExpenditureResource::collection($expenditures),
            'branches' => BranchResource::collection($branches)
        ]);
    }

    public function create()
    {
        //
    }

    public function store(OperationalBranchRequest $request): RedirectResponse {
        Gate::authorize('create', OperationalBranch::class);
        $user = Auth::user();
        $employee = $this->isCentralUser($user) ? null : $this->getCachedEmployee($user->username, true);
        $branchId = $this->fieldIdFromRequest($request->branch_id);

        if ($redirect = $this->authorizeBranchAccess($branchId, $user, $employee)) {
            return $redirect;
        }

        $operationalBranch = OperationalBranch::create([
            'branch_id' => $branchId,
            'date' => $request->date,
            'expenditure_id' => $this->fieldIdFromRequest($request->expenditure_id),
            'total_cost' => $request->total_cost,
            'description' => $request->description,
            'user_id' => $user->id,
        ]);
        UpdateOperationalBranchHistory::create([
            'op_branch_id' => $operationalBranch->id,
            'user_id' => $user->id
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
        $user = Auth::user();
        $employee = $this->isCentralUser($user) ? null : $this->getCachedEmployee($user->username, true);
        $branchId = $this->fieldIdFromRequest($request->branch_id);

        if ($redirect = $this->authorizeBranchAccess($branchId, $user, $employee)) {
            return $redirect;
        }

        $operationalBranch->update([
            'branch_id' => $branchId,
            'date' => $request->date,
            'expenditure_id' => $this->fieldIdFromRequest($request->expenditure_id),
            'total_cost' => $request->total_cost,
            'description' => $request->description,
            'user_id' => $user->id,
        ]);
        UpdateOperationalBranchHistory::create([
            'op_branch_id' => $operationalBranch->id,
            'user_id' => $user->id
        ]);
        Session::flash('toast', [
            'message' => 'Data berhasil diubah.'
        ]);
        return back();
    }

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
