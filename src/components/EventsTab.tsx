import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  Search,
  Filter,
  PlusCircle,
  Map as MapIcon,
  Grid,
  ShieldCheck,
  Sparkles,
  Building2,
  Music,
  Utensils,
  Trophy,
  Users,
  Navigation,
  ChevronRight,
  Info,
  X,
  ExternalLink,
  Flame
} from 'lucide-react';
import { EventCategory, LocalEvent, UserProfile } from '../types';
import { getEvents } from '../services/storage';
import { PublishEventModal } from './PublishEventModal';
import { EventDetailModal } from './EventDetailModal';

interface EventsTabProps {
  currentUser: UserProfile;
  onOpenSecurePaymentForTicket: (event: LocalEvent) => void;
  onContactOrganizer?: (event: LocalEvent) => void;
}

const CATEGORIES: { label: string; value: EventCategory | 'Todas'; icon: any }[] = [
  { label: 'Todas las Opciones', value: 'Todas', icon: Sparkles },
  { label: 'Peñas y Folclore', value: 'Peñas y Folclore', icon: Music },
  { label: 'Conciertos y Recitales', value: 'Conciertos y Música', icon: Music },
  { label: 'Boliches y Fiesta', value: 'Boliches y Fiesta', icon: Flame },
  { label: 'Teatro y Cultura', value: 'Teatro y Cultura', icon: Building2 },
  { label: 'Gastronomía y Ferias', value: 'Gastronomía y Ferias', icon: Utensils },
  { label: 'Deportes', value: 'Deportes', icon: Trophy },
  { label: 'Exposiciones y Nodos', value: 'Exposiciones y Nodos', icon: Users },
  { label: 'Bares y Restó', value: 'Bares y Restó', icon: Utensils }
];

export const EventsTab: React.FC<EventsTabProps> = ({
  currentUser,
  onOpenSecurePaymentForTicket,
  onContactOrganizer
}) => {
  const [eventsList, setEventsList] = useState<LocalEvent[]>(getEvents());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'Todas'>('Todas');
  const [selectedCity, setSelectedCity] = useState<string>('Todas');
  const [priceFilter, setPriceFilter] = useState<'Todos' | 'Gratis' | 'Pago'>('Todos');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  
  // Modals
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [selectedEventForDetail, setSelectedEventForDetail] = useState<LocalEvent | null>(null);
  const [activeMapPin, setActiveMapPin] = useState<LocalEvent | null>(null);

  const handleReloadEvents = () => {
    setEventsList(getEvents());
  };

  const handleEventCreated = (newEvent: LocalEvent) => {
    setEventsList(getEvents());
  };

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return eventsList.filter((event) => {
      // Query match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = event.title.toLowerCase().includes(q);
        const matchesDesc = event.description.toLowerCase().includes(q);
        const matchesLoc = event.locationName.toLowerCase().includes(q);
        const matchesCity = event.city.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesLoc && !matchesCity) return false;
      }

      // Category match
      if (selectedCategory !== 'Todas' && event.category !== selectedCategory) {
        return false;
      }

      // City match
      if (selectedCity !== 'Todas' && event.city !== selectedCity) {
        return false;
      }

      // Price filter
      if (priceFilter === 'Gratis' && !event.isFree) return false;
      if (priceFilter === 'Pago' && event.isFree) return false;

      return true;
    });
  }, [eventsList, searchQuery, selectedCategory, selectedCity, priceFilter]);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Hero Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-950 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-1/3 top-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Santiago del Estero • La Banda • Termas</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Eventos, Peñas y Entretenimiento
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            Encontrá qué hacer en Santiago del Estero. Publicá tu recital, peña folclórica, boliche o feria gastronómica y vende entradas con la seguridad del sistema Escrow NEXORA 🛡️.
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowPublishModal(true)}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-black text-xs shadow-lg shadow-blue-500/25 transition-all cursor-pointer flex items-center gap-2 group"
            >
              <PlusCircle className="w-4 h-4 group-hover:rotate-90 transition-transform" />
              <span>Publicar Evento o Lugar</span>
            </button>

            <div className="flex items-center bg-slate-900/80 p-1 rounded-2xl border border-slate-700 text-xs font-bold">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Galería</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'map' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>Mapa Interactivo</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por recital, peña, boliche, Forum, CCB, artista o zona..."
              className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-medium text-slate-800 bg-slate-50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* City Selector */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-3 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer flex-1 sm:flex-initial"
            >
              <option value="Todas">Toda Santiago (Todas)</option>
              <option value="Santiago del Estero">Santiago Capital</option>
              <option value="La Banda">La Banda</option>
              <option value="Termas de Río Hondo">Termas de Río Hondo</option>
            </select>

            {/* Price Selector */}
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value as any)}
              className="px-3 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer flex-1 sm:flex-initial"
            >
              <option value="Todos">Todos los precios</option>
              <option value="Gratis">Entrada Gratuita 🎁</option>
              <option value="Pago">Con Entrada ($)</option>
            </select>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3.5 py-2 rounded-2xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Main View Display */}
      {viewMode === 'grid' ? (
        /* GRID VIEW */
        <div>
          {filteredEvents.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <Info className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="font-bold text-slate-800 text-base">No hay eventos para estos filtros</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Probá cambiando la categoría o la ciudad elegida para encontrar otras opciones entretenidas en Santiago del Estero.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('Todas');
                  setSelectedCity('Todas');
                  setPriceFilter('Todos');
                  setSearchQuery('');
                }}
                className="mt-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 cursor-pointer"
              >
                Limpiar Filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredEvents.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => setSelectedEventForDetail(evt)}
                  className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col justify-between"
                >
                  <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
                    <img
                      src={evt.images[0]}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Category badge */}
                    <div className="absolute top-3 left-3 bg-slate-950/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs border border-white/20">
                      {evt.category}
                    </div>

                    {/* Price Tag */}
                    <div className="absolute bottom-3 left-3">
                      {evt.isFree ? (
                        <span className="bg-emerald-500 text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-md">
                          ENTRADA LIBRE
                        </span>
                      ) : (
                        <span className="bg-blue-600 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-md">
                          ${evt.price.toLocaleString('es-AR')}
                        </span>
                      )}
                    </div>

                    {/* Date / Time pill */}
                    <div className="absolute top-3 right-3 bg-white/90 text-slate-900 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1 backdrop-blur-xs">
                      <Calendar className="w-3 h-3 text-blue-600" />
                      <span>{evt.date === 'Permanente' ? 'Permanente' : evt.date}</span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">{evt.locationName} • {evt.city}</span>
                      </div>

                      <h3 className="font-extrabold text-slate-900 text-base group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug">
                        {evt.title}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {evt.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                        <img
                          src={evt.organizerAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                          alt=""
                          className="w-4 h-4 rounded-full object-cover"
                        />
                        <span className="font-medium text-slate-700 truncate max-w-[110px]">{evt.organizerName}</span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEventForDetail(evt);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs hover:bg-blue-100 transition-colors flex items-center gap-1"
                      >
                        <span>Ver Detalle</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* MAP VIEW */
        <div className="bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative min-h-[520px] flex flex-col md:flex-row">
          
          {/* Map Vector Canvas */}
          <div className="flex-1 relative p-6 flex items-center justify-center overflow-hidden">
            <div className="relative w-full max-w-2xl aspect-4/3 bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-inner flex flex-col justify-between">
              
              {/* River Rio Dulce Vector Accent */}
              <div className="absolute inset-y-0 right-1/3 w-16 bg-blue-900/30 -skew-x-12 blur-xs pointer-events-none"></div>

              {/* Top Map Header Bar */}
              <div className="relative z-10 flex items-center justify-between text-xs text-slate-300 bg-slate-950/80 p-3 rounded-xl border border-slate-800 backdrop-blur-xs">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-blue-400" /> Mapa de Eventos en Santiago & La Banda
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-bold">
                  {filteredEvents.length} Eventos Activos
                </span>
              </div>

              {/* Map Pins */}
              <div className="relative flex-1 w-full my-6">
                {filteredEvents.map((evt, idx) => {
                  const mapPositions = [
                    { top: '38%', left: '44%' }, // Forum Santiago
                    { top: '48%', left: '48%' }, // CCB Plaza Libertad
                    { top: '22%', left: '38%' }, // Estadio Madre de Ciudades
                    { top: '20%', left: '72%' }, // Studio Club La Banda
                    { top: '15%', left: '80%' }, // Nodo Tecnológico
                    { top: '55%', left: '52%' }  // Parque Aguirre
                  ];

                  const pos = mapPositions[idx % mapPositions.length];
                  const isSelected = activeMapPin?.id === evt.id;

                  return (
                    <button
                      key={evt.id}
                      onClick={() => setActiveMapPin(evt)}
                      style={{ top: pos.top, left: pos.left }}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 z-20 group`}
                    >
                      <div className={`px-2.5 py-1 rounded-full text-xs font-black shadow-lg flex items-center gap-1.5 border ${
                        isSelected
                          ? 'bg-blue-600 text-white border-white scale-110 ring-4 ring-blue-500/30'
                          : 'bg-white text-slate-900 border-slate-300 hover:scale-105'
                      }`}>
                        <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                        <span className="truncate max-w-[110px]">{evt.title}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Bottom Map Footer Legend */}
              <div className="relative z-10 text-[10px] text-slate-400 bg-slate-950/80 p-2 rounded-xl border border-slate-800 flex items-center justify-between">
                <span>📍 Santiago Capital / La Banda / Costanera</span>
                <span className="text-slate-500">Hacé click en los pines para ver el evento</span>
              </div>

            </div>
          </div>

          {/* Sidebar Active Pin Preview Panel */}
          {activeMapPin && (
            <div className="w-full md:w-80 bg-slate-900 border-t md:border-t-0 md:border-l border-slate-800 p-5 flex flex-col justify-between text-white space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-blue-600/30 text-blue-300 border border-blue-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {activeMapPin.category}
                  </span>
                  <button
                    onClick={() => setActiveMapPin(null)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="font-black text-base leading-tight text-white">
                  {activeMapPin.title}
                </h3>

                <div className="space-y-1 text-xs text-slate-300">
                  <p className="flex items-center gap-1 font-semibold text-blue-400">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{activeMapPin.locationName}</span>
                  </p>
                  <p className="text-slate-400 text-[11px]">{activeMapPin.address}, {activeMapPin.city}</p>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Fecha:</span>
                    <span className="font-bold text-white">{activeMapPin.date}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Horario:</span>
                    <span className="font-bold text-white">{activeMapPin.time}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                    <span className="text-slate-400">Entrada:</span>
                    <span className="font-black text-emerald-400">
                      {activeMapPin.isFree ? 'LIBRE Y GRATUITA' : `$${activeMapPin.price.toLocaleString('es-AR')}`}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedEventForDetail(activeMapPin)}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Ver Detalle Completo</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Modals */}
      <PublishEventModal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        onEventCreated={handleEventCreated}
        currentUser={currentUser}
      />

      <EventDetailModal
        event={selectedEventForDetail}
        isOpen={!!selectedEventForDetail}
        onClose={() => setSelectedEventForDetail(null)}
        currentUser={currentUser}
        onBuyTicket={(evt) => {
          setSelectedEventForDetail(null);
          onOpenSecurePaymentForTicket(evt);
        }}
        onContactOrganizer={onContactOrganizer}
      />

    </div>
  );
};
