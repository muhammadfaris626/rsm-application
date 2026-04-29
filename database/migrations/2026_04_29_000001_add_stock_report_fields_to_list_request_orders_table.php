<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('list_request_orders', function (Blueprint $table) {
            $table->string('initial_stock')->default('0')->after('quantity');
            $table->string('used_quantity')->default('0')->after('initial_stock');
            $table->string('damaged_quantity')->default('0')->after('used_quantity');
            $table->string('final_stock')->default('0')->after('damaged_quantity');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('list_request_orders', function (Blueprint $table) {
            $table->dropColumn([
                'initial_stock',
                'used_quantity',
                'damaged_quantity',
                'final_stock',
            ]);
        });
    }
};
