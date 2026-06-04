# PLAN — Mockup HTML/CSS/JS cho Memory Garden

## Mục tiêu
Tạo mockup interactive (HTML/CSS/JS) cho **toàn bộ 8 chức năng** của app
Memory Garden, ở **2 hướng visual song song**: Cozy garden cute + Pixel/game-y.
Mockup để brainstorm/validate UX trước khi code Android Compose thật.

## Phạm vi — 8 feature
1. Memory Management (CRUD memory: ảnh, mô tả, category, tags)
2. Garden System (vòng đời cây: seed → sprout → plant → bloom → rare bloom)
3. Collection System (Atlas / Pokédex grid, slot khóa silhouette, progress)
4. Categories (Adventure, Food, Relationship, Entertainment, Growth, Milestones)
5. Timeline (Year / Month / Life Journey view)
6. Milestones (achievements: First Memory, 10/100 Memories...)
7. Widgets (Recent Memory, Garden Progress, On This Day — preview)
8. Garden Customization (theme pack, decoration, layout)

## Cách làm
- 1 single-page mockup app trong `brainstorm/mockups/`.
- Phone frame mobile (~390×844), bottom nav 5 tab + màn phụ.
- Toggle style **Cozy ↔ Pixel** runtime qua `data-theme` + CSS variables.
- Data-driven: catalog cây, sample memory, milestone trong `data.js`.
- Icon dùng emoji (không phụ thuộc asset). Pixel font qua Google Fonts, fallback monospace.
- Không cần backend, mở trực tiếp index.html.

## Cấu trúc file
```
brainstorm/mockups/
  index.html            hub: phone frame + nav + style switcher
  css/base.css          layout, phone frame, bottom nav, component dùng chung
  css/theme-cozy.css    pastel, bo tròn, soft shadow
  css/theme-pixel.css   pixel art, viền đậm, retro palette
  js/data.js            catalog cây, sample memories, categories, milestones
  js/app.js             router + render 8 màn + interactions + toggle style
```

## Trạng thái
- [x] Chốt scope (8 feature) + style (2 bản Cozy + Pixel)
- [x] data.js
- [x] base.css
- [x] theme-cozy.css
- [x] theme-pixel.css
- [x] app.js
- [x] index.html
- [x] verify mở chạy được
- [x] **Season System (4 mùa)** — dựng vào mockup (data/app/css). Design: `.planning/SEASON_SYSTEM.md`

## Ghi chú
- Repo research, KHÔNG có code Android (Kotlin) → bỏ qua android-code-indexer / bug-pool.
- Activation funnel (brainstorm doc): Garden Home + Atlas + Create Memory + First
  Bloom là lõi aha moment — ưu tiên polish 4 màn này.

## Bổ sung — Season System (4 mùa)
- **Design đầy đủ:** `.planning/SEASON_SYSTEM.md` (mô hình, mechanics, monetization, MVP cut, risks).
- **Spec sản phẩm:** đã sync vào `base/Memory Garden.md` (mục 9 + Garden System + Rewarded Ads + MVP scope).
- **Mockup:** dựng vào `data.js` / `app.js` / `base.css` — switcher + banner + particle (Garden),
  badge + seasonal progress (Atlas), "nở rộ mùa" + Out-of-season Seed (Plant detail). Mở mặc định mùa **Hạ** (2026-06).
