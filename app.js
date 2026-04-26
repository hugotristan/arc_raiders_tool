(function () {
  const data = window.ARC_DATA;
  const eventIntel = {
    maps: [
      {
        name: "Dam Battlegrounds",
        priority: "Best density",
        url: "https://arcraidershub.com/maps/dam-battlegrounds?filters=first-wave-cache%2Craider-cache&scale=1.00",
        routes: [
          "Controlled Access Zone outskirts",
          "Testing Annex west fields",
          "Water Treatment elevator road",
          "Electrical Substation yard",
          "South swamp outskirts"
        ]
      },
      {
        name: "Blue Gate",
        priority: "Fast cluster checks",
        url: "https://arcraidershub.com/maps/blue-gate?filters=first-wave-cache%2Craider-cache&scale=1.00",
        routes: [
          "Olive Grove fields",
          "Pilgrim's Peak plateau",
          "Ruined Church cemetery",
          "Raider's Refuge outskirts",
          "The Checkpoint roadblock"
        ]
      },
      {
        name: "Buried City",
        priority: "Vertical, harder audio",
        url: "https://arcraidershub.com/maps/buried-city?filters=first-wave-cache%2Craider-cache&scale=1.00",
        routes: [
          "Town Hall Plaza",
          "Space Travel district alleys",
          "Hospital courtyard",
          "Marano Park fountain basin",
          "Metro entrance plazas"
        ]
      },
      {
        name: "Spaceport",
        priority: "Spread-out route",
        url: "https://arcraidershub.com/maps/spaceport?filters=first-wave-cache%2Craider-cache&scale=1.00",
        routes: [
          "Trench Towers base",
          "Shipping warehouse loading areas",
          "Departure building exterior",
          "Staff parking collapse zone",
          "Fuel processing yard"
        ]
      }
    ],
    targets: [
      { name: "Tempest", kind: "Blueprint", plannerSearch: "tempest i" },
      { name: "Bobcat", kind: "Blueprint", plannerSearch: "bobcat i" },
      { name: "Vulcano", kind: "Blueprint", plannerSearch: "vulcano i" },
      { name: "Canto SMG", kind: "Blueprint", plannerSearch: "" },
      { name: "Exodus Modules", kind: "Material", plannerSearch: "exodus modules" },
      { name: "Magnetic Accelerator", kind: "Material", plannerSearch: "magnetic accelerator" },
      { name: "Vita Shot", kind: "Healing", plannerSearch: "vita shot" },
      { name: "Sterilized Bandage", kind: "Healing", plannerSearch: "sterilized bandage" }
    ],
    sources: [
      { name: "Hurricane cache guide", url: "https://www.keengamer.com/articles/guides/arc-raiders-all-first-wave-raider-cache-locations/" },
      { name: "Interactive cache maps", url: "https://arcraidershub.com/guides/first-wave-caches-guide" },
      { name: "Raider Cache wiki", url: "https://arcraiders.wiki/wiki/Raider_Cache" },
      { name: "Cache audio tips", url: "https://allthings.how/how-to-find-first-wave-caches-in-arc-raiders-hurricane-event/" }
    ]
  };
  const craftables = data.craftables.slice().sort((a, b) => a.name.localeCompare(b.name));
  const rarityOrder = { Common: 1, Uncommon: 2, Rare: 3, Epic: 4, Legendary: 5 };
  const romanByTier = ["", "I", "II", "III", "IV"];
  const tierByRoman = { I: 1, II: 2, III: 3, IV: 4 };
  const craftableByName = new Map(craftables.map((item) => [item.name.toLowerCase(), item]));
  const state = loadState();

  const els = {
    catalog: document.querySelector("#catalog"),
    mapIntel: document.querySelector("#mapIntel"),
    selectedList: document.querySelector("#selectedList"),
    materialsList: document.querySelector("#materialsList"),
    search: document.querySelector("#searchInput"),
    type: document.querySelector("#typeFilter"),
    rarity: document.querySelector("#rarityFilter"),
    selectedCount: document.querySelector("#selectedCount"),
    missingCount: document.querySelector("#missingCount"),
    rareCount: document.querySelector("#rareCount"),
    generatedAt: document.querySelector("#generatedAt"),
    sourceLinks: document.querySelector("#sourceLinks"),
    clearPlan: document.querySelector("#clearPlan"),
    copyPlan: document.querySelector("#copyPlan"),
    resetOwned: document.querySelector("#resetOwned"),
    toast: document.querySelector("#toast")
  };

  normalizePlanState();
  initFilters();
  renderSources();
  renderMapIntel();
  render();

  els.search.addEventListener("input", renderCatalog);
  els.type.addEventListener("change", renderCatalog);
  els.rarity.addEventListener("change", renderCatalog);
  els.clearPlan.addEventListener("click", () => {
    state.plan = {};
    persist();
    render();
  });
  els.resetOwned.addEventListener("click", () => {
    state.owned = {};
    persist();
    renderMaterials();
  });
  els.copyPlan.addEventListener("click", copyList);

  function renderMapIntel() {
    els.mapIntel.innerHTML = `
      <article class="intel-card wide">
        <div class="intel-card-head">
          <h3>How To Use Cache Maps</h3>
          <span class="pill">Hurricane only</span>
        </div>
        <p>First Wave Caches use Raider Cache marker pools during Hurricane conditions. Markers are possible spawns, not guaranteed spawns. Check clusters, stop within 30-50m, and listen for the electric hum.</p>
        <div class="intel-tips">
          <span>No Stella Montis</span>
          <span>Use headphones</span>
          <span>Safe pocket blueprints</span>
          <span>Requeue if late</span>
        </div>
      </article>
      ${eventIntel.maps.map((map) => `
        <article class="intel-card">
          <div class="intel-card-head">
            <h3>${escapeHtml(map.name)}</h3>
            <span class="pill">${escapeHtml(map.priority)}</span>
          </div>
          <ul class="compact-list">
            ${map.routes.map((route) => `<li>${escapeHtml(route)}</li>`).join("")}
          </ul>
          <a href="${map.url}" target="_blank" rel="noreferrer">Open cache map</a>
        </article>
      `).join("")}
      <article class="intel-card wide">
        <div class="intel-card-head">
          <h3>Cache Loot Targets</h3>
          <span class="pill">High value</span>
        </div>
        <div class="target-grid">
          ${eventIntel.targets.map((target) => `
            <button class="target-chip" type="button" data-search="${escapeHtml(target.plannerSearch)}" ${target.plannerSearch ? "" : "disabled"}>
              <strong>${escapeHtml(target.name)}</strong>
              <span>${escapeHtml(target.kind)}</span>
            </button>
          `).join("")}
        </div>
        <div class="source-links">
          ${eventIntel.sources.map((source) => `<a href="${source.url}" target="_blank" rel="noreferrer">${escapeHtml(source.name)}</a>`).join("")}
        </div>
      </article>
    `;

    els.mapIntel.querySelectorAll(".target-chip:not(:disabled)").forEach((button) => {
      button.addEventListener("click", () => {
        els.search.value = button.dataset.search;
        renderCatalog();
        document.querySelector(".controls").scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  function initFilters() {
    const types = unique(craftables.map((item) => item.type)).sort();
    const rarities = ["Common", "Uncommon", "Rare", "Epic", "Legendary"];
    els.type.innerHTML = option("All", "All types") + types.map((type) => option(type, type)).join("");
    els.rarity.innerHTML = option("All", "All rarities") + rarities.map((rarity) => option(rarity, rarity)).join("");
    els.generatedAt.textContent = `Data ${new Date(data.generatedAt).toLocaleDateString()}`;
  }

  function render() {
    renderCatalog();
    renderSelected();
    renderMaterials();
  }

  function renderCatalog() {
    const term = normalizeSearch(els.search.value.trim());
    const type = els.type.value;
    const rarity = els.rarity.value;
    const items = craftables.filter((item) => {
      const haystack = [
        item.name,
        item.type,
        item.rarity,
        item.description,
        item.blueprint,
        item.materials.map((material) => material.name).join(" "),
        searchAliases(item)
      ].join(" ").toLowerCase();
      return (!term || normalizeSearch(haystack).includes(term)) &&
        (type === "All" || item.type === type) &&
        (rarity === "All" || item.rarity === rarity);
    });

    if (!items.length) {
      els.catalog.innerHTML = `<div class="empty">No matching craftables.</div>`;
      return;
    }

    els.catalog.innerHTML = items.map((item) => {
      const tier = getTierInfo(item);
      const hasScratch = canCalculateScratchCost(item);
      const directLabel = tier && tier.tier > 1 ? `${tier.series} ${romanByTier[tier.tier - 1]} -> ${item.name}` : "Craft";
      return `
        <article class="craft-card">
          <div class="thumb">${item.image ? `<img src="${item.image}" alt="${escapeHtml(item.name)}">` : ""}</div>
          <div class="craft-body">
            <div class="craft-title">
              <h3>${escapeHtml(item.name)}</h3>
              <span class="pill rarity-label rarity-${cssRarity(item.rarity)}">${escapeHtml(item.rarity)}</span>
            </div>
            <div class="meta">
              <span>${escapeHtml(item.type || "Weapon")}</span>
              ${item.level ? `<span>Bench ${item.level}</span>` : ""}
              ${item.blueprint ? `<span>Blueprint</span>` : ""}
            </div>
            <div class="recipe-block">
              <div class="recipe-title">${escapeHtml(directLabel)}</div>
              <div class="recipe">${formatRecipe(item.materials)}</div>
              ${hasScratch ? `
                <div class="recipe-title">From scratch</div>
                <div class="recipe">${formatRecipe(cumulativeMaterials(item))}</div>
              ` : ""}
            </div>
            <div class="card-actions stacked">
              <div class="plan-control">
                <span>${tier && tier.tier > 1 ? "Upgrade" : "Plan"}</span>
                <div class="stepper" data-id="${item.id}" data-mode="direct">
                  <button type="button" data-action="down" title="Remove one">-</button>
                  <output>${getPlanQty(item.id, "direct")}</output>
                  <button type="button" data-action="up" title="Add one">+</button>
                </div>
              </div>
              ${hasScratch ? `
                <div class="plan-control">
                  <span>From 0</span>
                  <div class="stepper" data-id="${item.id}" data-mode="scratch">
                    <button type="button" data-action="down" title="Remove one">-</button>
                    <output>${getPlanQty(item.id, "scratch")}</output>
                    <button type="button" data-action="up" title="Add one">+</button>
                  </div>
                </div>
              ` : ""}
              <a href="${item.sourceUrl}" target="_blank" rel="noreferrer">Recipe page</a>
            </div>
          </div>
        </article>
      `;
    }).join("");

    els.catalog.querySelectorAll(".stepper button").forEach((button) => {
      button.addEventListener("click", () => {
        const stepper = button.closest(".stepper");
        updatePlan(stepper.dataset.id, stepper.dataset.mode || "direct", button.dataset.action === "up" ? 1 : -1);
      });
    });
  }

  function renderSelected() {
    const selected = selectedItems();
    const totalCrafts = selected.reduce((sum, item) => sum + item.qty, 0);
    els.selectedCount.textContent = totalCrafts;

    if (!selected.length) {
      els.selectedList.innerHTML = `<div class="empty">Add weapons from the catalog to build a collection route.</div>`;
      return;
    }

    els.selectedList.innerHTML = selected.map((entry) => `
      <div class="selected-row">
        <div>
          <strong>${escapeHtml(entry.item.name)}</strong>
          <span class="meta">${escapeHtml(entry.item.type)} - <span class="rarity-label rarity-${cssRarity(entry.item.rarity)}">${escapeHtml(entry.item.rarity)}</span> - ${escapeHtml(modeLabel(entry))}</span>
        </div>
        <div class="stepper" data-id="${entry.item.id}" data-mode="${entry.mode}">
          <button type="button" data-action="down" title="Remove one">-</button>
          <output>${entry.qty}</output>
          <button type="button" data-action="up" title="Add one">+</button>
        </div>
      </div>
    `).join("");

    els.selectedList.querySelectorAll(".stepper button").forEach((button) => {
      button.addEventListener("click", () => {
        const stepper = button.closest(".stepper");
        updatePlan(stepper.dataset.id, stepper.dataset.mode || "direct", button.dataset.action === "up" ? 1 : -1);
      });
    });
  }

  function renderMaterials() {
    const materials = aggregateMaterials();
    const missingTotal = materials.reduce((sum, material) => sum + material.missing, 0);
    const rareTotal = materials
      .filter((material) => rarityOrder[material.rarity] >= rarityOrder.Rare)
      .reduce((sum, material) => sum + material.missing, 0);
    els.missingCount.textContent = missingTotal;
    els.rareCount.textContent = rareTotal;

    if (!materials.length) {
      els.materialsList.innerHTML = `<div class="empty">Your collection list will appear here.</div>`;
      return;
    }

    els.materialsList.innerHTML = materials.map((material) => {
      const source = data.materialSources[material.name] || {};
      const hints = (source.hints || []).map((hint) => `<li>${escapeHtml(hint)}</li>`).join("");
      return `
        <article class="material-card rarity-${material.rarity}">
          <div class="material-head">
            <div>
              <h3>${escapeHtml(material.name)}</h3>
              <span class="pill rarity-label rarity-${cssRarity(material.rarity)}">${escapeHtml(material.rarity)} - used by ${material.usedBy} craft${material.usedBy === 1 ? "" : "s"}</span>
            </div>
            <div class="qty">${material.missing ? `${material.missing} needed` : "covered"}</div>
          </div>
          <label class="owned-control">
            <span>Owned</span>
            <input type="number" min="0" step="1" value="${state.owned[material.name] || 0}" data-material="${escapeHtml(material.name)}">
          </label>
          <ul class="hints">${hints}</ul>
          ${source.sourceUrl ? `<a href="${source.sourceUrl}" target="_blank" rel="noreferrer">Item source page</a>` : ""}
        </article>
      `;
    }).join("");

    els.materialsList.querySelectorAll("input").forEach((input) => {
      input.addEventListener("change", () => {
        const value = Math.max(0, Number.parseInt(input.value, 10) || 0);
        state.owned[input.dataset.material] = value;
        persist();
        renderMaterials();
      });
    });
  }

  function aggregateMaterials() {
    const totals = new Map();
    selectedItems().forEach(({ materials, qty }) => {
      materials.forEach((material) => {
        const current = totals.get(material.name) || {
          name: material.name,
          rarity: material.rarity,
          total: 0,
          usedBy: 0
        };
        current.total += material.qty * qty;
        current.usedBy += qty;
        totals.set(material.name, current);
      });
    });

    return Array.from(totals.values()).map((material) => {
      const owned = state.owned[material.name] || 0;
      return { ...material, owned, missing: Math.max(0, material.total - owned) };
    }).sort((a, b) => {
      if ((b.missing > 0) !== (a.missing > 0)) return b.missing > 0 ? 1 : -1;
      if (rarityOrder[b.rarity] !== rarityOrder[a.rarity]) return rarityOrder[b.rarity] - rarityOrder[a.rarity];
      return b.missing - a.missing || a.name.localeCompare(b.name);
    });
  }

  function selectedItems() {
    return Object.entries(state.plan)
      .map(([key, qty]) => {
        const [id, mode = "direct"] = key.split("|");
        const item = craftables.find((craftable) => craftable.id === id);
        return { item, mode, qty, materials: item ? materialsForMode(item, mode) : [] };
      })
      .filter((entry) => entry.item && entry.qty > 0)
      .sort((a, b) => a.item.name.localeCompare(b.item.name) || a.mode.localeCompare(b.mode));
  }

  async function copyList() {
    const lines = aggregateMaterials().map((material) =>
      `${material.name}: ${material.missing}/${material.total} needed (${material.rarity})`
    );
    if (!lines.length) {
      showToast("Nothing planned yet");
      return;
    }
    const text = ["ARC Raiders collect list", ...lines].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      showToast("Collection list copied");
    } catch {
      showToast("Clipboard blocked by browser");
    }
  }

  function renderSources() {
    els.sourceLinks.innerHTML = data.sources.map((source) =>
      `<a href="${source.url}" target="_blank" rel="noreferrer">${escapeHtml(source.name)}</a>`
    ).join("");
  }

  function showToast(message) {
    els.toast.textContent = message;
    els.toast.classList.add("show");
    window.setTimeout(() => els.toast.classList.remove("show"), 1800);
  }

  function normalizePlanState() {
    const nextPlan = {};
    Object.entries(state.plan || {}).forEach(([key, qty]) => {
      if (!qty) return;
      if (key.includes("|")) nextPlan[key] = qty;
      else nextPlan[planKey(key, "direct")] = qty;
    });
    state.plan = nextPlan;
  }

  function updatePlan(id, mode, delta) {
    const key = planKey(id, mode);
    const next = Math.max(0, (state.plan[key] || 0) + delta);
    if (next) state.plan[key] = next;
    else delete state.plan[key];
    persist();
    render();
  }

  function getPlanQty(id, mode) {
    return state.plan[planKey(id, mode)] || 0;
  }

  function planKey(id, mode) {
    return `${id}|${mode}`;
  }

  function getTierInfo(item) {
    if (item.category !== "Weapon") return null;
    const match = item.name.match(/^(.+)\s+(I|II|III|IV)$/);
    if (!match) return null;
    return { series: match[1], roman: match[2], tier: tierByRoman[match[2]] };
  }

  function canCalculateScratchCost(item) {
    const tier = getTierInfo(item);
    if (!tier || tier.tier <= 1) return false;
    for (let i = 1; i <= tier.tier; i += 1) {
      if (!craftableByName.get(`${tier.series} ${romanByTier[i]}`.toLowerCase())) return false;
    }
    return true;
  }

  function cumulativeMaterials(item) {
    const tier = getTierInfo(item);
    if (!tier) return item.materials;
    const materials = [];
    for (let i = 1; i <= tier.tier; i += 1) {
      const tierItem = craftableByName.get(`${tier.series} ${romanByTier[i]}`.toLowerCase());
      if (tierItem) materials.push(...tierItem.materials);
    }
    return combineMaterials(materials);
  }

  function materialsForMode(item, mode) {
    return mode === "scratch" && canCalculateScratchCost(item) ? cumulativeMaterials(item) : item.materials;
  }

  function combineMaterials(materials) {
    const combined = new Map();
    materials.forEach((material) => {
      const current = combined.get(material.name) || { ...material, qty: 0 };
      current.qty += material.qty;
      combined.set(material.name, current);
    });
    return Array.from(combined.values()).sort((a, b) => {
      if (rarityOrder[b.rarity] !== rarityOrder[a.rarity]) return rarityOrder[b.rarity] - rarityOrder[a.rarity];
      return a.name.localeCompare(b.name);
    });
  }

  function formatRecipe(materials) {
    return materials.map((material) =>
      `<span>${escapeHtml(material.name)} x${material.qty}</span>`
    ).join("");
  }

  function modeLabel(entry) {
    if (entry.mode !== "scratch") {
      const tier = getTierInfo(entry.item);
      return tier && tier.tier > 1 ? "upgrade only" : "craft";
    }
    return "from scratch";
  }

  function searchAliases(item) {
    const tier = getTierInfo(item);
    if (!tier) return "";
    return `${tier.series} ${tier.tier}`;
  }

  function normalizeSearch(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/\biv\b/g, "4")
      .replace(/\biii\b/g, "3")
      .replace(/\bii\b/g, "2")
      .replace(/\bi\b/g, "1")
      .replace(/\s+/g, " ")
      .trim();
  }

  function persist() {
    localStorage.setItem("arc-craft-planner", JSON.stringify(state));
  }

  function loadState() {
    try {
      return JSON.parse(localStorage.getItem("arc-craft-planner")) || { plan: {}, owned: {} };
    } catch {
      return { plan: {}, owned: {} };
    }
  }

  function unique(values) {
    return Array.from(new Set(values.filter(Boolean)));
  }

  function option(value, label) {
    return `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`;
  }

  function cssRarity(rarity) {
    return String(rarity || "").replace(/[^a-z0-9_-]/gi, "");
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[char]);
  }
})();
