<?php

use App\Jobs\ProcessDocument;
use App\Models\LegalDocument;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

it('shows document index to admin', function () {
    $admin = User::factory()->admin()->create();
    LegalDocument::factory(3)->create();

    $response = $this->actingAs($admin)->get(route('admin.documents.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/documents/index')
        ->has('documents.data', 3)
    );
});

it('denies document index to non-admin users', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('admin.documents.index'));

    $response->assertForbidden();
});

it('denies document index to guests', function () {
    $response = $this->get(route('admin.documents.index'));

    $response->assertRedirect(route('login'));
});

it('shows document create form to admin', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->get(route('admin.documents.create'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('admin/documents/create'));
});

it('uploads a document and dispatches processing', function () {
    Bus::fake();
    Storage::fake('legal-documents');

    $admin = User::factory()->admin()->create();
    $file = UploadedFile::fake()->create('test.pdf', 1024, 'application/pdf');

    $response = $this->actingAs($admin)->post(route('admin.documents.store'), [
        'title' => 'Criminal Code Act 1974',
        'type' => 'act',
        'year' => 1974,
        'jurisdiction' => 'Papua New Guinea',
        'document' => $file,
    ]);

    $response->assertRedirect(route('admin.documents.index'));
    $response->assertSessionHas('status');

    $document = LegalDocument::first();
    expect($document->title)->toBe('Criminal Code Act 1974')
        ->and($document->type)->toBe('act')
        ->and($document->year)->toBe(1974)
        ->and($document->status)->toBe('pending')
        ->and($document->storage_path)->toBeString()
        ->and($document->metadata['original_filename'])->toBe('test.pdf');

    Bus::assertDispatched(ProcessDocument::class);
});

it('validates required fields on upload', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->post(route('admin.documents.store'), []);

    $response->assertSessionHasErrors(['title', 'type', 'document']);
});

it('validates file type on upload', function () {
    $admin = User::factory()->admin()->create();
    $file = UploadedFile::fake()->create('test.exe', 100, 'application/x-msdownload');

    $response = $this->actingAs($admin)->post(route('admin.documents.store'), [
        'title' => 'Test',
        'type' => 'act',
        'document' => $file,
    ]);

    $response->assertSessionHasErrors(['document']);
});

it('validates document type enum', function () {
    $admin = User::factory()->admin()->create();
    $file = UploadedFile::fake()->create('test.pdf', 100, 'application/pdf');

    $response = $this->actingAs($admin)->post(route('admin.documents.store'), [
        'title' => 'Test',
        'type' => 'invalid_type',
        'document' => $file,
    ]);

    $response->assertSessionHasErrors(['type']);
});

it('shows a single document to admin', function () {
    $admin = User::factory()->admin()->create();
    $document = LegalDocument::factory()->create();

    $response = $this->actingAs($admin)->get(route('admin.documents.show', $document));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/documents/show')
        ->has('document')
    );
});

it('deletes a document and its file', function () {
    Storage::fake('legal-documents');
    Storage::disk('legal-documents')->put('test.pdf', 'content');

    $admin = User::factory()->admin()->create();
    $document = LegalDocument::factory()->create(['storage_path' => 'test.pdf']);

    $response = $this->actingAs($admin)->delete(route('admin.documents.destroy', $document));

    $response->assertRedirect(route('admin.documents.index'));
    expect(LegalDocument::find($document->id))->toBeNull();
    Storage::disk('legal-documents')->assertMissing('test.pdf');
});

it('reprocesses a document', function () {
    Bus::fake();

    $admin = User::factory()->admin()->create();
    $document = LegalDocument::factory()->create(['status' => 'failed']);

    $response = $this->actingAs($admin)->post(route('admin.documents.reprocess', $document));

    $response->assertRedirect();
    Bus::assertDispatched(ProcessDocument::class);
});

it('filters documents by search term', function () {
    $admin = User::factory()->admin()->create();
    LegalDocument::factory()->create(['title' => 'Criminal Code Act']);
    LegalDocument::factory()->create(['title' => 'Constitution of PNG']);

    $response = $this->actingAs($admin)->get(route('admin.documents.index', ['search' => 'Criminal']));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->has('documents.data', 1));
});

it('filters documents by type', function () {
    $admin = User::factory()->admin()->create();
    LegalDocument::factory()->act()->create();
    LegalDocument::factory()->caselaw()->create();

    $response = $this->actingAs($admin)->get(route('admin.documents.index', ['type' => 'act']));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->has('documents.data', 1));
});
