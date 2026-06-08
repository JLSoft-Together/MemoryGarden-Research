# Memory Garden: Your Life Journey — Feature Overview

> Memory Journal + Collection Game + Life Timeline — Android (Jetpack Compose).
> Core loop: **Memory → Collection → Garden → Progress → Retention**.

---

**Memory Garden** turns the memories of your life into a living digital garden. Every memory you save grows a new plant, unlocks a new flower, and makes your garden richer over time — so your memories live and bloom instead of being forgotten in a list.

The app uses a **progressive feature unlock** system: at first, only the core actions are visible. After you complete the first few goals, sections like Timeline, sharing, backup reminders, and other retention layers unlock gradually.

## Feature unlock path

- **Goal 1** — Finish onboarding and see `First Bloom`
  - Unlocks: Garden, simplified Create, Atlas preview, reduced Settings
  - Still hidden: Timeline, Share, Backup, Widgets, recap, seasonal monetization
- **Goal 2** — Create one real memory after onboarding
  - Unlocks more: full Atlas core, basic milestones, quick-capture, basic reminder/particle options
- **Goal 3** — Complete the `3 Memories Starter Quest`
  - Unlocks more: Timeline, Share / Memory Card, Backup & Restore, Widgets, nearly full Settings
- **After Goal 3**
  - Additional layers such as AI Recap preview, deeper seasonal hooks, and advanced retention features can appear gradually

## Visibility rules

- Locked tabs/screens are **fully hidden**, not shown as locked icons.
- Secondary features inside an unlocked screen can also stay hidden during the early phase to reduce overload.
- After each goal, the app should show a short reward/unlock moment so the player notices what just opened.

## Main features

1. **Memory Management** — Create, edit, delete memories. Add a photo, description, category, tags and a **mood**. **Quick-capture** lets you save 1 photo + 1 line in seconds.
2. **Garden System** — Each memory automatically grows a plant through stages: **Seed → Sprout → Plant → Bloom → Rare Bloom**.
3. **Collection (Garden Atlas / Pokédex)** — A grid of all plant species with **dex numbers** (#001…), silhouettes for locked slots, and a **catch animation** when you unlock a new plant. Track completion per category and overall.
4. **Categories** — Adventure, Food & Drink, Relationship, Entertainment, Personal Growth, Life Milestones.
5. **Timeline** — View memories by Year, Month, or as a full **Life Journey**.
6. **Milestones** — Earn badges (First Memory, 10 Memories, First Trip, First Date…).
7. **Widgets** — Recent Memory, Garden Progress, and **On This Day**.
8. **Garden Customization** — Themes, decorations, and layout.
9. **Season System (4 seasons)** — Spring / Summer / Autumn / Winter follow your device's real calendar. Seasons add bonuses only (never block growth): seasonal plants glow, get **+20% rare bloom**, and blooms shift color by season. The garden changes its palette and particles (🌸/✨/🍂/❄️).
10. **Onboarding & Activation** — A **quick-select, no-typing onboarding**: tap a mood or a suggested memory preset to plant your first memory, **First Bloom Guarantee** (your first memory always blooms rare), and a **3-Memory Starter Quest**.
11. **Social Share / Memory Card** — Export a styled image card of one memory or the whole garden to share on social media.

## Privacy & data

- **Local-first** — all data stays on your device (Room + DataStore + local files). No account, no required backend.
- **Backup** — Export / Import as a ZIP file. A **backup reminder** nudges you when it's been a while. Optional manual export to your own Google Drive.
