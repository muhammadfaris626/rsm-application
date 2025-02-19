<?php

namespace App\Http\Controllers;

use App\Http\Requests\RequestReturnRequest;
use App\Http\Resources\BranchResource;
use App\Http\Resources\RequestOrderResource;
use App\Http\Resources\RequestReturnResource;
use App\Models\Branch;
use App\Models\BranchProduct;
use App\Models\CenterStock;
use App\Models\Employee;
use App\Models\ListRequestReturn;
use App\Models\RequestOrder;
use App\Models\RequestReturn;
use App\Models\RequestReturnLog;
use App\Models\UpdateRequestReturnHistory;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;

class RequestReturnController extends Controller {

    protected function applySearch($query, $search) {
        return $query->when($search, function($query, $search) {
            $query->whereHas('requestOrder', function($query) use($search) {
                $query->where('ro_number', 'LIKE', '%' . $search . '%');
            })
            ->orWhere('request_number', 'LIKE', '%' . $search . '%');
        });
    }

    public function index(Request $request): Response {
        Gate::authorize('viewAny', RequestReturn::class);
        $user = Auth::user();
        $employee = Employee::where('employee_number', $user->username)->first();
        $searchQuery = RequestReturn::query()->when(!in_array($user->roles[0]['name'], ['root', 'admin-pusat']), fn($query) => $query->where('branch_id', $employee->branch_id))->latest();
        $data = RequestReturnResource::collection($searchQuery->paginate(12));
        return Inertia::render('Products/RequestReturns/IndexRequestReturn', [
            'fetchData' => $data,
            'search' => $request->search ?? '',
            'userBranch' => $employee->branch_id ?? 0
        ]);
    }

    public function create(): Response {
        Gate::authorize('create', RequestReturn::class);
        $employee = Employee::where('employee_number', Auth::user()->username)->first();
        $requestOrders = RequestOrder::where('branch_id', $employee->branch_id)->where('status', 'Selesai')->get();
        $branch = in_array(Auth::user()->roles[0]['name'], ['root', 'admin-pusat']) ? Branch::all() : Branch::where('status', 'Aktif')->where('id', $employee->branch_id)->get();
        return Inertia::render('Products/RequestReturns/CreateRequestReturn', [
            'requestNumber' => "RR-RSM-" . date('mdY') . "-XXXX",
            'requestOrders' => RequestOrderResource::collection($requestOrders),
            'branches' => BranchResource::collection($branch),
        ]);
    }

    public function store(RequestReturnRequest $request): RedirectResponse {
        Gate::authorize('create', RequestReturn::class);
        $count = (RequestReturn::max('id') + 1);
        $rrFormat = "RR-RSM-" . date('mdY') . "-" . str_pad($count, 4, '0', STR_PAD_LEFT);

        $create = RequestReturn::create([
            'request_order_id' => $request->request_order_id['id'],
            'branch_id' => $request->branch_id['id'],
            'request_number' => $rrFormat,
            'date' => $request->date,
            'status' => 'Sedang diverifikasi'
        ]);
        UpdateRequestReturnHistory::create([
            'request_return_id' => $create->id,
            'user_id' => Auth::user()->id
        ]);

        for ($i=0; $i < count($request->request_order_id['branch_product']); $i++) {
            $product = BranchProduct::where('id', $request->request_order_id['branch_product'][$i]['id'])->first();
            $product->update([
                'total_return' => $request->request_order_id['branch_product'][$i]['total_return']
            ]);
            ListRequestReturn::create([
                'request_return_id' => $create->id,
                'branch_product_id' => $product->id,
                'quantity' => $product->total_return,
                'serial_barcode' => $product->serial_barcode
            ]);
        }
        RequestReturnLog::create([
            'request_return_id' => $create->id,
            'user_id' => Auth::user()->id,
            'status' => 'Sedang diverifikasi'
        ]);

        Session::flash('toast', ['message' => 'Data berhasil ditambahkan.']);
        return to_route('requestReturns.index');
    }

    public function show(RequestReturn $requestReturn) {
        //
    }

    public function edit(RequestReturn $requestReturn): Response {
        Gate::authorize('update', $requestReturn);
        $employee = Employee::where('employee_number', Auth::user()->username)->first();
        $branch = in_array(Auth::user()->roles[0]['name'], ['root', 'admin-pusat']) ? Branch::all() : Branch::where('status', 'Aktif')->where('id', $employee->branch_id)->get();
        $requestOrders = in_array(Auth::user()->roles[0]['name'], ['root', 'admin-pusat'])
            ? RequestOrder::all()
            : RequestOrder::where('branch_id', $employee->branch_id)->get();
        return Inertia::render('Products/RequestReturns/EditRequestReturn', [
            'requestReturn' => new RequestReturnResource($requestReturn),
            'requestOrders' => RequestOrderResource::collection($requestOrders),
            'branches' => BranchResource::collection($branch),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, RequestReturn $requestReturn)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(RequestReturn $requestReturn)
    {
        //
    }

    public function approvalReturn(Request $request, $id): RedirectResponse {
        $request->validate([
            'approval' => 'required'
        ], [
            'approval.required' => 'Kolom persetujuan wajib diisi.'
        ]);
        RequestReturnLog::create([
            'request_return_id' => $id,
            'user_id' => Auth::user()->id,
            'status' => $request->approval
        ]);
        $checkRequestReturn = RequestReturn::where('id', $id)->first();
        $checkRequestReturn->update([
            'status' => $request->approval
        ]);

        if ($request->approval == 'Pengiriman barang') {
            for ($i=0; $i < count($request->listData); $i++) {
                $check = BranchProduct::where('id', $request->listData[$i]['branch_product_id'])->first();
                $check->update([
                    'quantity' => $check->quantity - $request->listData[$i]['quantity']
                ]);
            }
            Session::flash('toast', ['message' => 'Permintaan return telah dikirim.']);
        } elseif ($request->approval == 'Selesai') {
            for ($i=0; $i < count($request->listData); $i++) {
                $check = CenterStock::where('serial_barcode', $request->listData[$i]['serial_barcode'])->first();
                $check->update([
                    'stock' => $check->stock + $request->listData[$i]['quantity']
                ]);
            }
            Session::flash('toast', ['message' => 'Permintaan return telah selesai.']);
        } else {
            $messages = [
                'Tiba di lokasi' => 'Permintaan return telah diba di lokasi.',
                'Pengecekan barang' => 'Proses pengecekan barang.'
            ];
            Session::flash('toast', ['message' => $messages[$request->approval] ?? 'Status tidak dikenali.']);
        }
        return back();
    }
}
