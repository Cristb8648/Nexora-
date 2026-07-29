import React from 'react';
import { X, Heart, Trash2, ChevronRight } from 'lucide-react';
import { Listing } from '../types';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favoritesListings: Listing[];
  onSelectListing: (listing: Listing) => void;
  onRemoveFavorite: (id: string, e: React.MouseEvent) => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  favoritesListings,
  onSelectListing,
  onRemoveFavorite
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2 font-bold text-sm">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span>Mis Guardados ({favoritesListings.length})</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-3 flex-1 divide-y divide-slate-100">
          {favoritesListings.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No guardaste ninguna publicación aún. Tocá el corazón en cualquier tarjeta para guardarla acá.
            </div>
          ) : (
            favoritesListings.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectListing(item);
                  onClose();
                }}
                className="pt-3 first:pt-0 flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-2 rounded-2xl transition-colors"
              >
                <img src={item.images[0]} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{item.title}</h4>
                  <div className="font-black text-blue-700 text-sm mt-0.5">
                    ${item.price.toLocaleString('es-AR')}
                  </div>
                  <p className="text-[10px] text-slate-400">{item.neighborhood}, {item.city}</p>
                </div>

                <button
                  onClick={(e) => onRemoveFavorite(item.id, e)}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-full hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Quitar de favoritos"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
