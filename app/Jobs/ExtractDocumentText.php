<?php

namespace App\Jobs;

use App\Models\LegalDocument;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Smalot\PdfParser\Parser as PdfParser;

class ExtractDocumentText implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    /** @var array<int, int> */
    public array $backoff = [1, 5, 10];

    public function __construct(public LegalDocument $legalDocument) {}

    public function handle(): void
    {
        $path = $this->legalDocument->storage_path;
        $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));

        $text = match ($extension) {
            'pdf' => $this->extractFromPdf($path),
            'txt' => Storage::disk('legal-documents')->get($path),
            default => throw new \RuntimeException("Unsupported file type: {$extension}"),
        };

        $metadata = $this->legalDocument->metadata ?? [];
        $metadata['extracted_text'] = $text;
        $metadata['extracted_at'] = now()->toIso8601String();

        $this->legalDocument->update(['metadata' => $metadata]);
    }

    private function extractFromPdf(string $path): string
    {
        $fullPath = Storage::disk('legal-documents')->path($path);
        $parser = new PdfParser;
        $pdf = $parser->parseFile($fullPath);

        return $pdf->getText();
    }

    public function failed(?\Throwable $exception): void
    {
        $this->legalDocument->update(['status' => 'failed']);
    }
}
