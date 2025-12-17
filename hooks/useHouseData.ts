
import { useState, useEffect, useCallback } from 'react';
import { House, FloorName } from '../types';
import { HOUSES } from '../data/houseRepository';
import { DEFAULT_FLOOR_PLANS } from '../constants';
import { STORAGE_KEYS, getImageFromStorage, getCalibration } from '../utils/storageUtils';

export const useHouseData = () => {
  const [houses, setHouses] = useState<House[]>(HOUSES);
  const [selectedHouseId, setSelectedHouseId] = useState<string>("V3"); 
  const [selectedHouse, setSelectedHouse] = useState<House>(HOUSES.find(h => h.id === "V3")!);

  // Function to refresh house images AND calibration from storage (IndexedDB)
  const refreshHouseData = useCallback(async () => {
    try {
        // 1. Load Images
        const sotanoImg = (await getImageFromStorage(STORAGE_KEYS.SOTANO)) || DEFAULT_FLOOR_PLANS.SOTANO;
        const bajaImg = (await getImageFromStorage(STORAGE_KEYS.BAJA)) || DEFAULT_FLOOR_PLANS.BAJA;
        const primeraImg = (await getImageFromStorage(STORAGE_KEYS.PRIMERA)) || DEFAULT_FLOOR_PLANS.PRIMERA;
        const cubiertaImg = (await getImageFromStorage(STORAGE_KEYS.CUBIERTA)) || DEFAULT_FLOOR_PLANS.CUBIERTA;

        // 2. Load Calibration Data
        // Structure expected: { [FloorName]: { [RoomName]: {x, y} } }
        const calibrationData = (await getCalibration()) || {};

        const updatedHouses = HOUSES.map(house => ({
        ...house,
        floors: house.floors.map(floor => {
            // Apply Image
            let newImg = floor.imagePlaceholder;
            if (floor.name === FloorName.SOTANO) newImg = sotanoImg;
            if (floor.name === FloorName.BAJA) newImg = bajaImg;
            if (floor.name === FloorName.PRIMERA) newImg = primeraImg;
            if (floor.name === FloorName.CUBIERTA) newImg = cubiertaImg;
            
            // Apply Calibration (Markers)
            const floorCalibration = calibrationData[floor.name] || {};
            const updatedRooms = floor.rooms.map(room => {
                const savedPos = floorCalibration[room.name];
                return {
                    ...room,
                    markerPosition: savedPos || room.markerPosition
                };
            });

            return { ...floor, imagePlaceholder: newImg, rooms: updatedRooms };
        })
        }));

        setHouses(updatedHouses);
        
        // Also update selected house reference if needed
        const currentSelected = updatedHouses.find(h => h.id === selectedHouseId);
        if (currentSelected) setSelectedHouse(currentSelected);
    } catch (error) {
        console.error("Error refreshing data:", error);
    }
  }, [selectedHouseId]);

  // Initial load and Event Listener for Storage Updates
  useEffect(() => {
    refreshHouseData();
    
    const handleStorageUpdate = () => refreshHouseData();
    window.addEventListener('storage-update', handleStorageUpdate);
    
    return () => {
      window.removeEventListener('storage-update', handleStorageUpdate);
    };
  }, [refreshHouseData]);

  // Update selected house object when ID changes
  useEffect(() => {
    const house = houses.find(h => h.id === selectedHouseId);
    if (house) {
      setSelectedHouse(house);
    }
  }, [selectedHouseId, houses]);

  return {
    houses,
    selectedHouse,
    selectedHouseId,
    setSelectedHouseId,
    refreshHouseImages: refreshHouseData
  };
};
