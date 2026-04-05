import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { dashboard as adminDashboard } from '@/routes/admin';
import { index as searchLogsIndex } from '@/routes/admin/search-logs';

interface SearchLog {
    id: number;
    user_id: number;
    query: string;
    results_count: number | null;
    response_time_ms: number | null;
    created_at: string;
    user?: { id: number; name: string; email: string } | null;
}

interface Props {
    logs: {
        data: SearchLog[];
        current_page: number;
        last_page: number;
        next_page_url: string | null;
        prev_page_url: string | null;
    };
    filters: {
        search?: string;
    };
}

export default function SearchLogsIndex({ logs, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    function applyFilter() {
        router.get(searchLogsIndex.url(), { search: search || undefined }, { preserveState: true });
    }

    return (
        <>
            <Head title="Search Logs" />
            <div className="mx-auto max-w-6xl p-4">
                <h1 className="mb-6 text-2xl font-bold">Search Logs</h1>

                {/* Search Filter */}
                <div className="mb-6 flex gap-3">
                    <input
                        type="text"
                        placeholder="Search by query..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && applyFilter()}
                        className="border-input bg-background ring-offset-background focus-visible:ring-ring flex-1 rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                    />
                    <Button size="sm" onClick={applyFilter}>
                        Search
                    </Button>
                </div>

                {/* Logs Table */}
                {logs.data.length === 0 ? (
                    <p className="text-muted-foreground py-12 text-center">No search logs found.</p>
                ) : (
                    <div className="overflow-x-auto rounded-lg border">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50 border-b">
                                <tr>
                                    <th className="px-4 py-2 text-left font-medium">Query</th>
                                    <th className="px-4 py-2 text-left font-medium">User</th>
                                    <th className="px-4 py-2 text-left font-medium">Results</th>
                                    <th className="px-4 py-2 text-left font-medium">Response Time</th>
                                    <th className="px-4 py-2 text-left font-medium">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {logs.data.map((log) => (
                                    <tr key={log.id} className="hover:bg-muted/30">
                                        <td className="max-w-sm truncate px-4 py-2 font-medium">{log.query}</td>
                                        <td className="text-muted-foreground px-4 py-2">
                                            {log.user ? (
                                                <span title={log.user.email}>{log.user.name}</span>
                                            ) : (
                                                'Unknown'
                                            )}
                                        </td>
                                        <td className="text-muted-foreground px-4 py-2">{log.results_count ?? '—'}</td>
                                        <td className="text-muted-foreground px-4 py-2">
                                            {log.response_time_ms ? `${log.response_time_ms}ms` : '—'}
                                        </td>
                                        <td className="text-muted-foreground px-4 py-2">
                                            {new Date(log.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {logs.last_page > 1 && (
                    <div className="mt-6 flex justify-center gap-2">
                        {logs.prev_page_url && (
                            <Button variant="outline" size="sm" onClick={() => router.get(logs.prev_page_url!)}>
                                Previous
                            </Button>
                        )}
                        <span className="text-muted-foreground flex items-center text-sm">
                            Page {logs.current_page} of {logs.last_page}
                        </span>
                        {logs.next_page_url && (
                            <Button variant="outline" size="sm" onClick={() => router.get(logs.next_page_url!)}>
                                Next
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

SearchLogsIndex.layout = {
    breadcrumbs: [
        { title: 'Admin', href: adminDashboard.url() },
        { title: 'Search Logs', href: searchLogsIndex.url() },
    ],
};
