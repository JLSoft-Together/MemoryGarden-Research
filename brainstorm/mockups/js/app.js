/* ============================================================
   Memory Garden — app.js
   Router + render 8 màn + interactions + style toggle.
   Vanilla JS, không framework. Event delegation trên #screenBody.
   ============================================================ */

/* mùa hiện tại = lịch thực (Bắc bán cầu) — demo mở đúng mùa của ngày chạy */
function currentSeasonId() {
  const m = new Date().getMonth();
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
};

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
    const active = n.id === state.screen ? "active" : "";
    return `<button class="navitem ${n.fab ? "fab" : ""} ${active}" data-nav="${n.id}">
      <span class="ico">${n.ico}</span><span>${n.label}</span>
    </button>`;
  }).join("");
}

function go(screen) {
  state.screen = screen;
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
/* lớp particle rơi trong vườn theo mùa */
function seasonFx() {
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
    return `<div class="plot ${boost ? "boost" : ""}" data-act="memory" data-id="${p.memory}" title="${pl.name}${boost ? " · +bonus mùa " + season.name : ""}">
      ${st.emoji === "🌰" ? "🌰" : pl.emoji}
      ${boost ? `<span class="boost-tag">${season.emoji}+</span>` : ""}
      <span class="stage-tag">${st.name}</span>
    </div>`;
  }).join("");

  return {
    title: "My Garden", sub: "8 cây đang lớn",
    body: `
    ${seasonStrip()}
    ${seasonBanner()}

    <div class="ring-wrap card" style="padding:14px;margin-bottom:6px">
      <div class="ring" style="--val:${STATS.completion};--col:var(--primary)" data-label="${STATS.completion}%"></div>
      <div style="flex:1">
        <div style="font-weight:800;font-size:15px">Garden Progress</div>
        <div style="font-size:12px;color:var(--text-dim);margin:2px 0 8px">
          ${STATS.unlockedPlants}/${STATS.totalPlants} loài đã mở khóa</div>
        <div class="bar"><span style="width:${STATS.completion}%"></span></div>
      </div>
    </div>

    <div class="section-title">Khu vườn ký ức <span class="link" data-act="customize">Tùy chỉnh</span></div>
    <div class="garden">${seasonFx()}${plots}</div>

    <button class="btn reward" data-act="reward" style="margin-top:14px">
      🎁 Xem quảng cáo → Mystery Seed</button>

    <div class="section-title">Hôm nay <span class="link" data-act="timeline">Tất cả</span></div>
    <div class="card">${MEMORIES.slice(0, 2).map(memRow).join("")}</div>

    <div class="hint">Mỗi memory bạn tạo sẽ gieo 1 hạt → lớn dần thành cây.
      Tap ô trống để gieo memory mới.</div>
    `,
  };
}

/* ---- 1. Memory row component ---- */
function memRow(m) {
  const c = catById(m.cat);
  const pl = plantById(m.plant);
  return `<div class="mem-row" data-act="memory" data-id="${m.id}">
    <div class="mem-thumb">${m.photo}</div>
    <div class="mem-info">
      <div class="t">${m.title}</div>
      <div class="meta">
        <span>${c.emoji} ${m.sub}</span><span class="dot"></span><span>${fmtDate(m.date)}</span>
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
        ${seasonBadge}
        ${p.seasonal ? `<span class="season-ribbon ${inSeason ? "open" : ""}">${inSeason ? "Mở mùa này" : se.name}</span>` : ""}
        <div class="emo">${p.emoji}</div>
        <div class="nm">? ? ?</div>
        <span class="lock-ico">🔒</span>
      </div>`;
    }
    return `<div class="cell ${p.seasonal ? "seasonal" : ""}" data-act="plant" data-id="${p.id}">
      <span class="rarity-dot" style="background:${RARITY[p.rarity].color}"></span>
      ${seasonBadge}
      <div class="emo">${p.emoji}</div>
      <div class="nm">${p.name}</div>
    </div>`;
  }).join("");

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

/* ---- 5. Timeline ---- */
function scTimeline() {
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
    body = `<div class="timeline">` + Object.keys(groups).sort().reverse().map((k) => {
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
      <div class="hint">Ô càng đậm = càng nhiều kỷ niệm trong tháng đó. Tap để xem chi tiết.</div>`;
  } else {
    // life journey — mix milestone + memory highlights
    const events = [
      { y: "2026", e: "🎂", t: "Sinh nhật tuổi 26", d: "Cột mốc mới" },
      { y: "2026", e: "⛰️", t: "Chinh phục Langbiang", d: "Rare bloom mở khóa" },
      { y: "2026", e: "💍", t: "Kỷ niệm 2 năm", d: "Heart Rose nở" },
      { y: "2025", e: "🏠", t: "Dọn về nhà mới", d: "Life Milestone" },
      { y: "2024", e: "🎓", t: "Tốt nghiệp đại học", d: "Cap Laurel" },
    ];
    body = `<div class="timeline">` + events.map((ev) =>
      `<div class="tl-node">
        <div class="tl-month">${ev.y}</div>
        <div class="card"><div class="mem-row">
          <div class="mem-thumb">${ev.e}</div>
          <div class="mem-info"><div class="t">${ev.t}</div><div class="meta">${ev.d}</div></div>
        </div></div>
      </div>`).join("") + `</div>
      <div class="hint">Life Journey View — hành trình cuộc đời nối từ các cột mốc lớn.</div>`;
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

  return {
    title: "New Memory", sub: "Ghi lại khoảnh khắc",
    body: `
    <div class="section-title" style="margin-top:6px">📸 Gợi ý từ thư viện ảnh</div>
    <div class="gallery-strip">
      ${["🏖️","🌅","🍰","🐶","🎡","🌃"].map((g, i) =>
        `<div class="g" data-act="gallerySeed" data-emo="${g}">${g}${i < 2 ? `<span class="sug">AI</span>` : ""}</div>`).join("")}
    </div>
    <div class="hint" style="margin:0 0 14px">Gallery-seeded: chọn 1 ảnh → AI tự điền date + category. 1 tap là xong.</div>

    <div class="field">
      <div class="photo-drop" data-act="photo">
        <div><div class="big" id="photoIcon">🖼️</div><div>Thêm ảnh kỷ niệm</div></div>
      </div>
    </div>
    <div class="field"><label>Tiêu đề</label>
      <input id="memTitle" placeholder="VD: Cà phê sớm ở Đà Lạt"></div>
    <div class="field"><label>Category</label>
      <div class="chips" style="overflow-x:auto;flex-wrap:nowrap;padding-bottom:4px">${catChips}</div></div>
    <div class="field"><label>Loại</label><div class="chips">${subChips}</div></div>
    <div class="field"><label>Mô tả (tùy chọn)</label>
      <textarea placeholder="Hôm nay có gì đáng nhớ..."></textarea></div>
    <div class="field"><label>Tags (tùy chọn)</label>
      <input placeholder="#travel #coffee"></div>

    <button class="btn" data-act="saveMemory">🌱 Lưu & gieo hạt</button>
    <div class="hint">First Bloom Guarantee: memory đầu tiên luôn nở ra 1 cây đặc biệt 🌺</div>
    `,
  };
}

/* ---- More hub ---- */
function scMore() {
  const items = [
    { act: "categories", emoji: "🗂️", t: "Categories", d: "6 nhóm · 24 loại kỷ niệm" },
    { act: "milestones", emoji: "🏆", t: "Milestones", d: `${MILESTONES.filter(m=>m.done).length}/${MILESTONES.length} thành tựu đạt được` },
    { act: "widgets",    emoji: "📱", t: "Widgets", d: "3 widget màn hình chính" },
    { act: "customize",  emoji: "🎨", t: "Garden Customization", d: "Theme · Decoration · Layout" },
    { act: "pro",        emoji: "👑", t: "Lifetime Pro", d: "Unlimited · Backup · Premium widgets" },
    { act: "backup",     emoji: "💾", t: "Backup & Restore", d: "Export / Import ZIP · Local-first" },
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

/* ---- Memory detail ---- */
function scMemoryDetail() {
  const m = MEMORIES.find((x) => x.id === state.selMemory) || MEMORIES[0];
  const c = catById(m.cat);
  const pl = plantById(m.plant);
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
      title: "Locked", sub: "Chưa mở khóa", back: "atlas",
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
      </div>`,
    };
  }
  return {
    title: p.name, sub: RARITY[p.rarity].name, back: "atlas",
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
  widgets: scWidgets, customize: scCustomize, memory: scMemoryDetail, plant: scPlantDetail,
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
    case "reward":     toast("🎁 +1 Mystery Seed! (rewarded ad)"); break;
    case "saveMemory": go("garden"); setTimeout(playBloom, 150); break;
    case "gallerySeed":
      const ic = el("#photoIcon"); if (ic) ic.textContent = ds.emo;
      const tt = el("#memTitle"); if (tt) tt.value = "Kỷ niệm từ thư viện";
      toast("✨ AI đã điền date + category");
      break;
    case "photo":      toast("📸 Mở camera / thư viện"); break;
    case "buy":        toast(`🛒 ${ds.nm} — mở mua / xem ad`); break;
    case "editMemory": go("create"); break;
    case "delMemory":  toast("🗑️ Đã xóa (mockup)"); go("timeline"); break;
    case "pro":        toast("👑 Lifetime Pro — mở màn IAP"); break;
    case "backup":     toast("💾 Export ZIP (local-first)"); break;
    case "closeBloom":
      const ov = el(".bloom-overlay"); if (ov) { clearInterval(ov._iv); ov.remove(); }
      go("garden");
      break;
    // navigation-style acts
    case "garden": case "atlas": case "timeline": case "create":
    case "more": case "categories": case "milestones": case "widgets":
    case "customize":
      go(act); break;
  }
}

function init() {
  // style toggle
  document.querySelectorAll("[data-theme-btn]").forEach((b) => {
    b.addEventListener("click", () => {
      state.theme = b.dataset.themeBtn;
      document.body.setAttribute("data-theme", state.theme);
      document.querySelectorAll("[data-theme-btn]").forEach((x) =>
        x.classList.toggle("active", x === b));
    });
  });

  // bottom nav
  el("#nav").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-nav]");
    if (btn) go(btn.dataset.nav);
  });

  // back button
  el("#barBack").addEventListener("click", (e) => {
    const dest = e.currentTarget.dataset.act;
    if (dest) go(dest);
  });

  // delegated screen actions
  el("#screenBody").addEventListener("click", (e) => {
    const node = e.target.closest("[data-act]");
    if (!node) return;
    handleAct(node.dataset.act, node.dataset);
  });

  render();
}

document.addEventListener("DOMContentLoaded", init);
