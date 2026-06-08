# COMPOSE SPEC — Memory Garden: Your Life Journey

> Spec kỹ thuật chi tiết để code app Android thật bằng **Jetpack Compose + Material 3 + MVI**.
> Nguồn sự thật sản phẩm: [base/Memory Garden.md](../base/Memory%20Garden.md) · mùa: [.planning/SEASON_SYSTEM.md](SEASON_SYSTEM.md) · onboarding: [.planning/ONBOARDING.md](ONBOARDING.md) · UX đã validate qua mockup: [brainstorm/mockups/](../brainstorm/mockups/).
> Data shape mockup ([js/data.js](../brainstorm/mockups/js/data.js)) = chuẩn để map sang Room entities.
> Asset cần chuẩn bị (icon, sprite cây, animation, audio): [.planning/ASSET_SPEC.md](ASSET_SPEC.md).
> Flow MVP cuối cùng: [.planning/UX_REVIEW_MVP.md](UX_REVIEW_MVP.md) · screen spec ngắn: [.planning/MVP_SCREEN_SPEC.md](MVP_SCREEN_SPEC.md) · checklist triển khai: [.planning/IMPLEMENTATION_CHECKLIST.md](IMPLEMENTATION_CHECKLIST.md)
> Logic gating chi tiết: [.planning/USER_FLOW_STATE_MACHINE.md](USER_FLOW_STATE_MACHINE.md) · copy UI chuẩn: [.planning/COPYWRITING_PACK.md](COPYWRITING_PACK.md)
> Task breakdown theo phase: [.planning/PHASE_TASK_BREAKDOWN.md](PHASE_TASK_BREAKDOWN.md)

---

## 0. Nguyên tắc bất biến (đọc trước khi code)

1. **Local-first** — KHÔNG backend, KHÔNG account, KHÔNG đăng nhập ở MVP. Room + DataStore + file cục bộ. Backup = Export/Import ZIP thủ công.
2. **Growth gắn HÀNH ĐỘNG, không gắn thời gian** — tạo 1 memory = cây lớn 1 stage. Không có timer real-time làm cây lớn.
3. **Season ADDITIVE-ONLY** — mùa chỉ cộng bonus (glow, +rare%, bloom variant, cây seasonal). TUYỆT ĐỐI không chặn growth / không freeze / không block bloom.
4. **First Bloom Guarantee** — memory ĐẦU TIÊN luôn nở Rare Bloom, miễn nhiễm mùa. Đây là aha-moment, không được phá.
5. **Seasonal-exclusive plants KHÔNG tính vào 100% core completion** — tránh time-gate completionist.
6. **2 theme song song** — Cozy (pastel, bo tròn) ↔ Pixel (retro, viền đậm). Mọi UI dùng design token, không hardcode màu/radius.
7. **Activation trước, retention sau** — trước `3 Memories Starter Quest`, ưu tiên chỉ mở Garden / Create / Atlas preview-core và chỉ báo khóa `Timeline`.
8. **Locked but informative** — feature/tab chưa mở phải có trạng thái khóa có hướng dẫn ngắn + progress, không để user mù về phần thưởng kế tiếp.
9. **Save phải trả reward ngay** — sau create/save memory, effect mặc định là quay về `Garden` và highlight cây vừa trồng.

---

## 1. Tech stack & dependencies

| Layer | Lựa chọn |
|---|---|
| UI | Jetpack Compose (BOM stable mới nhất) + Material 3 |
| Styling | **Design token (CompositionLocal) + Modifier** — cách ổn định. **KHÔNG** dùng Compose Styles API (đang alpha) ở MVP — để dành post-MVP, xem §3.3. |
| Navigation | **Navigation 3** (Nav3) — backstack điều khiển được, scene cho bottom-sheet/dialog |
| Architecture | MVI — `ViewModel` expose `StateFlow<UiState>` + `onIntent(Intent)` + `Channel<Effect>` |
| DI | Hilt |
| Async | Coroutines + Flow |
| Storage | Room (memories, plants, plots, milestones) + DataStore Preferences (settings, flags) |
| Media | Coil 3 (load ảnh memory từ URI file cục bộ) |
| Image meta | ExifInterface (date/location) + ML Kit Image Labeling on-device (gợi ý category) — **Phase activation** |
| Widget | Glance |
| Ads | Google AdMob (App Open, Native, Rewarded) |
| Billing | Google Play Billing Library (bản mới nhất) |
| Background | WorkManager (backup reminder, On-This-Day widget refresh) |
| Share | Compose-to-Bitmap (`GraphicsLayer.toImageBitmap` / `PixelCopy`) → Share Sheet |
| Test | JUnit + Turbine (Flow) + Compose UI test + Room in-memory |

**Min/target SDK:** minSdk 24, targetSdk = mới nhất. Glance cần API phù hợp. Dùng Compose BOM **stable** (không cần alpha vì bỏ Styles API).

---

## 2. Cấu trúc module / package

MVP single-module `:app` (chia package theo feature + layer). Tách multi-module ở Phase sau nếu cần.

```
com.solarapp.memorygarden
├─ MemoryGardenApp.kt              // @HiltAndroidApp, init AdMob
├─ MainActivity.kt                 // setContent { MemoryGardenTheme { AppNavHost() } }
│
├─ core/
│  ├─ designsystem/
│  │  ├─ theme/   Theme.kt, Color.kt (Cozy+Pixel tokens), Shape.kt, Type.kt, SeasonTint.kt
│  │  ├─ component/  MgButton, MgCard, MgTopBar, MgBottomNav, RarityStars, PlantSprite,
│  │  │              ProgressRing, SeasonBanner, ParticleOverlay, EmptyState, MgChip
│  │  └─ anim/   GrowthAnim.kt, BloomBurst.kt, CatchReveal.kt, ConfettiFx.kt
│  ├─ common/   Result.kt, DispatcherProvider, UiText, formatters (date)
│  └─ ads/      AdMobManager, RewardedAdController, NativeAdSlot (Composable)
│
├─ data/
│  ├─ db/   MemoryGardenDatabase, entities/, dao/, converters/
│  ├─ datastore/   SettingsDataStore, FlagsDataStore (onboard/coach/backup)
│  ├─ catalog/   PlantCatalog.kt (30-50 cây seed), SeasonCatalog.kt, CategoryCatalog.kt, MoodCatalog.kt
│  ├─ backup/   ZipExporter, ZipImporter
│  └─ repository/   MemoryRepositoryImpl, GardenRepositoryImpl, CollectionRepositoryImpl,
│                   MilestoneRepositoryImpl, SettingsRepositoryImpl
│
├─ domain/
│  ├─ model/   Memory, Plant, GardenPlot, Category, Mood, Season, Milestone, Stage, Rarity
│  ├─ repository/   (interfaces)
│  ├─ season/   SeasonEngine.kt (seasonOf, affinity, bloom variant), GrowthEngine.kt (rarity roll, stage)
│  └─ usecase/   CreateMemoryUseCase, GrowPlantUseCase, RollBloomUseCase, UnlockPlantUseCase,
│                GetGardenUseCase, GetAtlasUseCase, GetTimelineUseCase, ExportBackupUseCase, ...
│
└─ feature/
   ├─ onboarding/      OnboardingScreen + VM + 5 step composables
   ├─ garden/          GardenScreen + VM + CoachOverlay
   ├─ memory/          MemoryList/Detail/Editor + VM, QuickCaptureSheet
   ├─ collection/      AtlasScreen + PlantDetailScreen + VM
   ├─ timeline/        TimelineScreen + VM (Year/Month/Life tabs)
   ├─ milestones/      MilestonesScreen + VM
   ├─ settings/        SettingsScreen + BackupScreen + VM
   ├─ customization/   CustomizationScreen + VM (theme packs, decorations)
   └─ share/           ShareCardRenderer + ShareSheet
```

---

## 3. Design system (Cozy ↔ Pixel)

Map trực tiếp từ `base.css` / `theme-cozy.css` / `theme-pixel.css` của mockup.

> **Mô hình:** Token (màu/shape/typography) expose qua CompositionLocal — đổi theme Cozy↔Pixel = đổi bộ token. Custom component (`Mg*`) đọc token + áp `Modifier` thường (`.background().clip().border()`). Vì đọc token (không hardcode), 1 component tự ăn cả 2 theme + 4 mùa. (Compose Styles API = option post-MVP, §3.3.)

### 3.1 Token (CompositionLocal)
Định nghĩa `MgColors`, `MgShapes`, `MgTypography` qua `CompositionLocalProvider`. Đổi theme = đổi bộ token.

| Token | Cozy | Pixel |
|---|---|---|
| primary | pastel green `#5fa86b` | retro green, viền cứng |
| bg / bg-card | trắng kem, soft shadow | nền tối/retro, viền 2-3px |
| radius-md | 16-20dp bo tròn | 0-4dp gần vuông |
| font-display | rounded sans | pixel font (`Press Start 2P` / fallback monospace) |
| elevation/border | soft shadow, border 0 | shadow 0, border 2-3px |

- `MgTheme(theme: AppTheme, season: Season) { ... }` bọc toàn app. `theme` từ DataStore → chọn `MgColors`/`MgShapes`. `season` từ `SeasonEngine` → set `LocalSeasonTint`.
- **Season tint**: `LocalSeasonTint` = màu phủ ambient (radial top, alpha thấp). Áp ở layer ngoài cùng (`Box` + `Modifier.drawWithContent`) — pointer-events none, additive-only.

### 3.2 Pattern viết custom component (token + Modifier)
Mỗi `Mg*` component nhận param hình thức **có default từ token** rồi áp bằng `Modifier` thường. Đọc token qua `MgTheme.colors/shapes/typography`. Khác biệt Cozy↔Pixel (shadow vs border, radius) lấy từ token — không hardcode.

```kotlin
@Composable
fun MgButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    shape: Shape = MgTheme.shapes.md,
    content: @Composable RowScope.() -> Unit,
) {
    val bg = if (enabled) MgTheme.colors.primary else MgTheme.colors.primaryMuted
    Row(
        modifier
            .clip(shape)
            .background(bg)
            .then(MgTheme.colors.outline?.let { Modifier.border(MgTheme.border, it, shape) } ?: Modifier)
            .clickable(enabled = enabled, onClick = onClick)
            .defaultMinSize(minWidth = 64.dp, minHeight = 44.dp)
            .padding(horizontal = 16.dp),
        verticalAlignment = Alignment.CenterVertically,
        content = content,
    )
}
```

- **State (pressed/hover):** dùng `InteractionSource` + `collectIsPressedAsState()` → đổi màu/scale qua `animate*AsState`. Đặt logic state ngay trong component, tái sử dụng helper chung nếu lặp.
- **Pixel border vs Cozy shadow:** token `outline` (null ở Cozy → không border) + `elevation`/`border` token. Component đọc token, 1 bản chạy cả 2 theme.
- **Material 3 component** (Button/Card/TextField M3) dùng khi đủ → theme qua `MaterialTheme`/`ColorScheme` bình thường; chỉ tự viết `Mg*` khi cần look đặc thù (pixel/cozy).

### 3.3 Compose Styles API — option post-MVP (chưa làm)
Khi `androidx.compose.foundation.style.Style` lên **stable** (hiện alpha), có thể migrate `Mg*` sang Styles API để gói property + state + transition vào 1 `Style` tách khỏi logic. Lợi: đỡ lặp state, đổi theme = reswap token tự động. **Chưa áp ở MVP** (cần Compose alpha + opt-in experimental → rủi ro ổn định). Khi migrate: chỉ thêm param `style: Style = Style` + `Modifier.styleable` — call-site cũ không vỡ.

### 3.4 Component chung (tái sử dụng mọi screen)

- `PlantSprite(plant, stage, size)` — render emoji/sprite theo stage + glow nếu hợp mùa.
- `RarityStars(rarity)` — 1-4 sao theo `RARITY`.
- `ProgressRing(value, max)` — vòng tiến độ (Garden goal + Atlas completion).
- `SeasonBanner(season, isLive)` — weather emoji + tên + dòng bonus + badge "● đang diễn ra".
- `ParticleOverlay(season, enabled)` — particle 🌸/✨/🍂/❄️ rơi (tắt được qua Settings `particleFx`).
- `NativeAdSlot()` — chèn Native Ad dạng card vào list (Atlas/Timeline).
- `CatchReveal`, `BloomBurst`, `ConfettiFx` — animation mở khóa.

---

## 4. Data layer

### 4.1 Room entities

```kotlin
@Entity("memories")
data class MemoryEntity(
  @PrimaryKey val id: String,        // UUID
  val title: String,
  val description: String,
  val categoryId: String,            // adventure|food|relationship|entertain|growth|milestone
  val subId: String?,                // sub-category (Travel, Coffee...)
  val mood: String?,                 // joy|calm|moved|sad|hyped|tired
  val photoUri: String?,             // file cục bộ (Coil load)
  val tags: List<String>,            // TypeConverter -> JSON
  val date: Long,                    // epochDay/epoch millis
  val plantId: String,               // cây sinh ra từ memory này
  val rarity: String,                // kết quả roll: common|rare|epic|legendary
  val createdAt: Long
)

@Entity("plant_states")               // trạng thái unlock của catalog (catalog tĩnh ở code)
data class PlantStateEntity(
  @PrimaryKey val plantId: String,
  val unlocked: Boolean,
  val unlockedAt: Long?,
  val firstSeenSeason: String?
)

@Entity("garden_plots")
data class GardenPlotEntity(
  @PrimaryKey val plotId: String,
  val plantId: String?,              // null = ô trống
  val memoryId: String?,
  val stage: Int,                    // 0..4 (Seed..Rare Bloom)
  val isFresh: Boolean               // highlight "Mới 🌟"
)

@Entity("milestone_states")
data class MilestoneStateEntity(
  @PrimaryKey val milestoneId: String,
  val progress: Int,
  val done: Boolean,
  val achievedAt: Long?
)
```

- **Plant catalog (30-50 cây), Seasons, Categories, Moods, Milestones, Theme/Deco packs** = **dữ liệu tĩnh trong code** (`data/catalog/`), KHÔNG bỏ vào Room. Room chỉ giữ *state động*: memories, unlock state, plot state, milestone progress.
- TypeConverters: `List<String>` (tags) ↔ JSON.

### 4.2 DataStore (Preferences)
`SettingsDataStore`: `appTheme` (cozy|pixel), `hemisphere` (north|south), `particleFx`, `dailyReminder`+`reminderTime`, `lang` (vi|en), `proActive`, `lastBackupAt`.
`FlagsDataStore`: `onboarded`, `coachSeen`, `starterQuestDone`, `backupReminderDismissedAt`.

### 4.3 Repository interfaces (domain) — impl ở data
`MemoryRepository`, `GardenRepository`, `CollectionRepository`, `MilestoneRepository`, `SettingsRepository`, `BackupRepository`. Expose `Flow<...>` cho reactive UI. Stats (completion, unlocked count) = **derived** từ Flow combine, không lưu số cứng (như `STATS` getter trong mockup).

---

## 5. Domain — engine cốt lõi

### 5.1 SeasonEngine (hàm thuần, không backend)
```kotlin
fun seasonOf(date: LocalDate, hemisphere: Hemisphere): Season
//  Bắc: month 3-5 Xuân, 6-8 Hạ, 9-11 Thu, 12/1/2 Đông. Nam: dịch +6 tháng.
fun affinityBonus(category: String, season: Season): Boolean   // category hợp mùa?
fun bloomVariant(plant: Plant, season: Season): BloomVariant    // sắc theo mùa
fun isLiveSeason(season: Season): Boolean                       // khớp lịch thực
```
Mùa hiện tại derive mỗi lần từ `LocalDate.now()` + hemisphere (DataStore). KHÔNG persist mùa.

### 5.2 GrowthEngine (roll rarity + stage)
```kotlin
fun rollRarity(category: String, season: Season, isFirstMemory: Boolean): Rarity
//  isFirstMemory == true -> ALWAYS Rare+ (First Bloom Guarantee, miễn nhiễm mùa)
//  else: base table + (+20% rare nếu affinityBonus) — ADDITIVE
fun nextStage(current: Int): Int                                // tạo memory -> +1 stage, cap 4
fun mapMemoryToPlant(category: String, rarity: Rarity): String  // chọn cây từ catalog theo cat+rarity
```
**Quy tắc bất biến:** mùa chỉ tác động ở `rollRarity` (cộng %) + `bloomVariant` (đổi sắc). KHÔNG bao giờ đụng `nextStage`.

### 5.3 Use cases chính
- `CreateMemoryUseCase` — validate → insert MemoryEntity → roll rarity (first-memory check) → map plant → unlock plant nếu chưa → gắn/điền plot → check milestones. **Đây là trung tâm core loop.**
- `GrowPlantUseCase`, `RollBloomUseCase`, `UnlockPlantUseCase`.
- `GetGardenUseCase`, `GetAtlasUseCase`, `GetTimelineUseCase`, `GetMilestonesUseCase`.
- `ExportBackupUseCase` / `ImportBackupUseCase` (ZIP: DB dump JSON + ảnh).

---

## 6. MVI contract (chuẩn áp mọi feature)

```kotlin
interface UiState
sealed interface Intent
sealed interface Effect          // one-shot: navigate, toast, playAnim, showAd

abstract class MviViewModel<S: UiState, I: Intent, E: Effect> : ViewModel() {
  val state: StateFlow<S>
  val effects: Flow<E>           // Channel.receiveAsFlow()
  abstract fun onIntent(intent: I)
}
```
Screen: `collectAsStateWithLifecycle()` cho state; `LaunchedEffect` collect effects → nav/toast/anim.

---

## 7. Đặc tả màn hình (8 màn + overlay)

Bottom nav logic theo progressive unlock:
- Trước Goal 3: **Garden · Atlas · ＋ (Create/Quick-capture) · Timeline(locked)**. Settings đi từ app bar hoặc entry gọn.
- Sau Goal 3: mở đầy đủ **Garden · Atlas · ＋ · Timeline · More**.
- `Timeline` dùng kiểu **locked but informative** trước khi unlock.

### 7.1 Garden (Home) — màn lõi aha
- **Hiển thị:** grid ô đất (`GardenPlotEntity`); mỗi ô = `PlantSprite` theo stage; ô trống = "tap to plant". `ProgressRing` mục tiêu vườn. `SeasonBanner` + `ParticleOverlay` + season glow ambient. Banner nhắc backup (dismissible). 3-Memory Starter Quest progress.
- **FAB ＋** → Create Memory. Quick-capture = long-press / nút phụ → `QuickCaptureSheet` (1 ảnh + 1 dòng).
- **Coach overlay** (lần đầu sau onboarding): spotlight 3 bước (ô đất → nút + → mục tiêu vườn). Guard `coachSeen`. Replay qua "💡 Xem hướng dẫn".
- **Gating UI theo goal:**
  - Goal 1: chỉ vườn + CTA `Thêm kỷ niệm` + quest + Atlas preview nhẹ
  - Goal 2: thêm milestone gần nhất + quick-capture entry + progress rõ hơn
  - Goal 3: mới mở backup reminder / share shortcut / seasonal hook sâu hơn
- **State:** `plots, season, goalProgress, questProgress, backupReminderVisible, coachStep`.
- **Intent:** `TapPlot, TapEmptyPlot, OpenCreate, QuickCapture, DismissBackup, CoachNext/Skip/Replay`.
- **Effect:** `NavigateCreate, NavigatePlantDetail, PlayGrowthAnim`.

### 7.2 Create / Edit Memory
- Trước Goal 3, form mặc định là **minimal create**:
  - title hoặc 1 dòng mô tả
  - mood chips
  - category gợi ý
  - ảnh là tùy chọn, không bắt buộc
- Sau Goal 3 mới mở dần tags/metadata nâng cao.
- Edit: prefill từ `memoryId`. Delete: confirm 2 bước.
- **Lưu** → `CreateMemoryUseCase` → effect `PlayBloomBurst(plant, rarity)` → **về Garden**, ô mới `isFresh`.
- Gallery-seed (activation phase): EXIF date/location + ML Kit label → prefill category/title + dòng "AI nhận diện".

### 7.3 Atlas / Collection (Pokédex)
- Grid cây theo category; mỗi ô: sprite + `#dexNo` + `RarityStars`. Chưa unlock = silhouette mờ. Section seasonal-exclusive **riêng** (không tính % core).
- Progress overall (`ProgressRing`) + progress theo category + progress seasonal riêng.
- `NativeAdSlot` chèn giữa grid.
- Tap ô unlocked → Plant Detail. Tap locked → hint (hoặc demo `CatchReveal`).
- **Gating UI theo goal:**
  - Goal 1: preview nhẹ, chỉ vài ô đầu + progress ngắn
  - Goal 2: mở core đầy đủ + progress category + locked hint
  - Goal 3: mới mở filter sâu và seasonal detail dày hơn

### 7.4 Plant Detail
- Sprite lớn theo stage, tên, dex#, rarity, category, "Nở rộ mùa X · bloom [variant]". Liên kết memory gốc.
- Nếu seasonal trái mùa → nút **Out-of-season Seed** (Rewarded Ad). Nút Share card.

### 7.5 Timeline
- 3 tab: **Năm / Tháng / Hành trình cuộc đời**. Group memory theo thời gian.
- Năm: card "Tâm trạng năm nay" (mood distribution). Tháng: `recapCard` "AI Memory Recap — Sắp ra mắt" (Phase 2 stub). Life Journey: derive từ memories rare+ + milestones done.
- **Trước Goal 3:** không cho vào screen nội dung thật; thay bằng `locked informative state` với điều kiện mở + progress hiện tại.
- **Sau Goal 3:** mở Month/Year trước; Life Journey có thể degrade gracefully nếu data còn ít.

### 7.6 Milestones
- Grid huy hiệu (`MILESTONES`): emoji, tên, desc, progress bar, trạng thái done. First Memory / 10 / 100 / First Trip / First Date / Collector / Rare Hunter.

### 7.7 Settings
5 nhóm (theo PLAN.md):
1. Tài khoản & Gói — Pro upsell, Khôi phục mua hàng, → Customization.
2. Giao diện & Mùa — segment Cozy/Pixel, **Bán cầu Bắc/Nam** (đổi `currentSeason` +6 tháng), toggle Hiệu ứng môi trường (tắt particle).
3. Dữ liệu & Quyền riêng tư — Export/Import ZIP, → Backup, dung lượng, **Xóa toàn bộ dữ liệu** (danger, 2 bước).
4. Tiện ích & Thông báo — nhắc ghi chép hàng ngày, Widgets.
5. Chung & Hỗ trợ — Ngôn ngữ vi/en, Về app, Phản hồi, Xem lại Onboarding.
- **Gating UI theo goal:**
  - Goal 1: Theme, Language, Hemisphere, Replay onboarding
  - Goal 2: có thể thêm reminder cơ bản + particle FX
  - Goal 3: mới mở Backup/Restore, storage info, support, danger zone

### 7.8 Customization
Theme packs (Spring Meadow free, còn lại IAP $2.99) + Decorations (Fountain, Lantern, Sakura Set, Love Set...). Owned vs locked → trigger Billing.

### 7.9 Backup
Export ZIP (DB JSON + ảnh) qua SAF (`CreateDocument`). Import ZIP (`OpenDocument`). Hiển thị `lastBackupAt`, toggle nhắc. Google Drive = export thủ công (Share Sheet tới Drive). KHÔNG cloud-sync nền.

### 7.10 Onboarding (overlay 5 bước)
Theo [.planning/ONBOARDING.md](ONBOARDING.md): Welcome → Style → Seed (chạm mood → gieo) → First Bloom (anim 🌰→🌺 + confetti + reward) → Tour (Atlas/4 mùa/Widget) → đáp Garden. Skip mọi bước trừ bloom. Persist `onboarded` (DataStore). Cuối flow: gợi ý add Widget (`requestPinAppWidget`).

### 7.11 Share / Memory Card
Render card từ Composable → Bitmap (palette theo mùa + watermark "Memory Garden") → Share Sheet. Vào từ Memory detail + Garden.

### 7.12 Widgets (Glance)
`Recent Memory` (2×2), `Garden Progress` (4×2), `On This Day` (4×1). WorkManager refresh On-This-Day hàng ngày.

---

## 8. Monetization

- **App Open Ad** — cold start (sau onboarding, có frequency cap).
- **Native Ads** — card trong Atlas grid + Timeline list.
- **Rewarded Ads** — Mystery Seed, Rare Plant, Growth Boost, Random Decoration, **Out-of-season Seed**. `RewardedAdController` expose `showAd(): Flow<RewardResult>`.
- **IAP** — Lifetime Pro (unlimited memories, backup, premium widgets), Theme Packs, Decoration Packs. Play Billing. `proActive` flag gate tính năng.

---

## 9. PHASES — lộ trình code

> Mỗi phase ship được, test được. Thứ tự: nền tảng → core loop → activation → retention → monetization → polish.

### Phase 0 — Nền tảng (Foundation)
**Mục tiêu:** dự án chạy, theme + nav + DI sẵn sàng.
- Setup Gradle (Compose BOM stable mới nhất, Hilt, Room, DataStore, Coil, Nav3, Coroutines).
- `MemoryGardenApp` + `MainActivity` + Hilt.
- Design system: `MgTheme` (Cozy+Pixel token, CompositionLocal); component cơ bản token+Modifier (MgButton, MgCard, MgTopBar, MgBottomNav, MgChip).
- Nav3 host + 5 tab bottom nav (màn placeholder).
- MVI base class.
- **Done khi:** app build, đổi Cozy↔Pixel runtime (token reswap), nav 5 tab. Smoke: `MgButton` đổi look theo theme + state disabled/pressed.

### Phase 1 — Data & Domain core
**Mục tiêu:** lưu/đọc data thật, engine mùa + growth.
- Room: entities + DAO + DB + converters. Migration baseline.
- DataStore: Settings + Flags.
- Catalog tĩnh: 30-50 cây, Seasons, Categories, Moods, Milestones.
- `SeasonEngine` + `GrowthEngine` + repositories + use cases.
- **Unit test:** `seasonOf` (4 mùa + hemisphere Nam), `rollRarity` (first-memory = Rare+, additive +20%), `nextStage` cap.
- **Done khi:** test xanh, insert memory → unlock plant + grow plot ghi xuống Room.

### Phase 2 — Core loop (Memory → Garden → Atlas)
**Mục tiêu:** đường sống chính của app.
- **Create/Edit Memory** screen + VM, nhưng default flow phải là **minimal create** (không ép ảnh).
- **Garden** screen + VM (plots, progress ring, plant sprite theo stage).
- **Atlas** screen + VM (preview ở Goal 1, core ở Goal 2).
- **Plant Detail** + VM.
- Animation: `GrowthAnim` + `BloomBurst` khi tạo memory.
- **Done khi:** tạo memory → quay về Garden → thấy cây mọc/highlight → unlock ô Atlas → mở Plant Detail. Loop đóng.

### Phase 3 — Activation (Onboarding + First Bloom + Quest)
**Mục tiêu:** funnel `Install → First Memory → First Bloom → D1`.
- Onboarding overlay 5 bước + persist `onboarded`.
- First Bloom Guarantee (đã có ở GrowthEngine, wire vào onboarding seed).
- Gallery-seeded first memory (EXIF + ML Kit).
- 3-Memory Starter Quest (Garden) + Quick-capture sheet.
- Coach overlay sau onboarding (3 bước spotlight) + guard `coachSeen`.
- Timeline locked state + unlock progress.
- **Done khi:** lần mở đầu → onboarding → cây hiếm nở → đáp Garden có cây thật + coach guide → user biết Timeline tồn tại và biết cách mở.

### Phase 4 — Season System (retention layer)
**Mục tiêu:** mùa ambient + bonus additive.
- SeasonBanner + ParticleOverlay + season glow ambient (drive bởi `LocalSeasonTint`).
- Bloom variant theo mùa + plot glow cây hợp mùa.
- Atlas: badge mùa nở rộ + section seasonal-exclusive riêng + progress seasonal tách.
- Hemisphere toggle (Settings) → đổi `currentSeason`.
- **Done khi:** đổi tháng/hemisphere → vườn đổi palette/particle; mùa cộng +20% rare nhưng KHÔNG chặn growth; first bloom vẫn miễn nhiễm.

### Phase 5 — Timeline + Milestones + Settings + Customization
- Timeline 3 tab (Năm/Tháng/Life) + mood distribution card.
- Milestones grid + check progress khi tạo memory.
- Settings 5 nhóm (theme, hemisphere, particle, ngôn ngữ, danger zone wipe).
- Customization (theme packs + decorations, owned/locked).

### Phase 6 — Backup + Share + Widgets
- Export/Import ZIP (SAF) + backup reminder (WorkManager + DataStore `lastBackupAt`).
- Social Share / Memory Card (Compose→Bitmap→Share Sheet).
- Glance widgets: Recent Memory, Garden Progress, On This Day (+ WorkManager refresh).

### Phase 7 — Monetization
- AdMob init + App Open + Native (Atlas/Timeline) + Rewarded (Out-of-season Seed, Mystery Seed, Growth Boost).
- Play Billing: Lifetime Pro + Theme/Deco packs. `proActive` gate.
- Frequency cap + consent (UMP/GDPR).

### Phase 8 — Polish + đo + chuẩn release
- Firebase Analytics: log funnel `Install → First Memory → First Bloom → Catalog slot → D1`.
- Edge-to-edge, accessibility, adaptive (phone/tablet/fold).
- Performance (jank, baseline profile), R8 keep rules.
- Pre-release checklist (skill `pre-release`).

### Phase Sau (post-MVP)
- AI Memory Recap (Timeline tháng/năm — hiện stub "Sắp ra mắt").
- Memory-date season tinting (lớp B Timeline).
- Seasonal Event (Sakura Week). Cloud Sync / Account / Couple Garden — CHƯA làm.

---

## 10. Định nghĩa "Done" toàn cục (Success Criteria)
- D1 Retention > 35% · D7 > 12% · Rewarded usage > 25% · 1000+ MAU đầu.
- Core loop đo được qua Firebase funnel trước khi A/B test.

---

## 11. Tham chiếu mockup → Compose (map nhanh)
| Mockup (vanilla JS) | Compose |
|---|---|
| `ROUTES` + `scXxx()` | Nav3 destinations + Screen composables |
| `handleAct(act, dataset)` switch | `onIntent(Intent)` mỗi VM |
| Overlay listener trên `.phone` | Overlay composable phủ ngoài content (Box layer) |
| `data.js` catalog | `data/catalog/*.kt` tĩnh |
| `STATS` getter dẫn xuất | Flow combine derived, không lưu số cứng |
| `data-theme` + CSS vars | `MgTheme` token + CompositionLocal |
| CSS class component (`.btn`, `.card`, `.plot`...) | `Mg*` composable đọc token + `Modifier` (.background/.clip/.border) |
| `:hover` / `:active` / `[disabled]` CSS | `InteractionSource` + `collectIsPressedAsState` → `animate*AsState` |
| `currentSeasonId()` | `SeasonEngine.seasonOf(LocalDate.now(), hemisphere)` |
| `.phone::after` season glow | `LocalSeasonTint` + `Modifier.drawWithContent` |
```
