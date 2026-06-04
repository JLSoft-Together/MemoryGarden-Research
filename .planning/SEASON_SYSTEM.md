# Design — Season System (4 mùa)

> **Product:** Memory Garden: Your Life Journey
> **Phạm vi:** Hệ thống 4 mùa ảnh hưởng tới phát triển cây + visual + collection.
> **Trạng thái:** Đã dựng vào mockup (`brainstorm/mockups/`). Spec dùng cho Android Compose thật.
> **Vai trò:** **Retention layer** (D7+ / comeback), KHÔNG phải activation. Không được làm hỏng aha-moment first-bloom.

---

## 1. Nguyên tắc cốt lõi

**ADDITIVE-ONLY — mùa đổi VỊ, không chặn TỐC.**

- Growth gắn **hành động** (tạo memory = cây lớn 1 stage), KHÔNG gắn thời gian thực.
- Mùa chỉ **cộng bonus** (glow, +rare%, biến thể bloom, cây giới hạn) — **cấm trừ** (freeze, chết, chặn nở).
- **First bloom miễn nhiễm mùa**: memory đầu luôn nở rare bất kể mùa → bảo toàn Activation + First Bloom Guarantee.

---

## 2. Mô hình mùa — chọn A (lịch thực)

| Mô hình | Mùa quyết định bởi | Quyết định |
|---|---|---|
| **A. Lịch thực** | Ngày thực tế thiết bị | ✅ **Chọn cho MVP** — lõi retention |
| B. Mùa của memory | `memory.date` | ⏳ Phase 2 — lớp narrative cho Timeline |
| C. Mùa in-game | Đồng hồ game riêng | ❌ Bỏ — tách rời cảm xúc đời thực |

**Lý do A:** feature mùa là retention play → cần gắn đời thực để có hook "tháng này vườn chuyển thu". B đẹp về kể chuyện nhưng vô hình ở session đầu → hoãn.

---

## 3. Mapping mùa

Bắc bán cầu, theo `LocalDate.getMonthValue()`:

| Mùa | Tháng | Emoji | Particle | Weather |
|---|---|---|---|---|
| Xuân | 3–5 | 🌸 | 🌸 | 🌦️ |
| Hạ | 6–8 | ☀️ | ✨ | ☀️ |
| Thu | 9–11 | 🍂 | 🍂 | 🍁 |
| Đông | 12, 1, 2 | ❄️ | ❄️ | 🌨️ |

- **Hemisphere:** suy từ locale/timezone thiết bị, default **Bắc**, cho toggle ở Settings (Nam bán cầu lệch 6 tháng).
- Local-first: hàm thuần từ `LocalDate.now()` — không backend.

---

## 4. Tác động lên growth (matrix)

| Trục | Nên — additive | Cấm — subtractive |
|---|---|---|
| Tốc độ | Cây hợp mùa: glow + ưu tiên (cảm giác bonus) | ❌ Đông làm chậm / đóng băng growth |
| Bloom | Biến thể bloom theo mùa (xem §5) | ❌ Sai mùa = không nở |
| Rarity | Category hợp mùa: **+20% cơ hội Rare bloom** | ❌ Khóa cứng rare sau mùa |
| Visual | Vườn đổi palette + particle + tint | — |
| Catalog | Cây seasonal-exclusive (slot mùa) | ❌ Khóa mốc 100% sau real-time wait |

---

## 5. Season ↔ Category affinity

Mỗi mùa "ưu ái" 2 category (→ +rare% + glow), và mỗi category có "mùa nở rộ" mặc định (→ badge + bloom variant).

| Mùa | Affinity (+rare) | Bloom variant | Bonus copy |
|---|---|---|---|
| Xuân | Relationship, Growth | sắc hồng phấn | Đâm chồi: cây lớn nhanh hơn · hoa Tình cảm & Phát triển nở rộ |
| Hạ | Adventure, Food | sắc vàng nắng | Nắng rực: Phiêu lưu & Ẩm thực +20% Rare bloom |
| Thu | Entertainment, Food | sắc cam đỏ | Mùa thu hoạch: bloom chuyển sắc cam đỏ · Giải trí +rare |
| Đông | Milestones, Growth | sắc trắng bạc | Tĩnh lặng: cây ấp ủ · mở khóa cây hiếm & Cột mốc mùa đông |

**Mùa nở rộ mặc định / category** (badge Atlas): Adventure→Hạ · Food→Thu · Relationship→Xuân · Entertainment→Thu · Growth→Xuân · Milestones→Đông.

---

## 6. Seasonal-exclusive collection

- Cây **chỉ mở khóa đúng mùa** — bộ sưu tập **riêng**, KHÔNG tính vào mốc 100% core.
- Lý do tách: completionist không bị time-gate (chờ đủ 4 mùa thật) trên catalog chính.
- 4 cây seed (mockup): Sakura Spirit (Xuân, legendary), Sunfire Lily (Hạ, epic), Maple Ember (Thu, epic), Frost Orchid (Đông, legendary).
- Trái mùa → **Out-of-season Seed** qua rewarded ad (mồi monetization khi FOMO cao).

---

## 7. Visual & UX

- **Season switcher** (Garden): 4 chip Xuân/Hạ/Thu/Đông. Production: auto theo lịch; switcher chỉ là demo-control (hoặc cho phép "xem trước" mùa khác, không đổi growth thật).
- **Season banner**: weather emoji + tên mùa + dòng bonus + badge "● đang diễn ra" nếu khớp lịch thực.
- **Particle overlay** trong vườn: 🌸/✨/🍂/❄️ rơi (pointer-events none, không chặn tap).
- **Tint phủ** vườn theo mùa (overlay, giữ nguyên `--garden-bg` của theme → không phá pixel grass).
- **Plot glow** `☀️+` cho cây hợp mùa (additive).
- **Atlas badge** mùa nở rộ góc ô + ribbon seasonal + dòng progress seasonal riêng.
- **Plant detail**: "Nở rộ mùa X · bloom [variant]"; seasonal trái mùa → nút Out-of-season Seed.

---

## 8. Monetization hooks

- **Rewarded ad — Out-of-season Seed**: mở cây seasonal trái mùa ngay. Đòn bẩy mạnh vì FOMO mùa.
- **Rewarded ad — Season Skip / Growth Boost**: tăng tốc cây hợp mùa (giữ additive).
- **IAP Theme Pack** theo mùa: tận dụng "Spring Meadow / Japanese Garden" sẵn có; bán seasonal pack (Sakura Set đã có trong Decorations).

---

## 9. Data model (field thêm)

Plant catalog:

```
season?: "spring"|"summer"|"autumn"|"winter"   // mùa nở rộ (override CAT_SEASON nếu set)
seasonal?: boolean                              // true = seasonal-exclusive (tách core completion)
```

Season định nghĩa: `id, name, months[], emoji, weather, particle, tint, affinity[], bonus, variant`.

Core completion loại trừ `seasonal:true`; seasonal đếm riêng (`seasonalUnlocked / seasonalTotal`).

---

## 10. Technical (Android, local-first)

- **Mùa hiện tại:** hàm thuần `seasonOf(LocalDate, hemisphere)` — không backend, không persist (derive mỗi lần).
- **Hemisphere flag:** DataStore (default Bắc).
- **Mùa của memory (Phase 2):** derive từ `memory.date` đã có — zero data mới.
- **Visual:** season → theme token (palette/tint) swap ở Compose; particle = overlay layer.
- **Growth engine:** giữ nguyên (theo hành động); mùa là **modifier** ở tầng tính bloom variant + rarity roll.
- **Schema:** thêm cột nullable `season`, `seasonal` vào plant table — không phá schema cũ.

---

## 11. MVP cut (thứ tự rủi ro thấp → cao)

1. **Ambient season visual** — palette + particle + banner đổi theo lịch thực. Rủi ro core loop = 0. ✅ MVP.
2. **Seasonal bloom variants** — cùng cây, bloom đổi sắc theo mùa. ✅ MVP.
3. **Seasonal-exclusive plants** (collection tách riêng) — hook FOMO + completion. ✅ MVP nếu kịp.
4. **Rewarded Out-of-season Seed** — monetization, sau khi seasonal collection có.
5. **Memory-date season tinting (lớp B)** + **seasonal event** (Sakura Week...). ⏳ Phase 2.

**KHÔNG vào MVP:** đồng hồ game riêng (C), growth-speed theo mùa, freeze/dormancy.

---

## 12. Risks + guards

| Rủi ro | Mức | Guard |
|---|---|---|
| Đông chặn first bloom → chết activation | 🔴 | First bloom miễn nhiễm mùa |
| Time-gate completion → ức chế completionist | 🟠 | Tách Seasonal Collection khỏi 100% core |
| Hemisphere sai cho Nam bán cầu | 🟡 | Derive locale/timezone, default Bắc, toggle Settings |
| Phức tạp hóa MVP, trễ ship | 🟠 | MVP chỉ ambient + variant; hoãn B + event |
| "Mùa làm chậm cây" = cảm giác phạt | 🔴 | Additive-only, không subtractive |

---

## 13. Trạng thái mockup (đã dựng)

- `data.js`: `SEASONS`, `CAT_SEASON`, `seasonById`/`plantSeason`, 4 cây seasonal (p31–34), `STATS` tách seasonal.
- `app.js`: `state.season` auto `new Date()`; switcher + banner + particle (Garden); badge + seasonal progress (Atlas); "nở rộ mùa" + Out-of-season ad (Plant detail).
- `base.css`: `.season-switch`, `.season-banner`, `.season-fx` + anim, `.plot.boost`, `.season-badge`/`.season-ribbon`.
- Verify: `node --check` pass · render smoke-test pass · hôm nay mở mặc định **Hạ**.

---

## 14. Open questions

- Bloom variant: đổi **màu/emoji thật** của cây theo mùa, hay chỉ copy "sắc X"? (đề xuất: đổi tint sprite, giữ emoji).
- Seasonal event (Sakura Week) có cần limited reward riêng, hay reuse cây seasonal?
- Switcher production: ẩn hẳn (auto-only) hay giữ "xem trước mùa" read-only?
