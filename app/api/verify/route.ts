import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

const verificationSchema = z.object({
  verdict: z.enum(["verified", "not_found", "suspicious", "needs_review"]),
  reason: z.string(),
  confidence: z.number().min(0).max(1),
  // OpenAI structured outputs require nullable fields instead of omitted ones.
  knownStandard: z.string().nullable(),
  standardTitle: z.string().nullable(),
});

const KNOWN_ISI_STANDARDS: Record<string, string> = {
  "IS 1293": "Electric Hotplates for domestic purposes",
  "IS 302": "Safety of household and similar electrical appliances",
  "IS 694": "PVC insulated cables for working voltages up to and including 1100V",
  "IS 1180": "Distribution Transformers",
  "IS 8143": "Aluminium alloy pressure die castings",
  "IS 15885": "Packaged Drinking Water (other than Natural Mineral Water)",
  "IS 14543": "Packaged Drinking Water (other than Packaged Natural Mineral Water)",
  "IS 4984": "High density polyethylene pipes for potable water supply",
  "IS 269": "Ordinary Portland Cement, 33 Grade",
  "IS 8112": "Portland Cement, 43 Grade",
  "IS 12269": "Portland Cement, 53 Grade",
  "IS 1077": "Common Burnt Clay Building Bricks",
  "IS 3812": "Pulverised Fuel Ash",
  "IS 383": "Coarse and Fine Aggregate",
  "IS 516": "Methods of Tests for Strength of Concrete",
  "IS 10500": "Drinking Water — Specification",
  "IS 323": "Bitumen for road work",
};

export async function POST(request: Request) {
  const { isiNumber, productName, brandName, extractedText } =
    await request.json();

  if (!isiNumber) {
    return Response.json(
      {
        verdict: "not_found" as const,
        reason: "No ISI/BIS number was extracted from the product image.",
        confidence: 0.9,
      },
      { status: 200 }
    );
  }

  const normalizedNumber = isiNumber.replace(/[^a-zA-Z0-9]/g, " ").trim().toUpperCase();

  const directMatch = Object.entries(KNOWN_ISI_STANDARDS).find(([key]) =>
    normalizedNumber.includes(key.replace("IS ", ""))
  );

  if (directMatch) {
    return Response.json({
      verdict: "verified",
      reason: `ISI standard ${directMatch[0]} is a known BIS standard for "${directMatch[1]}". This appears to be a legitimate certification number.`,
      confidence: 0.85,
      knownStandard: directMatch[0],
      standardTitle: directMatch[1],
    });
  }

  try {
    const { object } = await generateObject({
      model: openai("gpt-5.3-codex"),
      schema: verificationSchema,
      prompt: `You are a BIS (Bureau of Indian Standards) verification assistant for a prototype system.

Given the following extracted product information, assess whether the ISI/BIS certification claim appears legitimate:

ISI Number: ${isiNumber}
Product Name: ${productName || "Unknown"}
Brand: ${brandName || "Unknown"}
Label Text: ${extractedText || "N/A"}

Consider:
1. Whether the ISI number format looks valid (typically "IS XXXX" or "CM/L-XXXXXXX")
2. Whether the claimed standard is plausible for the product type
3. Any red flags in the label text

IMPORTANT: This is a prototype system. Be transparent that this is an AI-assisted assessment, not an official BIS verification. If unsure, use "needs_review" verdict.`,
    });

    return Response.json({
      ...object,
      knownStandard: object.knownStandard ?? undefined,
      standardTitle: object.standardTitle ?? undefined,
    });
  } catch (error) {
    console.error("Verification error:", error);
    return Response.json({
      verdict: "needs_review",
      reason:
        "Unable to complete automated verification. This report has been flagged for manual review.",
      confidence: 0.3,
    });
  }
}
