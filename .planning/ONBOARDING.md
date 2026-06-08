# ONBOARDING — "Trải nghiệm gieo mầm"

## Mục tiêu
Người dùng hiểu concept **"game sưu tầm kỷ niệm"** trong **5 giây đầu**, rồi *tự tay*
gieo hạt đầu tiên và thấy nó nở — thay vì đọc hướng dẫn dùng công cụ. Kết thúc đáp
xuống tab **Garden** với cây đầu tiên đã có thật trong vườn.

Nguyên tắc: **local-first → không account, không đăng nhập**. Vào thẳng trải nghiệm.

## Flow — 5 bước (overlay phủ toàn phone)

| # | Bước | Nội dung | Mục đích |
|---|------|----------|----------|
| 0 | **Welcome** | Hero cây nảy mầm lặp (🌱→🌺) · "Mỗi kỷ niệm là một hạt giống. Mỗi trải nghiệm làm khu vườn lớn lên." · badge "🔒 Không cần tài khoản" | Concept trong 5 giây |
| 1 | **Style** | Chọn Cozy 🌸 / Pixel 🎮 — preview live, đổi theme tức thì | Cá nhân hóa cảm xúc ngay |
| 2 | **Seed** (interactive) | Chạm 1 trong 6 mood (☕🏖️🎉💞📖🌅) → tiêu đề prefilled "Bắt đầu hành trình tại Memory Garden" → nút **Lưu & gieo hạt** | Tự tay tạo memory đầu |
| 3 | **First Bloom** | Animation 🌰→🌱→🪴→🌸→🌺 + confetti → lộ reward: 🏆 First Memory + 🎁 +1 Rare Seed | Aha moment |
| 4 | **Tour** | 3 mini-card: 📖 Atlas (30+ loài), 🍂 4 mùa sống động, 📱 Widget "On This Day" | Retention hooks |
| → | **Finish** | `onbApplyFirstBloom()` → đáp xuống **Garden**, toast chào mừng | Landing có sức sống |

- **Skip**: link "Bỏ qua ›" ở bước 0/1/2/4 (không có ở bước bloom). Skip → vào thẳng Garden, KHÔNG gieo cây.
- **Replay**: nút 🚀 Onboarding trên toolbar + mục "Xem lại Onboarding" trong More.

## Payoff khi Finish (mutate data thật, guard `onboard.applied`)
- Mở khóa cây hiếm `p05` Aurora Bloom (Legendary) → Atlas completion +1.
- Unshift memory `m_onb` (mood + tiêu đề đã chọn, ngày 2026-06-08).
- Lấp ô trống cuối `GARDEN_PLOTS` bằng cây này, stage **Bloom**, gắn cờ `fresh` → highlight "Mới 🌟" trong vườn.

## Map sang funnel activation
`Install → First Memory (bước 2) → First Bloom (bước 3) → Catalog slot trống (bước 4 Atlas) → D1 (Widget hook bước 4)`

## Triển khai mockup
- `js/app.js` — section **ONBOARDING**: `onbPanel()` (5 bước), `renderOnboarding()`,
  `onbHeroCycle()`, `onbBloomPlay()`, `onbApplyFirstBloom()`, `start/endOnboarding()`.
  State: `onboard = { active, step, seedEmoji, seedCat, applied }`. Cases trong `handleAct`.
- `css/base.css` — section **ONBOARDING** + `.plot.fresh` + `.tool-btn`.
- `index.html` — nút `#onbReplay` trên toolbar.
- Theme-aware qua CSS vars; mở app là `onboard.active=true` → hiện overlay trước.

## Chưa làm (cho app Android thật, ngoài mockup)
- Gallery-seeded thật (EXIF + ML Kit) ở bước Seed.
- Coachmark on-screen trên Garden sau onboarding.
- Gợi ý add Widget bằng `requestPinAppWidget` (Glance) cuối flow.
- Persist "đã onboard" qua DataStore (mockup luôn replay).
