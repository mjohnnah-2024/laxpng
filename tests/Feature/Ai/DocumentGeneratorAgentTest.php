<?php

use App\Ai\Agents\DocumentGeneratorAgent;

it('can generate a filled document from a prompt', function () {
    DocumentGeneratorAgent::fake(['EMPLOYMENT CONTRACT\n\nThis Employment Contract is entered into on 2026-04-05...']);

    $response = (new DocumentGeneratorAgent)->prompt('Fill the template with party_name: John Doe, date: 2026-04-05');

    expect($response->text)->toContain('EMPLOYMENT CONTRACT');

    DocumentGeneratorAgent::assertPrompted(fn ($prompt) => $prompt->contains('John Doe'));
});

it('has correct instructions for PNG legal document generation', function () {
    $agent = new DocumentGeneratorAgent;

    expect($agent->instructions())
        ->toContain('LaxPNG Document Generator')
        ->toContain('Papua New Guinea')
        ->toContain('Do not fabricate');
});
