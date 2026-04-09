import { Head, Link } from '@inertiajs/react';
import { dashboard as adminDashboard } from '@/routes/admin';
import { index as usersIndex } from '@/routes/admin/users';
import { index as docsIndex } from '@/routes/admin/documents';
import { index as templatesIndex } from '@/routes/admin/templates';
import { index as searchLogsIndex } from '@/routes/admin/search-logs';

interface SearchLog {
    id: number;
    user_id: number;
    query: string;
    results_count: number | null;
    response_time_ms: number | null;
    created_at: string;
    user?: { id: number; name: string } | null;
}

interface Document {
    id: number;
    title: string;
    type: string;
    status: string;
    created_at: string;
}

interface Props {
    stats: {
        users: number;
        documents: number;
        templates: number;
        analyses: number;
        searches: number;
        pending_documents: number;
    };
    recentDocuments: Document[];
    recentSearches: SearchLog[];
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export default function AdminDashboard({ stats, recentDocuments, recentSearches }: Props) {
    return (
        <>
            <Head title="Admin Dashboard" />
            <div className="mx-auto max-w-6xl p-4">
                <h1 className="mb-6 text-xl font-bold sm:text-2xl">Admin Dashboard</h1>

                {/* Stats Cards */}
                <div className="mb-8 grid gap-4 grid-cols-2 lg:grid-cols-3">
                    <Link href={usersIndex.url()} className="hover:border-primary/50 rounded-lg border p-3 transition-colors sm:p-4">
                        <p className="text-muted-foreground text-xs font-medium sm:text-sm">Total Users</p>
                        <p className="text-2xl font-bold sm:text-3xl">{stats.users}</p>
                    </Link>
                    <Link href={docsIndex.url()} className="hover:border-primary/50 rounded-lg border p-3 transition-colors sm:p-4">
                        <p className="text-muted-foreground text-xs font-medium sm:text-sm">Documents</p>
                        <p className="text-2xl font-bold sm:text-3xl">{stats.documents}</p>
                    </Link>
                    <Link href={templatesIndex.url()} className="hover:border-primary/50 rounded-lg border p-3 transition-colors sm:p-4">
                        <p className="text-muted-foreground text-xs font-medium sm:text-sm">Templates</p>
                        <p className="text-2xl font-bold sm:text-3xl">{stats.templates}</p>
                    </Link>
                    <div className="rounded-lg border p-3 sm:p-4">
                        <p className="text-muted-foreground text-xs font-medium sm:text-sm">Contract Analyses</p>
                        <p className="text-2xl font-bold sm:text-3xl">{stats.analyses}</p>
                    </div>
                    <Link href={searchLogsIndex.url()} className="hover:border-primary/50 rounded-lg border p-3 transition-colors sm:p-4">
                        <p className="text-muted-foreground text-xs font-medium sm:text-sm">Search Queries</p>
                        <p className="text-2xl font-bold sm:text-3xl">{stats.searches}</p>
                    </Link>
                    <Link href={docsIndex.url({ query: { status: 'pending' } })} className="hover:border-primary/50 rounded-lg border p-3 transition-colors sm:p-4">
                        <p className="text-muted-foreground text-xs font-medium sm:text-sm">Pending Documents</p>
                        <p className="text-2xl font-bold sm:text-3xl">{stats.pending_documents}</p>
                    </Link>
                </div>

                {/* Recent Documents */}
                <div className="mb-8">
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Recent Documents</h2>
                        <Link href={docsIndex.url()} className="text-primary text-sm hover:underline">
                            View all
                        </Link>
                    </div>
                    {recentDocuments.length === 0 ? (
                        <p className="text-muted-foreground text-sm">No documents yet.</p>
                    ) : (
                        <div className="overflow-x-auto rounded-lg border">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50 border-b">
                                    <tr>
                                        <th className="px-4 py-2 text-left font-medium">Title</th>
                                        <th className="px-4 py-2 text-left font-medium">Type</th>
                                        <th className="px-4 py-2 text-left font-medium">Status</th>
                                        <th className="px-4 py-2 text-left font-medium">Created</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {recentDocuments.map((doc) => (
                                        <tr key={doc.id}>
                                            <td className="px-4 py-2 font-medium">{doc.title}</td>
                                            <td className="text-muted-foreground px-4 py-2 capitalize">{doc.type}</td>
                                            <td className="px-4 py-2">
                                                <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[doc.status] ?? ''}`}>
                                                    {doc.status}
                                                </span>
                                            </td>
                                            <td className="text-muted-foreground px-4 py-2">{new Date(doc.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Recent Searches */}
                <div>
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Recent Searches</h2>
                        <Link href={searchLogsIndex.url()} className="text-primary text-sm hover:underline">
                            View all
                        </Link>
                    </div>
                    {recentSearches.length === 0 ? (
                        <p className="text-muted-foreground text-sm">No searches yet.</p>
                    ) : (
                        <div className="overflow-x-auto rounded-lg border">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50 border-b">
                                    <tr>
                                        <th className="px-4 py-2 text-left font-medium">Query</th>
                                        <th className="px-4 py-2 text-left font-medium">User</th>
                                        <th className="px-4 py-2 text-left font-medium">Results</th>
                                        <th className="px-4 py-2 text-left font-medium">Time</th>
                                        <th className="px-4 py-2 text-left font-medium">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {recentSearches.map((log) => (
                                        <tr key={log.id}>
                                            <td className="max-w-xs truncate px-4 py-2 font-medium">{log.query}</td>
                                            <td className="text-muted-foreground px-4 py-2">{log.user?.name ?? 'Unknown'}</td>
                                            <td className="text-muted-foreground px-4 py-2">{log.results_count ?? '—'}</td>
                                            <td className="text-muted-foreground px-4 py-2">
                                                {log.response_time_ms ? `${log.response_time_ms}ms` : '—'}
                                            </td>
                                            <td className="text-muted-foreground px-4 py-2">{new Date(log.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

AdminDashboard.layout = {
    breadcrumbs: [{ title: 'Admin Dashboard', href: adminDashboard.url() }],
};
