<?php

use App\Ai\Agents\LegalResearchAgent;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('shows the conversations list to authenticated users', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('chat.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('chat/index')->has('conversations'));
});

it('redirects guests from chat', function () {
    $response = $this->get(route('chat.index'));

    $response->assertRedirect(route('login'));
});

it('shows the new conversation page', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('chat.create'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('chat/show')
        ->where('conversationId', null)
        ->has('messages')
    );
});

it('shows an existing conversation', function () {
    $user = User::factory()->create();
    $conversationId = (string) \Illuminate\Support\Str::uuid();

    \DB::table('agent_conversations')->insert([
        'id' => $conversationId,
        'user_id' => $user->id,
        'title' => 'Test Conversation',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    \DB::table('agent_conversation_messages')->insert([
        'id' => (string) \Illuminate\Support\Str::uuid(),
        'conversation_id' => $conversationId,
        'user_id' => $user->id,
        'agent' => LegalResearchAgent::class,
        'role' => 'user',
        'content' => 'Hello',
        'attachments' => '[]',
        'tool_calls' => '[]',
        'tool_results' => '[]',
        'usage' => '{}',
        'meta' => '{}',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $response = $this->actingAs($user)->get(route('chat.show', $conversationId));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('chat/show')
        ->where('conversationId', $conversationId)
        ->where('conversationTitle', 'Test Conversation')
        ->has('messages', 1)
    );
});

it('prevents viewing another user conversation', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();
    $conversationId = (string) \Illuminate\Support\Str::uuid();

    \DB::table('agent_conversations')->insert([
        'id' => $conversationId,
        'user_id' => $other->id,
        'title' => 'Other Conversation',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $response = $this->actingAs($user)->get(route('chat.show', $conversationId));

    $response->assertNotFound();
});

it('deletes a conversation', function () {
    $user = User::factory()->create();
    $conversationId = (string) \Illuminate\Support\Str::uuid();

    \DB::table('agent_conversations')->insert([
        'id' => $conversationId,
        'user_id' => $user->id,
        'title' => 'To Delete',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    \DB::table('agent_conversation_messages')->insert([
        'id' => (string) \Illuminate\Support\Str::uuid(),
        'conversation_id' => $conversationId,
        'user_id' => $user->id,
        'agent' => LegalResearchAgent::class,
        'role' => 'user',
        'content' => 'Test',
        'attachments' => '[]',
        'tool_calls' => '[]',
        'tool_results' => '[]',
        'usage' => '{}',
        'meta' => '{}',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $response = $this->actingAs($user)->delete(route('chat.destroy', $conversationId));

    $response->assertRedirect(route('chat.index'));
    expect(\DB::table('agent_conversations')->where('id', $conversationId)->exists())->toBeFalse();
    expect(\DB::table('agent_conversation_messages')->where('conversation_id', $conversationId)->exists())->toBeFalse();
});

it('prevents deleting another user conversation', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();
    $conversationId = (string) \Illuminate\Support\Str::uuid();

    \DB::table('agent_conversations')->insert([
        'id' => $conversationId,
        'user_id' => $other->id,
        'title' => 'Protected',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $this->actingAs($user)->delete(route('chat.destroy', $conversationId));

    // Conversation should still exist
    expect(\DB::table('agent_conversations')->where('id', $conversationId)->exists())->toBeTrue();
});

it('validates query on send', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('chat.send'), [
        'query' => '',
    ]);

    $response->assertSessionHasErrors(['query']);
});

it('validates query minimum length on send', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('chat.send'), [
        'query' => 'ab',
    ]);

    $response->assertSessionHasErrors(['query']);
});

it('only shows user own conversations', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();

    \DB::table('agent_conversations')->insert([
        ['id' => (string) \Illuminate\Support\Str::uuid(), 'user_id' => $user->id, 'title' => 'Mine', 'created_at' => now(), 'updated_at' => now()],
        ['id' => (string) \Illuminate\Support\Str::uuid(), 'user_id' => $other->id, 'title' => 'Theirs', 'created_at' => now(), 'updated_at' => now()],
    ]);

    $response = $this->actingAs($user)->get(route('chat.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('chat/index')
        ->has('conversations.data', 1)
    );
});
