<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Employee;
use App\Models\User;
use App\Traits\OptimizedQueries;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ApiAttendanceController extends Controller
{
    use OptimizedQueries;

    private function attendanceStatus(Employee $employee, string $attendanceDateTime): array
    {
        $employee->loadMissing('branch:id,open_time,late_tolerance_minutes');
        $branch = $employee->branch;

        if (!$branch?->open_time) {
            return [
                'late_minutes' => 0,
                'attendance_status' => 'Tepat waktu',
            ];
        }

        $checkIn = Carbon::parse($attendanceDateTime);
        $limit = Carbon::parse($checkIn->toDateString() . ' ' . $branch->open_time)
            ->addMinutes((int) $branch->late_tolerance_minutes);
        $lateMinutes = $checkIn->greaterThan($limit) ? (int) $limit->diffInMinutes($checkIn) : 0;

        return [
            'late_minutes' => $lateMinutes,
            'attendance_status' => $lateMinutes > 0 ? 'Terlambat' : 'Tepat waktu',
        ];
    }

    private function checkoutStatus(Employee $employee, string $attendanceDateTime): array
    {
        $employee->loadMissing('branch:id,close_time');
        $branch = $employee->branch;

        if (!$branch?->close_time) {
            return [
                'early_leave_minutes' => 0,
                'checkout_status' => 'Sesuai jam',
            ];
        }

        $checkOut = Carbon::parse($attendanceDateTime);
        $limit = Carbon::parse($checkOut->toDateString() . ' ' . $branch->close_time);
        $earlyLeaveMinutes = $checkOut->lessThan($limit) ? (int) $checkOut->diffInMinutes($limit) : 0;

        return [
            'early_leave_minutes' => $earlyLeaveMinutes,
            'checkout_status' => $earlyLeaveMinutes > 0 ? 'Pulang cepat' : 'Sesuai jam',
        ];
    }

    public function attendance(Request $request) {
        $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'attendance' => ['required', 'date'],
            'photo' => ['required', 'image', 'mimes:jpg,jpeg,png', 'max:512'],
            'attendance_note' => ['nullable', 'string'],
        ], [
            'photo.required' => 'Foto absensi wajib diisi.',
            'photo.image' => 'File absensi harus berupa gambar.',
            'photo.mimes' => 'Foto absensi harus berformat JPG, JPEG, atau PNG.',
            'photo.max' => 'Ukuran foto absensi maksimal 512 KB.',
        ]);

        // Cache user lookup
        $user = Cache::remember("user_{$request->user_id}", 300, function() use ($request) {
            return User::select('id', 'username')->where('id', $request->user_id)->first();
        });
        
        if (!$user) {
            return response()->json(['message' => 'User tidak ditemukan.']);
        }
        
        // Use cached employee
        $employee = $this->getCachedEmployeeByUser($user, true);
        
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
            $attendanceStatus = $this->attendanceStatus($employee, $request->attendance);

            if ($attendanceStatus['late_minutes'] > 0 && !$request->filled('attendance_note')) {
                return response()->json([
                    'message' => 'Keterangan terlambat wajib diisi.',
                    'errors' => [
                        'attendance_note' => ['Keterangan terlambat wajib diisi.'],
                    ],
                ], 422);
            }

            Attendance::create([
                'employee_id' => $employee->id,
                'work_date' => $date,
                'attendance_type' => 'Hadir',
                'check_in' => $request->attendance,
                'check_in_photo' => $path,
                'late_minutes' => $attendanceStatus['late_minutes'],
                'attendance_status' => $attendanceStatus['attendance_status'],
                'attendance_note' => $request->attendance_note,
            ]);

            return response()->json([
                'message' => $attendanceStatus['late_minutes'] > 0
                    ? "Berhasil absen masuk. Anda terlambat {$attendanceStatus['late_minutes']} menit."
                    : 'Berhasil absen masuk.',
                'status' => 'check-in'
            ]);
        }

        if (in_array($attendance->attendance_type, ['Sakit', 'Izin'])) {
            return response()->json([
                'message' => 'Hari ini sudah tercatat sebagai ' . strtolower($attendance->attendance_type) . '.',
                'status' => 'completed',
            ]);
        }

        // Jika sudah ada absen masuk, berarti ini adalah absen keluar
        if ($attendance && $attendance->check_in !== null && $attendance->check_out === null) {
            $path = $request->file('photo')->store('check_out', 'public');
            $checkoutStatus = $this->checkoutStatus($employee, $request->attendance);
            $attendance->update([
                'check_out' => $request->attendance,
                'check_out_photo' => $path,
            ]);

            return response()->json([
                'message' => $checkoutStatus['early_leave_minutes'] > 0
                    ? "Berhasil absen keluar. Anda pulang cepat {$checkoutStatus['early_leave_minutes']} menit."
                    : 'Berhasil absen keluar.',
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
