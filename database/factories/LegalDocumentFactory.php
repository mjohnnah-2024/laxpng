<?php

namespace Database\Factories;

use App\Models\LegalDocument;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<LegalDocument>
 */
class LegalDocumentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(6),
            'type' => fake()->randomElement(['act', 'case', 'regulation', 'constitution']),
            'year' => fake()->numberBetween(1975, 2026),
            'jurisdiction' => 'Papua New Guinea',
            'source_url' => fake()->url(),
            'storage_path' => null,
            'status' => 'processed',
            'metadata' => ['source' => 'paclii'],
        ];
    }

    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'published',
        ]);
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
        ]);
    }

    public function act(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'act',
            'title' => fake()->words(4, true).' Act '.fake()->numberBetween(1975, 2026),
        ]);
    }

    public function caselaw(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'case',
            'title' => fake()->lastName().' v '.fake()->lastName().' ['.fake()->numberBetween(1975, 2026).']',
        ]);
    }
}
