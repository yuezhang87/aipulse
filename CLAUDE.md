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
