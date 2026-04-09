import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

interface Props {
    query?: string;
    answer?: string;
}

export default function SearchIndex({ query, answer }: Props) {
    const form = useForm({ query: query ?? '' });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        form.post('/search');
    }

    return (
        <>
            <Head title="Legal Research" />
            <div className="mx-auto max-w-4xl p-4">
                <h1 className="mb-2 text-xl font-bold sm:text-2xl">Legal Research</h1>
                <p className="text-muted-foreground mb-6">
                    Ask questions about Papua New Guinea law. Answers are grounded in PNG legal documents.
                </p>

                <form onSubmit={handleSubmit} className="mb-8">
                    <div className="flex flex-col gap-2 sm:flex-row">
                        <input
                            type="text"
                            value={form.data.query}
                            onChange={(e) => form.setData('query', e.target.value)}
                            placeholder="e.g. What does the PNG Land Registration Act say about customary land?"
                            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex-1 rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                        />
                        <button
                            type="submit"
                            disabled={form.processing || !form.data.query.trim()}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
                        >
                            {form.processing ? 'Searching...' : 'Search'}
                        </button>
                    </div>
                    {form.errors.query && <p className="mt-1 text-sm text-red-600">{form.errors.query}</p>}
                </form>

                {answer && (
                    <div className="rounded-lg border p-6">
                        <h2 className="mb-4 text-lg font-semibold">Answer</h2>
                        <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">{answer}</div>
                    </div>
                )}
            </div>
        </>
    );
}

SearchIndex.layout = {
    breadcrumbs: [{ title: 'Legal Research', href: '/search' }],
};
