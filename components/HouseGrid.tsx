import React from 'react';
import { House } from '../types';
import HouseCard from './HouseCard';

interface HouseGridProps {
  houses: House[];
  selectedHouseId: string;
  includeIva: boolean;
  onSelectHouse: (id: string) => void;
}

const HouseGrid: React.FC<HouseGridProps> = ({ houses, selectedHouseId, includeIva, onSelectHouse }) => {
  return (
    <div className="mb-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
         {houses.map((house) => (
           <HouseCard 
             key={house.id} 
             house={house} 
             isSelected={selectedHouseId === house.id}
             includeIva={includeIva}
             onClick={() => onSelectHouse(house.id)}
           />
         ))}
       </div>
    </div>
  );
};

export default HouseGrid;
