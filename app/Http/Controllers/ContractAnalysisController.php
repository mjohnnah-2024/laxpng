<?php

namespace App\Http\Controllers;

use App\Ai\Agents\ContractAnalysisAgent;
use App\Http\Requests\StoreContractAnalysisRequest;
use App\Models\ContractAnalysis;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Smalot\PdfParser\Parser as PdfParser;

class ContractAnalysisController extends Controller
{
    public function index(Request $request): Response
    {
        $analyses = ContractAnalysis::where('user_id', $request->user()->id)
            ->latest()
            ->paginate(15);

        return Inertia::render('contracts/index', [
            'analyses' => $analyses,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('contracts/create');
    }

    public function store(StoreContractAnalysisRequest $request): RedirectResponse
    {
        $file = $request->file('document');
        $path = $file->store('contracts', 'local');

        $analysis = ContractAnalysis::create([
            'user_id' => $request->user()->id,
            'document_name' => $file->getClientOriginalName(),
            'storage_path' => $path,
            'status' => 'processing',
        ]);

        try {
            $fullPath = Storage::disk('local')->path($path);
            $parser = new PdfParser;
            $pdf = $parser->parseFile($fullPath);
            $text = $pdf->getText();

            if (trim($text) === '') {
                $analysis->update([
                    'status' => 'failed',
                    'results' => ['error' => 'Could not extract text from the PDF. The document may be scanned or empty.'],
                ]);

                return to_route('contracts.show', $analysis)
                    ->with('status', 'Could not extract text from the uploaded document.');
            }

            $prompt = <<<PROMPT
            Analyze the following legal document. Identify risks, key clauses, important dates, and provide recommendations.

            DOCUMENT NAME: {$analysis->document_name}

            DOCUMENT TEXT:
            {$text}
            PROMPT;

            $response = (new ContractAnalysisAgent)->prompt($prompt);

            $analysis->update([
                'status' => 'completed',
                'results' => $response->toArray(),
            ]);
        } catch (\Throwable $e) {
            $analysis->update([
                'status' => 'failed',
                'results' => ['error' => 'Analysis failed. Please try again later.'],
            ]);

            report($e);
        }

        return to_route('contracts.show', $analysis);
    }

    public function show(Request $request, ContractAnalysis $analysis): Response
    {
        abort_unless($analysis->user_id === $request->user()->id, 403);

        return Inertia::render('contracts/show', [
            'analysis' => $analysis,
        ]);
    }
}
