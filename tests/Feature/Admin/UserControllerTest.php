<?php

use App\Models\User;
use App\UserRole;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('shows user list to admin', function () {
    $admin = User::factory()->admin()->create();
    User::factory(5)->create();

    $response = $this->actingAs($admin)->get(route('admin.users.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/users/index')
        ->has('users.data', 6)
        ->has('roles')
    );
});

it('filters users by role', function () {
    $admin = User::factory()->admin()->create();
    User::factory(3)->lawyer()->create();
    User::factory(2)->create();

    $response = $this->actingAs($admin)->get(route('admin.users.index', ['role' => 'lawyer']));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/users/index')
        ->has('users.data', 3)
    );
});

it('searches users by name', function () {
    $admin = User::factory()->admin()->create();
    User::factory()->create(['name' => 'John Smith']);
    User::factory()->create(['name' => 'Jane Doe']);

    $response = $this->actingAs($admin)->get(route('admin.users.index', ['search' => 'John']));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/users/index')
        ->has('users.data', 1)
    );
});

it('shows a single user', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->create();

    $response = $this->actingAs($admin)->get(route('admin.users.show', $user));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/users/show')
        ->has('user')
        ->has('roles')
    );
});

it('updates a user role', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->create();

    $response = $this->actingAs($admin)->patch(route('admin.users.update-role', $user), [
        'role' => 'lawyer',
    ]);

    $response->assertRedirect();
    expect($user->fresh()->role)->toBe(UserRole::Lawyer);
});

it('validates role on update', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->create();

    $response = $this->actingAs($admin)->patch(route('admin.users.update-role', $user), [
        'role' => 'invalid',
    ]);

    $response->assertSessionHasErrors(['role']);
});

it('denies user management to non-admin', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('admin.users.index'));

    $response->assertForbidden();
});
