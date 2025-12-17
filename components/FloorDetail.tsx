
import React from 'react';
import { FloorPlan } from '../types';
import { ZoomIn } from 'lucide-react';
import RoomList from './RoomList';

interface FloorDetailProps {
  floor: FloorPlan;
  selectedRooms: string[];
  onToggleRoom: (roomName: string) => void;
  onClearSelection: () => void;
  onOpenViewer: () => void;
  showConstructed: boolean; // Controlled from App.tsx
}

const FloorDetail: React.FC<FloorDetailProps> = ({ 
  floor, 
  selectedRooms, 
  onToggleRoom, 
  onClearSelection, 
  onOpenViewer,
  showConstructed
}) => {
  // Use explicit constructed area if available, otherwise estimate with 1.15 coefficient
  const constructedArea = floor.totalConstructedArea || (floor.totalUsefulArea * 1.15);
  const displayArea = showConstructed ? constructedArea : floor.totalUsefulArea;

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/50 border border-gray-200 overflow-hidden flex flex-col transition-all duration-300">
      {/* Header Section */}
      <div className="p-8 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white">
        <div>
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">{floor.name}</h3>
          <p className="text-gray-400 text-sm font-medium">Distribución y Superficies</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {/* Static Area Display (Controlled by Panel in App.tsx) */}
          <div 
            className="group relative bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm transition-all text-left min-w-[140px]"
          >
            <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest transition-colors">
                {showConstructed ? 'Sup. Construida' : 'Sup. Útil'}
            </span>
            <span className="text-xl font-black text-[#39b54a] block mt-0.5">
                {displayArea.toFixed(2)} m²
            </span>
          </div>

          {floor.outdoorArea && floor.outdoorArea > 0 && (
            <div className="bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm">
                <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest">Exterior</span>
                <span className="text-xl font-black text-[#39b54a]">{floor.outdoorArea} m²</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-8 flex-1 bg-gray-50/50">
          <div className="max-w-7xl mx-auto animate-fadeIn grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
              
              {/* Left Column: Floor Plan Image with SVG Overlay */}
              <div className="bg-white rounded-2xl p-2 border border-gray-200 shadow-sm flex items-center justify-center relative group overflow-hidden min-h-[300px] h-full">
                  <div className="absolute inset-0 bg-gray-100/50 flex items-center justify-center -z-0">
                      <span className="text-gray-300 text-sm">Cargando plano...</span>
                  </div>
                  
                  {/* Container for Image + Markers */}
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img 
                       src={floor.imagePlaceholder} 
                       alt={`Plano ${floor.name}`}
                       className="relative z-10 w-full h-auto object-contain max-h-[500px] transition-transform duration-500 group-hover:scale-105 cursor-zoom-in"
                       onClick={onOpenViewer}
                    />
                    
                    {/* SVG Layer for Room Highlighting (DOTS) */}
                    <div className="absolute inset-0 z-20 w-full h-full pointer-events-none transition-transform duration-500 group-hover:scale-105">
                         {floor.rooms.map((room, idx) => {
                             if (selectedRooms.includes(room.name) && room.markerPosition) {
                                 return (
                                     <div 
                                        key={idx}
                                        className="absolute w-0 h-0 flex items-center justify-center"
                                        style={{ 
                                            left: `${room.markerPosition.x}%`, 
                                            top: `${room.markerPosition.y}%` 
                                        }}
                                     >
                                         <span className="relative flex h-6 w-6">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-6 w-6 bg-[#39b54a] border-2 border-white shadow-lg"></span>
                                        </span>
                                        {/* Optional Tooltip/Label */}
                                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                            {room.name}
                                        </div>
                                     </div>
                                 );
                             }
                             // Fallback for paths if no marker (legacy support)
                             if (selectedRooms.includes(room.name) && !room.markerPosition && room.path) {
                                 // Render SVG overlay as fallback? Or just nothing to force calibration.
                                 // Let's hide path to force using the dot logic as requested.
                                 return null; 
                             }
                             return null;
                         })}
                    </div>
                  </div>

                  <button 
                    onClick={onOpenViewer}
                    className="absolute bottom-4 right-4 z-30 bg-white/90 backdrop-blur text-gray-700 p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-[#39b54a] hover:text-white"
                  >
                     <ZoomIn className="h-5 w-5" />
                  </button>
                  <div className="absolute top-4 left-4 z-30 bg-white/80 backdrop-blur px-3 py-1 rounded-full border border-gray-100 text-[10px] font-bold uppercase tracking-wider text-gray-500 pointer-events-none">
                      Plano de Distribución
                  </div>
              </div>

              {/* Right Column: Room List via Reusable Component */}
              <div className="h-full">
                 <RoomList 
                    rooms={floor.rooms}
                    selectedRooms={selectedRooms}
                    onToggleRoom={onToggleRoom}
                    onClearSelection={onClearSelection}
                    totalUsefulArea={floor.totalUsefulArea}
                    totalConstructedArea={constructedArea}
                    outdoorArea={floor.outdoorArea}
                    showConstructed={showConstructed}
                 />
              </div>
          </div>
      </div>
    </div>
  );
};

export default FloorDetail;
