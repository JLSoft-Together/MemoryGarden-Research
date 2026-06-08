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

## Kiến trúc mockup (vanilla JS — không framework)

Single-page, state-driven. Nắm 3 điểm này trước khi sửa `js/app.js`:

- **Router**: `ROUTES` map `screenId → scXxx()`. Mỗi `scXxx()` trả `{title, sub, body, back?}` với `body` = chuỗi HTML. `render()` ghi `#screenBody.innerHTML` + appbar + nav. `go(screen)` set `state.screen` rồi `render()`. Thêm màn = thêm 1 hàm `scXxx` + 1 entry trong `ROUTES`.
- **Event delegation — 2 tầng, đây là gotcha lớn nhất**:
  1. Màn chính: 1 listener trên `#screenBody` bắt mọi `[data-act]` → `handleAct(act, dataset)`. HTML trong body chỉ đặt `data-act` / `data-id`, không gắn handler trực tiếp.
  2. Overlay (`onboarding`, `coach`, bloom, fx) render **ngoài** `#screenBody`, thẳng vào `.phone` → listener trên KHÔNG bắt được. Có listener riêng trên `.phone`, scope theo selector `.bloom-overlay, #onboarding, .fx-overlay, #coach`. **Thêm overlay mới → bắt buộc thêm selector của nó vào danh sách này, nếu không click chết.**
- **`handleAct` là switch trung tâm**: mọi tương tác (nav, season, settings toggle, bước onboarding/coach, fx) đều route qua đây.

## Theming & mùa

- `<body data-theme="cozy|pixel" data-season="...">`. `base.css` = biến CSS + layout chung; `theme-cozy.css` / `theme-pixel.css` chỉ override token. `render()` set `data-season` + `--season-tint` mỗi lần vẽ.
- Thêm UI mới: **dùng biến CSS** (`--primary`, `--bg-card`, `--text-dim`, `--radius-md`, `--font-display`…), không hardcode màu/radius → tự ăn cả 2 theme + 4 mùa.

## data.js — nguồn sự thật

- `STATS` là **getter dẫn xuất** (tính live từ `PLANTS` / `MEMORIES`), không phải số cứng — đổi data thì stats đổi theo.
- `currentSeasonId()` derive từ `new Date()` + `state.hemisphere` (Nam bán cầu dịch +6 tháng), bọc try/catch vì `state` còn ở TDZ lúc khởi tạo object literal.

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
    js/data.js          Catalog cây, sample memories, SEASONS, categories, milestones (STATS = getter dẫn xuất)
    js/app.js           Router + render 8 màn + handleAct + overlay (onboarding, coach, bloom, fx)
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
