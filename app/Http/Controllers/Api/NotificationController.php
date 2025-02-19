<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RequestOrder;
use App\Models\RequestReturn; // Pastikan Anda memiliki model RequestReturn
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function getNotificationCount(Request $request) {
        $role = Auth::user()->roles[0]['name'];

        if (in_array($role, ['root', 'admin-pusat'])) {
            $orderCount = RequestOrder::where('status', 'Sedang diverifikasi')
                ->orWhere('status', 'Disetujui')
                ->count();
            $returnCount = RequestReturn::where('status', 'Pengiriman barang')
                ->orWhere('status', 'Tiba di lokasi')
                ->orWhere('status', 'Pengecekan barang')
                ->count();
        } else {
            $orderCount = RequestOrder::where('status', 'Tiba di lokasi')
                ->orWhere('status', 'Pengecekan barang')
                ->orWhere('status', 'Pengiriman barang')
                ->count();
            $returnCount = RequestReturn::where('status', 'Sedang diverifikasi')
                ->orWhere('status', 'Tiba di lokasi')
                ->orWhere('status', 'Pengecekan barang')
                ->count();
        }

        return response()->json([
            'order_count' => $orderCount,
            'return_count' => $returnCount
        ]);
    }
}
