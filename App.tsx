import React, { useState, useEffect, useRef } from 'react';
import { FloorName } from './types';
import { Home, Sun, Layers, Calculator, CheckSquare, Square, BrickWall, Ruler, ArrowRight } from 'lucide-react';

// Hooks
import { useHouseData } from './hooks/useHouseData';

// Utilities
import { generateHousePDF } from './utils/pdfGenerator';

// Components (Modular Architecture)
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import Footer from './components/Footer';
import SitePlan from './components/SitePlan';
import AdminPanel from './components/AdminPanel';
import ImageViewer from './components/ImageViewer';
import FloorDetail from './components/FloorDetail';
import RoomList from './components/RoomList';
import PriceToggle from './components/PriceToggle';
import HouseGrid from './components/HouseGrid';
import ContactSection from './components/ContactSection';

const App: React.FC = () => {
  // Logic extracted to custom hook
  const { houses, selectedHouse, selectedHouseId, setSelectedHouseId } = useHouseData();

  // Local UI State
  const [activeFloorName, setActiveFloorName] = useState<FloorName>(FloorName.BAJA);
  const [isZooming, setIsZooming] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [includeIva, setIncludeIva] = useState(false);
  
  // Expanded Plan View State
  const [isPlanExpanded, setIsPlanExpanded] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  
  // GLOBAL FLOOR PANEL STATE
  const [showConstructedGlobal, setShowConstructedGlobal] = useState(false);
  const [checkedFloors, setCheckedFloors] = useState<string[]>([]);

  const detailsRef = useRef<HTMLDivElement>(null);

  // Helper to get active floor object
  const activeFloor = selectedHouse.floors.find(f => f.name === activeFloorName) || selectedHouse.floors[0];

  // Price formatting helper
  const formatPrice = (price: number) => {
    const finalPrice = includeIva ? price * 1.10 : price;
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(finalPrice);
  };

  // Reset selections when house changes
  useEffect(() => {
    setSelectedRooms([]);
    setIsPlanExpanded(false);
    setCheckedFloors([]); // Reset calculator selection
    setShowConstructedGlobal(false);
  }, [selectedHouseId]);

  const handleHouseSelection = (id: string) => {
    setSelectedHouseId(id);
    setIsZooming(true);
    setTimeout(() => {
        detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => setIsZooming(false), 1000);
    }, 100);
  };

  const toggleRoomSelection = (roomName: string) => {
    setSelectedRooms(prev => 
      prev.includes(roomName) 
        ? prev.filter(name => name !== roomName)
        : [...prev, roomName]
    );
  };

  const handleSelectAll = (roomNames: string[]) => {
      setSelectedRooms(roomNames);
  };

  const handleDownloadPDF = () => {
    setIsGeneratingPdf(true);
    setTimeout(() => {
        // Pass the showConstructedGlobal state to the generator
        generateHousePDF(selectedHouse, includeIva, showConstructedGlobal);
        setIsGeneratingPdf(false);
    }, 100);
  };

  // --- CALCULATOR LOGIC ---
  const toggleFloorCheck = (floorName: string) => {
    setCheckedFloors(prev => 
      prev.includes(floorName)
        ? prev.filter(f => f !== floorName)
        : [...prev, floorName]
    );
  };

  const calculateTotalChecked = () => {
    let interior = 0;
    let exterior = 0;

    selectedHouse.floors.forEach(f => {
      if (checkedFloors.includes(f.name)) {
        // Interior
        if (showConstructedGlobal) {
          interior += f.totalConstructedArea || (f.totalUsefulArea * 1.15);
        } else {
          interior += f.totalUsefulArea;
        }
        // Exterior
        exterior += f.outdoorArea || 0;
      }
    });

    return { interior, exterior, total: interior + exterior };
  };

  const totals = calculateTotalChecked();

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 pb-24">
      <Header onOpenAdmin={() => setIsAdminOpen(true)} />
      
      <HeroSection />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mt-6">
        
        <SitePlan 
          houses={houses} 
          selectedHouseId={selectedHouseId} 
          onSelectHouse={handleHouseSelection} 
        />

        <PriceToggle 
          includeIva={includeIva} 
          setIncludeIva={setIncludeIva} 
        />

        <HouseGrid 
          houses={houses}
          selectedHouseId={selectedHouseId}
          includeIva={includeIva}
          onSelectHouse={handleHouseSelection}
        />

        {/* Details Section - Applied "Lupa" Zoom Effect */}
        <div ref={detailsRef} className={`grid grid-cols-1 lg:grid-cols-12 gap-12 transition-all duration-700 transform ${isZooming ? 'scale-[1.05] -translate-y-4' : 'scale-100 translate-y-0'}`}>
          
          {/* LEFT COLUMN: INFO & FLOOR SELECTOR PANEL */}
          <div className="lg:col-span-4 space-y-8 order-2 lg:order-1">
            {isPlanExpanded ? (
               <div className="h-full sticky top-24 animate-fadeIn">
                   <RoomList 
                      rooms={activeFloor.rooms}
                      selectedRooms={selectedRooms}
                      onToggleRoom={toggleRoomSelection}
                      onClearSelection={() => setSelectedRooms([])}
                      onSelectAll={handleSelectAll}
                      totalUsefulArea={activeFloor.totalUsefulArea}
                      outdoorArea={activeFloor.outdoorArea}
                      showConstructed={showConstructedGlobal}
                      setShowConstructed={setShowConstructedGlobal}
                      onDownloadPdf={handleDownloadPDF}
                      isGeneratingPdf={isGeneratingPdf}
                   />
               </div>
            ) : (
               <div className={`bg-white rounded-3xl p-6 border border-gray-200 shadow-xl transition-all duration-500 sticky top-24 ${isZooming ? 'shadow-2xl shadow-[#39b54a]/20 border-[#39b54a]/30 ring-2 ring-[#39b54a]/10' : 'shadow-gray-100/50'}`}>
                
                {/* House Info Header */}
                <div className="border-b border-gray-100 pb-6 mb-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                            <span className="inline-block px-3 py-1 bg-[#39b54a]/10 text-[#39b54a] text-xs font-bold rounded-full tracking-wide">
                                {selectedHouse.id}
                            </span>
                            <span className="flex items-center gap-1 text-[10px] font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-full border border-gray-100 uppercase tracking-wide">
                                <Sun className="w-3 h-3 text-amber-400" />
                                {selectedHouse.orientation}
                            </span>
                        </div>

                        {selectedHouse.price && (
                            <div className="flex flex-col items-end">
                                <div className={`text-xl font-black text-gray-900 bg-gray-50 px-3 py-1 rounded-lg transition-colors duration-500 ${isZooming ? 'bg-[#39b54a] text-white' : ''}`}>
                                    {formatPrice(selectedHouse.price)}
                                </div>
                                <button 
                                  onClick={() => setIncludeIva(!includeIva)}
                                  className={`text-[10px] font-bold mt-1 px-2 py-0.5 rounded cursor-pointer transition-all border ${
                                    includeIva 
                                        ? 'bg-[#39b54a]/10 text-[#39b54a] border-[#39b54a]/20' 
                                        : 'bg-gray-50 text-gray-400 border-gray-200 hover:border-gray-300'
                                  }`}
                                >
                                    {includeIva ? 'IVA (10%) Incluido' : '+ IVA (10%) No incluido'}
                                </button>
                            </div>
                        )}
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 leading-none mb-2">{selectedHouse.name}</h3>
                    <div className="flex flex-wrap gap-2 mt-3">
                        <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded flex items-center gap-1">
                            <Home className="w-3 h-3" /> {selectedHouse.type}
                        </span>
                    </div>
                </div>

                {/* --- FLOOR SELECTOR PANEL & CALCULATOR --- */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                            <Layers className="h-4 w-4 text-[#39b54a]" /> Plantas
                        </h4>
                        
                        {/* GLOBAL TOGGLE: Useful vs Constructed */}
                        <button 
                            onClick={() => setShowConstructedGlobal(!showConstructedGlobal)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all border ${
                                showConstructedGlobal 
                                ? 'bg-gray-900 text-white border-gray-900' 
                                : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            {showConstructedGlobal ? <BrickWall className="h-3 w-3" /> : <Ruler className="h-3 w-3" />}
                            {showConstructedGlobal ? 'Construidos' : 'Útiles'}
                        </button>
                    </div>

                    <div className="space-y-2">
                        {selectedHouse.floors.map((floor) => {
                            const isChecked = checkedFloors.includes(floor.name);
                            const isActive = activeFloorName === floor.name;
                            const areaToShow = showConstructedGlobal 
                                ? (floor.totalConstructedArea || floor.totalUsefulArea * 1.15)
                                : floor.totalUsefulArea;

                            return (
                                <div key={floor.name} className={`flex items-center gap-2 rounded-xl border p-1 pr-3 transition-all ${isActive ? 'border-[#39b54a] bg-[#39b54a]/5' : 'border-gray-100 bg-white hover:border-gray-300'}`}>
                                    {/* Checkbox for Calculator */}
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); toggleFloorCheck(floor.name); }}
                                        className="p-2 text-gray-400 hover:text-[#39b54a] transition-colors"
                                        title="Añadir a la suma total"
                                    >
                                        {isChecked 
                                            ? <CheckSquare className="h-5 w-5 text-[#39b54a]" /> 
                                            : <Square className="h-5 w-5" />}
                                    </button>

                                    {/* Main Selection Button */}
                                    <button
                                        onClick={() => { setActiveFloorName(floor.name); }}
                                        className="flex-1 flex items-center justify-between text-left"
                                    >
                                        <div className="flex flex-col">
                                            <span className={`text-sm font-bold ${isActive ? 'text-[#39b54a]' : 'text-gray-700'}`}>
                                                {floor.name}
                                            </span>
                                            {/* Outdoor Area Small Label */}
                                            {floor.outdoorArea && floor.outdoorArea > 0 ? (
                                                <span className="text-[10px] text-gray-400 font-medium">
                                                    Ext: {floor.outdoorArea} m²
                                                </span>
                                            ) : (
                                                <span className="text-[10px] text-gray-300 italic">Interior</span>
                                            )}
                                        </div>
                                        
                                        <div className="flex flex-col items-end">
                                            <span className={`text-sm font-bold ${isActive ? 'text-[#39b54a]' : 'text-gray-900'}`}>
                                                {areaToShow.toFixed(2)} m²
                                            </span>
                                        </div>
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {/* SUM CALCULATOR RESULT */}
                    {checkedFloors.length > 0 && (
                        <div className="mt-4 bg-gray-900 rounded-xl p-4 text-white animate-fadeIn shadow-lg">
                            <div className="flex items-center gap-2 mb-3 border-b border-gray-700 pb-2">
                                <Calculator className="h-4 w-4 text-[#39b54a]" />
                                <span className="text-xs font-bold uppercase tracking-widest">Calculadora Total</span>
                            </div>
                            
                            <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">{showConstructedGlobal ? 'Interior (Const.)' : 'Interior (Útil)'}</span>
                                    <span className="font-mono font-bold">{totals.interior.toFixed(2)} m²</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Exterior</span>
                                    <span className="font-mono font-bold">{totals.exterior.toFixed(2)} m²</span>
                                </div>
                                <div className="flex justify-between text-base font-black pt-2 border-t border-gray-700 mt-2 text-[#39b54a]">
                                    <span>TOTAL</span>
                                    <span>{totals.total.toFixed(2)} m²</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => setCheckedFloors([])}
                                className="w-full text-center text-[10px] text-gray-500 hover:text-white mt-3 transition-colors"
                            >
                                Limpiar selección
                            </button>
                        </div>
                    )}
                </div>

               </div>
            )}
          </div>

          {/* RIGHT COLUMN: DETAIL VIEW */}
          <div className="lg:col-span-8 order-1 lg:order-2">
            {isPlanExpanded ? (
                <div className="h-full">
                    <ImageViewer 
                        isOpen={true}
                        variant="embedded"
                        imageUrl={activeFloor.imagePlaceholder}
                        altText={`Plano ${activeFloor.name}`}
                        onClose={() => setIsPlanExpanded(false)}
                    />
                </div>
            ) : (
                <>
                {selectedHouse.floors.map((floor) => (
                    <div key={floor.name} className={activeFloorName === floor.name ? 'block animate-fadeIn' : 'hidden'}>
                        <FloorDetail 
                           floor={floor} 
                           selectedRooms={selectedRooms}
                           onToggleRoom={toggleRoomSelection}
                           onClearSelection={() => setSelectedRooms([])}
                           onSelectAll={handleSelectAll}
                           onOpenViewer={() => setIsPlanExpanded(true)}
                           showConstructed={showConstructedGlobal}
                           setShowConstructed={setShowConstructedGlobal}
                           onDownloadPdf={handleDownloadPDF}
                           isGeneratingPdf={isGeneratingPdf}
                        />
                    </div>
                ))}

                {/* MOBILE FLOOR SELECTOR (Mirrors Desktop Functionality) */}
                <div className="block lg:hidden mt-6 bg-white p-6 rounded-3xl border border-gray-200 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Layers className="h-4 w-4" /> Cambiar Planta
                        </h4>
                         {/* GLOBAL TOGGLE MOBILE */}
                         <button 
                            onClick={() => setShowConstructedGlobal(!showConstructedGlobal)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all border ${
                                showConstructedGlobal 
                                ? 'bg-gray-900 text-white border-gray-900' 
                                : 'bg-gray-50 text-gray-500 border-gray-200'
                            }`}
                        >
                            {showConstructedGlobal ? 'Construido' : 'Útil'}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {selectedHouse.floors.map((floor) => {
                             const isChecked = checkedFloors.includes(floor.name);
                             const isActive = activeFloorName === floor.name;
                             const areaToShow = showConstructedGlobal 
                                ? (floor.totalConstructedArea || floor.totalUsefulArea * 1.15)
                                : floor.totalUsefulArea;

                             return (
                                <div key={floor.name} className={`flex items-center p-2 rounded-xl border transition-all ${isActive ? 'border-gray-900 ring-1 ring-gray-900 bg-gray-50' : 'border-gray-100'}`}>
                                     <button 
                                        onClick={(e) => { e.stopPropagation(); toggleFloorCheck(floor.name); }}
                                        className="p-2 mr-2 text-gray-300 hover:text-[#39b54a]"
                                    >
                                        {isChecked 
                                            ? <CheckSquare className="h-5 w-5 text-[#39b54a]" /> 
                                            : <Square className="h-5 w-5" />}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setActiveFloorName(floor.name);
                                            detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                        }}
                                        className="flex-1 flex justify-between items-center"
                                    >
                                        <div className="text-left">
                                            <span className="font-bold text-xs block text-gray-800">{floor.name}</span>
                                            {floor.outdoorArea && floor.outdoorArea > 0 && (
                                                <span className="text-[10px] text-gray-400">Ext: {floor.outdoorArea} m²</span>
                                            )}
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-500">{areaToShow.toFixed(2)} m²</span>
                                    </button>
                                </div>
                             )
                        })}
                    </div>
                </div>
                
                <ContactSection houseName={selectedHouse.name} />
                </>
            )}
          </div>
        </div>

      </main>

      <Footer />
      <AdminPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />

    </div>
  );
};

export default App;