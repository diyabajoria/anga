import { useLocation } from "@tanstack/react-router";
import {
  Bot,
  Briefcase,
  ChevronDown,
  Loader2,
  Send,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { answerWithRag, type RagSource } from "@/lib/ragAssistant";
import { getRole, getToken, isProfileComplete, type Role } from "@/lib/session";
import { useT } from "@/lib/i18n";

type Message = {
  id: number;
  role: "assistant" | "user";
  text: string;
  sources?: RagSource[];
  suggestions?: string[];
};

const hiddenPathPrefixes = [
  "/auth",
  "/role-selection",
  "/worker/setup",
  "/customer/setup",
  "/assistant",
  "/login",
  "/signup",
];

export function RagChatbot() {
  const location = useLocation();
  const { lang } = useT();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<Role>("worker");
  const [readyForAssistant, setReadyForAssistant] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => [welcomeMessage("en")]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const path = location.pathname;

  const isVisible = useMemo(() => {
    if (!readyForAssistant) return false;
    if (path === "/" || path === "/app") return false;
    if (hiddenPathPrefixes.some((prefix) => path.startsWith(prefix))) return false;
    return path.startsWith("/worker") || path.startsWith("/customer");
  }, [path, readyForAssistant]);

  useEffect(() => {
    const storedRole = getRole() ?? (path.startsWith("/customer") ? "customer" : "worker");
    setRole(storedRole);
    setReadyForAssistant(Boolean(getToken()) && isProfileComplete(storedRole));
  }, [path]);

  useEffect(() => {
    setMessages((current) => {
      if (current.length > 1) return current;
      return [welcomeMessage(lang)];
    });
  }, [lang]);

  useEffect(() => {
    if (!open) return;
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  if (!isVisible) return null;

  const ask = (value = input) => {
    const question = value.trim();
    if (!question || loading) return;

    setInput("");
    setLoading(true);
    setMessages((current) => [...current, { id: Date.now(), role: "user", text: question }]);

    window.setTimeout(() => {
      const result = answerWithRag(question, lang);
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: result.answer,
          sources: result.sources,
          suggestions: result.suggestions,
        },
      ]);
      setLoading(false);
    }, 250);
  };

  return (
    <div className="rag-assistant pointer-events-none fixed inset-x-0 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-50 mx-auto flex max-w-md justify-end px-4">
      <div className="pointer-events-auto">
        {open && (
          <section className="mb-3 w-[min(22.5rem,calc(100vw-2rem))] overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-2xl">
            <header className="flex items-center gap-3 bg-primary p-4 text-primary-foreground">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/15">
                <Bot className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-extrabold">Anga Rozgar Bot</p>
                <p className="truncate text-xs text-primary-foreground/80">
                  {role === "customer" ? "Hiring help" : "Job search help"} · RAG assistant
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
                aria-label="Close assistant"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div ref={scrollRef} className="max-h-[23rem] space-y-3 overflow-y-auto p-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} onSuggestion={ask} />
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="inline-flex items-center gap-2 rounded-2xl bg-muted px-3 py-2 text-sm font-semibold text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Searching Anga data
                  </div>
                </div>
              )}
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                ask();
              }}
              className="border-t border-border bg-background p-3"
            >
              <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 shadow-sm">
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                  placeholder={
                    lang === "hi"
                      ? "Jobs, workers ya safety poochiye"
                      : "Ask about jobs, workers or safety"
                  }
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
                  aria-label="Send question"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </section>
        )}

        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="rag-assistant-button relative grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground shadow-2xl transition hover:-translate-y-0.5 hover:bg-primary/90"
          aria-label={open ? "Collapse assistant" : "Open Anga assistant"}
        >
          {open ? <ChevronDown className="h-7 w-7" /> : <Bot className="h-7 w-7" />}
          {!open && (
            <span className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-accent text-[10px] font-extrabold text-accent-foreground ring-4 ring-background">
              AI
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

function ChatMessage({
  message,
  onSuggestion,
}: {
  message: Message;
  onSuggestion: (value: string) => void;
}) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[92%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
          isUser ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
        }`}
      >
        <p className="whitespace-pre-line">{message.text}</p>
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="mt-3 space-y-2">
            {message.sources.map((source) => (
              <SourceCard key={source.id} source={source} />
            ))}
          </div>
        )}
        {!isUser && message.suggestions && message.suggestions.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => onSuggestion(suggestion)}
                className="rounded-full bg-card px-2.5 py-1 text-left text-[11px] font-bold text-primary shadow-sm"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SourceCard({ source }: { source: RagSource }) {
  const Icon =
    source.type === "job"
      ? Briefcase
      : source.type === "worker"
        ? UserRound
        : source.type === "safety"
          ? ShieldCheck
          : Sparkles;

  return (
    <div className="rounded-2xl bg-card p-3 text-xs shadow-sm">
      <div className="flex gap-2">
        <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
          <Icon className="h-3.5 w-3.5" />
        </div>
        <div className="min-w-0">
          <p className="font-extrabold text-foreground">{source.title}</p>
          <p className="mt-1 line-clamp-2 text-muted-foreground">{source.body}</p>
          {source.actionTo && source.actionLabel && (
            <a
              href={source.actionTo}
              className="mt-2 inline-flex rounded-full bg-primary/10 px-2.5 py-1 font-bold text-primary"
            >
              {source.actionLabel}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function welcomeMessage(lang: "en" | "hi"): Message {
  return {
    id: 1,
    role: "assistant",
    text:
      lang === "hi"
        ? "Namaste! Main Anga ka personal assistant hoon. Main app ke jobs, workers, OTP, payment, safety aur profile info se jawab dunga."
        : "Hi! I am your Anga assistant. I answer using Anga jobs, workers, OTP, payment, safety and profile information.",
    suggestions:
      lang === "hi"
        ? ["Aaj ke jobs dikhao", "Verified worker kaise milega?", "Payment safe kaise rakhein?"]
        : ["Show today jobs", "How do I find verified workers?", "How do I keep payment safe?"],
  };
}
