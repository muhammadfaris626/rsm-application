<?php

namespace App\Http\Controllers;

use App\Http\Requests\BranchRequest;
use App\Http\Resources\BranchResource;
use App\Models\Branch;
use App\Models\UpdateBranchHistory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;

class BranchController extends Controller
{
    protected function applySearch($query, $search) {
        return $query->when($search, function($query, $search) {
            $query->where('branch_code', 'LIKE', '%' . $search . '%')
                ->orWhere('branch_name', 'LIKE', '%' . $search . '%')
                ->orWhere('branch_address', 'LIKE', '%' . $search . '%');
        });
    }

    public function index(Request $request): Response {
        Gate::authorize('viewAny', Branch::class);
        $searchQuery = Branch::query()->latest();
        $this->applySearch($searchQuery, $request->search);
        $data = BranchResource::collection($searchQuery->paginate(12));
        return Inertia::render('Database/Branches/IndexBranch', [
            'fetchData' => $data,
            'search' => $request->search ?? ''
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(BranchRequest $request): RedirectResponse {
        Gate::authorize('create', Branch::class);
        $branch = Branch::create($request->validated());
        UpdateBranchHistory::create([
            'branch_id' => $branch->id,
            'user_id' => Auth::user()->id
        ]);
        Session::flash('toast', [
            'message' => 'Data berhasil ditambahkan.'
        ]);
        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show(Branch $branch)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Branch $branch)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(BranchRequest $request, Branch $branch): RedirectResponse {
        Gate::authorize('update', $branch);
        $branch->update($request->validated());
        UpdateBranchHistory::create([
            'branch_id' => $branch->id,
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
    public function destroy(Branch $branch): RedirectResponse {
        Gate::authorize('delete', $branch);
        UpdateBranchHistory::where('branch_id', $branch->id)->delete();
        $branch->delete();
        Session::flash('toast', [
            'message' => 'Data berhasil dihapus.'
        ]);
        return back();
    }
}
