<?php

use App\Models\User;
use App\UserRole;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;

uses(RefreshDatabase::class);

beforeEach(function () {
    Route::middleware(['web', 'auth', 'role:admin'])
        ->get('/test-admin', fn () => response('admin-only'));

    Route::middleware(['web', 'auth', 'role:admin,lawyer'])
        ->get('/test-admin-lawyer', fn () => response('admin-or-lawyer'));
});

it('allows admin to access admin route', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->get('/test-admin')
        ->assertSuccessful();
});

it('denies student access to admin route', function () {
    $student = User::factory()->create();

    $this->actingAs($student)
        ->get('/test-admin')
        ->assertForbidden();
});

it('denies guests access to role-protected route', function () {
    $this->get('/test-admin')
        ->assertRedirect();
});

it('allows lawyer access to admin-or-lawyer route', function () {
    $lawyer = User::factory()->lawyer()->create();

    $this->actingAs($lawyer)
        ->get('/test-admin-lawyer')
        ->assertSuccessful();
});

it('denies researcher access to admin-or-lawyer route', function () {
    $researcher = User::factory()->researcher()->create();

    $this->actingAs($researcher)
        ->get('/test-admin-lawyer')
        ->assertForbidden();
});
