import React from 'react';
import { Calendar, CheckCircle } from 'lucide-react';

interface ContactSectionProps {
  houseName: string;
}

const ContactSection: React.FC<ContactSectionProps> = ({ houseName }) => {
  return (
    <div className="mt-8 lg:mt-12 p-10 bg-gray-50 rounded-3xl border border-gray-100 text-center">
        <h3 className="text-2xl font-bold mb-4 text-gray-900">¿Te interesa {houseName}?</h3>
        <p className="text-gray-500 mb-8 max-w-lg mx-auto">
            Agenda una visita.
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
        </div>
    </div>
  );
};

export default ContactSection;