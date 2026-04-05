<?php

use App\Models\DocumentChunk;
use App\Models\LegalDocument;
use App\Services\VectorStoreService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Ai\Embeddings;

uses(RefreshDatabase::class);

it('generates an embedding for text', function () {
    Embeddings::fake();

    $service = app(VectorStoreService::class);
    $result = $service->generateEmbedding('Test legal text about PNG law');

    expect($result)->toBeArray();

    Embeddings::assertGenerated(fn ($prompt) => true);
});

it('searches for similar chunks by embedding', function () {
    $document = LegalDocument::factory()->create();

    // Create chunks with stored embeddings in metadata
    DocumentChunk::factory()->create([
        'legal_document_id' => $document->id,
        'content' => 'Criminal law in Papua New Guinea',
        'embedding_id' => 'emb_1',
        'metadata' => ['embedding' => array_fill(0, 3, 0.5)],
    ]);

    DocumentChunk::factory()->create([
        'legal_document_id' => $document->id,
        'content' => 'Land tenure policy',
        'embedding_id' => 'emb_2',
        'metadata' => ['embedding' => array_fill(0, 3, 0.1)],
    ]);

    $service = app(VectorStoreService::class);
    $results = $service->search(array_fill(0, 3, 0.5), limit: 2);

    expect($results)->toHaveCount(2)
        ->and($results->first()['score'])->toBeGreaterThan($results->last()['score'])
        ->and($results->first()['chunk']->content)->toBe('Criminal law in Papua New Guinea');
});

it('returns empty collection when no chunks have embeddings', function () {
    $service = app(VectorStoreService::class);
    $results = $service->search(array_fill(0, 3, 0.5));

    expect($results)->toHaveCount(0);
});

it('searches by text query', function () {
    Embeddings::fake();

    $document = LegalDocument::factory()->create();
    DocumentChunk::factory()->create([
        'legal_document_id' => $document->id,
        'embedding_id' => 'emb_1',
        'metadata' => ['embedding' => array_fill(0, 1536, 0.1)],
    ]);

    $service = app(VectorStoreService::class);
    $results = $service->searchByText('criminal law');

    expect($results)->toHaveCount(1);

    Embeddings::assertGenerated(fn ($prompt) => true);
});
