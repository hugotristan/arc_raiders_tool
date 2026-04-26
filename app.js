(function () {
  const data = window.ARC_DATA;
  const craftables = data.craftables.slice().sort((a, b) => a.name.localeCompare(b.name));
  const rarityOrder = { Common: 1, Uncommon: 2, Rare: 3, Epic: 4, Legendary: 5 };
  const state = loadState();

  const els = {
    catalog: document.querySelector("#catalog"),
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

  initFilters();
  renderSources();
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
    const term = els.search.value.trim().toLowerCase();
    const type = els.type.value;
    const rarity = els.rarity.value;
    const items = craftables.filter((item) => {
      const haystack = [
        item.name,
        item.type,
        item.rarity,
        item.description,
        item.blueprint,
        item.materials.map((material) => material.name).join(" ")
      ].join(" ").toLowerCase();
      return (!term || haystack.includes(term)) &&
        (type === "All" || item.type === type) &&
        (rarity === "All" || item.rarity === rarity);
    });

    if (!items.length) {
      els.catalog.innerHTML = `<div class="empty">No matching craftables.</div>`;
      return;
    }

    els.catalog.innerHTML = items.map((item) => {
      const qty = state.plan[item.id] || 0;
      const recipe = item.materials.map((material) =>
        `<span class="rarity-${material.rarity}">${escapeHtml(material.name)} x${material.qty}</span>`
      ).join("");
      return `
        <article class="craft-card">
          <div class="thumb">${item.image ? `<img src="${item.image}" alt="${escapeHtml(item.name)}">` : ""}</div>
          <div class="craft-body">
            <div class="craft-title">
              <h3>${escapeHtml(item.name)}</h3>
              <span class="pill">${escapeHtml(item.rarity)}</span>
            </div>
            <div class="meta">
              <span>${escapeHtml(item.type || "Weapon")}</span>
              ${item.level ? `<span>Bench ${item.level}</span>` : ""}
              ${item.blueprint ? `<span>Blueprint</span>` : ""}
            </div>
            <div class="recipe">${recipe}</div>
            <div class="card-actions">
              <div class="stepper" data-id="${item.id}">
                <button type="button" data-action="down" title="Remove one">-</button>
                <output>${qty}</output>
                <button type="button" data-action="up" title="Add one">+</button>
              </div>
              <a href="${item.sourceUrl}" target="_blank" rel="noreferrer">Recipe page</a>
            </div>
          </div>
        </article>
      `;
    }).join("");

    els.catalog.querySelectorAll(".stepper button").forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.closest(".stepper").dataset.id;
        const next = Math.max(0, (state.plan[id] || 0) + (button.dataset.action === "up" ? 1 : -1));
        if (next) state.plan[id] = next;
        else delete state.plan[id];
        persist();
        render();
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
          <span class="meta">${escapeHtml(entry.item.type)} - ${escapeHtml(entry.item.rarity)}</span>
        </div>
        <div class="stepper" data-id="${entry.item.id}">
          <button type="button" data-action="down" title="Remove one">-</button>
          <output>${entry.qty}</output>
          <button type="button" data-action="up" title="Add one">+</button>
        </div>
      </div>
    `).join("");

    els.selectedList.querySelectorAll(".stepper button").forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.closest(".stepper").dataset.id;
        const next = Math.max(0, (state.plan[id] || 0) + (button.dataset.action === "up" ? 1 : -1));
        if (next) state.plan[id] = next;
        else delete state.plan[id];
        persist();
        render();
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
              <span class="pill">${escapeHtml(material.rarity)} - used by ${material.usedBy} craft${material.usedBy === 1 ? "" : "s"}</span>
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
    selectedItems().forEach(({ item, qty }) => {
      item.materials.forEach((material) => {
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
      .map(([id, qty]) => ({ item: craftables.find((craftable) => craftable.id === id), qty }))
      .filter((entry) => entry.item && entry.qty > 0)
      .sort((a, b) => a.item.name.localeCompare(b.item.name));
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
