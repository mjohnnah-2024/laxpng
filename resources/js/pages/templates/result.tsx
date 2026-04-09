import { Head, Link } from '@inertiajs/react';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { index as templatesIndex, show as templatesShow } from '@/routes/templates';

interface Template {
    id: number;
    title: string;
    category: string;
}

interface Props {
    template: Template;
    fields: Record<string, string>;
    generatedContent: string;
}

export default function TemplatesResult({ template, fields, generatedContent }: Props) {
    const contentRef = useRef<HTMLDivElement>(null);

    function handleCopy() {
        if (contentRef.current) {
            navigator.clipboard.writeText(contentRef.current.innerText);
        }
    }

    function handlePrint() {
        const printWindow = window.open('', '_blank');

        if (printWindow) {
            printWindow.document.write(`
                <html>
                <head><title>${template.title}</title>
                <style>body { font-family: serif; padding: 2rem; line-height: 1.8; white-space: pre-wrap; }</style>
                </head>
                <body>${generatedContent.replace(/\n/g, '<br>')}</body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        }
    }

    return (
        <>
            <Head title={`Generated: ${template.title}`} />
            <div className="mx-auto max-w-3xl p-4">
                <Link href={templatesIndex.url()} className="text-muted-foreground hover:text-foreground mb-4 inline-block text-sm">
                    &larr; Back to Templates
                </Link>

                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-xl font-bold sm:text-2xl">Generated Document</h1>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleCopy}>
                            Copy
                        </Button>
                        <Button variant="outline" size="sm" onClick={handlePrint}>
                            Print
                        </Button>
                    </div>
                </div>

                <p className="text-muted-foreground mb-6 text-sm">
                    Based on template: <strong>{template.title}</strong>
                </p>

                {/* Generated Content */}
                <div
                    ref={contentRef}
                    className="rounded-lg border bg-card p-6"
                >
                    <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap text-sm leading-relaxed">
                        {generatedContent}
                    </div>
                </div>

                {/* Field Summary */}
                <div className="mt-6 rounded-lg border p-4">
                    <h2 className="mb-2 text-sm font-semibold">Values Used</h2>
                    <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                        {Object.entries(fields).map(([key, value]) => (
                            <div key={key}>
                                <dt className="text-muted-foreground font-medium">{key}</dt>
                                <dd>{value}</dd>
                            </div>
                        ))}
                    </dl>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Link href={templatesShow.url(template.id)}>
                        <Button variant="outline">Generate Again</Button>
                    </Link>
                    <Link href={templatesIndex.url()}>
                        <Button variant="outline">Browse Templates</Button>
                    </Link>
                </div>
            </div>
        </>
    );
}

TemplatesResult.layout = {
    breadcrumbs: [
        { title: 'Document Templates', href: '/templates' },
        { title: 'Generated Document', href: '#' },
    ],
};
