<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard')->can('view_dashboard');

    Route::prefix('admin')->name('admin.')->group(function () {
        Route::prefix('users')->name('users.')->group(function () {
            Route::get('/', [UserController::class, 'index'])->name('index')->can('view_users');
            Route::get('/create', [UserController::class, 'create'])->name('create')->can('store_user');
            Route::post('/', [UserController::class, 'store'])->name('store')->can('store_user');
            Route::get('/{user}', [UserController::class, 'show'])->name('show')->can('view_users');
            Route::get('/{user}/edit', [UserController::class, 'edit'])->name('edit')->can('update_user');
            Route::put('/{user}', [UserController::class, 'update'])->name('update')->can('update_user');
            Route::delete('/{user}', [UserController::class, 'destroy'])->name('destroy')->can('delete_user');
        });
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
