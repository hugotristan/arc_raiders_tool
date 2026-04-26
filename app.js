(function () {
  const data = window.ARC_DATA;
  const extraCraftables = [
    {
      id: "manual-canto-smg",
      name: "Canto SMG",
      category: "Weapon",
      type: "SMG",
      rarity: "Rare",
      description: "Flashpoint weapon blueprint reported from Hurricane First Wave Caches.",
      image: "https://cdn.arctracker.io/items/canto.png",
      sourceUrl: "https://arcraidershub.com/guides/canto-blueprint-guide",
      bench: ["gunsmith", "weapon bench"],
      level: 3,
      blueprint: "Canto SMG Blueprint",
      materials: [
        { name: "Advanced Mechanical Components", slug: "advanced-mechanical-components", rarity: "Rare", qty: 2 },
        { name: "Magnet", slug: "magnet", rarity: "Uncommon", qty: 5 },
        { name: "Medium Gun Parts", slug: "medium-gun-parts", rarity: "Rare", qty: 3 }
      ]
    },
    {
      id: "manual-dolabra",
      name: "Dolabra",
      category: "Weapon",
      type: "Shotgun",
      rarity: "Legendary",
      description: "Legendary Flashpoint energy shotgun. Blueprint drops from Arc Assessor containers during Close Scrutiny.",
      image: "https://cdn.arctracker.io/items/dolabra.png",
      sourceUrl: "https://arcraidershub.com/guides/dolabra-blueprint-guide",
      bench: ["gunsmith", "weapon bench"],
      level: 3,
      blueprint: "Dolabra Blueprint",
      materials: [
        { name: "Shredder Gyro", slug: "shredder-gyro", rarity: "Epic", qty: 3 },
        { name: "Magnetic Accelerator", slug: "magnetic-accelerator", rarity: "Epic", qty: 3 },
        { name: "Vaporizer Regulator", slug: "vaporizer-regulator", rarity: "Epic", qty: 2 }
      ]
    }
  ];
  const extraMaterialSources = {
    "Shredder Gyro": {
      slug: "shredder-gyro",
      rarity: "Epic",
      sourceUrl: "https://arcraidershub.com/guides/dolabra-blueprint-guide",
      image: "https://arcraiders.wiki/images/thumb/Shredder_Gyro.png/96px-Shredder_Gyro.png",
      hints: [
        "Dropped by Shredders.",
        "Reported on all maps, though Dam Battlegrounds can be less consistent.",
        "Farm ARC-heavy routes and extract these before committing to PvP."
      ]
    },
    "Vaporizer Regulator": {
      slug: "vaporizer-regulator",
      rarity: "Epic",
      sourceUrl: "https://arcraidershub.com/guides/dolabra-blueprint-guide",
      image: "https://arcraiders.wiki/images/thumb/Vaporizer_Regulator.png/96px-Vaporizer_Regulator.png",
      hints: [
        "Dropped by Vaporizers.",
        "Best farmed during Close Scrutiny, where Vaporizers spawn around Assessors.",
        "You will often gather these while farming the Dolabra blueprint itself."
      ]
    },
    "Rusted Tools": {
      slug: "rusted-tools",
      rarity: "Uncommon",
      sourceUrl: "https://thearcraiders.wiki/items/rusted-tools",
      hints: ["Found in Mechanical loot areas.", "Check workshops, garages, industrial rooms, and tool containers.", "Used for Gunsmith upgrades."]
    },
    "Wasp Driver": {
      slug: "wasp-driver",
      rarity: "Uncommon",
      sourceUrl: "https://thearcraiders.wiki/items/wasp-driver",
      hints: ["Dropped by Wasp ARCs.", "Farm ARC-heavy routes where Wasps patrol.", "Used for Gunsmith level 2."]
    },
    "Rusted Gear": {
      slug: "rusted-gear",
      rarity: "Rare",
      sourceUrl: "https://thearcraiders.wiki/items/rusted-gear",
      hints: ["Found in Industrial loot areas.", "Check machinery, workshops, and heavy equipment zones.", "Used for Gunsmith level 3."]
    },
    "Sentinel Firing Core": {
      slug: "sentinel-firing-core",
      rarity: "Rare",
      sourceUrl: "https://thearcraiders.wiki/items/sentinel-firing-core",
      hints: ["Dropped by Sentinel ARCs.", "Prioritize dangerous ARC routes and extract quickly.", "Used for Gunsmith level 3."]
    },
    "Power Cable": {
      slug: "power-cable",
      rarity: "Uncommon",
      sourceUrl: "https://thearcraiders.wiki/items/power-cable",
      hints: ["Found in Electrical, Residential, and Commercial loot areas.", "Check utility rooms, offices, apartments, and power equipment.", "Used for Gear Bench level 2."]
    },
    "Hornet Driver": {
      slug: "hornet-driver",
      rarity: "Uncommon",
      sourceUrl: "https://thearcraiders.wiki/items/hornet-driver",
      hints: ["Dropped by Hornet ARCs.", "Farm ARC patrol routes with aerial enemies.", "Used for Gear Bench level 2."]
    },
    "Industrial Battery": {
      slug: "industrial-battery",
      rarity: "Rare",
      sourceUrl: "https://thearcraiders.wiki/items/industrial-battery",
      hints: ["Found in Industrial loot areas.", "Check machinery, depots, garages, and power-adjacent sites.", "Used for Gear Bench level 3."]
    },
    "Bastion Cell": {
      slug: "bastion-cell",
      rarity: "Rare",
      sourceUrl: "https://thearcraiders.wiki/items/bastion-cell",
      hints: ["Dropped by Bastion ARCs.", "Bring armor-piercing options and plan an extraction route.", "Used for Gear Bench level 3."]
    },
    "Cracked Bioscanner": {
      slug: "cracked-bioscanner",
      rarity: "Uncommon",
      sourceUrl: "https://thearcraiders.wiki/items/cracked-bioscanner",
      hints: ["Found in Medical loot areas.", "Check hospitals, clinics, labs, and medical containers.", "Used for Medical Lab level 2."]
    },
    "Tick Pod": {
      slug: "tick-pod",
      rarity: "Uncommon",
      sourceUrl: "https://thearcraiders.wiki/items/tick-pod",
      hints: ["Dropped by Tick ARCs.", "Farm small ARC encounters and salvage safely.", "Used for Medical Lab level 2."]
    },
    "Rusted Shut Medical Kit": {
      slug: "rusted-shut-medical-kit",
      rarity: "Rare",
      sourceUrl: "https://thearcraiders.wiki/items/rusted-shut-medical-kit",
      hints: ["Found in Medical loot areas.", "Prioritize hospitals, clinics, and medical research rooms.", "Used for Medical Lab level 3."]
    },
    "Surveyor Vault": {
      slug: "surveyor-vault",
      rarity: "Rare",
      sourceUrl: "https://thearcraiders.wiki/items/surveyor-vault",
      hints: ["Dropped by Surveyor ARCs.", "Farm ARC-heavy routes and loot the wreck safely.", "Used for Medical Lab level 3."]
    },
    "Synthesized Fuel": {
      slug: "synthesized-fuel",
      rarity: "Rare",
      sourceUrl: "https://thearcraiders.wiki/items/synthesized-fuel",
      hints: ["Found in Industrial and fuel-related loot areas.", "Check garages, depots, vehicle yards, and utility rooms.", "Used for Explosives Station level 2."]
    },
    "Laboratory Reagents": {
      slug: "laboratory-reagents",
      rarity: "Rare",
      sourceUrl: "https://thearcraiders.wiki/items/laboratory-reagents",
      hints: ["Found in Medical and laboratory loot areas.", "Hospital and research interiors are strong routes.", "Used for Explosives Station level 3."]
    },
    "Rocketeer Driver": {
      slug: "rocketeer-driver",
      rarity: "Rare",
      sourceUrl: "https://thearcraiders.wiki/items/rocketeer-driver",
      hints: ["Dropped by Rocketeer ARCs.", "Use cover and fight from a planned extraction route.", "Used for Explosives Station level 3."]
    },
    "Toaster": {
      slug: "toaster",
      rarity: "Uncommon",
      sourceUrl: "https://thearcraiders.wiki/items/toaster",
      hints: ["Found in Residential and Commercial loot areas.", "Check kitchens, apartments, shops, and household containers.", "Used for Refiner level 2."]
    },
    "Fireball Burner": {
      slug: "fireball-burner",
      rarity: "Uncommon",
      sourceUrl: "https://thearcraiders.wiki/items/fireball-burner",
      hints: ["Dropped by Fireball ARCs.", "Farm ARC-heavy routes with fire units.", "Used for Refiner level 2."]
    },
    "Motor": {
      slug: "motor",
      rarity: "Rare",
      sourceUrl: "https://thearcraiders.wiki/items/motor",
      hints: ["Found in Mechanical and Industrial loot areas.", "Check machinery, garages, and workshop containers.", "Used for Refiner level 3."]
    },
    "Bombardier Cell": {
      slug: "bombardier-cell",
      rarity: "Rare",
      sourceUrl: "https://thearcraiders.wiki/items/bombardier-cell",
      hints: ["Dropped by Bombardier ARCs.", "Bring enough firepower and avoid open-ground fights.", "Used for Refiner level 3."]
    },
    "Damaged Heat Sink": {
      slug: "damaged-heat-sink",
      rarity: "Uncommon",
      sourceUrl: "https://thearcraiders.wiki/items/damaged-heat-sink",
      hints: ["Found in Electrical and Technological loot areas.", "Check server rooms, control rooms, and utility spaces.", "Used for Utility Station level 2."]
    },
    "Snitch Scanner": {
      slug: "snitch-scanner",
      rarity: "Uncommon",
      sourceUrl: "https://thearcraiders.wiki/items/snitch-scanner",
      hints: ["Dropped by Snitch ARCs.", "Farm scanner/drone ARC routes and loot quickly.", "Used for Utility Station level 2."]
    },
    "Fried Motherboard": {
      slug: "fried-motherboard",
      rarity: "Rare",
      sourceUrl: "https://thearcraiders.wiki/items/fried-motherboard",
      hints: ["Found in Electrical and Technological loot areas.", "Check offices, control rooms, server racks, and electronics containers.", "Used for Utility Station level 3."]
    },
    "Leaper Pulse Unit": {
      slug: "leaper-pulse-unit",
      rarity: "Rare",
      sourceUrl: "https://thearcraiders.wiki/items/leaper-pulse-unit",
      hints: ["Dropped by Leaper ARCs.", "Keep distance and loot after the area is clear.", "Used for Utility Station level 3."]
    }
  };
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
      { name: "Canto SMG", kind: "Blueprint", plannerSearch: "canto smg", infoUrl: "https://arcraidershub.com/guides/canto-blueprint-guide" },
      { name: "Dolabra", kind: "Close Scrutiny", plannerSearch: "dolabra", infoUrl: "https://arcraidershub.com/guides/dolabra-blueprint-guide" },
      { name: "Exodus Modules", kind: "Material", plannerSearch: "exodus modules" },
      { name: "Magnetic Accelerator", kind: "Material", plannerSearch: "magnetic accelerator" },
      { name: "Vita Shot", kind: "Healing", plannerSearch: "vita shot" },
      { name: "Sterilized Bandage", kind: "Healing", plannerSearch: "sterilized bandage" }
    ],
    sources: [
      { name: "Hurricane cache guide", url: "https://www.keengamer.com/articles/guides/arc-raiders-all-first-wave-raider-cache-locations/" },
      { name: "Interactive cache maps", url: "https://arcraidershub.com/guides/first-wave-caches-guide" },
      { name: "Canto blueprint guide", url: "https://arcraidershub.com/guides/canto-blueprint-guide" },
      { name: "Dolabra blueprint guide", url: "https://arcraidershub.com/guides/dolabra-blueprint-guide" },
      { name: "Raider Cache wiki", url: "https://arcraiders.wiki/wiki/Raider_Cache" },
      { name: "Cache audio tips", url: "https://allthings.how/how-to-find-first-wave-caches-in-arc-raiders-hurricane-event/" }
    ]
  };
  const benchUpgrades = [
    {
      name: "Gunsmith",
      sourceUrl: "https://thearcraiders.wiki/hideout/weapon-bench",
      note: "Craft and upgrade weapons and weapon mods.",
      levels: [
        { level: 1, materials: [{ name: "Metal Parts", rarity: "Common", qty: 20 }, { name: "Rubber Parts", rarity: "Common", qty: 30 }] },
        { level: 2, materials: [{ name: "Rusted Tools", rarity: "Uncommon", qty: 3 }, { name: "Mechanical Components", rarity: "Uncommon", qty: 5 }, { name: "Wasp Driver", rarity: "Uncommon", qty: 8 }] },
        { level: 3, materials: [{ name: "Rusted Gear", rarity: "Rare", qty: 3 }, { name: "Advanced Mechanical Components", rarity: "Rare", qty: 5 }, { name: "Sentinel Firing Core", rarity: "Rare", qty: 4 }] }
      ]
    },
    {
      name: "Gear Bench",
      sourceUrl: "https://thearcraiders.wiki/hideout/equipment-bench",
      note: "Unlocks shields, augments, and combat gear.",
      levels: [
        { level: 1, materials: [{ name: "Plastic Parts", rarity: "Common", qty: 25 }, { name: "Fabric", rarity: "Common", qty: 30 }] },
        { level: 2, materials: [{ name: "Power Cable", rarity: "Uncommon", qty: 3 }, { name: "Electrical Components", rarity: "Uncommon", qty: 5 }, { name: "Hornet Driver", rarity: "Uncommon", qty: 5 }] },
        { level: 3, materials: [{ name: "Industrial Battery", rarity: "Rare", qty: 3 }, { name: "Advanced Electrical Components", rarity: "Rare", qty: 5 }, { name: "Bastion Cell", rarity: "Rare", qty: 6 }] }
      ]
    },
    {
      name: "Medical Lab",
      sourceUrl: "https://thearcraiders.wiki/hideout/med-station",
      note: "Unlocks healing and revive supplies.",
      levels: [
        { level: 1, materials: [{ name: "Fabric", rarity: "Common", qty: 50 }, { name: "ARC Alloy", rarity: "Uncommon", qty: 6 }] },
        { level: 2, materials: [{ name: "Cracked Bioscanner", rarity: "Uncommon", qty: 2 }, { name: "Durable Cloth", rarity: "Uncommon", qty: 5 }, { name: "Tick Pod", rarity: "Uncommon", qty: 8 }] },
        { level: 3, materials: [{ name: "Rusted Shut Medical Kit", rarity: "Rare", qty: 3 }, { name: "Antiseptic", rarity: "Rare", qty: 8 }, { name: "Surveyor Vault", rarity: "Rare", qty: 5 }] }
      ]
    },
    {
      name: "Explosives Station",
      sourceUrl: "https://thearcraiders.wiki/hideout/explosives-bench",
      note: "Unlocks grenades, mines, traps, and heavy explosives.",
      levels: [
        { level: 1, materials: [{ name: "Rubber Parts", rarity: "Common", qty: 50 }, { name: "ARC Alloy", rarity: "Uncommon", qty: 6 }] },
        { level: 2, materials: [{ name: "Synthesized Fuel", rarity: "Rare", qty: 3 }, { name: "Crude Explosives", rarity: "Uncommon", qty: 5 }, { name: "Pop Trigger", rarity: "Common", qty: 5 }] },
        { level: 3, materials: [{ name: "Laboratory Reagents", rarity: "Rare", qty: 3 }, { name: "Explosive Compound", rarity: "Rare", qty: 5 }, { name: "Rocketeer Driver", rarity: "Rare", qty: 3 }] }
      ]
    },
    {
      name: "Refiner",
      sourceUrl: "https://thearcraiders.wiki/hideout/refiner",
      note: "Refines raw loot into advanced crafting materials.",
      levels: [
        { level: 1, materials: [{ name: "Metal Parts", rarity: "Common", qty: 60 }, { name: "ARC Powercell", rarity: "Uncommon", qty: 5 }] },
        { level: 2, materials: [{ name: "Toaster", rarity: "Uncommon", qty: 3 }, { name: "ARC Motion Core", rarity: "Uncommon", qty: 5 }, { name: "Fireball Burner", rarity: "Uncommon", qty: 8 }] },
        { level: 3, materials: [{ name: "Motor", rarity: "Rare", qty: 3 }, { name: "ARC Circuitry", rarity: "Rare", qty: 10 }, { name: "Bombardier Cell", rarity: "Rare", qty: 6 }] }
      ]
    },
    {
      name: "Utility Station",
      sourceUrl: "https://thearcraiders.wiki/hideout/utility-bench",
      note: "Unlocks tools, scanners, deployables, and traversal items.",
      levels: [
        { level: 1, materials: [{ name: "Plastic Parts", rarity: "Common", qty: 50 }, { name: "ARC Alloy", rarity: "Uncommon", qty: 6 }] },
        { level: 2, materials: [{ name: "Damaged Heat Sink", rarity: "Uncommon", qty: 2 }, { name: "Electrical Components", rarity: "Uncommon", qty: 5 }, { name: "Snitch Scanner", rarity: "Uncommon", qty: 6 }] },
        { level: 3, materials: [{ name: "Fried Motherboard", rarity: "Rare", qty: 3 }, { name: "Advanced Electrical Components", rarity: "Rare", qty: 5 }, { name: "Leaper Pulse Unit", rarity: "Rare", qty: 4 }] }
      ]
    },
    {
      name: "Workbench",
      sourceUrl: "https://thearcraiders.wiki/hideout/workbench",
      note: "Available from the start. No upgrades required.",
      levels: []
    }
  ];
  const craftables = data.craftables.concat(extraCraftables).sort((a, b) => a.name.localeCompare(b.name));
  const materialSources = { ...data.materialSources, ...extraMaterialSources };
  const rarityOrder = { Common: 1, Uncommon: 2, Rare: 3, Epic: 4, Legendary: 5 };
  const romanByTier = ["", "I", "II", "III", "IV"];
  const tierByRoman = { I: 1, II: 2, III: 3, IV: 4 };
  const craftableByName = new Map(craftables.map((item) => [item.name.toLowerCase(), item]));
  const state = loadState();

  const els = {
    catalog: document.querySelector("#catalog"),
    benchUpgrades: document.querySelector("#benchUpgrades"),
    mapIntel: document.querySelector("#mapIntel"),
    materialInfo: document.querySelector("#materialInfo"),
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
  renderBenchUpgrades();
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
    const defaultMap = eventIntel.maps[0];
    els.mapIntel.innerHTML = `
      <article class="intel-card wide">
        <div class="intel-card-head">
          <h3>How To Use Cache Maps</h3>
          <span class="pill">Hurricane only</span>
        </div>
        <p>First Wave Caches use Raider Cache marker pools during Hurricane conditions. They are the rare-loot version of regular Raider Caches, with blueprints, premium weapons, high-tier materials, healing items, shields, mods, ammo, and quick-use gear. Markers are possible spawns, not guaranteed spawns. Check clusters, stop within 30-50m, and listen for the electric hum.</p>
        <div class="intel-tips">
          <span>No Stella Montis</span>
          <span>Use headphones</span>
          <span>Safe pocket blueprints</span>
          <span>Rarer loot is in First Wave Caches</span>
          <span>Dolabra is Close Scrutiny, not Hurricane</span>
          <span>Requeue if late</span>
        </div>
      </article>
      <article class="intel-card wide embedded-map-card">
        <div class="intel-card-head">
          <h3>Embedded Cache Map</h3>
          <a id="activeMapLink" href="${defaultMap.url}" target="_blank" rel="noreferrer">Open full map</a>
        </div>
        <div class="map-tabs">
          ${eventIntel.maps.map((map, index) => `
            <button class="map-tab ${index === 0 ? "active" : ""}" type="button" data-map-url="${map.url}" data-map-name="${escapeHtml(map.name)}">
              ${escapeHtml(map.name)}
            </button>
          `).join("")}
        </div>
        <iframe
          id="cacheMapFrame"
          class="cache-map-frame"
          title="ARC Raiders Hurricane cache map"
          src="${defaultMap.url}"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
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
          <h3>Blueprint & Loot Targets</h3>
          <span class="pill">High value</span>
        </div>
        <div class="target-grid">
          ${eventIntel.targets.map((target) => `
            <button class="target-chip" type="button" data-search="${escapeHtml(target.plannerSearch)}" data-info-url="${escapeHtml(target.infoUrl || "")}">
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

    els.mapIntel.querySelectorAll(".target-chip").forEach((button) => {
      button.addEventListener("click", () => {
        if (button.dataset.search) {
          els.search.value = button.dataset.search;
          renderCatalog();
          document.querySelector(".controls").scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
        if (button.dataset.infoUrl) {
          window.open(button.dataset.infoUrl, "_blank", "noopener");
        }
      });
    });

    const frame = els.mapIntel.querySelector("#cacheMapFrame");
    const activeLink = els.mapIntel.querySelector("#activeMapLink");
    els.mapIntel.querySelectorAll(".map-tab").forEach((button) => {
      button.addEventListener("click", () => {
        els.mapIntel.querySelectorAll(".map-tab").forEach((tab) => tab.classList.remove("active"));
        button.classList.add("active");
        frame.src = button.dataset.mapUrl;
        activeLink.href = button.dataset.mapUrl;
      });
    });
  }

  function renderBenchUpgrades() {
    els.benchUpgrades.innerHTML = benchUpgrades.map((bench) => `
      <article class="bench-card">
        <div class="bench-card-head">
          <div>
            <h3>${escapeHtml(bench.name)}</h3>
            <p>${escapeHtml(bench.note)}</p>
          </div>
          <span class="pill">${bench.levels.length ? `Max ${bench.levels.length}` : "Base"}</span>
        </div>
        ${bench.levels.length ? bench.levels.map((level) => `
          <div class="bench-level">
            <div class="recipe-title">Level ${level.level}</div>
            <div class="recipe">${formatRecipe(level.materials)}</div>
          </div>
        `).join("") : `<div class="empty compact-empty">No upgrade materials needed.</div>`}
        <div class="craft-source-row">
          <a href="${bench.sourceUrl}" target="_blank" rel="noreferrer">Detailed source page</a>
        </div>
      </article>
    `).join("");

    attachRecipeInfo(els.benchUpgrades);
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
            </div>
            <div class="craft-source-row">
              <a href="${item.sourceUrl}" target="_blank" rel="noreferrer">Detailed source page</a>
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

    attachRecipeInfo(els.catalog);
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
      const source = materialSources[material.name] || {};
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
      if (rarityOrder[b.rarity] !== rarityOrder[a.rarity]) return rarityOrder[b.rarity] - rarityOrder[a.rarity];
      return a.name.localeCompare(b.name);
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

  function attachRecipeInfo(root) {
    root.querySelectorAll(".recipe-item").forEach((button) => {
      button.addEventListener("click", () => showMaterialInfo(button.dataset.material));
    });
  }

  function showMaterialInfo(name) {
    const source = materialSources[name] || {};
    const rarity = source.rarity || materialRarity(name) || "Unknown";
    const image = materialImage(name, source);
    const hints = source.hints && source.hints.length
      ? source.hints
      : ["No local source notes yet. Use the source link for current drop, trader, and recycling details."];

    els.materialInfo.innerHTML = `
      <article class="material-info-card rarity-${cssRarity(rarity)}">
        <div class="material-info-head">
          <div class="material-info-thumb">${image ? `<img src="${image}" alt="${escapeHtml(name)}">` : ""}</div>
          <div>
            <h3>${escapeHtml(name)}</h3>
            <span class="pill rarity-label rarity-${cssRarity(rarity)}">${escapeHtml(rarity)}</span>
          </div>
        </div>
        <ul class="hints">
          ${hints.map((hint) => `<li>${escapeHtml(hint)}</li>`).join("")}
        </ul>
        <div class="source-links material-source-links">
          ${source.sourceUrl ? `<a href="${source.sourceUrl}" target="_blank" rel="noreferrer">Detailed source page</a>` : ""}
        </div>
      </article>
    `;

    els.materialInfo.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function materialImage(name, source) {
    if (source.image) return source.image;
    if (source.slug) return `https://cdn.thearcraiders.wiki/images/items/${source.slug.replace(/-/g, "_")}.png`;
    return "";
  }

  function materialRarity(name) {
    for (const item of craftables) {
      const material = item.materials.find((entry) => entry.name === name);
      if (material) return material.rarity;
    }
    return null;
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
      `<button class="recipe-item rarity-${cssRarity(material.rarity)}" type="button" data-material="${escapeHtml(material.name)}">${escapeHtml(material.name)} x${material.qty}</button>`
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
