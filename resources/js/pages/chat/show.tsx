import { Head, Link, router } from '@inertiajs/react';
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { send as chatSend } from '@/routes/chat';
import { index as chatIndex } from '@/routes/chat';

interface Message {
    id?: string;
    role: string;
    content: string;
    created_at?: string;
}

interface Props {
    conversationId: string | null;
    conversationTitle?: string;
    messages: Message[];
}

export default function ChatShow({ conversationId: initialConversationId, conversationTitle, messages: initialMessages }: Props) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [input, setInput] = useState('');
    const [streaming, setStreaming] = useState(false);
    const [conversationId, setConversationId] = useState<string | null>(initialConversationId);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const abortRef = useRef<AbortController | null>(null);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        const query = input.trim();
        if (!query || streaming) return;

        setInput('');
        setMessages((prev) => [...prev, { role: 'user', content: query }]);
        setStreaming(true);

        // Add a placeholder assistant message
        setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

        try {
            const controller = new AbortController();
            abortRef.current = controller;

            const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content
                ?? document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] ?? '';

            const response = await fetch(chatSend.url(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'text/event-stream',
                    'X-CSRF-TOKEN': decodeURIComponent(csrfToken),
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({
                    query,
                    conversation_id: conversationId,
                }),
                signal: controller.signal,
                credentials: 'same-origin',
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) throw new Error('No response body');

            let buffer = '';
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() ?? '';

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') continue;

                        try {
                            const parsed = JSON.parse(data);

                            if (parsed.type === 'conversation_id' && parsed.conversation_id) {
                                setConversationId(parsed.conversation_id);
                            }

                            if (parsed.type === 'text_delta' && parsed.delta !== undefined) {
                                setMessages((prev) => {
                                    const updated = [...prev];
                                    const last = updated[updated.length - 1];
                                    if (last && last.role === 'assistant') {
                                        updated[updated.length - 1] = { ...last, content: last.content + parsed.delta };
                                    }
                                    return updated;
                                });
                            }
                        } catch {
                            // Non-JSON data, skip
                        }
                    }
                }
            }
        } catch (err) {
            if (err instanceof DOMException && err.name === 'AbortError') return;
            setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last && last.role === 'assistant' && !last.content) {
                    updated[updated.length - 1] = { ...last, content: 'Sorry, an error occurred. Please try again.' };
                }
                return updated;
            });
        } finally {
            setStreaming(false);
            abortRef.current = null;
        }
    }

    function handleNewChat() {
        router.visit('/chat/new');
    }

    return (
        <>
            <Head title={conversationTitle ?? 'AI Chat'} />
            <div className="flex h-full flex-col">
                {/* Header */}
                <div className="flex items-center justify-between border-b px-4 py-3">
                    <div className="flex items-center gap-3">
                        <Link href={chatIndex.url()} className="text-muted-foreground hover:text-foreground text-sm">
                            &larr; Conversations
                        </Link>
                        <h1 className="text-lg font-semibold">{conversationTitle ?? 'New Conversation'}</h1>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleNewChat}>
                        New Chat
                    </Button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="mx-auto max-w-3xl space-y-4">
                        {messages.length === 0 && (
                            <div className="text-muted-foreground py-20 text-center">
                                <p className="text-lg font-medium">Welcome to LaxPNG AI Chat</p>
                                <p className="mt-2 text-sm">
                                    Ask questions about Papua New Guinea law. Your conversation history is saved automatically.
                                </p>
                            </div>
                        )}

                        {messages.map((message, i) => (
                            <div
                                key={message.id ?? i}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-lg px-4 py-3 ${
                                        message.role === 'user'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted'
                                    }`}
                                >
                                    {message.role === 'assistant' && !message.content && streaming ? (
                                        <Spinner className="size-4" />
                                    ) : (
                                        <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                                    )}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input */}
                <div className="border-t p-4">
                    <form onSubmit={handleSubmit} className="mx-auto flex max-w-3xl gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask a legal question..."
                            disabled={streaming}
                            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex-1 rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:opacity-50"
                        />
                        <Button type="submit" disabled={streaming || !input.trim()}>
                            {streaming ? <Spinner className="size-4" /> : 'Send'}
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}

ChatShow.layout = {
    breadcrumbs: [
        { title: 'AI Chat', href: '/chat' },
        { title: 'Conversation', href: '#' },
    ],
};
