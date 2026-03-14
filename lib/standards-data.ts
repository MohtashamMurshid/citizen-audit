export type StandardCategory =
  | "Electrical"
  | "Food & Water"
  | "Construction"
  | "Chemicals"
  | "Consumer Goods"
  | "Automotive"
  | "Textiles"
  | "Agriculture"
  | "Safety Equipment"
  | "Metals & Alloys";

export interface BISStandard {
  id: string;
  title: string;
  category: StandardCategory;
  description: string;
  scope: string;
  year: number;
  mandatory: boolean;
  relatedStandards: string[];
}

export const STANDARDS: BISStandard[] = [
  // ── Electrical ──
  {
    id: "IS 1293",
    title: "Electric Hotplates for Domestic Purposes",
    category: "Electrical",
    description:
      "Specifies requirements for electric hotplates intended for household cooking, covering safety, performance, and marking.",
    scope: "Domestic electric hotplates and cooking ranges",
    year: 2019,
    mandatory: true,
    relatedStandards: ["IS 302"],
  },
  {
    id: "IS 302",
    title: "Safety of Household and Similar Electrical Appliances",
    category: "Electrical",
    description:
      "General safety standard for household electrical appliances, covering protection against electric shock, fire, and mechanical hazards.",
    scope: "All household electrical appliances",
    year: 2008,
    mandatory: true,
    relatedStandards: ["IS 1293", "IS 694"],
  },
  {
    id: "IS 694",
    title: "PVC Insulated Cables for Voltages up to 1100V",
    category: "Electrical",
    description:
      "Covers PVC insulated and PVC sheathed cables for power and lighting circuits in domestic and industrial installations.",
    scope: "PVC insulated power and lighting cables",
    year: 2010,
    mandatory: true,
    relatedStandards: ["IS 302", "IS 8130"],
  },
  {
    id: "IS 1180",
    title: "Distribution Transformers",
    category: "Electrical",
    description:
      "Specifies requirements for outdoor-type oil-immersed distribution transformers used in power networks.",
    scope: "Three-phase distribution transformers up to 2500 kVA",
    year: 2014,
    mandatory: true,
    relatedStandards: ["IS 2026"],
  },
  {
    id: "IS 8130",
    title: "Conductors for Insulated Electric Cables and Flexible Cords",
    category: "Electrical",
    description:
      "Specifies conductor requirements for insulated electric cables including material, dimensions, and resistance.",
    scope: "Copper and aluminium conductors for cables",
    year: 2013,
    mandatory: true,
    relatedStandards: ["IS 694"],
  },
  {
    id: "IS 9968",
    title: "Elastomer Insulated Cables",
    category: "Electrical",
    description:
      "Specifies requirements for cables with rubber or elastomer insulation used in industrial and mining environments.",
    scope: "Elastomer insulated cables for voltages up to 1100V",
    year: 2009,
    mandatory: false,
    relatedStandards: ["IS 694"],
  },
  {
    id: "IS 2026",
    title: "Power Transformers",
    category: "Electrical",
    description:
      "Specifies performance, testing, and marking requirements for power transformers used in electrical networks.",
    scope: "Power transformers above 2500 kVA",
    year: 2011,
    mandatory: true,
    relatedStandards: ["IS 1180"],
  },
  {
    id: "IS 3854",
    title: "Switches for Domestic and Similar Purposes",
    category: "Electrical",
    description:
      "Safety and performance standard for wall-mounted switches used in domestic electrical installations.",
    scope: "Domestic switches rated up to 16A, 250V",
    year: 2017,
    mandatory: true,
    relatedStandards: ["IS 302"],
  },
  {
    id: "IS 1281",
    title: "Tungsten Filament General Service Lamps",
    category: "Electrical",
    description:
      "Covers specifications for incandescent tungsten filament lamps for general lighting service.",
    scope: "GLS incandescent lamps",
    year: 2005,
    mandatory: true,
    relatedStandards: ["IS 9906"],
  },
  {
    id: "IS 9906",
    title: "Self-Ballasted LED Lamps for General Lighting",
    category: "Electrical",
    description:
      "Specifies performance and safety requirements for LED lamps that directly replace incandescent and CFL lamps.",
    scope: "LED lamps with integrated drivers",
    year: 2021,
    mandatory: true,
    relatedStandards: ["IS 1281", "IS 16102"],
  },
  {
    id: "IS 16102",
    title: "LED Luminaires for General Lighting",
    category: "Electrical",
    description:
      "Performance and safety requirements for complete LED luminaire assemblies used for general lighting.",
    scope: "LED luminaires and fixtures",
    year: 2020,
    mandatory: false,
    relatedStandards: ["IS 9906"],
  },

  // ── Food & Water ──
  {
    id: "IS 15885",
    title: "Packaged Drinking Water (Other Than Natural Mineral Water)",
    category: "Food & Water",
    description:
      "Specifies requirements for packaged drinking water obtained from any source, treated, and packaged for human consumption.",
    scope: "Packaged drinking water",
    year: 2018,
    mandatory: true,
    relatedStandards: ["IS 14543", "IS 10500"],
  },
  {
    id: "IS 14543",
    title: "Packaged Natural Mineral Water",
    category: "Food & Water",
    description:
      "Covers water from underground sources, naturally mineralized, packaged at the source without chemical treatment.",
    scope: "Natural mineral water products",
    year: 2016,
    mandatory: true,
    relatedStandards: ["IS 15885", "IS 10500"],
  },
  {
    id: "IS 10500",
    title: "Drinking Water — Specification",
    category: "Food & Water",
    description:
      "Prescribes acceptable limits for physical, chemical, and bacteriological parameters of drinking water supply.",
    scope: "Piped and non-piped water supply systems",
    year: 2012,
    mandatory: false,
    relatedStandards: ["IS 15885", "IS 14543"],
  },
  {
    id: "IS 7328",
    title: "Wheat Flour (Atta)",
    category: "Food & Water",
    description:
      "Specifies requirements for whole wheat flour used for chapati and other flatbreads, including moisture, ash, and gluten content.",
    scope: "Whole wheat flour for domestic consumption",
    year: 2019,
    mandatory: false,
    relatedStandards: ["IS 1011"],
  },
  {
    id: "IS 1011",
    title: "Wheat Atta (Roller-Milled)",
    category: "Food & Water",
    description:
      "Covers roller-milled wheat flour specifications including particle size, moisture content, and acid-insoluble ash limits.",
    scope: "Roller-milled wheat flour",
    year: 2018,
    mandatory: false,
    relatedStandards: ["IS 7328"],
  },
  {
    id: "IS 13428",
    title: "Packaged Fruit Juices",
    category: "Food & Water",
    description:
      "Specifies requirements for packaged fruit juices and fruit drinks including composition, labelling, and microbiological limits.",
    scope: "Commercially packaged fruit juices and drinks",
    year: 2017,
    mandatory: false,
    relatedStandards: [],
  },
  {
    id: "IS 4854",
    title: "Edible Common Salt",
    category: "Food & Water",
    description:
      "Specifies requirements for edible common salt including iodine fortification, purity, and moisture limits.",
    scope: "Edible salt for human consumption",
    year: 2016,
    mandatory: true,
    relatedStandards: [],
  },
  {
    id: "IS 7101",
    title: "Honey — Specification",
    category: "Food & Water",
    description:
      "Prescribes quality parameters for honey including moisture, reducing sugars, diastase activity, and HMF limits.",
    scope: "Natural honey from all floral sources",
    year: 2020,
    mandatory: false,
    relatedStandards: [],
  },

  // ── Construction ──
  {
    id: "IS 269",
    title: "Ordinary Portland Cement, 33 Grade",
    category: "Construction",
    description:
      "Specifies chemical and physical requirements for 33 grade ordinary Portland cement used in general construction.",
    scope: "Portland cement for general construction purposes",
    year: 2015,
    mandatory: true,
    relatedStandards: ["IS 8112", "IS 12269"],
  },
  {
    id: "IS 8112",
    title: "Portland Cement, 43 Grade",
    category: "Construction",
    description:
      "Covers 43 grade Portland cement with higher strength properties suitable for structural and reinforced concrete work.",
    scope: "Portland cement for structural applications",
    year: 2013,
    mandatory: true,
    relatedStandards: ["IS 269", "IS 12269"],
  },
  {
    id: "IS 12269",
    title: "Portland Cement, 53 Grade",
    category: "Construction",
    description:
      "High-strength 53 grade Portland cement for pre-stressed concrete, high-rise structures, and critical structural applications.",
    scope: "High-grade Portland cement for specialized construction",
    year: 2013,
    mandatory: true,
    relatedStandards: ["IS 269", "IS 8112"],
  },
  {
    id: "IS 1077",
    title: "Common Burnt Clay Building Bricks",
    category: "Construction",
    description:
      "Classification and requirements for hand-moulded and machine-made burnt clay bricks used in construction.",
    scope: "Burnt clay bricks for walls and structures",
    year: 2015,
    mandatory: false,
    relatedStandards: ["IS 3812"],
  },
  {
    id: "IS 3812",
    title: "Pulverised Fuel Ash",
    category: "Construction",
    description:
      "Specifies requirements for fly ash used as pozzolana in cement, concrete, and lime-pozzolana mixtures.",
    scope: "Fly ash from thermal power stations",
    year: 2013,
    mandatory: false,
    relatedStandards: ["IS 1077", "IS 269"],
  },
  {
    id: "IS 383",
    title: "Coarse and Fine Aggregate for Concrete",
    category: "Construction",
    description:
      "Specifies grading, shape, and quality requirements for natural and manufactured aggregates used in concrete production.",
    scope: "Sand, gravel, and crushed stone for concrete",
    year: 2016,
    mandatory: false,
    relatedStandards: ["IS 516", "IS 456"],
  },
  {
    id: "IS 516",
    title: "Methods of Tests for Strength of Concrete",
    category: "Construction",
    description:
      "Standard test methods for determining compressive, tensile, and flexural strength of concrete specimens.",
    scope: "Laboratory and field testing of concrete",
    year: 2018,
    mandatory: false,
    relatedStandards: ["IS 383", "IS 456"],
  },
  {
    id: "IS 456",
    title: "Plain and Reinforced Concrete — Code of Practice",
    category: "Construction",
    description:
      "The primary code of practice for the design, construction, and quality control of plain and reinforced concrete structures.",
    scope: "Structural concrete design and construction",
    year: 2000,
    mandatory: false,
    relatedStandards: ["IS 383", "IS 516", "IS 1786"],
  },
  {
    id: "IS 1786",
    title: "High Strength Deformed Steel Bars for Concrete Reinforcement",
    category: "Construction",
    description:
      "Specifies requirements for TMT and other high-strength deformed steel bars used as reinforcement in concrete.",
    scope: "Steel reinforcement bars (TMT bars)",
    year: 2008,
    mandatory: true,
    relatedStandards: ["IS 456"],
  },
  {
    id: "IS 323",
    title: "Bitumen for Road Work",
    category: "Construction",
    description:
      "Specifies grades and quality requirements for paving bitumen used in road construction and maintenance.",
    scope: "Paving-grade bitumen for road surfaces",
    year: 2019,
    mandatory: false,
    relatedStandards: [],
  },
  {
    id: "IS 4984",
    title: "High Density Polyethylene Pipes for Potable Water",
    category: "Construction",
    description:
      "Covers HDPE pipes used in water supply and distribution systems including dimensions, material, and testing requirements.",
    scope: "HDPE pipes for drinking water supply",
    year: 2017,
    mandatory: true,
    relatedStandards: ["IS 10500"],
  },

  // ── Chemicals ──
  {
    id: "IS 15607",
    title: "Household Insecticides — Mosquito Repellents",
    category: "Chemicals",
    description:
      "Specifies requirements for mosquito repellent coils, mats, and liquid vaporizers used in households.",
    scope: "Domestic mosquito repellent products",
    year: 2019,
    mandatory: true,
    relatedStandards: [],
  },
  {
    id: "IS 4707",
    title: "Household Electrical Mosquito Repellent Devices",
    category: "Chemicals",
    description:
      "Covers safety and efficacy requirements for electrical mosquito repellent vaporizers and mat devices.",
    scope: "Electric vaporizer and mat devices",
    year: 2020,
    mandatory: true,
    relatedStandards: ["IS 15607"],
  },
  {
    id: "IS 13428",
    title: "LPG Cylinders",
    category: "Chemicals",
    description:
      "Specifies design, manufacturing, and testing requirements for welded low-carbon steel LPG cylinders.",
    scope: "Domestic and commercial LPG cylinders",
    year: 2017,
    mandatory: true,
    relatedStandards: ["IS 8737"],
  },
  {
    id: "IS 8737",
    title: "LPG Cylinder Valves",
    category: "Chemicals",
    description:
      "Covers design and safety requirements for valves fitted to LPG cylinders for domestic and commercial use.",
    scope: "Valves for LPG cylinders",
    year: 2016,
    mandatory: true,
    relatedStandards: ["IS 13428"],
  },

  // ── Consumer Goods ──
  {
    id: "IS 9873",
    title: "Safety of Toys — General Safety Requirements",
    category: "Consumer Goods",
    description:
      "Specifies mechanical, physical, flammability, and chemical safety requirements for toys intended for children.",
    scope: "Toys for children under 14 years",
    year: 2019,
    mandatory: true,
    relatedStandards: [],
  },
  {
    id: "IS 15644",
    title: "Pressure Cookers",
    category: "Consumer Goods",
    description:
      "Covers safety and performance requirements for domestic aluminium and stainless steel pressure cookers.",
    scope: "Household pressure cookers",
    year: 2018,
    mandatory: true,
    relatedStandards: [],
  },
  {
    id: "IS 4825",
    title: "Stainless Steel Plates, Sheets and Strips",
    category: "Consumer Goods",
    description:
      "Specifies chemical composition, mechanical properties, and surface finish for stainless steel flat products.",
    scope: "Stainless steel sheets for cookware, appliances, and construction",
    year: 2013,
    mandatory: false,
    relatedStandards: [],
  },
  {
    id: "IS 3763",
    title: "Safety Matches",
    category: "Consumer Goods",
    description:
      "Covers quality and safety requirements for safety matches including ignition, after-glow time, and chemical limits.",
    scope: "Safety matches for domestic use",
    year: 2015,
    mandatory: true,
    relatedStandards: [],
  },
  {
    id: "IS 5765",
    title: "Domestic Gas Stoves (for LPG)",
    category: "Consumer Goods",
    description:
      "Specifies performance and safety requirements for domestic gas stoves designed for use with LPG supply.",
    scope: "LPG gas stoves for household cooking",
    year: 2019,
    mandatory: true,
    relatedStandards: ["IS 8737"],
  },

  // ── Automotive ──
  {
    id: "IS 15298",
    title: "Motor Vehicle Safety Helmets",
    category: "Automotive",
    description:
      "Specifies construction, performance, and testing requirements for protective helmets worn by motorcycle riders.",
    scope: "Two-wheeler safety helmets",
    year: 2018,
    mandatory: true,
    relatedStandards: [],
  },
  {
    id: "IS 2553",
    title: "Safety Glass for Motor Vehicles",
    category: "Automotive",
    description:
      "Covers requirements for laminated and toughened safety glass used as windscreens and windows in motor vehicles.",
    scope: "Automotive safety glass",
    year: 2016,
    mandatory: true,
    relatedStandards: [],
  },
  {
    id: "IS 15490",
    title: "Automotive Tyres — Radial Ply Tyres",
    category: "Automotive",
    description:
      "Specifies dimensional, performance, and load-capacity requirements for radial ply tyres used in passenger vehicles.",
    scope: "Radial tyres for cars and light vehicles",
    year: 2019,
    mandatory: false,
    relatedStandards: [],
  },

  // ── Textiles ──
  {
    id: "IS 11871",
    title: "Bed Sheets — Specification",
    category: "Textiles",
    description:
      "Specifies dimensions, fabric quality, thread count, and colourfastness requirements for cotton bed sheets.",
    scope: "Woven cotton bed sheets",
    year: 2017,
    mandatory: false,
    relatedStandards: [],
  },
  {
    id: "IS 15370",
    title: "Textiles — School Uniforms",
    category: "Textiles",
    description:
      "Covers fabric specifications, dimensional stability, colourfastness, and durability for school uniform fabrics.",
    scope: "Woven and knitted school uniform textiles",
    year: 2018,
    mandatory: false,
    relatedStandards: [],
  },

  // ── Safety Equipment ──
  {
    id: "IS 2925",
    title: "Industrial Safety Helmets",
    category: "Safety Equipment",
    description:
      "Specifies construction, material, testing, and marking requirements for helmets used in industrial workplaces.",
    scope: "Hard hats for construction and industrial use",
    year: 2018,
    mandatory: true,
    relatedStandards: ["IS 15298"],
  },
  {
    id: "IS 15051",
    title: "Fire Extinguishers — Portable",
    category: "Safety Equipment",
    description:
      "Covers performance, design, and testing requirements for portable fire extinguishers of various types.",
    scope: "Portable fire extinguishers (DCP, CO2, foam)",
    year: 2020,
    mandatory: true,
    relatedStandards: [],
  },
  {
    id: "IS 4155",
    title: "Safety Goggles",
    category: "Safety Equipment",
    description:
      "Specifies optical quality, impact resistance, and chemical resistance of safety goggles for industrial use.",
    scope: "Protective eye-wear for industrial workers",
    year: 2015,
    mandatory: false,
    relatedStandards: [],
  },

  // ── Metals & Alloys ──
  {
    id: "IS 8143",
    title: "Aluminium Alloy Pressure Die Castings",
    category: "Metals & Alloys",
    description:
      "Specifies chemical composition, mechanical properties, and quality requirements for pressure die-cast aluminium parts.",
    scope: "Aluminium alloy die-cast components",
    year: 2014,
    mandatory: false,
    relatedStandards: [],
  },
  {
    id: "IS 2062",
    title: "Hot Rolled Medium and High Tensile Structural Steel",
    category: "Metals & Alloys",
    description:
      "The primary specification for structural steel plates, sections, and bars used in construction and fabrication.",
    scope: "Structural steel for buildings, bridges, and general engineering",
    year: 2011,
    mandatory: false,
    relatedStandards: ["IS 1786"],
  },

  // ── Agriculture ──
  {
    id: "IS 5765",
    title: "Urea — Specification",
    category: "Agriculture",
    description:
      "Specifies quality requirements for urea used as a nitrogen fertilizer in agricultural applications.",
    scope: "Urea fertilizer for crop cultivation",
    year: 2018,
    mandatory: false,
    relatedStandards: [],
  },
  {
    id: "IS 10270",
    title: "Single Super Phosphate — Specification",
    category: "Agriculture",
    description:
      "Covers physical and chemical requirements for single super phosphate fertilizer used in soil enrichment.",
    scope: "Phosphatic fertilizers for agriculture",
    year: 2014,
    mandatory: false,
    relatedStandards: [],
  },
];

export const CATEGORIES = [
  ...new Set(STANDARDS.map((s) => s.category)),
].sort();

export const STANDARDS_BY_ID: Record<string, BISStandard> = Object.fromEntries(
  STANDARDS.map((s) => [s.id, s])
);

export const KNOWN_ISI_MAP: Record<string, string> = Object.fromEntries(
  STANDARDS.map((s) => [s.id, s.title])
);
