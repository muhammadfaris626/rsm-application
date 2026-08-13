<?php

namespace App\Http\Controllers;

use App\Http\Requests\OperationalCenterRequest;
use App\Http\Resources\ExpenditureResource;
use App\Http\Resources\OperationalCenterResource;
use App\Models\Expenditure;
use App\Models\OperationalCenter;
use App\Models\UpdateOperationalCenterHistory;
use App\Traits\OptimizedQueries;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;

class OperationalCenterController extends Controller
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
                    });
            });
        });
    }

    private function expenditureIdFromRequest($value): ?int {
        if (is_array($value)) {
            return $value['id'] ?? $value[0]['id'] ?? null;
        }

        return $value;
    }

    public function index(Request $request): Response {
        Gate::authorize('viewAny', OperationalCenter::class);
        
        // Optimized query with eager loading
        $searchQuery = OperationalCenter::query()
            ->select('id', 'date', 'expenditure_id', 'total_cost', 'description', 'user_id', 'created_at', 'updated_at')
            ->with([
                'expenditure:id,type_of_fee',
                'user:id,name',
                'updateOperationalCenterHistory.user:id,name'
            ])
            ->latest();
        
        $this->applySearch($searchQuery, $request->search);
        $data = OperationalCenterResource::collection($searchQuery->paginate(12)->withQueryString());
        
        // Use cached expenditures
        $expenditures = $this->getCachedExpenditures();
        
        return Inertia::render('Operationals/Centers/IndexOperationalCenter', [
            'fetchData' => $data,
            'search' => $request->search ?? '',
            'expenditures' => ExpenditureResource::collection($expenditures)
        ]);
    }

    public function create()
    {
        //
    }

    public function store(OperationalCenterRequest $request): RedirectResponse{
        Gate::authorize('create', OperationalCenter::class);
        $operationalCenter = OperationalCenter::create([
            'date' => $request->date,
            'expenditure_id' => $this->expenditureIdFromRequest($request->expenditure_id),
            'total_cost' => $request->total_cost,
            'description' => $request->description,
            'user_id' => Auth::user()->id,
        ]);
        UpdateOperationalCenterHistory::create([
            'op_center_id' => $operationalCenter->id,
            'user_id' => Auth::user()->id
        ]);
        Session::flash('toast', [
            'message' => 'Data berhasil ditambahkan.'
        ]);
        return back();
    }

    public function show(OperationalCenter $operationalCenter)
    {
        //
    }

    public function edit(OperationalCenter $operationalCenter)
    {
        //
    }

    public function update(OperationalCenterRequest $request, OperationalCenter $operationalCenter): RedirectResponse{
        Gate::authorize('update', $operationalCenter);
        $operationalCenter->update([
            'date' => $request->date,
            'expenditure_id' => $this->expenditureIdFromRequest($request->expenditure_id),
            'total_cost' => $request->total_cost,
            'description' => $request->description,
            'user_id' => Auth::user()->id,
        ]);
        UpdateOperationalCenterHistory::create([
            'op_center_id' => $operationalCenter->id,
            'user_id' => Auth::user()->id
        ]);
        Session::flash('toast', [
            'message' => 'Data berhasil diubah.'
        ]);
        return back();
    }

    public function destroy(OperationalCenter $operationalCenter): RedirectResponse {
        Gate::authorize('delete', $operationalCenter);
        UpdateOperationalCenterHistory::where('op_center_id', $operationalCenter->id)->delete();
        $operationalCenter->delete();
        Session::flash('toast', [
            'message' => 'Data berhasil dihapus.'
        ]);
        return back();
    }
}
