import { FloorName, House } from "../types";
import { DEFAULT_FLOOR_PLANS } from "../constants";

// --- DATA DEFINITIONS ---

// Common Room Distributions (Useful Areas & Constructed Areas based on table)
const ROOMS_SOTANO = [
    { name: "Bodega", area: 34.01, constructedArea: 38.89 },
    { name: "Escalera", area: 3.86, constructedArea: 4.41 },
    { name: "Vestíbulo", area: 1.72, constructedArea: 1.97 },
    { name: "Aseo", area: 2.82, constructedArea: 3.22 },
];

const ROOMS_BAJA = [
    // Added example paths (coordinates 0-100). Needs calibration with real image.
    { 
        name: "Salón", 
        area: 21.58, 
        constructedArea: 27.52,
        path: "M 10 40 H 50 V 90 H 10 Z" // Approx Bottom-Left quadrant
    },
    { 
        name: "Cocina", 
        area: 8.02, 
        constructedArea: 10.23,
        path: "M 55 40 H 90 V 70 H 55 Z" // Approx Bottom-Right quadrant
    },
    { name: "Vestíbulo", area: 4.01, constructedArea: 5.11 },
    { name: "Escalera", area: 4.39, constructedArea: 5.60 },
    { name: "Aseo", area: 1.53, constructedArea: 1.95 }
];

const ROOMS_PRIMERA = [
    { name: "Dormitorio 01", area: 12.20, constructedArea: 15.93 },
    { name: "Dormitorio 02", area: 9.50, constructedArea: 12.40 },
    { name: "Dormitorio 03", area: 8.93, constructedArea: 11.66 },
    { name: "Baño Principal", area: 3.95, constructedArea: 5.16 },
    { name: "Baño Secundario", area: 2.63, constructedArea: 3.43 },
    { name: "Vestíbulo", area: 3.22, constructedArea: 4.20 },
    { name: "Escalera", area: 2.31, constructedArea: 3.02 }
];

const ROOMS_AZOTEA = [
    { name: "Castillete de Acceso", area: 3.56, constructedArea: 8.23 }
];

// Specific outdoor areas for the roof from the blueprints
const SOLARIUM_AREAS = [
    { name: "Área 01 (Solárium)", area: 22.64, constructedArea: 0 },
    { name: "Área 02 (Solárium)", area: 10.47, constructedArea: 0 },
    { name: "Área 03 (Solárium)", area: 10.45, constructedArea: 0 }
];

// House Names List
const HOUSE_NAMES = [
    "VILLA GRANADA",    // V1
    "VILLA ALOE",       // V2
    "VILLA MARGARITA",  // V3
    "VILLA LAVANDA",    // V4
    "VILLA NARANJA",    // V5
    "VILLA TOMILLO",    // V6
    "VILLA LIMONES",    // V7
    "VILLA ROMERO",     // V8
    "VILLA ALBAHACA",   // V9
    "VILLA MANZANILLA", // V10
    "VILLA INOJOS",     // V11
    "VILLA MENTA",      // V12
    "VILLA JAMINES",    // V13
    "VILLA OREGANO",    // V14
    "VILLA HIERBA BUENA",// V15
    "VILLA AMAPOLA"     // V16
];

// Helper to generate house data based on type
const createHouse = (index: number): House => {
    const num = index + 1;
    const id = `V${num}`;
    const name = HOUSE_NAMES[index];
    const isEven = num % 2 === 0;
    
    // Determine Type and Areas based on PDF Tables
    let type: "Esquina" | "Normal" = "Normal";
    let totalConstructedAndExt = 0; // "Suma de TOTAL PLANTA (CONST. + EXT.)"
    let patioLateral = 0;
    let basePrice = 0; // Base Price from PDF (Suma de PRECIO PROPUESTO)
    
    // Areas Ext. (Exterior Useful Areas)
    const extSotano = 2.67; // Patinillo
    const extP1 = 4.39; // Terraza
    
    // Sum of detailed solarium areas
    const extAzotea = 22.64 + 10.47 + 10.45; // 43.56 matches previous value
    
    // Base PB Exterior (Trasero + Delantero Cub + Delantero Desc)
    const baseExtPB = 10.49 + 12.98 + 20.35; // = 43.82

    if (num === 1 || num === 2) {
        // V1, V2
        type = "Esquina";
        totalConstructedAndExt = 257.36;
        patioLateral = 0;
        basePrice = 250000;
    } else if (num >= 3 && num <= 14) {
        // V3 - V14 (Normal)
        type = "Normal";
        totalConstructedAndExt = 254.79;
        patioLateral = 0;
        basePrice = 233000;
    } else if (num === 15) {
        // V15
        type = "Esquina";
        totalConstructedAndExt = 272.29;
        patioLateral = 14.93;
        basePrice = 255000;
    } else if (num === 16) {
        // V16
        type = "Esquina";
        totalConstructedAndExt = 305.09;
        patioLateral = 47.73;
        basePrice = 260000;
    }

    // Calculate specific floor outdoor areas
    const totalExtPB = baseExtPB + patioLateral;

    return {
        id,
        name,
        type,
        orientation: isEven ? "Oeste" : "Este", // Assuming standard distribution based on even/odd
        parcelArea: Math.round(55 + totalExtPB + 10), // Approximate parcel calculation
        totalConstructedArea: totalConstructedAndExt, // Using the Grand Total (Const + Ext)
        price: basePrice, 
        status: "Available",
        floors: [
            {
                name: FloorName.SOTANO,
                totalUsefulArea: 42.41,
                totalConstructedArea: 48.49,
                outdoorArea: extSotano,
                imagePlaceholder: DEFAULT_FLOOR_PLANS.SOTANO,
                rooms: [...ROOMS_SOTANO]
            },
            {
                name: FloorName.BAJA,
                totalUsefulArea: 39.53,
                totalConstructedArea: 50.41,
                outdoorArea: parseFloat(totalExtPB.toFixed(2)),
                imagePlaceholder: DEFAULT_FLOOR_PLANS.BAJA,
                rooms: [...ROOMS_BAJA]
            },
            {
                name: FloorName.PRIMERA,
                totalUsefulArea: 42.74,
                totalConstructedArea: 55.79,
                outdoorArea: extP1,
                imagePlaceholder: DEFAULT_FLOOR_PLANS.PRIMERA,
                rooms: [...ROOMS_PRIMERA]
            },
            {
                name: FloorName.CUBIERTA,
                totalUsefulArea: 3.56,
                totalConstructedArea: 8.23,
                outdoorArea: extAzotea,
                imagePlaceholder: DEFAULT_FLOOR_PLANS.CUBIERTA,
                // Combine indoor castillete with detailed outdoor areas
                rooms: [...ROOMS_AZOTEA, ...SOLARIUM_AREAS]
            }
        ]
    };
};

// Export the generated houses
export const HOUSES: House[] = Array.from({ length: 16 }, (_, i) => createHouse(i));