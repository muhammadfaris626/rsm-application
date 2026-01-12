<?php

namespace App\Http\Controllers;

use App\Http\Requests\BranchRequest;
use App\Http\Resources\BranchResource;
use App\Imports\BranchImport;
use App\Models\Branch;
use App\Models\UpdateBranchHistory;
use App\Traits\OptimizedQueries;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;

class BranchController extends Controller
{
    use OptimizedQueries;

    protected function applySearch($query, $search) {
        return $query->when($search, function($query, $search) {
            $query->where('branch_code', 'LIKE', '%' . $search . '%')
                ->orWhere('branch_name', 'LIKE', '%' . $search . '%')
                ->orWhere('branch_address', 'LIKE', '%' . $search . '%');
        });
    }

    public function index(Request $request): Response {
        Gate::authorize('viewAny', Branch::class);
        
        $searchQuery = Branch::query()
            ->select('id', 'branch_code', 'branch_name', 'branch_address', 'description', 'status', 'created_at', 'updated_at')
            ->latest();
        
        $this->applySearch($searchQuery, $request->search);
        $data = BranchResource::collection($searchQuery->paginate(12));
        
        return Inertia::render('Database/Branches/IndexBranch', [
            'fetchData' => $data,
            'search' => $request->search ?? ''
        ]);
    }

    public function create()
    {
        //
    }

    public function store(BranchRequest $request): RedirectResponse {
        Gate::authorize('create', Branch::class);
        $branch = Branch::create($request->validated());
        UpdateBranchHistory::create([
            'branch_id' => $branch->id,
            'user_id' => Auth::user()->id
        ]);
        
        // Clear branch caches
        $this->clearRelatedCaches(['active_branches', 'all_branches']);
        
        Session::flash('toast', [
            'message' => 'Data berhasil ditambahkan.'
        ]);
        return back();
    }

    public function show(Branch $branch)
    {
        //
    }

    public function edit(Branch $branch)
    {
        //
    }

    public function update(BranchRequest $request, Branch $branch): RedirectResponse {
        Gate::authorize('update', $branch);
        $branch->update($request->validated());
        UpdateBranchHistory::create([
            'branch_id' => $branch->id,
            'user_id' => Auth::user()->id
        ]);
        
        // Clear branch caches
        $this->clearRelatedCaches(['active_branches', 'all_branches', "branch_{$branch->id}"]);
        
        Session::flash('toast', [
            'message' => 'Data berhasil diubah.'
        ]);
        return back();
    }

    public function destroy(Branch $branch): RedirectResponse {
        Gate::authorize('delete', $branch);
        
        // Cek apakah cabang masih memiliki data terkait
        if (\App\Models\Employee::where('branch_id', $branch->id)->exists() ||
            \App\Models\Location::where('branch_id', $branch->id)->exists() ||
            \App\Models\BranchProduct::where('branch_id', $branch->id)->exists() ||
            \App\Models\OperationalBranch::where('branch_id', $branch->id)->exists() ||
            \App\Models\ManagementStructure::where('branch_id', $branch->id)->exists() ||
            \App\Models\RequestOrder::where('branch_id', $branch->id)->exists() ||
            \App\Models\RequestReturn::where('branch_id', $branch->id)->exists() ||
            \App\Models\Sale::where('branch_id', $branch->id)->exists() ||
            \App\Models\Mutation::where('from_branch_id', $branch->id)->orWhere('to_branch_id', $branch->id)->exists()) {
            
            Session::flash('toast', [
                'message' => 'Gagal menghapus! Cabang ini masih memiliki data terkait (Karyawan/Lokasi/Stok/Transaksi/dll).',
                'type' => 'error'
            ]);
            return back();
        }

        UpdateBranchHistory::where('branch_id', $branch->id)->delete();
        $branch->delete();
        
        // Clear branch caches
        $this->clearRelatedCaches(['active_branches', 'all_branches', "branch_{$branch->id}"]);
        
        Session::flash('toast', [
            'message' => 'Data berhasil dihapus.'
        ]);
        return back();
    }

    public function upload(Request $request): RedirectResponse {
        $request->validate([
            'fileUpload' => 'required|mimes:xlsx,xls|mimetypes:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel',
        ], [
            'fileUpload.required' => 'Kolom unggah berkas wajib diisi.',
            'fileUpload.mimes' => 'Berkas yang diunggah harus berupa file Excel (xlsx, xls).'
        ]);
        $userId = Auth::id();
        Excel::import(new BranchImport($userId), $request->file('fileUpload'));
        
        // Clear branch caches after import
        $this->clearRelatedCaches(['active_branches', 'all_branches']);
        
        return back();
    }
}
