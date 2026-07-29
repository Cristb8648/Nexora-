import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Ticket,
  ShieldCheck,
  Share2,
  Phone,
  Instagram,
  Users,
  Navigation,
  Sparkles,
  CheckCircle2,
  Building2,
  Info,
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import { LocalEvent, UserProfile } from '../types';

interface EventDetailModalProps {
  event: LocalEvent | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onBuyTicket: (event: LocalEvent) => void;
  onContactOrganizer?: (event: LocalEvent) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  isOpen,
  onClose,
  currentUser,
  onBuyTicket,
  onContactOrganizer
}) => {
  if (!isOpen || !event) return null;

  const [copiedShare, setCopiedShare] = useState(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `🎉 ¡Mirá este evento en Santiago del Estero!: ${event.title} en ${event.locationName}. Encontrá tus entradas y detalles en NEXORA Argentina.`
      );
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const getGoogleMapsUrl = () => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${event.locationName}, ${event.address}, ${event.city}, Santiago del Estero`
    )}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 my-8">
        
        {/* Banner Header Image */}
        <div className="relative aspect-16/9 bg-slate-900 overflow-hidden">
          <img
            src={event.images[0]}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

          {/* Top Control Bar */}
          <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
            <span className="bg-slate-900/80 text-white text-[11px] font-bold px-3 py-1 rounded-full backdrop-blur-md border border-white/20 flex items-center gap-1.5">
              {event.isVenue ? <Building2 className="w-3.5 h-3.5 text-purple-400" /> : <Calendar className="w-3.5 h-3.5 text-blue-400" />}
              <span>{event.category}</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                className="w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-colors cursor-pointer"
                title="Compartir evento"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Share Toast Feedback */}
          {copiedShare && (
            <div className="absolute top-16 right-4 z-20 bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>¡Enlace copiado al portapapeles!</span>
            </div>
          )}

          {/* Title and Overlay Badges */}
          <div className="absolute bottom-4 inset-x-4 space-y-2 text-white">
            <div className="flex flex-wrap items-center gap-2">
              {event.isFree ? (
                <span className="bg-emerald-500 text-white text-xs font-black px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-md">
                  ENTRADA LIBRE Y GRATUITA
                </span>
              ) : (
                <span className="bg-blue-600 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-md">
                  ${event.price.toLocaleString('es-AR')} por Entrada
                </span>
              )}
              <span className="bg-slate-800/90 text-slate-200 text-xs font-semibold px-2.5 py-1 rounded-lg backdrop-blur-md border border-slate-700">
                📍 {event.city} ({event.neighborhood || 'Santiago'})
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black leading-tight drop-shadow-md">
              {event.title}
            </h1>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          
          {/* Key Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs">
            <div className="flex items-start gap-2.5">
              <div className="p-2 rounded-xl bg-blue-100 text-blue-700 font-bold shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-500 block uppercase text-[10px]">Fecha</span>
                <span className="font-extrabold text-slate-900 text-sm">
                  {event.date === 'Permanente' ? 'Permanente / Abierto Todo el Año' : event.date}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700 font-bold shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-500 block uppercase text-[10px]">Horario</span>
                <span className="font-extrabold text-slate-900 text-sm">{event.time}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 sm:col-span-2 pt-2 border-t border-slate-200/60">
              <div className="p-2 rounded-xl bg-purple-100 text-purple-700 font-bold shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <span className="font-bold text-slate-500 block uppercase text-[10px]">Lugar de Encuentro</span>
                <span className="font-bold text-slate-900 text-sm block">{event.locationName}</span>
                <span className="text-slate-500 block text-xs">{event.address}, {event.city}</span>
              </div>
              <a
                href={getGoogleMapsUrl()}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:border-blue-500 text-blue-700 font-bold text-[11px] flex items-center gap-1 shadow-xs transition-colors cursor-pointer self-center"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Cómo Llegar</span>
              </a>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-2">
              Sobre el Evento / Propuesta
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line font-normal">
              {event.description}
            </p>
          </div>

          {/* Capacity / Available Tickets badge */}
          {event.capacity && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                <div>
                  <span className="font-bold text-emerald-900 block">Capacidad del Lugar</span>
                  <span className="text-emerald-700">{event.capacity.toLocaleString('es-AR')} personas estimadas</span>
                </div>
              </div>

              {event.availableTickets !== undefined && event.availableTickets > 0 && (
                <span className="bg-emerald-600 text-white font-bold px-3 py-1 rounded-full text-[11px]">
                  {event.availableTickets} entradas disponibles
                </span>
              )}
            </div>
          )}

          {/* Organizer Info Box */}
          <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={event.organizerAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                alt={event.organizerName}
                className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
              />
              <div>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">Organizador Oficial</span>
                <h4 className="font-bold text-sm text-white">{event.organizerName}</h4>
                <div className="flex items-center gap-1 text-[11px] text-slate-300 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Nivel {event.organizerTrustLevel || 'Platino'}</span>
                </div>
              </div>
            </div>

            {onContactOrganizer && (
              <button
                type="button"
                onClick={() => onContactOrganizer(event)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <MessageCircle className="w-4 h-4 text-sky-400" />
                <span>Contactar</span>
              </button>
            )}
          </div>

          {/* Socials / Website */}
          {event.instagramOrWebsite && (
            <div className="flex items-center justify-between p-3 bg-slate-100 rounded-xl text-xs text-slate-700">
              <span className="font-semibold flex items-center gap-1.5">
                <Instagram className="w-4 h-4 text-pink-600" /> Redes Sociales del Evento
              </span>
              <span className="font-bold text-blue-700">{event.instagramOrWebsite}</span>
            </div>
          )}

        </div>

        {/* Footer CTA */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-600">
            <span className="font-bold text-slate-800 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Pago Seguro Escrow NEXORA
            </span>
            <span>Entrada digital en QR / PIN único con devolución garantizada.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {!event.isFree ? (
              <button
                type="button"
                onClick={() => onBuyTicket(event)}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-black shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Ticket className="w-4 h-4" />
                <span>Comprar Entrada (${event.price.toLocaleString('es-AR')})</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Entrada Libre - Asistir al Evento</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
