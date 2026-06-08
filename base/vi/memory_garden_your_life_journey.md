# Memory Garden: Your Life Journey

## Thông tin dự án

- **Tên ứng dụng:** Memory Garden: Your Life Journey
- **Thể loại:** Memory Journal + Collection Game + Life Timeline
- **Nền tảng:** Android (Jetpack Compose)

---

## Mục tiêu sản phẩm

Xây dựng ứng dụng giúp người dùng lưu giữ những khoảnh khắc đáng nhớ trong cuộc sống dưới hình thức một khu vườn số đang phát triển.

Mỗi kỷ niệm sẽ giúp mở khóa cây mới, hoa mới, vật phẩm mới và làm khu vườn ngày càng phong phú hơn.

Mục tiêu là tạo ra trải nghiệm:

> Memory → Collection → Garden → Progress → Retention

Thay vì:

> Memory → List → Quên

---

## Mô hình kiếm tiền

### IAA — Nguồn doanh thu chính

**Ad Formats:** App Open · Native Ads · Rewarded Ads

**Rewarded Ads:** Mystery Seed · Rare Plant · Growth Boost · Random Decoration

### IAP — Nguồn doanh thu bổ sung

**Lifetime Pro:** Unlimited Memories · Backup & Restore · Premium Widgets

**Theme Packs:** Japanese Garden · Fantasy Garden · Romantic Garden · Pixel Garden

**Decoration Packs:** Fountain · Lantern · Sakura Set · Love Set

---

## Backend

**Có cần backend không? Không.**

Ứng dụng được thiết kế theo hướng **Local-first** — dữ liệu lưu hoàn toàn trên thiết bị.

- **Storage:** Room Database · DataStore · Local Files
- **Backup:** Export ZIP · Import ZIP · **Backup reminder** (nhắc Export ZIP — DataStore `lastBackupAt` + WorkManager) · **Drive export thủ công** (tuỳ chọn, không auto cloud-sync)

Backend chỉ được cân nhắc ở các phase rất xa (Couple Garden hoặc Cloud Sync).

---

## Chức năng chính

### 1. Memory Management

Tạo Memory · Chỉnh sửa Memory · Xóa Memory · Thêm ảnh · Thêm mô tả · Thêm category · Thêm tags · **Mood (tâm trạng)** · **Quick-capture (ghi nhanh)**

### 2. Garden System

Tự động sinh cây từ Memory · Hệ thống Seed · Sprout · Plant · Bloom · Rare Bloom

### 3. Collection System

Danh sách cây đã mở khóa · Danh sách cây chưa mở khóa · Progress theo từng category · Overall Completion · **Atlas/Pokédex framing** (dex-number, slot silhouette, catch animation)

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

Ví dụ: First Memory · 10 Memories · 100 Memories · First Trip · First Date

### 7. Widgets

- **Recent Memory** — Hiển thị kỷ niệm gần nhất.
- **Garden Progress** — Hiển thị tiến độ khu vườn.
- **On This Day** — Hiển thị kỷ niệm cùng ngày trong quá khứ.

### 8. Garden Customization

Theme · Decoration · Layout

### 9. Onboarding & Activation

Onboarding "gieo mầm" (welcome → style → gieo kỷ niệm đầu → First Bloom → tour) · Gallery-seeded first memory (EXIF + ML Kit) · First Bloom Guarantee · 3-Memory Starter Quest · Quick-capture. Funnel: `Install → First Memory → First Bloom → Catalog slot trống → D1`.

### 10. Social Share / Memory Card

Xuất card ảnh cho 1 kỷ niệm hoặc cả khu vườn (palette theo mùa + watermark). Đòn bẩy virality + **ASO**. Render bitmap từ Compose → Share Sheet, không lưu server.

---

## MVP Scope (V1)

**Bắt buộc:** Memory CRUD + Mood · Category · Collection (Atlas/Pokédex) · Garden · 30-50 loại cây · Season glow · Onboarding & Activation (Gallery-seed + First Bloom + Starter Quest + Quick-capture) · Social Share · Backup reminder · Native Ads · Rewarded Ads

**Phase 2:** Seasonal-exclusive collection + Seasonal Event · Memory-date season · **AI Memory Recap** (tóm tắt tháng/năm)

**Chưa làm:** Cloud Sync · Account · Couple Garden · Family Garden · AI Features khác (generative/chatbot)

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

Sau khi release:

- D1 Retention > 35%
- D7 Retention > 12%
- Rewarded Ads Usage > 25%
- 1000+ MAU đầu tiên
- Validate được nhu cầu thị trường trước khi phát triển các phase tiếp theo
