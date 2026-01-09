<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Employee;
use App\Models\User;
use App\Traits\OptimizedQueries;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ApiAttendanceController extends Controller
{
    use OptimizedQueries;

    public function attendance(Request $request) {
        // Cache user lookup
        $user = Cache::remember("user_{$request->user_id}", 300, function() use ($request) {
            return User::select('id', 'username')->where('id', $request->user_id)->first();
        });
        
        if (!$user) {
            return response()->json(['message' => 'User tidak ditemukan.']);
        }
        
        // Use cached employee
        $employee = $this->getCachedEmployee($user->username, true);
        
        if (!$employee) {
            return response()->json(['message' => 'Karyawan tidak ditemukan.']);
        }

        $timestamp = strtotime($request->attendance);
        $date = date('Y-m-d', $timestamp);
        $hour = date("H", $timestamp);

        // Cek apakah user sudah absen hari ini
        $attendance = Attendance::where('employee_id', $employee->id)
            ->where('work_date', $date)
            ->first();

        // Tidak bisa absen antara jam 00:00 - 04:59
        if ($hour >= 0 && $hour < 5) {
            return response()->json([
                'message' => 'Tidak bisa absen saat ini. Silakan tunggu hingga jam 05:00.'
            ]);
        }

        // Jika belum ada absen sama sekali, maka ini dianggap absen masuk
        if (!$attendance) {
            $path = $request->file('photo')->store('check_in', 'public');
            Attendance::create([
                'employee_id' => $employee->id,
                'work_date' => $date,
                'check_in' => $request->attendance,
                'check_in_photo' => $path
            ]);

            return response()->json([
                'message' => 'Berhasil absen masuk.',
                'status' => 'check-in'
            ]);
        }

        // Jika sudah ada absen masuk, berarti ini adalah absen keluar
        if ($attendance && $attendance->check_out === null) {
            $path = $request->file('photo')->store('check_out', 'public');
            $attendance->update([
                'check_out' => $request->attendance,
                'check_out_photo' => $path
            ]);

            return response()->json([
                'message' => 'Berhasil absen keluar.',
                'status' => 'check-out'
            ]);
        }

        // Jika sudah absen masuk dan keluar, tidak bisa absen lagi
        return response()->json([
            'message' => 'Hari ini sudah absen lengkap, tidak bisa absen lagi.',
            'status' => 'completed'
        ]);
    }
}
