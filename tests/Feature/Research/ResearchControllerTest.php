<?php

use App\Models\Citation;
use App\Models\DocumentChunk;
use App\Models\LegalDocument;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Ai\Embeddings;

uses(RefreshDatabase::class);

// ── Index ────────────────────────────────────────────────────────

it('shows the research index to authenticated users', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('research.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('research/index'));
});

it('redirects guests from research index to login', function () {
    $this->get(route('research.index'))->assertRedirect(route('login'));
});

it('only shows published documents on the index', function () {
    $user = User::factory()->create();

    LegalDocument::factory()->published()->create(['title' => 'Published Doc']);
    LegalDocument::factory()->pending()->create(['title' => 'Pending Doc']);
    LegalDocument::factory()->create(['title' => 'Processed Doc', 'status' => 'processed']);

    $response = $this->actingAs($user)->get(route('research.index'));

    $response->assertInertia(fn ($page) => $page
        ->component('research/index')
        ->has('documents.data', 1)
        ->where('documents.data.0.title', 'Published Doc')
    );
});

it('filters documents by type', function () {
    $user = User::factory()->create();

    LegalDocument::factory()->published()->act()->create();
    LegalDocument::factory()->published()->caselaw()->create();

    $response = $this->actingAs($user)->get(route('research.index', ['type' => 'act']));

    $response->assertInertia(fn ($page) => $page
        ->has('documents.data', 1)
        ->where('documents.data.0.type', 'act')
    );
});

it('filters documents by year', function () {
    $user = User::factory()->create();

    LegalDocument::factory()->published()->create(['year' => 2020]);
    LegalDocument::factory()->published()->create(['year' => 2025]);

    $response = $this->actingAs($user)->get(route('research.index', ['year' => 2025]));

    $response->assertInertia(fn ($page) => $page
        ->has('documents.data', 1)
        ->where('documents.data.0.year', 2025)
    );
});

it('filters documents by title search', function () {
    $user = User::factory()->create();

    LegalDocument::factory()->published()->create(['title' => 'Criminal Code Act']);
    LegalDocument::factory()->published()->create(['title' => 'Land Registration Act']);

    $response = $this->actingAs($user)->get(route('research.index', ['search' => 'Criminal']));

    $response->assertInertia(fn ($page) => $page
        ->has('documents.data', 1)
        ->where('documents.data.0.title', 'Criminal Code Act')
    );
});

// ── Show ─────────────────────────────────────────────────────────

it('shows a published document with its chunks and citations', function () {
    $user = User::factory()->create();

    $document = LegalDocument::factory()->published()->create();
    DocumentChunk::factory()->count(3)->create(['legal_document_id' => $document->id]);
    Citation::factory()->count(2)->create(['legal_document_id' => $document->id]);

    $response = $this->actingAs($user)->get(route('research.show', $document));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('research/show')
        ->has('document.chunks', 3)
        ->has('document.citations', 2)
    );
});

it('returns 404 for non-published documents', function () {
    $user = User::factory()->create();

    $document = LegalDocument::factory()->pending()->create();

    $this->actingAs($user)
        ->get(route('research.show', $document))
        ->assertNotFound();
});

it('redirects guests from show to login', function () {
    $document = LegalDocument::factory()->published()->create();

    $this->get(route('research.show', $document))->assertRedirect(route('login'));
});

// ── Search ───────────────────────────────────────────────────────

it('performs a semantic search and returns results', function () {
    Embeddings::fake();

    $user = User::factory()->create();

    $document = LegalDocument::factory()->published()->create();
    $chunk = DocumentChunk::factory()->create([
        'legal_document_id' => $document->id,
        'metadata' => ['embedding' => array_fill(0, 1536, 0.1)],
    ]);

    $response = $this->actingAs($user)->get(route('research.search', ['q' => 'land rights']));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('research/results')
        ->where('query', 'land rights')
        ->has('results')
    );
});

it('validates search query is required', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('research.search'))
        ->assertSessionHasErrors('q');
});

it('validates search query minimum length', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('research.search', ['q' => 'ab']))
        ->assertSessionHasErrors('q');
});

it('provides type and year filter options on the index', function () {
    $user = User::factory()->create();

    LegalDocument::factory()->published()->create(['type' => 'act', 'year' => 2020]);
    LegalDocument::factory()->published()->create(['type' => 'regulation', 'year' => 2023]);

    $response = $this->actingAs($user)->get(route('research.index'));

    $response->assertInertia(fn ($page) => $page
        ->has('types', 2)
        ->has('years', 2)
    );
});
