import React from 'react';
import { Room } from '../types';
import { Ruler, Calculator, CheckSquare, Square, RotateCcw, FileDown, Loader2, CheckCheck } from 'lucide-react';

interface RoomListProps {
  rooms: Room[];
  selectedRooms: string[];
  onToggleRoom: (roomName: string) => void;
  onClearSelection: () => void;
  onSelectAll: (roomNames: string[]) => void;
  outdoorArea?: number;
  totalUsefulArea: number;
  totalConstructedArea?: number;
  showConstructed?: boolean; 
  setShowConstructed: (value: boolean) => void;
  onDownloadPdf: () => void;
  isGeneratingPdf: boolean;
}

const RoomList: React.FC<RoomListProps> = ({ 
  rooms, 
  selectedRooms, 
  onToggleRoom, 
  onClearSelection,
  onSelectAll,
  outdoorArea,
  totalUsefulArea,
  totalConstructedArea,
  showConstructed = false,
  setShowConstructed,
  onDownloadPdf,
  isGeneratingPdf
}) => {
  
  // Helper to get area based on mode
  const getArea = (room: Room) => {
    if (showConstructed) {
        // Return constructed area if available, otherwise estimate or fallback
        return room.constructedArea || room.area * 1.25;
    }
    return room.area;
  };

  // Helper to identify "Uncovered/Outdoor" spaces for styling
  const isUncoveredOutdoor = (name: string) => {
      const lower = name.toLowerCase();
      // Explicitly exclude "Cubierto"
      if (lower.includes('cubierto') && !lower.includes('descubierto')) return false;

      return lower.includes('descubierto') || 
             lower.includes('terraza') || 
             lower.includes('solárium') || 
             lower.includes('trasero') || 
             lower.includes('lateral') ||
             lower.includes('jardín') ||
             lower.includes('patio') || // Added generic patio check (caught if not covered)
             lower.includes('inglés');  // Specifically for Patio Inglés
  };

  const totalSelectedArea = rooms
    .filter(room => selectedRooms.includes(room.name))
    .reduce((sum, room) => sum + getArea(room), 0);

  // Determine display total for the floor
  const floorDisplayTotal = showConstructed 
    ? (totalConstructedArea || totalUsefulArea * 1.15)
    : totalUsefulArea;

  const handleSelectAll = () => {
    onSelectAll(rooms.map(r => r.name));
  };

  return (
    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 h-full flex flex-col transition-all">
        <div className="mb-4 flex items-end justify-between">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                        <Ruler className="h-4 w-4 text-[#39b54a]" /> 
                        Desglose
                    </h4>
                    <button 
                        onClick={handleSelectAll}
                        className="flex items-center gap-1 text-[10px] font-bold text-[#39b54a] bg-[#39b54a]/10 px-2 py-0.5 rounded-full hover:bg-[#39b54a] hover:text-white transition-colors"
                        title="Seleccionar todas las estancias"
                    >
                        <CheckCheck className="h-3 w-3" />
                        Todo
                    </button>
                </div>
                <p className="text-[10px] text-gray-400">
                    Selecciona modo de visualización:
                </p>
            </div>
            
            {/* Interactive Selector / Toggle */}
            <div className="flex bg-gray-200 rounded-lg p-1 shadow-inner">
                <button 
                    onClick={() => setShowConstructed(false)}
                    className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
                        !showConstructed 
                        ? 'bg-white text-[#39b54a] shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Útil
                </button>
                <button 
                    onClick={() => setShowConstructed(true)}
                    className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
                        showConstructed 
                        ? 'bg-gray-900 text-white shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Construido
                </button>
            </div>
        </div>
        
        <div className="flex-1 overflow-y-auto pr-1 space-y-2">
            {rooms.map((room, idx) => {
            const isSelected = selectedRooms.includes(room.name);
            const area = getArea(room);
            const isGreenSpace = isUncoveredOutdoor(room.name);
            
            // Dynamic Classes based on state and type
            let containerClass = 'bg-white border-gray-200 hover:border-gray-300 text-gray-600';
            let iconColorClass = 'text-gray-300 group-hover:text-gray-400';
            let areaTextColor = 'text-gray-900';

            if (isSelected) {
                if (showConstructed) {
                    containerClass = 'bg-gray-900/5 border-gray-900 text-gray-900';
                    areaTextColor = 'text-gray-900';
                } else {
                    containerClass = 'bg-[#39b54a]/10 border-[#39b54a] text-[#39b54a]';
                    areaTextColor = 'text-[#39b54a]';
                }
            } else if (isGreenSpace) {
                // Not selected, but it is an outdoor space -> Green Styling (Text Only)
                // User requested: "SOLO LAS LETRAS NO EL RECUADRO"
                containerClass = 'bg-white border-gray-200 hover:border-gray-300 text-[#39b54a]';
                iconColorClass = 'text-[#39b54a]';
                areaTextColor = 'text-[#39b54a]';
            }

            return (
                <button 
                key={idx} 
                onClick={() => onToggleRoom(room.name)}
                className={`w-full flex items-center justify-between p-3 px-4 rounded-xl border transition-all shadow-sm group ${containerClass}`}
                >
                <div className="flex items-center gap-3">
                    {isSelected 
                        ? <CheckSquare className="h-4 w-4 flex-shrink-0" /> 
                        : <Square className={`h-4 w-4 flex-shrink-0 ${iconColorClass}`} />
                    }
                    <span className={`font-medium text-sm text-left ${isSelected ? 'font-bold' : ''}`}>
                        {room.name}
                    </span>
                </div>
                <div className="flex flex-col items-end">
                    <span className={`font-mono font-bold text-sm ${areaTextColor}`}>
                        {area.toFixed(2)} m²
                    </span>
                </div>
                </button>
            );
            })}
        </div>
        
        {/* Dynamic Calculator Section */}
        {selectedRooms.length > 0 && (
            <div className={`mt-6 p-5 bg-white rounded-xl border-2 shadow-lg animate-fadeIn sticky bottom-0 ${showConstructed ? 'border-gray-900/20' : 'border-[#39b54a]/20'}`}>
                <div className="flex justify-between items-center mb-2">
                    <div className={`flex items-center gap-2 font-bold text-sm ${showConstructed ? 'text-gray-900' : 'text-[#39b54a]'}`}>
                        <Calculator className="h-4 w-4" />
                        Calculadora {showConstructed ? '(Construida)' : '(Útil)'}
                    </div>
                    <button 
                        onClick={onClearSelection}
                        className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                    >
                        <RotateCcw className="h-3 w-3" /> Borrar
                    </button>
                </div>
                <div className="flex justify-between items-end border-t border-dashed border-gray-200 pt-3 mt-1">
                    <span className="text-xs text-gray-500">
                        {selectedRooms.length} estancias
                    </span>
                    <div className="text-right">
                        <span className="block text-2xl font-black text-gray-900 leading-none">
                            {totalSelectedArea.toFixed(2)} m²
                        </span>
                    </div>
                </div>
            </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-200">
             <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                 <span>{showConstructed ? 'Total Construido Planta:' : 'Total Útil Planta:'}</span>
                 <span className="font-bold">{floorDisplayTotal.toFixed(2)} m²</span>
             </div>
             {outdoorArea && outdoorArea > 0 && (
                <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Total Exterior:</span>
                    <span className="font-bold">{outdoorArea} m²</span>
                </div>
             )}
        </div>

        {/* PDF Download Button - Moved here */}
        <div className="mt-6">
            <button 
                onClick={onDownloadPdf}
                disabled={isGeneratingPdf}
                className="w-full bg-white border border-gray-300 hover:border-[#39b54a] hover:text-[#39b54a] text-gray-700 py-3 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
                {isGeneratingPdf ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4 text-gray-400 group-hover:text-[#39b54a]" />}
                {isGeneratingPdf ? "Generando..." : "Descargar Informe PDF"}
            </button>
        </div>
    </div>
  );
};

export default RoomList;