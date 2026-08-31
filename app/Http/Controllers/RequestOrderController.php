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
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;
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
        $branchId = (int) ($request->input('branch_id.id') ?? $request->input('branch_id.0.id'));
        if ($branchId <= 0 || !Branch::whereKey($branchId)->exists()) {
            throw ValidationException::withMessages([
                'branch_id' => 'Cabang yang dipilih tidak ditemukan.',
            ]);
        }

        return $branchId;
    }

    private function authorizeRequestBranch(int $branchId): void {
        $user = Auth::user();
        if ($user->hasRole(['root', 'admin-pusat'])) {
            return;
        }

        $employeeBranchId = Employee::query()
            ->where('user_id', $user->id)
            ->orWhere('employee_number', $user->username)
            ->value('branch_id');

        abort_if(!$employeeBranchId || (int) $employeeBranchId !== $branchId, 403);
    }

    private function calculateRequestStocks(array $products, int $branchId): array {
        $selectedProductIds = [];

        $centerStockIds = collect($products)
            ->map(fn(array $product) => (int) ($product['product_id']['id'] ?? 0))
            ->filter()
            ->unique()
            ->values();
        $centerStocks = CenterStock::query()
            ->select('id', 'product_id', 'serial_barcode')
            ->whereIn('id', $centerStockIds)
            ->get()
            ->keyBy('id');
        $branchStocks = BranchProduct::query()
            ->select('product_id', DB::raw('SUM(quantity) as stock'))
            ->where('branch_id', $branchId)
            ->whereIn('product_id', $centerStocks->pluck('product_id')->filter()->unique())
            ->groupBy('product_id')
            ->pluck('stock', 'product_id');

        return collect($products)->map(function(array $product, int $index) use ($centerStocks, $branchStocks, &$selectedProductIds) {
            $centerStockId = (int) ($product['product_id']['id'] ?? 0);
            $centerStock = $centerStocks->get($centerStockId);
            $productId = $centerStock?->product_id;

            if ($productId && in_array((int) $productId, $selectedProductIds, true)) {
                throw ValidationException::withMessages([
                    "products.{$index}.product_id" => 'Barang yang sama tidak boleh ditambahkan lebih dari satu kali.',
                ]);
            }
            $selectedProductIds[] = (int) $productId;

            $initialStock = (int) ($branchStocks->get($productId) ?? 0);
            $usedStock = $this->stockReportValue($product, 'used_quantity');
            $damagedStock = $this->stockReportValue($product, 'damaged_quantity');

            if ($usedStock + $damagedStock > $initialStock) {
                throw ValidationException::withMessages([
                    "products.{$index}.used_quantity" => 'Barang terpakai dan rusak tidak boleh melebihi stok awal.',
                ]);
            }

            return [
                'initial_stock' => $initialStock,
                'used_stock' => $usedStock,
                'damaged_stock' => $damagedStock,
                'final_stock' => $initialStock - $usedStock - $damagedStock,
                'serial_barcode' => $centerStock->serial_barcode,
            ];
        })->all();
    }

    private function nextRequestOrderStatus(string $status): ?string {
        return [
            'Sedang diverifikasi' => 'Disetujui',
            'Disetujui' => 'Pengiriman barang',
            'Pengiriman barang' => 'Tiba di lokasi',
            'Tiba di lokasi' => 'Pengecekan barang',
            'Pengecekan barang' => 'Selesai',
        ][$status] ?? null;
    }

    private function authorizeStatusTransition(RequestOrder $requestOrder): void {
        $user = Auth::user();
        if ($user->hasRole('root')) {
            return;
        }

        if ($user->hasRole('admin-pusat')) {
            abort_unless(in_array($requestOrder->status, [
                'Sedang diverifikasi',
                'Disetujui',
            ], true), 403);
            return;
        }

        if ($user->hasRole('admin-branch')) {
            $this->authorizeRequestBranch((int) $requestOrder->branch_id);
            abort_unless(in_array($requestOrder->status, [
                'Pengiriman barang',
                'Tiba di lokasi',
                'Pengecekan barang',
            ], true), 403);
            return;
        }

        abort(403);
    }

    private function reconcileBranchStock(ListRequestOrder $item, int $branchId, int $productId): void {
        $branchProducts = BranchProduct::where('branch_id', $branchId)
            ->where('product_id', $productId)
            ->orderBy('id')
            ->lockForUpdate()
            ->get();
        $currentStock = (int) $branchProducts->sum(fn(BranchProduct $product) => (int) $product->quantity);
        $expectedStock = (int) $item->initial_stock;

        if ($currentStock !== $expectedStock) {
            throw ValidationException::withMessages([
                'approval' => "Stok cabang untuk barang ini berubah dari {$expectedStock} menjadi {$currentStock} selama proses permintaan. Proses selesai dibatalkan agar stok tidak salah.",
            ]);
        }

        $quantityToRemove = (int) $item->used_quantity + (int) $item->damaged_quantity;
        foreach ($branchProducts as $branchProduct) {
            if ($quantityToRemove <= 0) {
                break;
            }

            $availableQuantity = (int) $branchProduct->quantity;
            $deductedQuantity = min($availableQuantity, $quantityToRemove);
            $branchProduct->update(['quantity' => $availableQuantity - $deductedQuantity]);
            $quantityToRemove -= $deductedQuantity;
        }

        if ($quantityToRemove > 0) {
            throw ValidationException::withMessages([
                'approval' => 'Stok cabang tidak mencukupi untuk mencatat barang terpakai dan rusak.',
            ]);
        }
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

        // Optimized query with eager loading
        $searchQuery = RequestOrder::query()
            ->select('id', 'ro_number', 'branch_id', 'date', 'status', 'created_at', 'updated_at')
            ->with([
                'branch:id,branch_name,branch_code',
                'listRequestOrder:id,request_order_id,center_stock_id,quantity,initial_stock,used_quantity,damaged_quantity,final_stock,approved_quantity,serial_barcode,status',
                'listRequestOrder.centerStock:id,product_id,stock,serial_barcode',
                'listRequestOrder.centerStock.product:id,product_name,product_category_id',
                'latestUpdateRequestOrderHistory.user:id,name',
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
            'branches' => fn () => BranchResource::collection(
                $isCentralUser
                    ? Branch::select('id', 'branch_code', 'branch_name', 'status')
                        ->where('status', 'Aktif')
                        ->get()
                    : ($employee
                        ? Branch::select('id', 'branch_code', 'branch_name', 'status')
                            ->where('status', 'Aktif')
                            ->where('id', $employee->branch_id)
                            ->get()
                        : collect())
            ),
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
                CenterStock::with([
                    'product:id,product_name,product_category_id',
                    'product.productCategory:id,product_category_name',
                ])->get()
            ),
            'branchProductStocks' => $isCentralUser
                ? []
                : $this->branchProductStocks($branch->pluck('id')),
            'ro_number' => "RO-RSM-" . date('mdY') . "-XXXX"
        ]);
    }

    public function branchStocks(Branch $branch): JsonResponse {
        Gate::authorize('create', RequestOrder::class);
        $this->authorizeRequestBranch((int) $branch->id);

        return response()->json([
            'data' => $this->branchProductStocks([$branch->id]),
        ]);
    }

    public function store(RequestOrderRequest $request): RedirectResponse {
        Gate::authorize('create', RequestOrder::class);

        if (empty($request->products)) {
            Session::flash('toast', ['message' => 'Silahkan tambah produk terlebih dahulu.', 'type' => 'error']);
            return back();
        }

        $request->validate([
            'products.*.product_id' => 'required',
            'products.*.product_id.id' => 'required|integer|exists:center_stocks,id',
            'products.*.quantity' => 'required|integer|min:1',
            'products.*.used_quantity' => 'required|integer|min:0',
            'products.*.damaged_quantity' => 'required|integer|min:0',
        ], [
            'products.*.product_id.required' => 'Kolom barang wajib diisi.',
            'products.*.product_id.id.required' => 'Kolom barang wajib diisi.',
            'products.*.product_id.id.exists' => 'Barang yang dipilih tidak ditemukan.',
            'products.*.quantity.required' => 'Kolom request wajib diisi.',
            'products.*.quantity.min' => 'Jumlah request minimal 1.',
            'products.*.used_quantity.required' => 'Kolom terpakai wajib diisi.',
            'products.*.used_quantity.integer' => 'Kolom terpakai harus berupa angka bulat.',
            'products.*.damaged_quantity.required' => 'Kolom rusak wajib diisi.',
            'products.*.damaged_quantity.integer' => 'Kolom rusak harus berupa angka bulat.',
        ]);

        $branchId = $this->requestBranchId($request);
        $this->authorizeRequestBranch($branchId);
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

        DB::transaction(function() use($request, $branchId, $stockCalculations) {
            $create = RequestOrder::create([
                'ro_number' => 'TEMP-' . Str::uuid(),
                'branch_id' => $branchId,
                'date' => $request->date,
                'status' => 'Sedang diverifikasi',
            ]);
            $create->update([
                'ro_number' => 'RO-RSM-' . date('mdY') . '-' . str_pad((string) $create->id, 4, '0', STR_PAD_LEFT),
            ]);

            UpdateRequestOrderHistory::create([
                'request_order_id' => $create->id,
                'user_id' => Auth::id(),
            ]);

            foreach ($request->products as $index => $product) {
                $stocks = $stockCalculations[$index];
                ListRequestOrder::create([
                    'request_order_id' => $create->id,
                    'center_stock_id' => $product['product_id']['id'],
                    'quantity' => $product['quantity'],
                    'initial_stock' => $stocks['initial_stock'],
                    'used_quantity' => $stocks['used_stock'],
                    'damaged_quantity' => $stocks['damaged_stock'],
                    'final_stock' => $stocks['final_stock'],
                    'serial_barcode' => $stocks['serial_barcode'],
                ]);
            }

            RequestOrderLog::create([
                'request_order_id' => $create->id,
                'user_id' => Auth::id(),
                'status' => 'Sedang diverifikasi',
            ]);
        });

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
                'listRequestOrder.centerStock.product:id,product_name,product_category_id',
                'listRequestOrder.centerStock.product.productCategory:id,product_category_name',
            ])),
            'branches' => BranchResource::collection($branch),
            'products' => CenterProductResource::collection(
                CenterStock::with([
                    'product:id,product_name,product_category_id',
                    'product.productCategory:id,product_category_name',
                ])->get()
            ),
            'branchProductStocks' => $this->branchProductStocks([$requestOrder->branch_id]),
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
            'products.*.product_id.id' => 'required|integer|exists:center_stocks,id',
            'products.*.quantity' => 'required|integer|min:1',
            'products.*.used_quantity' => 'required|integer|min:0',
            'products.*.damaged_quantity' => 'required|integer|min:0',
        ], [
            'products.*.product_id.required' => 'Kolom barang wajib diisi.',
            'products.*.product_id.id.required' => 'Kolom barang wajib diisi.',
            'products.*.product_id.id.exists' => 'Barang yang dipilih tidak ditemukan.',
            'products.*.quantity.required' => 'Kolom request wajib diisi.',
            'products.*.quantity.min' => 'Jumlah request minimal 1.',
            'products.*.used_quantity.required' => 'Kolom terpakai wajib diisi.',
            'products.*.used_quantity.integer' => 'Kolom terpakai harus berupa angka bulat.',
            'products.*.damaged_quantity.required' => 'Kolom rusak wajib diisi.',
            'products.*.damaged_quantity.integer' => 'Kolom rusak harus berupa angka bulat.',
        ]);
        $branchId = $this->requestBranchId($request);
        $this->authorizeRequestBranch($branchId);
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
        DB::transaction(function() use($request, $requestOrder, $branchId, $stockCalculations, $roFormat) {
            $requestOrder->update([
                'ro_number' => $roFormat,
                'branch_id' => $branchId,
                'date' => $request->date,
                'status' => 'Sedang diverifikasi',
            ]);

            UpdateRequestOrderHistory::create([
                'request_order_id' => $requestOrder->id,
                'user_id' => Auth::id(),
            ]);

            ListRequestOrder::where('request_order_id', $requestOrder->id)->delete();

            foreach ($request->products as $index => $product) {
                $stocks = $stockCalculations[$index];
                ListRequestOrder::create([
                    'request_order_id' => $requestOrder->id,
                    'center_stock_id' => $product['product_id']['id'],
                    'quantity' => $product['quantity'],
                    'initial_stock' => $stocks['initial_stock'],
                    'used_quantity' => $stocks['used_stock'],
                    'damaged_quantity' => $stocks['damaged_stock'],
                    'final_stock' => $stocks['final_stock'],
                    'serial_barcode' => $stocks['serial_barcode'],
                ]);
            }
        });

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
        $requestOrder = RequestOrder::find($id);
        if (!$requestOrder) {
            Session::flash('toast', ['message' => 'Permintaan stok tidak ditemukan.', 'type' => 'error']);
            return back();
        }
        Gate::authorize('update', $requestOrder);
        $this->authorizeStatusTransition($requestOrder);

        DB::transaction(function() use($request, $id) {
            $requestOrder = RequestOrder::whereKey($id)->lockForUpdate()->firstOrFail();
            $nextStatus = $this->nextRequestOrderStatus($requestOrder->status);

            if ($nextStatus !== $request->approval) {
                throw ValidationException::withMessages([
                    'approval' => $nextStatus
                        ? "Status berikutnya harus {$nextStatus}."
                        : 'Permintaan stok ini sudah selesai dan tidak dapat diproses kembali.',
                ]);
            }

            if ($request->approval === 'Disetujui') {
                $request->validate([
                    'listData' => 'required|array|min:1',
                    'listData.*.id' => 'required|integer|distinct',
                    'listData.*.approved_quantity' => 'required|integer|min:0',
                ], [
                    'listData.*.approved_quantity.required' => 'Jumlah yang disetujui wajib diisi.',
                    'listData.*.approved_quantity.integer' => 'Jumlah yang disetujui harus berupa angka bulat.',
                    'listData.*.approved_quantity.min' => 'Jumlah yang disetujui tidak boleh negatif.',
                ]);

                $submittedItems = collect($request->listData)->keyBy(fn($item) => (int) $item['id']);
                $items = ListRequestOrder::where('request_order_id', $requestOrder->id)
                    ->lockForUpdate()
                    ->get();

                if ($submittedItems->count() !== $items->count()) {
                    throw ValidationException::withMessages([
                        'approval' => 'Data barang yang disetujui tidak sesuai dengan permintaan.',
                    ]);
                }

                foreach ($items as $item) {
                    $submittedItem = $submittedItems->get($item->id);
                    if (!$submittedItem) {
                        throw ValidationException::withMessages([
                            'approval' => 'Data barang yang disetujui tidak lengkap.',
                        ]);
                    }

                    $approvedQuantity = (int) $submittedItem['approved_quantity'];
                    if ($approvedQuantity > (int) $item->quantity) {
                        throw ValidationException::withMessages([
                            'approval' => 'Jumlah yang disetujui tidak boleh melebihi jumlah request.',
                        ]);
                    }

                    $item->update([
                        'approved_quantity' => $approvedQuantity,
                        'final_stock' => (int) $item->initial_stock
                            + $approvedQuantity
                            - (int) $item->used_quantity
                            - (int) $item->damaged_quantity,
                        'status' => 1,
                    ]);
                }
            }

            if ($request->approval === 'Selesai') {
                $items = ListRequestOrder::where('request_order_id', $requestOrder->id)
                    ->with('centerStock:id,product_id,stock,serial_barcode')
                    ->lockForUpdate()
                    ->get();

                foreach ($items as $item) {
                    $approvedQuantity = (int) ($item->approved_quantity ?? 0);
                    $centerStock = CenterStock::whereKey($item->center_stock_id)->lockForUpdate()->firstOrFail();

                    if ((int) $centerStock->stock < $approvedQuantity) {
                        throw ValidationException::withMessages([
                            'approval' => 'Stok pusat tidak mencukupi untuk menyelesaikan permintaan.',
                        ]);
                    }

                    $this->reconcileBranchStock($item, (int) $requestOrder->branch_id, (int) $centerStock->product_id);
                    $centerStock->update(['stock' => (int) $centerStock->stock - $approvedQuantity]);

                    if ($approvedQuantity > 0) {
                        BranchProduct::create([
                            'branch_id' => $requestOrder->branch_id,
                            'product_id' => $centerStock->product_id,
                            'quantity' => $approvedQuantity,
                            'serial_barcode' => $item->serial_barcode,
                            'request_order_id' => $requestOrder->id,
                        ]);
                    }
                }
            }

            $requestOrder->update(['status' => $request->approval]);
            RequestOrderLog::create([
                'request_order_id' => $requestOrder->id,
                'user_id' => Auth::id(),
                'status' => $request->approval,
            ]);
        });

        $messages = [
            'Disetujui' => 'Permintaan pesanan berhasil disetujui.',
            'Pengiriman barang' => 'Permintaan pesanan telah dikirim.',
            'Tiba di lokasi' => 'Permintaan pesanan telah tiba di lokasi.',
            'Pengecekan barang' => 'Proses pengecekan barang.',
            'Selesai' => 'Permintaan pesanan telah selesai.',
        ];
        Session::flash('toast', ['message' => $messages[$request->approval]]);
        return back();
    }
}
