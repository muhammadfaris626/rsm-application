<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\RequestOrder;
use App\Models\RequestOrderLog;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
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
                    'status' => $item->status,
                    'list' => $item->listRequestOrder->map(function($listItem) {
                        return [
                            'id' => $listItem->id,
                            'barang' => $listItem->centerStock->product->product_name,
                            'jumlah' => $listItem->approved_quantity,
                            'barcode' => $listItem->serial_barcode,
                            'status' => false
                        ];
                    })
                ];
            });
        return response()->json([
            'data' => $permintaanStok,
            'total' => count($permintaanStok),
        ]);
    }

    public function update(Request $request) {
        $order_id = $request->order_id;
        $user_id = $request->user_id;
        $status = $request->status;

        // Cek apakah ada field yang kosong
        if (!$order_id || !$user_id || !$status) {
            return response()->json([
                'success' => false,
                'message' => 'Semua field harus diisi!'
            ], 400);
        }

        // Simpan data ke database
        RequestOrderLog::create([
            'request_order_id' => $order_id,
            'user_id' => $user_id,
            'status' => $status
        ]);
        // $check = RequestOrder::where('id', $order_id)->first();
        // $check->update([
        //     'status' => $status
        // ]);

        return response()->json([
            'success' => true,
            'message' => 'Data berhasil disimpan!'
        ], 200);
    }
}
