<?php

use App\Http\Controllers\Api\ApiPermintaanStokController;
use App\Http\Controllers\Api\Auth\ApiAuthController;
use App\Http\Controllers\Api\NotificationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('login', [ApiAuthController::class, 'login']);
Route::post('logout', [ApiAuthController::class, 'logout'])->middleware('auth:sanctum');

Route::get('data-permintaan-stok/{user_id}', [ApiPermintaanStokController::class, 'index'])->middleware('auth:sanctum');
