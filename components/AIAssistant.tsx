import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Sparkles, X, BrainCircuit, Image as ImageIcon, Loader2 } from 'lucide-react';
import { House } from '../types';
import { sendMessageToGemini, analyzeImageWithGemini } from '../services/geminiService';

interface AIAssistantProps {
  currentHouse?: House;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ currentHouse }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: '¡Hola! Soy tu asistente virtual de Huertos de la Cañada. ¿En qué puedo ayudarte hoy? Pregúntame sobre medidas, precios o distribuciones.' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [thinkingMode, setThinkingMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMsg = inputText;
    setInputText('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    // Format history for API
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const responseText = await sendMessageToGemini(userMsg, history, currentHouse, thinkingMode);

    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = (reader.result as string).split(',')[1];
      
      setMessages(prev => [...prev, { role: 'user', text: `[Analizando imagen: ${file.name}]` }]);
      setIsLoading(true);

      const responseText = await analyzeImageWithGemini(base64String, "Describe this image and how it might relate to the style or space of the house.", currentHouse);
      
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center ${
          isOpen ? 'scale-0 opacity-0' : 'bg-emerald-600 text-white scale-100 opacity-100'
        }`}
      >
        <MessageCircle className="h-8 w-8" />
        <span className="absolute -top-2 -right-2 bg-red-500 h-4 w-4 rounded-full animate-ping"></span>
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-0 right-0 z-50 w-full sm:w-[400px] sm:bottom-6 sm:right-6 bg-white sm:rounded-2xl shadow-2xl flex flex-col transition-all duration-500 transform border border-gray-100 ${
          isOpen ? 'translate-y-0 opacity-100 h-[80vh] sm:h-[600px]' : 'translate-y-[120%] opacity-0 h-0'
        }`}
      >
        {/* Header */}
        <div className="bg-emerald-600 p-4 sm:rounded-t-2xl flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-2 rounded-full">
              <Sparkles className="h-5 w-5 text-yellow-300" />
            </div>
            <div>
              <h3 className="font-bold">Asistente Virtual</h3>
              <p className="text-xs text-emerald-100">
                {currentHouse ? `Consultando ${currentHouse.id}` : 'Selecciona una vivienda'}
              </p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="hover:bg-emerald-700 p-2 rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-emerald-600 text-white rounded-br-none shadow-md' 
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm border border-gray-100 flex items-center gap-2">
                 <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                 <span className="text-xs text-gray-500">Pensando...</span>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Controls */}
        <div className="p-4 bg-white border-t border-gray-100 sm:rounded-b-2xl">
          {/* Toolbar */}
          <div className="flex items-center gap-3 mb-3">
             <button 
               onClick={() => setThinkingMode(!thinkingMode)}
               className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full transition-all border ${
                 thinkingMode 
                   ? 'bg-purple-100 text-purple-700 border-purple-200' 
                   : 'bg-gray-100 text-gray-500 border-transparent hover:bg-gray-200'
               }`}
             >
               <BrainCircuit className="h-3 w-3" />
               {thinkingMode ? 'Modo Experto: ON' : 'Modo Experto'}
             </button>
             
             <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all"
             >
               <ImageIcon className="h-3 w-3" />
               Analizar Imagen
             </button>
             <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleImageUpload}
             />
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Escribe tu pregunta..."
              className="flex-1 bg-gray-100 border-0 focus:ring-2 focus:ring-emerald-500 rounded-xl px-4 py-3 text-sm"
              disabled={isLoading}
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !inputText.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all shadow-md active:scale-95"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIAssistant;
