"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SharedHeader } from "@/components/shared-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart3,
  MapPin,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Clock,
  TrendingUp,
  Scan,
  Map,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";

const IndiaHeatmap = dynamic(
  () => import("@/components/india-heatmap").then((m) => m.IndiaHeatmap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[420px] w-full rounded-lg border border-border flex items-center justify-center bg-card/50">
        <div className="flex flex-col items-center gap-3">
          <div className="relative size-8">
            <div className="absolute inset-0 rounded-full border border-accent/20 animate-pulse-ring" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Map className="size-4 text-accent/60" />
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground font-medium tracking-wide">
            Loading map
          </p>
        </div>
      </div>
    ),
  }
);

type TabId = "map" | "hotspots" | "recent";

function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    if (ref.current !== null) {
      cancelAnimationFrame(ref.current);
    }
    const start = performance.now();
    const duration = 600;
    const from = display;
    const to = value;

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (progress < 1) {
        ref.current = requestAnimationFrame(tick);
      }
    }

    ref.current = requestAnimationFrame(tick);
    return () => {
      if (ref.current !== null) cancelAnimationFrame(ref.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span className={className}>{display}</span>;
}

export default function DashboardPage() {
  const stats = useQuery(api.reports.overallStats);
  const cityStats = useQuery(api.reports.statsByCity);
  const stateStats = useQuery(api.reports.statsByState);
  const recentReports = useQuery(api.reports.list);
  const [activeTab, setActiveTab] = useState<TabId>("map");

  const isLoading = !stats || !cityStats || !stateStats || !recentReports;

  return (
    <div className="min-h-screen bg-background">
      <SharedHeader />

      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 animate-fade-up">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-3.5 py-1.5 text-[11px] font-medium tracking-wide text-accent">
              <BarChart3 className="size-3.5" />
              Community Data
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Aggregated verification data from citizen scans across India
            </p>
          </div>
          <Link href="/scan">
            <Button className="text-[11px] font-medium tracking-wide h-9 px-5 shrink-0 rounded-lg">
              <Scan className="size-3.5 mr-1.5" />
              New Scan
              <ArrowRight className="size-3 ml-1.5 opacity-50" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <LoadingSkeleton />
        ) : stats.total === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div
              className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border/50 rounded-lg overflow-hidden animate-fade-up"
              style={{ animationDelay: "100ms" }}
            >
              <StatCard
                icon={Scan}
                label="Total Scans"
                value={stats.total}
              />
              <StatCard
                icon={ShieldCheck}
                label="Verified"
                value={stats.verified}
                color="verified"
              />
              <StatCard
                icon={ShieldAlert}
                label="Suspicious"
                value={stats.suspicious}
                color="suspicious"
              />
              <StatCard
                icon={ShieldX}
                label="Not Found"
                value={stats.notFound}
                color="not-found"
              />
            </div>

            <div
              className="space-y-4 animate-fade-up"
              style={{ animationDelay: "200ms" }}
            >
              <div className="flex items-center gap-0 border-b border-border">
                <TabButton
                  id="map"
                  icon={Map}
                  label="Map"
                  active={activeTab === "map"}
                  onClick={setActiveTab}
                />
                <TabButton
                  id="hotspots"
                  icon={TrendingUp}
                  label="Hotspots"
                  active={activeTab === "hotspots"}
                  onClick={setActiveTab}
                />
                <TabButton
                  id="recent"
                  icon={Clock}
                  label="Recent"
                  active={activeTab === "recent"}
                  onClick={setActiveTab}
                />
              </div>

              {activeTab === "map" && (
                <IndiaHeatmap cityStats={cityStats} stateStats={stateStats} />
              )}

              {activeTab === "hotspots" && (
                <div className="space-y-6">
                  {cityStats.length > 0 && (
                    <div className="rounded-lg border border-border divide-y divide-border">
                      <div className="flex items-center gap-2.5 p-4">
                        <MapPin className="size-3.5 text-muted-foreground" />
                        <div>
                          <h3 className="text-xs font-medium tracking-wide">
                            City Hotspots
                          </h3>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            Ranked by suspicious report density
                          </p>
                        </div>
                      </div>
                      <div className="divide-y divide-border/50">
                        {cityStats.slice(0, 10).map((city, i) => (
                          <HotspotRow
                            key={city.city}
                            rank={i + 1}
                            name={city.city}
                            total={city.total}
                            suspicious={city.suspicious}
                            verified={city.verified}
                            maxTotal={cityStats[0]?.total ?? 1}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {stateStats.length > 0 && (
                    <div className="rounded-lg border border-border divide-y divide-border">
                      <div className="flex items-center gap-2.5 p-4">
                        <MapPin className="size-3.5 text-muted-foreground" />
                        <div>
                          <h3 className="text-xs font-medium tracking-wide">
                            State Overview
                          </h3>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            Report distribution across states
                          </p>
                        </div>
                      </div>
                      <div className="divide-y divide-border/50">
                        {stateStats.slice(0, 10).map((state, i) => (
                          <HotspotRow
                            key={state.state}
                            rank={i + 1}
                            name={state.state}
                            total={state.total}
                            suspicious={state.suspicious}
                            verified={state.verified}
                            maxTotal={stateStats[0]?.total ?? 1}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "recent" && (
                <div className="rounded-lg border border-border divide-y divide-border">
                  {recentReports.map((report) => (
                    <ReportCard key={report._id} report={report} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        <footer className="border-t border-border/50 pt-6 pb-4">
          <p className="text-[11px] text-muted-foreground/40 text-center tracking-wide">
            CitizenAudit is a prototype civic tool. Data reflects community
            submissions and AI-assisted assessments, not official BIS records.
          </p>
        </footer>
      </main>
    </div>
  );
}

function TabButton({
  id,
  icon: Icon,
  label,
  active,
  onClick,
}: {
  id: TabId;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
  onClick: (id: TabId) => void;
}) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center gap-1.5 px-4 py-2.5 text-[11px] font-medium tracking-wide border-b-2 transition-colors ${
        active
          ? "border-accent text-foreground"
          : "border-transparent text-muted-foreground hover:text-foreground/70"
      }`}
    >
      <Icon className="size-3.5" />
      {label}
    </button>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  color?: "verified" | "suspicious" | "not-found";
}) {
  const iconColor = color === "verified"
    ? "text-verified/70"
    : color === "suspicious"
    ? "text-suspicious/70"
    : color === "not-found"
    ? "text-not-found/70"
    : "text-muted-foreground/50";

  const valueColor = color === "verified"
    ? "text-verified"
    : color === "suspicious"
    ? "text-suspicious"
    : color === "not-found"
    ? "text-not-found"
    : "text-foreground";

  return (
    <div className="flex flex-col items-center gap-1.5 bg-background p-4 sm:p-5">
      <Icon className={`size-4 ${iconColor}`} />
      <AnimatedNumber
        value={value}
        className={`text-2xl font-bold tabular-nums tracking-tight ${valueColor}`}
      />
      <span className="text-[11px] text-muted-foreground font-medium tracking-wide">
        {label}
      </span>
    </div>
  );
}

function HotspotRow({
  rank,
  name,
  total,
  suspicious,
  verified,
  maxTotal,
}: {
  rank: number;
  name: string;
  total: number;
  suspicious: number;
  verified: number;
  maxTotal: number;
}) {
  const barWidth = Math.max((total / maxTotal) * 100, 8);
  const suspiciousWidth = total > 0 ? (suspicious / total) * 100 : 0;
  const verifiedWidth = total > 0 ? (verified / total) * 100 : 0;

  return (
    <div className="px-4 py-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-muted-foreground/40 w-5 text-right tabular-nums font-mono">
            {String(rank).padStart(2, "0")}
          </span>
          <span className="text-xs font-medium">{name}</span>
        </div>
        <div className="flex items-center gap-2">
          {suspicious > 0 && (
            <span className="text-[10px] text-suspicious font-mono tabular-nums">
              {suspicious}s
            </span>
          )}
          {verified > 0 && (
            <span className="text-[10px] text-verified/60 font-mono tabular-nums">
              {verified}v
            </span>
          )}
          <span className="text-[10px] text-muted-foreground font-mono tabular-nums w-6 text-right">
            {total}
          </span>
        </div>
      </div>
      <div
        className="h-1 rounded-full bg-muted overflow-hidden"
        style={{ width: `${barWidth}%` }}
      >
        <div className="h-full flex">
          {suspiciousWidth > 0 && (
            <div
              className="h-full bg-suspicious/60"
              style={{ width: `${suspiciousWidth}%` }}
            />
          )}
          {verifiedWidth > 0 && (
            <div
              className="h-full bg-verified/40"
              style={{ width: `${verifiedWidth}%` }}
            />
          )}
          <div className="h-full flex-1 bg-foreground/10" />
        </div>
      </div>
    </div>
  );
}

const verdictMap: Record<
  string,
  { label: string; indicator: string; textColor: string }
> = {
  verified: { label: "VERIFIED", indicator: "bg-verified", textColor: "text-verified" },
  not_found: { label: "NOT FOUND", indicator: "bg-not-found", textColor: "text-not-found" },
  suspicious: { label: "SUSPICIOUS", indicator: "bg-suspicious", textColor: "text-suspicious" },
  needs_review: { label: "REVIEW", indicator: "bg-muted-foreground", textColor: "text-muted-foreground" },
};

function ReportCard({
  report,
}: {
  report: {
    _id: string;
    _creationTime: number;
    productName: string;
    brandName?: string;
    isiNumber: string;
    verdict: "verified" | "not_found" | "suspicious" | "needs_review";
    city: string;
    state: string;
    imageUrl: string | null;
    shopName?: string;
  };
}) {
  const config = verdictMap[report.verdict];
  const timeAgo = getTimeAgo(report._creationTime);

  return (
    <div className="flex gap-4 p-4">
      {report.imageUrl && (
        <img
          src={report.imageUrl}
          alt={report.productName}
          className="size-14 rounded-md object-cover bg-muted shrink-0 border border-border"
        />
      )}
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-medium truncate">{report.productName}</p>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className={`size-1.5 rounded-full ${config.indicator}`} />
            <span className={`text-[10px] font-mono tracking-wider ${config.textColor}`}>
              {config.label}
            </span>
          </div>
        </div>
        {report.isiNumber && (
          <p className="text-[11px] font-mono text-muted-foreground tracking-wide">
            {report.isiNumber}
          </p>
        )}
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground/60">
          <span className="flex items-center gap-1">
            <MapPin className="size-2.5" />
            {report.city}, {report.state}
          </span>
          <span>{timeAgo}</span>
        </div>
      </div>
    </div>
  );
}

function getTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border/50 rounded-lg overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-background p-5 flex flex-col items-center gap-2">
            <Skeleton className="size-4 rounded-full" style={{ animationDelay: `${i * 100}ms` }} />
            <Skeleton className="h-7 w-12 rounded-md" style={{ animationDelay: `${i * 100 + 50}ms` }} />
            <Skeleton className="h-3 w-16 rounded-md" style={{ animationDelay: `${i * 100 + 100}ms` }} />
          </div>
        ))}
      </div>
      <div className="flex gap-4 border-b border-border pb-2.5">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-5 w-16 rounded-md" style={{ animationDelay: `${i * 80}ms` }} />
        ))}
      </div>
      <div className="rounded-lg border border-border overflow-hidden">
        <Skeleton className="h-[420px] w-full rounded-none" />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-5">
      <div className="size-16 rounded-xl border border-border flex items-center justify-center">
        <BarChart3 className="size-6 text-muted-foreground" />
      </div>
      <div className="text-center space-y-1.5">
        <h2 className="text-sm font-bold tracking-wide">
          No reports yet
        </h2>
        <p className="text-[12px] text-muted-foreground max-w-sm">
          Be the first to scan a product and contribute to consumer safety
          intelligence across India.
        </p>
      </div>
      <Link href="/scan">
        <Button className="text-[11px] font-medium tracking-wide h-9 rounded-lg">
          <Scan className="size-3.5 mr-1.5" />
          Start Scanning
        </Button>
      </Link>
    </div>
  );
}
