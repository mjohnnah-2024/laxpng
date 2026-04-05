<?php

use App\Models\Citation;
use App\Models\ContractAnalysis;
use App\Models\DocumentChunk;
use App\Models\LegalDocument;
use App\Models\LegalTemplate;
use App\Models\SearchLog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('can create a legal document', function () {
    $document = LegalDocument::factory()->create();

    expect($document)->toBeInstanceOf(LegalDocument::class)
        ->and($document->title)->toBeString()
        ->and($document->type)->toBeString()
        ->and($document->jurisdiction)->toBe('Papua New Guinea');
});

it('can create an act document', function () {
    $document = LegalDocument::factory()->act()->create();

    expect($document->type)->toBe('act');
});

it('can create a case law document', function () {
    $document = LegalDocument::factory()->caselaw()->create();

    expect($document->type)->toBe('case');
});

it('has chunks relationship', function () {
    $document = LegalDocument::factory()->create();
    DocumentChunk::factory(3)->create(['legal_document_id' => $document->id]);

    expect($document->chunks)->toHaveCount(3)
        ->each->toBeInstanceOf(DocumentChunk::class);
});

it('has citations relationship', function () {
    $document = LegalDocument::factory()->create();
    Citation::factory(2)->create(['legal_document_id' => $document->id]);

    expect($document->citations)->toHaveCount(2)
        ->each->toBeInstanceOf(Citation::class);
});

it('casts metadata to array', function () {
    $document = LegalDocument::factory()->create([
        'metadata' => ['source' => 'paclii', 'pages' => 10],
    ]);

    expect($document->metadata)->toBeArray()
        ->and($document->metadata['source'])->toBe('paclii');
});

it('cascade deletes chunks when document is deleted', function () {
    $document = LegalDocument::factory()->create();
    DocumentChunk::factory(3)->create(['legal_document_id' => $document->id]);

    $document->delete();

    expect(DocumentChunk::where('legal_document_id', $document->id)->count())->toBe(0);
});

it('can create a document chunk with parent', function () {
    $chunk = DocumentChunk::factory()->create();

    expect($chunk->legalDocument)->toBeInstanceOf(LegalDocument::class)
        ->and($chunk->content)->toBeString();
});

it('can create a citation', function () {
    $citation = Citation::factory()->create();

    expect($citation->legalDocument)->toBeInstanceOf(LegalDocument::class)
        ->and($citation->year)->toBeInt();
});

it('can create a legal template', function () {
    $template = LegalTemplate::factory()->create();

    expect($template->title)->toBeString()
        ->and($template->fields)->toBeArray()
        ->and($template->is_active)->toBeTrue();
});

it('can create an inactive template', function () {
    $template = LegalTemplate::factory()->inactive()->create();

    expect($template->is_active)->toBeFalse();
});

it('can create a contract analysis', function () {
    $analysis = ContractAnalysis::factory()->create();

    expect($analysis->user)->toBeInstanceOf(User::class)
        ->and($analysis->status)->toBe('completed')
        ->and($analysis->results)->toBeArray();
});

it('can create a pending contract analysis', function () {
    $analysis = ContractAnalysis::factory()->pending()->create();

    expect($analysis->status)->toBe('pending')
        ->and($analysis->results)->toBeNull();
});

it('can create a search log', function () {
    $log = SearchLog::factory()->create();

    expect($log->user)->toBeInstanceOf(User::class)
        ->and($log->query)->toBeString()
        ->and($log->results_count)->toBeInt();
});

it('user has contract analyses relationship', function () {
    $user = User::factory()->create();
    ContractAnalysis::factory(2)->create(['user_id' => $user->id]);

    expect($user->contractAnalyses)->toHaveCount(2);
});

it('user has search logs relationship', function () {
    $user = User::factory()->create();
    SearchLog::factory(3)->create(['user_id' => $user->id]);

    expect($user->searchLogs)->toHaveCount(3);
});
