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
      feature: "Vegetable beds",
      location: "North clearing",
      note: "Start with a small growing area and observe sunlight through the season."
    },
    {
      id: "demo-2",
      feature: "Rain garden",
      location: "South low corner",
      note: "Explore suitable plants and confirm site conditions before building."
    }
  ]
};

const PROPOSED_FEATURES = [
  "Vegetable beds",
  "Fruit trees",
  "Food forest",
  "Rain garden",
  "Compost area",
  "Greenhouse"
];
