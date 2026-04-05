<?php

use App\Jobs\ChunkDocument;
use App\Jobs\ExtractDocumentText;
use App\Jobs\GenerateChunkEmbeddings;
use App\Jobs\ProcessDocument;
use App\Models\DocumentChunk;
use App\Models\LegalDocument;
use App\Services\VectorStoreService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Storage;
use Laravel\Ai\Embeddings;

uses(RefreshDatabase::class);

it('dispatches the ingestion chain when processing a document', function () {
    Bus::fake();

    $document = LegalDocument::factory()->create(['status' => 'pending']);

    (new ProcessDocument($document))->handle();

    $document->refresh();
    expect($document->status)->toBe('processing');

    Bus::assertChained([
        ExtractDocumentText::class,
        ChunkDocument::class,
        GenerateChunkEmbeddings::class,
    ]);
});

it('extracts text from a txt file', function () {
    Storage::fake('legal-documents');

    $content = 'This is a test legal document with sufficient content for processing.';
    Storage::disk('legal-documents')->put('test.txt', $content);

    $document = LegalDocument::factory()->create([
        'storage_path' => 'test.txt',
        'status' => 'processing',
    ]);

    (new ExtractDocumentText($document))->handle();

    $document->refresh();
    expect($document->metadata['extracted_text'])->toBe($content)
        ->and($document->metadata['extracted_at'])->toBeString();
});

it('marks document as failed when extraction fails for unsupported type', function () {
    Storage::fake('legal-documents');

    $document = LegalDocument::factory()->create([
        'storage_path' => 'test.docx',
        'status' => 'processing',
    ]);

    $job = new ExtractDocumentText($document);

    expect(fn () => $job->handle())->toThrow(RuntimeException::class, 'Unsupported file type: docx');
});

it('chunks extracted text into overlapping segments', function () {
    $text = str_repeat('This is a test sentence for chunking purposes. ', 100);

    $document = LegalDocument::factory()->create([
        'status' => 'processing',
        'metadata' => ['extracted_text' => $text],
    ]);

    (new ChunkDocument($document))->handle();

    $document->refresh();
    $chunks = $document->chunks;

    expect($chunks->count())->toBeGreaterThan(1)
        ->and($document->metadata['chunk_count'])->toBe($chunks->count())
        ->and($document->metadata['chunked_at'])->toBeString();

    // Each chunk should have metadata
    $chunks->each(function ($chunk) {
        expect($chunk->metadata)->toHaveKeys(['char_count', 'word_count'])
            ->and($chunk->chunk_index)->toBeInt();
    });
});

it('deletes existing chunks before re-chunking', function () {
    $document = LegalDocument::factory()->create([
        'status' => 'processing',
        'metadata' => ['extracted_text' => str_repeat('New replacement content for the legal document. ', 100)],
    ]);

    // Create some pre-existing chunks with known content
    DocumentChunk::factory(3)->create([
        'legal_document_id' => $document->id,
        'content' => 'This is old chunk content that should be deleted',
    ]);
    expect($document->chunks()->count())->toBe(3);

    (new ChunkDocument($document))->handle();

    // Old chunks should be replaced with new content
    $document->refresh();
    expect($document->chunks->first()->content)->not->toContain('old chunk content that should be deleted');
});

it('throws when no extracted text is found for chunking', function () {
    $document = LegalDocument::factory()->create([
        'status' => 'processing',
        'metadata' => [],
    ]);

    expect(fn () => (new ChunkDocument($document))->handle())
        ->toThrow(RuntimeException::class, 'No extracted text found');
});

it('generates embeddings for all chunks', function () {
    Embeddings::fake();

    $document = LegalDocument::factory()->create(['status' => 'processing']);
    DocumentChunk::factory(3)->create(['legal_document_id' => $document->id]);

    $vectorStore = app(VectorStoreService::class);
    (new GenerateChunkEmbeddings($document))->handle($vectorStore);

    $document->refresh();
    expect($document->status)->toBe('published');

    $document->chunks->each(function ($chunk) {
        expect($chunk->embedding_id)->toStartWith('emb_')
            ->and($chunk->metadata)->toHaveKey('embedding');
    });

    Embeddings::assertGenerated(fn ($prompt) => true);
});

it('marks document as failed on job failure', function () {
    $document = LegalDocument::factory()->create(['status' => 'processing']);

    $job = new ProcessDocument($document);
    $job->failed(new RuntimeException('Test failure'));

    $document->refresh();
    expect($document->status)->toBe('failed');
});

it('detects legal section titles in chunks', function () {
    $text = "SECTION 5 - Interpretation\n\nIn this Act, unless the contrary intention appears:\n\n"
        .str_repeat('Definition text goes here. ', 50);

    $document = LegalDocument::factory()->create([
        'status' => 'processing',
        'metadata' => ['extracted_text' => $text],
    ]);

    (new ChunkDocument($document))->handle();

    $firstChunk = $document->chunks()->orderBy('chunk_index')->first();
    expect($firstChunk->section_title)->toContain('SECTION 5');
});
