<?php

use App\Ai\Agents\DocumentGeneratorAgent;
use App\Models\LegalTemplate;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

// ── Index ────────────────────────────────────────────────────────

it('shows the templates index to authenticated users', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('templates.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('templates/index'));
});

it('redirects guests from templates index to login', function () {
    $this->get(route('templates.index'))->assertRedirect(route('login'));
});

it('only shows active templates on the index', function () {
    $user = User::factory()->create();

    LegalTemplate::factory()->create(['title' => 'Active Template', 'is_active' => true]);
    LegalTemplate::factory()->inactive()->create(['title' => 'Inactive Template']);

    $response = $this->actingAs($user)->get(route('templates.index'));

    $response->assertInertia(fn ($page) => $page
        ->has('templates.data', 1)
        ->where('templates.data.0.title', 'Active Template')
    );
});

it('filters templates by category', function () {
    $user = User::factory()->create();

    LegalTemplate::factory()->create(['category' => 'contract', 'is_active' => true]);
    LegalTemplate::factory()->create(['category' => 'affidavit', 'is_active' => true]);

    $response = $this->actingAs($user)->get(route('templates.index', ['category' => 'contract']));

    $response->assertInertia(fn ($page) => $page
        ->has('templates.data', 1)
        ->where('templates.data.0.category', 'contract')
    );
});

it('provides category options on the index', function () {
    $user = User::factory()->create();

    LegalTemplate::factory()->create(['category' => 'contract', 'is_active' => true]);
    LegalTemplate::factory()->create(['category' => 'affidavit', 'is_active' => true]);

    $response = $this->actingAs($user)->get(route('templates.index'));

    $response->assertInertia(fn ($page) => $page->has('categories', 2));
});

// ── Show ─────────────────────────────────────────────────────────

it('shows an active template with its fields', function () {
    $user = User::factory()->create();

    $template = LegalTemplate::factory()->create(['is_active' => true]);

    $response = $this->actingAs($user)->get(route('templates.show', $template));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('templates/show')
        ->has('template.fields')
    );
});

it('returns 404 for inactive templates', function () {
    $user = User::factory()->create();

    $template = LegalTemplate::factory()->inactive()->create();

    $this->actingAs($user)
        ->get(route('templates.show', $template))
        ->assertNotFound();
});

it('redirects guests from show to login', function () {
    $template = LegalTemplate::factory()->create(['is_active' => true]);

    $this->get(route('templates.show', $template))->assertRedirect(route('login'));
});

// ── Generate ─────────────────────────────────────────────────────

it('generates a filled document from a template', function () {
    DocumentGeneratorAgent::fake(['This is the generated employment contract for John Doe.']);

    $user = User::factory()->create();

    $template = LegalTemplate::factory()->create([
        'is_active' => true,
        'fields' => [
            ['name' => 'party_name', 'type' => 'text', 'label' => 'Party Name'],
            ['name' => 'date', 'type' => 'date', 'label' => 'Date'],
        ],
    ]);

    $response = $this->actingAs($user)->post(route('templates.generate', $template), [
        'fields' => [
            'party_name' => 'John Doe',
            'date' => '2026-04-05',
        ],
    ]);

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('templates/result')
        ->has('generatedContent')
        ->where('fields.party_name', 'John Doe')
    );

    DocumentGeneratorAgent::assertPrompted(fn ($prompt) => $prompt->contains('John Doe'));
});

it('validates that all template fields are required', function () {
    $user = User::factory()->create();

    $template = LegalTemplate::factory()->create([
        'is_active' => true,
        'fields' => [
            ['name' => 'party_name', 'type' => 'text', 'label' => 'Party Name'],
        ],
    ]);

    $this->actingAs($user)
        ->post(route('templates.generate', $template), [
            'fields' => ['party_name' => ''],
        ])
        ->assertSessionHasErrors('fields.party_name');
});

it('returns 404 when generating from an inactive template', function () {
    $user = User::factory()->create();

    $template = LegalTemplate::factory()->inactive()->create();

    $this->actingAs($user)
        ->post(route('templates.generate', $template), ['fields' => []])
        ->assertNotFound();
});

it('redirects guests from generate to login', function () {
    $template = LegalTemplate::factory()->create(['is_active' => true]);

    $this->post(route('templates.generate', $template), ['fields' => []])
        ->assertRedirect(route('login'));
});
