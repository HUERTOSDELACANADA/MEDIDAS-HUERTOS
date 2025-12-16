import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import Footer from './components/Footer';
import HouseCard from './components/HouseCard';
import FloorDetail from './components/FloorDetail';
import SitePlan from './components/SitePlan';
import AdminPanel from './components/AdminPanel';
import ImageViewer from './components/ImageViewer';
import RoomList from './components/RoomList';
import { HOUSES, DEFAULT_FLOOR_PLANS } from './constants';
import { House, FloorName } from './types';
import { Home, Calendar, CheckCircle, FileDown, Sun } from 'lucide-react';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { STORAGE_KEYS, getImageFromStorage } from './utils/storageUtils';

const App: React.FC = () => {
  const [houses, setHouses] = useState<House[]>(HOUSES);
  const [selectedHouseId, setSelectedHouseId] = useState<string>("V3"); 
  const [selectedHouse, setSelectedHouse] = useState<House>(HOUSES.find(h => h.id === "V3")!);
  const [activeFloorName, setActiveFloorName] = useState<FloorName>(FloorName.BAJA);
  const [isZooming, setIsZooming] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  
  // New States for Expanded Plan View
  const [isPlanExpanded, setIsPlanExpanded] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);

  const detailsRef = useRef<HTMLDivElement>(null);

  // Helper to get active floor object
  const activeFloor = selectedHouse.floors.find(f => f.name === activeFloorName) || selectedHouse.floors[0];

  // Function to refresh house images from storage (Async now)
  const refreshHouseImages = async () => {
    try {
        const sotanoImg = (await getImageFromStorage(STORAGE_KEYS.SOTANO)) || DEFAULT_FLOOR_PLANS.SOTANO;
        const bajaImg = (await getImageFromStorage(STORAGE_KEYS.BAJA)) || DEFAULT_FLOOR_PLANS.BAJA;
        const primeraImg = (await getImageFromStorage(STORAGE_KEYS.PRIMERA)) || DEFAULT_FLOOR_PLANS.PRIMERA;
        const cubiertaImg = (await getImageFromStorage(STORAGE_KEYS.CUBIERTA)) || DEFAULT_FLOOR_PLANS.CUBIERTA;

        const updatedHouses = HOUSES.map(house => ({
        ...house,
        floors: house.floors.map(floor => {
            let newImg = floor.imagePlaceholder;
            if (floor.name === FloorName.SOTANO) newImg = sotanoImg;
            if (floor.name === FloorName.BAJA) newImg = bajaImg;
            if (floor.name === FloorName.PRIMERA) newImg = primeraImg;
            if (floor.name === FloorName.CUBIERTA) newImg = cubiertaImg;
            
            return { ...floor, imagePlaceholder: newImg };
        })
        }));

        setHouses(updatedHouses);
        
        // Also update selected house reference if needed
        const currentSelected = updatedHouses.find(h => h.id === selectedHouseId);
        if (currentSelected) setSelectedHouse(currentSelected);
    } catch (error) {
        console.error("Error refreshing images:", error);
    }
  };

  useEffect(() => {
    refreshHouseImages();
    
    // Listen for storage updates (from Admin Panel)
    const handleStorageUpdate = () => refreshHouseImages();
    window.addEventListener('storage-update', handleStorageUpdate);
    
    return () => {
      window.removeEventListener('storage-update', handleStorageUpdate);
    };
  }, [selectedHouseId]); // Re-run if selected ID changes to ensure current house is updated

  useEffect(() => {
    const house = houses.find(h => h.id === selectedHouseId);
    if (house) {
      setSelectedHouse(house);
    }
  }, [selectedHouseId, houses]);

  // Reset floor selections when house changes
  useEffect(() => {
    setSelectedRooms([]);
    setIsPlanExpanded(false);
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

  const generatePDF = () => {
    setIsGeneratingPdf(true);
    const doc = new jsPDF();
    const primaryColor = "#39b54a";
    const darkColor = "#1a1a1a";

    // Header
    doc.setFillColor(darkColor);
    doc.rect(0, 0, 210, 30, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text("RESIDENCIAL", 14, 12);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(primaryColor);
    doc.text("HUERTOS", 14, 19);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("DE LA CAÑADA", 42, 19);

    // Title
    doc.setTextColor(darkColor);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(`Informe de Superficies`, 14, 45);
    doc.setTextColor(primaryColor);
    doc.text(selectedHouse.name, 14, 55);

    // Main Info Box
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(14, 65, 182, 35, 3, 3, 'FD');

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    
    // Column 1
    doc.text("Identificador:", 20, 75);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(darkColor);
    doc.text(selectedHouse.id, 20, 80);
    
    // Column 2
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Tipología:", 60, 75);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(darkColor);
    doc.text(selectedHouse.type, 60, 80);

    // Column 3
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Orientación:", 100, 75);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(darkColor);
    doc.text(selectedHouse.orientation || "-", 100, 80);

    // Column 4
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Precio:", 140, 75);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(primaryColor);
    doc.setFontSize(12);
    doc.text(selectedHouse.price || "Consultar", 140, 80);

    // Row 2 Info
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Parcela:", 20, 90);
    doc.setTextColor(darkColor);
    doc.text(`${selectedHouse.parcelArea} m²`, 35, 90);
    
    doc.setTextColor(100, 100, 100);
    doc.text("Sup. Construida:", 100, 90);
    doc.setTextColor(darkColor);
    doc.text(`${selectedHouse.totalConstructedArea} m²`, 128, 90);

    let finalY = 110;

    // Iterate Floors
    selectedHouse.floors.forEach((floor) => {
        // Floor Header
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(primaryColor);
        doc.text(floor.name.toUpperCase(), 14, finalY);
        doc.line(14, finalY + 2, 196, finalY + 2); // Underline

        // Data for Table
        const tableData = floor.rooms.map(room => [room.name, `${room.area.toFixed(2)} m²`]);
        
        // Add Summary Row
        if(floor.outdoorArea && floor.outdoorArea > 0) {
             tableData.push(["TOTAL ÚTIL INTERIOR", `${floor.totalUsefulArea.toFixed(2)} m²`]);
             tableData.push(["ZONAS EXTERIORES", `${floor.outdoorArea.toFixed(2)} m²`]);
        } else {
             tableData.push(["TOTAL ÚTIL", `${floor.totalUsefulArea.toFixed(2)} m²`]);
        }

        autoTable(doc, {
            startY: finalY + 5,
            head: [['Estancia', 'Superficie']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [57, 181, 74], textColor: 255, fontStyle: 'bold' },
            columnStyles: {
                0: { cellWidth: 'auto' },
                1: { cellWidth: 40, halign: 'right', fontStyle: 'bold' },
            },
            styles: { fontSize: 9, cellPadding: 2 },
            footStyles: { fillColor: [240, 240, 240], textColor: 0, fontStyle: 'bold' },
            didParseCell: function(data) {
                // Style Summary Rows differently
                if (data.row.raw[0].toString().includes("TOTAL") || data.row.raw[0].toString().includes("ZONAS EXTERIORES")) {
                    data.cell.styles.fontStyle = 'bold';
                    data.cell.styles.textColor = [0, 0, 0];
                    data.cell.styles.fillColor = [245, 245, 245];
                }
            }
        });

        // @ts-ignore
        finalY = doc.lastAutoTable.finalY + 15;
        
        // Check for page break
        if (finalY > 250) {
            doc.addPage();
            finalY = 20;
        }
    });

    // Disclaimer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.setFont("helvetica", "normal");
    const disclaimer = "Nota: El presente documento tiene carácter informativo. Las superficies indicadas son útiles y pueden sufrir ligeras variaciones por exigencias técnicas durante la ejecución de la obra. El mobiliario es meramente decorativo.";
    const splitDisclaimer = doc.splitTextToSize(disclaimer, 180);
    doc.text(splitDisclaimer, 14, 280);

    // Save
    doc.save(`Informe_${selectedHouse.id}_HuertosDeLaCanada.pdf`);
    setIsGeneratingPdf(false);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 pb-24">
      <Header onOpenAdmin={() => setIsAdminOpen(true)} />
      
      <HeroSection />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mt-6">
        
        {/* Site Plan - Visual Selector */}
        <SitePlan 
          houses={houses} 
          selectedHouseId={selectedHouseId} 
          onSelectHouse={handleHouseSelection} 
        />

        {/* Secondary Grid Selector */}
        <div className="mb-16">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 text-center border-b border-gray-100 pb-2 mx-auto max-w-xs">
                Selección Rápida
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
             {houses.map((house) => (
               <HouseCard 
                 key={house.id} 
                 house={house} 
                 isSelected={selectedHouseId === house.id}
                 onClick={() => handleHouseSelection(house.id)}
               />
             ))}
           </div>
        </div>

        {/* Details Section - Applied "Lupa" Zoom Effect */}
        <div ref={detailsRef} className={`grid grid-cols-1 lg:grid-cols-12 gap-12 transition-all duration-700 transform ${isZooming ? 'scale-[1.05] -translate-y-4' : 'scale-100 translate-y-0'}`}>
          
          {/* 
            LEFT COLUMN LOGIC: 
            - Standard Mode: Shows House Summary and Floor Navigation.
            - Expanded Mode: Shows Room List (moves from inside detail to here).
          */}
          <div className="lg:col-span-4 space-y-8 order-2 lg:order-1">
            {isPlanExpanded ? (
               // EXPANDED MODE LEFT COLUMN: ROOM LIST
               <div className="h-full sticky top-24 animate-fadeIn">
                   <RoomList 
                      rooms={activeFloor.rooms}
                      selectedRooms={selectedRooms}
                      onToggleRoom={toggleRoomSelection}
                      onClearSelection={() => setSelectedRooms([])}
                      totalUsefulArea={activeFloor.totalUsefulArea}
                      outdoorArea={activeFloor.outdoorArea}
                   />
               </div>
            ) : (
               // STANDARD MODE LEFT COLUMN: SUMMARY & NAV
               <div className={`bg-white rounded-3xl p-8 border border-gray-200 shadow-xl transition-all duration-500 sticky top-24 ${isZooming ? 'shadow-2xl shadow-[#39b54a]/20 border-[#39b54a]/30 ring-2 ring-[#39b54a]/10' : 'shadow-gray-100/50'}`}>
                <div className="border-b border-gray-100 pb-6 mb-6">
                    <div className="flex justify-between items-start mb-4">
                        <span className="inline-block px-3 py-1 bg-[#39b54a]/10 text-[#39b54a] text-xs font-bold rounded-full tracking-wide">
                            {selectedHouse.id}
                        </span>
                        {selectedHouse.price && (
                            <div className={`text-xl font-black text-gray-900 bg-gray-50 px-3 py-1 rounded-lg transition-colors duration-500 ${isZooming ? 'bg-[#39b54a] text-white' : ''}`}>
                                {selectedHouse.price}
                            </div>
                        )}
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 leading-none mb-2">{selectedHouse.name}</h3>
                    <div className="flex flex-wrap gap-2 mt-3">
                        <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded flex items-center gap-1">
                            <Home className="w-3 h-3" /> {selectedHouse.type}
                        </span>
                        <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded flex items-center gap-1">
                            <Sun className="w-3 h-3" /> {selectedHouse.orientation}
                        </span>
                    </div>
                </div>
                
                <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center py-2 border-b border-gray-50">
                    <span className="text-gray-500 text-sm">Parcela Total</span>
                    <span className="font-bold text-xl">{selectedHouse.parcelArea} <span className="text-sm font-normal text-gray-400">m²</span></span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                    <span className="text-gray-500 text-sm">Sup. Construida</span>
                    <span className="font-bold text-xl">{selectedHouse.totalConstructedArea} <span className="text-sm font-normal text-gray-400">m²</span></span>
                    </div>
                </div>

                <div className="space-y-3">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Plantas</h4>
                    {selectedHouse.floors.map((floor) => (
                    <button
                        key={floor.name}
                        onClick={() => setActiveFloorName(floor.name)}
                        className={`w-full flex items-center justify-between p-4 rounded-xl transition-all border ${
                        activeFloorName === floor.name
                            ? 'bg-gray-900 text-white border-gray-900 shadow-lg scale-[1.02]'
                            : 'bg-white text-gray-600 border-gray-100 hover:border-[#39b54a] hover:text-[#39b54a]'
                        }`}
                    >
                        <span className="font-medium">{floor.name}</span>
                        <span className={`text-sm ${activeFloorName === floor.name ? 'text-gray-300' : 'text-gray-400'}`}>
                        {floor.totalUsefulArea} m²
                        </span>
                    </button>
                    ))}
                </div>
               </div>
            )}
          </div>

          {/* 
            RIGHT COLUMN LOGIC:
            - Standard Mode: Detail Card (Small Image + Room List).
            - Expanded Mode: Large Embedded Image Viewer.
          */}
          <div className="lg:col-span-8 order-1 lg:order-2">
            {isPlanExpanded ? (
                // EXPANDED MODE RIGHT COLUMN: EMBEDDED VIEWER
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
                // STANDARD MODE RIGHT COLUMN: FLOOR DETAIL CARD
                <>
                {selectedHouse.floors.map((floor) => (
                    <div key={floor.name} className={activeFloorName === floor.name ? 'block animate-fadeIn' : 'hidden'}>
                        <FloorDetail 
                           floor={floor} 
                           selectedRooms={selectedRooms}
                           onToggleRoom={toggleRoomSelection}
                           onClearSelection={() => setSelectedRooms([])}
                           onOpenViewer={() => setIsPlanExpanded(true)}
                        />
                    </div>
                ))}
                
                {/* Call to Action */}
                <div className="mt-12 p-10 bg-gray-50 rounded-3xl border border-gray-100 text-center">
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">¿Te interesa {selectedHouse.name}?</h3>
                    <p className="text-gray-500 mb-8 max-w-lg mx-auto">
                        Agenda una visita o descarga el informe detallado con todas las superficies.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 flex-wrap">
                        <button 
                        onClick={() => window.open('https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1jNMHWQFzVEtD5RqjuhLODPF0zLfefl929jYNhcSSNqrRdZUbGCBMPyxz6J0u-NRe8bKNk8LuY', '_blank')}
                        className="bg-[#39b54a] hover:bg-[#2ea03f] text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-[#39b54a]/30 flex items-center justify-center gap-2"
                        >
                        <Calendar className="h-5 w-5" /> Agendar una Cita
                        </button>

                        <button 
                        onClick={() => window.open('https://forms.gle/LfafX6MM6cPwZN6CA', '_blank')}
                        className="bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-gray-900/20 flex items-center justify-center gap-2"
                        >
                        <CheckCircle className="h-5 w-5" /> Quiero Reservar
                        </button>
                        
                        <button 
                        onClick={generatePDF}
                        disabled={isGeneratingPdf}
                        className="bg-white border border-gray-200 hover:border-gray-400 text-gray-700 px-8 py-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                        >
                        <FileDown className="h-5 w-5" /> 
                        {isGeneratingPdf ? "Generando..." : "Descargar Informe PDF"}
                        </button>
                    </div>
                </div>
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