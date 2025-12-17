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
export const DEFAULT_FLOOR_PLANS = {
  SOTANO: "https://storage.googleapis.com/huertos-planos/plano_sotano.jpg",
  BAJA: "https://storage.googleapis.com/huertos-planos/plano_planta_baja.jpg",
  PRIMERA: "https://storage.googleapis.com/huertos-planos/plano_planta_primera.jpg",
  CUBIERTA: "https://storage.googleapis.com/huertos-planos/plano_cubierta.jpg"
};

// Generate 16 Houses
export const HOUSES: House[] = Array.from({ length: 16 }, (_, i) => {
  const num = i + 1;
  const id = `V${num}`;
  // Even numbers are one type/orientation, Odd are another usually in this layout
  const isCorner = num === 1 || num === 16;
  
  return {
    id,
    name: `Vivienda ${num}`,
    type: isCorner ? "Esquina" : "Adosado",
    orientation: num % 2 === 0 ? "Oeste" : "Este", 
    parcelArea: isCorner ? 200 : 160,
    totalConstructedArea: 185,
    price: "285.000 €",
    status: "Available",
    floors: [
      {
        name: FloorName.SOTANO,
        totalUsefulArea: 65.50,
        imagePlaceholder: DEFAULT_FLOOR_PLANS.SOTANO,
        rooms: [
            { name: "Garaje", area: 55.00 },
            { name: "Trastero/Instalaciones", area: 10.50 }
        ]
      },
      {
        name: FloorName.BAJA,
        totalUsefulArea: 58.20,
        outdoorArea: 45.00,
        imagePlaceholder: DEFAULT_FLOOR_PLANS.BAJA,
        rooms: [
            { name: "Salón-Comedor-Cocina", area: 42.50 },
            { name: "Aseo", area: 3.20 },
            { name: "Vestíbulo", area: 5.50 },
            { name: "Escalera", area: 7.00 }
        ]
      },
      {
        name: FloorName.PRIMERA,
        totalUsefulArea: 62.80,
        imagePlaceholder: DEFAULT_FLOOR_PLANS.PRIMERA,
        rooms: [
            { name: "Dormitorio Principal", area: 14.50 },
            { name: "Baño Principal", area: 4.50 },
            { name: "Dormitorio 2", area: 11.20 },
            { name: "Dormitorio 3", area: 10.80 },
            { name: "Baño 2", area: 4.20 },
            { name: "Distribuidor", area: 6.00 }
        ]
      },
      {
        name: FloorName.CUBIERTA,
        totalUsefulArea: 8.50, // Stair access
        outdoorArea: 55.00,
        imagePlaceholder: DEFAULT_FLOOR_PLANS.CUBIERTA,
        rooms: [
            { name: "Acceso Cubierta", area: 8.50 },
            { name: "Solárium", area: 55.00 }
        ]
      }
    ]
  };
});