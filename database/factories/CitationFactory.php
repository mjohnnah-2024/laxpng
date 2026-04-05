<?php

namespace Database\Factories;

use App\Models\Citation;
use App\Models\LegalDocument;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Citation>
 */
class CitationFactory extends Factory
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
            'document_chunk_id' => null,
            'case_name' => fake()->optional()->sentence(4),
            'act_name' => fake()->optional()->words(3, true).' Act',
            'year' => fake()->numberBetween(1975, 2026),
            'section' => fake()->optional()->numerify('Section ##'),
            'url' => fake()->optional()->url(),
        ];
    }
}
