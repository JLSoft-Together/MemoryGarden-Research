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
- [x] **Onboarding** — overlay 5 bước "trải nghiệm gieo mầm" (data/app/css). Design: `.planning/ONBOARDING.md`
- [x] **Settings (Cài đặt)** — màn riêng 5 nhóm (Gói · Giao diện/Mùa · Dữ liệu · Thông báo · Chung). Vào từ More › Cài đặt + gear ⚙️ appbar.
- [x] **Activation & Retention add-ons** — Mood Tracker · Social Share card · AI Recap (preview/Phase 2) · Backup reminder + màn Backup · 3-Memory Starter Quest · Quick-capture · Pokédex dex# + catch animation · Season glow toàn màn · Timeline Life-Journey động · wire edit/delete/gallery-seed.
- [x] **Coach guide (Garden first-entry)** — spotlight overlay 3 bước: ô đất trống → nút + thêm kỷ niệm → mục tiêu vườn. Auto bật sau onboarding; link "💡 Xem hướng dẫn" ở Garden để replay.

## Ghi chú
- Repo research, KHÔNG có code Android (Kotlin) → bỏ qua android-code-indexer / bug-pool.
- Activation funnel (brainstorm doc): Garden Home + Atlas + Create Memory + First
  Bloom là lõi aha moment — ưu tiên polish 4 màn này.

## Bổ sung — Season System (4 mùa)
- **Design đầy đủ:** `.planning/SEASON_SYSTEM.md` (mô hình, mechanics, monetization, MVP cut, risks).
- **Spec sản phẩm:** đã sync vào `base/Memory Garden.md` (mục 9 + Garden System + Rewarded Ads + MVP scope).
- **Mockup:** dựng vào `data.js` / `app.js` / `base.css` — switcher + banner + particle (Garden),
  badge + seasonal progress (Atlas), "nở rộ mùa" + Out-of-season Seed (Plant detail). Mở mặc định mùa **Hạ** (2026-06).

## Bổ sung — Onboarding ("trải nghiệm gieo mầm")
- **Design đầy đủ:** `.planning/ONBOARDING.md`.
- **Flow 5 bước (overlay):** Welcome (concept 5s) → Style (Cozy/Pixel) → Seed (chạm mood, tự gieo) →
  First Bloom (animation + reward 🏆🎁) → Tour (Atlas/Season/Widget) → đáp xuống **Garden**.
- **Payoff:** mở cây hiếm `p05` + lấp ô trống cuối vườn bằng cây "Mới 🌟" (guard `onboard.applied`).
- **Mockup:** `js/app.js` (section ONBOARDING), `css/base.css` (section ONBOARDING + `.plot.fresh`),
  `index.html` (nút 🚀 Onboarding). Replay: toolbar + More › "Xem lại Onboarding".
- Local-first → **không account/đăng nhập**; skip ở mọi bước trừ bloom.

## Bổ sung — Settings (Cài đặt)
- **Vào màn:** More › ⚙️ Cài đặt **hoặc** gear ⚙️ trên appbar (thay nút hồ sơ cũ chưa wire).
- **5 nhóm:**
  1. **Tài khoản & Gói** — Pro upsell card · Khôi phục mua hàng · Theme & Skins (→ Customization).
  2. **Giao diện & Mùa** — segment Cozy/Pixel · **Bán cầu Bắc/Nam** (đổi lịch 4 mùa: Nam dịch +6 tháng) · toggle **Hiệu ứng môi trường** (tắt particle vườn).
  3. **Dữ liệu & Quyền riêng tư** — Export/Import ZIP · Backup & Restore (→ màn Backup) · dung lượng đã dùng · **Xóa toàn bộ dữ liệu** (2 bước xác nhận, danger zone).
  4. **Tiện ích & Thông báo** — toggle nhắc ghi chép hàng ngày · Widgets.
  5. **Chung & Hỗ trợ** — Ngôn ngữ vi/en · Về ứng dụng · Phản hồi · Xem lại Onboarding.
- **State (DataStore ở app thật):** `hemisphere`, `particleFx`, `dailyReminder`/`reminderTime`, `lang`, `proActive`, `confirmWipe`.
- **Mockup:** `js/app.js` (`scSettings` + ROUTES + handleAct), `js/data.js` (`STORAGE`), `css/base.css` (section SETTINGS), `index.html` (gear ⚙️ + legend).
- **Tác động thật:** Bán cầu Nam → `currentSeasonId()` dịch +6 tháng (đồng bộ "mùa đang diễn ra"); tắt particle → `seasonFx()` rỗng. Local-first: mọi lựa chọn lưu cục bộ, không server.

## Bổ sung — Activation & Retention add-ons
- **Spec sản phẩm:** đã sync vào `base/Memory Garden.md` (mục 1 Mood/Quick-capture · mục 3 Pokédex · Backup · mục 10 Onboarding & Activation · mục 11 Social Share · MVP scope · Phase 2 AI Recap) + bản song ngữ `base/vi/` & `base/en/`.
- **Mood Tracker** — `data.js` `MOODS`/field `mood`; `app.js` chips ở Create + badge ở Memory detail + memRow meta + card "Tâm trạng năm nay" (Timeline‹Năm›).
- **Social Share** — `playShareCard()` overlay card kỷ niệm/khu vườn (tint theo mùa + watermark); vào từ Memory detail + Garden. Lưu ảnh = toast.
- **AI Memory Recap (Phase 2 — preview)** — `recapCard()` ở Timeline‹Tháng› gắn badge "Sắp ra mắt" → `playRecap()` overlay tóm tắt tĩnh. Không gọi AI thật.
- **Backup reminder** — `data.js` `BACKUP`; banner nhắc dismissible ở Garden + màn `scBackup` (Export ZIP / Drive thủ công / toggle nhắc). Local-first, không cloud-sync nền.
- **3-Memory Starter Quest** + **Quick-capture** — ở Garden (`scGarden`); quick-capture mở bottom-sheet `playQuickCapture()`.
- **Pokédex** — dex `#NNN` (`dexNo`) ở Atlas + Plant detail; `playCatch()` reveal "sưu tầm" (demo từ Plant detail locked).
- **Season glow toàn màn** — `.phone::after` ambient lái bằng `--season-tint` (additive, pointer-events none).
- **Timeline Life-Journey động** — derive từ MEMORIES (rare+) + MILESTONES (done), bỏ hardcode.
- **Wire stub** — gallery-seed điền cat/sub/title + dòng "AI nhận diện"; edit memory (`state.editing`, prefill); delete có bước xác nhận (`confirmDelete()`).
- **Fix kèm:** thêm delegation click trên `.phone` cho overlay (bloom/onboarding/fx) — trước đó nằm ngoài `#screenBody` nên không bắt được click.
- **Mockup giữ depth visual/stub + toast** (không persist state nặng). Mở trực tiếp `index.html`.

## Bổ sung — Coach guide (highlight lần đầu vào Garden)

- **Vấn đề:** user vừa qua onboarding, đáp xuống Garden nhưng chưa biết flow (thêm kỷ niệm ở đâu, mục tiêu trồng cây là gì).
- **Giải pháp:** coachmark spotlight — khoét sáng 1 element + tooltip điều hướng (dots · Bỏ qua · Tiếp). 3 bước:
  1. `.plot.empty` → "Ô đất đang chờ" (vườn là gì, ô trống = chỗ gieo cây).
  2. `.navitem.fab` → "Thêm kỷ niệm" (chạm + để gieo hạt).
  3. `.ring-wrap` → "Mục tiêu khu vườn" (sưu tầm đủ loài, lấp đầy Atlas).
- **Trigger:** auto sau `endOnboarding(true)` lần đầu (`coach.seen` guard). Replay qua link **💡 Xem hướng dẫn** ở hint Garden (`coachReplay`).
- **Kỹ thuật:** overlay con của `.phone` (z-index 120); `paintCoach()` đo rect target, bù `transform: scale()` màn nhỏ; `scrollIntoView` target trong vùng cuộn; step thiếu target tự bỏ qua. Rời Garden → `go()` tự `endCoach()`.
- **Mockup:** `js/app.js` (section COACH MARKS + handleAct `coachNext/coachSkip/coachReplay` + delegation `#coach`), `css/base.css` (section COACH MARKS + `.hint .link`).
