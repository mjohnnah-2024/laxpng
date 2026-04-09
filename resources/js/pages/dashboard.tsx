import { Head, Link, usePage } from '@inertiajs/react';
import { FileText, MessageCircle, Search, ShieldCheck, Clock, ArrowRight, Activity, Library } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { dashboard } from '@/routes';
import { index as chatIndex } from '@/routes/chat';
import { index as searchIndex } from '@/routes/search';
import { index as templatesIndex } from '@/routes/templates';
import { index as contractsIndex } from '@/routes/contracts';

interface RecentSearch {
    id: number;
    query: string;
    results_count: number;
    response_time_ms: number;
    created_at: string;
}

interface RecentAnalysis {
    id: number;
    document_name: string;
    status: string;
    created_at: string;
}

interface DashboardProps {
    stats: {
        searches: number;
        analyses: number;
        documents: number;
        templates: number;
    };
    recentSearches: RecentSearch[];
    recentAnalyses: RecentAnalysis[];
}

const quickActions = [
    { title: 'AI Chat', description: 'Ask legal questions', href: chatIndex(), icon: MessageCircle },
    { title: 'Legal Research', description: 'Search PNG law', href: searchIndex(), icon: Search },
    { title: 'Document Templates', description: 'Generate documents', href: templatesIndex.url(), icon: FileText },
    { title: 'Contract Analysis', description: 'Analyse contracts', href: contractsIndex.url(), icon: ShieldCheck },
];

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-PG', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function Dashboard({ stats, recentSearches, recentAnalyses }: DashboardProps) {
    const { auth } = usePage().props;
    const user = (auth as { user: { name: string } }).user;

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4 sm:gap-6">
                {/* Welcome */}
                <div>
                    <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Welcome back, {user.name.split(' ')[0]}</h1>
                    <p className="text-muted-foreground">Here's an overview of your legal research activity.</p>
                </div>

                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardDescription>My Searches</CardDescription>
                            <Search className="text-muted-foreground size-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.searches}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardDescription>My Analyses</CardDescription>
                            <ShieldCheck className="text-muted-foreground size-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.analyses}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardDescription>Available Documents</CardDescription>
                            <Library className="text-muted-foreground size-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.documents}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardDescription>Active Templates</CardDescription>
                            <FileText className="text-muted-foreground size-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.templates}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div>
                    <h2 className="mb-3 text-lg font-semibold">Quick Actions</h2>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {quickActions.map((action) => (
                            <Link key={action.title} href={action.href} className="group">
                                <Card className="transition-colors group-hover:border-primary/50">
                                    <CardContent className="flex items-center gap-3 pt-0">
                                        <div className="bg-primary/10 text-primary rounded-lg p-2">
                                            <action.icon className="size-5" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium">{action.title}</div>
                                            <div className="text-muted-foreground text-xs">{action.description}</div>
                                        </div>
                                        <ArrowRight className="text-muted-foreground size-4 transition-transform group-hover:translate-x-0.5" />
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Recent Searches */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Recent Searches</CardTitle>
                                <Link href={searchIndex()} className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                                    View all
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {recentSearches.length === 0 ? (
                                <p className="text-muted-foreground py-4 text-center text-sm">No searches yet. Start by searching PNG law.</p>
                            ) : (
                                <div className="space-y-3">
                                    {recentSearches.map((search) => (
                                        <div key={search.id} className="flex items-start justify-between gap-2 border-b pb-3 last:border-0 last:pb-0">
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium">{search.query}</p>
                                                <div className="text-muted-foreground flex items-center gap-2 text-xs">
                                                    <span>{search.results_count} results</span>
                                                    <span>&middot;</span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="size-3" />
                                                        {search.response_time_ms}ms
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="text-muted-foreground shrink-0 text-xs">{formatDate(search.created_at)}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Analyses */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Recent Analyses</CardTitle>
                                <Link href={contractsIndex.url()} className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                                    View all
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {recentAnalyses.length === 0 ? (
                                <p className="text-muted-foreground py-4 text-center text-sm">No analyses yet. Upload a contract to get started.</p>
                            ) : (
                                <div className="space-y-3">
                                    {recentAnalyses.map((analysis) => (
                                        <div key={analysis.id} className="flex items-center justify-between gap-2 border-b pb-3 last:border-0 last:pb-0">
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium">{analysis.document_name}</p>
                                                <span className="text-muted-foreground text-xs">{formatDate(analysis.created_at)}</span>
                                            </div>
                                            <Badge variant={analysis.status === 'completed' ? 'default' : analysis.status === 'pending' ? 'secondary' : 'destructive'}>
                                                {analysis.status}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
