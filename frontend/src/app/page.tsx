import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-2">Wybe</h1>
      <p className="text-[var(--muted)] mb-12">Local intelligence, your way.</p>

      <div className="flex gap-6">
        <Link
          href="/voice"
          className="flex flex-col items-center gap-3 p-8 rounded-2xl border border-[var(--border)] hover:border-[var(--accent)] transition-colors group"
        >
          <div className="w-16 h-16 rounded-full bg-[var(--accent)] flex items-center justify-center group-hover:shadow-[0_0_30px_rgba(124,58,237,0.4)] transition-shadow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          </div>
          <span className="font-medium">Voice</span>
          <span className="text-sm text-[var(--muted)]">Speak with Wybe</span>
        </Link>

        <Link
          href="/chat/new"
          className="flex flex-col items-center gap-3 p-8 rounded-2xl border border-[var(--border)] hover:border-[var(--accent-blue)] transition-colors group"
        >
          <div className="w-16 h-16 rounded-full bg-[var(--accent-blue)] flex items-center justify-center group-hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-shadow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <span className="font-medium">Chat</span>
          <span className="text-sm text-[var(--muted)]">Text with Wybe</span>
        </Link>
      </div>
    </div>
  );
}
