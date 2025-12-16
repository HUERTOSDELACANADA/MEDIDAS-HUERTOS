export enum FloorName {
  SOTANO = "Sótano",
  BAJA = "Planta Baja",
  PRIMERA = "Planta Primera",
  CUBIERTA = "Planta Cubierta",
}

export interface Room {
  name: string;
  area: number; // in square meters
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
  type: "Esquina" | "Adosado";
  orientation?: string; // e.g. "Este", "Oeste"
  parcelArea: number;
  totalConstructedArea: number;
  floors: FloorPlan[];
  price?: string; 
  status: "Available" | "Reserved" | "Sold";
  videoUrl?: string; // URL to a video tour
}