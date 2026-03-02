"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface ConversationItem {
  id: string;
  title: string;
  updatedAt: number;
}

export function Sidebar() {
  const pathname = usePathname();
  const [conversations, setConversations] = useState<ConversationItem[]>([]);

  const loadConversations = async () => {
    try {
      const res = await fetch("/api/conversations");
      if (res.ok) {
        setConversations(await res.json());
      }
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    loadConversations();
    // Refresh every 5s
    const interval = setInterval(loadConversations, 5000);
    return () => clearInterval(interval);
  }, []);

  const createNew = async () => {
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create" }),
      });
      if (res.ok) {
        const conv = await res.json();
        window.location.href = `/chat/${conv.id}`;
      }
    } catch {
      // Ignore
    }
  };

  return (
    <div className="w-64 h-full bg-[#0f0f1a] border-r border-[var(--border)] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[var(--border)]">
        <Link href="/" className="text-lg font-bold">
          Wybe
        </Link>
      </div>

      {/* New chat button */}
      <div className="p-3">
        <button
          onClick={createNew}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border)] hover:bg-[var(--border)] transition-colors text-sm"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New conversation
        </button>
      </div>

      {/* Nav links */}
      <div className="px-3 pb-2">
        <Link
          href="/voice"
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
            pathname === "/voice" ? "bg-[var(--accent)]/20 text-[var(--accent)]" : "text-[var(--muted)] hover:text-[var(--foreground)]"
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          </svg>
          Voice mode
        </Link>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto px-3">
        {conversations.map((conv) => {
          const isActive = pathname === `/chat/${conv.id}`;
          return (
            <Link
              key={conv.id}
              href={`/chat/${conv.id}`}
              className={`block px-3 py-2 rounded-lg text-sm truncate mb-1 transition-colors ${
                isActive
                  ? "bg-[var(--accent-blue)]/20 text-[var(--foreground)]"
                  : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--border)]"
              }`}
            >
              {conv.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
