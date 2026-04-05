<?php

namespace App\Jobs;

use App\Models\LegalDocument;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Bus;

class ProcessDocument implements ShouldBeUnique, ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    /** @var array<int, int> */
    public array $backoff = [1, 5, 10];

    public function __construct(public LegalDocument $legalDocument) {}

    public function uniqueId(): string
    {
        return (string) $this->legalDocument->id;
    }

    public function handle(): void
    {
        $this->legalDocument->update(['status' => 'processing']);

        Bus::chain([
            new ExtractDocumentText($this->legalDocument),
            new ChunkDocument($this->legalDocument),
            new GenerateChunkEmbeddings($this->legalDocument),
        ])->dispatch();
    }

    public function failed(?\Throwable $exception): void
    {
        $this->legalDocument->update(['status' => 'failed']);
    }
}
