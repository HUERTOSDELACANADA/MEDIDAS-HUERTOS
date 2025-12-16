import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';
import { PROJECT_INFO } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1a1a1a] text-white py-12 border-t border-white/10 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div>
                <h4 className="font-black text-xl mb-6 flex items-center gap-2">
                   <div className="w-8 h-8 bg-[#39b54a] rounded flex items-center justify-center text-black font-bold text-xs">H</div>
                   HUERTOS DE LA CAÑADA
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                   {PROJECT_INFO.description}
                </p>
                <div className="text-sm text-gray-500">
                   &copy; {new Date().getFullYear()} {PROJECT_INFO.promoter}
                </div>
              </div>

              <div>
                 <h5 className="font-bold text-white mb-4 uppercase tracking-wider text-xs">Contacto</h5>
                 <ul className="space-y-3 text-sm text-gray-400">
                    <li className="flex items-start gap-3">
                       <MapPin className="h-5 w-5 text-[#39b54a] flex-shrink-0" />
                       <a 
                          href="https://maps.app.goo.gl/iDz9J1orDJpZvQ67A" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="hover:text-white transition-colors"
                       >
                          {PROJECT_INFO.address}
                       </a>
                    </li>
                    <li className="flex items-center gap-3">
                       <ExternalLink className="h-5 w-5 text-[#39b54a] flex-shrink-0" />
                       <a href="https://xn--huertosdelacaada-jub.com/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                          Visitar web oficial
                       </a>
                    </li>
                 </ul>
              </div>

              <div>
                  <h5 className="font-bold text-white mb-4 uppercase tracking-wider text-xs">Aviso Legal</h5>
                  <p className="text-xs text-gray-500 leading-relaxed">
                     Las infografías, planos y superficies mostradas son orientativas y no tienen carácter contractual. 
                     Pueden sufrir modificaciones por exigencias técnicas, jurídicas o comerciales de la dirección facultativa. 
                     El mobiliario es meramente decorativo.
                  </p>
                  
              </div>
           </div>
        </div>
      </footer>
  );
};

export default Footer;