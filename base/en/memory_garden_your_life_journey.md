# Memory Garden: Your Life Journey

## Project Information

- **App name:** Memory Garden: Your Life Journey
- **Genre:** Memory Journal + Collection Game + Life Timeline
- **Platform:** Android (Jetpack Compose)

---

## Product Goal

Build an app that helps users preserve memorable life moments in the form of a growing digital garden.

Every memory unlocks new plants, new flowers, and new items, making the garden increasingly rich over time.

The goal is to create the experience:

> Memory → Collection → Garden → Progress → Retention

Instead of:

> Memory → List → Forgotten

---

## Monetization Model

### IAA — Primary revenue source

**Ad Formats:** App Open · Native Ads · Rewarded Ads

**Rewarded Ads:** Mystery Seed · Rare Plant · Growth Boost · Random Decoration

### IAP — Supplementary revenue source

**Lifetime Pro:** Unlimited Memories · Backup & Restore · Premium Widgets

**Theme Packs:** Japanese Garden · Fantasy Garden · Romantic Garden · Pixel Garden

**Decoration Packs:** Fountain · Lantern · Sakura Set · Love Set

---

## Backend

**Is a backend needed? No.**

The app is designed **Local-first** — data is stored entirely on the device.

- **Storage:** Room Database · DataStore · Local Files
- **Backup:** Export ZIP · Import ZIP

A backend is only considered in very distant phases (Couple Garden or Cloud Sync).

---

## Core Features

### 1. Memory Management

Create Memory · Edit Memory · Delete Memory · Add photo · Add description · Add category · Add tags

### 2. Garden System

Auto-generate plants from Memory · Seed system · Sprout · Plant · Bloom · Rare Bloom

### 3. Collection System

List of unlocked plants · List of locked plants · Progress per category · Overall Completion

### 4. Categories

- **Adventure:** Travel · Beach · Camping · Hiking
- **Food & Drink:** Coffee · Restaurant · New Food
- **Relationship:** Date · Anniversary · Gift
- **Entertainment:** Movie · Concert · Anime · Manga
- **Personal Growth:** Books · Learning · Courses
- **Life Milestones:** Birthday · Graduation · First Job · New House · New Car

### 5. Timeline

Memory Timeline · Year View · Month View · Life Journey View

### 6. Milestones

Example: First Memory · 10 Memories · 100 Memories · First Trip · First Date

### 7. Widgets

- **Recent Memory** — shows the most recent memory.
- **Garden Progress** — shows garden progress.
- **On This Day** — shows a memory from the same day in the past.

### 8. Garden Customization

Theme · Decoration · Layout

---

## MVP Scope (V1)

**Required:** Memory CRUD · Category · Collection · Garden · 30-50 plant types · Native Ads · Rewarded Ads

**Not yet:** Cloud Sync · Account · Couple Garden · Family Garden · AI Features

---

## Technical Stack

- **UI:** Jetpack Compose · Material 3
- **Architecture:** MVI · ViewModel · Repository
- **Storage:** Room · DataStore
- **Media:** Coil
- **Monetization:** Google AdMob · Google Play Billing
- **Widget:** Glance

---

## Success Criteria

After release:

- D1 Retention > 35%
- D7 Retention > 12%
- Rewarded Ads Usage > 25%
- First 1000+ MAU
- Validate market demand before developing subsequent phases
