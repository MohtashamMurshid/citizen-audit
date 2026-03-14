"use client";

import { useState, useMemo } from "react";
import { SharedHeader } from "@/components/shared-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  STANDARDS,
  CATEGORIES,
  type BISStandard,
  type StandardCategory,
} from "@/lib/standards-data";
import {
  BookOpen,
  Search,
  ShieldCheck,
  ShieldAlert,
  X,
  ExternalLink,
  Scan,
  Link2,
  ArrowRight,
  Hash,
  Calendar,
  Layers,
  FileText,
} from "lucide-react";
import Link from "next/link";

export default function StandardsPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<StandardCategory | null>(
    null
  );
  const [selected, setSelected] = useState<BISStandard | null>(null);

  const filtered = useMemo(() => {
    let results = STANDARDS;

    if (activeCategory) {
      results = results.filter((s) => s.category === activeCategory);
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      results = results.filter(
        (s) =>
          s.id.toLowerCase().includes(q) ||
          s.title.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q)
      );
    }

    return results;
  }, [query, activeCategory]);

  const mandatoryCount = STANDARDS.filter((s) => s.mandatory).length;

  return (
    <div className="min-h-screen bg-background">
      <SharedHeader />

      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 animate-fade-up">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-3.5 py-1.5 text-[11px] font-medium tracking-wide text-accent">
              <BookOpen className="size-3.5" />
              BIS Database
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Standards Explorer
            </h1>
            <p className="text-sm text-muted-foreground">
              Browse Indian Standards (IS) used in product certification across
              the country
            </p>
          </div>
          <Link href="/scan">
            <Button className="text-[11px] font-medium tracking-wide h-9 px-5 shrink-0 rounded-lg">
              <Scan className="size-3.5 mr-1.5" />
              Scan Product
              <ArrowRight className="size-3 ml-1.5 opacity-50" />
            </Button>
          </Link>
        </div>

        {/* Stats banner */}
        <div
          className="grid grid-cols-3 gap-px bg-border/50 rounded-lg overflow-hidden animate-fade-up"
          style={{ animationDelay: "80ms" }}
        >
          <div className="flex flex-col items-center gap-1.5 bg-background p-4 sm:p-5">
            <FileText className="size-4 text-muted-foreground/50" />
            <span className="text-2xl font-bold tabular-nums tracking-tight">
              {STANDARDS.length}
            </span>
            <span className="text-[11px] text-muted-foreground font-medium tracking-wide">
              Standards
            </span>
          </div>
          <div className="flex flex-col items-center gap-1.5 bg-background p-4 sm:p-5">
            <ShieldCheck className="size-4 text-verified/70" />
            <span className="text-2xl font-bold tabular-nums tracking-tight text-verified">
              {mandatoryCount}
            </span>
            <span className="text-[11px] text-muted-foreground font-medium tracking-wide">
              Mandatory
            </span>
          </div>
          <div className="flex flex-col items-center gap-1.5 bg-background p-4 sm:p-5">
            <Layers className="size-4 text-accent/70" />
            <span className="text-2xl font-bold tabular-nums tracking-tight text-accent">
              {CATEGORIES.length}
            </span>
            <span className="text-[11px] text-muted-foreground font-medium tracking-wide">
              Categories
            </span>
          </div>
        </div>

        {/* Search + filters */}
        <div
          className="space-y-4 animate-fade-up"
          style={{ animationDelay: "150ms" }}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/50" />
            <Input
              placeholder="Search by standard number, title, or category..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-10 pl-9 pr-9 text-xs bg-transparent rounded-lg border-border focus:border-accent/40 focus:ring-accent/20 placeholder:text-muted-foreground/30"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-medium tracking-wide transition-colors ${
                activeCategory === null
                  ? "bg-accent/15 text-accent border border-accent/30"
                  : "bg-muted/50 text-muted-foreground hover:text-foreground border border-transparent"
              }`}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() =>
                  setActiveCategory(activeCategory === cat ? null : cat)
                }
                className={`px-3 py-1.5 rounded-full text-[11px] font-medium tracking-wide transition-colors ${
                  activeCategory === cat
                    ? "bg-accent/15 text-accent border border-accent/30"
                    : "bg-muted/50 text-muted-foreground hover:text-foreground border border-transparent"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div
          className="animate-fade-up"
          style={{ animationDelay: "200ms" }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] text-muted-foreground font-medium tracking-wide">
              {filtered.length} standard{filtered.length !== 1 ? "s" : ""}{" "}
              {activeCategory ? `in ${activeCategory}` : ""}
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="size-12 rounded-xl border border-border flex items-center justify-center">
                <Search className="size-5 text-muted-foreground" />
              </div>
              <div className="text-center space-y-1.5">
                <h2 className="text-sm font-bold tracking-wide">
                  No standards found
                </h2>
                <p className="text-[12px] text-muted-foreground max-w-sm">
                  Try a different search term or remove the category filter.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border/50 rounded-lg overflow-hidden">
              {filtered.map((standard) => (
                <StandardCard
                  key={standard.id}
                  standard={standard}
                  onClick={() => setSelected(standard)}
                />
              ))}
            </div>
          )}
        </div>

        <footer className="border-t border-border/50 pt-6 pb-4">
          <p className="text-[11px] text-muted-foreground/40 text-center tracking-wide">
            Standards data is for reference only. Always consult the official BIS
            website for authoritative information.
          </p>
        </footer>
      </main>

      {/* Detail overlay */}
      {selected && (
        <StandardDetail
          standard={selected}
          onClose={() => setSelected(null)}
          onNavigate={(s) => setSelected(s)}
        />
      )}
    </div>
  );
}

function StandardCard({
  standard,
  onClick,
}: {
  standard: BISStandard;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col gap-2.5 bg-background p-4 sm:p-5 text-left group transition-colors hover:bg-accent/5"
    >
      <div className="flex items-center justify-between w-full">
        <span className="text-[11px] font-mono font-bold tracking-wider text-accent">
          {standard.id}
        </span>
        {standard.mandatory ? (
          <span className="flex items-center gap-1 text-[10px] font-medium tracking-wider text-verified">
            <ShieldCheck className="size-3" />
            MANDATORY
          </span>
        ) : (
          <span className="text-[10px] font-medium tracking-wider text-muted-foreground/50">
            VOLUNTARY
          </span>
        )}
      </div>
      <p className="text-xs font-medium leading-relaxed line-clamp-2 group-hover:text-foreground transition-colors">
        {standard.title}
      </p>
      <div className="flex items-center gap-2">
        <span className="px-2 py-0.5 rounded-full bg-muted/50 text-[10px] font-medium tracking-wide text-muted-foreground">
          {standard.category}
        </span>
        <span className="text-[10px] text-muted-foreground/40 font-mono tabular-nums">
          {standard.year}
        </span>
      </div>
    </button>
  );
}

function StandardDetail({
  standard,
  onClose,
  onNavigate,
}: {
  standard: BISStandard;
  onClose: () => void;
  onNavigate: (s: BISStandard) => void;
}) {
  const relatedStandards = standard.relatedStandards
    .map((id) => STANDARDS.find((s) => s.id === id))
    .filter(Boolean) as BISStandard[];

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg mx-4 max-h-[85vh] overflow-y-auto rounded-xl border border-border bg-background shadow-2xl animate-fade-up">
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-border bg-background/95 backdrop-blur-sm rounded-t-xl">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold tracking-wider text-accent">
              {standard.id}
            </span>
            {standard.mandatory ? (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-verified/10 text-[10px] font-medium tracking-wider text-verified">
                <ShieldCheck className="size-2.5" />
                MANDATORY
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-muted/50 text-[10px] font-medium tracking-wider text-muted-foreground/60">
                VOLUNTARY
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="size-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="space-y-2">
            <h2 className="text-lg font-bold tracking-tight leading-snug">
              {standard.title}
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {standard.description}
            </p>
          </div>

          <div className="divide-y divide-border/50 rounded-lg border border-border">
            <DetailRow icon={Layers} label="Category" value={standard.category} />
            <DetailRow icon={FileText} label="Scope" value={standard.scope} />
            <DetailRow
              icon={Calendar}
              label="Year"
              value={String(standard.year)}
              mono
            />
            <DetailRow
              icon={Hash}
              label="Standard"
              value={standard.id}
              mono
            />
          </div>

          {relatedStandards.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Link2 className="size-3.5 text-muted-foreground/50" />
                <span className="text-[11px] font-medium tracking-wide text-muted-foreground">
                  Related Standards
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {relatedStandards.map((rs) => (
                  <button
                    key={rs.id}
                    onClick={() => onNavigate(rs)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-muted/30 text-[11px] font-medium tracking-wide hover:border-accent/30 hover:text-accent transition-colors"
                  >
                    {rs.id}
                    <ExternalLink className="size-2.5 opacity-50" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <Link href="/scan">
            <Button className="w-full text-[11px] font-medium tracking-wide h-10 rounded-lg">
              <Scan className="size-3.5 mr-2" />
              Scan a Product with This Standard
              <ArrowRight className="size-3 ml-2 opacity-50" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
  mono,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Icon className="size-3.5 text-muted-foreground/50 shrink-0" />
      <span className="text-[11px] text-muted-foreground font-medium tracking-wide w-20 shrink-0">
        {label}
      </span>
      <span
        className={`text-xs font-medium ${mono ? "font-mono tracking-wide" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
