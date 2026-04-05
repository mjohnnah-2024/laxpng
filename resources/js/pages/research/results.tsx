import { Head, Link, router } from '@inertiajs/react';
import type { FormEvent} from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { index as researchIndex } from '@/routes/research';
import { show as researchShow } from '@/routes/research';

interface ResultDocument {
    id: number;
    title: string;
    type: string;
    year: number | null;
    source_url: string | null;
}

interface Result {
    chunk_id: number;
    content: string;
    section_title: string | null;
    score: number;
    document: ResultDocument;
}

interface Props {
    query: string;
    results: Result[];
}

const typeLabels: Record<string, string> = {
    act: 'Act',
    case_law: 'Case Law',
    regulation: 'Regulation',
    policy: 'Policy',
    guideline: 'Guideline',
    case: 'Case Law',
    constitution: 'Constitution',
};

function scoreColor(score: number): string {
    if (score >= 0.8) {
return 'text-green-600 dark:text-green-400';
}

    if (score >= 0.5) {
return 'text-yellow-600 dark:text-yellow-400';
}

    return 'text-muted-foreground';
}

export default function ResearchResults({ query, results }: Props) {
    const [searchQuery, setSearchQuery] = useState(query);

    function handleSearch(e: FormEvent) {
        e.preventDefault();

        if (searchQuery.trim().length < 3) {
return;
}

        router.get(researchIndex.url() + '/search', { q: searchQuery }, { preserveState: true });
    }

    return (
        <>
            <Head title={`Search: ${query}`} />
            <div className="mx-auto max-w-4xl p-4">
                <Link href={researchIndex.url()} className="text-muted-foreground hover:text-foreground mb-4 inline-block text-sm">
                    &larr; Back to Library
                </Link>

                {/* Search Form */}
                <form onSubmit={handleSearch} className="mb-6 flex gap-2">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search legal documents..."
                        className="border-input bg-background flex-1 rounded-md border px-3 py-2 text-sm"
                    />
                    <Button type="submit">Search</Button>
                </form>

                <h1 className="mb-1 text-xl font-bold">Search Results</h1>
                <p className="text-muted-foreground mb-6 text-sm">
                    {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
                </p>

                {results.length === 0 ? (
                    <div className="text-muted-foreground py-12 text-center">
                        <p className="text-lg font-medium">No results found</p>
                        <p className="mt-1 text-sm">Try broadening your search terms.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {results.map((result) => (
                            <div key={result.chunk_id} className="rounded-lg border p-4">
                                <div className="mb-2 flex items-start justify-between gap-4">
                                    <div>
                                        <Link
                                            href={researchShow.url({ document: result.document.id })}
                                            className="text-primary font-semibold hover:underline"
                                        >
                                            {result.document.title}
                                        </Link>
                                        <div className="text-muted-foreground mt-1 flex gap-2 text-xs">
                                            <span className="bg-secondary rounded px-1.5 py-0.5 font-medium">
                                                {typeLabels[result.document.type] ?? result.document.type}
                                            </span>
                                            {result.document.year && <span>{result.document.year}</span>}
                                        </div>
                                    </div>
                                    <span className={`whitespace-nowrap text-sm font-medium ${scoreColor(result.score)}`}>
                                        {Math.round(result.score * 100)}% match
                                    </span>
                                </div>

                                {result.section_title && (
                                    <p className="text-muted-foreground mb-1 text-xs font-medium">{result.section_title}</p>
                                )}
                                <p className="line-clamp-4 text-sm leading-relaxed">{result.content}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

ResearchResults.layout = {
    breadcrumbs: [
        { title: 'Document Library', href: '/research' },
        { title: 'Search Results', href: '#' },
    ],
};
