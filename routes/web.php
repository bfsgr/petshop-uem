<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\JobController;
use App\Http\Controllers\PetController;
use App\Http\Controllers\WorkerController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', fn () => redirect('/home'));

Route::get('/login', [AuthController::class, 'login'])->name('login');
Route::post('/login', [AuthController::class, 'authenticate']);
Route::get('/logout', [AuthController::class, 'logout']);
Route::get('/register', [AuthController::class, 'register'])->name('register');
Route::post('/register', [AuthController::class, 'store']);

Route::middleware(['auth'])->group(function () {
    Route::get('/home', [JobController::class, 'index'])->name('home');
    Route::get('/home/agendar', [JobController::class, 'form'])->name('job_form');
    Route::post('/home/agendar', [JobController::class, 'create'])->name('create_job');

    Route::get('/pets', [PetController::class, 'index'])->name('pets');
    Route::get('/pets/cadastro', [PetController::class, 'form'])->name('pets_form');
    Route::post('/pets/cadastro', [PetController::class, 'create'])->name('create_pet');

    Route::middleware(['can:edit-customers'])->group(function () {
        Route::get('/clientes', [CustomerController::class, 'index'])->name('customers');
        Route::get('/clientes/cadastro', [CustomerController::class, 'form'])->name('customer_form');
        Route::post('/clientes/cadastro', [CustomerController::class, 'create'])->name('create_customer');
        Route::get('/clientes/{id}', [CustomerController::class, 'edit_form'])->name('customer_edit_form');
        Route::post('/clientes/{id}', [CustomerController::class, 'update'])->name('update_customer');
    });

    Route::middleware(['can:edit-workers'])->group(function () {
        Route::get('/funcionarios', [WorkerController::class, 'index'])->name('workers');
        Route::post('/funcionarios', [WorkerController::class, 'create'])->name('create_worker');
        Route::post('/funcionarios/{id}', [WorkerController::class, 'update'])->name('update_worker');
    });
});

Route::post('/nova-senha', [AuthController::class, 'update_password'])
    ->middleware(['guest'])
    ->name('password.update');

Route::get('/configurar-senha/{token}', [AuthController::class, 'reset_password'])
    ->middleware(['guest'])
    ->name('password.reset');
