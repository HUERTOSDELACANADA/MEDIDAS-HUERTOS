import { FloorName, House } from "./types";

// Corporate Colors based on the Logo
export const BRAND = {
  green: "#39b54a", // The specific green from the H logo
  black: "#1a1a1a",
  gray: "#4b5563",
};

export const PROJECT_INFO = {
  name: "Residencial Huertos de la Cañada",
  address: "Calle Carlos V, La Cañada de San Urbano, Almería",
  description: "Promoción exclusiva de 16 viviendas unifamiliares con sótano, jardín y solárium. Diseño moderno, sostenibilidad y ubicación privilegiada cerca de la Universidad y el aeropuerto.",
  promoter: "Carlos V, S. Coop. And.",
  architects: "Ferrer Arquitectos",
  colors: {
    primary: BRAND.green,
    secondary: BRAND.black,
    accent: BRAND.green,
  }
};

// Image Placeholders acting as "Blueprints"
// Using simple absolute paths to avoid module resolution and runtime URL construction errors.
export const DEFAULT_FLOOR_PLANS = {
  SOTANO: "/plano_sotano.jpg",
  BAJA: "/plano_planta_baja.jpg",
  PRIMERA: "/planta_primera.jpg",
  CUBIERTA: "/plano_cubierta.jpg"
};

// Helper to generate standard floors for the "Tipo" house (V3-V14) based on updated measurements
const getStandardFloors = (): House["floors"] => [
  {
    name: FloorName.SOTANO,
    totalUsefulArea: 42.41,
    totalConstructedArea: 48.05,
    outdoorArea: 2.67,
    rooms: [
      { name: "Bodega", area: 34.01 },
      { name: "Escalera", area: 3.86 },
      { name: "Vestíbulo", area: 1.72 },
      { name: "Aseo (opción 2)", area: 2.82 },
      { name: "Patinillo Sótano (opción 1)", area: 2.67 },
    ],
    imagePlaceholder: DEFAULT_FLOOR_PLANS.SOTANO, 
  },
  {
    name: FloorName.BAJA,
    totalUsefulArea: 38.92,
    totalConstructedArea: 49.60,
    outdoorArea: 43.82, // 10.49 + 12.98 + 20.35
    rooms: [
      { name: "Salón", area: 21.04 },
      { name: "Cocina", area: 7.95 },
      { name: "Vestíbulo", area: 4.01 },
      { name: "Aseo", area: 1.53 },
      { name: "Escalera", area: 4.39 },
      { name: "Patio Trasero", area: 10.49 },
      { name: "Patio Delantero (Cubierto)", area: 12.98 },
      { name: "Patio Delantero (Descubierto)", area: 20.35 },
    ],
    imagePlaceholder: DEFAULT_FLOOR_PLANS.BAJA,
  },
  {
    name: FloorName.PRIMERA,
    totalUsefulArea: 42.74,
    totalConstructedArea: 54.69,
    outdoorArea: 4.39,
    rooms: [
      { name: "Dormitorio 01", area: 12.20 },
      { name: "Dormitorio 02", area: 9.50 },
      { name: "Dormitorio 03", area: 8.93 },
      { name: "Baño Principal", area: 3.95 },
      { name: "Baño Secundario", area: 2.63 },
      { name: "Vestíbulo", area: 3.22 },
      { name: "Escalera", area: 2.31 },
      { name: "Terraza", area: 4.39 },
    ],
    imagePlaceholder: DEFAULT_FLOOR_PLANS.PRIMERA,
  },
  {
    name: FloorName.CUBIERTA,
    totalUsefulArea: 3.56,
    totalConstructedArea: 8.01,
    outdoorArea: 43.56,
    rooms: [
      { name: "Castillete", area: 3.56 },
      { name: "Solarium (Área 01 - Jacuzzi/Piscina)", area: 22.64 },
      { name: "Solarium (Área 02 - BBQ/Cocina)", area: 10.47 },
      { name: "Solarium (Área 03 - Relax)", area: 10.45 },
    ],
    imagePlaceholder: DEFAULT_FLOOR_PLANS.CUBIERTA,
  },
];

// Helper for V16 (Villa Amapola) with specific measurements including Side Patio
const getV16Floors = (): House["floors"] => [
  {
    name: FloorName.SOTANO,
    totalUsefulArea: 42.41,
    totalConstructedArea: 48.49,
    outdoorArea: 2.67,
    rooms: [
      { name: "Bodega", area: 34.01 },
      { name: "Escalera", area: 3.86 },
      { name: "Vestíbulo", area: 1.72 },
      { name: "Aseo (opción 2)", area: 2.82 },
      { name: "Patinillo Sótano (opción 1)", area: 2.67 },
    ],
    imagePlaceholder: DEFAULT_FLOOR_PLANS.SOTANO,
  },
  {
    name: FloorName.BAJA,
    totalUsefulArea: 38.92,
    totalConstructedArea: 50.41,
    outdoorArea: 91.55, // 12.98 (Cov) + 10.49 (Back) + 20.35 (Front Desc) + 47.73 (Side)
    rooms: [
      { name: "Salón", area: 21.04 },
      { name: "Cocina", area: 7.95 },
      { name: "Vestíbulo", area: 4.01 },
      { name: "Aseo", area: 1.53 },
      { name: "Escalera", area: 4.39 },
      { name: "Patio Trasero", area: 10.49 },
      { name: "Patio Delantero (Cubierto)", area: 12.98 },
      { name: "Patio Delantero (Descubierto)", area: 20.35 },
      { name: "Patio Lateral", area: 47.73 },
    ],
    imagePlaceholder: DEFAULT_FLOOR_PLANS.BAJA,
  },
  {
    name: FloorName.PRIMERA,
    totalUsefulArea: 42.74,
    totalConstructedArea: 55.79,
    outdoorArea: 4.39,
    rooms: [
      { name: "Dormitorio 01", area: 12.20 },
      { name: "Dormitorio 02", area: 9.50 },
      { name: "Dormitorio 03", area: 8.93 },
      { name: "Baño Principal", area: 3.95 },
      { name: "Baño Secundario", area: 2.63 },
      { name: "Vestíbulo", area: 3.22 },
      { name: "Escalera", area: 2.31 },
      { name: "Terraza", area: 4.39 },
    ],
    imagePlaceholder: DEFAULT_FLOOR_PLANS.PRIMERA,
  },
  {
    name: FloorName.CUBIERTA,
    totalUsefulArea: 3.56,
    totalConstructedArea: 8.23,
    outdoorArea: 43.56,
    rooms: [
      { name: "Castillete", area: 3.56 },
      { name: "Solarium (Área 01 - Jacuzzi/Piscina)", area: 22.64 },
      { name: "Solarium (Área 02 - BBQ/Cocina)", area: 10.47 },
      { name: "Solarium (Área 03 - Relax)", area: 10.45 },
    ],
    imagePlaceholder: DEFAULT_FLOOR_PLANS.CUBIERTA,
  },
];

// Helper for V15 (Villa Hierba Buena) with specific measurements including Side Patio
const getV15Floors = (): House["floors"] => [
  {
    name: FloorName.SOTANO,
    totalUsefulArea: 42.41,
    totalConstructedArea: 48.49,
    outdoorArea: 2.67,
    rooms: [
      { name: "Bodega", area: 34.01 },
      { name: "Escalera", area: 3.86 },
      { name: "Vestíbulo", area: 1.72 },
      { name: "Aseo (opción 2)", area: 2.82 },
      { name: "Patinillo Sótano (opción 1)", area: 2.67 },
    ],
    imagePlaceholder: DEFAULT_FLOOR_PLANS.SOTANO,
  },
  {
    name: FloorName.BAJA,
    totalUsefulArea: 38.92,
    totalConstructedArea: 50.41,
    outdoorArea: 58.75, // 12.98 (Cov) + 10.49 (Back) + 20.35 (Front Desc) + 14.93 (Side)
    rooms: [
      { name: "Salón", area: 21.04 },
      { name: "Cocina", area: 7.95 },
      { name: "Vestíbulo", area: 4.01 },
      { name: "Aseo", area: 1.53 },
      { name: "Escalera", area: 4.39 },
      { name: "Patio Trasero", area: 10.49 },
      { name: "Patio Delantero (Cubierto)", area: 12.98 },
      { name: "Patio Delantero (Descubierto)", area: 20.35 },
      { name: "Patio Lateral", area: 14.93 },
    ],
    imagePlaceholder: DEFAULT_FLOOR_PLANS.BAJA,
  },
  {
    name: FloorName.PRIMERA,
    totalUsefulArea: 42.74,
    totalConstructedArea: 55.79,
    outdoorArea: 4.39,
    rooms: [
      { name: "Dormitorio 01", area: 12.20 },
      { name: "Dormitorio 02", area: 9.50 },
      { name: "Dormitorio 03", area: 8.93 },
      { name: "Baño Principal", area: 3.95 },
      { name: "Baño Secundario", area: 2.63 },
      { name: "Vestíbulo", area: 3.22 },
      { name: "Escalera", area: 2.31 },
      { name: "Terraza", area: 4.39 },
    ],
    imagePlaceholder: DEFAULT_FLOOR_PLANS.PRIMERA,
  },
  {
    name: FloorName.CUBIERTA,
    totalUsefulArea: 3.56,
    totalConstructedArea: 8.23,
    outdoorArea: 43.56,
    rooms: [
      { name: "Castillete", area: 3.56 },
      { name: "Solarium (Área 01 - Jacuzzi/Piscina)", area: 22.64 },
      { name: "Solarium (Área 02 - BBQ/Cocina)", area: 10.47 },
      { name: "Solarium (Área 03 - Relax)", area: 10.45 },
    ],
    imagePlaceholder: DEFAULT_FLOOR_PLANS.CUBIERTA,
  },
];

// Helper for V1 and V2 (Villa Granada & Villa Aloe)
const getV1V2Floors = (): House["floors"] => [
  {
    name: FloorName.SOTANO,
    totalUsefulArea: 42.41,
    totalConstructedArea: 48.49,
    outdoorArea: 2.67,
    rooms: [
      { name: "Bodega", area: 34.01 },
      { name: "Escalera", area: 3.86 },
      { name: "Vestíbulo", area: 1.72 },
      { name: "Aseo (opción 2)", area: 2.82 },
      { name: "Patinillo Sótano (opción 1)", area: 2.67 },
    ],
    imagePlaceholder: DEFAULT_FLOOR_PLANS.SOTANO, 
  },
  {
    name: FloorName.BAJA,
    totalUsefulArea: 38.92,
    totalConstructedArea: 50.41,
    outdoorArea: 43.82, // 10.49 + 12.98 + 20.35 (No side patio for V1/V2)
    rooms: [
      { name: "Salón", area: 21.04 },
      { name: "Cocina", area: 7.95 },
      { name: "Vestíbulo", area: 4.01 },
      { name: "Aseo", area: 1.53 },
      { name: "Escalera", area: 4.39 },
      { name: "Patio Trasero", area: 10.49 },
      { name: "Patio Delantero (Cubierto)", area: 12.98 },
      { name: "Patio Delantero (Descubierto)", area: 20.35 },
    ],
    imagePlaceholder: DEFAULT_FLOOR_PLANS.BAJA,
  },
  {
    name: FloorName.PRIMERA,
    totalUsefulArea: 42.74,
    totalConstructedArea: 55.79,
    outdoorArea: 4.39,
    rooms: [
      { name: "Dormitorio 01", area: 12.20 },
      { name: "Dormitorio 02", area: 9.50 },
      { name: "Dormitorio 03", area: 8.93 },
      { name: "Baño Principal", area: 3.95 },
      { name: "Baño Secundario", area: 2.63 },
      { name: "Vestíbulo", area: 3.22 },
      { name: "Escalera", area: 2.31 },
      { name: "Terraza", area: 4.39 },
    ],
    imagePlaceholder: DEFAULT_FLOOR_PLANS.PRIMERA,
  },
  {
    name: FloorName.CUBIERTA,
    totalUsefulArea: 3.56,
    totalConstructedArea: 8.23,
    outdoorArea: 43.56,
    rooms: [
      { name: "Castillete", area: 3.56 },
      { name: "Solarium (Área 01 - Jacuzzi/Piscina)", area: 22.64 },
      { name: "Solarium (Área 02 - BBQ/Cocina)", area: 10.47 },
      { name: "Solarium (Área 03 - Relax)", area: 10.45 },
    ],
    imagePlaceholder: DEFAULT_FLOOR_PLANS.CUBIERTA,
  },
];

const createHouse = (
  id: string, 
  name: string, 
  type: House["type"], 
  orientation: string,
  price: string,
  parcelArea: number, 
  isCorner: boolean
): House => {
  // Determine properties based on specific house ID or type
  let floors: House["floors"];
  let constructedArea: number;

  if (id === "V16") {
    floors = getV16Floors();
    constructedArea = 162.92;
  } else if (id === "V15") {
    floors = getV15Floors();
    constructedArea = 162.92;
  } else if (isCorner) {
    // V1 and V2 fall here (Corner units without the large side patios of V15/V16 but with updated measures)
    floors = getV1V2Floors();
    constructedArea = 162.92;
  } else {
    floors = getStandardFloors();
    constructedArea = 160.35;
  }

  return {
    id,
    name,
    type,
    orientation,
    price,
    parcelArea,
    totalConstructedArea: constructedArea, 
    floors,
    status: "Available",
  };
};

const allHouses: House[] = [
  createHouse("V1", "VILLA GRANADA", "Esquina", "Este", "250.000 €", 96.95, true),
  createHouse("V2", "VILLA ALOE", "Esquina", "Oeste", "250.000 €", 96.95, true),
  createHouse("V3", "VILLA MARGARITA", "Adosado", "Este", "233.000 €", 96.95, false),
  createHouse("V4", "VILLA LAVANDA", "Adosado", "Oeste", "233.000 €", 96.95, false),
  createHouse("V5", "VILLA NARANJA", "Adosado", "Este", "233.000 €", 96.95, false),
  createHouse("V6", "VILLA TOMILLO", "Adosado", "Oeste", "233.000 €", 96.95, false),
  createHouse("V7", "VILLA LIMONES", "Adosado", "Este", "233.000 €", 96.95, false),
  createHouse("V8", "VILLA ROMERO", "Adosado", "Oeste", "233.000 €", 96.95, false),
  createHouse("V9", "VILLA ALBAHACA", "Adosado", "Este", "233.000 €", 96.95, false),
  createHouse("V10", "VILLA MANZANILLA", "Adosado", "Oeste", "233.000 €", 96.95, false),
  createHouse("V11", "VILLA HINOJOS", "Adosado", "Este", "233.000 €", 96.95, false),
  createHouse("V12", "VILLA MENTA", "Adosado", "Oeste", "233.000 €", 96.95, false),
  createHouse("V13", "VILLA JAMINES", "Adosado", "Este", "233.000 €", 96.95, false),
  createHouse("V14", "VILLA OREGANO", "Adosado", "Oeste", "233.000 €", 96.95, false),
  createHouse("V15", "VILLA HIERBA BUENA", "Esquina", "Este", "255.000 €", 120.90, true),
  createHouse("V16", "VILLA AMAPOLA", "Esquina", "Oeste", "260.000 €", 149.72, true),
];

// Map over the created houses to add extra, specific data like status and videos
export const HOUSES: House[] = allHouses.map(house => {
  const extras: Partial<House> = {};
  
  // Add videos to corner houses for demonstration
  if (house.id === 'V1' || house.id === 'V2') {
    extras.videoUrl = 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4';
  }
  if (house.id === 'V15' || house.id === 'V16') {
     extras.videoUrl = 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
  }

  // Add different statuses for demonstration of the UI states
  if (['V4', 'V8', 'V12'].includes(house.id)) {
      extras.status = 'Sold';
  }
  if (['V5', 'V9'].includes(house.id)) {
      extras.status = 'Reserved';
  }
  
  // Merge original house data with extras
  return { ...house, ...extras };
});