import { Head, Link, router } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { dashboard as adminDashboard } from '@/routes/admin';
import { index as docsIndex, store as docsStore } from '@/routes/admin/documents';

interface Props {
    errors?: Record<string, string>;
}

export default function DocumentCreate({ errors }: Props) {
    const [title, setTitle] = useState('');
    const [type, setType] = useState('act');
    const [year, setYear] = useState('');
    const [jurisdiction, setJurisdiction] = useState('');
    const [sourceUrl, setSourceUrl] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('title', title);
        formData.append('type', type);
        if (year) formData.append('year', year);
        if (jurisdiction) formData.append('jurisdiction', jurisdiction);
        if (sourceUrl) formData.append('source_url', sourceUrl);
        formData.append('document', file);

        setProcessing(true);
        router.post(docsStore.url(), formData, {
            forceFormData: true,
            onFinish: () => setProcessing(false),
        });
    }

    return (
        <>
            <Head title="Upload Document" />
            <div className="mx-auto max-w-2xl p-4">
                <Link href={docsIndex.url()} className="text-muted-foreground hover:text-foreground mb-4 inline-block text-sm">
                    &larr; Back to Documents
                </Link>

                <h1 className="mb-6 text-2xl font-bold">Upload Legal Document</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="mb-1 block text-sm font-medium">Title</label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="border-input bg-background ring-offset-background focus-visible:ring-ring w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                        />
                        {errors?.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                    </div>

                    <div>
                        <label htmlFor="type" className="mb-1 block text-sm font-medium">Type</label>
                        <select
                            id="type"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                        >
                            <option value="act">Act</option>
                            <option value="regulation">Regulation</option>
                            <option value="case_law">Case Law</option>
                            <option value="constitution">Constitution</option>
                            <option value="policy">Policy</option>
                        </select>
                        {errors?.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label htmlFor="year" className="mb-1 block text-sm font-medium">Year (optional)</label>
                            <input
                                id="year"
                                type="number"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                min="1900"
                                max="2099"
                                className="border-input bg-background ring-offset-background focus-visible:ring-ring w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                            />
                            {errors?.year && <p className="mt-1 text-sm text-red-600">{errors.year}</p>}
                        </div>
                        <div>
                            <label htmlFor="jurisdiction" className="mb-1 block text-sm font-medium">Jurisdiction (optional)</label>
                            <input
                                id="jurisdiction"
                                type="text"
                                value={jurisdiction}
                                onChange={(e) => setJurisdiction(e.target.value)}
                                placeholder="e.g. National, NCD"
                                className="border-input bg-background ring-offset-background focus-visible:ring-ring w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                            />
                            {errors?.jurisdiction && <p className="mt-1 text-sm text-red-600">{errors.jurisdiction}</p>}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="source_url" className="mb-1 block text-sm font-medium">Source URL (optional)</label>
                        <input
                            id="source_url"
                            type="url"
                            value={sourceUrl}
                            onChange={(e) => setSourceUrl(e.target.value)}
                            className="border-input bg-background ring-offset-background focus-visible:ring-ring w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                        />
                        {errors?.source_url && <p className="mt-1 text-sm text-red-600">{errors.source_url}</p>}
                    </div>

                    <div>
                        <label htmlFor="document" className="mb-1 block text-sm font-medium">PDF Document</label>
                        <input
                            id="document"
                            type="file"
                            accept=".pdf"
                            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                            className="border-input bg-background ring-offset-background focus-visible:ring-ring w-full rounded-md border px-3 py-2 text-sm file:mr-2 file:rounded file:border-0 file:bg-zinc-100 file:px-3 file:py-1 file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none dark:file:bg-zinc-800"
                        />
                        {errors?.document && <p className="mt-1 text-sm text-red-600">{errors.document}</p>}
                    </div>

                    {file && (
                        <div className="rounded-lg border p-3">
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-muted-foreground text-xs">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                    )}

                    <Button type="submit" disabled={!file || !title || processing} className="w-full">
                        {processing ? (
                            <>
                                <Spinner className="mr-2" />
                                Uploading...
                            </>
                        ) : (
                            'Upload & Process'
                        )}
                    </Button>
                </form>
            </div>
        </>
    );
}

DocumentCreate.layout = {
    breadcrumbs: [
        { title: 'Admin', href: adminDashboard.url() },
        { title: 'Documents', href: docsIndex.url() },
        { title: 'Upload', href: '#' },
    ],
};
