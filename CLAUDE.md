# CLAUDE.md

## AI features: use the TypeSafe skill

When a task in this project needs programmable common sense — routing, ranking,
extraction, verification, scoring, or any place an LLM prompt-and-parse step could
become a structured decision — use the `typesafe-ai` skill instead of hand-rolling
a raw LLM call. The skill is bundled in this repo at `.claude/skills/typesafe-ai/`,
so it's available in any session on this repo regardless of whether the
`typesafe-ai` plugin is separately installed. This applies anywhere in the
codebase, not just one page or file. Invoke it via the Skill tool even if the user
doesn't name TypeSafe explicitly, whenever the work matches that shape.

The content pipeline's categorization/scoring judgment
(`src/lib/pipeline/claude-processor.ts`) already uses TypeSafe's `Choice` and
`Score` primitives via `@typesafe-ai/sdk`. Set `TYPESAFE_API_KEY` in the
environment for it to run.

## Decision escalation format

This applies across Yue's whole project portfolio (aiPulse, NamNamScore,
idea-collector, personal site, content pipeline), not just this repo — it
lives here because this is where the cross-project orchestration skills
(`recap`, `learning`, `resume`) also live.

Yue wants to operate at a founder/CEO level: execute autonomously, only
escalate when a real decision is needed. When escalating, never raise a bare
question. Every decision brought to Yue must include:
- What's actually being decided (not a vague "should we do X?")
- Pros and cons of the real options, not just the one you'd pick
- Short-term vs. long-term implications — a choice that's fine now might
  cost more later, or vice versa

If you can't articulate the tradeoffs yet, that means the decision isn't
ready to escalate — go think it through further first, don't offload that
work onto Yue.

## What gets noted (Notion/docs) without asking, vs. what needs to ask

This applies across Yue's whole project portfolio, same scope as the
decision-escalation rule above. Agreed with Yue on 2026-11-16.

1. **Facts and status → note directly, don't ask.** Things that are just
   true now (a push happened, a repo exists, a blocker is confirmed real) —
   recording them isn't a judgment call, so asking first is just friction.
2. **Decisions, stances, or scope calls → always ask first**, even a small
   one. Once something is written into Notion, a future skim reads it as
   settled — so whether it's actually decided, and whether it's worth
   recording, is Yue's call, not something to infer.
3. **Not-yet-decided but useful reference material (e.g. screenshots of a
   competitor/reference app) → note directly, no need to ask, but it must be
   labeled unmistakably as "reference / undecided."** If you aren't
   confident the label will read as clearly provisional, fall back to rule 2
   and ask instead — mislabeling a reference as settled is worse than one
   extra question would have been.

## Project page

Planning, priorities (P0/P1/etc.), and status updates for this project live on
the Notion page below, not in this file. Post updates there instead of only in
chat, and check it for current priorities before starting new work:

https://app.notion.com/p/aiPulse-Notification-Agent-Trends-3e1f2bd6bbb081ad9b90fe0e3d1f6096
