# ONBOARDING — "Trải nghiệm gieo mầm"

## Mục tiêu
Người dùng hiểu concept **"game sưu tầm kỷ niệm"** trong **5 giây đầu**, rồi *chọn nhanh*
kỷ niệm đầu tiên và thấy nó nở — thay vì phải nhập form hay đọc hướng dẫn. Kết thúc đáp
xuống tab **Garden** với cây đầu tiên đã có thật trong vườn.

Nguyên tắc: **local-first → không account, không đăng nhập**. Vào thẳng trải nghiệm.
Nguyên tắc flow mới: onboarding chỉ mở **core loop**, chưa bung retention sớm; kết thúc phải đưa user về `Garden` với 1 CTA chính là `Thêm kỷ niệm`.

## Flow — 5 bước (overlay phủ toàn phone)

| # | Bước | Nội dung | Mục đích |
|---|------|----------|----------|
| 0 | **Welcome** | Hero cây nảy mầm lặp (🌱→🌺) · "Mỗi kỷ niệm là một hạt giống. Mỗi trải nghiệm làm khu vườn lớn lên." · badge "🔒 Không cần tài khoản" | Concept trong 5 giây |
| 1 | **Style** | Chọn Cozy 🌸 / Pixel 🎮 — preview live, đổi theme tức thì | Cá nhân hóa cảm xúc ngay |
| 2 | **Seed** (interactive) | Chạm 1 trong 6 mood (☕🏖️🎉💞📖🌅) hoặc 1 thẻ kỷ niệm gợi ý → app tự tạo memory mẫu → nút **Lưu & gieo hạt** | Tạo memory đầu thật nhanh, không cần nhập |
| 3 | **First Bloom** | Animation 🌰→🌱→🪴→🌸→🌺 + confetti → lộ reward: 🏆 First Memory + 🎁 +1 Rare Seed | Aha moment |
| 4 | **Tour** | 3 mini-card teaser rất ngắn: 📖 Atlas (30+ loài), 🍂 4 mùa sống động, 📱 Widget "On This Day" | Chỉ nhá retention, không thay vai Garden |
| → | **Finish** | `onbApplyFirstBloom()` → đáp xuống **Garden**, toast chào mừng | Landing có sức sống |

- **Skip**: link "Bỏ qua ›" ở bước 0/1/2/4 (không có ở bước bloom). Skip → vào thẳng Garden, KHÔNG gieo cây.
- **Replay**: nút 🚀 Onboarding trên toolbar + mục "Xem lại Onboarding" trong More.
- **Nguyên tắc UX**: onboarding **chọn nhanh, không cần nhập**. Mọi bước nhập tay chi tiết để sau onboarding ở màn Create.
- **Trạng thái sau finish**:
  - vào `Garden`
  - CTA hero là `Thêm kỷ niệm`
  - `Timeline` vẫn khóa theo kiểu `locked but informative`

## Payoff khi Finish (mutate data thật, guard `onboard.applied`)
- Mở khóa cây hiếm `p05` Aurora Bloom (Legendary) → Atlas completion +1.
- Unshift memory `m_onb` (mood hoặc preset đã chọn + tiêu đề mẫu tương ứng, ngày 2026-06-08).
- Lấp ô trống cuối `GARDEN_PLOTS` bằng cây này, stage **Bloom**, gắn cờ `fresh` → highlight "Mới 🌟" trong vườn.

## Map sang funnel activation
`Install → Quick Select First Memory (bước 2) → First Bloom (bước 3) → Catalog slot trống (bước 4 Atlas) → D1 (Widget hook bước 4)`

## Map sang progressive unlock
- Sau onboarding = đạt `Goal 1`
- User có:
  - Garden
  - Create bản tối giản
  - Atlas preview
  - Settings lite
- User chưa có:
  - Timeline nội dung thật
  - Share
  - Backup
  - Widget hook chủ động
  - Settings sâu

## Triển khai mockup
- `js/app.js` — section **ONBOARDING**: `onbPanel()` (5 bước), `renderOnboarding()`,
  `onbHeroCycle()`, `onbBloomPlay()`, `onbApplyFirstBloom()`, `start/endOnboarding()`.
  State: `onboard = { active, step, seedEmoji, seedCat, applied }`. Cases trong `handleAct`.
- `css/base.css` — section **ONBOARDING** + `.plot.fresh` + `.tool-btn`.
- `index.html` — nút `#onbReplay` trên toolbar.
- Theme-aware qua CSS vars; mở app là `onboard.active=true` → hiện overlay trước.

## Chưa làm (cho app Android thật, ngoài mockup)
- Bộ preset/thẻ gợi ý thông minh hơn ở bước Seed (theo mùa, mood, lịch sử gần đây).
- Coachmark on-screen trên Garden sau onboarding.
- Gợi ý add Widget bằng `requestPinAppWidget` (Glance) cuối flow.
- Persist "đã onboard" qua DataStore (mockup luôn replay).
