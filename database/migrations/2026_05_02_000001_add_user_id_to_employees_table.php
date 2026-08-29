<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->foreignId('user_id')
                ->nullable()
                ->after('employee_number')
                ->unique()
                ->constrained('users')
                ->nullOnDelete();
        });

        DB::table('employees')
            ->whereNull('user_id')
            ->select('id', 'employee_number')
            ->orderBy('id')
            ->each(function ($employee): void {
                $userId = DB::table('users')
                    ->where('username', $employee->employee_number)
                    ->value('id');

                if ($userId) {
                    DB::table('employees')
                        ->where('id', $employee->id)
                        ->update(['user_id' => $userId]);
                }
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->dropConstrainedForeignId('user_id');
        });
    }
};
