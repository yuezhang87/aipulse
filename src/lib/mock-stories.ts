import { Story } from "@/types/story";

export const mockStories: Story[] = [
  {
    id: "1",
    slug: "android-intelligent-os-agents-notifications",
    title: "Google is redesigning Android's OS layer so agents can act — and notify — on your behalf",
    summary:
      "Android Developers' \"Intelligent OS\" post lays out how the platform is exposing app state and actions to AI agents. Gemini can now narrate task progress through notifications, hand control back with a live view, and is required to alert users before anything sensitive — like a purchase — completes.",
    source: "Android Developers Blog",
    sourceUrl: "https://android-developers.googleblog.com/2026/02/the-intelligent-os-making-ai-agents.html",
    publishedAt: "2026-02-18T09:00:00Z",
    category: "Agentic Notifications",
    readTime: 5,
    fireCount: 231,
    imageUrl: "https://picsum.photos/seed/android-intelligent-os/84/84",
    content: [
      "For most of Android's history, notifications existed to tell a user that something happened. Google's latest platform direction treats them as something closer to a status channel for an autonomous process: when an AI agent is executing a multi-step task on a user's behalf, the notification tray becomes its progress bar.",
      "The mechanism Google describes is deliberately narrow at first. For any automation action, users can monitor a task's progress via a notification or switch to a live view of what the agent is doing, and take over manual control at any point. That reversibility — the guarantee that a human can always interrupt and reclaim the wheel — is the load-bearing design constraint the rest of the system is built around.",
      "The more consequential detail is the carve-out for sensitive actions. Gemini is designed to alert users before completing anything like a purchase, rather than surfacing it after the fact. That's a meaningful shift from the reactive alert model — telling you what happened — toward a permission-gated one, where the notification is the checkpoint an agent has to clear before it's allowed to finish.",
      "This matters for anyone tracking where notification volume is headed. As agents take on more background, multi-step work, the naive expectation is that notification count explodes. Google's framing suggests the platform intends to counter that by making most of an agent's activity ambient and silent, reserving interruptive notifications for exactly two moments: something needs your judgment, or something already happened that you should know about.",
      "The open question is enforcement. A design principle in a developer blog post is not a guarantee that every third-party agent integration will respect the same restraint — and the value of this entire model depends on whether \"ask before anything sensitive\" becomes a platform-enforced contract or stays a best-practice suggestion.",
    ],
    tool: {
      name: "Gemini for Android (Intelligent OS APIs)",
      job: "Platform-level hooks that let AI agents read app state, execute actions, and report progress through the notification system",
      review:
        "The most concrete public statement yet from a major platform on how agent activity should surface to users — live-view monitoring, one-tap takeover, and mandatory pre-alerts for sensitive actions. Worth watching whether this becomes an enforced API contract for third-party agents or stays Google's own house style.",
      url: "https://developer.android.com/blog/posts/the-intelligent-os-making-ai-agents-more-helpful-for-android-apps",
    },
  },
  {
    id: "2",
    slug: "android-16-notification-cooldown",
    title: "Android 16 makes Notification Cooldown a hard platform stance against alert overload",
    summary:
      "Android Police reports Android 16 doubling down on Notification Cooldown — the feature that automatically softens sound and visual alerts when an app fires off a burst of notifications in quick succession, without touching anything marked high-priority like calls or alarms.",
    source: "Android Police",
    sourceUrl: "https://www.androidpolice.com/android-16-takes-a-hard-stance-against-notification-overload/",
    publishedAt: "2026-03-10T11:00:00Z",
    category: "Personalization",
    readTime: 4,
    fireCount: 198,
    imageUrl: "https://picsum.photos/seed/android16-cooldown/84/84",
    content: [
      "Notification Cooldown started as a quietly-shipped, opt-in setting on Pixel phones with Android 15. Android 16 turns it into a headline platform behavior: when multiple notifications from the same source arrive within a short window, the OS automatically lowers alert volume and minimizes pop-ups for roughly two minutes, without any per-app configuration required from the user.",
      "The design is deliberately conservative about what it touches. Priority notifications — calls, alarms, anything flagged urgent — are exempt from the cooldown entirely. The feature is aimed squarely at the specific failure mode that drives disable-and-uninstall behavior: a chat app or game firing off ten pings in ninety seconds.",
      "What makes this a platform-strategy signal rather than a minor settings tweak is the direction of travel: Android is moving the responsibility for taming notification bursts off the user (who has to hunt for a toggle) and onto the OS's default behavior. That's a meaningfully different posture than the last decade of notification design, which mostly asked users to manage volume by disabling entire apps.",
      "It's also a tell about what Google thinks the next wave of notification volume will look like. Automatic, algorithmic throttling only becomes a priority feature when the incoming volume is expected to keep climbing — and the obvious candidate for that climb is agents and background AI tasks that can generate app activity, and therefore notifications, without a human directly triggering each one.",
    ],
    tool: {
      name: "Android 16 Notification Cooldown",
      job: "OS-level throttling that automatically softens repeated notification bursts from a single app or contact",
      review:
        "A rare case of a platform shipping the throttling default itself rather than leaving it to users or third-party apps. Excludes priority alerts by design, which keeps it safe for calls and alarms — the interesting test will be whether it holds up once agent-driven apps start generating bursts that look nothing like today's chat-app spam pattern.",
      url: "https://www.androidcentral.com/apps-software/android-os/how-enable-notification-cooldown",
    },
  },
  {
    id: "3",
    slug: "apple-privacy-first-ai-push-2026",
    title: "Apple is betting its entire 2026 AI push on privacy — and notifications are the proving ground",
    summary:
      "AppleInsider argues that as Apple expands AI across its OSes in 2026, privacy and data security remain the load-bearing differentiator versus competitors — and on-device processing of notification content is the most visible place that promise gets tested daily.",
    source: "AppleInsider",
    sourceUrl: "https://appleinsider.com/articles/26/05/17/privacy-data-security-will-remain-tantamount-for-apples-2026-ai-push",
    publishedAt: "2026-05-17T13:00:00Z",
    category: "Privacy & Security",
    readTime: 5,
    fireCount: 214,
    imageUrl: "https://picsum.photos/seed/apple-privacy-ai/84/84",
    content: [
      "Every AI feature Apple ships in 2026 gets measured against the same yardstick the company set for itself years ago: does it require sending anything off the device. AppleInsider's read on Apple's 2026 roadmap is that this constraint isn't loosening as AI features expand — it's becoming the organizing principle, with Private Cloud Compute as the fallback only when on-device models genuinely can't handle a task.",
      "Notifications are where that architecture is most exposed to daily scrutiny. Summarizing, ranking, and filtering what shows up on a lock screen means an AI model is reading the actual content of a user's messages, emails, and app alerts — arguably the single most sensitive data stream a phone processes continuously. Doing that entirely on-device, with no network round trip, is both a technical constraint and the core of Apple's public pitch for why this is safe.",
      "The strategic bet is that this becomes a durable point of differentiation rather than a temporary one. As agentic features from every platform start reading more of a user's personal context to decide what's worth interrupting them for, the question of where that reading happens — on a chip you own, or a server you don't — becomes a harder sell for competitors to match without rearchitecting around on-device models themselves.",
      "The friction point is capability. On-device processing is a real constraint on model size and, by extension, on how sophisticated the notification judgment can be. Apple's wager is that users will trade some ceiling on cleverness for a guarantee about where their data goes — a bet that only holds if the on-device experience doesn't feel visibly behind competitors running the same task in the cloud.",
    ],
    tool: {
      name: "Apple Intelligence (on-device architecture)",
      job: "Privacy-first AI architecture underpinning Apple's notification and system-wide intelligence features",
      review:
        "The clearest articulation yet that Apple sees privacy positioning, not raw model capability, as its primary competitive lever in AI. Notification summarization is the daily, visible test case — if on-device quality noticeably trails cloud-based competitors, this bet gets a lot harder to defend.",
      url: "https://www.apple.com/legal/privacy/data/en/intelligence-engine/",
    },
  },
  {
    id: "4",
    slug: "focus-mode-digital-wellbeing-design",
    title: "Focus Mode's real function isn't blocking notifications — it's redesigning the decision to be interrupted",
    summary:
      "A recurring theme across digital-wellbeing coverage: Focus Mode succeeds less as a blunt notification blocker and more as a cognitively-informed default that shifts the interruption decision away from the user having to fight their phone app-by-app.",
    source: "Digital Wellbeing",
    sourceUrl: "https://digitalwellbeing.org/androids-focus-mode-makes-smart-sense-for-digital-wellbeing/",
    publishedAt: "2026-05-28T10:00:00Z",
    category: "Notification Fatigue",
    readTime: 4,
    fireCount: 176,
    imageUrl: "https://picsum.photos/seed/focus-mode-wellbeing/84/84",
    content: [
      "The instinct when people describe notification fatigue is to reach for a blocking tool — mute everything, disable badges, turn on grayscale. Focus Mode's design takes a different premise: the problem isn't that notifications exist, it's that deciding whether each one deserves attention is itself the tax, repeated dozens of times a day.",
      "By letting users define a mode — work, driving, sleep — and pre-committing to which apps get through, Focus Mode moves the decision from notification-by-notification triage to a single upfront choice. That's a much smaller cognitive load, and it's the reason usage data consistently shows commitment-device style features outperforming simple mute switches on adherence.",
      "It also previews the shape of where notification personalization is heading next: fewer manual toggles, more inferred context. The obvious next step — one platforms are already circling — is a system that suggests or auto-activates the right mode based on calendar, location, and usage pattern, rather than requiring the user to remember to turn it on.",
      "The risk in that direction is trust. A Focus Mode you configure yourself is legible — you know exactly what it does. A Focus Mode an AI model infers on your behalf has to earn the same confidence, and get it wrong rarely before users stop trusting it to guard their attention.",
    ],
    tool: {
      name: "Focus Mode / Digital Wellbeing",
      job: "Context-based notification filtering that lets users pre-commit to which apps can interrupt them in a given mode",
      review:
        "Effective specifically because it converts a repeated micro-decision into a one-time setup cost. The next evolution — inferring the right mode automatically — is where personalization and trust are going to collide.",
      url: "https://support.apple.com/guide/iphone/iphe3f499e0e/ios",
    },
  },
  {
    id: "5",
    slug: "meta-ray-ban-display-ambient-computing",
    title: "Meta's Ray-Ban Display glasses are the clearest bet yet that notifications move off the screen entirely",
    summary:
      "9to5Google reports Meta has several new smart glasses in the works, following the Ray-Ban Display's heads-up notification and navigation layer. The pitch: ambient computing where digital interruptions become as natural — and as easy to glance past — as a conversation.",
    source: "9to5Google",
    sourceUrl: "https://9to5google.com/2026/06/01/meta-new-smart-glasses-report/",
    publishedAt: "2026-06-01T08:00:00Z",
    category: "Ambient Computing",
    readTime: 5,
    fireCount: 267,
    imageUrl: "https://picsum.photos/seed/meta-rayban-display/84/84",
    content: [
      "Meta's Ray-Ban Display glasses ship with a heads-up display used for notifications, navigation, and basic information — a small, in-field-of-view layer that never requires pulling out a phone. Reports of several more smart-glasses models in development suggest this isn't a one-off product but a deliberate platform bet.",
      "The interesting design constraint isn't the display technology — it's restraint. A heads-up notification that's always in your peripheral vision has a much lower tolerance for noise than a phone screen you choose to look at. If glasses-based notifications feel anything like today's phone alert volume, users will reject the form factor outright. That means the success of this category depends on aggressive pre-filtering of what's even allowed to reach the display.",
      "That pushes hard on everything else in this space converging at once: on-device summarization, agent-mediated judgment about what's worth surfacing, and cooldown-style throttling all become prerequisites for ambient form factors to work, not nice-to-haves. Glasses are, in effect, a forcing function for notification restraint that phones have been able to avoid.",
      "If this direction holds, the multi-year trajectory is a shift from phones as the primary interruption surface to phones as the fallback — the device you check when something ambient (glasses, a watch, a voice assistant) has already filtered and surfaced the one thing that mattered.",
    ],
    tool: {
      name: "Meta Ray-Ban Display",
      job: "Smart glasses with an in-lens heads-up display for notifications, navigation, and hands-free information",
      review:
        "The most concrete real-world test of ambient notification delivery outside a phone screen. Its long-term viability depends entirely on how aggressively Meta filters what reaches the display — a genuinely harder problem than anything phone notification design has had to solve.",
      url: "https://www.meta.com/help/ai-glasses/1809764829519902/",
    },
  },
  {
    id: "6",
    slug: "openclaw-mobile-agent-live-view",
    title: "OpenClaw's iOS and Android launch turns the phone into a window onto a persistent AI agent",
    summary:
      "TechCrunch covers OpenClaw's arrival on mobile: rather than running the AI on-device, the phone becomes a remote control and status window for an agent running elsewhere — complete with voice, camera access, and push notifications when it needs you.",
    source: "TechCrunch",
    sourceUrl: "https://techcrunch.com/2026/06/30/openclaw-is-finally-available-on-android-and-ios/",
    publishedAt: "2026-06-30T15:00:00Z",
    category: "Agentic Notifications",
    readTime: 5,
    fireCount: 289,
    spicy: true,
    imageUrl: "https://picsum.photos/seed/openclaw-mobile/84/84",
    content: [
      "OpenClaw's architecture makes a deliberate bet that most mobile-AI coverage misses: the agent doesn't run on the phone. The phone is a thin client — a window into a persistent agent running elsewhere, with the app providing voice input, camera access, and, critically, the notification channel the agent uses to reach you.",
      "That reframes what a mobile notification even is in an agentic world. It's no longer \"an app telling you something happened\" — it's a long-running, stateful process reaching across a network boundary to interrupt you, asynchronously, whenever it decides your input is needed. The phone's job shifts from running the intelligence to being a reliable, low-latency delivery mechanism for that agent's occasional demands on your attention.",
      "This is a genuinely different notification design problem than anything today's push infrastructure was built for. Today's systems assume a notification corresponds to a discrete event a server just observed. An agent-initiated interruption instead corresponds to a judgment call — the agent deciding, mid-task, that it has hit a decision point only a human can resolve — which means the volume and timing of these notifications is far less predictable than anything current rate-limiting and cooldown logic was designed around.",
      "The bold read here: if persistent, off-device agents become common, notification infrastructure stops being an OS feature that platforms fully control and starts being a bidding war between competing agent runtimes for a scarce resource — a user's attention — that no single platform owns end to end.",
    ],
    tool: {
      name: "OpenClaw (mobile client)",
      job: "Persistent AI agent architecture with iOS/Android apps acting as remote control and notification surface",
      review:
        "A structurally different take on mobile AI — the intelligence lives off-device and persists across sessions, with the phone as its notification and control surface. Interesting stress test for whether existing push and rate-limiting infrastructure can handle interruptions initiated by an agent's judgment rather than a discrete server event.",
      url: "https://thenewstack.io/openclaw-persistent-agent-architecture/",
    },
  },
  {
    id: "7",
    slug: "mcp-server-ecosystem-agent-notifications",
    title: "MCP is quietly becoming the plumbing for how AI agents notify humans, not just tools",
    summary:
      "A wave of MCP servers — Pushary, PushGo, agent-notify — has emerged specifically to let AI agents like Claude Code, Cursor, and Windsurf push a notification to your phone when they finish a task or need permission. The protocol's use case is expanding past tool-calling into human-in-the-loop interruption.",
    source: "Dev.to",
    sourceUrl: "https://dev.to/sahil_kat/the-mcp-server-ecosystem-in-2026-integration-layer-for-ai-agents-2mln",
    publishedAt: "2026-07-14T09:00:00Z",
    category: "Developer Ecosystem",
    readTime: 5,
    fireCount: 203,
    spicy: true,
    imageUrl: "https://picsum.photos/seed/mcp-notifications/84/84",
    content: [
      "MCP (Model Context Protocol) started as a way to let AI agents call external tools through a consistent API — git clients, search engines, home automation hubs. A distinct and fast-growing category of MCP servers has emerged around a narrower job: getting a notification onto a human's phone at exactly the moment an agent needs their attention.",
      "Pushary sends a push notification when any MCP-connected agent — Cursor, Claude Desktop, Claude Code, Windsurf, Lovable — finishes a long-running task or needs permission, letting the user approve from their phone in one tap. PushGo takes a gateway approach, exposing MCP tools that let authorized agents send message notifications through a scoped, OAuth-bound channel rather than a raw webhook.",
      "What's notable is that this need showed up organically, from developers, before any platform shipped an official answer. Long-running agent tasks — a code migration, a research job, a multi-step workflow — created a real gap: there was no standard way for an agent to say \"I'm done, or I'm stuck, come look\" without the user polling a terminal or a dashboard. MCP notification servers filled that gap the way infrastructure usually gets built: bottom-up, before there's a spec for it.",
      "The bold implication: if agent-to-human notification becomes a standard MCP capability rather than a scattered set of third-party servers, it puts pressure on mobile platforms to expose a first-class, permissioned notification channel for arbitrary agents — not just the ones a device manufacturer builds in-house. That would mean the next fight over notification real estate isn't between apps, but between AI agent runtimes competing for the same interruption slot.",
    ],
    tool: {
      name: "MCP notification servers (Pushary, PushGo)",
      job: "Third-party MCP servers that let AI coding and automation agents send push notifications to a developer's phone",
      review:
        "A grassroots signal worth taking seriously: developers building their own notification plumbing for agents is usually a precursor to platforms formalizing it. Worth tracking whether Anthropic's own MCP roadmap or a mobile OS vendor picks this up as a first-class capability.",
      url: "https://blog.modelcontextprotocol.io/posts/mcp-roadmap/",
    },
  },
  {
    id: "8",
    slug: "ios-27-on-device-notification-summaries",
    title: "iOS 27's notification summaries run entirely on-device — and that architecture choice is the real story",
    summary:
      "Courier's breakdown of Apple Intelligence notification handling in iOS 27: summarizing, ranking, and filtering what reaches the lock screen happens with an on-device model, no network round trip, no per-request server cost — a deliberate contrast to cloud-based competitors.",
    source: "Courier",
    sourceUrl: "https://www.courier.com/blog/apple-intelligence-notifications",
    publishedAt: "2026-08-20T12:00:00Z",
    category: "Platform Strategy",
    readTime: 4,
    fireCount: 224,
    imageUrl: "https://picsum.photos/seed/ios27-summaries/84/84",
    content: [
      "iOS 27 summarizes, ranks, and filters notifications before a user ever sees them, and it does the entire job with a model running locally on the device — no server round trip, no internet dependency, no per-request inference cost. Apple's third-generation foundation models make this viable in a way earlier on-device attempts weren't.",
      "The immediate user-facing benefit is speed and offline reliability: summarization and ranking happen instantly, every time, on the lock screen, whether or not the phone has a network connection. But the more strategic detail is what it removes from Apple's cost structure — there's no server fleet to scale as notification volume grows, which matters enormously if agent-driven notification volume increases the way platform roadmaps suggest it will.",
      "This is also a deliberate opt-in feature, not a silent default — users have to turn on notification summaries, and can turn them back off. That design choice reflects lessons from earlier AI-summarization rollouts that got criticized for confidently misrepresenting sensitive content; requiring explicit enablement is Apple hedging against the same failure mode recurring at platform scale.",
      "Taken together with Android's Notification Cooldown and Gemini's agentic notification design, a pattern is forming across both major mobile platforms: the response to rising notification volume isn't more categories or filters for users to manage — it's automated summarization and throttling running as close to the device as each platform's architecture allows.",
    ],
    tool: {
      name: "Apple Intelligence Notification Summaries (iOS 27)",
      job: "On-device AI that summarizes, ranks, and filters lock-screen notifications without any server round trip",
      review:
        "A strong architectural statement: doing this entirely on-device sidesteps both the privacy exposure and the server-cost scaling problem that a cloud-based version would carry as agent-driven notification volume grows. The opt-in requirement is a sensible hedge against summarization errors on sensitive content.",
      url: "https://support.apple.com/guide/iphone/summarize-notifications-reduce-interruptions-iph1fbe7d2b9/ios",
    },
  },
  {
    id: "9",
    slug: "notification-overload-attention-tax-2026",
    title: "The average phone gets 46 notifications a day — and agents are about to add to that number, not reduce it",
    summary:
      "New 2026 data puts U.S. smartphone users at an average of 46 push notifications daily, with a single alert enough to disrupt concentration for roughly seven seconds. The uncomfortable question the report raises: does agentic AI reduce that load, or just add a new category of interruption on top of it?",
    source: "SpeakWise",
    sourceUrl: "https://speakwiseapp.com/blog/notification-overload-statistics",
    publishedAt: "2026-09-05T10:00:00Z",
    category: "Notification Fatigue",
    readTime: 4,
    fireCount: 256,
    spicy: true,
    imageUrl: "https://picsum.photos/seed/notification-overload-2026/84/84",
    content: [
      "The headline number is stark on its own: U.S. smartphone users receive an average of 46 push notifications a day — nearly six every waking hour — and a single notification is enough to measurably slow cognitive processing for about seven seconds. Multiply that across a day and the attention tax is not trivial.",
      "The behavioral data backs up why this matters for anyone building notification systems. Sending even one push a week leads to a meaningful share of users disabling notifications or uninstalling an app outright; push six to ten times a week and uninstall rates climb sharply. Users consistently open only what feels relevant in the moment — everything else gets ignored, and enough of it triggers users to shut the whole channel off.",
      "This is the backdrop every platform-level fix — Notification Cooldown, on-device summarization, agent-mediated filtering — is actually responding to. None of it is optional polish; it's damage control against a trend line that was already unsustainable before AI agents entered the picture.",
      "The genuinely uncomfortable question the data raises: agents are pitched as the solution to notification overload, filtering and batching on a user's behalf. But every agent that can act autonomously is also a new, non-human source of notification-triggering events — task completions, permission requests, status updates. Whether the net effect of agentic AI is fewer, better-curated interruptions or simply more sources competing for the same shrinking attention budget is still an open empirical question, and the 2026 data doesn't yet show which way it's breaking.",
    ],
    tool: {
      name: "Notification behavior research (2026 aggregate data)",
      job: "Cross-industry data on push notification frequency, disable/uninstall rates, and cognitive interruption cost",
      review:
        "The clearest quantitative case for why every major platform is now investing in throttling and summarization. The open question this data can't yet answer — whether agentic AI nets out to fewer or more interruptions — is the single most important unresolved variable for anyone forecasting notification volume past 2026.",
      url: "https://www.businessofapps.com/marketplace/push-notifications/research/push-notifications-statistics/",
    },
  },
];

export const categories = [
  "All",
  "Agentic Notifications",
  "Notification Fatigue",
  "Personalization",
  "Platform Strategy",
  "Ambient Computing",
  "Privacy & Security",
  "Developer Ecosystem",
] as const;
