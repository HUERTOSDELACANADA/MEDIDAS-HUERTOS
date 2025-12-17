import React from 'react';
import { Percent, CheckCircle2, Circle } from 'lucide-react';

interface PriceToggleProps {
  includeIva: boolean;
  setIncludeIva: (value: boolean) => void;
}

const PriceToggle: React.FC<PriceToggleProps> = ({ includeIva, setIncludeIva }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center border-b border-gray-100 pb-4 mb-6 gap-4">
        <div className="flex flex-col">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                Visualización de Precios
            </h4>
            <p className="text-[10px] text-gray-400">Elige si quieres ver el precio base o el total con impuestos</p>
        </div>

        {/* Intuitive Segmented Control */}
        <div className="bg-gray-100 p-1.5 rounded-xl flex items-center shadow-inner">
            <button
                onClick={() => setIncludeIva(false)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
                    !includeIva
                        ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200'
                        : 'text-gray-500 hover:text-gray-700'
                }`}
            >
                <div className={`w-3 h-3 rounded-full border-2 flex items-center justify-center ${!includeIva ? 'border-[#39b54a]' : 'border-gray-400'}`}>
                    {!includeIva && <div className="w-1.5 h-1.5 rounded-full bg-[#39b54a]" />}
                </div>
                Precio Base
            </button>

            <button
                onClick={() => setIncludeIva(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
                    includeIva
                        ? 'bg-[#39b54a] text-white shadow-md'
                        : 'text-gray-500 hover:text-gray-700'
                }`}
            >
                {includeIva ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
                Con IVA (+10%)
            </button>
        </div>
    </div>
  );
};

export default PriceToggle;