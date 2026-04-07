import { Link, usePage } from '@inertiajs/react';
import { BookOpen, FileText, FolderGit2, LayoutGrid, Library, MessageCircle, Search, Settings, ShieldCheck, Users, FileSearch, ClipboardList } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { dashboard as adminDashboard } from '@/routes/admin';
import { index as adminDocsIndex } from '@/routes/admin/documents';
import { index as adminSearchLogsIndex } from '@/routes/admin/search-logs';
import { index as adminTemplatesIndex } from '@/routes/admin/templates';
import { index as adminUsersIndex } from '@/routes/admin/users';
import { index as chatIndex } from '@/routes/chat';
import { index as contractsIndex } from '@/routes/contracts';
import { index as researchIndex } from '@/routes/research';
import { index as searchIndex } from '@/routes/search';
import { index as templatesIndex } from '@/routes/templates';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'AI Chat',
        href: chatIndex(),
        icon: MessageCircle,
    },
    {
        title: 'Legal Research',
        href: searchIndex(),
        icon: Search,
    },
    {
        title: 'Document Library',
        href: researchIndex.url(),
        icon: Library,
    },
    {
        title: 'Document Templates',
        href: templatesIndex.url(),
        icon: FileText,
    },
    {
        title: 'Contract Analysis',
        href: contractsIndex.url(),
        icon: ShieldCheck,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/mjohnnah-2024//laxpng',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://jethrotech.com.pg',
        icon: BookOpen,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'Admin Dashboard',
        href: adminDashboard.url(),
        icon: Settings,
    },
    {
        title: 'Manage Documents',
        href: adminDocsIndex.url(),
        icon: FileSearch,
    },
    {
        title: 'Manage Users',
        href: adminUsersIndex.url(),
        icon: Users,
    },
    {
        title: 'Manage Templates',
        href: adminTemplatesIndex.url(),
        icon: ClipboardList,
    },
    {
        title: 'Search Logs',
        href: adminSearchLogsIndex.url(),
        icon: Search,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props;
    const isAdmin = (auth as { user: { role?: string } })?.user?.role === 'admin';

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                {isAdmin && <NavMain items={adminNavItems} label="Administration" />}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
