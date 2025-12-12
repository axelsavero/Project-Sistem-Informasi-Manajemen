<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ComplaintController;
use App\Http\Middleware\AdminOnly;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public complaint routes
Route::post('/complaints', [ComplaintController::class, 'store']);
Route::get('/complaints/ticket/{ticketNumber}', [ComplaintController::class, 'findByTicket']);

// Protected routes (requires authentication)
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Admin-only routes
    Route::middleware(AdminOnly::class)->group(function () {
        Route::get('/complaints', [ComplaintController::class, 'index']);
        Route::get('/complaints/{id}', [ComplaintController::class, 'show']);
        Route::put('/complaints/{id}', [ComplaintController::class, 'update']);
        Route::delete('/complaints/{id}', [ComplaintController::class, 'destroy']);
        Route::get('/complaints-stats', [ComplaintController::class, 'stats']);
    });
});
