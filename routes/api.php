<?php

use App\Http\Controllers\Api\ApiLocationController;
use App\Http\Controllers\Api\ApiPermintaanStokController;
use App\Http\Controllers\Api\Auth\ApiAuthController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\LocationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('login', [ApiAuthController::class, 'login']);
Route::post('logout', [ApiAuthController::class, 'logout'])->middleware('auth:sanctum');

Route::get('data-permintaan-stok/{user_id}', [ApiPermintaanStokController::class, 'index'])->middleware('auth:sanctum');
Route::post('data-permintaan-stok/update', [ApiPermintaanStokController::class, 'update'])->middleware('auth:sanctum');

Route::get('/locations', [ApiLocationController::class, 'index']);
Route::post('/locations', [ApiLocationController::class, 'store']);
Route::post('/attendance', [ApiLocationController::class, 'attendance']);
