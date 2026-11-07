(function () {
  "use strict";

  const storageKey = "terraforma-sample-plan";
  const siteBriefStorageKey = "terraforma-site-brief";
  const propertyProfileStorageKey = "terraforma-property-profile";
  const squareMetersPerAcre = 4046.8564224;
  const squareMetersPerHectare = 10000;
  const interfaceThemeStorageKey = "terraforma-interface-theme";
  const interfaceThemes = ["field", "coastal", "studio"];
  const landscapeStyles = ["", "naturalistic", "formal", "productive"];
  const speciesCardDismissDelay = 8000;
  const preflightCheckIds = ["boundary", "utilities", "well-septic", "water", "soil", "rules", "access"];
  const svgNamespace = "http://www.w3.org/2000/svg";
  const elements = {
    mapMarkers: document.getElementById("map-markers"),
    mapFrame: document.querySelector(".map-frame"),
    mapSvg: document.getElementById("site-map"),
    mapTitle: document.getElementById("map-title"),
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
    detailSpeciesTrigger: document.getElementById("detail-species-trigger"),
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
    speciesCardStatus: document.getElementById("species-card-status"),
    speciesCardFacts: document.getElementById("species-card-facts"),
    speciesCardCaveat: document.getElementById("species-card-caveat"),
    speciesCardSources: document.getElementById("species-card-sources"),
    speciesCardClose: document.getElementById("species-card-close"),
    rotationField: document.getElementById("rotation-field"),
    rotationDays: document.getElementById("rotation-days"),
    scheduleStartDate: document.getElementById("schedule-start-date"),
    planNote: document.getElementById("plan-note"),
    planForm: document.getElementById("plan-form"),
    formError: document.getElementById("form-error"),
    drawingToolbar: document.getElementById("drawing-toolbar"),
    drawingStatus: document.getElementById("drawing-status"),
    drawingShape: document.getElementById("drawing-shape"),
    drawingSnap: document.getElementById("drawing-snap"),
    drawingDimensions: document.getElementById("drawing-dimensions"),
    drawingWidthLabel: document.getElementById("drawing-width-label"),
    drawingWidth: document.getElementById("drawing-width"),
    drawingDepth: document.getElementById("drawing-depth"),
    drawingDepthLabel: document.getElementById("drawing-depth-label"),
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
    perspectiveProcessTitle: document.getElementById("perspective-process-title"),
    perspectiveProcess: document.getElementById("perspective-process"),
    perspectiveReferences: document.getElementById("perspective-references"),
    perspectiveIdeas: document.getElementById("perspective-ideas"),
    siteBriefForm: document.getElementById("site-brief-form"),
    siteBriefSave: document.getElementById("site-brief-save"),
    preflightChecks: document.getElementById("preflight-checks"),
    preflightCount: document.getElementById("preflight-count"),
    preflightProgress: document.getElementById("preflight-progress"),
    preflightSave: document.getElementById("preflight-save"),
    resetBrief: document.getElementById("reset-brief"),
    saveSiteBrief: document.getElementById("save-site-brief"),
    cancelSiteBrief: document.getElementById("cancel-site-brief"),
    briefDisclosure: document.getElementById("brief-disclosure"),
    briefDisclosureStatus: document.getElementById("brief-disclosure-status"),
    briefStorageNote: document.getElementById("brief-storage-note"),
    interfaceTheme: document.getElementById("interface-theme"),
    themeStatus: document.getElementById("theme-status"),
    propertyName: document.getElementById("property-name"),
    propertyLocation: document.getElementById("property-location"),
    propertyArea: document.getElementById("property-area"),
    areaNote: document.getElementById("area-note"),
    propertyProfileStatus: document.getElementById("property-profile-status"),
    propertyProfileDisclosure: document.getElementById("property-profile-disclosure"),
    propertyProfileForm: document.getElementById("property-profile-form"),
    profileName: document.getElementById("profile-name"),
    profileLocation: document.getElementById("profile-location"),
    profileArea: document.getElementById("profile-area"),
    profileAreaUnit: document.getElementById("profile-area-unit"),
    propertyProfileSaveState: document.getElementById("property-profile-save-state"),
    propertyProfileStatusMessage: document.getElementById("property-profile-status-message"),
    savePropertyProfile: document.getElementById("save-property-profile"),
    cancelPropertyProfile: document.getElementById("cancel-property-profile")
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
  let siteBriefStorageAvailable = true;
  let savedSiteBrief = null;
  let savedPropertyProfile = {
    name: PROPERTY.name,
    location: "",
    area: 2.4,
    areaUnit: "acres"
  };
  let propertyProfileIsSaved = false;
  let propertyAreaM2 = PROPERTY.areaM2;
  let propertyMapAreaM2PerUnit = PROPERTY.mapAreaM2PerUnit;
  let speciesCardTimer = null;
  let speciesCardAnchor = null;
  let pendingPlanItem = null;
  let drawingPoints = [];
  let keyboardCursor = { x: 320, y: 215 };
  let drawingShape = "freeform";

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
  document.getElementById("observation-count").textContent = PROPERTY.zones.length;
  elements.scheduleStartDate.value = localDateValue(new Date());

  function makeOption(label, value) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    return option;
  }

  function defaultPropertyProfile() {
    return {
      name: PROPERTY.name,
      location: "",
      area: 2.4,
      areaUnit: "acres"
    };
  }

  function areaInSquareMeters(profile) {
    return profile.area * (profile.areaUnit === "hectares"
      ? squareMetersPerHectare
      : squareMetersPerAcre);
  }

  function collectPropertyProfile() {
    return {
      name: elements.profileName.value.trim(),
      location: elements.profileLocation.value.trim(),
      area: Number(elements.profileArea.value),
      areaUnit: elements.profileAreaUnit.value
    };
  }

  function applyPropertyProfile(profile, isSaved) {
    propertyAreaM2 = areaInSquareMeters(profile);
    propertyMapAreaM2PerUnit = propertyAreaM2 / polygonArea(PROPERTY.mapBoundary);
    elements.propertyProfileStatusMessage.classList.remove("storage-error");
    elements.propertyName.textContent = profile.name;
    elements.mapTitle.textContent = "Illustrative map · " + profile.name;
    elements.propertyLocation.textContent = profile.location
      ? "User-entered general location · " + profile.location
      : isSaved ? "General location not recorded · map is illustrative" : PROPERTY.location;
    elements.propertyArea.textContent =
      new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(profile.area) +
      " " + profile.areaUnit + (isSaved ? " · estimate" : "");
    elements.areaNote.textContent = isSaved
      ? "User-entered area estimate. Map shape, terrain, and observation locations remain fictional; drawn feature sizes are approximate."
      : "Sample dashboard · " + PROPERTY.areaNote + ".";
    elements.propertyProfileStatus.textContent = isSaved
      ? "User-provided details · illustrative map"
      : "Fictional demo data";
    elements.profileName.value = profile.name;
    elements.profileLocation.value = profile.location;
    elements.profileArea.value = profile.area;
    elements.profileAreaUnit.value = profile.areaUnit;
    if (isSaved) {
      elements.propertyProfileSaveState.textContent = "Saved on this device";
      elements.propertyProfileStatusMessage.textContent = "Property details are saved only in this browser.";
    } else {
      elements.propertyProfileSaveState.textContent = "Using fictional sample details";
      elements.propertyProfileStatusMessage.textContent = "Details are stored only in this browser.";
    }
  }

  function readPropertyProfile() {
    savedPropertyProfile = defaultPropertyProfile();
    propertyProfileIsSaved = false;
    try {
      const saved = window.localStorage.getItem(propertyProfileStorageKey);
      if (saved === null) {
        applyPropertyProfile(savedPropertyProfile, false);
        return;
      }
      const parsed = JSON.parse(saved);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed) ||
          parsed.version !== 1 || typeof parsed.name !== "string" ||
          !parsed.name.trim() || parsed.name.length > 60 ||
          typeof parsed.location !== "string" || parsed.location.length > 100 ||
          !Number.isFinite(parsed.area) || parsed.area < 0.01 || parsed.area > 100000 ||
          !["acres", "hectares"].includes(parsed.areaUnit)) {
        throw new Error("The saved property details have an unexpected format.");
      }
      savedPropertyProfile = {
        name: parsed.name.trim(),
        location: parsed.location.trim(),
        area: parsed.area,
        areaUnit: parsed.areaUnit
      };
      propertyProfileIsSaved = true;
      applyPropertyProfile(savedPropertyProfile, true);
    } catch (error) {
      applyPropertyProfile(savedPropertyProfile, false);
      elements.propertyProfileDisclosure.open = true;
      elements.propertyProfileSaveState.textContent = "Saved details could not be read";
      elements.propertyProfileStatusMessage.textContent =
        "Could not load saved property details. The fictional sample is shown; saving will replace the unreadable entry.";
      elements.propertyProfileStatusMessage.classList.add("storage-error");
      console.error("TerraForma could not read the property profile:", error);
    }
  }

  function updatePropertyProfileDirtyState() {
    const changed = JSON.stringify(collectPropertyProfile()) !==
      JSON.stringify(savedPropertyProfile);
    elements.propertyProfileStatusMessage.textContent = changed
      ? "Unsaved changes. Save or cancel before leaving this section."
      : "No unsaved changes. Details are stored only in this browser.";
  }

  function savePropertyProfile() {
    if (!elements.propertyProfileForm.reportValidity()) return;
    const nextProfile = collectPropertyProfile();
    if (!nextProfile.name || !Number.isFinite(nextProfile.area) ||
        nextProfile.area < 0.01 || nextProfile.area > 100000 ||
        !["acres", "hectares"].includes(nextProfile.areaUnit)) {
      elements.propertyProfileStatusMessage.textContent =
        "Enter a property name and an area between 0.01 and 100,000 acres or hectares.";
      elements.propertyProfileStatusMessage.classList.add("storage-error");
      return;
    }
    try {
      window.localStorage.setItem(propertyProfileStorageKey, JSON.stringify({
        version: 1,
        name: nextProfile.name,
        location: nextProfile.location,
        area: nextProfile.area,
        areaUnit: nextProfile.areaUnit
      }));
      savedPropertyProfile = nextProfile;
      propertyProfileIsSaved = true;
      applyPropertyProfile(savedPropertyProfile, true);
      elements.propertyProfileDisclosure.open = false;
      renderPlan();
    } catch (error) {
      elements.propertyProfileStatusMessage.textContent =
        "Could not save property details in browser storage. Changes may be lost when you leave.";
      elements.propertyProfileStatusMessage.classList.add("storage-error");
      console.error("TerraForma could not save the property profile:", error);
    }
  }

  function cancelPropertyProfileChanges() {
    applyPropertyProfile(savedPropertyProfile, propertyProfileIsSaved);
    elements.propertyProfileStatusMessage.textContent = "Unsaved property changes canceled.";
    elements.propertyProfileDisclosure.open = false;
  }

  function blankSiteBrief() {
    const checks = {};
    preflightCheckIds.forEach(function (id) {
      checks[id] = { status: "open", note: "" };
    });
    return {
      version: 1,
      region: "",
      landscapeStyle: "",
      goals: [],
      time: "",
      budget: "",
      water: "",
      soil: "",
      notes: "",
      checks: checks
    };
  }

  function applySiteBrief(brief) {
    ["region", "time", "budget", "water", "soil"].forEach(function (key) {
      elements.siteBriefForm.elements.namedItem(key).value = brief[key];
    });
    elements.siteBriefForm.elements.namedItem("landscapeStyle").value = brief.landscapeStyle || "";
    elements.siteBriefForm.elements.namedItem("notes").value = brief.notes;
    elements.siteBriefForm.querySelectorAll('input[name="goals"]').forEach(function (input) {
      input.checked = brief.goals.includes(input.value);
    });
    preflightCheckIds.forEach(function (id) {
      elements.preflightChecks.querySelector('[data-check="' + id + '"]').value = brief.checks[id].status;
      elements.preflightChecks.querySelector('[data-check-note="' + id + '"]').value = brief.checks[id].note;
    });
    updatePreflightProgress();
  }

  function readSiteBrief() {
    try {
      const saved = window.localStorage.getItem(siteBriefStorageKey);
      if (saved === null) {
        savedSiteBrief = blankSiteBrief();
        applySiteBrief(savedSiteBrief);
        elements.siteBriefSave.textContent = "No saved brief yet. Changes are saved only when you choose Save.";
        elements.preflightSave.textContent = "No saved check statuses yet.";
        elements.briefDisclosureStatus.textContent = "No brief saved yet";
        return;
      }

      const parsed = JSON.parse(saved);
      const validSelections = {
        region: ["", "new-brunswick", "nova-scotia", "prince-edward-island", "newfoundland-and-labrador", "other"],
        time: ["", "under-2", "2-5", "6-10", "over-10", "seasonal"],
        budget: ["", "under-500", "500-2000", "2000-10000", "over-10000", "not-sure"],
        water: ["", "reliable", "seasonal", "none", "needs-review"],
        soil: ["", "current-test", "old-test", "untested", "concern"]
      };
      if (!parsed || parsed.version !== 1 || typeof parsed !== "object" || Array.isArray(parsed) ||
          !Object.keys(validSelections).every(function (key) {
            return validSelections[key].includes(parsed[key]);
          }) ||
          (parsed.landscapeStyle !== undefined && !landscapeStyles.includes(parsed.landscapeStyle)) ||
          !Array.isArray(parsed.goals) ||
          !parsed.goals.every(function (goal) {
            return ["vegetables", "fruit", "habitat", "water-soil", "lower-maintenance", "household-resilience"].includes(goal);
          }) ||
          typeof parsed.notes !== "string" || parsed.notes.length > 500 ||
          !parsed.checks || typeof parsed.checks !== "object" ||
          !preflightCheckIds.every(function (id) {
            const check = parsed.checks[id];
            return check && ["open", "reviewed", "na"].includes(check.status) &&
              typeof check.note === "string" && check.note.length <= 180;
          })) {
        throw new Error("The saved property brief has an unexpected format.");
      }

      savedSiteBrief = Object.assign(blankSiteBrief(), parsed, {
        landscapeStyle: parsed.landscapeStyle || ""
      });
      applySiteBrief(savedSiteBrief);
      elements.siteBriefSave.textContent = "Saved property brief loaded from this browser.";
      elements.preflightSave.textContent = "Saved check statuses loaded from this browser.";
      elements.briefDisclosureStatus.textContent = "Saved on this device";
    } catch (error) {
      siteBriefStorageAvailable = false;
      elements.siteBriefSave.textContent = "Could not load the saved property brief. The form is not saved; check browser storage before continuing.";
      elements.siteBriefSave.classList.add("storage-error");
      elements.preflightSave.textContent = "Could not load saved check statuses.";
      elements.preflightSave.classList.add("storage-error");
      elements.resetBrief.hidden = false;
      elements.briefDisclosure.open = true;
      console.error("TerraForma could not read the property brief:", error);
    }
    updatePreflightProgress();
  }

  function collectSiteBrief() {
    const formData = new FormData(elements.siteBriefForm);
    const checks = {};
    preflightCheckIds.forEach(function (id) {
      checks[id] = {
        status: elements.preflightChecks.querySelector('[data-check="' + id + '"]').value,
        note: elements.preflightChecks.querySelector('[data-check-note="' + id + '"]').value.trim()
      };
    });
    return {
      version: 1,
      region: formData.get("region"),
      landscapeStyle: formData.get("landscapeStyle") || "",
      goals: formData.getAll("goals"),
      time: formData.get("time"),
      budget: formData.get("budget"),
      water: formData.get("water"),
      soil: formData.get("soil"),
      notes: String(formData.get("notes") || "").trim(),
      checks: checks
    };
  }

  function updateSiteBriefDirtyState() {
    const isDirty = JSON.stringify(collectSiteBrief()) !== JSON.stringify(savedSiteBrief);
    elements.siteBriefSave.textContent = isDirty
      ? "Unsaved changes. Save or cancel before leaving this section."
      : "No unsaved changes. The saved brief stays in this browser.";
    elements.preflightSave.textContent = isDirty
      ? "Check edits are not saved yet."
      : "No unsaved check changes.";
    elements.briefStorageNote.textContent = isDirty
      ? "Unsaved changes"
      : "Your brief and checks stay in this browser.";
  }

  function saveSiteBrief() {
    updatePreflightProgress();
    if (!siteBriefStorageAvailable) {
      elements.siteBriefSave.textContent = "Could not save this brief in browser storage. Changes may be lost when you leave.";
      elements.preflightSave.textContent = "Could not save check statuses in browser storage.";
      elements.briefStorageNote.textContent = "Save failed; browser storage is unavailable.";
      elements.briefStorageNote.classList.add("storage-error");
      return;
    }
    try {
      const nextSiteBrief = collectSiteBrief();
      window.localStorage.setItem(siteBriefStorageKey, JSON.stringify(nextSiteBrief));
      savedSiteBrief = nextSiteBrief;
      elements.siteBriefSave.textContent = "Property brief saved only in this browser.";
      elements.preflightSave.textContent = "Check statuses saved only in this browser.";
      elements.briefStorageNote.textContent = "Saved on this device.";
      elements.briefStorageNote.classList.remove("storage-error");
      elements.siteBriefSave.classList.remove("storage-error");
      elements.preflightSave.classList.remove("storage-error");
      elements.briefDisclosureStatus.textContent = "Saved on this device";
      elements.briefDisclosure.open = false;
    } catch (error) {
      siteBriefStorageAvailable = false;
      elements.siteBriefSave.textContent = "Could not save this brief in browser storage. Changes may be lost when you leave.";
      elements.preflightSave.textContent = "Could not save check statuses in browser storage.";
      elements.briefStorageNote.textContent = "Save failed; browser storage is unavailable.";
      elements.briefStorageNote.classList.add("storage-error");
      elements.siteBriefSave.classList.add("storage-error");
      elements.preflightSave.classList.add("storage-error");
      console.error("TerraForma could not save the property brief:", error);
    }
  }

  function cancelSiteBriefChanges() {
    applySiteBrief(savedSiteBrief || blankSiteBrief());
    elements.siteBriefSave.textContent = "Unsaved changes canceled.";
    elements.preflightSave.textContent = "Unsaved check changes canceled.";
    elements.briefStorageNote.textContent = "Changes canceled.";
    elements.briefDisclosure.open = false;
  }

  function updatePreflightProgress() {
    const statuses = preflightCheckIds.map(function (id) {
      return elements.preflightChecks.querySelector('[data-check="' + id + '"]').value;
    });
    const reviewed = statuses.filter(function (status) { return status === "reviewed"; }).length;
    const notApplicable = statuses.filter(function (status) { return status === "na"; }).length;
    const addressed = reviewed + notApplicable;
    elements.preflightCount.textContent = addressed + " of " + preflightCheckIds.length +
      " statuses recorded (" + reviewed + " reviewed · " + notApplicable + " marked not applicable)";
    elements.preflightProgress.value = addressed;
    elements.preflightProgress.textContent = addressed + " of " + preflightCheckIds.length + " statuses recorded";
  }

  function resetUnreadableSiteBrief() {
    if (!window.confirm("The saved property brief could not be read. Forget that saved brief and start with a blank one?")) return;
    try {
      window.localStorage.removeItem(siteBriefStorageKey);
      siteBriefStorageAvailable = true;
      savedSiteBrief = blankSiteBrief();
      applySiteBrief(savedSiteBrief);
      elements.siteBriefSave.textContent = "Started a blank brief. Save it when ready.";
      elements.preflightSave.textContent = "No saved check statuses yet.";
      elements.briefDisclosureStatus.textContent = "No brief saved yet";
      elements.briefStorageNote.textContent = "Blank brief; not saved yet.";
      elements.siteBriefSave.classList.remove("storage-error");
      elements.preflightSave.classList.remove("storage-error");
      elements.briefStorageNote.classList.remove("storage-error");
      elements.resetBrief.hidden = true;
    } catch (error) {
      elements.siteBriefSave.textContent = "Could not remove the unreadable saved brief from browser storage.";
      elements.siteBriefSave.classList.add("storage-error");
      console.error("TerraForma could not reset the property brief:", error);
    }
  }

  function applyInterfaceTheme(theme) {
    document.body.dataset.theme = theme;
    elements.interfaceTheme.value = theme;
  }

  function readInterfaceTheme() {
    try {
      const savedTheme = window.localStorage.getItem(interfaceThemeStorageKey) || "field";
      if (!interfaceThemes.includes(savedTheme)) {
        throw new Error("The saved interface theme is not supported.");
      }
      applyInterfaceTheme(savedTheme);
      elements.themeStatus.textContent = "Theme preference is stored in this browser.";
    } catch (error) {
      applyInterfaceTheme("field");
      elements.themeStatus.textContent = "Could not load the saved theme; using Field journal.";
      elements.themeStatus.classList.add("storage-error");
      console.error("TerraForma could not read the interface theme:", error);
    }
  }

  function saveInterfaceTheme() {
    const theme = elements.interfaceTheme.value;
    if (!interfaceThemes.includes(theme)) {
      elements.themeStatus.textContent = "Choose one of the listed interface styles.";
      elements.themeStatus.classList.add("storage-error");
      return;
    }
    applyInterfaceTheme(theme);
    try {
      window.localStorage.setItem(interfaceThemeStorageKey, theme);
      elements.themeStatus.textContent = "Theme saved on this device.";
      elements.themeStatus.classList.remove("storage-error");
    } catch (error) {
      elements.themeStatus.textContent = "Theme changed for this visit but could not be saved in browser storage.";
      elements.themeStatus.classList.add("storage-error");
      console.error("TerraForma could not save the interface theme:", error);
    }
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
    closeSpeciesCard();
    elements.detailSelect.replaceChildren();
    elements.contentsOptions.replaceChildren();
    elements.guildOptions.replaceChildren();
    elements.contentsFieldset.hidden = !feature;
    elements.detailField.hidden = !feature;
    elements.detailSpeciesTrigger.hidden = true;
    elements.rotationField.hidden = !feature || !["garden-beds", "greenhouse"].includes(feature.id);
    elements.autoSelectNote.textContent = "";
    if (!feature) return;

    feature.options.forEach(function (option, index) {
      elements.detailSelect.appendChild(makeOption(option, String(index)));
    });

    elements.detailLabel.textContent = feature.id === "fruit-tree" ? "Tree type" :
      feature.id === "apple-guild" ? "Guild anchor" : "Primary setup";
    updateTreeTypeSpeciesTrigger(feature);
    elements.detailCaution.textContent = getDetailCaution(feature);
    renderFeatureContents(feature);
  }

  function updateTreeTypeSpeciesTrigger(feature) {
    if (!feature || feature.id !== "fruit-tree") return;
    const treeType = feature.options[Number(elements.detailSelect.value)] || "";
    let speciesOption = null;
    if (treeType.indexOf("Multi-grafted") === 0 || treeType.indexOf("Apple") === 0) {
      speciesOption = {
        name: "Apple (Malus domestica)",
        scientificName: "Malus domestica",
        profileId: "appleTree"
      };
    } else if (treeType.indexOf("Pear") === 0) {
      speciesOption = {
        name: "Pear (Pyrus communis)",
        scientificName: "Pyrus communis",
        profileId: "pear-layer"
      };
    } else if (treeType.indexOf("European plum") === 0) {
      speciesOption = {
        name: "European plum (Prunus domestica)",
        scientificName: "Prunus domestica",
        profileId: "plum-layer"
      };
    }
    elements.detailSpeciesTrigger.hidden = !speciesOption;
    elements.detailSpeciesTrigger.speciesOption = speciesOption;
    elements.detailSpeciesTrigger.textContent = speciesOption
      ? "Plant details: " + speciesOption.name
      : "";
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

  function clearSpeciesCardTimer() {
    if (speciesCardTimer !== null) {
      window.clearTimeout(speciesCardTimer);
      speciesCardTimer = null;
    }
  }

  function closeSpeciesCard() {
    clearSpeciesCardTimer();
    elements.speciesCard.hidden = true;
    speciesCardAnchor = null;
  }

  function speciesCardHasPointerOrFocus() {
    const activeElement = document.activeElement;
    return elements.speciesCard.matches(":hover") ||
      elements.speciesCard.contains(activeElement) ||
      Boolean(speciesCardAnchor && (
        speciesCardAnchor.matches(":hover") || speciesCardAnchor === activeElement
      ));
  }

  function scheduleSpeciesCardDismissal() {
    clearSpeciesCardTimer();
    speciesCardTimer = window.setTimeout(function checkSpeciesCardActivity() {
      if (elements.speciesCard.hidden) return;
      if (speciesCardHasPointerOrFocus()) {
        speciesCardTimer = window.setTimeout(checkSpeciesCardActivity, 1000);
        return;
      }
      closeSpeciesCard();
    }, speciesCardDismissDelay);
  }

  function bindSpeciesTrigger(button) {
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
    button.addEventListener("pointerenter", clearSpeciesCardTimer);
    button.addEventListener("pointerleave", scheduleSpeciesCardDismissal);
    button.addEventListener("blur", function () {
      window.setTimeout(scheduleSpeciesCardDismissal, 0);
    });
  }

  function showSpeciesCard(option, anchor) {
    clearSpeciesCardTimer();
    speciesCardAnchor = anchor;
    const optionProfile = option && option.profileId ? PLANT_PROFILES[option.profileId] : null;
    const profile = Object.assign({}, optionProfile || {}, option && option.profile || {}, option || {});
    const sourceIds = new Set(profile.sourceIds || []);
    if (profile.sourceId) sourceIds.add(profile.sourceId);
    if (Array.isArray(profile.facts)) {
      profile.facts.forEach(function (fact) {
        (fact.sourceIds || (fact.sourceId ? [fact.sourceId] : [])).forEach(function (id) {
          sourceIds.add(id);
        });
      });
    }
    const sources = Array.from(sourceIds).map(getSource).filter(Boolean);
    elements.speciesCardTitle.textContent = option && option.name ? option.name : "Plant information";
    elements.speciesCardScientific.textContent = profile.scientificName
      ? profile.scientificName
      : "";
    elements.speciesCardScientific.hidden = !elements.speciesCardScientific.textContent;
    elements.speciesCardFacts.replaceChildren();
    if (Array.isArray(profile.facts) && profile.facts.length) {
      const categories = new Map();
      profile.facts.forEach(function (fact) {
        const category = fact.category || fact.topic || "Source-verified notes";
        if (!categories.has(category)) categories.set(category, []);
        categories.get(category).push(fact);
      });
      categories.forEach(function (facts, category) {
        const section = document.createElement("section");
        const heading = document.createElement("h3");
        heading.textContent = category;
        const list = document.createElement("ul");
        facts.forEach(function (fact) {
          const item = document.createElement("li");
          item.textContent = typeof fact === "string" ? fact : fact.text;
          list.appendChild(item);
        });
        section.append(heading, list);
        elements.speciesCardFacts.appendChild(section);
      });
    } else {
      const facts = Array.isArray(profile.verifiedFacts) && profile.verifiedFacts.length
        ? profile.verifiedFacts
        : sources.length
          ? ["Listed as an example in the linked reference. This prototype has no verified species-care profile for this choice."]
          : ["No source-verified profile is available for this choice in this prototype."];
      const list = document.createElement("ul");
      facts.forEach(function (fact) {
        const item = document.createElement("li");
        item.textContent = fact;
        list.appendChild(item);
      });
      elements.speciesCardFacts.appendChild(list);
    }
    const gaps = Array.isArray(profile.unknowns) ? profile.unknowns : [];
    if (gaps.length) {
      const section = document.createElement("section");
      const heading = document.createElement("h3");
      heading.textContent = "Not established by these sources";
      const list = document.createElement("ul");
      gaps.forEach(function (gap) {
        const item = document.createElement("li");
        item.textContent = gap;
        list.appendChild(item);
      });
      section.append(heading, list);
      elements.speciesCardFacts.appendChild(section);
    }
    elements.speciesCardStatus.textContent = profile.profileStatus ||
      (profile.facts || profile.verifiedFacts ? "Source-backed notes; see scope limits below." :
        sources.length ? "Reference listed, but no species-care profile has been verified here." :
          "No source-verified profile available.");
    const role = profile.layerRole
      ? "Menu placement: " + profile.layerRole + ". This is a planning classification, not proof of local suitability."
      : "";
    const scope = profile.scopeNote || (profile.sourceId && profile.sourceId.indexOf("umn-") === 0
      ? "Regional limit: this reference is Minnesota-specific and should not be treated as Atlantic Canada guidance."
      : sources.length
        ? "The reference does not establish local suitability or companion compatibility."
        : "Do not treat this menu entry as a recommendation.");
    const warnings = Array.isArray(profile.warnings) ? profile.warnings : [];
    elements.speciesCardCaveat.textContent = [role, scope].concat(warnings).filter(Boolean).join(" ");
    elements.speciesCardSources.replaceChildren();
    sources.forEach(function (source) {
      const link = document.createElement("a");
      link.href = source.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = source.label;
      const note = document.createElement("span");
      note.textContent = " — " + source.note;
      const wrapper = document.createElement("p");
      wrapper.append(link, note);
      elements.speciesCardSources.appendChild(wrapper);
    });
    elements.speciesCard.hidden = false;
    scheduleSpeciesCardDismissal();
    requestAnimationFrame(function () { positionSpeciesCard(anchor); });
  }

  function createSpeciesTrigger(option, label) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "species-name-trigger";
    button.textContent = label;
    button.speciesOption = option;
    bindSpeciesTrigger(button);
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
      (fixer ? " Potential nitrogen-fixer function: " + fixer.name + "." : "") +
      " The function may overlap a physical layer; it is not an eighth layer." +
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
        ? "This menu uses one seven-layer forest-garden framework; other frameworks may group layers differently, and not every layer must be planted. A plant can occupy one physical layer and also have a separate function. Examples cite a framework, not local suitability or proven companion benefits."
        : feature.id === "rain-garden"
          ? "These are investigation prompts, not build dimensions or approval. The University of Maine source linked below is Maine-specific. Standing water alone does not establish that this site is suitable for a rain garden."
        : isCultivars
          ? "These cultivar notes come from a Minnesota source and are not an Atlantic Canada recommendation. Confirm local fit and graft compatibility."
          : isManualCultivar
            ? "No source-verified cultivar list is available here for this tree type. Enter a cultivar name from a trusted local source; the app will label it as user-provided."
          : "Pick the parts to include in this sample feature.";

    if (isGuild) {
      GUILD_LAYERS.forEach(function (layer) {
        const label = document.createElement("label");
        label.className = "guild-layer-label";
        const heading = document.createElement("span");
        heading.textContent = layer.name;
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
        const description = document.createElement("span");
        description.className = "guild-layer-description";
        description.textContent = layer.description;
        label.append(heading, select, description);
        elements.guildOptions.appendChild(label);
        elements.guildOptions.appendChild(info);
      });
      const nitrogenLabel = document.createElement("label");
      nitrogenLabel.className = "guild-layer-label";
      const nitrogenHeading = document.createElement("span");
      nitrogenHeading.textContent = "Optional cross-cutting function: potential nitrogen fixer";
      const nitrogenSelect = document.createElement("select");
      nitrogenSelect.id = "nitrogen-fixer-select";
      nitrogenSelect.appendChild(makeOption("Not selected", ""));
      NITROGEN_FIXERS.forEach(function (plant) {
        nitrogenSelect.appendChild(makeOption(plant.name, plant.id));
      });
      const nitrogenHelp = document.createElement("span");
      nitrogenHelp.className = "guild-layer-description";
      nitrogenHelp.textContent = "Not an eighth layer. A listed species can also be chosen in its physical layer above; selecting this role does not prove nitrogen reaches neighboring plants. Candidates need species-specific and local review.";
      nitrogenLabel.append(nitrogenHeading, nitrogenSelect, nitrogenHelp);
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
        const contentName = option.profileId || option.scientificName
          ? createSpeciesTrigger(option, option.name)
          : document.createElement("span");
        contentName.className = option.profileId || option.scientificName
          ? "species-name-trigger"
          : "contents-option-name";
        contentName.textContent = option.name;
        row.append(checkbox, contentName);
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
    if (feature.id === "rain-garden") {
      return "Do not infer suitability from the sample wet-area observation. Check runoff source, drainage, overflow, utilities, wells, septic areas, nearby foundations and tree roots with locally appropriate guidance; the cited rain-garden bulletin is Maine-specific.";
    }
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

  function autoSelectContents() {
    const exposure = elements.bedExposure.value;
    const wateringApplication = BED_WATERING_APPLICATIONS[elements.bedWatering.value];
    const matches = [];
    elements.contentsOptions.querySelectorAll('input[name="feature-content"]').forEach(function (input) {
      const plant = VEGETABLE_PLANTS.find(function (entry) { return entry.id === input.value; });
      const profile = plant && PLANT_PROFILES[plant.profileId];
      const matchesProfile = profile && profile.fit &&
        Array.isArray(profile.fit.exposure) && profile.fit.exposure.includes(exposure) &&
        Array.isArray(profile.fit.wateringApplication) &&
        profile.fit.wateringApplication.includes(wateringApplication);
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
      return total + polygonArea(item.polygon) * propertyMapAreaM2PerUnit;
    }, 0);
  }

  function updateCapacity() {
    const used = Math.round(usedAreaM2(planItems));
    const remaining = Math.max(0, propertyAreaM2 - used);
    const percent = Math.min(100, (used / propertyAreaM2) * 100);
    elements.capacitySummary.textContent = used > propertyAreaM2
      ? used.toLocaleString() + " m² planned · exceeds the entered area estimate by " +
        (used - Math.round(propertyAreaM2)).toLocaleString() + " m²"
      : used.toLocaleString() + " m² planned · " + remaining.toLocaleString() + " m² remaining";
    elements.capacityProgress.value = percent;
    elements.capacityProgress.textContent = Math.round(percent) + "%";
  }

  function svgElement(name, attributes) {
    const node = document.createElementNS(svgNamespace, name);
    Object.keys(attributes).forEach(function (key) { node.setAttribute(key, attributes[key]); });
    return node;
  }

  function mapUnitsPerMeter() {
    return 1 / Math.sqrt(propertyMapAreaM2PerUnit);
  }

  function snapMapPoint(point) {
    const gridMeters = Number(elements.drawingSnap.value);
    if (!gridMeters) return point;
    const gridUnits = gridMeters * mapUnitsPerMeter();
    return point.map(function (coordinate) {
      return Math.round(coordinate / gridUnits) * gridUnits;
    });
  }

  function specifiedDrawingDimensions() {
    const width = elements.drawingWidth.value === "" ? null : Number(elements.drawingWidth.value);
    const depth = elements.drawingDepth.value === "" ? null : Number(elements.drawingDepth.value);
    return {
      width: Number.isFinite(width) && width > 0 ? width : null,
      depth: Number.isFinite(depth) && depth > 0 ? depth : null
    };
  }

  function shapePolygon() {
    if (drawingShape === "freeform") return drawingPoints;
    if (!drawingPoints.length) return [];

    const anchor = drawingPoints[0];
    const endpoint = drawingPoints[1] || keyboardCursor;
    const dimensions = specifiedDrawingDimensions();
    const directionX = endpoint[0] < anchor[0] ? -1 : 1;
    const directionY = endpoint[1] < anchor[1] ? -1 : 1;
    let widthUnits = Math.abs(endpoint[0] - anchor[0]);
    let depthUnits = Math.abs(endpoint[1] - anchor[1]);

    if (dimensions.width !== null) widthUnits = dimensions.width * mapUnitsPerMeter();
    if (drawingShape === "square") {
      depthUnits = dimensions.width !== null
        ? widthUnits
        : Math.min(widthUnits, depthUnits);
    } else if (dimensions.depth !== null) {
      depthUnits = dimensions.depth * mapUnitsPerMeter();
    }

    return [
      anchor,
      [anchor[0] + directionX * widthUnits, anchor[1]],
      [anchor[0] + directionX * widthUnits, anchor[1] + directionY * depthUnits],
      [anchor[0], anchor[1] + directionY * depthUnits]
    ];
  }

  function syncDrawingControls() {
    const isRectangle = drawingShape === "rectangle";
    const isSquare = drawingShape === "square";
    elements.drawingDimensions.hidden = !isRectangle && !isSquare;
    elements.drawingDepthLabel.hidden = !isRectangle;
    elements.drawingWidthLabel.childNodes[0].textContent = isSquare ? "Side length (m) " : "Width (m) ";
  }

  function minimumDrawingPoints() {
    return drawingShape === "freeform" ? 3 : 2;
  }

  function updateDrawingStatus() {
    const needed = minimumDrawingPoints();
    elements.finishDrawing.disabled = drawingPoints.length < needed;
    if (drawingPoints.length) {
      elements.drawingStatus.textContent = drawingPoints.length + " of " + needed +
        " required point" + (needed === 1 ? "" : "s") + " placed. " +
        (drawingShape === "freeform"
          ? "Add outline points, undo, or finish."
          : "Place the opposite corner; adjust dimensions or snap settings if needed.");
    } else {
      elements.drawingStatus.textContent = drawingShape === "freeform"
        ? "Click or tap at least three points inside the boundary to outline this feature."
        : "Place the first corner inside the boundary, then the opposite corner. Optional dimensions set the scaled size.";
    }
  }

  function renderDraft() {
    const oldDraft = document.getElementById("drawing-preview");
    if (oldDraft) oldDraft.remove();
    if (!pendingPlanItem) return;

    const group = svgElement("g", { id: "drawing-preview", "aria-hidden": "true" });
    const draftPolygon = shapePolygon();
    if (drawingShape !== "freeform" && draftPolygon.length >= 3) {
      group.appendChild(svgElement("polygon", {
        points: draftPolygon.map(function (point) { return point.join(","); }).join(" "),
        class: "drawing-line"
      }));
    } else if (drawingPoints.length >= 2) {
      const tag = drawingPoints.length >= 3 ? "polygon" : "polyline";
      group.appendChild(svgElement(tag, {
        points: drawingPoints.map(function (point) { return point.join(","); }).join(" "),
        class: "drawing-line"
      }));
    }
    (drawingShape === "freeform" ? drawingPoints : drawingPoints.slice(0, 1)).forEach(function (point) {
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
        "aria-label": item.feature + ", " + Math.round(polygonArea(item.polygon) * propertyMapAreaM2PerUnit) + " approximate square metres; select to locate in plan",
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
      const bounds = item.polygon.reduce(function (result, point) {
        result.minX = Math.min(result.minX, point[0]);
        result.maxX = Math.max(result.maxX, point[0]);
        result.minY = Math.min(result.minY, point[1]);
        result.maxY = Math.max(result.maxY, point[1]);
        return result;
      }, { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity });
      const dimensions = item.shape && item.shape !== "freeform"
        ? " · about " +
          Math.round((bounds.maxX - bounds.minX) / mapUnitsPerMeter() * 10) / 10 + " × " +
          Math.round((bounds.maxY - bounds.minY) / mapUnitsPerMeter() * 10) / 10 + " m"
        : "";
      location.textContent = item.location + " · about " +
        Math.round(polygonArea(item.polygon) * propertyMapAreaM2PerUnit) + " m²" + dimensions;
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
          role.textContent = "Potential nitrogen-fixer function: " + fixer.name +
            ". This is a functional label, not an eighth layer or a guarantee of nitrogen transfer to neighboring plants.";
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
          scheduleStartDate: typeof item.scheduleStartDate === "string" ? item.scheduleStartDate : "",
          shape: ["freeform", "rectangle", "square"].includes(item.shape) ? item.shape : "freeform"
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
    elements.perspectiveProcessTitle.textContent = perspective.processTitle;
    elements.perspectiveProcess.replaceChildren();
    perspective.process.forEach(function (step) {
      const item = document.createElement("li");
      item.textContent = step;
      elements.perspectiveProcess.appendChild(item);
    });
    elements.perspectiveReferences.replaceChildren();
    perspective.references.forEach(function (referenceId) {
      const reference = PERSPECTIVE_REFERENCES.find(function (entry) {
        return entry.id === referenceId;
      });
      if (!reference) {
        const missing = document.createElement("p");
        missing.textContent = "Reference unavailable: " + referenceId;
        elements.perspectiveReferences.appendChild(missing);
        return;
      }
      const paragraph = document.createElement("p");
      const link = document.createElement("a");
      link.href = reference.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = reference.label;
      const note = document.createElement("span");
      note.textContent = " — " + reference.note;
      paragraph.append(link, note);
      elements.perspectiveReferences.appendChild(paragraph);
    });
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
    drawingShape = elements.drawingShape.value;
    keyboardCursor = { x: 320, y: 215 };
    elements.drawingToolbar.hidden = false;
    syncDrawingControls();
    updateDrawingStatus();
    elements.drawingStatus.textContent += " Drawing " + item.feature +
      ". The rough catalogue footprint is " +
      getCatalogItem(item.featureId).defaultAreaM2 + " m²; the saved estimate comes from your drawing.";
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
    return snapMapPoint([
      Math.max(0, Math.min(640, (event.clientX - rectangle.left - offsetX) / scale)),
      Math.max(0, Math.min(430, (event.clientY - rectangle.top - offsetY) / scale))
    ]);
  }

  function addDrawingPoint(point) {
    if (!pendingPlanItem) return;
    if (drawingShape !== "freeform" && drawingPoints.length >= 2) {
      elements.drawingStatus.textContent = "Both corners are set. Finish the area or undo the second corner to redraw it.";
      return;
    }
    drawingPoints.push(snapMapPoint(point));
    updateDrawingStatus();
    renderDraft();
  }

  function validateDrawing(points) {
    if (drawingShape !== "freeform" && elements.drawingWidth.value &&
        !elements.drawingWidth.checkValidity()) {
      return "Enter a width between 1 and 500 metres, or leave it blank to draw the size.";
    }
    if (drawingShape === "rectangle" && elements.drawingDepth.value &&
        !elements.drawingDepth.checkValidity()) {
      return "Enter a depth between 1 and 500 metres, or leave it blank to draw the size.";
    }
    if (points.length < minimumDrawingPoints()) {
      return drawingShape === "freeform"
        ? "Add at least three points to outline an area."
        : "Place both corners of the shape.";
    }
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
    const estimate = polygonArea(points) * propertyMapAreaM2PerUnit;
    if (usedAreaM2(planItems) + estimate > propertyAreaM2) {
      return "This area would exceed the sample property's illustrative remaining capacity.";
    }
    return "";
  }

  function finishDrawing() {
    if (!pendingPlanItem) return;
    const finalPoints = shapePolygon();
    const error = validateDrawing(finalPoints);
    if (error) {
      elements.drawingStatus.textContent = error;
      return;
    }
    const zone = nearestZone(finalPoints);
    const savedItem = Object.assign({}, pendingPlanItem, {
      location: "Near " + zone.label,
      note: pendingPlanItem.note || "A starting idea to research and adapt to the actual site.",
      polygon: finalPoints.map(function (point) { return point.slice(); }),
      shape: drawingShape,
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
    updateTreeTypeSpeciesTrigger(feature);
    renderFeatureContents(feature);
    elements.detailCaution.textContent = getDetailCaution(feature);
  });
  bindSpeciesTrigger(elements.detailSpeciesTrigger);
  elements.autoSelect.addEventListener("click", autoSelectContents);
  elements.speciesCardClose.addEventListener("click", closeSpeciesCard);
  elements.speciesCard.addEventListener("pointerenter", clearSpeciesCardTimer);
  elements.speciesCard.addEventListener("pointerleave", scheduleSpeciesCardDismissal);
  elements.speciesCard.addEventListener("focusin", clearSpeciesCardTimer);
  elements.speciesCard.addEventListener("focusout", function () {
    window.setTimeout(scheduleSpeciesCardDismissal, 0);
  });
  document.addEventListener("pointerdown", function (event) {
    if (!elements.speciesCard.contains(event.target) &&
        !(event.target.closest && event.target.closest(".species-name-trigger"))) {
      closeSpeciesCard();
    }
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !elements.speciesCard.hidden) {
      closeSpeciesCard();
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
  elements.mapFrame.addEventListener("pointermove", function (event) {
    if (!pendingPlanItem) return;
    const pointer = pointerToMapPoint(event);
    keyboardCursor = { x: pointer[0], y: pointer[1] };
    if (drawingShape !== "freeform" && drawingPoints.length < 2) renderDraft();
  });
  elements.drawingShape.addEventListener("change", function () {
    drawingShape = elements.drawingShape.value;
    drawingPoints = [];
    syncDrawingControls();
    updateDrawingStatus();
    renderDraft();
  });
  elements.drawingSnap.addEventListener("change", function () {
    const snappedCursor = snapMapPoint([keyboardCursor.x, keyboardCursor.y]);
    keyboardCursor = { x: snappedCursor[0], y: snappedCursor[1] };
    renderDraft();
  });
  elements.drawingWidth.addEventListener("input", renderDraft);
  elements.drawingDepth.addEventListener("input", renderDraft);
  elements.mapSvg.addEventListener("keydown", function (event) {
    if (!pendingPlanItem) return;
    const gridMeters = Number(elements.drawingSnap.value);
    const step = gridMeters ? gridMeters * mapUnitsPerMeter() :
      event.shiftKey ? 20 : 8;
    const directions = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step]
    };
    if (directions[event.key]) {
      event.preventDefault();
      const snappedCursor = snapMapPoint([
        Math.max(0, Math.min(640, keyboardCursor.x + directions[event.key][0])),
        Math.max(0, Math.min(430, keyboardCursor.y + directions[event.key][1]))
      ]);
      keyboardCursor = { x: snappedCursor[0], y: snappedCursor[1] };
      renderDraft();
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      addDrawingPoint([keyboardCursor.x, keyboardCursor.y]);
    }
  });
  elements.undoPoint.addEventListener("click", function () {
    drawingPoints.pop();
    updateDrawingStatus();
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

  elements.siteBriefForm.addEventListener("submit", function (event) {
    event.preventDefault();
  });
  elements.propertyProfileForm.addEventListener("submit", function (event) {
    event.preventDefault();
    savePropertyProfile();
  });
  elements.propertyProfileForm.addEventListener("input", updatePropertyProfileDirtyState);
  elements.propertyProfileForm.addEventListener("change", updatePropertyProfileDirtyState);
  elements.savePropertyProfile.addEventListener("click", savePropertyProfile);
  elements.cancelPropertyProfile.addEventListener("click", cancelPropertyProfileChanges);
  elements.siteBriefForm.addEventListener("input", updateSiteBriefDirtyState);
  elements.siteBriefForm.addEventListener("change", updateSiteBriefDirtyState);
  elements.preflightChecks.addEventListener("input", updateSiteBriefDirtyState);
  elements.preflightChecks.addEventListener("change", updateSiteBriefDirtyState);
  elements.saveSiteBrief.addEventListener("click", saveSiteBrief);
  elements.cancelSiteBrief.addEventListener("click", cancelSiteBriefChanges);
  elements.resetBrief.addEventListener("click", resetUnreadableSiteBrief);
  elements.interfaceTheme.addEventListener("change", saveInterfaceTheme);

  readSavedPlan();
  readPropertyProfile();
  readInterfaceTheme();
  readSiteBrief();
  updatePreflightProgress();
  populateFeatureOptions();
  renderReferenceList();
  selectZone(selectedZoneId);
  renderPlan();
  renderPerspective();
})();
