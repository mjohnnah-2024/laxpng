import { Head, Link, router } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { index as contractsIndex, store as contractsStore } from '@/routes/contracts';

interface Props {
    errors?: Record<string, string>;
}

export default function ContractsCreate({ errors }: Props) {
    const [file, setFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        if (!file) {
            return;
        }

        const formData = new FormData();
        formData.append('document', file);

        setProcessing(true);
        router.post(contractsStore.url(), formData, {
            forceFormData: true,
            onFinish: () => setProcessing(false),
        });
    }

    return (
        <>
            <Head title="Upload Contract" />
            <div className="mx-auto max-w-2xl p-4">
                <Link href={contractsIndex.url()} className="text-muted-foreground hover:text-foreground mb-4 inline-block text-sm">
                    &larr; Back to Analyses
                </Link>

                <h1 className="mb-2 text-xl font-bold sm:text-2xl">Upload Contract for Analysis</h1>
                <p className="text-muted-foreground mb-6">
                    Upload a PDF document to analyze it for risks, key clauses, important dates, and recommendations.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="document" className="mb-2 block text-sm font-medium">
                            PDF Document
                        </label>
                        <input
                            id="document"
                            type="file"
                            accept=".pdf"
                            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                            className="border-input bg-background ring-offset-background focus-visible:ring-ring w-full rounded-md border px-3 py-2 text-sm file:mr-2 file:rounded file:border-0 file:bg-zinc-100 file:px-3 file:py-1 file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none dark:file:bg-zinc-800"
                        />
                        {errors?.document && (
                            <p className="mt-1 text-sm text-red-600">{errors.document}</p>
                        )}
                    </div>

                    {file && (
                        <div className="rounded-lg border p-3">
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-muted-foreground text-xs">
                                {(file.size / 1024).toFixed(1)} KB
                            </p>
                        </div>
                    )}

                    <Button type="submit" disabled={!file || processing} className="w-full">
                        {processing ? (
                            <>
                                <Spinner className="mr-2" />
                                Analyzing...
                            </>
                        ) : (
                            'Upload & Analyze'
                        )}
                    </Button>

                    {processing && (
                        <p className="text-muted-foreground text-center text-sm">
                            This may take a moment. The AI is analyzing your document for risks, clauses, and dates.
                        </p>
                    )}
                </form>
            </div>
        </>
    );
}

ContractsCreate.layout = {
    breadcrumbs: [
        { title: 'Contract Analysis', href: contractsIndex.url() },
        { title: 'Upload', href: '#' },
    ],
};
