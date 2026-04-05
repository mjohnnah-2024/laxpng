<?php

use App\Models\SearchLog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('shows search logs to admin', function () {
    $admin = User::factory()->admin()->create();
    SearchLog::factory(5)->create();

    $response = $this->actingAs($admin)->get(route('admin.search-logs.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/search-logs/index')
        ->has('logs.data', 5)
    );
});

it('filters search logs by query', function () {
    $admin = User::factory()->admin()->create();
    SearchLog::factory()->create(['query' => 'criminal law in PNG']);
    SearchLog::factory()->create(['query' => 'land disputes resolution']);

    $response = $this->actingAs($admin)->get(route('admin.search-logs.index', ['search' => 'criminal']));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('logs.data', 1)
    );
});

it('loads user relationship for search logs', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->create(['name' => 'Test User']);
    SearchLog::factory()->create(['user_id' => $user->id]);

    $response = $this->actingAs($admin)->get(route('admin.search-logs.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('logs.data', 1)
        ->where('logs.data.0.user.name', 'Test User')
    );
});

it('denies search logs to non-admin', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('admin.search-logs.index'));

    $response->assertForbidden();
});
