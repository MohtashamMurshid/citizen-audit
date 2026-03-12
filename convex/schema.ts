import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  reports: defineTable({
    imageStorageId: v.id("_storage"),
    imageUrl: v.optional(v.string()),
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
  })
    .index("by_verdict", ["verdict"])
    .index("by_city", ["city"])
    .index("by_state", ["state"]),
});
