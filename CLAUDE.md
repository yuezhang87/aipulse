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

## Project page

Planning, priorities (P0/P1/etc.), and status updates for this project live on
the Notion page below, not in this file. Post updates there instead of only in
chat, and check it for current priorities before starting new work:

https://app.notion.com/p/aiPulse-Notification-Agent-Trends-3e1f2bd6bbb081ad9b90fe0e3d1f6096
