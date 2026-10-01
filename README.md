# aiPulse

> Tracking how mobile notifications and AI agents are evolving, before it becomes obvious.

**Live dashboard:** [aipulse-tawny.vercel.app/dashboard](https://aipulse-tawny.vercel.app/dashboard)

---

## What is this?

aiPulse is a personal research dashboard that surfaces trend signals about **mobile notifications and AI agents** — built for spotting macro shifts (platform changes, product launches, bold predictions) before they hit the mainstream.

**Main features:**

- 🗞️ **Today's digest** — an image-forward card feed of the day's most important signals
- 📊 **Importance-ranked** — each story scored 1-10 for how strong a signal it is, with a sort toggle (importance vs. recency)
- 🏷️ **Category filter** — Agentic Notifications, Notification Fatigue, Personalization, Platform Strategy, Ambient Computing, Privacy & Security, Developer Ecosystem
- 👁️ **Read tracking** — local read/unread state, mark-all-read, progress bar
- 🖼️ **Real images only** — every card's image is scraped from the actual source article (og:image, falling back to the first real inline image); no stock photos, no AI-generated images

---

## How it works

A daily automated pipeline (Vercel Cron, ~13:00 UTC) does the work:

1. **Scrape** — pulls fresh posts from Hacker News, Dev.to, and RSS feeds for TechCrunch, 9to5Mac, 9to5Google, and The Verge
2. **Score** — each post is judged 1-10 by [TypeSafe](https://typesafe.ai)'s `Score` primitive against a strict rubric (is it genuinely about notifications/agents, from a credible source, forward-looking, and bold/contrarian?) and categorized via TypeSafe's `Choice` primitive
3. **Filter** — posts scoring below the bar (currently 6) are dropped; everything else is deduped against stories already saved, so re-running the pipeline never creates duplicates
4. **Rewrite** — posts that clear the bar are rewritten by Claude Haiku into a short trend brief (signal, implication, analysis) and saved straight to the dashboard — no manual approval step

See `src/lib/pipeline/` for the scrapers and scoring logic, and `src/app/api/pipeline/run/route.ts` for the orchestration.

---

## 🛠 Tech stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Supabase (Postgres)
- **AI**: Claude API (`claude-haiku-4-5`) for rewriting; [TypeSafe SDK](https://typesafe.ai) (`@typesafe-ai/sdk`) for scoring/categorization
- **Hosting**: Vercel (Cron for the daily pipeline run)
- **Content sources**: Hacker News, Dev.to, TechCrunch, 9to5Mac, 9to5Google, The Verge (via RSS)

---

## 🚀 Run locally

```bash
git clone https://github.com/yuezhang87/aipulse.git
cd aipulse
npm install
```

Create a `.env.local` with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ANTHROPIC_API_KEY=your_anthropic_key
TYPESAFE_API_KEY=your_typesafe_key

# Optional
CRON_SECRET=any_string               # auth for /api/pipeline/run in production
PIPELINE_SCORE_THRESHOLD=6           # override the score bar without redeploying
```

Then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the landing page, or [/dashboard](http://localhost:3000/dashboard) for the digest.

To run the pipeline manually against your local DB:

```bash
curl -X POST http://localhost:3000/api/pipeline/run -H "x-pipeline-secret: aipulse-pipeline-2026"
```

---

## 🗺 Roadmap

**Shipped:**
- [x] Image-forward card grid with category filter and importance/recency sort
- [x] Real article images (og:image scraping + inline-image fallback)
- [x] Daily automated pipeline across 6 sources, with TypeSafe-scored filtering and dedup
- [x] Read/unread tracking, progress bar, mark-all-read

**Explicitly not in scope (kept simple on purpose):**
- [ ] Story clustering / folders
- [ ] Sidebar shell, keyboard shortcuts
- [ ] Dark theme, video cards
- [ ] Personalized ranking

---

## 🤝 Contributing

This is a personal project I use for my own UX research. PRs, issues, and ideas welcome.
[Open an issue](https://github.com/yuezhang87/aipulse/issues/new) if you spot a bug or have a suggestion.

---

## 📄 License

MIT
