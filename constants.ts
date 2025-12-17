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
  BAJA: "https://storage.googleapis.com/huertos-planos/PLANO_PLANTA_BAJA_UNIDA.png",
  PRIMERA: "https://storage.googleapis.com/huertos-planos/plano_planta_primera.jpg",
  CUBIERTA: "https://storage.googleapis.com/huertos-planos/plano_cubierta_Jacuzzi.png"
};