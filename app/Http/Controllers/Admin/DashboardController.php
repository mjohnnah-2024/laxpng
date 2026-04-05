<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContractAnalysis;
use App\Models\LegalDocument;
use App\Models\LegalTemplate;
use App\Models\SearchLog;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('admin/dashboard', [
            'stats' => [
                'users' => User::count(),
                'documents' => LegalDocument::count(),
                'templates' => LegalTemplate::count(),
                'analyses' => ContractAnalysis::count(),
                'searches' => SearchLog::count(),
                'pending_documents' => LegalDocument::where('status', 'pending')->count(),
            ],
            'recentDocuments' => LegalDocument::latest()->take(5)->get(['id', 'title', 'type', 'status', 'created_at']),
            'recentSearches' => SearchLog::with('user:id,name')->latest()->take(10)->get(['id', 'user_id', 'query', 'results_count', 'response_time_ms', 'created_at']),
        ]);
    }
}
