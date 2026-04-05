<?php

use App\Models\ContractAnalysis;
use App\Models\LegalDocument;
use App\Models\LegalTemplate;
use App\Models\SearchLog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('shows admin dashboard with stats', function () {
    $admin = User::factory()->admin()->create();
    User::factory(2)->create();
    LegalDocument::factory(3)->create();
    LegalTemplate::factory(2)->create();
    SearchLog::factory(5)->for($admin)->create();

    $response = $this->actingAs($admin)->get(route('admin.dashboard'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/dashboard')
        ->has('stats')
        ->where('stats.users', 3)
        ->where('stats.documents', 3)
        ->where('stats.templates', 2)
        ->where('stats.searches', 5)
        ->has('recentDocuments')
        ->has('recentSearches')
    );
});

it('denies dashboard to non-admin users', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('admin.dashboard'));

    $response->assertForbidden();
});

it('denies dashboard to guests', function () {
    $response = $this->get(route('admin.dashboard'));

    $response->assertRedirect(route('login'));
});
