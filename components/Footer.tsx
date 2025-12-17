import React from 'react';
import { MapPin, ExternalLink, Phone, User, Building2 } from 'lucide-react';
import { PROJECT_INFO } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1a1a1a] text-white py-12 border-t border-white/10 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           
           {/* Main Grid */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
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
                 <h5 className="font-bold text-white mb-6 uppercase tracking-wider text-xs border-b border-white/10 pb-2 inline-block">Contacto</h5>
                 <ul className="space-y-6 text-sm text-gray-400">
                    
                    {/* Commercial Director */}
                    <li className="flex items-start gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
                        <div className="bg-[#39b54a]/20 p-2 rounded-full text-[#39b54a]">
                            <User className="h-5 w-5" />
                        </div>
                        <div>
                            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Director Comercial</span>
                            <span className="block text-white font-bold text-base">Juan Miguel Moreno</span>
                            <a 
                                href="tel:+34691245047" 
                                className="flex items-center gap-2 text-[#39b54a] hover:text-white transition-colors mt-1 font-mono font-medium"
                            >
                                <Phone className="h-3 w-3" /> 691 245 047
                            </a>
                        </div>
                    </li>

                    <li className="flex items-start gap-3">
                       <MapPin className="h-5 w-5 text-[#39b54a] flex-shrink-0 mt-0.5" />
                       <a 
                          href="https://maps.app.goo.gl/iDz9J1orDJpZvQ67A" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="hover:text-white transition-colors leading-tight"
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
                  <h5 className="font-bold text-white mb-6 uppercase tracking-wider text-xs border-b border-white/10 pb-2 inline-block">Aviso Legal</h5>
                  <p className="text-xs text-gray-500 leading-relaxed text-justify">
                     Las infografías, planos y superficies mostradas son orientativas y no tienen carácter contractual. 
                     Pueden sufrir modificaciones por exigencias técnicas, jurídicas o comerciales de la dirección facultativa. 
                     El mobiliario es meramente decorativo.
                  </p>
              </div>
           </div>

           {/* Partners / Logos Section */}
           <div className="border-t border-white/10 pt-8 flex flex-col items-center justify-center">
                <span className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em] mb-6">Colaboradores</span>
                <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 transition-all duration-500">
                    
                    {/* Ferrer Arquitectos */}
                    <div className="bg-white px-6 py-3 rounded-lg h-20 w-auto min-w-[150px] flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-black/20">
                        <img 
                            src="https://storage.googleapis.com/huertos-planos/LOGO%20FERRER%20ARQUITECTOS.jpeg" 
                            alt="Ferrer Arquitectos" 
                            className="h-full w-auto object-contain"
                        />
                    </div>

                    {/* Ery Consulting */}
                    <div className="bg-white px-6 py-3 rounded-lg h-20 w-auto min-w-[150px] flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-black/20">
                         <img 
                            src="https://storage.googleapis.com/huertos-planos/LOGO%20ERY%20CONSULTING.png" 
                            alt="ERY Consulting" 
                            className="h-full w-auto object-contain"
                        />
                    </div>

                    {/* More Turismo */}
                    <div className="bg-white px-6 py-3 rounded-lg h-20 w-auto min-w-[150px] flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-black/20">
                        <img 
                            src="https://storage.googleapis.com/huertos-planos/MORETURISMO%20LOGO.jpeg" 
                            alt="More Turismo" 
                            className="h-full w-auto object-contain"
                        />
                    </div>

                </div>
           </div>

        </div>
      </footer>
  );
};

export default Footer;