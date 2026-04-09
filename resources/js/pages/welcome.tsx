import { Head, Link, usePage } from '@inertiajs/react';
import { BookOpen, FileText, MessageCircle, Scale, Search, ShieldCheck } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
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
            <div className="flex min-h-screen flex-col bg-background text-foreground">
                {/* Header */}
                <header className="w-full border-b border-border px-4 py-4 sm:px-6">
                    <div className="mx-auto flex max-w-6xl items-center justify-between">
                        <div className="flex items-center gap-2">
                            <AppLogoIcon className="h-6 w-6 text-primary" />
                            <span className="text-lg font-semibold">LaxPNG</span>
                        </div>
                        <nav className="flex items-center gap-2 sm:gap-4">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-block rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="inline-block rounded-md px-5 py-2 text-sm font-medium text-foreground hover:bg-muted"
                                    >
                                        Log in
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="inline-block rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
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
                <section className="flex flex-col items-center px-4 pt-12 pb-12 text-center sm:px-6 sm:pt-16 sm:pb-14 lg:pt-28 lg:pb-24">
                    <div className="mx-auto max-w-3xl">
                        <span className="mb-4 inline-block rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
                            AI-Powered Legal Research
                        </span>
                        <h1 className="mb-6 text-2xl leading-tight font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
                            Under active development,{' '}
                            <span className="text-primary">
                                PNG Law - Made Accessible
                            </span>
                        </h1>
                        <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:mb-10 sm:text-lg">
                            LaxPNG brings together AI and PNG&apos;s legal framework to help
                            lawyers, students, and researchers find answers faster. Search
                            legislation, analyse contracts, and generate legal documents — all
                            with traceable citations.
                        </p>
                        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-block rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                                >
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="inline-block rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                                        >
                                            Create Free Account
                                        </Link>
                                    )}
                                    <Link
                                        href={login()}
                                        className="inline-block rounded-md border border-border px-8 py-3 text-sm font-medium text-foreground hover:border-border/80"
                                    >
                                        Sign In
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="border-t border-border px-4 py-12 sm:px-6 sm:py-16 lg:py-24">
                    <div className="mx-auto max-w-6xl">
                        <div className="mb-8 text-center sm:mb-12">
                            <h2 className="mb-3 text-xl font-semibold sm:text-2xl lg:text-3xl">
                                Everything you need for PNG legal research
                            </h2>
                            <p className="text-muted-foreground">
                                Built specifically for Papua New Guinea&apos;s legal system.
                            </p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {features.map((feature) => (
                                <div
                                    key={feature.title}
                                    className="rounded-xl border border-border bg-card p-6"
                                >
                                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                        <feature.icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <h3 className="mb-2 text-base font-semibold">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm leading-relaxed text-muted-foreground">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="border-t border-border px-4 py-12 sm:px-6 sm:py-16 lg:py-24">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="mb-4 text-xl font-semibold sm:text-2xl lg:text-3xl">
                            Ready to streamline your legal research?
                        </h2>
                        <p className="mb-8 text-muted-foreground">
                            Join lawyers, law students, and researchers across Papua New
                            Guinea who are using LaxPNG to work smarter.
                        </p>
                        {!auth.user && canRegister && (
                            <Link
                                href={register()}
                                className="inline-block rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                            >
                                Get Started — It&apos;s Free
                            </Link>
                        )}
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-border px-4 py-6 sm:px-6 sm:py-8">
                    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-center text-sm text-muted-foreground sm:flex-row sm:text-left">
                        <div className="flex items-center gap-2">
                            <AppLogoIcon className="h-4 w-4 text-primary" />
                            <span>LaxPNG</span>
                        </div>
                        <p>&copy; {new Date().getFullYear()} LaxPNG. AI-powered legal research for Papua New Guinea.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
