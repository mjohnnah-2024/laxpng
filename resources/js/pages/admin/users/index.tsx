import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { dashboard as adminDashboard } from '@/routes/admin';
import { index as usersIndex, show as usersShow } from '@/routes/admin/users';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    email_verified_at: string | null;
    created_at: string;
}

interface Props {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
        next_page_url: string | null;
        prev_page_url: string | null;
    };
    filters: {
        search?: string;
        role?: string;
    };
    roles: string[];
}

const roleColors: Record<string, string> = {
    admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    lawyer: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    researcher: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    student: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
};

export default function UsersIndex({ users, filters, roles }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [role, setRole] = useState(filters.role ?? '');

    function applyFilters(overrides: Record<string, string | undefined> = {}) {
        const params: Record<string, string | undefined> = {
            search: search || undefined,
            role: role || undefined,
            ...overrides,
        };

        router.get(usersIndex.url(), params, { preserveState: true });
    }

    return (
        <>
            <Head title="Manage Users" />
            <div className="mx-auto max-w-6xl p-4">
                <h1 className="mb-6 text-xl font-bold sm:text-2xl">Manage Users</h1>

                {/* Filters */}
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                        className="border-input bg-background ring-offset-background focus-visible:ring-ring w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:w-auto"
                    />
                    <select
                        value={role}
                        onChange={(e) => {
                            setRole(e.target.value);
                            applyFilters({ role: e.target.value || undefined });
                        }}
                        className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm sm:w-auto"
                    >
                        <option value="">All Roles</option>
                        {roles.map((r) => (
                            <option key={r} value={r}>
                                {r.charAt(0).toUpperCase() + r.slice(1)}
                            </option>
                        ))}
                    </select>
                    <Button size="sm" onClick={() => applyFilters()}>
                        Search
                    </Button>
                </div>

                {/* Users Table */}
                {users.data.length === 0 ? (
                    <p className="text-muted-foreground py-12 text-center">No users found.</p>
                ) : (
                    <div className="overflow-x-auto rounded-lg border">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50 border-b">
                                <tr>
                                    <th className="px-4 py-2 text-left font-medium">Name</th>
                                    <th className="px-4 py-2 text-left font-medium">Email</th>
                                    <th className="px-4 py-2 text-left font-medium">Role</th>
                                    <th className="px-4 py-2 text-left font-medium">Verified</th>
                                    <th className="px-4 py-2 text-left font-medium">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {users.data.map((user) => (
                                    <tr key={user.id} className="hover:bg-muted/30">
                                        <td className="px-4 py-2">
                                            <Link href={usersShow.url(user.id)} className="text-primary font-medium hover:underline">
                                                {user.name}
                                            </Link>
                                        </td>
                                        <td className="text-muted-foreground px-4 py-2">{user.email}</td>
                                        <td className="px-4 py-2">
                                            <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize ${roleColors[user.role] ?? ''}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="text-muted-foreground px-4 py-2">
                                            {user.email_verified_at ? 'Yes' : 'No'}
                                        </td>
                                        <td className="text-muted-foreground px-4 py-2">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {users.last_page > 1 && (
                    <div className="mt-6 flex justify-center gap-2">
                        {users.prev_page_url && (
                            <Button variant="outline" size="sm" onClick={() => router.get(users.prev_page_url!)}>
                                Previous
                            </Button>
                        )}
                        <span className="text-muted-foreground flex items-center text-sm">
                            Page {users.current_page} of {users.last_page}
                        </span>
                        {users.next_page_url && (
                            <Button variant="outline" size="sm" onClick={() => router.get(users.next_page_url!)}>
                                Next
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

UsersIndex.layout = {
    breadcrumbs: [
        { title: 'Admin', href: adminDashboard.url() },
        { title: 'Users', href: usersIndex.url() },
    ],
};
