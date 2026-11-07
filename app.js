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
    detailSelect: document.getElementById("detail-select"),
    detailCaution: document.getElementById("detail-caution"),
    guildFieldset: document.getElementById("guild-fieldset"),
    guildOptions: document.getElementById("guild-options"),
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

  document.title = STARTUP.name + " — Land planning, made thoughtful";
  document.getElementById("tagline").textContent = STARTUP.tagline;
  document.getElementById("pitch").textContent = STARTUP.pitch;
  document.getElementById("property-name").textContent = PROPERTY.name;
  document.getElementById("property-location").textContent = PROPERTY.location;
  document.getElementById("property-area").textContent = PROPERTY.area;
  document.getElementById("area-note").textContent = "Sample dashboard · " + PROPERTY.areaNote + ".";
  document.getElementById("observation-count").textContent = PROPERTY.zones.length;

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
    const categories = [];
    PLAN_CATALOG.forEach(function (item) {
      if (categories.indexOf(item.category) === -1) categories.push(item.category);
    });

    categories.forEach(function (category) {
      const group = document.createElement("optgroup");
      group.label = category;
      PLAN_CATALOG.filter(function (item) { return item.category === category; })
        .forEach(function (item) {
          group.appendChild(makeOption(item.name, item.id));
        });
      elements.featureSelect.appendChild(group);
    });
    updateFeatureDetails();
  }

  function showFormError(message) {
    elements.formError.textContent = message;
    elements.formError.hidden = !message;
  }

  function updateFeatureDetails() {
    const feature = getCatalogItem(elements.featureSelect.value);
    elements.detailSelect.replaceChildren();
    elements.guildOptions.replaceChildren();
    elements.guildFieldset.hidden = !(feature && feature.guild);
    elements.detailField.hidden = !feature;
    if (!feature) return;

    feature.options.forEach(function (option, index) {
      elements.detailSelect.appendChild(makeOption(option, String(index)));
    });

    if (feature.guild) {
      APPLE_GUILD_PLANTS.forEach(function (plant) {
        const label = document.createElement("label");
        label.className = "guild-option";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "guild-plant";
        checkbox.value = plant.id;
        checkbox.checked = true;
        const text = document.createElement("span");
        text.append(document.createTextNode(plant.name));
        const role = document.createElement("small");
        role.textContent = plant.role;
        text.appendChild(role);
        label.append(checkbox, text);
        elements.guildOptions.appendChild(label);
      });
    }

    elements.detailCaution.textContent = getDetailCaution(feature);
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

      if (item.guildPlants && item.guildPlants.length) {
        const guild = document.createElement("p");
        guild.className = "guild-summary";
        guild.textContent = "Guild companions: " + item.guildPlants.map(function (id) {
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
          guildPlants: guildPlants
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
    addButton.textContent = "Draw on map";
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
    beginDrawing({
      id: "plan-" + Date.now(),
      featureId: feature.id,
      feature: feature.name,
      variety: feature.options[0],
      guildPlants: feature.guild ? APPLE_GUILD_PLANTS.map(function (plant) { return plant.id; }) : [],
      note: idea.reason
    });
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
      polygon: drawingPoints.map(function (point) { return point.slice(); })
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
  elements.planForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const feature = getCatalogItem(elements.featureSelect.value);
    const optionIndex = Number(elements.detailSelect.value);
    if (!feature || !Number.isInteger(optionIndex) || !feature.options[optionIndex]) {
      showFormError("Choose a feature and a planting or approach option first.");
      return;
    }
    const guildPlants = Array.from(elements.guildOptions.querySelectorAll("input:checked"))
      .map(function (input) { return input.value; });
    if (feature.guild && guildPlants.length === 0) {
      showFormError("Choose at least one companion plant for this sample guild.");
      return;
    }
    beginDrawing({
      id: "plan-" + Date.now(),
      featureId: feature.id,
      feature: feature.name,
      variety: feature.options[optionIndex],
      guildPlants: guildPlants,
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
  selectZone(selectedZoneId);
  renderPlan();
  renderPerspective();
})();
