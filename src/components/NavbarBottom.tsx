import React from 'react';
import { Home, Search, PlusCircle, MessageCircle, Store, ShieldCheck, Ticket } from 'lucide-react';

interface NavbarBottomProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  unreadMessagesCount: number;
}

export const NavbarBottom: React.FC<NavbarBottomProps> = ({
  activeTab,
  onTabChange,
  unreadMessagesCount
}) => {
  const tabs = [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'search', label: 'Buscar / Mapa', icon: Search },
    { id: 'events', label: 'Eventos', icon: Ticket },
    { id: 'publish', label: 'Publicar', icon: PlusCircle, isHighlight: true },
    { id: 'messages', label: 'Mensajes', icon: MessageCircle, badge: unreadMessagesCount },
    { id: 'shops', label: 'Comercios', icon: Store }
  ];


  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg px-2 py-1.5">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.isHighlight) {
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="flex flex-col items-center justify-center -mt-5 cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-700 to-sky-500 text-white flex items-center justify-center shadow-lg group-hover:scale-105 active:scale-95 transition-all border-2 border-white">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-blue-700 mt-1">Publicar</span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer relative ${
                isActive ? 'text-blue-700 font-black' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {tab.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] mt-0.5 truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
