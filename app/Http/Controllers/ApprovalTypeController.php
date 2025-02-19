<?php

namespace App\Http\Controllers;

use App\Http\Requests\ApprovalTypeRequest;
use App\Http\Resources\ApprovalTypeResource;
use App\Models\ApprovalType;
use App\Models\UpdateApprovalTypeHistory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;

class ApprovalTypeController extends Controller
{
    protected function applySearch($query, $search) {
        return $query->when($search, function($query, $search) {
            $query->where('approval_type_name', 'LIKE', '%' . $search . '%');
        });
    }

    public function index(Request $request): Response {
        Gate::authorize('viewAny', ApprovalType::class);
        $searchQuery = ApprovalType::query()->latest();
        $this->applySearch($searchQuery, $request->search);
        $data = ApprovalTypeResource::collection($searchQuery->paginate(12));
        return Inertia::render('Settings/ApprovalTypes/IndexApprovalType', [
            'fetchData' => $data,
            'search' => $request->search ?? ''
        ]);
    }

    public function create()
    {
        //
    }

    public function store(ApprovalTypeRequest $request): RedirectResponse {
        Gate::authorize('create', ApprovalType::class);
        $create = ApprovalType::create($request->validated());
        UpdateApprovalTypeHistory::create([
            'approval_type_id' => $create->id,
            'user_id' => Auth::user()->id
        ]);
        Session::flash('toast', ['message' => 'Data berhasil ditambahkan.']);
        return back();
    }

    public function show(ApprovalType $approvalType)
    {
        //
    }

    public function edit(ApprovalType $approvalType)
    {
        //
    }

    public function update(ApprovalTypeRequest $request, ApprovalType $approvalType): RedirectResponse {
        Gate::authorize('update', $approvalType);
        $approvalType->update($request->validated());
        UpdateApprovalTypeHistory::create([
            'approval_type_id' => $approvalType->id,
            'user_id' => Auth::user()->id
        ]);
        Session::flash('toast', ['message' => 'Data berhasil diubah.']);
        return back();
    }

    public function destroy(ApprovalType $approvalType): RedirectResponse {
        Gate::authorize('delete', $approvalType);
        UpdateApprovalTypeHistory::where('approval_type_id', $approvalType->id)->delete();
        $approvalType->delete();
        Session::flash('toast', ['message' => 'Data berhasil dihapus.']);
        return back();
    }
}
