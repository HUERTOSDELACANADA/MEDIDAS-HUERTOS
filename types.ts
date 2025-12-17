
export enum FloorName {
  SOTANO = "Sótano",
  BAJA = "Planta Baja",
  PRIMERA = "Planta Primera",
  CUBIERTA = "Planta Cubierta",
}

export interface Room {
  name: string;
  area: number; // in square meters (Useful)
  constructedArea?: number; // in square meters (Constructed)
  path?: string; // SVG path data (d attribute) normalized to 0-100 coordinate space
  markerPosition?: { x: number; y: number }; // GPS Coordinates (0-100%)
  description?: string;
}

export interface FloorPlan {
  name: FloorName;
  rooms: Room[];
  totalUsefulArea: number;
  totalConstructedArea?: number;
  outdoorArea?: number; // Patios, terraces
  imagePlaceholder: string; // URL for the floor plan image
}

export interface House {
  id: string; // e.g., "V1", "V2"
  name: string; // e.g. "Villa Granada"
  type: "Esquina" | "Normal"; // Updated to match PDF
  orientation?: string; // e.g. "Este", "Oeste"
  parcelArea: number;
  totalConstructedArea: number;
  floors: FloorPlan[];
  price: number; // Changed to number for calculations
  status: "Available" | "Reserved" | "Sold";
  videoUrl?: string; // URL to a video tour
}
