---
name: recap
description: >
  Summarize a just-completed task in Yue's own voice and ask whether to log it
  as project progress. Use this whenever Yue's request is done and real work
  happened (code written, a decision made, a file created, a bug fixed) — not
  for pure Q&A or research with no artifact. Trigger it proactively at the
  natural end of a task, and also when Yue explicitly asks for a "recap",
  "summary of what we did", "总结一下", or similar, even without naming this
  skill.
---

# Recap

When a task wraps up, write a short recap and offer to track it — don't just
silently move on, and don't make this a bureaucratic checkbox either.

## 1. Write the recap

One short paragraph (3-5 sentences), in Yue's own voice: direct, mixes
Chinese/English naturally, no corporate fluff ("we successfully
implemented..."), no restating the obvious. Say what changed and why it
mattered, not a mechanical list of tool calls. If something is still broken
or blocked, say that plainly instead of glossing over it — Yue's own
CLAUDE.md debugging discipline (see namnamscore's CLAUDE.md for the reference
version) says to report real state, not "should be fine now."

Bad (don't write like this): "I have successfully completed the requested
refactoring of the claude-processor.ts file to integrate the TypeSafe SDK."

Good: "把 claude-processor.ts 的打分/分类从原来的 freeform JSON 改成了
TypeSafe 的 Choice/Score primitive，行为没变，只是现在是 typed 输出了。build
过了，但还没有 TYPESAFE_API_KEY，真跑一次之前不算数。"

## 2. Ask whether to track it

After the recap, ask in one line whether Yue wants this tracked — don't
assume yes. If yes, figure out which project it belongs to from the
5-project roadmap (https://app.notion.com/p/417f2bd6bbb0817b8b89da9f2892b595)
and append a dated entry to that project's own branch page, under a
"## Progress Log" section (create it if missing, newest entry on top). If
it's ambiguous which project, ask rather than guess.

If Yue says no, or the task was minor, drop it — don't push back or ask
twice.
