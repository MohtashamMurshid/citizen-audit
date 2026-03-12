"use client";

import { useState, useCallback } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { UploadZone } from "@/components/upload-zone";
import { ScanResult } from "@/components/scan-result";
import { ReportForm } from "@/components/report-form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  BarChart3,
  ArrowRight,
  Scan,
  MapPin,
  Users,
  AlertTriangle,
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
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="size-5 text-primary" />
            <span className="text-base font-semibold tracking-tight">
              CitizenAudit
            </span>
          </Link>
          <Link href="/insights">
            <Button variant="ghost" size="sm">
              <BarChart3 className="size-4" />
              Insights
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        {step === "upload" && (
          <div className="space-y-8">
            <div className="space-y-3">
              <Badge variant="secondary" className="gap-1.5">
                <Scan className="size-3" />
                Product Verification
              </Badge>
              <h1 className="text-3xl font-bold tracking-tight">
                Scan. Verify. Report.
              </h1>
              <p className="text-base text-muted-foreground leading-relaxed max-w-lg">
                Upload a photo of any product with an ISI mark. Our AI will
                extract the certification details and check if they look
                legitimate.
              </p>
            </div>

            <UploadZone
              onFileSelected={handleFileSelected}
              isProcessing={false}
            />

            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                <AlertTriangle className="size-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-4">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                How it works
              </h2>
              <div className="grid gap-3">
                <StepCard
                  number="1"
                  title="Upload a product photo"
                  description="Take a clear photo showing the ISI/BIS mark and product label"
                />
                <StepCard
                  number="2"
                  title="AI scans the label"
                  description="Our system extracts the ISI number and product details using vision AI"
                />
                <StepCard
                  number="3"
                  title="Verification check"
                  description="The extracted number is checked against known BIS standards"
                />
                <StepCard
                  number="4"
                  title="Community report"
                  description="Submit your findings to help map counterfeit product hotspots"
                />
              </div>
            </div>

            {stats && stats.total > 0 && (
              <div className="grid grid-cols-3 gap-3">
                <StatMini
                  icon={Scan}
                  label="Scans"
                  value={stats.total}
                />
                <StatMini
                  icon={MapPin}
                  label="Cities"
                  value={stats.cities}
                />
                <StatMini
                  icon={Users}
                  label="States"
                  value={stats.states}
                />
              </div>
            )}
          </div>
        )}

        {step === "scanning" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">
                Scanning product...
              </h1>
              <p className="text-sm text-muted-foreground">
                Extracting label data and verifying ISI markings
              </p>
            </div>
            <UploadZone
              onFileSelected={() => {}}
              isProcessing={true}
            />
          </div>
        )}

        {step === "result" && extraction && verification && imageStorageId && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold tracking-tight">
                Scan Complete
              </h1>
              <Button variant="outline" size="sm" onClick={handleReset}>
                New Scan
              </Button>
            </div>

            <ScanResult
              extraction={extraction}
              verification={verification}
            />

            <ReportForm
              imageStorageId={imageStorageId}
              extraction={extraction}
              verification={verification}
              onSubmitted={handleReset}
            />
          </div>
        )}

        {step === "submitted" && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <h1 className="text-2xl font-bold">Thank you!</h1>
            <p className="text-muted-foreground text-center max-w-sm">
              Your report has been submitted and will help build consumer safety
              intelligence across India.
            </p>
            <div className="flex gap-3">
              <Button onClick={handleReset}>
                <Scan className="size-4 mr-1.5" />
                Scan Another
              </Button>
              <Link href="/insights">
                <Button variant="outline">
                  View Insights
                  <ArrowRight className="size-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-16 border-t py-8">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <p className="text-xs text-muted-foreground/60">
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
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border p-3.5 transition-colors hover:bg-muted/30">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
        {number}
      </span>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
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
    <div className="flex flex-col items-center gap-1 rounded-xl border p-3">
      <Icon className="size-4 text-muted-foreground" />
      <span className="text-lg font-bold tabular-nums">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
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
