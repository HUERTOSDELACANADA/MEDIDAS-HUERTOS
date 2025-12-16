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
}

const RoomList: React.FC<RoomListProps> = ({ 
  rooms, 
  selectedRooms, 
  onToggleRoom, 
  onClearSelection,
  outdoorArea,
  totalUsefulArea
}) => {
  const totalSelectedArea = rooms
    .filter(room => selectedRooms.includes(room.name))
    .reduce((sum, room) => sum + room.area, 0);

  return (
    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 h-full flex flex-col">
        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-6 flex items-center justify-between">
            <div className="flex items-center">
                <Ruler className="h-4 w-4 mr-2 text-[#39b54a]" /> 
                Desglose de Estancias
            </div>
            <span className="text-[10px] text-gray-400 normal-case font-normal bg-white px-2 py-1 rounded border border-gray-100">
                Selecciona para sumar
            </span>
        </h4>
        
        <div className="flex-1 overflow-y-auto pr-1 space-y-2">
            {rooms.map((room, idx) => {
            const isSelected = selectedRooms.includes(room.name);
            return (
                <button 
                key={idx} 
                onClick={() => onToggleRoom(room.name)}
                className={`w-full flex items-center justify-between p-3 px-4 rounded-xl border transition-all shadow-sm group ${
                    isSelected 
                        ? 'bg-[#39b54a]/10 border-[#39b54a] text-[#39b54a]' 
                        : 'bg-white border-gray-200 hover:border-[#39b54a]/30 text-gray-600'
                }`}
                >
                <div className="flex items-center gap-3">
                    {isSelected 
                        ? <CheckSquare className="h-4 w-4 flex-shrink-0" /> 
                        : <Square className="h-4 w-4 flex-shrink-0 text-gray-300 group-hover:text-[#39b54a]" />
                    }
                    <span className={`font-medium text-sm text-left ${isSelected ? 'text-gray-900' : ''}`}>{room.name}</span>
                </div>
                <span className={`font-mono font-bold text-sm ${isSelected ? 'text-[#39b54a]' : 'text-gray-900'}`}>{room.area} m²</span>
                </button>
            );
            })}
        </div>
        
        {/* Dynamic Calculator Section */}
        {selectedRooms.length > 0 && (
            <div className="mt-6 p-5 bg-white rounded-xl border-2 border-[#39b54a]/20 shadow-lg animate-fadeIn sticky bottom-0">
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2 text-[#39b54a] font-bold text-sm">
                        <Calculator className="h-4 w-4" />
                        Calculadora
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
                 <span>Total Útil Planta:</span>
                 <span className="font-bold">{totalUsefulArea} m²</span>
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