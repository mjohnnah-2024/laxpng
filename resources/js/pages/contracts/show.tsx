import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { index as contractsIndex, create as contractsCreate } from '@/routes/contracts';

interface KeyClause {
    title: string;
    content: string;
    risk: string;
}

interface ImportantDate {
    description: string;
    date: string;
}

interface AnalysisResults {
    risk_level: string;
    summary: string;
    key_clauses: KeyClause[];
    important_dates: ImportantDate[];
    recommendations: string[];
    missing_clauses: string[];
    error?: string;
}

interface Analysis {
    id: number;
    document_name: string;
    status: string;
    created_at: string;
    results: AnalysisResults | null;
}

interface Props {
    analysis: Analysis;
}

const riskColors: Record<string, string> = {
    low: 'bg-success/10 text-success',
    medium: 'bg-warning/10 text-warning-foreground',
    high: 'bg-destructive/10 text-destructive',
};

const riskBorderColors: Record<string, string> = {
    low: 'border-l-success',
    medium: 'border-l-warning',
    high: 'border-l-destructive',
};

export default function ContractsShow({ analysis }: Props) {
    const results = analysis.results;

    return (
        <>
            <Head title={`Analysis: ${analysis.document_name}`} />
            <div className="mx-auto max-w-4xl p-4">
                <Link href={contractsIndex.url()} className="text-muted-foreground hover:text-foreground mb-4 inline-block text-sm">
                    &larr; Back to Analyses
                </Link>

                <div className="mb-6">
                    <h1 className="text-xl font-bold sm:text-2xl">{analysis.document_name}</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Analyzed on {new Date(analysis.created_at).toLocaleDateString()}
                    </p>
                </div>

                {analysis.status === 'processing' && (
                    <div className="rounded-lg border border-info/20 bg-info/10 p-6 text-center">
                        <p className="font-medium text-info">Analysis in progress...</p>
                        <p className="mt-1 text-sm text-info/80">
                            Please check back shortly.
                        </p>
                    </div>
                )}

                {analysis.status === 'failed' && (
                    <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-6">
                        <p className="font-medium text-destructive">Analysis Failed</p>
                        <p className="mt-1 text-sm text-destructive/80">
                            {results?.error ?? 'An unexpected error occurred. Please try uploading again.'}
                        </p>
                        <Link href={contractsCreate.url()} className="mt-3 inline-block">
                            <Button variant="outline" size="sm">Try Again</Button>
                        </Link>
                    </div>
                )}

                {analysis.status === 'completed' && results && !results.error && (
                    <div className="space-y-6">
                        {/* Risk Level & Summary */}
                        <div className="rounded-lg border p-6">
                            <div className="mb-4 flex items-center gap-3">
                                <h2 className="text-lg font-semibold">Overall Risk</h2>
                                <span
                                    className={`rounded px-3 py-1 text-sm font-semibold uppercase ${riskColors[results.risk_level] ?? ''}`}
                                >
                                    {results.risk_level}
                                </span>
                            </div>
                            <p className="text-muted-foreground text-sm leading-relaxed">{results.summary}</p>
                        </div>

                        {/* Key Clauses */}
                        {results.key_clauses.length > 0 && (
                            <div className="rounded-lg border p-6">
                                <h2 className="mb-4 text-lg font-semibold">
                                    Key Clauses ({results.key_clauses.length})
                                </h2>
                                <div className="space-y-3">
                                    {results.key_clauses.map((clause, i) => (
                                        <div
                                            key={i}
                                            className={`rounded-lg border border-l-4 p-4 ${riskBorderColors[clause.risk] ?? 'border-l-gray-500'}`}
                                        >
                                            <div className="mb-1 flex items-center gap-2">
                                                <h3 className="font-medium">{clause.title}</h3>
                                                <span
                                                    className={`rounded px-1.5 py-0.5 text-xs font-medium ${riskColors[clause.risk] ?? ''}`}
                                                >
                                                    {clause.risk}
                                                </span>
                                            </div>
                                            <p className="text-muted-foreground text-sm">{clause.content}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Important Dates */}
                        {results.important_dates.length > 0 && (
                            <div className="rounded-lg border p-6">
                                <h2 className="mb-4 text-lg font-semibold">
                                    Important Dates ({results.important_dates.length})
                                </h2>
                                <div className="space-y-2">
                                    {results.important_dates.map((d, i) => (
                                        <div key={i} className="flex items-start gap-3 rounded-lg border p-3">
                                            <span className="bg-secondary shrink-0 rounded px-2 py-0.5 text-xs font-medium">
                                                {d.date}
                                            </span>
                                            <p className="text-sm">{d.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Recommendations */}
                        {results.recommendations.length > 0 && (
                            <div className="rounded-lg border p-6">
                                <h2 className="mb-4 text-lg font-semibold">Recommendations</h2>
                                <ul className="space-y-2">
                                    {results.recommendations.map((rec, i) => (
                                        <li key={i} className="text-muted-foreground flex items-start gap-2 text-sm">
                                            <span className="mt-1 text-success">•</span>
                                            {rec}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Missing Clauses */}
                        {results.missing_clauses.length > 0 && (
                            <div className="rounded-lg border border-warning/20 bg-warning/10 p-6">
                                <h2 className="mb-4 text-lg font-semibold text-warning-foreground">
                                    Missing / Recommended Clauses
                                </h2>
                                <ul className="space-y-2">
                                    {results.missing_clauses.map((clause, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-warning-foreground">
                                            <span className="mt-1">⚠</span>
                                            {clause}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Link href={contractsCreate.url()}>
                        <Button variant="outline">Analyze Another Document</Button>
                    </Link>
                    <Link href={contractsIndex.url()}>
                        <Button variant="outline">View All Analyses</Button>
                    </Link>
                </div>
            </div>
        </>
    );
}

ContractsShow.layout = {
    breadcrumbs: [
        { title: 'Contract Analysis', href: contractsIndex.url() },
        { title: 'Results', href: '#' },
    ],
};
