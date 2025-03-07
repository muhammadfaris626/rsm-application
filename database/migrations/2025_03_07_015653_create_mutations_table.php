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
        Schema::create('mutations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('employee_id');
            $table->foreign('employee_id')->references('id')->on('employees')->onUpdate('cascade');
            $table->unsignedBigInteger('from_branch_id');
            $table->foreign('from_branch_id')->references('id')->on('branches')->onUpdate('cascade');
            $table->unsignedBigInteger('to_branch_id');
            $table->foreign('to_branch_id')->references('id')->on('branches')->onUpdate('cascade');
            $table->date('transfer_date');
            $table->text('reason');
            $table->unsignedBigInteger('approved_by')->nullable();
            $table->foreign('approved_by')->references('id')->on('employees')->onUpdate('cascade');
            $table->string('status')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mutations');
    }
};
