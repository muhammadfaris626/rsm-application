<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RequestOrder;
use App\Models\RequestReturn;
use Illuminate\Support\Facades\Cache;

class NotificationController extends Controller
{
    public function getNotificationCount() {
        // Cache jumlah notifikasi selama 1 menit untuk mengurangi query database
        return Cache::remember('notification_count', 60, function () {
            $orderCount = RequestOrder::whereIn('status', ['Sedang diverifikasi', 'Disetujui'])->count();
            $returnCount = RequestReturn::whereIn('status', ['Pengiriman barang', 'Tiba di lokasi', 'Pengecekan barang'])->count();

            return response()->json([
                'order_count' => $orderCount,
                'return_count' => $returnCount
            ]);
        });
    }

    public function updateNotificationStatus() {
        // Hapus cache supaya jumlah notifikasi diperbarui
        Cache::forget('notification_count');

        return response()->json(['message' => 'Notifikasi diperbarui']);
    }
}
