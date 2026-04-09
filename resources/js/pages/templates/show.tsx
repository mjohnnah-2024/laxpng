import { Head, Link, router } from '@inertiajs/react';
import type { FormEvent} from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { index as templatesIndex, generate as templatesGenerate } from '@/routes/templates';

interface Field {
    name: string;
    type: string;
    label: string;
}

interface Template {
    id: number;
    title: string;
    category: string;
    description: string | null;
    content: string;
    fields: Field[];
}

interface Props {
    template: Template;
    errors?: Record<string, string>;
}

const categoryLabels: Record<string, string> = {
    contract: 'Contract',
    affidavit: 'Affidavit',
    agreement: 'Agreement',
    notice: 'Notice',
    petition: 'Petition',
    lease: 'Lease',
    will: 'Will',
    power_of_attorney: 'Power of Attorney',
};

export default function TemplatesShow({ template, errors }: Props) {
    const [fields, setFields] = useState<Record<string, string>>(
        Object.fromEntries((template.fields ?? []).map((f) => [f.name, ''])),
    );
    const [processing, setProcessing] = useState(false);

    function updateField(name: string, value: string) {
        setFields((prev) => ({ ...prev, [name]: value }));
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setProcessing(true);
        router.post(templatesGenerate.url(template.id), { fields }, {
            onFinish: () => setProcessing(false),
        });
    }

    return (
        <>
            <Head title={template.title} />
            <div className="mx-auto max-w-3xl p-4">
                <Link href={templatesIndex.url()} className="text-muted-foreground hover:text-foreground mb-4 inline-block text-sm">
                    &larr; Back to Templates
                </Link>

                <div className="mb-6">
                    <span className="bg-secondary mb-2 inline-block rounded px-2 py-0.5 text-xs font-medium">
                        {categoryLabels[template.category] ?? template.category}
                    </span>
                    <h1 className="text-xl font-bold sm:text-2xl">{template.title}</h1>
                    {template.description && (
                        <p className="text-muted-foreground mt-1">{template.description}</p>
                    )}
                </div>

                {/* Template Preview */}
                <div className="mb-8 rounded-lg border p-4">
                    <h2 className="mb-2 text-sm font-semibold">Template Preview</h2>
                    <p className="text-muted-foreground line-clamp-6 whitespace-pre-wrap text-sm">{template.content}</p>
                </div>

                {/* Fill Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h2 className="text-lg font-semibold">Fill in the Details</h2>

                    {(template.fields ?? []).map((field) => (
                        <div key={field.name}>
                            <label htmlFor={field.name} className="mb-1 block text-sm font-medium">
                                {field.label}
                            </label>
                            {field.type === 'textarea' ? (
                                <textarea
                                    id={field.name}
                                    value={fields[field.name] ?? ''}
                                    onChange={(e) => updateField(field.name, e.target.value)}
                                    className="border-input bg-background ring-offset-background focus-visible:ring-ring w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                                    rows={3}
                                    required
                                />
                            ) : (
                                <input
                                    id={field.name}
                                    type={field.type === 'date' ? 'date' : 'text'}
                                    value={fields[field.name] ?? ''}
                                    onChange={(e) => updateField(field.name, e.target.value)}
                                    className="border-input bg-background ring-offset-background focus-visible:ring-ring w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                                    required
                                />
                            )}
                            {errors?.[`fields.${field.name}`] && (
                                <p className="mt-1 text-xs text-red-500">{errors[`fields.${field.name}`]}</p>
                            )}
                        </div>
                    ))}

                    <Button type="submit" disabled={processing} className="w-full">
                        {processing ? (
                            <>
                                <Spinner className="mr-2" /> Generating Document...
                            </>
                        ) : (
                            'Generate Document'
                        )}
                    </Button>
                </form>
            </div>
        </>
    );
}

TemplatesShow.layout = {
    breadcrumbs: [
        { title: 'Document Templates', href: '/templates' },
        { title: 'Fill Template', href: '#' },
    ],
};
