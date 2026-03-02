"use client";

import { useConversation } from "@elevenlabs/react";
import { useState, useCallback } from "react";
import Link from "next/link";

export default function VoicePage() {
  const [error, setError] = useState<string | null>(null);

  const conversation = useConversation({
    onConnect: () => setError(null),
    onDisconnect: () => {},
    onError: (err: unknown) => {
      const msg = typeof err === "string" ? err : (err as Error)?.message ?? "Connection error";
      setError(msg);
    },
    onMessage: () => {},
  });

  const isConnected = conversation.status === "connected";
  const isConnecting = conversation.status === "connecting";
  const isSpeaking = conversation.isSpeaking;

  const startConversation = useCallback(async () => {
    try {
      setError(null);
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const res = await fetch("/api/convai/signed-url", { method: "POST" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to get signed URL");
      }

      const { signed_url } = await res.json();
      await conversation.startSession({ signedUrl: signed_url });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to connect";
      setError(msg);
    }
  }, [conversation]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  const handleOrbClick = () => {
    if (isConnected) {
      stopConversation();
    } else if (!isConnecting) {
      startConversation();
    }
  };

  const statusText = isConnecting
    ? "Connecting..."
    : isSpeaking
      ? "Speaking"
      : isConnected
        ? "Listening"
        : "Tap to speak";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] relative">
      {/* Back link */}
      <Link
        href="/"
        className="absolute top-6 left-6 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors text-sm"
      >
        &larr; Home
      </Link>

      {/* Orb */}
      <div className="relative flex items-center justify-center">
        {/* Outer ring */}
        {isConnected && (
          <div className="absolute w-48 h-48 rounded-full border border-[var(--accent)] opacity-20 orb-ring" />
        )}

        {/* Main orb button */}
        <button
          onClick={handleOrbClick}
          disabled={isConnecting}
          className={`
            w-32 h-32 rounded-full flex items-center justify-center
            transition-all duration-300 cursor-pointer
            ${isConnecting ? "bg-[var(--border)] cursor-wait" : ""}
            ${isConnected && isSpeaking ? "bg-[var(--accent)] orb-active" : ""}
            ${isConnected && !isSpeaking ? "bg-[var(--accent)] orb-pulse" : ""}
            ${!isConnected && !isConnecting ? "bg-[var(--accent)] hover:scale-105 orb-pulse" : ""}
          `}
        >
          {isConnecting ? (
            <svg className="animate-spin w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
            </svg>
          ) : isConnected ? (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          ) : (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          )}
        </button>
      </div>

      {/* Status text */}
      <p className="mt-8 text-[var(--muted)] text-lg">{statusText}</p>

      {/* Error */}
      {error && (
        <p className="mt-4 text-red-400 text-sm max-w-md text-center">{error}</p>
      )}

      {/* Label */}
      <p className="absolute bottom-8 text-[var(--border)] text-xs">
        Wybe OS Local &mdash; Qwen 3.5 + ElevenLabs
      </p>
    </div>
  );
}
