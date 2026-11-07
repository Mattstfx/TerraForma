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
    options: ["Apple tree", "Pear tree", "European plum tree", "Multi-grafted apple tree"]
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
  { id: "chives", name: "Chives", role: "Herbaceous layer example; verify site fit." },
  { id: "clover", name: "Clover", role: "Legume groundcover example; nitrogen benefit to nearby plants is not guaranteed." },
  { id: "yarrow", name: "Yarrow", role: "Herbaceous layer example; verify local species." },
  { id: "comfrey", name: "Comfrey", role: "Herbaceous layer example; can spread, so research containment." }
];

const VEGETABLE_PLANTS = [
  { id: "lettuce", name: "Lettuce", maturityEditable: true },
  { id: "radish", name: "Radish", maturityEditable: true },
  { id: "carrot", name: "Carrot", maturityEditable: true },
  {
    id: "pea",
    name: "Pea",
    scientificName: "Pisum sativum",
    sun: ["full"],
    watering: ["drip", "soaker", "hand"],
    verifiedFacts: [
      "Needs full sun.",
      "Good growing temperatures are 55–65°F.",
      "Soil pH range given by the source: 6.0–7.5; well-drained soil is advised.",
      "Water the soil rather than the vines; during the growing season the source suggests at least 1 inch per week, with more frequent watering possible in sandy soil."
    ],
    sourceId: "umn-peas",
    maturityEditable: true
  },
  { id: "bean", name: "Bean", maturityEditable: true },
  {
    id: "tomato",
    name: "Tomato",
    scientificName: "Solanum lycopersicum",
    sun: ["full"],
    watering: ["drip", "soaker", "hand"],
    verifiedFacts: [
      "Requires full sun and a long, frost-free growing season.",
      "The source gives soil pH 5.5–7.0 as ideal.",
      "Consistent soil moisture is recommended; avoid overhead sprinkling and soak the soil thoroughly.",
      "The source gives about 1 inch of rainfall or irrigation per week as ideal; sandy soil may need more frequent watering."
    ],
    sourceId: "umn-tomatoes",
    maturityEditable: true
  },
  { id: "pepper", name: "Pepper", maturityEditable: true },
  { id: "cucumber", name: "Cucumber", maturityEditable: true },
  { id: "squash", name: "Squash", maturityEditable: true },
  { id: "kale", name: "Kale", maturityEditable: true },
  { id: "beet", name: "Beet", maturityEditable: true },
  { id: "potato", name: "Potato", maturityEditable: true }
];

const APPLE_CULTIVARS = [
  {
    id: "cortland",
    name: "Cortland",
    scientificName: "Malus domestica 'Cortland'",
    verifiedFacts: [
      "The University of Minnesota table lists good-to-fair hardiness for zones 4 to 3.",
      "Average harvest listed: late September to early October.",
      "Listed uses: fresh eating, cooking, and salad.",
      "The source describes it as medium-sized and susceptible to apple scab and fire blight."
    ],
    sourceId: "umn-apples"
  },
  {
    id: "haralson",
    name: "Haralson",
    scientificName: "Malus domestica 'Haralson'",
    verifiedFacts: [
      "The University of Minnesota table lists very-good-to-good hardiness for zones 4 to 3.",
      "Average harvest listed: late September to early October.",
      "Listed uses: fresh eating and cooking; the source notes it is good for pie.",
      "The source reports some resistance to apple scab and fire blight."
    ],
    sourceId: "umn-apples"
  },
  {
    id: "honeycrisp",
    name: "Honeycrisp",
    scientificName: "Malus domestica 'Honeycrisp'",
    verifiedFacts: [
      "The University of Minnesota table lists very-good-to-good hardiness for zones 4 to 3.",
      "Average harvest listed: late September.",
      "Listed use: best for fresh eating; also good for cooking.",
      "The source describes it as medium-large, very juicy and crisp, with some resistance to apple scab and fire blight."
    ],
    sourceId: "umn-apples"
  },
  {
    id: "liberty",
    name: "Liberty",
    scientificName: "Malus domestica 'Liberty'",
    verifiedFacts: [
      "The University of Minnesota table lists good-to-fair hardiness for zones 4 to 3.",
      "Average harvest listed: early October.",
      "Listed uses: fresh eating and cooking.",
      "The source describes it as immune to apple scab and resistant to fire blight."
    ],
    sourceId: "umn-apples"
  }
];

const GUILD_LAYERS = [
  {
    id: "canopy",
    name: "1. Canopy / overstory tree",
    options: [
      { id: "apple", name: "Apple (Malus spp.)", sourceId: "forest-gardening", layerRole: "Canopy / overstory tree" },
      { id: "pear", name: "Pear (Pyrus spp.)", sourceId: "forest-gardening", layerRole: "Canopy / overstory tree" },
      { id: "plum", name: "Plum (Prunus spp.)", sourceId: "forest-gardening", layerRole: "Canopy / overstory tree" }
    ]
  },
  {
    id: "understory",
    name: "2. Small tree / understory",
    options: [
      { id: "serviceberry", name: "Serviceberry (Amelanchier spp.)", sourceId: "forest-gardening", layerRole: "Small tree / large shrub" },
      { id: "dwarf-fruit", name: "Dwarf fruit tree (rootstock-specific)", sourceId: "umn-apples", layerRole: "Small tree / large shrub" }
    ]
  },
  {
    id: "shrub",
    name: "3. Shrub",
    options: [
      { id: "currant", name: "Currant (Ribes spp.)", sourceId: "forest-gardening", layerRole: "Shrub" },
      { id: "gooseberry", name: "Gooseberry (Ribes spp.)", sourceId: "forest-gardening", layerRole: "Shrub; species-level verification still needed" },
      { id: "aronia", name: "Chokeberry (Aronia spp.)", sourceId: "forest-gardening", layerRole: "Shrub" }
    ]
  },
  {
    id: "herbaceous",
    name: "4. Herbaceous / perennial",
    options: [
      { id: "comfrey", name: "Comfrey (Symphytum spp.)", sourceId: "forest-gardening", layerRole: "Herbaceous perennial; spreading habit noted by source" },
      { id: "mint", name: "Mint (Mentha spp.)", sourceId: "forest-gardening", layerRole: "Herbaceous perennial" },
      { id: "lemon-balm", name: "Lemon balm (Melissa officinalis)", sourceId: "forest-gardening", layerRole: "Herbaceous perennial" },
      { id: "tansy", name: "Tansy (Tanacetum vulgare)", sourceId: "forest-gardening", layerRole: "Example plant for attracting predators of common pests; verify local suitability" }
    ]
  },
  {
    id: "groundcover",
    name: "5. Groundcover",
    options: [
      { id: "wild-ginger", name: "Wild ginger (Asarum spp.)", sourceId: "forest-gardening", layerRole: "Groundcover" },
      { id: "bunchberry", name: "Bunchberry (Cornus canadensis)", sourceId: "forest-gardening", layerRole: "Groundcover" },
      { id: "wintergreen", name: "Wintergreen (Gaultheria spp.)", sourceId: "forest-gardening", layerRole: "Groundcover" },
      { id: "creeping-raspberry", name: "Carpeting bramble (Rubus spp.)", sourceId: "forest-gardening", layerRole: "Groundcover" }
    ]
  },
  {
    id: "rhizosphere",
    name: "6. Root / rhizosphere",
    options: [
      { id: "liquorice", name: "Liquorice (Glycyrrhiza spp.)", sourceId: "forest-gardening", layerRole: "Useful-root / rhizosphere example" },
      { id: "barberry-root", name: "Barberry (Berberis spp.)", sourceId: "forest-gardening", layerRole: "Useful-root / rhizosphere example" }
    ]
  },
  {
    id: "vine",
    name: "7. Climber / vine",
    options: [
      { id: "grape", name: "Grape (Vitis spp.)", sourceId: "forest-gardening", layerRole: "Climber / vine" },
      { id: "hardy-kiwi", name: "Hardy kiwi (Actinidia spp.)", sourceId: "forest-gardening", layerRole: "Climber / vine; source notes sturdy tree support" }
    ]
  }
];

const NITROGEN_FIXERS = [
  { id: "alder", name: "Alder (Alnus spp.)", sourceId: "forest-gardening", role: "Nitrogen-fixer example listed by source" },
  { id: "broom", name: "Broom (Cytisus scoparius)", sourceId: "forest-gardening", role: "Nitrogen-fixer example listed by source" },
  { id: "elaeagnus", name: "Elaeagnus (Elaeagnus spp.)", sourceId: "forest-gardening", role: "Nitrogen-fixer example listed by source" },
  { id: "shrub-lupin", name: "Shrub lupin (Lupinus arboreus)", sourceId: "forest-gardening", role: "Nitrogen-fixer example listed by source" },
  { id: "none", name: "No nitrogen-fixer selected", role: "" }
];

const FACILITY_CONTENTS = {
  "garden-beds": { type: "plants", title: "Choose crops for this bed", options: VEGETABLE_PLANTS },
  greenhouse: { type: "plants", title: "Choose crops for this greenhouse", options: VEGETABLE_PLANTS },
  "berry-planting": {
    type: "components",
    title: "Choose berry-planting ideas",
    options: [
      { id: "blueberry", name: "Blueberry (Vaccinium spp.; soil pH and cultivar need checking)" },
      { id: "currant", name: "Currant (Ribes spp.; verify local disease and site fit)" },
      { id: "raspberry", name: "Raspberry (Rubus idaeus; plan for spread and support)" }
    ]
  },
  "fruit-tree": { type: "cultivars", title: "Choose scions / cultivars", options: APPLE_CULTIVARS },
  "angled-espalier": { type: "cultivars", title: "Choose scions / cultivars", options: APPLE_CULTIVARS },
  "apple-guild": { type: "guild", title: "Choose what goes in each guild layer" },
  "food-forest": { type: "guild", title: "Choose what goes in each forest-garden layer" },
  "compost-area": {
    type: "components",
    title: "Choose compost infrastructure",
    options: [
      { id: "three-bin", name: "Three-bin compost bays" },
      { id: "leaf-mould", name: "Leaf-mould bay" },
      { id: "worm-bin", name: "Worm-composting bin" },
      { id: "covered-bin", name: "Covered compost bin" }
    ]
  },
  "rain-garden": {
    type: "components",
    title: "Choose planting ideas to research",
    options: [
      { id: "sedge", name: "Locally native sedge (Carex spp.)" },
      { id: "rush", name: "Locally native rush (Juncus spp.)" },
      { id: "swamp-milkweed", name: "Swamp milkweed (Asclepias incarnata; verify site fit)" }
    ]
  },
  "pollinator-patch": {
    type: "components",
    title: "Choose flowering-plant ideas to research",
    options: [
      { id: "native-aster", name: "Native aster (Symphyotrichum spp.)" },
      { id: "native-goldenrod", name: "Native goldenrod (Solidago spp.)" },
      { id: "wild-bergamot", name: "Wild bergamot (Monarda fistulosa)" }
    ]
  },
  "beneficial-habitat": {
    type: "components",
    title: "Choose habitat components",
    options: [
      { id: "native-edge", name: "Locally native flowering shrub edge" },
      { id: "water-source", name: "Shallow, safely maintained water source" },
      { id: "nest-box", name: "Species-appropriate nest box" },
      { id: "deadwood", name: "Retained deadwood / log habitat (where safe)" }
    ]
  },
  "pest-exclusion": {
    type: "components",
    title: "Choose targeted prevention components",
    options: [
      { id: "row-cover", name: "Removable row cover / insect netting" },
      { id: "trunk-guard", name: "Tree trunk guards" },
      { id: "wildlife-fence", name: "Wildlife-resistant fence" },
      { id: "monitoring", name: "Monitoring and sanitation plan" }
    ]
  },
  "garden-path": {
    type: "components",
    title: "Choose path materials",
    options: [
      { id: "wood-chip", name: "Wood-chip path" },
      { id: "gravel", name: "Permeable gravel" },
      { id: "stepping-stone", name: "Stepping stones" }
    ]
  },
  "native-border": {
    type: "components",
    title: "Choose planting ideas to research",
    options: [
      { id: "native-aster", name: "Native aster (Symphyotrichum spp.)" },
      { id: "native-goldenrod", name: "Native goldenrod (Solidago spp.)" },
      { id: "native-sedge", name: "Locally native sedge (Carex spp.)" }
    ]
  }
};

const REFERENCE_SOURCES = [
  {
    id: "forest-gardening",
    label: "Agroforestry Research Trust: Forest gardening",
    url: "https://www.agroforestry.co.uk/about-agroforestry/forest-gardening/",
    note: "Describes the seven-layer framework and example species; not a local planting prescription."
  },
  {
    id: "umaine-vegetable-varieties",
    label: "University of Maine Cooperative Extension: Vegetable varieties",
    url: "https://extension.umaine.edu/publications/2190e/",
    note: "Example cultivar list; regional performance and publication date should be checked."
  },
  {
    id: "umaine-apple-pruning",
    label: "University of Maine Cooperative Extension: Renovating old apple trees",
    url: "https://extension.umaine.edu/publications/2409e/",
    note: "Discusses gradual pruning and cautions against severe renovation in one go."
  },
  {
    id: "umn-vegetable-planting",
    label: "University of Minnesota Extension: Planting the vegetable garden",
    url: "https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-in-minnesota/planting-vegetable-garden",
    note: "General crop timing and soil-test context; Minnesota timing does not transfer directly to Atlantic Canada."
  },
  {
    id: "umn-tomatoes",
    label: "University of Minnesota Extension: Growing tomatoes",
    url: "https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-in-minnesota/growing-tomatoes",
    note: "Source for the listed tomato sun, soil, and watering notes; Minnesota guidance is not an Atlantic Canada prescription."
  },
  {
    id: "umn-peas",
    label: "University of Minnesota Extension: Growing peas",
    url: "https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-in-minnesota/growing-peas",
    note: "Source for the listed pea sun, soil, temperature, and watering notes; Minnesota guidance is not an Atlantic Canada prescription."
  },
  {
    id: "umn-apples",
    label: "University of Minnesota Extension: Growing apples",
    url: "https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-in-minnesota/growing-apples",
    note: "Source for the listed apple cultivation and cultivar-table notes; Minnesota hardiness and harvest timing are not Atlantic Canada recommendations."
  }
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
