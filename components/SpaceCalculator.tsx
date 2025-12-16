import React, { useState } from 'react';
import { Room } from '../types';
import { Plus, Trash2, AlertCircle, Sofa } from 'lucide-react';

interface SpaceCalculatorProps {
  rooms: Room[];
}

interface FurnitureItem {
  id: string;
  name: string;
  width: number;
  length: number;
  color: string;
}

const COLORS = [
  'bg-orange-100 border-orange-300 text-orange-900',
  'bg-blue-100 border-blue-300 text-blue-900',
  'bg-purple-100 border-purple-300 text-purple-900',
  'bg-pink-100 border-pink-300 text-pink-900',
  'bg-yellow-100 border-yellow-300 text-yellow-900',
  'bg-indigo-100 border-indigo-300 text-indigo-900',
];

const SpaceCalculator: React.FC<SpaceCalculatorProps> = ({ rooms }) => {
  const [selectedRoomIdx, setSelectedRoomIdx] = useState<number>(0);
  const [items, setItems] = useState<FurnitureItem[]>([]);
  const [newItem, setNewItem] = useState({ name: 'Mueble', width: 1.0, length: 1.0 });

  const selectedRoom = rooms[selectedRoomIdx];

  // Helper to estimate room dimensions (assuming 4:3 ratio for visualization canvas)
  const roomRatio = 4/3;
  const roomWidthMeters = Math.sqrt(selectedRoom.area / roomRatio);
  const roomLengthMeters = selectedRoom.area / roomWidthMeters;

  const usedArea = items.reduce((acc, item) => acc + (item.width * item.length), 0);
  const percentUsed = Math.min(100, (usedArea / selectedRoom.area) * 100);

  const addItem = () => {
    if (newItem.width <= 0 || newItem.length <= 0) return;
    setItems([
      ...items,
      {
        id: Math.random().toString(36).substr(2, 9),
        name: newItem.name,
        width: newItem.width,
        length: newItem.length,
        color: COLORS[items.length % COLORS.length]
      }
    ]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  // Scale for visualization: 1 meter = 35 pixels
  const SCALE = 35; 

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Controls */}
      <div className="lg:w-1/3 space-y-6">
        <div className="bg-[#39b54a]/5 p-4 rounded-xl border border-[#39b54a]/20">
          <label className="block text-sm font-semibold text-[#39b54a] mb-2">Selecciona Estancia</label>
          <select 
            value={selectedRoomIdx}
            onChange={(e) => {
              setSelectedRoomIdx(Number(e.target.value));
              setItems([]); // Clear items on room switch
            }}
            className="w-full p-2.5 rounded-lg border-gray-200 focus:ring-[#39b54a] focus:border-[#39b54a] bg-white text-gray-700 outline-none transition-shadow"
          >
            {rooms.map((room, idx) => (
              <option key={idx} value={idx}>{room.name} ({room.area} m²)</option>
            ))}
          </select>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Sofa className="h-5 w-5 text-[#39b54a]" /> Nuevo Objeto
          </h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Nombre</label>
              <input 
                type="text" 
                value={newItem.name}
                onChange={e => setNewItem({...newItem, name: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#39b54a] outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Ancho (m)</label>
                <input 
                  type="number" 
                  step="0.1"
                  min="0.1"
                  value={newItem.width}
                  onChange={e => setNewItem({...newItem, width: parseFloat(e.target.value)})}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#39b54a] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Largo (m)</label>
                <input 
                  type="number" 
                  step="0.1"
                  min="0.1"
                  value={newItem.length}
                  onChange={e => setNewItem({...newItem, length: parseFloat(e.target.value)})}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#39b54a] outline-none"
                />
              </div>
            </div>
            <button 
              onClick={addItem}
              className="w-full bg-[#39b54a] text-white py-2.5 rounded-lg hover:bg-[#2ea03f] transition font-medium text-sm flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" /> Añadir al Espacio
            </button>
          </div>
        </div>

        {items.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <h4 className="font-bold text-gray-700 mb-3 text-sm">Objetos Añadidos ({items.length})</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-gray-100 text-sm shadow-sm group">
                   <div className="flex items-center gap-2">
                     <div className={`w-3 h-3 rounded-full ${item.color.split(' ')[0]}`}></div>
                     <span>{item.name} <span className="text-gray-400 text-xs ml-1">({item.width}x{item.length}m)</span></span>
                   </div>
                   <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                     <Trash2 className="h-4 w-4" />
                   </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Visualizer */}
      <div className="lg:w-2/3 bg-gray-50 rounded-xl border border-gray-200 p-6 flex flex-col relative overflow-hidden">
         <div className="flex justify-between items-end mb-6 z-10">
            <div>
              <h3 className="font-bold text-lg text-gray-800 leading-tight">Simulación de Superficie</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-xs">Representación esquemática para comparar áreas. La forma real de la habitación puede variar.</p>
            </div>
            <div className="text-right bg-white p-2 px-4 rounded-xl border border-gray-100 shadow-sm">
              <span className="block text-2xl font-bold text-[#39b54a]">{percentUsed.toFixed(0)}%</span>
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Ocupado</span>
            </div>
         </div>

         {/* Canvas Area */}
         <div className="flex-1 flex items-center justify-center overflow-auto bg-white rounded-xl border border-gray-100 relative p-8">
             {/* Room Container */}
            <div 
              className="relative bg-white border-2 border-gray-800 shadow-2xl transition-all duration-500"
              style={{
                width: `${roomWidthMeters * SCALE}px`,
                height: `${roomLengthMeters * SCALE}px`,
                minWidth: '200px',
                minHeight: '200px'
              }}
            >
              <div className="absolute -top-6 left-0 text-gray-400 text-xs font-mono">
                {selectedRoom.name} ({selectedRoom.area} m²)
              </div>
              
              {/* Grid Lines for scale reference (approx 1m) */}
              <div className="absolute inset-0 opacity-5 pointer-events-none" 
                   style={{
                     backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
                     backgroundSize: `${SCALE}px ${SCALE}px`
                   }}
              ></div>

              {/* Items Layout - Simple Flex packing simulation */}
              <div className="flex flex-wrap content-start gap-1 p-1 h-full w-full overflow-hidden">
                 {items.map(item => (
                   <div 
                     key={item.id}
                     className={`${item.color} border-2 rounded shadow-sm flex flex-col items-center justify-center text-[10px] font-bold leading-tight relative cursor-help transition-transform hover:scale-105`}
                     style={{
                       width: `${item.width * SCALE}px`,
                       height: `${item.length * SCALE}px`,
                     }}
                     title={`${item.name}: ${item.width}m x ${item.length}m (${(item.width * item.length).toFixed(2)}m²)`}
                   >
                     <span className="truncate w-full text-center px-1">{item.name}</span>
                   </div>
                 ))}
              </div>
            </div>
         </div>

         {percentUsed > 60 && (
           <div className="mt-4 flex items-start gap-3 text-orange-700 bg-orange-50 p-4 rounded-xl text-sm font-medium border border-orange-100 animate-fadeIn">
             <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
             <span>Has ocupado más del 60% de la superficie útil. Recuerda dejar espacio para zonas de paso y apertura de puertas.</span>
           </div>
         )}
      </div>
    </div>
  );
};

export default SpaceCalculator;