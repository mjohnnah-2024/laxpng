import { Head } from '@inertiajs/react';

interface SearchLogEntry {
    id: number;
    query: string;
    results_count: number;
    response_time_ms: number;
    created_at: string;
}

interface Props {
    logs: {
        data: SearchLogEntry[];
        links: Record<string, string | null>[];
    };
}

export default function SearchHistory({ logs }: Props) {
    return (
        <>
            <Head title="Search History" />
            <div className="mx-auto max-w-4xl p-4">
                <h1 className="mb-6 text-2xl font-bold">Search History</h1>

                {logs.data.length === 0 ? (
                    <p className="text-muted-foreground">No searches yet.</p>
                ) : (
                    <div className="space-y-3">
                        {logs.data.map((log) => (
                            <div key={log.id} className="rounded-lg border p-4">
                                <p className="font-medium">{log.query}</p>
                                <p className="text-muted-foreground mt-1 text-sm">
                                    {log.response_time_ms}ms &middot; {new Date(log.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

SearchHistory.layout = {
    breadcrumbs: [
        { title: 'Legal Research', href: '/search' },
        { title: 'History', href: '/search/history' },
    ],
};
