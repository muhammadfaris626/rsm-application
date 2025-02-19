<?php

use App\Http\Controllers\Api\Auth\ApiAuthController;
use App\Http\Controllers\Api\NotificationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('testing', function() {
    return response()->json([
        'message' => 'Hello World123'
    ]);
});
// Route::post('authLogin', [ApiAuthController::class, 'authLogin']);
// Route::post('login', function() {
//     return response()->json([
//         'message' => 'Login Sukses 123'
//     ]);
// });
Route::post('login', [ApiAuthController::class, 'login']);
Route::post('logout', [ApiAuthController::class, 'logout'])->middleware('auth:sanctum');
