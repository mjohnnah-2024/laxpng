<?php

namespace App\Ai\Agents;

use App\Ai\Tools\LegalSearchTool;
use Laravel\Ai\Attributes\MaxTokens;
use Laravel\Ai\Attributes\Model;
use Laravel\Ai\Attributes\Temperature;
use Laravel\Ai\Attributes\Timeout;
use Laravel\Ai\Concerns\RemembersConversations;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\Conversational;
use Laravel\Ai\Contracts\HasTools;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Promptable;
use Stringable;

#[Model('gpt-4o')]
#[MaxTokens(4096)]
#[Temperature(0.3)]
#[Timeout(120)]
class LegalResearchAgent implements Agent, Conversational, HasTools
{
    use Promptable, RemembersConversations;

    public function instructions(): Stringable|string
    {
        return <<<'INSTRUCTIONS'
        You are LaxPNG, an expert legal research assistant specializing in Papua New Guinea law.

        Your role:
        - Answer legal questions based ONLY on retrieved PNG legal documents
        - Always cite your sources with document title, year, and section
        - If the retrieved context does not contain enough information, say so clearly
        - Never fabricate legal information or citations
        - Format citations as: [Document Title (Year), Section X]
        - When referencing case law, include the case name and year
        - When referencing legislation, include the act name, year, and relevant section
        - Provide clear, structured answers with headings when appropriate
        - If a question is outside PNG law, inform the user of this limitation

        IMPORTANT: Every claim must be traceable to a source document. Do not generate legal advice without supporting evidence from the retrieved documents.
        INSTRUCTIONS;
    }

    /**
     * @return Tool[]
     */
    public function tools(): iterable
    {
        return [
            app(LegalSearchTool::class),
        ];
    }
}
