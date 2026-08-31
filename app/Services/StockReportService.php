<?php

namespace App\Services;

use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class StockReportService
{
    public function branchReport(Carbon $startDate, Carbon $endDate, ?int $branchId = null): Collection
    {
        return DB::table('list_request_orders')
            ->join('request_orders', 'request_orders.id', '=', 'list_request_orders.request_order_id')
            ->join('branches', 'branches.id', '=', 'request_orders.branch_id')
            ->join('center_stocks', 'center_stocks.id', '=', 'list_request_orders.center_stock_id')
            ->join('products', 'products.id', '=', 'center_stocks.product_id')
            ->leftJoin('product_categories', 'product_categories.id', '=', 'products.product_category_id')
            ->where('request_orders.status', 'Selesai')
            ->whereBetween('request_orders.date', [$startDate->toDateString(), $endDate->toDateString()])
            ->when($branchId, fn ($query) => $query->where('request_orders.branch_id', $branchId))
            ->orderBy('request_orders.date')
            ->orderBy('branches.branch_name')
            ->orderBy('products.product_name')
            ->select([
                'request_orders.date',
                'request_orders.ro_number',
                'branches.branch_name',
                'product_categories.product_category_name',
                'products.product_name',
                'list_request_orders.initial_stock',
                'list_request_orders.approved_quantity',
                'list_request_orders.used_quantity',
                'list_request_orders.damaged_quantity',
                'list_request_orders.final_stock',
            ])
            ->get()
            ->map(fn ($row) => [
                'date' => $row->date,
                'reference' => $row->ro_number,
                'branch' => $row->branch_name,
                'category' => $row->product_category_name ?? '-',
                'product' => $row->product_name,
                'initial_stock' => (int) $row->initial_stock,
                'additional_stock' => (int) ($row->approved_quantity ?? 0),
                'used_stock' => (int) $row->used_quantity,
                'damaged_stock' => (int) $row->damaged_quantity,
                'final_stock' => (int) $row->final_stock,
            ]);
    }

    public function centerReport(Carbon $startDate, Carbon $endDate): Collection
    {
        $openingStock = $this->centerStockAt($startDate->copy()->startOfDay(), true);
        $closingStock = $this->centerStockAt($endDate->copy()->endOfDay(), false);
        $purchases = $this->purchaseTotalsBetween($startDate, $endDate);

        return Product::query()
            ->select('id', 'product_category_id', 'product_name')
            ->with('productCategory:id,product_category_name')
            ->orderBy('product_name')
            ->get()
            ->map(fn (Product $product) => [
                'category' => $product->productCategory?->product_category_name ?? '-',
                'product' => $product->product_name,
                'initial_stock' => (int) ($openingStock[$product->id] ?? 0),
                'purchased_stock' => (int) ($purchases[$product->id] ?? 0),
                'final_stock' => (int) ($closingStock[$product->id] ?? 0),
            ]);
    }

    private function centerStockAt(Carbon $boundary, bool $includeBoundaryDay): Collection
    {
        $currentStock = DB::table('center_stocks')
            ->select('product_id', DB::raw('SUM(stock) as total'))
            ->groupBy('product_id')
            ->pluck('total', 'product_id');

        $futurePurchases = DB::table('list_inventory_purchases')
            ->join('inventory_purchases', 'inventory_purchases.id', '=', 'list_inventory_purchases.inventory_purchase_id')
            ->when(
                $includeBoundaryDay,
                fn ($query) => $query->whereDate('inventory_purchases.date', '>=', $boundary->toDateString()),
                fn ($query) => $query->whereDate('inventory_purchases.date', '>', $boundary->toDateString())
            )
            ->select('list_inventory_purchases.product_id', DB::raw('SUM(list_inventory_purchases.quantity) as total'))
            ->groupBy('list_inventory_purchases.product_id')
            ->pluck('total', 'product_id');

        $futureOutbound = $this->completedOrderMovementsAfter($boundary);
        $futureReturns = $this->completedReturnMovementsAfter($boundary);
        $productIds = $currentStock->keys()
            ->merge($futurePurchases->keys())
            ->merge($futureOutbound->keys())
            ->merge($futureReturns->keys())
            ->unique();

        return $productIds->mapWithKeys(fn ($productId) => [
            $productId => (int) ($currentStock[$productId] ?? 0)
                - (int) ($futurePurchases[$productId] ?? 0)
                + (int) ($futureOutbound[$productId] ?? 0)
                - (int) ($futureReturns[$productId] ?? 0),
        ]);
    }

    private function purchaseTotalsBetween(Carbon $startDate, Carbon $endDate): Collection
    {
        return DB::table('list_inventory_purchases')
            ->join('inventory_purchases', 'inventory_purchases.id', '=', 'list_inventory_purchases.inventory_purchase_id')
            ->whereBetween('inventory_purchases.date', [$startDate->toDateString(), $endDate->toDateString()])
            ->select('list_inventory_purchases.product_id', DB::raw('SUM(list_inventory_purchases.quantity) as total'))
            ->groupBy('list_inventory_purchases.product_id')
            ->pluck('total', 'product_id');
    }

    private function completedOrderMovementsAfter(Carbon $boundary): Collection
    {
        $completedOrders = DB::table('request_order_logs')
            ->where('status', 'Selesai')
            ->groupBy('request_order_id')
            ->select('request_order_id', DB::raw('MIN(created_at) as completed_at'));

        return DB::table('list_request_orders')
            ->join('center_stocks', 'center_stocks.id', '=', 'list_request_orders.center_stock_id')
            ->joinSub($completedOrders, 'completed_orders', fn ($join) => $join
                ->on('completed_orders.request_order_id', '=', 'list_request_orders.request_order_id'))
            ->where('completed_orders.completed_at', '>=', $boundary)
            ->select('center_stocks.product_id', DB::raw('SUM(list_request_orders.approved_quantity) as total'))
            ->groupBy('center_stocks.product_id')
            ->pluck('total', 'product_id');
    }

    private function completedReturnMovementsAfter(Carbon $boundary): Collection
    {
        $completedReturns = DB::table('request_return_logs')
            ->where('status', 'Selesai')
            ->groupBy('request_return_id')
            ->select('request_return_id', DB::raw('MIN(created_at) as completed_at'));

        return DB::table('list_request_returns')
            ->join('branch_products', 'branch_products.id', '=', 'list_request_returns.branch_product_id')
            ->joinSub($completedReturns, 'completed_returns', fn ($join) => $join
                ->on('completed_returns.request_return_id', '=', 'list_request_returns.request_return_id'))
            ->where('completed_returns.completed_at', '>=', $boundary)
            ->select('branch_products.product_id', DB::raw('SUM(list_request_returns.quantity) as total'))
            ->groupBy('branch_products.product_id')
            ->pluck('total', 'product_id');
    }
}
