<?php

namespace App\Http\Controllers;

use App\Http\Requests\OperationalCenterRequest;
use App\Http\Resources\ExpenditureResource;
use App\Http\Resources\OperationalCenterResource;
use App\Models\Expenditure;
use App\Models\OperationalCenter;
use App\Models\UpdateOperationalCenterHistory;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;

class OperationalCenterController extends Controller
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
                });
        });
    }

    public function index(Request $request): Response {
        Gate::authorize('viewAny', OperationalCenter::class);
        $searchQuery = OperationalCenter::query()->latest();
        $this->applySearch($searchQuery, $request->search);
        $data = OperationalCenterResource::collection($searchQuery->paginate(12));
        return Inertia::render('Operationals/Centers/IndexOperationalCenter', [
            'fetchData' => $data,
            'search' => $request->search ?? '',
            'expenditures' => ExpenditureResource::collection(Expenditure::all())
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
            'expenditure_id' => $request->expenditure_id['id'],
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
            'expenditure_id' => isset($request->expenditure_id['id']) ? $request->expenditure_id['id'] : $request->expenditure_id[0]['id'],
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
