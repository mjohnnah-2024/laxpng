<?php

use App\Ai\Agents\LegalResearchAgent;
use App\Ai\Tools\LegalSearchTool;
use Laravel\Ai\Contracts\Conversational;

it('has legal research instructions', function () {
    $agent = new LegalResearchAgent;

    $instructions = (string) $agent->instructions();

    expect($instructions)
        ->toContain('Papua New Guinea')
        ->toContain('cite')
        ->toContain('Never fabricate');
});

it('registers the legal search tool', function () {
    $agent = new LegalResearchAgent;

    $tools = collect($agent->tools());

    expect($tools)->toHaveCount(1);
    expect($tools->first())->toBeInstanceOf(LegalSearchTool::class);
});

it('can prompt and receive a response', function () {
    LegalResearchAgent::fake(['The Constitution of PNG (1975) establishes the framework for governance.']);

    $response = (new LegalResearchAgent)->prompt('What does the PNG constitution say?');

    expect($response->text)->toContain('Constitution of PNG');

    LegalResearchAgent::assertPrompted(fn ($prompt) => $prompt->contains('constitution'));
});

it('implements the Conversational interface', function () {
    $agent = new LegalResearchAgent;

    expect($agent)->toBeInstanceOf(Conversational::class);
});
