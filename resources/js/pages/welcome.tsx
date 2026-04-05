import { Head, Link, usePage } from '@inertiajs/react';
import { BookOpen, FileText, MessageCircle, Scale, Search, ShieldCheck } from 'lucide-react';
import { dashboard, login, register } from '@/routes';

const features = [
    {
        icon: MessageCircle,
        title: 'AI Legal Chat',
        description:
            'Ask legal questions in plain English and receive AI-powered answers grounded in PNG legislation, case law, and regulations.',
    },
    {
        icon: Search,
        title: 'Legal Research',
        description:
            'Search across Acts of Parliament, court decisions, and regulatory instruments with intelligent semantic search.',
    },
    {
        icon: BookOpen,
        title: 'Document Library',
        description:
            'Browse and explore a growing collection of PNG legal documents including the Constitution, criminal code, and more.',
    },
    {
        icon: FileText,
        title: 'Document Templates',
        description:
            'Generate legal documents from pre-built templates — affidavits, contracts, leases, and powers of attorney.',
    },
    {
        icon: ShieldCheck,
        title: 'Contract Analysis',
        description:
            'Upload contracts for AI-powered risk analysis, clause extraction, and compliance checking against PNG law.',
    },
    {
        icon: Scale,
        title: 'Traceable Answers',
        description:
            'Every AI response includes citations to source legislation and case law so you can verify the legal basis.',
    },
];

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="AI-Powered Legal Research for Papua New Guinea">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700"
                    rel="stylesheet"
                />
            </Head>
            <div className="flex min-h-screen flex-col bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
                {/* Header */}
                <header className="w-full border-b border-[#e3e3e0] px-6 py-4 dark:border-[#3E3E3A]">
                    <div className="mx-auto flex max-w-6xl items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Scale className="h-6 w-6 text-[#f53003] dark:text-[#FF4433]" />
                            <span className="text-lg font-semibold">LaxPNG</span>
                        </div>
                        <nav className="flex items-center gap-4">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-block rounded-md bg-[#1b1b18] px-5 py-2 text-sm font-medium text-white hover:bg-black dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:bg-white"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="inline-block rounded-md px-5 py-2 text-sm font-medium text-[#1b1b18] hover:bg-[#f5f5f3] dark:text-[#EDEDEC] dark:hover:bg-[#1C1C1A]"
                                    >
                                        Log in
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="inline-block rounded-md bg-[#1b1b18] px-5 py-2 text-sm font-medium text-white hover:bg-black dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:bg-white"
                                        >
                                            Get Started
                                        </Link>
                                    )}
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Hero */}
                <section className="flex flex-col items-center px-6 pt-20 pb-16 text-center lg:pt-28 lg:pb-24">
                    <div className="mx-auto max-w-3xl">
                        <span className="mb-4 inline-block rounded-full border border-[#e3e3e0] px-3 py-1 text-xs font-medium text-[#706f6c] dark:border-[#3E3E3A] dark:text-[#A1A09A]">
                            AI-Powered Legal Research
                        </span>
                        <h1 className="mb-6 text-4xl leading-tight font-bold tracking-tight lg:text-5xl">
                            Papua New Guinea Law,{' '}
                            <span className="text-[#f53003] dark:text-[#FF4433]">
                                Made Accessible
                            </span>
                        </h1>
                        <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-[#706f6c] dark:text-[#A1A09A]">
                            LaxPNG brings together AI and PNG&apos;s legal framework to help
                            lawyers, students, and researchers find answers faster. Search
                            legislation, analyse contracts, and generate legal documents — all
                            with traceable citations.
                        </p>
                        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-block rounded-md bg-[#1b1b18] px-8 py-3 text-sm font-medium text-white hover:bg-black dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:bg-white"
                                >
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="inline-block rounded-md bg-[#1b1b18] px-8 py-3 text-sm font-medium text-white hover:bg-black dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:bg-white"
                                        >
                                            Create Free Account
                                        </Link>
                                    )}
                                    <Link
                                        href={login()}
                                        className="inline-block rounded-md border border-[#19140035] px-8 py-3 text-sm font-medium text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                    >
                                        Sign In
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="border-t border-[#e3e3e0] px-6 py-16 lg:py-24 dark:border-[#3E3E3A]">
                    <div className="mx-auto max-w-6xl">
                        <div className="mb-12 text-center">
                            <h2 className="mb-3 text-2xl font-semibold lg:text-3xl">
                                Everything you need for PNG legal research
                            </h2>
                            <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                Built specifically for Papua New Guinea&apos;s legal system.
                            </p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {features.map((feature) => (
                                <div
                                    key={feature.title}
                                    className="rounded-xl border border-[#e3e3e0] bg-white p-6 dark:border-[#3E3E3A] dark:bg-[#161615]"
                                >
                                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#fff2f2] dark:bg-[#1D0002]">
                                        <feature.icon className="h-5 w-5 text-[#f53003] dark:text-[#FF4433]" />
                                    </div>
                                    <h3 className="mb-2 text-base font-semibold">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm leading-relaxed text-[#706f6c] dark:text-[#A1A09A]">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="border-t border-[#e3e3e0] px-6 py-16 lg:py-24 dark:border-[#3E3E3A]">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="mb-4 text-2xl font-semibold lg:text-3xl">
                            Ready to streamline your legal research?
                        </h2>
                        <p className="mb-8 text-[#706f6c] dark:text-[#A1A09A]">
                            Join lawyers, law students, and researchers across Papua New
                            Guinea who are using LaxPNG to work smarter.
                        </p>
                        {!auth.user && canRegister && (
                            <Link
                                href={register()}
                                className="inline-block rounded-md bg-[#1b1b18] px-8 py-3 text-sm font-medium text-white hover:bg-black dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:bg-white"
                            >
                                Get Started — It&apos;s Free
                            </Link>
                        )}
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-[#e3e3e0] px-6 py-8 dark:border-[#3E3E3A]">
                    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-[#706f6c] sm:flex-row dark:text-[#A1A09A]">
                        <div className="flex items-center gap-2">
                            <Scale className="h-4 w-4" />
                            <span>LaxPNG</span>
                        </div>
                        <p>&copy; {new Date().getFullYear()} LaxPNG. AI-powered legal research for Papua New Guinea.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
