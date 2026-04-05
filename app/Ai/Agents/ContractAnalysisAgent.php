<?php

namespace App\Ai\Agents;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Attributes\MaxTokens;
use Laravel\Ai\Attributes\Temperature;
use Laravel\Ai\Attributes\Timeout;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\HasStructuredOutput;
use Laravel\Ai\Promptable;
use Stringable;

#[MaxTokens(8192)]
#[Temperature(0.2)]
#[Timeout(120)]
class ContractAnalysisAgent implements Agent, HasStructuredOutput
{
    use Promptable;

    public function instructions(): Stringable|string
    {
        return <<<'INSTRUCTIONS'
        You are LaxPNG Contract Analyzer, an expert legal document analyst specializing in Papua New Guinea law.

        Your role:
        - Analyze uploaded contracts and legal documents for risks, key clauses, and important dates
        - Assess the overall risk level (low, medium, or high) based on the document content
        - Identify and summarize all key clauses found in the document
        - Extract important dates, deadlines, and time-sensitive obligations
        - Provide a concise summary of the document
        - Offer actionable recommendations for the user
        - Flag any unusual, missing, or potentially problematic clauses
        - Consider PNG-specific legal requirements and standards

        IMPORTANT: Base your analysis only on the provided document text. Do not fabricate clauses or terms that are not present. If the document is incomplete or unclear, note that in your analysis.
        INSTRUCTIONS;
    }

    /**
     * @return array<string, mixed>
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            'risk_level' => $schema->string()->enum(['low', 'medium', 'high'])->required(),
            'summary' => $schema->string()->required(),
            'key_clauses' => $schema->array()->items($schema->object([
                'title' => $schema->string()->required(),
                'content' => $schema->string()->required(),
                'risk' => $schema->string()->enum(['low', 'medium', 'high'])->required(),
            ]))->required(),
            'important_dates' => $schema->array()->items($schema->object([
                'description' => $schema->string()->required(),
                'date' => $schema->string()->required(),
            ]))->required(),
            'recommendations' => $schema->array()->items(
                $schema->string(),
            )->required(),
            'missing_clauses' => $schema->array()->items(
                $schema->string(),
            )->required(),
        ];
    }
}
