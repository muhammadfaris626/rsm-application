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
        Schema::create('list_request_orders', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('request_order_id');
            $table->foreign('request_order_id')->references('id')->on('request_orders')->onUpdate('cascade');
            $table->unsignedBigInteger('center_stock_id');
            $table->foreign('center_stock_id')->references('id')->on('center_stocks')->onUpdate('cascade');
            $table->string('quantity');
            $table->string('approved_quantity')->nullable();
            $table->string('serial_barcode');
            $table->integer('status')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('list_request_orders');
    }
};
