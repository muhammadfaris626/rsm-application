<?php

namespace App\Http\Controllers;

use App\Http\Requests\PositionRequest;
use App\Http\Resources\PositionResource;
use App\Models\Position;
use App\Models\UpdatePositionHistory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;

class PositionController extends Controller
{
    protected function applySearch($query, $search) {
        return $query->when($search, function($query, $search) {
            $query->where('position_name', 'LIKE', '%' . $search . '%');
        });
    }

    public function index(Request $request): Response {
        Gate::authorize('viewAny', Position::class);
        $searchQuery = Position::query()->latest();
        $this->applySearch($searchQuery, $request->search);
        $data = PositionResource::collection($searchQuery->paginate(12));
        return Inertia::render('Database/Positions/IndexPosition', [
            'fetchData' => $data,
            'search' => $request->search ?? ''
        ]);
    }

    public function create()
    {
        //
    }

    public function store(PositionRequest $request): RedirectResponse {
        Gate::authorize('create', Position::class);
        $position = Position::create($request->validated());
        UpdatePositionHistory::create([
            'position_id' => $position->id,
            'user_id' => Auth::user()->id
        ]);
        Session::flash('toast', [
            'message' => 'Data berhasil ditambahkan.'
        ]);
        return back();
    }

    public function show(Position $position)
    {
        //
    }

    public function edit(Position $position)
    {
        //
    }

    public function update(PositionRequest $request, Position $position): RedirectResponse {
        Gate::authorize('update', $position);
        $position->update($request->validated());
        UpdatePositionHistory::create([
            'position_id' => $position->id,
            'user_id' => Auth::user()->id
        ]);
        Session::flash('toast', [
            'message' => 'Data berhasil diubah.'
        ]);
        return back();
    }

    public function destroy(Position $position): RedirectResponse {
        Gate::authorize('delete', $position);
        UpdatePositionHistory::where('position_id', $position->id)->delete();
        $position->delete();
        Session::flash('toast', [
            'message' => 'Data berhasil dihapus.'
        ]);
        return back();
    }
}
