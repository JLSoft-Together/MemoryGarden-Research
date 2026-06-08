# Implementation Checklist — Mockup / Compose

> Mục tiêu: checklist triển khai theo flow MVP đã chốt.
> Trạng thái hiện tại: **planning only, chưa code mockup**.
> Nguồn chốt: `.planning/UX_REVIEW_MVP.md` + `.planning/MVP_SCREEN_SPEC.md`
> Tài liệu bổ sung: `.planning/USER_FLOW_STATE_MACHINE.md` + `.planning/COPYWRITING_PACK.md`
> Backlog theo phase: `.planning/PHASE_TASK_BREAKDOWN.md`

---

## 1. Checklist tổng

### Quyết định đã khóa
- [x] Home sau onboarding là `Garden`
- [x] `Create` ưu tiên nhanh nhất, không ép chọn ảnh
- [x] Save xong quay về `Garden` để thấy reward
- [x] `Timeline` mở sau `3 Memories Starter Quest`
- [x] Tab khóa dùng kiểu `locked but informative`
- [x] Trước Goal 3, ưu tiên chỉ báo khóa cho `Timeline`

### Chưa làm
- [ ] Sync lại mockup spec theo flow mới
- [ ] Sync lại Compose spec theo flow mới
- [x] Chốt copy UX cho trạng thái khóa
- [x] Có tài liệu flow/state machine cho gating logic

---

## 2. Mockup Checklist

> Mục này chỉ là checklist implement sau này. Hiện tại **chưa code mockup**.

### Onboarding
- [ ] Rút flow về đúng `20-30 giây`
- [ ] Welcome phải truyền được concept trong `5 giây`
- [ ] Seed step không yêu cầu chọn ảnh
- [ ] First bloom guarantee rõ ràng
- [ ] Finish luôn đẩy về `Garden`

### Garden
- [ ] Hero chỉ còn 1 CTA chính: `Thêm kỷ niệm`
- [ ] Sau save có highlight plot mới
- [ ] Empty state rõ và ngắn
- [ ] Ẩn backup/share/retention card trước Goal 3
- [ ] Starter quest hiển thị gọn
- [ ] Atlas preview chỉ ở mức nhẹ

### Create
- [ ] Default là create cực nhanh
- [ ] Field tối thiểu: title/mô tả + mood + category gợi ý + ảnh tùy chọn
- [ ] Ẩn tag/metadata nâng cao trước Goal 3
- [ ] Save flow trả về Garden
- [ ] Có success bridge ngắn

### Atlas
- [ ] Goal 1 chỉ là preview
- [ ] Goal 2 mở progress tổng + category
- [ ] Locked hint ngắn, không spoil nhiều
- [ ] Có đường dẫn nhẹ từ Garden sang Atlas

### Timeline
- [ ] Trước Goal 3 chỉ hiện locked state
- [ ] Locked state có tip + progress mở khóa
- [ ] Sau Goal 3 mới mở Month / Year

### Settings
- [ ] Goal 1 chỉ hiện Theme / Language / Hemisphere / Replay onboarding
- [ ] Goal 2 mới cân nhắc reminder cơ bản
- [ ] Goal 3 mới mở Backup / danger zone / support

### Locked but informative
- [ ] Tab khóa có icon mờ hoặc entry mờ
- [ ] Chạm vào mở sheet/tip ngắn
- [ ] Tip có điều kiện mở + progress hiện tại
- [ ] Không khóa quá nhiều tab cùng lúc trên nav

---

## 3. Compose Checklist

### Navigation & gating
- [ ] Gate screen theo `Goal 0 -> 3`
- [ ] Garden là start destination sau onboarding
- [ ] Timeline destination hỗ trợ locked state
- [ ] Settings có bản lite / fuller theo goal

### State & flags
- [ ] Có flag `onboarded`
- [ ] Có flag/progress cho `starter quest`
- [ ] Có helper tính `currentGoal`
- [ ] Có state cho locked informative message

### Garden
- [ ] UI state tách rõ empty / activation / post-goal-3
- [ ] Success effect sau save trả về Garden
- [ ] Plot mới có state highlight

### Create
- [ ] Có `minimal mode` trước Goal 3
- [ ] Không bắt ảnh
- [ ] Save intent trả effect về Garden

### Atlas
- [ ] Preview mode cho Goal 1
- [ ] Core mode cho Goal 2
- [ ] Advanced filter chỉ mở sau Goal 3

### Timeline
- [ ] Locked state trước Goal 3
- [ ] Month / Year view sau Goal 3
- [ ] Life Journey degrade gracefully khi ít data

### Settings
- [ ] Lite mode ở Goal 1
- [ ] Basic+ ở Goal 2 nếu cần
- [ ] Fuller mode sau Goal 3

### UX copy
- [ ] Thống nhất copy button `Thêm kỷ niệm`
- [ ] Thống nhất copy locked tip
- [ ] Thống nhất copy reward sau unlock Timeline

---

## 4. Gợi ý thứ tự implement

1. Goal gating logic
2. Garden hero + success return
3. Create minimal flow
4. Atlas preview/core
5. Timeline locked state
6. Timeline unlocked MVP
7. Settings lite/fuller

---

## 5. Definition of Done cho flow này

- [ ] User hiểu app trong `5 giây`
- [ ] User tạo memory đầu mà không bị ép chọn ảnh
- [ ] Save xong luôn thấy reward ở Garden
- [ ] User biết `Timeline` tồn tại và biết cách mở
- [ ] Sau quest 3 memory, app tạo cảm giác `lên level`
