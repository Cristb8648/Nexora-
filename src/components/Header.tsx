import React, { useState } from 'react';
import {
  ShieldCheck,
  Bell,
  User,
  MapPin,
  Sparkles,
  Search,
  SlidersHorizontal,
  Settings,
  Store,
  BarChart3,
  Heart,
  Scale,
  Ticket
} from 'lucide-react';
import { UserProfile, TrustLevel } from '../types';

interface HeaderProps {
  user: UserProfile;
  selectedCity: string;
  onSelectCity: (city: string) => void;
  unreadNotifsCount: number;
  onOpenNotifs: () => void;
  onOpenFavorites: () => void;
  onOpenTrustCenter: () => void;
  onOpenAIAssistant: () => void;
  onOpenAdminPanel: () => void;
  onOpenLegalCenter: () => void;
  onOpenEventsTab?: () => void;
  onSearchSubmit: (query: string) => void;
  activeTab: string;
}


export const Header: React.FC<HeaderProps> = ({
  user,
  selectedCity,
  onSelectCity,
  unreadNotifsCount,
  onOpenNotifs,
  onOpenFavorites,
  onOpenTrustCenter,
  onOpenAIAssistant,
  onOpenAdminPanel,
  onOpenLegalCenter,
  onOpenEventsTab,
  onSearchSubmit
}) => {

  const [searchInput, setSearchInput] = useState('');
  const [showLocationMenu, setShowLocationModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearchSubmit(searchInput.trim());
    }
  };

  const getTrustBadgeColor = (level: TrustLevel) => {
    switch (level) {
      case 'Platino': return 'bg-amber-500/10 text-amber-600 border-amber-500/30';
      case 'Oro': return 'bg-purple-500/10 text-purple-600 border-purple-500/30';
      case 'Plata': return 'bg-blue-500/10 text-blue-600 border-blue-500/30';
      default: return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Utility Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowLocationModal(!showLocationMenu)}
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-medium text-white">{selectedCity}</span>
              <span className="text-slate-400 text-[10px] bg-slate-800 px-1.5 py-0.5 rounded">Cambiar</span>
            </button>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline text-slate-300">
              Conectando compradores y vendedores en la provincia
            </span>
          </div>

          <div className="flex items-center gap-3">
            {onOpenEventsTab && (
              <>
                <button 
                  onClick={onOpenEventsTab}
                  className="flex items-center gap-1 text-amber-300 hover:text-white transition-colors font-bold cursor-pointer"
                  title="Eventos, Peñas y Entretenimiento en Santiago del Estero"
                >
                  <Ticket className="w-3.5 h-3.5 text-amber-400" />
                  <span>Eventos SDE</span>
                </button>
                <span className="text-slate-600">|</span>
              </>
            )}
            <button 
              onClick={onOpenLegalCenter}
              className="flex items-center gap-1 text-emerald-300 hover:text-white transition-colors font-medium cursor-pointer"
              title="Marco Legal, Términos y Botón de Arrepentimiento"
            >
              <Scale className="w-3.5 h-3.5 text-emerald-400" />
              <span>Legales ARG</span>
            </button>

            <span className="text-slate-600">|</span>
            <button 
              onClick={onOpenAIAssistant}
              className="flex items-center gap-1 text-sky-300 hover:text-white transition-colors font-medium cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
              <span>NEXORA AI</span>
            </button>
            <span className="text-slate-600">|</span>
            <button 
              onClick={onOpenAdminPanel}
              className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Centro de Operaciones Administrador"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Operaciones</span>
            </button>
          </div>
        </div>
      </div>

      {/* Location Modal */}
      {showLocationMenu && (
        <div className="absolute top-8 left-4 z-50 bg-white border border-slate-200 rounded-xl shadow-xl p-3 w-64 text-slate-800 text-sm">
          <div className="font-semibold text-xs text-slate-500 uppercase tracking-wider mb-2">
            Seleccionar Ubicación
          </div>
          {['Santiago del Estero (Centro)', 'La Banda', 'B° Autonomía', 'B° Smata', 'B° Belgrano', 'B° San Germés'].map((loc) => (
            <button
              key={loc}
              onClick={() => {
                onSelectCity(loc);
                setShowLocationModal(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                selectedCity === loc ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <span>{loc}</span>
              {selectedCity === loc && <span className="w-2 h-2 rounded-full bg-blue-600"></span>}
            </button>
          ))}
        </div>
      )}

      {/* Main Brand & Search Header */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 space-y-2 sm:space-y-0">
        <div className="flex items-center justify-between gap-3">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-900 via-blue-700 to-sky-500 flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-blue-500/20">
                N
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-black text-xl tracking-tight text-slate-900">NEXORA</span>
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                    SDE
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium -mt-0.5 hidden sm:block">
                  Conectamos confianza
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Global Search Bar */}
          <form onSubmit={handleSubmit} className="hidden sm:flex flex-1 max-w-xl relative">
            <div className="relative w-full flex items-center">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="¿Qué estás buscando? Ej: Bicicleta, Moto 110, Notebook..."
                className="w-full bg-slate-50 hover:bg-white focus:bg-white text-slate-900 font-medium text-sm rounded-full pl-10 pr-20 py-2.5 border-2 border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-hidden shadow-2xs"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  className="absolute right-16 text-xs text-slate-400 hover:text-slate-600 bg-slate-200 rounded-full w-5 h-5 flex items-center justify-center font-bold"
                >
                  ✕
                </button>
              )}
              <button
                type="submit"
                className="absolute right-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-full shadow-2xs transition-transform active:scale-95 cursor-pointer"
              >
                Buscar
              </button>
            </div>
          </form>

          {/* Actions & User Profile Badge */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenFavorites}
              className="p-2.5 text-slate-600 hover:text-rose-600 hover:bg-slate-100 rounded-full transition-colors relative cursor-pointer"
              title="Favoritos"
            >
              <Heart className="w-5 h-5" />
            </button>

            <button
              onClick={onOpenNotifs}
              className="p-2.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-colors relative cursor-pointer"
              title="Notificaciones"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifsCount > 0 && (
                <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-bounce">
                  {unreadNotifsCount}
                </span>
              )}
            </button>

            {/* User Trust Button */}
            <button
              onClick={onOpenTrustCenter}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all cursor-pointer bg-white shadow-2xs"
            >
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover border border-slate-300"
              />
              <div className="text-left hidden md:block">
                <div className="text-xs font-bold text-slate-800 leading-tight">
                  {user.name.split(' ')[0]}
                </div>
                <div className="flex items-center gap-1 text-[10px]">
                  <ShieldCheck className="w-3 h-3 text-blue-600" />
                  <span className={`font-semibold px-1 py-0.2 rounded border ${getTrustBadgeColor(user.trustIndex.level)}`}>
                    ICN {user.trustIndex.score} - {user.trustIndex.level}
                  </span>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Full-Width Search Bar */}
        <form onSubmit={handleSubmit} className="sm:hidden pt-1 pb-1">
          <div className="relative w-full flex items-center">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="¿Qué buscás? Ej: Bicicleta, Moto 110..."
              className="w-full bg-slate-100 focus:bg-white text-slate-900 font-medium text-base rounded-full pl-10 pr-20 py-2.5 border-2 border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-hidden shadow-2xs"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5" />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput('')}
                className="absolute right-16 text-xs text-slate-500 hover:text-slate-700 bg-slate-200 rounded-full w-5 h-5 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            )}
            <button
              type="submit"
              className="absolute right-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-full shadow-2xs active:scale-95 cursor-pointer"
            >
              Buscar
            </button>
          </div>
        </form>
      </div>
    </header>
  );
};
