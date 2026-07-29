import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Send,
  ShoppingBag,
  Store,
  ShieldCheck,
  HelpCircle,
  Loader2,
  Bot,
  User
} from 'lucide-react';
import { callGeminiAIChat } from '../services/gemini';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm0',
      sender: 'ai',
      text: '¡Hola! Soy NEXORA AI, tu asistente personal en Santiago del Estero. ¿En qué puedo ayudarte hoy? Podés consultarme sobre precios orientativos, consejos para vender más rápido o seguridad en tus encuentros.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (customText?: string) => {
    const queryText = customText || input;
    if (!queryText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: queryText
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const aiReply = await callGeminiAIChat(queryText);
      const aiMsg: ChatMessage = {
        id: `a_${Date.now()}`,
        sender: 'ai',
        text: aiReply
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[650px] max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-blue-600 flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm flex items-center gap-1.5">
                <span>NEXORA AI</span>
                <span className="text-[10px] bg-sky-500/20 text-sky-300 border border-sky-400/30 px-2 py-0.2 rounded-full">
                  Asistente Multimodal
                </span>
              </h2>
              <p className="text-[11px] text-slate-300">Inteligencia especializada en comercio local</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Prompt Suggestions */}
        <div className="p-2.5 bg-slate-100 border-b border-slate-200 flex gap-2 overflow-x-auto text-[11px]">
          {[
            "¿Qué revisar antes de comprar una moto usad?",
            "¿Cómo calcular el precio orientativo de una bici?",
            "¿Cuáles son los Puntos Seguros de Santiago?",
            "Consejos para escribir un buen título"
          ].map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSend(prompt)}
              className="bg-white hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-semibold px-3 py-1 rounded-full border border-slate-200 cursor-pointer whitespace-nowrap transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Feed */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-7 h-7 rounded-xl bg-blue-900 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-xs md:max-w-md p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none shadow-xs'
                    : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-none shadow-2xs'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-white p-3 rounded-2xl border border-slate-200 w-fit">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span>NEXORA AI está razonando una respuesta...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Preguntale lo que necesites a NEXORA AI..."
            className="flex-1 bg-slate-100 p-2.5 rounded-full text-xs text-slate-900 border border-slate-200 focus:bg-white focus:border-blue-500 outline-hidden font-medium"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-full cursor-pointer transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
