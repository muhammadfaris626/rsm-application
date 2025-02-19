<?php

use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\ApprovalTypeController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\BranchProductController;
use App\Http\Controllers\CenterProductController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\ExpenditureController;
use App\Http\Controllers\InventoryPurchaseController;
use App\Http\Controllers\ManagementStructureController;
use App\Http\Controllers\OperationalBranchController;
use App\Http\Controllers\OperationalCenterController;
use App\Http\Controllers\PerformanceController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\ProductCategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportBranchController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\RequestOrderController;
use App\Http\Controllers\RequestReturnController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\UserController;

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('home');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::prefix('/products')->group(function() {
        Route::resource('/sales', SaleController::class);
        Route::resource('/inventoryPurchases', InventoryPurchaseController::class);
        Route::get('/printBarcode', [InventoryPurchaseController::class, 'printBarcode'])->name('printBarcode');
        Route::resource('/requestOrders', RequestOrderController::class);
        Route::put('/approval/{id}', [RequestOrderController::class, 'approval'])->name('approval');
        Route::resource('/requestReturns', RequestReturnController::class);
        Route::put('/approvalReturn/{id}', [RequestReturnController::class, 'approvalReturn'])->name('approvalReturn');
        Route::resource('/branchProducts', BranchProductController::class);
        Route::resource('/centerProducts', CenterProductController::class);
    });
    Route::prefix('/operational')->group(function() {
        Route::resource('/operationalCenters', OperationalCenterController::class);
        Route::resource('/operationalBranches', OperationalBranchController::class);
    });
    Route::prefix('/management')->group(function() {
        Route::resource('/reports', ReportController::class);
        Route::resource('/reportBranches', ReportBranchController::class);
        Route::get('/cetak', [ReportController::class, 'cetak'])->name('cetak');
        Route::get('/export', [ReportController::class, 'export'])->name('export');
        Route::get('/exportBranch', [ReportBranchController::class, 'export'])->name('exportBranch');
        Route::resource('/managementStructures', ManagementStructureController::class);
    });
    Route::prefix('/employee')->group(function() {
        Route::resource('/performances', PerformanceController::class);
    });
    Route::prefix('/database')->group(function() {
        Route::resource('/branches', BranchController::class);
        Route::resource('/employees', EmployeeController::class);
        Route::resource('/productCategories', ProductCategoryController::class);
        Route::resource('/products', ProductController::class);
        Route::resource('/expenditures', ExpenditureController::class);
        Route::resource('/positions', PositionController::class);
        Route::resource('/suppliers', SupplierController::class);
    });
    Route::prefix('/settings')->group(function() {
        Route::resource('/users', UserController::class);
        Route::resource('/roles', RoleController::class);
        Route::post('/roles/role/{role_id}/permission/{permission_id}', [RoleController::class, 'updateRolePermission'])->name('updateRolePermission');
        Route::resource('/permissions', PermissionController::class);
        Route::resource('/approvalTypes', ApprovalTypeController::class);
    });

    Route::get('/notifications/count', [NotificationController::class, 'getNotificationCount'])->name('notification');
});

Route::get('/profile', [ProfileController::class, 'edit'])->middleware(['auth', 'verified'])->name('profile.edit');
Route::patch('/profile', [ProfileController::class, 'update'])->middleware(['auth', 'verified'])->name('profile.update');
Route::delete('/profile', [ProfileController::class, 'destroy'])->middleware(['auth', 'verified'])->name('profile.destroy');

require __DIR__.'/auth.php';
