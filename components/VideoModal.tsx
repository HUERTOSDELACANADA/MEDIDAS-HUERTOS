import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  videoUrl: string;
  title: string;
  onClose: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, videoUrl, title, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      {/* Toolbar */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-black/50 border-b border-white/10 text-white z-10">
        <h3 className="text-lg font-bold">{title}</h3>
        <button 
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Video Container */}
      <div className="w-full h-full pt-16 pb-4 flex items-center justify-center">
        <video 
          src={videoUrl} 
          controls 
          autoPlay 
          className="max-w-full max-h-full rounded-lg shadow-2xl"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default VideoModal;