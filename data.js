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
  { id: "lettuce", name: "Lettuce", scientificName: "Lactuca sativa", profileId: "lettuce", maturityEditable: true },
  { id: "radish", name: "Table radish", scientificName: "Raphanus sativus", profileId: "radish", maturityEditable: true },
  { id: "carrot", name: "Carrot", scientificName: "Daucus carota", profileId: "carrot", maturityEditable: true },
  {
    id: "pea",
    name: "Pea",
    scientificName: "Pisum sativum",
    profileId: "pea",
    maturityEditable: true
  },
  { id: "bean", name: "Common bean (snap, shell, or dry; choose cultivar)", scientificName: "Phaseolus vulgaris", profileId: "commonBean", maturityEditable: true },
  {
    id: "tomato",
    name: "Tomato",
    scientificName: "Solanum lycopersicum",
    profileId: "tomato",
    maturityEditable: true
  },
  { id: "pepper", name: "Sweet pepper (bell/frying; choose cultivar)", scientificName: "Capsicum annuum", profileId: "sweetPepper", maturityEditable: true },
  { id: "cucumber", name: "Cucumber (choose use type and cultivar)", scientificName: "Cucumis sativus", profileId: "cucumber", maturityEditable: true },
  { id: "summer-squash", name: "Summer squash (e.g. zucchini; choose cultivar)", scientificName: "Cucurbita pepo", profileId: "summerSquash", maturityEditable: true },
  { id: "winter-squash-pepo", name: "Winter squash (Cucurbita pepo group; choose cultivar)", scientificName: "Cucurbita pepo", profileId: "winterSquashPepo", maturityEditable: true },
  { id: "winter-squash-maxima", name: "Hubbard / buttercup squash (choose cultivar)", scientificName: "Cucurbita maxima", profileId: "winterSquashMaxima", maturityEditable: true },
  { id: "butternut-squash", name: "Butternut squash (choose cultivar)", scientificName: "Cucurbita moschata", profileId: "butternutSquash", maturityEditable: true },
  { id: "kale", name: "Kale (choose cultivar)", scientificName: "Brassica oleracea (kale group)", profileId: "kale", maturityEditable: true },
  { id: "beet", name: "Garden beet (choose cultivar)", scientificName: "Beta vulgaris", profileId: "beet", maturityEditable: true },
  { id: "potato", name: "Potato (choose use and variety)", scientificName: "Solanum tuberosum", profileId: "potato", maturityEditable: true }
];

const APPLE_CULTIVARS = [
  {
    id: "cortland",
    name: "Cortland",
    scientificName: "Malus domestica 'Cortland'",
    profileId: "cortland",
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
    profileId: "haralson",
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
    profileId: "honeycrisp",
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
    profileId: "liberty",
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
    description: "Tallest woody layer in this framework. Mature size, shade, roots, and local suitability still need to be checked.",
    options: [
      { id: "apple", name: "Apple (Malus spp.)", scientificName: "Malus spp.", sourceId: "forest-gardening", profileId: "apple-layer", layerRole: "Canopy / overstory tree" },
      { id: "pear", name: "Pear (Pyrus communis)", scientificName: "Pyrus communis", sourceId: "forest-gardening", profileId: "pear-layer", layerRole: "Canopy / overstory tree" },
      { id: "plum", name: "Plum (Prunus domestica)", scientificName: "Prunus domestica", sourceId: "forest-gardening", profileId: "plum-layer", layerRole: "Canopy / overstory tree" },
      { id: "alder", name: "Alder (Alnus spp.)", scientificName: "Alnus spp.", sourceId: "forest-gardening", profileId: "alder-fixer", layerRole: "Canopy / overstory tree; also listed as a potential nitrogen-fixer role" }
    ]
  },
  {
    id: "understory",
    name: "2. Small tree / understory",
    description: "Smaller woody trees below or between canopy trees; the label is relative to the design and mature plant sizes.",
    options: [
      { id: "serviceberry", name: "Serviceberry (Amelanchier spp.)", scientificName: "Amelanchier spp.", sourceId: "forest-gardening", profileId: "serviceberry-layer", layerRole: "Small tree / large shrub" },
      { id: "dwarf-apple", name: "Dwarf apple (cultivar and rootstock not selected)", scientificName: "Malus spp.", sourceId: "forest-gardening", profileId: "apple-layer", layerRole: "Small tree / large shrub" }
    ]
  },
  {
    id: "shrub",
    name: "3. Shrub",
    description: "Woody shrubs below the tree strata; check mature spread and maintenance before placing.",
    options: [
      { id: "currant", name: "Currant (type unspecified)", scientificName: "Ribes spp.", sourceId: "forest-gardening", profileId: "currantGroup", layerRole: "Shrub" },
      { id: "aronia", name: "Chokeberry (Aronia spp.)", scientificName: "Aronia spp.", sourceId: "forest-gardening", profileId: "aronia-layer", layerRole: "Shrub" },
      { id: "elaeagnus", name: "Elaeagnus (Elaeagnus spp.)", scientificName: "Elaeagnus spp.", sourceId: "forest-gardening", profileId: "elaeagnus-fixer", layerRole: "Shrub; also listed as a potential nitrogen-fixer role" },
      { id: "shrub-lupin", name: "Shrub lupin (Lupinus arboreus)", scientificName: "Lupinus arboreus", sourceId: "forest-gardening", profileId: "shrub-lupin-fixer", layerRole: "Shrub; also listed as a potential nitrogen-fixer role" }
    ]
  },
  {
    id: "herbaceous",
    name: "4. Herbaceous / perennial",
    description: "Non-woody plants, including herbaceous perennials; choose by verified site requirements, not layer alone.",
    options: [
      { id: "comfrey", name: "Common comfrey (Symphytum officinale)", scientificName: "Symphytum officinale", sourceId: "forest-gardening", profileId: "commonComfrey", layerRole: "Herbaceous perennial; safety and spread caveats apply" },
      { id: "mint", name: "Mint (Mentha spp.)", scientificName: "Mentha spp.", sourceId: "forest-gardening", profileId: "mint-layer", layerRole: "Herbaceous perennial" },
      { id: "lemon-balm", name: "Lemon balm (Melissa officinalis)", scientificName: "Melissa officinalis", sourceId: "forest-gardening", profileId: "lemon-balm-layer", layerRole: "Herbaceous perennial" }
    ]
  },
  {
    id: "groundcover",
    name: "5. Groundcover",
    description: "Low-growing plants that occupy the ground plane; actual soil-cover performance is site- and species-specific.",
    options: [
      { id: "wild-ginger", name: "Canada wild ginger (Asarum canadense)", scientificName: "Asarum canadense", sourceId: "forest-gardening", profileId: "wildGinger", layerRole: "Groundcover" },
      { id: "bunchberry", name: "Bunchberry (Cornus canadensis)", scientificName: "Cornus canadensis", sourceId: "forest-gardening", profileId: "bunchberry-layer", layerRole: "Groundcover" },
      { id: "wintergreen", name: "Eastern spicy-wintergreen (Gaultheria procumbens)", scientificName: "Gaultheria procumbens", sourceId: "forest-gardening", profileId: "wintergreen", layerRole: "Groundcover" },
      { id: "creeping-raspberry", name: "Carpeting bramble (Rubus calycinoides / R. tricolor)", scientificName: "Rubus calycinoides / Rubus tricolor", sourceId: "forest-gardening", profileId: "carpeting-bramble-layer", layerRole: "Groundcover" }
    ]
  },
  {
    id: "rhizosphere",
    name: "6. Root / rhizosphere layer",
    description: "The framework's underground/root stratum. 'Rhizosphere' is the root-influenced soil zone; this is not simply a list of edible root crops.",
    options: [
      { id: "liquorice", name: "Liquorice (Glycyrrhiza spp.)", scientificName: "Glycyrrhiza spp.", sourceId: "forest-gardening", profileId: "liquorice-layer", layerRole: "Useful-root / rhizosphere example" },
      { id: "barberry-root", name: "Barberry (Berberis spp.)", scientificName: "Berberis spp.", sourceId: "forest-gardening", profileId: "barberry-layer", layerRole: "Useful-root / rhizosphere example" }
    ]
  },
  {
    id: "vine",
    name: "7. Climber / vine",
    description: "Climbing plants use vertical supports; check support, spread, and competition with other plants.",
    options: [
      { id: "grape", name: "Grape (Vitis spp.)", scientificName: "Vitis spp.", sourceId: "forest-gardening", profileId: "grape-layer", layerRole: "Climber / vine" },
      { id: "hardy-kiwi", name: "Hardy kiwi (Actinidia spp.)", scientificName: "Actinidia spp.", sourceId: "forest-gardening", profileId: "kiwi-layer", layerRole: "Climber / vine; source notes sturdy tree support" }
    ]
  }
];

const NITROGEN_FIXERS = [
  { id: "alder", name: "Alder (Alnus spp.)", scientificName: "Alnus spp.", sourceId: "forest-gardening", profileId: "alder-fixer", role: "Potential nitrogen-fixer function; also selectable in the canopy layer" },
  { id: "elaeagnus", name: "Elaeagnus (Elaeagnus spp.)", scientificName: "Elaeagnus spp.", sourceId: "forest-gardening", profileId: "elaeagnus-fixer", role: "Potential nitrogen-fixer function; also selectable in the shrub layer" },
  { id: "shrub-lupin", name: "Shrub lupin (Lupinus arboreus)", scientificName: "Lupinus arboreus", sourceId: "forest-gardening", profileId: "shrub-lupin-fixer", role: "Potential nitrogen-fixer function; also selectable in the shrub layer" }
];

const FACILITY_CONTENTS = {
  "garden-beds": { type: "plants", title: "Choose crops for this bed", options: VEGETABLE_PLANTS },
  greenhouse: { type: "plants", title: "Choose crops for this greenhouse", options: VEGETABLE_PLANTS },
  "berry-planting": {
    type: "components",
    title: "Choose a documented berry example to investigate",
    options: [
      { id: "blueberry", name: "Cultivated blueberry (type unspecified)", scientificName: "Vaccinium spp.", profileId: "blueberryGroup" },
      { id: "currant", name: "Currant (type unspecified)", scientificName: "Ribes spp.", profileId: "currantGroup" },
      { id: "raspberry", name: "Red raspberry (cultivar unspecified)", scientificName: "Rubus idaeus", profileId: "raspberry" }
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
    title: "Choose a source-backed species to investigate",
    options: [
      { id: "swamp-milkweed", name: "Swamp milkweed (Asclepias incarnata)", scientificName: "Asclepias incarnata", profileId: "swampMilkweed" }
    ]
  },
  "pollinator-patch": {
    type: "components",
    title: "Choose a documented flowering-plant example to investigate",
    options: [
      { id: "wild-bergamot", name: "Wild bergamot (Monarda fistulosa)", scientificName: "Monarda fistulosa", profileId: "wildBergamot" }
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
    title: "Choose a documented species to investigate",
    options: [
      { id: "wild-bergamot", name: "Wild bergamot (Monarda fistulosa)", scientificName: "Monarda fistulosa", profileId: "wildBergamot" },
      { id: "swamp-milkweed", name: "Swamp milkweed (Asclepias incarnata)", scientificName: "Asclepias incarnata", profileId: "swampMilkweed" }
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
  },
  {
    id: "umn-blueberries",
    label: "University of Minnesota Extension: Growing blueberries",
    url: "https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-in-minnesota/growing-blueberries-in-the-home-garden",
    note: "Home-garden growing and cultivar guidance is Minnesota-specific; do not treat it as an Atlantic Canada cultivar recommendation."
  },
  {
    id: "umn-currants",
    label: "University of Minnesota Extension: Growing currants and gooseberries",
    url: "https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-in-minnesota/growing-currants-and-gooseberries-in-the-home-garden",
    note: "Growing guidance is Minnesota-specific and distinguishes currant types; do not generalize a cultivar profile across Ribes."
  },
  {
    id: "umn-raspberries",
    label: "University of Minnesota Extension: Growing raspberries",
    url: "https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-in-minnesota/growing-raspberries-in-the-home-garden",
    note: "Growing guidance is Minnesota-specific; cultivar, cane type, and local performance still need checking."
  },
  {
    id: "umaine-raspberries",
    label: "University of Maine Cooperative Extension: Growing raspberries and blackberries",
    url: "https://extension.umaine.edu/publications/2066e/",
    note: "New England guidance, not a province-specific Atlantic Canada performance guarantee."
  },
  {
    id: "gobotany-canadense",
    label: "Native Plant Trust Go Botany: Canada wild ginger",
    url: "https://gobotany.nativeplanttrust.org/species/asarum/canadense/",
    note: "Botanical distribution and habitat information for Asarum canadense; not a food-use or horticultural prescription."
  },
  {
    id: "gobotany-procumbens",
    label: "Native Plant Trust Go Botany: Eastern spicy-wintergreen",
    url: "https://gobotany.nativeplanttrust.org/species/gaultheria/procumbens/",
    note: "Botanical distribution and habitat information for Gaultheria procumbens; the genus-level menu label is broader."
  },
  {
    id: "gobotany-incarnata",
    label: "Native Plant Trust Go Botany: Swamp milkweed",
    url: "https://gobotany.nativeplanttrust.org/species/asclepias/incarnata/",
    note: "Botanical range and habitat information for New England; not a blanket rain-garden or Atlantic Canada recommendation."
  },
  {
    id: "gobotany-fistulosa",
    label: "Native Plant Trust Go Botany: Wild bergamot",
    url: "https://gobotany.nativeplanttrust.org/species/monarda/fistulosa/",
    note: "Botanical range and ecology information for New England; variety and province-level suitability need checking."
  },
  {
    id: "ncstate-comfrey",
    label: "NC State Extension Plant Toolbox: Common comfrey",
    url: "https://plants.ces.ncsu.edu/plants/symphytum-officinale/",
    note: "Species-specific facts for Symphytum officinale; do not generalize to all comfrey species."
  },
  {
    id: "newengland-lettuce",
    label: "New England Vegetable Management Guide: Lettuce, endive, and escarole",
    url: "https://nevegetable.org/node/387/",
    note: "New England production guidance; commercial spacing and timing are not home-garden or Atlantic Canada prescriptions."
  },
  {
    id: "newengland-radish",
    label: "New England Vegetable Management Guide: Radish",
    url: "https://nevegetable.org/node/269/",
    note: "New England production guidance; planting dates and maturity conditions should not be transferred directly to Atlantic Canada."
  },
  {
    id: "newengland-carrot",
    label: "New England Vegetable Management Guide: Carrot and parsnip",
    url: "https://nevegetable.org/node/245/",
    note: "New England production guidance; commercial rates and spacing are not home-garden prescriptions."
  },
  {
    id: "newengland-bean",
    label: "New England Vegetable Management Guide: Bean",
    url: "https://nevegetable.org/node/239/",
    note: "Distinguishes bean species and uses; New England production timing is not an Atlantic Canada prescription."
  },
  {
    id: "umn-beans",
    label: "University of Minnesota Extension: Growing beans",
    url: "https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-in-minnesota/growing-beans",
    note: "Home-garden information is Minnesota-specific; cultivar and regional timing must be checked."
  },
  {
    id: "newengland-pepper",
    label: "New England Vegetable Management Guide: Pepper",
    url: "https://nevegetable.org/node/249/",
    note: "New England production guide; sweet/hot type and species distinctions matter."
  },
  {
    id: "umn-peppers",
    label: "University of Minnesota Extension: Growing peppers",
    url: "https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-in-minnesota/growing-peppers",
    note: "Home-garden guidance is Minnesota-specific; pepper types and cultivar performance vary."
  },
  {
    id: "newengland-cucumber",
    label: "New England Vegetable Management Guide: Cucumber, muskmelon, and watermelon",
    url: "https://nevegetable.org/node/257/",
    note: "New England production guidance; do not transfer planting dates or commercial rates to Atlantic Canada."
  },
  {
    id: "newengland-squash",
    label: "New England Vegetable Management Guide: Pumpkin, squash, and gourds",
    url: "https://nevegetable.org/node/275/",
    note: "Distinguishes Cucurbita species and use types; New England production timing is not an Atlantic Canada prescription."
  },
  {
    id: "newengland-kale",
    label: "New England Vegetable Management Guide: Brassica crops",
    url: "https://nevegetable.org/node/243/",
    note: "New England production guidance; some content is commercial-scale and regional."
  },
  {
    id: "newengland-beet",
    label: "New England Vegetable Management Guide: Beet and Swiss chard",
    url: "https://nevegetable.org/node/241/",
    note: "New England production guidance; taxonomy and commercial production rates require context."
  },
  {
    id: "newengland-potato",
    label: "New England Vegetable Management Guide: Potato",
    url: "https://nevegetable.org/node/311/",
    note: "Production-oriented New England guidance; not a complete home-garden recommendation."
  },
  {
    id: "gnb-apples",
    label: "Government of New Brunswick: Apples",
    url: "https://www2.gnb.ca/content/gnb/en/departments/10/agriculture/content/crops/apples.html",
    note: "Commercial crop context and linked orchard resources; not a home-orchard cultivar guide."
  },
  {
    id: "gnb-apple-site",
    label: "Government of New Brunswick: Site selection for productive apple orchards",
    url: "https://www2.gnb.ca/content/gnb/en/departments/10/agriculture/content/crops/apples/site_selection.html",
    note: "Regional orchard site-selection facts; still requires evaluation of the specific soil and microclimate."
  },
  {
    id: "gnb-potatoes",
    label: "Government of New Brunswick: Potatoes",
    url: "https://www2.gnb.ca/content/gnb/en/departments/10/agriculture/content/crops/potatoes.html",
    note: "Commercial production resources, not a household growing guide."
  },
  {
    id: "gnb-potato-varieties",
    label: "Government of New Brunswick: Potato variety development and selection",
    url: "https://www2.gnb.ca/content/gnb/en/departments/10/agriculture/content/crops/potatoes/variety.html",
    note: "Supports choosing varieties for local adaptation and small-scale testing; not a home-garden care guide."
  },
  {
    id: "gnb-small-fruits",
    label: "Government of New Brunswick: Small fruits",
    url: "https://www2.gnb.ca/content/gnb/en/departments/10/agriculture/content/crops/small_fruits.html",
    note: "Regional commercial-sector context; does not provide home-garden growing or cultivar recommendations."
  },
  {
    id: "gnb-wild-blueberries",
    label: "Government of New Brunswick: Wild blueberries",
    url: "https://www2.gnb.ca/content/gnb/en/departments/10/agriculture/content/crops/wild_blueberries.html",
    note: "Wild blueberry sector information is not a highbush blueberry home-garden guide."
  }
];

const BED_WATERING_APPLICATIONS = {
  drip: "soil",
  soaker: "soil",
  hand: "soil",
  overhead: "foliage"
};

const PLANT_PROFILES = {
  pea: {
    name: "Pea",
    scientificName: "Pisum sativum",
    profileStatus: "Species-level facts are sourced from Minnesota Extension; this is not Atlantic Canada growing advice.",
    scopeNote: "Facts below come from University of Minnesota Extension. Regional season, frost dates, variety performance, and timing are not established for Atlantic Canada.",
    sourceIds: ["umn-peas"],
    facts: [
      { category: "Light and soil", text: "Needs full sun. Well-drained soil is advised; the source gives a pH range of 6.0–7.5." },
      { category: "Temperature and season", text: "The source identifies 55–65°F as a good growing-temperature range. It reports that hot weather above 85°F can stop flowering and pod production." },
      { category: "Water", text: "Water soil rather than vines. The source suggests soaking to at least 1 inch per week during the growing season; rain, spring conditions, and sandy soil can change watering needs." },
      { category: "Habit and support", text: "The source describes tall vining varieties reaching about 5 feet and bush types reaching about 2–3 feet; check the chosen variety and provide support as needed." },
      { category: "Planting and harvest", text: "The source says most varieties need about 60 days before harvest and gives Minnesota-specific spring planting advice. Use the seed packet and local frost information for timing." },
      { category: "Soil amendments", text: "The source notes peas need less fertilizer than other crops and recommends soil-test context; it does not support a universal fertilizer rate." }
    ],
    unknowns: [
      "Atlantic Canada-specific planting dates, frost windows, and cultivar performance.",
      "The chosen cultivar's maturity, disease resistance, and growth habit.",
      "A fertilizer prescription without a soil test."
    ],
    fit: { exposure: ["full"], wateringApplication: ["soil"] }
  },
  tomato: {
    name: "Tomato",
    scientificName: "Solanum lycopersicum",
    profileStatus: "Species-level facts are sourced from Minnesota Extension; this is not Atlantic Canada growing advice.",
    scopeNote: "Facts below come from University of Minnesota Extension. Minnesota's frost calendar and climate do not transfer directly to Atlantic Canada.",
    sourceIds: ["umn-tomatoes"],
    facts: [
      { category: "Light and season", text: "Requires full sun and a long, frost-free growing season." },
      { category: "Soil", text: "The source gives pH 5.5–7.0 as ideal and advises using soil-test results to guide fertilizer decisions." },
      { category: "Water", text: "Maintain consistent soil moisture; avoid overhead sprinkling and soak the soil thoroughly. The source gives about 1 inch of rainfall or irrigation per week as ideal, with sandy soil potentially needing more frequent watering." },
      { category: "Growth and support", text: "The source describes bush types as typically 24–30 inches and not needing support, while vining types need support and may grow 3–5 feet or more. Check the selected cultivar." },
      { category: "Starting and transplanting", text: "The source suggests starting seed indoors 5–6 weeks before outdoor planting and transplanting after frost danger and adequate soil warming; these timing cues are Minnesota guidance, not Atlantic Canada dates." }
    ],
    unknowns: [
      "Atlantic Canada-specific cultivar performance, frost dates, and planting calendar.",
      "The chosen cultivar's growth habit, maturity, disease resistance, and fruit traits.",
      "Soil-test results and a site-specific fertilizer need."
    ],
    fit: { exposure: ["full"], wateringApplication: ["soil"] }
  },
  cortland: {
    name: "Cortland",
    scientificName: "Malus domestica 'Cortland'",
    profileStatus: "Cultivar-table facts are sourced from Minnesota Extension; not an Atlantic Canada recommendation.",
    scopeNote: "Cultivar table and cultivation notes are from University of Minnesota Extension. Minnesota hardiness and harvest timing are not local performance predictions.",
    sourceIds: ["umn-apples"],
    facts: [
      { category: "Cultivar record", text: "The Minnesota table lists good-to-fair hardiness for USDA zones 4 to 3, average harvest from late September to early October, and uses including fresh eating, cooking, and salad." },
      { category: "Fruit and disease notes", text: "The table describes medium-sized fruit and susceptibility to apple scab and fire blight." },
      { category: "General apple care (source scope)", text: "The source says apple trees need at least 8 hours of sun, soil pH 6–7, and well-drained soil without standing water. Tree size depends strongly on rootstock." },
      { category: "Pollination", text: "The source says apples need pollen from a different variety and discusses a nearby crabapple as a possible pollen source. Bloom overlap and compatibility of any particular pair must be checked." }
    ],
    unknowns: ["Atlantic Canada hardiness, bloom overlap, harvest date, disease response, and local performance for this cultivar.", "Rootstock identity, final tree size, and compatible pollinizer at the actual site."]
  },
  haralson: {
    name: "Haralson",
    scientificName: "Malus domestica 'Haralson'",
    profileStatus: "Cultivar-table facts are sourced from Minnesota Extension; not an Atlantic Canada recommendation.",
    scopeNote: "Cultivar table and cultivation notes are from University of Minnesota Extension. Minnesota hardiness and harvest timing are not local performance predictions.",
    sourceIds: ["umn-apples"],
    facts: [
      { category: "Cultivar record", text: "The Minnesota table lists very-good-to-good hardiness for USDA zones 4 to 3, average harvest from late September to early October, and fresh-eating/cooking uses; it notes the fruit is good for pie." },
      { category: "Fruit and disease notes", text: "The table describes medium fruit and reports some resistance to apple scab and fire blight." },
      { category: "General apple care (source scope)", text: "The source says apple trees need at least 8 hours of sun, soil pH 6–7, and well-drained soil without standing water. Tree size depends strongly on rootstock." },
      { category: "Pollination", text: "The source says apples need pollen from a different variety and discusses a nearby crabapple as a possible pollen source. Bloom overlap and compatibility of any particular pair must be checked." }
    ],
    unknowns: ["Atlantic Canada hardiness, bloom overlap, harvest date, disease response, and local performance for this cultivar.", "Rootstock identity, final tree size, and compatible pollinizer at the actual site."]
  },
  honeycrisp: {
    name: "Honeycrisp",
    scientificName: "Malus domestica 'Honeycrisp'",
    profileStatus: "Cultivar-table facts are sourced from Minnesota Extension; not an Atlantic Canada recommendation.",
    scopeNote: "Cultivar table and cultivation notes are from University of Minnesota Extension. Minnesota hardiness and harvest timing are not local performance predictions.",
    sourceIds: ["umn-apples"],
    facts: [
      { category: "Cultivar record", text: "The Minnesota table lists very-good-to-good hardiness for USDA zones 4 to 3, average harvest in late September, and best use as fresh eating; it is also listed as good for cooking." },
      { category: "Fruit and disease notes", text: "The table describes medium-large fruit as very juicy and crisp and reports some resistance to apple scab and fire blight." },
      { category: "General apple care (source scope)", text: "The source says apple trees need at least 8 hours of sun, soil pH 6–7, and well-drained soil without standing water. Tree size depends strongly on rootstock." },
      { category: "Pollination", text: "The source says apples need pollen from a different variety and discusses a nearby crabapple as a possible pollen source. Bloom overlap and compatibility of any particular pair must be checked." }
    ],
    unknowns: ["Atlantic Canada hardiness, bloom overlap, harvest date, disease response, and local performance for this cultivar.", "Rootstock identity, final tree size, and compatible pollinizer at the actual site."]
  },
  liberty: {
    name: "Liberty",
    scientificName: "Malus domestica 'Liberty'",
    profileStatus: "Cultivar-table facts are sourced from Minnesota Extension; not an Atlantic Canada recommendation.",
    scopeNote: "Cultivar table and cultivation notes are from University of Minnesota Extension. Minnesota hardiness and harvest timing are not local performance predictions.",
    sourceIds: ["umn-apples"],
    facts: [
      { category: "Cultivar record", text: "The Minnesota table lists good-to-fair hardiness for USDA zones 4 to 3, average harvest in early October, and fresh-eating/cooking uses." },
      { category: "Fruit and disease notes", text: "The table describes medium fruit and calls the cultivar immune to apple scab and resistant to fire blight." },
      { category: "General apple care (source scope)", text: "The source says apple trees need at least 8 hours of sun, soil pH 6–7, and well-drained soil without standing water. Tree size depends strongly on rootstock." },
      { category: "Pollination", text: "The source says apples need pollen from a different variety and discusses a nearby crabapple as a possible pollen source. Bloom overlap and compatibility of any particular pair must be checked." }
    ],
    unknowns: ["Atlantic Canada hardiness, bloom overlap, harvest date, disease response, and local performance for this cultivar.", "Rootstock identity, final tree size, and compatible pollinizer at the actual site."]
  },
  blueberryGroup: {
    name: "Cultivated blueberry (type not specified)",
    scientificName: "Vaccinium spp. (the selected species is not specified)",
    profileStatus: "Group-level cultivation notes only; species, cultivar, and Atlantic Canada suitability are not established.",
    scopeNote: "Guidance is from University of Minnesota Extension. Blueberry species and cultivars differ; these facts are not a cultivar or Atlantic Canada recommendation.",
    sourceIds: ["umn-blueberries"],
    facts: [
      { category: "Light and soil", text: "The source recommends full sun and acidic soil, with a stated pH range of 4–5." },
      { category: "Pollination", text: "The source recommends planting two or more varieties for pollination; cultivar bloom overlap for a chosen pair is not established here." },
      { category: "Growth and maintenance", text: "The source says blueberry plants grow slowly and may take about 8–10 years to reach full size; it recommends annual pruning of old, weak, or dead wood." }
    ],
    unknowns: ["The blueberry species and cultivar represented by the plan.", "Cultivar-specific mature size, hardiness, harvest, pollination compatibility, and performance in Atlantic Canada.", "Site soil pH and drainage."]
  },
  currantGroup: {
    name: "Currant (type not specified)",
    scientificName: "Ribes spp. (the selected species is not specified)",
    profileStatus: "Group-level cultivation notes only; currant type, cultivar, and Atlantic Canada suitability are not established.",
    scopeNote: "Guidance is from University of Minnesota Extension. Red/white currants and black currants are treated as distinct types; facts for one must not be generalized to all Ribes.",
    sourceIds: ["umn-currants"],
    facts: [
      { category: "Light and site", text: "The source says currants and gooseberries tolerate full sun to partial shade, with better fruiting in sunnier sites." },
      { category: "Soil and spacing", text: "The source prefers rich, well-drained soil and gives at least 3 feet as a spacing minimum for the described plants." },
      { category: "Pollination and maintenance", text: "The source says most currants are self-fruitful and advises annual pruning. It reports fruit may begin 1–3 years after planting." }
    ],
    unknowns: ["Whether this entry means red, white, or black currant, and the cultivar.", "Cultivar-specific hardiness, harvest, disease resistance, and Atlantic Canada performance.", "Site soil and spacing needs for the chosen variety."]
  },
  raspberry: {
    name: "Red raspberry (cultivar not specified)",
    scientificName: "Rubus idaeus",
    profileStatus: "Species-level growing notes from Maine and Minnesota Extension; no cultivar or province-specific guarantee.",
    scopeNote: "Sources cover New England and Minnesota. They do not establish performance, cultivars, or planting dates for a particular Atlantic Canadian site.",
    sourceIds: ["umaine-raspberries", "umn-raspberries"],
    facts: [
      { category: "Light and soil", text: "The Maine source says red raspberries are adaptable in New England and prefer full sun, well-drained sandy loam rich in organic matter, with soil pH 5.6–6.2." },
      { category: "Pollination", text: "The Minnesota source identifies bees as important pollinators." },
      { category: "Growth and maintenance", text: "The sources describe raspberry canes as having a two-year life cycle and requiring annual pruning. The Minnesota source warns that red/yellow types can spread." },
      { category: "Harvest", text: "The Minnesota source says fruiting may begin the year after planting; actual timing depends on the type and cultivar." }
    ],
    unknowns: ["Cultivar, cane/fruiting type, local disease pressure, and province-specific performance.", "Exact local harvest dates, mature dimensions, and support/spacing for the selected cultivar.", "Site soil test, drainage, and current pest/disease diagnosis."]
  },
  lettuce: {
    name: "Lettuce",
    scientificName: "Lactuca sativa",
    profileStatus: "Crop-level facts sourced from a New England production guide; not an Atlantic Canada prescription.",
    scopeNote: "The New England Vegetable Management Guide is a nearby-region production reference, not a local household growing recommendation. Its commercial spacings are omitted.",
    sourceIds: ["newengland-lettuce"],
    facts: [
      { category: "Season and crop types", text: "The guide describes lettuce as a cool-season crop with spring and fall as major New England production seasons. It distinguishes crisphead, butterhead, romaine, leaf, and one-cut types." },
      { category: "Plant health", text: "The guide notes inadequate water and calcium as factors that may contribute to tipburn." }
    ],
    unknowns: ["Cultivar-specific timing, spacing, light, soil, irrigation, disease resistance, and local performance.", "Atlantic Canada planting dates and frost windows."]
  },
  radish: {
    name: "Table radish (cultivar not specified)",
    scientificName: "Raphanus sativus",
    profileStatus: "Crop facts sourced from a New England production guide; local planting dates are not verified.",
    scopeNote: "The source distinguishes table radishes and daikons. The planting windows it lists are New England guidance, not Atlantic Canada dates.",
    sourceIds: ["newengland-radish"],
    facts: [
      { category: "Crop types", text: "Table radishes and daikons differ in shape and use; daikon production is associated with cool temperatures and short days." },
      { category: "Maturity", text: "The guide gives 21–28 days in ideal conditions and 40–50 days in cold weather; these are source-specific ranges, not a guarantee for a chosen cultivar." },
      { category: "Soil and water", text: "Loose, well-drained soil and consistent moisture support root quality. The guide says heat and low moisture can increase pungency and bolting." },
      { category: "Season", text: "The guide lists early spring and August planting windows for New England; do not use these as local dates without checking regional advice." }
    ],
    unknowns: ["Specific cultivar, radish type, local maturity, and Atlantic Canada planting calendar.", "The actual bed's soil texture, moisture, and drainage."]
  },
  carrot: {
    name: "Carrot",
    scientificName: "Daucus carota",
    profileStatus: "Crop facts sourced from a New England production guide; some reported rates are production-context data.",
    scopeNote: "The New England Vegetable Management Guide is a production reference. Its water and planting figures should not be treated as a measured home-bed prescription or Atlantic Canada calendar.",
    sourceIds: ["newengland-carrot"],
    facts: [
      { category: "Soil and roots", text: "The guide associates deep, well-drained soil—ideally sandy loam or muck—with root development and notes raised beds can increase tilled depth." },
      { category: "Germination and sowing", text: "The guide emphasizes constant moisture during slow germination and gives a sowing depth of 0.5–0.75 inches." },
      { category: "Water and harvest quality", text: "The guide reports 1–1.5 inches of water per week in its production context and warns excess water near harvest can split roots. This is not a universal home-garden watering schedule." }
    ],
    unknowns: ["Cultivar-specific maturity, spacing, storage, and disease resistance.", "Atlantic Canada planting dates and site-specific irrigation needs."]
  },
  commonBean: {
    name: "Common bean (choose use and cultivar)",
    scientificName: "Phaseolus vulgaris",
    profileStatus: "Common-bean facts from New England and Minnesota guides; other bean species are not included.",
    scopeNote: "The sources distinguish common bean from runner, lima, soybean, and fava beans. These facts apply only to common bean and are not an Atlantic Canada calendar.",
    sourceIds: ["newengland-bean", "umn-beans"],
    facts: [
      { category: "Uses and habit", text: "Common beans include snap, shell, and dry-bean uses. UMN describes bush beans as upright and about 2 feet tall, and pole beans as climbing types that need support." },
      { category: "Temperature", text: "The New England guide advises planting after soil reaches 60°F and reports that temperatures above 90°F or below 50°F can impair pod set." },
      { category: "Harvest", text: "Harvest stage depends on use: snap beans are picked as pods, while shell and dry beans are harvested at different maturity stages. Follow the selected cultivar and intended use." }
    ],
    unknowns: ["Specific common-bean cultivar, maturity, disease resistance, and local performance.", "Type-specific spacing and Atlantic Canada planting dates."]
  },
  sweetPepper: {
    name: "Sweet pepper (type/cultivar not specified)",
    scientificName: "Capsicum annuum",
    profileStatus: "Crop facts sourced from New England and Minnesota guides; cultivar and region-specific performance are unverified.",
    scopeNote: "Sources describe sweet pepper types and New England/Minnesota conditions. Do not apply this scientific name to hot-pepper cultivars without checking their taxonomy.",
    sourceIds: ["newengland-pepper", "umn-peppers"],
    facts: [
      { category: "Crop type and season", text: "The New England guide treats pepper as a warm-season crop, distinguishes bell, sweet frying, and hot types, and describes production from transplants." },
      { category: "Harvest", text: "The guide reports green-fruit production beginning around 55–60 days after transplanting, with roughly 20 additional days for colored fruit; cultivar and conditions affect timing." },
      { category: "Temperature", text: "The guide gives a 3–4 month frost-free period in its production context; this is not an Atlantic Canada guarantee or planting calendar." }
    ],
    unknowns: ["Exact sweet-pepper type and cultivar, days to maturity, disease resistance, and local performance.", "Atlantic Canada transplant timing and frost-free window."]
  },
  cucumber: {
    name: "Cucumber (type/cultivar not specified)",
    scientificName: "Cucumis sativus",
    profileStatus: "Crop facts sourced from a New England production guide; not an Atlantic Canada planting recommendation.",
    scopeNote: "The New England guide distinguishes cucumber market/use types. Type-specific cultivar, support, timing, and spacing are not verified for this plan.",
    sourceIds: ["newengland-cucumber"],
    facts: [
      { category: "Season and temperature", text: "The guide describes cucumbers as tender, warm-season crops that do not tolerate chilling or soil temperatures below 55°F." },
      { category: "Crop types", text: "The guide distinguishes pickling, slicing, Asian, European, and Beit Alpha cucumber types; fruit form and intended use vary." }
    ],
    unknowns: ["Specific cucumber type/cultivar, trellising, spacing, maturity, disease resistance, and local planting dates."]
  },
  summerSquash: {
    name: "Summer squash (cultivar not specified)",
    scientificName: "Cucurbita pepo",
    profileStatus: "Type facts sourced from a New England production guide; cultivar and local timing are not verified.",
    scopeNote: "The New England guide identifies summer squash examples within Cucurbita pepo. These crop facts are not a regional planting prescription.",
    sourceIds: ["newengland-squash"],
    facts: [
      { category: "Identity and harvest", text: "The guide places summer squash such as zucchini, yellow squash, and patty pan within C. pepo and describes harvest every 1–3 days while fruits are being produced." }
    ],
    unknowns: ["Cultivar-specific size, maturity, disease resistance, soil, spacing, and Atlantic Canada planting dates."]
  },
  winterSquashPepo: {
    name: "Winter squash (Cucurbita pepo group; cultivar not specified)",
    scientificName: "Cucurbita pepo",
    profileStatus: "Type facts sourced from a New England production guide; cultivar and local timing are not verified.",
    scopeNote: "Some winter squash are C. pepo; the common name alone does not determine species or cultivar.",
    sourceIds: ["newengland-squash"],
    facts: [
      { category: "Identity and harvest", text: "The guide says some winter squash are C. pepo and that winter squash is harvested once at the end of the season, unlike summer squash harvested repeatedly." }
    ],
    unknowns: ["Whether this plan's winter squash is C. pepo, C. maxima, or C. moschata, and the cultivar.", "Cultivar-specific maturity, storage, size, disease resistance, and local season."]
  },
  winterSquashMaxima: {
    name: "Hubbard / buttercup squash (cultivar not specified)",
    scientificName: "Cucurbita maxima",
    profileStatus: "Species/type facts sourced from a New England production guide; cultivar and local timing are not verified.",
    scopeNote: "The New England guide identifies Hubbard and buttercup examples as C. maxima. This is not a cultivar or Atlantic Canada recommendation.",
    sourceIds: ["newengland-squash"],
    facts: [
      { category: "Identity and harvest", text: "The guide places Hubbard and buttercup winter squash in C. maxima and describes winter squash as harvested once at season's end." }
    ],
    unknowns: ["Exact cultivar, maturity, storage, mature vine size, and Atlantic Canada performance."]
  },
  butternutSquash: {
    name: "Butternut squash (cultivar not specified)",
    scientificName: "Cucurbita moschata",
    profileStatus: "Species/type facts sourced from a New England production guide; cultivar and local timing are not verified.",
    scopeNote: "The New England guide identifies butternut as C. moschata. This is not a cultivar or Atlantic Canada recommendation.",
    sourceIds: ["newengland-squash"],
    facts: [
      { category: "Identity and harvest", text: "The guide places butternut squash in C. moschata and describes winter squash as harvested once at season's end." }
    ],
    unknowns: ["Exact cultivar, maturity, storage, mature vine size, and Atlantic Canada performance."]
  },
  kale: {
    name: "Kale (cultivar not specified)",
    scientificName: "Brassica oleracea (kale group)",
    profileStatus: "Crop facts sourced from a New England production guide; not an Atlantic Canada planting recommendation.",
    scopeNote: "The source is a New England production guide. It does not establish a local home-garden planting calendar or cultivar performance.",
    sourceIds: ["newengland-kale"],
    facts: [
      { category: "Season and harvest", text: "The guide describes kale as cold-hardy, says it grows well as a fall crop for full-size leaves, and notes leaf flavor improves after a light frost." },
      { category: "Succession", text: "The guide says kale can also be succession-planted through the season; specific dates depend on region and cultivar." }
    ],
    unknowns: ["Cultivar-specific maturity, disease resistance, spacing, and Atlantic Canada planting dates."]
  },
  beet: {
    name: "Garden beet (cultivar not specified)",
    scientificName: "Beta vulgaris (the guide reports var. crassa)",
    profileStatus: "Crop facts sourced from a New England production guide; taxonomy is shown as reported by that source.",
    scopeNote: "The guide reports the name Beta vulgaris var. crassa. This is a source-reported taxonomy note, not a claim that it is the only current taxonomic treatment.",
    sourceIds: ["newengland-beet"],
    facts: [
      { category: "Season and temperature", text: "The guide describes beets as cool-season and able to tolerate frost/light freezes; it reports best quality in sun and cool temperatures around 50–65°F." },
      { category: "Soil and moisture", text: "The guide prefers deep, friable, well-drained sandy loam to silt loam and adequate moisture." },
      { category: "Fertility", text: "The guide warns that excessive nitrogen relative to phosphorus and potassium can favor leaf growth over roots. This is not a fertilizer prescription for an untested home bed." }
    ],
    unknowns: ["Cultivar-specific maturity, spacing, and disease resistance.", "Atlantic Canada planting dates and soil-test results."]
  },
  potato: {
    name: "Potato (variety not specified)",
    scientificName: "Solanum tuberosum",
    profileStatus: "Facts sourced from New England production guidance and New Brunswick variety-selection resources; not a home-garden cultivar recommendation.",
    scopeNote: "The New England source is production-oriented; New Brunswick sources concern commercial potato varieties. Keep their context and do not infer a home-bed rate or variety recommendation.",
    sourceIds: ["newengland-potato", "gnb-potato-varieties"],
    facts: [
      { category: "Temperature and soil", text: "The New England guide describes potato as a cool-season crop, with best yields when average growing-season temperatures are slightly below 70°F, and prefers well-drained, medium-textured soil." },
      { category: "Variety selection", text: "New Brunswick guidance emphasizes local adaptation, disease resistance, and intended use, and recommends testing a small area when trialing a variety new to a farm's soil or microclimate." }
    ],
    unknowns: ["Specific variety, intended use, disease resistance, storage characteristics, and Atlantic home-garden performance.", "Site soil, drainage, rotation history, and local planting dates."]
  }
};

const FOREST_GARDEN_REFERENCE_EXAMPLES = [
  { id: "apple-layer", name: "Apple (Malus spp.)", scientificName: "Malus spp.", layer: "canopy trees" },
  { id: "pear-layer", name: "Pear (Pyrus communis)", scientificName: "Pyrus communis", layer: "canopy trees" },
  { id: "plum-layer", name: "Plum (Prunus domestica)", scientificName: "Prunus domestica", layer: "canopy trees" },
  { id: "serviceberry-layer", name: "Serviceberry (Amelanchier spp.)", scientificName: "Amelanchier spp.", layer: "small trees and large shrubs" },
  { id: "currant-layer", name: "Currant (Ribes spp.; type unspecified)", scientificName: "Ribes spp.", layer: "shrubs" },
  { id: "aronia-layer", name: "Chokeberry (Aronia spp.)", scientificName: "Aronia spp.", layer: "shrubs" },
  { id: "comfrey-layer", name: "Comfrey (Symphytum spp.)", scientificName: "Symphytum spp.", layer: "herbaceous perennials" },
  { id: "mint-layer", name: "Mint (Mentha spp.)", scientificName: "Mentha spp.", layer: "herbaceous perennials" },
  { id: "lemon-balm-layer", name: "Lemon balm", scientificName: "Melissa officinalis", layer: "herbaceous perennials" },
  { id: "ginger-layer", name: "Canada wild ginger", scientificName: "Asarum canadense", layer: "ground covers" },
  { id: "bunchberry-layer", name: "Bunchberry", scientificName: "Cornus canadensis", layer: "ground covers" },
  { id: "wintergreen-layer", name: "Eastern spicy-wintergreen", scientificName: "Gaultheria procumbens", layer: "ground covers" },
  { id: "carpeting-bramble-layer", name: "Carpeting bramble", scientificName: "Rubus calycinoides / Rubus tricolor", layer: "ground covers" },
  { id: "liquorice-layer", name: "Liquorice (Glycyrrhiza spp.)", scientificName: "Glycyrrhiza spp.", layer: "rhizosphere" },
  { id: "barberry-layer", name: "Barberry (Berberis spp.)", scientificName: "Berberis spp.", layer: "rhizosphere" },
  { id: "grape-layer", name: "Grape (Vitis spp.)", scientificName: "Vitis spp.", layer: "climbers and vines" },
  { id: "kiwi-layer", name: "Hardy kiwi (Actinidia spp.)", scientificName: "Actinidia spp.", layer: "climbers and vines" },
  { id: "alder-fixer", name: "Alder (Alnus spp.)", scientificName: "Alnus spp.", layer: "nitrogen-fixer examples", role: "nitrogen-fixer candidate" },
  { id: "elaeagnus-fixer", name: "Elaeagnus (Elaeagnus spp.)", scientificName: "Elaeagnus spp.", layer: "nitrogen-fixer examples", role: "nitrogen-fixer candidate" },
  { id: "shrub-lupin-fixer", name: "Shrub lupin", scientificName: "Lupinus arboreus", layer: "nitrogen-fixer examples", role: "nitrogen-fixer candidate" }
];

FOREST_GARDEN_REFERENCE_EXAMPLES.forEach(function (entry) {
  PLANT_PROFILES[entry.id] = {
    name: entry.name,
    scientificName: entry.scientificName,
    profileStatus: "Source-verified as a forest-garden example only; a species-level site-care profile is not established.",
    scopeNote: "The Agroforestry Research Trust lists this taxon as an example in a forest-garden layer. It does not establish Atlantic Canada suitability or compatibility with other selected plants.",
    sourceIds: ["forest-gardening"],
    layerRole: entry.role ? entry.role + " (source example)" : "Example in the source's " + entry.layer + " list",
    facts: [
      { category: "Verified reference", text: "The source includes this taxon as an example for " + entry.layer + "." }
    ],
    unknowns: [
      "Species-level light, soil, moisture, mature dimensions, and maintenance for the exact local plant.",
      "Atlantic Canada hardiness, availability, ecological status, and site suitability.",
      "Compatibility, yield effects, pest control, or nutrient transfer to neighboring plants."
    ]
  };
});

Object.assign(PLANT_PROFILES, {
  appleTree: {
    name: "Apple",
    scientificName: "Malus domestica",
    profileStatus: "General cultivation facts from Minnesota Extension; not an Atlantic Canada home-orchard recommendation.",
    scopeNote: "The growing notes are Minnesota-specific. New Brunswick resources linked here cover commercial orchard context and site selection, not a home-orchard cultivar list.",
    sourceIds: ["umn-apples", "gnb-apples", "gnb-apple-site"],
    facts: [
      { category: "Sun, soil, and size", text: "The Minnesota source says apple trees need at least 8 hours of sun, soil pH 6–7, and well-drained soil without standing water. Tree size depends strongly on rootstock." },
      { category: "Regional source scope", text: "New Brunswick's linked apple resources provide commercial orchard and site-selection context; they do not establish which cultivar or rootstock suits a particular home property." }
    ],
    unknowns: [
      "Atlantic Canada home-orchard cultivar and rootstock performance, hardiness, and disease resistance.",
      "Bloom overlap and pollination needs for the chosen cultivars.",
      "The property's soil test, drainage, frost exposure, and suitable rootstock."
    ]
  },
  wildGinger: {
    name: "Canada wild ginger",
    scientificName: "Asarum canadense",
    profileStatus: "Botanical distribution and habitat facts from Native Plant Trust; not a food-use or Atlantic-wide recommendation.",
    scopeNote: "The source covers New England, including Maine. It does not establish occurrence or suitability throughout Atlantic Canada.",
    sourceIds: ["gobotany-canadense", "forest-gardening"],
    facts: [
      { category: "Habitat", text: "The botanical source describes the species in rich, moist forests in much of New England, including Maine." },
      { category: "Identity", text: "The source notes that Canada wild ginger is unrelated to culinary ginger." },
      { category: "Forest-garden reference", text: "The Agroforestry Research Trust lists wild gingers (Asarum spp.) among ground-cover examples." }
    ],
    unknowns: ["Province-specific native status, site suitability, mature dimensions, and propagation.", "Do not infer that the plant is a culinary ginger or food crop."]
  },
  wintergreen: {
    name: "Eastern spicy-wintergreen",
    scientificName: "Gaultheria procumbens",
    profileStatus: "Botanical distribution and habitat facts from Native Plant Trust; not a food-use or Atlantic-wide recommendation.",
    scopeNote: "The source covers New England and reports habitat associations; it does not establish suitability for a particular Atlantic Canadian site.",
    sourceIds: ["gobotany-procumbens", "forest-gardening"],
    facts: [
      { category: "Habitat", text: "The botanical source reports this species in the understory of acidic forests throughout New England." },
      { category: "Forest-garden reference", text: "The Agroforestry Research Trust lists Gaultheria spp. among ground-cover examples." }
    ],
    unknowns: ["Province-specific native status, site soil test, care, mature dimensions, and propagation.", "Do not infer edibility or medicinal safety from a botanical profile."]
  },
  swampMilkweed: {
    name: "Swamp milkweed",
    scientificName: "Asclepias incarnata",
    profileStatus: "Botanical range and habitat facts from Native Plant Trust; not a general rain-garden recommendation.",
    scopeNote: "The source covers New England, including Maine. A wetland association does not establish suitability for every rain garden or Atlantic Canadian property.",
    sourceIds: ["gobotany-incarnata"],
    facts: [
      { category: "Habitat", text: "The botanical source describes wetlands, marshes, wet shores, and wetland margins as habitat." }
    ],
    unknowns: ["Province-specific occurrence, garden performance, mature dimensions, soil and water tolerances, and wildlife effects at a particular site."]
  },
  wildBergamot: {
    name: "Wild bergamot",
    scientificName: "Monarda fistulosa",
    profileStatus: "Botanical range and ecology facts from Native Plant Trust; not an Atlantic-wide native-plant recommendation.",
    scopeNote: "The source covers New England, not every Atlantic Canadian province or ecoregion.",
    sourceIds: ["gobotany-fistulosa"],
    facts: [
      { category: "Range and ecology", text: "The source reports native varieties in New England and notes attraction of butterflies." },
      { category: "Variety caution", text: "The source notes that one variety, M. fistulosa var. rubra, is an escaped cultivar; confirm plant identity before selection." }
    ],
    unknowns: ["Province-specific native status, cultivar identity, site-care requirements, and measured wildlife benefit on a specific property."]
  },
  commonComfrey: {
    name: "Common comfrey",
    scientificName: "Symphytum officinale",
    profileStatus: "Species-specific facts from NC State Extension; not an Atlantic Canada planting or invasive-status recommendation.",
    scopeNote: "The safety and propagation notes are specific to Symphytum officinale and must not be generalized to all comfrey species. Atlantic Canada status and local use are not established.",
    sourceIds: ["ncstate-comfrey", "forest-gardening"],
    warnings: ["Do not present as an edible plant: the source says common comfrey is no longer considered safe for consumption. Check local ecological status before planting."],
    facts: [
      { category: "Propagation and spread", text: "The source notes that common comfrey can spread from root pieces." },
      { category: "Forest-garden reference", text: "The Agroforestry Research Trust lists comfreys as herbaceous examples, but does not establish a companion benefit for a specific planting." }
    ],
    unknowns: ["Atlantic Canada invasive status, cultivar, site-care requirements, and suitability near food crops."]
  }
});

PLANT_PROFILES.blueberryGroup.sourceIds.push("gnb-wild-blueberries");
PLANT_PROFILES.currantGroup.sourceIds.push("gnb-small-fruits");
PLANT_PROFILES.raspberry.sourceIds.push("gnb-small-fruits");
PLANT_PROFILES.potato.sourceIds.push("gnb-potatoes");

const PERSPECTIVE_REFERENCES = [
  {
    id: "holmgren-permaculture",
    label: "David Holmgren: About Permaculture",
    url: "https://holmgren.com.au/about-permaculture/",
    note: "Frames permaculture as an ethics- and ecology-based design system for land use and resilient living; principles are thinking tools, not guaranteed outcomes."
  },
  {
    id: "nrcs-conservation-planning",
    label: "USDA NRCS: Conservation Technical Assistance and Planning",
    url: "https://www.nrcs.usda.gov/getting-assistance/conservation-technical-assistance",
    note: "Describes conservation planning as identifying landowner objectives and assessing natural-resource issues. U.S. program context, not Canadian regulations or a property-specific plan."
  },
  {
    id: "rhs-garden-design",
    label: "Royal Horticultural Society: Garden Design",
    url: "https://www.rhs.org.uk/garden-design",
    note: "General garden-design orientation and inspiration. UK context; plant, climate, accessibility, construction, and regulatory choices must be localized."
  },
  {
    id: "umaine-garden-planning",
    label: "University of Maine Cooperative Extension: Planning Your Garden",
    url: "https://extension.umaine.edu/gardening/2020/05/07/planning-your-garden/",
    note: "Home-garden planning resource covering household food preferences, preservation, planting timing, and succession planting. Maine guidance is not an Atlantic Canada calendar."
  }
];

const DESIGN_PERSPECTIVES = [
  {
    id: "permaculture",
    name: "Permaculture designer",
    descriptor: "Ethics, observation & whole-system design",
    summary: "Treat this as a systems-design lens, not a list of companion plants. Begin with the people and ecology involved, observe the site over time, identify flows and constraints, and test modest designs that can be reviewed and adapted.",
    priorities: ["Care for land and people; consider fair limits and distribution", "Observe patterns and resource flows before choosing interventions", "Connect functions only where the relationship is practical and evidenced", "Use small trials and feedback rather than assuming a design will work"],
    processTitle: "A permaculture-informed design sequence",
    process: [
      "Clarify the people’s needs, responsibilities, and ecological limits; distinguish goals from assumptions.",
      "Record observations across relevant seasons: sun, wind, slope, water movement, soil evidence, existing plants, access, and use.",
      "Map resources, constraints, and recurring work; identify opportunities to meet more than one need without claiming unmeasured benefits.",
      "Compare options, start with a reversible small-scale trial, and record results before expanding."
    ],
    references: ["holmgren-permaculture", "nrcs-conservation-planning"],
    question: "What do we know from repeated observation, what is still uncertain, and which small test would reduce the most uncertainty?",
    ideas: [
      {
        feature: "Rain garden",
        location: "South low corner",
        reason: "The sample owner reports standing water here, but the cause and flow path are unknown. Record when and where water appears, where it comes from and goes, and how long it remains; investigate soil, utilities, slopes, and downstream effects before comparing any infiltration or drainage design."
      },
      {
        feature: "Food forest",
        location: "East tree line",
        reason: "First inventory existing trees and understory, seasonal shade, access, and likely root competition. Then decide whether a small layered planting fits the site and household; layer labels do not establish companion benefits or local suitability."
      },
      {
        feature: "Apple tree guild",
        location: "North clearing",
        reason: "Use this as a relationship-mapping exercise, not a validated guild recipe. Confirm the apple’s cultivar, rootstock, pollination needs, and site fit; select any understory plants independently for verified local requirements and manageable maintenance."
      },
      {
        feature: "Compost area",
        location: "East tree line",
        reason: "Trace the household's actual organic-material flows and handling routine before locating a compost area. Check year-round access, drainage, distance from work areas, wildlife conflicts, and local rules; do not assume compost will meet a crop's nutrient needs."
      }
    ]
  },
  {
    id: "landscape",
    name: "Landscape designer",
    descriptor: "Purpose, circulation & spatial composition",
    summary: "Plan the outdoor spaces as a connected composition: what people need to do, how they move, what they see, and how planting and built elements define spaces over time. A pleasing sketch still needs a site inventory, accessibility checks, maintenance planning, and locally suitable plants.",
    priorities: ["Start with uses, users, views, and existing site conditions", "Organize destinations and circulation before choosing materials", "Use scale, repetition, contrast, and focal points deliberately", "Account for mature plant size, seasonal change, maintenance, and accessibility"],
    processTitle: "A landscape-design sequence",
    process: [
      "List intended activities, users, privacy needs, desired views, and constraints such as utilities, access, grades, and drainage.",
      "Make a base map and site inventory; verify dimensions and observe conditions instead of treating this illustrative demo map as a survey.",
      "Lay out activity areas, routes, sightlines, and transitions before specifying plants, paving, or structures.",
      "Check scale, mature dimensions, seasonal interest, accessibility, construction needs, and ongoing maintenance; revise before building."
    ],
    references: ["rhs-garden-design", "nrcs-conservation-planning"],
    question: "Who will use each outdoor space, how should they get there, and what should they experience along the way?",
    ideas: [
      {
        feature: "Garden path",
        location: "North clearing",
        reason: "Map the actual destinations and observe the route in wet and dry conditions before drawing a path. Check slope, drainage, width, surface, turning/access needs, winter use, and maintenance; the sample map does not establish a safe or accessible alignment."
      },
      {
        feature: "Native planting border",
        location: "East tree line",
        reason: "Explore a planted transition only after recording the existing edge, views, light, soil moisture, desired screening, and maintenance capacity. Verify every plant for the property’s ecoregion and conditions; ‘native’ cannot be inferred from this generic sample list."
      },
      {
        feature: "Angled dwarf-apple fence trial",
        location: "East tree line",
        reason: "Treat the close-planted, angled dwarf-apple concept as a specialty fruit-training experiment, not a standard landscape prescription. Confirm cultivar, rootstock, mature spread, support engineering, spacing, pruning method, access, and local advice; the angle and planting density have not been validated for this sample site."
      }
    ]
  },
  {
    id: "homestead",
    name: "Homestead planner",
    descriptor: "Household needs, seasonal work & practical capacity",
    summary: "Plan around what the household wants to produce and use, the work and skills available, and the time, budget, storage, and infrastructure constraints. Treat yields and costs as unknown until supported by local records or estimates.",
    priorities: ["Define household goals and intended uses before choosing crops or livestock", "Match project size to time, skills, budget, and reliable access to water", "Plan for harvest, storage, preservation, tools, and seasonal workload—not only planting", "Keep records and expand only after a manageable trial is understood"],
    processTitle: "A practical homestead-planning sequence",
    process: [
      "Set household goals, preferred foods, intended preservation or storage, available time, budget, skills, and safety constraints.",
      "Inventory the site and essential infrastructure: water, soil-test status, sun, access, tools, storage, utilities, and applicable rules.",
      "Choose one manageable pilot; sequence prerequisites and seasonal tasks, and record assumptions, estimated costs, and sources.",
      "Track time, inputs, harvest/use, problems, and maintenance; review the results before repeating or expanding."
    ],
    references: ["umaine-garden-planning", "nrcs-conservation-planning"],
    question: "What does the household actually want to produce, preserve, or learn—and what time, budget, and infrastructure can it reliably commit?",
    ideas: [
      {
        feature: "Vegetable beds",
        location: "North clearing",
        reason: "Start with a small bed based on household food preferences and realistic weekly work. Before selecting crops, verify seasonal light, soil-test needs, water access, seed availability, and local planting guidance; track what is eaten or preserved, not just what is harvested."
      },
      {
        feature: "Compost area",
        location: "East tree line",
        reason: "Choose a compost system only after estimating the materials and labor the household can actually manage. Check convenient access, drainage, wildlife and local requirements, and whether finished compost can be used appropriately; avoid treating it as a guaranteed fertilizer substitute."
      },
      {
        feature: "Greenhouse",
        location: "North clearing",
        reason: "Consider a greenhouse only after identifying the specific season-extension goal, expected labor, water access, ventilation and snow/wind requirements, costs, and maintenance. The demo provides no local structure design or return-on-investment estimate."
      }
    ]
  }
];
