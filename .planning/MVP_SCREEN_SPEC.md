# MVP Screen-by-Screen Spec — Memory Garden

> Mục tiêu: bản spec ngắn cho dev/design bám vào khi implement MVP.
> Nguồn chốt flow: `.planning/UX_REVIEW_MVP.md`
> Trạng thái: planning only, **chưa code mockup**.
> Tài liệu đi kèm: `.planning/USER_FLOW_STATE_MACHINE.md` · `.planning/COPYWRITING_PACK.md`

---

## 1. Navigation tổng

- Home sau onboarding: `Garden`
- Bottom nav giai đoạn đầu:
  - `Garden`
  - `Create`
  - `Atlas`
  - `Timeline` dạng khóa có hướng dẫn
- `Settings` đi từ Garden app bar hoặc More entry đơn giản
- Triết lý unlock: `locked but informative`

### Quy tắc tab khóa
- Tab khóa vẫn có thể hiện icon mờ nếu cần báo trước giá trị.
- Chạm vào tab khóa mở tip/sheet ngắn:
  - lý do đang khóa
  - điều kiện mở
  - progress hiện tại
- Ưu tiên chỉ báo khóa cho `Timeline` trong giai đoạn đầu.

---

## 2. Goal 0 — Onboarding

### Mục tiêu
- User hiểu app trong `5 giây`
- Kết thúc trong `20-30 giây`

### Screen: Onboarding Overlay
- Nội dung:
  - Welcome: app là nơi gieo ký ức thành khu vườn
  - chọn style Cozy / Pixel
  - seed step cực nhanh
  - first bloom
  - tour rất ngắn
- Input user:
  - chọn style
  - chọn mood/preset
- Không yêu cầu:
  - ảnh
  - form dài
  - tag
  - metadata

### CTA chính
- `Bắt đầu gieo mầm`
- `Lưu & gieo hạt`

### Kết quả
- Tạo first memory mẫu
- First bloom guaranteed
- Điều hướng sang `Garden`

---

## 3. Goal 1 — Garden activation

### Screen: Garden
- Vai trò:
  - home chính
  - cho thấy reward vừa nhận
  - dẫn sang bước tiếp theo
- Thành phần được phép hiện:
  - khu vườn / plot
  - cây mới nở / ô đất trống
  - CTA `Thêm kỷ niệm`
  - starter quest cơ bản
  - Atlas preview nhẹ
  - coach guide / hint ngắn
- Không hiện sớm:
  - backup reminder
  - share shortcut
  - card retention dày
  - seasonal upsell

### CTA chính
- `Thêm kỷ niệm`

### Secondary CTA
- Không nên có secondary CTA mạnh tranh hero

### State quan trọng
- Empty state:
  - copy ngắn
  - minh họa
  - nút tạo kỷ niệm đầu tiên
- Success state:
  - highlight plot mới
  - cho thấy cây vừa trồng / vừa lớn

### Screen: Create Minimal
- Field:
  - 1 dòng mô tả hoặc title
  - mood
  - category gợi ý
  - ảnh tùy chọn
- Ẩn:
  - tag
  - metadata nâng cao
  - form dài
- CTA:
  - `Lưu kỷ niệm`
  - hoặc `Gieo hạt`

### Save flow
1. User lưu memory
2. Hiện success ngắn
3. Quay về `Garden`
4. Highlight cây vừa trồng
5. Gợi ý nhẹ tạo thêm memory

### Screen: Atlas Preview
- Chỉ hiện:
  - progress tổng rất ngắn
  - vài ô đầu tiên
  - highlight cây mới unlock
- Chưa hiện:
  - filter sâu
  - seasonal detail dày

### Screen: Timeline Locked
- Icon mờ hoặc entry khóa
- Tip copy mẫu:
  - `Mở sau khi hoàn thành 3 Memories Starter Quest`
  - `Bạn còn 2/3 kỷ niệm để mở`

### Screen: Settings Lite
- Chỉ có:
  - Theme
  - Language
  - Hemisphere
  - Replay onboarding

---

## 4. Goal 2 — Progress củng cố

### Screen: Garden Expanded Activation
- Thêm:
  - progress rõ hơn
  - milestone gần nhất
  - quick-capture entry
- Vẫn giữ:
  - 1 CTA chính là `Thêm kỷ niệm`

### Screen: Create Standard
- Mở thêm:
  - quick capture thực sự nhanh
  - category rõ hơn
  - edit từ detail
- Vẫn tránh:
  - form quá dài
  - bắt buộc ảnh

### Screen: Atlas Core
- Hiện:
  - progress tổng
  - progress theo category
  - locked hint ngắn
  - cây vừa mở được highlight
- CTA phụ hợp lý:
  - `Xem Atlas`

### Screen: Timeline Locked Progress
- Vẫn khóa
- Tip nên có progress chính xác:
  - `2/3 kỷ niệm để mở Timeline`

### Screen: Settings Basic+
- Có thể thêm:
  - reminder cơ bản
  - particle FX
- Nhưng không đẩy mạnh lúc này

---

## 5. Goal 3 — Unlock retention

### Unlock reward
- Trigger: hoàn thành `3 Memories Starter Quest`
- Reward state cần rõ:
  - `Timeline đã mở`
  - có thể xem lại hành trình

### Screen: Timeline MVP
- Mode:
  - Month
  - Year
- Cho phép:
  - scan nhanh card
  - mở lại memory detail
- Card tối thiểu:
  - ảnh
  - 1 dòng title/mô tả
  - ngày
  - mood/category nhỏ
- Empty state rõ cho tháng/năm chưa có data
- `Life Journey` nếu chưa đủ data thì chỉ hiển thị bản đơn giản

### Screen: Garden Post-Goal-3
- Mở thêm card phụ:
  - backup reminder
  - share shortcut
  - seasonal hook nhẹ
- Không được cướp hero khỏi CTA chính

### Screen: Atlas Advanced
- Có thể mở:
  - filter all / unlocked / locked / category / season
  - detail sâu hơn

### Screen: Settings Fuller
- Mở thêm:
  - Backup & Restore
  - storage info
  - about / feedback
  - danger zone

### Screen: Share / Backup
- Bắt đầu được giới thiệu sau Goal 3

---

## 6. Luồng chuẩn cần dev giữ

1. Onboarding cực ngắn
2. Sang Garden
3. `Thêm kỷ niệm`
4. Create siêu nhanh
5. Save
6. Quay về Garden thấy reward
7. Atlas mở dần theo tiến độ
8. Quest đủ 3 memory
9. Mở Timeline và lớp retention tiếp theo

---

## 7. Copy gợi ý

- `Mỗi kỷ niệm là một hạt giống`
- `Thêm kỷ niệm`
- `Lưu kỷ niệm`
- `Gieo hạt`
- `Timeline sẽ mở sau khi hoàn thành 3 Memories Starter Quest`
- `Bạn còn {x}/3 kỷ niệm để mở`
- `Tiếp tục gieo thêm ký ức để mở hành trình của bạn`
