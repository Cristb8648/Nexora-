import React, { useState, useEffect } from 'react';
import {
  X,
  Heart,
  Share2,
  Flag,
  MessageCircle,
  ShieldCheck,
  MapPin,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  PhoneCall,
  Loader2,
  Store,
  Star,
  UserCheck,
  ArrowRight,
  User,
  ThumbsUp
} from 'lucide-react';
import { Listing, UserProfile, TrustLevel, Review } from '../types';
import { callGeminiBuyerAssistant, BuyerAssistantResponse } from '../services/gemini';
import { calculateDistanceKm } from '../utils/distance';
import { getReviewsForSeller, getSellerProfile } from '../services/storage';
import { SellerProfileModal } from './SellerProfileModal';
import { SecurePaymentModal } from './SecurePaymentModal';

interface ListingDetailModalProps {
  listing: Listing | null;
  currentUser: UserProfile;
  isFavorite: boolean;
  onClose: () => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onStartChatWithSeller: (listing: Listing, presetMessage?: string) => void;
  onReportListing: (listing: Listing) => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  listing,
  currentUser,
  isFavorite,
  onClose,
  onToggleFavorite,
  onStartChatWithSeller,
  onReportListing
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAskingAI, setIsAskingAI] = useState(false);
  const [aiBuyerAdvice, setAiBuyerAdvice] = useState<BuyerAssistantResponse | null>(null);
  const [sellerReviews, setSellerReviews] = useState<Review[]>([]);
  const [showSellerProfileModal, setShowSellerProfileModal] = useState(false);
  const [showSecurePaymentModal, setShowSecurePaymentModal] = useState(false);

  useEffect(() => {
    if (listing) {
      const revs = getReviewsForSeller(listing.sellerId);
      setSellerReviews(revs);
    }
  }, [listing]);

  if (!listing) return null;

  const handleAskBuyerAI = async () => {
    setIsAskingAI(true);
    try {
      const res = await callGeminiBuyerAssistant({
        listingTitle: listing.title,
        listingPrice: listing.price,
        category: listing.category
      });
      setAiBuyerAdvice(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAskingAI(false);
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

  const quickQuestions = [
    "¿Sigue disponible?",
    "¿Aceptás permuta?",
    "¿Hacés envíos?",
    "¿Se puede ver hoy?",
    "¿Cuál es el último precio?"
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="bg-white p-4 border-b border-slate-200 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
              {listing.category}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {listing.neighborhood}, Santiago del Estero
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => onToggleFavorite(listing.id, e)}
              className="p-2 text-slate-600 hover:text-rose-500 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
            <button
              onClick={() => onReportListing(listing)}
              className="p-2 text-slate-400 hover:text-amber-600 rounded-full hover:bg-slate-100 cursor-pointer"
              title="Reportar publicación"
            >
              <Flag className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 flex-1">
          {/* Gallery Slider */}
          <div className="relative aspect-16/9 md:aspect-21/9 bg-slate-900 rounded-2xl overflow-hidden group">
            <img
              src={listing.images[activeImageIndex] || listing.images[0]}
              alt={listing.title}
              className="w-full h-full object-contain bg-slate-950"
            />

            {listing.images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : listing.images.length - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-slate-900/70 hover:bg-slate-900 text-white p-2 rounded-full cursor-pointer opacity-80 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev < listing.images.length - 1 ? prev + 1 : 0))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-900/70 hover:bg-slate-900 text-white p-2 rounded-full cursor-pointer opacity-80 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-slate-900/80 text-white text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-xs">
                  {activeImageIndex + 1} / {listing.images.length}
                </div>
              </>
            )}
          </div>

          {/* Title & Price */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  {listing.condition}
                </span>
                <span className="text-xs text-slate-400">
                  {listing.viewsCount} visitas • {listing.favoritesCount} guardados
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
                {listing.title}
              </h1>

              {/* Service Profession Badge */}
              {listing.serviceProfession && (
                <div className="mt-2 inline-flex items-center gap-1.5 bg-blue-900 text-white font-extrabold text-xs px-3 py-1 rounded-xl border border-blue-700 shadow-2xs">
                  <span>🛠️ Oficio / Profesión:</span>
                  <span className="text-amber-300 font-black">{listing.serviceProfession}</span>
                </div>
              )}

              <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                {listing.neighborhood}, {listing.city} ({listing.distanceKm} km de tu ubicación)
              </p>
            </div>

            <div className="text-left md:text-right shrink-0">
              <div className="text-2xl md:text-3xl font-black text-blue-700">
                ${listing.price.toLocaleString('es-AR')}
              </div>
              <div className="text-xs text-slate-500 font-medium">
                {listing.subServices && listing.subServices.length > 0 ? 'ARS (Precio Desde)' : 'ARS'}
              </div>
            </div>
          </div>

          {/* SubServices Tariff Catalog Section */}
          {listing.subServices && listing.subServices.length > 0 && (
            <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-400">
                    <Store className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-white">Catálogo de Servicios y Tarifas</h3>
                    <p className="text-[11px] text-slate-300">
                      Precios individuales ofrecidos por {listing.sellerName} ({listing.serviceProfession || 'Prestador'})
                    </p>
                  </div>
                </div>
                <span className="bg-blue-600/30 text-blue-300 text-[10px] font-black px-2.5 py-1 rounded-full border border-blue-500/40">
                  {listing.subServices.length} opciones disponibles
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {listing.subServices.map((subItem) => (
                  <div
                    key={subItem.id}
                    className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between space-y-3 hover:border-slate-700 transition-colors"
                  >
                    <div className="space-y-2">
                      {subItem.imageUrl && (
                        <div className="w-full h-28 rounded-lg overflow-hidden bg-slate-900 mb-2">
                          <img src={subItem.imageUrl} alt={subItem.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-extrabold text-xs text-white leading-snug">{subItem.title}</h4>
                        <span className="font-black text-sm text-emerald-400 shrink-0 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded-md">
                          ${subItem.price.toLocaleString('es-AR')}
                        </span>
                      </div>
                      {subItem.description && (
                        <p className="text-[11px] text-slate-300 leading-normal">
                          {subItem.description}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        onStartChatWithSeller(
                          listing,
                          `Hola ${listing.sellerName}, me interesa consultar por el servicio de "${subItem.title}" ($${subItem.price.toLocaleString('es-AR')}).`
                        )
                      }
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-transform shadow-xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Consultar este servicio</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resumen Inteligente NEXORA AI */}
          <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white p-5 rounded-2xl shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/30 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Resumen Inteligente NEXORA</h3>
                  <p className="text-[10px] text-slate-300">Análisis objetivo generado automáticamente</p>
                </div>
              </div>

              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold px-2.5 py-1 rounded-full">
                Índice Calidad: {listing.qualityScore}/100
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs pt-1">
              <div className="bg-white/10 p-2 rounded-xl flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Descripción completa</span>
              </div>
              <div className="bg-white/10 p-2 rounded-xl flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Fotos suficientes</span>
              </div>
              <div className="bg-white/10 p-2 rounded-xl flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Precio competitivo</span>
              </div>
              <div className="bg-white/10 p-2 rounded-xl flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Responde rápido</span>
              </div>
            </div>

            {/* Interactive Buyer Advisor Callout */}
            {aiBuyerAdvice ? (
              <div className="bg-white/10 border border-sky-400/30 p-3 rounded-xl space-y-2 text-xs">
                <div className="font-bold text-sky-200">🤖 Recomendación del Asesor NEXORA:</div>
                <p className="text-slate-200 leading-relaxed text-[11px]">{aiBuyerAdvice.advice}</p>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleAskBuyerAI}
                disabled={isAskingAI}
                className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-slate-100 font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                {isAskingAI ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
                <span>{isAskingAI ? "Analizando..." : "¿Consultar recomendaciones de compra a NEXORA AI?"}</span>
              </button>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
              Descripción del Producto
            </h3>
            <p className="text-xs md:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              {listing.description}
            </p>
          </div>

          {/* Seller Profile & Buyer Reviews Section */}
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-sm text-slate-900">
                  Información del Vendedor / Prestador
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSellerProfileModal(true)}
                className="text-xs font-black text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Ver Perfil Completo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Main Seller Card */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="flex items-center gap-3">
                <img
                  src={listing.sellerAvatar}
                  alt={listing.sellerName}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-600 shadow-xs shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-extrabold text-sm text-slate-900">{listing.sellerName}</h4>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${getTrustBadgeColor(listing.sellerTrustLevel)}`}>
                      Nivel {listing.sellerTrustLevel}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 font-medium">
                    <span className="flex items-center gap-1 text-amber-600 font-bold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {listing.sellerStars} ({sellerReviews.length} opiniones)
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      Responde en ~15 min
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowSellerProfileModal(true)}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-black text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-2xs text-center"
              >
                Ver Reputación y Opiniones
              </button>
            </div>

            {/* Verified Credentials Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-bold text-slate-700">
              <div className="bg-emerald-50 border border-emerald-200/80 p-2 rounded-xl flex items-center gap-1.5 text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Celular e Email Validado</span>
              </div>
              <div className="bg-emerald-50 border border-emerald-200/80 p-2 rounded-xl flex items-center gap-1.5 text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Identidad DNI Verificada</span>
              </div>
              <div className="bg-blue-50 border border-blue-200/80 p-2 rounded-xl flex items-center gap-1.5 text-blue-900 col-span-2 sm:col-span-1">
                <ThumbsUp className="w-4 h-4 text-blue-600 shrink-0" />
                <span>98% Ventas Concretadas</span>
              </div>
            </div>

            {/* Preview of Buyer Reviews / Comments */}
            <div className="space-y-2 pt-1 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>Comentarios de personas que le compraron o contrataron ({sellerReviews.length})</span>
                </h4>
              </div>

              {sellerReviews.length === 0 ? (
                <p className="text-xs text-slate-500 italic bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                  Aún no hay comentarios publicados para este vendedor. ¡Sé el primero en dejar una opinión tras contactarlo!
                </p>
              ) : (
                <div className="space-y-2">
                  {sellerReviews.slice(0, 2).map((rev) => (
                    <div
                      key={rev.id}
                      className="bg-slate-50 border border-slate-200/80 p-3 rounded-xl space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={rev.buyerAvatar}
                            alt={rev.buyerName}
                            className="w-6 h-6 rounded-full object-cover border border-slate-300"
                          />
                          <span className="font-extrabold text-slate-800">{rev.buyerName}</span>
                          {rev.verifiedPurchase && (
                            <span className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-1.5 py-0.2 rounded border border-emerald-300">
                              ✓ Compra Verificada
                            </span>
                          )}
                        </div>

                        <div className="flex text-amber-400">
                          {[1, 2, 3, 4, 5].map((st) => (
                            <Star
                              key={st}
                              className={`w-3 h-3 ${st <= rev.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-slate-700 italic text-[11px] leading-relaxed">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => setShowSellerProfileModal(true)}
                    className="w-full text-center py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-300/80 transition-colors cursor-pointer"
                  >
                    Ver todas las opiniones ({sellerReviews.length}) y agregar un comentario →
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Location & Distance Card for Buyers */}
          {(() => {
            const dist = calculateDistanceKm(listing.lat, listing.lng);
            return (
              <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 space-y-3 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-400">
                      <MapPin className="w-4 h-4 text-rose-500 fill-rose-500 animate-bounce" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-white">Ubicación de la Zona</h4>
                      <p className="text-[11px] text-slate-300">{listing.neighborhood}, {listing.city}</p>
                    </div>
                  </div>
                  <span className="bg-blue-600/30 border border-blue-400/40 text-blue-300 text-xs font-black px-3 py-1 rounded-full shadow-2xs">
                    📍 A ~{dist} km de ti
                  </span>
                </div>

                <div className="relative aspect-21/9 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
                  <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:12px_12px] opacity-30"></div>
                  <div className="relative z-10 flex flex-col items-center gap-1">
                    <div className="bg-blue-600 text-white font-black text-[10px] px-2.5 py-1 rounded-md shadow-lg border border-white">
                      Zona {listing.neighborhood}
                    </div>
                    <MapPin className="w-6 h-6 text-rose-500 fill-rose-500 animate-pulse" />
                  </div>
                  <div className="absolute bottom-1.5 right-2 text-[9px] font-mono text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded">
                    Lat: {listing.lat.toFixed(4)}, Lng: {listing.lng.toFixed(4)}
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 leading-snug">
                  💡 <span className="font-semibold text-slate-100">Ubicación aproximada:</span> El vendedor fijó su zona en el mapa de NEXORA para coordinar la entrega o retiro en persona de forma rápida y cercana.
                </p>
              </div>
            );
          })()}

          {/* Preguntas Frecuentes con 1-tap */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Preguntas Frecuentes Rápida (1-tap al chat)
            </label>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => onStartChatWithSeller(listing, q)}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Contact Action Buttons */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            type="button"
            onClick={() => setShowSecurePaymentModal(true)}
            className="flex-1 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-sm py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-5 h-5 text-amber-300" />
            <span>
              {listing.category === 'Servicios'
                ? 'Contratar y Pagar Servicio con Pago Seguro 🛡️'
                : 'Pagar con Pago Seguro NEXORA 🛡️'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onStartChatWithSeller(listing)}
            className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-black text-sm py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 text-sky-400" />
            <span>
              {listing.category === 'Servicios' ? 'Contactar Prestador en Chat' : 'Contactar Vendedor en Chat'}
            </span>
          </button>
        </div>
      </div>

      {/* Seller Profile & Reviews Full Modal */}
      <SellerProfileModal
        seller={getSellerProfile(
          listing.sellerId,
          listing.sellerName,
          listing.sellerAvatar,
          listing.sellerTrustLevel,
          listing.sellerStars
        )}
        currentUser={currentUser}
        isOpen={showSellerProfileModal}
        onClose={() => setShowSellerProfileModal(false)}
        onStartChatWithSeller={onStartChatWithSeller}
      />

      {/* Secure Payment & Escrow Modal */}
      <SecurePaymentModal
        listing={listing}
        currentUser={currentUser}
        isOpen={showSecurePaymentModal}
        onClose={() => setShowSecurePaymentModal(false)}
        onPaymentComplete={() => {
          // Keep open or notify
        }}
      />
    </div>
  );
};
