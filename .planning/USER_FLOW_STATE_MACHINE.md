# User Flow + State Machine — MVP Progression

> Mục tiêu: giúp dev code logic gating/unlock rõ ràng, không phải tự suy luận từ UX doc.
> Nguồn chốt: `.planning/UX_REVIEW_MVP.md` + `.planning/MVP_SCREEN_SPEC.md`
> Trạng thái: planning only, **chưa code mockup**.

---

## 1. Core state model

### State chính
- `Goal0_Onboarding`
- `Goal1_FirstBloomDone`
- `Goal2_SecondMemoryDone`
- `Goal3_StarterQuestDone`

### Biến nguồn
- `onboarded: Boolean`
- `firstBloomSeen: Boolean`
- `totalMemories: Int`
- `starterQuestCount: Int`
- `starterQuestDone: Boolean`

### Công thức tính state
- `Goal0_Onboarding`
  - khi `onboarded = false`
- `Goal1_FirstBloomDone`
  - khi `onboarded = true`
  - và `totalMemories <= 1`
  - và `starterQuestDone = false`
- `Goal2_SecondMemoryDone`
  - khi `totalMemories >= 2`
  - và `starterQuestDone = false`
- `Goal3_StarterQuestDone`
  - khi `starterQuestDone = true`

### Rule đơn giản cho MVP
- `starterQuestCount = min(totalMemories, 3)`
- `starterQuestDone = starterQuestCount >= 3`
- Không cần state phức tạp hơn nếu chưa có nhiều quest song song

---

## 2. Event -> transition

### Event chính
- `AppLaunch`
- `FinishOnboarding`
- `CreateMemorySuccess`
- `StarterQuestProgressed`
- `StarterQuestCompleted`
- `TapLockedTimeline`

### Transition

#### Từ `Goal0_Onboarding`
- `AppLaunch`
  - nếu `onboarded = false` -> ở lại `Goal0_Onboarding`
- `FinishOnboarding`
  - set `onboarded = true`
  - set `firstBloomSeen = true`
  - tạo first memory mẫu
  - chuyển sang `Goal1_FirstBloomDone`

#### Từ `Goal1_FirstBloomDone`
- `CreateMemorySuccess`
  - tăng `totalMemories`
  - nếu `totalMemories >= 2` -> chuyển `Goal2_SecondMemoryDone`
  - nếu chưa đủ -> ở lại state cũ

#### Từ `Goal2_SecondMemoryDone`
- `CreateMemorySuccess`
  - tăng `starterQuestCount`
  - nếu `starterQuestCount < 3` -> ở lại `Goal2_SecondMemoryDone`
  - nếu `starterQuestCount >= 3` -> bắn `StarterQuestCompleted`

#### Từ `Goal2_SecondMemoryDone` sang `Goal3_StarterQuestDone`
- `StarterQuestCompleted`
  - set `starterQuestDone = true`
  - mở Timeline
  - mở share / backup / settings sâu hơn
  - show reward unlock

#### Từ `Goal3_StarterQuestDone`
- `CreateMemorySuccess`
  - không đổi state progression
  - chỉ cập nhật progress / retention features

---

## 3. Screen access matrix

| Screen / Feature | Goal 0 | Goal 1 | Goal 2 | Goal 3 |
|---|---|---|---|---|
| Onboarding | Mở | Ẩn | Ẩn | Replay only |
| Garden | Chưa vào | Mở | Mở | Mở |
| Create | Chưa vào | Minimal | Standard | Fuller |
| Atlas | Chưa vào | Preview | Core | Advanced |
| Timeline | Chưa vào | Locked | Locked | Mở |
| Settings | Chưa vào | Lite | Basic+ | Fuller |
| Share | Ẩn | Ẩn | Ẩn | Mở |
| Backup | Ẩn | Ẩn | Ẩn | Mở |
| Seasonal hook sâu | Ẩn | Nhẹ | Nhẹ | Rõ hơn |

---

## 4. Navigation rules

### App launch
- Nếu `onboarded = false`
  - route vào `Onboarding`
- Nếu `onboarded = true`
  - route vào `Garden`

### Sau khi save memory
- Luôn route về `Garden`
- Sau đó mới show:
  - highlight plot mới
  - growth animation
  - optional CTA sang Atlas

### Khi chạm `Timeline` trước Goal 3
- Không route vào content thật
- Mở `locked informative sheet`

### Khi hoàn thành quest thứ 3
- Show `unlock reward`
- Cho 2 action:
  - `Xem Timeline`
  - `Quay về Garden`

---

## 5. Locked informative state

### Trigger
- User chạm tab `Timeline` khi current goal < 3

### Nội dung tối thiểu
- Title:
  - `Timeline chưa mở`
- Body:
  - `Hoàn thành 3 Memories Starter Quest để mở hành trình của bạn`
- Progress:
  - `{starterQuestCount}/3 kỷ niệm`
- CTA:
  - `Thêm kỷ niệm`
  - `Để sau`

### Rule UX
- Không làm locked state quá dài
- Không spoil quá nhiều tính năng sâu
- Mục tiêu là kéo user về core loop

---

## 6. Garden state machine

### Garden sub-states
- `Empty`
- `Activated_FirstBloom`
- `Progressing`
- `PostGoal3`

### Mapping
- `Empty`
  - khi chưa có memory thật ngoài onboarding hoặc garden chưa có plot meaningful
- `Activated_FirstBloom`
  - vừa xong onboarding / first bloom
- `Progressing`
  - từ Goal 2 đến trước Goal 3
- `PostGoal3`
  - sau khi Timeline unlock

### Hero content rule
- `Empty` / `Activated_FirstBloom`
  - chỉ 1 CTA `Thêm kỷ niệm`
- `Progressing`
  - vẫn giữ 1 CTA hero
  - thêm milestone gần nhất / quick capture
- `PostGoal3`
  - vẫn 1 CTA hero
  - card phụ được mở thêm nhưng không cướp hero

---

## 7. Create state machine

### Create modes
- `Minimal`
- `Standard`
- `Fuller`

### Mapping
- Goal 1 -> `Minimal`
- Goal 2 -> `Standard`
- Goal 3 -> `Fuller`

### Submit success effect
1. validate
2. save memory
3. grow/unlock plant
4. emit success feedback
5. navigate `Garden`
6. highlight plot
7. nếu có unlock đáng chú ý -> suggest `Xem Atlas`

---

## 8. Timeline state machine

### Timeline modes
- `Locked`
- `Unlocked_MVP`

### Mapping
- Goal 1-2 -> `Locked`
- Goal 3 -> `Unlocked_MVP`

### `Locked`
- Hiện tip + progress
- CTA quay lại `Create`

### `Unlocked_MVP`
- Default tab:
  - `Month` hoặc `Year`
- `Life Journey`
  - mở bản nhẹ nếu data ít

---

## 9. Settings state machine

### Settings modes
- `Lite`
- `BasicPlus`
- `Fuller`

### Mapping
- Goal 1 -> `Lite`
- Goal 2 -> `BasicPlus`
- Goal 3 -> `Fuller`

### Rule
- User mới không nên thấy danger zone quá sớm
- Backup chỉ nên nổi sau khi user đã có giá trị để cần giữ

---

## 10. Gợi ý implementation

### Hàm gợi ý
```kotlin
enum class ProgressGoal { Goal0, Goal1, Goal2, Goal3 }

fun resolveProgressGoal(
    onboarded: Boolean,
    totalMemories: Int,
    starterQuestDone: Boolean,
): ProgressGoal
```

### Capability flags
```kotlin
data class CapabilityFlags(
    val canOpenTimeline: Boolean,
    val showTimelineLockedHint: Boolean,
    val showBackupReminder: Boolean,
    val showShareShortcut: Boolean,
    val createMode: CreateMode,
    val settingsMode: SettingsMode,
    val atlasMode: AtlasMode,
)
```

### Lý do nên làm bằng capability flags
- UI ít `if` rời rạc hơn
- test dễ hơn
- đổi rule unlock sau này ít chạm màn hình hơn

---

## 11. Test cases tối thiểu

- User mới mở app -> vào onboarding
- Finish onboarding -> về Garden + state Goal 1
- Save memory thứ 2 -> sang Goal 2
- Tap Timeline ở Goal 2 -> hiện locked sheet
- Hoàn thành memory thứ 3 -> unlock reward -> Goal 3
- Tap Timeline ở Goal 3 -> vào Timeline content thật
- Save memory sau Goal 3 -> không lock lại gì
