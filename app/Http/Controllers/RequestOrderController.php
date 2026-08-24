<?php

namespace App\Http\Controllers;

use App\Http\Requests\RequestOrderRequest;
use App\Http\Resources\BranchResource;
use App\Http\Resources\CenterProductResource;
use App\Http\Resources\RequestOrderResource;
use App\Models\Branch;
use App\Models\BranchProduct;
use App\Models\CenterStock;
use App\Models\Employee;
use App\Models\ListRequestOrder;
use App\Models\Product;
use App\Models\RequestOrder;
use App\Models\RequestOrderLog;
use App\Models\UpdateRequestOrderHistory;
use Carbon\Carbon;
use Dompdf\Dompdf;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class RequestOrderController extends Controller {

    protected function applySearch($query, $search) {
        return $query->when($search, function($query, $search) {
                $query->where(function($query) use($search) {
                    $query->where('ro_number', 'LIKE', '%' . $search . '%')
                    ->orWhere('date', 'LIKE', '%' . $search . '%')
                    ->orWhere('status', 'LIKE', '%' . $search . '%')
                    ->orWhereHas('branch', function($query) use($search) {
                        $query->where('branch_name', 'LIKE', '%' . $search . '%');
                    });
            });
        });
    }

    private function branchProductStocks($branchIds = null) {
        return BranchProduct::query()
            ->select('branch_id', 'product_id', DB::raw('SUM(quantity) as stock'))
            ->when($branchIds, fn($query) => $query->whereIn('branch_id', $branchIds))
            ->groupBy('branch_id', 'product_id')
            ->get();
    }

    private function stockReportValue(array $product, string $key): int {
        return (int) ($product[$key] ?? 0);
    }

    private function requestBranchId(Request $request): int {
        return (int) ($request->input('branch_id.id') ?? $request->input('branch_id.0.id'));
    }

    private function calculateRequestStocks(array $products, int $branchId): array {
        return collect($products)->map(function(array $product, int $index) use ($branchId) {
            $centerStockId = (int) ($product['product_id']['id'] ?? 0);
            $productId = CenterStock::whereKey($centerStockId)->value('product_id');
            $branchStock = $productId
                ? (int) BranchProduct::where('branch_id', $branchId)
                    ->where('product_id', $productId)
                    ->sum('quantity')
                : 0;
            $remainingStock = $this->stockReportValue($product, 'initial_stock');
            $damagedStock = $this->stockReportValue($product, 'damaged_quantity');

            if ($remainingStock + $damagedStock > $branchStock) {
                throw ValidationException::withMessages([
                    "products.{$index}.initial_stock" => 'Sisa stok dan barang rusak tidak boleh melebihi stok cabang.',
                ]);
            }

            return [
                'branch_stock' => $branchStock,
                'remaining_stock' => $remainingStock,
                'used_stock' => $branchStock - $remainingStock - $damagedStock,
                'damaged_stock' => $damagedStock,
                'final_stock' => $remainingStock,
            ];
        })->all();
    }

    public function index(Request $request): Response {
        Gate::authorize('viewAny', RequestOrder::class);
        $user = Auth::user();
        $isCentralUser = $user->hasRole(['root', 'admin-pusat']);
        
        // Cache employee data
        $employee = null;
        if (!$isCentralUser) {
            $employee = Cache::remember("employee_{$user->username}", 300, function() use ($user) {
                return Employee::select('id', 'employee_number', 'branch_id')
                    ->where('employee_number', $user->username)
                    ->first();
            });
        }

        $branches = $isCentralUser
            ? Branch::select('id', 'branch_code', 'branch_name', 'status')
                ->where('status', 'Aktif')
                ->get()
            : ($employee
                ? Branch::select('id', 'branch_code', 'branch_name', 'status')
                    ->where('status', 'Aktif')
                    ->where('id', $employee->branch_id)
                    ->get()
                : collect());
        
        // Optimized query with eager loading
        $searchQuery = RequestOrder::query()
            ->select('id', 'ro_number', 'branch_id', 'date', 'status', 'created_at', 'updated_at')
            ->with([
                'branch:id,branch_name,branch_code',
                'listRequestOrder:id,request_order_id,center_stock_id,quantity,initial_stock,used_quantity,damaged_quantity,final_stock,approved_quantity,serial_barcode,status',
                'listRequestOrder.centerStock:id,product_id,stock,serial_barcode',
                'listRequestOrder.centerStock.product:id,product_name',
                'updateRequestOrderHistory.user:id,name',
                'requestOrderLog.user:id,name'
            ])
            ->when(!$isCentralUser && $employee,
                fn($query) => $query->where('branch_id', $employee->branch_id))
            ->when(!$isCentralUser && !$employee,
                fn($query) => $query->whereRaw('1 = 0'))
            ->when($request->branch,
                fn($query) => $query->where('branch_id', $request->branch))
            ->when($request->start_date,
                fn($query) => $query->whereDate('date', '>=', $request->start_date))
            ->when($request->end_date,
                fn($query) => $query->whereDate('date', '<=', $request->end_date))
            ->latest();
        
        $this->applySearch($searchQuery, $request->search);
        
        return Inertia::render('Products/RequestOrders/IndexRequestOrder', [
            'fetchData' => RequestOrderResource::collection($searchQuery->paginate(12)->withQueryString()),
            'search' => $request->search ?? '',
            'branches' => BranchResource::collection($branches),
            'selectedBranch' => $request->branch ?? '',
            'selectedStartDate' => $request->start_date ?? '',
            'selectedEndDate' => $request->end_date ?? '',
            'userBranch' => $employee?->branch_id ?? 0
        ]);
    }

    public function create(): Response {
        Gate::authorize('create', RequestOrder::class);
        $user = Auth::user();
        $isCentralUser = $user->hasRole(['root', 'admin-pusat']);
        $employee = $isCentralUser ? null : Employee::where('employee_number', $user->username)->first();
        $branch = $isCentralUser
            ? Branch::where('status', 'Aktif')->get()
            : ($employee
                ? Branch::where('status', 'Aktif')->where('id', $employee->branch_id)->get()
                : collect());
        return Inertia::render('Products/RequestOrders/CreateRequestOrder', [
            'branches' => BranchResource::collection($branch),
            'products' => CenterProductResource::collection(
                CenterStock::with('product:id,product_name,product_category_id')->get()
            ),
            'branchProductStocks' => $this->branchProductStocks($branch->pluck('id')),
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
            'products.*.quantity' => 'required|integer|min:1',
            'products.*.initial_stock' => 'required|integer|min:0',
            'products.*.damaged_quantity' => 'required|integer|min:0',
        ], [
            'products.*.product_id.required' => 'Kolom barang wajib diisi.',
            'products.*.quantity.required' => 'Kolom request wajib diisi.',
            'products.*.quantity.min' => 'Jumlah request minimal 1.',
            'products.*.initial_stock.required' => 'Kolom sisa stok wajib diisi.',
            'products.*.initial_stock.integer' => 'Sisa stok harus berupa angka bulat.',
            'products.*.damaged_quantity.required' => 'Kolom rusak wajib diisi.',
            'products.*.damaged_quantity.integer' => 'Kolom rusak harus berupa angka bulat.',
        ]);

        $branchId = $this->requestBranchId($request);
        $stockCalculations = $this->calculateRequestStocks($request->products, $branchId);

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
            'branch_id' => $branchId,
            'date' => $request->date,
            'status' => 'Sedang diverifikasi'
        ]);

        UpdateRequestOrderHistory::create([
            'request_order_id' => $create->id,
            'user_id' => Auth::user()->id
        ]);

        foreach ($request->products as $index => $product) {
            $stocks = $stockCalculations[$index];
            ListRequestOrder::create([
                'request_order_id' => $create->id,
                'center_stock_id' => $product['product_id']['id'],
                'quantity' => $product['quantity'],
                'initial_stock' => $stocks['remaining_stock'],
                'used_quantity' => $stocks['used_stock'],
                'damaged_quantity' => $stocks['damaged_stock'],
                'final_stock' => $stocks['final_stock'],
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

    public function deliveryNote(RequestOrder $requestOrder): HttpResponse {
        Gate::authorize('view', $requestOrder);
        $this->authorizeDeliveryNoteBranch($requestOrder);

        abort_unless(in_array($requestOrder->status, [
            'Pengiriman barang',
            'Tiba di lokasi',
            'Pengecekan barang',
            'Selesai',
        ], true), 409, 'Surat jalan hanya dapat dicetak setelah proses pengiriman dimulai.');

        $requestOrder->load([
            'branch:id,branch_name,branch_address',
            'listRequestOrder.centerStock.product:id,product_name',
            'requestOrderLog' => fn($query) => $query
                ->with('user:id,name')
                ->where('status', 'Pengiriman barang')
                ->oldest('id'),
        ]);

        $shippingLog = $requestOrder->requestOrderLog->first();
        $shippingDate = Carbon::parse($shippingLog?->created_at ?? $requestOrder->updated_at);
        $deliveryNoteNumber = 'SJ-RSM-' . $shippingDate->format('mdY') . '-' . str_pad((string) $requestOrder->id, 4, '0', STR_PAD_LEFT);
        $items = $requestOrder->listRequestOrder->map(fn(ListRequestOrder $item) => [
            'description' => $item->centerStock?->product?->product_name ?? '-',
            'quantity' => (int) ($item->approved_quantity ?? $item->quantity),
            'unit' => 'PCS',
            'notes' => '',
        ]);

        $dompdf = new Dompdf(['isRemoteEnabled' => false]);
        $dompdf->loadHtml(view('request-orders.delivery-note', [
            'requestOrder' => $requestOrder,
            'deliveryNoteNumber' => $deliveryNoteNumber,
            'shippingDate' => $shippingDate->locale('id')->translatedFormat('d F Y'),
            'senderName' => $shippingLog?->user?->name,
            'items' => $items,
        ])->render());
        $dompdf->setPaper('letter', 'portrait');
        $dompdf->render();

        return response($dompdf->output(), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="surat-jalan-' . $deliveryNoteNumber . '.pdf"',
        ]);
    }

    private function authorizeDeliveryNoteBranch(RequestOrder $requestOrder): void {
        $user = Auth::user();
        if ($user->hasRole(['root', 'admin-pusat'])) {
            return;
        }

        $employee = Employee::query()
            ->select('id', 'branch_id', 'employee_number', 'user_id')
            ->where('user_id', $user->id)
            ->orWhere('employee_number', $user->username)
            ->first();

        abort_if(!$employee || (int) $employee->branch_id !== (int) $requestOrder->branch_id, 403);
    }

    public function edit(RequestOrder $requestOrder): Response {
        Gate::authorize('update', $requestOrder);
        $user = Auth::user();
        $isCentralUser = $user->hasRole(['root', 'admin-pusat']);
        $employee = $isCentralUser ? null : Employee::where('employee_number', $user->username)->first();
        $branch = $isCentralUser
            ? Branch::where('status', 'Aktif')->get()
            : ($employee
                ? Branch::where('status', 'Aktif')->where('id', $employee->branch_id)->get()
                : collect());
        return Inertia::render('Products/RequestOrders/EditRequestOrder', [
            'requestOrder' => new RequestOrderResource($requestOrder->load([
                'branch:id,branch_code,branch_name,status',
                'listRequestOrder.centerStock:id,product_id,stock,serial_barcode',
                'listRequestOrder.centerStock.product:id,product_name',
            ])),
            'branches' => BranchResource::collection($branch),
            'products' => CenterProductResource::collection(
                CenterStock::with('product:id,product_name,product_category_id')->get()
            ),
            'branchProductStocks' => $this->branchProductStocks($branch->pluck('id')),
        ]);
    }

    public function update(RequestOrderRequest $request, RequestOrder $requestOrder): RedirectResponse {
        Gate::authorize('update', $requestOrder);
        if ($requestOrder->status !== 'Sedang diverifikasi') {
            Session::flash('toast', [
                'message' => 'Permintaan stok yang sudah diproses tidak dapat diubah.',
                'type' => 'error'
            ]);
            return back();
        }

        $roFormat = "RO-RSM-" . date('mdY') . "-" . str_pad($requestOrder->id, 4, '0', STR_PAD_LEFT);
        if (empty($request->products)) {
            Session::flash('toast', ['message' => 'Silahkan tambah produk terlebih dahulu.', 'type' => 'error']);
            return back();
        }
        $request->validate([
            'products.*.product_id' => 'required',
            'products.*.quantity' => 'required|integer|min:1',
            'products.*.initial_stock' => 'required|integer|min:0',
            'products.*.damaged_quantity' => 'required|integer|min:0',
        ], [
            'products.*.product_id.required' => 'Kolom barang wajib diisi.',
            'products.*.quantity.required' => 'Kolom request wajib diisi.',
            'products.*.quantity.min' => 'Jumlah request minimal 1.',
            'products.*.initial_stock.required' => 'Kolom sisa stok wajib diisi.',
            'products.*.initial_stock.integer' => 'Sisa stok harus berupa angka bulat.',
            'products.*.damaged_quantity.required' => 'Kolom rusak wajib diisi.',
            'products.*.damaged_quantity.integer' => 'Kolom rusak harus berupa angka bulat.',
        ]);
        $branchId = $this->requestBranchId($request);
        $stockCalculations = $this->calculateRequestStocks($request->products, $branchId);
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
            'branch_id' => $branchId,
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
        foreach ($request->products as $index => $product) {
            $stocks = $stockCalculations[$index];
            ListRequestOrder::create([
                'request_order_id' => $requestOrder->id,
                'center_stock_id' => $product['product_id']['id'],
                'quantity' => $product['quantity'],
                'initial_stock' => $stocks['remaining_stock'],
                'used_quantity' => $stocks['used_stock'],
                'damaged_quantity' => $stocks['damaged_stock'],
                'final_stock' => $stocks['final_stock'],
                'serial_barcode' => $product['product_id']['serial_barcode']
            ]);
        }

        Session::flash('toast', ['message' => 'Data berhasil diperbarui.']);
        return to_route('requestOrders.index');
    }


    public function destroy(RequestOrder $requestOrder): RedirectResponse {
        Gate::authorize('delete', $requestOrder);
        if ($requestOrder->status !== 'Sedang diverifikasi') {
            Session::flash('toast', [
                'message' => 'Permintaan stok yang sudah diproses tidak dapat dihapus.',
                'type' => 'error'
            ]);
            return back();
        }

        if ($requestOrder->branchProduct()->exists() || $requestOrder->requestReturn()->exists()) {
            Session::flash('toast', [
                'message' => 'Permintaan stok tidak dapat dihapus karena sudah memiliki barang cabang atau return terkait.',
                'type' => 'error'
            ]);
            return back();
        }

        foreach ($requestOrder->listRequestOrder as $item) {
            $item->delete();
        }
        RequestOrderLog::where('request_order_id', $requestOrder->id)->delete();
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
        $check = RequestOrder::where('id', $id)->first();
        if (!$check) {
            Session::flash('toast', ['message' => 'Permintaan stok tidak ditemukan.', 'type' => 'error']);
            return back();
        }

        RequestOrderLog::create([
            'request_order_id' => $id,
            'user_id' => Auth::user()->id,
            'status' => $request->approval
        ]);

        $check->update([
            'status' => $request->approval
        ]);
        if ($request->approval == 'Selesai') {
            for ($i=0; $i < count($request->listData); $i++) {
                $check = CenterStock::where('id', $request->listData[$i]['center_stock_id'])->first();
                if ($check) {
                    $check->update([
                        'stock' => $check->stock - $request->listData[$i]['approved_quantity']
                    ]);
                }
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
                if ($check) {
                    $approvedQuantity = (int) $request->listData[$i]['approved_quantity'];
                    $check->update([
                        'approved_quantity' => $approvedQuantity,
                        'final_stock' => ((int) $check->initial_stock) + $approvedQuantity,
                        'status' => 1
                    ]);
                }
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
