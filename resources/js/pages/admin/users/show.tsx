import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { dashboard as adminDashboard } from '@/routes/admin';
import { index as usersIndex, show as usersShow, updateRole } from '@/routes/admin/users';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    email_verified_at: string | null;
    created_at: string;
    contract_analyses_count: number;
    search_logs_count: number;
}

interface Props {
    user: User;
    roles: string[];
}

const roleColors: Record<string, string> = {
    admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    lawyer: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    researcher: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    student: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
};

export default function UsersShow({ user, roles }: Props) {
    const [selectedRole, setSelectedRole] = useState(user.role);
    const [processing, setProcessing] = useState(false);

    function handleRoleChange() {
        if (selectedRole === user.role) return;

        setProcessing(true);
        router.patch(updateRole.url(user.id), { role: selectedRole }, {
            onFinish: () => setProcessing(false),
        });
    }

    return (
        <>
            <Head title={`User: ${user.name}`} />
            <div className="mx-auto max-w-3xl p-4">
                <Link href={usersIndex.url()} className="text-muted-foreground hover:text-foreground mb-4 inline-block text-sm">
                    &larr; Back to Users
                </Link>

                <h1 className="mb-6 text-xl font-bold sm:text-2xl">{user.name}</h1>

                <div className="space-y-6">
                    {/* User Details */}
                    <div className="rounded-lg border p-4">
                        <h2 className="mb-3 text-lg font-semibold">Details</h2>
                        <dl className="grid gap-3 sm:grid-cols-2">
                            <div>
                                <dt className="text-muted-foreground text-sm">Email</dt>
                                <dd className="font-medium">{user.email}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground text-sm">Role</dt>
                                <dd>
                                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize ${roleColors[user.role] ?? ''}`}>
                                        {user.role}
                                    </span>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground text-sm">Email Verified</dt>
                                <dd className="font-medium">{user.email_verified_at ? 'Yes' : 'No'}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground text-sm">Joined</dt>
                                <dd className="font-medium">{new Date(user.created_at).toLocaleDateString()}</dd>
                            </div>
                        </dl>
                    </div>

                    {/* Activity Stats */}
                    <div className="rounded-lg border p-4">
                        <h2 className="mb-3 text-lg font-semibold">Activity</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="bg-muted/30 rounded-lg p-3">
                                <p className="text-muted-foreground text-sm">Contract Analyses</p>
                                <p className="text-2xl font-bold">{user.contract_analyses_count}</p>
                            </div>
                            <div className="bg-muted/30 rounded-lg p-3">
                                <p className="text-muted-foreground text-sm">Search Queries</p>
                                <p className="text-2xl font-bold">{user.search_logs_count}</p>
                            </div>
                        </div>
                    </div>

                    {/* Change Role */}
                    <div className="rounded-lg border p-4">
                        <h2 className="mb-3 text-lg font-semibold">Change Role</h2>
                        <div className="flex items-end gap-3">
                            <div className="flex-1">
                                <label htmlFor="role" className="mb-1 block text-sm font-medium">
                                    Role
                                </label>
                                <select
                                    id="role"
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                    className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                                >
                                    {roles.map((r) => (
                                        <option key={r} value={r}>
                                            {r.charAt(0).toUpperCase() + r.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <Button
                                onClick={handleRoleChange}
                                disabled={selectedRole === user.role || processing}
                                size="sm"
                            >
                                {processing ? 'Updating...' : 'Update Role'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

UsersShow.layout = {
    breadcrumbs: [
        { title: 'Admin', href: adminDashboard.url() },
        { title: 'Users', href: usersIndex.url() },
        { title: 'User Details', href: '#' },
    ],
};
