<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\RequestOrder;
use App\Models\RequestOrderLog;
use App\Models\User;
use App\Traits\OptimizedQueries;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ApiPermintaanStokController extends Controller
{
    use OptimizedQueries;

    public function index($user_id) {
        // Cache user lookup
        $checkUser = Cache::remember("user_{$user_id}", 300, function() use ($user_id) {
            return User::select('id', 'username')->where('id', $user_id)->first();
        });
        
        if (!$checkUser) {
            return response()->json(['data' => [], 'total' => 0]);
        }
        
        // Cache employee lookup
        $employee = $this->getCachedEmployee($checkUser->username, true);
        
        if (!$employee) {
            return response()->json(['data' => [], 'total' => 0]);
        }
        
        setlocale(LC_TIME, 'id_ID.utf8');
        
        // Optimized query with eager loading
        $permintaanStok = RequestOrder::query()
            ->select('id', 'ro_number', 'date', 'branch_id', 'status')
            ->with([
                'branch:id,branch_name',
                'listRequestOrder:id,request_order_id,center_stock_id,approved_quantity,serial_barcode',
                'listRequestOrder.centerStock:id,product_id',
                'listRequestOrder.centerStock.product:id,product_name'
            ])
            ->where('branch_id', $employee->branch_id)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'nomor_permintaan' => $item->ro_number,
                    'tanggal' => Carbon::parse($item->date)->translatedFormat('d F Y'),
                    'cabang' => $item->branch->branch_name ?? 'N/A',
                    'status' => $item->status,
                    'list' => $item->listRequestOrder->map(function($listItem) {
                        return [
                            'id' => $listItem->id,
                            'barang' => $listItem->centerStock?->product?->product_name ?? 'N/A',
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
        
        // Use single update query
        RequestOrder::where('id', $order_id)->update(['status' => $status]);

        return response()->json([
            'success' => true,
            'message' => 'Data berhasil disimpan!'
        ], 200);
    }
}
