import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { PROJECT_INFO } from '../constants';

const HERO_IMAGES = [
  "https://drive.google.com/thumbnail?id=10fbIrc7gwl66saCjXQArFSL8uiyR5EFu&sz=w2560", // Original
  "https://drive.google.com/thumbnail?id=1jvAdC-anFwsN5rhkcReZUM-q_TSz86Vg&sz=w2560", // New 1
  "https://drive.google.com/thumbnail?id=1gwgNPCJEQXZyCfXrbjJ1-t_HYNYVq9ci&sz=w2560", // New 2
  "https://drive.google.com/thumbnail?id=10R3OMtd_c4mACkg9lL680VlGBxxjwMSx&sz=w2560", // New 3
  "https://drive.google.com/thumbnail?id=1B659iviiZ5Czt26AakDwHh-cThdy-4YC&sz=w2560", // New 4
  "https://drive.google.com/thumbnail?id=1zPe3b7mtwPtKEmYVdh4VMqwJYWseqBPd&sz=w2560"  // New 5
];

const HeroSection: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Image Slider Interval
  useEffect(() => {
    const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % HERO_IMAGES.length);
    }, 5000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative pt-24 pb-12 sm:pt-32 sm:pb-16 overflow-hidden shadow-lg group">
        <div className="absolute inset-0 z-0 bg-gray-900">
            {HERO_IMAGES.map((src, index) => (
                <div 
                    key={src}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                >
                    <img 
                        src={src}
                        alt={`Residencial Huertos de la Cañada - View ${index + 1}`}
                        className="w-full h-full object-cover object-center transform transition-transform duration-[10000ms] ease-linear scale-105 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent"></div>
                </div>
            ))}
        </div>

        <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
            {HERO_IMAGES.map((_, index) => (
                <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${index === currentImageIndex ? 'w-6 bg-[#39b54a]' : 'w-1.5 bg-white/50 hover:bg-white'}`}
                    aria-label={`Go to slide ${index + 1}`}
                />
            ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fadeIn">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-white drop-shadow-2xl">
             Tu nuevo hogar en <br/>
             <span className="text-[#39b54a] drop-shadow-lg">La Cañada</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-100 mb-6 font-light leading-relaxed drop-shadow-md">
            {PROJECT_INFO.description}
          </p>
          <a 
             href="https://maps.app.goo.gl/iDz9J1orDJpZvQ67A"
             target="_blank"
             rel="noopener noreferrer"
             className="inline-flex items-center gap-2 text-sm font-bold bg-white/95 backdrop-blur-sm px-5 py-2.5 rounded-full text-gray-800 shadow-xl ring-2 ring-white/50 hover:bg-white hover:scale-105 transition-all cursor-pointer"
          >
             <MapPin className="h-4 w-4 text-[#39b54a]" />
             {PROJECT_INFO.address}
          </a>
        </div>
      </div>
  );
};

export default HeroSection;