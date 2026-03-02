"use client";

import { useEffect, useRef, use } from "react";
import { useChat } from "@/hooks/use-chat";
import { ChatMessage } from "@/components/chat-message";
import { ChatInput } from "@/components/chat-input";

export default function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { messages, isStreaming, error, sendMessage, stop, loadMessages } =
    useChat({ conversationId: id });
  const scrollRef = useRef<HTMLDivElement>(null);
  const initialLoadRef = useRef(false);

  // Load existing messages
  useEffect(() => {
    if (id !== "new" && !initialLoadRef.current) {
      initialLoadRef.current = true;
      loadMessages(id);
    }
  }, [id, loadMessages]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center pt-32">
              <h2 className="text-xl font-medium mb-2">Start a conversation</h2>
              <p className="text-[var(--muted)] text-sm">
                Send a message to chat with Wybe, powered by Qwen 3.5.
              </p>
            </div>
          )}

          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              role={msg.role}
              content={msg.content}
              isStreaming={
                isStreaming &&
                msg.role === "assistant" &&
                msg === messages[messages.length - 1]
              }
            />
          ))}
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="px-6 py-2 bg-red-500/10 text-red-400 text-sm text-center">
          {error}
        </div>
      )}

      {/* Input */}
      <ChatInput
        onSend={sendMessage}
        onStop={stop}
        isStreaming={isStreaming}
      />
    </div>
  );
}
