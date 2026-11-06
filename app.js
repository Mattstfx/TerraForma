(function () {
  "use strict";

  const storageKey = "terraforma-sample-plan";
  const elements = {
    mapMarkers: document.getElementById("map-markers"),
    zonePicker: document.getElementById("zone-picker"),
    planList: document.getElementById("plan-list"),
    planCount: document.getElementById("plan-count"),
    planTotal: document.getElementById("plan-total"),
    storageMessage: document.getElementById("storage-message"),
    featureSelect: document.getElementById("feature-select"),
    locationSelect: document.getElementById("location-select"),
    planForm: document.getElementById("plan-form")
  };

  let selectedZoneId = PROPERTY.zones[0].id;
  let planItems = PROPERTY.initialPlan.slice();
  let storageAvailable = true;

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

  PROPOSED_FEATURES.forEach(function (feature) {
    elements.featureSelect.appendChild(makeOption(feature, feature));
  });

  PROPERTY.zones.forEach(function (zone) {
    elements.locationSelect.appendChild(makeOption(zone.label, zone.label));
  });

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

    const locationCounts = {};
    planItems.forEach(function (item) {
      locationCounts[item.location] = (locationCounts[item.location] || 0) + 1;
    });

    PROPERTY.zones.forEach(function (zone, index) {
      const count = locationCounts[zone.label];
      if (!count) return;
      const marker = document.createElement("span");
      marker.className = "plan-marker";
      marker.style.left = Math.min(zone.x + 5 + index, 91) + "%";
      marker.style.top = Math.max(zone.y - 7 - index, 8) + "%";
      marker.textContent = "+" + count;
      marker.setAttribute("aria-label", count + (count === 1 ? " planned feature" : " planned features") + " near " + zone.label);
      elements.mapMarkers.appendChild(marker);
    });
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
      planItems = parsed;
    } catch (error) {
      storageAvailable = false;
      elements.storageMessage.textContent = "Could not load this browser's saved plan. The sample plan is shown instead.";
      elements.storageMessage.classList.add("storage-error");
      console.error("TerraForma could not read the saved plan:", error);
    }
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

  function renderPlan() {
    elements.planList.replaceChildren();
    document.getElementById("plan-count").textContent = planItems.length;
    elements.planTotal.textContent = planItems.length + (planItems.length === 1 ? " idea" : " ideas");

    if (planItems.length === 0) {
      const empty = document.createElement("p");
      empty.className = "empty-plan";
      empty.textContent = "No planning ideas yet. Add one to start shaping this sample property.";
      elements.planList.appendChild(empty);
    }

    planItems.forEach(function (item) {
      const article = document.createElement("article");
      article.className = "plan-item";

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
      location.textContent = item.location;
      const note = document.createElement("p");
      note.className = "plan-note";
      note.textContent = item.note;
      content.append(title, location, note);

      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.className = "remove-button";
      removeButton.textContent = "Remove";
      removeButton.setAttribute("aria-label", "Remove " + item.feature + " from the plan");
      removeButton.addEventListener("click", function () {
        planItems = planItems.filter(function (planItem) { return planItem.id !== item.id; });
        savePlan();
        renderPlan();
        renderMapMarkers();
      });

      article.append(icon, content, removeButton);
      elements.planList.appendChild(article);
    });

    renderMapMarkers();
  }

  elements.planForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const feature = elements.featureSelect.value;
    const location = elements.locationSelect.value;
    if (PROPOSED_FEATURES.indexOf(feature) === -1 ||
        !PROPERTY.zones.some(function (zone) { return zone.label === location; })) {
      return;
    }

    planItems.push({
      id: "plan-" + Date.now(),
      feature: feature,
      location: location,
      note: "A starting idea to research and adapt to the actual site."
    });
    savePlan();
    renderPlan();
  });

  readSavedPlan();
  selectZone(selectedZoneId);
  renderPlan();
})();
