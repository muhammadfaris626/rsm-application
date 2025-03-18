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
        Schema::create('list_request_returns', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('request_return_id');
            $table->foreign('request_return_id')->references('id')->on('request_returns')->onUpdate('cascade');
            $table->unsignedBigInteger('branch_product_id');
            $table->foreign('branch_product_id')->references('id')->on('branch_products')->onUpdate('cascade');
            $table->string('quantity');
            $table->string('serial_barcode');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('list_request_returns');
    }
};
