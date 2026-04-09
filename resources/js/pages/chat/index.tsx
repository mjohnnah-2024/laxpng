import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { create as chatCreate, show as chatShow, destroy as chatDestroy } from '@/routes/chat';

interface Conversation {
    id: string;
    title: string;
    updated_at: string;
}

interface Props {
    conversations: {
        data: Conversation[];
        links: Record<string, string | null>[];
    };
}

export default function ChatIndex({ conversations }: Props) {
    function handleDelete(id: string) {
        if (confirm('Delete this conversation?')) {
            router.delete(chatDestroy.url(id));
        }
    }

    return (
        <>
            <Head title="AI Chat" />
            <div className="mx-auto max-w-4xl p-4">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-xl font-bold sm:text-2xl">AI Chat</h1>
                    <Link href={chatCreate.url()}>
                        <Button>New Conversation</Button>
                    </Link>
                </div>

                {conversations.data.length === 0 ? (
                    <div className="text-muted-foreground py-20 text-center">
                        <p className="text-lg font-medium">No conversations yet</p>
                        <p className="mt-2 text-sm">Start a new conversation to ask questions about PNG law.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {conversations.data.map((conversation) => (
                            <div key={conversation.id} className="flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                                <Link
                                    href={chatShow.url(conversation.id)}
                                    className="flex-1 hover:underline"
                                >
                                    <p className="font-medium">{conversation.title}</p>
                                    <p className="text-muted-foreground mt-1 text-sm">
                                        {new Date(conversation.updated_at).toLocaleDateString()}
                                    </p>
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDelete(conversation.id)}
                                    className="text-destructive hover:text-destructive"
                                >
                                    Delete
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

ChatIndex.layout = {
    breadcrumbs: [{ title: 'AI Chat', href: '/chat' }],
};
