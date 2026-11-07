// Fictional sample content for the TerraForma student prototype.
// Do not add real property addresses, personal information, or measurements.

const STARTUP = {
  name: "TerraForma",
  tagline: "Understand your land. Design your future.",
  pitch: "A practical planning companion for people turning a piece of land into a more productive, resilient home."
};

const PROPERTY = {
  name: "Cedar Ridge Homestead",
  location: "Illustrative property · Atlantic Canada",
  area: "2.4 acres",
  areaNote: "Fictional example, not a measured parcel",
  areaM2: 9712,
  mapAreaM2PerUnit: 0.0705855,
  mapBoundary: [
    [90, 55],
    [319, 45],
    [554, 91],
    [527, 344],
    [293, 380],
    [76, 331]
  ],
  zones: [
    {
      id: "north-clearing",
      label: "North clearing",
      shortLabel: "North",
      x: 52,
      y: 25,
      category: "Sunlight",
      evidence: "Sample observation",
      title: "Open, sunny space",
      note: "The sample owner describes this clearing as sunny through much of the day. Sun exposure has not been measured."
    },
    {
      id: "east-edge",
      label: "East tree line",
      shortLabel: "East",
      x: 78,
      y: 48,
      category: "Vegetation",
      evidence: "Sample observation",
      title: "Existing tree line",
      note: "A fictional photo note mentions mature trees along this edge. Species and condition have not been verified."
    },
    {
      id: "low-corner",
      label: "South low corner",
      shortLabel: "South",
      x: 42,
      y: 76,
      category: "Water",
      evidence: "Sample observation",
      title: "Water after heavy rain",
      note: "The sample owner reports standing water here after heavy rain. This is an observation, not a drainage assessment."
    }
  ],
  initialPlan: [
    {
      id: "demo-1",
      featureId: "garden-beds",
      feature: "Vegetable beds",
      location: "North clearing",
      variety: "A small mixed vegetable bed",
      note: "Start with a small growing area and observe sunlight through the season.",
      polygon: [[164, 156], [188, 156], [188, 180], [164, 180]]
    },
    {
      id: "demo-2",
      featureId: "rain-garden",
      feature: "Rain garden",
      location: "South low corner",
      variety: "Site-appropriate planting (research first)",
      note: "Explore suitable plants and confirm site conditions before building.",
      polygon: [[352, 300], [376, 300], [376, 324], [352, 324]]
    }
  ]
};

const PLAN_CATALOG = [
  {
    id: "garden-beds",
    name: "Vegetable beds",
    category: "Growing",
    defaultAreaM2: 40,
    options: ["Mixed seasonal vegetables"]
  },
  {
    id: "fruit-tree",
    name: "Fruit tree",
    category: "Growing",
    defaultAreaM2: 35,
    options: [
      "Apple — Liberty (example; verify local suitability)",
      "Apple — Honeycrisp (example; verify local suitability)",
      "Pear — choose a locally suitable cultivar and pollination partner",
      "European plum — verify local suitability and disease resistance",
      "Multi-grafted apple — confirm cultivar compatibility and rootstock"
    ]
  },
  {
    id: "berry-planting",
    name: "Berry planting",
    category: "Growing",
    defaultAreaM2: 30,
    options: [
      "Blueberries — verify soil acidity, cultivar, and local suitability",
      "Currants — select a locally suitable species and cultivar",
      "Raspberries — choose a cultivar and plan for spread and support"
    ]
  },
  {
    id: "apple-guild",
    name: "Apple tree guild",
    category: "Growing",
    defaultAreaM2: 55,
    options: ["Apple-centered guild (choose companion plants below)"],
    guild: true
  },
  {
    id: "angled-espalier",
    name: "Angled dwarf-apple fence trial",
    category: "Experimental",
    defaultAreaM2: 24,
    options: [
      "Dwarf apple trees trained at about 45° along a fence (research rootstock, spacing, support, and pruning)"
    ]
  },
  {
    id: "food-forest",
    name: "Food forest",
    category: "Growing",
    defaultAreaM2: 100,
    options: ["Layered edible planting (choose locally suitable species)"]
  },
  {
    id: "pollinator-patch",
    name: "Pollinator and insectary patch",
    category: "Habitat",
    defaultAreaM2: 35,
    options: [
      "Native flowering plants (select for the local ecoregion)",
      "Season-long bloom mix (check bloom times and plant suitability)"
    ]
  },
  {
    id: "beneficial-habitat",
    name: "Beneficial wildlife habitat",
    category: "Habitat",
    defaultAreaM2: 25,
    options: [
      "Native shrub and flower edge for pollinators and birds",
      "Small bird or bat shelter (confirm species needs and placement)"
    ]
  },
  {
    id: "pest-exclusion",
    name: "Pest prevention area",
    category: "Stewardship",
    defaultAreaM2: 20,
    options: [
      "Row cover or netting to protect a specific crop",
      "Wildlife-resistant fence or trunk guards",
      "Monitoring and sanitation zone (identify the pest before acting)"
    ]
  },
  {
    id: "rain-garden",
    name: "Rain garden",
    category: "Water",
    defaultAreaM2: 45,
    options: ["Site-appropriate planting (research first)"]
  },
  {
    id: "compost-area",
    name: "Compost area",
    category: "Infrastructure",
    defaultAreaM2: 12,
    options: ["Simple compost bays"]
  },
  {
    id: "greenhouse",
    name: "Greenhouse",
    category: "Infrastructure",
    defaultAreaM2: 20,
    options: ["Small greenhouse (confirm access, wind, and drainage)"]
  },
  {
    id: "garden-path",
    name: "Garden path",
    category: "Infrastructure",
    defaultAreaM2: 15,
    options: ["Informal permeable path"]
  },
  {
    id: "native-border",
    name: "Native planting border",
    category: "Habitat",
    defaultAreaM2: 30,
    options: ["Native species chosen for the site and region"]
  }
];

const APPLE_GUILD_PLANTS = [
  { id: "chives", name: "Chives", role: "Aromatic ground-layer plant; check spacing and site fit." },
  { id: "clover", name: "Clover", role: "Living groundcover; check spread and local suitability." },
  { id: "yarrow", name: "Yarrow", role: "Flowering insectary plant; choose a locally appropriate species." },
  { id: "comfrey", name: "Comfrey", role: "Biomass plant; can spread, so research containment and placement." }
];

const DESIGN_PERSPECTIVES = [
  {
    id: "permaculture",
    name: "Permaculture designer",
    descriptor: "Systems, relationships & resilience",
    summary: "Look for relationships between sunlight, water, plants, people and buildings. Start by observing how the site works before adding new elements.",
    priorities: ["Observe before intervening", "Connect useful functions", "Work with water"],
    question: "What changes through the seasons, and where does water naturally move?",
    ideas: [
      {
        feature: "Rain garden",
        location: "South low corner",
        reason: "The sample owner reports standing water here. Observe where water enters and drains, and check site conditions before deciding whether a rain garden is appropriate."
      },
      {
        feature: "Food forest",
        location: "East tree line",
        reason: "Explore whether a layered edible planting could complement the existing edge. Identify existing trees, light levels, and root competition first."
      },
      {
        feature: "Apple tree guild",
        location: "North clearing",
        reason: "Consider a small apple-centered guild as a design exercise. Choose companion plants for the actual site and confirm mature size and maintenance needs."
      }
    ]
  },
  {
    id: "landscape",
    name: "Landscape designer",
    descriptor: "Aesthetics, flow & outdoor living",
    summary: "Consider the views from the house, comfortable routes through the property, and how planting and gathering spaces can feel cohesive.",
    priorities: ["Frame useful views", "Make routes welcoming", "Balance structure and planting"],
    question: "Which outdoor spaces should feel connected, and what views do you want to create?",
    ideas: [
      {
        feature: "Garden path",
        location: "North clearing",
        reason: "A simple path could connect the home and growing area. Choose its route after checking how the ground feels underfoot in wet weather."
      },
      {
        feature: "Native planting border",
        location: "East tree line",
        reason: "A varied planting edge can create a softer transition between open and wooded areas. Select plants only after checking light, soil, and local suitability."
      },
      {
        feature: "Angled dwarf-apple fence trial",
        location: "East tree line",
        reason: "An experimental espalier-style idea: dwarf apple trees planted close and trained at about 45° along a support. Research cultivar, rootstock, exact spacing, support strength, and pruning; overly aggressive pruning can stress or damage trees."
      }
    ]
  },
  {
    id: "homestead",
    name: "Homestead grower",
    descriptor: "Food, effort & practical first steps",
    summary: "Prioritize a small, manageable growing area and build knowledge gradually, rather than taking on more than you can maintain.",
    priorities: ["Start with a small area", "Plan around your time", "Learn by doing"],
    question: "How much time can you realistically spend maintaining new projects each week?",
    ideas: [
      {
        feature: "Vegetable beds",
        location: "North clearing",
        reason: "Try a compact growing area first. Track sun through the season and confirm access to water before expanding."
      },
      {
        feature: "Compost area",
        location: "East tree line",
        reason: "A convenient compost spot can support garden work. Check access, drainage, and distance from the home before choosing a location."
      }
    ]
  }
];
