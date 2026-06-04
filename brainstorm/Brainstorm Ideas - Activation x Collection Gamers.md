# Brainstorm Ideas — Memory Garden

> **Product:** Memory Garden: Your Life Journey (Android / Jetpack Compose)
> **Discovery objective:** **Activation** — đưa user từ install → tạo memory đầu tiên → thấy cây nở (first bloom). Đây là khoảnh khắc "aha".
> **Target segment:** **Casual collection gamers** — người mê sưu tầm, hoàn thành progress. Driver chính: *unlock + completion*.
> **Phương pháp:** Product Trio ideation (Teresa Torres) — PM × Designer × Engineer, sau đó prioritize top 5.

---

## 1. Hiểu opportunity

**Bài toán activation:** User cài app vì tò mò "khu vườn ký ức", nhưng màn hình trống + form nhập liệu = friction. Nếu user không tạo nổi memory đầu và không thấy cây nở trong vài phút đầu, họ rời đi → kéo D1 xuống.

**Đòn bẩy của segment:** Collection gamers bị hút bởi **slot trống cần lấp đầy** (Zeigarnik effect), **catalog cần hoàn thành** (Pokédex psychology), và **phần thưởng unlock**. Activation strategy = biến hành động "tạo memory" thành nước đi đầu tiên trong một game sưu tầm hấp dẫn, thay vì một việc vặt journaling.

**Funnel cần tối ưu:**
`Install → Mở app → Tạo memory đầu (lấp slot) → Cây nở (unlock reward) → Thấy catalog còn nhiều slot trống (kéo quay lại)`

---

## 2. Ideation 3 góc nhìn

### 🧭 Product Manager (giá trị kinh doanh, chiến lược, tác động khách hàng)

| # | Idea | Mô tả |
|---|------|-------|
| PM-1 | **Garden Atlas (Pokédex sưu tầm)** | Onboarding mở ngay catalog 30-50 cây dạng lưới, hầu hết là slot khóa (silhouette). Đóng khung cả hành trình là "bộ sưu tập cần hoàn thành". |
| PM-2 | **First Bloom Guarantee** | Memory đầu tiên *luôn* nở ra cây đặc biệt/rare (bỏ RNG fail ở lần đầu) để aha moment đủ mạnh, không bị xịt. |
| PM-3 | **3-Memory Starter Quest** | Quest dẫn dắt: tạo 3 memory → unlock garden zone đầu tiên + milestone reward. Gói activation vào một mục tiêu rõ ràng. |
| PM-4 | **Completion-driven Rewarded Ads** | Đặt rewarded ad (Mystery Seed/Growth Boost) đúng lúc user vừa nở cây đầu — khi động lực sưu tầm cao nhất — để vừa activate vừa mồi monetization sớm. |
| PM-5 | **Daily "On This Day" comeback hook** | Sau bloom đầu, hứa hẹn slot mới mỗi ngày + nhắc kỷ niệm cùng ngày, tạo lý do quay lại để mở rộng bộ sưu tập. |

### 🎨 Product Designer (trải nghiệm, usability, delight)

| # | Idea | Mô tả |
|---|------|-------|
| DS-1 | **Blank-to-Bloom animation** | Animation juicy real-time seed → sprout → bloom ngay sau khi lưu memory đầu. Phản hồi thị giác = phần thưởng aha. |
| DS-2 | **Ghost slots trong garden** | Hiển thị silhouette cây khóa ngay trong lưới vườn từ lần mở đầu — slot trống "đòi" được lấp (Zeigarnik). |
| DS-3 | **One-tap memory capture** | Form memory đầu tối giản: chỉ cần 1 ảnh + category auto-detect. Mô tả/tags để optional sau, giảm friction blank-page. |
| DS-4 | **Garden-first home** | Mở app vào thẳng garden view (không phải list). Không gian phần thưởng trực quan là màn hình chính, củng cố cảm giác sưu tầm. |
| DS-5 | **Completion meter nổi bật** | Ring/thanh % hoàn thành theo category đặt trước mặt, nhảy số ngay khi cây đầu nở — cảm giác progress tức thì. |

### ⚙️ Software Engineer (khả năng kỹ thuật, tận dụng data, scalable)

| # | Idea | Mô tả |
|---|------|-------|
| EN-1 | **Gallery-seeded first memory** | Quét ảnh gần đây (có permission), gợi ý chuyển ảnh thành memory chỉ bằng 1 tap. Giải bài toán cold-start content, local-first. |
| EN-2 | **On-device auto-fill (EXIF + ML)** | Lấy date/geo từ EXIF + on-device image labeling (ML Kit) để auto-suggest category/tags. Memory đầu gần như zero-effort, không cần backend. |
| EN-3 | **Optimistic UI + instant Room write** | Ghi Room + recompose Compose tức thì để cây nở ngay, không có latency cảm nhận được. |
| EN-4 | **Seeded bloom engine** | RNG có seed: đảm bảo đa dạng + rare ở lần đầu, control được để A/B tune activation mà vẫn "cảm giác ngẫu nhiên". |
| EN-5 | **Activation funnel analytics** | Instrument event install → first-memory → first-bloom (Firebase). Đo activation rate + A/B các biến thể onboarding. |

---

## 3. Top 5 prioritized ideas

Tiêu chí: (a) khớp objective Activation, (b) tác động lên funnel, (c) feasibility/effort trong MVP local-first, (d) khác biệt với app journaling thường.

### ⭐ #1 — Gallery-Seeded First Memory *(EN-1 + EN-2 + DS-3)*
**Mô tả 1 câu:** User chọn 1 ảnh gần đây từ gallery, app auto-fill date/category bằng EXIF + on-device ML, một tap là có memory đầu → cây nở ngay.

- **Vì sao chọn:** Blank-page friction là rào cản activation **lớn nhất**. Đây là đòn bẩy mạnh nhất đẩy tỉ lệ install → first-memory. Tận dụng data sẵn có trên máy, đúng triết lý local-first, không cần backend.
- **Assumptions cần validate:**
  - User sẵn sàng cấp quyền truy cập ảnh ở first-run (không bỏ app vì permission).
  - On-device ML labeling đủ chính xác để gợi ý category hữu ích (không gây bực).
  - Một memory "seed sẵn" tạo cảm giác sở hữu thật, không bị coi là rác.

### ⭐ #2 — Garden Atlas (Pokédex sưu tầm) *(PM-1 + DS-2)*
**Mô tả 1 câu:** Onboarding mở ngay catalog 30-50 cây dạng lưới với phần lớn slot khóa silhouette, đóng khung toàn bộ trải nghiệm là một bộ sưu tập cần hoàn thành.

- **Vì sao chọn:** Đánh trực diện vào động lực cốt lõi của collection gamer (completion gap, Zeigarnik). Là *differentiator* so với app nhật ký thường. Chi phí thấp (UI + data tĩnh), tác động lớn lên cả activation lẫn retention.
- **Assumptions cần validate:**
  - Thấy nhiều slot khóa tạo tò mò/động lực, **không** gây cảm giác choáng ("còn quá nhiều").
  - Segment casual gamer phản ứng tốt với framing sưu tầm hơn framing journaling.
  - Số lượng/độ hiếm cây cân bằng để vừa hấp dẫn vừa khả thi mở khóa.

### ⭐ #3 — First Bloom Guarantee + Blank-to-Bloom Animation *(PM-2 + DS-1 + EN-3)*
**Mô tả 1 câu:** Memory đầu tiên luôn nở ra một cây đặc biệt qua animation real-time mượt, instant nhờ optimistic UI — chính là khoảnh khắc aha.

- **Vì sao chọn:** Activation không chỉ là *làm xong* hành động, mà là *cảm thấy được thưởng*. Đảm bảo lần đầu không xịt + animation juicy biến hành động đầu thành cảm xúc đáng nhớ → kéo D1. Effort vừa phải.
- **Assumptions cần validate:**
  - Animation tạo đủ "delight" để user muốn lặp lại (tạo memory tiếp).
  - Cây rare đảm bảo ở lần đầu không làm loãng giá trị rare về sau.
  - Performance animation ổn trên máy Android tầm trung/thấp (không jank).

### ⭐ #4 — 3-Memory Starter Quest *(PM-3 + DS-5)*
**Mô tả 1 câu:** Quest có hướng dẫn yêu cầu tạo 3 memory để unlock garden zone đầu tiên + milestone reward, với completion meter nhảy số mỗi bước.

- **Vì sao chọn:** Một bloom đơn lẻ có thể chưa đủ thành habit; quest 3 bước đẩy user qua "ngưỡng kích hoạt" để hình thành thói quen sớm. Gamified goal khớp tâm lý segment. Tận dụng được hệ Milestone đã có trong MVP.
- **Assumptions cần validate:**
  - 3 là con số đúng (không quá ít để vô nghĩa, không quá nhiều để bỏ cuộc).
  - Reward unlock zone đủ hấp dẫn để hoàn thành quest.
  - Quest cảm giác như khám phá, không như chore checklist.

### ⭐ #5 — Activation Funnel Analytics *(EN-5)*
**Mô tả 1 câu:** Instrument event install → first-memory → first-bloom → quest-complete để đo activation rate và A/B các biến thể onboarding.

- **Vì sao chọn:** Không phải feature cho user, nhưng là *enabler* cho cả 4 idea trên — không đo được thì không biết idea nào thật sự nâng activation. Effort thấp, ROI cao cho discovery. Nền tảng để quyết định data-driven.
- **Assumptions cần validate:**
  - Event schema bắt đúng các bước funnel quan trọng.
  - Volume MAU ban đầu (mục tiêu 1000+) đủ để A/B có ý nghĩa thống kê.
  - Analytics nhẹ, không vi phạm tinh thần local-first/privacy của app.

---

## 4. Khuyến nghị triển khai (thứ tự)

1. **#5 Analytics trước** — cài đo lường để có baseline activation rate.
2. **#1 Gallery-seeded + #3 First Bloom** — đánh vào friction lớn nhất + aha moment. Cặp đôi tạo cú hích activation mạnh nhất.
3. **#2 Garden Atlas** — framing sưu tầm, nuôi retention sau activation.
4. **#4 Starter Quest** — củng cố habit, đo bằng analytics từ bước 1.

> **Lưu ý discovery (Teresa Torres):** Đây là vòng đầu. Nếu experiment validate assumption fail (vd: user từ chối permission gallery hàng loạt), loop ngược lại idea pool — ví dụ chuyển sang manual one-tap capture (DS-3) làm fallback.
