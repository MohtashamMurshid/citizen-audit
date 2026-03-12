import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const submit = mutation({
  args: {
    imageStorageId: v.id("_storage"),
    productName: v.string(),
    brandName: v.optional(v.string()),
    productType: v.optional(v.string()),
    isiNumber: v.string(),
    extractedText: v.optional(v.string()),
    verdict: v.union(
      v.literal("verified"),
      v.literal("not_found"),
      v.literal("suspicious"),
      v.literal("needs_review")
    ),
    confidence: v.number(),
    shopName: v.optional(v.string()),
    city: v.string(),
    state: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const imageUrl = await ctx.storage.getUrl(args.imageStorageId);
    return await ctx.db.insert("reports", {
      ...args,
      imageUrl: imageUrl ?? undefined,
    });
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const reports = await ctx.db.query("reports").order("desc").take(50);
    return Promise.all(
      reports.map(async (report) => ({
        ...report,
        imageUrl: await ctx.storage.getUrl(report.imageStorageId),
      }))
    );
  },
});

export const statsByCity = query({
  args: {},
  handler: async (ctx) => {
    const reports = await ctx.db.query("reports").collect();

    const cityMap: Record<
      string,
      { total: number; suspicious: number; verified: number; notFound: number }
    > = {};

    for (const r of reports) {
      if (!cityMap[r.city]) {
        cityMap[r.city] = { total: 0, suspicious: 0, verified: 0, notFound: 0 };
      }
      cityMap[r.city].total++;
      if (r.verdict === "suspicious" || r.verdict === "needs_review") {
        cityMap[r.city].suspicious++;
      } else if (r.verdict === "verified") {
        cityMap[r.city].verified++;
      } else {
        cityMap[r.city].notFound++;
      }
    }

    return Object.entries(cityMap)
      .map(([city, stats]) => ({ city, ...stats }))
      .sort((a, b) => b.suspicious - a.suspicious);
  },
});

export const statsByState = query({
  args: {},
  handler: async (ctx) => {
    const reports = await ctx.db.query("reports").collect();

    const stateMap: Record<
      string,
      { total: number; suspicious: number; verified: number }
    > = {};

    for (const r of reports) {
      if (!stateMap[r.state]) {
        stateMap[r.state] = { total: 0, suspicious: 0, verified: 0 };
      }
      stateMap[r.state].total++;
      if (r.verdict === "suspicious" || r.verdict === "needs_review") {
        stateMap[r.state].suspicious++;
      } else if (r.verdict === "verified") {
        stateMap[r.state].verified++;
      }
    }

    return Object.entries(stateMap)
      .map(([state, stats]) => ({ state, ...stats }))
      .sort((a, b) => b.total - a.total);
  },
});

export const overallStats = query({
  args: {},
  handler: async (ctx) => {
    const reports = await ctx.db.query("reports").collect();
    return {
      total: reports.length,
      verified: reports.filter((r) => r.verdict === "verified").length,
      suspicious: reports.filter(
        (r) => r.verdict === "suspicious" || r.verdict === "needs_review"
      ).length,
      notFound: reports.filter((r) => r.verdict === "not_found").length,
      cities: new Set(reports.map((r) => r.city)).size,
      states: new Set(reports.map((r) => r.state)).size,
    };
  },
});
