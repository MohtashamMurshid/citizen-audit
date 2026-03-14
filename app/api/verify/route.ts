import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { KNOWN_ISI_MAP } from "@/lib/standards-data";

const verificationSchema = z.object({
  verdict: z.enum(["verified", "not_found", "suspicious", "needs_review"]),
  reason: z.string(),
  confidence: z.number().min(0).max(1),
  knownStandard: z.string().nullable(),
  standardTitle: z.string().nullable(),
});

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

  const directMatch = Object.entries(KNOWN_ISI_MAP).find(([key]) =>
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
