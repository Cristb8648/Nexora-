import React, { useState, useEffect } from 'react';
import {
  X,
  Star,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  Clock,
  MessageCircle,
  ThumbsUp,
  Award,
  Send,
  Package,
  Wrench,
  Sparkles,
  Phone,
  Mail,
  UserCheck,
  AlertCircle,
  Heart
} from 'lucide-react';
import { UserProfile, Listing, Review, TrustLevel } from '../types';
import { getReviewsForSeller, addReviewForSeller, getListings } from '../services/storage';

interface SellerProfileModalProps {
  seller: UserProfile;
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSelectListing?: (listing: Listing) => void;
  onStartChatWithSeller?: (listing: Listing, presetMsg?: string) => void;
}

export const SellerProfileModal: React.FC<SellerProfileModalProps> = ({
  seller,
  currentUser,
  isOpen,
  onClose,
  onSelectListing,
  onStartChatWithSeller
}) => {
  const [activeTab, setActiveTab] = useState<'reviews' | 'listings' | 'info'>('reviews');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [sellerListings, setSellerListings] = useState<Listing[]>([]);

  // Add review form state
  const [showAddReviewForm, setShowAddReviewForm] = useState(false);
  const [newRating, setNewRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [newComment, setNewComment] = useState<string>('');
  const [selectedListingForReview, setSelectedListingForReview] = useState<string>('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState('');

  useEffect(() => {
    if (isOpen && seller) {
      const sellerRevs = getReviewsForSeller(seller.id);
      setReviews(sellerRevs);

      const allListings = getListings();
      const filtered = allListings.filter((l) => l.sellerId === seller.id);
      setSellerListings(filtered);
    }
  }, [isOpen, seller]);

  if (!isOpen || !seller) return null;

  const trustLevelColors = (level: TrustLevel) => {
    switch (level) {
      case 'Platino':
        return 'bg-gradient-to-r from-amber-500 to-amber-700 text-white border-amber-300';
      case 'Oro':
        return 'bg-gradient-to-r from-purple-600 to-indigo-700 text-white border-purple-300';
      case 'Plata':
        return 'bg-gradient-to-r from-blue-600 to-sky-700 text-white border-blue-300';
      default:
        return 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white border-emerald-300';
    }
  };

  // Calculate average rating
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : seller.trustIndex.stars.toFixed(1);

  const totalReviews = reviews.length;

  const handlePostReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      alert('Por favor escribí un comentario sobre tu experiencia con el vendedor.');
      return;
    }

    setIsSubmittingReview(true);

    const listingObj = sellerListings.find((l) => l.id === selectedListingForReview);

    const created = addReviewForSeller({
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerAvatar: currentUser.avatarUrl,
      sellerId: seller.id,
      listingId: listingObj?.id,
      listingTitle: listingObj?.title || 'Operación en NEXORA',
      rating: newRating,
      comment: newComment.trim(),
      verifiedPurchase: true
    });

    setReviews([created, ...reviews]);
    setNewComment('');
    setShowAddReviewForm(false);
    setIsSubmittingReview(false);
    setReviewSuccessMsg('¡Muchas gracias! Tu opinión ha sido publicada correctamente.');

    setTimeout(() => {
      setReviewSuccessMsg('');
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Cover & Profile Header */}
        <div className="relative bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-5 sm:p-6 shrink-0 border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white p-2 rounded-full cursor-pointer transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <div className="relative">
              <img
                src={seller.avatarUrl}
                alt={seller.name}
                className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl object-cover border-4 border-white/20 shadow-xl"
              />
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-slate-900 shadow-md" title="Cuenta Activa & Verificada">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            </div>

            <div className="flex-1 space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">{seller.name}</h2>
                <span className={`px-2.5 py-0.5 text-[11px] font-black rounded-full border shadow-2xs uppercase tracking-wider ${trustLevelColors(seller.trustIndex.level)}`}>
                  Nivel {seller.trustIndex.level}
                </span>
              </div>

              <p className="text-xs text-slate-300 flex items-center justify-center sm:justify-start gap-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>{seller.neighborhood || 'Centro'}, Santiago del Estero</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">En NEXORA desde hace {seller.trustIndex.accountAgeMonths} meses</span>
              </p>

              {/* Stars & Rating Banner */}
              <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <div className="flex items-center gap-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-xl text-xs font-black">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{avgRating} / 5.0</span>
                  <span className="text-slate-300 font-normal">({totalReviews} opiniones)</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-sky-400" />
                  <span>Responde en ~{seller.trustIndex.avgResponseTimeMin} min</span>
                </div>
              </div>
            </div>
          </div>

          {/* Badges bar */}
          {seller.badges && seller.badges.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap gap-1.5 justify-center sm:justify-start">
              {seller.badges.map((badge, idx) => (
                <span
                  key={idx}
                  className="bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 text-[10px] font-bold px-2.5 py-0.5 rounded-lg flex items-center gap-1"
                >
                  <Award className="w-3 h-3 text-amber-400" />
                  <span>{badge}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-100 p-2 flex border-b border-slate-200 shrink-0 text-xs font-bold">
          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 py-2.5 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Opiniones y Comentarios ({reviews.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('listings')}
            className={`flex-1 py-2.5 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'listings'
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4 text-blue-600" />
            <span>Publicaciones ({sellerListings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-2.5 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'info'
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Reputación y Verificación</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5 text-slate-800">
          {reviewSuccessMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-3.5 rounded-2xl flex items-center gap-2 text-xs font-bold shadow-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{reviewSuccessMsg}</span>
            </div>
          )}

          {/* TAB 1: OPINIONES Y COMENTARIOS */}
          {activeTab === 'reviews' && (
            <div className="space-y-5">
              {/* Summary Stats Box */}
              <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
                <div className="text-center sm:text-left space-y-1">
                  <div className="text-3xl font-black text-amber-400 flex items-center justify-center sm:justify-start gap-1.5">
                    <span>{avgRating}</span>
                    <div className="flex text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-5 h-5 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 font-medium">
                    Calificación promedio basada en opiniones de compradores y clientes verificados en Santiago del Estero.
                  </p>
                </div>

                {currentUser.id !== seller.id && (
                  <button
                    type="button"
                    onClick={() => setShowAddReviewForm(!showAddReviewForm)}
                    className="shrink-0 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-md cursor-pointer transition-transform active:scale-95 flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>{showAddReviewForm ? 'Cancelar Opinión' : 'Escribir una Opinión'}</span>
                  </button>
                )}
              </div>

              {/* Form: Add New Review */}
              {showAddReviewForm && (
                <form
                  onSubmit={handlePostReview}
                  className="bg-blue-50/70 border-2 border-blue-200 p-4 sm:p-5 rounded-2xl space-y-4 shadow-sm animate-fadeIn"
                >
                  <div className="flex items-center justify-between border-b border-blue-200/80 pb-2.5">
                    <h3 className="font-extrabold text-sm text-blue-950 flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span>Contanos tu experiencia con {seller.name}</span>
                    </h3>
                    <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                      Compra / Servicio Verificado
                    </span>
                  </div>

                  {/* Rating Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      1. Elegí tu puntuación:
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((starVal) => {
                        const isFilled = (hoverRating || newRating) >= starVal;
                        return (
                          <button
                            key={starVal}
                            type="button"
                            onMouseEnter={() => setHoverRating(starVal)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setNewRating(starVal)}
                            className="p-1 cursor-pointer transition-transform hover:scale-110"
                          >
                            <Star
                              className={`w-7 h-7 ${
                                isFilled
                                  ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                                  : 'text-slate-300 fill-slate-100'
                              }`}
                            />
                          </button>
                        );
                      })}
                      <span className="ml-2 font-black text-sm text-slate-800">
                        {newRating === 5 && '¡Excelente! (5/5)'}
                        {newRating === 4 && 'Muy Bueno (4/5)'}
                        {newRating === 3 && 'Aceptable (3/5)'}
                        {newRating === 2 && 'Regular (2/5)'}
                        {newRating === 1 && 'Malo (1/5)'}
                      </span>
                    </div>
                  </div>

                  {/* Select product/service optional */}
                  {sellerListings.length > 0 && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        2. ¿Sobre qué artículo o servicio es tu opinión? (Opcional)
                      </label>
                      <select
                        value={selectedListingForReview}
                        onChange={(e) => setSelectedListingForReview(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:border-blue-600 outline-hidden"
                      >
                        <option value="">-- Operación General con este vendedor --</option>
                        {sellerListings.map((l) => (
                          <option key={l.id} value={l.id}>
                            {l.title} (${l.price.toLocaleString('es-AR')})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Comment text */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      3. Escribí tu opinión o comentario:
                    </label>
                    <textarea
                      rows={3}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Ej: Excelente vendedor, muy puntual en Plaza Libertad. El producto estaba en óptimas condiciones tal como en la publicación..."
                      className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-normal text-slate-800 focus:border-blue-600 outline-hidden"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddReviewForm(false)}
                      className="px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmittingReview ? 'Publicando...' : 'Publicar Opinión'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* List of Reviews */}
              <div className="space-y-3">
                <h3 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider">
                  Comentarios y Opiniones ({reviews.length})
                </h3>

                {reviews.length === 0 ? (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-2">
                    <Star className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-xs font-bold text-slate-600">
                      Aún no hay opiniones registradas para este vendedor.
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Si realizaste un acuerdo o consulta con {seller.name}, podés ser el primero en dejar tu experiencia.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="bg-white border border-slate-200 p-4 rounded-2xl space-y-2.5 shadow-2xs hover:border-slate-300 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={rev.buyerAvatar}
                              alt={rev.buyerName}
                              className="w-10 h-10 rounded-full object-cover border border-slate-200"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-extrabold text-xs text-slate-900">{rev.buyerName}</h4>
                                {rev.verifiedPurchase && (
                                  <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    <span>Compra / Servicio Verificado</span>
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400 font-medium">{rev.date}</span>
                            </div>
                          </div>

                          <div className="flex text-amber-400 shrink-0">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= rev.rating
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'fill-slate-200 text-slate-200'
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        {rev.listingTitle && (
                          <div className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 inline-block">
                            📦 Artículo / Servicio: {rev.listingTitle}
                          </div>
                        )}

                        <p className="text-xs text-slate-700 leading-relaxed font-normal bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                          "{rev.comment}"
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PUBLICACIONES DEL VENDEDOR */}
          {activeTab === 'listings' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider">
                  Artículos y Servicios Publicados por {seller.name} ({sellerListings.length})
                </h3>
              </div>

              {sellerListings.length === 0 ? (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-2">
                  <Package className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs font-bold text-slate-600">
                    Este vendedor no tiene publicaciones activas en este momento.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {sellerListings.map((listing) => (
                    <div
                      key={listing.id}
                      onClick={() => {
                        if (onSelectListing) {
                          onSelectListing(listing);
                          onClose();
                        }
                      }}
                      className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-blue-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                    >
                      <div className="relative aspect-16/9 bg-slate-100 overflow-hidden">
                        <img
                          src={listing.images[0]}
                          alt={listing.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                          {listing.category}
                        </span>
                      </div>

                      <div className="p-3 space-y-1.5 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-xs text-slate-900 line-clamp-2 group-hover:text-blue-700 transition-colors">
                            {listing.title}
                          </h4>
                          <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
                            {listing.neighborhood}, {listing.city}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          <span className="font-black text-sm text-blue-700">
                            ${listing.price.toLocaleString('es-AR')}
                          </span>
                          <span className="text-[10px] font-bold text-blue-600 group-hover:underline">
                            Ver detalle →
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: REPUTACIÓN E INFORMACIÓN DE SEGURIDAD */}
          {activeTab === 'info' && (
            <div className="space-y-4 text-xs">
              <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-4 shadow-md">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <h3 className="font-extrabold text-sm text-white">
                    Panel de Reputación y Verificación NEXORA
                  </h3>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {seller.bio ||
                    `${seller.name} es un usuario registrado en Santiago del Estero. Su reputación es calculada en tiempo real mediante transacciones completadas, velocidad de respuesta y valoraciones de compradores.`}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <div className="text-xl font-black text-amber-400">{seller.trustIndex.score}/100</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Índice Confianza</div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <div className="text-xl font-black text-emerald-400">{seller.trustIndex.totalSales}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Ventas / Trabajos</div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <div className="text-xl font-black text-sky-400">{seller.trustIndex.completedOpsRate}%</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Concreción</div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <div className="text-xl font-black text-purple-400">~{seller.trustIndex.avgResponseTimeMin}m</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Tiempo Resp.</div>
                  </div>
                </div>
              </div>

              {/* Verificaciones Checklist */}
              <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-3">
                <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  <span>Verificaciones de Identidad y Contacto</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-2">
                    <CheckCircle2 className={`w-4 h-4 ${seller.trustIndex.verifiedPhone ? 'text-emerald-600' : 'text-slate-300'}`} />
                    <div>
                      <div className="font-bold text-slate-800 text-[11px]">Teléfono Validado</div>
                      <div className="text-[10px] text-slate-500">{seller.trustIndex.verifiedPhone ? 'SMS / WhatsApp Verificado' : 'Pendiente'}</div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-2">
                    <CheckCircle2 className={`w-4 h-4 ${seller.trustIndex.verifiedEmail ? 'text-emerald-600' : 'text-slate-300'}`} />
                    <div>
                      <div className="font-bold text-slate-800 text-[11px]">Email Verificado</div>
                      <div className="text-[10px] text-slate-500">{seller.trustIndex.verifiedEmail ? 'Correo Electrónico Activo' : 'Pendiente'}</div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-2">
                    <CheckCircle2 className={`w-4 h-4 ${seller.trustIndex.verifiedIdentity ? 'text-emerald-600' : 'text-slate-300'}`} />
                    <div>
                      <div className="font-bold text-slate-800 text-[11px]">Identidad DNI / Registro</div>
                      <div className="text-[10px] text-slate-500">{seller.trustIndex.verifiedIdentity ? 'Identidad Oficial Verificada' : 'Pendiente'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        {sellerListings.length > 0 && onStartChatWithSeller && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                onStartChatWithSeller(sellerListings[0]);
                onClose();
              }}
              className="w-full bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-800 hover:to-sky-700 text-white font-black text-xs py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Enviar mensaje directo a {seller.name}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
