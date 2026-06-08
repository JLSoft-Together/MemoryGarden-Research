/* ============================================================
   Memory Garden — app.js
   Router + render 8 màn + interactions + style toggle.
   Vanilla JS, không framework. Event delegation trên #screenBody.
   ============================================================ */

/* mùa hiện tại = lịch thực — demo mở đúng mùa của ngày chạy.
   Nam bán cầu: dịch lịch +6 tháng (Tháng 12 = Hạ). Mặc định Bắc bán cầu
   (state chưa tồn tại lúc khởi tạo literal → fallback "north"). */
function currentSeasonId() {
  // Lúc khởi tạo `const state = {... currentSeasonId() ...}`, biến `state` còn ở
  // TDZ → mọi truy cập (kể cả typeof) ném ReferenceError. try/catch → fallback Bắc.
  let hemi = "north";
  try { hemi = state.hemisphere || "north"; } catch (e) { /* TDZ lúc init */ }
  let m = new Date().getMonth();
  if (hemi === "south") m = (m + 6) % 12;
  return (SEASONS.find((s) => s.months.includes(m)) || SEASONS[0]).id;
}

const state = {
  screen: "garden",
  theme: "cozy",
  season: currentSeasonId(),
  atlasCat: "all",
  tlView: "month",
  selMemory: null,
  selPlant: null,
  createCat: "food",
  createMood: "joy",     // Mood Tracker — mood đang chọn ở màn Create
  editing: false,        // Create đang ở chế độ sửa memory?
  backupDismissed: false,// đã đóng banner nhắc backup chưa
  // ---- Progressive Unlock (Goal 1: xong onboarding · Goal 2: 1 memory · Goal 3: 3-memory quest) ----
  goals: { g1: false, g2: false, g3: false },
  newMemCount: 0,        // số memory tạo mới session này (không tính onboarding)
  // ---- Settings (lưu bằng DataStore ở app thật) ----
  hemisphere: "north",   // Bắc/Nam bán cầu → lịch mùa khớp nơi ở
  particleFx: true,      // bật/tắt hiệu ứng hạt rơi trong vườn
  dailyReminder: true,   // nhắc ghi chép hàng ngày
  reminderTime: "20:00", // giờ nhắc
  lang: "vi",            // ngôn ngữ hiển thị
  proActive: false,      // đã mua Lifetime Pro chưa
  confirmWipe: false,    // đang ở bước xác nhận xóa toàn bộ dữ liệu
};

/* state máy cho ONBOARDING — overlay riêng, KHÔNG thuộc router chính.
   active=true → hiện ngay khi mở app (mockup luôn replay được). */
const onboard = { active: true, step: 0, seedEmoji: "☕", seedCat: "food", applied: false };

/* ---------- helpers ---------- */
const el = (sel, root = document) => root.querySelector(sel);
const fmtDate = (iso) => {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};
const stars = (rarity) => "★".repeat(RARITY[rarity].stars) + "☆".repeat(4 - RARITY[rarity].stars);

function toast(msg) {
  const t = el("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove("show"), 1900);
}

/* đổi style (cozy/pixel) — đồng bộ body attr + nút toolbar + onboarding */
function setTheme(name) {
  state.theme = name;
  document.body.setAttribute("data-theme", name);
  document.querySelectorAll("[data-theme-btn]").forEach((x) =>
    x.classList.toggle("active", x.dataset.themeBtn === name));
}

/* ---------- navigation ---------- */
const NAV = [
  { id: "garden",   ico: "🌿", label: "Garden" },
  { id: "atlas",    ico: "📖", label: "Atlas" },
  { id: "create",   ico: "+",  label: "Create", fab: true },
  { id: "timeline", ico: "🕰️", label: "Timeline" },
  { id: "more",     ico: "⋯",  label: "More" },
];

function renderNav() {
  const nav = el("#nav");
  nav.innerHTML = NAV.map((n) => {
    const locked = n.id === "timeline" && !state.goals.g3;
    const active = n.id === state.screen ? "active" : "";
    return `<button class="navitem ${n.fab ? "fab" : ""} ${active} ${locked ? "nav-locked" : ""}" data-nav="${n.id}">
      <span class="ico">${locked ? "🔒" : n.ico}</span><span>${n.label}</span>
    </button>`;
  }).join("");
}

function go(screen) {
  state.screen = screen;
  if (screen !== "garden") { const c = el("#coach"); if (c) endCoach(); } // rời vườn → tắt coach
  render();
}

/* ============================================================
   SCREENS
   ============================================================ */

/* season switcher (demo control) + banner */
function seasonStrip() {
  return `<div class="season-switch">${SEASONS.map((s) =>
    `<button class="${s.id === state.season ? "active" : ""}" data-act="season" data-id="${s.id}">
      ${s.emoji} ${s.name}</button>`).join("")}</div>`;
}
function seasonBanner() {
  const s = seasonById(state.season);
  const live = s.id === currentSeasonId();
  return `<div class="season-banner season-${s.id}">
    <div class="sb-icon">${s.weather}</div>
    <div class="sb-text">
      <div class="sb-title">Mùa ${s.name} ${s.emoji}${live ? `<span class="sb-live">● đang diễn ra</span>` : ""}</div>
      <div class="sb-bonus">${s.bonus}</div>
    </div>
  </div>`;
}
/* lớp particle rơi trong vườn theo mùa — tắt được qua Settings */
function seasonFx() {
  if (!state.particleFx) return "";
  const s = seasonById(state.season);
  const pf = Array.from({ length: 14 }, (_, i) =>
    `<span class="pf" style="left:${(i * 7 + 3) % 100}%;animation-duration:${(3 + (i % 5) * .7).toFixed(1)}s;animation-delay:${(i * .35).toFixed(2)}s">${s.particle}</span>`
  ).join("");
  return `<div class="season-fx">${pf}</div>`;
}

/* ---- 2. Garden System + 3. stats : GARDEN HOME ---- */
function scGarden() {
  const season = seasonById(state.season);
  const plots = GARDEN_PLOTS.map((p, i) => {
    if (!p.plant) {
      return `<div class="plot empty" data-act="create">＋<br>plant</div>`;
    }
    const pl = plantById(p.plant);
    const st = STAGES[p.stage];
    const boost = season.affinity.includes(pl.cat); // cây hợp mùa → glow bonus
    const fresh = p.fresh ? "fresh" : "";              // cây vừa gieo từ onboarding
    return `<div class="plot ${boost ? "boost" : ""} ${fresh}" data-act="memory" data-id="${p.memory}" title="${pl.name}${boost ? " · +bonus mùa " + season.name : ""}">
      ${st.emoji === "🌰" ? "🌰" : pl.emoji}
      ${p.fresh ? `<span class="fresh-tag">Mới 🌟</span>` : boost ? `<span class="boost-tag">${season.emoji}+</span>` : ""}
      <span class="stage-tag">${st.name}</span>
    </div>`;
  }).join("");

  // Auto-backup reminder: chỉ hiện sau Goal 3 (tránh làm phân tâm lúc mới dùng).
  const showBackup = state.goals.g3 && BACKUP.lastDays >= BACKUP.remindAfter && !state.backupDismissed;
  const backupBanner = showBackup ? `
    <div class="backup-banner">
      <span class="bb-ico">💾</span>
      <div class="bb-text"><b>Đã ${BACKUP.lastDays} ngày chưa sao lưu</b>
        <div>Export ZIP để giữ an toàn kỷ niệm — local-first, không cần tài khoản.</div></div>
      <button class="bb-act" data-act="backup">Sao lưu</button>
      <button class="bb-close" data-act="dismissBackup" title="Để sau">✕</button>
    </div>` : "";

  // 3-Memory Starter Quest (activation): tiến độ 3 kỷ niệm đầu.
  const questDone = Math.min(3, STATS.totalMemories);
  const starterQuest = questDone < 3 ? `
    <div class="quest-card">
      <div class="q-emo">🎯</div>
      <div class="q-body">
        <div class="q-title">Starter Quest — 3 kỷ niệm đầu tiên</div>
        <div class="bar"><span style="width:${(questDone / 3) * 100}%"></span></div>
        <div class="q-sub">${questDone}/3 · Hoàn thành để mở huy hiệu 🌱 Người gieo mầm</div>
      </div>
      <button class="btn sm" data-act="create">Ghi tiếp</button>
    </div>` : "";

  return {
    title: "My Garden", sub: "8 cây đang lớn",
    body: `
    ${seasonStrip()}
    ${seasonBanner()}
    ${backupBanner}
    ${starterQuest}

    <div class="ring-wrap card" style="padding:14px;margin-bottom:6px">
      <div class="ring" style="--val:${STATS.completion};--col:var(--primary)" data-label="${STATS.completion}%"></div>
      <div style="flex:1">
        <div style="font-weight:800;font-size:15px">Garden Progress</div>
        <div style="font-size:12px;color:var(--text-dim);margin:2px 0 8px">
          ${STATS.unlockedPlants}/${STATS.totalPlants} loài đã mở khóa</div>
        <div class="bar"><span style="width:${STATS.completion}%"></span></div>
      </div>
    </div>

    <div class="section-title">Khu vườn ký ức
      ${state.goals.g3 ? `<span><span class="link" data-act="shareGarden">📤 Chia sẻ</span>
        <span class="link" data-act="customize" style="margin-left:10px">Tùy chỉnh</span></span>` : ""}</div>
    <div class="garden">${seasonFx()}${plots}</div>

    ${state.goals.g2
      ? `<div style="display:flex;gap:10px;margin-top:14px">
          <button class="btn reward" data-act="reward" style="flex:1">🎁 Xem ad → Mystery Seed</button>
          <button class="btn secondary" data-act="quickCapture" style="flex:0 0 auto">⚡ Ghi nhanh</button>
        </div>`
      : `<div style="margin-top:14px">
          <button class="btn" data-act="create" style="width:100%">🌱 Thêm kỷ niệm</button>
        </div>`}

    <div class="section-title">Hôm nay <span class="link" data-act="timeline">Tất cả</span></div>
    <div class="card">${MEMORIES.slice(0, 2).map(memRow).join("")}</div>

    <div class="hint">Mỗi memory bạn tạo sẽ gieo 1 hạt → lớn dần thành cây.
      Tap ô trống để gieo memory mới. <span class="link" data-act="coachReplay">💡 Xem hướng dẫn</span></div>
    `,
  };
}

/* ---- 1. Memory row component ---- */
function memRow(m) {
  const c = catById(m.cat);
  const pl = plantById(m.plant);
  const mo = m.mood && moodById(m.mood);
  return `<div class="mem-row" data-act="memory" data-id="${m.id}">
    <div class="mem-thumb">${m.photo}</div>
    <div class="mem-info">
      <div class="t">${m.title}</div>
      <div class="meta">
        <span>${c.emoji} ${m.sub}</span><span class="dot"></span><span>${fmtDate(m.date)}</span>
        ${mo ? `<span class="dot"></span><span title="${mo.name}">${mo.emoji}</span>` : ""}
      </div>
    </div>
    <div class="mem-plant" title="${pl ? pl.name : ""}">${pl ? pl.emoji : ""}</div>
  </div>`;
}

/* ---- 3. Collection System : ATLAS (Pokédex) ---- */
function scAtlas() {
  const cats = [{ id: "all", name: "Tất cả", emoji: "🌍" }, ...CATEGORIES];
  const chips = cats.map((c) =>
    `<button class="chip ${state.atlasCat === c.id ? "active" : ""}" data-act="atlasCat" data-id="${c.id}">
      ${c.emoji} ${c.name}</button>`).join("");

  const list = PLANTS.filter((p) => state.atlasCat === "all" || p.cat === state.atlasCat);
  const cells = list.map((p) => {
    const se = seasonById(plantSeason(p));
    const seasonBadge = `<span class="season-badge" title="Nở rộ mùa ${se.name}">${se.emoji}</span>`;
    const inSeason = p.season === state.season; // seasonal cây có mở được lúc này không
    if (!p.unlocked) {
      return `<div class="cell locked ${p.seasonal ? "seasonal" : ""}" data-act="plant" data-id="${p.id}">
        <span class="dex">#${dexNo(p.id)}</span>
        ${seasonBadge}
        ${p.seasonal ? `<span class="season-ribbon ${inSeason ? "open" : ""}">${inSeason ? "Mở mùa này" : se.name}</span>` : ""}
        <div class="emo">${p.emoji}</div>
        <div class="nm">? ? ?</div>
        <span class="lock-ico">🔒</span>
      </div>`;
    }
    return `<div class="cell ${p.seasonal ? "seasonal" : ""}" data-act="plant" data-id="${p.id}">
      <span class="dex">#${dexNo(p.id)}</span>
      <span class="rarity-dot" style="background:${RARITY[p.rarity].color}"></span>
      ${seasonBadge}
      <div class="emo">${p.emoji}</div>
      <div class="nm">${p.name}</div>
    </div>`;
  }).join("");

  // Preview mode trước Goal 2: blur phần dưới + CTA tạo thêm kỷ niệm
  if (!state.goals.g2) {
    const need = Math.max(0, 2 - state.newMemCount);
    return {
      title: "Garden Atlas", sub: `Preview · tạo thêm để mở`,
      body: `
      <div class="card" style="padding:14px;margin-bottom:12px">
        <div style="display:flex;align-items:center;gap:12px">
          <div style="font-size:32px">📖</div>
          <div style="flex:1">
            <div style="font-weight:800">Atlas sưu tầm — Preview</div>
            <div style="font-size:12px;color:var(--text-dim)">Tạo thêm kỷ niệm để mở đầy đủ bộ sưu tập</div>
          </div>
        </div>
        <div class="bar" style="margin-top:10px">
          <span style="width:${Math.min(100, Math.round((state.newMemCount/2)*100))}%"></span>
        </div>
        <div style="font-size:11px;color:var(--text-dim);margin-top:4px">
          ${need > 0 ? `Tạo thêm ${need} kỷ niệm để mở Atlas đầy đủ` : "Gần mở rồi! Lưu thêm 1 kỷ niệm nữa"}
        </div>
      </div>
      <div style="position:relative;overflow:hidden;max-height:200px;border-radius:var(--radius-md)">
        <div class="atlas">${cells}</div>
        <div style="position:absolute;inset:0;background:linear-gradient(to bottom,transparent 30%,var(--bg) 85%);pointer-events:none"></div>
      </div>
      <div style="text-align:center;margin-top:14px">
        <button class="btn" data-act="create" style="max-width:220px">🌱 Thêm kỷ niệm để mở Atlas</button>
      </div>
      <div class="hint" style="margin-top:12px">Mỗi kỷ niệm mở thêm loài cây mới. Còn ${need} kỷ niệm nữa để xem đầy đủ.</div>
      `
    };
  }

  return {
    title: "Garden Atlas", sub: `${STATS.unlockedPlants}/${STATS.totalPlants} loài`,
    body: `
    <div class="ring-wrap card" style="padding:14px;margin-bottom:10px">
      <div class="ring" style="--val:${STATS.completion}" data-label="${STATS.completion}%"></div>
      <div style="flex:1">
        <div style="font-weight:800">Completion</div>
        <div style="font-size:12px;color:var(--text-dim)">Sưu tầm đủ ${STATS.totalPlants} loài cây thường</div>
        <div class="seasonal-line">🗓️ Seasonal: ${STATS.seasonalUnlocked}/${STATS.seasonalTotal} cây giới hạn theo mùa</div>
      </div>
    </div>
    <div class="chips" style="margin-bottom:12px;overflow-x:auto;flex-wrap:nowrap;padding-bottom:4px">${chips}</div>
    <div class="atlas">${cells}</div>
    <div class="hint">Góc trên mỗi ô = mùa cây nở rộ. Cây viền nét đứt 🗓️ là <b>seasonal-exclusive</b>: chỉ mở đúng mùa, tính riêng — không chặn mốc 100% bộ sưu tập chính.</div>
    `,
  };
}

/* AI Memory Recap (Phase 2 — preview). Không gọi AI thật; bấm → overlay demo. */
function recapCard() {
  return `<div class="recap-card" data-act="aiRecap">
    <span class="soon">Sắp ra mắt</span>
    <div class="rc-emoji">✨</div>
    <div class="rc-body">
      <div class="rc-title">Memory Recap — Tháng 5 của bạn</div>
      <div class="rc-sub">AI tóm tắt hành trình tháng qua thành một câu chuyện ngắn.</div>
    </div>
    <button class="btn sm" data-act="aiRecap">Tạo recap</button>
  </div>`;
}

/* Mood Tracker — phân bố tâm trạng từ MEMORIES (visual tĩnh). */
function moodStatsCard() {
  const counts = {};
  MEMORIES.forEach((m) => { if (m.mood) counts[m.mood] = (counts[m.mood] || 0) + 1; });
  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
  const rows = MOODS.filter((mo) => counts[mo.id]).map((mo) => {
    const n = counts[mo.id], pct = Math.round((n / total) * 100);
    return `<div class="mood-row">
      <span class="mood-emo">${mo.emoji}</span>
      <span class="mood-nm">${mo.name}</span>
      <div class="bar"><span style="width:${pct}%;background:${mo.color}"></span></div>
      <span class="mood-n">${n}</span>
    </div>`;
  }).join("");
  return `<div class="section-title" style="margin-top:18px">Tâm trạng năm nay 🎭</div>
    <div class="card" style="padding:14px">${rows}</div>`;
}

/* ---- 5. Timeline ---- */
const RANK = { legendary: 4, epic: 3, rare: 2, common: 1 };
function scTimeline() {
  // Locked state trước Goal 3 — "locked but informative"
  if (!state.goals.g3) {
    const done = Math.min(3, STATS.totalMemories + state.newMemCount);
    const rem = Math.max(0, 3 - done);
    return {
      title: "Timeline", sub: "Dòng thời gian ký ức",
      body: `
      <div class="empty-state" style="padding-top:32px">
        <div style="font-size:60px">🔒</div>
        <div style="font-family:var(--font-display);font-size:18px;font-weight:800;margin:14px 0 8px">Timeline chưa mở</div>
        <p style="color:var(--text-dim);font-size:14px;line-height:1.6;margin:0 20px 16px">
          Hoàn thành <b>3 Memories Starter Quest</b> để xem lại hành trình ký ức của bạn.
        </p>
        <div class="bar" style="max-width:200px;margin:0 auto 8px">
          <span style="width:${Math.round((done/3)*100)}%"></span>
        </div>
        <div style="font-size:13px;color:var(--text-dim);margin-bottom:20px">
          ${done}/3 kỷ niệm${rem > 0 ? ` · còn ${rem} để mở` : " · sắp xong!"}
        </div>
        <button class="btn" data-act="create" style="max-width:220px">🌱 Thêm kỷ niệm</button>
        <div class="hint" style="margin-top:16px">Sau khi mở, bạn có thể xem theo Tháng, Năm hoặc Hành trình cuộc đời.</div>
      </div>`
    };
  }

  const seg = `<div class="segment" style="margin-bottom:14px">
    ${["month", "year", "life"].map((v) =>
      `<button class="${state.tlView === v ? "active" : ""}" data-act="tlView" data-id="${v}">
        ${v === "month" ? "Tháng" : v === "year" ? "Năm" : "Hành trình"}</button>`).join("")}
  </div>`;

  let body = "";
  if (state.tlView === "month") {
    // group by YYYY-MM
    const groups = {};
    MEMORIES.forEach((m) => {
      const key = m.date.slice(0, 7);
      (groups[key] = groups[key] || []).push(m);
    });
    body = recapCard() + `<div class="timeline">` + Object.keys(groups).sort().reverse().map((k) => {
      const [y, mo] = k.split("-");
      const label = `Tháng ${mo}/${y}`;
      return `<div class="tl-node">
        <div class="tl-month">${label} · ${groups[k].length} kỷ niệm</div>
        <div class="card">${groups[k].map(memRow).join("")}</div>
      </div>`;
    }).join("") + `</div>`;
  } else if (state.tlView === "year") {
    const byMonth = {};
    MEMORIES.forEach((m) => { const mo = m.date.slice(5, 7); byMonth[mo] = (byMonth[mo] || 0) + 1; });
    const months = ["01","02","03","04","05","06","07","08","09","10","11","12"];
    const max = Math.max(1, ...Object.values(byMonth));
    body = `<div style="font-weight:800;margin-bottom:10px">2026 · ${MEMORIES.length} kỷ niệm 🌳</div>
    <div class="atlas" style="grid-template-columns:repeat(4,1fr)">` +
      months.map((mo) => {
        const n = byMonth[mo] || 0;
        const intensity = n / max;
        return `<div class="cell" style="background:${n ? `rgba(111,174,107,${.2 + intensity * .7})` : "var(--bg-elev)"}">
          <div class="nm" style="font-size:11px">Th${+mo}</div>
          <div class="emo" style="font-size:18px">${n || ""}</div>
        </div>`;
      }).join("") + `</div>
      <div class="hint">Ô càng đậm = càng nhiều kỷ niệm trong tháng đó. Tap để xem chi tiết.</div>
      ${moodStatsCard()}`;
  } else {
    // life journey — derive ĐỘNG: memory rarity cao (rare+) sort theo ngày giảm dần
    // + các milestone đã đạt. Không còn hardcode.
    const hi = MEMORIES.slice().sort((a, b) => b.date.localeCompare(a.date))
      .filter((m) => RANK[m.rarity] >= 2);
    const picks = (hi.length ? hi : MEMORIES.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4));
    const memNodes = picks.map((m) => {
      const pl = plantById(m.plant);
      return `<div class="tl-node" data-act="memory" data-id="${m.id}">
        <div class="tl-month">${m.date.slice(0, 4)}</div>
        <div class="card"><div class="mem-row">
          <div class="mem-thumb">${m.photo}</div>
          <div class="mem-info"><div class="t">${m.title}</div>
            <div class="meta">${stars(m.rarity)} ${pl ? pl.name : ""}</div></div>
        </div></div>
      </div>`;
    }).join("");
    const doneMs = MILESTONES.filter((m) => m.done);
    const msNode = doneMs.length ? `<div class="tl-node">
      <div class="tl-month">Thành tựu</div>
      <div class="card">${doneMs.map((m) =>
        `<div class="mem-row"><div class="mem-thumb">${m.emoji}</div>
          <div class="mem-info"><div class="t">${m.name} <span class="badge-done">✓</span></div>
            <div class="meta">${m.desc}</div></div></div>`).join("")}</div>
    </div>` : "";
    body = `<div class="timeline">${memNodes}${msNode}</div>
      <div class="hint">Life Journey View — tự dựng từ kỷ niệm hiếm nhất + cột mốc đã đạt của bạn.</div>`;
  }

  return { title: "Timeline", sub: "Dòng thời gian ký ức", body: seg + body };
}

/* ---- 1. Memory Management : CREATE ---- */
function scCreate() {
  const catChips = CATEGORIES.map((c) =>
    `<button class="chip ${state.createCat === c.id ? "active" : ""}" data-act="createCat" data-id="${c.id}">
      ${c.emoji} ${c.name}</button>`).join("");
  const c = catById(state.createCat);
  const subChips = c.subs.map((s, i) =>
    `<button class="chip ${i === 0 ? "active" : ""}">${s}</button>`).join("");
  const moodChips = MOODS.map((mo) =>
    `<button class="chip mood-chip ${state.createMood === mo.id ? "active" : ""}" data-act="createMood" data-id="${mo.id}">
      ${mo.emoji} ${mo.name}</button>`).join("");

  const editM = state.editing ? MEMORIES.find((x) => x.id === state.selMemory) : null;
  const editBanner = state.editing
    ? `<div class="edit-banner">✏️ Đang sửa kỷ niệm — thay đổi sẽ ghi đè bản cũ.</div>` : "";
  const titleVal = editM ? editM.title.replace(/"/g, "&quot;") : "";

  // Simplified form trước Goal 2: ảnh tùy chọn + title + mood + category gợi ý.
  // Full form sau Goal 2: thêm gallery-seed, sub-type, mô tả, tags.
  const isSimple = !state.goals.g2 && !state.editing;

  return {
    title: state.editing ? "Sửa Memory" : "New Memory",
    sub: state.editing ? "Cập nhật khoảnh khắc" : (isSimple ? "Ghi nhanh kỷ niệm" : "Ghi lại khoảnh khắc"),
    body: `
    ${editBanner}
    ${!isSimple ? `
    <div class="section-title" style="margin-top:6px">📸 Gợi ý từ thư viện ảnh</div>
    <div class="gallery-strip">
      ${["🏖️","🌅","🍰","🐶","🎡","🌃"].map((g, i) =>
        `<div class="g" data-act="gallerySeed" data-emo="${g}">${g}${i < 2 ? `<span class="sug">AI</span>` : ""}</div>`).join("")}
    </div>
    <div id="aiResult" class="ai-result" style="display:none"></div>
    <div class="hint" style="margin:0 0 14px">Gallery-seeded: chọn 1 ảnh → AI tự điền date + category. 1 tap là xong.</div>
    ` : ""}

    <div class="field">
      <div class="photo-drop" data-act="photo">
        <div><div class="big" id="photoIcon">🖼️</div>
          <div>${isSimple ? "Thêm ảnh (tùy chọn)" : "Thêm ảnh kỷ niệm"}</div></div>
      </div>
    </div>
    <div class="field"><label>Tiêu đề</label>
      <input id="memTitle" placeholder="${isSimple ? "Hôm nay có gì vui?" : "VD: Cà phê sớm ở Đà Lạt"}" value="${titleVal}"></div>
    <div class="field"><label>Tâm trạng</label>
      <div class="chips" style="overflow-x:auto;flex-wrap:nowrap;padding-bottom:4px">${moodChips}</div></div>
    <div class="field"><label>Category</label>
      <div class="chips" style="overflow-x:auto;flex-wrap:nowrap;padding-bottom:4px">${catChips}</div></div>
    ${!isSimple ? `
    <div class="field"><label>Loại</label><div class="chips">${subChips}</div></div>
    <div class="field"><label>Mô tả (tùy chọn)</label>
      <textarea placeholder="Hôm nay có gì đáng nhớ...">${editM ? editM.desc : ""}</textarea></div>
    <div class="field"><label>Tags (tùy chọn)</label>
      <input placeholder="#travel #coffee"></div>
    ` : ""}

    <button class="btn" data-act="saveMemory" style="margin-top:8px">${state.editing ? "💾 Lưu thay đổi" : "🌱 Lưu & gieo hạt"}</button>
    <div class="hint">${state.editing
      ? "Sửa xong sẽ quay lại kỷ niệm — cây đã nở không bị mất."
      : "First Bloom Guarantee: memory đầu tiên luôn nở ra 1 cây đặc biệt 🌺"}</div>
    `,
  };
}

/* ---- More hub ---- */
function scMore() {
  const items = [
    { act: "settings",   emoji: "⚙️", t: "Cài đặt", d: "Giao diện · Mùa · Dữ liệu · Thông báo" },
    { act: "categories", emoji: "🗂️", t: "Categories", d: "6 nhóm · 24 loại kỷ niệm" },
    { act: "milestones", emoji: "🏆", t: "Milestones", d: `${MILESTONES.filter(m=>m.done).length}/${MILESTONES.length} thành tựu đạt được` },
    { act: "widgets",    emoji: "📱", t: "Widgets", d: "3 widget màn hình chính" },
    { act: "customize",  emoji: "🎨", t: "Garden Customization", d: "Theme · Decoration · Layout" },
    { act: "pro",        emoji: "👑", t: "Lifetime Pro", d: "Unlimited · Backup · Premium widgets" },
    { act: "backup",     emoji: "💾", t: "Backup & Restore", d: `Sao lưu lần cuối: ${BACKUP.lastDays} ngày trước · Local-first` },
    { act: "replayOnb",  emoji: "🚀", t: "Xem lại Onboarding", d: "Chạy lại trải nghiệm gieo mầm" },
    { act: "demoUnlock", emoji: "🎯", t: "Demo: Mở tất cả", d: `Progressive unlock demo · Goals: ${Object.values(state.goals).filter(Boolean).length}/3` },
  ];
  return {
    title: "More", sub: "Tính năng & cài đặt",
    body: `<div class="card">${items.map((i) =>
      `<div class="mem-row" data-act="${i.act}">
        <div class="mem-thumb">${i.emoji}</div>
        <div class="mem-info"><div class="t">${i.t}</div><div class="meta">${i.d}</div></div>
        <div class="mem-plant">›</div>
      </div>`).join("")}</div>
      <div class="hint">Local-first: toàn bộ dữ liệu lưu trên máy (Room + DataStore). Không cần tài khoản.</div>`,
  };
}

/* ---- 4. Categories ---- */
function scCategories() {
  const body = CATEGORIES.map((c) => {
    const total = PLANTS.filter((p) => p.cat === c.id).length;
    const got = PLANTS.filter((p) => p.cat === c.id && p.unlocked).length;
    const pct = Math.round((got / total) * 100);
    return `<div class="card" style="margin-bottom:12px;padding:14px">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px">
        <div class="mem-thumb" style="background:${c.color}22">${c.emoji}</div>
        <div style="flex:1">
          <div style="font-weight:800">${c.name}</div>
          <div style="font-size:11px;color:var(--text-dim)">${got}/${total} cây · ${pct}%</div>
        </div>
        <div style="font-weight:800;color:${c.color}">${pct}%</div>
      </div>
      <div class="bar"><span style="width:${pct}%;background:${c.color}"></span></div>
      <div class="chips" style="margin-top:10px">${c.subs.map((s) => `<span class="chip">${s}</span>`).join("")}</div>
    </div>`;
  }).join("");
  return { title: "Categories", sub: "6 nhóm kỷ niệm", body, back: "more" };
}

/* ---- 6. Milestones ---- */
function scMilestones() {
  const body = `<div class="card">${MILESTONES.map((m) => {
    const pct = Math.min(100, Math.round((m.progress / m.goal) * 100));
    return `<div class="ms-row ${m.done ? "done" : ""}">
      <div class="ms-emo">${m.emoji}</div>
      <div class="ms-info">
        <div class="t">${m.name} ${m.done ? `<span class="badge-done">✓ Đạt</span>` : ""}</div>
        <div class="d">${m.desc}</div>
        ${m.done ? "" : `<div class="bar"><span style="width:${pct}%"></span></div>
          <div style="font-size:10px;color:var(--text-dim);margin-top:4px">${m.progress}/${m.goal}</div>`}
      </div>
    </div>`;
  }).join("")}</div>`;
  return { title: "Milestones", sub: "Thành tựu", body, back: "more" };
}

/* ---- 7. Widgets ---- */
function scWidgets() {
  const recent = MEMORIES[0];
  return {
    title: "Widgets", sub: "Màn hình chính", back: "more",
    body: `
    <div class="section-title">Recent Memory · 2×2</div>
    <div class="widget" style="max-width:170px;margin-bottom:18px">
      <div class="w-title">Recent</div>
      <div style="font-size:44px;text-align:center;margin:8px 0">${recent.photo}</div>
      <div style="font-weight:800;font-size:13px">${recent.title}</div>
      <div style="font-size:11px;opacity:.7">${fmtDate(recent.date)}</div>
    </div>

    <div class="section-title">Garden Progress · 4×2</div>
    <div class="widget" style="display:flex;gap:14px;align-items:center;margin-bottom:18px">
      <div class="ring" style="--val:${STATS.completion};--col:#3a7a35" data-label="${STATS.completion}%"></div>
      <div>
        <div style="font-weight:800">Khu vườn của bạn</div>
        <div style="font-size:12px;opacity:.8">${STATS.unlockedPlants}/${STATS.totalPlants} loài · ${STATS.totalMemories} kỷ niệm</div>
        <div style="font-size:30px;margin-top:4px">🌳🌸🪴🌷🌵</div>
      </div>
    </div>

    <div class="section-title">On This Day · 4×1</div>
    <div class="widget" style="display:flex;gap:12px;align-items:center">
      <div style="font-size:32px">📅</div>
      <div><div style="font-weight:800;font-size:13px">On This Day · 1 năm trước</div>
        <div style="font-size:12px;opacity:.8">"Biển Nha Trang" 🏖️ — hôm nay năm ngoái</div></div>
    </div>
    <div class="hint">Widget dựng bằng Glance (Jetpack). Nhắc kỷ niệm cũ → kéo user quay lại app.</div>
    `,
  };
}

/* ---- 8. Garden Customization ---- */
function scCustomize() {
  const themes = THEME_PACKS.map((t) =>
    `<div class="shop-card" data-act="buy" data-nm="${t.name}">
      ${t.owned ? `<span class="own">✓ Đã có</span>` : ""}
      <div class="emo">${t.emoji}</div><div class="nm">${t.name}</div>
      <div class="pr">${t.price}</div>
    </div>`).join("");
  const decos = DECORATIONS.map((d) =>
    `<div class="shop-card" data-act="buy" data-nm="${d.name}">
      ${d.owned ? `<span class="own">✓</span>` : `<span class="own" style="background:var(--accent)">🎁 Ad</span>`}
      <div class="emo">${d.emoji}</div><div class="nm">${d.name}</div>
    </div>`).join("");
  return {
    title: "Customization", sub: "Trang trí khu vườn", back: "more",
    body: `
    <div class="section-title">Theme Packs</div>
    <div class="shop-grid">${themes}</div>
    <div class="section-title" style="margin-top:18px">Decorations</div>
    <div class="shop-grid">${decos}</div>
    <div class="hint">Theme/Deco mở bằng IAP hoặc xem Rewarded Ad. Layout kéo-thả cây tự do.</div>
    `,
  };
}

/* ---- Backup & Restore (Auto-backup reminder · local-first) ---- */
function scBackup() {
  return {
    title: "Backup & Restore", sub: "Local-first", back: "more",
    body: `
    <div class="card" style="padding:16px;margin-bottom:14px;display:flex;align-items:center;gap:12px">
      <div style="font-size:34px">💾</div>
      <div style="flex:1">
        <div style="font-weight:800">Sao lưu lần cuối</div>
        <div style="font-size:12px;color:var(--text-dim)">${BACKUP.lastDays} ngày trước</div>
      </div>
      ${BACKUP.lastDays >= BACKUP.remindAfter ? `<span class="badge-warn">Nên sao lưu</span>` : ""}
    </div>
    <button class="btn" data-act="exportZip" style="margin-bottom:10px">📦 Export ZIP (trên máy)</button>
    <button class="btn secondary" data-act="driveBackup" style="margin-bottom:14px">☁️ Sao lưu lên Google Drive (thủ công)</button>
    <div class="toggle-row" data-act="toggleRemind">
      <div><div style="font-weight:700;font-size:14px">Nhắc sao lưu tự động</div>
        <div style="font-size:11px;color:var(--text-dim)">Nhắc khi đã ${BACKUP.remindAfter}+ ngày chưa sao lưu</div></div>
      <span class="toggle ${BACKUP.autoRemind ? "on" : ""}"></span>
    </div>
    <div class="hint">Local-first: dữ liệu luôn nằm trên máy. Google Drive chỉ là bản sao <b>thủ công</b> bạn chủ động tạo — không tự đồng bộ nền, không cần tài khoản app.</div>
    `,
  };
}

/* ---- Settings (Cài đặt) — 5 nhóm: Gói · Giao diện/Mùa · Dữ liệu · Thông báo · Chung ---- */
function scSettings() {
  // hàng cài đặt: icon + label/desc + control phải. act → cả hàng tap được.
  const row = (icon, title, desc, right, act) =>
    `<div class="set-row" ${act ? `data-act="${act}"` : ""}>
      <div class="si">${icon}</div>
      <div class="sl"><div class="t">${title}</div>${desc ? `<div class="d">${desc}</div>` : ""}</div>
      ${right ? `<div class="sa">${right}</div>` : ""}
    </div>`;
  const tg = (on) => `<span class="toggle ${on ? "on" : ""}"></span>`;
  const chev = `<span class="set-chev">›</span>`;
  const seg = (act, opts) => `<div class="seg-wrap"><div class="segment">${opts.map((o) =>
    `<button class="${o.sel ? "active" : ""}" data-act="${act}" data-id="${o.id}">${o.label}</button>`).join("")}</div></div>`;

  const proCard = state.proActive
    ? `<div class="pro-card owned">
        <div class="pc-glow">👑</div>
        <div class="pc-body"><div class="pc-title">Pro đã kích hoạt ✓</div>
          <div class="pc-sub">Cảm ơn bạn đã ủng hộ Memory Garden 💚</div></div>
      </div>`
    : `<div class="pro-card" data-act="pro">
        <div class="pc-glow">👑</div>
        <div class="pc-body"><div class="pc-title">Memory Garden Pro</div>
          <div class="pc-sub">Không giới hạn kỷ niệm & ảnh · Backup nâng cao · Premium widgets</div></div>
        <div class="pc-cta">Lifetime</div>
      </div>`;

  const wipeBlock = state.confirmWipe
    ? `<div class="danger-confirm">
        <div class="dc-title">⚠️ Xóa toàn bộ dữ liệu?</div>
        <div class="dc-sub">Mọi kỷ niệm, ảnh và tiến trình khu vườn sẽ bị xóa <b>vĩnh viễn</b> khỏi máy. Không thể hoàn tác. Nên Export ZIP trước.</div>
        <div class="dc-actions">
          <button class="btn secondary" data-act="wipeCancel">Hủy</button>
          <button class="btn danger" data-act="wipeConfirm">Xóa vĩnh viễn</button>
        </div>
      </div>`
    : `<button class="btn danger-out" data-act="wipeData">🗑️ Xóa toàn bộ dữ liệu</button>`;

  return {
    title: "Cài đặt", sub: "Memory Garden", back: "more",
    body: `
    <!-- 1. Tài khoản & Gói -->
    <div class="section-title">Tài khoản & Gói</div>
    ${proCard}
    <div class="card set-group">
      ${row("♻️", "Khôi phục mua hàng", "Lấy lại Theme / Pro đã mua trước đó", chev, "restore")}
      ${row("🎨", "Theme & Skins", "Japanese · Fantasy · Pixel Garden", chev, "customize")}
    </div>

    <!-- 2. Giao diện & Mùa -->
    <div class="section-title">Giao diện & Mùa</div>
    <div class="card set-group">
      ${row("🖼️", "Phong cách hiển thị", "Cozy mềm mại ↔ Pixel hoài cổ", "", "")}
      ${seg("setTheme", [
        { id: "cozy", label: "🌸 Cozy", sel: state.theme === "cozy" },
        { id: "pixel", label: "🎮 Pixel", sel: state.theme === "pixel" },
      ])}
      ${row("🌐", "Bán cầu", "Khớp lịch 4 mùa với nơi bạn sống", "", "")}
      ${seg("hemi", [
        { id: "north", label: "⬆️ Bắc bán cầu", sel: state.hemisphere === "north" },
        { id: "south", label: "⬇️ Nam bán cầu", sel: state.hemisphere === "south" },
      ])}
      ${row(seasonById(state.season).particle, "Hiệu ứng môi trường", "Hạt rơi theo mùa trong vườn", tg(state.particleFx), "toggleFx")}
    </div>

    <!-- 3. Dữ liệu & Quyền riêng tư -->
    <div class="section-title">Dữ liệu & Quyền riêng tư</div>
    <div class="card set-group">
      ${row("📦", "Export ZIP", "Xuất toàn bộ dữ liệu ra file nén", chev, "exportZip")}
      ${row("📥", "Import ZIP", "Khôi phục từ file đã sao lưu", chev, "importZip")}
      ${row("💾", "Backup & Restore", `Lần cuối: ${BACKUP.lastDays} ngày trước · Local-first`, chev, "backup")}
      <div class="set-row">
        <div class="si">🗄️</div>
        <div class="sl">
          <div class="t">Dung lượng đã dùng</div>
          <div class="d">${STORAGE.totalMB} MB · ${STORAGE.photos} ảnh · ${STORAGE.videos} video (ước tính)</div>
          <div class="bar" style="margin-top:7px"><span style="width:62%"></span></div>
        </div>
      </div>
    </div>
    ${wipeBlock}

    <!-- 4. Tiện ích & Thông báo -->
    <div class="section-title">Tiện ích & Thông báo</div>
    <div class="card set-group">
      ${row("🔔", "Nhắc ghi chép hàng ngày",
        state.dailyReminder ? `Mỗi ngày lúc ${state.reminderTime} — giữ streak gieo hạt` : "Đang tắt",
        tg(state.dailyReminder), "toggleReminder")}
      ${row("📱", "Widgets", "On This Day · Garden Progress · Recent", chev, "widgets")}
    </div>

    <!-- 5. Chung & Hỗ trợ -->
    <div class="section-title">Chung & Hỗ trợ</div>
    <div class="card set-group">
      ${row("🌍", "Ngôn ngữ", "Language", "", "")}
      ${seg("lang", [
        { id: "vi", label: "Tiếng Việt", sel: state.lang === "vi" },
        { id: "en", label: "English", sel: state.lang === "en" },
      ])}
      ${row("ℹ️", "Về ứng dụng", "Phiên bản 1.0.0 (MVP) · Chính sách bảo mật", chev, "about")}
      ${row("✉️", "Gửi phản hồi", "Góp ý cho nhà phát triển", chev, "feedback")}
      ${row("🚀", "Xem lại Onboarding", "Chạy lại trải nghiệm gieo mầm", chev, "replayOnb")}
    </div>

    <div class="hint">🔒 Local-first: mọi dữ liệu lưu trên máy (Room + DataStore), không tài khoản, không gửi lên server. Các lựa chọn ở đây lưu bằng DataStore.</div>
    `,
  };
}

/* ---- Memory detail ---- */
function scMemoryDetail() {
  const m = MEMORIES.find((x) => x.id === state.selMemory) || MEMORIES[0];
  const c = catById(m.cat);
  const pl = plantById(m.plant);
  const mo = m.mood && moodById(m.mood);
  return {
    title: "Memory", sub: fmtDate(m.date), back: "timeline",
    body: `
    <div class="card" style="overflow:hidden;margin-bottom:14px">
      <div style="height:200px;display:grid;place-items:center;font-size:96px;background:var(--bg-elev)">${m.photo}</div>
      <div style="padding:16px">
        <div style="font-family:var(--font-display);font-size:20px;font-weight:800">${m.title}</div>
        <div class="chips" style="margin:10px 0">
          <span class="chip active" style="background:${c.color};border-color:${c.color}">${c.emoji} ${c.name}</span>
          <span class="chip">${m.sub}</span>
          ${mo ? `<span class="chip mood-chip">${mo.emoji} ${mo.name}</span>` : ""}
        </div>
        <p style="font-size:14px;line-height:1.6;color:var(--text)">${m.desc}</p>
        <div class="chips" style="margin-top:12px">${m.tags.map((t) => `<span class="chip">#${t}</span>`).join("")}</div>
      </div>
    </div>

    <div class="card" style="padding:16px;display:flex;align-items:center;gap:14px;margin-bottom:14px">
      <div style="font-size:48px">${pl ? pl.emoji : "🌱"}</div>
      <div style="flex:1">
        <div style="font-size:11px;color:var(--text-dim)">Cây mọc từ kỷ niệm này</div>
        <div style="font-weight:800">${pl ? pl.name : "Đang lớn"}</div>
        <div style="font-size:12px;color:${RARITY[m.rarity].color};font-weight:700">${stars(m.rarity)} ${RARITY[m.rarity].name}</div>
      </div>
      <button class="btn sm secondary" data-act="atlas">Xem Atlas</button>
    </div>

    <button class="btn" data-act="shareMemory" style="margin-bottom:10px">📤 Chia sẻ kỷ niệm</button>
    <div style="display:flex;gap:10px">
      <button class="btn secondary" data-act="editMemory">✏️ Sửa</button>
      <button class="btn secondary" data-act="delMemory" style="color:#d05656">🗑️ Xóa</button>
    </div>
    `,
  };
}

/* ---- Plant detail ---- */
function scPlantDetail() {
  const p = plantById(state.selPlant) || PLANTS[0];
  const c = catById(p.cat);
  const se = seasonById(plantSeason(p));
  const inSeason = p.season === state.season;
  if (!p.unlocked) {
    return {
      title: "Locked", sub: `Dex #${dexNo(p.id)} · Chưa mở khóa`, back: "atlas",
      body: `<div class="empty-state">
        <div class="big" style="filter:grayscale(1) brightness(.4)">${p.emoji}</div>
        <div style="font-size:40px;margin:10px">🔒</div>
        <div style="font-weight:800;font-size:16px;color:var(--text)">? ? ?</div>
        <p style="margin-top:8px">Cây <b>${RARITY[p.rarity].name}</b> thuộc nhóm <b>${c.emoji} ${c.name}</b>.</p>
        <p style="margin-top:6px">🌸 Nở rộ vào <b>mùa ${se.name} ${se.emoji}</b>.</p>
        ${p.seasonal
          ? `<p style="margin-top:6px">🗓️ <b>Seasonal-exclusive</b> — chỉ mở khóa khi đang là mùa ${se.name}.
             ${inSeason
               ? `<b style="color:var(--primary)">Đang đúng mùa — tạo memory ${c.name} ngay!</b>`
               : `Hiện ngoài mùa. Chờ mùa ${se.name}, hoặc xem ad để có <b>Out-of-season Seed</b>.`}</p>
             ${!inSeason ? `<button class="btn reward" data-act="reward" style="margin-top:14px">🎁 Xem ad → Out-of-season Seed</button>` : ""}`
          : ""}
        <button class="btn ${p.seasonal && !inSeason ? "secondary" : ""}" data-act="create" style="margin-top:${p.seasonal && !inSeason ? 10 : 18}px">🌱 Tạo memory ${c.name}</button>
        <button class="btn secondary" data-act="catch" data-id="${p.id}" style="margin-top:10px">🎬 Xem hiệu ứng sưu tầm</button>
      </div>`,
    };
  }
  return {
    title: p.name, sub: `Dex #${dexNo(p.id)} · ${RARITY[p.rarity].name}`, back: "atlas",
    body: `<div class="empty-state">
      <div style="font-size:110px">${p.emoji}</div>
      <div style="font-weight:800;font-size:20px;color:var(--text);font-family:var(--font-display)">${p.name}</div>
      <div style="font-size:18px;color:${RARITY[p.rarity].color};margin:6px 0;font-weight:800">${stars(p.rarity)}</div>
      <span class="chip active" style="background:${c.color};border-color:${c.color}">${c.emoji} ${c.name}</span>
      <p style="margin-top:14px">Đã mở khóa ✓ — nở từ một kỷ niệm của bạn.</p>
      <p style="margin-top:6px">🌸 Nở rộ <b>mùa ${se.name} ${se.emoji}</b> · bloom ${se.variant}${p.seasonal ? " · 🗓️ seasonal" : ""}.</p>
    </div>
    <div class="section-title">Vòng đời cây</div>
    <div class="card" style="display:flex;justify-content:space-around;padding:16px">
      ${STAGES.map((s, i) => `<div style="text-align:center;opacity:${i <= 3 ? 1 : .4}">
        <div style="font-size:28px">${s.emoji}</div>
        <div style="font-size:9px;color:var(--text-dim);margin-top:4px">${s.name}</div></div>`).join("")}
    </div>`,
  };
}

/* ============================================================
   ROUTER
   ============================================================ */
const ROUTES = {
  garden: scGarden, atlas: scAtlas, timeline: scTimeline, create: scCreate,
  more: scMore, categories: scCategories, milestones: scMilestones,
  widgets: scWidgets, customize: scCustomize, backup: scBackup,
  settings: scSettings,
  memory: scMemoryDetail, plant: scPlantDetail,
};

function render() {
  // áp mùa lên toàn app: data-season (CSS hook) + tint cho overlay vườn
  const s = seasonById(state.season);
  document.body.dataset.season = s.id;
  document.body.style.setProperty("--season-tint", s.tint);

  const fn = ROUTES[state.screen] || scGarden;
  const v = fn();
  el("#barTitle").innerHTML = `${v.title}<small>${v.sub || ""}</small>`;
  el("#barBack").style.display = v.back ? "grid" : "none";
  el("#barBack").dataset.act = v.back || "";
  el("#screenBody").innerHTML = v.body;
  el("#screenBody").scrollTop = 0;
  renderNav();
}

/* ============================================================
   BLOOM ANIMATION (First Bloom Guarantee + Blank-to-Bloom)
   ============================================================ */
function playBloom() {
  const phone = el(".phone");
  const conf = Array.from({ length: 10 }, (_, i) =>
    `<span class="confetti" style="left:${5 + i * 9}%;animation-delay:${i * .15}s">${["🌸","🌺","✨","🌼","💚"][i % 5]}</span>`).join("");
  const ov = document.createElement("div");
  ov.className = "bloom-overlay";
  ov.innerHTML = `${conf}
    <div class="seedling" id="seedStage">🌰</div>
    <h2>First Bloom! 🌺</h2>
    <p>Kỷ niệm của bạn vừa nở thành một cây đặc biệt</p>
    <span class="rare-tag">★★★★ Aurora Bloom · Legendary</span>
    <button class="btn" style="max-width:200px;margin-top:8px" data-act="closeBloom">Tuyệt vời! Vào vườn xem</button>`;
  phone.appendChild(ov);

  // seed → sprout → plant → bloom
  const seq = ["🌰", "🌱", "🪴", "🌺"];
  let i = 0;
  const seed = ov.querySelector("#seedStage");
  const iv = setInterval(() => {
    i++;
    if (i >= seq.length) { clearInterval(iv); return; }
    seed.textContent = seq[i];
    seed.style.animation = "none"; void seed.offsetWidth; seed.style.animation = "bloomPop 1s ease";
  }, 700);
  ov._iv = iv;
}

/* ============================================================
   FX OVERLAYS — share card / AI recap / quick capture / catch / confirm
   Lớp phủ .phone, dùng chung .fx-overlay. Đóng bằng act "closeFx".
   ============================================================ */
function openFx(inner, extraCls = "") {
  closeFx();
  const ov = document.createElement("div");
  ov.className = `fx-overlay ${extraCls}`;
  ov.innerHTML = `<div class="fx-sheet">${inner}</div>`;
  el(".phone").appendChild(ov);
  return ov;
}
function closeFx() {
  const ov = el(".fx-overlay");
  if (ov) { if (ov._iv) clearInterval(ov._iv); ov.remove(); }
}

/* Social Share Card — xuất card kỷ niệm hoặc khu vườn (preview tĩnh). */
function playShareCard(kind, id) {
  const s = seasonById(state.season);
  let card;
  if (kind === "memory") {
    const m = MEMORIES.find((x) => x.id === id) || MEMORIES[0];
    const pl = plantById(m.plant);
    card = `<div class="share-card season-${s.id}">
      <div class="sc-photo">${m.photo}</div>
      <div class="sc-title">${m.title}</div>
      <div class="sc-meta">${catById(m.cat).emoji} ${m.sub} · ${fmtDate(m.date)}</div>
      <div class="sc-plant">${pl ? pl.emoji + " " + pl.name : ""} ${stars(m.rarity)}</div>
      <div class="sc-mark">🌱 Memory Garden</div>
    </div>`;
  } else {
    card = `<div class="share-card season-${s.id}">
      <div class="sc-photo">🌳</div>
      <div class="sc-title">Khu vườn của tôi</div>
      <div class="sc-meta">${STATS.unlockedPlants}/${STATS.totalPlants} loài · ${STATS.totalMemories} kỷ niệm · mùa ${s.name} ${s.emoji}</div>
      <div class="sc-garden">🌸 🪴 🌷 🌵 🌻 🍁 🌹</div>
      <div class="sc-mark">🌱 Memory Garden</div>
    </div>`;
  }
  openFx(`${card}
    <div class="fx-actions">
      <button class="btn" data-act="saveShare">💾 Lưu ảnh</button>
      <button class="btn secondary" data-act="closeFx">Đóng</button>
    </div>`, "share-overlay");
}

/* AI Memory Recap (Phase 2 — preview tĩnh, không gọi AI). */
function playRecap() {
  const may = MEMORIES.filter((m) => m.date.slice(0, 7) === "2026-05");
  const collage = (may.length ? may : MEMORIES.slice(0, 4)).map((m) => m.photo).join(" ");
  openFx(`<div class="recap-preview">
    <span class="soon">Preview · Phase 2</span>
    <div class="rp-emoji">✨</div>
    <h2>Tháng 5 của bạn</h2>
    <div class="rp-collage">${collage}</div>
    <p>Một tháng nhiều nắng và cà phê sớm. Bạn leo Langbiang, mừng 2 năm bên nhau,
      và gieo ${may.length || MEMORIES.length} kỷ niệm — khu vườn nở thêm những mầm xanh. 🌿</p>
    <div class="rp-note">AI sẽ tự viết đoạn này từ kỷ niệm của bạn — ra mắt ở bản sau.</div>
  </div>
  <div class="fx-actions">
    <button class="btn" data-act="shareRecap">📤 Chia sẻ recap</button>
    <button class="btn secondary" data-act="closeFx">Đóng</button>
  </div>`, "recap-overlay");
}

/* Goal 3 Unlock — Timeline mở: celebrate + offer navigate */
function playTimelineUnlock() {
  openFx(`<div class="confirm-box" style="text-align:center;padding:28px 20px">
    <div style="font-size:64px;margin-bottom:10px">🎉</div>
    <div style="font-family:var(--font-display);font-size:20px;font-weight:800;margin-bottom:10px">Timeline đã mở!</div>
    <p style="color:var(--text-dim);font-size:14px;line-height:1.6;margin-bottom:18px">
      Bạn đã hoàn thành <b>3 Memories Starter Quest</b> 🌱<br>
      Giờ có thể xem lại hành trình ký ức của mình.
    </p>
    <div class="fx-actions" style="flex-direction:column;gap:8px">
      <button class="btn" data-act="unlockTimeline">🕰️ Xem Timeline ngay</button>
      <button class="btn secondary" data-act="closeFx">Về Garden</button>
    </div>
  </div>`, "confirm-overlay");
}

/* Quick-capture — bottom sheet rút gọn: 1 ảnh + 1 dòng. */
function playQuickCapture() {
  openFx(`<div class="qc-sheet">
    <div class="qc-handle"></div>
    <h2>⚡ Ghi nhanh</h2>
    <p class="qc-sub">1 ảnh + 1 dòng — phần còn lại để sau.</p>
    <div class="gallery-strip">
      ${["📸","🌅","🍰","🐶","🎡","🌃"].map((g) =>
        `<div class="g" data-act="qcPick" data-emo="${g}">${g}</div>`).join("")}
    </div>
    <input class="qc-input" placeholder="Hôm nay có gì vui?">
    <button class="btn" data-act="qcSave">🌱 Gieo nhanh</button>
  </div>`, "qc-overlay sheet");
}

/* Pokédex catch animation — reveal kiểu "bắt được cây mới". */
function playCatch(plantId) {
  const p = plantById(plantId) || PLANTS[0];
  const conf = Array.from({ length: 10 }, (_, i) =>
    `<span class="confetti" style="left:${6 + i * 9}%;animation-delay:${(i * .12).toFixed(2)}s">${["✨","🌟","💫","🎉"][i % 4]}</span>`).join("");
  const ov = openFx(`${conf}
    <div class="catch-ball" id="catchBall">🌰</div>
    <div class="catch-reveal" id="catchReveal">
      <div class="cr-dex">#${dexNo(p.id)}</div>
      <div class="cr-emo">${p.emoji}</div>
      <h2>Đã sưu tầm!</h2>
      <div class="cr-name">${p.name}</div>
      <div class="cr-rarity" style="color:${RARITY[p.rarity].color}">${stars(p.rarity)} ${RARITY[p.rarity].name}</div>
      <button class="btn" data-act="closeFx" style="margin-top:10px">Thêm vào Atlas 📖</button>
    </div>`, "catch-overlay");
  const ball = ov.querySelector("#catchBall");
  const seq = ["🌰", "🫙", "✨", p.emoji];
  let i = 0;
  ov._iv = setInterval(() => {
    i++;
    if (i >= seq.length) {
      clearInterval(ov._iv);
      const rev = ov.querySelector("#catchReveal");
      if (rev) rev.classList.add("show");
      return;
    }
    ball.textContent = seq[i];
    ball.style.animation = "none"; void ball.offsetWidth; ball.style.animation = "bloomPop .6s ease";
  }, 550);
  return ov;
}

/* Confirm xóa memory (mockup) — bước xác nhận nhẹ. */
function confirmDelete() {
  openFx(`<div class="confirm-box">
    <div class="cb-emo">🗑️</div>
    <h2>Xóa kỷ niệm?</h2>
    <p>Cây đã nở từ kỷ niệm này vẫn ở lại Atlas. Thao tác (mockup) không thể hoàn tác.</p>
    <div class="fx-actions">
      <button class="btn secondary" data-act="closeFx">Hủy</button>
      <button class="btn" data-act="confirmDel" style="background:#d05656">Xóa</button>
    </div>
  </div>`, "confirm-overlay");
}

/* Gallery-seeded: map emoji ảnh → category/sub/tiêu đề auto (giả lập ML Kit). */
const GALLERY_SEED = {
  "🏖️": { cat: "adventure", sub: "Beach", title: "Một ngày ở biển", loc: "Bãi biển" },
  "🌅": { cat: "adventure", sub: "Hiking", title: "Bình minh trên cao", loc: "Đỉnh núi" },
  "🍰": { cat: "food",      sub: "New Food", title: "Món ngọt hôm nay", loc: "Quán cà phê" },
  "🐶": { cat: "relationship", sub: "Date", title: "Đi chơi cùng nhau", loc: "Công viên" },
  "🎡": { cat: "entertain", sub: "Concert", title: "Một buổi tối vui", loc: "Khu vui chơi" },
  "🌃": { cat: "adventure", sub: "Travel", title: "Thành phố về đêm", loc: "Trung tâm" },
};

/* ============================================================
   ONBOARDING — "trải nghiệm gieo mầm" (5s concept → first bloom → tour)
   Overlay phủ toàn phone. Mục tiêu: hiểu concept "game sưu tầm kỷ niệm"
   trong 5 giây, rồi tự tay gieo hạt đầu tiên → đáp xuống Garden.
   ============================================================ */

/* cảm xúc/khoảnh khắc để gieo hạt đầu — map sang category thật */
const ONB_MOODS = [
  { emo: "☕", cat: "food",         label: "Cà phê" },
  { emo: "🏖️", cat: "adventure",    label: "Biển" },
  { emo: "🎉", cat: "milestone",    label: "Cột mốc" },
  { emo: "💞", cat: "relationship", label: "Yêu thương" },
  { emo: "📖", cat: "growth",       label: "Học hỏi" },
  { emo: "🌅", cat: "adventure",    label: "Bình minh" },
];

function onbDots(active) {
  return `<div class="onb-dots">${[0, 1, 2, 3, 4].map((i) =>
    `<i class="${i === active ? "on" : ""}"></i>`).join("")}</div>`;
}
function onbTop(step) {
  return `<div class="onb-top">${onbDots(step)}
    <button class="onb-skip" data-act="onbSkip">Bỏ qua ›</button></div>`;
}

function onbPanel() {
  switch (onboard.step) {
    case 0: // WELCOME — truyền concept trong 5 giây
      return `${onbTop(0)}
      <div class="onb-panel">
        <div class="onb-hero"><span id="onbGrow">🌱</span></div>
        <h1 class="onb-title">Memory Garden</h1>
        <p class="onb-lead">Mỗi kỷ niệm là một <b>hạt giống</b>.<br>
          Mỗi trải nghiệm làm <b>khu vườn</b> của bạn lớn lên.</p>
        <div class="onb-note">🔒 Không cần tài khoản · dữ liệu lưu ngay trên máy</div>
        <button class="btn" data-act="onbNext">Bắt đầu gieo mầm 🌱</button>
      </div>`;

    case 1: // STYLE — cá nhân hóa cảm xúc ngay lập tức
      return `${onbTop(1)}
      <div class="onb-panel">
        <h1 class="onb-title sm">Chọn phong cách vườn</h1>
        <p class="onb-lead">Đổi bất cứ lúc nào trong cài đặt.</p>
        <div class="onb-styles">
          <div class="onb-style-card ${state.theme === "cozy" ? "sel" : ""}" data-act="onbStyle" data-id="cozy">
            <div class="onb-sw"><span>🌸</span><span>🌿</span><span>🌷</span></div>
            <div class="nm">🌸 Cozy</div><div class="d">Pastel · mềm mại · bo tròn</div>
          </div>
          <div class="onb-style-card ${state.theme === "pixel" ? "sel" : ""}" data-act="onbStyle" data-id="pixel">
            <div class="onb-sw"><span>🌱</span><span>🎮</span><span>🟩</span></div>
            <div class="nm">🎮 Pixel</div><div class="d">Pixel art · retro · viền đậm</div>
          </div>
        </div>
        <button class="btn" data-act="onbNext">Tiếp tục</button>
      </div>`;

    case 2: { // SEED — interactive: tự tay gieo kỷ niệm đầu tiên
      const moods = ONB_MOODS.map((m) =>
        `<button class="onb-mood ${m.emo === onboard.seedEmoji ? "sel" : ""}" data-act="onbMood" data-emo="${m.emo}" data-cat="${m.cat}">
          <span class="e">${m.emo}</span><span class="l">${m.label}</span></button>`).join("");
      return `${onbTop(2)}
      <div class="onb-panel">
        <div class="onb-hero sm"><span>🌰</span></div>
        <h1 class="onb-title sm">Khoảnh khắc đầu tiên</h1>
        <p class="onb-lead">Chạm vào điều khiến hôm nay đáng nhớ — ta gieo nó thành cây.</p>
        <div class="onb-moods">${moods}</div>
        <div class="onb-seedline">🌱 “Bắt đầu hành trình tại Memory Garden”</div>
        <button class="btn" data-act="onbPlant">🌱 Lưu &amp; gieo hạt</button>
      </div>`;
    }

    case 3: // BLOOM + REWARD — aha moment
      return `<div class="onb-panel onb-bloom">
        <div class="onb-conf" id="onbConf"></div>
        <div class="onb-seedling" id="onbSeed">🌰</div>
        <div class="onb-reveal" id="onbReveal">
          <h1 class="onb-title">First Bloom! 🌺</h1>
          <p class="onb-lead">Kỷ niệm đầu tiên vừa nở thành một cây hiếm.</p>
          <div class="onb-rewards">
            <span class="onb-pill gold">🏆 First Memory</span>
            <span class="onb-pill">🎁 +1 Rare Seed</span>
          </div>
          <button class="btn" data-act="onbNext">Tuyệt vời! 🌿</button>
        </div>
      </div>`;

    case 4: { // TOUR — Atlas + Season + Widget (retention hooks)
      const s = seasonById(state.season);
      return `${onbTop(4)}
      <div class="onb-panel">
        <h1 class="onb-title sm">Khu vườn còn nhiều điều</h1>
        <div class="onb-feats">
          <div class="onb-feat"><div class="fi">📖</div><div>
            <div class="ft">Atlas sưu tầm</div>
            <div class="fd">${STATS.totalPlants}+ loài cây chờ mở khóa — như một Pokédex.</div></div></div>
          <div class="onb-feat"><div class="fi">${s.emoji}</div><div>
            <div class="ft">4 mùa sống động</div>
            <div class="fd">Vườn đổi sắc theo mùa thật. Đang là mùa ${s.name}.</div></div></div>
          <div class="onb-feat"><div class="fi">📱</div><div>
            <div class="ft">Widget nhắc nhớ</div>
            <div class="fd">“On This Day” đưa kỷ niệm cũ ra màn hình chính.</div></div></div>
        </div>
        <button class="btn" data-act="onbFinish">Vào vườn của tôi 🌿</button>
      </div>`;
    }
  }
}

function renderOnboarding() {
  let ov = el("#onboarding");
  if (!ov) {
    ov = document.createElement("div");
    ov.id = "onboarding";
    ov.className = "onboarding";
    el(".phone").appendChild(ov);
  }
  ov.dataset.step = onboard.step;
  ov.innerHTML = onbPanel();
  if (onboard.step === 0) onbHeroCycle();
  if (onboard.step === 3) onbBloomPlay();
}

/* hero màn welcome: vòng lặp seed → bloom để show concept "lớn lên" */
let _onbHeroIv;
function onbHeroCycle() {
  clearInterval(_onbHeroIv);
  const seq = ["🌱", "🌿", "🪴", "🌸", "🌺"];
  let i = 0;
  const node = el("#onbGrow");
  _onbHeroIv = setInterval(() => {
    if (!node || !document.body.contains(node)) { clearInterval(_onbHeroIv); return; }
    i = (i + 1) % seq.length;
    node.textContent = seq[i];
    node.style.animation = "none"; void node.offsetWidth; node.style.animation = "bloomPop .8s ease";
  }, 850);
}

/* bloom step: seed nảy mầm → nở → lộ phần thưởng */
function onbBloomPlay() {
  const conf = el("#onbConf");
  if (conf) conf.innerHTML = Array.from({ length: 12 }, (_, i) =>
    `<span class="confetti" style="left:${4 + i * 8}%;animation-delay:${(i * .12).toFixed(2)}s">${["🌸","🌺","✨","🌼","💚"][i % 5]}</span>`).join("");
  const seq = ["🌰", "🌱", "🪴", "🌸", "🌺"];
  let i = 0;
  const seed = el("#onbSeed");
  const iv = setInterval(() => {
    if (!seed || !document.body.contains(seed)) { clearInterval(iv); return; }
    i++;
    if (i >= seq.length) {
      clearInterval(iv);
      const rev = el("#onbReveal");
      if (rev) rev.classList.add("show");
      return;
    }
    seed.textContent = seq[i];
    seed.style.animation = "none"; void seed.offsetWidth; seed.style.animation = "bloomPop .7s ease";
  }, 620);
}

/* áp kết quả onboarding vào data thật: mở cây hiếm + lấp ô trống trong vườn */
function onbApplyFirstBloom() {
  if (onboard.applied) return;
  onboard.applied = true;
  const aurora = plantById("p05"); // Aurora Bloom — Legendary
  if (aurora) aurora.unlocked = true;
  MEMORIES.unshift({
    id: "m_onb", title: "Bắt đầu hành trình tại Memory Garden",
    cat: onboard.seedCat, sub: "First", date: "2026-06-08",
    photo: onboard.seedEmoji, plant: "p05", rarity: "legendary",
    desc: "Khoảnh khắc đầu tiên được gieo xuống khu vườn. Mọi hành trình lớn đều bắt đầu từ một hạt giống.",
    tags: ["first", "journey"],
  });
  const empty = GARDEN_PLOTS.find((p) => !p.plant);
  if (empty) { empty.plant = "p05"; empty.stage = 4; empty.memory = "m_onb"; empty.fresh = true; }
}

function startOnboarding() {
  onboard.active = true; onboard.step = 0; onboard.applied = false;
  // reset progressive unlock để replay lại flow từ đầu (demo/mockup)
  state.goals = { g1: false, g2: false, g3: false };
  state.newMemCount = 0;
  renderOnboarding();
}
function endOnboarding(toGarden) {
  clearInterval(_onbHeroIv);
  onboard.active = false;
  const ov = el("#onboarding");
  if (ov) ov.remove();
  if (toGarden) {
    go("garden");
    if (!coach.seen) setTimeout(startCoach, 450); // vào vườn lần đầu → bật coach guide
  }
}

/* ============================================================
   COACH MARKS — hướng dẫn nhanh khi LẦN ĐẦU vào Garden.
   Spotlight overlay: khoét sáng 1 element + tooltip. KHÔNG thuộc router.
   Mục tiêu: user mới biết (1) vườn là gì, (2) cách thêm kỷ niệm, (3) mục tiêu.
   ============================================================ */
const coach = { i: 0, seen: false };
const COACH_STEPS = [
  { sel: ".plot.empty", pad: 8,
    title: "Ô đất đang chờ 🌱",
    text: "Đây là khu vườn của bạn. Mỗi kỷ niệm ghi lại sẽ mọc thành một cái cây — ô trống là chỗ cây mới được gieo." },
  { sel: ".navitem.fab", pad: 10, round: true,
    title: "Thêm kỷ niệm ở đây ➕",
    text: "Chạm nút + để ghi một khoảnh khắc. Mỗi kỷ niệm là một hạt giống, gieo xuống rồi lớn dần thành cây." },
  { sel: ".ring-wrap", pad: 8,
    title: "Mục tiêu khu vườn 🎯",
    text: "Sưu tầm đủ các loài cây để lấp đầy Atlas. Vòng tiến độ cho biết bạn đang ở đâu trên hành trình." },
];

function startCoach() {
  coach.i = 0;
  renderCoachStep();
}

function renderCoachStep() {
  // bỏ qua step nào không tìm thấy target (vd vườn hết ô trống)
  while (coach.i < COACH_STEPS.length && !el(COACH_STEPS[coach.i].sel)) coach.i++;
  if (coach.i >= COACH_STEPS.length) { endCoach(); return; }

  const step = COACH_STEPS[coach.i];
  const target = el(step.sel);
  const screen = el("#screenBody");
  if (screen.contains(target)) target.scrollIntoView({ block: "center", inline: "nearest" });

  // chờ scroll/layout xong (2 frame) rồi mới đo vị trí
  requestAnimationFrame(() => requestAnimationFrame(() => paintCoach(step, target)));
}

function paintCoach(step, target) {
  const phone = el(".phone");
  const pr = phone.getBoundingClientRect();
  const tr = target.getBoundingClientRect();
  const scale = pr.width / phone.offsetWidth || 1;   // bù transform: scale() ở màn nhỏ
  const pad = step.pad || 6;
  const left = (tr.left - pr.left) / scale - pad;
  const top  = (tr.top  - pr.top)  / scale - pad;
  const w    = tr.width  / scale + pad * 2;
  const h    = tr.height / scale + pad * 2;

  let ov = el("#coach");
  if (!ov) {
    ov = document.createElement("div");
    ov.id = "coach";
    ov.className = "coach";
    phone.appendChild(ov);
  }

  const last = coach.i === COACH_STEPS.length - 1;
  const dots = COACH_STEPS.map((_, i) => `<i class="${i === coach.i ? "on" : ""}"></i>`).join("");

  // tooltip: target nửa trên → đặt tip phía dưới; nửa dưới → đặt phía trên
  const phoneH = phone.offsetHeight;
  const below = (top + h / 2) < phoneH * 0.5;
  const tipPos = below ? `top:${top + h + 12}px` : `bottom:${phoneH - top + 12}px`;

  ov.innerHTML = `
    <div class="coach-hole ${step.round ? "round" : ""}"
         style="left:${left}px;top:${top}px;width:${w}px;height:${h}px"></div>
    <div class="coach-tip" style="${tipPos}">
      <div class="coach-dots">${dots}</div>
      <div class="coach-title">${step.title}</div>
      <div class="coach-text">${step.text}</div>
      <div class="coach-actions">
        <button class="coach-skip" data-act="coachSkip">Bỏ qua</button>
        <button class="btn sm" data-act="coachNext">${last ? "Bắt đầu thôi 🌿" : "Tiếp ›"}</button>
      </div>
    </div>`;
}

function endCoach() {
  coach.seen = true;
  const ov = el("#coach");
  if (ov) ov.remove();
}

/* ============================================================
   EVENT HANDLING
   ============================================================ */
function handleAct(act, ds) {
  switch (act) {
    case "season":     state.season = ds.id; toast(`${seasonById(ds.id).emoji} Chuyển sang mùa ${seasonById(ds.id).name}`); render(); break;
    case "atlasCat":   state.atlasCat = ds.id; render(); break;
    case "tlView":     state.tlView = ds.id; render(); break;
    case "createCat":  state.createCat = ds.id; render(); break;
    case "memory":     state.selMemory = ds.id; go("memory"); break;
    case "plant":      state.selPlant = ds.id; go("plant"); break;
    case "createMood": state.createMood = ds.id; render(); break;
    case "reward":     toast("🎁 +1 Mystery Seed! (rewarded ad)"); break;
    case "saveMemory":
      if (state.editing) { state.editing = false; toast("💾 Đã lưu thay đổi"); go("memory"); }
      else {
        state.newMemCount++;
        if (state.goals.g1 && !state.goals.g2) state.goals.g2 = true; // Goal 2: memory đầu tiên ngoài onboarding
        if (state.goals.g2 && !state.goals.g3 && state.newMemCount >= 2) {
          state.goals.g3 = true; // Goal 3: đủ 3 memories → mở Timeline
          go("garden"); setTimeout(playTimelineUnlock, 200);
        } else {
          go("garden"); setTimeout(playBloom, 150);
        }
      }
      break;
    case "gallerySeed": {
      const seed = GALLERY_SEED[ds.emo];
      if (seed) state.createCat = seed.cat;  // chip category nhảy theo ảnh
      render();                               // re-render form với category mới
      const ic = el("#photoIcon"); if (ic) ic.textContent = ds.emo;
      const tt = el("#memTitle"); if (tt && seed) tt.value = seed.title;
      const res = el("#aiResult");
      if (res && seed) {
        res.style.display = "block";
        res.innerHTML = `✨ AI nhận diện: 📍 ${seed.loc} · 📅 hôm nay · 🏷️ ${catById(seed.cat).emoji} ${catById(seed.cat).name} · ${seed.sub}`;
      }
      toast("✨ AI điền ảnh + category + tiêu đề");
      break;
    }
    case "photo":      toast("📸 Mở camera / thư viện"); break;
    case "buy":        toast(`🛒 ${ds.nm} — mở mua / xem ad`); break;
    case "editMemory": state.editing = true; go("create"); break;
    case "delMemory":  confirmDelete(); break;
    case "confirmDel": closeFx(); toast("🗑️ Đã xóa (mockup)"); go("timeline"); break;
    case "pro":        toast("👑 Lifetime Pro — mở màn IAP"); break;
    case "backup":     go("backup"); break;
    case "exportZip":  BACKUP.lastDays = 0; state.backupDismissed = true; toast("📦 Đã export ZIP (local)"); render(); break;
    case "driveBackup":toast("☁️ Mở Google Drive — sao lưu thủ công"); break;
    case "toggleRemind": BACKUP.autoRemind = !BACKUP.autoRemind; render(); break;
    case "dismissBackup": state.backupDismissed = true; render(); break;
    // ---- Settings (Cài đặt) ----
    case "settings":   state.editing = false; go("settings"); break;
    case "setTheme":   setTheme(ds.id); render(); break;
    case "hemi":       state.hemisphere = ds.id; state.season = currentSeasonId();
                       toast(`🌐 ${ds.id === "north" ? "Bắc" : "Nam"} bán cầu · mùa ${seasonById(state.season).name}`); render(); break;
    case "toggleFx":   state.particleFx = !state.particleFx; toast(state.particleFx ? "✨ Bật hiệu ứng mùa" : "Tắt hiệu ứng mùa"); render(); break;
    case "toggleReminder": state.dailyReminder = !state.dailyReminder; toast(state.dailyReminder ? `🔔 Nhắc mỗi ngày ${state.reminderTime}` : "🔕 Tắt nhắc ghi chép"); render(); break;
    case "lang":       state.lang = ds.id; toast(ds.id === "vi" ? "🌍 Ngôn ngữ: Tiếng Việt" : "🌍 Language: English (mockup chưa dịch)"); render(); break;
    case "restore":    toast("♻️ Đang khôi phục mua hàng…"); break;
    case "importZip":  toast("📥 Chọn file ZIP để khôi phục"); break;
    case "about":      toast("ℹ️ v1.0.0 · Dữ liệu lưu cục bộ trên máy bạn"); break;
    case "feedback":   toast("✉️ Mở email góp ý cho nhà phát triển"); break;
    case "wipeData":   state.confirmWipe = true; render(); break;
    case "wipeCancel": state.confirmWipe = false; render(); break;
    case "wipeConfirm":state.confirmWipe = false; toast("🗑️ Đã xóa toàn bộ dữ liệu (mockup)"); render(); break;
    // share card / AI recap / quick-capture / catch / fx
    case "shareMemory": playShareCard("memory", state.selMemory); break;
    case "shareGarden": playShareCard("garden"); break;
    case "saveShare":   closeFx(); toast("💾 Đã lưu ảnh vào thư viện"); break;
    case "aiRecap":     playRecap(); break;
    case "shareRecap":  closeFx(); toast("📤 Mở chia sẻ recap"); break;
    case "quickCapture": playQuickCapture(); break;
    case "qcPick":      toast(`📷 Chọn ${ds.emo}`); break;
    case "qcSave":
      state.newMemCount++;
      if (state.goals.g1 && !state.goals.g2) state.goals.g2 = true;
      if (state.goals.g2 && !state.goals.g3 && state.newMemCount >= 2) {
        state.goals.g3 = true;
        closeFx(); go("garden"); setTimeout(playTimelineUnlock, 200);
      } else {
        closeFx(); toast("🌱 Đã gieo nhanh 1 kỷ niệm"); go("garden");
      }
      break;
    case "catch":       playCatch(ds.id || state.selPlant); break;
    case "closeFx":     closeFx(); break;
    case "closeBloom":
      const ov = el(".bloom-overlay"); if (ov) { clearInterval(ov._iv); ov.remove(); }
      go("garden");
      break;
    // onboarding flow
    case "onbNext":   onboard.step++; renderOnboarding(); break;
    case "onbStyle":  setTheme(ds.id); renderOnboarding(); break;
    case "onbMood":   onboard.seedEmoji = ds.emo; onboard.seedCat = ds.cat; renderOnboarding(); break;
    case "onbPlant":  onboard.step = 3; renderOnboarding(); break;
    case "onbSkip":   state.goals.g1 = true; endOnboarding(true); toast("Có thể xem lại phần giới thiệu ở More."); break;
    case "onbFinish": onbApplyFirstBloom(); state.goals.g1 = true; endOnboarding(true); toast("🌿 Chào mừng đến khu vườn của bạn!"); break;
    case "replayOnb": startOnboarding(); break;
    // coach guide
    case "coachNext":   coach.i++; renderCoachStep(); break;
    case "coachSkip":   endCoach(); break;
    case "coachReplay": coach.seen = false; state.editing = false; go("garden"); startCoach(); break;
    case "unlockTimeline": closeFx(); go("timeline"); break;
    case "demoUnlock": state.goals = {g1:true, g2:true, g3:true}; toast("🎯 Demo: đã mở tất cả tính năng"); render(); break;
    // navigation-style acts
    case "garden": case "atlas": case "timeline": case "create":
    case "more": case "categories": case "milestones": case "widgets":
    case "customize":
      state.editing = false; go(act); break;
  }
}

function init() {
  // style toggle
  document.querySelectorAll("[data-theme-btn]").forEach((b) => {
    b.addEventListener("click", () => setTheme(b.dataset.themeBtn));
  });

  // nút replay onboarding (ngoài phone — không qua delegation của #screenBody)
  const replay = el("#onbReplay");
  if (replay) replay.addEventListener("click", startOnboarding);

  // gear ⚙️ trên appbar → mở Cài đặt (ngoài #screenBody nên wire riêng)
  const gear = el("#barSettings");
  if (gear) gear.addEventListener("click", () => { state.editing = false; go("settings"); });

  // bottom nav (tap FAB Create = memory mới → thoát chế độ sửa)
  // Timeline locked before Goal 3 → show tip thay vì navigate
  el("#nav").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-nav]");
    if (!btn) return;
    const target = btn.dataset.nav;
    if (target === "timeline" && !state.goals.g3) {
      const done = Math.min(3, STATS.totalMemories + state.newMemCount);
      const rem = Math.max(0, 3 - done);
      toast(`🔒 Mở sau khi hoàn thành 3 Memories Quest · còn ${rem} kỷ niệm`);
      return;
    }
    state.editing = false; go(target);
  });

  // back button
  el("#barBack").addEventListener("click", (e) => {
    const dest = e.currentTarget.dataset.act;
    if (dest) { state.editing = false; go(dest); }
  });

  // delegated screen actions
  el("#screenBody").addEventListener("click", (e) => {
    const node = e.target.closest("[data-act]");
    if (!node) return;
    handleAct(node.dataset.act, node.dataset);
  });

  // delegated cho OVERLAY (bloom / onboarding / fx) — chúng nằm ngoài #screenBody
  // nên không được listener trên bắt. Scope chặt để không double-fire với screen body.
  el(".phone").addEventListener("click", (e) => {
    if (!e.target.closest(".bloom-overlay, #onboarding, .fx-overlay, #coach")) return;
    const node = e.target.closest("[data-act]");
    if (node) handleAct(node.dataset.act, node.dataset);
  });

  render();
  if (onboard.active) renderOnboarding(); // mở app → onboarding trước
}

document.addEventListener("DOMContentLoaded", init);
