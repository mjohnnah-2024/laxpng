import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { dashboard as adminDashboard } from '@/routes/admin';
import {
    index as docsIndex,
    create as docsCreate,
    show as docsShow,
    destroy as docsDestroy,
    reprocess as docsReprocess,
} from '@/routes/admin/documents';

interface Document {
    id: number;
    title: string;
    type: string;
    year: number | null;
    jurisdiction: string | null;
    status: string;
    created_at: string;
}

interface Props {
    documents: {
        data: Document[];
        current_page: number;
        last_page: number;
        next_page_url: string | null;
        prev_page_url: string | null;
    };
    filters: {
        search?: string;
        type?: string;
        status?: string;
    };
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export default function DocumentIndex({ documents, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [type, setType] = useState(filters.type ?? '');
    const [status, setStatus] = useState(filters.status ?? '');

    function applyFilters(overrides: Record<string, string | undefined> = {}) {
        router.get(docsIndex.url(), {
            search: search || undefined,
            type: type || undefined,
            status: status || undefined,
            ...overrides,
        }, { preserveState: true });
    }

    function handleDelete(id: number, title: string) {
        if (!confirm(`Delete document "${title}"? This will also remove all chunks and citations.`)) return;
        router.delete(docsDestroy.url(id));
    }

    function handleReprocess(id: number) {
        router.post(docsReprocess.url(id));
    }

    return (
        <>
            <Head title="Manage Documents" />
            <div className="mx-auto max-w-6xl p-4">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-xl font-bold sm:text-2xl">Manage Documents</h1>
                    <Link href={docsCreate.url()}>
                        <Button size="sm">Upload Document</Button>
                    </Link>
                </div>

                {/* Filters */}
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <input
                        type="text"
                        placeholder="Search by title..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                        className="border-input bg-background ring-offset-background focus-visible:ring-ring w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:w-auto"
                    />
                    <select
                        value={type}
                        onChange={(e) => {
                            setType(e.target.value);
                            applyFilters({ type: e.target.value || undefined });
                        }}
                        className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm sm:w-auto"
                    >
                        <option value="">All Types</option>
                        <option value="act">Act</option>
                        <option value="regulation">Regulation</option>
                        <option value="case_law">Case Law</option>
                        <option value="constitution">Constitution</option>
                        <option value="policy">Policy</option>
                    </select>
                    <select
                        value={status}
                        onChange={(e) => {
                            setStatus(e.target.value);
                            applyFilters({ status: e.target.value || undefined });
                        }}
                        className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm sm:w-auto"
                    >
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                    </select>
                    <Button size="sm" onClick={() => applyFilters()}>
                        Search
                    </Button>
                </div>

                {/* Documents Table */}
                {documents.data.length === 0 ? (
                    <p className="text-muted-foreground py-12 text-center">No documents found.</p>
                ) : (
                    <div className="overflow-x-auto rounded-lg border">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50 border-b">
                                <tr>
                                    <th className="px-4 py-2 text-left font-medium">Title</th>
                                    <th className="px-4 py-2 text-left font-medium">Type</th>
                                    <th className="px-4 py-2 text-left font-medium">Year</th>
                                    <th className="px-4 py-2 text-left font-medium">Status</th>
                                    <th className="px-4 py-2 text-left font-medium">Created</th>
                                    <th className="px-4 py-2 text-right font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {documents.data.map((doc) => (
                                    <tr key={doc.id} className="hover:bg-muted/30">
                                        <td className="px-4 py-2">
                                            <Link href={docsShow.url(doc.id)} className="text-primary font-medium hover:underline">
                                                {doc.title}
                                            </Link>
                                        </td>
                                        <td className="text-muted-foreground px-4 py-2 capitalize">{doc.type.replace('_', ' ')}</td>
                                        <td className="text-muted-foreground px-4 py-2">{doc.year ?? '—'}</td>
                                        <td className="px-4 py-2">
                                            <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[doc.status] ?? ''}`}>
                                                {doc.status}
                                            </span>
                                        </td>
                                        <td className="text-muted-foreground px-4 py-2">
                                            {new Date(doc.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-2 text-right">
                                            {(doc.status === 'failed' || doc.status === 'completed') && (
                                                <button
                                                    onClick={() => handleReprocess(doc.id)}
                                                    className="text-primary mr-3 text-sm hover:underline"
                                                >
                                                    Reprocess
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(doc.id, doc.title)}
                                                className="text-sm text-red-600 hover:underline dark:text-red-400"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {documents.last_page > 1 && (
                    <div className="mt-6 flex justify-center gap-2">
                        {documents.prev_page_url && (
                            <Button variant="outline" size="sm" onClick={() => router.get(documents.prev_page_url!)}>
                                Previous
                            </Button>
                        )}
                        <span className="text-muted-foreground flex items-center text-sm">
                            Page {documents.current_page} of {documents.last_page}
                        </span>
                        {documents.next_page_url && (
                            <Button variant="outline" size="sm" onClick={() => router.get(documents.next_page_url!)}>
                                Next
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

DocumentIndex.layout = {
    breadcrumbs: [
        { title: 'Admin', href: adminDashboard.url() },
        { title: 'Documents', href: docsIndex.url() },
    ],
};
