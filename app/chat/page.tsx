"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, isToolUIPart } from "ai";
import { useState, useRef, useEffect, useMemo } from "react";
import { SharedHeader } from "@/components/shared-header";
import { Button } from "@/components/ui/button";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  MessageCircle,
  Send,
  Square,
  Search,
  Globe,
  Loader2,
  Sparkles,
  ExternalLink,
  Bot,
  User,
} from "lucide-react";

const SUGGESTIONS = [
  "What is an ISI mark?",
  "Which standards are mandatory for food products?",
  "Search BIS website for helmet standards",
  "What is the Open Standards Summit?",
  "How does BIS certification work?",
  "Tell me about IS 15885",
];

export default function ChatPage() {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isActive = status === "submitted" || status === "streaming";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isActive) return;
    sendMessage({ text: input });
    setInput("");
  };

  const handleSuggestion = (text: string) => {
    sendMessage({ text });
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <SharedHeader />

      <main className="flex-1 flex flex-col overflow-hidden mx-auto w-full max-w-3xl">
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-1">
          {messages.length === 0 ? (
            <EmptyState onSuggestion={handleSuggestion} />
          ) : (
            messages.map((message) => (
              <div key={message.id} className="animate-fade-up">
                {message.role === "user" ? (
                  <UserBubble
                    parts={message.parts}
                  />
                ) : (
                  <AssistantBubble
                    parts={message.parts}
                  />
                )}
              </div>
            ))
          )}

          {status === "submitted" && (
            <div className="flex items-center gap-2 px-1 py-3 animate-fade-up">
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium tracking-wide">
                <Loader2 className="size-3.5 animate-spin text-accent" />
                Thinking...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="border-t border-border/50 bg-background/95 backdrop-blur-sm px-4 sm:px-6 py-4">
          {messages.length > 0 && !isActive && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {SUGGESTIONS.slice(0, 3).map((s) => (
                <button
                  key={s}
                  onClick={() => handleSuggestion(s)}
                  className="px-2.5 py-1 rounded-full bg-muted/50 text-[10px] font-medium tracking-wide text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about BIS standards, ISI marks, certification..."
              disabled={isActive}
              className="flex-1 h-10 px-4 text-xs bg-transparent rounded-lg border border-border focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/20 placeholder:text-muted-foreground/30 disabled:opacity-50 transition-colors"
            />
            {isActive ? (
              <Button
                type="button"
                onClick={() => stop()}
                variant="outline"
                className="size-10 p-0 rounded-lg shrink-0"
              >
                <Square className="size-3.5" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={!input.trim()}
                className="size-10 p-0 rounded-lg shrink-0"
              >
                <Send className="size-3.5" />
              </Button>
            )}
          </form>
          <p className="text-[10px] text-muted-foreground/30 text-center mt-2 tracking-wide">
            AI assistant with live web search via Parallel AI. Answers may not be
            fully accurate.
          </p>
        </div>
      </main>
    </div>
  );
}

function EmptyState({
  onSuggestion,
}: {
  onSuggestion: (text: string) => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 py-12">
      <div className="space-y-4 text-center animate-fade-up">
        <div className="size-14 rounded-xl border border-accent/20 bg-accent/5 flex items-center justify-center mx-auto">
          <Sparkles className="size-6 text-accent" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold tracking-tight">
            BIS Standards Assistant
          </h1>
          <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
            Ask questions about Indian Standards, ISI marks, BIS certification,
            or the Open Standards Summit. I can search the web for the latest
            information.
          </p>
        </div>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md animate-fade-up"
        style={{ animationDelay: "100ms" }}
      >
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onSuggestion(s)}
            className="flex items-start gap-2.5 p-3 rounded-lg border border-border/50 bg-background hover:bg-accent/5 hover:border-accent/20 text-left transition-colors group"
          >
            <MessageCircle className="size-3.5 text-muted-foreground/50 mt-0.5 shrink-0 group-hover:text-accent transition-colors" />
            <span className="text-[11px] text-muted-foreground font-medium leading-relaxed group-hover:text-foreground transition-colors">
              {s}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function UserBubble({ parts }: { parts: any[] }) {
  return (
    <div className="flex justify-end py-2">
      <div className="flex items-start gap-2.5 max-w-[85%]">
        <div className="rounded-lg bg-accent/10 border border-accent/20 px-4 py-2.5">
          {parts.map((part, i) =>
            part.type === "text" ? (
              <p
                key={i}
                className="text-xs leading-relaxed whitespace-pre-wrap"
              >
                {part.text}
              </p>
            ) : null
          )}
        </div>
        <div className="size-6 rounded-md bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 mt-0.5">
          <User className="size-3 text-accent" />
        </div>
      </div>
    </div>
  );
}

const mdComponents: Components = {
  h1: ({ children }) => (
    <h1 className="text-base font-bold tracking-tight mt-4 mb-2 first:mt-0">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-sm font-bold tracking-tight mt-4 mb-1.5 first:mt-0">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xs font-semibold mt-3 mb-1 first:mt-0">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="text-xs leading-relaxed mb-2 last:mb-0">{children}</p>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-accent underline underline-offset-2 hover:text-accent/80 transition-colors"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-outside pl-4 mb-2 space-y-0.5">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-outside pl-4 mb-2 space-y-0.5">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="text-xs leading-relaxed">{children}</li>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  code: ({ children, className }) => {
    const isBlock = className?.includes("language-");
    if (isBlock) {
      return (
        <code className="block bg-muted/40 border border-border/50 rounded-md px-3 py-2 text-[11px] font-mono overflow-x-auto whitespace-pre mb-2">
          {children}
        </code>
      );
    }
    return (
      <code className="text-accent bg-accent/10 px-1 py-0.5 rounded text-[11px] font-mono">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="mb-2 overflow-x-auto">{children}</pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-accent/30 pl-3 my-2 text-muted-foreground italic">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="border-border/50 my-3" />,
  table: ({ children }) => (
    <div className="overflow-x-auto mb-2 rounded-md border border-border/50">
      <table className="w-full text-[11px]">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-muted/30 border-b border-border/50">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="px-2.5 py-1.5 text-left font-semibold text-foreground">{children}</th>
  ),
  td: ({ children }) => (
    <td className="px-2.5 py-1.5 border-t border-border/30">{children}</td>
  ),
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function AssistantBubble({ parts }: { parts: any[] }) {
  const fullText = useMemo(
    () => parts.filter((p) => p.type === "text").map((p) => p.text).join(""),
    [parts]
  );
  const toolParts = useMemo(
    () => parts.filter((p) => isToolUIPart(p)),
    [parts]
  );

  return (
    <div className="flex justify-start py-2">
      <div className="flex items-start gap-2.5 max-w-[85%]">
        <div className="size-6 rounded-md bg-foreground/5 border border-border flex items-center justify-center shrink-0 mt-0.5">
          <Bot className="size-3 text-muted-foreground" />
        </div>
        <div className="space-y-2 min-w-0">
          {toolParts.map((part, i) => (
            <ToolCallCard key={`tool-${i}`} part={part} />
          ))}
          {fullText && (
            <div className="max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={mdComponents}
              >
                {fullText}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ToolCallCard({ part }: { part: any }) {
  const toolName = part.toolName ?? (part.type as string).replace("tool-", "");
  const isSearch = toolName === "searchWeb";
  const isExtract = toolName === "extractPage";
  const isDone = part.state === "output-available";
  const isRunning =
    part.state === "input-available" || part.state === "input-streaming";

  const Icon = isSearch ? Search : isExtract ? Globe : Sparkles;
  const label = isSearch
    ? "Web Search"
    : isExtract
      ? "Page Extract"
      : part.toolName;

  return (
    <div className="rounded-lg border border-border/50 bg-muted/20 overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2">
        {isRunning ? (
          <Loader2 className="size-3 animate-spin text-accent" />
        ) : (
          <Icon className="size-3 text-accent" />
        )}
        <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
          {label}
        </span>
        {isDone && (
          <span className="text-[10px] font-mono text-verified tracking-wide ml-auto">
            DONE
          </span>
        )}
      </div>

      {isSearch && isDone && part.output && Array.isArray(part.output) && (
        <div className="border-t border-border/30 divide-y divide-border/30">
          {part.output
            .slice(0, 4)
            .map(
              (
                result: { title?: string; url?: string },
                idx: number
              ) => (
                <div key={idx} className="px-3 py-1.5 flex items-center gap-2">
                  <ExternalLink className="size-2.5 text-muted-foreground/40 shrink-0" />
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-muted-foreground hover:text-accent truncate transition-colors"
                  >
                    {result.title || result.url}
                  </a>
                </div>
              )
            )}
        </div>
      )}

      {isExtract && isDone && part.output && (
        <div className="border-t border-border/30 px-3 py-1.5">
          <a
            href={part.output.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[10px] text-muted-foreground hover:text-accent transition-colors"
          >
            <ExternalLink className="size-2.5 shrink-0" />
            <span className="truncate">
              {part.output.title || part.output.url || "Page extracted"}
            </span>
          </a>
        </div>
      )}

      {isRunning && (
        <div className="border-t border-border/30 px-3 py-1.5">
          <p className="text-[10px] text-muted-foreground/60 tracking-wide">
            {isSearch
              ? "Searching the web..."
              : "Reading page content..."}
          </p>
        </div>
      )}
    </div>
  );
}
