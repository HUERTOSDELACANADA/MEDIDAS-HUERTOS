import React from 'react';
import { House } from '../types';
import { Sunrise, Sunset } from 'lucide-react';

interface SitePlanProps {
  houses: House[];
  selectedHouseId: string;
  onSelectHouse: (id: string) => void;
}

interface HouseMarkerProps {
    house: House;
    isSelected: boolean;
    onClick: () => void;
}

const HouseMarker: React.FC<HouseMarkerProps> = ({ house, isSelected, onClick }) => (
    <button 
        onClick={onClick}
        className={`flex-1 min-w-[30px] sm:min-w-[50px] relative transition-all duration-300 group z-10 ${isSelected ? 'scale-110 z-20' : 'hover:scale-105'}`}
    >
        {/* Roof Representation */}
        <div className={`absolute inset-0 border-[3px] sm:border-4 shadow-sm transition-colors flex flex-col items-center justify-center ${
            isSelected 
            ? 'bg-[#39b54a] border-[#2ea03f] shadow-xl' 
            : 'bg-zinc-100 border-zinc-300 hover:border-[#39b54a]'
        }`}>
            {/* Inner "Solarium" area to give depth */}
            <div className={`absolute inset-1 sm:inset-2 border border-black/5 ${isSelected ? 'bg-white/10' : 'bg-white/40'}`}></div>

            <span className={`relative z-10 text-[10px] sm:text-lg font-black uppercase leading-tight ${isSelected ? 'text-white' : 'text-gray-700'}`}>
                {house.id}
            </span>
            <span className={`relative z-10 text-[8px] sm:text-[10px] font-bold ${isSelected ? 'text-green-100' : 'text-gray-400'} hidden sm:block`}>
                {house.parcelArea.toFixed(0)}m²
            </span>
        </div>
    </button>
);

const WindRose: React.FC = () => (
    <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 w-28 h-28 sm:w-32 sm:h-32 pointer-events-none opacity-95 z-0">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
                <filter id="shadow">
                    <feDropShadow dx="0.5" dy="0.5" stdDeviation="0.5" floodOpacity="0.2"/>
                </filter>
            </defs>
            
            <g filter="url(#shadow)">
                {/* Compass Star Shape */}
                
                {/* OESTE (Top) - Calle Miramar */}
                <path d="M50 50 L50 15 L55 40 Z" fill="#E5E7EB" />
                <path d="M50 50 L50 15 L45 40 Z" fill="#9CA3AF" />
                
                {/* NORTE (Right) - Calle Carlos V - Highlighted */}
                <path d="M50 50 L85 50 L60 45 Z" fill="#39b54a" />
                <path d="M50 50 L85 50 L60 55 Z" fill="#2ea03f" />

                {/* ESTE (Bottom) - Calle Diario de Almería */}
                <path d="M50 50 L50 85 L45 60 Z" fill="#E5E7EB" />
                <path d="M50 50 L50 85 L55 60 Z" fill="#9CA3AF" />

                {/* SUR (Left) - Calle Nirvana */}
                <path d="M50 50 L15 50 L40 55 Z" fill="#E5E7EB" />
                <path d="M50 50 L15 50 L40 45 Z" fill="#9CA3AF" />
                
                {/* Diagonals */}
                <path d="M50 50 L70 30 L60 40 Z" fill="#F3F4F6" />
                <path d="M50 50 L70 70 L60 60 Z" fill="#F3F4F6" />
                <path d="M50 50 L30 70 L40 60 Z" fill="#F3F4F6" />
                <path d="M50 50 L30 30 L40 40 Z" fill="#F3F4F6" />
            </g>

            {/* Labels aligned to streets */}
            
            {/* Top Label -> Oeste */}
            <text x="50" y="12" textAnchor="middle" className="text-[10px] sm:text-[12px] font-black fill-gray-500">O</text>
            
            {/* Right Label -> Norte (Green) */}
            <text x="92" y="54" textAnchor="middle" className="text-[12px] sm:text-[14px] font-black fill-[#39b54a]">N</text>
            
            {/* Bottom Label -> Este */}
            <text x="50" y="96" textAnchor="middle" className="text-[10px] sm:text-[12px] font-black fill-gray-500">E</text>

            {/* Left Label -> Sur */}
            <text x="8" y="54" textAnchor="middle" className="text-[10px] sm:text-[12px] font-black fill-gray-500">S</text>

            {/* Center Dot */}
            <circle cx="50" cy="50" r="3" fill="white" stroke="#39b54a" strokeWidth="1.5" />
        </svg>
    </div>
);

const SitePlan: React.FC<SitePlanProps> = ({ houses, selectedHouseId, onSelectHouse }) => {
  // Logic updated to swap positions of V1 and V16 (effectively reversing the grid).
  // V16 (Even) starts at Top Left.
  // V1 (Odd) ends at Bottom Right.

  // Descending sort (V15, V13...)
  const odds = houses
    .filter(h => parseInt(h.id.substring(1)) % 2 !== 0)
    .sort((a, b) => parseInt(b.id.substring(1)) - parseInt(a.id.substring(1)));

  // Descending sort (V16, V14...)
  const evens = houses
    .filter(h => parseInt(h.id.substring(1)) % 2 === 0)
    .sort((a, b) => parseInt(b.id.substring(1)) - parseInt(a.id.substring(1)));

  // Top Row: Evens (V16 on Left)
  const topRow = evens;
  // Bottom Row: Odds (V1 on Right)
  const bottomRow = odds;

  return (
    <div className="bg-white p-2 rounded-3xl mb-12 select-none">
      
      {/* Outer Container with Street Labels Grid */}
      <div className="relative grid grid-cols-[40px_1fr_40px] grid-rows-[40px_1fr_40px] gap-0 bg-gray-50 rounded-2xl border border-gray-100 p-2 shadow-inner">
        
        {/* TOP LABEL (West) */}
        <div className="col-start-2 row-start-1 flex items-center justify-center overflow-hidden gap-2">
             <div className="flex items-center gap-1 text-[#39b54a]">
                 <Sunset className="w-4 h-4" />
                 <span className="text-[10px] sm:text-xs font-black whitespace-nowrap">OESTE</span>
             </div>
             <span className="text-xs sm:text-base font-black tracking-wider text-gray-400 uppercase whitespace-nowrap">
               Calle Miramar de la Cañada
             </span>
        </div>

        {/* RIGHT LABEL (North) - Calle Carlos V (Vertical) */}
        <div className="col-start-3 row-start-2 flex items-center justify-center">
             <span 
                className="text-xs sm:text-base font-black tracking-wider text-gray-400 uppercase whitespace-nowrap flex items-center gap-2"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }} 
             >
               <span className="text-[#39b54a] text-[10px] sm:text-xs">NORTE</span>
               Calle Carlos V
             </span>
        </div>

        {/* BOTTOM LABEL (East) */}
        <div className="col-start-2 row-start-3 flex items-center justify-center overflow-hidden gap-2">
             <span className="text-xs sm:text-base font-black tracking-wider text-gray-400 uppercase whitespace-nowrap">
               Calle Diario de Almería
             </span>
             <div className="flex items-center gap-1 text-[#39b54a]">
                 <span className="text-[10px] sm:text-xs font-black whitespace-nowrap">ESTE</span>
                 <Sunrise className="w-4 h-4" />
             </div>
        </div>

        {/* LEFT LABEL (South) - Calle Nirvana (Vertical) */}
        <div className="col-start-1 row-start-2 flex items-center justify-center">
             <span 
                className="text-xs sm:text-base font-black tracking-wider text-gray-400 uppercase whitespace-nowrap flex items-center gap-2"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
             >
               Calle Nirvana
               <span className="text-[#39b54a] text-[10px] sm:text-xs">SUR</span>
             </span>
        </div>

        {/* MAIN MAP AREA */}
        <div className="col-start-2 row-start-2 relative w-full aspect-[16/9] sm:aspect-[2.2/1] bg-[#eef2f6] rounded-xl overflow-hidden border border-gray-300 shadow-sm">
            
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
            
            <WindRose />

            {/* Central Area: Patios Interiores */}
            <div className="absolute top-1/2 left-2 right-2 h-16 sm:h-24 -mt-8 sm:-mt-12 flex flex-col items-center justify-center">
                {/* Separation Wall */}
                <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-300 border-y border-gray-400/30 z-0"></div>
                
                {/* Upper Patio Zone */}
                <div className="h-1/2 w-full flex items-center justify-center z-10 pb-2">
                    <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-gray-400/80 bg-[#eef2f6]/90 px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                      PATIOS INTERIORES
                    </span>
                </div>
            </div>

            {/* Top Row (Evens: V16 -> V2) */}
            <div className="absolute top-3 sm:top-5 left-3 sm:left-6 right-3 sm:right-6 h-[35%] sm:h-[38%] flex justify-between gap-1 sm:gap-2">
                {topRow.map(house => (
                    <HouseMarker 
                        key={house.id} 
                        house={house} 
                        isSelected={selectedHouseId === house.id} 
                        onClick={() => onSelectHouse(house.id)} 
                    />
                ))}
            </div>

            {/* Bottom Row (Odds: V15 -> V1) */}
            <div className="absolute bottom-3 sm:bottom-5 left-3 sm:left-6 right-3 sm:right-6 h-[35%] sm:h-[38%] flex justify-between gap-1 sm:gap-2">
                 {bottomRow.map(house => (
                    <HouseMarker 
                        key={house.id} 
                        house={house} 
                        isSelected={selectedHouseId === house.id} 
                        onClick={() => onSelectHouse(house.id)} 
                    />
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default SitePlan;