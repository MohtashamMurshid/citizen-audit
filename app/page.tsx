"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Shield,
  ArrowRight,
  Scan,
  MapPin,
  Users,
  Eye,
  Crosshair,
  FileCheck,
  Radio,
  BarChart3,
  BookOpen,
  Trophy,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const stats = useQuery(api.reports.overallStats);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-12 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex size-7 items-center justify-center rounded-md border border-foreground/15 group-hover:border-accent/50 transition-colors">
              <Shield className="size-3.5 text-foreground/80 group-hover:text-accent transition-colors" />
            </div>
            <span className="text-xs font-medium tracking-wide text-foreground">
              CitizenAudit
            </span>
          </Link>
          <nav className="flex items-center gap-0.5">
            <Link
              href="/scan"
              className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium tracking-wide text-muted-foreground hover:text-foreground transition-colors"
            >
              <Scan className="size-3.5" />
              Scan
            </Link>
            <Link
              href="/standards"
              className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium tracking-wide text-muted-foreground hover:text-foreground transition-colors"
            >
              <BookOpen className="size-3.5" />
              Standards
            </Link>
            <Link
              href="/chat"
              className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium tracking-wide text-muted-foreground hover:text-foreground transition-colors"
            >
              <MessageCircle className="size-3.5" />
              Ask AI
            </Link>
            <Link
              href="/leaderboard"
              className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium tracking-wide text-muted-foreground hover:text-foreground transition-colors"
            >
              <Trophy className="size-3.5" />
              Leaderboard
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium tracking-wide text-muted-foreground hover:text-foreground transition-colors"
            >
              <BarChart3 className="size-3.5" />
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-4 sm:px-6 pt-16 sm:pt-24 pb-12 sm:pb-16">
          <div className="space-y-6 animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-3.5 py-1.5 text-[11px] font-medium tracking-wide text-accent">
              <div className="size-1.5 rounded-full bg-accent animate-pulse" />
              Product Verification System
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.08]">
              Scan. Verify.
              <br />
              <span className="text-muted-foreground">Report.</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-lg">
              Upload a photo of any product with an ISI mark. Our AI extracts
              certification details, checks legitimacy against known BIS
              standards, and maps counterfeit hotspots across India.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link href="/scan">
                <Button
                  size="lg"
                  className="text-xs font-medium tracking-wide h-10 px-6 w-full sm:w-auto rounded-lg"
                >
                  <Scan className="size-3.5 mr-2" />
                  Start Scanning
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-xs font-medium tracking-wide h-10 px-6 w-full sm:w-auto rounded-lg"
                >
                  <BarChart3 className="size-3.5 mr-2" />
                  View Dashboard
                  <ArrowRight className="size-3.5 ml-2 opacity-50" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
          <div
            className="space-y-6 animate-fade-up"
            style={{ animationDelay: "150ms" }}
          >
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[11px] font-medium tracking-wide text-muted-foreground">
                How it works
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border/50 rounded-lg overflow-hidden">
              <StepCard
                number="01"
                icon={Eye}
                title="Upload product photo"
                description="Take a clear photo of the ISI/BIS mark and product label"
              />
              <StepCard
                number="02"
                icon={Crosshair}
                title="AI scans the label"
                description="Vision AI extracts ISI number, brand, and product details"
              />
              <StepCard
                number="03"
                icon={FileCheck}
                title="Verification check"
                description="Number checked against known BIS standards database"
              />
              <StepCard
                number="04"
                icon={Radio}
                title="Community report"
                description="Submit findings to map counterfeit hotspots nationwide"
              />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
          <div
            className="space-y-6 animate-fade-up"
            style={{ animationDelay: "250ms" }}
          >
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[11px] font-medium tracking-wide text-muted-foreground">
                Explore
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border/50 rounded-lg overflow-hidden">
              <Link
                href="/standards"
                className="flex items-start gap-3.5 bg-background p-5 sm:p-6 group transition-colors hover:bg-accent/5"
              >
                <div className="flex size-9 items-center justify-center rounded-lg border border-accent/20 bg-accent/5 shrink-0 group-hover:border-accent/40 transition-colors">
                  <BookOpen className="size-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium tracking-wide group-hover:text-accent transition-colors">
                    Standards Explorer
                  </p>
                  <p className="text-[12px] text-muted-foreground mt-1 leading-relaxed">
                    Browse 50+ Indian Standards used in BIS certification.
                    Search by category, learn what each standard covers.
                  </p>
                  <span className="inline-flex items-center gap-1 mt-2 text-[11px] font-medium tracking-wide text-accent/70">
                    Browse standards
                    <ArrowRight className="size-3" />
                  </span>
                </div>
              </Link>
              <Link
                href="/leaderboard"
                className="flex items-start gap-3.5 bg-background p-5 sm:p-6 group transition-colors hover:bg-accent/5"
              >
                <div className="flex size-9 items-center justify-center rounded-lg border border-accent/20 bg-accent/5 shrink-0 group-hover:border-accent/40 transition-colors">
                  <Trophy className="size-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium tracking-wide group-hover:text-accent transition-colors">
                    Community Leaderboard
                  </p>
                  <p className="text-[12px] text-muted-foreground mt-1 leading-relaxed">
                    City and state rankings, community milestones, and badges.
                    See who is leading the fight against counterfeits.
                  </p>
                  <span className="inline-flex items-center gap-1 mt-2 text-[11px] font-medium tracking-wide text-accent/70">
                    View rankings
                    <ArrowRight className="size-3" />
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {stats && stats.total > 0 && (
          <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
            <div
              className="space-y-6 animate-fade-up"
              style={{ animationDelay: "350ms" }}
            >
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-[11px] font-medium tracking-wide text-muted-foreground">
                  Community Impact
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="grid grid-cols-3 gap-px bg-border/50 rounded-lg overflow-hidden">
                <StatMini icon={Scan} label="Scans" value={stats.total} />
                <StatMini icon={MapPin} label="Cities" value={stats.cities} color="accent" />
                <StatMini icon={Users} label="States" value={stats.states} color="verified" />
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-border/50 py-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <p className="text-[11px] text-muted-foreground/40 tracking-wide">
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
    <div className="flex items-start gap-3.5 bg-background p-5 sm:p-6 group transition-colors hover:bg-accent/5">
      <div className="flex flex-col items-center gap-1.5 shrink-0">
        <span className="text-[11px] text-accent/60 font-mono tabular-nums font-medium">
          {number}
        </span>
        <Icon className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
      </div>
      <div>
        <p className="text-sm font-medium tracking-wide">{title}</p>
        <p className="text-[12px] text-muted-foreground mt-1 leading-relaxed">
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
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  color?: "accent" | "verified";
}) {
  const colorClass = color === "accent"
    ? "text-accent"
    : color === "verified"
    ? "text-verified"
    : "text-foreground";

  return (
    <div className="flex flex-col items-center gap-1.5 bg-background p-5 sm:p-6">
      <Icon className="size-3.5 text-muted-foreground/50" />
      <span className={`text-2xl font-bold tabular-nums tracking-tight ${colorClass}`}>
        {value}
      </span>
      <span className="text-[11px] text-muted-foreground font-medium tracking-wide">
        {label}
      </span>
    </div>
  );
}
