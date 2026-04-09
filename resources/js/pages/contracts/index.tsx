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
    low: 'bg-success/10 text-success',
    medium: 'bg-warning/10 text-warning-foreground',
    high: 'bg-destructive/10 text-destructive',
};

const statusColors: Record<string, string> = {
    pending: 'bg-muted text-muted-foreground',
    processing: 'bg-info/10 text-info',
    completed: 'bg-success/10 text-success',
    failed: 'bg-destructive/10 text-destructive',
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
