import {
  streamText,
  UIMessage,
  convertToModelMessages,
  tool,
  stepCountIs,
} from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { STANDARDS } from "@/lib/standards-data";

function isBisDomain(url: string): boolean {
  try {
    const hostname = new URL(url).hostname;
    return hostname === "bis.gov.in" || hostname.endsWith(".bis.gov.in");
  } catch {
    return false;
  }
}

export const maxDuration = 60;

const standardsSummary = STANDARDS.map(
  (s) =>
    `${s.id}: ${s.title} [${s.category}] ${s.mandatory ? "(Mandatory)" : "(Voluntary)"} — ${s.description}`
).join("\n");

const SYSTEM_PROMPT = `You are an expert assistant on BIS (Bureau of Indian Standards), ISI marks, Indian product certification, and the Open Standards Summit.

You have deep knowledge of:
- The Bureau of Indian Standards (BIS) and its role in India's quality ecosystem
- ISI marks, BIS certification process, and how consumers can verify products
- Indian Standards (IS) numbering, categories, and what they cover
- The Open Standards Summit hosted by FOSS United Srinagar in collaboration with BIS at HiTech 3
- The Standard-a-thon challenge and Draft Standards Preparation Activity
- Open-source advocacy and interoperability standards

You have access to two tools:
1. **searchWeb** — Search the live web for up-to-date information (restricted to the official BIS website).
2. **extractPage** — Read and extract content from a specific URL (only use with bis.gov.in URLs).

CRITICAL RULES — follow these on EVERY response:

1. **ALWAYS use the searchWeb tool** for EVERY user question — even if you think you know the answer from the built-in database. The user expects web-grounded answers with citations. The only exception is simple greetings or meta-questions about you.

2. **ONLY cite the official BIS website (bis.gov.in and its subdomains like www.bis.gov.in, standardsbis.bis.gov.in, etc.)**. You must NEVER cite or link to any other domain. All sources in your response must come from bis.gov.in or a subdomain of bis.gov.in. If search results include non-BIS sources, ignore them entirely and only use information from bis.gov.in pages. If no bis.gov.in results are found, rely on the built-in database and clearly state the information comes from the built-in reference data.

3. **ALWAYS include citations** in your response. After using searchWeb/extractPage, cite your sources as markdown links. At the end of your response, include a "Sources" section like:

---
**Sources:**
- [Page Title](https://www.bis.gov.in/...)
- [Page Title](https://bis.gov.in/...)

4. **Format everything with rich markdown**: use headings (##, ###), bold, bullet lists, numbered lists, code blocks, blockquotes, and tables where appropriate. Make responses scannable.

5. When searchWeb returns results, you may use extractPage to dig deeper into the most relevant bis.gov.in result before answering. NEVER use extractPage on non-bis.gov.in URLs.

Here is the built-in database of ${STANDARDS.length} Indian Standards for quick reference (use this to supplement search results, not replace them):

${standardsSummary}

Additional guidelines:
- Be thorough but concise. Break long answers into sections with headings.
- If you're unsure, say so — do not fabricate information.
- ONLY use and cite official BIS sources (bis.gov.in and its subdomains). No other websites are allowed as sources.`;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai("gpt-5.3-codex"),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    tools: {
      searchWeb: tool({
        description:
          "Search the official BIS website (bis.gov.in) for information about BIS standards, ISI marks, Indian product certification, regulations, or any related topic. Results are restricted to bis.gov.in only.",
        inputSchema: z.object({
          objective: z
            .string()
            .describe("What information you are looking for"),
          queries: z
            .array(z.string())
            .describe("2-3 specific search queries to find the information"),
        }),
        execute: async ({ objective, queries }) => {
          const bisQueries = queries.map((q) =>
            q.includes("site:bis.gov.in") ? q : `site:bis.gov.in ${q}`
          );
          const res = await fetch("https://api.parallel.ai/v1beta/search", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.PARALLEL_API_KEY!,
            },
            body: JSON.stringify({
              objective,
              search_queries: bisQueries,
              mode: "fast",
              excerpts: { max_chars_per_result: 5000 },
            }),
          });
          const data = await res.json();
          const allResults =
            data.results?.map(
              (r: { title?: string; url?: string; excerpts?: string[] }) => ({
                title: r.title,
                url: r.url,
                excerpts: r.excerpts?.slice(0, 2),
              })
            ) ?? [];
          return allResults.filter(
            (r: { url?: string }) => r.url && isBisDomain(r.url)
          );
        },
      }),
      extractPage: tool({
        description:
          "Extract and read content from a bis.gov.in URL only. Use this to read a BIS page in detail. Only bis.gov.in URLs are allowed.",
        inputSchema: z.object({
          url: z
            .string()
            .describe("The bis.gov.in URL to extract content from"),
          objective: z
            .string()
            .describe("What specific information to look for on this page"),
        }),
        execute: async ({ url, objective }) => {
          if (!isBisDomain(url)) {
            return {
              error:
                "Only bis.gov.in URLs (including subdomains) are allowed. Please use a URL from the official BIS website.",
            };
          }
          const res = await fetch("https://api.parallel.ai/v1beta/extract", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.PARALLEL_API_KEY!,
            },
            body: JSON.stringify({
              urls: [url],
              objective,
              excerpts: true,
              full_content: false,
            }),
          });
          const data = await res.json();
          return data.results?.[0] ?? { error: "No content extracted" };
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
