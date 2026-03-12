"use client";

import {
  ShieldCheck,
  ShieldAlert,
  ShieldQuestion,
  ShieldX,
  Tag,
  Hash,
  Building2,
  Boxes,
  FileText,
} from "lucide-react";

interface ExtractionResult {
  productName: string;
  brandName?: string;
  productType?: string;
  isiNumber: string;
  extractedText?: string;
  confidence: number;
}

interface VerificationResult {
  verdict: "verified" | "not_found" | "suspicious" | "needs_review";
  reason: string;
  confidence: number;
  knownStandard?: string;
  standardTitle?: string;
}

interface ScanResultProps {
  extraction: ExtractionResult;
  verification: VerificationResult;
}

const verdictConfig = {
  verified: {
    label: "VERIFIED",
    icon: ShieldCheck,
    border: "border-foreground/20",
    indicator: "bg-foreground",
    text: "text-foreground",
  },
  not_found: {
    label: "NOT FOUND",
    icon: ShieldX,
    border: "border-muted-foreground/30",
    indicator: "bg-muted-foreground",
    text: "text-muted-foreground",
  },
  suspicious: {
    label: "SUSPICIOUS",
    icon: ShieldAlert,
    border: "border-destructive/40",
    indicator: "bg-destructive",
    text: "text-destructive",
  },
  needs_review: {
    label: "NEEDS REVIEW",
    icon: ShieldQuestion,
    border: "border-muted-foreground/30",
    indicator: "bg-muted-foreground",
    text: "text-muted-foreground",
  },
};

export function ScanResult({ extraction, verification }: ScanResultProps) {
  const config = verdictConfig[verification.verdict];
  const Icon = config.icon;

  return (
    <div className={`border ${config.border} divide-y divide-border`}>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Icon className={`size-4 ${config.text}`} />
          <span className="text-xs font-medium uppercase tracking-[0.15em]">
            Scan Result
          </span>
        </div>
        <div className={`flex items-center gap-2 ${config.text}`}>
          <span className={`size-1.5 rounded-full ${config.indicator}`} />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
            {config.label}
          </span>
        </div>
      </div>

      <div className="p-4">
        <p className="text-xs text-muted-foreground leading-relaxed font-light">
          {verification.reason}
        </p>
      </div>

      <div className="divide-y divide-border/50">
        <InfoRow icon={Tag} label="Product" value={extraction.productName} />
        {extraction.brandName && (
          <InfoRow
            icon={Building2}
            label="Brand"
            value={extraction.brandName}
          />
        )}
        {extraction.productType && (
          <InfoRow
            icon={Boxes}
            label="Category"
            value={extraction.productType}
          />
        )}
        <InfoRow
          icon={Hash}
          label="ISI / BIS"
          value={extraction.isiNumber || "Not detected"}
          mono={!!extraction.isiNumber}
        />
        {verification.knownStandard && (
          <InfoRow
            icon={FileText}
            label="Standard"
            value={`${verification.knownStandard} — ${verification.standardTitle}`}
          />
        )}
      </div>

      <div className="p-4 grid grid-cols-2 gap-4">
        <ConfidenceBar
          label="Extraction"
          value={extraction.confidence}
        />
        <ConfidenceBar
          label="Verification"
          value={verification.confidence}
        />
      </div>

      <div className="px-4 py-3">
        <p className="text-[10px] text-muted-foreground/40 uppercase tracking-[0.1em] leading-relaxed">
          Prototype AI assessment — not an official BIS verification
        </p>
      </div>
    </div>
  );
}

function InfoRow({
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
      <span className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] w-20 shrink-0">
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

function ConfidenceBar({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground uppercase tracking-[0.15em]">
          {label}
        </span>
        <span className="text-[10px] text-foreground font-mono tabular-nums">
          {Math.round(value * 100)}%
        </span>
      </div>
      <div className="h-px bg-muted overflow-hidden">
        <div
          className="h-full bg-foreground/60 transition-all duration-1000 ease-out"
          style={{ width: `${value * 100}%` }}
        />
      </div>
    </div>
  );
}
