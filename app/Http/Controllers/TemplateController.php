<?php

namespace App\Http\Controllers;

use App\Ai\Agents\DocumentGeneratorAgent;
use App\Models\LegalTemplate;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TemplateController extends Controller
{
    /**
     * Browse active legal templates with optional category filter.
     */
    public function index(Request $request): Response
    {
        $query = LegalTemplate::where('is_active', true);

        if ($request->filled('category')) {
            $query->where('category', $request->string('category')->value());
        }

        $templates = $query->orderBy('title')->paginate(20)->withQueryString();

        $categories = LegalTemplate::where('is_active', true)
            ->select('category')
            ->distinct()
            ->orderBy('category')
            ->pluck('category');

        return Inertia::render('templates/index', [
            'templates' => $templates,
            'categories' => $categories,
            'filters' => $request->only(['category']),
        ]);
    }

    /**
     * Show a single template with its fillable fields.
     */
    public function show(LegalTemplate $template): Response
    {
        abort_unless($template->is_active, 404);

        return Inertia::render('templates/show', [
            'template' => $template,
        ]);
    }

    /**
     * Generate a filled document from a template using the AI agent.
     */
    public function generate(Request $request, LegalTemplate $template): Response
    {
        abort_unless($template->is_active, 404);

        $fieldNames = collect($template->fields ?? [])->pluck('name')->all();

        $validated = $request->validate(
            collect($fieldNames)->mapWithKeys(fn (string $name) => [
                "fields.{$name}" => ['required', 'string', 'max:1000'],
            ])->all()
        );

        $fields = $validated['fields'];

        $fieldSummary = collect($fields)
            ->map(fn (string $value, string $key) => "{$key}: {$value}")
            ->implode("\n");

        $prompt = <<<PROMPT
        Fill the following legal document template with the provided field values.

        TEMPLATE TITLE: {$template->title}
        TEMPLATE CATEGORY: {$template->category}

        TEMPLATE CONTENT:
        {$template->content}

        FIELD VALUES:
        {$fieldSummary}

        Generate the complete filled document. Replace all placeholders with the provided values.
        PROMPT;

        $response = (new DocumentGeneratorAgent)->prompt($prompt);

        return Inertia::render('templates/result', [
            'template' => $template,
            'fields' => $fields,
            'generatedContent' => $response->text,
        ]);
    }
}
