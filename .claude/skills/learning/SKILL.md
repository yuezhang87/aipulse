---
name: learning
description: >
  Capture something Yue just learned from Claude's explanation as a
  learning-log entry, written in Yue's own voice, for future content
  (learning log posts, video topics). Use this whenever Claude has just
  explained a concept, mechanism, or "why" that Yue didn't know — invoke it
  explicitly via /learning right after such an explanation, and also when Yue
  says things like "这是个 learning", "记一下这个", or similar, even without
  the exact slash command. This is about capturing *understanding*, distinct
  from the `recap` skill, which tracks *task/project progress* — don't use
  this one for "what we built", only for "what Yue now understands that they
  didn't before."
---

# Learning

## 1. Find the delta

Look at what Claude just explained in this conversation — the thing Yue
didn't know and now does. Name the delta plainly: what Yue believed or
didn't know before, and what's actually true.

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
