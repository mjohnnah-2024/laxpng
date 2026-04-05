<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreDocumentRequest;
use App\Jobs\ProcessDocument;
use App\Models\LegalDocument;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class DocumentController extends Controller
{
    public function index(Request $request): Response
    {
        $documents = LegalDocument::query()
            ->when($request->input('search'), fn ($q, $search) => $q->where('title', 'like', "%{$search}%"))
            ->when($request->input('type'), fn ($q, $type) => $q->where('type', $type))
            ->when($request->input('status'), fn ($q, $status) => $q->where('status', $status))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/documents/index', [
            'documents' => $documents,
            'filters' => $request->only(['search', 'type', 'status']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/documents/create');
    }

    public function store(StoreDocumentRequest $request): RedirectResponse
    {
        $file = $request->file('document');
        $path = $file->store('', 'legal-documents');

        $document = LegalDocument::create([
            'title' => $request->validated('title'),
            'type' => $request->validated('type'),
            'year' => $request->validated('year'),
            'jurisdiction' => $request->validated('jurisdiction'),
            'source_url' => $request->validated('source_url'),
            'storage_path' => $path,
            'status' => 'pending',
            'metadata' => [
                'original_filename' => $file->getClientOriginalName(),
                'file_size' => $file->getSize(),
                'mime_type' => $file->getMimeType(),
            ],
        ]);

        ProcessDocument::dispatch($document);

        return to_route('admin.documents.index')
            ->with('status', 'Document uploaded and queued for processing.');
    }

    public function show(LegalDocument $document): Response
    {
        return Inertia::render('admin/documents/show', [
            'document' => $document->loadCount('chunks'),
        ]);
    }

    public function destroy(LegalDocument $document): RedirectResponse
    {
        if ($document->storage_path) {
            Storage::disk('legal-documents')->delete($document->storage_path);
        }

        $document->chunks()->delete();
        $document->citations()->delete();
        $document->delete();

        return to_route('admin.documents.index')
            ->with('status', 'Document deleted.');
    }

    public function reprocess(LegalDocument $document): RedirectResponse
    {
        ProcessDocument::dispatch($document);

        return back()->with('status', 'Document queued for reprocessing.');
    }
}
