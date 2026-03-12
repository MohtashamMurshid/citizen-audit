"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const IndiaHeatmap = dynamic(
  () => import("@/components/india-heatmap").then((m) => m.IndiaHeatmap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[420px] w-full rounded-xl border bg-muted/30 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading map...</p>
      </div>
    ),
  }
);

export default function InsightsPage() {
  const stats = useQuery(api.reports.overallStats);
  const cityStats = useQuery(api.reports.statsByCity);
  const stateStats = useQuery(api.reports.statsByState);
  const recentReports = useQuery(api.reports.list);

  const isLoading = !stats || !cityStats || !stateStats || !recentReports;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="size-5 text-primary" />
            <span className="text-base font-semibold tracking-tight">
              CitizenAudit
            </span>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="size-4" />
              New Scan
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 space-y-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="size-5" />
            <h1 className="text-2xl font-bold tracking-tight">
              Community Insights
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Aggregated verification data from citizen scans across India
          </p>
        </div>

        {isLoading ? (
          <LoadingSkeleton />
        ) : stats.total === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard
                icon={Scan}
                label="Total Scans"
                value={stats.total}
              />
              <StatCard
                icon={ShieldCheck}
                label="Verified"
                value={stats.verified}
                accent="emerald"
              />
              <StatCard
                icon={ShieldAlert}
                label="Suspicious"
                value={stats.suspicious}
                accent="red"
              />
              <StatCard
                icon={ShieldX}
                label="Not Found"
                value={stats.notFound}
                accent="amber"
              />
            </div>

            <Tabs defaultValue="hotspots">
              <TabsList>
                <TabsTrigger value="hotspots">
                  <TrendingUp className="size-3.5 mr-1" />
                  Hotspots
                </TabsTrigger>
                <TabsTrigger value="recent">
                  <Clock className="size-3.5 mr-1" />
                  Recent
                </TabsTrigger>
              </TabsList>

              <TabsContent value="hotspots" className="space-y-4 mt-4">
                {cityStats.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="size-4" />
                        City Hotspots
                      </CardTitle>
                      <CardDescription>
                        Cities ranked by number of suspicious reports
                      </CardDescription>
                    </CardHeader>
                    <Separator />
                    <CardContent className="pt-4">
                      <div className="space-y-3">
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
                    </CardContent>
                  </Card>
                )}

                {stateStats.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="size-4" />
                        State Overview
                      </CardTitle>
                      <CardDescription>
                        Report distribution across states
                      </CardDescription>
                    </CardHeader>
                    <Separator />
                    <CardContent className="pt-4">
                      <div className="space-y-3">
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
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="recent" className="space-y-3 mt-4">
                {recentReports.map((report) => (
                  <ReportCard key={report._id} report={report} />
                ))}
              </TabsContent>
            </Tabs>
          </>
        )}

        <footer className="border-t pt-6 pb-4">
          <p className="text-xs text-muted-foreground/60 text-center">
            CitizenAudit is a prototype civic tool. Data reflects community
            submissions and AI-assisted assessments, not official BIS records.
          </p>
        </footer>
      </main>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  accent?: "emerald" | "red" | "amber";
}) {
  const accentClass =
    accent === "emerald"
      ? "text-emerald-600 dark:text-emerald-400"
      : accent === "red"
        ? "text-red-600 dark:text-red-400"
        : accent === "amber"
          ? "text-amber-600 dark:text-amber-400"
          : "text-foreground";

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-1.5 py-4">
        <Icon className={`size-5 ${accent ? accentClass : "text-muted-foreground"}`} />
        <span className={`text-2xl font-bold tabular-nums ${accentClass}`}>
          {value}
        </span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </CardContent>
    </Card>
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
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground w-5 text-right tabular-nums">
            {rank}
          </span>
          <span className="text-sm font-medium">{name}</span>
        </div>
        <div className="flex items-center gap-2">
          {suspicious > 0 && (
            <Badge
              variant="outline"
              className="border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400 text-[10px] px-1.5"
            >
              {suspicious} suspicious
            </Badge>
          )}
          {verified > 0 && (
            <Badge
              variant="outline"
              className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] px-1.5"
            >
              {verified} verified
            </Badge>
          )}
          <span className="text-xs text-muted-foreground tabular-nums w-8 text-right">
            {total}
          </span>
        </div>
      </div>
      <div
        className="h-1.5 rounded-full bg-muted overflow-hidden"
        style={{ width: `${barWidth}%` }}
      >
        <div className="h-full flex">
          {suspiciousWidth > 0 && (
            <div
              className="h-full bg-red-500/60"
              style={{ width: `${suspiciousWidth}%` }}
            />
          )}
          <div className="h-full flex-1 bg-emerald-500/40" />
        </div>
      </div>
    </div>
  );
}

const verdictMap = {
  verified: {
    label: "Verified",
    className:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  },
  not_found: {
    label: "Not Found",
    className:
      "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  },
  suspicious: {
    label: "Suspicious",
    className: "",
  },
  needs_review: {
    label: "Needs Review",
    className:
      "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-400",
  },
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
  const vConfig = verdictMap[report.verdict];
  const timeAgo = getTimeAgo(report._creationTime);

  return (
    <Card>
      <CardContent className="flex gap-4 py-4">
        {report.imageUrl && (
          <img
            src={report.imageUrl}
            alt={report.productName}
            className="size-16 rounded-lg object-cover bg-muted shrink-0"
          />
        )}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium truncate">{report.productName}</p>
            <Badge
              variant={
                report.verdict === "suspicious" ? "destructive" : "outline"
              }
              className={vConfig.className}
            >
              {vConfig.label}
            </Badge>
          </div>
          {report.isiNumber && (
            <p className="text-xs font-mono text-muted-foreground">
              {report.isiNumber}
            </p>
          )}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="size-3" />
              {report.city}, {report.state}
            </span>
            <span>{timeAgo}</span>
          </div>
        </div>
      </CardContent>
    </Card>
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
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-8 w-40 rounded-lg" />
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
        <BarChart3 className="size-7 text-muted-foreground" />
      </div>
      <h2 className="text-lg font-semibold">No reports yet</h2>
      <p className="text-sm text-muted-foreground text-center max-w-sm">
        Be the first to scan a product and contribute to consumer safety
        intelligence across India.
      </p>
      <Link href="/">
        <Button>
          <Scan className="size-4 mr-1.5" />
          Start Scanning
        </Button>
      </Link>
    </div>
  );
}
