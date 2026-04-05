<?php

use App\Ai\Agents\ContractAnalysisAgent;
use App\Models\ContractAnalysis;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

// ── Index ────────────────────────────────────────────────────────

it('shows the contracts index to authenticated users', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('contracts.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('contracts/index'));
});

it('redirects guests from contracts index to login', function () {
    $this->get(route('contracts.index'))->assertRedirect(route('login'));
});

it('only shows own analyses on the index', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();

    ContractAnalysis::factory()->for($user)->create(['document_name' => 'my-contract.pdf']);
    ContractAnalysis::factory()->for($otherUser)->create(['document_name' => 'other-contract.pdf']);

    $response = $this->actingAs($user)->get(route('contracts.index'));

    $response->assertInertia(fn ($page) => $page
        ->has('analyses.data', 1)
        ->where('analyses.data.0.document_name', 'my-contract.pdf')
    );
});

it('paginates analyses on the index', function () {
    $user = User::factory()->create();

    ContractAnalysis::factory()->for($user)->count(20)->create();

    $response = $this->actingAs($user)->get(route('contracts.index'));

    $response->assertInertia(fn ($page) => $page
        ->has('analyses.data', 15)
        ->where('analyses.last_page', 2)
    );
});

// ── Create ───────────────────────────────────────────────────────

it('shows the upload form to authenticated users', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('contracts.create'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('contracts/create'));
});

it('redirects guests from create to login', function () {
    $this->get(route('contracts.create'))->assertRedirect(route('login'));
});

// ── Store ────────────────────────────────────────────────────────

it('validates that a document is required', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('contracts.store'), []);

    $response->assertSessionHasErrors('document');
});

it('validates that a document must be a pdf', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('contracts.store'), [
        'document' => UploadedFile::fake()->create('test.txt', 100, 'text/plain'),
    ]);

    $response->assertSessionHasErrors('document');
});

it('stores the uploaded document and creates an analysis record', function () {
    Storage::fake('local');

    ContractAnalysisAgent::fake();

    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('contracts.store'), [
        'document' => UploadedFile::fake()->create('contract.pdf', 100, 'application/pdf'),
    ]);

    $analysis = ContractAnalysis::where('user_id', $user->id)->first();

    expect($analysis)->not->toBeNull();
    expect($analysis->document_name)->toBe('contract.pdf');
    expect($analysis->user_id)->toBe($user->id);
    Storage::disk('local')->assertExists($analysis->storage_path);

    $response->assertRedirect(route('contracts.show', $analysis));
});

// ── Show ─────────────────────────────────────────────────────────

it('shows a completed analysis to its owner', function () {
    $user = User::factory()->create();

    $analysis = ContractAnalysis::factory()->for($user)->create([
        'status' => 'completed',
        'results' => [
            'risk_level' => 'medium',
            'summary' => 'Test summary.',
            'key_clauses' => [],
            'important_dates' => [],
            'recommendations' => [],
            'missing_clauses' => [],
        ],
    ]);

    $response = $this->actingAs($user)->get(route('contracts.show', $analysis));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('contracts/show')
        ->where('analysis.id', $analysis->id)
        ->where('analysis.status', 'completed')
    );
});

it('prevents users from viewing other users analyses', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();

    $analysis = ContractAnalysis::factory()->for($otherUser)->create();

    $this->actingAs($user)
        ->get(route('contracts.show', $analysis))
        ->assertForbidden();
});

it('redirects guests from show to login', function () {
    $analysis = ContractAnalysis::factory()->create();

    $this->get(route('contracts.show', $analysis))->assertRedirect(route('login'));
});
