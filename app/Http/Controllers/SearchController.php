<?php

namespace App\Http\Controllers;

use App\Ai\Agents\LegalResearchAgent;
use App\Http\Requests\SearchQueryRequest;
use App\Models\SearchLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SearchController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('search/index');
    }

    public function query(SearchQueryRequest $request): Response
    {
        $query = $request->validated('query');
        $startTime = microtime(true);

        $response = (new LegalResearchAgent)->prompt($query);

        $responseTimeMs = (int) ((microtime(true) - $startTime) * 1000);

        SearchLog::create([
            'user_id' => $request->user()->id,
            'query' => $query,
            'results_count' => 1,
            'response_time_ms' => $responseTimeMs,
        ]);

        return Inertia::render('search/index', [
            'query' => $query,
            'answer' => $response->text,
        ]);
    }

    public function stream(SearchQueryRequest $request)
    {
        $query = $request->validated('query');
        $startTime = microtime(true);

        $stream = (new LegalResearchAgent)
            ->stream($query)
            ->then(function () use ($request, $query, $startTime) {
                $responseTimeMs = (int) ((microtime(true) - $startTime) * 1000);

                SearchLog::create([
                    'user_id' => $request->user()->id,
                    'query' => $query,
                    'results_count' => 1,
                    'response_time_ms' => $responseTimeMs,
                ]);
            });

        return $stream;
    }

    public function history(Request $request): Response
    {
        $logs = SearchLog::where('user_id', $request->user()->id)
            ->latest()
            ->paginate(20);

        return Inertia::render('search/history', [
            'logs' => $logs,
        ]);
    }
}
