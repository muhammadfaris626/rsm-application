<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('list_request_orders')
            ->select('id', 'initial_stock', 'used_quantity', 'damaged_quantity')
            ->orderBy('id')
            ->chunkById(500, function ($items): void {
                foreach ($items as $item) {
                    DB::table('list_request_orders')
                        ->where('id', $item->id)
                        ->update([
                            'initial_stock' => (int) $item->initial_stock
                                + (int) $item->used_quantity
                                + (int) $item->damaged_quantity,
                        ]);
                }
            });
    }

    public function down(): void
    {
        DB::table('list_request_orders')
            ->select('id', 'initial_stock', 'used_quantity', 'damaged_quantity')
            ->orderBy('id')
            ->chunkById(500, function ($items): void {
                foreach ($items as $item) {
                    DB::table('list_request_orders')
                        ->where('id', $item->id)
                        ->update([
                            'initial_stock' => max(
                                0,
                                (int) $item->initial_stock
                                    - (int) $item->used_quantity
                                    - (int) $item->damaged_quantity
                            ),
                        ]);
                }
            });
    }
};
