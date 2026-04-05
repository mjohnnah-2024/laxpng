<?php

namespace Database\Factories;

use App\Models\ContractAnalysis;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ContractAnalysis>
 */
class ContractAnalysisFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'document_name' => fake()->word().'.pdf',
            'storage_path' => 'contracts/'.fake()->uuid().'.pdf',
            'status' => 'completed',
            'results' => [
                'risk_level' => fake()->randomElement(['low', 'medium', 'high']),
                'clauses_found' => fake()->numberBetween(5, 30),
            ],
        ];
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'results' => null,
        ]);
    }
}
