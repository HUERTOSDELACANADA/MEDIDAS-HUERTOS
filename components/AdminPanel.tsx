import React, { useState, useEffect, useRef } from 'react';
import { Lock, Upload, X, Trash2, Save, Image as ImageIcon, AlertTriangle, CheckCircle, Download, UploadCloud, Code, Copy, FileJson, Loader2, FileCode, Crosshair, MapPin } from 'lucide-react';
import { STORAGE_KEYS, saveImageToStorage, getImageFromStorage, clearImageFromStorage, saveCalibration, getCalibration } from '../utils/storageUtils';
import { DEFAULT_FLOOR_PLANS } from '../constants';
import { processImageForWeb } from '../utils/imageProcessor';
import { FloorName, Room } from '../types';
import { HOUSES } from '../data/houseRepository';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'images' | 'calibration' | 'persistence'>('images');

  // Images State
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [pendingUploads, setPendingUploads] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [dragActive, setDragActive] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); 
  
  // Persistence Tools State
  const [showCodeTool, setShowCodeTool] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Calibration State
  const [selectedFloorForCalib, setSelectedFloorForCalib] = useState<FloorName>(FloorName.BAJA);
  const [selectedRoomForCalib, setSelectedRoomForCalib] = useState<string | null>(null);
  const [calibrationData, setCalibrationData] = useState<Record<string, Record<string, { x: number, y: number }>>>({});
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (isOpen) {
      loadPreviews();
      loadCalibration();
      setPendingUploads({});
      setHasChanges(false);
      setDragActive(null);
      setShowCodeTool(false);
      setIsProcessing(false);
    }
  }, [isOpen]);

  const loadPreviews = async () => {
    const sotano = await getImageFromStorage(STORAGE_KEYS.SOTANO) || DEFAULT_FLOOR_PLANS.SOTANO;
    const baja = await getImageFromStorage(STORAGE_KEYS.BAJA) || DEFAULT_FLOOR_PLANS.BAJA;
    const primera = await getImageFromStorage(STORAGE_KEYS.PRIMERA) || DEFAULT_FLOOR_PLANS.PRIMERA;
    const cubierta = await getImageFromStorage(STORAGE_KEYS.CUBIERTA) || DEFAULT_FLOOR_PLANS.CUBIERTA;

    setPreviews({
      [STORAGE_KEYS.SOTANO]: sotano,
      [STORAGE_KEYS.BAJA]: baja,
      [STORAGE_KEYS.PRIMERA]: primera,
      [STORAGE_KEYS.CUBIERTA]: cubierta,
    });
  };

  const loadCalibration = async () => {
    const data = await getCalibration();
    if (data) {
        setCalibrationData(data);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1234') {
      setIsAuthenticated(true);
    } else {
      alert('Contraseña incorrecta');
    }
  };

  // --- IMAGE UPLOAD LOGIC ---
  const processFile = async (key: string, file: File) => {
    if (!file.type.startsWith('image/')) {
        alert('Por favor, sube solo archivos de imagen.');
        return;
    }

    setIsProcessing(true);
    try {
        const optimizedBase64 = await processImageForWeb(file);
        setPreviews(prev => ({ ...prev, [key]: optimizedBase64 }));
        setPendingUploads(prev => ({ ...prev, [key]: optimizedBase64 }));
        setHasChanges(true);
    } catch (error) {
        console.error("Error processing image", error);
        alert("Hubo un error al procesar la imagen.");
    } finally {
        setIsProcessing(false);
    }
  };

  const handleFileUpload = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(key, file);
  };

  const handleDrag = (e: React.DragEvent, key: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(key);
    } else if (e.type === 'dragleave') {
      setDragActive(null);
    }
  };

  const handleDrop = (e: React.DragEvent, key: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(null);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(key, e.dataTransfer.files[0]);
    }
  };

  const handleResetImage = async (key: string) => {
    if (confirm('¿Estás seguro de volver a la imagen por defecto?')) {
      await clearImageFromStorage(key);
      if (pendingUploads[key]) {
          const newPending = { ...pendingUploads };
          delete newPending[key];
          setPendingUploads(newPending);
          if (Object.keys(newPending).length === 0) setHasChanges(false);
      }
      await loadPreviews();
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    const promises = Object.entries(pendingUploads).map(([key, base64Data]) => 
      saveImageToStorage(key, base64Data as string)
    );

    if (promises.length > 0) {
        await Promise.all(promises);
        alert('Las fotos se han guardado correctamente.');
        setPendingUploads({});
        setHasChanges(false);
    }
    setIsSaving(false);
  };

  // --- CALIBRATION LOGIC ---
  const handleMapClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!selectedRoomForCalib || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setCalibrationData(prev => ({
        ...prev,
        [selectedFloorForCalib]: {
            ...(prev[selectedFloorForCalib] || {}),
            [selectedRoomForCalib]: { x, y }
        }
    }));
  };

  const saveCalibrationData = async () => {
      setIsSaving(true);
      await saveCalibration(calibrationData);
      // Also dispatch event to update the main app
      window.dispatchEvent(new Event('storage-update'));
      setIsSaving(false);
      alert('Calibración GPS guardada.');
  };

  // Helper to get image key for floor name
  const getImageKeyForFloor = (floor: FloorName) => {
      switch(floor) {
          case FloorName.SOTANO: return STORAGE_KEYS.SOTANO;
          case FloorName.BAJA: return STORAGE_KEYS.BAJA;
          case FloorName.PRIMERA: return STORAGE_KEYS.PRIMERA;
          case FloorName.CUBIERTA: return STORAGE_KEYS.CUBIERTA;
      }
  };

  // Helper to get rooms for current floor (using V1 as template)
  const getRoomsForFloor = (floor: FloorName) => {
      const house = HOUSES[0]; 
      const floorPlan = house.floors.find(f => f.name === floor);
      return floorPlan ? floorPlan.rooms : [];
  };

  // --- PERSISTENCE TOOLS ---
  const handleBackupDownload = () => {
      const backupPayload = {
          images: previews,
          calibration: calibrationData
      };
      const blob = new Blob([JSON.stringify(backupPayload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `huertos_full_backup_${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl overflow-hidden max-h-[95vh] flex flex-col animate-fadeIn relative">
        
        {/* Header */}
        <div className="bg-gray-900 p-6 flex justify-between items-center text-white flex-shrink-0">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-[#39b54a]" />
            <h2 className="text-xl font-bold">Panel de Administración</h2>
          </div>
          <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Loading Overlay */}
        {isProcessing && (
            <div className="absolute inset-0 z-50 bg-white/80 flex flex-col items-center justify-center backdrop-blur-sm">
                <Loader2 className="h-12 w-12 text-[#39b54a] animate-spin mb-3" />
                <p className="text-gray-800 font-bold animate-pulse">Procesando...</p>
            </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {!isAuthenticated ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20">
              <div className="bg-gray-100 p-4 rounded-full mb-4">
                <Lock className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-700">Acceso Restringido</h3>
              <form onSubmit={handleLogin} className="w-full max-w-xs space-y-3 mt-4">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#39b54a] outline-none text-center tracking-widest"
                  autoFocus
                />
                <button type="submit" className="w-full bg-[#39b54a] hover:bg-[#2ea03f] text-white font-bold py-3 rounded-xl transition-all">
                  Entrar
                </button>
              </form>
            </div>
          ) : (
            <>
                {/* Tabs */}
                <div className="flex border-b border-gray-200 px-6 pt-4 gap-6 bg-gray-50">
                    <button 
                        onClick={() => setActiveTab('images')}
                        className={`pb-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'images' ? 'border-[#39b54a] text-[#39b54a]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Gestor de Planos
                    </button>
                    <button 
                        onClick={() => setActiveTab('calibration')}
                        className={`pb-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'calibration' ? 'border-[#39b54a] text-[#39b54a]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        <Crosshair className="h-4 w-4" /> Calibrador GPS
                    </button>
                    <button 
                        onClick={() => setActiveTab('persistence')}
                        className={`pb-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'persistence' ? 'border-[#39b54a] text-[#39b54a]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Herramientas
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                    
                    {/* TAB: IMAGES */}
                    {activeTab === 'images' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-gray-800">Planos Base</h3>
                                <button 
                                    onClick={handleSaveChanges}
                                    disabled={!hasChanges || isSaving}
                                    className={`px-4 py-2 rounded-lg font-bold text-xs text-white transition-all flex items-center gap-2 ${hasChanges ? 'bg-[#39b54a] hover:bg-[#2ea03f] shadow-lg' : 'bg-gray-300 cursor-not-allowed'}`}
                                >
                                    <Save className="h-4 w-4" /> Guardar Cambios
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {[
                                { label: 'Sótano', key: STORAGE_KEYS.SOTANO },
                                { label: 'Planta Baja', key: STORAGE_KEYS.BAJA },
                                { label: 'Planta Primera', key: STORAGE_KEYS.PRIMERA },
                                { label: 'Cubierta', key: STORAGE_KEYS.CUBIERTA },
                                ].map((item) => {
                                    const isChanged = !!pendingUploads[item.key];
                                    const isDragging = dragActive === item.key;
                                    
                                    return (
                                    <div 
                                        key={item.key} 
                                        className={`border-2 rounded-xl p-3 transition-all relative bg-white ${
                                            isDragging ? 'border-[#39b54a] bg-green-50 scale-[1.02] border-dashed' : isChanged ? 'border-[#39b54a] bg-green-50/30' : 'border-gray-200'
                                        }`}
                                        onDragEnter={(e) => handleDrag(e, item.key)}
                                        onDragLeave={(e) => handleDrag(e, item.key)}
                                        onDragOver={(e) => handleDrag(e, item.key)}
                                        onDrop={(e) => handleDrop(e, item.key)}
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="font-bold text-xs text-gray-700 uppercase tracking-wider">{item.label}</h4>
                                            {previews[item.key] && previews[item.key] !== (DEFAULT_FLOOR_PLANS as any)[item.key.replace('blueprint_', '').toUpperCase()] && (
                                                <button onClick={() => handleResetImage(item.key)} className="text-red-400 hover:text-red-600" title="Reset">
                                                    <Trash2 className="h-3 w-3" />
                                                </button>
                                            )}
                                        </div>
                                        
                                        <div className="aspect-square bg-gray-100 rounded-lg border border-gray-200 mb-2 overflow-hidden flex items-center justify-center relative">
                                            <img src={previews[item.key]} alt="" className="w-full h-full object-contain pointer-events-none" />
                                        </div>

                                        <label className={`flex items-center justify-center w-full gap-2 border px-2 py-2 rounded-lg cursor-pointer transition-all text-xs font-bold ${isChanged ? 'bg-[#39b54a] text-white' : 'bg-white hover:border-[#39b54a] text-gray-600'}`}>
                                            {isChanged ? <CheckCircle className="h-3 w-3" /> : <Upload className="h-3 w-3" />}
                                            <span>{isChanged ? 'Listo' : 'Subir Imagen'}</span>
                                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(item.key, e)} />
                                        </label>
                                    </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* TAB: GPS CALIBRATOR */}
                    {activeTab === 'calibration' && (
                        <div className="flex flex-col h-full">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">Calibración de Puntos GPS</h3>
                                    <p className="text-xs text-gray-500">Selecciona habitación y haz clic en el mapa.</p>
                                </div>
                                <div className="flex gap-2">
                                    <select 
                                        value={selectedFloorForCalib}
                                        onChange={(e) => {
                                            setSelectedFloorForCalib(e.target.value as FloorName);
                                            setSelectedRoomForCalib(null);
                                        }}
                                        className="p-2 rounded-lg border border-gray-300 text-sm font-bold"
                                    >
                                        {Object.values(FloorName).map(f => (
                                            <option key={f} value={f}>{f}</option>
                                        ))}
                                    </select>
                                    <button 
                                        onClick={saveCalibrationData}
                                        className="bg-[#39b54a] text-white px-4 py-2 rounded-lg text-xs font-bold shadow hover:bg-[#2ea03f] flex items-center gap-2"
                                    >
                                        <Save className="h-4 w-4" /> Guardar Calibración
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-6 h-[500px]">
                                {/* Room List */}
                                <div className="w-64 bg-white rounded-xl border border-gray-200 overflow-y-auto">
                                    {getRoomsForFloor(selectedFloorForCalib).map(room => {
                                        const hasData = calibrationData[selectedFloorForCalib]?.[room.name];
                                        return (
                                            <button
                                                key={room.name}
                                                onClick={() => setSelectedRoomForCalib(room.name)}
                                                className={`w-full text-left p-3 text-sm border-b border-gray-100 hover:bg-gray-50 flex justify-between items-center ${selectedRoomForCalib === room.name ? 'bg-green-50 text-[#39b54a] font-bold' : 'text-gray-600'}`}
                                            >
                                                <span>{room.name}</span>
                                                {hasData && <CheckCircle className="h-3 w-3 text-[#39b54a]" />}
                                            </button>
                                        )
                                    })}
                                </div>

                                {/* Interactive Map */}
                                <div className="flex-1 bg-white rounded-xl border border-gray-200 p-4 relative flex items-center justify-center overflow-hidden">
                                    <img 
                                        ref={imageRef}
                                        src={previews[getImageKeyForFloor(selectedFloorForCalib)]} 
                                        className="max-h-full max-w-full object-contain cursor-crosshair"
                                        onClick={handleMapClick}
                                        alt="Calibration Map"
                                    />
                                    {/* Visualize Dots */}
                                    {calibrationData[selectedFloorForCalib] && Object.entries(calibrationData[selectedFloorForCalib]).map(([rName, coords]) => {
                                        const pos = coords as { x: number, y: number };
                                        return (
                                        <div 
                                            key={rName}
                                            className="absolute w-4 h-4 bg-[#39b54a] rounded-full border-2 border-white shadow-md transform -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center"
                                            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                                        >
                                            <span className="text-[8px] absolute -top-4 bg-black/70 text-white px-1 rounded whitespace-nowrap">{rName}</span>
                                        </div>
                                    )})}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: PERSISTENCE */}
                    {activeTab === 'persistence' && (
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                    <FileJson className="h-5 w-5 text-blue-500" /> Copia de Seguridad Completa
                                </h4>
                                <p className="text-xs text-gray-500 mb-4">Descarga imágenes y calibración en un solo archivo.</p>
                                <button onClick={handleBackupDownload} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-xs font-bold transition-colors">
                                    Descargar JSON
                                </button>
                            </div>
                         </div>
                    )}

                </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;