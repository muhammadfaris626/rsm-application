<?php

namespace App\Http\Controllers;

use App\Http\Requests\ExpenditureRequest;
use App\Http\Resources\ExpenditureResource;
use App\Models\Expenditure;
use App\Models\UpdateExpenditureHistory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;

class ExpenditureController extends Controller
{
    protected function applySearch($query, $search) {
        return $query->when($search, function($query, $search) {
            $query->where('type_of_fee', 'LIKE', '%' . $search . '%');
        });
    }

    public function index(Request $request): Response {
        Gate::authorize('viewAny', Expenditure::class);
        $searchQuery = Expenditure::query()->latest();
        $this->applySearch($searchQuery, $request->search);
        $data = ExpenditureResource::collection($searchQuery->paginate(12));
        return Inertia::render('Database/Expenditures/IndexExpenditure', [
            'fetchData' => $data,
            'search' => $request->search ?? ''
        ]);
    }

    public function create()
    {
        //
    }

    public function store(ExpenditureRequest $request): RedirectResponse {
        Gate::authorize('create', Expenditure::class);
        $expenditure = Expenditure::create($request->validated());
        UpdateExpenditureHistory::create([
            'expenditure_id' => $expenditure->id,
            'user_id' => Auth::user()->id
        ]);
        Session::flash('toast', [
            'message' => 'Data berhasil ditambahkan.'
        ]);
        return back();
    }

    public function show(Expenditure $expenditure)
    {
        //
    }

    public function edit(Expenditure $expenditure){
        //
    }

    public function update(ExpenditureRequest $request, Expenditure $expenditure): RedirectResponse {
        Gate::authorize('update', $expenditure);
        $expenditure->update($request->validated());
        UpdateExpenditureHistory::create([
            'expenditure_id' => $expenditure->id,
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
    public function destroy(Expenditure $expenditure): RedirectResponse {
        Gate::authorize('delete', $expenditure);
        UpdateExpenditureHistory::where('expenditure_id', $expenditure->id)->delete();
        $expenditure->delete();
        Session::flash('toast', [
            'message' => 'Data berhasil dihapus.'
        ]);
        return back();
    }
}
