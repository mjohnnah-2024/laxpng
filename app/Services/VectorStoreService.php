<?php

namespace App\Services;

use App\Models\DocumentChunk;
use Illuminate\Support\Collection;
use Laravel\Ai\Embeddings;

class VectorStoreService
{
    /**
     * Generate and store an embedding for a document chunk.
     *
     * @return array<int, float>
     */
    public function generateEmbedding(string $text): array
    {
        $response = Embeddings::for([$text])
            ->dimensions(1536)
            ->generate();

        return $response->embeddings[0];
    }

    /**
     * Search for similar chunks by comparing embeddings.
     *
     * @param  array<int, float>  $queryEmbedding
     * @return Collection<int, array{chunk: DocumentChunk, score: float}>
     */
    public function search(array $queryEmbedding, int $limit = 5): Collection
    {
        $chunks = DocumentChunk::whereNotNull('embedding_id')->get();

        return $chunks->map(function (DocumentChunk $chunk) use ($queryEmbedding) {
            $chunkEmbedding = $this->getStoredEmbedding($chunk);

            if ($chunkEmbedding === null) {
                return null;
            }

            return [
                'chunk' => $chunk,
                'score' => $this->cosineSimilarity($queryEmbedding, $chunkEmbedding),
            ];
        })
            ->filter()
            ->sortByDesc('score')
            ->take($limit)
            ->values();
    }

    /**
     * Search for chunks similar to a text query.
     *
     * @return Collection<int, array{chunk: DocumentChunk, score: float}>
     */
    public function searchByText(string $query, int $limit = 5): Collection
    {
        $queryEmbedding = $this->generateEmbedding($query);

        return $this->search($queryEmbedding, $limit);
    }

    /**
     * Retrieve the stored embedding for a chunk from its metadata.
     *
     * @return array<int, float>|null
     */
    private function getStoredEmbedding(DocumentChunk $chunk): ?array
    {
        $metadata = $chunk->metadata ?? [];

        return $metadata['embedding'] ?? null;
    }

    /**
     * Calculate cosine similarity between two vectors.
     *
     * @param  array<int, float>  $a
     * @param  array<int, float>  $b
     */
    private function cosineSimilarity(array $a, array $b): float
    {
        $dotProduct = 0.0;
        $normA = 0.0;
        $normB = 0.0;

        for ($i = 0, $count = count($a); $i < $count; $i++) {
            $dotProduct += $a[$i] * $b[$i];
            $normA += $a[$i] * $a[$i];
            $normB += $b[$i] * $b[$i];
        }

        $denominator = sqrt($normA) * sqrt($normB);

        if ($denominator === 0.0) {
            return 0.0;
        }

        return $dotProduct / $denominator;
    }
}
