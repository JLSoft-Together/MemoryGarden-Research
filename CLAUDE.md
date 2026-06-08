# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Tính chất repo

**Research & brainstorm repo** — KHÔNG có code Android (Kotlin/Compose). Mục đích: thiết kế sản phẩm, validate UX qua mockup HTML trước khi bắt tay code Android thật.

→ Bỏ qua toàn bộ `android-code-indexer` và `android-bug-pool` cho repo này.

## Chạy mockup

Mở trực tiếp bằng trình duyệt — không cần server, không cần build:

```
brainstorm/mockups/index.html
```

Toggle style Cozy ↔ Pixel qua button trên toolbar.

## Cấu trúc

```
base/                   Đặc tả sản phẩm (song ngữ vi/en)
  Memory Garden.md      Nguồn sự thật duy nhất: stack kỹ thuật, feature list, MVP scope, monetization
  vi/ en/               Tài liệu chi tiết theo ngôn ngữ

.planning/
  PLAN.md               Trạng thái mockup (checklist hoàn thành)
  SEASON_SYSTEM.md      Thiết kế đầy đủ hệ thống 4 mùa

brainstorm/
  Brainstorm Ideas - Activation x Collection Gamers.md   Top 5 ideas + assumptions cần validate
  mockups/
    index.html          Single-page app (phone frame, 8 màn, bottom nav)
    css/base.css        Layout, phone frame, component chung
    css/theme-cozy.css  Pastel, bo tròn
    css/theme-pixel.css Pixel art, viền đậm, retro
    js/data.js          Catalog cây, sample memories, SEASONS, categories, milestones
    js/app.js           Router, render 8 màn, interactions, season switcher
```

## Sản phẩm — Memory Garden: Your Life Journey

**Core loop:** Memory → Collection → Garden → Progress → Retention

**Platform:** Android, Jetpack Compose + Material 3, MVI architecture

**Storage:** Local-first. Room + DataStore + Local Files. Backup = Export/Import ZIP. Backend không có ở MVP.

**Stack kỹ thuật (Android thật):**
- UI: Jetpack Compose + Material 3
- Architecture: MVI — ViewModel → UseCase → Repository → DataSource
- Storage: Room, DataStore
- Media: Coil
- Widget: Glance
- Monetization: AdMob (App Open, Native, Rewarded), Google Play Billing

## Season System — nguyên tắc bất biến

- **ADDITIVE-ONLY**: mùa chỉ cộng bonus, **tuyệt đối không** chặn growth hay nở hoa.
- **First bloom miễn nhiễm mùa**: memory đầu luôn nở rare.
- Seasonal-exclusive plants **không** tính vào 100% core completion (tránh time-gate).
- Mùa derive từ `LocalDate.now()` — không backend, không persist.

## MVP scope (làm trước)

1. Memory CRUD + Category
2. Garden System (Seed → Sprout → Plant → Bloom → Rare Bloom)
3. Collection/Atlas (Pokédex grid, slot silhouette)
4. Season ambient (palette + particle + bloom variant)
5. Native Ads + Rewarded Ads

Chưa làm: Cloud Sync, Account, Couple/Family Garden, AI Features.

## Activation priorities (theo brainstorm)

Funnel: `Install → First Memory → First Bloom → Catalog slot trống → D1 retention`

Top ideas đã chọn:
1. Gallery-seeded first memory (EXIF + ML Kit auto-fill)
2. Garden Atlas / Pokédex framing
3. First Bloom Guarantee + Blank-to-Bloom animation
4. 3-Memory Starter Quest
5. Activation funnel analytics (Firebase) — đo trước khi A/B

## Khi cập nhật tài liệu

- Thay đổi spec sản phẩm → cập nhật `base/Memory Garden.md` + sync `base/vi/` và `base/en/`.
- Thay đổi season design → cập nhật `.planning/SEASON_SYSTEM.md`.
- Thay đổi trạng thái công việc → cập nhật `.planning/PLAN.md`.
- Thay đổi mockup data → `brainstorm/mockups/js/data.js` là nguồn sự thật duy nhất cho catalog cây và seasons.
