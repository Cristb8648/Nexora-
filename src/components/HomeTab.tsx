import React from 'react';
import {
  Smartphone,
  Car,
  Home as HomeIcon,
  Wrench,
  Shirt,
  Trophy,
  Dog,
  Building2,
  Hammer,
  ShieldCheck,
  MapPin,
  Sparkles,
  ChevronRight,
  Plus,
  Store,
  ArrowUpRight,
  Heart,
  Eye,
  MessageCircle,
  BadgeCheck,
  TrendingUp,
  Flame
} from 'lucide-react';
import { Listing, ProductCategory, Shop, TrustLevel } from '../types';
import { calculateDistanceKm } from '../utils/distance';

interface HomeTabProps {
  listings: Listing[];
  shops: Shop[];
  favorites: string[];
  onSelectCategory: (cat: ProductCategory) => void;
  onSelectListing: (listing: Listing) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onOpenPublish: () => void;
  onOpenShopsTab: () => void;
  onOpenSearchAndMap: (initialSearch?: string) => void;
}

const CATEGORIES: { name: ProductCategory; icon: any; color: string; bg: string }[] = [
  { name: 'Tecnología', icon: Smartphone, color: 'text-blue-600', bg: 'bg-blue-50' },
  { name: 'Vehículos', icon: Car, color: 'text-amber-600', bg: 'bg-amber-50' },
  { name: 'Hogar', icon: HomeIcon, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { name: 'Servicios', icon: Wrench, color: 'text-purple-600', bg: 'bg-purple-50' },
  { name: 'Moda', icon: Shirt, color: 'text-pink-600', bg: 'bg-pink-50' },
  { name: 'Deportes', icon: Trophy, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { name: 'Mascotas', icon: Dog, color: 'text-orange-600', bg: 'bg-orange-50' },
  { name: 'Inmuebles', icon: Building2, color: 'text-teal-600', bg: 'bg-teal-50' },
  { name: 'Herramientas', icon: Hammer, color: 'text-slate-700', bg: 'bg-slate-100' }
];

export const HomeTab: React.FC<HomeTabProps> = ({
  listings,
  shops,
  favorites,
  onSelectCategory,
  onSelectListing,
  onToggleFavorite,
  onOpenPublish,
  onOpenShopsTab,
  onOpenSearchAndMap
}) => {
  const nearbyListings = listings.filter((l) => l.distanceKm <= 3.0);
  const featuredOpportunities = listings.filter((l) => l.featured || l.qualityScore >= 92);

  const getTrustBadgeColor = (level: TrustLevel) => {
    switch (level) {
      case 'Platino': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Oro': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Plata': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Search Prompt Shortcuts Hero */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-850 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-200 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Búsqueda en Lenguaje Natural
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
            ¿Qué estás buscando hoy en Santiago del Estero?
          </h1>
          <p className="text-slate-300 text-sm mb-6 font-light">
            NEXORA entiende frases completas. Buscá por distancia, precio o condición sin complicaciones.
          </p>

          <div className="flex flex-wrap gap-2 text-xs">
            {[
              'Bicicleta rodado 29',
              'Moto 110cc con papeles',
              'Notebook para estudiar',
              'Servicio de electricista',
              'Heladera No Frost'
            ].map((tag) => (
              <button
                key={tag}
                onClick={() => onOpenSearchAndMap(tag)}
                className="bg-white/10 hover:bg-white/20 text-slate-100 px-3 py-1.5 rounded-full border border-white/15 transition-all cursor-pointer flex items-center gap-1"
              >
                <span>{tag}</span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Categories */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Categorías Rápidas</h2>
            <p className="text-xs text-slate-500">Explorá todo el catálogo organizado</p>
          </div>
          <button
            onClick={() => onOpenSearchAndMap()}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            Ver todas <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.name}
                onClick={() => onSelectCategory(cat.name)}
                className="group flex flex-col items-center justify-center p-3 bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-blue-300 rounded-2xl transition-all shadow-2xs hover:shadow-md cursor-pointer"
              >
                <div className={`w-11 h-11 rounded-xl ${cat.bg} ${cat.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-800 text-center truncate w-full">
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Section: Comercios Aliados NEXORA */}
      <section className="bg-slate-50 border border-slate-200/90 rounded-3xl p-5 md:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-bold text-slate-900">Comercios Aliados NEXORA</h2>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300">
                  Verificados
                </span>
              </div>
              <p className="text-xs text-slate-500">Negocios con local físico e inventario permanente</p>
            </div>
          </div>

          <button
            onClick={onOpenShopsTab}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-slate-200"
          >
            Ver Comercios <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {shops.slice(0, 3).map((shop) => (
            <div
              key={shop.id}
              onClick={onOpenShopsTab}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="relative h-24 bg-slate-200 overflow-hidden">
                <img
                  src={shop.coverUrl}
                  alt={shop.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-xs">
                  {shop.category}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div className="flex items-start gap-3 mb-2">
                  <img
                    src={shop.logoUrl}
                    alt={shop.name}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0 -mt-6 bg-white p-0.5 shadow-xs"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {shop.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {shop.neighborhood}, {shop.city}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 text-slate-600">
                  <span>⭐ {shop.stars} Rating</span>
                  <span className="font-medium text-blue-600">{shop.catalogCount} Productos</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section: Cerca de Vos */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-lg font-bold text-slate-900">Cerca de Vos</h2>
              <p className="text-xs text-slate-500">Publicaciones a menos de 3 km de tu ubicación</p>
            </div>
          </div>
          <button
            onClick={() => onOpenSearchAndMap()}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            Ver Mapa <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {nearbyListings.map((item) => {
            const isFav = favorites.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => onSelectListing(item)}
                className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                    <span className="bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5 text-blue-400" />
                      {item.neighborhood} ({calculateDistanceKm(item.lat, item.lng)} km)
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => onToggleFavorite(item.id, e)}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-600 hover:text-rose-500 flex items-center justify-center shadow-xs transition-colors cursor-pointer"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>

                  {item.qualityScore >= 90 && (
                    <div className="absolute bottom-2.5 left-2.5 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                      <ShieldCheck className="w-3 h-3" />
                      Qual {item.qualityScore}/100
                    </div>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-lg font-black text-slate-900 mb-1">
                      ${item.price.toLocaleString('es-AR')} <span className="text-xs font-medium text-slate-500">{item.subServices && item.subServices.length > 0 ? 'ARS (Desde)' : item.currency}</span>
                    </div>
                    {item.serviceProfession && (
                      <div className="text-[10px] font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 w-fit mb-1.5 truncate">
                        🛠️ {item.serviceProfession}
                      </div>
                    )}
                    <h3 className="text-xs font-semibold text-slate-800 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <img src={item.sellerAvatar} alt="" className="w-4 h-4 rounded-full object-cover" />
                      <span className="truncate max-w-[90px] font-medium text-slate-700">{item.sellerName}</span>
                    </div>
                    <span className={`px-1.5 py-0.2 rounded border text-[9px] font-bold ${getTrustBadgeColor(item.sellerTrustLevel)}`}>
                      {item.sellerTrustLevel}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section: Oportunidades Recomendadas NEXORA */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <div>
              <h2 className="text-lg font-bold text-slate-900">Oportunidades Destacadas</h2>
              <p className="text-xs text-slate-500">Publicaciones de excelente precio y alta reputación del vendedor</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredOpportunities.map((item) => {
            const isFav = favorites.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => onSelectListing(item)}
                className="bg-white border border-slate-200/90 rounded-2xl p-3.5 hover:shadow-lg transition-all cursor-pointer group flex gap-4"
              >
                <div className="relative w-28 h-28 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <button
                    type="button"
                    onClick={(e) => onToggleFavorite(item.id, e)}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/90 text-slate-600 hover:text-rose-500 flex items-center justify-center shadow-xs cursor-pointer"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                        {item.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {item.distanceKm} km
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors mb-1">
                      {item.title}
                    </h3>
                  </div>

                  <div>
                    <div className="text-base font-black text-slate-900">
                      ${item.price.toLocaleString('es-AR')}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 pt-1.5 border-t border-slate-100">
                      <span>Vendedor {item.sellerTrustLevel}</span>
                      <span>⭐ {item.sellerStars}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Floating Action Button: Publicar */}
      <button
        onClick={onOpenPublish}
        className="fixed bottom-20 right-6 z-30 bg-gradient-to-r from-blue-700 to-sky-600 text-white font-bold px-5 py-3.5 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-white/20"
      >
        <Plus className="w-5 h-5 stroke-[3]" />
        <span className="text-sm">Publicar Producto</span>
      </button>
    </div>
  );
};
