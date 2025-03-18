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
        Schema::create('update_operational_branch_histories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('op_branch_id');
            $table->foreign('op_branch_id', 'fk_op_branch_id')->references('id')->on('operational_branches')->onUpdate('cascade');
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id', 'fk_branch_user_id')->references('id')->on('users')->onUpdate('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('update_operational_branch_histories');
    }
};
