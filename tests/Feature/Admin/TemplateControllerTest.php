<?php

use App\Models\LegalTemplate;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('shows template list to admin', function () {
    $admin = User::factory()->admin()->create();
    LegalTemplate::factory(3)->create();

    $response = $this->actingAs($admin)->get(route('admin.templates.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/templates/index')
        ->has('templates.data', 3)
        ->has('categories')
    );
});

it('filters templates by category', function () {
    $admin = User::factory()->admin()->create();
    LegalTemplate::factory(2)->create(['category' => 'contract']);
    LegalTemplate::factory(1)->create(['category' => 'affidavit']);

    $response = $this->actingAs($admin)->get(route('admin.templates.index', ['category' => 'contract']));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('templates.data', 2)
    );
});

it('shows create form to admin', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->get(route('admin.templates.create'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('admin/templates/create'));
});

it('stores a new template', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->post(route('admin.templates.store'), [
        'title' => 'Test Template',
        'category' => 'contract',
        'description' => 'A test template',
        'content' => 'This is a {{party_name}} template for {{date}}.',
        'fields' => [
            ['name' => 'party_name', 'type' => 'text', 'label' => 'Party Name'],
            ['name' => 'date', 'type' => 'date', 'label' => 'Date'],
        ],
    ]);

    $response->assertRedirect(route('admin.templates.index'));
    expect(LegalTemplate::first())
        ->title->toBe('Test Template')
        ->category->toBe('contract')
        ->fields->toHaveCount(2);
});

it('validates required fields on store', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->post(route('admin.templates.store'), []);

    $response->assertSessionHasErrors(['title', 'category', 'content', 'fields']);
});

it('shows edit form to admin', function () {
    $admin = User::factory()->admin()->create();
    $template = LegalTemplate::factory()->create();

    $response = $this->actingAs($admin)->get(route('admin.templates.edit', $template));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/templates/edit')
        ->has('template')
    );
});

it('updates a template', function () {
    $admin = User::factory()->admin()->create();
    $template = LegalTemplate::factory()->create();

    $response = $this->actingAs($admin)->put(route('admin.templates.update', $template), [
        'title' => 'Updated Title',
        'category' => 'affidavit',
        'description' => 'Updated desc',
        'content' => 'Updated content {{name}}',
        'fields' => [
            ['name' => 'name', 'type' => 'text', 'label' => 'Name'],
        ],
        'is_active' => false,
    ]);

    $response->assertRedirect(route('admin.templates.index'));
    expect($template->fresh())
        ->title->toBe('Updated Title')
        ->category->toBe('affidavit')
        ->is_active->toBeFalse();
});

it('deletes a template', function () {
    $admin = User::factory()->admin()->create();
    $template = LegalTemplate::factory()->create();

    $response = $this->actingAs($admin)->delete(route('admin.templates.destroy', $template));

    $response->assertRedirect(route('admin.templates.index'));
    expect(LegalTemplate::find($template->id))->toBeNull();
});

it('denies template management to non-admin', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('admin.templates.index'));

    $response->assertForbidden();
});
