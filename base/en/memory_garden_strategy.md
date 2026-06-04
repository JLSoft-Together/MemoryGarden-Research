# Memory Garden: Your Life Journey — Product Strategy & Technical Design

## Pre-development Assessment

From the perspective of an indie Android developer living on IAA + IAP, Memory Garden should **NOT** be built as a Journal app.

If built as a Journal:

- low retention
- user must proactively write entries
- hard to monetize
- hard to scale content

Instead it should be developed as:

### Memory Collection Game

The journal is merely the input data. What the user actually sees is:

- Garden
- Collection
- Rare Plants
- Milestones
- Visual Progress

---

## North Star Metric

Not: **number of memories**

But: **Garden Completion %**

Example:

```
Garden Progress      42%
Adventure            56%
Relationship         21%
Growth               39%
```

Users will want to complete their garden.

---

## Product Model

**Layer 1 — Memory** (raw data)
Example: Trip to Ha Long · Concert · A date

**Layer 2 — Collection** (collections are generated from memories)
Example: `Memory: Beach trip → Unlock → Beach Flower`

**Layer 3 — Garden**
Collections appear in the garden.

**Layer 4 — Meta Progression** (the retention layer)
- Garden Level
- Garden Completion
- Rare Collection
- Season Collection

---

## Local-first Mindset

The app needs no backend. Everything is stored locally.

**Room Database:** Memory · Collection · Plant · Garden Item · Milestone · Settings

**File Storage:** Photos · Videos · Thumbnails

**Data Export:** JSON · ZIP · Backup

---

## Database Model

### Memory

```kotlin
data class Memory(
    val id: Long,
    val title: String,
    val description: String,
    val categoryId: Int,
    val imagePath: String?,
    val createdTime: Long
)
```

### Plant

```kotlin
data class Plant(
    val id: Int,
    val name: String,
    val rarity: Int,
    val categoryId: Int,
    val imageRes: String
)
```

### Collection

```kotlin
data class Collection(
    val plantId: Int,
    val unlockedTime: Long
)
```

---

## UI Architecture

- Jetpack Compose
- MVI
- Navigation Compose
- Room
- DataStore
- Coil
- Billing v8
- Admob

### Main Tabs

- **Garden** — default tab. Shows the garden.
- **Memories** — list of memories.
- **Collection** — list of plants.
- **Timeline** — life timeline.
- **Profile** — progress.

### Garden Screen

This is the most important screen. When the user opens the app they must immediately see **"my garden"**, not a list of memories.

The garden contains: Grass · Trees · Flowers · Decorations — auto-generated based on the collection.

### Collection System

Example:

- Adventure Collection — 50 plants
- Food Collection — 40 plants
- Relationship Collection — 30 plants

The user sees: `Adventure 23 / 50 — 46%`. This is the **main retention mechanic**.

### Milestone System

Example: First Memory · 10 Memories · 100 Memories · 1 Year Journey · 10 Trips · 50 Coffee Memories

Reward: Rare Seed · Theme · Decoration

### Timeline

Auto generated. Example:

```
2026 — Trip to Ha Long · Bought a Macbook · Lan's birthday
2027 — ...
```

This is the **emotional retention** feature.

### Widget Strategy

- **Widget 1** — Recent Memory
- **Widget 2** — On This Day (very strong, e.g. "1 year ago today")
- **Widget 3** — Garden Progress (42%)

---

## Monetization Model

### IAA (primary revenue source)

- **App Open** — shown only on: Cold Start
- **Native** — Collection · Timeline · Explore
- **Rewarded** — Mystery Seed · Growth Boost · Rare Plant

### IAP Model

Do not sell subscriptions. This user segment dislikes subscriptions.

- **Lifetime Pro** — 99k / 149k / 199k (A/B test). Unlocks: Unlimited Memories · Backup · Export · Premium Widget
- **Theme Pack** — 39k / 59k
- **Decoration Pack** — 29k / 49k
- **Rare Garden Pack** — 49k / 99k

---

## ASO Strategy

**Do not market as:** Journal · Diary · Memory Book

**Market as:** Memory Garden — Your Life Journey

**Keywords:** Memory · Life Journey · Timeline · Memories · Moments · Personal Story

---

## Development Roadmap

**Version 1.0** — Goal: ship to store fast (2 weeks)
Memory · Collection · Garden · 30 plants · Native Ads · Rewarded Ads

**Version 1.5** — (1 week)
Widget · Milestone · Timeline

**Version 2.0**
100+ plants · Decoration · Theme. Start selling IAP.

**Version 3.0**
Garden Animation · Seasonal Garden · Rare Collection

**Version 4.0**
Couple Garden. Leverage users from Love Quote Story.

---

## Assessment per the JLSoft Model

**Pros:**
- Local-first
- No API
- No backend
- No AI
- Easy to code in Compose
- Easy to scale features
- Easy to add IAP
- Natural fit for Rewarded Ads

**Risks:**
- ASO is harder than a Countdown App
- User must grasp the concept within the first 5 seconds
- The garden must look truly beautiful

---

## Conclusion

Memory Garden should not be built as a journaling app. It should be built as a **memory collection game**, where:

> Memory → Collection → Garden → Progress → Retention

This is the best-fit direction for a local-first Android product built with Jetpack Compose, monetized via IAA + IAP, with the potential to grow into a long-term product.
