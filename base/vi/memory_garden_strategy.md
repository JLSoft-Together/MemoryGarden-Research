# Memory Garden: Your Life Journey — Product Strategy & Technical Design

## Đánh giá trước khi phát triển

Với góc nhìn của một indie developer Android sống bằng IAA + IAP, Memory Garden **KHÔNG** nên được phát triển như một ứng dụng Journal.

Nếu làm Journal:

- retention thấp
- user phải chủ động ghi chép
- khó kiếm tiền
- khó scale nội dung

Thay vào đó nên phát triển theo hướng:

### Memory Collection Game

Journal chỉ là dữ liệu đầu vào. Thứ user thực sự nhìn thấy là:

- Garden
- Collection
- Rare Plants
- Milestones
- Visual Progress

---

## North Star Metric

Không phải: **Số lượng memory**

Mà là: **Garden Completion %**

Ví dụ:

```
Garden Progress      42%
Adventure            56%
Relationship         21%
Growth               39%
```

Người dùng sẽ muốn hoàn thiện khu vườn.

---

## Product Model

**Layer 1 — Memory** (dữ liệu gốc)
Ví dụ: Đi Hạ Long · Xem concert · Hẹn hò

**Layer 2 — Collection** (từ memory sinh ra collection)
Ví dụ: `Memory: Đi biển → Unlock → Beach Flower`

**Layer 3 — Garden**
Collection xuất hiện trong garden.

**Layer 4 — Meta Progression** (layer giữ retention)
- Garden Level
- Garden Completion
- Rare Collection
- Season Collection

---

## Tư duy Local-first

App không cần backend. Mọi thứ lưu local.

**Room Database:** Memory · Collection · Plant · Garden Item · Milestone · Settings

**File Storage:** Ảnh · Video · Thumbnail

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

- **Garden** — Tab mặc định. Hiển thị khu vườn.
- **Memories** — Danh sách memory.
- **Collection** — Danh sách cây.
- **Timeline** — Timeline cuộc sống.
- **Profile** — Progress.

### Garden Screen

Đây là màn hình quan trọng nhất. User mở app phải thấy ngay **"Khu vườn của mình"**, không phải danh sách memory.

Garden gồm: Grass · Trees · Flowers · Decorations — tự động sinh dựa trên collection.

### Collection System

Ví dụ:

- Adventure Collection — 50 cây
- Food Collection — 40 cây
- Relationship Collection — 30 cây

User thấy: `Adventure 23 / 50 — 46%`. Đây là cơ chế **retention chính**.

### Milestone System

Ví dụ: First Memory · 10 Memories · 100 Memories · 1 Year Journey · 10 Trips · 50 Coffee Memories

Reward: Rare Seed · Theme · Decoration

### Timeline

Auto generated. Ví dụ:

```
2026 — Đi Hạ Long · Mua Macbook · Sinh nhật Lan
2027 — ...
```

Đây là tính năng **emotional retention**.

### Widget Strategy

- **Widget 1** — Recent Memory
- **Widget 2** — On This Day (rất mạnh, ví dụ "1 năm trước hôm nay")
- **Widget 3** — Garden Progress (42%)

---

## Monetization Model

### IAA (nguồn doanh thu chính)

- **App Open** — chỉ hiển thị: Cold Start
- **Native** — Collection · Timeline · Explore
- **Rewarded** — Mystery Seed · Growth Boost · Rare Plant

### IAP Model

Không nên bán subscription. Tệp user này không thích subscription.

- **Lifetime Pro** — 99k / 149k / 199k (Test A/B). Mở: Unlimited Memories · Backup · Export · Premium Widget
- **Theme Pack** — 39k / 59k
- **Decoration Pack** — 29k / 49k
- **Rare Garden Pack** — 49k / 99k

---

## ASO Strategy

**Không bán:** Journal · Diary · Memory Book

**Nên bán:** Memory Garden — Your Life Journey

**Keyword:** Memory · Life Journey · Timeline · Memories · Moments · Personal Story

---

## Development Roadmap

**Version 1.0** — Mục tiêu: lên store nhanh (2 tuần)
Memory · Collection · Garden · 30 cây · Native Ads · Rewarded Ads

**Version 1.5** — (1 tuần)
Widget · Milestone · Timeline

**Version 2.0**
100+ cây · Decoration · Theme. Bắt đầu bán IAP.

**Version 3.0**
Garden Animation · Seasonal Garden · Rare Collection

**Version 4.0**
Couple Garden. Tận dụng user từ Love Quote Story.

---

## Đánh giá theo mô hình JLSoft

**Ưu điểm:**
- Local-first
- Không API
- Không backend
- Không AI
- Dễ code Compose
- Dễ scale tính năng
- Dễ thêm IAP
- Có Rewarded Ads tự nhiên

**Rủi ro:**
- ASO khó hơn Countdown App
- User phải hiểu concept trong 5 giây đầu
- Garden phải thật đẹp

---

## Kết luận

Memory Garden không nên được xây như một ứng dụng ghi nhật ký. Nó nên được xây như một **game sưu tập kỷ niệm**, trong đó:

> Memory → Collection → Garden → Progress → Retention

Đây là hướng phù hợp nhất với một sản phẩm Android local-first, Jetpack Compose, kiếm tiền bằng IAA + IAP và có khả năng phát triển thành sản phẩm dài hạn.
