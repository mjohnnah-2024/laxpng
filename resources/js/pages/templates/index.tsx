import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { index as templatesIndex, show as templatesShow } from '@/routes/templates';

interface Template {
    id: number;
    title: string;
    category: string;
    description: string | null;
    created_at: string;
}

interface Props {
    templates: {
        data: Template[];
        current_page: number;
        last_page: number;
        next_page_url: string | null;
        prev_page_url: string | null;
    };
    categories: string[];
    filters: {
        category?: string;
    };
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

export default function TemplatesIndex({ templates, categories, filters }: Props) {
    const [category, setCategory] = useState(filters.category ?? '');

    function applyFilter(value: string) {
        setCategory(value);
        router.get(templatesIndex.url(), { category: value || undefined }, { preserveState: true });
    }

    return (
        <>
            <Head title="Document Templates" />
            <div className="mx-auto max-w-6xl p-4">
                <h1 className="mb-2 text-xl font-bold sm:text-2xl">Legal Document Templates</h1>
                <p className="text-muted-foreground mb-6">
                    Browse fillable legal document templates for Papua New Guinea. Select a template to fill in the details and generate your document.
                </p>

                {/* Category Filter */}
                <div className="mb-6 flex gap-2 flex-wrap">
                    <Button
                        variant={!category ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => applyFilter('')}
                    >
                        All
                    </Button>
                    {categories.map((cat) => (
                        <Button
                            key={cat}
                            variant={category === cat ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => applyFilter(cat)}
                        >
                            {categoryLabels[cat] ?? cat}
                        </Button>
                    ))}
                </div>

                {/* Templates Grid */}
                {templates.data.length === 0 ? (
                    <div className="text-muted-foreground py-12 text-center">
                        <p className="text-lg font-medium">No templates available</p>
                        <p className="mt-1 text-sm">Check back later for new templates.</p>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {templates.data.map((template) => (
                            <Link
                                key={template.id}
                                href={templatesShow.url(template.id)}
                                className="hover:border-primary/50 rounded-lg border p-4 transition-colors"
                            >
                                <span className="bg-secondary mb-2 inline-block rounded px-2 py-0.5 text-xs font-medium">
                                    {categoryLabels[template.category] ?? template.category}
                                </span>
                                <h3 className="font-semibold">{template.title}</h3>
                                {template.description && (
                                    <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">{template.description}</p>
                                )}
                            </Link>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {templates.last_page > 1 && (
                    <div className="mt-6 flex justify-center gap-2">
                        {templates.prev_page_url && (
                            <Button variant="outline" size="sm" onClick={() => router.get(templates.prev_page_url!)}>
                                Previous
                            </Button>
                        )}
                        <span className="text-muted-foreground flex items-center text-sm">
                            Page {templates.current_page} of {templates.last_page}
                        </span>
                        {templates.next_page_url && (
                            <Button variant="outline" size="sm" onClick={() => router.get(templates.next_page_url!)}>
                                Next
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

TemplatesIndex.layout = {
    breadcrumbs: [{ title: 'Document Templates', href: '/templates' }],
};
