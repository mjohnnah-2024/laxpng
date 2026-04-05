import { Head, Link, router } from '@inertiajs/react';
import type { FormEvent} from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { index as researchIndex, search as researchSearch, show as researchShow } from '@/routes/research';

interface Document {
    id: number;
    title: string;
    type: string;
    year: number | null;
    jurisdiction: string;
    source_url: string | null;
    chunks_count: number;
    created_at: string;
}

interface Props {
    documents: {
        data: Document[];
        links: Record<string, string | null>[];
        current_page: number;
        last_page: number;
        next_page_url: string | null;
        prev_page_url: string | null;
    };
    types: string[];
    years: number[];
    filters: {
        search?: string;
        type?: string;
        year?: string;
    };
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

export default function ResearchIndex({ documents, types, years, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [type, setType] = useState(filters.type ?? '');
    const [year, setYear] = useState(filters.year ?? '');
    const [semanticQuery, setSemanticQuery] = useState('');

    function applyFilters(e?: FormEvent) {
        e?.preventDefault();
        router.get(
            researchIndex.url(),
            { search: search || undefined, type: type || undefined, year: year || undefined },
            { preserveState: true },
        );
    }

    function clearFilters() {
        setSearch('');
        setType('');
        setYear('');
        router.get(researchIndex.url());
    }

    function handleSemanticSearch(e: FormEvent) {
        e.preventDefault();

        if (!semanticQuery.trim()) {
return;
}

        router.get(researchSearch.url(), { q: semanticQuery });
    }

    return (
        <>
            <Head title="Legal Document Library" />
            <div className="mx-auto max-w-6xl p-4">
                <h1 className="mb-2 text-2xl font-bold">Legal Document Library</h1>
                <p className="text-muted-foreground mb-6">
                    Browse and search Papua New Guinea legal documents, acts, case law, and regulations.
                </p>

                {/* Semantic Search */}
                <div className="mb-6 rounded-lg border bg-accent/30 p-4">
                    <h2 className="mb-2 text-sm font-semibold">Semantic Search</h2>
                    <form onSubmit={handleSemanticSearch} className="flex gap-2">
                        <input
                            type="text"
                            value={semanticQuery}
                            onChange={(e) => setSemanticQuery(e.target.value)}
                            placeholder="Search by meaning, e.g. 'customary land ownership rights'"
                            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex-1 rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                        />
                        <Button type="submit" disabled={!semanticQuery.trim()}>
                            Search
                        </Button>
                    </form>
                </div>

                {/* Filters */}
                <form onSubmit={applyFilters} className="mb-6 flex flex-wrap items-end gap-3">
                    <div className="flex-1">
                        <label className="mb-1 block text-xs font-medium">Title</label>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Filter by title..."
                            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium">Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="border-input bg-background ring-offset-background focus-visible:ring-ring rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                        >
                            <option value="">All Types</option>
                            {types.map((t) => (
                                <option key={t} value={t}>
                                    {typeLabels[t] ?? t}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium">Year</label>
                        <select
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            className="border-input bg-background ring-offset-background focus-visible:ring-ring rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                        >
                            <option value="">All Years</option>
                            {years.map((y) => (
                                <option key={y} value={y}>
                                    {y}
                                </option>
                            ))}
                        </select>
                    </div>
                    <Button type="submit" variant="secondary" size="sm">
                        Filter
                    </Button>
                    {(filters.search || filters.type || filters.year) && (
                        <Button type="button" variant="ghost" size="sm" onClick={clearFilters}>
                            Clear
                        </Button>
                    )}
                </form>

                {/* Documents list */}
                {documents.data.length === 0 ? (
                    <p className="text-muted-foreground py-10 text-center">No documents found.</p>
                ) : (
                    <div className="space-y-3">
                        {documents.data.map((doc) => (
                            <Link
                                key={doc.id}
                                href={researchShow.url(doc.id)}
                                className="block rounded-lg border p-4 transition hover:bg-accent/50"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-semibold">{doc.title}</h3>
                                        <div className="text-muted-foreground mt-1 flex flex-wrap gap-3 text-sm">
                                            <span className="bg-secondary inline-block rounded px-2 py-0.5 text-xs font-medium">
                                                {typeLabels[doc.type] ?? doc.type}
                                            </span>
                                            {doc.year && <span>{doc.year}</span>}
                                            <span>{doc.jurisdiction}</span>
                                            <span>{doc.chunks_count} sections</span>
                                        </div>
                                    </div>
                                    {doc.source_url && (
                                        <span className="text-muted-foreground shrink-0 text-xs">Source available</span>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {documents.last_page > 1 && (
                    <div className="mt-6 flex justify-center gap-2">
                        {documents.prev_page_url && (
                            <Link href={documents.prev_page_url}>
                                <Button variant="outline" size="sm">
                                    Previous
                                </Button>
                            </Link>
                        )}
                        <span className="text-muted-foreground flex items-center text-sm">
                            Page {documents.current_page} of {documents.last_page}
                        </span>
                        {documents.next_page_url && (
                            <Link href={documents.next_page_url}>
                                <Button variant="outline" size="sm">
                                    Next
                                </Button>
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

ResearchIndex.layout = {
    breadcrumbs: [{ title: 'Document Library', href: '/research' }],
};
