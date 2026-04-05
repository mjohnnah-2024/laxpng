<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SearchLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SearchLogController extends Controller
{
    public function index(Request $request): Response
    {
        $logs = SearchLog::with('user:id,name,email')
            ->when($request->input('search'), fn ($q, $search) => $q->where('query', 'like', "%{$search}%"))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/search-logs/index', [
            'logs' => $logs,
            'filters' => $request->only(['search']),
        ]);
    }
}
