import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

const extractionSchema = z.object({
  productName: z.string().describe("The product name visible on the label"),
  brandName: z
    .string()
    .nullable()
    .describe("The brand or manufacturer name, or null if not found"),
  productType: z
    .string()
    .nullable()
    .describe("Category like electrical, food, cement, etc., or null if unclear"),
  isiNumber: z
    .string()
    .describe(
      "The ISI or BIS certification number (e.g. IS 1293, CM/L-1234567). Return empty string if not found."
    ),
  extractedText: z
    .string()
    .nullable()
    .describe("All readable text from the product label, or null if unreadable"),
  confidence: z
    .number()
    .min(0)
    .max(1)
    .describe("How confident you are in the extraction, 0 to 1"),
});

function parseImageInput(imageUrl: string): Buffer | URL {
  if (imageUrl.startsWith("data:")) {
    const base64Data = imageUrl.split(",")[1];
    return Buffer.from(base64Data, "base64");
  }
  return new URL(imageUrl);
}

export async function POST(request: Request) {
  const { imageUrl } = await request.json();

  if (!imageUrl) {
    return Response.json({ error: "imageUrl is required" }, { status: 400 });
  }

  try {
    const imageInput = parseImageInput(imageUrl);

    const { object } = await generateObject({
      model: openai(
        
        "gpt-5.3-codex"
      ),
      schema: extractionSchema,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are an expert at reading product labels and ISI/BIS certification markings on Indian consumer products.

Analyze this product image and extract:
1. Product name
2. Brand / manufacturer name
3. Product type / category
4. ISI number or BIS certification number (look for "IS" followed by numbers, or "CM/L-" licence numbers, or the ISI mark logo with a number)
5. All readable text on the label

If you cannot find an ISI/BIS number, return an empty string for isiNumber and lower your confidence score.`,
            },
            {
              type: "image",
              image: imageInput,
            },
          ],
        },
      ],
    });

    return Response.json({
      ...object,
      brandName: object.brandName ?? undefined,
      productType: object.productType ?? undefined,
      extractedText: object.extractedText ?? undefined,
    });
  } catch (error) {
    console.error("Extraction error:", error);
    return Response.json(
      { error: "Failed to extract product information" },
      { status: 500 }
    );
  }
}
