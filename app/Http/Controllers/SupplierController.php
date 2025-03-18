<?php

namespace App\Http\Controllers;

use App\Http\Requests\SupplierRequest;
use App\Http\Resources\SupplierResource;
use App\Models\Supplier;
use App\Models\UpdateSupplierHistory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;

class SupplierController extends Controller
{
    protected function applySearch($query, $search) {
        return $query->when($search, function($query, $search) {
            $query->where('name', 'LIKE', '%' . $search . '%')
                ->orWhere('phone', 'LIKE', '%' . $search . '%')
                ->orWhere('address', 'LIKE', '%' . $search . '%');
        });
    }

    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Supplier::class);
        $searchQuery = Supplier::query()->latest();
        $this->applySearch($searchQuery, $request->search);
        $data = SupplierResource::collection($searchQuery->paginate(12));
        return Inertia::render('Database/Suppliers/IndexSupplier', [
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
    public function store(SupplierRequest $request): RedirectResponse
    {
        Gate::authorize('create', Supplier::class);
        $supplier = Supplier::create($request->validated());
        UpdateSupplierHistory::create([
            'supplier_id' => $supplier->id,
            'user_id' => Auth::user()->id
        ]);
        Session::flash('toast', ['message' => 'Data berhasil ditambahkan.']);
        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show(Supplier $supplier)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Supplier $supplier)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(SupplierRequest $request, Supplier $supplier): RedirectResponse
    {
        Gate::authorize('update', $supplier);
        $supplier->update($request->validated());
        UpdateSupplierHistory::create([
            'supplier_id' => $supplier->id,
            'user_id' => Auth::user()->id
        ]);
        Session::flash('toast', ['message' => 'Data berhasil diubah.']);
        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Supplier $supplier): RedirectResponse
    {
        Gate::authorize('delete', $supplier);
        UpdateSupplierHistory::where('supplier_id', $supplier->id)->delete();
        $supplier->delete();
        Session::flash('toast', ['message' => 'Data berhasil dihapus.']);
        return back();
    }
}
