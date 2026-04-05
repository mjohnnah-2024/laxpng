<?php

namespace App\Ai\Tools;

use App\Services\VectorStoreService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;
use Stringable;

class LegalSearchTool implements Tool
{
    public function __construct(private VectorStoreService $vectorStore) {}

    public function description(): Stringable|string
    {
        return 'Search Papua New Guinea legal documents including acts, case law, regulations, and policies. Use this tool to find relevant legal text to answer the user\'s question.';
    }

    public function handle(Request $request): Stringable|string
    {
        $results = $this->vectorStore->searchByText(
            $request['query'],
            limit: (int) ($request['limit'] ?? 5),
        );

        if ($results->isEmpty()) {
            return 'No relevant legal documents found for this query.';
        }

        $context = $results->map(function (array $result, int $index) {
            $chunk = $result['chunk'];
            $document = $chunk->legalDocument;
            $score = round($result['score'], 4);

            $citation = $document->title;
            if ($document->year) {
                $citation .= " ({$document->year})";
            }

            $sectionInfo = $chunk->section_title ? "Section: {$chunk->section_title}\n" : '';

            return "[Source {$index}: {$citation} | Relevance: {$score}]\n{$sectionInfo}{$chunk->content}";
        })->implode("\n\n---\n\n");

        return $context;
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'query' => $schema->string()
                ->description('The legal question or search terms to find relevant PNG legal documents')
                ->required(),
            'limit' => $schema->integer()
                ->description('Maximum number of results to return (default: 5)')
                ->min(1)
                ->max(10),
        ];
    }
}
