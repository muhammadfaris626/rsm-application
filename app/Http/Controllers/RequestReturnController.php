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
use App\Traits\OptimizedQueries;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;

class RequestReturnController extends Controller {
    use OptimizedQueries;

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
        
        // Use cached employee
        $employee = !in_array($user->roles[0]['name'], ['root', 'admin-pusat'])
            ? $this->getCachedEmployee($user->username, true)
            : null;
        
        // Optimized query with eager loading
        $searchQuery = RequestReturn::query()
            ->select('id', 'request_order_id', 'branch_id', 'request_number', 'date', 'status', 'created_at', 'updated_at')
            ->with([
                'requestOrder:id,ro_number,branch_id',
                'branch:id,branch_name,branch_code',
                'listRequestReturn:id,request_return_id,branch_product_id,quantity'
            ])
            ->when($employee, fn($query) => $query->where('branch_id', $employee->branch_id))
            ->latest();
        
        $this->applySearch($searchQuery, $request->search);
        $data = RequestReturnResource::collection($searchQuery->paginate(12));
        
        return Inertia::render('Products/RequestReturns/IndexRequestReturn', [
            'fetchData' => $data,
            'search' => $request->search ?? '',
            'userBranch' => $employee?->branch_id ?? 0
        ]);
    }

    public function create(): Response {
        Gate::authorize('create', RequestReturn::class);
        $user = Auth::user();
        
        $employee = $this->getCachedEmployee($user->username, true);
        
        $requestOrders = RequestOrder::select('id', 'ro_number', 'branch_id', 'date', 'status')
            ->with('branchProduct:id,request_order_id,product_id,quantity,serial_barcode')
            ->where('branch_id', $employee->branch_id)
            ->where('status', 'Selesai')
            ->get();
        
        $branches = in_array($user->roles[0]['name'], ['root', 'admin-pusat']) 
            ? $this->getCachedAllBranches() 
            : Branch::select('id', 'branch_code', 'branch_name', 'status')
                ->where('status', 'Aktif')
                ->where('id', $employee->branch_id)
                ->get();
        
        return Inertia::render('Products/RequestReturns/CreateRequestReturn', [
            'requestNumber' => "RR-RSM-" . date('mdY') . "-XXXX",
            'requestOrders' => RequestOrderResource::collection($requestOrders),
            'branches' => BranchResource::collection($branches),
        ]);
    }

    public function store(RequestReturnRequest $request): RedirectResponse {
        Gate::authorize('create', RequestReturn::class);
        $count = (RequestReturn::max('id') ?? 0) + 1;
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

        foreach ($request->request_order_id['branch_product'] as $branchProductData) {
            $product = BranchProduct::find($branchProductData['id']);
            if ($product) {
                $product->update(['total_return' => $branchProductData['total_return']]);
                ListRequestReturn::create([
                    'request_return_id' => $create->id,
                    'branch_product_id' => $product->id,
                    'quantity' => $product->total_return,
                    'serial_barcode' => $product->serial_barcode
                ]);
            }
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
        $user = Auth::user();
        
        $employee = $this->getCachedEmployee($user->username, true);
        
        $branches = in_array($user->roles[0]['name'], ['root', 'admin-pusat']) 
            ? $this->getCachedAllBranches() 
            : Branch::select('id', 'branch_code', 'branch_name', 'status')
                ->where('status', 'Aktif')
                ->where('id', $employee->branch_id)
                ->get();
        
        $requestOrders = in_array($user->roles[0]['name'], ['root', 'admin-pusat'])
            ? RequestOrder::select('id', 'ro_number', 'branch_id', 'date', 'status')->get()
            : RequestOrder::select('id', 'ro_number', 'branch_id', 'date', 'status')
                ->where('branch_id', $employee->branch_id)
                ->get();
        
        return Inertia::render('Products/RequestReturns/EditRequestReturn', [
            'requestReturn' => new RequestReturnResource($requestReturn->load([
                'requestOrder:id,ro_number',
                'branch:id,branch_name',
                'listRequestReturn.branchProduct:id,product_id,quantity'
            ])),
            'requestOrders' => RequestOrderResource::collection($requestOrders),
            'branches' => BranchResource::collection($branches),
        ]);
    }

    public function update(Request $request, RequestReturn $requestReturn)
    {
        //
    }

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
        
        $checkRequestReturn = RequestReturn::find($id);
        $checkRequestReturn->update(['status' => $request->approval]);

        if ($request->approval == 'Pengiriman barang') {
            foreach ($request->listData as $item) {
                BranchProduct::where('id', $item['branch_product_id'])
                    ->decrement('quantity', $item['quantity']);
            }
            Session::flash('toast', ['message' => 'Permintaan return telah dikirim.']);
        } elseif ($request->approval == 'Selesai') {
            foreach ($request->listData as $item) {
                CenterStock::where('serial_barcode', $item['serial_barcode'])
                    ->increment('stock', $item['quantity']);
            }
            Session::flash('toast', ['message' => 'Permintaan return telah selesai.']);
        } else {
            $messages = [
                'Tiba di lokasi' => 'Permintaan return telah tiba di lokasi.',
                'Pengecekan barang' => 'Proses pengecekan barang.'
            ];
            Session::flash('toast', ['message' => $messages[$request->approval] ?? 'Status tidak dikenali.']);
        }
        return back();
    }
}
