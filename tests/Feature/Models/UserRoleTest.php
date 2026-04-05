<?php

use App\Models\User;
use App\UserRole;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('assigns student role by default', function () {
    $user = User::factory()->create();

    expect($user->role)->toBe(UserRole::Student);
});

it('can create admin user', function () {
    $user = User::factory()->admin()->create();

    expect($user->role)->toBe(UserRole::Admin)
        ->and($user->isAdmin())->toBeTrue();
});

it('can create lawyer user', function () {
    $user = User::factory()->lawyer()->create();

    expect($user->role)->toBe(UserRole::Lawyer)
        ->and($user->hasRole(UserRole::Lawyer))->toBeTrue();
});

it('can create researcher user', function () {
    $user = User::factory()->researcher()->create();

    expect($user->role)->toBe(UserRole::Researcher)
        ->and($user->hasRole(UserRole::Researcher))->toBeTrue();
});

it('casts role to UserRole enum', function () {
    $user = User::factory()->create(['role' => 'admin']);

    expect($user->role)->toBeInstanceOf(UserRole::class)
        ->and($user->role)->toBe(UserRole::Admin);
});

it('student is not admin', function () {
    $user = User::factory()->create();

    expect($user->isAdmin())->toBeFalse();
});
