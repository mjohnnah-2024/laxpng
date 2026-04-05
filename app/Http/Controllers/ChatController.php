<?php

namespace App\Http\Controllers;

use App\Ai\Agents\LegalResearchAgent;
use App\Http\Requests\SearchQueryRequest;
use App\Models\SearchLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Ai\Responses\StreamedAgentResponse;

class ChatController extends Controller
{
    /**
     * Show conversations list.
     */
    public function index(Request $request): Response
    {
        $conversations = \DB::table('agent_conversations')
            ->where('user_id', $request->user()->id)
            ->orderByDesc('updated_at')
            ->paginate(20);

        return Inertia::render('chat/index', [
            'conversations' => $conversations,
        ]);
    }

    /**
     * Start a new conversation.
     */
    public function create(): Response
    {
        return Inertia::render('chat/show', [
            'conversationId' => null,
            'messages' => [],
        ]);
    }

    /**
     * Show an existing conversation.
     */
    public function show(Request $request, string $conversationId): Response
    {
        $conversation = \DB::table('agent_conversations')
            ->where('id', $conversationId)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $messages = \DB::table('agent_conversation_messages')
            ->where('conversation_id', $conversationId)
            ->orderBy('created_at')
            ->get()
            ->map(fn ($m) => [
                'id' => $m->id,
                'role' => $m->role,
                'content' => $m->content,
                'created_at' => $m->created_at,
            ]);

        return Inertia::render('chat/show', [
            'conversationId' => $conversationId,
            'conversationTitle' => $conversation->title,
            'messages' => $messages,
        ]);
    }

    /**
     * Send a message (new or continuing conversation) and stream the response.
     */
    public function send(SearchQueryRequest $request)
    {
        $query = $request->validated('query');
        $conversationId = $request->input('conversation_id');
        $user = $request->user();
        $startTime = microtime(true);

        $agent = new LegalResearchAgent;

        if ($conversationId) {
            $stream = $agent
                ->continue($conversationId, as: $user)
                ->stream($query);
        } else {
            $stream = $agent
                ->forUser($user)
                ->stream($query);
        }

        return $stream
            ->then(function (StreamedAgentResponse $response) use ($user, $query, $startTime) {
                SearchLog::create([
                    'user_id' => $user->id,
                    'query' => $query,
                    'results_count' => 1,
                    'response_time_ms' => (int) ((microtime(true) - $startTime) * 1000),
                ]);
            });
    }

    /**
     * Delete a conversation.
     */
    public function destroy(Request $request, string $conversationId): RedirectResponse
    {
        \DB::table('agent_conversations')
            ->where('id', $conversationId)
            ->where('user_id', $request->user()->id)
            ->delete();

        \DB::table('agent_conversation_messages')
            ->where('conversation_id', $conversationId)
            ->delete();

        return redirect()->route('chat.index');
    }
}
