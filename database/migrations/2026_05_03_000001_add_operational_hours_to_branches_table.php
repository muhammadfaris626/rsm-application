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
        Schema::table('branches', function (Blueprint $table) {
            $table->time('open_time')->nullable()->after('status');
            $table->time('close_time')->nullable()->after('open_time');
            $table->unsignedInteger('late_tolerance_minutes')->default(0)->after('close_time');
        });

        Schema::table('attendances', function (Blueprint $table) {
            $table->unsignedInteger('late_minutes')->default(0)->after('check_in');
            $table->string('attendance_status')->nullable()->after('late_minutes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->dropColumn(['late_minutes', 'attendance_status']);
        });

        Schema::table('branches', function (Blueprint $table) {
            $table->dropColumn(['open_time', 'close_time', 'late_tolerance_minutes']);
        });
    }
};
