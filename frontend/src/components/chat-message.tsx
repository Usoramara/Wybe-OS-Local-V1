interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

export function ChatMessage({ role, content, isStreaming }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`
          max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap
          ${isUser
            ? "bg-[var(--accent-blue)] text-white rounded-br-md"
            : "bg-[#1a1a2e] text-[var(--foreground)] rounded-bl-md"
          }
        `}
      >
        {content}
        {isStreaming && !content && (
          <span className="inline-flex gap-1">
            <span className="w-1.5 h-1.5 bg-[var(--muted)] rounded-full animate-pulse" />
            <span className="w-1.5 h-1.5 bg-[var(--muted)] rounded-full animate-pulse [animation-delay:0.2s]" />
            <span className="w-1.5 h-1.5 bg-[var(--muted)] rounded-full animate-pulse [animation-delay:0.4s]" />
          </span>
        )}
      </div>
    </div>
  );
}
