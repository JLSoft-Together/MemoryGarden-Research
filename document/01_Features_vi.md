# Memory Garden: Your Life Journey — Mô tả chức năng

> Memory Journal + Collection Game + Life Timeline — Android (Jetpack Compose).
> Core loop: **Memory → Collection → Garden → Progress → Retention**.

---

**Memory Garden** biến những kỷ niệm trong cuộc sống thành một khu vườn số đang sống và lớn lên. Mỗi kỷ niệm bạn lưu sẽ trồng một cây mới, mở khóa một bông hoa mới, làm khu vườn ngày càng phong phú — để kỷ niệm được nở hoa thay vì bị quên trong một danh sách.

Ứng dụng dùng cơ chế **mở tính năng dần theo tiến độ**: lúc mới vào chỉ hiện các chức năng cốt lõi, sau khi bạn hoàn thành vài goal đầu tiên thì các phần như Timeline, chia sẻ, nhắc sao lưu và lớp retention khác mới mở dần.

## Lộ trình mở tính năng

- **Goal 1** — Hoàn thành onboarding và thấy `First Bloom`
  - Mở: Garden, Create bản tối giản, Atlas preview, Settings rút gọn
  - Ẩn: Timeline, Share, Backup, Widgets, recap, seasonal monetization
- **Goal 2** — Tạo thêm 1 kỷ niệm thật sau onboarding
  - Mở thêm: Atlas đầy đủ, milestone cơ bản, quick-capture, reminder/particle cơ bản
- **Goal 3** — Hoàn thành `3 Memories Starter Quest`
  - Mở thêm: Timeline, Share / Memory Card, Backup & Restore, Widgets, Settings gần đầy đủ
- **Sau Goal 3**
  - Mở dần các lớp phụ như AI Recap preview, seasonal hook sâu hơn, các gợi ý retention nâng cao

## Quy tắc hiển thị

- Tab/màn chưa mở sẽ **ẩn hẳn**, không hiện icon khóa.
- Tính năng phụ trong màn đã mở cũng có thể bị ẩn hoàn toàn ở giai đoạn đầu để tránh quá tải.
- Sau mỗi goal, app sẽ có một khoảnh khắc reward ngắn để báo cho bạn biết đã mở thêm tính năng mới.

## Chức năng chính

1. **Quản lý kỷ niệm** — Tạo, sửa, xóa kỷ niệm. Thêm ảnh, mô tả, category, tag và **tâm trạng (mood)**. **Ghi nhanh (Quick-capture)** cho phép lưu 1 ảnh + 1 dòng trong vài giây.
2. **Hệ thống khu vườn** — Mỗi kỷ niệm tự động trồng một cây qua các giai đoạn: **Hạt giống → Nảy mầm → Cây → Nở hoa → Hoa hiếm**.
3. **Bộ sưu tập (Garden Atlas / Pokédex)** — Lưới tất cả loài cây với **số dex** (#001…), ô bóng mờ cho cây chưa mở, và **animation bắt cây** khi mở khóa loài mới. Theo dõi tiến độ theo từng category và tổng thể.
4. **Categories** — Phiêu lưu, Ăn uống, Mối quan hệ, Giải trí, Phát triển bản thân, Cột mốc cuộc đời.
5. **Dòng thời gian** — Xem kỷ niệm theo Năm, Tháng, hoặc toàn bộ **Hành trình cuộc đời**.
6. **Cột mốc** — Nhận huy hiệu (Kỷ niệm đầu tiên, 10 kỷ niệm, Chuyến đi đầu, Buổi hẹn đầu…).
7. **Widget** — Kỷ niệm gần nhất, Tiến độ khu vườn, và **Ngày này năm xưa**.
8. **Tùy biến khu vườn** — Theme, trang trí, bố cục.
9. **Hệ thống 4 mùa** — Xuân / Hạ / Thu / Đông theo lịch thực của thiết bị. Mùa chỉ cộng thêm bonus (không bao giờ chặn cây lớn): cây hợp mùa phát sáng, **+20% tỉ lệ hoa hiếm**, hoa đổi sắc theo mùa. Khu vườn đổi màu nền và hiệu ứng hạt (🌸/✨/🍂/❄️).
10. **Onboarding & Kích hoạt** — Onboarding **chọn nhanh, không cần nhập**: chạm mood hoặc preset kỷ niệm để gieo ký ức đầu tiên, **Đảm bảo nở hoa đầu tiên** (kỷ niệm đầu luôn nở hoa hiếm), và **Nhiệm vụ 3 kỷ niệm đầu**.
11. **Chia sẻ / Memory Card** — Xuất thẻ ảnh đẹp cho một kỷ niệm hoặc cả khu vườn để chia sẻ lên mạng xã hội.

## Quyền riêng tư & dữ liệu

- **Local-first** — toàn bộ dữ liệu nằm trên thiết bị (Room + DataStore + file cục bộ). Không cần tài khoản, không bắt buộc backend.
- **Sao lưu** — Xuất / Nhập file ZIP. **Nhắc sao lưu** khi đã lâu chưa backup. Tùy chọn xuất thủ công lên Google Drive cá nhân.
