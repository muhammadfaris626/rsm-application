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
            $query->where(function($query) use($search) {
                $query->whereHas('requestOrder', function($query) use($search) {
                    $query->where('ro_number', 'LIKE', '%' . $search . '%');
                })
                ->orWhere('request_number', 'LIKE', '%' . $search . '%');
            });
        });
    }

    private function validateReturnItems(array $branchProducts): ?RedirectResponse {
        if (empty($branchProducts)) {
            Session::flash('toast', [
                'message' => 'Nomor RO belum memiliki barang cabang.',
                'type' => 'error'
            ]);
            return back();
        }

        foreach ($branchProducts as $branchProductData) {
            $product = BranchProduct::with('product:id,product_name')->find($branchProductData['id'] ?? null);
            $returnQuantity = $branchProductData['total_return'] ?? null;

            if (!$product) {
                Session::flash('toast', [
                    'message' => 'Barang cabang tidak ditemukan.',
                    'type' => 'error'
                ]);
                return back();
            }

            if ($returnQuantity === null || $returnQuantity === '') {
                Session::flash('toast', [
                    'message' => 'Jumlah return untuk ' . ($product->product?->product_name ?? 'barang') . ' wajib diisi.',
                    'type' => 'error'
                ]);
                return back();
            }

            if ((int) $returnQuantity > (int) $product->quantity) {
                Session::flash('toast', [
                    'message' => 'Jumlah return untuk ' . ($product->product?->product_name ?? 'barang') . ' tidak boleh melebihi sisa stok.',
                    'type' => 'error'
                ]);
                return back();
            }
        }

        return null;
    }

    public function index(Request $request): Response {
        Gate::authorize('viewAny', RequestReturn::class);
        $user = Auth::user();
        
        // Use cached employee
        $isCentralUser = $user->hasRole(['root', 'admin-pusat']);
        $employee = !$isCentralUser
            ? $this->getCachedEmployee($user->username, true)
            : null;
        
        // Optimized query with eager loading
        $searchQuery = RequestReturn::query()
            ->select('id', 'request_order_id', 'branch_id', 'request_number', 'date', 'status', 'created_at', 'updated_at')
            ->with([
                'requestOrder:id,ro_number,branch_id',
                'branch:id,branch_name,branch_code',
                'listRequestReturn:id,request_return_id,branch_product_id,quantity,serial_barcode',
                'listRequestReturn.branchProduct:id,product_id,quantity,serial_barcode,total_return',
                'listRequestReturn.branchProduct.product:id,product_name',
                'updateRequestReturnHistory.user:id,name',
                'requestReturnLog.user:id,name'
            ])
            ->when($employee, fn($query) => $query->where('branch_id', $employee->branch_id))
            ->when(!$isCentralUser && !$employee, fn($query) => $query->whereRaw('1 = 0'))
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
        $isCentralUser = $user->hasRole(['root', 'admin-pusat']);
        $employee = $isCentralUser ? null : $this->getCachedEmployee($user->username, true);
        
        $requestOrders = RequestOrder::select('id', 'ro_number', 'branch_id', 'date', 'status')
            ->with([
                'branch:id,branch_code,branch_name,status',
                'branchProduct:id,request_order_id,product_id,quantity,serial_barcode,total_return',
                'branchProduct.product:id,product_name'
            ])
            ->when(!$isCentralUser && $employee, fn($query) => $query->where('branch_id', $employee->branch_id))
            ->when(!$isCentralUser && !$employee, fn($query) => $query->whereRaw('1 = 0'))
            ->where('status', 'Selesai')
            ->get();
        
        $branches = $isCentralUser
            ? $this->getCachedActiveBranches()
            : ($employee
                ? Branch::select('id', 'branch_code', 'branch_name', 'status')
                    ->where('status', 'Aktif')
                    ->where('id', $employee->branch_id)
                    ->get()
                : collect());
        
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
        $requestOrderId = $request->request_order_id['id'];
        $branchId = $request->branch_id['id'];
        $requestOrder = RequestOrder::find($requestOrderId);

        if (!$requestOrder || (int) $requestOrder->branch_id !== (int) $branchId) {
            Session::flash('toast', [
                'message' => 'Nomor RO harus sesuai dengan cabang yang dipilih.',
                'type' => 'error'
            ]);
            return back();
        }

        if ($redirect = $this->validateReturnItems($request->request_order_id['branch_product'] ?? [])) {
            return $redirect;
        }

        $create = RequestReturn::create([
            'request_order_id' => $requestOrderId,
            'branch_id' => $branchId,
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
        $isCentralUser = $user->hasRole(['root', 'admin-pusat']);
        $employee = $isCentralUser ? null : $this->getCachedEmployee($user->username, true);
        
        $branches = $isCentralUser
            ? $this->getCachedActiveBranches()
            : ($employee
                ? Branch::select('id', 'branch_code', 'branch_name', 'status')
                    ->where('status', 'Aktif')
                    ->where('id', $employee->branch_id)
                    ->get()
                : collect());
        
        $requestOrders = RequestOrder::select('id', 'ro_number', 'branch_id', 'date', 'status')
            ->with([
                'branch:id,branch_code,branch_name,status',
                'branchProduct:id,request_order_id,product_id,quantity,serial_barcode,total_return',
                'branchProduct.product:id,product_name'
            ])
            ->where('status', 'Selesai')
            ->when(!$isCentralUser && $employee, fn($query) => $query->where('branch_id', $employee->branch_id))
            ->when(!$isCentralUser && !$employee, fn($query) => $query->whereRaw('1 = 0'))
            ->get();
        
        return Inertia::render('Products/RequestReturns/EditRequestReturn', [
            'requestReturn' => new RequestReturnResource($requestReturn->load([
                'requestOrder:id,ro_number,branch_id',
                'requestOrder.branch:id,branch_code,branch_name,status',
                'requestOrder.branchProduct:id,request_order_id,product_id,quantity,serial_barcode,total_return',
                'requestOrder.branchProduct.product:id,product_name',
                'branch:id,branch_code,branch_name,status',
                'listRequestReturn.branchProduct:id,product_id,quantity,serial_barcode,total_return',
                'listRequestReturn.branchProduct.product:id,product_name'
            ])),
            'requestOrders' => RequestOrderResource::collection($requestOrders),
            'branches' => BranchResource::collection($branches),
        ]);
    }

    public function update(RequestReturnRequest $request, RequestReturn $requestReturn): RedirectResponse {
        Gate::authorize('update', $requestReturn);
        if ($requestReturn->status !== 'Sedang diverifikasi') {
            Session::flash('toast', [
                'message' => 'Permintaan return yang sudah diproses tidak dapat diubah.',
                'type' => 'error'
            ]);
            return back();
        }

        $requestOrderId = $request->request_order_id['id'] ?? $request->request_order_id[0]['id'] ?? $request->request_order_id;
        $branchId = $request->branch_id['id'] ?? $request->branch_id[0]['id'] ?? $request->branch_id;
        $requestOrder = RequestOrder::find($requestOrderId);

        if (!$requestOrder || (int) $requestOrder->branch_id !== (int) $branchId) {
            Session::flash('toast', [
                'message' => 'Nomor RO harus sesuai dengan cabang yang dipilih.',
                'type' => 'error'
            ]);
            return back();
        }

        if ($redirect = $this->validateReturnItems($request->request_order_id['branch_product'] ?? [])) {
            return $redirect;
        }

        $requestReturn->update([
            'request_order_id' => $requestOrderId,
            'branch_id' => $branchId,
            'date' => $request->date,
            'status' => 'Sedang diverifikasi'
        ]);

        UpdateRequestReturnHistory::create([
            'request_return_id' => $requestReturn->id,
            'user_id' => Auth::user()->id
        ]);

        $existingBranchProductIds = $requestReturn->listRequestReturn()->pluck('branch_product_id');
        if ($existingBranchProductIds->isNotEmpty()) {
            BranchProduct::whereIn('id', $existingBranchProductIds)->update(['total_return' => '']);
        }

        ListRequestReturn::where('request_return_id', $requestReturn->id)->delete();

        foreach (($request->request_order_id['branch_product'] ?? []) as $branchProductData) {
            $product = BranchProduct::find($branchProductData['id'] ?? null);
            if ($product) {
                $product->update(['total_return' => $branchProductData['total_return'] ?? '']);
                ListRequestReturn::create([
                    'request_return_id' => $requestReturn->id,
                    'branch_product_id' => $product->id,
                    'quantity' => $product->total_return,
                    'serial_barcode' => $product->serial_barcode
                ]);
            }
        }

        RequestReturnLog::create([
            'request_return_id' => $requestReturn->id,
            'user_id' => Auth::user()->id,
            'status' => 'Sedang diverifikasi'
        ]);

        Session::flash('toast', ['message' => 'Data berhasil diperbarui.']);
        return to_route('requestReturns.index');
    }

    public function destroy(RequestReturn $requestReturn): RedirectResponse {
        Gate::authorize('delete', $requestReturn);
        if ($requestReturn->status !== 'Sedang diverifikasi') {
            Session::flash('toast', [
                'message' => 'Permintaan return yang sudah diproses tidak dapat dihapus.',
                'type' => 'error'
            ]);
            return back();
        }

        $branchProductIds = $requestReturn->listRequestReturn()->pluck('branch_product_id');
        if ($branchProductIds->isNotEmpty()) {
            BranchProduct::whereIn('id', $branchProductIds)->update(['total_return' => '']);
        }

        RequestReturnLog::where('request_return_id', $requestReturn->id)->delete();
        ListRequestReturn::where('request_return_id', $requestReturn->id)->delete();
        UpdateRequestReturnHistory::where('request_return_id', $requestReturn->id)->delete();
        $requestReturn->delete();

        Session::flash('toast', ['message' => 'Data berhasil dihapus.']);
        return back();
    }

    public function approvalReturn(Request $request, $id): RedirectResponse {
        $request->validate([
            'approval' => 'required'
        ], [
            'approval.required' => 'Kolom persetujuan wajib diisi.'
        ]);
        
        $checkRequestReturn = RequestReturn::find($id);
        if (!$checkRequestReturn) {
            Session::flash('toast', ['message' => 'Permintaan return tidak ditemukan.', 'type' => 'error']);
            return back();
        }

        RequestReturnLog::create([
            'request_return_id' => $id,
            'user_id' => Auth::user()->id,
            'status' => $request->approval
        ]);

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
