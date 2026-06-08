/* ============================================================
   Memory Garden — Mockup data
   Tất cả dữ liệu tĩnh cho mockup. Không backend.
   ============================================================ */

// --- Categories (theo Memory Garden.md) ---
const CATEGORIES = [
  { id: "adventure",    name: "Adventure",       emoji: "🏕️", color: "#5fa86b",
    subs: ["Travel", "Beach", "Camping", "Hiking"] },
  { id: "food",         name: "Food & Drink",    emoji: "🍜", color: "#e8945a",
    subs: ["Coffee", "Restaurant", "New Food"] },
  { id: "relationship", name: "Relationship",    emoji: "💞", color: "#e06a8b",
    subs: ["Date", "Anniversary", "Gift"] },
  { id: "entertain",    name: "Entertainment",   emoji: "🎬", color: "#7a6cd6",
    subs: ["Movie", "Concert", "Anime", "Manga"] },
  { id: "growth",       name: "Personal Growth", emoji: "📚", color: "#4b9fd4",
    subs: ["Books", "Learning", "Courses"] },
  { id: "milestone",    name: "Life Milestones", emoji: "🎉", color: "#d4af37",
    subs: ["Birthday", "Graduation", "First Job", "New House", "New Car"] },
];

const catById = (id) => CATEGORIES.find((c) => c.id === id) || CATEGORIES[0];

// --- Moods (Mood Tracker) ---
// Gắn 1 tâm trạng cho mỗi memory → sau này thống kê biểu đồ cảm xúc.
const MOODS = [
  { id: "joy",   name: "Vui",       emoji: "😄", color: "#f5b945" },
  { id: "calm",  name: "Bình yên",  emoji: "😌", color: "#6fae6b" },
  { id: "moved", name: "Xúc động",  emoji: "🥹", color: "#e06a8b" },
  { id: "sad",   name: "Buồn",      emoji: "😢", color: "#4b9fd4" },
  { id: "hyped", name: "Hào hứng",  emoji: "🔥", color: "#e8945a" },
  { id: "tired", name: "Mệt",       emoji: "😴", color: "#8a8f98" },
];
const moodById = (id) => MOODS.find((m) => m.id === id);

// --- Plant growth stages (Garden System) ---
const STAGES = [
  { id: "seed",   name: "Seed",      emoji: "🌰" },
  { id: "sprout", name: "Sprout",    emoji: "🌱" },
  { id: "plant",  name: "Plant",     emoji: "🪴" },
  { id: "bloom",  name: "Bloom",     emoji: "🌸" },
  { id: "rare",   name: "Rare Bloom",emoji: "🌺" },
];

// --- 4 Seasons (Season System) ---
// Mô hình A: mùa = lịch thực (Bắc bán cầu). months = index getMonth() 0..11.
// Nguyên tắc: ADDITIVE-ONLY — mùa cộng bonus + đổi flavor, KHÔNG chặn growth.
// affinity: category được +rare% khi đúng mùa. tint: màu phủ overlay vườn.
// particle: emoji rơi nền vườn. variant: bloom đổi sắc theo mùa.
const SEASONS = [
  { id: "spring", name: "Xuân", emoji: "🌸", months: [2, 3, 4],
    weather: "🌦️", particle: "🌸", tint: "#f7b8d2",
    affinity: ["relationship", "growth"],
    bonus: "Đâm chồi: cây lớn nhanh hơn · hoa Tình cảm & Phát triển nở rộ",
    variant: "sắc hồng phấn" },
  { id: "summer", name: "Hạ", emoji: "☀️", months: [5, 6, 7],
    weather: "☀️", particle: "✨", tint: "#ffd24a",
    affinity: ["adventure", "food"],
    bonus: "Nắng rực: Phiêu lưu & Ẩm thực +20% cơ hội Rare bloom",
    variant: "sắc vàng nắng" },
  { id: "autumn", name: "Thu", emoji: "🍂", months: [8, 9, 10],
    weather: "🍁", particle: "🍂", tint: "#e0913f",
    affinity: ["entertain", "food"],
    bonus: "Mùa thu hoạch: bloom chuyển sắc cam đỏ · Giải trí +rare",
    variant: "sắc cam đỏ" },
  { id: "winter", name: "Đông", emoji: "❄️", months: [11, 0, 1],
    weather: "🌨️", particle: "❄️", tint: "#8fb8de",
    affinity: ["milestone", "growth"],
    bonus: "Tĩnh lặng: cây ấp ủ · mở khóa cây hiếm & Cột mốc mùa đông",
    variant: "sắc trắng bạc" },
];

const seasonById = (id) => SEASONS.find((s) => s.id === id) || SEASONS[0];

// Mùa "nở rộ" mặc định của mỗi category (dùng cho badge khi cây không set season riêng)
const CAT_SEASON = {
  adventure: "summer", food: "autumn", relationship: "spring",
  entertain: "autumn", growth: "spring", milestone: "winter",
};
// Mùa nở rộ của 1 cây: ưu tiên field season riêng → fallback theo category
const plantSeason = (p) => p.season || CAT_SEASON[p.cat] || "spring";

// --- Plant catalog (Collection / Atlas — Pokédex) ---
// rarity: common | rare | epic | legendary
// unlocked: đã mở khóa từ memory hay chưa
const PLANTS = [
  { id: "p01", name: "Wander Fern",   emoji: "🌿", cat: "adventure",    rarity: "common",    unlocked: true  },
  { id: "p02", name: "Beach Lily",    emoji: "🌼", cat: "adventure",    rarity: "common",    unlocked: true  },
  { id: "p03", name: "Summit Pine",   emoji: "🌲", cat: "adventure",    rarity: "rare",      unlocked: true  },
  { id: "p04", name: "Nomad Cactus",  emoji: "🌵", cat: "adventure",    rarity: "rare",      unlocked: false },
  { id: "p05", name: "Aurora Bloom",  emoji: "🌺", cat: "adventure",    rarity: "legendary", unlocked: false },

  { id: "p06", name: "Bean Sprout",   emoji: "🫘", cat: "food",         rarity: "common",    unlocked: true  },
  { id: "p07", name: "Chili Vine",    emoji: "🌶️", cat: "food",         rarity: "common",    unlocked: true  },
  { id: "p08", name: "Mocha Tree",    emoji: "🌳", cat: "food",         rarity: "rare",      unlocked: true  },
  { id: "p09", name: "Sugar Blossom", emoji: "🍥", cat: "food",         rarity: "epic",      unlocked: false },
  { id: "p10", name: "Feast Lotus",   emoji: "🪷", cat: "food",         rarity: "legendary", unlocked: false },

  { id: "p11", name: "Heart Rose",    emoji: "🌹", cat: "relationship", rarity: "common",    unlocked: true  },
  { id: "p12", name: "Date Tulip",    emoji: "🌷", cat: "relationship", rarity: "common",    unlocked: true  },
  { id: "p13", name: "Vow Orchid",    emoji: "🌸", cat: "relationship", rarity: "rare",      unlocked: false },
  { id: "p14", name: "Gift Hibiscus", emoji: "🌺", cat: "relationship", rarity: "epic",      unlocked: false },
  { id: "p15", name: "Eternal Sakura",emoji: "🌸", cat: "relationship", rarity: "legendary", unlocked: false },

  { id: "p16", name: "Reel Ivy",      emoji: "🍃", cat: "entertain",    rarity: "common",    unlocked: true  },
  { id: "p17", name: "Stage Sunflower",emoji:"🌻", cat: "entertain",    rarity: "rare",      unlocked: false },
  { id: "p18", name: "Otaku Maple",   emoji: "🍁", cat: "entertain",    rarity: "rare",      unlocked: false },
  { id: "p19", name: "Pixel Bonsai",  emoji: "🎍", cat: "entertain",    rarity: "epic",      unlocked: false },
  { id: "p20", name: "Encore Bloom",  emoji: "🌼", cat: "entertain",    rarity: "legendary", unlocked: false },

  { id: "p21", name: "Page Clover",   emoji: "🍀", cat: "growth",       rarity: "common",    unlocked: true  },
  { id: "p22", name: "Study Bamboo",  emoji: "🎋", cat: "growth",       rarity: "rare",      unlocked: false },
  { id: "p23", name: "Wisdom Oak",    emoji: "🌳", cat: "growth",       rarity: "epic",      unlocked: false },
  { id: "p24", name: "Mind Lotus",    emoji: "🪷", cat: "growth",       rarity: "legendary", unlocked: false },

  { id: "p25", name: "Cake Daisy",    emoji: "🌼", cat: "milestone",    rarity: "common",    unlocked: true  },
  { id: "p26", name: "Cap Laurel",    emoji: "🌿", cat: "milestone",    rarity: "rare",      unlocked: false },
  { id: "p27", name: "Home Maple",    emoji: "🍁", cat: "milestone",    rarity: "epic",      unlocked: false },
  { id: "p28", name: "Legacy Tree",   emoji: "🌳", cat: "milestone",    rarity: "legendary", unlocked: false },

  { id: "p29", name: "Dawn Poppy",    emoji: "🌺", cat: "adventure",    rarity: "epic",      unlocked: false },
  { id: "p30", name: "Mystery Bud",   emoji: "❓",  cat: "food",         rarity: "epic",      unlocked: false },

  // --- Seasonal-exclusive (chỉ mở khóa đúng mùa) — KHÔNG tính vào 100% core ---
  { id: "p31", name: "Sakura Spirit", emoji: "🌸", cat: "relationship", rarity: "legendary", unlocked: false, seasonal: true, season: "spring" },
  { id: "p32", name: "Sunfire Lily",  emoji: "🌻", cat: "adventure",    rarity: "epic",      unlocked: false, seasonal: true, season: "summer" },
  { id: "p33", name: "Maple Ember",   emoji: "🍁", cat: "entertain",    rarity: "epic",      unlocked: false, seasonal: true, season: "autumn" },
  { id: "p34", name: "Frost Orchid",  emoji: "🪻", cat: "milestone",    rarity: "legendary", unlocked: false, seasonal: true, season: "winter" },
];

const RARITY = {
  common:    { name: "Common",    color: "#8a8f98", stars: 1 },
  rare:      { name: "Rare",      color: "#4b9fd4", stars: 2 },
  epic:      { name: "Epic",      color: "#7a6cd6", stars: 3 },
  legendary: { name: "Legendary", color: "#d4af37", stars: 4 },
};

// --- Sample memories (Memory Management + Timeline) ---
const MEMORIES = [
  { id: "m1", title: "Cà phê sớm ở Đà Lạt", cat: "food", sub: "Coffee",
    date: "2026-05-28", photo: "☕", plant: "p08", rarity: "rare", mood: "calm",
    desc: "Sương sớm, ly cà phê nóng, view đồi thông. Yên tĩnh đến lạ.",
    tags: ["dalat", "coffee", "morning"] },
  { id: "m2", title: "Leo đỉnh Langbiang", cat: "adventure", sub: "Hiking",
    date: "2026-05-27", photo: "⛰️", plant: "p03", rarity: "rare", mood: "hyped",
    desc: "3 tiếng leo, mệt nhưng view trên đỉnh xứng đáng từng giọt mồ hôi.",
    tags: ["hiking", "langbiang"] },
  { id: "m3", title: "Kỷ niệm 2 năm 💍", cat: "relationship", sub: "Anniversary",
    date: "2026-05-20", photo: "🌹", plant: "p11", rarity: "common", mood: "moved",
    desc: "Bữa tối nhỏ, nến và hoa hồng. Hai năm rồi đó.",
    tags: ["anniversary", "love"] },
  { id: "m4", title: "Xem One Piece movie", cat: "entertain", sub: "Anime",
    date: "2026-05-15", photo: "🎬", plant: "p16", rarity: "common", mood: "joy",
    desc: "Rạp đông kín fan. Cảm xúc vỡ òa đoạn cuối.",
    tags: ["anime", "onepiece"] },
  { id: "m5", title: "Đọc xong Atomic Habits", cat: "growth", sub: "Books",
    date: "2026-04-30", photo: "📖", plant: "p21", rarity: "common", mood: "calm",
    desc: "Cuốn sách đổi cách mình nhìn thói quen. 1% mỗi ngày.",
    tags: ["books", "habits"] },
  { id: "m6", title: "Biển Nha Trang", cat: "adventure", sub: "Beach",
    date: "2026-04-12", photo: "🏖️", plant: "p02", rarity: "common", mood: "joy",
    desc: "Nắng, cát, sóng. Bữa hải sản nhớ đời.",
    tags: ["beach", "nhatrang"] },
  { id: "m7", title: "Sinh nhật tuổi 26", cat: "milestone", sub: "Birthday",
    date: "2026-03-08", photo: "🎂", plant: "p25", rarity: "common", mood: "joy",
    desc: "Bạn bè bất ngờ tổ chức. Bánh kem dâu yêu thích.",
    tags: ["birthday"] },
  { id: "m8", title: "Thử ramen mới mở", cat: "food", sub: "New Food",
    date: "2026-02-14", photo: "🍜", plant: "p06", rarity: "common", mood: "hyped",
    desc: "Quán ramen Nhật mới khai trương. Nước dùng đậm đà.",
    tags: ["ramen", "food"] },
];

// --- Milestones (achievements) ---
const MILESTONES = [
  { id: "ms1", name: "First Memory",   emoji: "🌱", desc: "Tạo memory đầu tiên",      done: true,  progress: 1,  goal: 1   },
  { id: "ms2", name: "First Bloom",    emoji: "🌸", desc: "Nở cây đầu tiên",          done: true,  progress: 1,  goal: 1   },
  { id: "ms3", name: "10 Memories",    emoji: "🪴", desc: "Lưu 10 kỷ niệm",           done: false, progress: 8,  goal: 10  },
  { id: "ms4", name: "First Trip",     emoji: "✈️", desc: "Memory Adventure đầu tiên",done: true,  progress: 1,  goal: 1   },
  { id: "ms5", name: "First Date",     emoji: "💕", desc: "Memory Relationship đầu",  done: true,  progress: 1,  goal: 1   },
  { id: "ms6", name: "Collector I",    emoji: "🏆", desc: "Mở khóa 10 loại cây",      done: true,  progress: 12, goal: 10  },
  { id: "ms7", name: "Collector II",   emoji: "🥇", desc: "Mở khóa 20 loại cây",      done: false, progress: 12, goal: 20  },
  { id: "ms8", name: "100 Memories",   emoji: "🌳", desc: "Lưu 100 kỷ niệm",          done: false, progress: 8,  goal: 100 },
  { id: "ms9", name: "Rare Hunter",    emoji: "🌺", desc: "Mở 1 cây Legendary",       done: false, progress: 0,  goal: 1   },
];

// --- Widgets (home screen widget preview) ---
const WIDGETS = [
  { id: "w1", name: "Recent Memory",   size: "2×2", desc: "Kỷ niệm gần nhất" },
  { id: "w2", name: "Garden Progress", size: "4×2", desc: "Tiến độ khu vườn" },
  { id: "w3", name: "On This Day",     size: "4×1", desc: "Kỷ niệm cùng ngày trong quá khứ" },
];

// --- Theme packs (Garden Customization — IAP) ---
const THEME_PACKS = [
  { id: "t1", name: "Spring Meadow", emoji: "🌷", owned: true,  price: "Free"   },
  { id: "t2", name: "Japanese Garden",emoji:"⛩️", owned: false, price: "$2.99"  },
  { id: "t3", name: "Fantasy Garden",emoji: "🍄", owned: false, price: "$2.99"  },
  { id: "t4", name: "Romantic Garden",emoji:"💗", owned: false, price: "$2.99"  },
  { id: "t5", name: "Pixel Garden",  emoji: "🟩", owned: false, price: "$2.99"  },
];

const DECORATIONS = [
  { id: "d1", name: "Fountain",   emoji: "⛲", owned: true  },
  { id: "d2", name: "Lantern",    emoji: "🏮", owned: true  },
  { id: "d3", name: "Sakura Set", emoji: "🌸", owned: false },
  { id: "d4", name: "Love Set",   emoji: "💝", owned: false },
  { id: "d5", name: "Stone Path", emoji: "🪨", owned: false },
  { id: "d6", name: "Bird Bath",  emoji: "🐦", owned: false },
];

// --- Garden plots (Garden Home — cây đang lớn) ---
// stage index 0..4 = STAGES
const GARDEN_PLOTS = [
  { plant: "p08", stage: 3, memory: "m1" },
  { plant: "p03", stage: 4, memory: "m2" },
  { plant: "p11", stage: 3, memory: "m3" },
  { plant: "p16", stage: 2, memory: "m4" },
  { plant: "p21", stage: 2, memory: "m5" },
  { plant: "p02", stage: 3, memory: "m6" },
  { plant: "p25", stage: 1, memory: "m7" },
  { plant: "p06", stage: 1, memory: "m8" },
  { plant: null,  stage: 0, memory: null }, // empty plot — "tap to plant"
];

const plantById = (id) => PLANTS.find((p) => p.id === id);

// Số dex kiểu Pokédex: vị trí cây trong catalog, pad 3 chữ số (#001..#034)
const dexNo = (id) => {
  const i = PLANTS.findIndex((p) => p.id === id);
  return i < 0 ? "—" : String(i + 1).padStart(3, "0");
};

// --- Backup state (Auto-backup Reminder — local-first) ---
// Mockup tĩnh: nhắc Export ZIP khi đã lâu chưa sao lưu. Không cloud-sync nền.
const BACKUP = { lastDays: 5, remindAfter: 3, autoRemind: true };

// --- Storage usage (Settings › Dữ liệu — local-first) ---
// Ước tính dung lượng ảnh/video app chiếm trên máy. Mockup tĩnh.
const STORAGE = { totalMB: 248, photos: 86, videos: 4 };

// --- Derived stats ---
// Core completion CHỈ tính cây thường (loại trừ seasonal) — seasonal là bộ sưu tập riêng,
// không khóa mốc 100% sau real-time wait (theo phân tích Season System).
const STATS = {
  get totalPlants()      { return PLANTS.filter((p) => !p.seasonal).length; },
  get unlockedPlants()   { return PLANTS.filter((p) => !p.seasonal && p.unlocked).length; },
  get seasonalTotal()    { return PLANTS.filter((p) => p.seasonal).length; },
  get seasonalUnlocked() { return PLANTS.filter((p) => p.seasonal && p.unlocked).length; },
  get totalMemories()    { return MEMORIES.length; },
  get completion()       { return Math.round((this.unlockedPlants / this.totalPlants) * 100); },
};
