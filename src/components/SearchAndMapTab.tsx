import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  MapPin,
  List,
  Map as MapIcon,
  SlidersHorizontal,
  X,
  ShieldCheck,
  Heart,
  Scale,
  Sparkles,
  Navigation,
  CheckCircle2,
  ChevronRight,
  Info
} from 'lucide-react';
import { Listing, ProductCategory, TrustLevel } from '../types';
import { SAFE_MEETUP_SPOTS } from '../data/mockData';

interface SearchAndMapTabProps {
  listings: Listing[];
  favorites: string[];
  initialSearchQuery?: string;
  onSelectListing: (listing: Listing) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
}

export const SearchAndMapTab: React.FC<SearchAndMapTabProps> = ({
  listings,
  favorites,
  initialSearchQuery = '',
  onSelectListing,
  onToggleFavorite
}) => {
  const [query, setQuery] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [maxPrice, setMaxPrice] = useState<number>(3000000);
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(20);
  const [selectedTrustLevel, setSelectedTrustLevel] = useState<string>('Todos');
  const [selectedCondition, setSelectedCondition] = useState<string>('Todos');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [activePinListing, setActivePinListing] = useState<Listing | null>(null);
  
  // Product comparator state
  const [compareList, setCompareList] = useState<Listing[]>([]);
  const [showComparatorModal, setShowComparatorModal] = useState(false);

  // Filter logic
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      // Text match
      if (query.trim()) {
        const q = query.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesCategory = item.category.toLowerCase().includes(q);
        const matchesHood = item.neighborhood.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesCategory && !matchesHood) return false;
      }

      // Category
      if (selectedCategory !== 'Todas' && item.category !== selectedCategory) return false;

      // Price
      if (item.price > maxPrice) return false;

      // Distance
      if (item.distanceKm > maxDistanceKm) return false;

      // Condition
      if (selectedCondition !== 'Todos' && item.condition !== selectedCondition) return false;

      // Trust level
      if (selectedTrustLevel !== 'Todos') {
        const levels = ['Bronce', 'Plata', 'Oro', 'Platino'];
        const minIndex = levels.indexOf(selectedTrustLevel);
        const itemIndex = levels.indexOf(item.sellerTrustLevel);
        if (itemIndex < minIndex) return false;
      }

      return true;
    });
  }, [listings, query, selectedCategory, maxPrice, maxDistanceKm, selectedTrustLevel, selectedCondition]);

  const toggleCompare = (item: Listing, e: React.MouseEvent) => {
    e.stopPropagation();
    if (compareList.some(c => c.id === item.id)) {
      setCompareList(compareList.filter(c => c.id !== item.id));
    } else {
      if (compareList.length >= 3) {
        alert("Podés comparar un máximo de 3 publicaciones en simultáneo.");
        return;
      }
      setCompareList([...compareList, item]);
    }
  };

  const getTrustBadgeColor = (level: TrustLevel) => {
    switch (level) {
      case 'Platino': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Oro': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Plata': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <span>Búsqueda Inteligente & Mapa</span>
            <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">
              Santiago del Estero
            </span>
          </h1>
          <p className="text-xs text-slate-500">
            {filteredListings.length} {filteredListings.length === 1 ? 'publicación encontrada' : 'publicaciones encontradas'}
          </p>
        </div>

        {/* View Switcher & Compare Tray Trigger */}
        <div className="flex items-center gap-2">
          {compareList.length > 0 && (
            <button
              onClick={() => setShowComparatorModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer animate-bounce"
            >
              <Scale className="w-4 h-4" />
              <span>Comparar ({compareList.length})</span>
            </button>
          )}

          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Lista</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Mapa Interactivo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search Input Box */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
        <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Search className="w-4 h-4 text-blue-600" />
          <span>Buscador de la App</span>
        </label>
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Escribí lo que querés buscar... Ej: Bicicleta 29, Moto, Samsung, Sillón"
            className="w-full bg-slate-50 focus:bg-white text-slate-900 font-semibold text-base sm:text-sm rounded-xl pl-11 pr-10 py-3 border-2 border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-hidden shadow-2xs placeholder:text-slate-400"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3.5 text-xs text-slate-500 hover:text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-full w-6 h-6 flex items-center justify-center font-bold cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <SlidersHorizontal className="w-4 h-4 text-blue-600" />
          <span>Filtros Rápidos</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          {/* Category */}
          <div>
            <label className="block text-slate-600 font-medium mb-1">Categoría</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800 font-medium focus:ring-2 focus:ring-blue-100 outline-hidden"
            >
              <option value="Todas">Todas las categorías</option>
              {['Tecnología', 'Vehículos', 'Hogar', 'Servicios', 'Moda', 'Deportes', 'Mascotas', 'Inmuebles', 'Herramientas'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Max Price */}
          <div>
            <div className="flex justify-between text-slate-600 font-medium mb-1">
              <span>Precio Máx:</span>
              <span className="font-bold text-slate-900">${maxPrice.toLocaleString('es-AR')}</span>
            </div>
            <input
              type="range"
              min={10000}
              max={5000000}
              step={50000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          {/* Distance */}
          <div>
            <div className="flex justify-between text-slate-600 font-medium mb-1">
              <span>Radio Máx:</span>
              <span className="font-bold text-slate-900">{maxDistanceKm} km</span>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              step={1}
              value={maxDistanceKm}
              onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          {/* Condition */}
          <div>
            <label className="block text-slate-600 font-medium mb-1">Condición</label>
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800 font-medium focus:ring-2 focus:ring-blue-100 outline-hidden"
            >
              <option value="Todos">Todos</option>
              <option value="Nuevo">Nuevo</option>
              <option value="Usado">Usado</option>
              <option value="Reacondicionado">Reacondicionado</option>
            </select>
          </div>

          {/* Seller Trust Level */}
          <div>
            <label className="block text-slate-600 font-medium mb-1">Mínimo Nivel Confianza</label>
            <select
              value={selectedTrustLevel}
              onChange={(e) => setSelectedTrustLevel(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800 font-medium focus:ring-2 focus:ring-blue-100 outline-hidden"
            >
              <option value="Todos">Cualquier nivel</option>
              <option value="Plata">Plata o superior</option>
              <option value="Oro">Oro o superior</option>
              <option value="Platino">Platino únicamente</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content View */}
      {viewMode === 'list' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredListings.length === 0 ? (
            <div className="col-span-full bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-3">
              <Info className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="font-bold text-slate-800">No encontramos resultados exactos</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Probá ampliar el radio de búsqueda o ajustar el filtro de precio para ver más opciones en Santiago del Estero.
              </p>
            </div>
          ) : (
            filteredListings.map((item) => {
              const isFav = favorites.includes(item.id);
              const isCompared = compareList.some(c => c.id === item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => onSelectListing(item)}
                  className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs">
                        {item.neighborhood} ({item.distanceKm} km)
                      </span>
                    </div>

                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => toggleCompare(item, e)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center shadow-xs transition-colors cursor-pointer ${
                          isCompared ? 'bg-purple-600 text-white' : 'bg-white/90 text-slate-600 hover:text-purple-600'
                        }`}
                        title="Comparar producto"
                      >
                        <Scale className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => onToggleFavorite(item.id, e)}
                        className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-600 hover:text-rose-500 flex items-center justify-center shadow-xs transition-colors cursor-pointer"
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                      </button>
                    </div>

                    {item.qualityScore >= 90 && (
                      <div className="absolute bottom-2.5 left-2.5 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                        <ShieldCheck className="w-3 h-3" />
                        Calidad {item.qualityScore}/100
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-lg font-black text-slate-900">
                          ${item.price.toLocaleString('es-AR')} {item.subServices && item.subServices.length > 0 && <span className="text-[10px] text-slate-500 font-normal">(Desde)</span>}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          {item.condition}
                        </span>
                      </div>
                      {item.serviceProfession && (
                        <div className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 w-fit mb-1.5 truncate">
                          🛠️ {item.serviceProfession}
                        </div>
                      )}
                      <h3 className="text-xs font-bold text-slate-800 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <img src={item.sellerAvatar} alt="" className="w-4 h-4 rounded-full object-cover" />
                        <span className="font-medium text-slate-700 truncate max-w-[100px]">{item.sellerName}</span>
                      </div>
                      <span className={`px-1.5 py-0.2 rounded border text-[9px] font-bold ${getTrustBadgeColor(item.sellerTrustLevel)}`}>
                        {item.sellerTrustLevel}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Interactive Map View */
        <div className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-xl relative min-h-[500px] flex flex-col md:flex-row">
          {/* Map Vector Stage */}
          <div className="flex-1 relative bg-slate-950 p-6 flex items-center justify-center overflow-hidden">
            {/* Santiago Map Canvas Mock */}
            <div className="relative w-full max-w-xl aspect-4/3 bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-inner flex flex-col justify-between">
              {/* River Rio Dulce Vector Accent */}
              <div className="absolute inset-y-0 right-1/4 w-12 bg-blue-900/30 -skew-x-12 blur-xs pointer-events-none"></div>

              {/* Map Controls Top Bar */}
              <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 backdrop-blur-xs">
                <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-blue-400" /> Mapa de Santiago del Estero & La Banda
                </span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full">
                  Puntos Seguros Activos
                </span>
              </div>

              {/* Interactive Listing Pins */}
              <div className="relative flex-1 w-full my-4">
                {filteredListings.map((item, idx) => {
                  // Generate coordinates inside container relative
                  const positions = [
                    { top: '35%', left: '42%' },
                    { top: '22%', left: '72%' },
                    { top: '65%', left: '55%' },
                    { top: '48%', left: '30%' },
                    { top: '75%', left: '38%' },
                    { top: '18%', left: '62%' }
                  ];
                  const pos = positions[idx % positions.length];
                  const isSelected = activePinListing?.id === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setActivePinListing(item)}
                      style={{ top: pos.top, left: pos.left }}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 z-20 group`}
                    >
                      <div className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 border ${
                        isSelected
                          ? 'bg-blue-600 text-white border-white scale-110 ring-4 ring-blue-500/30'
                          : 'bg-white text-slate-900 border-slate-300 hover:scale-105'
                      }`}>
                        <span>${(item.price / 1000).toFixed(0)}k</span>
                      </div>
                    </button>
                  );
                })}

                {/* Safe Meetup Spots Pins */}
                {SAFE_MEETUP_SPOTS.map((spot, sIdx) => {
                  const safePositions = [
                    { top: '42%', left: '48%' }, // Plaza Libertad
                    { top: '30%', left: '58%' }, // Parque Aguirre
                    { top: '55%', left: '40%' }, // Terminal
                    { top: '15%', left: '78%' }  // La Banda
                  ];
                  const pos = safePositions[sIdx % safePositions.length];
                  return (
                    <div
                      key={spot.name}
                      style={{ top: pos.top, left: pos.left }}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                      title={`Punto Seguro NEXORA: ${spot.name}`}
                    >
                      <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 animate-pulse">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Map Footer Legend */}
              <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400 bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Publicación
                  </span>
                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                    <ShieldCheck className="w-3 h-3" /> Punto Seguro NEXORA
                  </span>
                </div>
                <span>Tocá un pin para ver detalles</span>
              </div>
            </div>
          </div>

          {/* Active Pin Sidebar Drawer */}
          <div className="w-full md:w-80 bg-slate-900 border-t md:border-t-0 md:border-l border-slate-800 p-5 flex flex-col justify-between">
            {activePinListing ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950 px-2 py-0.5 rounded-md border border-blue-800">
                    {activePinListing.neighborhood} ({activePinListing.distanceKm} km)
                  </span>
                  <button
                    onClick={() => setActivePinListing(null)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="aspect-16/10 rounded-xl overflow-hidden bg-slate-950">
                  <img src={activePinListing.images[0]} alt="" className="w-full h-full object-cover" />
                </div>

                <div>
                  <div className="text-xl font-black text-white">
                    ${activePinListing.price.toLocaleString('es-AR')}
                  </div>
                  <h3 className="text-sm font-bold text-slate-200 mt-1">
                    {activePinListing.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                    {activePinListing.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <img src={activePinListing.sellerAvatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                    <span>{activePinListing.sellerName}</span>
                  </div>
                  <span className="text-emerald-400 font-bold">⭐ {activePinListing.sellerStars}</span>
                </div>

                <button
                  onClick={() => onSelectListing(activePinListing)}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Ver Publicación Completa</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="text-center py-12 space-y-3">
                <MapPin className="w-10 h-10 text-slate-600 mx-auto" />
                <h4 className="font-bold text-slate-300 text-sm">Explorá el Mapa Local</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Seleccioná cualquier marcador para desplegar los datos de la publicación y ubicar Puntos Seguros de encuentro.
                </p>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 space-y-2">
              <span className="font-bold text-slate-300 block">Puntos Seguros Recomendados:</span>
              <ul className="space-y-1">
                {SAFE_MEETUP_SPOTS.map(spot => (
                  <li key={spot.name} className="flex items-center gap-1.5 text-slate-300">
                    <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="truncate">{spot.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Product Comparator Side-by-Side Modal */}
      {showComparatorModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-purple-600" />
                  <span>Comparador Inteligente NEXORA</span>
                </h2>
                <p className="text-xs text-slate-500">Comparación lado a lado para tomar la mejor decisión</p>
              </div>
              <button
                onClick={() => setShowComparatorModal(false)}
                className="text-slate-400 hover:text-slate-600 p-2 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Side-by-side Grid */}
            <div className={`grid grid-cols-1 md:grid-cols-${compareList.length} gap-4`}>
              {compareList.map((item) => (
                <div key={item.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="relative aspect-4/3 rounded-xl overflow-hidden mb-3">
                      <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={(e) => toggleCompare(item, e)}
                        className="absolute top-2 right-2 bg-slate-900/80 text-white rounded-full p-1 hover:bg-rose-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 line-clamp-2 mb-2">{item.title}</h3>
                    <div className="text-xl font-black text-blue-700 mb-3">${item.price.toLocaleString('es-AR')}</div>

                    <div className="space-y-2 text-xs text-slate-700">
                      <div className="flex justify-between py-1 border-b border-slate-200">
                        <span className="text-slate-500">Condición:</span>
                        <span className="font-bold">{item.condition}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-200">
                        <span className="text-slate-500">Distancia:</span>
                        <span className="font-bold">{item.distanceKm} km ({item.neighborhood})</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-200">
                        <span className="text-slate-500">Confianza Vendedor:</span>
                        <span className={`font-bold ${getTrustBadgeColor(item.sellerTrustLevel)} px-1.5 py-0.2 rounded`}>
                          {item.sellerTrustLevel}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-200">
                        <span className="text-slate-500">Calificación:</span>
                        <span className="font-bold">⭐ {item.sellerStars}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">Índice Calidad:</span>
                        <span className="font-bold text-emerald-700">{item.qualityScore}/100</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setShowComparatorModal(false);
                      onSelectListing(item);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer shadow-xs"
                  >
                    Ver Detalles
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
