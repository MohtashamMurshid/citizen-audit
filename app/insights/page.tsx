"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Shield,
  ArrowLeft,
  BarChart3,
  MapPin,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Clock,
  TrendingUp,
  Scan,
  Map,
} from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useState } from "react";

const IndiaHeatmap = dynamic(
  () => import("@/components/india-heatmap").then((m) => m.IndiaHeatmap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[420px] w-full border border-border flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="size-2 bg-foreground animate-pulse" />
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
            Loading map
          </p>
        </div>
      </div>
    ),
  }
);

type TabId = "map" | "hotspots" | "recent";

export default function InsightsPage() {
  const stats = useQuery(api.reports.overallStats);
  const cityStats = useQuery(api.reports.statsByCity);
  const stateStats = useQuery(api.reports.statsByState);
  const recentReports = useQuery(api.reports.list);
  const [activeTab, setActiveTab] = useState<TabId>("map");

  const isLoading = !stats || !cityStats || !stateStats || !recentReports;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-12 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex size-7 items-center justify-center border border-foreground/20 group-hover:border-foreground/40 transition-colors">
              <Shield className="size-3.5 text-foreground" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground">
              CitizenAudit
            </span>
          </Link>
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground gap-1.5 h-8 px-3"
            >
              <ArrowLeft className="size-3" />
              New Scan
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        <div className="space-y-3 animate-fade-up">
          <div className="inline-flex items-center gap-2 border border-border/60 px-3 py-1.5 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <BarChart3 className="size-3" />
            Community Data
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Insights
          </h1>
          <p className="text-xs text-muted-foreground font-light">
            Aggregated verification data from citizen scans across India
          </p>
        </div>

        {isLoading ? (
          <LoadingSkeleton />
        ) : stats.total === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div
              className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border/50 animate-fade-up"
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
              />
              <StatCard
                icon={ShieldAlert}
                label="Suspicious"
                value={stats.suspicious}
                alert
              />
              <StatCard
                icon={ShieldX}
                label="Not Found"
                value={stats.notFound}
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
                    <div className="border border-border divide-y divide-border">
                      <div className="flex items-center gap-2.5 p-4">
                        <MapPin className="size-3.5 text-muted-foreground" />
                        <div>
                          <h3 className="text-xs font-medium uppercase tracking-[0.15em]">
                            City Hotspots
                          </h3>
                          <p className="text-[10px] text-muted-foreground mt-0.5 font-light">
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
                    <div className="border border-border divide-y divide-border">
                      <div className="flex items-center gap-2.5 p-4">
                        <MapPin className="size-3.5 text-muted-foreground" />
                        <div>
                          <h3 className="text-xs font-medium uppercase tracking-[0.15em]">
                            State Overview
                          </h3>
                          <p className="text-[10px] text-muted-foreground mt-0.5 font-light">
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
                <div className="border border-border divide-y divide-border">
                  {recentReports.map((report) => (
                    <ReportCard key={report._id} report={report} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        <footer className="border-t border-border/50 pt-6 pb-4">
          <p className="text-[10px] text-muted-foreground/40 text-center uppercase tracking-[0.15em]">
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
      className={`flex items-center gap-1.5 px-4 py-2.5 text-[10px] uppercase tracking-[0.2em] border-b-2 transition-colors ${
        active
          ? "border-foreground text-foreground"
          : "border-transparent text-muted-foreground hover:text-foreground/70"
      }`}
    >
      <Icon className="size-3" />
      {label}
    </button>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  alert,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  alert?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 bg-background p-4 sm:p-5">
      <Icon
        className={`size-4 ${alert ? "text-destructive/70" : "text-muted-foreground/50"}`}
      />
      <span
        className={`text-2xl font-bold tabular-nums tracking-tight ${alert ? "text-destructive" : ""}`}
      >
        {value}
      </span>
      <span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
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

  return (
    <div className="px-4 py-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-muted-foreground/40 w-5 text-right tabular-nums font-mono">
            {String(rank).padStart(2, "0")}
          </span>
          <span className="text-xs font-medium">{name}</span>
        </div>
        <div className="flex items-center gap-2">
          {suspicious > 0 && (
            <span className="text-[10px] text-destructive/70 font-mono tabular-nums">
              {suspicious}s
            </span>
          )}
          {verified > 0 && (
            <span className="text-[10px] text-foreground/50 font-mono tabular-nums">
              {verified}v
            </span>
          )}
          <span className="text-[10px] text-muted-foreground font-mono tabular-nums w-6 text-right">
            {total}
          </span>
        </div>
      </div>
      <div
        className="h-px bg-muted overflow-hidden"
        style={{ width: `${barWidth}%` }}
      >
        <div className="h-full flex">
          {suspiciousWidth > 0 && (
            <div
              className="h-full bg-destructive/50"
              style={{ width: `${suspiciousWidth}%` }}
            />
          )}
          <div className="h-full flex-1 bg-foreground/20" />
        </div>
      </div>
    </div>
  );
}

const verdictMap: Record<
  string,
  { label: string; indicator: string }
> = {
  verified: { label: "VERIFIED", indicator: "bg-foreground" },
  not_found: { label: "NOT FOUND", indicator: "bg-muted-foreground" },
  suspicious: { label: "SUSPICIOUS", indicator: "bg-destructive" },
  needs_review: { label: "REVIEW", indicator: "bg-muted-foreground" },
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
          className="size-14 object-cover bg-muted shrink-0 border border-border"
        />
      )}
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-medium truncate">{report.productName}</p>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className={`size-1.5 rounded-full ${config.indicator}`} />
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              {config.label}
            </span>
          </div>
        </div>
        {report.isiNumber && (
          <p className="text-[10px] font-mono text-muted-foreground tracking-wide">
            {report.isiNumber}
          </p>
        )}
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground/60">
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border/50">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-background p-5">
            <Skeleton className="h-20 w-full bg-muted" />
          </div>
        ))}
      </div>
      <Skeleton className="h-8 w-40 bg-muted" />
      <div className="space-y-px">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full bg-muted" />
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-5">
      <div className="size-16 border border-border flex items-center justify-center">
        <BarChart3 className="size-6 text-muted-foreground" />
      </div>
      <div className="text-center space-y-1.5">
        <h2 className="text-sm font-bold uppercase tracking-[0.15em]">
          No reports yet
        </h2>
        <p className="text-[11px] text-muted-foreground font-light max-w-sm">
          Be the first to scan a product and contribute to consumer safety
          intelligence across India.
        </p>
      </div>
      <Link href="/">
        <Button className="text-xs uppercase tracking-[0.15em] h-9">
          <Scan className="size-3.5 mr-1.5" />
          Start Scanning
        </Button>
      </Link>
    </div>
  );
}
