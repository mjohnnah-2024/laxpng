<?php

namespace App\Http\Controllers;

use App\Models\ContractAnalysis;
use App\Models\LegalDocument;
use App\Models\LegalTemplate;
use App\Models\SearchLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('dashboard', [
            'stats' => [
                'searches' => SearchLog::where('user_id', $user->id)->count(),
                'analyses' => ContractAnalysis::where('user_id', $user->id)->count(),
                'documents' => LegalDocument::where('status', 'processed')->count(),
                'templates' => LegalTemplate::where('is_active', true)->count(),
            ],
            'recentSearches' => SearchLog::where('user_id', $user->id)
                ->latest()
                ->take(5)
                ->get(['id', 'query', 'results_count', 'response_time_ms', 'created_at']),
            'recentAnalyses' => ContractAnalysis::where('user_id', $user->id)
                ->latest()
                ->take(5)
                ->get(['id', 'document_name', 'status', 'created_at']),
        ]);
    }
}
