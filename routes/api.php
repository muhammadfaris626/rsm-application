<?php

use App\Http\Controllers\Api\ApiAttendanceController;
use App\Http\Controllers\Api\ApiDownloadFormatController;
use App\Http\Controllers\Api\ApiEmployeeAttendanceController;
use App\Http\Controllers\Api\ApiLocationController;
use App\Http\Controllers\Api\ApiMutationController;
use App\Http\Controllers\Api\ApiPermintaanStokController;
use App\Http\Controllers\Api\ApiTerminationController;
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
Route::post('/attendance', [ApiAttendanceController::class, 'attendance']);
// Employee Attendance
Route::get('/employee-attendances', [ApiEmployeeAttendanceController::class, 'index']);
Route::get('/employee-attendances/{id}', [ApiEmployeeAttendanceController::class, 'show']);
// Employee Mutation
Route::get('/employee-mutations', [ApiMutationController::class, 'index']);
// Employee Termination
Route::get('/employee-terminations', [ApiTerminationController::class, 'index']);

Route::get('/download-format-kategori-barang', [ApiDownloadFormatController::class, 'downloadFormatCategoryProduct']);
Route::get('/download-format-barang', [ApiDownloadFormatController::class, 'downloadFormatProduct']);
Route::get('/download-format-cabang', [ApiDownloadFormatController::class, 'downloadFormatBranch']);

Route::get('/notifications/count', [NotificationController::class, 'getNotificationCount']);
Route::post('/notifications/update', [NotificationController::class, 'updateNotificationStatus']);
