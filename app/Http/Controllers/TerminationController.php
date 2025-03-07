<?php

namespace App\Http\Controllers;

use App\Http\Resources\EmployeeResource;
use App\Models\Employee;
use App\Models\Termination;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Session;
class TerminationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index() {
        Gate::authorize('viewAny', Termination::class);
        return Inertia::render('Employees/Terminations/IndexTermination');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response {
        Gate::authorize('create', Termination::class);
        return Inertia::render('Employees/Terminations/CreateTermination', [
            'employees' => EmployeeResource::collection(Employee::all())
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse {
        Gate::authorize('create', Termination::class);
        Termination::create([
            'employee_id' => $request->employee_id['id'],
            'termination_date' => $request->termination_date,
            'reason' => $request->reason
        ]);
        $employee = Employee::where('id', $request->employee_id['id'])->first();
        $employee->update([
            'status' => 'Tidak Aktif'
        ]);
        $user = User::where('username', $employee->employee_number)->first();
        $user->delete();
        Session::flash('toast', ['message' => 'Data berhasil ditambahkan.']);
        return to_route('terminations.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Termination $termination)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Termination $termination)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Termination $termination)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Termination $termination): RedirectResponse {
        Gate::authorize('delete', $termination);
        $employee = Employee::where('id', $termination->employee_id)->first();
        $employee->update([
            'status' => 'Aktif'
        ]);
        $termination->delete();
        Session::flash('toast', ['message' => 'Data berhasil dihapus.']);
        return back();
    }
}
