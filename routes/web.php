<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\DocumentController;
use App\Http\Controllers\Admin\SearchLogController;
use App\Http\Controllers\Admin\TemplateController as AdminTemplateController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\ContractAnalysisController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ResearchController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\TemplateController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::get('search', [SearchController::class, 'index'])->name('search.index');
    Route::post('search', [SearchController::class, 'query'])->name('search.query');
    Route::post('search/stream', [SearchController::class, 'stream'])->name('search.stream');
    Route::get('search/history', [SearchController::class, 'history'])->name('search.history');

    Route::get('chat', [ChatController::class, 'index'])->name('chat.index');
    Route::get('chat/new', [ChatController::class, 'create'])->name('chat.create');
    Route::get('chat/{conversationId}', [ChatController::class, 'show'])->name('chat.show');
    Route::post('chat/send', [ChatController::class, 'send'])->name('chat.send');
    Route::delete('chat/{conversationId}', [ChatController::class, 'destroy'])->name('chat.destroy');

    Route::get('research', [ResearchController::class, 'index'])->name('research.index');
    Route::get('research/search', [ResearchController::class, 'search'])->name('research.search');
    Route::get('research/{document}', [ResearchController::class, 'show'])->name('research.show');

    Route::get('templates', [TemplateController::class, 'index'])->name('templates.index');
    Route::get('templates/{template}', [TemplateController::class, 'show'])->name('templates.show');
    Route::post('templates/{template}/generate', [TemplateController::class, 'generate'])->name('templates.generate');

    Route::get('contracts', [ContractAnalysisController::class, 'index'])->name('contracts.index');
    Route::get('contracts/create', [ContractAnalysisController::class, 'create'])->name('contracts.create');
    Route::post('contracts', [ContractAnalysisController::class, 'store'])->name('contracts.store');
    Route::get('contracts/{analysis}', [ContractAnalysisController::class, 'show'])->name('contracts.show');
});

Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', AdminDashboardController::class)->name('dashboard');

    Route::get('documents', [DocumentController::class, 'index'])->name('documents.index');
    Route::get('documents/create', [DocumentController::class, 'create'])->name('documents.create');
    Route::post('documents', [DocumentController::class, 'store'])->name('documents.store');
    Route::get('documents/{document}', [DocumentController::class, 'show'])->name('documents.show');
    Route::delete('documents/{document}', [DocumentController::class, 'destroy'])->name('documents.destroy');
    Route::post('documents/{document}/reprocess', [DocumentController::class, 'reprocess'])->name('documents.reprocess');

    Route::get('users', [AdminUserController::class, 'index'])->name('users.index');
    Route::get('users/{user}', [AdminUserController::class, 'show'])->name('users.show');
    Route::patch('users/{user}/role', [AdminUserController::class, 'updateRole'])->name('users.update-role');

    Route::get('templates', [AdminTemplateController::class, 'index'])->name('templates.index');
    Route::get('templates/create', [AdminTemplateController::class, 'create'])->name('templates.create');
    Route::post('templates', [AdminTemplateController::class, 'store'])->name('templates.store');
    Route::get('templates/{template}/edit', [AdminTemplateController::class, 'edit'])->name('templates.edit');
    Route::put('templates/{template}', [AdminTemplateController::class, 'update'])->name('templates.update');
    Route::delete('templates/{template}', [AdminTemplateController::class, 'destroy'])->name('templates.destroy');

    Route::get('search-logs', [SearchLogController::class, 'index'])->name('search-logs.index');
});

require __DIR__.'/settings.php';
