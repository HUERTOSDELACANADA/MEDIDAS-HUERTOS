import React, { useState, useEffect } from 'react';
import { Lock, Upload, X, Trash2, Save, Image as ImageIcon, AlertTriangle, CheckCircle, Download, UploadCloud, Code, Copy, FileJson, Loader2 } from 'lucide-react';
import { STORAGE_KEYS, saveImageToStorage, getImageFromStorage, clearImageFromStorage } from '../utils/storageUtils';
import { DEFAULT_FLOOR_PLANS } from '../constants';
import { processImageForWeb } from '../utils/imageProcessor';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [pendingUploads, setPendingUploads] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [dragActive, setDragActive] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // New state for processing
  
  // New state for persistence tools
  const [showCodeTool, setShowCodeTool] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadPreviews();
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1234') {
      setIsAuthenticated(true);
    } else {
      alert('Contraseña incorrecta');
    }
  };

  const processFile = async (key: string, file: File) => {
    if (!file.type.startsWith('image/')) {
        alert('Por favor, sube solo archivos de imagen.');
        return;
    }

    setIsProcessing(true);
    try {
        // Use the new utility to resize and convert to WebP
        const optimizedBase64 = await processImageForWeb(file);
        
        setPreviews(prev => ({ ...prev, [key]: optimizedBase64 }));
        setPendingUploads(prev => ({ ...prev, [key]: optimizedBase64 }));
        setHasChanges(true);
    } catch (error) {
        console.error("Error processing image", error);
        alert("Hubo un error al procesar la imagen. Inténtalo de nuevo.");
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
        alert('Las fotos se han procesado, optimizado y guardado correctamente.');
        setPendingUploads({});
        setHasChanges(false);
        onClose();
    }
    setIsSaving(false);
  };

  // --- PERSISTENCE TOOLS ---

  const handleBackupDownload = () => {
      const backupData = JSON.stringify(previews, null, 2);
      const blob = new Blob([backupData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `huertos_config_backup_${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  };

  const handleBackupRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (event) => {
          try {
              const json = JSON.parse(event.target?.result as string);
              if (typeof json === 'object') {
                  if(!confirm("Esto sobrescribirá las imágenes actuales con las del archivo de respaldo. ¿Continuar?")) return;
                  
                  const promises = Object.entries(json).map(([key, val]) => 
                      saveImageToStorage(key, val as string)
                  );
                  await Promise.all(promises);
                  alert('Copia de seguridad restaurada con éxito.');
                  await loadPreviews();
              }
          } catch (err) {
              alert('El archivo no es válido.');
              console.error(err);
          }
      };
      reader.readAsText(file);
  };

  const generateProductionCode = () => {
      return `// Instrucciones: 
// 1. Abre el archivo 'constants.ts' en tu editor de código.
// 2. Busca la constante 'DEFAULT_FLOOR_PLANS'.
// 3. Reemplázala completamente con el siguiente bloque:

export const DEFAULT_FLOOR_PLANS = {
  SOTANO: "${previews[STORAGE_KEYS.SOTANO] || DEFAULT_FLOOR_PLANS.SOTANO}",
  BAJA: "${previews[STORAGE_KEYS.BAJA] || DEFAULT_FLOOR_PLANS.BAJA}",
  PRIMERA: "${previews[STORAGE_KEYS.PRIMERA] || DEFAULT_FLOOR_PLANS.PRIMERA}",
  CUBIERTA: "${previews[STORAGE_KEYS.CUBIERTA] || DEFAULT_FLOOR_PLANS.CUBIERTA}"
};`;
  };

  const copyToClipboard = () => {
      navigator.clipboard.writeText(generateProductionCode());
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden max-h-[90vh] flex flex-col animate-fadeIn relative">
        
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

        {/* Global Loader Overlay for Processing */}
        {isProcessing && (
            <div className="absolute inset-0 z-50 bg-white/80 flex flex-col items-center justify-center backdrop-blur-sm">
                <Loader2 className="h-12 w-12 text-[#39b54a] animate-spin mb-3" />
                <p className="text-gray-800 font-bold animate-pulse">Optimizando y convirtiendo imagen...</p>
            </div>
        )}

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          {!isAuthenticated ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="bg-gray-100 p-4 rounded-full">
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
            <div className="space-y-12">
              
              {/* SECTION 1: VISUAL EDITOR */}
              <section>
                 <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Editor de Planos</h3>
                        <p className="text-sm text-gray-500">Arrastra imágenes o haz clic. Se <strong>convertirán automáticamente</strong> al formato óptimo.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-bold border border-blue-100 flex items-center gap-1">
                             <AlertTriangle className="h-3 w-3" /> Modo Local (IndexedDB)
                        </span>
                    </div>
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
                            className={`border-2 rounded-xl p-3 transition-all relative ${
                                isDragging ? 'border-[#39b54a] bg-green-50 scale-[1.02] border-dashed' : isChanged ? 'border-[#39b54a] bg-green-50/30' : 'border-gray-200 bg-gray-50'
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
                            
                            <div className="aspect-square bg-white rounded-lg border border-gray-200 mb-2 overflow-hidden flex items-center justify-center relative">
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
              </section>

              {/* SECTION 2: PERSISTENCE TOOLS */}
              <section className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Save className="h-5 w-5 text-[#39b54a]" />
                      Herramientas de Persistencia
                  </h3>
                  <p className="text-sm text-gray-600 mb-6 max-w-2xl">
                      Para evitar perder los planos al actualizar la aplicación o cambiar de dispositivo, utiliza estas herramientas.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* CARD 1: JSON BACKUP */}
                      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-3 mb-3">
                              <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><FileJson className="h-5 w-5" /></div>
                              <div>
                                  <h4 className="font-bold text-gray-900">Copia de Seguridad (JSON)</h4>
                                  <p className="text-xs text-gray-500">Guarda un archivo en tu PC.</p>
                              </div>
                          </div>
                          <div className="flex gap-2 mt-4">
                              <button onClick={handleBackupDownload} className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-xs font-bold transition-colors">
                                  <Download className="h-3 w-3" /> Descargar
                              </button>
                              <label className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer">
                                  <UploadCloud className="h-3 w-3" /> Restaurar
                                  <input type="file" accept=".json" onChange={handleBackupRestore} className="hidden" />
                              </label>
                          </div>
                      </div>

                      {/* CARD 2: CODE GENERATOR */}
                      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                          <div className="flex items-center gap-3 mb-3">
                              <div className="bg-purple-100 p-2 rounded-lg text-purple-600"><Code className="h-5 w-5" /></div>
                              <div>
                                  <h4 className="font-bold text-gray-900">Integrar en Código</h4>
                                  <p className="text-xs text-gray-500">Genera código para <code>constants.ts</code>.</p>
                              </div>
                          </div>
                          
                          {showCodeTool ? (
                              <div className="mt-2 animate-fadeIn">
                                  <p className="text-[10px] text-gray-500 mb-2 leading-tight">
                                      Copia esto y reemplaza <code>DEFAULT_FLOOR_PLANS</code> en tu archivo de constantes para hacer los cambios permanentes para todos los usuarios.
                                  </p>
                                  <button onClick={copyToClipboard} className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${copySuccess ? 'bg-green-500 text-white' : 'bg-gray-900 text-white hover:bg-black'}`}>
                                      {copySuccess ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                      {copySuccess ? '¡Copiado!' : 'Copiar al Portapapeles'}
                                  </button>
                              </div>
                          ) : (
                            <button onClick={() => setShowCodeTool(true)} className="w-full mt-4 bg-purple-50 text-purple-700 border border-purple-100 hover:bg-purple-100 py-2 rounded-lg text-xs font-bold transition-colors">
                                Generar Código Permanente
                            </button>
                          )}
                      </div>

                  </div>
              </section>

            </div>
          )}
        </div>

        {/* Footer Actions */}
        {isAuthenticated && hasChanges && (
            <div className="bg-white border-t border-gray-200 p-4 flex justify-between items-center shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-20">
                <span className="text-xs text-gray-500 font-medium">Hay cambios sin guardar en Local</span>
                <div className="flex gap-3">
                    <button 
                        onClick={() => {
                            setPendingUploads({});
                            setHasChanges(false);
                            loadPreviews();
                        }}
                        className="px-4 py-2 rounded-lg font-bold text-xs text-gray-500 hover:bg-gray-100 transition-colors"
                    >
                        Descartar
                    </button>
                    <button 
                        onClick={handleSaveChanges}
                        disabled={isSaving}
                        className="px-6 py-2 rounded-lg font-bold text-xs text-white bg-[#39b54a] hover:bg-[#2ea03f] shadow-lg shadow-[#39b54a]/30 transition-all flex items-center gap-2"
                    >
                        {isSaving ? "Guardando..." : "Guardar en Local"}
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;