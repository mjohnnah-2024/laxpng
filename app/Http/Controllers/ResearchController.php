<?php

namespace App\Http\Controllers;

use App\Models\LegalDocument;
use App\Services\VectorStoreService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ResearchController extends Controller
{
    /**
     * Browse published legal documents with filtering.
     */
    public function index(Request $request): Response
    {
        $query = LegalDocument::where('status', 'published');

        if ($request->filled('search')) {
            $search = $request->string('search')->value();
            $query->where('title', 'like', "%{$search}%");
        }

        if ($request->filled('type')) {
            $query->where('type', $request->string('type')->value());
        }

        if ($request->filled('year')) {
            $query->where('year', (int) $request->input('year'));
        }

        $documents = $query
            ->withCount('chunks')
            ->orderByDesc('year')
            ->paginate(20)
            ->withQueryString();

        $types = LegalDocument::where('status', 'published')
            ->select('type')
            ->distinct()
            ->pluck('type');

        $years = LegalDocument::where('status', 'published')
            ->whereNotNull('year')
            ->select('year')
            ->distinct()
            ->orderByDesc('year')
            ->pluck('year');

        return Inertia::render('research/index', [
            'documents' => $documents,
            'types' => $types,
            'years' => $years,
            'filters' => $request->only(['search', 'type', 'year']),
        ]);
    }

    /**
     * View a single published legal document with its chunks.
     */
    public function show(LegalDocument $document): Response
    {
        abort_unless($document->status === 'published', 404);

        $document->load(['chunks' => function ($q) {
            $q->orderBy('chunk_index');
        }, 'citations']);

        return Inertia::render('research/show', [
            'document' => $document,
        ]);
    }

    /**
     * Semantic search — returns matching document chunks with relevance scores.
     */
    public function search(Request $request, VectorStoreService $vectorStore): Response
    {
        $request->validate([
            'q' => ['required', 'string', 'min:3', 'max:500'],
        ]);

        $searchQuery = $request->string('q')->value();

        $results = $vectorStore->searchByText($searchQuery, limit: 10);

        $formattedResults = $results->map(function (array $result) {
            $chunk = $result['chunk'];
            $chunk->load('legalDocument');

            return [
                'chunk_id' => $chunk->id,
                'content' => $chunk->content,
                'section_title' => $chunk->section_title,
                'score' => round($result['score'], 4),
                'document' => [
                    'id' => $chunk->legalDocument->id,
                    'title' => $chunk->legalDocument->title,
                    'type' => $chunk->legalDocument->type,
                    'year' => $chunk->legalDocument->year,
                    'source_url' => $chunk->legalDocument->source_url,
                ],
            ];
        })->values();

        return Inertia::render('research/results', [
            'query' => $searchQuery,
            'results' => $formattedResults,
        ]);
    }
}
