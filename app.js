(function () {
  "use strict";

  const storageKey = "terraforma-sample-plan";
  const svgNamespace = "http://www.w3.org/2000/svg";
  const elements = {
    mapMarkers: document.getElementById("map-markers"),
    mapFrame: document.querySelector(".map-frame"),
    mapSvg: document.getElementById("site-map"),
    planAreas: document.getElementById("plan-areas"),
    zonePicker: document.getElementById("zone-picker"),
    planList: document.getElementById("plan-list"),
    planCount: document.getElementById("plan-count"),
    planTotal: document.getElementById("plan-total"),
    storageMessage: document.getElementById("storage-message"),
    featureSelect: document.getElementById("feature-select"),
    detailField: document.getElementById("detail-field"),
    detailLabel: document.getElementById("detail-label"),
    detailSelect: document.getElementById("detail-select"),
    detailCaution: document.getElementById("detail-caution"),
    contentsFieldset: document.getElementById("contents-fieldset"),
    contentsTitle: document.getElementById("contents-title"),
    contentsHelp: document.getElementById("contents-help"),
    contentsOptions: document.getElementById("contents-options"),
    fitControls: document.getElementById("fit-controls"),
    bedExposure: document.getElementById("bed-exposure"),
    bedWatering: document.getElementById("bed-watering"),
    autoSelect: document.getElementById("auto-select"),
    autoSelectNote: document.getElementById("auto-select-note"),
    guildOptions: document.getElementById("guild-options"),
    speciesCard: document.getElementById("species-card"),
    speciesCardTitle: document.getElementById("species-card-title"),
    speciesCardScientific: document.getElementById("species-card-scientific"),
    speciesCardFacts: document.getElementById("species-card-facts"),
    speciesCardCaveat: document.getElementById("species-card-caveat"),
    speciesCardSource: document.getElementById("species-card-source"),
    speciesCardClose: document.getElementById("species-card-close"),
    rotationField: document.getElementById("rotation-field"),
    rotationDays: document.getElementById("rotation-days"),
    scheduleStartDate: document.getElementById("schedule-start-date"),
    planNote: document.getElementById("plan-note"),
    planForm: document.getElementById("plan-form"),
    formError: document.getElementById("form-error"),
    drawingToolbar: document.getElementById("drawing-toolbar"),
    drawingStatus: document.getElementById("drawing-status"),
    undoPoint: document.getElementById("undo-point"),
    finishDrawing: document.getElementById("finish-drawing"),
    cancelDrawing: document.getElementById("cancel-drawing"),
    capacitySummary: document.getElementById("capacity-summary"),
    capacityProgress: document.getElementById("capacity-progress"),
    perspectiveTabs: document.getElementById("perspective-tabs"),
    perspectiveName: document.getElementById("perspective-name"),
    perspectiveDescriptor: document.getElementById("perspective-descriptor"),
    perspectiveSummary: document.getElementById("perspective-summary"),
    perspectivePriorities: document.getElementById("perspective-priorities"),
    perspectiveQuestion: document.getElementById("perspective-question"),
    perspectiveIdeas: document.getElementById("perspective-ideas")
  };

  let selectedZoneId = PROPERTY.zones[0].id;
  let selectedPerspectiveId = DESIGN_PERSPECTIVES[0].id;
  let selectedPlanId = null;
  let planItems = PROPERTY.initialPlan.map(function (item) {
    return Object.assign({}, item, {
      polygon: item.polygon.map(function (point) { return point.slice(); }),
      guildPlants: []
    });
  });
  let storageAvailable = true;
  let pendingPlanItem = null;
  let drawingPoints = [];
  let keyboardCursor = { x: 320, y: 215 };

  function localDateValue(date) {
    return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") +
      "-" + String(date.getDate()).padStart(2, "0");
  }

  function scheduleStart(item) {
    return item.scheduleStartDate
      ? new Date(item.scheduleStartDate + "T12:00:00")
      : item.createdAt ? new Date(item.createdAt) : null;
  }

  document.title = STARTUP.name + " — Land planning, made thoughtful";
  document.getElementById("tagline").textContent = STARTUP.tagline;
  document.getElementById("pitch").textContent = STARTUP.pitch;
  document.getElementById("property-name").textContent = PROPERTY.name;
  document.getElementById("property-location").textContent = PROPERTY.location;
  document.getElementById("property-area").textContent = PROPERTY.area;
  document.getElementById("area-note").textContent = "Sample dashboard · " + PROPERTY.areaNote + ".";
  document.getElementById("observation-count").textContent = PROPERTY.zones.length;
  elements.scheduleStartDate.value = localDateValue(new Date());

  function makeOption(label, value) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    return option;
  }

  function getCatalogItem(id) {
    return PLAN_CATALOG.find(function (item) { return item.id === id; });
  }

  function populateFeatureOptions() {
    PLAN_CATALOG.forEach(function (item) {
      elements.featureSelect.appendChild(makeOption(item.category + " · " + item.name, item.id));
    });
    updateFeatureDetails();
  }

  function showFormError(message) {
    elements.formError.textContent = message;
    elements.formError.hidden = !message;
  }

  function updateFeatureDetails() {
    const feature = getCatalogItem(elements.featureSelect.value);
    elements.speciesCard.hidden = true;
    elements.detailSelect.replaceChildren();
    elements.contentsOptions.replaceChildren();
    elements.guildOptions.replaceChildren();
    elements.contentsFieldset.hidden = !feature;
    elements.detailField.hidden = !feature;
    elements.rotationField.hidden = !feature || !["garden-beds", "greenhouse"].includes(feature.id);
    elements.autoSelectNote.textContent = "";
    if (!feature) return;

    feature.options.forEach(function (option, index) {
      elements.detailSelect.appendChild(makeOption(option, String(index)));
    });

    elements.detailLabel.textContent = feature.id === "fruit-tree" ? "Tree type" :
      feature.id === "apple-guild" ? "Guild anchor" : "Primary setup";
    elements.detailCaution.textContent = getDetailCaution(feature);
    renderFeatureContents(feature);
  }

  function getFeatureContents(feature) {
    const contents = FACILITY_CONTENTS[feature.id];
    if (!contents) return null;
    if (feature.id !== "fruit-tree") return contents;
    const treeType = feature.options[Number(elements.detailSelect.value)] || "";
    if (treeType.indexOf("Pear") === 0) {
      return {
        type: "manual-cultivar",
        title: "Enter a pear scion / cultivar",
        placeholder: "Use a name verified by your nursery or local source"
      };
    }
    if (treeType.indexOf("European plum") === 0) {
      return {
        type: "manual-cultivar",
        title: "Enter a plum scion / cultivar",
        placeholder: "Use a name verified by your nursery or local source"
      };
    }
    return contents;
  }

  function getSource(sourceId) {
    return REFERENCE_SOURCES.find(function (source) { return source.id === sourceId; });
  }

  function positionSpeciesCard(anchor) {
    const bounds = anchor.getBoundingClientRect();
    const cardBounds = elements.speciesCard.getBoundingClientRect();
    const left = Math.max(12, Math.min(window.innerWidth - cardBounds.width - 12, bounds.left));
    const below = bounds.bottom + 8;
    const top = below + cardBounds.height <= window.innerHeight - 12
      ? below
      : Math.max(12, bounds.top - cardBounds.height - 8);
    elements.speciesCard.style.left = left + "px";
    elements.speciesCard.style.top = top + "px";
  }

  function showSpeciesCard(option, anchor) {
    const source = option && option.sourceId ? getSource(option.sourceId) : null;
    elements.speciesCardTitle.textContent = option && option.name ? option.name : "Plant information";
    elements.speciesCardScientific.textContent = option && option.scientificName
      ? option.scientificName
      : "";
    elements.speciesCardScientific.hidden = !elements.speciesCardScientific.textContent;
    elements.speciesCardFacts.replaceChildren();
    const facts = option && Array.isArray(option.verifiedFacts)
      ? option.verifiedFacts
      : source
        ? ["Listed as an example in the linked reference. This prototype has no verified species-care profile for this choice."]
        : ["No source-verified profile is available for this choice in this prototype."];
    facts.forEach(function (fact) {
      const item = document.createElement("li");
      item.textContent = fact;
      elements.speciesCardFacts.appendChild(item);
    });
    const role = option && option.layerRole
      ? "Menu placement: " + option.layerRole + ". This is a planning classification, not proof of local suitability."
      : "";
    const scope = option && option.sourceId && option.sourceId.indexOf("umn-") === 0
      ? "Regional limit: this reference is Minnesota-specific and should not be treated as Atlantic Canada guidance."
      : source
        ? "The reference does not establish local suitability or companion compatibility."
        : "Do not treat this menu entry as a recommendation.";
    elements.speciesCardCaveat.textContent = [role, scope].filter(Boolean).join(" ");
    elements.speciesCardSource.hidden = !source;
    if (source) {
      elements.speciesCardSource.href = source.url;
      elements.speciesCardSource.textContent = "Source: " + source.label;
    } else {
      elements.speciesCardSource.removeAttribute("href");
      elements.speciesCardSource.textContent = "";
    }
    elements.speciesCard.hidden = false;
    requestAnimationFrame(function () { positionSpeciesCard(anchor); });
  }

  function createSpeciesTrigger(option, label) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "species-name-trigger";
    button.textContent = label;
    button.speciesOption = option;
    button.addEventListener("mouseenter", function () {
      showSpeciesCard(button.speciesOption || {}, button);
    });
    button.addEventListener("focus", function () {
      showSpeciesCard(button.speciesOption || {}, button);
    });
    button.addEventListener("click", function (event) {
      event.stopPropagation();
      showSpeciesCard(button.speciesOption || {}, button);
    });
    return button;
  }

  function updateGuildSummary() {
    const summary = document.getElementById("guild-config-summary");
    if (!summary) return;
    const selected = Array.from(elements.guildOptions.querySelectorAll(".guild-layer-select"))
      .filter(function (select) { return Boolean(select.value); });
    const nitrogenFixer = elements.guildOptions.querySelector("#nitrogen-fixer-select");
    const fixer = nitrogenFixer && nitrogenFixer.value && nitrogenFixer.value !== "none"
      ? NITROGEN_FIXERS.find(function (plant) { return plant.id === nitrogenFixer.value; })
      : null;
    const roles = selected.map(function (select) {
      const layer = GUILD_LAYERS.find(function (entry) { return entry.id === select.dataset.layerId; });
      const plant = layer && layer.options.find(function (entry) { return entry.id === select.value; });
      return plant ? plant.name : "";
    }).filter(Boolean);
    summary.textContent = "Selected " + selected.length + " of " + GUILD_LAYERS.length +
      " vertical layers" + (roles.length ? ": " + roles.join("; ") : ".") +
      (fixer ? " Nitrogen-fixer candidate: " + fixer.name + "." : "") +
      " This describes planned structure and roles only; it does not verify compatibility, nitrogen transfer, yield, wildlife effects, or regional fit.";
  }

  function renderFeatureContents(feature) {
    const contents = getFeatureContents(feature);
    if (!contents) {
      elements.contentsFieldset.hidden = true;
      return;
    }
    elements.contentsFieldset.hidden = false;
    elements.contentsTitle.textContent = contents.title;
    elements.contentsOptions.replaceChildren();
    elements.guildOptions.replaceChildren();
    const isGuild = contents.type === "guild";
    const isPlants = contents.type === "plants";
    const isCultivars = contents.type === "cultivars";
    const isManualCultivar = contents.type === "manual-cultivar";
    elements.fitControls.hidden = !isPlants;
    elements.contentsHelp.textContent = isPlants
      ? "Choose crops and optionally enter days to maturity from your seed packet. Hover, focus, or tap a crop name for its sourced profile."
      : isGuild
        ? "Choose candidates independently for each layer. The selected layers describe structure, not proven companions or local recommendations."
        : isCultivars
          ? "These cultivar notes come from a Minnesota source and are not an Atlantic Canada recommendation. Confirm local fit and graft compatibility."
          : isManualCultivar
            ? "No source-verified cultivar list is available here for this tree type. Enter a cultivar name from a trusted local source; the app will label it as user-provided."
          : "Pick the parts to include in this sample feature.";

    if (isGuild) {
      GUILD_LAYERS.forEach(function (layer) {
        const label = document.createElement("label");
        label.className = "guild-layer-label";
        label.textContent = layer.name;
        const select = document.createElement("select");
        select.className = "guild-layer-select";
        select.dataset.layerId = layer.id;
        select.appendChild(makeOption("Not selected", ""));
        layer.options.forEach(function (plant) {
          select.appendChild(makeOption(plant.name, plant.id));
        });
        const info = createSpeciesTrigger(null, "Plant details");
        info.className = "species-name-trigger guild-species-trigger";
        info.hidden = true;
        select.addEventListener("change", function () {
          const plant = layer.options.find(function (entry) { return entry.id === select.value; });
          info.hidden = !plant;
          if (plant) {
            info.textContent = "Details: " + plant.name;
            info.speciesOption = plant;
          }
          updateGuildSummary();
        });
        label.appendChild(select);
        elements.guildOptions.appendChild(label);
        elements.guildOptions.appendChild(info);
      });
      const nitrogenLabel = document.createElement("label");
      nitrogenLabel.className = "guild-layer-label";
      nitrogenLabel.textContent = "Optional functional role: nitrogen fixer";
      const nitrogenSelect = document.createElement("select");
      nitrogenSelect.id = "nitrogen-fixer-select";
      nitrogenSelect.appendChild(makeOption("Not selected", ""));
      NITROGEN_FIXERS.forEach(function (plant) {
        nitrogenSelect.appendChild(makeOption(plant.name, plant.id));
      });
      nitrogenLabel.appendChild(nitrogenSelect);
      elements.guildOptions.appendChild(nitrogenLabel);
      nitrogenSelect.addEventListener("change", updateGuildSummary);
      const summary = document.createElement("div");
      summary.className = "guild-config-summary";
      summary.id = "guild-config-summary";
      summary.setAttribute("role", "status");
      elements.guildOptions.appendChild(summary);
      updateGuildSummary();
      return;
    }

    if (isManualCultivar) {
      const label = document.createElement("label");
      label.className = "manual-cultivar-label";
      label.textContent = contents.title;
      const input = document.createElement("input");
      input.type = "text";
      input.className = "manual-cultivar";
      input.maxLength = 100;
      input.placeholder = contents.placeholder;
      input.setAttribute("aria-label", contents.title);
      label.appendChild(input);
      elements.contentsOptions.appendChild(label);
    } else {
      contents.options.forEach(function (option, index) {
        const row = document.createElement("div");
        row.className = "contents-option";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = "feature-content-" + index;
        checkbox.name = "feature-content";
        checkbox.value = option.id;
        checkbox.dataset.optionName = option.name;
        checkbox.setAttribute("aria-label", "Add " + option.name + " to this feature");
        const trigger = createSpeciesTrigger(option, option.name);
        row.append(checkbox, trigger);
        if (option.maturityEditable && isPlants) {
          const days = document.createElement("input");
          days.type = "number";
          days.className = "maturity-days";
          days.min = "1";
          days.max = "365";
          days.placeholder = "Seed-packet days";
          days.setAttribute("aria-label", option.name + " days to maturity from seed packet");
          days.hidden = true;
          checkbox.addEventListener("change", function () {
            days.hidden = !checkbox.checked;
            if (!checkbox.checked) days.value = "";
          });
          row.appendChild(days);
        }
        elements.contentsOptions.appendChild(row);
      });
    }

    if (isCultivars && feature.id === "fruit-tree" &&
        feature.options[Number(elements.detailSelect.value)].indexOf("Multi-grafted") !== 0) {
      elements.contentsHelp.textContent += " For a single-variety tree, select one.";
    }
  }

  function getDetailCaution(feature) {
    if (feature.id === "fruit-tree" || feature.id === "apple-guild") {
      return "Cultivar and rootstock performance vary by site; confirm hardiness, pollination, disease resistance, and mature size with local sources.";
    }
    if (feature.id === "angled-espalier") {
      return "Experimental idea only. Verify rootstock, cultivar, spacing, support strength, and pruning with a knowledgeable local grower; aggressive pruning can damage trees.";
    }
    if (feature.category === "Habitat") {
      return "Select plants and habitat structures for local species and conditions; verify regional suitability before installation.";
    }
    if (feature.id === "pest-exclusion") {
      return "Favor targeted, non-harmful physical protection; identify the pest and protect beneficial wildlife before acting.";
    }
    return "A planning example only. Check site conditions, local suitability, and requirements before building or planting.";
  }

  function autoSelectByLegacyTraits() {
    return;
    const feature = getCatalogItem(elements.featureSelect.value);
    if (!feature) return;
    const exposure = elements.bedExposure.value;
    const watering = elements.bedWatering.value;

    if (elements.contentsOptions.querySelector('input[name="feature-content"][data-water]')) {
      const inputs = Array.from(elements.contentsOptions.querySelectorAll('input[name="feature-content"]'));
      inputs.forEach(function (input) {
        input.checked = input.dataset.water === targetWater &&
          input.dataset.fertility === targetFertility;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      });
      if (!inputs.some(function (input) { return input.checked; })) {
        inputs.sort(function (a, b) {
          const score = function (input) {
            return Math.abs(rank[input.dataset.water] - rank[targetWater]) +
              Math.abs(rank[input.dataset.fertility] - rank[targetFertility]);
          };
          return score(a) - score(b);
        });
        if (inputs[0]) inputs[0].checked = true;
      }
    } else {
      elements.guildOptions.querySelectorAll(".guild-layer-select").forEach(function (select) {
        const layer = GUILD_LAYERS.find(function (entry) { return entry.id === select.dataset.layerId; });
        if (!layer) return;
        const candidates = layer.options.slice().sort(function (a, b) {
          const score = function (plant) {
            return Math.abs(rank[plant.water] - rank[targetWater]) +
              Math.abs(rank[plant.fertility] - rank[targetFertility]);
          };
          return score(a) - score(b);
        });
        select.value = candidates[0] ? candidates[0].id : "";
      });
      const fixer = elements.guildOptions.querySelector("#nitrogen-fixer-select");
      if (fixer) fixer.value = "clover";
    }
    elements.autoSelectNote.textContent =
      "Selected from rough water/fertility tags only. This does not predict plant compatibility, yield, or fertilizer needs.";
  }

  function autoSelectContents() {
    const exposure = elements.bedExposure.value;
    const watering = elements.bedWatering.value;
    const matches = [];
    elements.contentsOptions.querySelectorAll('input[name="feature-content"]').forEach(function (input) {
      const plant = VEGETABLE_PLANTS.find(function (entry) { return entry.id === input.value; });
      const matchesProfile = plant && Array.isArray(plant.verifiedFacts) &&
        Array.isArray(plant.sun) && plant.sun.includes(exposure) &&
        Array.isArray(plant.watering) && plant.watering.includes(watering);
      input.checked = Boolean(matchesProfile);
      input.dispatchEvent(new Event("change", { bubbles: true }));
      if (matchesProfile) matches.push(plant.name);
    });
    elements.autoSelectNote.textContent = matches.length
      ? "Selected only cited profiles matching both settings: " + matches.join(", ") +
        ". Verify actual bed conditions and regional guidance; this is not a companion-planting recommendation."
      : "No crop in this demo has a cited profile matching both settings. No crop was selected; unknown profiles are not guessed.";
  }

  function renderReferenceList() {
    const list = document.getElementById("reference-list");
    list.replaceChildren();
    REFERENCE_SOURCES.forEach(function (source) {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = source.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = source.label;
      const note = document.createElement("span");
      note.textContent = " — " + source.note;
      item.append(link, note);
      list.appendChild(item);
    });
  }

  function collectSelectedContents(feature) {
    const definition = getFeatureContents(feature);
    if (!definition) return { contents: [], guildLayers: [], nitrogenFixer: "" };
    if (definition.type === "manual-cultivar") {
      const cultivar = elements.contentsOptions.querySelector(".manual-cultivar");
      const name = cultivar ? cultivar.value.trim() : "";
      return {
        contents: name ? [{ id: "user-entered-cultivar", name: name + " (user-provided; not verified by TerraForma)", daysToHarvest: null }] : [],
        guildLayers: [],
        nitrogenFixer: ""
      };
    }
    if (definition.type === "guild") {
      const guildLayers = [];
      elements.guildOptions.querySelectorAll(".guild-layer-select").forEach(function (select) {
        if (!select.value) return;
        const layer = GUILD_LAYERS.find(function (entry) { return entry.id === select.dataset.layerId; });
        const plant = layer && layer.options.find(function (entry) { return entry.id === select.value; });
        if (layer && plant) {
          guildLayers.push({
            layerId: layer.id,
            layerName: layer.name.replace(/^\d+\.\s*/, ""),
            plantId: plant.id,
            plantName: plant.name,
            layerRole: plant.layerRole || "",
            sourceId: plant.sourceId || ""
          });
        }
      });
      const nitrogenSelect = elements.guildOptions.querySelector("#nitrogen-fixer-select");
      return {
        contents: [],
        guildLayers: guildLayers,
        nitrogenFixer: nitrogenSelect ? nitrogenSelect.value : ""
      };
    }

    return {
      contents: Array.from(elements.contentsOptions.querySelectorAll('input[name="feature-content"]:checked'))
        .map(function (input) {
          const daysInput = input.closest(".contents-option").querySelector(".maturity-days");
          return {
            id: input.value,
            name: input.dataset.optionName,
            daysToHarvest: daysInput && daysInput.value ? Number(daysInput.value) : null
          };
        }),
      guildLayers: [],
      nitrogenFixer: ""
    };
  }

  function getZoneById(id) {
    return PROPERTY.zones.find(function (zone) { return zone.id === id; });
  }

  function selectZone(id) {
    const zone = getZoneById(id);
    if (!zone) return;
    selectedZoneId = id;
    document.getElementById("zone-title").textContent = zone.label;
    document.getElementById("zone-category").textContent = zone.category;
    document.getElementById("zone-evidence").textContent = zone.evidence;
    document.getElementById("zone-observation-title").textContent = zone.title;
    document.getElementById("zone-observation-note").textContent = zone.note;
    renderZonePicker();
    renderMapMarkers();
  }

  function renderZonePicker() {
    elements.zonePicker.replaceChildren();
    PROPERTY.zones.forEach(function (zone) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "zone-button" + (zone.id === selectedZoneId ? " is-selected" : "");
      button.textContent = zone.label;
      button.setAttribute("aria-pressed", zone.id === selectedZoneId ? "true" : "false");
      button.addEventListener("click", function () { selectZone(zone.id); });
      elements.zonePicker.appendChild(button);
    });
  }

  function renderMapMarkers() {
    elements.mapMarkers.replaceChildren();
    PROPERTY.zones.forEach(function (zone) {
      const marker = document.createElement("button");
      marker.type = "button";
      marker.className = "map-marker" + (zone.id === selectedZoneId ? " is-selected" : "");
      marker.style.left = zone.x + "%";
      marker.style.top = zone.y + "%";
      marker.textContent = zone.shortLabel;
      marker.setAttribute("aria-label", "Show observation: " + zone.label);
      marker.setAttribute("aria-pressed", zone.id === selectedZoneId ? "true" : "false");
      marker.addEventListener("click", function () { selectZone(zone.id); });
      elements.mapMarkers.appendChild(marker);
    });
  }

  function polygonArea(points) {
    let sum = 0;
    points.forEach(function (point, index) {
      const next = points[(index + 1) % points.length];
      sum += point[0] * next[1] - next[0] * point[1];
    });
    return Math.abs(sum) / 2;
  }

  function pointOnSegment(point, start, end) {
    const cross = (point[1] - start[1]) * (end[0] - start[0]) -
      (point[0] - start[0]) * (end[1] - start[1]);
    if (Math.abs(cross) > 0.0001) return false;
    const dot = (point[0] - start[0]) * (end[0] - start[0]) +
      (point[1] - start[1]) * (end[1] - start[1]);
    if (dot < 0) return false;
    const lengthSquared = (end[0] - start[0]) ** 2 + (end[1] - start[1]) ** 2;
    return dot <= lengthSquared;
  }

  function pointInPolygon(point, polygon) {
    let inside = false;
    for (let index = 0, previous = polygon.length - 1; index < polygon.length; previous = index, index += 1) {
      const start = polygon[index];
      const end = polygon[previous];
      if (pointOnSegment(point, start, end)) return true;
      const crosses = (start[1] > point[1]) !== (end[1] > point[1]) &&
        point[0] < ((end[0] - start[0]) * (point[1] - start[1])) / (end[1] - start[1]) + start[0];
      if (crosses) inside = !inside;
    }
    return inside;
  }

  function orientation(a, b, c) {
    const value = (b[1] - a[1]) * (c[0] - b[0]) - (b[0] - a[0]) * (c[1] - b[1]);
    if (Math.abs(value) < 0.0001) return 0;
    return value > 0 ? 1 : 2;
  }

  function segmentsIntersect(a, b, c, d) {
    const first = orientation(a, b, c);
    const second = orientation(a, b, d);
    const third = orientation(c, d, a);
    const fourth = orientation(c, d, b);
    if (first !== second && third !== fourth) return true;
    return (first === 0 && pointOnSegment(c, a, b)) ||
      (second === 0 && pointOnSegment(d, a, b)) ||
      (third === 0 && pointOnSegment(a, c, d)) ||
      (fourth === 0 && pointOnSegment(b, c, d));
  }

  function hasSelfIntersection(points) {
    for (let first = 0; first < points.length; first += 1) {
      const firstNext = (first + 1) % points.length;
      for (let second = first + 1; second < points.length; second += 1) {
        const secondNext = (second + 1) % points.length;
        if (first === second || firstNext === second || secondNext === first) continue;
        if (segmentsIntersect(points[first], points[firstNext], points[second], points[secondNext])) return true;
      }
    }
    return false;
  }

  function isInsideProperty(points) {
    const boundary = PROPERTY.mapBoundary;
    for (let index = 0; index < points.length; index += 1) {
      const start = points[index];
      const end = points[(index + 1) % points.length];
      for (let step = 0; step <= 4; step += 1) {
        const ratio = step / 4;
        const sample = [
          start[0] + (end[0] - start[0]) * ratio,
          start[1] + (end[1] - start[1]) * ratio
        ];
        if (!pointInPolygon(sample, boundary)) return false;
      }
    }
    return true;
  }

  function polygonsOverlap(first, second) {
    for (let firstIndex = 0; firstIndex < first.length; firstIndex += 1) {
      const firstStart = first[firstIndex];
      const firstEnd = first[(firstIndex + 1) % first.length];
      for (let secondIndex = 0; secondIndex < second.length; secondIndex += 1) {
        if (segmentsIntersect(
          firstStart,
          firstEnd,
          second[secondIndex],
          second[(secondIndex + 1) % second.length]
        )) return true;
      }
    }
    return pointInPolygon(first[0], second) || pointInPolygon(second[0], first);
  }

  function usedAreaM2(items) {
    return items.reduce(function (total, item) {
      return total + polygonArea(item.polygon) * PROPERTY.mapAreaM2PerUnit;
    }, 0);
  }

  function updateCapacity() {
    const used = Math.round(usedAreaM2(planItems));
    const remaining = Math.max(0, PROPERTY.areaM2 - used);
    const percent = Math.min(100, (used / PROPERTY.areaM2) * 100);
    elements.capacitySummary.textContent =
      used.toLocaleString() + " m² planned · " + remaining.toLocaleString() + " m² remaining";
    elements.capacityProgress.value = percent;
    elements.capacityProgress.textContent = Math.round(percent) + "%";
  }

  function svgElement(name, attributes) {
    const node = document.createElementNS(svgNamespace, name);
    Object.keys(attributes).forEach(function (key) { node.setAttribute(key, attributes[key]); });
    return node;
  }

  function renderDraft() {
    const oldDraft = document.getElementById("drawing-preview");
    if (oldDraft) oldDraft.remove();
    if (!pendingPlanItem) return;

    const group = svgElement("g", { id: "drawing-preview", "aria-hidden": "true" });
    if (drawingPoints.length >= 2) {
      const tag = drawingPoints.length >= 3 ? "polygon" : "polyline";
      group.appendChild(svgElement(tag, {
        points: drawingPoints.map(function (point) { return point.join(","); }).join(" "),
        class: "drawing-line"
      }));
    }
    drawingPoints.forEach(function (point) {
      group.appendChild(svgElement("circle", {
        cx: point[0],
        cy: point[1],
        r: 5,
        class: "drawing-point"
      }));
    });
    group.appendChild(svgElement("circle", {
      cx: keyboardCursor.x,
      cy: keyboardCursor.y,
      r: 7,
      class: "drawing-cursor"
    }));
    elements.planAreas.appendChild(group);
  }

  function renderMapAreas() {
    elements.planAreas.replaceChildren();
    planItems.forEach(function (item) {
      const polygon = svgElement("polygon", {
        points: item.polygon.map(function (point) { return point.join(","); }).join(" "),
        class: "planned-area" + (item.id === selectedPlanId ? " is-selected" : ""),
        tabindex: "0",
        role: "button",
        "aria-label": item.feature + ", " + Math.round(polygonArea(item.polygon) * PROPERTY.mapAreaM2PerUnit) + " approximate square metres; select to locate in plan",
        "aria-pressed": item.id === selectedPlanId ? "true" : "false",
        "data-plan-id": item.id
      });
      const title = svgElement("title", {});
      title.textContent = item.feature + " · " + item.location;
      polygon.appendChild(title);
      polygon.addEventListener("click", function (event) {
        event.stopPropagation();
        selectPlan(item.id, false);
      });
      polygon.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          selectPlan(item.id, false);
        }
      });
      elements.planAreas.appendChild(polygon);

      const center = item.polygon.reduce(function (result, point) {
        result.x += point[0] / item.polygon.length;
        result.y += point[1] / item.polygon.length;
        return result;
      }, { x: 0, y: 0 });
      const label = svgElement("text", {
        x: center.x,
        y: center.y + 3,
        class: "planned-area-label",
        "aria-hidden": "true"
      });
      label.textContent = item.feature.length > 14 ? item.feature.slice(0, 12) + "…" : item.feature;
      elements.planAreas.appendChild(label);
    });
    renderDraft();
  }

  function nearestZone(points) {
    const center = points.reduce(function (result, point) {
      result.x += point[0] / points.length;
      result.y += point[1] / points.length;
      return result;
    }, { x: 0, y: 0 });
    return PROPERTY.zones.reduce(function (closest, zone) {
      const x = (zone.x / 100) * 640;
      const y = (zone.y / 100) * 430;
      const distance = Math.hypot(center.x - x, center.y - y);
      return !closest || distance < closest.distance
        ? { zone: zone, distance: distance }
        : closest;
    }, null).zone;
  }

  function renderPlan() {
    elements.planList.replaceChildren();
    elements.planCount.textContent = planItems.length;
    elements.planTotal.textContent = planItems.length + (planItems.length === 1 ? " idea" : " ideas");

    if (planItems.length === 0) {
      const empty = document.createElement("p");
      empty.className = "empty-plan";
      empty.textContent = "No planning ideas yet. Add one to start shaping this sample property.";
      elements.planList.appendChild(empty);
    }

    planItems.forEach(function (item) {
      const article = document.createElement("article");
      article.className = "plan-item" + (item.id === selectedPlanId ? " is-selected" : "");
      const icon = document.createElement("span");
      icon.className = "plan-item-icon";
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = "✳";

      const content = document.createElement("div");
      content.className = "plan-item-content";
      const title = document.createElement("h4");
      title.textContent = item.feature;
      const location = document.createElement("p");
      location.className = "plan-location";
      location.textContent = item.location + " · about " +
        Math.round(polygonArea(item.polygon) * PROPERTY.mapAreaM2PerUnit) + " m²";
      const variety = document.createElement("p");
      variety.className = "plan-variety";
      variety.textContent = item.variety || "Planning option to research";
      const note = document.createElement("p");
      note.className = "plan-note";
      note.textContent = item.note;
      content.append(title, location, variety, note);

      if (item.contents && item.contents.length) {
        const selected = document.createElement("p");
        selected.className = "guild-summary";
        selected.textContent = "Contents: " + item.contents.map(function (entry) {
          return entry.name;
        }).join(", ");
        content.appendChild(selected);
        const harvestEstimates = item.contents.filter(function (entry) {
          return Number.isInteger(entry.daysToHarvest) && entry.daysToHarvest > 0;
        });
        if (harvestEstimates.length) {
          const schedule = document.createElement("p");
          schedule.className = "rotation-summary";
          const start = scheduleStart(item);
          schedule.textContent = "Estimated maturity schedule: " + harvestEstimates.map(function (entry) {
            const maturityDate = start && !Number.isNaN(start.getTime())
              ? " (" + new Date(start.getTime() + entry.daysToHarvest * 86400000).toLocaleDateString() + ")"
              : "";
            return entry.name + " · about " + entry.daysToHarvest + " days" + maturityDate;
          }).join("; ") + ". Days are user-entered; confirm the selected variety's seed packet.";
          content.appendChild(schedule);
        }
      }

      if (item.bedProfile) {
        const profile = document.createElement("p");
        profile.className = "guild-summary";
        const exposureName = { full: "full sun", partial: "partial shade", shade: "shade" }[item.bedProfile.exposure] || "exposure not recorded";
        const wateringName = {
          drip: "drip irrigation",
          soaker: "soaker hose",
          hand: "hand-watered soil",
          overhead: "overhead sprinkler"
        }[item.bedProfile.watering] || "watering method not recorded";
        profile.textContent = "Bed settings: " + exposureName + " · " + wateringName + ".";
        content.appendChild(profile);
      }

      if (item.guildLayers && item.guildLayers.length) {
        const layers = document.createElement("p");
        layers.className = "guild-summary";
        layers.textContent = "Guild layers: " + item.guildLayers.map(function (entry) {
          return entry.layerName + ": " + entry.plantName;
        }).join(" · ");
        content.appendChild(layers);
        const limit = document.createElement("p");
        limit.className = "guild-summary";
        limit.textContent = "Layer selections describe structure only; they do not establish companion compatibility, benefits, or local suitability.";
        content.appendChild(limit);
      }

      if (item.nitrogenFixer && item.nitrogenFixer !== "none") {
        const fixer = NITROGEN_FIXERS.find(function (entry) { return entry.id === item.nitrogenFixer; });
        if (fixer) {
          const role = document.createElement("p");
          role.className = "guild-summary";
          role.textContent = "Nitrogen-fixer candidate: " + fixer.name +
            " (not a guarantee of nitrogen transfer to nearby plants).";
          content.appendChild(role);
        }
      }

      if (Number.isInteger(item.rotationDays) && item.rotationDays > 0) {
        const planted = scheduleStart(item);
        if (planted && !Number.isNaN(planted.getTime())) {
          const reviewDate = new Date(planted.getTime() + item.rotationDays * 86400000);
          const rotation = document.createElement("p");
          rotation.className = "rotation-summary";
          rotation.textContent = "Review succession / rotation in " + item.rotationDays + " days · " +
            reviewDate.toLocaleDateString();
          content.appendChild(rotation);
        }
      }

      if (item.guildPlants && item.guildPlants.length) {
        const guild = document.createElement("p");
        guild.className = "guild-summary";
        guild.textContent = "Legacy saved plant selections (not compatibility-verified): " + item.guildPlants.map(function (id) {
          const plant = APPLE_GUILD_PLANTS.find(function (entry) { return entry.id === id; });
          return plant ? plant.name : "";
        }).filter(Boolean).join(", ");
        content.appendChild(guild);
      }

      const actions = document.createElement("div");
      actions.className = "plan-item-actions";
      const locateButton = document.createElement("button");
      locateButton.type = "button";
      locateButton.className = "locate-button";
      locateButton.textContent = "Show on map";
      locateButton.setAttribute("aria-label", "Show " + item.feature + " on map");
      locateButton.addEventListener("click", function () {
        selectPlan(item.id, true);
      });
      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.className = "remove-button";
      removeButton.textContent = "Remove";
      removeButton.setAttribute("aria-label", "Remove " + item.feature + " from the plan");
      removeButton.addEventListener("click", function () {
        planItems = planItems.filter(function (planItem) { return planItem.id !== item.id; });
        if (selectedPlanId === item.id) selectedPlanId = null;
        savePlan();
        renderPlan();
      });
      actions.append(locateButton, removeButton);
      article.append(icon, content, actions);
      elements.planList.appendChild(article);
    });
    renderMapAreas();
    updateCapacity();
  }

  function selectPlan(id, scrollToMap) {
    selectedPlanId = id;
    renderPlan();
    if (scrollToMap) {
      document.getElementById("property").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function readSavedPlan() {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved === null) return;
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed) || !parsed.every(function (item) {
        return item && typeof item.id === "string" &&
          typeof item.feature === "string" &&
          typeof item.location === "string" &&
          typeof item.note === "string";
      })) {
        throw new Error("The saved planning data has an unexpected format.");
      }

      const occupied = [];
      planItems = parsed.map(function (item, index) {
        const sample = PROPERTY.initialPlan.find(function (entry) { return entry.id === item.id; });
        let polygon = Array.isArray(item.polygon) && item.polygon.length >= 3 &&
          item.polygon.every(function (point) {
            return Array.isArray(point) && point.length === 2 &&
              Number.isFinite(point[0]) && Number.isFinite(point[1]);
          }) ? item.polygon.map(function (point) { return point.slice(); }) :
          sample ? sample.polygon.map(function (point) { return point.slice(); }) :
          findMigrationFootprint(occupied);
        if (!polygon || hasSelfIntersection(polygon) || !isInsideProperty(polygon) ||
            occupied.some(function (existing) { return polygonsOverlap(existing, polygon); })) {
          polygon = findMigrationFootprint(occupied);
        }
        if (!polygon) throw new Error("The saved plan has more features than can be safely placed on the sample map.");
        occupied.push(polygon);
        const feature = getCatalogItem(item.featureId) ||
          PLAN_CATALOG.find(function (entry) { return entry.name === item.feature; }) ||
          PLAN_CATALOG.find(function (entry) {
            return entry.id === "fruit-tree" && item.feature.toLowerCase().indexOf("fruit tree") !== -1;
          }) ||
          getCatalogItem("garden-beds");
        const guildPlants = Array.isArray(item.guildPlants)
          ? item.guildPlants.filter(function (id) {
            return APPLE_GUILD_PLANTS.some(function (plant) { return plant.id === id; });
          })
          : [];
        return Object.assign({}, item, {
          featureId: feature.id,
          polygon: polygon,
          variety: typeof item.variety === "string" ? item.variety : "Planning option to research",
          guildPlants: guildPlants,
          contents: Array.isArray(item.contents) ? item.contents.filter(function (entry) {
            return entry && typeof entry.name === "string";
          }) : [],
          guildLayers: Array.isArray(item.guildLayers) ? item.guildLayers.filter(function (entry) {
            return entry && typeof entry.layerName === "string" && typeof entry.plantName === "string";
          }) : [],
          bedProfile: item.bedProfile &&
            ["full", "partial", "shade"].includes(item.bedProfile.exposure) &&
            ["drip", "soaker", "hand", "overhead"].includes(item.bedProfile.watering)
            ? {
              exposure: item.bedProfile.exposure,
              watering: item.bedProfile.watering
            }
            : null,
          rotationDays: Number.isInteger(item.rotationDays) ? item.rotationDays : null,
          scheduleStartDate: typeof item.scheduleStartDate === "string" ? item.scheduleStartDate : ""
        });
      });
    } catch (error) {
      storageAvailable = false;
      elements.storageMessage.textContent = "Could not load this browser's saved plan. The sample plan is shown instead.";
      elements.storageMessage.classList.add("storage-error");
      console.error("TerraForma could not read the saved plan:", error);
    }
  }

  function findMigrationFootprint(occupied) {
    for (let row = 0; row < 9; row += 1) {
      for (let column = 0; column < 11; column += 1) {
        const x = 112 + column * 36;
        const y = 90 + row * 32;
        const candidate = [[x, y], [x + 20, y], [x + 20, y + 20], [x, y + 20]];
        if (isInsideProperty(candidate) &&
            !occupied.some(function (polygon) { return polygonsOverlap(polygon, candidate); })) {
          return candidate;
        }
      }
    }
    return null;
  }

  function savePlan() {
    if (!storageAvailable) return false;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(planItems));
      elements.storageMessage.textContent = "Your planning ideas are stored only in this browser.";
      elements.storageMessage.classList.remove("storage-error");
      return true;
    } catch (error) {
      storageAvailable = false;
      elements.storageMessage.textContent = "Could not save this plan in your browser. Your changes will be lost when you leave.";
      elements.storageMessage.classList.add("storage-error");
      console.error("TerraForma could not save the plan:", error);
      return false;
    }
  }

  function getPerspectiveById(id) {
    return DESIGN_PERSPECTIVES.find(function (perspective) { return perspective.id === id; });
  }

  function renderPerspectiveTabs() {
    elements.perspectiveTabs.replaceChildren();
    DESIGN_PERSPECTIVES.forEach(function (perspective) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "perspective-tab" + (perspective.id === selectedPerspectiveId ? " is-selected" : "");
      button.textContent = perspective.name;
      button.setAttribute("aria-pressed", perspective.id === selectedPerspectiveId ? "true" : "false");
      button.addEventListener("click", function () {
        selectedPerspectiveId = perspective.id;
        renderPerspective();
      });
      elements.perspectiveTabs.appendChild(button);
    });
  }

  function makePerspectiveIdea(idea) {
    const article = document.createElement("article");
    article.className = "perspective-idea";
    const heading = document.createElement("div");
    heading.className = "idea-heading";
    const title = document.createElement("h5");
    title.textContent = idea.feature;
    const location = document.createElement("span");
    location.textContent = idea.location;
    heading.append(title, location);
    const reason = document.createElement("p");
    reason.textContent = idea.reason;
    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.className = "idea-add-button";
    addButton.textContent = "Customize this idea";
    addButton.addEventListener("click", function () { addIdeaToPlan(idea); });
    article.append(heading, reason, addButton);
    return article;
  }

  function renderPerspective() {
    const perspective = getPerspectiveById(selectedPerspectiveId);
    if (!perspective) return;
    elements.perspectiveName.textContent = perspective.name;
    elements.perspectiveDescriptor.textContent = perspective.descriptor;
    elements.perspectiveSummary.textContent = perspective.summary;
    elements.perspectiveQuestion.textContent = perspective.question;
    elements.perspectivePriorities.replaceChildren();
    perspective.priorities.forEach(function (priority) {
      const item = document.createElement("li");
      item.textContent = priority;
      elements.perspectivePriorities.appendChild(item);
    });
    elements.perspectiveIdeas.replaceChildren.apply(
      elements.perspectiveIdeas,
      perspective.ideas.map(makePerspectiveIdea)
    );
    renderPerspectiveTabs();
  }

  function beginDrawing(item) {
    pendingPlanItem = item;
    drawingPoints = [];
    keyboardCursor = { x: 320, y: 215 };
    elements.drawingToolbar.hidden = false;
    elements.drawingStatus.textContent = "Click or tap at least three points inside the boundary to outline " +
      item.feature + ". Arrow keys and Enter also place points. The rough catalogue footprint is " +
      getCatalogItem(item.featureId).defaultAreaM2 + " m²; the saved estimate comes from your drawing.";
    elements.finishDrawing.disabled = true;
    showFormError("");
    renderDraft();
    const previousScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";
    document.getElementById("property").scrollIntoView({ behavior: "auto", block: "start" });
    document.documentElement.style.scrollBehavior = previousScrollBehavior;
    elements.mapSvg.focus({ preventScroll: true });
  }

  function addIdeaToPlan(idea) {
    const feature = PLAN_CATALOG.find(function (item) { return item.name === idea.feature; });
    if (!feature) {
      showFormError("This sample idea has no matching map feature yet.");
      return;
    }
    elements.featureSelect.value = feature.id;
    updateFeatureDetails();
    elements.planNote.value = idea.reason;
    document.getElementById("plan").scrollIntoView({ behavior: "smooth", block: "start" });
    elements.featureSelect.focus({ preventScroll: true });
    showFormError("Idea loaded. Choose the plants or components to include, then draw its footprint.");
  }

  function pointerToMapPoint(event) {
    const rectangle = elements.mapSvg.getBoundingClientRect();
    const scale = Math.min(rectangle.width / 640, rectangle.height / 430);
    const offsetX = (rectangle.width - 640 * scale) / 2;
    const offsetY = (rectangle.height - 430 * scale) / 2;
    return [
      Math.max(0, Math.min(640, (event.clientX - rectangle.left - offsetX) / scale)),
      Math.max(0, Math.min(430, (event.clientY - rectangle.top - offsetY) / scale))
    ];
  }

  function addDrawingPoint(point) {
    if (!pendingPlanItem) return;
    drawingPoints.push(point);
    elements.finishDrawing.disabled = drawingPoints.length < 3;
    elements.drawingStatus.textContent = drawingPoints.length + " point" +
      (drawingPoints.length === 1 ? "" : "s") + " placed. Add more, undo, or finish the area.";
    renderDraft();
  }

  function validateDrawing(points) {
    if (points.length < 3) return "Add at least three points to outline an area.";
    if (points.some(function (point, index) {
      const next = points[(index + 1) % points.length];
      return Math.hypot(point[0] - next[0], point[1] - next[1]) < 1;
    })) return "Two outline points are too close together. Move or undo one of them.";
    if (polygonArea(points) < 4) return "This outline is too small to estimate. Draw a larger area.";
    if (hasSelfIntersection(points)) return "The outline crosses itself. Undo points and draw a simple shape.";
    if (!isInsideProperty(points)) return "Every part of the footprint must stay inside the sample property boundary.";
    if (planItems.some(function (item) { return polygonsOverlap(item.polygon, points); })) {
      return "This footprint overlaps or touches another planned area. Choose a separate part of the map.";
    }
    const estimate = polygonArea(points) * PROPERTY.mapAreaM2PerUnit;
    if (usedAreaM2(planItems) + estimate > PROPERTY.areaM2) {
      return "This area would exceed the sample property's illustrative remaining capacity.";
    }
    return "";
  }

  function finishDrawing() {
    if (!pendingPlanItem) return;
    const error = validateDrawing(drawingPoints);
    if (error) {
      elements.drawingStatus.textContent = error;
      return;
    }
    const zone = nearestZone(drawingPoints);
    const savedItem = Object.assign({}, pendingPlanItem, {
      location: "Near " + zone.label,
      note: pendingPlanItem.note || "A starting idea to research and adapt to the actual site.",
      polygon: drawingPoints.map(function (point) { return point.slice(); }),
      createdAt: new Date().toISOString()
    });
    planItems.push(savedItem);
    selectedPlanId = savedItem.id;
    pendingPlanItem = null;
    drawingPoints = [];
    elements.drawingToolbar.hidden = true;
    renderPlan();
    savePlan();
    elements.planNote.value = "";
    showFormError("");
  }

  elements.featureSelect.addEventListener("change", updateFeatureDetails);
  elements.detailSelect.addEventListener("change", function () {
    const feature = getCatalogItem(elements.featureSelect.value);
    if (!feature) return;
    renderFeatureContents(feature);
    elements.detailCaution.textContent = getDetailCaution(feature);
  });
  elements.autoSelect.addEventListener("click", autoSelectContents);
  elements.speciesCardClose.addEventListener("click", function () {
    elements.speciesCard.hidden = true;
  });
  document.addEventListener("pointerdown", function (event) {
    if (!elements.speciesCard.contains(event.target) &&
        !(event.target.closest && event.target.closest(".species-name-trigger"))) {
      elements.speciesCard.hidden = true;
    }
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !elements.speciesCard.hidden) {
      elements.speciesCard.hidden = true;
    }
  });
  elements.planForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const feature = getCatalogItem(elements.featureSelect.value);
    const optionIndex = Number(elements.detailSelect.value);
    if (!feature || !Number.isInteger(optionIndex) || !feature.options[optionIndex]) {
      showFormError("Choose a feature and a planting or approach option first.");
      return;
    }
    const selected = collectSelectedContents(feature);
    const definition = getFeatureContents(feature);
    if (definition && definition.type === "guild" &&
        selected.guildLayers.length === 0 &&
        (!selected.nitrogenFixer || selected.nitrogenFixer === "none")) {
      showFormError("Choose at least one layer or role, or leave this feature unplanned.");
      return;
    }
    if (definition && definition.type !== "guild" && selected.contents.length === 0) {
      showFormError("Select at least one item to put in this feature.");
      return;
    }
    if (selected.contents.some(function (item) {
      return item.daysToHarvest !== null &&
        (!Number.isInteger(item.daysToHarvest) || item.daysToHarvest < 1 || item.daysToHarvest > 365);
    })) {
      showFormError("Enter maturity estimates between 1 and 365 days, or leave them blank.");
      return;
    }
    const treeType = feature.id === "fruit-tree"
      ? feature.options[optionIndex]
      : "";
    if (treeType.indexOf("Multi-grafted") !== 0 && selected.contents.length > 1 &&
        feature.id === "fruit-tree") {
      showFormError("For a single-variety tree, select only one cultivar. Choose multi-grafted apple to select several scions.");
      return;
    }
    if (treeType.indexOf("Multi-grafted") === 0 && selected.contents.length > 5) {
      showFormError("Choose up to five scions for this sample multi-graft plan.");
      return;
    }
    const rotationDays = elements.rotationField.hidden ? null : Number(elements.rotationDays.value);
    if (!elements.rotationField.hidden &&
        (!Number.isInteger(rotationDays) || rotationDays < 1 || rotationDays > 365)) {
      showFormError("Enter a rotation review interval from 1 to 365 days.");
      return;
    }
    const scheduleStartDate = elements.rotationField.hidden ? "" : elements.scheduleStartDate.value;
    if (!elements.rotationField.hidden && !/^\d{4}-\d{2}-\d{2}$/.test(scheduleStartDate)) {
      showFormError("Choose a valid planned planting or cycle start date.");
      return;
    }
    showFormError("");
    beginDrawing({
      id: "plan-" + Date.now(),
      featureId: feature.id,
      feature: feature.name,
      variety: feature.options[optionIndex],
      contents: selected.contents,
      guildLayers: selected.guildLayers,
      nitrogenFixer: selected.nitrogenFixer,
      bedProfile: definition && definition.type === "plants"
        ? { exposure: elements.bedExposure.value, watering: elements.bedWatering.value }
        : null,
      rotationDays: rotationDays,
      scheduleStartDate: scheduleStartDate,
      guildPlants: [],
      note: elements.planNote.value.trim() || "A starting idea to research and adapt to the actual site."
    });
  });

  elements.mapFrame.addEventListener("click", function (event) {
    if (!pendingPlanItem || (event.target.closest &&
        event.target.closest(".map-marker, .planned-area, .planned-area-label, .north-arrow"))) return;
    addDrawingPoint(pointerToMapPoint(event));
  });
  elements.mapSvg.addEventListener("keydown", function (event) {
    if (!pendingPlanItem) return;
    const step = event.shiftKey ? 20 : 8;
    const directions = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step]
    };
    if (directions[event.key]) {
      event.preventDefault();
      keyboardCursor.x = Math.max(0, Math.min(640, keyboardCursor.x + directions[event.key][0]));
      keyboardCursor.y = Math.max(0, Math.min(430, keyboardCursor.y + directions[event.key][1]));
      renderDraft();
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      addDrawingPoint([keyboardCursor.x, keyboardCursor.y]);
    }
  });
  elements.undoPoint.addEventListener("click", function () {
    drawingPoints.pop();
    elements.finishDrawing.disabled = drawingPoints.length < 3;
    elements.drawingStatus.textContent = drawingPoints.length
      ? drawingPoints.length + " points placed. Add more, undo, or finish the area."
      : "All points removed. Click or tap the map to start the outline.";
    renderDraft();
  });
  elements.cancelDrawing.addEventListener("click", function () {
    pendingPlanItem = null;
    drawingPoints = [];
    elements.drawingToolbar.hidden = true;
    renderDraft();
    showFormError("");
  });
  elements.finishDrawing.addEventListener("click", finishDrawing);

  readSavedPlan();
  populateFeatureOptions();
  renderReferenceList();
  selectZone(selectedZoneId);
  renderPlan();
  renderPerspective();
})();
