<?php

namespace Database\Factories;

use App\Models\LegalTemplate;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<LegalTemplate>
 */
class LegalTemplateFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(3),
            'category' => fake()->randomElement(['contract', 'affidavit', 'agreement', 'notice', 'petition']),
            'description' => fake()->paragraph(),
            'content' => fake()->paragraphs(5, true),
            'fields' => [
                ['name' => 'party_name', 'type' => 'text', 'label' => 'Party Name'],
                ['name' => 'date', 'type' => 'date', 'label' => 'Date'],
            ],
            'is_active' => true,
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}
