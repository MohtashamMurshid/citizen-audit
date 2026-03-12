"use client";

import { useState, useCallback } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { UploadZone } from "@/components/upload-zone";
import { ScanResult } from "@/components/scan-result";
import { ReportForm } from "@/components/report-form";
import { Button } from "@/components/ui/button";
import {
  Shield,
  BarChart3,
  ArrowRight,
  Scan,
  MapPin,
  Users,
  AlertTriangle,
  ArrowUpRight,
  Eye,
  Crosshair,
  FileCheck,
  Radio,
} from "lucide-react";
import Link from "next/link";

type Step = "upload" | "scanning" | "result" | "submitted";

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

export default function Home() {
  const [step, setStep] = useState<Step>("upload");
  const [imageStorageId, setImageStorageId] =
    useState<Id<"_storage"> | null>(null);
  const [extraction, setExtraction] = useState<ExtractionResult | null>(null);
  const [verification, setVerification] =
    useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateUploadUrl = useMutation(api.reports.generateUploadUrl);
  const stats = useQuery(api.reports.overallStats);

  const handleFileSelected = useCallback(
    async (file: File) => {
      setStep("scanning");
      setError(null);

      try {
        const uploadUrl = await generateUploadUrl();
        const uploadRes = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        const { storageId } = await uploadRes.json();
        setImageStorageId(storageId);

        const base64 = await fileToBase64(file);

        const extractRes = await fetch("/api/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl: base64 }),
        });

        if (!extractRes.ok) throw new Error("Extraction failed");
        const extractData: ExtractionResult = await extractRes.json();
        setExtraction(extractData);

        const verifyRes = await fetch("/api/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            isiNumber: extractData.isiNumber,
            productName: extractData.productName,
            brandName: extractData.brandName,
            extractedText: extractData.extractedText,
          }),
        });

        const verifyData: VerificationResult = await verifyRes.json();
        setVerification(verifyData);
        setStep("result");
      } catch (err) {
        console.error(err);
        setError("Something went wrong while scanning. Please try again.");
        setStep("upload");
      }
    },
    [generateUploadUrl]
  );

  const handleReset = useCallback(() => {
    setStep("upload");
    setImageStorageId(null);
    setExtraction(null);
    setVerification(null);
    setError(null);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-12 max-w-2xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex size-7 items-center justify-center border border-foreground/20 group-hover:border-foreground/40 transition-colors">
              <Shield className="size-3.5 text-foreground" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground">
              CitizenAudit
            </span>
          </Link>
          <Link href="/insights">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground gap-1.5 h-8 px-3"
            >
              <BarChart3 className="size-3" />
              Insights
              <ArrowUpRight className="size-3 opacity-50" />
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 sm:px-6 py-8 sm:py-12">
        {step === "upload" && (
          <div className="space-y-10">
            <div className="space-y-5 animate-fade-up">
              <div className="inline-flex items-center gap-2 border border-border/60 px-3 py-1.5 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                <div className="size-1.5 bg-foreground animate-pulse" />
                Product Verification System
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-[1.1]">
                Scan. Verify.
                <br />
                <span className="text-muted-foreground">Report.</span>
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-md font-light">
                Upload a photo of any product with an ISI mark. Our AI extracts
                certification details and checks legitimacy against known BIS
                standards.
              </p>
            </div>

            <div className="animate-fade-up" style={{ animationDelay: "100ms" }}>
              <UploadZone
                onFileSelected={handleFileSelected}
                isProcessing={false}
              />
            </div>

            {error && (
              <div className="flex items-center gap-3 border border-destructive/30 bg-destructive/5 px-4 py-3 text-xs text-destructive font-medium">
                <AlertTriangle className="size-3.5 shrink-0" />
                {error}
              </div>
            )}

            <div
              className="space-y-4 animate-fade-up"
              style={{ animationDelay: "200ms" }}
            >
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  How it works
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border/50">
                <StepCard
                  number="01"
                  icon={Eye}
                  title="Upload product photo"
                  description="Clear photo of the ISI/BIS mark and product label"
                />
                <StepCard
                  number="02"
                  icon={Crosshair}
                  title="AI scans the label"
                  description="Vision AI extracts ISI number and product details"
                />
                <StepCard
                  number="03"
                  icon={FileCheck}
                  title="Verification check"
                  description="Number checked against known BIS standards"
                />
                <StepCard
                  number="04"
                  icon={Radio}
                  title="Community report"
                  description="Submit findings to map counterfeit hotspots"
                />
              </div>
            </div>

            {stats && stats.total > 0 && (
              <div
                className="animate-fade-up"
                style={{ animationDelay: "300ms" }}
              >
                <div className="grid grid-cols-3 gap-px bg-border/50">
                  <StatMini icon={Scan} label="Scans" value={stats.total} />
                  <StatMini icon={MapPin} label="Cities" value={stats.cities} />
                  <StatMini icon={Users} label="States" value={stats.states} />
                </div>
              </div>
            )}
          </div>
        )}

        {step === "scanning" && (
          <div className="space-y-6 animate-fade-up">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="size-2 bg-foreground animate-pulse" />
                <h1 className="text-xl font-bold tracking-tight uppercase">
                  Scanning product...
                </h1>
              </div>
              <p className="text-xs text-muted-foreground tracking-wide">
                Extracting label data and verifying ISI markings
              </p>
            </div>
            <UploadZone onFileSelected={() => {}} isProcessing={true} />
          </div>
        )}

        {step === "result" && extraction && verification && imageStorageId && (
          <div className="space-y-6 animate-fade-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-2 bg-foreground" />
                <h1 className="text-xl font-bold tracking-tight uppercase">
                  Scan Complete
                </h1>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="text-xs uppercase tracking-wider h-8"
              >
                New Scan
              </Button>
            </div>

            <ScanResult extraction={extraction} verification={verification} />

            <ReportForm
              imageStorageId={imageStorageId}
              extraction={extraction}
              verification={verification}
              onSubmitted={handleReset}
            />
          </div>
        )}

        {step === "submitted" && (
          <div className="flex flex-col items-center justify-center py-20 gap-6 animate-fade-up">
            <div className="size-16 border border-foreground/20 flex items-center justify-center">
              <Shield className="size-6 text-foreground" />
            </div>
            <div className="text-center space-y-2">
              <h1 className="text-xl font-bold uppercase tracking-wide">
                Report Submitted
              </h1>
              <p className="text-sm text-muted-foreground max-w-sm font-light">
                Your report has been submitted and will help build consumer
                safety intelligence across India.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleReset}
                className="text-xs uppercase tracking-wider h-9"
              >
                <Scan className="size-3.5 mr-1.5" />
                Scan Another
              </Button>
              <Link href="/insights">
                <Button
                  variant="outline"
                  className="text-xs uppercase tracking-wider h-9"
                >
                  View Insights
                  <ArrowRight className="size-3.5 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-16 border-t border-border/50 py-8">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 text-center">
          <p className="text-[10px] text-muted-foreground/40 uppercase tracking-[0.15em]">
            CitizenAudit is a prototype civic tool. Results are AI-assisted
            assessments, not official BIS verifications.
          </p>
        </div>
      </footer>
    </div>
  );
}

function StepCard({
  number,
  icon: Icon,
  title,
  description,
}: {
  number: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3.5 bg-background p-4 sm:p-5 group transition-colors hover:bg-accent/30">
      <div className="flex flex-col items-center gap-1.5 shrink-0">
        <span className="text-[10px] text-muted-foreground/50 font-mono tabular-nums">
          {number}
        </span>
        <Icon className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide">{title}</p>
        <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed font-light">
          {description}
        </p>
      </div>
    </div>
  );
}

function StatMini({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 bg-background p-4">
      <Icon className="size-3.5 text-muted-foreground/60" />
      <span className="text-xl font-bold tabular-nums tracking-tight">
        {value}
      </span>
      <span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
        {label}
      </span>
    </div>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
