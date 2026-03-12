# CitizenAudit

Scan a product. Check its markings. Report suspicious sellers. Surface counterfeit hotspots.

## What it does

CitizenAudit is a citizen-facing web app for verifying ISI/BIS product certifications across India. Citizens upload a photo of a product, and the system:

1. **Extracts** the product name, brand, ISI/BIS number, and label text using GPT-4.1 vision
2. **Verifies** the extracted certification against known BIS standards
3. **Reports** the finding with location data to build community intelligence
4. **Surfaces** counterfeit hotspots by city and state from aggregated reports

## Stack

- **Next.js 16** (App Router) — frontend and API routes
- **Convex** — real-time database, file storage, serverless functions
- **Vercel AI SDK** — structured extraction via `generateObject` with OpenAI vision
- **shadcn/ui** — component library with Radix primitives
- **Tailwind CSS v4** — styling

## Getting started

```bash
pnpm install
```

Create a `.env.local` with:

```
CONVEX_DEPLOYMENT=<your-convex-deployment>
NEXT_PUBLIC_CONVEX_URL=<your-convex-url>
OPENAI_API_KEY=<your-openai-key>
```

Run the dev server and Convex together:

```bash
npx convex dev &
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

| Route | Description |
|-------|-------------|
| `/` | Main scan flow — upload, extract, verify, report |
| `/insights` | Community dashboard — stats, city/state hotspots, recent reports |
| `/api/extract` | AI extraction endpoint (GPT-4.1 vision) |
| `/api/verify` | BIS verification endpoint (known standards + AI assessment) |

## How verification works

The verification layer uses a hybrid approach:

- **Known standards lookup**: A built-in dictionary of common ISI standards (IS 1293, IS 694, IS 15885, etc.) provides instant verification for recognized numbers.
- **AI-assisted assessment**: For numbers not in the dictionary, GPT-4.1-mini evaluates the format, plausibility, and consistency of the claimed certification.
- **Transparency**: All results are labeled as prototype AI assessments, not official BIS verifications.

## Why it matters

Counterfeit ISI-marked products are a serious consumer safety issue in India. CitizenAudit turns every citizen into a field verifier — crowdsourced intelligence that can surface patterns no single inspector could find alone.
