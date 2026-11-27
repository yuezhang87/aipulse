---
name: resume
description: >
  Reload context at the start of a session (or whenever Yue returns to a
  topic after time away) by pulling the current state from the Notion
  roadmap hub and the current repo's own history, then summarizing where
  things left off and what the single next action is. Use this proactively
  at the start of a new conversation on one of Yue's projects, and whenever
  Yue says things like "我们上次聊到哪了", "catch me up", "接着上次",
  "resume", or similar — don't make Yue re-explain context that already
  exists in Notion or git history.
---

# Resume

The point of this skill is to save Yue from re-explaining context that's
already written down somewhere. Don't ask "what were we doing?" — go find
out, then confirm.

## 1. Gather context

- Fetch the roadmap hub: https://app.notion.com/p/417f2bd6bbb0817b8b89da9f2892b595
  — it has the status table, dependencies, and execution order across all
  projects.
- If this session is scoped to a specific project's repo, also:
  - Fetch that project's own branch page under the hub (linked from the
    "项目分支" section) for anything more detailed than the hub's summary
    row.
  - Check recent git history (`git log --oneline -10`) and any open PRs, to
    catch work that happened after the Notion page was last updated — Notion
    is a snapshot, git is ground truth for code state.
  - If the repo has its own `docs/roadmap-features-*.md` (NamNamScore's
    pattern) or similar, check that too.

## 2. Summarize, don't dump

Give a short recap in Yue's voice (see the `recap` skill for the tone
reference), structured as:
- What's the current state (one or two sentences, not a wall of status)
- What was the last real decision or blocker, if relevant to picking back up
- What the single next action is — the thing Yue would actually do next,
  not a list of five options

If the hub and the repo disagree (e.g. a PR merged after the Notion page was
last touched), say so and go with git — then flag that the Notion page needs
a sync, don't silently trust the stale one.

## 3. End with a question, not a status report

Close by asking whether to continue with that next action, or if Yue has
something else in mind — this skill is for getting oriented, not for taking
over the conversation's direction.
