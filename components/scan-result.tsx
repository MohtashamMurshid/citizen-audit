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
    border: "border-verified/30",
    pill: "bg-verified/10 text-verified",
    indicator: "bg-verified",
    text: "text-verified",
    barColor: "bg-verified/60",
  },
  not_found: {
    label: "NOT FOUND",
    icon: ShieldX,
    border: "border-not-found/30",
    pill: "bg-not-found/10 text-not-found",
    indicator: "bg-not-found",
    text: "text-not-found",
    barColor: "bg-not-found/60",
  },
  suspicious: {
    label: "SUSPICIOUS",
    icon: ShieldAlert,
    border: "border-suspicious/30",
    pill: "bg-suspicious/10 text-suspicious",
    indicator: "bg-suspicious",
    text: "text-suspicious",
    barColor: "bg-suspicious/60",
  },
  needs_review: {
    label: "NEEDS REVIEW",
    icon: ShieldQuestion,
    border: "border-muted-foreground/20",
    pill: "bg-muted text-muted-foreground",
    indicator: "bg-muted-foreground",
    text: "text-muted-foreground",
    barColor: "bg-muted-foreground/60",
  },
};

export function ScanResult({ extraction, verification }: ScanResultProps) {
  const config = verdictConfig[verification.verdict];
  const Icon = config.icon;

  return (
    <div className={`rounded-lg border ${config.border} divide-y divide-border`}>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Icon className={`size-4 ${config.text}`} />
          <span className="text-xs font-medium tracking-wide">
            Scan Result
          </span>
        </div>
        <div className={`flex items-center gap-2 rounded-full px-2.5 py-1 ${config.pill}`}>
          <span className={`size-1.5 rounded-full ${config.indicator}`} />
          <span className="text-[10px] font-bold tracking-wider">
            {config.label}
          </span>
        </div>
      </div>

      <div className="p-4">
        <p className="text-xs text-muted-foreground leading-relaxed">
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
          barColor={config.barColor}
        />
        <ConfidenceBar
          label="Verification"
          value={verification.confidence}
          barColor={config.barColor}
        />
      </div>

      <div className="px-4 py-3">
        <p className="text-[11px] text-muted-foreground/40 tracking-wide leading-relaxed">
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

function ConfidenceBar({
  label,
  value,
  barColor,
}: {
  label: string;
  value: number;
  barColor: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground font-medium tracking-wide">
          {label}
        </span>
        <span className="text-[11px] text-foreground font-mono tabular-nums">
          {Math.round(value * 100)}%
        </span>
      </div>
      <div className="h-1 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor} transition-all duration-1000 ease-out`}
          style={{ width: `${value * 100}%` }}
        />
      </div>
    </div>
  );
}
