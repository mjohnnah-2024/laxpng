import { Head, Link } from '@inertiajs/react';
import { index as researchIndex } from '@/routes/research';

interface Citation {
    id: number;
    case_name: string | null;
    act_name: string | null;
    year: number | null;
    section: string | null;
    url: string | null;
}

interface Chunk {
    id: number;
    content: string;
    chunk_index: number;
    section_title: string | null;
}

interface Document {
    id: number;
    title: string;
    type: string;
    year: number | null;
    jurisdiction: string;
    source_url: string | null;
    status: string;
    created_at: string;
    chunks: Chunk[];
    citations: Citation[];
}

interface Props {
    document: Document;
}

const typeLabels: Record<string, string> = {
    act: 'Act',
    case_law: 'Case Law',
    regulation: 'Regulation',
    policy: 'Policy',
    guideline: 'Guideline',
    case: 'Case Law',
    constitution: 'Constitution',
};

export default function ResearchShow({ document }: Props) {
    return (
        <>
            <Head title={document.title} />
            <div className="mx-auto max-w-4xl p-4">
                <Link href={researchIndex.url()} className="text-muted-foreground hover:text-foreground mb-4 inline-block text-sm">
                    &larr; Back to Library
                </Link>

                {/* Document Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold">{document.title}</h1>
                    <div className="text-muted-foreground mt-2 flex flex-wrap gap-3 text-sm">
                        <span className="bg-secondary inline-block rounded px-2 py-0.5 text-xs font-medium">
                            {typeLabels[document.type] ?? document.type}
                        </span>
                        {document.year && <span>Year: {document.year}</span>}
                        <span>{document.jurisdiction}</span>
                    </div>
                    {document.source_url && (
                        <a
                            href={document.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary mt-2 inline-block text-sm hover:underline"
                        >
                            View original source &rarr;
                        </a>
                    )}
                </div>

                {/* Citations */}
                {document.citations.length > 0 && (
                    <div className="mb-8">
                        <h2 className="mb-3 text-lg font-semibold">Citations</h2>
                        <div className="space-y-2">
                            {document.citations.map((citation) => (
                                <div key={citation.id} className="rounded border p-3 text-sm">
                                    {citation.case_name && <p className="font-medium">{citation.case_name}</p>}
                                    {citation.act_name && <p className="font-medium">{citation.act_name}</p>}
                                    <div className="text-muted-foreground mt-1 flex gap-3">
                                        {citation.year && <span>{citation.year}</span>}
                                        {citation.section && <span>Section {citation.section}</span>}
                                    </div>
                                    {citation.url && (
                                        <a
                                            href={citation.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary mt-1 inline-block text-xs hover:underline"
                                        >
                                            Source link
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Chunks / Sections */}
                <div>
                    <h2 className="mb-3 text-lg font-semibold">
                        Document Sections ({document.chunks.length})
                    </h2>
                    {document.chunks.length === 0 ? (
                        <p className="text-muted-foreground">No sections available.</p>
                    ) : (
                        <div className="space-y-4">
                            {document.chunks.map((chunk) => (
                                <div key={chunk.id} className="rounded-lg border p-4">
                                    {chunk.section_title && (
                                        <h3 className="mb-2 text-sm font-semibold">{chunk.section_title}</h3>
                                    )}
                                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{chunk.content}</p>
                                    <p className="text-muted-foreground mt-2 text-xs">Section {chunk.chunk_index + 1}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

ResearchShow.layout = {
    breadcrumbs: [
        { title: 'Document Library', href: '/research' },
        { title: 'Document', href: '#' },
    ],
};
