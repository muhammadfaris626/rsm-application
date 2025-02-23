<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\RequestOrder;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ApiPermintaanStokController extends Controller
{
    public function index($user_id) {
        $checkUser = User::where('id', $user_id)->first();
        $employee = Employee::where('employee_number', $checkUser->username)->first();
        setlocale(LC_TIME, 'id_ID.utf8');
        $permintaanStok = RequestOrder::where('branch_id', $employee->branch_id)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'nomor_permintaan' => $item->ro_number,
                    'tanggal' => Carbon::parse($item->date)->translatedFormat('d F Y'),
                    'cabang' => $item->branch->branch_name,
                    'status' => $item->status
                ];
            });
        return response()->json([
            'data' => $permintaanStok,
            'total' => count($permintaanStok),
        ]);
    }
}
