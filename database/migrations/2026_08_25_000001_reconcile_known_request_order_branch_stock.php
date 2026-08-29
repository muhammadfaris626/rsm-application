<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::transaction(function (): void {
            $item = DB::table('list_request_orders as items')
                ->join('request_orders as orders', 'orders.id', '=', 'items.request_order_id')
                ->join('center_stocks as center', 'center.id', '=', 'items.center_stock_id')
                ->where('orders.ro_number', 'RO-RSM-08242026-0008')
                ->where('orders.status', 'Selesai')
                ->select(
                    'orders.branch_id',
                    'center.product_id',
                    'items.final_stock'
                )
                ->first();

            if (!$item || (int) $item->final_stock !== 20) {
                return;
            }

            $stocks = DB::table('branch_products')
                ->where('branch_id', $item->branch_id)
                ->where('product_id', $item->product_id)
                ->orderBy('id')
                ->lockForUpdate()
                ->get(['id', 'quantity']);
            $currentStock = (int) $stocks->sum(fn ($stock) => (int) $stock->quantity);

            if ($currentStock === 20) {
                return;
            }

            // Only repair the exact known snapshot. A changed stock must be audited manually.
            if ($currentStock !== 65) {
                return;
            }

            $quantityToRemove = $currentStock - 20;
            foreach ($stocks as $stock) {
                if ($quantityToRemove <= 0) {
                    break;
                }

                $quantity = (int) $stock->quantity;
                $deducted = min($quantity, $quantityToRemove);
                DB::table('branch_products')
                    ->where('id', $stock->id)
                    ->update(['quantity' => $quantity - $deducted]);
                $quantityToRemove -= $deducted;
            }
        });
    }

    public function down(): void
    {
        // Historical stock reconciliation is intentionally not reversible.
    }
};
