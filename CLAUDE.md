# CLAUDE.md

## AI features: use the TypeSafe skill

When a task in this project needs programmable common sense — routing, ranking,
extraction, verification, scoring, or any place an LLM prompt-and-parse step could
become a structured decision — use the `typesafe:typesafe-ai` skill instead of
hand-rolling a raw LLM call. This applies anywhere in the codebase, not just one
page or file. Invoke it via the Skill tool even if the user doesn't name TypeSafe
explicitly, whenever the work matches that shape.
