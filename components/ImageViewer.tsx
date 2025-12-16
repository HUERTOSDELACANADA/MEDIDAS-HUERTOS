import React, { useEffect, useState, useRef } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Move, Loader2, ImageOff, MousePointer2 } from 'lucide-react';

interface ImageViewerProps {
  isOpen: boolean;
  imageUrl: string;
  altText: string;
  onClose: () => void;
  variant?: 'modal' | 'embedded';
}

const ImageViewer: React.FC<ImageViewerProps> = ({ isOpen, imageUrl, altText, onClose, variant = 'modal' }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Reset state when opening or changing image
  useEffect(() => {
    if (isOpen) {
      if (variant === 'modal') {
        document.body.style.overflow = 'hidden';
      }
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setIsLoading(true);
      setError(false);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, imageUrl, variant]);

  const handleWheel = (e: React.WheelEvent) => {
    // Aggressively prevent default page scrolling/zooming when inside the viewer
    e.preventDefault();
    e.stopPropagation();

    if (e.ctrlKey) {
        // ZOOM MODE (Ctrl + Wheel)
        const delta = e.deltaY > 0 ? -0.2 : 0.2;
        const newScale = Math.min(Math.max(0.5, scale + delta), 8); 
        setScale(newScale);
    } else {
        // PAN MODE (Wheel only)
        // Adjust position based on scroll delta
        setPosition(prev => ({
            x: prev.x - e.deltaX,
            y: prev.y - e.deltaY
        }));
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const newX = e.clientX - dragStartRef.current.x;
    const newY = e.clientY - dragStartRef.current.y;
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.5, 8));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.5, 0.5));
  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  if (!isOpen) return null;

  const containerClasses = variant === 'modal' 
    ? "fixed inset-0 z-[100] bg-black/95 backdrop-blur-md" 
    : "relative w-full h-[600px] lg:h-[700px] bg-gray-900 rounded-3xl overflow-hidden shadow-inner border border-gray-800 overscroll-contain";

  return (
    <div className={`${containerClasses} flex flex-col animate-fadeIn text-white group`}>
      
      {/* Header Toolbar */}
      <div className={`absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-50 ${variant === 'modal' ? 'bg-black/50 border-b border-white/10' : 'bg-gradient-to-b from-black/60 to-transparent pointer-events-none'}`}>
        <h3 className={`text-lg font-bold truncate pr-4 text-white pl-2 drop-shadow-md ${variant === 'embedded' ? 'opacity-0 group-hover:opacity-100 transition-opacity' : ''}`}>{altText}</h3>
        {variant === 'modal' && (
            <button 
            onClick={onClose}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full transition-all hover:scale-105 active:scale-95 font-bold text-sm"
            >
            <X className="h-5 w-5" />
            <span className="hidden sm:inline">CERRAR</span>
            </button>
        )}
      </div>

      {/* Main Interaction Area */}
      <div 
        ref={containerRef}
        className="flex-1 w-full h-full overflow-hidden flex items-center justify-center cursor-move active:cursor-grabbing relative"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ touchAction: 'none' }}
      >
        {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 z-0">
                <Loader2 className="h-10 w-10 animate-spin mb-3 text-[#39b54a]" />
                <span className="text-sm font-medium">Cargando imagen...</span>
            </div>
        )}

        {error ? (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 z-10">
                <ImageOff className="h-12 w-12 mb-3 text-red-400" />
                <span className="text-lg font-bold text-white mb-1">No se pudo cargar el plano</span>
                <span className="text-sm">Verifique que el archivo existe: {imageUrl}</span>
            </div>
        ) : (
            <img 
            src={imageUrl} 
            alt={altText} 
            draggable={false}
            onLoad={() => setIsLoading(false)}
            onError={() => { setIsLoading(false); setError(true); }}
            style={{ 
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transition: isDragging ? 'none' : 'transform 0.1s ease-out'
            }}
            className={`max-w-[95%] max-h-[95%] object-contain select-none shadow-2xl ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
            />
        )}
      </div>

      {/* Primary Floating Close Button (Bottom Center) */}
      <button
        onClick={onClose}
        className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50 bg-[#39b54a] hover:bg-white hover:text-[#39b54a] text-white px-8 py-3 rounded-full font-black shadow-[0_0_25px_rgba(57,181,74,0.4)] transition-all duration-300 flex items-center gap-3 border-2 border-[#39b54a] active:scale-95 whitespace-nowrap ${variant === 'embedded' ? 'scale-90' : ''}`}
      >
        <X className="h-5 w-5" />
        <span className="tracking-wide">CERRAR PLANO</span>
      </button>

      {/* Floating Zoom Controls (Bottom Right) */}
      <div className={`absolute right-6 flex flex-col gap-2 z-50 ${variant === 'embedded' ? 'bottom-8' : 'bottom-24'}`}>
        <button onClick={handleZoomIn} className="bg-white/10 backdrop-blur p-3 rounded-full border border-white/20 hover:bg-[#39b54a] hover:border-[#39b54a] text-white transition-all active:scale-90 shadow-lg pointer-events-auto">
            <ZoomIn className="h-6 w-6" />
        </button>
        <button onClick={handleReset} className="bg-white/10 backdrop-blur p-3 rounded-full border border-white/20 hover:bg-[#39b54a] hover:border-[#39b54a] text-white transition-all active:scale-90 shadow-lg pointer-events-auto" title="Restablecer">
            <RotateCcw className="h-6 w-6" />
        </button>
        <button onClick={handleZoomOut} className="bg-white/10 backdrop-blur p-3 rounded-full border border-white/20 hover:bg-[#39b54a] hover:border-[#39b54a] text-white transition-all active:scale-90 shadow-lg pointer-events-auto">
            <ZoomOut className="h-6 w-6" />
        </button>
      </div>

      {/* Footer / Instructions - Minimal for Embedded */}
      <div className={`absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur border-t border-white/10 p-2 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-4 z-40 ${variant === 'embedded' ? 'opacity-0 group-hover:opacity-100 transition-opacity duration-300' : ''}`}>
          <div className="flex flex-wrap items-center gap-4 sm:gap-8 text-[10px] sm:text-xs font-medium text-gray-400">
             <div className="flex items-center gap-2">
                <MousePointer2 className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Rueda / Arrastrar: <span className="text-white font-bold">Mover</span></span>
             </div>
             <div className="flex items-center gap-2">
                <ZoomIn className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Ctrl + Rueda: <span className="text-white font-bold">Zoom</span></span>
             </div>
             <div className="hidden sm:block text-[#39b54a] font-bold ml-auto">
                 {Math.round(scale * 100)}%
             </div>
          </div>
      </div>
    </div>
  );
};

export default ImageViewer;