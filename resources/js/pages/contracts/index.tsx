import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { index as contractsIndex, create as contractsCreate, show as contractsShow } from '@/routes/contracts';

interface Analysis {
    id: number;
    document_name: string;
    status: string;
    created_at: string;
    results: {
        risk_level?: string;
        error?: string;
    } | null;
}

interface Props {
    analyses: {
        data: Analysis[];
        current_page: number;
        last_page: number;
        next_page_url: string | null;
        prev_page_url: string | null;
    };
}

const riskColors: Record<string, string> = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const statusColors: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export default function ContractsIndex({ analyses }: Props) {
    return (
        <>
            <Head title="Contract Analysis" />
            <div className="mx-auto max-w-6xl p-4">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold sm:text-2xl">Contract Analysis</h1>
                        <p className="text-muted-foreground mt-1">
                            Upload and analyze legal documents for risks, clauses, and important dates.
                        </p>
                    </div>
                    <Link href={contractsCreate.url()}>
                        <Button>Upload Document</Button>
                    </Link>
                </div>

                {analyses.data.length === 0 ? (
                    <div className="text-muted-foreground py-12 text-center">
                        <p className="text-lg font-medium">No analyses yet</p>
                        <p className="mt-1 text-sm">Upload a contract to get started with AI-powered analysis.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {analyses.data.map((analysis) => (
                            <Link
                                key={analysis.id}
                                href={contractsShow.url(analysis.id)}
                                className="hover:border-primary/50 flex flex-col gap-3 rounded-lg border p-4 transition-colors sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div className="min-w-0 flex-1">
                                    <h3 className="truncate font-semibold">{analysis.document_name}</h3>
                                    <p className="text-muted-foreground mt-1 text-sm">
                                        {new Date(analysis.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 sm:ml-4">
                                    {analysis.status === 'completed' && analysis.results?.risk_level && (
                                        <span
                                            className={`rounded px-2 py-0.5 text-xs font-medium ${riskColors[analysis.results.risk_level] ?? ''}`}
                                        >
                                            {analysis.results.risk_level} risk
                                        </span>
                                    )}
                                    <span
                                        className={`rounded px-2 py-0.5 text-xs font-medium ${statusColors[analysis.status] ?? ''}`}
                                    >
                                        {analysis.status}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {analyses.last_page > 1 && (
                    <div className="mt-6 flex justify-center gap-2">
                        {analyses.prev_page_url && (
                            <Button variant="outline" size="sm" asChild>
                                <Link href={analyses.prev_page_url}>Previous</Link>
                            </Button>
                        )}
                        <span className="text-muted-foreground flex items-center text-sm">
                            Page {analyses.current_page} of {analyses.last_page}
                        </span>
                        {analyses.next_page_url && (
                            <Button variant="outline" size="sm" asChild>
                                <Link href={analyses.next_page_url}>Next</Link>
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

ContractsIndex.layout = {
    breadcrumbs: [{ title: 'Contract Analysis', href: contractsIndex.url() }],
};
