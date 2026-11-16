(function () {
  "use strict";

  const activeProjectStorageKey = "terraforma-active-project";
  const projectStorageKeys = {
    "cedar-ridge": {
      plan: "terraforma-sample-plan",
      brief: "terraforma-site-brief",
      profile: "terraforma-property-profile",
      boundary: "terraforma-property-boundary"
    },
    "waverley-terrain-demo": {
      plan: "terraforma-waverley-plan",
      brief: "terraforma-waverley-site-brief",
      profile: "terraforma-waverley-profile",
      boundary: "terraforma-waverley-boundary"
    }
  };
  const squareMetersPerAcre = 4046.8564224;
  const squareMetersPerHectare = 10000;
  const interfaceThemeStorageKey = "terraforma-interface-theme";
  const perspectiveStorageKey = "terraforma-planning-perspective";
  const workspaceLayouts = {
    permaculture: {
      label: "Observe & connect",
      description: "Site brief and design relationships first, followed by the map and plan.",
      sections: ["site-brief", "perspectives", "property", "plan"]
    },
    landscape: {
      label: "Map studio",
      description: "Map and planning tools side by side, with design ideas and the brief below.",
      sections: ["property", "plan", "perspectives", "site-brief"]
    },
    homestead: {
      label: "Action desk",
      description: "Planning ideas and mapped features first, followed by the map and household brief.",
      sections: ["plan", "property", "site-brief", "perspectives"]
    }
  };
  const interfaceThemes = ["field", "coastal", "studio"];
  const landscapeStyles = ["", "naturalistic", "formal", "productive"];
  const speciesCardDismissDelay = 8000;
  const preflightCheckIds = ["boundary", "utilities", "well-septic", "water", "soil", "rules", "access"];
  const maxBedPlantingCandidates = 2000;
  const svgNamespace = "http://www.w3.org/2000/svg";
  const terrainServiceUrl = "https://datacube.services.geo.ca/ows/elevation";
  const terrainDemoBounds = "44.797825,-63.63956,44.802175,-63.63044";
  const provincialServiceUrl = "https://nsgiwa.novascotia.ca/arcgis/rest/services/BASE/";
  const provincialBounds = { west: -63.63956, south: 44.797825, east: -63.63044, north: 44.802175 };
  const terrainLayerDetails = {
    "dtm-hillshade": {
      label: "Bare-earth terrain hillshade",
      description: "Natural Resources Canada HRDEM bare-earth terrain hillshade for the Waverley-area test window."
    },
    dtm: {
      label: "Bare-earth elevation colors",
      style: "elevation_color",
      legend: "https://datacube.services.geo.ca/assets/legend/legend_elevation_color.png",
      description: "Natural Resources Canada HRDEM bare-earth elevation color layer for the Waverley-area test window."
    },
    "dtm-slope": {
      label: "Bare-earth slope (grayscale)",
      layer: "dtm-slope",
      style: "slope_grey",
      legend: "https://datacube.services.geo.ca/assets/legend/legend_elevation_slope_grey.png",
      description: "Natural Resources Canada HRDEM bare-earth slope layer for the Waverley-area test window."
    },
    "dtm-slope-color": {
      label: "Bare-earth slope (color)",
      layer: "dtm-slope",
      style: "slope_color",
      legend: "https://datacube.services.geo.ca/assets/legend/legend_elevation_slope_color.png",
      description: "Natural Resources Canada HRDEM bare-earth slope layer for the Waverley-area test window."
    },
    "dsm-hillshade": {
      label: "Surface hillshade",
      description: "Natural Resources Canada HRDEM surface hillshade for the Waverley-area test window, including mapped trees and structures where available."
    }
  };
  const elements = {
    mapMarkers: document.getElementById("map-markers"),
    mapFrame: document.querySelector(".map-frame"),
    propertyGrid: document.querySelector(".property-grid"),
    mapSvg: document.getElementById("site-map"),
    mapTitle: document.getElementById("map-title"),
    mapDescription: document.getElementById("map-description"),
    mapContext: document.getElementById("map-context"),
    mapSectionHint: document.getElementById("map-section-hint"),
    mapZoomIn: document.getElementById("map-zoom-in"),
    mapZoomOut: document.getElementById("map-zoom-out"),
    mapZoomReset: document.getElementById("map-zoom-reset"),
    mapZoomLevel: document.getElementById("map-zoom-level"),
    mapPanToggle: document.getElementById("map-pan-toggle"),
    undoPlan: document.getElementById("undo-plan"),
    mapNavigationHint: document.getElementById("map-navigation-hint"),
    footprintEditor: document.getElementById("footprint-editor"),
    footprintEditorName: document.getElementById("footprint-editor-name"),
    footprintShape: document.getElementById("footprint-shape"),
    footprintWidth: document.getElementById("footprint-width"),
    footprintDepth: document.getElementById("footprint-depth"),
    footprintRotation: document.getElementById("footprint-rotation"),
    applyFootprintEdits: document.getElementById("apply-footprint-edits"),
    clearFootprintSelection: document.getElementById("clear-footprint-selection"),
    footprintEditorStatus: document.getElementById("footprint-editor-status"),
    gardenEditor: document.getElementById("garden-editor"),
    gardenFenceSections: document.getElementById("garden-fence-sections"),
    gardenEditorStatus: document.getElementById("garden-editor-status"),
    gardenAddBed: document.getElementById("garden-add-bed"),
    gardenBedList: document.getElementById("garden-bed-list"),
    gardenTarget: document.getElementById("garden-target"),
    gardenTargetLabel: document.getElementById("garden-target-label"),
    clearGardenTarget: document.getElementById("clear-garden-target"),
    bedPlantingEditor: document.getElementById("bed-planting-editor"),
    bedPlantSpecies: document.getElementById("bed-plant-species"),
    bedPlantCultivar: document.getElementById("bed-plant-cultivar"),
    bedPlantRowSpacing: document.getElementById("bed-plant-row-spacing"),
    bedPlantInRowSpacing: document.getElementById("bed-plant-in-row-spacing"),
    bedPlantMethod: document.getElementById("bed-plant-method"),
    bedPlantDate: document.getElementById("bed-plant-date"),
    bedPlantSource: document.getElementById("bed-plant-source"),
    previewBedPlantingSpots: document.getElementById("preview-bed-planting-spots"),
    stopBedPlanting: document.getElementById("stop-bed-planting"),
    bedPlantingStatus: document.getElementById("bed-planting-status"),
    bedPlantingGridPanel: document.getElementById("bed-planting-grid-panel"),
    bedPlantingGrid: document.getElementById("bed-planting-grid"),
    bedPlantingsList: document.getElementById("bed-plantings-list"),
    mapLegend: document.getElementById("map-legend"),
    mapFooterLegend: document.getElementById("map-footer-legend"),
    mapScaleNote: document.getElementById("map-scale-note"),
    terrainLayer: document.getElementById("terrain-layer"),
    terrainOverlays: document.getElementById("terrain-overlays"),
    showContours: document.getElementById("show-contours"),
    showMappedWater: document.getElementById("show-mapped-water"),
    showProposedWater: document.getElementById("show-proposed-water"),
    contourOverlay: document.getElementById("contour-overlay"),
    mappedWaterOverlay: document.getElementById("mapped-water-overlay"),
    contourStatus: document.getElementById("contour-status"),
    mappedWaterStatus: document.getElementById("mapped-water-status"),
    terrainRaster: document.getElementById("terrain-raster"),
    terrainReliefOverlay: document.getElementById("terrain-relief-overlay"),
    terrainStatus: document.getElementById("terrain-status"),
    terrainSource: document.getElementById("terrain-source"),
    terrainLegend: document.getElementById("terrain-legend"),
    terrainLegendImage: document.getElementById("terrain-legend-image"),
    propertyBoundary: document.getElementById("property-boundary"),
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
    featureNotePanel: document.getElementById("feature-note-panel"),
    featureNoteTitle: document.getElementById("feature-note-title"),
    featureNoteEdit: document.getElementById("feature-note-edit"),
    featureNoteSave: document.getElementById("feature-note-save"),
    featureNoteCancel: document.getElementById("feature-note-cancel"),
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
    editBoundary: document.getElementById("edit-boundary"),
    saveBoundary: document.getElementById("save-boundary"),
    cancelBoundary: document.getElementById("cancel-boundary"),
    boundaryEditorStatus: document.getElementById("boundary-editor-status"),
    boundaryEditorNote: document.getElementById("boundary-editor-note"),
    observationPanel: document.getElementById("observation-panel"),
    capacitySummary: document.getElementById("capacity-summary"),
    capacityProgress: document.getElementById("capacity-progress"),
    perspectiveTabs: document.getElementById("perspective-tabs"),
    workspaceTabs: document.getElementById("workspace-tabs"),
    workspaceStatus: document.getElementById("workspace-status"),
    perspectiveSwitchStatus: document.getElementById("perspective-switch-status"),
    planningWorkspace: document.getElementById("planning-workspace"),
    featurePriorityNote: document.getElementById("feature-priority-note"),
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
    propertyProfileCaveat: document.getElementById("property-profile-caveat"),
    propertyProfileDisclosure: document.getElementById("property-profile-disclosure"),
    propertyProfileForm: document.getElementById("property-profile-form"),
    profileName: document.getElementById("profile-name"),
    profileLocation: document.getElementById("profile-location"),
    profileArea: document.getElementById("profile-area"),
    profileAreaUnit: document.getElementById("profile-area-unit"),
    propertyProfileSaveState: document.getElementById("property-profile-save-state"),
    propertyProfileStatusMessage: document.getElementById("property-profile-status-message"),
    propertyWorkspace: document.getElementById("property-workspace"),
    propertyWorkspaceStatus: document.getElementById("property-workspace-status"),
    savePropertyProfile: document.getElementById("save-property-profile"),
    cancelPropertyProfile: document.getElementById("cancel-property-profile")
  };

  let activeProjectId = "waverley-terrain-demo";
  try {
    const savedProjectId = window.localStorage.getItem(activeProjectStorageKey);
    if (savedProjectId && projectStorageKeys[savedProjectId]) activeProjectId = savedProjectId;
  } catch (error) {
    console.error("TerraForma could not read the active property workspace:", error);
  }
  const ACTIVE_PROPERTY = activeProjectId === "waverley-terrain-demo"
    ? TERRAIN_DEMO_PROPERTY
    : PROPERTY;

  function currentStorageKey(type) {
    return projectStorageKeys[activeProjectId][type];
  }

  function canEditCurrentMap() {
    return activeProjectId === "waverley-terrain-demo"
      ? activeMapView !== "illustrative"
      : activeMapView === "illustrative";
  }

  function terrainDemoMapAreaM2PerUnit() {
    const bounds = terrainDemoBounds.split(",").map(Number);
    const widthMeters = (bounds[3] - bounds[1]) * 111320 * Math.cos((bounds[0] + bounds[2]) / 2 * Math.PI / 180);
    const heightMeters = (bounds[2] - bounds[0]) * 111320;
    return (widthMeters / 640) * (heightMeters / 430);
  }

  function clonePlanItems(items) {
    return items.map(function (item) {
      return Object.assign({}, item, {
        polygon: item.polygon.map(function (point) { return point.slice(); }),
        guildPlants: (item.guildPlants || []).slice(),
        plantings: Array.isArray(item.plantings) ? item.plantings.map(function (plant) {
          return Object.assign({}, plant, {
            position: Array.isArray(plant.position) ? plant.position.slice() : []
          });
        }) : [],
        fenceSections: Array.isArray(item.fenceSections) ? item.fenceSections.slice() : [],
        rotationDegrees: Number.isFinite(item.rotationDegrees) ? item.rotationDegrees : 0
      });
    });
  }

  let selectedZoneId = ACTIVE_PROPERTY.zones.length ? ACTIVE_PROPERTY.zones[0].id : null;
  let selectedPerspectiveId = DESIGN_PERSPECTIVES[0].id;
  let selectedPlanId = null;
  let planItems = clonePlanItems(ACTIVE_PROPERTY.initialPlan);
  let undoStack = [];
  let redoStack = [];
  let storageAvailable = true;
  let siteBriefStorageAvailable = true;
  let savedSiteBrief = null;
  let savedPropertyProfile = {
    name: ACTIVE_PROPERTY.name,
    location: ACTIVE_PROPERTY.id === "waverley-terrain-demo" ? ACTIVE_PROPERTY.location : "",
    area: ACTIVE_PROPERTY.area || 2.4,
    areaUnit: ACTIVE_PROPERTY.areaUnit || "acres"
  };
  let propertyProfileIsSaved = false;
  let propertyAreaM2 = ACTIVE_PROPERTY.areaM2 || ACTIVE_PROPERTY.area * squareMetersPerAcre;
  let propertyBoundary = ACTIVE_PROPERTY.mapBoundary.map(function (point) { return point.slice(); });
  let propertyMapAreaM2PerUnit = activeProjectId === "waverley-terrain-demo"
    ? terrainDemoMapAreaM2PerUnit()
    : ACTIVE_PROPERTY.mapAreaM2PerUnit;
  let speciesCardTimer = null;
  let speciesCardAnchor = null;
  let pendingPlanItem = null;
  let gardenTargetId = null;
  let drawingPoints = [];
  let boundaryEditing = false;
  let boundaryPoints = [];
  let keyboardCursor = { x: 320, y: 215 };
  let drawingShape = "freeform";
  let activeMapView = activeProjectId === "waverley-terrain-demo" ? "dtm-hillshade" : "illustrative";
  let contourRequestVersion = 0;
  let waterRequestVersion = 0;
  let mapViewBox = { x: 0, y: 0, width: 640, height: 430 };
  let mapPanActive = false;
  let mapPanDrag = null;
  const mapTouchPointers = new Map();
  let mapPinch = null;
  let suppressMapClickUntil = 0;
  let footprintDrag = null;
  let bedPlantingConfig = null;
  let bedPlantingCandidates = [];
  let bedPlantingGridDimensions = { rowCount: 0, plantCount: 0 };

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
  document.getElementById("observation-count").textContent = ACTIVE_PROPERTY.zones.length;
  elements.scheduleStartDate.value = localDateValue(new Date());

  function makeOption(label, value) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    return option;
  }

  function defaultPropertyProfile() {
    return {
      name: ACTIVE_PROPERTY.name,
      location: ACTIVE_PROPERTY.id === "waverley-terrain-demo" ? ACTIVE_PROPERTY.location : "",
      area: ACTIVE_PROPERTY.area || 2.4,
      areaUnit: ACTIVE_PROPERTY.areaUnit || "acres"
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
    if (activeProjectId === "cedar-ridge" && propertyBoundary.length >= 3) {
      propertyMapAreaM2PerUnit = propertyAreaM2 / polygonArea(propertyBoundary);
    }
    elements.propertyProfileStatusMessage.classList.remove("storage-error");
    elements.propertyName.textContent = profile.name;
    if (activeMapView === "illustrative") {
      elements.mapTitle.textContent = "Illustrative map · " + profile.name;
    }
    elements.propertyArea.textContent =
      new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(profile.area) +
      " " + profile.areaUnit + (isSaved ? " · estimate" : "");
    elements.profileName.value = profile.name;
    elements.profileLocation.value = profile.location;
    elements.profileArea.value = profile.area;
    elements.profileAreaUnit.value = profile.areaUnit;
    updatePropertyMapCaveat(profile, isSaved);
    if (isSaved) {
      elements.propertyProfileSaveState.textContent = "Saved on this device";
      elements.propertyProfileStatusMessage.textContent = "Property details are saved only in this browser.";
    } else {
      elements.propertyProfileSaveState.textContent = "Using fictional sample details";
      elements.propertyProfileStatusMessage.textContent = "Details are stored only in this browser.";
    }
  }

  function updatePropertyMapCaveat(profile, isSaved) {
    const terrainView = activeMapView !== "illustrative";
    const terrainLabel = activeProjectId === "waverley-terrain-demo"
      ? "Waverley-area test map"
      : "Waverley-area regional preview";
    elements.propertyLocation.textContent = activeProjectId === "waverley-terrain-demo"
      ? "Synthetic demo property · " + ACTIVE_PROPERTY.location
      : profile.location
      ? "User-entered general location · " + profile.location +
        (terrainView ? " · terrain preview remains a fixed " + terrainLabel : "")
      : terrainView
        ? "Fixed " + terrainLabel + " · not linked to this property's location"
        : isSaved ? "General location not recorded · map is illustrative" : ACTIVE_PROPERTY.location;
    elements.areaNote.textContent = terrainView
      ? activeProjectId === "waverley-terrain-demo"
        ? "Synthetic test workspace. Draw the parcel outline to place features; starting area is an estimate, not a surveyed or calculated parcel size."
        : "User-entered area estimate. Real regional elevation data is previewed from " + terrainLabel +
          "; the property boundary and plans are not georeferenced to that area."
      : isSaved
        ? "User-entered area estimate. Map shape, terrain, and observation locations remain fictional; drawn feature sizes are approximate."
        : "Sample dashboard · " + ACTIVE_PROPERTY.areaNote + ".";
    elements.propertyProfileStatus.textContent = isSaved
      ? terrainView
        ? "User-provided details · regional terrain preview separate"
        : "User-provided details · illustrative map"
      : activeProjectId === "waverley-terrain-demo"
        ? "Synthetic test property · real terrain"
        : "Fictional demo data";
    elements.propertyProfileCaveat.textContent = activeProjectId === "waverley-terrain-demo"
      ? "The Waverley terrain is real regional elevation data, but this test property and any drawn outline are synthetic unless you replace them with a location you are authorized to use. It does not show ownership or grant access. Do not enter a street address."
      : "These are user-entered planning details only. The map boundary, terrain, and observation locations remain fictional and are not tied to your real parcel. Do not enter a street address.";
  }

  function terrainMapUrl(layer) {
    const details = terrainLayerDetails[layer];
    if (!details) return "";
    const parameters = new URLSearchParams({
      SERVICE: "WMS",
      VERSION: "1.3.0",
      REQUEST: "GetMap",
      LAYERS: details.layer || layer,
      STYLES: details.style || "",
      CRS: "EPSG:4326",
      BBOX: terrainDemoBounds,
      WIDTH: "640",
      HEIGHT: "430",
      FORMAT: "image/png",
      TRANSPARENT: "TRUE"
    });
    return terrainServiceUrl + "?" + parameters.toString();
  }

  async function fetchProvincialFeatures(service, layer, where) {
    const parameters = new URLSearchParams({
      where: where,
      geometry: [provincialBounds.west, provincialBounds.south, provincialBounds.east, provincialBounds.north].join(","),
      geometryType: "esriGeometryEnvelope",
      inSR: "4326",
      spatialRel: "esriSpatialRelIntersects",
      outSR: "4326",
      outFields: "FEAT_DESC,ZVALUE",
      geometryPrecision: "6",
      maxAllowableOffset: "0.00001",
      f: "geojson"
    });
    const response = await fetch(provincialServiceUrl + service + "/MapServer/" + layer + "/query?" + parameters);
    if (!response.ok) throw new Error("Provincial map service returned HTTP " + response.status);
    const data = await response.json();
    if (data.type !== "FeatureCollection" || !Array.isArray(data.features) || data.exceededTransferLimit) {
      throw new Error(data.error ? data.error.message : "Incomplete or invalid provincial map data");
    }
    return data.features;
  }

  function provincialMapPoint(coordinate) {
    if (!Array.isArray(coordinate) || coordinate.length < 2 ||
        !Number.isFinite(coordinate[0]) || !Number.isFinite(coordinate[1])) {
      throw new Error("Invalid coordinate in provincial map data");
    }
    return [
      (coordinate[0] - provincialBounds.west) / (provincialBounds.east - provincialBounds.west) * 640,
      (provincialBounds.north - coordinate[1]) / (provincialBounds.north - provincialBounds.south) * 430
    ];
  }

  function provincialPath(lines, close) {
    return lines.map(function (line) {
      if (!Array.isArray(line) || line.length < 2) throw new Error("Invalid provincial feature geometry");
      return line.map(function (coordinate, index) {
        const point = provincialMapPoint(coordinate);
        return (index ? "L" : "M") + point[0].toFixed(2) + " " + point[1].toFixed(2);
      }).join(" ") + (close ? " Z" : "");
    }).join(" ");
  }

  function renderProvincialFeatures(target, features, kind) {
    const fragment = document.createDocumentFragment();
    features.forEach(function (feature) {
      if (!feature.geometry || !feature.properties) throw new Error("Missing provincial feature geometry or attributes");
      const geometry = feature.geometry;
      const description = String(feature.properties.FEAT_DESC || "");
      let lines;
      let polygon = false;
      if (geometry.type === "LineString") lines = [geometry.coordinates];
      else if (geometry.type === "MultiLineString") lines = geometry.coordinates;
      else if (geometry.type === "Polygon" && kind === "water") {
        lines = geometry.coordinates;
        polygon = true;
      } else if (geometry.type === "MultiPolygon" && kind === "water") {
        lines = geometry.coordinates.flat();
        polygon = true;
      } else throw new Error("Unsupported provincial feature geometry: " + geometry.type);
      const path = svgElement("path", {
        d: provincialPath(lines, polygon),
        class: kind === "contour"
          ? "mapped-contour" + (description.toLowerCase().includes("approximate") ? " is-approximate" : "")
          : polygon ? "mapped-water-polygon" : "mapped-water-line"
      });
      fragment.appendChild(path);
      if (kind === "contour" && Number.isFinite(feature.properties.ZVALUE)) {
        const point = lines.flat().map(provincialMapPoint).find(function (position) {
          return position[0] >= 0 && position[0] <= 640 && position[1] >= 0 && position[1] <= 430;
        });
        if (point) {
          const label = svgElement("text", { x: point[0], y: point[1], class: "mapped-contour-label" });
          label.textContent = feature.properties.ZVALUE + " m";
          fragment.appendChild(label);
        }
      }
    });
    target.replaceChildren(fragment);
  }

  async function updateProvincialOverlay(kind) {
    const isContour = kind === "contour";
    const version = isContour ? ++contourRequestVersion : ++waterRequestVersion;
    const control = isContour ? elements.showContours : elements.showMappedWater;
    const target = isContour ? elements.contourOverlay : elements.mappedWaterOverlay;
    const status = isContour ? elements.contourStatus : elements.mappedWaterStatus;
    target.replaceChildren();
    if (!control.checked || activeMapView === "illustrative") {
      status.textContent = "";
      return;
    }
    status.textContent = "Loading Nova Scotia " + (isContour ? "mapped contours" : "mapped water") + "…";
    try {
      const data = isContour
        ? await Promise.all([fetchProvincialFeatures("BASE_NSTDB_10k_Landforms_UT83", 4, "FEAT_DESC LIKE 'CONTOUR%'")])
        : await Promise.all([
          fetchProvincialFeatures("BASE_NSTDB_10k_Water_UT83", 4, "1=1"),
          fetchProvincialFeatures("BASE_NSTDB_10k_Water_UT83", 8, "1=1")
        ]);
      if (version !== (isContour ? contourRequestVersion : waterRequestVersion)) return;
      const features = data.flat();
      renderProvincialFeatures(target, features, kind);
      status.textContent = "Nova Scotia " + (isContour ? "contours" : "mapped water") +
        " loaded for the regional window (" + features.length + " intersecting source features). Absence does not prove absence on the ground.";
    } catch (error) {
      if (version !== (isContour ? contourRequestVersion : waterRequestVersion)) return;
      target.replaceChildren();
      status.textContent = "Could not load Nova Scotia " + (isContour ? "contours" : "mapped water") +
        ". Check your connection and toggle the layer to retry.";
      console.error("TerraForma could not load provincial map data:", error);
    }
  }

  function setMapView(view) {
    if (activeProjectId === "waverley-terrain-demo" && view === "illustrative") {
      view = "dtm-hillshade";
      elements.terrainLayer.value = view;
    }
    const isTerrain = view !== "illustrative";
    const isGeoreferencedTerrain = activeProjectId === "waverley-terrain-demo" && isTerrain;
    activeMapView = view;
    elements.terrainOverlays.hidden = !isTerrain;
    elements.mapFrame.classList.toggle("hide-proposed-water", isTerrain && !elements.showProposedWater.checked);
    updateProvincialOverlay("contour");
    updateProvincialOverlay("water");
    elements.mapFrame.classList.toggle("is-terrain-view", isTerrain);
    elements.mapFrame.classList.toggle("is-terrain-preview", isTerrain && !isGeoreferencedTerrain);
    elements.mapFrame.classList.toggle("is-georeferenced-terrain", isGeoreferencedTerrain);
    elements.propertyGrid.classList.toggle("is-terrain-view", isTerrain);
    elements.terrainSource.hidden = !isTerrain;
    elements.terrainLegend.hidden = !isTerrain || !terrainLayerDetails[view].legend;
    updatePropertyMapCaveat(savedPropertyProfile, propertyProfileIsSaved);
    elements.mapLegend.hidden = isTerrain;
    elements.mapFooterLegend.hidden = isTerrain && !isGeoreferencedTerrain;
    elements.editBoundary.disabled = isTerrain && !isGeoreferencedTerrain;
    elements.saveBoundary.disabled = isTerrain && !isGeoreferencedTerrain;
    elements.cancelBoundary.disabled = isTerrain && !isGeoreferencedTerrain;
    elements.mapFrame.setAttribute("aria-label", isTerrain
      ? "Real Natural Resources Canada terrain data preview for the Waverley area, Nova Scotia. This is not a legal parcel boundary."
      : "Illustrative property map with three selectable observation locations.");
    elements.mapSvg.setAttribute("aria-label", isTerrain
      ? isGeoreferencedTerrain
        ? "Waverley-area terrain test map. Draw a synthetic parcel boundary and place plan features in this fixed map area."
        : "Regional Waverley-area terrain data preview. Planning features and observations are hidden because they are not georeferenced to this area."
      : "Interactive illustrative property map. While drawing a feature or property outline, use arrow keys and Enter to add points.");

    if (!isTerrain) {
      elements.mapTitle.textContent = "Illustrative map · " + elements.propertyName.textContent;
      elements.mapDescription.textContent =
        "A fictional, not-to-scale property drawing with wooded edges, a clearing, a path, and a low corner.";
      elements.mapContext.textContent = "Illustrative layout · Not to scale";
      elements.mapScaleNote.textContent = "Illustrative, not measured";
      elements.terrainStatus.textContent =
        "Terrain layers use a fixed Waverley-area test window. The terrain is real; the demo property and boundary are synthetic.";
      elements.boundaryEditorNote.textContent =
        "The terrain illustration stays fictional. Edit the outline to match a sketch; it is not georeferenced or a surveyed boundary.";
      elements.terrainRaster.removeAttribute("href");
      elements.terrainReliefOverlay.removeAttribute("href");
      elements.mapFrame.classList.remove("is-elevation-color");
      elements.terrainLegendImage.removeAttribute("src");
      return;
    }

    const details = terrainLayerDetails[view];
    elements.mapTitle.textContent = "NRCan HRDEM terrain · Waverley-area demo window";
    elements.mapDescription.textContent = isGeoreferencedTerrain
      ? details.description + " This is a fixed regional test window with a synthetic, user-drawn parcel boundary."
      : details.description + " This regional data preview does not show a property boundary or permission to access land.";
    elements.mapContext.textContent = "Real elevation data · Waverley area, Nova Scotia · regional preview";
    elements.mapScaleNote.textContent = "Regional context · not a parcel map";
    elements.boundaryEditorNote.textContent =
      "Outline drawing is turned off in this terrain preview because the current sketch belongs to the illustrative map, not this real-world location.";
    elements.terrainStatus.textContent = "Loading " + details.label + " from Natural Resources Canada…";
    elements.terrainRaster.setAttribute("href", terrainMapUrl(view));
    elements.terrainRaster.dataset.layer = view;
    if (view === "dtm") {
      elements.mapFrame.classList.add("is-elevation-color");
      elements.terrainReliefOverlay.setAttribute("href", terrainMapUrl("dtm-hillshade"));
      elements.terrainReliefOverlay.dataset.layer = view;
    } else {
      elements.mapFrame.classList.remove("is-elevation-color");
      elements.terrainReliefOverlay.removeAttribute("href");
    }
    if (details.legend) {
      elements.terrainLegendImage.src = details.legend;
      elements.terrainLegendImage.alt = details.label + " legend from Natural Resources Canada.";
    } else {
      elements.terrainLegendImage.removeAttribute("src");
      elements.terrainLegendImage.alt = "";
    }
    if (isGeoreferencedTerrain) {
      elements.mapFooterLegend.textContent = "Synthetic demo parcel outline · Planned footprints";
      elements.boundaryEditorNote.textContent =
        "Draw a synthetic test boundary directly over this real terrain. It is not a legal parcel, verified ownership boundary, or permission to access land.";
      elements.terrainStatus.textContent =
        "Real NRCan elevation data · Waverley-area test window. Draw a synthetic boundary here to start; this map does not show parcel ownership.";
    }
  }

  function switchPropertyWorkspace() {
    if (pendingPlanItem || boundaryEditing) {
      elements.propertyWorkspace.value = activeProjectId;
      elements.propertyWorkspaceStatus.textContent = "Finish or cancel the current map drawing before switching workspaces.";
      return;
    }
    if (JSON.stringify(collectPropertyProfile()) !== JSON.stringify(savedPropertyProfile) ||
        (savedSiteBrief && JSON.stringify(collectSiteBrief()) !== JSON.stringify(savedSiteBrief))) {
      elements.propertyWorkspace.value = activeProjectId;
      elements.propertyWorkspaceStatus.textContent = "Save or cancel unsaved property details and site-brief changes before switching.";
      return;
    }
    try {
      window.localStorage.setItem(activeProjectStorageKey, elements.propertyWorkspace.value);
      window.location.reload();
    } catch (error) {
      elements.propertyWorkspace.value = activeProjectId;
      elements.propertyWorkspaceStatus.textContent = "Could not switch property workspaces in browser storage.";
      console.error("TerraForma could not switch property workspaces:", error);
    }
  }

  function updatePropertyWorkspaceControls() {
    elements.propertyWorkspace.value = activeProjectId;
    if (activeProjectId === "waverley-terrain-demo") {
      elements.propertyWorkspaceStatus.textContent =
        "New synthetic test property · Cedar Ridge remains archived and available.";
      elements.mapSectionHint.textContent =
        "Draw a synthetic boundary, then add building or landscape footprints. Terrain layers show regional elevation only.";
    } else {
      elements.propertyWorkspaceStatus.textContent =
        "Archived demo workspace · saved plans and sketches are preserved separately.";
      elements.mapSectionHint.textContent = "Choose a marker to see a sample observation.";
    }
    const illustrativeOption = elements.terrainLayer.querySelector('option[value="illustrative"]');
    illustrativeOption.hidden = activeProjectId === "waverley-terrain-demo";
    elements.terrainLayer.value = activeMapView;
    setMapView(activeMapView);
  }

  elements.propertyWorkspace.addEventListener("change", switchPropertyWorkspace);
  elements.showContours.addEventListener("change", function () { updateProvincialOverlay("contour"); });
  elements.showMappedWater.addEventListener("change", function () { updateProvincialOverlay("water"); });
  elements.showProposedWater.addEventListener("change", function () {
    elements.mapFrame.classList.toggle("hide-proposed-water",
      activeMapView !== "illustrative" && !elements.showProposedWater.checked);
  });

  elements.terrainRaster.addEventListener("load", function () {
    if (activeMapView !== elements.terrainRaster.dataset.layer) return;
    const details = terrainLayerDetails[activeMapView];
    elements.terrainStatus.textContent = activeProjectId === "waverley-terrain-demo"
      ? details.label + " loaded for the Waverley-area demo window. Terrain is real; the editable parcel outline is synthetic."
      : details.label + " loaded for the fixed Waverley-area demo window. Terrain is real; planning overlays are hidden because they are not georeferenced here.";
  });
  elements.terrainRaster.addEventListener("error", function () {
    if (activeMapView !== elements.terrainRaster.dataset.layer) return;
    elements.terrainStatus.textContent =
      "Terrain data could not be loaded from Natural Resources Canada. Check the connection or return to the illustrative planning map.";
  });

  function readPropertyProfile() {
    savedPropertyProfile = defaultPropertyProfile();
    propertyProfileIsSaved = false;
    try {
      const saved = window.localStorage.getItem(currentStorageKey("profile"));
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

  function renderPropertyBoundary(points) {
    if (!points || points.length < 3) {
      elements.propertyBoundary.removeAttribute("d");
      return;
    }
    elements.propertyBoundary.setAttribute("d", "M" + points.map(function (point) {
      return point[0] + " " + point[1];
    }).join(" L") + " Z");
  }

  function readPropertyBoundary() {
    try {
      const saved = window.localStorage.getItem(currentStorageKey("boundary"));
      if (saved === null) {
        renderPropertyBoundary(propertyBoundary);
        elements.editBoundary.textContent = propertyBoundary.length >= 3
          ? "Edit property outline"
          : "Draw property outline";
        elements.boundaryEditorStatus.textContent = activeProjectId === "waverley-terrain-demo"
          ? "Draw and save a synthetic test boundary to enable planning on this terrain map."
          : "Using illustrative sample outline.";
        return;
      }
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed) || parsed.length < 3 || parsed.length > 100 ||
          !parsed.every(function (point) {
            return Array.isArray(point) && point.length === 2 &&
              Number.isFinite(point[0]) && Number.isFinite(point[1]) &&
              point[0] >= 0 && point[0] <= 640 && point[1] >= 0 && point[1] <= 430;
          }) ||
          hasShortEdge(parsed) ||
          hasSelfIntersection(parsed) || polygonArea(parsed) < 500) {
        throw new Error("The saved property outline has an unexpected format.");
      }
      propertyBoundary = parsed.map(function (point) { return point.slice(); });
      renderPropertyBoundary(propertyBoundary);
      elements.editBoundary.textContent = "Edit property outline";
      elements.boundaryEditorStatus.textContent = activeProjectId === "waverley-terrain-demo"
        ? "Saved synthetic test outline loaded over real Waverley-area terrain."
        : "Saved custom outline loaded. Map background remains fictional.";
    } catch (error) {
      elements.editBoundary.textContent = propertyBoundary.length >= 3
        ? "Edit property outline"
        : "Draw property outline";
      elements.boundaryEditorStatus.textContent = activeProjectId === "waverley-terrain-demo"
        ? "Could not load the saved outline. No test boundary is available; redraw and save it."
        : "Could not load the saved outline; the default workspace outline is shown.";
      elements.boundaryEditorStatus.classList.add("storage-error");
      console.error("TerraForma could not read the property boundary:", error);
    }
    if (activeProjectId === "cedar-ridge" && propertyBoundary.length >= 3) {
      propertyMapAreaM2PerUnit = propertyAreaM2 / polygonArea(propertyBoundary);
    }
  }

  function beginBoundaryEdit() {
    if (!canEditCurrentMap()) {
      elements.boundaryEditorStatus.textContent = "Switch to the illustrative planning map before editing its sketch outline.";
      return;
    }
    if (pendingPlanItem) {
      elements.boundaryEditorStatus.textContent = "Finish or cancel the current feature drawing before editing the property outline.";
      return;
    }
    setMapPanMode(false);
    boundaryEditing = true;
    boundaryPoints = [];
    keyboardCursor = { x: 320, y: 215 };
    elements.mapFrame.classList.add("is-editing-boundary");
    elements.editBoundary.hidden = true;
    elements.saveBoundary.hidden = false;
    elements.cancelBoundary.hidden = false;
    elements.boundaryEditorStatus.textContent =
      activeProjectId === "waverley-terrain-demo"
        ? "Click at least three points to sketch a synthetic parcel over the terrain. Existing planned features must remain inside it."
        : "Click at least three points around the property, staying inside the map canvas. Existing planned areas must remain inside the new outline.";
    elements.mapFrame.scrollIntoView({ behavior: "smooth", block: "center" });
    elements.mapSvg.focus({ preventScroll: true });
  }

  function renderBoundaryDraft() {
    const oldDraft = document.getElementById("boundary-drawing-preview");
    if (oldDraft) oldDraft.remove();
    if (!boundaryEditing || !boundaryPoints.length) return;
    const group = svgElement("g", { id: "boundary-drawing-preview", "aria-hidden": "true" });
    if (boundaryPoints.length >= 2) {
      group.appendChild(svgElement(boundaryPoints.length >= 3 ? "polygon" : "polyline", {
        points: boundaryPoints.map(function (point) { return point.join(","); }).join(" "),
        class: "boundary-drawing-line"
      }));
    }
    boundaryPoints.forEach(function (point) {
      group.appendChild(svgElement("circle", {
        cx: point[0],
        cy: point[1],
        r: 5,
        class: "boundary-drawing-point"
      }));
    });
    elements.planAreas.appendChild(group);
  }

  function cancelBoundaryEdit() {
    boundaryEditing = false;
    boundaryPoints = [];
    elements.mapFrame.classList.remove("is-editing-boundary");
    elements.editBoundary.hidden = false;
    elements.saveBoundary.hidden = true;
    elements.cancelBoundary.hidden = true;
    elements.boundaryEditorStatus.textContent = "Outline edit canceled; the saved boundary was not changed.";
    renderMapAreas();
  }

  function saveBoundaryEdit() {
    if (boundaryPoints.length < 3) {
      elements.boundaryEditorStatus.textContent = "Add at least three points to outline the property.";
      return;
    }
    if (boundaryPoints.length > 100) {
      elements.boundaryEditorStatus.textContent = "The outline has too many points. Cancel and redraw it more simply.";
      return;
    }
    if (hasShortEdge(boundaryPoints)) {
      elements.boundaryEditorStatus.textContent = "Some outline points are too close together. Cancel and redraw with clearer corners.";
      return;
    }
    if (hasSelfIntersection(boundaryPoints)) {
      elements.boundaryEditorStatus.textContent = "The outline crosses itself. Cancel and redraw it without crossing lines.";
      return;
    }
    if (polygonArea(boundaryPoints) < 500) {
      elements.boundaryEditorStatus.textContent = "The outline is too small for this map. Draw a larger property area.";
      return;
    }

    const previousBoundary = propertyBoundary;
    propertyBoundary = boundaryPoints.map(function (point) { return point.slice(); });
    const plansRemainInside = planItems.every(function (item) {
      return isInsideProperty(item.polygon);
    });
    if (!plansRemainInside) {
      propertyBoundary = previousBoundary;
      elements.boundaryEditorStatus.textContent =
        "The new outline would exclude at least one planned feature. Keep the existing features inside the outline or remove them first.";
      return;
    }

    try {
      window.localStorage.setItem(currentStorageKey("boundary"), JSON.stringify(propertyBoundary));
    } catch (error) {
      propertyBoundary = previousBoundary;
      elements.boundaryEditorStatus.textContent =
        "Could not save this outline in browser storage. The existing outline is unchanged.";
      elements.boundaryEditorStatus.classList.add("storage-error");
      console.error("TerraForma could not save the property boundary:", error);
      return;
    }
    if (activeProjectId === "cedar-ridge") {
      propertyMapAreaM2PerUnit = propertyAreaM2 / polygonArea(propertyBoundary);
    }
    renderPropertyBoundary(propertyBoundary);
    elements.editBoundary.textContent = "Edit property outline";
    boundaryEditing = false;
    boundaryPoints = [];
    elements.mapFrame.classList.remove("is-editing-boundary");
    elements.editBoundary.hidden = false;
    elements.saveBoundary.hidden = true;
    elements.cancelBoundary.hidden = true;
    elements.boundaryEditorStatus.textContent = activeProjectId === "waverley-terrain-demo"
      ? "Synthetic parcel outline saved on the Waverley terrain test map. It is not a legal parcel boundary."
      : "Custom outline saved in this browser. The terrain and basemap are still fictional.";
    elements.boundaryEditorStatus.classList.remove("storage-error");
    renderPlan();
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
      window.localStorage.setItem(currentStorageKey("profile"), JSON.stringify({
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
      const saved = window.localStorage.getItem(currentStorageKey("brief"));
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
      window.localStorage.setItem(currentStorageKey("brief"), JSON.stringify(nextSiteBrief));
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
      window.localStorage.removeItem(currentStorageKey("brief"));
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
    const perspective = getPerspectiveById(selectedPerspectiveId);
    const prioritized = perspective.ideas.map(function (idea) { return idea.feature; });
    const previousValue = elements.featureSelect.value;
    const ordered = PLAN_CATALOG.slice().sort(function (a, b) {
      const first = prioritized.indexOf(a.name);
      const second = prioritized.indexOf(b.name);
      return (first < 0 ? prioritized.length : first) - (second < 0 ? prioritized.length : second);
    });
    elements.featureSelect.replaceChildren();
    ordered.forEach(function (item) {
      elements.featureSelect.appendChild(makeOption(item.category + " · " + item.name, item.id));
    });
    elements.featureSelect.value = previousValue || PLAN_CATALOG[0].id;
    elements.featurePriorityNote.textContent =
      "Shown first for " + perspective.name + ": " + prioritized.join(", ") +
      ". All features remain available; these are ideas to investigate, not site-specific recommendations.";
  }

  function initializeFeatureOptions() {
    populateFeatureOptions();
    updateFeatureDetails();
  }

  function populateBedPlantOptions() {
    VEGETABLE_PLANTS.forEach(function (plant) {
      elements.bedPlantSpecies.appendChild(makeOption(plant.name, plant.id));
    });
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
      if (window.TerraFormaSelectMenus) window.TerraFormaSelectMenus.enhance(elements.guildOptions);
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
    return ACTIVE_PROPERTY.zones.find(function (zone) { return zone.id === id; });
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
    ACTIVE_PROPERTY.zones.forEach(function (zone) {
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
    ACTIVE_PROPERTY.zones.forEach(function (zone) {
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

  function hasShortEdge(points) {
    return points.some(function (point, index) {
      const next = points[(index + 1) % points.length];
      return Math.hypot(next[0] - point[0], next[1] - point[1]) < 1;
    });
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

  function isInsidePolygon(points, boundary) {
    for (let index = 0; index < points.length; index += 1) {
      const start = points[index];
      const end = points[(index + 1) % points.length];
      if (!pointInPolygon(start, boundary)) return false;
      const dx = end[0] - start[0];
      const dy = end[1] - start[1];
      const lengthSquared = dx * dx + dy * dy;
      if (!lengthSquared) continue;
      const cuts = [0, 1];
      boundary.forEach(function (edgeStart, edgeIndex) {
        const edgeEnd = boundary[(edgeIndex + 1) % boundary.length];
        const ex = edgeEnd[0] - edgeStart[0];
        const ey = edgeEnd[1] - edgeStart[1];
        const offsetX = edgeStart[0] - start[0];
        const offsetY = edgeStart[1] - start[1];
        const denominator = dx * ey - dy * ex;
        if (Math.abs(denominator) > 1e-9) {
          const ratio = (offsetX * ey - offsetY * ex) / denominator;
          const edgeRatio = (offsetX * dy - offsetY * dx) / denominator;
          if (ratio > 0 && ratio < 1 && edgeRatio >= 0 && edgeRatio <= 1) cuts.push(ratio);
        } else if (Math.abs(offsetX * dy - offsetY * dx) < 1e-9) {
          [edgeStart, edgeEnd].forEach(function (point) {
            const ratio = ((point[0] - start[0]) * dx + (point[1] - start[1]) * dy) / lengthSquared;
            if (ratio > 0 && ratio < 1) cuts.push(ratio);
          });
        }
      });
      cuts.sort(function (a, b) { return a - b; });
      for (let cut = 1; cut < cuts.length; cut += 1) {
        const ratio = (cuts[cut - 1] + cuts[cut]) / 2;
        if (!pointInPolygon([start[0] + dx * ratio, start[1] + dy * ratio], boundary)) return false;
      }
    }
    return true;
  }

  function isInsideProperty(points) {
    return isInsidePolygon(points, propertyBoundary);
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
      return total + (item.parentId ? 0 : polygonArea(item.polygon) * propertyMapAreaM2PerUnit);
    }, 0);
  }

  function gardenChildren(id) {
    return planItems.filter(function (item) { return item.parentId === id; });
  }

  function validatePlanGeometry(item, points) {
    if (!isInsideProperty(points)) return "The entire footprint must stay inside the property boundary.";
    const parent = item.parentId && planItems.find(function (entry) {
      return entry.id === item.parentId && entry.featureId === "garden-area";
    });
    if (item.parentId && (!parent || item.featureId !== "garden-beds")) {
      return "The selected garden is no longer available for this bed.";
    }
    if (parent && !isInsidePolygon(points, parent.polygon)) {
      return "The entire bed must stay inside its garden area.";
    }
    if (item.featureId === "garden-area" && gardenChildren(item.id).length) {
      return "Remove this garden's beds before changing its footprint.";
    }
    if (planItems.some(function (other) {
      if (other.id === item.id || other.id === item.parentId || other.parentId === item.id) return false;
      return polygonsOverlap(other.polygon, points);
    })) return "This footprint overlaps or touches another mapped feature.";
    const remaining = planItems.filter(function (entry) { return entry.id !== item.id; });
    if (usedAreaM2(remaining) + (item.parentId ? 0 : polygonArea(points) * propertyMapAreaM2PerUnit) > propertyAreaM2) {
      return "This footprint would exceed the entered property-area estimate.";
    }
    return "";
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

  function constrainedMapViewBox(viewBox) {
    const width = Math.max(120, Math.min(640, viewBox.width));
    const height = width * 430 / 640;
    return {
      x: Math.max(0, Math.min(640 - width, viewBox.x)),
      y: Math.max(0, Math.min(430 - height, viewBox.y)),
      width: width,
      height: height
    };
  }

  function updateMapViewBox(viewBox) {
    mapViewBox = constrainedMapViewBox(viewBox);
    elements.mapSvg.setAttribute("viewBox", [
      mapViewBox.x,
      mapViewBox.y,
      mapViewBox.width,
      mapViewBox.height
    ].join(" "));
    elements.mapZoomLevel.textContent = Math.round(640 / mapViewBox.width * 100) + "%";
    elements.mapZoomOut.disabled = mapViewBox.width >= 640;
    elements.mapZoomIn.disabled = mapViewBox.width <= 120;
    elements.mapZoomReset.disabled = mapViewBox.width === 640 && mapViewBox.x === 0 && mapViewBox.y === 0;
  }

  function zoomMap(factor) {
    const width = mapViewBox.width * factor;
    const height = width * 430 / 640;
    updateMapViewBox({
      x: mapViewBox.x + (mapViewBox.width - width) / 2,
      y: mapViewBox.y + (mapViewBox.height - height) / 2,
      width: width,
      height: height
    });
  }

  function updatePinchZoom() {
    if (mapTouchPointers.size < 2 || !mapPinch) return;
    const pointers = Array.from(mapTouchPointers.values()).slice(0, 2);
    const distance = Math.hypot(
      pointers[1].clientX - pointers[0].clientX,
      pointers[1].clientY - pointers[0].clientY
    );
    if (distance < 1) return;
    const midpoint = {
      clientX: (pointers[0].clientX + pointers[1].clientX) / 2,
      clientY: (pointers[0].clientY + pointers[1].clientY) / 2
    };
    const width = mapPinch.viewBox.width * mapPinch.distance / distance;
    const height = width * 430 / 640;
    const rectangle = elements.mapSvg.getBoundingClientRect();
    const horizontalRatio = Math.max(0, Math.min(1, (midpoint.clientX - rectangle.left) / rectangle.width));
    const verticalRatio = Math.max(0, Math.min(1, (midpoint.clientY - rectangle.top) / rectangle.height));
    updateMapViewBox({
      x: mapPinch.anchor[0] - horizontalRatio * width,
      y: mapPinch.anchor[1] - verticalRatio * height,
      width: width,
      height: height
    });
  }

  function setMapPanMode(active) {
    mapPanActive = active;
    elements.mapFrame.classList.toggle("is-pan-active", active);
    elements.mapPanToggle.setAttribute("aria-pressed", active ? "true" : "false");
    elements.mapPanToggle.textContent = active ? "Pan mode on" : "Pan map";
    elements.mapNavigationHint.textContent = active
      ? "Pinch to zoom. Drag the map to move the view. Turn off Pan map to edit or draw footprints."
      : "Pinch to zoom. Select a footprint to edit or drag it to move; turn on Pan map for one-finger panning.";
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
    const endpoint = drawingPoints[1] || [keyboardCursor.x, keyboardCursor.y];
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

    if (drawingShape === "circle") {
      const diameter = dimensions.width !== null
        ? widthUnits
        : Math.min(widthUnits, depthUnits);
      return circlePolygon(
        [(anchor[0] + endpoint[0]) / 2, (anchor[1] + endpoint[1]) / 2],
        diameter
      );
    }

    return [
      anchor,
      [anchor[0] + directionX * widthUnits, anchor[1]],
      [anchor[0] + directionX * widthUnits, anchor[1] + directionY * depthUnits],
      [anchor[0], anchor[1] + directionY * depthUnits]
    ];
  }

  function polygonCenter(points) {
    return points.reduce(function (center, point) {
      center.x += point[0] / points.length;
      center.y += point[1] / points.length;
      return center;
    }, { x: 0, y: 0 });
  }

  function rotatePoint(point, center, degrees) {
    const radians = degrees * Math.PI / 180;
    const x = point[0] - center.x;
    const y = point[1] - center.y;
    return [
      center.x + x * Math.cos(radians) - y * Math.sin(radians),
      center.y + x * Math.sin(radians) + y * Math.cos(radians)
    ];
  }

  function circlePolygon(center, diameter) {
    return Array.from({ length: 32 }, function (_, index) {
      const angle = index * Math.PI * 2 / 32;
      return [
        center[0] + Math.cos(angle) * diameter / 2,
        center[1] + Math.sin(angle) * diameter / 2
      ];
    });
  }

  function polygonBounds(points) {
    return points.reduce(function (bounds, point) {
      bounds.minX = Math.min(bounds.minX, point[0]);
      bounds.maxX = Math.max(bounds.maxX, point[0]);
      bounds.minY = Math.min(bounds.minY, point[1]);
      bounds.maxY = Math.max(bounds.maxY, point[1]);
      return bounds;
    }, { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity });
  }

  function footprintDimensions(item) {
    const center = polygonCenter(item.polygon);
    const rotation = Number.isFinite(item.rotationDegrees) ? item.rotationDegrees : 0;
    const localPoints = item.polygon.map(function (point) {
      return rotatePoint(point, center, -rotation);
    });
    const bounds = polygonBounds(localPoints);
    const width = (bounds.maxX - bounds.minX) / mapUnitsPerMeter();
    const depth = (bounds.maxY - bounds.minY) / mapUnitsPerMeter();
    return {
      width: Math.max(0.5, Math.round(width * 2) / 2),
      depth: Math.max(0.5, Math.round(depth * 2) / 2)
    };
  }

  function resizedFootprint(item, shape, widthMeters, depthMeters, rotationDegrees) {
    const center = polygonCenter(item.polygon);
    const widthUnits = widthMeters * mapUnitsPerMeter();
    const depthUnits = depthMeters * mapUnitsPerMeter();
    if (shape === "circle") {
      return circlePolygon([center.x, center.y], widthUnits);
    }

    if (shape === "rectangle" || shape === "square") {
      const depth = shape === "square" ? widthUnits : depthUnits;
      return [
        [-widthUnits / 2, -depth / 2],
        [widthUnits / 2, -depth / 2],
        [widthUnits / 2, depth / 2],
        [-widthUnits / 2, depth / 2]
      ].map(function (point) {
        return rotatePoint([center.x + point[0], center.y + point[1]], center, rotationDegrees);
      });
    }

    const oldRotation = Number.isFinite(item.rotationDegrees) ? item.rotationDegrees : 0;
    const localPoints = item.polygon.map(function (point) {
      return rotatePoint(point, center, -oldRotation);
    });
    const bounds = polygonBounds(localPoints);
    const oldWidth = bounds.maxX - bounds.minX;
    const oldDepth = bounds.maxY - bounds.minY;
    if (oldWidth <= 0 || oldDepth <= 0) return [];
    return localPoints.map(function (point) {
      const resized = [
        center.x + (point[0] - center.x) * widthUnits / oldWidth,
        center.y + (point[1] - center.y) * depthUnits / oldDepth
      ];
      return rotatePoint(resized, center, rotationDegrees);
    });
  }

  function syncDrawingControls() {
    const isRectangle = drawingShape === "rectangle";
    const isSquare = drawingShape === "square";
    const isCircle = drawingShape === "circle";
    elements.drawingDimensions.hidden = !isRectangle && !isSquare && !isCircle;
    elements.drawingDepthLabel.hidden = !isRectangle;
    elements.drawingWidthLabel.childNodes[0].textContent = isSquare
      ? "Side length (m) "
      : isCircle ? "Diameter (m) " : "Width (m) ";
  }

  function minimumDrawingPoints() {
    return drawingShape === "freeform" ? 3 : 2;
  }

  function updateDrawingStatus() {
    const needed = minimumDrawingPoints();
    elements.finishDrawing.disabled = drawingPoints.length < needed;
    const snapGridMeters = Number(elements.drawingSnap.value);
    const gridInfo = snapGridMeters ? " (grid: " + snapGridMeters + "m)" : "";
    if (drawingPoints.length) {
      elements.drawingStatus.textContent = drawingPoints.length + " of " + needed +
        " required point" + (needed === 1 ? "" : "s") + " placed. " +
        (drawingShape === "freeform"
          ? "Add outline points, undo, or finish." + gridInfo
          : "Place the opposite corner; adjust dimensions or snap settings if needed." + gridInfo);
    } else {
      elements.drawingStatus.textContent = drawingShape === "freeform"
        ? "Click or tap at least three points inside the boundary to outline this feature." + gridInfo
        : "Place two opposite corners inside the boundary. Optional dimensions set the scaled size." + gridInfo;
    }
  }

  function distanceInMeters(point1, point2) {
    const unitsDistance = Math.hypot(point2[0] - point1[0], point2[1] - point1[1]);
    return unitsDistance / mapUnitsPerMeter();
  }

  function renderGridOverlay(group, gridMeters) {
    if (!gridMeters) return;
    const gridUnits = gridMeters * mapUnitsPerMeter();
    const viewBox = mapViewBox;
    const startX = Math.floor(viewBox.x / gridUnits) * gridUnits;
    const endX = viewBox.x + viewBox.width;
    const startY = Math.floor(viewBox.y / gridUnits) * gridUnits;
    const endY = viewBox.y + viewBox.height;
    
    for (let x = startX; x <= endX; x += gridUnits) {
      if (x >= viewBox.x && x <= endX) {
        group.appendChild(svgElement("line", {
          x1: x,
          y1: viewBox.y,
          x2: x,
          y2: endY,
          class: "drawing-grid-line"
        }));
      }
    }
    for (let y = startY; y <= endY; y += gridUnits) {
      if (y >= viewBox.y && y <= endY) {
        group.appendChild(svgElement("line", {
          x1: viewBox.x,
          y1: y,
          x2: endX,
          y2: y,
          class: "drawing-grid-line"
        }));
      }
    }
  }

  function renderDraft() {
    const oldDraft = document.getElementById("drawing-preview");
    if (oldDraft) oldDraft.remove();
    if (!pendingPlanItem) return;

    const group = svgElement("g", { id: "drawing-preview", "aria-hidden": "true" });
    const gridMeters = Number(elements.drawingSnap.value);
    
    if (gridMeters) renderGridOverlay(group, gridMeters);
    
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
    
    if (drawingPoints.length > 0 && drawingShape === "freeform") {
      const lastPoint = drawingPoints[drawingPoints.length - 1];
      const cursor = [keyboardCursor.x, keyboardCursor.y];
      const distance = distanceInMeters(lastPoint, cursor);
      const midX = (lastPoint[0] + cursor[0]) / 2;
      const midY = (lastPoint[1] + cursor[1]) / 2;
      
      group.appendChild(svgElement("text", {
        x: midX,
        y: midY - 8,
        class: "drawing-distance-label",
        "text-anchor": "middle"
      })).textContent = distance.toFixed(1) + " m";
    } else if ((drawingShape === "rectangle" || drawingShape === "square" || drawingShape === "circle") && drawingPoints.length >= 1) {
      const bounds = polygonBounds(draftPolygon);
      const widthM = (bounds.maxX - bounds.minX) / mapUnitsPerMeter();
      const depthM = (bounds.maxY - bounds.minY) / mapUnitsPerMeter();
      const midX = (bounds.minX + bounds.maxX) / 2;
      const midY = (bounds.minY + bounds.maxY) / 2;
      
      let label = "";
      if (drawingShape === "circle") {
        label = widthM.toFixed(1) + " m diam";
      } else if (drawingShape === "square") {
        label = (widthM).toFixed(1) + " m × " + (widthM).toFixed(1) + " m";
      } else {
        label = (widthM).toFixed(1) + " m × " + (depthM).toFixed(1) + " m";
      }
      
      group.appendChild(svgElement("text", {
        x: midX,
        y: midY,
        class: "drawing-dimension-label",
        "text-anchor": "middle"
      })).textContent = label;
    }
    
    elements.planAreas.appendChild(group);
  }

  function renderMapAreas() {
    elements.planAreas.replaceChildren();
    planItems.slice().sort(function (a, b) {
      return Number(Boolean(a.parentId)) - Number(Boolean(b.parentId));
    }).forEach(function (item) {
      const polygon = svgElement("polygon", {
        points: item.polygon.map(function (point) { return point.join(","); }).join(" "),
        class: "planned-area" + (item.featureId === "rain-garden" ? " is-proposed-water" : "") +
          (item.featureId === "garden-area" ? " is-garden" : "") +
          (item.id === selectedPlanId ? " is-selected" : ""),
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
        if (pendingPlanItem && pendingPlanItem.parentId === item.id) return;
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
      (item.fenceSections || []).forEach(function (index) {
        const start = item.polygon[index];
        const end = item.polygon[(index + 1) % item.polygon.length];
        elements.planAreas.appendChild(svgElement("line", {
          x1: start[0], y1: start[1], x2: end[0], y2: end[1], class: "garden-fence"
        }));
      });
      if (item.featureId === "garden-area" && item.id === selectedPlanId) {
        item.polygon.forEach(function (point, index) {
          const next = item.polygon[(index + 1) % item.polygon.length];
          const number = svgElement("text", {
            x: (point[0] + next[0]) / 2,
            y: (point[1] + next[1]) / 2,
            class: "garden-side-label",
            "text-anchor": "middle",
            "aria-hidden": "true"
          });
          number.textContent = String(index + 1);
          elements.planAreas.appendChild(number);
        });
      }

      const center = item.polygon.reduce(function (result, point) {
        result.x += point[0] / item.polygon.length;
        result.y += point[1] / item.polygon.length;
        return result;
      }, { x: 0, y: 0 });
      const label = svgElement("text", {
        x: center.x,
        y: center.y + 3,
        class: "planned-area-label" + (item.featureId === "rain-garden" ? " is-proposed-water" : ""),
        "aria-hidden": "true"
      });
      label.textContent = item.feature.length > 14 ? item.feature.slice(0, 12) + "…" : item.feature;
      elements.planAreas.appendChild(label);

      (item.plantings || []).forEach(function (plant) {
        const point = bedPlantMapPoint(item, plant.position);
        if (!point) return;
        const marker = svgElement("g", {
          class: "bed-planted-plant",
          role: "img",
          "aria-label": plant.plantName + ", planted " + plant.plantingDate
        });
        const title = svgElement("title", {});
        title.textContent = plant.plantName +
          (plant.cultivar ? " · " + plant.cultivar : "") +
          " · planted " + plant.plantingDate +
          " · spacing source: " + plant.spacingSource;
        marker.appendChild(title);
        [[-1.6, -0.5], [0.2, -1.7], [1.5, 0.5], [-0.3, 1.7]].forEach(function (offset) {
          marker.appendChild(svgElement("ellipse", {
            cx: point[0] + offset[0],
            cy: point[1] + offset[1],
            rx: 1.1,
            ry: 2,
            transform: "rotate(" + (offset[0] * 16) + " " + point[0] + " " + point[1] + ")",
            class: "bed-plant-leaf"
          }));
        });
        marker.appendChild(svgElement("circle", {
          cx: point[0],
          cy: point[1],
          r: 0.85,
          class: "bed-plant-center"
        }));
        elements.planAreas.appendChild(marker);
      });
    });
    renderDraft();
    renderBedPlantingCandidates();
  }

  function nearestZone(points) {
    if (!ACTIVE_PROPERTY.zones.length) return { label: "outlined test parcel" };
    const center = points.reduce(function (result, point) {
      result.x += point[0] / points.length;
      result.y += point[1] / points.length;
      return result;
    }, { x: 0, y: 0 });
    return ACTIVE_PROPERTY.zones.reduce(function (closest, zone) {
      const x = (zone.x / 100) * 640;
      const y = (zone.y / 100) * 430;
      const distance = Math.hypot(center.x - x, center.y - y);
      return !closest || distance < closest.distance
        ? { zone: zone, distance: distance }
        : closest;
    }, null).zone;
  }

  function renderPlan() {
    updateUndoButton();
    elements.planList.replaceChildren();
    elements.planCount.textContent = planItems.length;
    elements.planTotal.textContent = planItems.length + (planItems.length === 1 ? " feature" : " features");

    if (planItems.length === 0) {
      const empty = document.createElement("p");
      empty.className = "empty-plan";
      empty.textContent = "No mapped features yet. Draw a property outline, then add a house, garden, or other feature.";
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
      const itemDimensions = footprintDimensions(item);
      const dimensions = item.shape === "circle"
        ? " · about " + itemDimensions.width + " m diameter"
        : item.shape === "square"
          ? " · about " + itemDimensions.width + " m square"
          : item.shape && item.shape !== "freeform"
            ? " · about " + itemDimensions.width + " × " + itemDimensions.depth + " m"
            : "";
      const rotation = Number.isFinite(item.rotationDegrees) && item.rotationDegrees !== 0
        ? " · rotated " + item.rotationDegrees + "°"
        : "";
      location.textContent = item.location + " · about " +
        Math.round(polygonArea(item.polygon) * propertyMapAreaM2PerUnit) + " m²" + dimensions + rotation;
      if (item.parentId) location.textContent += " · inside a garden area";
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

      if (item.plantings && item.plantings.length) {
        const plantingSummary = document.createElement("p");
        plantingSummary.className = "guild-summary";
        plantingSummary.textContent = item.plantings.length + " individual plant" +
          (item.plantings.length === 1 ? "" : "s") + " placed on the bed map. Spacing and source labels are user-entered.";
        content.appendChild(plantingSummary);
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
        if (gardenChildren(item.id).length) {
          elements.storageMessage.textContent = "Remove this garden's beds before removing the garden.";
          elements.storageMessage.classList.add("storage-error");
          return;
        }
        const previousPlan = clonePlanItems(planItems);
        planItems = planItems.filter(function (planItem) { return planItem.id !== item.id; });
        if (!savePlan()) {
          planItems = previousPlan;
          return;
        }
        recordUndoState(previousPlan);
        if (gardenTargetId === item.id) clearGardenTarget();
        if (selectedPlanId === item.id) selectedPlanId = null;
        renderPlan();
        updateFeatureNoteEditor();
      });
      actions.append(locateButton, removeButton);
      article.append(icon, content, actions);
      elements.planList.appendChild(article);
    });
    renderMapAreas();
    updateFootprintEditor();
    updateCapacity();
  }

  function updateFootprintEditor() {
    const item = planItems.find(function (entry) { return entry.id === selectedPlanId; });
    elements.footprintEditor.hidden = !item;
    elements.gardenEditor.hidden = !item || item.featureId !== "garden-area";
    elements.bedPlantingEditor.hidden = !item || item.featureId !== "garden-beds";
    if (!item) {
      bedPlantingConfig = null;
      bedPlantingCandidates = [];
      bedPlantingGridDimensions = { rowCount: 0, plantCount: 0 };
      return;
    }
    const dimensions = footprintDimensions(item);
    elements.footprintEditorName.textContent = item.feature + " · " + (item.variety || "Selected footprint");
    elements.footprintShape.value = ["rectangle", "square", "circle", "freeform"].includes(item.shape)
      ? item.shape
      : "freeform";
    elements.footprintWidth.value = dimensions.width;
    elements.footprintDepth.value = dimensions.depth;
    elements.footprintDepth.disabled = item.shape === "circle" || item.shape === "square";
    elements.footprintRotation.value = Number.isFinite(item.rotationDegrees) ? item.rotationDegrees : 0;
    elements.footprintEditorStatus.textContent = "Drag the selected footprint on the map to move it. Dimensions are approximate map measurements.";
    elements.gardenFenceSections.replaceChildren();
    elements.gardenBedList.replaceChildren();
    if (item.featureId === "garden-area") renderGardenEditor(item);
    elements.previewBedPlantingSpots.disabled = item.shape !== "rectangle";
    elements.bedPlantingsList.replaceChildren();
    if (item.featureId === "garden-beds") {
      if (item.shape !== "rectangle") {
        elements.bedPlantingStatus.textContent = "Change this bed to a rectangle before laying out plant positions.";
        bedPlantingConfig = null;
        bedPlantingCandidates = [];
        bedPlantingGridDimensions = { rowCount: 0, plantCount: 0 };
      } else if (!bedPlantingConfig) {
        elements.bedPlantingStatus.textContent = "Set the bed to 1 × 30 m if desired, then choose a plant and source-backed spacing to preview positions.";
      }

      renderBedPlantingsList(item);
    }
    elements.stopBedPlanting.hidden = !bedPlantingConfig;
  }

  function renderGardenEditor(item) {
    elements.gardenEditorStatus.textContent = gardenChildren(item.id).length
      ? "Remove all beds before moving, resizing, or removing this garden."
      : "Measurements are approximate; fencing is a planning sketch, not a construction design.";
    item.polygon.forEach(function (point, index) {
      const label = document.createElement("label");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = (item.fenceSections || []).includes(index);
      checkbox.addEventListener("change", function () {
        const previousPlan = clonePlanItems(planItems);
        const previous = (item.fenceSections || []).slice();
        item.fenceSections = checkbox.checked
          ? previous.concat(index).sort(function (a, b) { return a - b; })
          : previous.filter(function (value) { return value !== index; });
        if (!savePlan()) {
          item.fenceSections = previous;
          checkbox.checked = !checkbox.checked;
          elements.gardenEditorStatus.textContent = "Could not save this fence change.";
          return;
        }
        recordUndoState(previousPlan);
        renderMapAreas();
        elements.gardenEditorStatus.textContent = "Fence section saved on this device.";
      });
      label.append(checkbox, document.createTextNode("Side " + (index + 1)));
      elements.gardenFenceSections.appendChild(label);
    });
    const children = gardenChildren(item.id);
    if (!children.length) {
      elements.gardenBedList.textContent = "No beds in this garden yet.";
    } else {
      children.forEach(function (bed, index) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "map-action-button";
        button.textContent = "Edit bed " + (index + 1);
        button.addEventListener("click", function () { selectPlan(bed.id, false); });
        elements.gardenBedList.appendChild(button);
      });
    }
  }

  function clearGardenTarget() {
    gardenTargetId = null;
    elements.gardenTarget.hidden = true;
    elements.gardenTargetLabel.textContent = "";
  }

  function bedPlantMapPoint(item, position) {
    if (!Array.isArray(position) || position.length !== 2 ||
        !position.every(function (value) { return Number.isFinite(value); }) ||
        item.polygon.length !== 4) return null;
    const origin = item.polygon[0];
    const widthEnd = item.polygon[1];
    const depthEnd = item.polygon[3];
    return [
      origin[0] + (widthEnd[0] - origin[0]) * position[0] +
        (depthEnd[0] - origin[0]) * position[1],
      origin[1] + (widthEnd[1] - origin[1]) * position[0] +
        (depthEnd[1] - origin[1]) * position[1]
    ];
  }

  function getBedPlantPlacementCandidates(item, config) {
    const origin = item.polygon[0];
    const widthEnd = item.polygon[1];
    const depthEnd = item.polygon[3];
    const widthVector = [widthEnd[0] - origin[0], widthEnd[1] - origin[1]];
    const depthVector = [depthEnd[0] - origin[0], depthEnd[1] - origin[1]];
    const widthUnits = Math.hypot(widthVector[0], widthVector[1]);
    const depthUnits = Math.hypot(depthVector[0], depthVector[1]);
    const acrossWidth = widthUnits <= depthUnits;
    const acrossVector = acrossWidth ? widthVector : depthVector;
    const alongVector = acrossWidth ? depthVector : widthVector;
    const acrossLength = Math.hypot(acrossVector[0], acrossVector[1]);
    const alongLength = Math.hypot(alongVector[0], alongVector[1]);
    const rowStep = config.rowSpacingCm / 100 * mapUnitsPerMeter();
    const plantStep = config.inRowSpacingCm / 100 * mapUnitsPerMeter();
    const rowCount = Math.floor(acrossLength / rowStep);
    const plantCount = Math.floor(alongLength / plantStep);
    const total = rowCount * plantCount;
    if (total > maxBedPlantingCandidates) {
      return { tooMany: true, total: total, rowCount: rowCount, plantCount: plantCount, candidates: [] };
    }
    if (rowCount === 0 || plantCount === 0) {
      return { tooMany: false, total: 0, rowCount: rowCount, plantCount: plantCount, candidates: [] };
    }

    const acrossUnit = [acrossVector[0] / acrossLength, acrossVector[1] / acrossLength];
    const alongUnit = [alongVector[0] / alongLength, alongVector[1] / alongLength];
    const firstRowOffset = (acrossLength - (rowCount - 1) * rowStep) / 2;
    const firstPlantOffset = (alongLength - (plantCount - 1) * plantStep) / 2;
    const existing = (item.plantings || []).map(function (plant) {
      return {
        acrossOffset: acrossWidth
          ? plant.position[0] * widthUnits
          : plant.position[1] * depthUnits,
        alongOffset: acrossWidth
          ? plant.position[1] * depthUnits
          : plant.position[0] * widthUnits,
        rowSpacingCm: plant.rowSpacingCm,
        inRowSpacingCm: plant.inRowSpacingCm
      };
    });
    const candidates = [];

    for (let row = 0; row < rowCount; row += 1) {
      const acrossOffset = firstRowOffset + row * rowStep;
      for (let column = 0; column < plantCount; column += 1) {
        const alongOffset = firstPlantOffset + column * plantStep;
        const point = [
          origin[0] + acrossUnit[0] * acrossOffset + alongUnit[0] * alongOffset,
          origin[1] + acrossUnit[1] * acrossOffset + alongUnit[1] * alongOffset
        ];
        const position = acrossWidth
          ? [acrossOffset / widthUnits, alongOffset / depthUnits]
          : [alongOffset / widthUnits, acrossOffset / depthUnits];
        const available = existing.every(function (plant) {
          const acrossGapCm = Math.abs(acrossOffset - plant.acrossOffset) /
            mapUnitsPerMeter() * 100;
          const alongGapCm = Math.abs(alongOffset - plant.alongOffset) /
            mapUnitsPerMeter() * 100;
          const requiredAcrossCm = Math.max(config.rowSpacingCm, plant.rowSpacingCm);
          const requiredAlongCm = Math.max(config.inRowSpacingCm, plant.inRowSpacingCm);
          return acrossGapCm + 0.01 >= requiredAcrossCm ||
            alongGapCm + 0.01 >= requiredAlongCm;
        });
        if (available) candidates.push({
          point: point,
          position: position,
          rowIndex: row,
          columnIndex: column
        });
      }
    }
    return {
      tooMany: false,
      total: total,
      rowCount: rowCount,
      plantCount: plantCount,
      candidates: candidates
    };
  }

  function renderBedPlantingCandidates() {
    elements.bedPlantingGrid.replaceChildren();
    elements.bedPlantingGridPanel.hidden = true;
    if (!bedPlantingConfig) return;
    const item = planItems.find(function (entry) { return entry.id === selectedPlanId; });
    if (!item || item.featureId !== "garden-beds" || item.shape !== "rectangle") return;
    const group = svgElement("g", { "aria-hidden": "true" });
    bedPlantingCandidates.forEach(function (candidate, index) {
      const marker = svgElement("circle", {
        cx: candidate.point[0],
        cy: candidate.point[1],
        r: 2.2,
        class: "bed-plant-candidate"
      });
      group.appendChild(marker);
    });
    elements.planAreas.appendChild(group);

    for (let rowIndex = 0; rowIndex < bedPlantingGridDimensions.rowCount; rowIndex += 1) {
      const row = document.createElement("div");
      row.className = "bed-planting-grid-row";
      row.setAttribute("role", "group");
      row.setAttribute("aria-label", "Row " + (rowIndex + 1));
      const label = document.createElement("span");
      label.className = "bed-planting-grid-row-label";
      label.textContent = "Row " + (rowIndex + 1);
      const spots = document.createElement("div");
      spots.className = "bed-planting-grid-spots";
      bedPlantingCandidates.forEach(function (candidate, index) {
        if (candidate.rowIndex !== rowIndex) return;
        const button = document.createElement("button");
        button.type = "button";
        button.className = "bed-planting-grid-spot";
        button.textContent = String(candidate.columnIndex + 1);
        button.setAttribute("aria-label",
          "Place " + bedPlantingConfig.plantName + " at row " + (rowIndex + 1) +
          ", position " + (candidate.columnIndex + 1));
        button.title = "Row " + (rowIndex + 1) + ", position " + (candidate.columnIndex + 1);
        button.setAttribute("data-bed-plant-grid-candidate", String(index));
        button.addEventListener("click", function () { placeBedPlanting(index); });
        spots.appendChild(button);
      });
      row.append(label, spots);
      elements.bedPlantingGrid.appendChild(row);
    }
    elements.bedPlantingGridPanel.hidden = bedPlantingCandidates.length === 0;
  }

  function renderBedPlantingsList(item) {
    (item.plantings || []).forEach(function (plant) {
      const row = document.createElement("li");
      row.textContent = plant.plantName +
        (plant.cultivar ? " · " + plant.cultivar : "") +
        " · " + plant.plantingDate +
        " · " + plant.method.replace(/-/g, " ") +
        " · spacing " + plant.rowSpacingCm + " × " + plant.inRowSpacingCm + " cm";
      const remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = "Remove";
      remove.setAttribute("aria-label", "Remove " + plant.plantName + " from this bed");
      remove.addEventListener("click", function () { removeBedPlanting(item.id, plant.id); });
      row.appendChild(remove);
      elements.bedPlantingsList.appendChild(row);
    });
  }

  function startBedPlantingPreview() {
    const item = planItems.find(function (entry) { return entry.id === selectedPlanId; });
    if (!item || item.featureId !== "garden-beds" || item.shape !== "rectangle") {
      elements.bedPlantingStatus.textContent = "Select a rectangular vegetable bed to place plants.";
      return;
    }
    if (!elements.bedPlantRowSpacing.checkValidity() ||
        !elements.bedPlantInRowSpacing.checkValidity() ||
        !elements.bedPlantDate.checkValidity()) {
      elements.bedPlantingStatus.textContent = "Enter valid row spacing, within-row spacing, and planting date.";
      return;
    }
    const spacingSource = elements.bedPlantSource.value.trim();
    if (!spacingSource) {
      elements.bedPlantingStatus.textContent = "Enter the seed-packet, nursery-label, or guide reference for these spacing values.";
      elements.bedPlantSource.focus();
      return;
    }
    const plant = VEGETABLE_PLANTS.find(function (entry) {
      return entry.id === elements.bedPlantSpecies.value;
    });
    if (!plant) {
      elements.bedPlantingStatus.textContent = "Choose a plant from the list.";
      return;
    }
    bedPlantingConfig = {
      speciesId: plant.id,
      plantName: plant.name,
      scientificName: plant.scientificName,
      cultivar: elements.bedPlantCultivar.value.trim(),
      rowSpacingCm: Number(elements.bedPlantRowSpacing.value),
      inRowSpacingCm: Number(elements.bedPlantInRowSpacing.value),
      spacingSource: spacingSource,
      method: elements.bedPlantMethod.value,
      plantingDate: elements.bedPlantDate.value
    };
    const result = getBedPlantPlacementCandidates(item, bedPlantingConfig);
    if (result.tooMany) {
      bedPlantingConfig = null;
      bedPlantingCandidates = [];
      bedPlantingGridDimensions = { rowCount: 0, plantCount: 0 };
      renderMapAreas();
      elements.bedPlantingStatus.textContent = "This spacing creates " + result.total.toLocaleString() +
        " positions, above the " + maxBedPlantingCandidates.toLocaleString() +
        "-spot preview limit. Enter larger source-backed row spacing to reduce the grid.";
      elements.stopBedPlanting.hidden = true;
      return;
    }
    if (result.candidates.length === 0) {
      bedPlantingConfig = null;
      bedPlantingCandidates = [];
      bedPlantingGridDimensions = { rowCount: 0, plantCount: 0 };
      renderMapAreas();
      elements.bedPlantingStatus.textContent = result.total
        ? "No candidate spots remain at these spacings. Try another part of the bed or review the source values."
        : "These spacing values do not fit a plant position inside this bed.";
      elements.stopBedPlanting.hidden = true;
      return;
    }
    bedPlantingCandidates = result.candidates;
    bedPlantingGridDimensions = {
      rowCount: result.rowCount,
      plantCount: result.plantCount
    };
    elements.stopBedPlanting.hidden = false;
    elements.bedPlantingStatus.textContent = result.candidates.length.toLocaleString() +
      " available positions. Choose a numbered position in the bed grid below. Map symbols are not to scale; spacing values are user-provided, not verified by TerraForma.";
    renderMapAreas();
  }

  function invalidateBedPlantingPreview() {
    if (!bedPlantingConfig) return;
    bedPlantingConfig = null;
    bedPlantingCandidates = [];
    bedPlantingGridDimensions = { rowCount: 0, plantCount: 0 };
    elements.stopBedPlanting.hidden = true;
    elements.bedPlantingStatus.textContent = "Settings changed. Preview positions again before placing another plant.";
    renderMapAreas();
  }

  function placeBedPlanting(index) {
    const item = planItems.find(function (entry) { return entry.id === selectedPlanId; });
    const candidate = bedPlantingCandidates[index];
    if (!item || !candidate || !bedPlantingConfig) return;
    if (!Array.isArray(item.plantings)) item.plantings = [];
    const plant = Object.assign({
      id: "bed-plant-" + Date.now() + "-" + item.plantings.length,
      position: candidate.position.slice()
    }, bedPlantingConfig);
    item.plantings.push(plant);
    const result = getBedPlantPlacementCandidates(item, bedPlantingConfig);
    if (!savePlan()) {
      item.plantings.pop();
      elements.bedPlantingStatus.textContent = "Could not save this plant. No position was added.";
      renderMapAreas();
      return;
    }
    bedPlantingCandidates = result.tooMany ? [] : result.candidates;
    bedPlantingGridDimensions = {
      rowCount: result.rowCount,
      plantCount: result.plantCount
    };
    if (bedPlantingCandidates.length === 0) bedPlantingConfig = null;
    renderPlan();
    elements.bedPlantingStatus.textContent = bedPlantingCandidates.length
      ? "Plant position saved. " + bedPlantingCandidates.length.toLocaleString() + " available positions remain."
      : "Plant position saved. No unoccupied spots remain at these spacings.";
    elements.stopBedPlanting.hidden = !bedPlantingConfig;
  }

  function removeBedPlanting(itemId, plantId) {
    const item = planItems.find(function (entry) { return entry.id === itemId; });
    if (!item || !Array.isArray(item.plantings)) return;
    const previous = item.plantings;
    item.plantings = previous.filter(function (plant) { return plant.id !== plantId; });
    if (!savePlan()) {
      item.plantings = previous;
      elements.bedPlantingStatus.textContent = "Could not save this removal. The plant remains in the bed.";
      renderPlan();
      elements.bedPlantingStatus.textContent = "Could not save this removal. The plant remains in the bed.";
      return;
    }
    if (bedPlantingConfig && itemId === selectedPlanId) {
      const result = getBedPlantPlacementCandidates(item, bedPlantingConfig);
      bedPlantingCandidates = result.tooMany ? [] : result.candidates;
      bedPlantingGridDimensions = {
        rowCount: result.rowCount,
        plantCount: result.plantCount
      };
    }
    renderPlan();
  }

  function validateFootprintEdit(itemId, points) {
    if (points.length < 3 || polygonArea(points) < 4) {
      return "The footprint is too small. Increase its dimensions before applying.";
    }
    if (hasSelfIntersection(points)) return "The footprint crosses itself. Change its shape or dimensions.";
    const item = planItems.find(function (entry) { return entry.id === itemId; });
    return item ? validatePlanGeometry(item, points) : "This footprint no longer exists.";
  }

  function finishFootprintDrag(commit) {
    if (!footprintDrag) return;
    const drag = footprintDrag;
    footprintDrag = null;
    if (!drag.moved) return;
    const item = planItems.find(function (entry) { return entry.id === drag.id; });
    if (!item) return;
    const error = commit ? validateFootprintEdit(item.id, item.polygon) : "Move canceled.";
    if (error) {
      item.polygon = drag.originalPolygon;
      renderPlan();
      elements.footprintEditorStatus.textContent = error;
      return;
    }
    const previousPlan = clonePlanItems(planItems);
    const previousItem = previousPlan.find(function (entry) { return entry.id === item.id; });
    previousItem.polygon = drag.originalPolygon.map(function (point) { return point.slice(); });
    if (!savePlan()) {
      item.polygon = drag.originalPolygon;
      renderPlan();
      elements.footprintEditorStatus.textContent = "Could not save this move. The footprint was returned to its prior position.";
      return;
    }
    recordUndoState(previousPlan);
    renderPlan();
    elements.footprintEditorStatus.textContent = "Footprint moved and saved on this device.";
  }

  function applyFootprintEdits() {
    const item = planItems.find(function (entry) { return entry.id === selectedPlanId; });
    if (!item) return;
    if (!elements.footprintWidth.checkValidity() ||
        !elements.footprintDepth.checkValidity() ||
        !elements.footprintRotation.checkValidity()) {
      elements.footprintEditorStatus.textContent =
        "Enter widths and depths from 0.5 to 500 metres and a rotation from −360° to 360°.";
      return;
    }
    const shape = elements.footprintShape.value;
    if (item.featureId === "garden-area" && (item.fenceSections || []).length) {
      elements.footprintEditorStatus.textContent = "Remove the fence sections before resizing or reshaping this garden.";
      return;
    }
    const width = Number(elements.footprintWidth.value);
    const depth = shape === "circle" || shape === "square"
      ? width
      : Number(elements.footprintDepth.value);
    const rotationDegrees = Number(elements.footprintRotation.value);
    const polygon = resizedFootprint(item, shape, width, depth, rotationDegrees);
    const error = validateFootprintEdit(item.id, polygon);
    if (error) {
      elements.footprintEditorStatus.textContent = error;
      return;
    }
    const previous = {
      polygon: item.polygon,
      shape: item.shape,
      rotationDegrees: item.rotationDegrees
    };
    const previousPlan = clonePlanItems(planItems);
    item.polygon = polygon;
    item.shape = shape;
    item.rotationDegrees = rotationDegrees;
    if (!savePlan()) {
      item.polygon = previous.polygon;
      item.shape = previous.shape;
      item.rotationDegrees = previous.rotationDegrees;
      renderPlan();
      elements.footprintEditorStatus.textContent = "Could not save these changes. The footprint is unchanged.";
      return;
    }
    recordUndoState(previousPlan);
    renderPlan();
    elements.footprintEditorStatus.textContent = "Footprint changes saved on this device.";
  }

  function centerMapOnFootprint(item) {
    const dimensions = footprintDimensions(item);
    const widthUnits = Math.max(
      (dimensions.width * mapUnitsPerMeter()) * 2.4,
      (dimensions.depth * mapUnitsPerMeter()) * 2.4,
      160
    );
    const width = Math.min(640, widthUnits);
    const height = width * 430 / 640;
    const center = polygonCenter(item.polygon);
    updateMapViewBox({
      x: center.x - width / 2,
      y: center.y - height / 2,
      width: width,
      height: height
    });
  }

  function selectPlan(id, scrollToMap) {
    if (selectedPlanId !== id) {
      bedPlantingConfig = null;
      bedPlantingCandidates = [];
      bedPlantingGridDimensions = { rowCount: 0, plantCount: 0 };
    }
    selectedPlanId = id;
    const selectedItem = planItems.find(function (item) { return item.id === id; });
    if (selectedItem && selectedItem.featureId === "rain-garden" && activeMapView !== "illustrative") {
      elements.showProposedWater.checked = true;
      elements.mapFrame.classList.remove("hide-proposed-water");
    }
    renderPlan();
    updateFeatureNoteEditor();
    if (scrollToMap) {
      if (selectedItem) centerMapOnFootprint(selectedItem);
      document.getElementById("property").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function updateFeatureNoteEditor() {
    const item = planItems.find(function (entry) { return entry.id === selectedPlanId; });
    if (!item) {
      elements.featureNotePanel.hidden = true;
      return;
    }
    elements.featureNotePanel.hidden = false;
    elements.featureNoteTitle.textContent = item.feature + " · " + (item.variety || "Selected feature");
    elements.featureNoteEdit.value = item.note || "";
  }

  function saveFeatureNote() {
    const item = planItems.find(function (entry) { return entry.id === selectedPlanId; });
    if (!item) return;
    const newNote = elements.featureNoteEdit.value.trim() || "A starting idea to research and adapt to the actual site.";
    if (item.note === newNote) return;
    captureUndoState();
    item.note = newNote;
    savePlan();
    renderPlan();
    updateFeatureNoteEditor();
  }

  function deselectPlan() {
    selectedPlanId = null;
    renderPlan();
    elements.featureNotePanel.hidden = true;
  }

  function readSavedPlan() {
    try {
      const saved = window.localStorage.getItem(currentStorageKey("plan"));
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

      if (new Set(parsed.map(function (item) { return item.id; })).size !== parsed.length) {
        throw new Error("The saved plan contains duplicate feature IDs.");
      }
      const loaded = [];
      const sorted = parsed.slice().sort(function (a, b) {
        return Number(Boolean(a.parentId)) - Number(Boolean(b.parentId));
      });
      planItems = sorted.map(function (item) {
        if (item.parentId !== undefined && item.parentId !== null && typeof item.parentId !== "string") {
          throw new Error("A saved garden relationship has an unexpected format.");
        }
        const parent = item.parentId && loaded.find(function (entry) {
          return entry.id === item.parentId && entry.featureId === "garden-area";
        });
        if (item.parentId && (!parent || item.featureId !== "garden-beds")) {
          throw new Error("A saved bed refers to a missing or invalid garden.");
        }
        const sample = ACTIVE_PROPERTY.initialPlan.find(function (entry) { return entry.id === item.id; });
        const occupied = loaded.filter(function (entry) { return !entry.parentId; }).map(function (entry) {
          return entry.polygon;
        });
        let polygon = Array.isArray(item.polygon) && item.polygon.length >= 3 &&
          item.polygon.every(function (point) {
            return Array.isArray(point) && point.length === 2 &&
              Number.isFinite(point[0]) && Number.isFinite(point[1]);
          }) ? item.polygon.map(function (point) { return point.slice(); }) :
          sample ? sample.polygon.map(function (point) { return point.slice(); }) : null;
        if (parent) {
          if (!polygon || hasSelfIntersection(polygon) || !isInsideProperty(polygon) ||
              !isInsidePolygon(polygon, parent.polygon) || loaded.some(function (entry) {
                return entry.id !== parent.id && polygonsOverlap(entry.polygon, polygon);
              })) {
            throw new Error("A saved garden bed has invalid or overlapping geometry.");
          }
        } else if (!polygon || hasSelfIntersection(polygon) || !isInsideProperty(polygon) ||
            occupied.some(function (existing) { return polygonsOverlap(existing, polygon); })) {
          if (item.featureId === "garden-area" &&
              (parsed.some(function (entry) { return entry.parentId === item.id; }) ||
               (Array.isArray(item.fenceSections) && item.fenceSections.length))) {
            throw new Error("A saved garden with beds or fencing has invalid geometry.");
          }
          polygon = findMigrationFootprint(occupied);
        }
        if (!polygon) throw new Error("The saved plan has more features than can be safely placed on the sample map.");
        const feature = getCatalogItem(item.featureId) ||
          PLAN_CATALOG.find(function (entry) { return entry.name === item.feature; }) ||
          PLAN_CATALOG.find(function (entry) {
            return entry.id === "fruit-tree" && item.feature.toLowerCase().indexOf("fruit tree") !== -1;
          }) ||
          getCatalogItem("garden-beds");
        if (item.fenceSections !== undefined &&
            (!Array.isArray(item.fenceSections) ||
             (item.fenceSections.length && feature.id !== "garden-area") ||
             new Set(item.fenceSections).size !== item.fenceSections.length ||
             item.fenceSections.some(function (section) {
               return !Number.isInteger(section) || section < 0 || section >= polygon.length;
             }))) {
          throw new Error("Saved garden fence sections have an unexpected format.");
        }
        const guildPlants = Array.isArray(item.guildPlants)
          ? item.guildPlants.filter(function (id) {
            return APPLE_GUILD_PLANTS.some(function (plant) { return plant.id === id; });
          })
          : [];
        const plantings = Array.isArray(item.plantings)
          ? item.plantings.filter(function (plant) {
            return plant && typeof plant.id === "string" &&
              typeof plant.speciesId === "string" &&
              typeof plant.plantName === "string" &&
              typeof plant.scientificName === "string" &&
              Array.isArray(plant.position) && plant.position.length === 2 &&
              plant.position.every(function (coordinate) {
                return Number.isFinite(coordinate) && coordinate >= 0 && coordinate <= 1;
              }) &&
              Number.isFinite(plant.rowSpacingCm) && plant.rowSpacingCm >= 1 && plant.rowSpacingCm <= 300 &&
              Number.isFinite(plant.inRowSpacingCm) && plant.inRowSpacingCm >= 1 && plant.inRowSpacingCm <= 300 &&
              typeof plant.spacingSource === "string" && plant.spacingSource.length <= 180 &&
              ["seed", "seedling", "larger-plant", "established-plant"].includes(plant.method) &&
              /^\d{4}-\d{2}-\d{2}$/.test(plant.plantingDate);
          }).map(function (plant) {
            return Object.assign({}, plant, { position: plant.position.slice() });
          })
          : [];
        const result = Object.assign({}, item, {
          featureId: feature.id,
          polygon: polygon,
          variety: typeof item.variety === "string" ? item.variety : "Planning option to research",
          guildPlants: guildPlants,
          plantings: plantings,
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
          shape: ["freeform", "rectangle", "square", "circle"].includes(item.shape)
            ? item.shape
            : "freeform",
          rotationDegrees: Number.isFinite(item.rotationDegrees) &&
            item.rotationDegrees >= -360 && item.rotationDegrees <= 360
            ? item.rotationDegrees
            : 0,
          fenceSections: item.fenceSections ? item.fenceSections.slice() : []
        });
        loaded.push(result);
        return result;
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

  function captureUndoState() {
    recordUndoState(clonePlanItems(planItems));
  }

  function recordUndoState(snapshot) {
    undoStack.push(snapshot);
    redoStack = [];
    updateUndoButton();
  }

  function updateUndoButton() {
    elements.undoPlan.disabled = undoStack.length === 0;
  }

  function undo() {
    if (undoStack.length === 0) return;
    const previous = planItems;
    planItems = undoStack[undoStack.length - 1];
    if (!savePlan()) {
      planItems = previous;
      return;
    }
    undoStack.pop();
    redoStack.push(clonePlanItems(previous));
    if (gardenTargetId && !planItems.some(function (item) { return item.id === gardenTargetId; })) clearGardenTarget();
    selectedPlanId = null;
    updateUndoButton();
    renderPlan();
    updateFeatureNoteEditor();
  }

  function savePlan() {
    if (!storageAvailable) return false;
    try {
      window.localStorage.setItem(currentStorageKey("plan"), JSON.stringify(planItems));
      elements.storageMessage.textContent = "Your mapped features are stored only in this browser.";
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

  function showPerspectiveStatus(message, isError) {
    [elements.workspaceStatus, elements.perspectiveSwitchStatus].forEach(function (element) {
      element.textContent = message;
      element.classList.toggle("storage-error", isError);
    });
  }

  function readPerspective() {
    try {
      const saved = window.localStorage.getItem(perspectiveStorageKey);
      if (saved && !getPerspectiveById(saved)) throw new Error("The saved planning view is not supported.");
      if (saved) selectedPerspectiveId = saved;
      showPerspectiveStatus("Your view preference is stored in this browser.", false);
    } catch (error) {
      showPerspectiveStatus("Could not load the saved view; using the permaculture view.", true);
      console.error("TerraForma could not read the planning view:", error);
    }
  }

  function selectPerspective(id, source) {
    if (pendingPlanItem || boundaryEditing) {
      showPerspectiveStatus("Finish or cancel the current map drawing before changing views.", true);
      return;
    }
    if (!getPerspectiveById(id)) return;
    selectedPerspectiveId = id;
    renderPerspective();
    try {
      window.localStorage.setItem(perspectiveStorageKey, id);
      showPerspectiveStatus("View saved on this device. Your property and plan are unchanged.", false);
    } catch (error) {
      showPerspectiveStatus("View changed for this visit but could not be saved in browser storage.", true);
      console.error("TerraForma could not save the planning view:", error);
    }
    const activeButton = source.querySelector('[data-perspective-id="' + id + '"]');
    if (activeButton) activeButton.focus();
  }

  function renderPerspectiveTabs() {
    [elements.workspaceTabs, elements.perspectiveTabs].forEach(function (container) {
      container.replaceChildren();
      DESIGN_PERSPECTIVES.forEach(function (perspective) {
        const layout = workspaceLayouts[perspective.id];
        const button = document.createElement("button");
        button.type = "button";
        button.className = (container === elements.workspaceTabs ? "workspace-tab" : "perspective-tab") +
          (perspective.id === selectedPerspectiveId ? " is-selected" : "");
        button.dataset.perspectiveId = perspective.id;
        if (container === elements.workspaceTabs) {
          const title = document.createElement("strong");
          title.textContent = layout.label;
          const name = document.createElement("span");
          name.textContent = perspective.name;
          const description = document.createElement("span");
          description.className = "workspace-tab-description";
          description.textContent = layout.description;
          button.append(title, name, description);
        } else {
          button.textContent = perspective.name;
        }
        button.setAttribute("aria-pressed", perspective.id === selectedPerspectiveId ? "true" : "false");
        button.addEventListener("click", function () { selectPerspective(perspective.id, container); });
        container.appendChild(button);
      });
    });
  }

  function applyWorkspaceLayout(perspective) {
    const layout = workspaceLayouts[perspective.id];
    elements.planningWorkspace.dataset.layout = perspective.id;
    layout.sections.forEach(function (id) {
      elements.planningWorkspace.appendChild(document.getElementById(id));
    });
    const planGrid = document.querySelector(".plan-grid");
    const list = planGrid.querySelector(".plan-list-panel");
    const notes = elements.featureNotePanel;
    if (perspective.id === "permaculture") {
      planGrid.append(list, notes, elements.planForm);
    } else {
      planGrid.append(elements.planForm, list, notes);
    }
    populateFeatureOptions();
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
    applyWorkspaceLayout(perspective);
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
    setMapPanMode(false);
    selectedPlanId = null;
    pendingPlanItem = item;
    drawingPoints = [];
    elements.drawingShape.value = item.featureId === "garden-beds" ? "rectangle" : "freeform";
    if (item.featureId === "garden-beds") {
      elements.drawingWidth.value = "1";
      elements.drawingDepth.value = "30";
    } else {
      elements.drawingWidth.value = "";
      elements.drawingDepth.value = "";
    }
    drawingShape = elements.drawingShape.value;
    keyboardCursor = { x: 320, y: 215 };
    elements.drawingToolbar.hidden = false;
    renderPlan();
    syncDrawingControls();
    updateDrawingStatus();
    elements.drawingStatus.textContent += " Drawing " + item.feature +
      ". The rough catalogue footprint is " +
      getCatalogItem(item.featureId).defaultAreaM2 + " m²; the saved estimate comes from your drawing.";
    showFormError("");
    renderDraft();
    elements.mapFrame.scrollIntoView({ behavior: "smooth", block: "center" });
    elements.mapSvg.focus({ preventScroll: true });
  }

  function addIdeaToPlan(idea) {
    const feature = PLAN_CATALOG.find(function (item) { return item.name === idea.feature; });
    if (!feature) {
      showFormError("This sample idea has no matching map feature yet.");
      return;
    }
    clearGardenTarget();
    elements.featureSelect.value = feature.id;
    updateFeatureDetails();
    elements.planNote.value = idea.reason;
    document.getElementById("plan").scrollIntoView({ behavior: "smooth", block: "start" });
    if (window.TerraFormaSelectMenus) window.TerraFormaSelectMenus.focus(elements.featureSelect);
    else elements.featureSelect.focus({ preventScroll: true });
    showFormError("Idea loaded. Choose the plants or components to include, then draw its footprint.");
  }

  function pointerToMapPoint(event) {
    return snapMapPoint(pointerToRawMapPoint(event));
  }

  function pointerToRawMapPoint(event) {
    const transform = elements.mapSvg.getScreenCTM();
    if (!transform) throw new Error("The property map is not ready to receive pointer input.");
    const point = elements.mapSvg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const mapPoint = point.matrixTransform(transform.inverse());
    return [
      Math.max(0, Math.min(640, mapPoint.x)),
      Math.max(0, Math.min(430, mapPoint.y))
    ];
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
      return Math.hypot(point[0] - next[0], point[1] - next[1]) < 0.25 * mapUnitsPerMeter();
    })) return "Two outline points are too close together. Move or undo one of them.";
    if (polygonArea(points) < 4) return "This outline is too small to estimate. Draw a larger area.";
    if (hasSelfIntersection(points)) return "The outline crosses itself. Undo points and draw a simple shape.";
    return validatePlanGeometry(pendingPlanItem, points);
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
      rotationDegrees: 0,
      plantings: [],
      createdAt: new Date().toISOString()
    });
    const previousPlan = clonePlanItems(planItems);
    planItems.push(savedItem);
    if (!savePlan()) {
      planItems = previousPlan;
      elements.drawingStatus.textContent = "Could not save this footprint. Your drawing remains open.";
      return;
    }
    recordUndoState(previousPlan);
    pendingPlanItem = null;
    drawingPoints = [];
    elements.drawingToolbar.hidden = true;
    selectPlan(savedItem.id, false);
    clearGardenTarget();
    elements.planNote.value = "";
    showFormError("");
  }

  elements.featureSelect.addEventListener("change", function () {
    if (elements.featureSelect.value !== "garden-beds") clearGardenTarget();
    updateFeatureDetails();
  });
  elements.clearGardenTarget.addEventListener("click", clearGardenTarget);
  elements.gardenAddBed.addEventListener("click", function () {
    const garden = planItems.find(function (item) {
      return item.id === selectedPlanId && item.featureId === "garden-area";
    });
    if (!garden) return;
    gardenTargetId = garden.id;
    elements.gardenTargetLabel.textContent = "New bed will be placed inside the garden chosen with Add a bed (" + garden.location + ").";
    elements.gardenTarget.hidden = false;
    elements.featureSelect.value = "garden-beds";
    updateFeatureDetails();
    document.getElementById("plan").scrollIntoView({ behavior: "smooth", block: "start" });
    if (window.TerraFormaSelectMenus) window.TerraFormaSelectMenus.focus(elements.featureSelect);
    else elements.featureSelect.focus({ preventScroll: true });
  });
  elements.terrainLayer.addEventListener("change", function () {
    if (pendingPlanItem || boundaryEditing) {
      elements.terrainLayer.value = activeMapView;
      elements.terrainStatus.textContent =
        "Finish or cancel the current drawing before switching map views.";
      return;
    }
    setMapView(elements.terrainLayer.value);
  });
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
    if ((event.ctrlKey || event.metaKey) && event.key === "z" && !event.shiftKey) {
      event.preventDefault();
      undo();
    }
  });
  elements.planForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!canEditCurrentMap()) {
      showFormError("Switch back to the illustrative planning map before drawing a feature; the terrain preview is not georeferenced to this plan.");
      return;
    }
    if (activeProjectId === "waverley-terrain-demo" && propertyBoundary.length < 3) {
      showFormError("Draw and save a synthetic test-property outline on the terrain map before placing buildings or other features.");
      return;
    }
    if (boundaryEditing) {
      showFormError("Finish or cancel the property-outline edit before drawing a planned feature.");
      return;
    }
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
      parentId: feature.id === "garden-beds" ? gardenTargetId : null,
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
    if (Date.now() < suppressMapClickUntil) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (!canEditCurrentMap()) return;
    if (mapPanActive) return;
    if (boundaryEditing) {
      if (boundaryPoints.length >= 100) {
        elements.boundaryEditorStatus.textContent = "The outline has reached its 100-point limit. Save it or cancel and redraw more simply.";
        return;
      }
      boundaryPoints.push(pointerToRawMapPoint(event));
      elements.boundaryEditorStatus.textContent = boundaryPoints.length + " outline point" +
        (boundaryPoints.length === 1 ? "" : "s") + " placed. Add at least three, then save.";
      renderBoundaryDraft();
      return;
    }
    if (bedPlantingConfig) {
      elements.bedPlantingStatus.textContent = "Choose one of the highlighted available positions inside the bed.";
      return;
    }
    if (!pendingPlanItem) return;
    const clickedArea = event.target.closest && event.target.closest(".planned-area");
    if (clickedArea && clickedArea.getAttribute("data-plan-id") === pendingPlanItem.parentId) {
      addDrawingPoint(pointerToMapPoint(event));
      return;
    }
    if (event.target.closest &&
        event.target.closest(".map-marker, .planned-area, .planned-area-label, .north-arrow")) return;
    addDrawingPoint(pointerToMapPoint(event));
  });
  elements.mapSvg.addEventListener("pointerdown", function (event) {
    if (event.button !== 0) return;
    if (event.pointerType === "touch") {
      mapTouchPointers.set(event.pointerId, {
        clientX: event.clientX,
        clientY: event.clientY
      });
      elements.mapSvg.setPointerCapture(event.pointerId);
      if (mapTouchPointers.size >= 2) {
        const pointers = Array.from(mapTouchPointers.values()).slice(0, 2);
        const midpoint = {
          clientX: (pointers[0].clientX + pointers[1].clientX) / 2,
          clientY: (pointers[0].clientY + pointers[1].clientY) / 2
        };
        const rectangle = elements.mapSvg.getBoundingClientRect();
        mapPinch = {
          distance: Math.hypot(
            pointers[1].clientX - pointers[0].clientX,
            pointers[1].clientY - pointers[0].clientY
          ),
          viewBox: Object.assign({}, mapViewBox),
          anchor: [
            mapViewBox.x + (midpoint.clientX - rectangle.left) / rectangle.width * mapViewBox.width,
            mapViewBox.y + (midpoint.clientY - rectangle.top) / rectangle.height * mapViewBox.height
          ]
        };
        mapPanDrag = null;
        finishFootprintDrag(false);
        suppressMapClickUntil = Date.now() + 700;
        event.preventDefault();
        return;
      }
    }
    if (mapPinch) return;
    if (mapPanActive && !boundaryEditing && !pendingPlanItem) {
      const rectangle = elements.mapSvg.getBoundingClientRect();
      const scale = Math.min(rectangle.width / mapViewBox.width, rectangle.height / mapViewBox.height);
      mapPanDrag = {
        pointerId: event.pointerId,
        clientX: event.clientX,
        clientY: event.clientY,
        viewBox: Object.assign({}, mapViewBox),
        unitsPerPixel: 1 / scale,
        moved: false
      };
      elements.mapSvg.setPointerCapture(event.pointerId);
      event.preventDefault();
      return;
    }
    if (!canEditCurrentMap() || mapPanActive || boundaryEditing || pendingPlanItem) return;
    const target = event.target.closest && event.target.closest("[data-plan-id]");
    if (!target) return;
    const id = target.getAttribute("data-plan-id");
    const item = planItems.find(function (entry) { return entry.id === id; });
    if (!item) return;
    selectPlan(id, false);
    footprintDrag = {
      id: id,
      startPoint: pointerToRawMapPoint(event),
      originalPolygon: item.polygon.map(function (point) { return point.slice(); }),
      moved: false
    };
    elements.mapSvg.setPointerCapture(event.pointerId);
    event.preventDefault();
  });
  elements.mapSvg.addEventListener("pointermove", function (event) {
    if (event.pointerType === "touch" && mapTouchPointers.has(event.pointerId)) {
      mapTouchPointers.set(event.pointerId, {
        clientX: event.clientX,
        clientY: event.clientY
      });
      if (mapPinch) {
        updatePinchZoom();
        event.preventDefault();
        return;
      }
    }
    if (mapPinch) return;
    if (mapPanDrag) {
      const deltaX = (event.clientX - mapPanDrag.clientX) * mapPanDrag.unitsPerPixel;
      const deltaY = (event.clientY - mapPanDrag.clientY) * mapPanDrag.unitsPerPixel;
      mapPanDrag.moved = mapPanDrag.moved || Math.hypot(deltaX, deltaY) > 2;
      updateMapViewBox({
        x: mapPanDrag.viewBox.x - deltaX,
        y: mapPanDrag.viewBox.y - deltaY,
        width: mapPanDrag.viewBox.width,
        height: mapPanDrag.viewBox.height
      });
      return;
    }
    if (footprintDrag) {
      const point = pointerToRawMapPoint(event);
      const deltaX = point[0] - footprintDrag.startPoint[0];
      const deltaY = point[1] - footprintDrag.startPoint[1];
      if (Math.hypot(deltaX, deltaY) > 1) footprintDrag.moved = true;
      const item = planItems.find(function (entry) { return entry.id === footprintDrag.id; });
      if (item && footprintDrag.moved) {
        item.polygon = footprintDrag.originalPolygon.map(function (original) {
          return [original[0] + deltaX, original[1] + deltaY];
        });
        renderMapAreas();
      }
      return;
    }
    if (!canEditCurrentMap()) return;
    if (boundaryEditing) return;
    if (!pendingPlanItem) return;
    const pointer = pointerToMapPoint(event);
    keyboardCursor = { x: pointer[0], y: pointer[1] };
    if (drawingShape !== "freeform" && drawingPoints.length < 2) renderDraft();
  });
  elements.mapSvg.addEventListener("pointerup", function (event) {
    if (event.pointerType === "touch") {
      mapTouchPointers.delete(event.pointerId);
      if (mapPinch) {
        mapPinch = null;
        suppressMapClickUntil = Date.now() + 700;
        mapPanDrag = null;
      }
    }
    if (mapPanDrag) {
      mapPanDrag = null;
      return;
    }
    finishFootprintDrag(true);
  });
  elements.mapSvg.addEventListener("pointercancel", function (event) {
    if (event.pointerType === "touch") mapTouchPointers.delete(event.pointerId);
    mapPinch = null;
    mapPanDrag = null;
    finishFootprintDrag(false);
  });
  elements.mapZoomIn.addEventListener("click", function () { zoomMap(0.8); });
  elements.mapZoomOut.addEventListener("click", function () { zoomMap(1.25); });
  elements.mapZoomReset.addEventListener("click", function () {
    updateMapViewBox({ x: 0, y: 0, width: 640, height: 430 });
  });
  elements.mapPanToggle.addEventListener("click", function () {
    if (pendingPlanItem || boundaryEditing) return;
    setMapPanMode(!mapPanActive);
  });
  elements.undoPlan.addEventListener("click", undo);
  elements.footprintShape.addEventListener("change", function () {
    const fixedAspect = ["circle", "square"].includes(elements.footprintShape.value);
    elements.footprintDepth.disabled = fixedAspect;
    if (fixedAspect) elements.footprintDepth.value = elements.footprintWidth.value;
  });
  elements.footprintWidth.addEventListener("input", function () {
    if (elements.footprintDepth.disabled) {
      elements.footprintDepth.value = elements.footprintWidth.value;
    }
  });
  elements.applyFootprintEdits.addEventListener("click", applyFootprintEdits);
  elements.previewBedPlantingSpots.addEventListener("click", startBedPlantingPreview);
  elements.stopBedPlanting.addEventListener("click", function () {
    bedPlantingConfig = null;
    bedPlantingCandidates = [];
    bedPlantingGridDimensions = { rowCount: 0, plantCount: 0 };
    elements.stopBedPlanting.hidden = true;
    elements.bedPlantingStatus.textContent = "Plant placement stopped.";
    renderMapAreas();
  });
  [
    elements.bedPlantSpecies,
    elements.bedPlantCultivar,
    elements.bedPlantRowSpacing,
    elements.bedPlantInRowSpacing,
    elements.bedPlantMethod,
    elements.bedPlantDate,
    elements.bedPlantSource
  ].forEach(function (control) {
    control.addEventListener("input", invalidateBedPlantingPreview);
    control.addEventListener("change", invalidateBedPlantingPreview);
  });
  elements.clearFootprintSelection.addEventListener("click", function () {
    bedPlantingConfig = null;
    bedPlantingCandidates = [];
    bedPlantingGridDimensions = { rowCount: 0, plantCount: 0 };
    selectedPlanId = null;
    renderPlan();
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
    updateDrawingStatus();
    renderDraft();
  });
  elements.drawingWidth.addEventListener("input", renderDraft);
  elements.drawingDepth.addEventListener("input", renderDraft);
  elements.mapSvg.addEventListener("keydown", function (event) {
    if (!pendingPlanItem && !boundaryEditing) return;
    const gridMeters = Number(elements.drawingSnap.value);
    const step = !boundaryEditing && gridMeters ? gridMeters * mapUnitsPerMeter() :
      event.shiftKey ? 20 : 8;
    const directions = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step]
    };
    if (directions[event.key]) {
      event.preventDefault();
      const nextCursor = [
        Math.max(0, Math.min(640, keyboardCursor.x + directions[event.key][0])),
        Math.max(0, Math.min(430, keyboardCursor.y + directions[event.key][1]))
      ];
      const snappedCursor = boundaryEditing ? nextCursor : snapMapPoint(nextCursor);
      keyboardCursor = { x: snappedCursor[0], y: snappedCursor[1] };
      if (!boundaryEditing) renderDraft();
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (boundaryEditing) {
        if (boundaryPoints.length >= 100) {
          elements.boundaryEditorStatus.textContent = "The outline has reached its 100-point limit.";
          return;
        }
        boundaryPoints.push([keyboardCursor.x, keyboardCursor.y]);
        elements.boundaryEditorStatus.textContent = boundaryPoints.length + " outline point" +
          (boundaryPoints.length === 1 ? "" : "s") + " placed. Add at least three, then save.";
        renderBoundaryDraft();
      } else {
        addDrawingPoint([keyboardCursor.x, keyboardCursor.y]);
      }
    }
  });
  elements.editBoundary.addEventListener("click", beginBoundaryEdit);
  elements.saveBoundary.addEventListener("click", saveBoundaryEdit);
  elements.cancelBoundary.addEventListener("click", cancelBoundaryEdit);
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
  elements.featureNoteSave.addEventListener("click", saveFeatureNote);
  elements.featureNoteCancel.addEventListener("click", deselectPlan);

  readPropertyBoundary();
  readPropertyProfile();
  readSavedPlan();
  readInterfaceTheme();
  readSiteBrief();
  readPerspective();
  updatePropertyWorkspaceControls();
  updatePreflightProgress();
  initializeFeatureOptions();
  populateBedPlantOptions();
  renderReferenceList();
  selectZone(selectedZoneId);
  updateMapViewBox(mapViewBox);
  renderPlan();
  renderPerspective();
  if (window.TerraFormaSelectMenus) window.TerraFormaSelectMenus.enhance(document);
})();
