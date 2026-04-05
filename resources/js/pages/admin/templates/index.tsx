import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { dashboard as adminDashboard } from '@/routes/admin';
import {
    index as templatesIndex,
    create as templatesCreate,
    edit as templatesEdit,
    destroy as templatesDestroy,
} from '@/routes/admin/templates';

interface Template {
    id: number;
    title: string;
    category: string;
    description: string | null;
    is_active: boolean;
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
        search?: string;
        category?: string;
    };
}

export default function AdminTemplatesIndex({ templates, categories, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [category, setCategory] = useState(filters.category ?? '');

    function applyFilters(overrides: Record<string, string | undefined> = {}) {
        router.get(templatesIndex.url(), {
            search: search || undefined,
            category: category || undefined,
            ...overrides,
        }, { preserveState: true });
    }

    function handleDelete(id: number, title: string) {
        if (!confirm(`Delete template "${title}"?`)) return;
        router.delete(templatesDestroy.url(id));
    }

    return (
        <>
            <Head title="Manage Templates" />
            <div className="mx-auto max-w-6xl p-4">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Manage Templates</h1>
                    <Link href={templatesCreate.url()}>
                        <Button size="sm">Create Template</Button>
                    </Link>
                </div>

                {/* Filters */}
                <div className="mb-6 flex flex-wrap gap-3">
                    <input
                        type="text"
                        placeholder="Search by title..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                        className="border-input bg-background ring-offset-background focus-visible:ring-ring rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                    />
                    <select
                        value={category}
                        onChange={(e) => {
                            setCategory(e.target.value);
                            applyFilters({ category: e.target.value || undefined });
                        }}
                        className="border-input bg-background rounded-md border px-3 py-2 text-sm"
                    >
                        <option value="">All Categories</option>
                        {categories.map((c) => (
                            <option key={c} value={c}>
                                {c.charAt(0).toUpperCase() + c.slice(1)}
                            </option>
                        ))}
                    </select>
                    <Button size="sm" onClick={() => applyFilters()}>
                        Search
                    </Button>
                </div>

                {/* Templates Table */}
                {templates.data.length === 0 ? (
                    <p className="text-muted-foreground py-12 text-center">No templates found.</p>
                ) : (
                    <div className="overflow-x-auto rounded-lg border">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50 border-b">
                                <tr>
                                    <th className="px-4 py-2 text-left font-medium">Title</th>
                                    <th className="px-4 py-2 text-left font-medium">Category</th>
                                    <th className="px-4 py-2 text-left font-medium">Status</th>
                                    <th className="px-4 py-2 text-left font-medium">Created</th>
                                    <th className="px-4 py-2 text-right font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {templates.data.map((template) => (
                                    <tr key={template.id} className="hover:bg-muted/30">
                                        <td className="px-4 py-2 font-medium">{template.title}</td>
                                        <td className="text-muted-foreground px-4 py-2 capitalize">{template.category}</td>
                                        <td className="px-4 py-2">
                                            <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${template.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'}`}>
                                                {template.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="text-muted-foreground px-4 py-2">
                                            {new Date(template.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-2 text-right">
                                            <Link href={templatesEdit.url(template.id)} className="text-primary mr-3 text-sm hover:underline">
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(template.id, template.title)}
                                                className="text-sm text-red-600 hover:underline dark:text-red-400"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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

AdminTemplatesIndex.layout = {
    breadcrumbs: [
        { title: 'Admin', href: adminDashboard.url() },
        { title: 'Templates', href: templatesIndex.url() },
    ],
};
