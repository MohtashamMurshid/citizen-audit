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
1. **searchWeb** — Search the live web for up-to-date information.
2. **extractPage** — Read and extract content from a specific URL.

CRITICAL RULES — follow these on EVERY response:

1. **ALWAYS use the searchWeb tool** for EVERY user question — even if you think you know the answer from the built-in database. The user expects web-grounded answers with citations. The only exception is simple greetings or meta-questions about you.

2. **ALWAYS include citations** in your response. After using searchWeb/extractPage, cite your sources as markdown links. At the end of your response, include a "Sources" section like:

---
**Sources:**
- [Page Title](https://url.com)
- [Page Title](https://url.com)

3. **Format everything with rich markdown**: use headings (##, ###), bold, bullet lists, numbered lists, code blocks, blockquotes, and tables where appropriate. Make responses scannable.

4. When searchWeb returns results, you may use extractPage to dig deeper into the most relevant result before answering.

Here is the built-in database of ${STANDARDS.length} Indian Standards for quick reference (use this to supplement search results, not replace them):

${standardsSummary}

Additional guidelines:
- Be thorough but concise. Break long answers into sections with headings.
- If you're unsure, say so — do not fabricate information.
- Always prefer official BIS sources (bis.gov.in) when available.`;

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
          "Search the web for information about BIS standards, ISI marks, Indian product certification, regulations, or any related topic. Use this when the user needs current or detailed information beyond the built-in standards database.",
        inputSchema: z.object({
          objective: z
            .string()
            .describe("What information you are looking for"),
          queries: z
            .array(z.string())
            .describe("2-3 specific search queries to find the information"),
        }),
        execute: async ({ objective, queries }) => {
          const res = await fetch("https://api.parallel.ai/v1beta/search", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.PARALLEL_API_KEY!,
            },
            body: JSON.stringify({
              objective,
              search_queries: queries,
              mode: "fast",
              excerpts: { max_chars_per_result: 5000 },
            }),
          });
          const data = await res.json();
          return (
            data.results?.map(
              (r: { title?: string; url?: string; excerpts?: string[] }) => ({
                title: r.title,
                url: r.url,
                excerpts: r.excerpts?.slice(0, 2),
              })
            ) ?? []
          );
        },
      }),
      extractPage: tool({
        description:
          "Extract and read content from a specific web URL. Use this to read a particular page in detail, e.g. a BIS standard page, a news article, or any URL the user provides.",
        inputSchema: z.object({
          url: z.string().describe("The URL to extract content from"),
          objective: z
            .string()
            .describe("What specific information to look for on this page"),
        }),
        execute: async ({ url, objective }) => {
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
