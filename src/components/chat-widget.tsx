"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import Link from "next/link";
import { MessageCircle, X, Send } from "lucide-react";
import { matchFaq } from "@/lib/chatbot-match";
import { logChatbotUnansweredQuestionAction } from "@/lib/actions/contact";

interface ChatMessage {
  id: number;
  from: "bot" | "user";
  text: React.ReactNode;
}

const GREETING =
  "Hi! I'm Wedyora's assistant. Ask me about booking, vendors, payments, or our policies — I'll do my best to help, 24/7.";

const FALLBACK = (
  <>
    I don&rsquo;t have a confident answer for that yet. Please reach our team
    directly through{" "}
    <Link href="/contact" className="underline font-semibold">
      Contact Us
    </Link>{" "}
    and we&rsquo;ll get back to you.
  </>
);

// A free, keyword-matched FAQ bot — not a paid AI API call (see
// src/lib/chatbot-match.ts for why). It only ever answers with text
// already published on /faq, and always offers a path to a real person
// for anything it can't confidently match.
export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 0, from: "bot", text: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [, startTransition] = useTransition();
  const listRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, open]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const question = input.trim();
    if (!question) return;

    const userMsg: ChatMessage = { id: nextId.current++, from: "user", text: question };
    const match = matchFaq(question);
    const botMsg: ChatMessage = {
      id: nextId.current++,
      from: "bot",
      text: match ? match.answer : FALLBACK,
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");

    if (!match) {
      startTransition(async () => {
        await logChatbotUnansweredQuestionAction(question);
      });
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-3 w-80 sm:w-96 rounded-2xl border border-brand-line bg-white shadow-2xl flex flex-col overflow-hidden">
          <div className="bg-brand-black text-white px-5 py-4 flex items-center justify-between">
            <div>
              <p className="font-heading font-semibold text-sm">Wedyora Assistant</p>
              <p className="text-xs text-white/60">Usually replies instantly</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="text-white/70 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div ref={listRef} className="flex flex-col gap-3 px-4 py-4 h-80 overflow-y-auto">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.from === "bot"
                    ? "self-start bg-brand-cream text-brand-black"
                    : "self-end bg-brand-button text-brand-black"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="border-t border-brand-line p-3 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question…"
              className="flex-1 rounded-full border border-brand-line px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
            />
            <button
              type="submit"
              aria-label="Send"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-button text-brand-black hover:bg-brand-button-dark transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-button text-brand-black shadow-lg hover:bg-brand-button-dark transition-colors"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
