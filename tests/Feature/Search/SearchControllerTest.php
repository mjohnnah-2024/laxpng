<?php

use App\Ai\Agents\LegalResearchAgent;
use App\Models\SearchLog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('shows the search page to authenticated users', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('search.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('search/index'));
});

it('redirects guests to login', function () {
    $response = $this->get(route('search.index'));

    $response->assertRedirect(route('login'));
});

it('performs a search query and returns an answer', function () {
    LegalResearchAgent::fake(['The Criminal Code Act 1974 states that...']);

    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('search.query'), [
        'query' => 'What is the penalty for theft in PNG?',
    ]);

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('search/index')
        ->where('query', 'What is the penalty for theft in PNG?')
        ->has('answer')
    );

    LegalResearchAgent::assertPrompted(fn ($prompt) => $prompt->contains('theft'));
});

it('logs search queries', function () {
    LegalResearchAgent::fake(['Answer text']);

    $user = User::factory()->create();

    $this->actingAs($user)->post(route('search.query'), [
        'query' => 'customary land rights',
    ]);

    expect(SearchLog::count())->toBe(1);

    $log = SearchLog::first();
    expect($log->user_id)->toBe($user->id)
        ->and($log->query)->toBe('customary land rights')
        ->and($log->response_time_ms)->toBeGreaterThanOrEqual(0);
});

it('validates the search query is required', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('search.query'), [
        'query' => '',
    ]);

    $response->assertSessionHasErrors(['query']);
});

it('validates the search query minimum length', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('search.query'), [
        'query' => 'ab',
    ]);

    $response->assertSessionHasErrors(['query']);
});

it('validates the search query maximum length', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('search.query'), [
        'query' => str_repeat('a', 1001),
    ]);

    $response->assertSessionHasErrors(['query']);
});

it('shows search history for the authenticated user', function () {
    $user = User::factory()->create();
    SearchLog::factory(5)->create(['user_id' => $user->id]);

    // Another user's logs should not appear
    SearchLog::factory(3)->create();

    $response = $this->actingAs($user)->get(route('search.history'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('search/history')
        ->has('logs.data', 5)
    );
});
