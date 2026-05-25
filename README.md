# aiPulse

> A feed of real stories about how people use AI in their life and work.

**Live demo:** [aipulse-tawny.vercel.app](https://aipulse-tawny.vercel.app)

![aiPulse Feed](https://github.com/user-attachments/assets/6532b575-3512-4e3a-ae29-677545ce61ed)

---

## ✨ What is this?

aiPulse is a feed of **real stories** about how people use AI in their life and work.

**Main features:**

- 📖 **Story-first**: real human experiences, hand-curated like a newsletter
- 🌶️ **Spicy mode**: filter for the bold, unconventional use cases
- 🔥 **Community-rated**: vote with 🔥 reactions
- 🎧 **Listen mode**: hands-free, perfect for driving like podcast or audio book time
- 🌏 **Cross-cultural**: Chinese AI stories from RedNote, translated to English

---

## 🎯 Why I built this

It started with my own FOMO and curiosity.

I kept wondering — what are all those magical AI use cases people are talking about? What if I'm missing the one that could save me 10 hours a week?

So I'd hunt them down on Reddit and Medium, bookmark them, save them for later. 

If you do the same — this is for you. aiPulse is the AI use-case newsletter. Real human stories, each with a link back to the original source and the tool used in that specific story.

---

## 📱 On mobile

<img src="https://github.com/user-attachments/assets/9123138d-a0a7-462d-b35d-9cddf72d1ccf" width="300" alt="Mobile view" />

---

## 🛠 Tech stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Supabase (Postgres + Row Level Security)
- **AI**: Claude API (`claude-haiku-4-5`) for content pipeline
- **Hosting**: Vercel
- **Content sources**: Reddit, ProductHunt, YouTube, Medium, RedNote

---

## 🚀 Run locally

```bash
git clone https://github.com/yuezhang87/aipulse.git
cd aipulse
npm install
```

Create a `.env.local` with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ANTHROPIC_API_KEY=your_anthropic_key
```

Then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🗺 Roadmap

- [x] Web MVP with 10 curated stories
- [x] Listen mode (Web Speech API)
- [x] Fire reactions with persistent counts
- [x] Spicy badge + filter
- [x] Automated content pipeline (Reddit → Claude → Supabase)
- [ ] Logic Map + "Try This" prompts on story pages
- [ ] Mobile app (React Native + Expo)

---

## 🤝 Contributing

This is a side project I'm building in public. PRs, issues, and ideas welcome.
If you have a great AI story to share, [open an issue](https://github.com/yuezhang87/aipulse/issues/new).

---

## 📄 License

MIT 

Built in public.
