# UX Review MVP - Memory Garden

> Mục tiêu: review chi tiết 5 màn hình chính theo góc nhìn UX/Product để chốt MVP.
> Phạm vi: Garden / Create / Atlas / Timeline / Settings.
> Cách đọc: mỗi màn gồm 4 phần - vai trò, điểm tốt, vấn đề UX, ưu tiên Must / Should / Nice-to-have.

---

## Tổng quan

### Nhận định nhanh
- Sản phẩm có core loop tốt: `Create Memory -> Garden grow -> Atlas unlock -> Timeline revisit -> quay lại Create`.
- Phần game hóa và cảm xúc đã rõ, nhưng nguy cơ lớn nhất của MVP là **nhiều lớp giá trị xuất hiện cùng lúc**.
- Mục tiêu UX của MVP nên là:
  - user hiểu app trong 5 giây
  - tạo được kỷ niệm đầu tiên trong 30-60 giây
  - thấy kết quả ngay lập tức
  - biết bước tiếp theo mà không cần nghĩ

### Nguyên tắc chốt MVP
- **Một màn - một mục tiêu chính**: mỗi màn chỉ nên có 1 CTA ưu tiên.
- **Reward sớm, setup muộn**: thưởng user bằng bloom/unlock trước, custom/settings/backups để sau.
- **Empty state phải đẩy đường**: nếu user chưa có đủ dữ liệu, màn hình vẫn phải đẩy được hành động tiếp theo.
- **Retention không được phá activation**: season, widget, backup, monetization chỉ nên mở dần.
- **Progressive unlock**: khi user chưa hoàn thành 3 goal đầu, app nên ẩn bớt feature và mở dần như game lên level.

### Đề xuất progressive unlock
- **Goal 1**: hoàn thành onboarding và thấy first bloom.
- **Goal 2**: tạo thêm 1 memory thật sau onboarding.
- **Goal 3**: hoàn thành `3 Memories Starter Quest`.
- **Trước goal 3**: ưu tiên chỉ cho user thấy Garden, Create, tiến độ cơ bản, Atlas tối thiểu và milestone gần.
- **Sau goal 3**: mới mở dần Timeline, Share, Backup reminder, widget hook, recap preview, setting sâu hơn.

### Bảng unlock ngắn

| Tab/Màn | Sau Goal 1 | Sau Goal 2 | Sau Goal 3 |
|---|---|---|---|
| Garden | Mở | Mở | Mở thêm card phụ |
| Create | Bản tối giản | Bản chuẩn | Bản đầy đủ |
| Atlas | Preview | Core đầy đủ | Filter/seasonal detail |
| Timeline | Ẩn | Ẩn | Mở |
| Settings | Bản rút gọn | Mở thêm phần cơ bản | Gần đầy đủ |
| Share / Backup / Widgets | Ẩn | Ẩn | Mở |

---

## 1. Garden

### Vai trò
- Đây là màn "home" và là nơi tạo cảm xúc mạnh nhất.
- Garden phải trả lời ngay 3 câu hỏi:
  - tôi đang có gì
  - tôi vừa tiến bộ gì
  - tôi nên làm gì tiếp

### Điểm tốt
- Hình ảnh vườn lớn dần theo kỷ niệm là metaphor rất mạnh, dễ yêu và dễ nhớ.
- Season banner + ambient effect tăng "life" cho app mà vẫn đúng hướng additive-only.
- Coach guide sau onboarding là hướng đúng, giúp user không bị rối khi đáp xuống màn chính.
- Quest 3-memory và quick-capture hợp với vai trò activation.

### Vấn đề UX
- Garden hiện đang ôm quá nhiều vai trò: home, progress, season demo, quest, backup reminder, share, coach.
- Nếu quá nhiều badge/banner/card cùng lúc, user sẽ không biết nên nhìn vào đâu.
- Chưa thấy "next best action" được ưu tiên hóa rõ ràng sau mỗi lần tạo memory.
- Giá trị của ô đất trong vườn rất đẹp, nhưng nếu plot quá nhỏ hoặc quá dày thì user có thể không nhận ra cây mới vừa được trồng.
- Nếu không có cơ chế unlock dần, Garden sẽ là nơi quá tải đầu tiên.

### Must
- Luôn có 1 CTA chính rõ ràng: `Thêm kỷ niệm`.
- Sau khi tạo memory, Garden phải highlight kết quả ngay:
  - cây mới ở đâu
  - cây vừa lên stage nào
  - mở thêm gì trong Atlas
- Empty state Garden cần cực rõ:
  - copy ngắn
  - hình minh họa
  - 1 nút tạo kỷ niệm đầu tiên
- Backup reminder, season tip, starter quest không được tranh nhau vị trí hero.
- Khi chưa đủ 3 goal, ẩn các card phụ như backup/share/season upsell để giữ màn sạch.
- Nếu có nhiều card, chỉ 1 card được ở trên cùng theo thứ tự ưu tiên:
  - chưa có memory -> tạo kỷ niệm đầu tiên
  - 1-2 memory -> quest 3 memories
  - đã sử dụng một thời gian -> backup reminder / seasonal hook

### Should
- Có mini-progress luôn nhìn thấy:
  - số memory
  - số ô Atlas đã mở
  - milestone gần nhất
- Có animation nhẹ cho plot mới hoặc plot vừa lớn, nhưng phải nhanh và không cần user chờ.
- Cho user chạm vào cây mới để mở detail ngay từ toast/success state.
- Garden hint nên thay đổi theo state:
  - chưa có cây
  - đã có cây đầu tiên
  - sắp đạt milestone

### Nice-to-have
- Cho phép sắp xếp / đổi layout vườn theo style hoặc mood.
- Có "memory of the day" card trên Garden.
- Có ambient âm thanh nhẹ theo mùa / theme.

---

## 2. Create

### Vai trò
- Đây là cửa vào của core loop.
- Nếu Create chậm hoặc đòi hỏi nhiều nhập liệu, user sẽ rớt trước khi thấy giá trị.

### Điểm tốt
- Đã có quick-capture, mood, image, category, tag.
- Ý tưởng auto-fill ngày/địa điểm từ ảnh trong onboarding rất hợp lý, nếu làm thật sẽ giảm friction mạnh.
- Mood là input gọn, tạo cảm xúc ngay lập tức và hỗ trợ recap/timeline sau này.

### Vấn đề UX
- Hiện tại mô tả giữa plan và document chưa thống nhất:
  - onboarding plan nghiêng về mood-first
  - document nghiêng về gallery-first
- Nếu Create yêu cầu quá nhiều field ngay lần đầu, user sẽ mất nhiệt.
- Category/tag nếu bắt user nghĩ sớm quá sẽ làm flow "viết kỷ niệm" thành flow "điền form".
- Chưa rõ phần success state sau khi save sẽ đưa user đi đâu.

### Must
- Chốt 1 flow tạo memory đầu tiên cho MVP:
  - ưu tiên `gallery-first nếu có ảnh`, fallback `quick memory nếu không có ảnh`
- Với user mới, Create chỉ hiện bản tối giản; field nâng cao mở sau khi qua 3 goal đầu.
- Form mặc định phải ngắn:
  - ảnh
  - 1 dòng mô tả / title
  - mood
  - category gợi ý, không bắt buộc tinh chỉnh ngay
- Nút save phải dễ thấy, wording cảm xúc hơn nếu hợp:
  - `Lưu kỷ niệm`
  - hoặc `Gieo hạt`
- Sau khi save phải có success bridge rõ:
  - xem cây vừa trồng
  - xem loài cây vừa mở
  - tiếp tục tạo thêm / quay về Garden

### Should
- Tự động đề xuất category từ ảnh, text hoặc lịch sử chọn.
- Lưu nháp đang dang dở nếu user thoát ngang.
- Có chế độ `Quick capture` thực sự 1-2 thao tác, không phải bản rút gọn của form đầy đủ.
- Edit / delete phải dễ tìm từ memory detail, không đặt trong flow create chính.

### Nice-to-have
- Voice note / audio snippet.
- AI gợi ý title/caption.
- Scan album để gợi ý "bạn có muốn lưu kỷ niệm này không?"

---

## 3. Atlas

### Vai trò
- Đây là màn "sưu tầm" và là động lực quay lại app.
- Atlas phải biến tiến độ trừu tượng thành mục tiêu cụ thể.

### Điểm tốt
- Dex number, silhouette, category progress, catch animation đều đúng chất collectible.
- Tách seasonal collection khỏi 100% core là quyết định rất đúng.
- Atlas rất hợp để đóng vai trò "mục tiêu tiếp theo" sau Garden.

### Vấn đề UX
- Nếu Atlas quá đẹp nhưng không chỉ ra cách mở thêm cây, user sẽ xem xong rồi thoát.
- Seasonal badge, rarity, category, dex, silhouette nếu đặt cùng lúc có thể bị rối thông tin.
- Chưa rõ logic "tại sao tôi mở cây này" được giải thích đến mức nào.

### Must
- Mỗi item cần trả lời rõ:
  - đã mở hay chưa
  - thuộc category nào
  - còn thiếu bao nhiêu để hoàn thành category
- Trước goal 3, Atlas có thể chỉ hiện progress cốt lõi; filter sâu và seasonal detail mở sau.
- Ô locked cần có hint ngắn, không cần spoil quá nhiều:
  - ví dụ `Lưu thêm kỷ niệm Adventure để gặp loài này`
- Atlas phải có progress tổng và progress theo category để tạo mục tiêu ngắn.
- Sau khi mở cây mới, có đường link rõ từ Garden / success state sang Atlas.

### Should
- Có filter cơ bản:
  - all
  - unlocked
  - locked
  - theo category
  - theo mùa
- Plant detail nên có giải thích gần:
  - mùa nở rộ
  - rarity
  - đã gặp trong kỷ niệm nào
- Catch animation ngắn, đã, nhưng bỏ qua nhanh được.

### Nice-to-have
- Có "wishlist" hoặc pin category muốn hoàn thành tiếp.
- Có showcase các cây hiếm vừa mở trong tuần / tháng.
- Có social share card riêng cho Atlas progress.

---

## 4. Timeline

### Vai trò
- Đây là màn giữ giá trị "journal" và giúp app không chỉ là game.
- Timeline phải làm user muốn xem lại cuộc sống, không chỉ check progress.

### Điểm tốt
- 3 mode `Năm / Tháng / Hành trình cuộc đời` là bộ khung tốt.
- Mood tracker, recap, milestone nếu gắn vào Timeline sẽ rất hợp.
- "On This Day" + widget tăng khả năng quay lại từ nhắc nhở nhỏ nhưng đều.

### Vấn đề UX
- Timeline rất dễ thành màn danh sách khô khan nếu thiếu narrative.
- "Life Journey" nếu không được chia cụm rõ ràng sẽ thành dài, khó quét.
- Chưa rõ user có thể tìm lại memory cũ theo mood/người/nơi chốn nhanh đến đâu.
- AI recap đang ở preview, nên cẩn thận để user không kỳ vọng tính năng thật ở MVP.

### Must
- Timeline MVP cần ưu tiên retrieval để:
  - xem theo tháng
  - xem theo năm
  - mở lại memory detail
- Timeline không nên mở quá sớm; nên unlock sau khi user đã có đủ dữ liệu cơ bản từ 3 goal đầu.
- Memory card trong Timeline phải dễ scan nhanh:
  - ảnh
  - tiêu đề / 1 dòng
  - ngày
  - mood / category nhỏ
- Có empty state tốt cho tháng / năm không có memory.
- "Life Journey" nếu chưa đủ data thì nên đơn giản:
  - chỉ hiện milestone + kỷ niệm nổi bật
  - không ép dùng layout quá tham vọng

### Should
- Có filter nhanh:
  - mood
  - category
  - year
- Có section `On This Day` hoặc `Kỷ niệm gần đây`.
- Có recap đơn giản rule-based:
  - tháng này nhiều kỷ niệm Adventure nhất
  - mood nổi bật là vui / bình yên

### Nice-to-have
- Bản đồ địa điểm của memory.
- Story mode / slideshow theo tháng.
- AI recap sinh động hơn khi sang Phase 2.

---

## 5. Settings

### Vai trò
- Settings là màn support, không phải nơi bán giá trị lần đầu.
- Màn này phải tạo cảm giác an tâm: dữ liệu an toàn, tùy chọn rõ, không cần vào thường xuyên.

### Điểm tốt
- Nhóm setting chia 5 cụm hợp lý.
- Có hemisphere, particle FX, lang, reminder, backup là đúng nhu cầu thực.
- Local-first + export/import ZIP là điểm mạnh về trust.

### Vấn đề UX
- Settings hiện đang chứa nhiều việc có "tầm quan trọng hệ thống" rất khác nhau:
  - theme/style
  - backup
  - paid/pro
  - xóa dữ liệu
- Nếu không tách ưu tiên, user mới vào có thể thấy màn này nặng nề.
- Pro upsell nếu đặt quá sớm trong Settings dễ tạo cảm giác bán hàng trước khi user thấy giá trị.

### Must
- Ưu tiên các mục liên quan đến trust và vận hành:
  - Backup & Restore
  - Notification reminder
  - Language
  - Hemisphere
- Nhưng với user mới, chỉ nên lộ setting cơ bản; các mục sâu hơn có thể mở dần sau 3 goal đầu.
- `Delete all data` phải đặt riêng trong danger zone, copy rất rõ.
- Backup flow phải dễ hiểu bằng ngôn ngữ user-level, không dùng từ quá kỹ thuật.
- Settings không nên là nơi duy nhất để đổi theme nếu theme là một phần cảm xúc cốt lõi; cần có cách đổi nhanh ở onboarding/Garden.

### Should
- Hiện thông tin ngắn gọn:
  - lần backup cuối
  - dung lượng đã dùng
  - reminder đang bật hay tắt
- Restore purchase / Pro nên để sau khi user đã hiểu giá trị ứng dụng.
- Có trang `About / Feedback` gọn, để user phản hồi nhanh.

### Nice-to-have
- Tùy chọn icon app theo mùa / theme.
- Export hình ảnh share card mặc định.
- Diagnostic mode / data health check cho user nâng cao.

---

## Ưu tiên hóa MVP

## Must
- Garden có 1 CTA chính và success bridge rõ sau khi tạo memory.
- Create flow ngắn, thống nhất, friction thấp; save xong thấy reward ngay.
- Atlas có progress rõ, locked hint rõ, link được từ Garden.
- Timeline ưu tiên retrieval cơ bản và mở lại memory detail tốt.
- Settings ưu tiên backup, reminder, ngôn ngữ, hemisphere, danger zone rõ ràng.
- Giảm số lượng thông tin xuất hiện cùng lúc ở Garden và onboarding để bảo toàn activation.
- Có cơ chế **ẩn bớt và mở dần feature trước/sau 3 goal đầu**.

## Should
- Thêm filter cơ bản cho Atlas và Timeline.
- Thêm mini-progress / next milestone trên Garden.
- Tự động đề xuất category / metadata trong Create.
- Rule-based recap và `On This Day` cho retention nhẹ.
- Hiện status backup cuối và progress tổng rõ hơn.

## Nice-to-have
- AI recap thực sự.
- Social share nâng cao theo Garden/Atlas.
- Audio, voice, slideshow, map, app icon theme.
- Seasonal monetization sau khi loop cốt lõi đã ổn.

---

## Đề xuất chốt scope MVP

### Nên ship trong MVP
- Onboarding gọn + first bloom guarantee
- Garden home
- Create memory + quick capture
- Atlas progress core
- Timeline month/year cơ bản
- Milestone cơ bản
- Backup local ZIP
- Theme Cozy/Pixel
- Season visual nhẹ + season bonus đơn giản
- Progressive unlock theo 3 goal đầu

### Nên đẩy sau MVP
- AI recap
- Seasonal rewarded ad phức tạp
- Share card quá nhiều biến thể
- Timeline life-journey tham vọng
- Tùy biến layout vườn nặng

---

## Kết luận

- Nếu chỉ được tối ưu 1 điểm, hãy tối ưu **Create -> Reward -> Next step**.
- Nếu chỉ được cắt 1 nhóm feature, hãy cắt bớt các lớp retention/phụ trợ xuất hiện quá sớm trên Garden.
- MVP sẽ mạnh nhất khi user thấy:
  - tạo kỷ niệm rất dễ
  - khu vườn lớn lên ngay
  - bộ sưu tập đang mở ra
  - dữ liệu của mình an toàn và riêng tư

---

## Flow MVP Cuối Cùng Đã Chốt

> Ngày chốt: 2026-06-08
> Hướng chốt: `locked but informative` cho feature/tab chưa mở.

### Nguyên tắc điều hướng
- User phải hiểu app trong `5 giây`.
- Onboarding giữ trong khoảng `20-30 giây`.
- Garden luôn là home sau onboarding.
- Garden chỉ có `1 CTA chính`: `Thêm kỷ niệm`.
- Create ưu tiên cách nhanh nhất, **không bắt chọn ảnh**.
- Save xong luôn ưu tiên đưa user về Garden để thấy reward ngay.
- Tab chưa mở không ẩn hoàn toàn:
  - vẫn hiện icon mờ nếu cần báo trước giá trị
  - chạm vào hiện tip ngắn
  - có progress kiểu `2/3 kỷ niệm để mở`
- Trước Goal 3, chỉ nên báo khóa cho `Timeline`; không nên làm bottom nav quá nhiều tab mờ.

### Goal 0 - Trước khi hoàn thành onboarding

#### Mục tiêu UX
- Hiểu concept cực nhanh: lưu kỷ niệm sẽ làm khu vườn nở ra.
- Không giới thiệu quá nhiều hệ thống phụ.

#### User thấy gì
- Onboarding ngắn:
  - Welcome
  - chọn style Cozy / Pixel
  - gieo seed mẫu thật nhanh
  - thấy first bloom
  - tour cực ngắn, không đào sâu

#### CTA chính
- `Bắt đầu gieo mầm`

#### Chưa mở / chưa nhấn mạnh
- Timeline
- Share
- Backup
- Widget
- AI recap
- Settings sâu

### Goal 1 - Xong onboarding, đã thấy first bloom

#### Mục tiêu UX
- Đưa user vào core loop thật rõ.
- User biết bước tiếp theo mà không cần nghĩ.

#### User thấy gì
- Vào `Garden` ngay.
- Garden chỉ ưu tiên:
  - khu vườn
  - cây vừa nở / ô đất đang chờ
  - `Thêm kỷ niệm`
  - starter quest cơ bản
  - Atlas preview rất nhẹ
- `Create` bản tối giản:
  - 1 dòng mô tả / title
  - mood
  - category gợi ý
  - ảnh là tùy chọn, không ép
- `Settings` bản rút gọn:
  - Theme
  - Language
  - Hemisphere
  - Replay onboarding

#### CTA chính
- `Thêm kỷ niệm`

#### Success flow sau khi save
1. Save memory
2. Hiện success ngắn
3. Quay về Garden
4. Highlight cây vừa trồng / vừa lớn
5. Gợi ý nhẹ: `Tiếp tục thêm kỷ niệm`

#### Tab/feature trạng thái
- Garden: mở
- Create: mở bản tối giản
- Atlas: mở preview
- Timeline: khóa, có tip unlock
- Settings: mở rút gọn
- Share / Backup / Widget / AI recap: chưa hiện

#### Tip cho tab khóa
- Copy ngắn:
  - `Timeline sẽ mở sau khi hoàn thành 3 Memories Starter Quest`
  - `Bạn còn 2/3 kỷ niệm để mở`

### Goal 2 - Tạo thêm 1 memory thật sau onboarding

#### Mục tiêu UX
- Củng cố cảm giác tiến bộ.
- Cho user thấy app không chỉ có 1 cây mà là một bộ sưu tập đang mở.

#### User thấy gì
- Garden vẫn là trung tâm, thêm:
  - milestone gần nhất
  - progress rõ hơn
  - quick-capture entry
- Atlas mở core rõ hơn:
  - progress tổng
  - progress theo category
  - locked hint ngắn
  - highlight cây mới mở
- Create mở thêm chất lượng sử dụng:
  - quick-capture thực sự nhanh
  - category rõ hơn
  - edit từ detail nếu cần

#### CTA chính
- Ở Garden: `Thêm kỷ niệm`
- CTA phụ: `Xem Atlas`

#### Success flow sau khi save
1. Save memory
2. Quay về Garden thấy cây mới / cây lớn hơn
3. Nếu có unlock mới, hiện gợi ý phụ sang Atlas

#### Tab/feature trạng thái
- Garden: mở đầy đủ phần activation
- Create: mở bản chuẩn
- Atlas: mở core đầy đủ
- Timeline: vẫn khóa, tiếp tục có tip unlock
- Settings: có thể thêm reminder cơ bản nếu cần, nhưng chưa ưu tiên đẩy mạnh
- Share / Backup / Widget / AI recap: chưa hiện

### Goal 3 - Hoàn thành 3 Memories Starter Quest

#### Mục tiêu UX
- Tạo cảm giác lên level.
- Bắt đầu mở lớp retention sau khi core loop đã hiểu.

#### User thấy gì
- Reward unlock rõ ràng:
  - `Bạn đã mở Timeline`
  - có thể kèm `mở thêm tính năng xem lại hành trình`
- Garden mở thêm card phụ nhưng không tranh hero:
  - backup reminder
  - share shortcut
  - seasonal hook nhẹ
- Timeline mở bản MVP:
  - Month
  - Year
  - mở lại memory detail
  - card scan nhanh
- Atlas mở filter sâu hơn nếu cần
- Settings mở gần đầy đủ hơn:
  - Backup / Restore
  - storage info
  - about / feedback
  - danger zone rõ ràng

#### CTA chính
- `Xem Timeline`
hoặc quay lại `Thêm kỷ niệm` nếu user bỏ qua.

#### Success unlock flow
1. User hoàn thành quest thứ 3
2. Hiện reward state / toast / sheet
3. Giới thiệu `Timeline đã mở`
4. Cho chọn:
  - `Xem Timeline`
  - `Quay về Garden`

#### Tab/feature trạng thái
- Garden: mở thêm card phụ
- Create: mở đầy đủ hơn
- Atlas: mở filter / detail sâu hơn
- Timeline: mở
- Settings: mở gần đầy đủ
- Share / Backup: bắt đầu mở
- Widget / AI recap / seasonal monetization: có thể giới thiệu sau Goal 3, ưu tiên thấp

### Tóm tắt flow điều hướng cuối cùng
1. Onboarding ngắn -> hiểu concept -> first bloom
2. Rơi xuống Garden -> thấy ngay CTA `Thêm kỷ niệm`
3. Create siêu nhanh -> save
4. Quay về Garden -> thấy cây vừa trồng
5. Tạo thêm memory -> thấy Atlas mở dần
6. Hoàn thành `3 Memories Starter Quest` -> mở Timeline và lớp retention tiếp theo

### Copy gợi ý cho trạng thái khóa
- `Mở sau khi hoàn thành 3 Memories Starter Quest`
- `Bạn còn {x}/3 kỷ niệm để mở Timeline`
- `Tiếp tục gieo thêm ký ức để mở hành trình của bạn`

### Tài liệu đã sync theo flow này
- `.planning/MVP_SCREEN_SPEC.md`
- `.planning/IMPLEMENTATION_CHECKLIST.md`
- `.planning/USER_FLOW_STATE_MACHINE.md`
- `.planning/COPYWRITING_PACK.md`
- `.planning/PHASE_TASK_BREAKDOWN.md`
- `.planning/COMPOSE_SPEC.md`
- `.planning/ONBOARDING.md`
