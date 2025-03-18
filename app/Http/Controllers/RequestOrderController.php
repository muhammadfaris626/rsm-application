<?php

namespace App\Http\Controllers;

use App\Http\Requests\RequestOrderRequest;
use App\Http\Resources\ApprovalTypeResource;
use App\Http\Resources\BranchResource;
use App\Http\Resources\CenterProductResource;
use App\Http\Resources\ProductResource;
use App\Http\Resources\RequestOrderResource;
use App\Models\ApprovalType;
use App\Models\Branch;
use App\Models\BranchProduct;
use App\Models\CenterStock;
use App\Models\Employee;
use App\Models\ListRequestOrder;
use App\Models\Product;
use App\Models\RequestOrder;
use App\Models\RequestOrderLog;
use App\Models\UpdateRequestOrderHistory;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;

class RequestOrderController extends Controller {

    protected function applySearch($query, $search) {
        return $query->when($search, function($query, $search) {
            $query->where('ro_number', 'LIKE', '%' . $search . '%')
                ->orWhere('date', 'LIKE', '%' . $search . '%');
        });
    }

    public function index(Request $request): Response {
        Gate::authorize('viewAny', RequestOrder::class);
        $user = Auth::user();
        $employee = Employee::where('employee_number', $user->username)->first();
        $searchQuery = RequestOrder::query()->when($user->roles[0]['name'] !== 'root', fn($query) => $query->where('branch_id', $employee->branch_id))->latest();
        $this->applySearch($searchQuery, $request->search);
        return Inertia::render('Products/RequestOrders/IndexRequestOrder', [
            'fetchData' => RequestOrderResource::collection($searchQuery->paginate(12)),
            'search' => $request->search ?? '',
            'approvalTypes' => ApprovalTypeResource::collection(ApprovalType::all()),
            'userBranch' => $employee->branch_id ?? 0
        ]);
    }

    public function create(): Response {
        Gate::authorize('create', RequestOrder::class);
        $employee = Employee::where('employee_number', Auth::user()->username)->first();
        $branch = in_array(Auth::user()->roles[0]['name'], ['root', 'admin-pusat']) ? Branch::all() : Branch::where('status', 'Aktif')->where('id', $employee->branch_id)->get();
        return Inertia::render('Products/RequestOrders/CreateRequestOrder', [
            'branches' => BranchResource::collection($branch),
            'products' => CenterProductResource::collection(CenterStock::all()),
            'ro_number' => "RO-RSM-" . date('mdY') . "-XXXX"
        ]);
    }

    public function store(RequestOrderRequest $request): RedirectResponse {
        Gate::authorize('create', RequestOrder::class);
        $count = (RequestOrder::max('id') ?? 0) + 1;
        $roFormat = "RO-RSM-" . date('mdY') . "-" . str_pad($count, 4, '0', STR_PAD_LEFT);

        if (empty($request->products)) {
            Session::flash('toast', ['message' => 'Silahkan tambah produk terlebih dahulu.', 'type' => 'error']);
            return back();
        }

        $request->validate([
            'products.*.product_id' => 'required',
            'products.*.quantity' => 'required'
        ], [
            'products.*.product_id.required' => 'Kolom barang wajib diisi.',
            'products.*.quantity.required' => 'Kolom total barang wajib diisi.'
        ]);

        // $insufficientStock = [];

        // foreach ($request->products as $product) {
        //     $productId = $product['product_id']['id'];
        //     $requestedQuantity = $product['quantity'];
        //     $availableStock = CenterStock::find($productId)->stock ?? 0;

        //     if ($requestedQuantity > $availableStock) {
        //         $insufficientStock[] = CenterStock::find($productId)->product->product_name;
        //     }
        // }

        // if (!empty($insufficientStock)) {
        //     Session::flash('toast', [
        //         'message' => 'Stok tidak mencukupi untuk produk: ' . implode(", ", $insufficientStock),
        //         'type' => 'error'
        //     ]);
        //     return back();
        // }

        $create = RequestOrder::create([
            'ro_number' => $roFormat,
            'branch_id' => $request->branch_id['id'],
            'date' => $request->date,
            'status' => 'Sedang diverifikasi'
        ]);

        UpdateRequestOrderHistory::create([
            'request_order_id' => $create->id,
            'user_id' => Auth::user()->id
        ]);

        foreach ($request->products as $product) {
            ListRequestOrder::create([
                'request_order_id' => $create->id,
                'center_stock_id' => $product['product_id']['id'],
                'quantity' => $product['quantity'],
                'serial_barcode' => $product['product_id']['serial_barcode']
            ]);
        }

        RequestOrderLog::create([
            'request_order_id' => $create->id,
            'user_id' => Auth::user()->id,
            'status' => 'Sedang diverifikasi',
        ]);

        Session::flash('toast', ['message' => 'Data berhasil ditambahkan.']);
        return to_route('requestOrders.index');
    }


    public function show(RequestOrder $requestOrder) {

    }

    public function edit(RequestOrder $requestOrder): Response {
        Gate::authorize('update', $requestOrder);
        $employee = Employee::where('employee_number', Auth::user()->username)->first();
        $branch = in_array(Auth::user()->roles[0]['name'], ['root', 'admin-pusat']) ? Branch::all() : Branch::where('status', 'Aktif')->where('id', $employee->branch_id)->get();
        return Inertia::render('Products/RequestOrders/EditRequestOrder', [
            'requestOrder' => new RequestOrderResource($requestOrder),
            'branches' => BranchResource::collection($branch),
            'products' => CenterProductResource::collection(CenterStock::all()),
        ]);
    }

    public function update(RequestOrderRequest $request, RequestOrder $requestOrder): RedirectResponse {
        Gate::authorize('update', $requestOrder);
        $roFormat = "RO-RSM-" . date('mdY') . "-" . str_pad($requestOrder->id, 4, '0', STR_PAD_LEFT);
        if (empty($request->products)) {
            Session::flash('toast', ['message' => 'Silahkan tambah produk terlebih dahulu.', 'type' => 'error']);
            return back();
        }
        $request->validate([
            'products.*.product_id' => 'required',
            'products.*.quantity' => 'required'
        ], [
            'products.*.product_id.required' => 'Kolom barang wajib diisi.',
            'products.*.quantity.required' => 'Kolom total barang wajib diisi.'
        ]);
        // $insufficientStock = [];
        // foreach ($request->products as $product) {
        //     $productId = $product['product_id']['id'];
        //     $requestedQuantity = $product['quantity'];
        //     $availableStock = CenterStock::find($productId)->stock ?? 0;
        //     if ($requestedQuantity > $availableStock) {
        //         $insufficientStock[] = CenterStock::find($productId)->product->product_name;
        //     }
        // }
        // if (!empty($insufficientStock)) {
        //     Session::flash('toast', [
        //         'message' => 'Stok tidak mencukupi untuk produk: ' . implode(", ", $insufficientStock),
        //         'type' => 'error'
        //     ]);
        //     return back();
        // }
        // Update the RequestOrder
        $requestOrder->update([
            'ro_number' => $roFormat,
            'branch_id' => isset($request->branch_id['id']) ? $request->branch_id['id'] : $request->branch_id[0]['id'],
            'date' => $request->date,
            'status' => 'Sedang diverifikasi' // Assuming the status remains the same
        ]);

        // Update the RequestOrderHistory
        UpdateRequestOrderHistory::create([
            'request_order_id' => $requestOrder->id,
            'user_id' => Auth::user()->id
        ]);

        // Delete the previous ListRequestOrder records for the updated RequestOrder
        ListRequestOrder::where('request_order_id', $requestOrder->id)->delete();

        // Insert the new ListRequestOrder records
        foreach ($request->products as $product) {
            ListRequestOrder::create([
                'request_order_id' => $requestOrder->id,
                'center_stock_id' => $product['product_id']['id'],
                'quantity' => $product['quantity'],
                'serial_barcode' => $product['product_id']['serial_barcode']
            ]);
        }

        Session::flash('toast', ['message' => 'Data berhasil diperbarui.']);
        return to_route('requestOrders.index');
    }


    public function destroy(RequestOrder $requestOrder): RedirectResponse {
        Gate::authorize('delete', $requestOrder);
        foreach ($requestOrder->listRequestOrder as $item) {
            $item->delete();
        }
        UpdateRequestOrderHistory::where('request_order_id', $requestOrder->id)->delete();
        $requestOrder->delete();
        Session::flash('toast', ['message' => 'Data berhasil dihapus.']);
        return back();
    }

    public function approval(Request $request, $id): RedirectResponse {
        $request->validate([
            'approval' => 'required'
        ], [
            'approval.required' => 'Kolom persetujuan wajib diisi.'
        ]);
        RequestOrderLog::create([
            'request_order_id' => $id,
            'user_id' => Auth::user()->id,
            'status' => $request->approval
        ]);
        $check = RequestOrder::where('id', $id)->first();
        $check->update([
            'status' => $request->approval
        ]);
        if ($request->approval == 'Selesai') {
            for ($i=0; $i < count($request->listData); $i++) {
                $check = CenterStock::where('id', $request->listData[$i]['center_stock_id'])->first();
                $check->update([
                    'stock' => $check->stock - $request->listData[$i]['approved_quantity']
                ]);
                BranchProduct::create([
                    'branch_id' => $request->branch_id[0]['id'],
                    'product_id' => $request->listData[$i]['center_stock']['product_id'],
                    'quantity' => $request->listData[$i]['approved_quantity'],
                    'serial_barcode' => $request->listData[$i]['serial_barcode'],
                    'request_order_id' => $id
                ]);
            }
            Session::flash('toast', ['message' => 'Permintaan pesanan telah selesai.']);
        } elseif($request->approval == 'Disetujui') {
            for ($i=0; $i < count($request->listData); $i++) {
                $check = ListRequestOrder::where('id', $request->listData[$i]['id'])->first();
                $check->update([
                    'approved_quantity' => $request->listData[$i]['approved_quantity'],
                    'status' => 1
                ]);
            }
            Session::flash('toast', ['message' => 'Permintaan pesanan berhasil disetujui.']);
        } else {
            $messages = [
                'Disetujui' => 'Permintaan pesanan berhasil disetujui.',
                'Pengiriman barang' => 'Permintaan pesanan telah dikirim.',
                'Tiba di lokasi' => 'Permintaan pesanan telah tiba di lokasi.',
                'Pengecekan barang' => 'Proses pengecekan barang.',
            ];
            Session::flash('toast', ['message' => $messages[$request->approval] ?? 'Status tidak dikenali.']);
        }
        return back();
    }
}
