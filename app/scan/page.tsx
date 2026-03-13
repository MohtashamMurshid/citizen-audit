"use client";

import { useState, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { UploadZone } from "@/components/upload-zone";
import { ScanResult } from "@/components/scan-result";
import { ReportForm } from "@/components/report-form";
import { SharedHeader } from "@/components/shared-header";
import { Button } from "@/components/ui/button";
import {
  Shield,
  ArrowRight,
  Scan,
  AlertTriangle,
  BarChart3,
  Upload,
  Eye,
  ShieldCheck,
  Check,
} from "lucide-react";
import Link from "next/link";

type Step = "upload" | "uploading" | "extracting" | "verifying" | "result" | "submitted";

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

const PROGRESS_STEPS = [
  { key: "uploading", label: "Uploading", icon: Upload },
  { key: "extracting", label: "Analyzing", icon: Eye },
  { key: "verifying", label: "Verifying", icon: ShieldCheck },
] as const;

export default function ScanPage() {
  const [step, setStep] = useState<Step>("upload");
  const [imageStorageId, setImageStorageId] =
    useState<Id<"_storage"> | null>(null);
  const [extraction, setExtraction] = useState<ExtractionResult | null>(null);
  const [verification, setVerification] =
    useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateUploadUrl = useMutation(api.reports.generateUploadUrl);

  const handleFileSelected = useCallback(
    async (file: File) => {
      setStep("uploading");
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

        setStep("extracting");
        const base64 = await fileToBase64(file);

        const extractRes = await fetch("/api/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl: base64 }),
        });

        if (!extractRes.ok) throw new Error("Extraction failed");
        const extractData: ExtractionResult = await extractRes.json();
        setExtraction(extractData);

        setStep("verifying");
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

  const handleSubmitted = useCallback(() => {
    setStep("submitted");
  }, []);

  const isScanning = step === "uploading" || step === "extracting" || step === "verifying";

  return (
    <div className="min-h-screen bg-background">
      <SharedHeader />

      <main className="mx-auto max-w-2xl px-4 sm:px-6 py-8 sm:py-12">
        {step === "upload" && (
          <div className="space-y-8">
            <div className="space-y-3 animate-fade-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-3.5 py-1.5 text-[11px] font-medium tracking-wide text-accent">
                <Scan className="size-3.5" />
                New Scan
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Scan a Product
              </h1>
              <p className="text-sm text-muted-foreground max-w-md">
                Upload a clear photo of the product label showing the ISI/BIS
                mark. Our AI will extract and verify the certification details.
              </p>
            </div>

            <div className="animate-fade-up" style={{ animationDelay: "100ms" }}>
              <UploadZone
                onFileSelected={handleFileSelected}
                isProcessing={false}
              />
            </div>

            {error && (
              <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-xs text-destructive font-medium">
                <AlertTriangle className="size-3.5 shrink-0" />
                {error}
              </div>
            )}
          </div>
        )}

        {isScanning && (
          <div className="space-y-8 animate-fade-up">
            <div className="space-y-3">
              <h1 className="text-xl font-bold tracking-tight">
                Scanning product...
              </h1>
              <p className="text-sm text-muted-foreground tracking-wide">
                Extracting label data and verifying ISI markings
              </p>
            </div>

            <ScanProgress currentStep={step} />

            <UploadZone
              onFileSelected={() => {}}
              isProcessing={true}
              processingLabel={
                step === "uploading"
                  ? "Uploading image"
                  : step === "extracting"
                  ? "Analyzing label"
                  : "Verifying marks"
              }
            />
          </div>
        )}

        {step === "result" && extraction && verification && imageStorageId && (
          <div className="space-y-6 animate-fade-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-verified" />
                <h1 className="text-xl font-bold tracking-tight">
                  Scan Complete
                </h1>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="text-[11px] font-medium tracking-wide h-8 rounded-lg"
              >
                New Scan
              </Button>
            </div>

            <ScanResult extraction={extraction} verification={verification} />

            <ReportForm
              imageStorageId={imageStorageId}
              extraction={extraction}
              verification={verification}
              onSubmitted={handleSubmitted}
            />
          </div>
        )}

        {step === "submitted" && (
          <div className="flex flex-col items-center justify-center py-20 gap-6 animate-fade-up">
            <div className="size-16 rounded-xl border border-verified/20 bg-verified/5 flex items-center justify-center">
              <Shield className="size-6 text-verified" />
            </div>
            <div className="text-center space-y-2">
              <h1 className="text-xl font-bold tracking-tight">
                Report Submitted
              </h1>
              <p className="text-sm text-muted-foreground max-w-sm">
                Your report has been submitted and will help build consumer
                safety intelligence across India.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleReset}
                className="text-[11px] font-medium tracking-wide h-9 rounded-lg"
              >
                <Scan className="size-3.5 mr-1.5" />
                Scan Another
              </Button>
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="text-[11px] font-medium tracking-wide h-9 rounded-lg"
                >
                  <BarChart3 className="size-3.5 mr-1.5" />
                  Go to Dashboard
                  <ArrowRight className="size-3.5 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function ScanProgress({ currentStep }: { currentStep: Step }) {
  const stepIndex = PROGRESS_STEPS.findIndex((s) => s.key === currentStep);

  return (
    <div className="flex items-center gap-2">
      {PROGRESS_STEPS.map((s, i) => {
        const Icon = s.icon;
        const isActive = i === stepIndex;
        const isComplete = i < stepIndex;

        return (
          <div key={s.key} className="flex items-center gap-2 flex-1">
            <div className="flex items-center gap-2 flex-1">
              <div
                className={`flex size-7 items-center justify-center rounded-full border transition-all duration-300 ${
                  isComplete
                    ? "border-verified/40 bg-verified/10"
                    : isActive
                    ? "border-accent/40 bg-accent/10"
                    : "border-border bg-background"
                }`}
              >
                {isComplete ? (
                  <Check className="size-3.5 text-verified" />
                ) : (
                  <Icon
                    className={`size-3.5 transition-colors duration-300 ${
                      isActive
                        ? "text-accent animate-progress-pulse"
                        : "text-muted-foreground/40"
                    }`}
                  />
                )}
              </div>
              <span
                className={`text-[11px] font-medium tracking-wide transition-colors duration-300 ${
                  isComplete
                    ? "text-verified"
                    : isActive
                    ? "text-foreground"
                    : "text-muted-foreground/40"
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < PROGRESS_STEPS.length - 1 && (
              <div className="flex-shrink-0 w-8 h-px mx-1">
                <div
                  className={`h-full rounded-full transition-colors duration-500 ${
                    isComplete ? "bg-verified/40" : "bg-border"
                  }`}
                />
              </div>
            )}
          </div>
        );
      })}
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
