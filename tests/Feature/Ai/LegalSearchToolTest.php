<?php

use App\Ai\Tools\LegalSearchTool;
use App\Models\DocumentChunk;
use App\Models\LegalDocument;
use App\Services\VectorStoreService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Ai\Embeddings;
use Laravel\Ai\Tools\Request;

uses(RefreshDatabase::class);

it('returns formatted search results', function () {
    Embeddings::fake();

    $document = LegalDocument::factory()->create([
        'title' => 'Criminal Code Act',
        'year' => 1974,
        'status' => 'published',
    ]);

    $embedding = array_fill(0, 1536, 0.1);

    DocumentChunk::factory()->create([
        'legal_document_id' => $document->id,
        'content' => 'Theft is defined as...',
        'section_title' => 'Part IV',
        'embedding_id' => 'embed-1',
        'metadata' => ['embedding' => $embedding],
    ]);

    $tool = app(LegalSearchTool::class);
    $request = new Request(['query' => 'theft definition', 'limit' => 5]);

    $result = (string) $tool->handle($request);

    expect($result)
        ->toContain('Criminal Code Act')
        ->toContain('1974')
        ->toContain('Theft is defined as');
});

it('returns a message when no results are found', function () {
    Embeddings::fake();

    $tool = app(LegalSearchTool::class);
    $request = new Request(['query' => 'nonexistent topic']);

    $result = (string) $tool->handle($request);

    expect($result)->toBe('No relevant legal documents found for this query.');
});

it('has a description about PNG legal documents', function () {
    $tool = app(LegalSearchTool::class);

    expect((string) $tool->description())->toContain('Papua New Guinea');
});
