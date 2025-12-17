import React from 'react';
import { House } from '../types';
import { Home, Maximize, ArrowRight, Sun, Tag, Scaling } from 'lucide-react';

interface HouseCardProps {
  house: House;
  isSelected: boolean;
  includeIva: boolean;
  onClick: () => void;
}

const HouseCard: React.FC<HouseCardProps> = ({ house, isSelected, includeIva, onClick }) => {
  
  const finalPrice = React.useMemo(() => {
    return includeIva ? house.price * 1.10 : house.price;
  }, [house.price, includeIva]);

  const formattedPrice = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(finalPrice);

  // Calculate Price per Square Meter based on the currently displayed price (with or without IVA)
  const pricePerSqM = React.useMemo(() => {
    if (!house.totalConstructedArea || house.totalConstructedArea === 0) return null;
    
    const value = finalPrice / house.totalConstructedArea;
    return value.toLocaleString('es-ES', { maximumFractionDigits: 0 });
  }, [finalPrice, house.totalConstructedArea]);

  return (
    <div className={`relative group rounded-xl transition-all duration-300 border ${
      isSelected
        ? 'bg-[#39b54a] text-white border-[#39b54a] shadow-lg shadow-[#39b54a]/30 scale-[1.05] z-10'
        : 'bg-white text-gray-600 border-gray-100 hover:border-[#39b54a]/50 hover:shadow-md'
    }`}>
      {/* Main Clickable Area */}
      <div 
        onClick={onClick}
        className="p-3 w-full text-left cursor-pointer"
      >
        <div className="flex justify-between items-start mb-2">
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wide ${
            isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'
          }`}>
            {house.id}
          </span>
          <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-white/20' : 'bg-green-50 text-[#39b54a]'}`}>
            <Home className="h-3 w-3" />
          </div>
        </div>
        
        <h3 className="text-xs font-bold leading-tight mb-2 truncate" title={house.name}>
          {house.name}
        </h3>
        
        <div className="space-y-1 mb-3">
          {/* Parcel Area */}
          <div className={`flex items-center text-[10px] ${isSelected ? 'opacity-90' : 'opacity-60'}`}>
            <Maximize className="h-3 w-3 mr-1" />
            <span>{house.parcelArea} m² parcela</span>
          </div>
          
          {/* Orientation */}
          <div className={`flex items-center text-[10px] ${isSelected ? 'opacity-90' : 'opacity-60'}`}>
            <Sun className="h-3 w-3 mr-1" />
            <span>{house.orientation}</span>
          </div>

          {/* Price Per Square Meter Calculation */}
          {pricePerSqM && (
             <div className={`flex items-center text-[10px] ${isSelected ? 'opacity-90' : 'opacity-60'}`}>
               <Scaling className="h-3 w-3 mr-1" />
               <span>{pricePerSqM} €/m² {includeIva ? 'c/IVA' : 's/IVA'}</span>
             </div>
          )}

          {/* Total Price */}
          <div className="flex flex-col items-start mt-1">
             <div className={`flex items-center text-[10px] font-bold ${isSelected ? 'opacity-100' : 'text-[#39b54a]'}`}>
                <Tag className="h-3 w-3 mr-1" />
                <span>{formattedPrice}</span>
             </div>
             <span className={`text-[9px] ${isSelected ? 'text-green-100' : 'text-gray-400'}`}>
                {includeIva ? 'IVA incluido' : '+ IVA (10%)'}
             </span>
          </div>
        </div>

        <div className={`flex items-center justify-between text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-white' : 'text-[#39b54a]'}`}>
          <span>Ver Detalles</span>
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  );
};

export default HouseCard;