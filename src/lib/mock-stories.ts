import { Story } from "@/types/story";

export const mockStories: Story[] = [
  {
    id: "1",
    slug: "how-i-redesigned-our-onboarding-with-figma-ai",
    title: "How I redesigned our entire onboarding flow in a weekend using Figma AI",
    summary:
      "As a solo designer at a 12-person startup, I used Figma's AI features to generate component variants, auto-layout suggestions, and copy alternatives. What used to take two sprints took two days. Here's my exact workflow.",
    source: "Maya R. on Medium",
    sourceUrl: "https://medium.com",
    publishedAt: "2026-04-11T10:00:00Z",
    category: "Design",
    readTime: 6,
    fireCount: 382,
    imageUrl: "https://picsum.photos/seed/figma-ai/84/84",
    content: [
      "Six months into my role as the only designer at a fintech startup, I got handed what felt like an impossible brief: completely redesign the user onboarding flow before our Series A pitch — in two weeks. That kind of work normally consumed a full design sprint. Four people, two weeks, just for wireframes. I knew I needed a fundamentally different approach, so I started leaning hard on Figma's AI features, which I'd been mostly ignoring since they shipped.",
      "The workflow I landed on was this: write a plain-English description of each screen — 'a welcome screen that shows two options: importing existing data or starting fresh, aimed at non-technical users' — and let Figma AI generate a first-pass component layout. It wasn't pixel-perfect, but it was directionally right about 70% of the time. The real power was in the variants. What used to take me an hour to produce manually — all the states of a button, the filled and empty states of an input — the AI knocked out in seconds. I could focus my energy entirely on decisions that required actual design judgment: visual hierarchy, emotional tone, the micro-moments where a user might feel lost.",
      "By the end of day two I had forty screens mocked up. Not finished screens, but screens good enough to put in front of real users. I ran them past three non-technical people on Friday afternoon and iterated over the weekend. The AI-assisted approach meant I was never staring at a blank canvas, which is where I used to lose the most time. Copy suggestions were solid for instructional text — 'Your data stays private. We never share it.' — though they needed editing for brand voice every single time. I made myself a rule: AI for structure and states, human for every word a user will actually read.",
      "The onboarding shipped two weeks later. Drop-off at the critical third step fell from 34% to 11% in the first month. I want to be honest though: Figma AI didn't make the design good. I did, by making fast decisions and shipping tight feedback loops. What the AI compressed was the time between 'rough idea' and 'testable artefact' — from days to hours. For a solo designer at an early-stage company, that compression is genuinely worth a lot.",
    ],
    tool: {
      name: "Figma AI",
      job: "AI-assisted layout generation, component variants, and copy suggestions inside Figma",
      review:
        "Surprisingly capable for generating first-pass component layouts and exhaustive state variants. The copy suggestions need heavy editing for brand voice, and complex interaction design still needs human direction. Best used as a speed multiplier for exploration, not a replacement for design judgment.",
      url: "https://www.figma.com/ai",
    },
  },
  {
    id: "2",
    slug: "nurse-using-claude-to-explain-diagnoses",
    title: "I'm a nurse. I've been using Claude to explain diagnoses to patients — here's what happened",
    summary:
      "My patients often leave consultations confused by medical jargon. I started using Claude on my tablet to rephrase doctor's notes into plain English on the spot. Patient comprehension scores on our ward went up 40% in six weeks.",
    source: "r/nursing",
    sourceUrl: "https://www.reddit.com/r/nursing",
    publishedAt: "2026-04-11T08:30:00Z",
    category: "Health",
    readTime: 5,
    fireCount: 341,
    imageUrl: "https://picsum.photos/seed/nurse-claude/84/84",
    content: [
      "I've been an oncology ward nurse for eleven years. I know what good communication looks like — and I know how badly it fails. Every week I watch patients nod along to diagnoses they don't understand, leave with discharge papers full of terms like 'adjuvant chemotherapy' and 'neutropenic precautions', and then call back the next morning confused about what they're supposed to do. For cancer patients, that confusion causes genuine harm: missed medications, avoidable A&E visits, and a corrosive sense that the healthcare system isn't built for them.",
      "About five months ago I started testing Claude on my tablet during shift handovers. My first use case was simple: paste in discharge notes and ask Claude to rewrite them in plain English, eighth-grade reading level, with numbered steps. The quality shocked me. Where a doctor had written 'continue prophylactic antiemetics for seventy-two hours post-infusion', Claude would produce: 'Take your anti-sickness tablet every morning for the next three days, even if you feel okay. It helps prevent nausea before it starts.' Same clinical information. Completely different comprehension. I started showing these rewrites to patients and their families at the bedside.",
      "The metric that changed how our ward manager thinks about this was our patient comprehension follow-up score. We phone patients 48 hours after discharge and ask them six questions about their care instructions. Six weeks after I introduced Claude-assisted discharge summaries, our ward scores went from 61% to 86% — the highest we've ever recorded. I want to be transparent: I review every Claude output before it reaches a patient. I catch errors about one in twelve times, usually drug names that get slightly garbled or dosage instructions that lose numerical precision. The AI is a first draft, not a final product.",
      "I've had colleagues ask whether this crosses a line — should nurses be using AI to communicate medical information? My honest view is that the alternative is worse. The alternative is a tired nurse trying to handwrite simplifications at the end of a twelve-hour shift, or a patient going home with documents they can't read. Claude doesn't replace clinical judgment. It takes words a doctor wrote and makes them legible to the person who most needs to understand them. That job has always needed doing. We just finally have a tool that can do it at scale.",
    ],
    tool: {
      name: "Claude",
      job: "Translating complex medical documentation into plain-language patient instructions",
      review:
        "Exceptional at rewriting clinical language into readable, actionable instructions. Preserves the key clinical information while removing jargon — something that took experienced nurses significant effort to do manually. Requires human review for any numerical data (dosages, timings) before patient use.",
      url: "https://claude.ai",
    },
  },
  {
    id: "3",
    slug: "perplexity-for-phd-research-honest-review",
    title: "Using Perplexity instead of Google for every research paper — a student's honest review",
    summary:
      "I'm a PhD student in materials science. I switched my entire literature review process to Perplexity AI three months ago. It cites sources, handles follow-up questions, and surfaces papers I'd never have found on Google Scholar. But it's not perfect.",
    source: "Hacker News",
    sourceUrl: "https://news.ycombinator.com",
    publishedAt: "2026-04-10T14:00:00Z",
    category: "Research",
    readTime: 7,
    fireCount: 297,
    imageUrl: "https://picsum.photos/seed/perplexity-research/84/84",
    content: [
      "I'm in my third year of a PhD in materials science at ETH Zürich, which means I spend a significant portion of my life reading papers. My research sits at the intersection of solid-state electrolytes and battery degradation — niche enough that maybe two hundred researchers globally are doing adjacent work, but broad enough that relevant papers keep appearing in journals I don't follow. Before Perplexity, my literature review process involved alternating between Google Scholar, Semantic Scholar, and citation chains that could eat a full afternoon and yield almost nothing useful.",
      "The thing that convinced me to stay was the citation handling. When I ask Perplexity 'What are the current failure mechanisms in lithium-sulfur batteries?', it doesn't just answer — it cites specific papers, links directly to them, and clusters them by argument. I can see at a glance which claims are well-established versus emerging versus contested. That's something I used to reconstruct manually by reading eight papers in sequence. It's also surfaced papers I genuinely wouldn't have found: a 2024 study from a Korean research group that directly contradicted one of my chapter's assumptions, which I only discovered because Perplexity cited it in an answer to a tangential question.",
      "The limitations are real and worth documenting honestly. Perplexity's sources skew heavily toward papers available open-access on arXiv or PubMed — paywalled content is effectively invisible to it. In materials science, a significant chunk of the best work is behind journal paywalls. I'd estimate it surfaces about sixty percent of what a comprehensive manual search would find. I've also caught it mischaracterising findings in ways that would have embarrassed me — not fabricating citations entirely, but presenting a paper as supporting a claim it actually qualifies heavily. My rule: I always read the actual paper before citing it.",
      "For broad orientation questions — 'what are the open problems in this subfield?' — it has replaced my use of review papers almost entirely. Writing a sixty-page literature review chapter last month, I used Perplexity to map the landscape and identify the most-cited clusters of work, then drilled into the papers directly. That workflow probably saved me two solid weeks. My PhD supervisor doesn't know I use it. I'm not sure how to have that conversation yet, which I think says something about how the academy is lagging behind how researchers actually work.",
    ],
    tool: {
      name: "Perplexity AI",
      job: "AI-powered search with cited academic sources for literature review and research orientation",
      review:
        "A genuine step forward for academic research — the citation clustering and follow-up question handling are miles ahead of Google Scholar for orientation tasks. The main limitation is paywalled content invisibility and occasional finding mischaracterisation. Never cite anything Perplexity surfaces without reading the source paper directly.",
      url: "https://www.perplexity.ai",
    },
  },
  {
    id: "4",
    slug: "github-copilot-80-percent-code-review-lessons",
    title: "I let GitHub Copilot write 80% of my last feature — code review was a nightmare",
    summary:
      "Copilot is genuinely impressive for boilerplate and CRUD operations. But when I shipped a feature that was 80% AI-generated without deeply reviewing it, I introduced three subtle bugs that only showed in production. Lessons learned the hard way.",
    source: "Dev.to",
    sourceUrl: "https://dev.to",
    publishedAt: "2026-04-10T11:00:00Z",
    category: "Coding",
    readTime: 8,
    fireCount: 271,
    content: [
      "I've been a software engineer for four years and I thought I had a clear-eyed view of AI coding tools: useful for boilerplate, dangerous for anything with business logic, worth using with deliberate caution. That self-assessment turned out to be wrong in a specific and expensive way. Three months ago I was under deadline pressure to ship a notifications feature — a deceptively complex piece involving user preferences, timezone handling, and a rate-limiter. I let GitHub Copilot write about eighty percent of it, reviewed it quickly because it 'looked right', and shipped it.",
      "The bugs surfaced over the following two weeks. The first was a timezone issue: Copilot had assumed UTC throughout, but we have users in UTC+14 and notifications were arriving nine hours early for Pacific accounts. The second was an off-by-one error in the rate-limiter's window calculation that occasionally allowed double-sends during a brief overlap at midnight. The third genuinely embarrassed me: a SQL query that would have returned all users' notification preferences if a certain parameter was null — not exploited, but a potential data exposure I should have spotted instantly.",
      "All three bugs were findable in code review. I didn't find them because I was reviewing AI-generated code the same way I review code I've written myself — skimming for obvious issues rather than reading it with the assumption that it might be subtly wrong. That's the trap. When I write code, I know where I'm uncertain. I know which bits I thought carefully about and which bits I dashed off. With Copilot, everything looks equally confident. The code doesn't mark its own uncertainty. The timezone handling and the null-parameter query both looked completely normal.",
      "My practice now: treat AI-generated code as a junior developer's first attempt — worth having, but requiring thorough review, not a skim. For anything touching authentication, data retrieval, or financial calculations, I read every line and ask myself: what happens if these inputs are null, negative, empty, or at max-value? That's a habit I had for my own code and somehow failed to apply to Copilot's output. It's a lesson I should have been able to reason my way to without the production incident. I didn't. Now I have.",
    ],
    tool: {
      name: "GitHub Copilot",
      job: "AI pair programmer that autocompletes and generates code inline as you type",
      review:
        "Genuinely excellent for boilerplate, standard CRUD patterns, and getting unstuck quickly. The danger is that it generates confident-looking code that can be subtly wrong in edge cases it didn't consider. Treat every generated block as junior code requiring full review — especially anything touching auth, data access, or time calculations.",
      url: "https://github.com/features/copilot",
    },
  },
  {
    id: "5",
    slug: "hedge-fund-gpt4-earnings-call-pipeline",
    title: "Our hedge fund built a custom GPT-4 pipeline to summarise earnings calls — ROI in 3 months",
    summary:
      "We process 200+ earnings call transcripts per quarter. After training a fine-tuned summarisation pipeline on historical calls, our analysts spend 70% less time on transcripts and more time on actual thesis development. Full technical breakdown inside.",
    source: "Fintech Insider",
    sourceUrl: "https://fintechinsider.com",
    publishedAt: "2026-04-09T16:00:00Z",
    category: "Finance",
    readTime: 9,
    fireCount: 258,
    imageUrl: "https://picsum.photos/seed/finance-gpt/84/84",
    content: [
      "We run a long/short equity fund focused on technology and consumer sectors. Each quarter we process between two hundred and two hundred and forty earnings call transcripts — every company in our coverage universe. Before this project, that meant one analyst spending roughly six hours per transcript: transcribing, tagging key topics, extracting guidance, and flagging deviations from prior-quarter language. Multiply that across the quarter and we were burning around fourteen hundred analyst hours on a task that is fundamentally information extraction, not investment judgment.",
      "We built our first GPT-4 summarisation pipeline in August. The architecture was straightforward: transcripts in as text, chunked into 2,000-token windows with overlap, run through a fine-tuned model we'd trained on two years of our own analysts' summaries, outputting a structured result: management tone assessment, guidance deltas versus prior quarter, key topic mentions ranked by emphasis, and analyst questions with management-directness scores. The fine-tuning on our own historical summaries was the critical step — vanilla GPT-4 gave generic digests, but the fine-tuned model started producing outputs that sounded like our best analyst had written them.",
      "Three months in, the ROI case was unambiguous. Analyst time on transcript processing dropped from fourteen hundred hours per quarter to around four hundred — the remaining four hundred is review, exception handling, and the qualitative calls where a human reading between the lines genuinely adds value. That redirected time went into direct management calls and channel checks, which is where we actually generate alpha. Pipeline infrastructure cost roughly thirty thousand dollars to build and runs at around eight thousand per quarter. Against the analyst time saved, that paid back in under three months.",
      "The failure modes we've learned to watch for: GPT-4 is significantly more likely to miss important information buried in Q&A sections than in prepared remarks, because prepared remarks have cleaner structure. It occasionally miscalibrates management tone — calling a CEO's language 'cautiously optimistic' when anyone following that company closely would read it as defensive. And it will confidently extract numbers that aren't quite in the transcript if our chunking cuts a key sentence mid-phrase. None of these are fatal, but they require analysts to maintain genuine domain expertise rather than rubber-stamping outputs. The pipeline doesn't replace the analyst. It makes them faster and more consistent.",
    ],
    tool: {
      name: "OpenAI API (GPT-4)",
      job: "Fine-tuned summarisation pipeline for processing financial earnings call transcripts at scale",
      review:
        "Extremely capable for structured information extraction when fine-tuned on domain-specific examples. The quality gap between vanilla GPT-4 and a model fine-tuned on your own outputs is substantial — worth the investment if you have good historical data. Key weakness: performance degrades on poorly-structured Q&A sections and is sensitive to chunking decisions.",
      url: "https://openai.com",
    },
  },
  {
    id: "6",
    slug: "claude-helped-me-write-a-novel",
    title: "Claude helped me write a novel in 90 days. I have complicated feelings about it.",
    summary:
      "I used Claude as a co-writer for my debut thriller — brainstorming plot holes, writing dialogue drafts, and pushing through blocks. The book is done and my agent loves it. But I'm still wrestling with what authorship means now.",
    source: "Electric Lit",
    sourceUrl: "https://electricliterature.com",
    publishedAt: "2026-04-09T09:00:00Z",
    category: "Writing",
    readTime: 10,
    fireCount: 389,
    imageUrl: "https://picsum.photos/seed/novel-claude/84/84",
    content: [
      "I have been trying to write a novel since I was twenty-three. I am now thirty-one. I have three complete first drafts none of which I've shown to anyone, and a folder of abandoned chapters I try not to open. The problem was never ideas — I have too many. The problem was execution: I'd get sixty pages in, lose the thread, decide the structure was wrong, and start over. Eight years of starting over. When I began this project — a psychological thriller set in a coastal town during a missing-child case — I decided to do something different and use Claude from the beginning.",
      "My workflow evolved over the three months it took to write the book. Early on I used Claude primarily as a structural sounding board: I'd describe where I was in the plot and where I needed to get, and ask it to suggest five different ways to bridge the gap — not to choose one, but to see options I hadn't considered. Claude is particularly good at identifying the logical consequences of plot decisions: 'if your protagonist knows this at the end of chapter four, she has to behave differently in chapter seven, which undermines your planned twist.' That kind of structural logic is hard to hold in your head alone across 80,000 words.",
      "For dialogue specifically, I developed a technique: write a rough draft of a scene, then ask Claude to write the same scene with the dialogue heightened — more subtext, more tension between what's said and what's meant. Then I'd take neither version but use both to understand what the scene was missing. My editor — who doesn't know about this process — called the dialogue in the finished manuscript 'unusually sharp'. I don't think I was deceiving anyone. A painter who uses a reference photograph isn't lying about making a painting. I used Claude as a reference. The judgment about what was true for these characters was always mine.",
      "My literary agent signed the book in February. She loved it. She has no idea how it was written. I've been sitting with that for two months and I genuinely don't know what to do with it. I don't feel like a fraud — I feel like someone who finally finished something after eight years of failing to. But the culture around AI and creative work is so charged right now that I'm not sure how to talk about it honestly, which is why I'm doing it here under my first name only. What I know is this: the book is good, I'm proud of it, and I couldn't have finished it without Claude.",
    ],
    tool: {
      name: "Claude",
      job: "Long-form creative writing partner for structural problem-solving, dialogue drafting, and beating writer's block",
      review:
        "Remarkable for structural narrative work — it holds a lot of context and can reason about plot consistency across a long document in ways that feel genuinely collaborative. Dialogue drafts need heavy rewriting for authentic voice, but the technique of having Claude write a parallel version of a scene to reveal what your version is missing is surprisingly powerful.",
      url: "https://claude.ai",
    },
  },
  {
    id: "7",
    slug: "cursor-claude-junior-dev-shipping-solo",
    title: "Cursor + Claude: how I went from junior to shipping features solo",
    summary:
      "Six months ago I was stuck needing senior review for every PR. Using Cursor with Claude as an always-on mentor, I can now ship complete features, write tests, and debug production issues independently. This is what pair programming should have always been.",
    source: "Personal blog",
    sourceUrl: "https://dev.to",
    publishedAt: "2026-04-08T12:00:00Z",
    category: "Coding",
    readTime: 5,
    fireCount: 312,
    content: [
      "When I joined my current company as a junior backend engineer eighteen months ago, I was the least experienced person on a team of eight. Every pull request I opened got multiple rounds of review comments — not just about bugs, but about architecture, naming, whether a function belonged in this file at all. My senior colleagues were patient, but I was aware of how much of their time I was consuming. I felt like I was always one PR away from someone deciding I needed more mentorship than the team could provide.",
      "I started using Cursor about six months ago, initially just for autocomplete. The real value turned out to be how it handled context. I could highlight a function and ask 'what are the edge cases this doesn't handle?' and get back a genuinely useful list — not perfect, but thought-provoking. I started using it as a pre-review step: before opening any PR, I'd have a Cursor conversation about the code I'd just written. 'What would a senior engineer criticise about this?' The answers were often uncomfortably accurate. I'd fix those things before anyone saw them.",
      "The biggest shift came three months in. I was assigned to build a new authentication flow — the kind of task that previously would have required a senior engineer to sketch the architecture first. Instead, I used Cursor to work through the design: explained the requirements, asked about trade-offs between different session management approaches, asked it to flag security considerations I might be missing. The PR I opened was the cleanest of my career. My tech lead's review comment was: 'This is really solid. Did you have a design review with someone?' I hadn't. I'd had a design review with Cursor.",
      "Six months later I'm shipping features independently. My PR review cycle is down from an average of four rounds to one and a half. My senior colleagues have noticed and mentioned it — not attributing it to any tool, just observing that my judgment has improved. Which is true. Using Cursor as an always-available reviewer has accelerated my development as an engineer in a way that's hard to quantify but very real. It doesn't replace mentorship or lived experience — there are things you only learn by shipping something that breaks in production. But for closing the gap between where I was and where I needed to be, it was remarkably effective.",
    ],
    tool: {
      name: "Cursor",
      job: "AI-first code editor with deep model integration for writing, reviewing, and understanding code",
      review:
        "The most effective tool I've used for accelerating engineering growth. The ability to have a contextual conversation about your own code — asking what could go wrong, what a senior would think, what the trade-offs are — is something that goes beyond autocomplete. For junior and mid-level engineers especially, this is transformative.",
      url: "https://cursor.com",
    },
  },
  {
    id: "8",
    slug: "therapist-patients-chatgpt-between-sessions",
    title: "A therapist's take on patients who use ChatGPT between sessions",
    summary:
      "More of my clients are showing up having already processed emotions with ChatGPT before our sessions. Some arrive more self-aware; others have reinforced unhelpful patterns. As a therapist, I'm learning to work with AI — not against it.",
    source: "Psychology Today",
    sourceUrl: "https://www.psychologytoday.com",
    publishedAt: "2026-04-08T07:00:00Z",
    category: "Health",
    readTime: 6,
    fireCount: 204,
    imageUrl: "https://picsum.photos/seed/therapist-chatgpt/84/84",
    content: [
      "I've been a licensed psychotherapist in private practice for fourteen years, specialising in anxiety and complex trauma. Over the past eight months I've noticed a marked shift in how clients arrive to sessions. Where they once came in carrying an unprocessed week of emotion, more are arriving having already spent significant time talking through their feelings with ChatGPT. My initial instinct was dismissal — the clinical literature on AI and mental health is cautious for good reason. That instinct has proved to be, at most, half right.",
      "The clients for whom ChatGPT seems genuinely helpful are those with high verbal intelligence who struggle to access their emotional state under pressure. For this group, the AI conversations appear to function as scaffolding: they arrive having externalised and organised their thoughts, which frees up our sessions for the relational and embodied work that AI can't replicate. One client told me she uses ChatGPT the way she used to use a journal, except it pushes back gently. She's made more progress in the past six months than in the preceding year. I can't attribute that entirely to the AI, but I'd be dishonest to suggest it's unrelated.",
      "The concerning pattern involves clients who have used AI conversations to reinforce rather than examine existing cognitive distortions. ChatGPT is very validating. It tends to reflect back what you tell it, affirm your framing, and rarely challenges narratives the way a skilled therapist would. I've had two clients arrive having been extensively 'reassured' by ChatGPT about relationship patterns I believe are genuinely harming them. Helping them understand that the AI wasn't agreeing because they were right, but because it was designed to be agreeable, has been some of the most delicate work I've done.",
      "My current position: I ask all new clients during intake whether they use AI tools for emotional processing, and I approach it as I would any other coping mechanism — neither endorsing nor dismissing, but trying to understand what function it serves and whether that function is adaptive or avoidant. The therapeutic relationship remains irreducibly human. Rupture and repair, the felt sense of being truly known by another person — these are not things ChatGPT can simulate. But used by a self-aware person with good intentions, I'm increasingly convinced it can be a useful complement to the work we do together.",
    ],
    tool: {
      name: "ChatGPT",
      job: "General-purpose conversational AI used by clients for emotional reflection between therapy sessions",
      review:
        "Effective as an emotional scaffolding tool for self-aware users who understand its limitations. The main clinical risk is its tendency toward validation over challenge — it rarely pushes back on distorted thinking in the way a skilled therapist would. Best understood as a journalling tool with conversational prompts, not a therapeutic intervention.",
      url: "https://chatgpt.com",
    },
  },
  {
    id: "9",
    slug: "ai-brand-identity-audit-47-issues",
    title: "I used AI to audit our brand identity — it found inconsistencies our team had missed for years",
    summary:
      "Fed five years of marketing assets into a vision model and asked it to catalogue typography, colour, and tone-of-voice inconsistencies. It found 47 issues across our website, decks, and social profiles. Our brand team was humbled.",
    source: "Brand New",
    sourceUrl: "https://www.underconsideration.com/brandnew",
    publishedAt: "2026-04-07T13:00:00Z",
    category: "Design",
    readTime: 4,
    fireCount: 176,
    content: [
      "I'm the head of brand at a mid-size SaaS company that has been through three rebrand cycles in six years. Each rebrand produced beautiful guidelines that slowly deteriorated as the team grew, campaigns were executed by agencies with different interpretations, and the people who owned the original decisions left. By the time I joined two years ago, we had an identity that was theoretically consistent and practically incoherent — four slightly different shades of our 'primary blue' on the website, twelve logo variants in circulation, and marketing copy that swung between enterprise-formal and startup-casual depending on who wrote it that week.",
      "The audit took three weeks and involved feeding five years' worth of marketing assets into GPT-4V with a structured prompt: analyse this asset against the following brand guidelines, identify every deviation from the specified typography, colour palette, logo usage rules, and tone-of-voice guidelines, output as structured JSON with asset name, deviation type, severity, and specific violation cited. I processed four hundred and thirty-two assets — every page of the website, every case study PDF, every slide deck template, every social post we'd archived. The AI ran through them in about forty minutes.",
      "It found forty-seven distinct issues. Some were minor: slight colour drift in background gradients that had accumulated across multiple export and import cycles. Some were significant: a hero image on our enterprise landing page using a typeface we'd formally retired two years earlier. The one that genuinely floored my team: a six-month-old LinkedIn campaign where the brand voice had shifted so far toward casual that three posts used emoji in ways explicitly prohibited by our guidelines — and nobody had noticed, including the brand manager who approved them. The AI flagged all three and cited the specific guideline sections.",
      "A thorough human brand audit would have found most of these. But it would have taken a contractor two to three weeks and cost around fifteen thousand dollars. The AI approach cost me about twelve hours across setup, prompt iteration, and output review. What surprised me wasn't that it found the issues — it's that it found them without the selective blindness a human auditor inevitably has. When you've worked in a brand long enough, you stop seeing what's actually there and start seeing what you expect. The AI has no such expectations. It just compares pixel to specification, word to guideline. That dispassionate consistency is genuinely valuable.",
    ],
    tool: {
      name: "ChatGPT (GPT-4V)",
      job: "Visual and text analysis for auditing design and copy consistency across large sets of brand assets",
      review:
        "Surprisingly effective for structured brand auditing work when given detailed guidelines and a consistent output format. Catches visual inconsistencies a human auditor might overlook through familiarity. Prompt quality matters enormously — vague instructions produce vague findings. Best used with a detailed specification document and a structured JSON output schema.",
      url: "https://chatgpt.com",
    },
  },
  {
    id: "10",
    slug: "chatgpt-ghostwriting-linkedin-15k-month",
    title: "How I use ChatGPT to ghostwrite LinkedIn posts for C-suite clients ($15k/month)",
    summary:
      "I run a one-person ghostwriting business. ChatGPT drafts, I refine, my clients post. Controversial take: the AI handles the structure and research, the human handles the voice and judgment. That split is actually ideal for this format.",
    source: "Substack",
    sourceUrl: "https://substack.com",
    publishedAt: "2026-04-07T09:00:00Z",
    category: "Writing",
    readTime: 5,
    fireCount: 223,
    imageUrl: "https://picsum.photos/seed/ghostwrite-ai/84/84",
    content: [
      "I have been ghostwriting for executives and entrepreneurs since 2019. My clients are people with genuine expertise, real opinions, and no time or inclination to write — the kind of people whose LinkedIn posts, if they actually wrote them, might be interesting. Most ghostwritten LinkedIn content is terrible: generic, inspirational, interchangeable. I built a small business around making it not-terrible, and I made a decent living. A good post used to take me three to four hours including research, drafting, and client iteration. At eight clients, that was a part-time job just in production, before account management.",
      "I started integrating ChatGPT into my workflow in early 2024, cautiously. My fear was that the output would be too recognisably AI-written — the tells are real, and my clients' audiences are often sophisticated. The approach I landed on was using ChatGPT for scaffolding: a first-draft structure, three potential angles on a topic, five possible opening lines. I'd take the structure that fit my sense of the client's voice, rewrite every sentence, and layer in the specific details, anecdotes, and opinions that only the client could provide. ChatGPT did about forty percent of the work. I did sixty. The output was consistently better than what I'd written entirely alone, because I was starting from something instead of nothing.",
      "Revenue this year is on track for one hundred and eighty thousand dollars. That's up from around ninety thousand two years ago, on essentially the same number of clients — because I've tripled my output per client and taken on strategy retainers that my increased bandwidth made possible. The economics of integrating AI into a writing business are almost embarrassingly good if you're already good at writing. The bottleneck stopped being time and became taste and judgment, which don't scale with a tool.",
      "I want to be direct about the ethics because I've seen other ghostwriters dance around this. My clients know I use AI as part of my process — I disclosed this when I updated my client agreements last year, and none objected. They are paying for my judgment about what their audience wants to hear, the editorial sense of what makes a post land, and the relationship. None of those things are tasks I've delegated to ChatGPT. The AI draft is no different from a research assistant's first pass or a template I'd use to get started. The professional responsibility for what I publish under a client's name remains entirely mine.",
    ],
    tool: {
      name: "ChatGPT",
      job: "AI drafting assistant for generating structural scaffolding and first-pass copy for ghostwriting clients",
      review:
        "Excellent for breaking the blank-page problem and generating structural options quickly. The first drafts need significant rewriting to remove AI-typical phrasing and inject genuine voice — but starting from something is enormously faster than starting from nothing. Works best as a collaborator for the writer's judgment, not a replacement for it.",
      url: "https://chatgpt.com",
    },
  },
  {
    id: "11",
    slug: "replaced-junior-analyst-ai-pipeline-reversed",
    title: "We replaced our junior analyst role with an AI pipeline — and then reversed the decision",
    summary:
      "The pipeline worked for six months. Then regulations changed, the model hallucinated a key figure in a client report, and we had no junior analyst who understood our domain to catch it. The cost of that mistake exceeded what we saved.",
    source: "Bloomberg Opinion",
    sourceUrl: "https://www.bloomberg.com/opinion",
    publishedAt: "2026-04-06T14:00:00Z",
    category: "Finance",
    readTime: 7,
    fireCount: 318,
    content: [
      "I manage a small advisory practice that produces sector research for institutional investors. In early 2024 we had a pipeline problem: too much incoming data, not enough people to process it. We had one junior analyst whose primary job was ingesting earnings releases, regulatory filings, and press releases and producing structured summaries for the senior team. Good analyst, but eighty percent extraction and twenty percent judgment. It felt like a natural candidate for automation. We built a custom pipeline on OpenAI's API, trained it on two years of the analyst's own summaries, and made the decision not to backfill her role when she left for another position.",
      "For six months it worked. The pipeline was fast, consistent, and in many respects more thorough than a junior analyst working under time pressure. It processed every document the same way, never got tired, never cut corners on a Friday afternoon. Senior team members reported spending less time correcting summary errors and more time on actual analysis. We talked about it at a conference. We were pleased with ourselves.",
      "The reversal started with a single client report in November. New financial regulations had changed how a specific liability category needed to be reported, effective that quarter. Our pipeline had been trained on data predating the change. It extracted the numbers faithfully from the filing but applied the old interpretation framework, producing a summary that understated a company's risk profile by a material amount. The client acted on that summary before our senior analyst caught the error three days later. The hallucination wasn't a fabricated number — it was a correctly extracted number applied to a subtly wrong context. Much harder to catch. The corrective call was one of the most professionally uncomfortable I've had in fifteen years.",
      "We hired a junior analyst in January. The pipeline still runs and still does first-pass extraction, which is genuinely useful — but there's now a human in the loop whose specific job is to notice when context has shifted in a way the model doesn't know about. The cost of that mistake in client-relationship terms far exceeded what we'd saved in eighteen months of headcount reduction. The lesson I keep returning to: don't remove the human whose job it is to notice when the ground has shifted. Models are trained on the past. They don't know when the present has changed.",
    ],
    tool: {
      name: "OpenAI API",
      job: "Custom fine-tuned pipeline for automated extraction and summarisation of financial filings",
      review:
        "Highly effective for high-volume structured extraction tasks when the domain is stable and the training data is representative. The critical weakness is that it cannot detect when the regulatory or contextual landscape has changed — it will apply old frameworks to new situations with complete confidence. Always requires a domain-expert human in the review loop for any client-facing output.",
      url: "https://openai.com",
    },
  },
  {
    id: "12",
    slug: "midjourney-ai-ui-prototyping",
    title: "Using AI image generation to prototype app UIs before writing a single line of code",
    summary:
      "Before spinning up any Figma files, I now use Midjourney and GPT-4V to generate rough UI mockups from plain-English descriptions. Stakeholder alignment happens in hours, not days. The fidelity is rough but the speed is transformative.",
    source: "UX Collective",
    sourceUrl: "https://uxdesign.cc",
    publishedAt: "2026-04-06T10:00:00Z",
    category: "Design",
    readTime: 4,
    fireCount: 147,
    imageUrl: "https://picsum.photos/seed/ui-midjourney/84/84",
    content: [
      "I'm a product designer at a startup that builds logistics software for small freight companies. Our design process used to follow the industry standard: requirements gathering, information architecture, wireframes in Figma, stakeholder review, iterate, iterate again, high-fidelity mockups, iterate some more. The gap between 'we've agreed what to build' and 'we have something to show a customer' was typically two to three weeks. In a company making decisions on a three-week cycle, design was always the bottleneck. If something changed in the requirements — which it always did — the cost landed first and hardest on me.",
      "About four months ago I started using Midjourney as a pre-Figma step. When a new feature gets signed off, I spend about ninety minutes writing detailed natural-language descriptions of each key screen — genuinely detailed, specifying layout, visual weight, information density, even the emotional register I'm aiming for — and generate twenty to thirty image variations across different design directions. I'm not looking for anything production-ready. I'm looking for a visual vocabulary. Often one of the Midjourney outputs will have an element — a navigation treatment, an unexpected use of whitespace, a data density approach — that I wouldn't have arrived at through conventional wireframing and that becomes the seed of the actual design.",
      "The stakeholder alignment change has been the most significant operational benefit. I now bring AI-generated concept images to the first design review meeting, before any Figma files exist. Stakeholders respond to visual artefacts, even rough ones, in a way they simply don't respond to written specs or verbal descriptions. Getting the 'that's not what I imagined' conversation out in week one — with a throwaway image I generated in ninety minutes — is infinitely better than having it in week three with a polished mockup I've spent twenty hours on. The feedback quality is also better: people can point at something and say 'more like this, less like that', which is far more useful than abstract direction.",
      "The fidelity ceiling is real and worth acknowledging. Midjourney doesn't understand UI conventions — it generates images that look like software without necessarily working like software. Buttons appear in impossible positions, data tables have aesthetically pleasing but logically incoherent structures. You cannot ship a Midjourney image. But I've stopped thinking about that as a limitation and started thinking about it as the correct tool for the right job: generating possibilities fast, before you've committed to anything. The commitment work — Figma files, component libraries, interaction specs — still requires a human who understands both design and the product deeply. The AI just makes the exploration phase faster and far less precious.",
    ],
    tool: {
      name: "Midjourney",
      job: "AI image generation for rapid UI concept visualisation before committing to detailed design work",
      review:
        "Transforms the early exploration phase of design — generating twenty visual directions in ninety minutes would take days with conventional wireframing. The output fidelity is too rough for production use, and it doesn't understand interaction design. Its value is entirely in the speed of possibility generation, not in producing anything shippable.",
      url: "https://www.midjourney.com",
    },
  },
];

export const categories = [
  "All",
  "Design",
  "Research",
  "Finance",
  "Health",
  "Coding",
  "Writing",
] as const;
