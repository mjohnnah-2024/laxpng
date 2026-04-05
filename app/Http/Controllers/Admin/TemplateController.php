<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LegalTemplate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TemplateController extends Controller
{
    public function index(Request $request): Response
    {
        $templates = LegalTemplate::query()
            ->when($request->input('search'), fn ($q, $search) => $q->where('title', 'like', "%{$search}%"))
            ->when($request->input('category'), fn ($q, $category) => $q->where('category', $category))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $categories = LegalTemplate::select('category')
            ->distinct()
            ->orderBy('category')
            ->pluck('category');

        return Inertia::render('admin/templates/index', [
            'templates' => $templates,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/templates/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:1000'],
            'content' => ['required', 'string'],
            'fields' => ['required', 'array', 'min:1'],
            'fields.*.name' => ['required', 'string', 'max:100'],
            'fields.*.type' => ['required', 'string', 'in:text,textarea,date,number'],
            'fields.*.label' => ['required', 'string', 'max:200'],
        ]);

        LegalTemplate::create($validated);

        return to_route('admin.templates.index')
            ->with('status', 'Template created.');
    }

    public function edit(LegalTemplate $template): Response
    {
        return Inertia::render('admin/templates/edit', [
            'template' => $template,
        ]);
    }

    public function update(Request $request, LegalTemplate $template): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:1000'],
            'content' => ['required', 'string'],
            'fields' => ['required', 'array', 'min:1'],
            'fields.*.name' => ['required', 'string', 'max:100'],
            'fields.*.type' => ['required', 'string', 'in:text,textarea,date,number'],
            'fields.*.label' => ['required', 'string', 'max:200'],
            'is_active' => ['required', 'boolean'],
        ]);

        $template->update($validated);

        return to_route('admin.templates.index')
            ->with('status', 'Template updated.');
    }

    public function destroy(LegalTemplate $template): RedirectResponse
    {
        $template->delete();

        return to_route('admin.templates.index')
            ->with('status', 'Template deleted.');
    }
}
