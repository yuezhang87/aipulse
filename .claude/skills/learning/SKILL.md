---
name: learning
description: >
  Capture a learning-log entry in Yue's own voice, for future content
  (learning log posts, video topics). Two distinct triggers: (1) Claude just
  explained a concept, mechanism, or "why" that Yue didn't know; (2) Yue just
  made a real decision or took a stance after weighing it through
  conversation (especially one raised via the `recap`/CLAUDE.md
  decision-escalation format — pros/cons, short vs long term) — the
  reasoning behind *Yue's own* call is often better content than Claude
  explaining something, since it's Yue's judgment on display, not a lecture.
  Invoke it explicitly via /learning right after either kind of moment, and
  also when Yue says things like "这是个 learning", "记一下这个", or similar,
  even without the exact slash command. This is about capturing
  *understanding or judgment*, distinct from the `recap` skill, which tracks
  *task/project progress* — don't use this one for "what we built", only for
  "what Yue now understands, or how Yue decided, that's worth telling others
  about."
---

# Learning

## 1. Find the delta

Two shapes this can take — identify which one just happened:

- **Explained-to-Yue**: Claude explained a concept/mechanism/why that Yue
  didn't know. The delta is what Yue believed or didn't know before, vs.
  what's actually true.
- **Yue's own call**: Yue weighed a real decision (options, pros/cons,
  short- vs long-term tradeoffs — often one Claude raised using the
  decision-escalation format) and landed on a stance. The delta here isn't
  "Yue learned a fact" — it's "Yue's reasoning, laid out for someone else to
  learn from." Capture the actual tradeoff and why Yue chose what they
  chose, not just the conclusion.

## 2. Draft the entry, show it, don't save yet

Format:
- **Title**: short, specific, in Yue's voice — not a generic label like
  "Understanding Claude Code Sessions."
- **Body**: 2-4 sentences, plain and direct, mixing Chinese/English the way
  Yue actually talks (see this conversation's voice messages for reference —
  casual, decisive, no textbook tone). Explain the before -> after, not just
  the after.
- **Video candidate**: tag `🎥 video candidate` if the concept is visual or
  demoable enough to make a short video topic (e.g., something you can show
  on screen, a before/after, a live demo) — skip the tag if it's abstract or
  needs no visual.

Show this draft to Yue and ask if they want to edit it or save it as-is.
Don't write anything to Notion until they confirm — a wrong or premature
entry in the learning log is worse than asking once.

## 3. Save on confirmation

Once confirmed, append to the "内容输出（视频 + Learning Log）" Notion page
(https://app.notion.com/p/417f2bd6bbb0810194e7e6da4fe02912) under a
"## Learning Log" section — create that section if it doesn't exist yet.
Newest entry on top. Include today's date.

This is a holding pen: once Yue's personal website has a real learning-log
page, entries should move there instead (ask Yue when that happens, don't
assume).
