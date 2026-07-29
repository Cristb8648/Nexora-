import React, { useState } from 'react';
import {
  Store,
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  Sparkles,
  ChevronRight,
  BadgeCheck,
  Star,
  ExternalLink,
  ShoppingBag,
  UserCheck
} from 'lucide-react';
import { Shop, Listing, UserProfile } from '../types';
import { getSellerProfile } from '../services/storage';
import { SellerProfileModal } from './SellerProfileModal';

interface ShopsTabProps {
  shops: Shop[];
  listings: Listing[];
  currentUser: UserProfile;
  onSelectListing: (listing: Listing) => void;
  onStartChatWithSeller?: (listing: Listing, presetMsg?: string) => void;
}

export const ShopsTab: React.FC<ShopsTabProps> = ({
  shops,
  listings,
  currentUser,
  onSelectListing,
  onStartChatWithSeller
}) => {
  const [selectedShop, setSelectedShop] = useState<Shop | null>(shops[0] || null);
  const [showShopSellerModal, setShowShopSellerModal] = useState(false);

  const shopCatalog = selectedShop
    ? listings.filter((l) => l.sellerId === selectedShop.ownerId)
    : [];

  return (
    <div className="space-y-6 pb-20">
      {/* Title */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-semibold mb-2">
            <BadgeCheck className="w-3.5 h-3.5 text-amber-400" /> Comercios Aliados NEXORA
          </span>
          <h1 className="text-2xl font-black tracking-tight">Directorio de Negocios Locales</h1>
          <p className="text-xs text-slate-300 font-light mt-1">
            Comprá en comercios verificados con local físico, garantía directa y atención personalizada en Santiago del Estero.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shops List */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Comercios Destacados ({shops.length})
          </h2>

          {shops.map((shop) => {
            const isSelected = selectedShop?.id === shop.id;
            return (
              <div
                key={shop.id}
                onClick={() => setSelectedShop(shop)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                  isSelected
                    ? 'bg-blue-50/90 border-blue-600 shadow-md ring-2 ring-blue-500/20'
                    : 'bg-white border-slate-200/90 hover:border-slate-300'
                }`}
              >
                <img
                  src={shop.logoUrl}
                  alt=""
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <h3 className="font-bold text-sm text-slate-900 truncate">{shop.name}</h3>
                    {shop.isAliadoNexora && (
                      <BadgeCheck className="w-4 h-4 text-amber-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 truncate">{shop.category}</p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {shop.neighborhood}, {shop.city}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Shop Catalog & Profile */}
        {selectedShop && (
          <div className="lg:col-span-2 space-y-6">
            {/* Shop Profile Header */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs space-y-4">
              <div className="h-32 bg-slate-200 relative">
                <img src={selectedShop.coverUrl} alt="" className="w-full h-full object-cover" />
              </div>

              <div className="p-6 -mt-10 relative space-y-4">
                <div className="flex items-end justify-between gap-4">
                  <div className="flex items-end gap-3">
                    <img
                      src={selectedShop.logoUrl}
                      alt=""
                      className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-md bg-white"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-black text-slate-900">{selectedShop.name}</h2>
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300">
                          Comercio Aliado
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">{selectedShop.category}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowShopSellerModal(true)}
                      className="bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs px-3.5 py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <UserCheck className="w-4 h-4 text-amber-300" />
                      <span>Ver Reputación y Comentarios</span>
                    </button>

                    <a
                      href={`https://wa.me/${selectedShop.whatsapp}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span className="hidden sm:inline">WhatsApp Comercio</span>
                    </a>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  {selectedShop.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span>{selectedShop.address}, {selectedShop.neighborhood}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>{selectedShop.hours}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shop Catalog */}
            <div className="space-y-3">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-blue-600" />
                <span>Catálogo del Comercio ({shopCatalog.length} productos)</span>
              </h3>

              {shopCatalog.length === 0 ? (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
                  Este comercio aún no cargó productos adicionales en la vista previa.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {shopCatalog.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onSelectListing(item)}
                      className="bg-white border border-slate-200 rounded-2xl p-3 hover:shadow-md transition-all cursor-pointer flex gap-3"
                    >
                      <img src={item.images[0]} alt="" className="w-20 h-20 rounded-xl object-cover shrink-0" />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-xs text-slate-900 line-clamp-2">{item.title}</h4>
                          <span className="text-[10px] text-slate-500">{item.condition}</span>
                        </div>
                        <div className="font-black text-sm text-blue-700">
                          ${item.price.toLocaleString('es-AR')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {selectedShop && (
        <SellerProfileModal
          seller={getSellerProfile(
            selectedShop.ownerId,
            selectedShop.name,
            selectedShop.logoUrl,
            'Platino',
            selectedShop.stars
          )}
          currentUser={currentUser}
          isOpen={showShopSellerModal}
          onClose={() => setShowShopSellerModal(false)}
          onSelectListing={onSelectListing}
          onStartChatWithSeller={onStartChatWithSeller}
        />
      )}
    </div>
  );
};
