<?php

namespace App\Jobs;

use App\Models\DocumentChunk;
use App\Models\LegalDocument;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ChunkDocument implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    /** @var array<int, int> */
    public array $backoff = [1, 5, 10];

    private const CHUNK_SIZE = 1000;

    private const CHUNK_OVERLAP = 200;

    public function __construct(public LegalDocument $legalDocument) {}

    public function handle(): void
    {
        $metadata = $this->legalDocument->metadata ?? [];
        $text = $metadata['extracted_text'] ?? '';

        if (empty($text)) {
            throw new \RuntimeException('No extracted text found for document #'.$this->legalDocument->id);
        }

        // Delete existing chunks before re-chunking
        $this->legalDocument->chunks()->delete();

        $chunks = $this->splitIntoChunks($text);

        foreach ($chunks as $index => $chunkText) {
            DocumentChunk::create([
                'legal_document_id' => $this->legalDocument->id,
                'content' => $chunkText,
                'chunk_index' => $index,
                'section_title' => $this->detectSectionTitle($chunkText),
                'metadata' => [
                    'char_count' => strlen($chunkText),
                    'word_count' => str_word_count($chunkText),
                ],
            ]);
        }

        $metadata['chunk_count'] = count($chunks);
        $metadata['chunked_at'] = now()->toIso8601String();
        $this->legalDocument->update(['metadata' => $metadata]);
    }

    /**
     * Split text into overlapping chunks.
     *
     * @return array<int, string>
     */
    private function splitIntoChunks(string $text): array
    {
        $chunks = [];
        $length = strlen($text);
        $position = 0;

        while ($position < $length) {
            $chunk = substr($text, $position, self::CHUNK_SIZE);

            // Try to break at a sentence boundary
            if ($position + self::CHUNK_SIZE < $length) {
                $lastPeriod = strrpos($chunk, '. ');
                $lastNewline = strrpos($chunk, "\n");
                $breakPoint = max($lastPeriod ?: 0, $lastNewline ?: 0);

                if ($breakPoint > self::CHUNK_SIZE * 0.5) {
                    $chunk = substr($chunk, 0, $breakPoint + 1);
                }
            }

            $chunks[] = trim($chunk);
            $position += strlen($chunk) - self::CHUNK_OVERLAP;

            if ($position + self::CHUNK_OVERLAP >= $length) {
                break;
            }
        }

        return array_filter($chunks, fn (string $c) => strlen($c) > 50);
    }

    private function detectSectionTitle(string $text): ?string
    {
        // Match common legal section patterns
        if (preg_match('/^(?:PART|SECTION|DIVISION|CHAPTER|SCHEDULE)\s+[\dIVXLCDM]+[.\s\-:]+(.+)/mi', $text, $matches)) {
            return trim($matches[0], " \t\n\r\0\x0B.-:");
        }

        return null;
    }

    public function failed(?\Throwable $exception): void
    {
        $this->legalDocument->update(['status' => 'failed']);
    }
}
