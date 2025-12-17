import React from 'react';
import { Room } from '../types';
import { Ruler, Calculator, CheckSquare, Square, RotateCcw } from 'lucide-react';

interface RoomListProps {
  rooms: Room[];
  selectedRooms: string[];
  onToggleRoom: (roomName: string) => void;
  onClearSelection: () => void;
  outdoorArea?: number;
  totalUsefulArea: number;
  totalConstructedArea?: number;
  showConstructed?: boolean; // Now passed from parent
}

const RoomList: React.FC<RoomListProps> = ({ 
  rooms, 
  selectedRooms, 
  onToggleRoom, 
  onClearSelection,
  outdoorArea,
  totalUsefulArea,
  totalConstructedArea,
  showConstructed = false
}) => {
  
  // Helper to get area based on mode
  const getArea = (room: Room) => {
    if (showConstructed) {
        // Return constructed area if available, otherwise estimate or fallback
        return room.constructedArea || room.area * 1.25;
    }
    return room.area;
  };

  const totalSelectedArea = rooms
    .filter(room => selectedRooms.includes(room.name))
    .reduce((sum, room) => sum + getArea(room), 0);

  // Determine display total for the floor
  const floorDisplayTotal = showConstructed 
    ? (totalConstructedArea || totalUsefulArea * 1.15)
    : totalUsefulArea;

  return (
    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 h-full flex flex-col transition-all">
        <div className="mb-4 flex flex-col gap-2">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                <Ruler className="h-4 w-4 text-[#39b54a]" /> 
                Desglose de Estancias
            </h4>
            <p className="text-[10px] text-gray-400">
                {showConstructed ? 'Mostrando Metros Construidos' : 'Mostrando Metros Útiles'}
            </p>
        </div>
        
        <div className="flex-1 overflow-y-auto pr-1 space-y-2">
            {rooms.map((room, idx) => {
            const isSelected = selectedRooms.includes(room.name);
            const area = getArea(room);
            
            return (
                <button 
                key={idx} 
                onClick={() => onToggleRoom(room.name)}
                className={`w-full flex items-center justify-between p-3 px-4 rounded-xl border transition-all shadow-sm group ${
                    isSelected 
                        ? (showConstructed ? 'bg-gray-900/5 border-gray-900 text-gray-900' : 'bg-[#39b54a]/10 border-[#39b54a] text-[#39b54a]')
                        : 'bg-white border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
                >
                <div className="flex items-center gap-3">
                    {isSelected 
                        ? <CheckSquare className="h-4 w-4 flex-shrink-0" /> 
                        : <Square className="h-4 w-4 flex-shrink-0 text-gray-300 group-hover:text-gray-400" />
                    }
                    <span className={`font-medium text-sm text-left ${isSelected ? 'font-bold' : ''}`}>{room.name}</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className={`font-mono font-bold text-sm ${isSelected ? (showConstructed ? 'text-gray-900' : 'text-[#39b54a]') : 'text-gray-900'}`}>
                        {area.toFixed(2)} m²
                    </span>
                    {showConstructed && (
                        <span className="text-[9px] text-gray-400 uppercase font-medium">Const.</span>
                    )}
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
    </div>
  );
};

export default RoomList;