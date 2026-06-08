# ASSET SPEC — Memory Garden: Your Life Journey

> Đặc tả toàn bộ asset cần chuẩn bị để code app Android (Jetpack Compose): icon, sprite cây, ảnh, animation, audio.
> Đi kèm: [.planning/COMPOSE_SPEC.md](COMPOSE_SPEC.md) (kiến trúc) · [.planning/SEASON_SYSTEM.md](SEASON_SYSTEM.md) · catalog chuẩn: [js/data.js](../brainstorm/mockups/js/data.js).
> **Mục đích:** danh sách để chủ nhân chuẩn bị — tách rõ **Design tay** vs **Gen AI** vs **Code-drawn (0 asset)** + ưu tiên MVP/Phase 2.

---

## 0. Nguyên tắc asset (đọc trước)

1. **2 phong cách song song** — **Cozy** (pastel, bo tròn, soft shadow, vibe Animal Crossing/cottagecore) và **Pixel** (retro, viền đen 2-4px, hard shadow, palette giấy cũ, vibe Stardew/Pokémon, `image-rendering: pixelated`). Nhiều asset cần **2 bản**. **ĐÃ CHỐT: ship cả 2 style từ MVP** → x2 khối lượng (xem §15). Prompt gen sẵn cho cả 2: [.planning/ASSET_PROMPTS.md](ASSET_PROMPTS.md).
2. **Tối giản qua code, không qua asset:**
   - **Season bloom variant** (4 sắc theo mùa) = **tint trong code** (`ColorFilter`/`ColorMatrix`), KHÔNG render 4× sprite. (Chốt theo SEASON_SYSTEM §14: đổi tint, giữ hình.)
   - **Locked silhouette** (Atlas) = đổ màu đặc sprite bloom qua shader/tint trong code. 0 asset riêng.
   - **Glow cây hợp mùa**, particle, season ambient, confetti = vẽ bằng Compose Canvas/`drawBehind`. 0 asset.
3. **Density** — raster export @1x/2x/3x (mdpi→xxhdpi) hoặc 1 bản cao rồi để Coil downscale. Pixel art: export bội số nguyên (x4/x8), scale nearest-neighbor, **không** anti-alias.
4. **Format chuẩn** (chi tiết §17): UI icon → **Vector Drawable (.xml)**; sprite/ảnh → **WebP** (lossless cho pixel, lossy q80-90 cho cozy); animation → **Lottie (.json)** hoặc **sprite-sheet** (pixel) hoặc **Compose-drawn**; audio → **OGG**.
5. **Style guide bắt buộc trước khi gen hàng loạt** — 1 bộ token màu + 1 cây mẫu mỗi style làm reference, lock seed/palette để 34 cây đồng nhất (§16).

---

## 1. Branding & Play Store

| Asset | Số lượng | Format | Nguồn | MVP |
|---|---|---|---|---|
| App launcher icon (adaptive: foreground + background) | 1 bộ | Vector/PNG 432×432 | Design | ✅ |
| Play Store icon | 1 | PNG 512×512 | Design | ✅ |
| Feature graphic (Play) | 1 | PNG 1024×500 | Design + AI bg | ✅ |
| Phone screenshots (Play) | 4-8 | PNG | Chụp app | ✅ (lúc release) |
| Splash screen (logo + bg, dùng SplashScreen API) | 1 | Vector + color | Design | ✅ |
| Notification icon (monochrome) | 1 | Vector 24dp | Design | ✅ |
| Wordmark / logo "Memory Garden" (cho share card + onboarding) | 1 (+1 pixel) | Vector/PNG | Design | ✅ |

---

## 2. UI icons (system + actions)

→ **Nguồn: bộ Logify** (`D:/work/android/icon/logify`, style `linear` cho Cozy / `bold` cho Pixel-ish), convert sang Vector Drawable `ic_<name>.xml`. **Không gen AI** — dùng icon set có sẵn cho nhất quán + nhẹ.

Cần (tối thiểu):
- **Bottom nav (5):** garden/home, atlas/grid, add (＋ FAB), timeline/calendar, more/menu.
- **Action:** edit, delete/trash, share, camera, gallery/image, save/check, close/x, back, search, filter, settings/gear, info.
- **Settings/feature:** backup/cloud-export, download (import), theme/palette, season/leaf, bell/notification, language/globe, shield/privacy, store/cart (IAP), play (rewarded ad), star (rate), heart.
- **State/meta:** lock (locked plant), star (rarity — hoặc dùng asset riêng §4), trophy (milestone), calendar (on-this-day).

Ước ~28-32 icon. 1 bản vector tự đổi màu theme qua `tint`. (Pixel muốn icon vuông hơn → có thể lấy style `bold` Logify, +0 nếu chấp nhận dùng chung.)

---

## 3. Plant sprites — KHỐI LỚN NHẤT

34 loài (`p01`–`p34`, gồm 4 seasonal-exclusive `p31`–`p34`). Mỗi cây có **5 stage**: Seed → Sprout → Plant → Bloom → Rare Bloom.

### 3.1 Chiến lược (ĐÃ CHỐT: full 5 stage, cả 2 style)
- **Mỗi loài đủ 5 stage riêng**: Seed → Sprout → Plant → Bloom → Rare Bloom. KHÔNG dùng generic seed/sprout — mỗi cây có hình mầm đặc trưng (richer reveal, đỡ cảm giác lặp).
- **Season bloom variant** = tint code, **0 asset thêm** (giữ nguyên — chỉ đổi sắc, không render 4× sprite).
- **Rare Bloom** = sprite riêng (Bloom + chi tiết ornate/glow), KHÔNG chỉ overlay FX — đáng tiền cho moment "rare".

### 3.2 Số lượng (ĐÃ CHỐT)
| Path | Công thức | Sprite (1 style) | **Cả 2 style (CHỐT)** |
|---|---|---|---|
| **Full 5 stage × 2 style** ✅ | 34×5 | 170 | **340** |

→ **CHỐT: full 5 stage, cả Cozy + Pixel = 340 sprite.** Đây là khối lớn nhất → bắt buộc lock style reference (§16) trước khi gen loạt. Prompt từng cây: [.planning/ASSET_PROMPTS.md](ASSET_PROMPTS.md) §2.

### 3.3 Spec mỗi sprite
- Khung vuông, nền trong suốt. Cozy: ~512×512 PNG/WebP. Pixel: 64×64 hoặc 96×96 art, export x4.
- Tâm cây canh giữa-đáy (mọc từ đất). Cùng baseline để xếp lưới Atlas + plot vườn.
- Đặt tên: `plant_<id>_<stage>.webp` vd `plant_p01_plant.webp`, `plant_p15_rare.webp`. Generic: `stage_seed.webp`, `stage_sprout.webp` (hoặc `stage_sprout_<cat>.webp`).
- 34 loài + emoji/cat/rarity tham chiếu chuẩn trong [data.js](../brainstorm/mockups/js/data.js) `PLANTS`.

→ **Nguồn: Gen AI** (style guide §16) + design tay chỉnh lại 4 legendary + 4 seasonal cho "đắt".

---

## 4. Category · Mood · Rarity

| Nhóm | Số | Nội dung | Format | Nguồn | MVP |
|---|---|---|---|---|---|
| Category icon | 6 | Adventure 🏕️ · Food 🍜 · Relationship 💞 · Entertainment 🎬 · Growth 📚 · Milestones 🎉 | Vector/sprite nhỏ | Logify hoặc AI minh hoạ | ✅ |
| Mood icon | 6 | joy 😄 · calm 😌 · moved 🥹 · sad 😢 · hyped 🔥 · tired 😴 (màu trong `MOODS`) | Vector | Logify / design | ✅ |
| Rarity badge/frame | 4 | Common·Rare·Epic·Legendary (1-4 sao, màu trong `RARITY`) | Vector frame + star | Design | ✅ |
| Rarity star icon | 1-2 | sao đầy/rỗng | Vector | Design | ✅ |

Màu chuẩn: `CATEGORIES[].color`, `MOODS[].color`, `RARITY[].color` trong data.js. Ban đầu có thể xài emoji (như mockup) để ship nhanh, thay asset sau.

---

## 5. Season visuals (4 mùa)

| Asset | Số | Ghi chú | Nguồn | MVP |
|---|---|---|---|---|
| Particle sprite | 4 | 🌸 cánh hoa / ✨ tia nắng / 🍂 lá / ❄️ tuyết — hoặc **vẽ code** (Canvas) | AI sprite **hoặc** Code-drawn | ✅ |
| Season banner art | 4 | nền banner mỗi mùa (weather + tint) | AI | ✅ |
| Season ambient tint | 0 | `--season-tint` overlay — **code** (`drawWithContent`) | Code | ✅ |
| Weather/emoji badge | 4 | 🌦️☀️🍁🌨️ | emoji/vector | ✅ |
| Plot glow cây hợp mùa | 0 | **code** glow additive | Code | ✅ |

Mùa/affinity/tint/particle chuẩn trong `SEASONS` (data.js). Particle: nếu vẽ code (đề xuất) thì chỉ cần 4 sprite nhỏ optional cho cánh hoa/lá chi tiết.

---

## 6. Garden environment & Theme packs

| Asset | Số | Ghi chú | Nguồn | MVP |
|---|---|---|---|---|
| Ground / plot tile (ô đất) | 1-2/style | ô trống "tap to plant" + ô có cây | AI/Design | ✅ |
| Garden background (mặc định) | 1/style | nền vườn (cozy: pastel grass; pixel: conic-gradient grass tile) | AI/Design | ✅ |
| **Theme Pack backgrounds (IAP)** | 5 | Spring Meadow (free) · Japanese Garden · Fantasy Garden · Romantic Garden · Pixel Garden | AI | Free pack ✅, còn lại Phase 7 |
| Garden frame/border (pixel console look) | 1 | viền vườn pixel | Design | Pixel only |

Theme pack chuẩn trong `THEME_PACKS`. Pixel grass = tile 36px lặp (đã có công thức mockup) → có thể code-drawn.

---

## 7. Decorations (IAP)

6 vật trang trí (`DECORATIONS`): Fountain ⛲ · Lantern 🏮 · Sakura Set 🌸 · Love Set 💝 · Stone Path 🪨 · Bird Bath 🐦.

- 1 sprite/decoration (×2 nếu cả 2 style) = 6 hoặc 12.
- Nền trong suốt, đặt chồng lên garden bg. Naming `deco_<id>.webp`.
- Sakura Set / Love Set có thể animation nhẹ (cánh rơi) → Phase 2.
- **Nguồn: Gen AI** + design chỉnh. **MVP:** owned mặc định Fountain+Lantern (như mockup) → cần tối thiểu 2; còn lại Phase 7 (monetization).

---

## 8. Milestone badges

9 huy hiệu (`MILESTONES`): First Memory 🌱 · First Bloom 🌸 · 10/100 Memories 🪴🌳 · First Trip ✈️ · First Date 💕 · Collector I/II 🏆🥇 · Rare Hunter 🌺.

- 1 badge art/milestone (locked = xám). 9 sprite (×2 style optional).
- Format vector ưu tiên (scale tốt). Naming `badge_<id>.webp`/`.xml`.
- **Nguồn:** Design tay (badge cần đồng bộ visual) hoặc AI + chỉnh. MVP ✅ (có thể emoji trước).

---

## 9. Onboarding & Coach

| Asset | Số | Ghi chú | Nguồn | MVP |
|---|---|---|---|---|
| Welcome hero (cây nảy mầm loop 🌱→🌺) | 1 | **Animation** — Lottie hoặc sprite-sheet | AI concept + Lottie | ✅ |
| Style picker preview (Cozy/Pixel thumb) | 2 | ảnh preview mỗi style | Chụp app/Design | ✅ |
| Tour mini-cards (Atlas / 4 mùa / Widget) | 3 | minh hoạ nhỏ | AI | ✅ |
| Reward art (🏆 First Memory + 🎁 Rare Seed) | 2 | badge + gift | Design | ✅ |
| Coach spotlight | 0 | **code** (khoét sáng + tooltip) | Code | ✅ |

Flow chuẩn: [.planning/ONBOARDING.md](ONBOARDING.md).

---

## 10. Share / Memory Card

| Asset | Số | Ghi chú | Nguồn | MVP |
|---|---|---|---|---|
| Card template/frame (memory + garden) | 2 | layout render Compose→Bitmap | Design | ✅ |
| Watermark logo "Memory Garden" | 1 | góc card | Design (§1) | ✅ |
| Season tint overlay cho card | 0 | **code** theo mùa | Code | ✅ |

Card render bằng Compose (palette theo mùa) → chủ yếu cần frame + logo, phần còn lại dựng từ data.

---

## 11. Widgets (Glance)

3 widget (`WIDGETS`): Recent Memory (2×2) · Garden Progress (4×2) · On This Day (4×1).

- Background/frame mỗi widget (×2 style optional) = 3-6.
- Preview image cho widget picker = 3.
- Phần lớn dựng bằng Glance composable + token màu → asset tối thiểu (frame/bg + preview). MVP ✅.

---

## 12. Animations

| Animation | Khi nào | Format đề xuất | Nguồn | MVP |
|---|---|---|---|---|
| **Growth** (seed→sprout→plant→bloom→rare) | tạo memory, cây lớn 1 stage | sprite-sheet (pixel) / Lottie (cozy) / crossfade+scale code | AI+Lottie / Code | ✅ |
| **Bloom Burst** (nở hoa + tỏa sáng) | first bloom, mỗi lần bloom | Lottie + Compose particle | AI/Lottie + Code | ✅ |
| **Catch Reveal** (Pokédex mở khóa loài) | unlock cây mới ở Atlas | Lottie + sprite | AI/Lottie | ✅ |
| **Confetti** | reward, milestone | **Compose-drawn** (Canvas) | Code | ✅ |
| Onboarding hero loop | màn Welcome | Lottie/sprite-sheet | AI/Lottie | ✅ |
| Season particle (rơi) | Garden theo mùa | **Compose-drawn** | Code | ✅ |
| Season ambient glow ("app thở") | toàn màn | **Compose-drawn** | Code | ✅ |
| FAB / tap / nav transition | tương tác | Compose `animate*AsState` | Code | ✅ |
| Empty plot pulse ("tap to plant") | ô trống | Compose-drawn | Code | ✅ |
| Decoration idle (fountain nước, cánh sakura) | trang trí | Lottie | AI/Lottie | Phase 2 |

**Nguyên tắc:** ưu tiên **Compose-drawn** cho particle/glow/confetti/transition (nhẹ, 0 asset, theo token). Chỉ dùng **Lottie/sprite-sheet** cho animation phức (growth, bloom burst, catch, hero). Pixel → sprite-sheet hợp hơn Lottie.

---

## 13. Audio

> Local-first, đóng gói trong app. Giữ nhẹ (OGG, mono cho SFX). Tất cả phải toggle tắt được (Settings) + tôn trọng silent mode.

### 13.1 Nhạc nền (BGM) — loop
| Track | Dùng | MVP |
|---|---|---|
| Ambient vườn (1 loop chung) | Garden | ✅ (nếu kịp) |
| 4 biến thể theo mùa (Xuân/Hạ/Thu/Đông) | Garden ambient | Phase 2 |

→ Loop liền mạch, ~30-60s, OGG. **Nguồn: Gen AI (Suno/Udio)** hoặc nhạc royalty-free. **Kiểm tra license kỹ.**

### 13.2 SFX (one-shot, ngắn <1s)
| SFX | Trigger | MVP |
|---|---|---|
| plant_seed | gieo hạt / tạo memory | ✅ |
| grow_pop | cây lên stage | ✅ |
| bloom_chime | nở hoa | ✅ |
| rare_fanfare | rare/legendary bloom | ✅ |
| unlock_catch | mở khóa loài (Atlas) | ✅ |
| milestone_win | đạt cột mốc | ✅ |
| reward_get | rewarded ad reward | ✅ |
| tap/click UI | nút | ✅ (tùy) |

~7-8 SFX. **Nguồn: AI/SFX library** (freesound, royalty-free). OGG mono.

→ **Audio = nên-có, không chặn MVP loop.** Có thể ship V1 không audio, thêm sau. Phải có toggle "Âm thanh/Nhạc" trong Settings nhóm 4.

---

## 14. Empty states & misc

| Asset | Số | Ghi chú | Nguồn | MVP |
|---|---|---|---|---|
| Empty garden illustration | 1/style | vườn chưa có cây | AI | ✅ |
| Empty timeline | 1 | chưa có memory | AI | ✅ |
| Empty atlas hint | 0 | dùng silhouette grid (code) | Code | ✅ |
| Error/permission illustration | 1 | gallery permission denied | AI | nên có |
| Backup reminder illustration | 1 | banner nhắc | AI | nên có |

---

## 15. Tổng hợp số lượng (để ước công)

| Hạng mục | MVP — cả 2 style (ĐÃ CHỐT) | Phase 2/7+ |
|---|---|---|
| Branding/Store | ~8 (logo/icon +1 bản pixel) | screenshots |
| UI icon (Logify, vector) | ~30 (linear Cozy + bold Pixel, dùng chung tint) | — |
| **Plant sprite (full 5 stage × 2 style)** | **340** | legendary anim |
| Category/Mood/Rarity | ~17-34 | — |
| Season visual | ~12 (đa số code) | event art |
| Garden bg + theme pack | ~6 (default ×2) | 4 IAP pack ×2 = 8 |
| Decorations | 4 (Fountain+Lantern ×2) | đủ 6 ×2 = 12 |
| Milestone badge | ~18 (9 ×2) | — |
| Onboarding/Coach | ~10 | — |
| Share card | ~4 | — |
| Widget | ~9 | — |
| **Animation** | ~8 phức (×2 style) + nhiều code-drawn | decoration idle |
| **Audio (theo đề xuất)** | ~8 SFX + 1 BGM ambient chung | 4 BGM theo mùa |

**Điểm nóng:** plant sprite (**340**) = ~85% khối lượng → bắt buộc lock 2 style reference (§16) + AI pipeline batch trước. Mọi thứ "Code-drawn" = 0 asset, lập trình thẳng. Audio: SFX vào MVP (optional, không chặn loop), BGM ambient 1 loop chung MVP, 4 BGM mùa để Phase 2.

---

## 16. Hướng dẫn Gen AI (style guide + pipeline)

### 16.1 Lock style trước khi gen hàng loạt
1. Chốt **palette** (lấy từ token: cozy primary `#5fa86b` pastel / pixel `#3aa655` + viền `#2b2233`).
2. Vẽ/gen **1 cây mẫu** mỗi style ở cả 3 stage (plant/bloom/rare) → **reference sheet**. Mọi cây sau bám reference (cùng góc nhìn, ánh sáng, độ dày nét, bóng đổ).
3. Khóa **seed/style** (nếu Midjourney `--sref` / SDXL seed + LoRA) để 34 cây đồng nhất.

### 16.2 Prompt template
- **Cozy:** "cute cottagecore [plant name], soft pastel palette, rounded shapes, soft shadow, flat illustration, centered, transparent background, game asset, consistent lighting".
- **Pixel:** "16-bit pixel art [plant name], Stardew Valley style, limited retro palette, bold dark outline, [64x64] sprite, transparent background, centered, no anti-aliasing".
- Thêm modifier theo rarity: legendary → "glowing, ornate, magical aura"; common → "simple, small".

### 16.3 Công cụ gợi ý
- Ảnh tĩnh/sprite: Midjourney (`--sref` giữ style) / SDXL + LoRA (kiểm soát tốt + seed lặp) / DALL·E.
- Pixel art: Aseprite (chỉnh tay sau AI) — bắt buộc cho pixel sạch.
- Animation vector: gen frame → ghép Lottie (LottieFiles/After Effects + Bodymovin), hoặc Rive.
- Background nhạc nền: Suno/Udio. SFX: freesound + chỉnh.
- **Tách nền:** remove.bg / SAM cho sprite trong suốt.

### 16.4 Hậu kỳ bắt buộc
- Crop + canh baseline thống nhất (script batch).
- Export WebP đa density / sprite-sheet đúng grid.
- Pixel: scale nearest-neighbor bội số nguyên, kiểm tra không lẫn màu rìa.
- Đặt tên đúng convention §17 để code map thẳng từ `data.js` id.

### 16.5 Tách nguồn (ai làm gì)
| Loại | Design tay | Gen AI | Code-drawn |
|---|---|---|---|
| App icon, logo, badge, rarity frame, card frame | ✅ | hỗ trợ | |
| UI icon | (Logify) | | |
| Plant sprite (34×3) | chỉnh legendary/seasonal | ✅ chính | |
| Backgrounds, theme pack, empty-state, banner | hỗ trợ | ✅ | |
| Particle, glow, confetti, silhouette, season tint, transition | | | ✅ |
| Growth/bloom/catch/hero anim | concept | ✅ frame | ghép Lottie |
| BGM, SFX | | ✅ (license!) | |

---

## 17. Convention — format · density · folder · naming

### 17.1 Format theo loại
| Loại | Format | Lý do |
|---|---|---|
| UI icon, badge, rarity, logo mono | **Vector Drawable .xml** | scale vô hạn, tint theo theme, nhẹ |
| Plant sprite, decoration, bg, illustration | **WebP** (lossless pixel / lossy q85 cozy) | nhỏ hơn PNG, Coil load tốt |
| Animation phức | **Lottie .json** (vector) / **sprite-sheet WebP** (pixel) | |
| Particle/glow/confetti | **Compose Canvas** (không file) | |
| Audio | **OGG Vorbis** (mono SFX, stereo BGM) | Android-native, nhỏ |

### 17.2 Folder
```
app/src/main/
  res/drawable/            ic_*.xml (UI icon), badge vector, splash, notification
  res/raw/                 anim_*.json (Lottie), sfx_*.ogg, bgm_*.ogg
  assets/art/cozy/         plant_*, deco_*, bg_*, stage_*  (WebP)  ← Coil load
  assets/art/pixel/        (bản pixel, nếu làm)
  assets/sheets/           growth_*, catch_* sprite-sheet (pixel)
```
> Sprite cây nhiều (~100+) → để `assets/` load qua Coil, KHÔNG nhét hết vào `res/drawable` (tránh phình APK index + build chậm). Theme tách folder `cozy/`/`pixel/`, chọn runtime theo `appTheme`.

### 17.3 Naming (map thẳng id trong data.js)
```
plant_<plantId>_<stage>.webp      plant_p01_plant.webp · plant_p15_rare.webp
stage_<seed|sprout>[_<cat>].webp  stage_seed.webp · stage_sprout_food.webp
deco_<decoId>.webp                deco_d1.webp
bg_theme_<themeId>.webp           bg_theme_t2.webp
badge_<milestoneId>.xml           badge_ms1.xml
ic_<name>.xml                     ic_garden.xml · ic_share.xml
season_particle_<seasonId>.webp   season_particle_spring.webp
anim_<name>.json                  anim_bloom_burst.json
sfx_<name>.ogg / bgm_<name>.ogg   sfx_bloom_chime.ogg · bgm_spring.ogg
```

---

## 18. Pipeline đề xuất (thứ tự chuẩn bị)

1. **Lock branding + token màu** (icon, logo, palette 2 style).
2. **Style reference sheet** — 1 cây mẫu × 3 stage × style đã chọn. Duyệt rồi mới gen loạt.
3. **Gen 34 plant sprite** (path tiết kiệm, 1 style) — đợt lớn nhất.
4. **UI icon từ Logify** (song song, độc lập).
5. **Category/Mood/Rarity/Badge** (hoặc tạm emoji để code trước).
6. **Garden bg + plot + season particle** (hoặc code-drawn particle trước).
7. **Animation:** code-drawn (particle/confetti/glow) làm ngay khi code; Lottie (growth/bloom/catch/hero) gen sau khi có sprite.
8. **Audio** — cuối, không chặn loop. SFX trước, BGM sau.
9. **Style thứ 2 (Pixel) + theme pack + decoration đầy đủ + BGM mùa** → Phase 2/7.

**Quyết định đã CHỐT (2026-06-08):**
- (a) ✅ **Cả 2 style** (Cozy + Pixel) ngay từ MVP.
- (b) ✅ **Full 5 stage** mỗi loài (không generic seed/sprout).
- (c) ✅ **Audio theo đề xuất** — SFX optional MVP + 1 BGM ambient chung; 4 BGM mùa để Phase 2.

→ Hệ quả: plant sprite = **340** (34 × 5 stage × 2 style). Prompt AI sẵn dùng: [.planning/ASSET_PROMPTS.md](ASSET_PROMPTS.md).
