<?php

namespace App\Jobs;

use App\Models\LegalDocument;
use App\Services\VectorStoreService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class GenerateChunkEmbeddings implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    /** @var array<int, int> */
    public array $backoff = [5, 15, 30];

    public function __construct(public LegalDocument $legalDocument) {}

    public function handle(VectorStoreService $vectorStore): void
    {
        $chunks = $this->legalDocument->chunks()->get();

        foreach ($chunks as $chunk) {
            $embedding = $vectorStore->generateEmbedding($chunk->content);

            $metadata = $chunk->metadata ?? [];
            $metadata['embedding'] = $embedding;

            $chunk->update([
                'embedding_id' => 'emb_'.$chunk->id.'_'.now()->timestamp,
                'metadata' => $metadata,
            ]);
        }

        $this->legalDocument->update(['status' => 'published']);
    }

    public function failed(?\Throwable $exception): void
    {
        $this->legalDocument->update(['status' => 'failed']);
    }
}
