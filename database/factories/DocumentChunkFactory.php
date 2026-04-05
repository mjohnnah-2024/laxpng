<?php

namespace Database\Factories;

use App\Models\DocumentChunk;
use App\Models\LegalDocument;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DocumentChunk>
 */
class DocumentChunkFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'legal_document_id' => LegalDocument::factory(),
            'content' => fake()->paragraphs(3, true),
            'chunk_index' => fake()->numberBetween(0, 50),
            'section_title' => fake()->optional()->sentence(3),
            'embedding_id' => fake()->optional()->uuid(),
            'metadata' => null,
        ];
    }
}
