# ASSET PROMPTS — Memory Garden (AI gen-ready)

> Prompt sẵn dùng để gen toàn bộ asset bằng AI (Midjourney / SDXL / DALL·E / Suno).
> Quyết định đã chốt: **cả 2 style (Cozy + Pixel)** · **full 5 stage** · **SFX MVP + BGM ambient, 4 BGM mùa Phase 2**.
> Nguồn sự thật catalog: [../brainstorm/mockups/js/data.js](../brainstorm/mockups/js/data.js) · spec: [ASSET_SPEC.md](ASSET_SPEC.md).
> Prompt viết **tiếng Anh** (model gen chính xác hơn). Phần giải thích tiếng Việt.

---

## 0. Cách dùng (đọc trước)

### 0.1 Công thức ghép prompt cho plant sprite
```
[STYLE BASE] + [PLANT SUBJECT §2.3] + [STAGE MODIFIER §2.1] + [RARITY MODIFIER §2.2] + [TECH SUFFIX]
```
Ví dụ cây `p08 Mocha Tree`, stage Bloom, Cozy:
> *cute cottagecore illustration of a small coffee tree with glossy red coffee cherries and a tiny ceramic mug motif, in full bloom with delicate white coffee flowers, rare-tier slightly ornate, soft pastel palette (#5fa86b base), rounded shapes, soft drop shadow, flat vector game asset, centered, plain transparent background, consistent top-down-front 3/4 angle, even soft lighting --no text, watermark, frame, ground, pot unless described*

### 0.2 Quy trình bắt buộc (tránh 340 sprite lệch nhau)
1. Gen **2 reference sheet** trước (§1) — 1 cây mẫu × 5 stage cho **mỗi** style. Duyệt OK mới gen loạt.
2. Khóa style: Midjourney `--sref <url ref>` + `--sw 100` · hoặc SDXL seed cố định + LoRA.
3. Gen theo **batch từng style** (xong hết Cozy rồi qua Pixel) — đừng trộn, dễ trôi style.
4. Hậu kỳ: tách nền (remove.bg/SAM) → crop canh baseline đáy → export WebP đa density. Pixel: scale nearest-neighbor bội số nguyên.
5. Đặt tên đúng convention: `plant_<id>_<stage>.webp` (xem ASSET_SPEC §17.3).

### 0.3 Palette khóa (dán vào mọi prompt)
- **Cozy:** primary green `#5fa86b`, kem `#fdfaf3`, accent theo category. Soft pastel, low saturation, no harsh contrast.
- **Pixel:** green `#3aa655`, outline đen `#2b2233` (2-4px), retro 16-bit limited palette, paper-aged background tone, hard 1px shadow.

### 0.4 Negative / `--no` chung (mọi sprite)
```
--no text, letters, watermark, signature, frame, border box, multiple objects, cropped, blurry, photorealistic, 3d render, drop shadow on background, busy background
```
(SDXL/DALL·E: chuyển thành câu "no text, no watermark, plain transparent background, single centered subject…")

---

## 1. STYLE REFERENCE SHEET (gen ĐẦU TIÊN — lock style)

Dùng cây mẫu **p11 Heart Rose** (đơn giản, dễ nhận 5 stage). Gen 1 sheet/style, 5 ô ngang = 5 stage.

### 1.1 Cozy reference
> *Reference sheet, 5 growth stages of a rose plant in a horizontal row labeled seed, sprout, young plant, bloom, rare bloom — left to right showing: a brown seed in soil mound, a tiny green sprout with two leaves, a small leafy rose plant with buds, a rose in full red bloom, an ornate glowing rare red rose with sparkles. Cute cottagecore flat vector illustration, soft pastel palette base #5fa86b, rounded shapes, gentle soft shadow, consistent 3/4 front angle, even soft lighting, each on plain white background, game asset style.*

### 1.2 Pixel reference
> *Reference sheet, 5 growth stages of a rose plant in a horizontal row: brown seed in soil, green two-leaf sprout, small rose plant with buds, full red rose bloom, ornate glowing rare rose. 16-bit pixel art, Stardew Valley style, limited retro palette, bold dark outline #2b2233 (3px), hard 1px shadow, 64x64 per sprite, no anti-aliasing, centered, plain background, consistent angle and lighting.*

→ Duyệt: 5 stage phải **đọc được tiến triển** (nhỏ→lớn→nở→hiếm), nét/bóng/góc đồng nhất. OK rồi mới sang §2.

---

## 2. PLANT SPRITES (340 — khối lớn nhất)

### 2.1 STAGE MODIFIER (chèn vào mọi cây)
| Stage | File suffix | Modifier (Cozy) | Modifier (Pixel) |
|---|---|---|---|
| 0 Seed | `_seed` | *a single seed half-buried in a small mound of soil, no plant visible yet, tiny* | *brown seed in soil pixels, minimal* |
| 1 Sprout | `_sprout` | *a tiny fresh green sprout with two small cotyledon leaves emerging from soil* | *small green sprout, 2 leaf pixels* |
| 2 Plant | `_plant` | *a small young leafy plant, recognizable species, healthy green, no flowers yet* | *young plant sprite, species silhouette readable* |
| 3 Bloom | `_bloom` | *the plant in full bloom, flowers/fruit open and vibrant, lush* | *plant in bloom, vibrant flower pixels* |
| 4 Rare Bloom | `_rare` | *the plant in a spectacular rare bloom, ornate, larger flowers, soft magical glow and sparkle particles* | *ornate rare bloom, glowing outline, sparkle pixels* |

### 2.2 RARITY MODIFIER (theo cột rarity trong data.js)
- `common` → *simple, small, modest* 
- `rare` → *slightly refined, a bit larger, subtle accent color*
- `epic` → *elaborate, richer detail, faint aura*
- `legendary` → *majestic, ornate, glowing magical aura, premium centerpiece*
- `seasonal` (p31–p34) → thêm sắc mùa: spring=*soft pink petals*, summer=*golden warm glow*, autumn=*amber-red foliage*, winter=*frost/icy silver sheen*

### 2.3 PLANT SUBJECT — 34 cây (ghép với base + stage + rarity)

> Cột "Subject EN" = mệnh đề chủ thể dán vào công thức §0.1. Rarity/seasonal lấy từ data.js.

#### Adventure 🏕️ (xanh `#5fa86b`)
| id | Tên | Rarity | Subject EN (chủ thể) |
|---|---|---|---|
| p01 | Wander Fern | common | *a wandering forest fern with curling fronds, wanderlust travel vibe* |
| p02 | Beach Lily | common | *a coastal beach lily, white-yellow petals, sandy seaside vibe* |
| p03 | Summit Pine | rare | *a small alpine pine tree on a rocky summit, mountaineering vibe* |
| p04 | Nomad Cactus | rare | *a round desert cactus with a single bright flower, nomad/travel vibe* |
| p05 | Aurora Bloom | legendary | *a legendary flower whose petals shimmer with aurora borealis colors, ethereal* |
| p29 | Dawn Poppy | epic | *a delicate poppy glowing with warm dawn sunrise light* |

#### Food & Drink 🍜 (cam `#e8945a`)
| id | Tên | Rarity | Subject EN |
|---|---|---|---|
| p06 | Bean Sprout | common | *a fresh culinary bean sprout, edible green shoots* |
| p07 | Chili Vine | common | *a chili pepper vine with small red hot peppers* |
| p08 | Mocha Tree | rare | *a small coffee tree with glossy red coffee cherries, tiny ceramic mug motif* |
| p09 | Sugar Blossom | epic | *a whimsical candy-sugar blossom, pastel frosting-like petals, dessert vibe* |
| p10 | Feast Lotus | legendary | *a majestic golden lotus on a feast platter, abundance vibe, glowing* |
| p30 | Mystery Bud | epic | *a mysterious tightly closed glowing bud with a question-mark silhouette, unknown species* |

#### Relationship 💞 (hồng `#e06a8b`)
| id | Tên | Rarity | Subject EN |
|---|---|---|---|
| p11 | Heart Rose | common | *a classic red rose, heart-shaped petals, love vibe* |
| p12 | Date Tulip | common | *a single sweet tulip, soft romantic colors* |
| p13 | Vow Orchid | rare | *an elegant orchid, refined romantic vibe* |
| p14 | Gift Hibiscus | epic | *a vivid hibiscus flower wrapped with a tiny ribbon, gift vibe* |
| p15 | Eternal Sakura | legendary | *a legendary eternal cherry-blossom branch in endless pink bloom, glowing petals* |

#### Entertainment 🎬 (tím `#7a6cd6`)
| id | Tên | Rarity | Subject EN |
|---|---|---|---|
| p16 | Reel Ivy | common | *a climbing ivy vine with leaves shaped like film-reel frames* |
| p17 | Stage Sunflower | rare | *a bright sunflower lit like a spotlight on a stage* |
| p18 | Otaku Maple | rare | *a stylized maple sapling with anime-manga sparkle, otaku vibe* |
| p19 | Pixel Bonsai | epic | *a tiny bonsai tree rendered with a retro pixel-art motif, gamer vibe* |
| p20 | Encore Bloom | legendary | *a legendary glowing flower radiating concert stage-light beams, encore vibe* |

#### Personal Growth 📚 (xanh dương `#4b9fd4`)
| id | Tên | Rarity | Subject EN |
|---|---|---|---|
| p21 | Page Clover | common | *a small four-leaf clover with leaves like tiny open book pages* |
| p22 | Study Bamboo | rare | *a slender stalk of bamboo, calm study/discipline vibe* |
| p23 | Wisdom Oak | epic | *a sturdy young oak tree, wisdom and knowledge vibe* |
| p24 | Mind Lotus | legendary | *a serene meditation lotus glowing with calm enlightenment aura* |

#### Life Milestones 🎉 (vàng `#d4af37`)
| id | Tên | Rarity | Subject EN |
|---|---|---|---|
| p25 | Cake Daisy | common | *a cheerful daisy with a tiny birthday-candle motif at its center* |
| p26 | Cap Laurel | rare | *a laurel-wreath plant with a small graduation-cap motif* |
| p27 | Home Maple | epic | *a warm maple tree beside a tiny house motif, new-home vibe* |
| p28 | Legacy Tree | legendary | *a grand majestic legacy tree with sprawling glowing canopy, lifetime achievement vibe* |

#### Seasonal-exclusive 🌟 (p31–p34 — thêm RARITY seasonal §2.2)
| id | Tên | Rarity | Mùa | Subject EN |
|---|---|---|---|---|
| p31 | Sakura Spirit | legendary | spring | *a spirit-like cherry blossom tree, translucent glowing pink petals drifting, mystical spring deity vibe* |
| p32 | Sunfire Lily | epic | summer | *a fiery lily with petals like flickering summer flames, radiant golden glow* |
| p33 | Maple Ember | epic | autumn | *a maple sapling whose leaves glow like burning embers, autumn dusk vibe* |
| p34 | Frost Orchid | legendary | winter | *a crystalline orchid encased in delicate frost, glowing icy silver-blue, winter solstice vibe* |

### 2.4 TECH SUFFIX (cuối mỗi prompt)
- **Cozy:** `flat vector game asset, centered bottom-baseline, plain transparent background, consistent 3/4 front angle, even soft lighting, 512x512 --no text watermark frame ground`
- **Pixel:** `16-bit pixel art, bold dark outline, hard 1px shadow, 64x64 sprite scaled x8, no anti-aliasing, centered bottom-baseline, plain background --no text watermark blur`

---

## 3. BRANDING & PLAY STORE

| Asset | Prompt |
|---|---|
| **Launcher icon (Cozy)** | *App icon for a cozy garden journal app called Memory Garden, a single rounded sprout/seedling inside a soft pastel rounded square, gradient green #5fa86b to cream, soft shadow, flat modern mobile icon, centered, no text* |
| **Launcher icon (Pixel)** | *App icon, 16-bit pixel-art green sprout in a small pot, bold dark outline, retro game cartridge vibe, limited palette, centered, no text* |
| **Wordmark / logo** | *Logo wordmark "Memory Garden", warm rounded friendly serif/sans, a small sprout replacing the dot/leaf accent, pastel green and cream, flat vector, transparent background* (+1 bản pixel-font) |
| **Feature graphic 1024×500** | *Play Store feature graphic for Memory Garden: a lush cozy illustrated garden with diverse stylized flowers in bloom, soft pastel sky, gentle sunlight, ample empty space on the left for app title text, flat illustration, inviting and warm* |
| **Splash bg** | *Minimal splash background, soft pastel green-to-cream vertical gradient, a faint centered sprout silhouette, calm and clean, no text* |
| **Notification icon** | *Monochrome 24dp notification icon, simple single sprout/leaf glyph, solid white silhouette, flat, no detail* |

---

## 4. SEASON BANNER ART (4 — gen cả 2 style)

Mỗi mùa 1 banner nền (weather + tint). Tham chiếu `SEASONS` data.js.

| Mùa | Prompt (Cozy; Pixel = thêm "16-bit pixel art, bold outline, limited palette") |
|---|---|
| Spring 🌸 | *Wide banner background, soft spring garden, blooming pink cherry blossoms and fresh green shoots, drifting petals, pastel pink tint #f7b8d2, gentle morning light, flat illustration, no text, space for overlay* |
| Summer ☀️ | *Wide banner, vibrant summer garden under bright sun, lush green, sparkling warm sunlight, golden tint #ffd24a, cheerful, flat illustration, no text* |
| Autumn 🍂 | *Wide banner, cozy autumn garden, falling amber-red maple leaves, warm harvest mood, orange tint #e0913f, soft dusk light, flat illustration, no text* |
| Winter ❄️ | *Wide banner, quiet winter garden, gentle falling snow, frosted plants, cool silver-blue tint #8fb8de, serene calm, flat illustration, no text* |

→ Particle (cánh hoa/lá/tuyết rơi) **vẽ code** (Compose Canvas) — chỉ gen 4 sprite nhỏ optional nếu muốn cánh chi tiết: *single [cherry petal / sun spark / maple leaf / snowflake], small, transparent background, [style]*.

---

## 5. GARDEN BG + THEME PACKS

| Asset | Prompt |
|---|---|
| **Default garden bg (Cozy)** | *Seamless cozy garden ground background, soft pastel grass, gentle rolling texture, top-down-ish, calm, tileable, flat illustration, no objects* |
| **Default garden bg (Pixel)** | *Seamless 16-bit pixel grass tile for a farming game, Stardew Valley style, limited green palette, subtle texture, tileable 36px* |
| **Plot tile (ô đất)** | *A single empty garden soil plot tile, "tap to plant" inviting, soft brown tilled soil, [Cozy rounded / Pixel bold-outline], transparent edges* |
| **t1 Spring Meadow (free)** | *Garden background, lush spring meadow with wildflowers, pastel, dreamy* |
| **t2 Japanese Garden** | *Garden background, serene Japanese zen garden, raked sand, stone lantern, koi pond, cherry tree, muted elegant palette* |
| **t3 Fantasy Garden** | *Garden background, magical fantasy garden, glowing mushrooms, floating lights, enchanted whimsical, soft purple-teal palette* |
| **t4 Romantic Garden** | *Garden background, romantic rose garden, soft pink hues, heart motifs, warm sunset glow* |
| **t5 Pixel Garden** | *Garden background, retro 16-bit pixel farm garden, console-game look, bold outline, nostalgic palette* |

---

## 6. DECORATIONS (6 — nền trong suốt, đặt chồng)

| id | Prompt (chủ thể; ghép style base) |
|---|---|
| d1 Fountain | *a small charming garden fountain with trickling water* |
| d2 Lantern | *a warm glowing paper garden lantern on a post* |
| d3 Sakura Set | *a decorative cluster of cherry-blossom branches with drifting petals* |
| d4 Love Set | *a romantic decoration set, heart-shaped topiary and small string lights* |
| d5 Stone Path | *a short winding stone stepping-path segment* |
| d6 Bird Bath | *a quaint stone bird bath with a tiny bird* |

→ `--no background`, single object centered, transparent. Sakura/Love Set có thể anim nhẹ → Phase 2 (gen sprite-sheet cánh rơi).

---

## 7. ONBOARDING & TOUR

| Asset | Prompt |
|---|---|
| **Welcome hero** (anim concept frames) | *A seed sprouting and blooming into a beautiful flower, 4 keyframes: seed → sprout → bud → full radiant bloom with sparkles, cozy pastel flat illustration, centered, transparent, for a looping animation* (→ ghép Lottie / sprite-sheet) |
| **Tour card — Atlas** | *Small illustration of a collection grid / Pokédex-style album of plant species, some revealed some silhouette, cozy flat, inviting "gotta collect them all" vibe* |
| **Tour card — 4 Seasons** | *Small illustration showing one plant across four seasons (spring pink, summer gold, autumn amber, winter frost), four mini panels, cozy flat* |
| **Tour card — Widget** | *Small illustration of a phone home-screen widget showing a garden progress ring and a recent memory photo, cozy flat* |
| **Reward — First Memory** | *A celebratory golden trophy badge with a sprout motif, glowing, achievement reward art, flat, transparent* |
| **Reward — Rare Seed gift** | *A glowing wrapped gift box releasing a sparkling rare magic seed, premium reward art, flat, transparent* |

---

## 8. EMPTY STATES & MISC

| Asset | Prompt |
|---|---|
| Empty garden | *Gentle illustration of an empty garden plot waiting to be planted, a single hopeful sprout, lots of calm space, soft pastel, encouraging not sad* |
| Empty timeline | *Illustration of an empty photo timeline / blank journal page with a small camera and sprout, inviting first entry, cozy flat* |
| Gallery permission | *Friendly illustration of a photo gallery with a small lock, requesting permission politely, cozy flat, non-alarming* |
| Backup reminder | *Warm illustration of a treasure chest / cloud with a garden inside, "keep your memories safe" vibe, cozy flat* |

---

## 9. ANIMATION (concept frames → Lottie/sprite-sheet)

> Particle/glow/confetti/transition = **Compose Canvas, KHÔNG gen**. Chỉ gen frame cho animation phức dưới đây.

| Anim | Prompt frames | Output |
|---|---|---|
| Growth | *5-frame sequence of a generic plant growing one stage: seed→sprout→plant→bloom→rare, smooth scale-up, cozy/pixel* | Lottie (cozy) / sprite-sheet (pixel) |
| Bloom Burst | *A flower bursting open with a radial burst of light, petals and sparkle particles flying outward, 6 frames, celebratory* | Lottie + Compose particle |
| Catch Reveal | *A silhouette plant card flipping/revealing into full color with a sparkle flash, Pokédex unlock vibe, 5 frames* | Lottie + sprite |
| Onboarding hero loop | (= §7 Welcome hero, seamless loop) | Lottie / sprite-sheet |

Tool ghép: LottieFiles / After Effects + Bodymovin (vector) · Aseprite (pixel sprite-sheet) · Rive.

---

## 10. AUDIO

### 10.1 BGM ambient (MVP: 1 loop chung · Phase 2: 4 mùa) — Suno/Udio
| Track | Prompt | Phase |
|---|---|---|
| Garden ambient (chung) | *Calm cozy lofi garden ambient, soft acoustic guitar and gentle chimes, peaceful, seamless loop, 45s, no vocals, relaxing cottagecore* | MVP |
| Spring | *+ light, hopeful, birdsong, fresh* | Phase 2 |
| Summer | *+ warm, bright, breezy, cheerful* | Phase 2 |
| Autumn | *+ mellow, nostalgic, warm strings* | Phase 2 |
| Winter | *+ quiet, sparse, soft bells, serene* | Phase 2 |

→ Loop liền mạch ~30-60s, OGG. **Kiểm tra license kỹ** (Suno/Udio terms + royalty-free).

### 10.2 SFX (8 — freesound/AI, OGG mono, <1s)
| File | Mô tả tìm/gen |
|---|---|
| `sfx_plant_seed` | soft dig + seed drop into soil |
| `sfx_grow_pop` | gentle organic "pop"/whoosh khi cây lên stage |
| `sfx_bloom_chime` | bright soft chime/sparkle khi nở hoa |
| `sfx_rare_fanfare` | short magical fanfare cho rare/legendary |
| `sfx_unlock_catch` | Pokédex-style unlock ding + sparkle |
| `sfx_milestone_win` | cheerful achievement jingle ngắn |
| `sfx_reward_get` | reward collect coin/gift sound |
| `sfx_tap` | soft UI tap/click (tùy) |

→ Tất cả phải **toggle tắt** được (Settings nhóm 4) + tôn trọng silent mode.

---

## 11. CHECKLIST GEN (thứ tự)

1. [ ] §1 — 2 reference sheet (Cozy + Pixel), DUYỆT trước.
2. [ ] §2 — 340 plant sprite (batch Cozy hết → Pixel hết). Lock `--sref`/seed.
3. [ ] §3 — Branding (icon ×2, logo ×2, feature graphic, splash, notif).
4. [ ] §4 — 4 season banner ×2 style.
5. [ ] §5 — garden bg + plot ×2, 5 theme pack.
6. [ ] §6 — 6 decoration ×2 (MVP cần tối thiểu d1+d2).
7. [ ] §7 — onboarding hero + 3 tour card + 2 reward.
8. [ ] §8 — empty states.
9. [ ] §9 — animation frames → ghép Lottie/sheet (sau khi có sprite).
10. [ ] §10 — BGM ambient + 8 SFX (cuối, không chặn loop).
11. [ ] Hậu kỳ: tách nền → crop baseline → export WebP/OGG → đặt tên đúng convention (ASSET_SPEC §17).
