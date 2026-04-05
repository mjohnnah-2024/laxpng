import { Head, Link, router } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { dashboard as adminDashboard } from '@/routes/admin';
import { index as templatesIndex, store as templatesStore } from '@/routes/admin/templates';

interface Field {
    name: string;
    type: string;
    label: string;
}

interface Props {
    errors?: Record<string, string>;
}

const fieldTypes = ['text', 'textarea', 'date', 'number'];

export default function AdminTemplatesCreate({ errors }: Props) {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [fields, setFields] = useState<Field[]>([{ name: '', type: 'text', label: '' }]);
    const [processing, setProcessing] = useState(false);

    function addField() {
        setFields([...fields, { name: '', type: 'text', label: '' }]);
    }

    function removeField(index: number) {
        setFields(fields.filter((_, i) => i !== index));
    }

    function updateField(index: number, key: keyof Field, value: string) {
        const updated = [...fields];
        updated[index] = { ...updated[index], [key]: value };
        setFields(updated);
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setProcessing(true);
        router.post(templatesStore.url(), {
            title,
            category,
            description: description || null,
            content,
            fields,
        }, {
            onFinish: () => setProcessing(false),
        });
    }

    return (
        <>
            <Head title="Create Template" />
            <div className="mx-auto max-w-3xl p-4">
                <Link href={templatesIndex.url()} className="text-muted-foreground hover:text-foreground mb-4 inline-block text-sm">
                    &larr; Back to Templates
                </Link>

                <h1 className="mb-6 text-2xl font-bold">Create Template</h1>

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
                        <label htmlFor="category" className="mb-1 block text-sm font-medium">Category</label>
                        <input
                            id="category"
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="e.g. contract, affidavit, agreement"
                            className="border-input bg-background ring-offset-background focus-visible:ring-ring w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                        />
                        {errors?.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                    </div>

                    <div>
                        <label htmlFor="description" className="mb-1 block text-sm font-medium">Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={2}
                            className="border-input bg-background ring-offset-background focus-visible:ring-ring w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                        />
                        {errors?.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                    </div>

                    <div>
                        <label htmlFor="content" className="mb-1 block text-sm font-medium">Template Content</label>
                        <p className="text-muted-foreground mb-1 text-xs">Use {'{{field_name}}'} placeholders for dynamic fields.</p>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={10}
                            className="border-input bg-background ring-offset-background focus-visible:ring-ring w-full rounded-md border px-3 py-2 font-mono text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                        />
                        {errors?.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
                    </div>

                    {/* Dynamic Fields */}
                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <label className="text-sm font-medium">Template Fields</label>
                            <Button type="button" variant="outline" size="sm" onClick={addField}>
                                Add Field
                            </Button>
                        </div>
                        {errors?.fields && <p className="mb-2 text-sm text-red-600">{errors.fields}</p>}

                        <div className="space-y-3">
                            {fields.map((field, i) => (
                                <div key={i} className="flex items-start gap-2 rounded-lg border p-3">
                                    <div className="flex-1 space-y-2">
                                        <input
                                            type="text"
                                            placeholder="Field name (e.g. party_name)"
                                            value={field.name}
                                            onChange={(e) => updateField(i, 'name', e.target.value)}
                                            className="border-input bg-background w-full rounded-md border px-2 py-1.5 text-sm"
                                        />
                                        {errors?.[`fields.${i}.name`] && (
                                            <p className="text-xs text-red-600">{errors[`fields.${i}.name`]}</p>
                                        )}
                                    </div>
                                    <div className="w-32">
                                        <select
                                            value={field.type}
                                            onChange={(e) => updateField(i, 'type', e.target.value)}
                                            className="border-input bg-background w-full rounded-md border px-2 py-1.5 text-sm"
                                        >
                                            {fieldTypes.map((t) => (
                                                <option key={t} value={t}>{t}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <input
                                            type="text"
                                            placeholder="Label (e.g. Party Name)"
                                            value={field.label}
                                            onChange={(e) => updateField(i, 'label', e.target.value)}
                                            className="border-input bg-background w-full rounded-md border px-2 py-1.5 text-sm"
                                        />
                                        {errors?.[`fields.${i}.label`] && (
                                            <p className="text-xs text-red-600">{errors[`fields.${i}.label`]}</p>
                                        )}
                                    </div>
                                    {fields.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeField(i)}
                                            className="mt-1 text-sm text-red-600 hover:underline"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button type="submit" disabled={processing} className="w-full">
                        {processing ? 'Creating...' : 'Create Template'}
                    </Button>
                </form>
            </div>
        </>
    );
}

AdminTemplatesCreate.layout = {
    breadcrumbs: [
        { title: 'Admin', href: adminDashboard.url() },
        { title: 'Templates', href: templatesIndex.url() },
        { title: 'Create', href: '#' },
    ],
};
