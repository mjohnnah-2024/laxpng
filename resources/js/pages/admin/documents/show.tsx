import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { dashboard as adminDashboard } from '@/routes/admin';
import { index as docsIndex, destroy as docsDestroy, reprocess as docsReprocess } from '@/routes/admin/documents';

interface Document {
    id: number;
    title: string;
    type: string;
    year: number | null;
    jurisdiction: string | null;
    status: string;
    storage_path: string;
    metadata: Record<string, unknown>;
    chunks_count: number;
    created_at: string;
}

interface Props {
    document: Document;
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export default function DocumentShow({ document }: Props) {
    function handleDelete() {
        if (!confirm(`Delete "${document.title}"? This will also remove all chunks and citations.`)) return;
        router.delete(docsDestroy.url(document.id));
    }

    function handleReprocess() {
        router.post(docsReprocess.url(document.id));
    }

    return (
        <>
            <Head title={document.title} />
            <div className="mx-auto max-w-3xl p-4">
                <Link href={docsIndex.url()} className="text-muted-foreground hover:text-foreground mb-4 inline-block text-sm">
                    &larr; Back to Documents
                </Link>

                <h1 className="mb-6 text-2xl font-bold">{document.title}</h1>

                <div className="space-y-6">
                    {/* Details */}
                    <div className="rounded-lg border p-4">
                        <h2 className="mb-3 text-lg font-semibold">Details</h2>
                        <dl className="grid gap-3 sm:grid-cols-2">
                            <div>
                                <dt className="text-muted-foreground text-sm">Type</dt>
                                <dd className="font-medium capitalize">{document.type.replace('_', ' ')}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground text-sm">Status</dt>
                                <dd>
                                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[document.status] ?? ''}`}>
                                        {document.status}
                                    </span>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground text-sm">Year</dt>
                                <dd className="font-medium">{document.year ?? '—'}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground text-sm">Jurisdiction</dt>
                                <dd className="font-medium">{document.jurisdiction ?? '—'}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground text-sm">Chunks</dt>
                                <dd className="font-medium">{document.chunks_count}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground text-sm">Created</dt>
                                <dd className="font-medium">{new Date(document.created_at).toLocaleDateString()}</dd>
                            </div>
                        </dl>
                    </div>

                    {/* Metadata */}
                    {document.metadata && Object.keys(document.metadata).length > 0 && (
                        <div className="rounded-lg border p-4">
                            <h2 className="mb-3 text-lg font-semibold">Metadata</h2>
                            <dl className="grid gap-2 sm:grid-cols-2">
                                {Object.entries(document.metadata).map(([key, value]) => (
                                    <div key={key}>
                                        <dt className="text-muted-foreground text-sm">{key.replace(/_/g, ' ')}</dt>
                                        <dd className="font-medium">{String(value)}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                        {(document.status === 'failed' || document.status === 'completed') && (
                            <Button variant="outline" onClick={handleReprocess}>
                                Reprocess
                            </Button>
                        )}
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete Document
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}

DocumentShow.layout = {
    breadcrumbs: [
        { title: 'Admin', href: adminDashboard.url() },
        { title: 'Documents', href: docsIndex.url() },
        { title: 'Details', href: '#' },
    ],
};
