<?php

use App\Ai\Agents\ContractAnalysisAgent;

it('can analyze a contract and return structured output', function () {
    ContractAnalysisAgent::fake();

    $response = (new ContractAnalysisAgent)->prompt('Analyze this employment contract...');

    expect($response['risk_level'])->toBeIn(['low', 'medium', 'high']);
    expect($response['summary'])->toBeString();
    expect($response['key_clauses'])->toBeArray();
    expect($response['important_dates'])->toBeArray();
    expect($response['recommendations'])->toBeArray();
    expect($response['missing_clauses'])->toBeArray();

    ContractAnalysisAgent::assertPrompted(fn ($prompt) => $prompt->contains('employment contract'));
});

it('has correct instructions for PNG contract analysis', function () {
    $agent = new ContractAnalysisAgent;

    expect($agent->instructions())
        ->toContain('LaxPNG Contract Analyzer')
        ->toContain('Papua New Guinea')
        ->toContain('Do not fabricate');
});
