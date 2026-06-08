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
- [x] **Final MVP Flow locked** — chốt flow `Goal 0 -> Goal 3`, Create ưu tiên nhanh nhất không ép ảnh, success trả về Garden, `Timeline` unlock sau `3 Memories Starter Quest`, tab khóa dùng kiểu `locked but informative`. Chi tiết: `.planning/UX_REVIEW_MVP.md`
- [x] **MVP Screen Spec** — bản `screen-by-screen spec` ngắn cho dev/design. File: `.planning/MVP_SCREEN_SPEC.md`
- [x] **Implementation Checklist** — checklist triển khai mockup/Compose theo flow đã chốt. File: `.planning/IMPLEMENTATION_CHECKLIST.md`
- [x] **User Flow + State Machine** — logic gating/unlock theo `Goal 0 -> Goal 3` cho dev. File: `.planning/USER_FLOW_STATE_MACHINE.md`
- [x] **Copywriting Pack** — bộ copy ngắn thống nhất cho onboarding/Garden/Create/Timeline locked/unlock. File: `.planning/COPYWRITING_PACK.md`
- [x] **Phase Task Breakdown** — backlog triển khai theo phase, có dependency, output và definition of done. File: `.planning/PHASE_TASK_BREAKDOWN.md`

## Spec code Android (Compose)
- **Spec đầy đủ:** `.planning/COMPOSE_SPEC.md` — kiến trúc MVI, data/domain layer, 8 màn + overlay, design system Cozy/Pixel (token+Modifier, KHÔNG dùng Styles API alpha — để dành post-MVP), engine mùa + growth, chia **9 phase** (Phase 0 nền tảng → Phase 8 release).
- Map mockup (vanilla JS) → Compose ở mục 11 của spec.
- **Asset spec:** `.planning/ASSET_SPEC.md` — danh sách asset, tách Design tay / Gen AI / Code-drawn, bảng số lượng + pipeline.
- **3 quyết định asset đã CHỐT (2026-06-08):** (a) ✅ cả 2 style Cozy+Pixel · (b) ✅ full 5 stage · (c) ✅ audio theo đề xuất (SFX MVP + 1 BGM ambient, 4 BGM mùa Phase 2). → plant sprite = **340** (34×5×2).
- **Prompt AI sẵn dùng:** `.planning/ASSET_PROMPTS.md` — công thức ghép + 2 reference sheet + 34 plant subject + branding/season/bg/deco/onboarding/anim/audio + checklist gen theo thứ tự.

## Ghi chú
- Repo research, KHÔNG có code Android (Kotlin) → bỏ qua android-code-indexer / bug-pool.
- Activation funnel (brainstorm doc): Garden Home + Atlas + Create Memory + First
  Bloom là lõi aha moment — ưu tiên polish 4 màn này.
- **Quyết định UX chốt (2026-06-08): Progressive Unlock** — khi user mới vào và **chưa hoàn thành 3 goal đầu**,
  app sẽ **ẩn bớt tính năng** để tránh quá tải. Feature mở dần theo tiến độ như game unlock level mới.
- **Quyết định UX chốt (2026-06-08): Locked but informative** — với tab/feature chưa mở, không ẩn hoàn toàn trong mọi trường hợp; ưu tiên hiện trạng thái khóa có hướng dẫn ngắn và progress mở khóa, đặc biệt cho `Timeline`.
- **Lưu ý planning hiện tại:** mới sync tài liệu/spec/checklist. **Chưa code mockup** theo flow mới ở `brainstorm/mockups/`.

## Progressive Unlock — mở tính năng dần
- **Mục tiêu:** giảm overload lúc đầu, giữ user tập trung vào core loop `Create -> Bloom -> Unlock`.
- **Nguyên tắc:** không xóa feature khỏi sản phẩm; chỉ trì hoãn thời điểm hiển thị cho đến khi user sẵn sàng.
- **Định nghĩa tạm cho 3 goal đầu:**
  1. Hoàn thành onboarding + thấy first bloom
  2. Tạo thêm 1 memory ngoài onboarding
  3. Hoàn thành mốc `3 Memories Starter Quest`
- **Trước khi đủ 3 goal:** chỉ ưu tiên hiển thị Garden, Create, tiến độ cơ bản, quest, và Atlas ở mức tối thiểu.
- **Sau mỗi goal:** mở thêm 1 lớp giá trị mới để tạo cảm giác "lên level".
- **Feature nên ẩn lúc đầu:** Timeline nâng cao, Widget hook, Share card, AI Recap preview, Backup reminder, Settings sâu, seasonal upsell/monetization.
- **Feature nên mở sớm:** Add Memory, Garden progress, First Bloom, Atlas unlock, milestone gần nhất.
- **Lưu ý UX:** mục đã khóa có thể `ẩn hẳn` hoặc hiện `coming soon / mở ở goal tiếp theo`; ưu tiên MVP là **ẩn hẳn** để màn sạch hơn.

### Gợi ý lộ trình unlock MVP
- **Goal 0-1:** Garden + nút Thêm kỷ niệm + quest + Atlas preview cơ bản.
- **Goal 2:** mở Atlas đầy đủ + milestone cơ bản + quick-capture.
- **Goal 3:** mở Timeline, Share, Backup reminder, Settings đầy đủ hơn.
- **Sau Goal 3:** mới bắt đầu đẩy retention/phụ trợ như recap, widget, seasonal hook sâu hơn.

### Bảng Goal -> Feature Unlock theo từng tab/màn

| Tab/Màn | Goal 0: trước onboarding xong | Sau Goal 1 | Sau Goal 2 | Sau Goal 3 |
|---|---|---|---|---|
| Onboarding overlay | Hiện đầy đủ | Ẩn | Ẩn | Ẩn, chỉ còn replay |
| Garden | Chưa vào | Mở | Mở | Mở |
| Create | Chưa vào | Mở bản tối giản | Mở bản chuẩn | Mở đầy đủ |
| Atlas | Chưa vào | Mở bản preview | Mở core đầy đủ | Mở filter/seasonal detail |
| Timeline | Ẩn | Ẩn | Ẩn | Mở |
| Settings | Ẩn | Mở bản rút gọn | Mở thêm phần cơ bản | Mở gần đầy đủ |
| Share / Memory Card | Ẩn | Ẩn | Ẩn | Mở |
| Backup / Restore | Ẩn | Ẩn | Ẩn | Mở |
| Widgets / On This Day hook | Ẩn | Ẩn | Ẩn | Mở |
| AI Recap preview | Ẩn | Ẩn | Ẩn | Mở sau Goal 3, ưu tiên thấp |
| Season monetization / out-of-season upsell | Ẩn | Ẩn | Ẩn | Mở sau Goal 3, ưu tiên thấp |

### Cụ thể theo màn
- **Garden**
  - Sau Goal 1: chỉ hiện vườn, CTA Thêm kỷ niệm, starter quest, progress rất cơ bản, coach guide.
  - Sau Goal 2: hiện thêm milestone gần nhất, quick-capture entry, Atlas progress rõ hơn.
  - Sau Goal 3: hiện thêm backup reminder, share shortcut, seasonal hook sâu hơn, card retention phụ.
- **Create**
  - Sau Goal 1: chỉ hiện form tối giản gồm ảnh, 1 dòng mô tả/title, mood, category gợi ý.
  - Sau Goal 2: mở quick-capture thật sự, category rõ hơn, edit từ detail.
  - Sau Goal 3: mở tag đầy đủ, metadata/phần nâng cao, nháp dang dở.
- **Atlas**
  - Sau Goal 1: chỉ hiện preview vài ô đầu, progress tổng ngắn gọn, cây mới mở được highlight.
  - Sau Goal 2: mở grid đầy đủ, progress theo category, locked hint, catch animation.
  - Sau Goal 3: mở filter `all/unlocked/locked/category/season`, plant detail sâu hơn, seasonal badge rõ hơn.
- **Timeline**
  - Trước Goal 3: ẩn hoàn toàn.
  - Sau Goal 3: mở Month/Year, memory detail reopen, card scan nhanh; Life Journey sâu để sau.
- **Settings**
  - Sau Goal 1: chỉ hiện theme nhanh, language, hemisphere, replay onboarding.
  - Sau Goal 2: mở thêm reminder cơ bản, particle FX.
  - Sau Goal 3: mở backup/restore, storage info, widget section, about/feedback, danger zone.

### Quy tắc hiển thị
- Tab/màn chưa mở sẽ **ẩn hẳn**, không hiện icon khóa ở bottom nav.
- Feature phụ trong màn đã mở có thể ẩn hoàn toàn, không cần trạng thái `coming soon` ở MVP.
- Sau mỗi goal cần có 1 khoảnh khắc reward ngắn:
  - Goal 1 -> vào Garden
  - Goal 2 -> gợi xem Atlas / milestone
  - Goal 3 -> thông báo đã mở Timeline và các tính năng mới

## Bổ sung — Season System (4 mùa)
- **Design đầy đủ:** `.planning/SEASON_SYSTEM.md` (mô hình, mechanics, monetization, MVP cut, risks).
- **Spec sản phẩm:** đã sync vào `base/Memory Garden.md` (mục 9 + Garden System + Rewarded Ads + MVP scope).
- **Mockup:** dựng vào `data.js` / `app.js` / `base.css` — switcher + banner + particle (Garden),
  badge + seasonal progress (Atlas), "nở rộ mùa" + Out-of-season Seed (Plant detail). Mở mặc định mùa **Hạ** (2026-06).

## Bổ sung — Onboarding ("trải nghiệm gieo mầm")
- **Design đầy đủ:** `.planning/ONBOARDING.md`.
- **Quyết định UX chốt:** onboarding **chọn nhanh, không cần nhập**; mọi nhập chi tiết để sau ở màn Create.
- **Vai trò trong unlock system:** onboarding chỉ mở core loop, chưa đẩy hết feature.
- **Flow 5 bước (overlay):** Welcome (concept 5s) → Style (Cozy/Pixel) → Seed (chạm mood/chọn preset, app tự tạo memory mẫu) →
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
- **Áp dụng Progressive Unlock:** các add-on này không bung ra toàn bộ từ đầu; sẽ mở dần theo 3 goal đầu để giữ Garden sạch và tập trung.

## Bổ sung — Coach guide (highlight lần đầu vào Garden)

- **Vấn đề:** user vừa qua onboarding, đáp xuống Garden nhưng chưa biết flow (thêm kỷ niệm ở đâu, mục tiêu trồng cây là gì).
- **Giải pháp:** coachmark spotlight — khoét sáng 1 element + tooltip điều hướng (dots · Bỏ qua · Tiếp). 3 bước:
  1. `.plot.empty` → "Ô đất đang chờ" (vườn là gì, ô trống = chỗ gieo cây).
  2. `.navitem.fab` → "Thêm kỷ niệm" (chạm + để gieo hạt).
  3. `.ring-wrap` → "Mục tiêu khu vườn" (sưu tầm đủ loài, lấp đầy Atlas).
- **Trigger:** auto sau `endOnboarding(true)` lần đầu (`coach.seen` guard). Replay qua link **💡 Xem hướng dẫn** ở hint Garden (`coachReplay`).
- **Kỹ thuật:** overlay con của `.phone` (z-index 120); `paintCoach()` đo rect target, bù `transform: scale()` màn nhỏ; `scrollIntoView` target trong vùng cuộn; step thiếu target tự bỏ qua. Rời Garden → `go()` tự `endCoach()`.
- **Mockup:** `js/app.js` (section COACH MARKS + handleAct `coachNext/coachSkip/coachReplay` + delegation `#coach`), `css/base.css` (section COACH MARKS + `.hint .link`).
