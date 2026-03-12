"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ShieldCheck,
  ShieldAlert,
  ShieldQuestion,
  ShieldX,
  FileText,
  Tag,
  Hash,
  Building2,
  Boxes,
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
    label: "Verified",
    icon: ShieldCheck,
    variant: "outline" as const,
    className:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    cardBorder: "ring-emerald-500/20",
  },
  not_found: {
    label: "Not Found",
    icon: ShieldX,
    variant: "outline" as const,
    className:
      "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
    cardBorder: "ring-amber-500/20",
  },
  suspicious: {
    label: "Suspicious",
    icon: ShieldAlert,
    variant: "destructive" as const,
    className: "",
    cardBorder: "ring-red-500/30",
  },
  needs_review: {
    label: "Needs Review",
    icon: ShieldQuestion,
    variant: "outline" as const,
    className:
      "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-400",
    cardBorder: "ring-blue-500/20",
  },
};

export function ScanResult({ extraction, verification }: ScanResultProps) {
  const config = verdictConfig[verification.verdict];
  const Icon = config.icon;

  return (
    <Card className={config.cardBorder}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Icon className="size-5" />
            <CardTitle>Scan Result</CardTitle>
          </div>
          <Badge variant={config.variant} className={config.className}>
            {config.label}
          </Badge>
        </div>
        <CardDescription className="mt-1">
          {verification.reason}
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4">
        <div className="grid gap-3">
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
            label="ISI / BIS Number"
            value={extraction.isiNumber || "Not detected"}
            highlight={!!extraction.isiNumber}
          />
          {verification.knownStandard && (
            <InfoRow
              icon={FileText}
              label="Standard"
              value={`${verification.knownStandard} — ${verification.standardTitle}`}
            />
          )}
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Extraction confidence</span>
              <span>{Math.round(extraction.confidence * 100)}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary/60 transition-all duration-700"
                style={{ width: `${extraction.confidence * 100}%` }}
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Verification confidence</span>
              <span>{Math.round(verification.confidence * 100)}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary/60 transition-all duration-700"
                style={{ width: `${verification.confidence * 100}%` }}
              />
            </div>
          </div>
        </div>

        <p className="mt-4 text-[11px] text-muted-foreground/60 leading-relaxed">
          This is a prototype AI-assisted assessment, not an official BIS
          verification. Results should be treated as indicative only.
        </p>
      </CardContent>
    </Card>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="size-4 text-muted-foreground shrink-0" />
      <span className="text-sm text-muted-foreground w-28 shrink-0">
        {label}
      </span>
      <span
        className={
          highlight
            ? "text-sm font-semibold font-mono tracking-wide"
            : "text-sm font-medium"
        }
      >
        {value}
      </span>
    </div>
  );
}
