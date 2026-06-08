# Phase Task Breakdown — Memory Garden MVP

> Mục tiêu: chuyển bộ planning hiện tại thành backlog triển khai theo phase.
> Trạng thái: planning only, **chưa code mockup**.
> Nguồn chốt: `.planning/COMPOSE_SPEC.md` + `.planning/USER_FLOW_STATE_MACHINE.md` + `.planning/MVP_SCREEN_SPEC.md`

---

## 1. Cách dùng tài liệu này

- Mỗi phase là một chặng có thể giao việc độc lập.
- Trong mỗi phase có:
  - mục tiêu
  - dependency
  - task breakdown
  - output cần có
  - definition of done
- Ưu tiên làm theo thứ tự để tránh mở retention trước activation.

---

## 2. Tổng quan phase

| Phase | Tên | Mục tiêu chính |
|---|---|---|
| 0 | Foundation | Dự án chạy được, có theme, nav, MVI, khung app |
| 1 | Data & Domain | Có data thật, engine growth/season, flag nền |
| 2 | Core Loop | Create -> Garden -> Atlas hoạt động |
| 3 | Activation | Onboarding, first bloom, quest, timeline locked |
| 4 | Season Layer | Mùa dạng ambient/additive |
| 5 | Retention Core | Timeline, Milestones, Settings, Customization |
| 6 | Safety & Sharing | Backup, Share, Widgets |
| 7 | Monetization | Ads + Billing |
| 8 | Polish & Release | Analytics, perf, accessibility, release prep |

---

## 3. Phase 0 — Foundation

### Mục tiêu
- Có app shell ổn định để cắm feature vào.

### Dependency
- Không phụ thuộc phase trước.

### Task breakdown
- Setup project Android:
  - Gradle
  - Compose BOM stable
  - Hilt
  - Room
  - DataStore
  - Coil
  - Nav3
- Tạo app entry:
  - `MemoryGardenApp`
  - `MainActivity`
- Dựng design system nền:
  - token Cozy
  - token Pixel
  - `MgTheme`
  - component nền `MgButton`, `MgCard`, `MgChip`, `MgTopBar`, `MgBottomNav`
- Tạo app navigation shell:
  - route chính
  - bottom nav khung
  - placeholder screen
- Tạo base MVI:
  - `UiState`
  - `Intent`
  - `Effect`
  - `MviViewModel`

### Output
- App build chạy được
- Đổi theme Cozy/Pixel runtime được
- Có navigation shell cơ bản

### Definition of done
- Build pass
- App mở được tới shell chính
- Theme switch không vỡ UI nền
- Nav shell render đúng trên phone frame logic

---

## 4. Phase 1 — Data & Domain

### Mục tiêu
- Có model dữ liệu và engine đủ để core loop chạy bằng dữ liệu thật.

### Dependency
- Cần Phase 0 xong.

### Task breakdown
- Chốt data model:
  - `MemoryEntity`
  - `PlantStateEntity`
  - `GardenPlotEntity`
  - `MilestoneStateEntity`
- Tạo Room:
  - database
  - dao
  - converter
  - migration baseline
- Tạo DataStore:
  - settings flags
  - onboarding flags
  - quest/unlock flags
- Tạo static catalog:
  - plant catalog
  - category catalog
  - mood catalog
  - season catalog
  - milestone catalog
- Tạo domain engine:
  - `SeasonEngine`
  - `GrowthEngine`
  - `resolveProgressGoal`
  - capability flags mapper
- Tạo repository + use case nền:
  - create memory
  - get garden
  - get atlas
  - get timeline
  - get settings

### Output
- Data layer có thể lưu/đọc
- Goal gating tính được từ data thật
- Use case nền sẵn cho UI phase sau

### Definition of done
- Unit test engine pass
- Insert memory test pass
- Progress goal resolve đúng 4 trạng thái
- Capability flags map đúng theo Goal 0-3

---

## 5. Phase 2 — Core Loop

### Mục tiêu
- Đóng được loop `Create -> Garden -> Atlas`.

### Dependency
- Cần Phase 1 xong.

### Task breakdown

#### Create
- Dựng screen `Create Minimal`
- Wire field tối thiểu:
  - 1 dòng mô tả/title
  - mood
  - category gợi ý
  - ảnh tùy chọn
- Save intent gọi `CreateMemoryUseCase`
- Save success effect điều hướng về `Garden`

#### Garden
- Dựng `GardenScreen`
- Render plot state
- Empty state
- Success highlight plot mới
- Hero CTA duy nhất: `Thêm kỷ niệm`

#### Atlas
- Dựng `AtlasScreen`
- Preview mode cho Goal 1
- Core mode cho Goal 2
- Hiện progress tổng + category
- Hiện locked hint cho plant chưa mở

#### Plant detail
- Dựng detail cơ bản:
  - sprite
  - rarity
  - category
  - memory nguồn

### Output
- User tạo memory được
- Save xong thấy reward ở Garden
- Atlas mở dần theo tiến độ

### Definition of done
- Manual flow pass:
  - create memory
  - back về Garden
  - plot highlight
  - Atlas progress tăng
- Không ép chọn ảnh
- Garden không có hơn 1 CTA hero

---

## 6. Phase 3 — Activation

### Mục tiêu
- Tối ưu funnel lần đầu dùng.

### Dependency
- Cần Phase 2 xong.

### Task breakdown

#### Onboarding
- Dựng onboarding 5 bước
- Welcome nói rõ value trong 5 giây
- Seed step cực nhanh
- First bloom guaranteed
- Finish route về Garden

#### First-time guidance
- Coach overlay ở Garden
- Replay onboarding
- Replay coach

#### Quest & unlock
- Tạo `3 Memories Starter Quest`
- Hiện progress quest ở Garden
- Tạo `Timeline locked informative state`
- Tap locked -> mở sheet + progress + CTA quay lại core loop

#### Goal transition
- Goal 0 -> Goal 1 sau onboarding
- Goal 1 -> Goal 2 sau memory thật thứ 2
- Goal 2 -> Goal 3 sau quest đủ 3
- Show reward unlock Timeline

### Output
- User mới vào hiểu app
- User biết Timeline tồn tại nhưng chưa bị mở sớm

### Definition of done
- New user flow pass end-to-end
- Timeline locked state hoạt động đúng
- Unlock quest thứ 3 mở được Timeline
- Copy onboarding/locked state khớp `COPYWRITING_PACK.md`

---

## 7. Phase 4 — Season Layer

### Mục tiêu
- Thêm chiều sâu retention mà không phá activation.

### Dependency
- Cần Phase 2 xong, tốt nhất sau Phase 3.

### Task breakdown
- Ambient season:
  - season tint
  - banner
  - particle
- Growth integration:
  - affinity bonus
  - bloom variant
- Atlas seasonal:
  - badge mùa
  - progress seasonal riêng
- Settings season:
  - hemisphere
  - particle toggle

### Output
- App có cảm giác sống theo mùa
- Season vẫn additive-only

### Definition of done
- Đổi season/hemisphere phản ánh đúng UI
- First bloom không bị ảnh hưởng
- Trước Goal 3, seasonal hook không tranh hero Garden

---

## 8. Phase 5 — Retention Core

### Mục tiêu
- Mở lớp giữ chân sau khi activation đã ổn.

### Dependency
- Cần Goal gating của Phase 3.

### Task breakdown

#### Timeline
- Dựng locked state trước Goal 3
- Dựng Month view
- Dựng Year view
- Life Journey bản nhẹ nếu data ít
- Empty state cho month/year

#### Milestones
- Dựng screen milestones
- Progress từ memory flow
- Badge/achievement state

#### Settings
- Lite mode Goal 1
- Basic+ Goal 2
- Fuller Goal 3
- Danger zone rõ ràng

#### Customization
- Theme pack state
- Decoration owned/locked state

### Output
- Timeline usable sau unlock
- Settings mở dần theo giá trị user đã nhận

### Definition of done
- Goal 3 mở Timeline content thật
- Settings mode đổi đúng theo goal
- Milestone tiến triển đúng khi tạo memory

---

## 9. Phase 6 — Safety & Sharing

### Mục tiêu
- Tăng trust và khả năng quay lại/chia sẻ.

### Dependency
- Cần data layer ổn, Settings có chỗ chứa.

### Task breakdown
- Backup:
  - export ZIP
  - import ZIP
  - last backup state
  - backup reminder
- Share:
  - render card
  - share memory
  - share garden snapshot
- Widgets:
  - recent memory
  - garden progress
  - on this day

### Output
- User có cách giữ dữ liệu
- User có cách share giá trị app

### Definition of done
- Export/import smoke test pass
- Share sheet hoạt động
- Widget spec chạy được hoặc có prototype thực thi

---

## 10. Phase 7 — Monetization

### Mục tiêu
- Gắn kiếm tiền sau khi loop giá trị đã rõ.

### Dependency
- Nên sau Phase 5 hoặc 6.

### Task breakdown
- AdMob:
  - init
  - app open
  - native
  - rewarded
- Billing:
  - pro flag
  - theme/deco purchase
  - restore purchase
- Gate monetization:
  - không hiện quá sớm
  - seasonal rewarded chỉ sau Goal 3

### Output
- Có monetization path nhưng không phá onboarding

### Definition of done
- Consent flow ổn
- App open không hiện trước onboarding
- Rewarded flow không chặn core loop

---

## 11. Phase 8 — Polish & Release

### Mục tiêu
- Đưa app lên trạng thái ship được.

### Dependency
- Sau các phase feature chính.

### Task breakdown
- Analytics funnel:
  - install
  - finish onboarding
  - first memory
  - first bloom
  - timeline unlock
- Accessibility:
  - talkback
  - touch target
  - contrast
- Performance:
  - startup
  - animation jank
  - baseline profile
- Release prep:
  - R8
  - icon/splash
  - smoke checklist

### Output
- Bản release candidate đủ sạch để test rộng

### Definition of done
- Critical path smoke pass
- Analytics event đúng
- Không có blocker lớn về perf/a11y

---

## 12. Cross-phase workstreams

### UX copy
- Chủ nguồn: `COPYWRITING_PACK.md`
- Chạm mạnh ở Phase 2, 3, 5

### Goal gating
- Chủ nguồn: `USER_FLOW_STATE_MACHINE.md`
- Chạm mạnh ở Phase 1, 3, 5

### Theme & visual
- Chủ nguồn: `COMPOSE_SPEC.md` + `ASSET_SPEC.md`
- Chạm mạnh ở Phase 0, 4, 5

### Trust & privacy
- Chủ nguồn: `ONBOARDING.md` + `Settings` spec
- Chạm mạnh ở Phase 3, 6

---

## 13. Đề xuất thứ tự giao việc

### Nếu 1 dev
1. Phase 0
2. Phase 1
3. Phase 2
4. Phase 3
5. Phase 5
6. Phase 4
7. Phase 6
8. Phase 7
9. Phase 8

### Nếu 2 dev
- Dev A:
  - Phase 0 -> 1 -> 2 -> 3
- Dev B:
  - asset prep
  - copy integration
  - phase 5 settings/timeline shell
  - phase 6 share/backup prep

### Nếu 3 dev
- Dev A: foundation + data + goal gating
- Dev B: Garden/Create/Atlas
- Dev C: Onboarding/Timeline/Settings/copy integration

---

## 14. Sprint cut gợi ý

### Sprint 1
- Phase 0
- Phase 1

### Sprint 2
- Phase 2

### Sprint 3
- Phase 3

### Sprint 4
- Phase 5 bản MVP

### Sprint 5
- Phase 4 + 6

### Sprint 6
- Phase 7 + 8

---

## 15. MVP cutline nếu thiếu thời gian

### Giữ
- Phase 0
- Phase 1
- Phase 2
- Phase 3
- Phase 5 bản Timeline Month/Year cơ bản

### Lùi sau
- Widget sâu
- AI recap
- Monetization seasonal phức tạp
- Customization nặng
- Life Journey tham vọng

---

## 16. Liên kết tài liệu

- Flow tổng: `.planning/UX_REVIEW_MVP.md`
- Screen spec: `.planning/MVP_SCREEN_SPEC.md`
- Logic gating: `.planning/USER_FLOW_STATE_MACHINE.md`
- Copy UI: `.planning/COPYWRITING_PACK.md`
- Checklist implement: `.planning/IMPLEMENTATION_CHECKLIST.md`
- Compose technical spec: `.planning/COMPOSE_SPEC.md`
