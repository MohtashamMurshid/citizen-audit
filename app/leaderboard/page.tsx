"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SharedHeader } from "@/components/shared-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Trophy,
  MapPin,
  Scan,
  ArrowRight,
  Target,
  Globe,
  ShieldAlert,
  ShieldCheck,
  Medal,
  Award,
  Zap,
  Crown,
  Star,
  Flag,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type TabId = "cities" | "states" | "milestones";

const MILESTONES = {
  totalScans: [10, 50, 100, 500, 1000],
  citiesCovered: [5, 10, 25, 50],
  statesCovered: [5, 10, 20, 36],
  suspiciousFlagged: [5, 10, 25, 50, 100],
};

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  earned: boolean;
}

export default function LeaderboardPage() {
  const cityData = useQuery(api.reports.leaderboard);
  const stateData = useQuery(api.reports.stateLeaderboard);
  const milestones = useQuery(api.reports.scanMilestones);
  const [activeTab, setActiveTab] = useState<TabId>("cities");

  const isLoading = !cityData || !stateData || !milestones;

  const badges: Badge[] = milestones
    ? [
        {
          id: "first-scan",
          name: "First Scan",
          description: "Community submitted its first report",
          icon: Zap,
          earned: milestones.totalScans >= 1,
        },
        {
          id: "vigilant-city",
          name: "Vigilant City",
          description: "A city reached 10+ scans",
          icon: MapPin,
          earned: (cityData ?? []).some((c) => c.total >= 10),
        },
        {
          id: "nationwide",
          name: "Nationwide",
          description: "Reports from 10+ states",
          icon: Globe,
          earned: milestones.statesCovered >= 10,
        },
        {
          id: "counterfeit-hunter",
          name: "Counterfeit Hunter",
          description: "10+ suspicious products flagged",
          icon: ShieldAlert,
          earned: milestones.suspiciousFlagged >= 10,
        },
        {
          id: "century",
          name: "Century",
          description: "100 total scans community-wide",
          icon: Crown,
          earned: milestones.totalScans >= 100,
        },
        {
          id: "verified-guardian",
          name: "Verified Guardian",
          description: "25+ products verified as legitimate",
          icon: ShieldCheck,
          earned: milestones.verifiedCount >= 25,
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-background">
      <SharedHeader />

      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 animate-fade-up">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-3.5 py-1.5 text-[11px] font-medium tracking-wide text-accent">
              <Trophy className="size-3.5" />
              Community Rankings
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Leaderboard
            </h1>
            <p className="text-sm text-muted-foreground">
              City and state rankings by citizen scan activity across India
            </p>
          </div>
          <Link href="/scan">
            <Button className="text-[11px] font-medium tracking-wide h-9 px-5 shrink-0 rounded-lg">
              <Scan className="size-3.5 mr-1.5" />
              Contribute
              <ArrowRight className="size-3 ml-1.5 opacity-50" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <LeaderboardSkeleton />
        ) : (
          <>
            <div
              className="space-y-4 animate-fade-up"
              style={{ animationDelay: "100ms" }}
            >
              <div className="flex items-center gap-0 border-b border-border">
                <TabButton
                  id="cities"
                  icon={MapPin}
                  label="Cities"
                  active={activeTab === "cities"}
                  onClick={setActiveTab}
                />
                <TabButton
                  id="states"
                  icon={Flag}
                  label="States"
                  active={activeTab === "states"}
                  onClick={setActiveTab}
                />
                <TabButton
                  id="milestones"
                  icon={Target}
                  label="Milestones"
                  active={activeTab === "milestones"}
                  onClick={setActiveTab}
                />
              </div>

              {activeTab === "cities" && (
                <CityLeaderboard data={cityData} />
              )}

              {activeTab === "states" && (
                <StateLeaderboard data={stateData} />
              )}

              {activeTab === "milestones" && (
                <MilestonesView milestones={milestones} badges={badges} />
              )}
            </div>
          </>
        )}

        <footer className="border-t border-border/50 pt-6 pb-4">
          <p className="text-[11px] text-muted-foreground/40 text-center tracking-wide">
            Rankings update in real-time as new scans are submitted by the
            community.
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

// ── City Leaderboard ──

function CityLeaderboard({
  data,
}: {
  data: {
    city: string;
    total: number;
    suspicious: number;
    verified: number;
    notFound: number;
    accuracy: number;
  }[];
}) {
  if (data.length === 0) return <EmptyRankings entity="city" />;

  const topCity = data[0];

  return (
    <div className="space-y-4">
      {/* Highlight card for #1 */}
      <div className="rounded-lg border border-accent/20 bg-accent/5 p-5 space-y-3">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center">
            <Crown className="size-4 text-accent" />
          </div>
          <div>
            <p className="text-xs font-bold tracking-wide">{topCity.city}</p>
            <p className="text-[11px] text-muted-foreground">
              Leading with {topCity.total} scan{topCity.total !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <MiniStat
            label="Verified"
            value={topCity.verified}
            color="text-verified"
          />
          <MiniStat
            label="Suspicious"
            value={topCity.suspicious}
            color="text-suspicious"
          />
          <MiniStat
            label="Accuracy"
            value={`${Math.round(topCity.accuracy * 100)}%`}
            color="text-accent"
          />
        </div>
      </div>

      {/* Full list */}
      <div className="rounded-lg border border-border divide-y divide-border">
        {data.map((entry, i) => (
          <RankRow
            key={entry.city}
            rank={i + 1}
            name={entry.city}
            total={entry.total}
            verified={entry.verified}
            suspicious={entry.suspicious}
            accuracy={entry.accuracy}
            maxTotal={data[0].total}
          />
        ))}
      </div>
    </div>
  );
}

// ── State Leaderboard ──

function StateLeaderboard({
  data,
}: {
  data: {
    state: string;
    total: number;
    suspicious: number;
    verified: number;
    notFound: number;
    accuracy: number;
  }[];
}) {
  if (data.length === 0) return <EmptyRankings entity="state" />;

  const topState = data[0];

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-accent/20 bg-accent/5 p-5 space-y-3">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center">
            <Crown className="size-4 text-accent" />
          </div>
          <div>
            <p className="text-xs font-bold tracking-wide">{topState.state}</p>
            <p className="text-[11px] text-muted-foreground">
              Leading with {topState.total} scan
              {topState.total !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <MiniStat
            label="Verified"
            value={topState.verified}
            color="text-verified"
          />
          <MiniStat
            label="Suspicious"
            value={topState.suspicious}
            color="text-suspicious"
          />
          <MiniStat
            label="Accuracy"
            value={`${Math.round(topState.accuracy * 100)}%`}
            color="text-accent"
          />
        </div>
      </div>

      <div className="rounded-lg border border-border divide-y divide-border">
        {data.map((entry, i) => (
          <RankRow
            key={entry.state}
            rank={i + 1}
            name={entry.state}
            total={entry.total}
            verified={entry.verified}
            suspicious={entry.suspicious}
            accuracy={entry.accuracy}
            maxTotal={data[0].total}
          />
        ))}
      </div>
    </div>
  );
}

// ── Milestones ──

function MilestonesView({
  milestones,
  badges,
}: {
  milestones: {
    totalScans: number;
    citiesCovered: number;
    statesCovered: number;
    suspiciousFlagged: number;
    verifiedCount: number;
  };
  badges: Badge[];
}) {
  const nextScanGoal =
    MILESTONES.totalScans.find((m) => m > milestones.totalScans) ??
    MILESTONES.totalScans[MILESTONES.totalScans.length - 1];
  const nextCityGoal =
    MILESTONES.citiesCovered.find((m) => m > milestones.citiesCovered) ??
    MILESTONES.citiesCovered[MILESTONES.citiesCovered.length - 1];
  const nextStateGoal =
    MILESTONES.statesCovered.find((m) => m > milestones.statesCovered) ??
    MILESTONES.statesCovered[MILESTONES.statesCovered.length - 1];
  const nextSuspiciousGoal =
    MILESTONES.suspiciousFlagged.find(
      (m) => m > milestones.suspiciousFlagged
    ) ??
    MILESTONES.suspiciousFlagged[MILESTONES.suspiciousFlagged.length - 1];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-px bg-border/50 rounded-lg overflow-hidden">
        <MilestoneCard
          icon={Scan}
          label="Total Scans"
          current={milestones.totalScans}
          goal={nextScanGoal}
          color="accent"
        />
        <MilestoneCard
          icon={MapPin}
          label="Cities Covered"
          current={milestones.citiesCovered}
          goal={nextCityGoal}
          color="verified"
        />
        <MilestoneCard
          icon={Globe}
          label="States Covered"
          current={milestones.statesCovered}
          goal={nextStateGoal}
          color="accent"
        />
        <MilestoneCard
          icon={ShieldAlert}
          label="Suspicious Flagged"
          current={milestones.suspiciousFlagged}
          goal={nextSuspiciousGoal}
          color="suspicious"
        />
      </div>

      {/* Badges */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-[11px] font-medium tracking-wide text-muted-foreground">
            Community Badges
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-border/50 rounded-lg overflow-hidden">
          {badges.map((badge) => (
            <BadgeCard key={badge.id} badge={badge} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Shared sub-components ──

function RankRow({
  rank,
  name,
  total,
  verified,
  suspicious,
  accuracy,
  maxTotal,
}: {
  rank: number;
  name: string;
  total: number;
  verified: number;
  suspicious: number;
  accuracy: number;
  maxTotal: number;
}) {
  const barWidth = Math.max((total / maxTotal) * 100, 8);

  const rankDisplay =
    rank === 1 ? (
      <Medal className="size-4 text-yellow-500" />
    ) : rank === 2 ? (
      <Medal className="size-4 text-zinc-400" />
    ) : rank === 3 ? (
      <Medal className="size-4 text-amber-700" />
    ) : (
      <span className="text-[11px] text-muted-foreground/40 w-5 text-center tabular-nums font-mono">
        {String(rank).padStart(2, "0")}
      </span>
    );

  return (
    <div className="px-4 py-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-5 flex justify-center">{rankDisplay}</div>
          <span className="text-xs font-medium">{name}</span>
        </div>
        <div className="flex items-center gap-3">
          {verified > 0 && (
            <span className="text-[10px] text-verified/60 font-mono tabular-nums">
              {verified}v
            </span>
          )}
          {suspicious > 0 && (
            <span className="text-[10px] text-suspicious font-mono tabular-nums">
              {suspicious}s
            </span>
          )}
          <span className="text-[10px] text-accent font-mono tabular-nums">
            {Math.round(accuracy * 100)}%
          </span>
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
          {accuracy > 0 && (
            <div
              className="h-full bg-verified/50"
              style={{ width: `${accuracy * 100}%` }}
            />
          )}
          {suspicious > 0 && total > 0 && (
            <div
              className="h-full bg-suspicious/50"
              style={{ width: `${(suspicious / total) * 100}%` }}
            />
          )}
          <div className="h-full flex-1 bg-foreground/10" />
        </div>
      </div>
    </div>
  );
}

function MilestoneCard({
  icon: Icon,
  label,
  current,
  goal,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  current: number;
  goal: number;
  color: "accent" | "verified" | "suspicious";
}) {
  const progress = Math.min(current / goal, 1);
  const circumference = 2 * Math.PI * 28;
  const strokeDashoffset = circumference * (1 - progress);

  const ringColor =
    color === "accent"
      ? "stroke-accent"
      : color === "verified"
        ? "stroke-verified"
        : "stroke-suspicious";

  const textColor =
    color === "accent"
      ? "text-accent"
      : color === "verified"
        ? "text-verified"
        : "text-suspicious";

  return (
    <div className="flex flex-col items-center gap-3 bg-background p-5 sm:p-6">
      <div className="relative size-16">
        <svg className="size-16 -rotate-90" viewBox="0 0 64 64">
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="currentColor"
            className="text-muted/50"
            strokeWidth="3"
          />
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            className={ringColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: "stroke-dashoffset 1s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className={`size-4 ${textColor}`} />
        </div>
      </div>
      <div className="text-center space-y-1">
        <span className={`text-lg font-bold tabular-nums tracking-tight ${textColor}`}>
          {current}
          <span className="text-muted-foreground/40 text-xs font-normal">
            {" "}
            / {goal}
          </span>
        </span>
        <p className="text-[11px] text-muted-foreground font-medium tracking-wide">
          {label}
        </p>
      </div>
    </div>
  );
}

function BadgeCard({ badge }: { badge: Badge }) {
  const Icon = badge.icon;

  return (
    <div
      className={`flex flex-col items-center gap-2.5 bg-background p-4 sm:p-5 transition-opacity ${
        badge.earned ? "opacity-100" : "opacity-30"
      }`}
    >
      <div
        className={`size-10 rounded-xl flex items-center justify-center border ${
          badge.earned
            ? "border-accent/30 bg-accent/10"
            : "border-border bg-muted/30"
        }`}
      >
        <Icon
          className={`size-4 ${badge.earned ? "text-accent" : "text-muted-foreground/50"}`}
        />
      </div>
      <div className="text-center space-y-0.5">
        <p className="text-[11px] font-medium tracking-wide">{badge.name}</p>
        <p className="text-[10px] text-muted-foreground leading-snug">
          {badge.description}
        </p>
      </div>
      {badge.earned && (
        <span className="flex items-center gap-1 text-[10px] font-medium tracking-wider text-verified">
          <Star className="size-2.5" />
          EARNED
        </span>
      )}
    </div>
  );
}

function MiniStat({
  label,
  value,
  color,
}: {
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <div className="text-center">
      <span className={`text-sm font-bold tabular-nums ${color}`}>
        {value}
      </span>
      <p className="text-[10px] text-muted-foreground font-medium tracking-wide mt-0.5">
        {label}
      </p>
    </div>
  );
}

function EmptyRankings({ entity }: { entity: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="size-12 rounded-xl border border-border flex items-center justify-center">
        <Trophy className="size-5 text-muted-foreground" />
      </div>
      <div className="text-center space-y-1.5">
        <h2 className="text-sm font-bold tracking-wide">
          No {entity} rankings yet
        </h2>
        <p className="text-[12px] text-muted-foreground max-w-sm">
          Be the first to scan a product and put your {entity} on the
          leaderboard.
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

function LeaderboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-border pb-2.5">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-5 w-20 rounded-md"
            style={{ animationDelay: `${i * 80}ms` }}
          />
        ))}
      </div>
      <div className="rounded-lg border border-border overflow-hidden divide-y divide-border">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="px-4 py-3 flex items-center gap-3">
            <Skeleton
              className="size-5 rounded-full"
              style={{ animationDelay: `${i * 60}ms` }}
            />
            <Skeleton
              className="h-4 w-24 rounded-md"
              style={{ animationDelay: `${i * 60 + 30}ms` }}
            />
            <div className="flex-1" />
            <Skeleton
              className="h-3 w-8 rounded-md"
              style={{ animationDelay: `${i * 60 + 60}ms` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
