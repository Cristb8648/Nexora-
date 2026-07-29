import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Ticket,
  Image as ImageIcon,
  Sparkles,
  CheckCircle2,
  Building2,
  Music,
  Users,
  Instagram,
  Phone,
  AlertCircle
} from 'lucide-react';
import { EventCategory, LocalEvent, UserProfile } from '../types';
import { addEvent } from '../services/storage';

interface PublishEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: (event: LocalEvent) => void;
  currentUser: UserProfile;
}

const EVENT_CATEGORIES: EventCategory[] = [
  'Conciertos y Música',
  'Peñas y Folclore',
  'Boliches y Fiesta',
  'Teatro y Cultura',
  'Gastronomía y Ferias',
  'Deportes',
  'Infantil y Familia',
  'Exposiciones y Nodos',
  'Bares y Restó'
];

const PRESET_LOCATIONS = [
  { name: 'Forum Santiago del Estero', address: 'Av. Perú y Av. Roca', city: 'Santiago del Estero', neighborhood: 'Centro', lat: -27.7801, lng: -64.2628 },
  { name: 'Centro Cultural del Bicentenario (CCB)', address: 'Pellegrini 149', city: 'Santiago del Estero', neighborhood: 'Centro', lat: -27.7877, lng: -64.2597 },
  { name: 'Estadio Único Madre de Ciudades', address: 'Av. Costanera Norte', city: 'Santiago del Estero', neighborhood: 'Costanera', lat: -27.7698, lng: -64.2530 },
  { name: 'Nodo Tecnológico SDE', address: 'Parque Industrial', city: 'La Banda', neighborhood: 'Parque Industrial', lat: -27.7450, lng: -64.2280 },
  { name: 'Parque Aguirre (Anfiteatro / Robledal)', address: 'Av. Costanera y Salta', city: 'Santiago del Estero', neighborhood: 'Parque Aguirre', lat: -27.7812, lng: -64.2505 },
  { name: 'Cine Teatro Renzi', address: 'Av. Besares 151', city: 'La Banda', neighborhood: 'Centro La Banda', lat: -27.7341, lng: -64.2411 },
  { name: 'Studio Club La Banda', address: 'Av. Besares 850', city: 'La Banda', neighborhood: 'Centro La Banda', lat: -27.7325, lng: -64.2438 }
];

const THEME_IMAGES = {
  'Conciertos y Música': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
  'Peñas y Folclore': 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
  'Boliches y Fiesta': 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
  'Teatro y Cultura': 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&auto=format&fit=crop&q=80',
  'Gastronomía y Ferias': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
  'Deportes': 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80',
  'Infantil y Familia': 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
  'Exposiciones y Nodos': 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80',
  'Bares y Restó': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80'
};

export const PublishEventModal: React.FC<PublishEventModalProps> = ({
  isOpen,
  onClose,
  onEventCreated,
  currentUser
}) => {
  if (!isOpen) return null;

  const [isVenue, setIsVenue] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('Conciertos y Música');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Santiago del Estero');
  const [neighborhood, setNeighborhood] = useState('Centro');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('21:00 hs');
  const [isFree, setIsFree] = useState(false);
  const [price, setPrice] = useState<number>(2000);
  const [capacity, setCapacity] = useState<number>(500);
  const [imageUrl, setImageUrl] = useState('');
  const [instagram, setInstagram] = useState('');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [lat, setLat] = useState(-27.7877);
  const [lng, setLng] = useState(-64.2597);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSelectPresetLocation = (loc: typeof PRESET_LOCATIONS[0]) => {
    setLocationName(loc.name);
    setAddress(loc.address);
    setCity(loc.city);
    setNeighborhood(loc.neighborhood);
    setLat(loc.lat);
    setLng(loc.lng);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !locationName.trim() || !description.trim()) {
      alert('Por favor completa el título, lugar y descripción del evento.');
      return;
    }

    const finalImage = imageUrl.trim() || THEME_IMAGES[category] || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80';

    const newEvent = addEvent({
      title,
      description,
      category,
      organizerId: currentUser.id,
      organizerName: currentUser.name,
      organizerAvatar: currentUser.avatarUrl,
      organizerTrustLevel: currentUser.trustIndex.level,
      locationName,
      address: address || locationName,
      city,
      neighborhood,
      lat,
      lng,
      date: isVenue ? 'Permanente' : (date || new Date().toISOString().split('T')[0]),
      time: time || 'A confirmar',
      price: isFree ? 0 : Number(price) || 0,
      isFree,
      images: [finalImage],
      capacity: Number(capacity) || 200,
      availableTickets: isFree ? undefined : Number(capacity) || 200,
      instagramOrWebsite: instagram,
      contactPhone: phone,
      isVenue,
      featured: true,
      venueOpeningHours: isVenue ? time : undefined
    });

    setSuccessMsg(true);
    setTimeout(() => {
      onEventCreated(newEvent);
      onClose();
      setSuccessMsg(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 my-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 text-blue-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Publicar en Santiago del Estero</span>
          </div>
          <h2 className="text-2xl font-black">Publicar Evento o Lugar de Entretenimiento</h2>
          <p className="text-xs text-slate-300 mt-1">
            Llegá a miles de vecinos y turistas. Permite la venta directa de entradas con Custodia Escrow NEXORA 🛡️
          </p>
        </div>

        {successMsg ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-slate-900">¡Evento Publicado Exitosamente!</h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Tu evento ya está visible en el feed y en el mapa interactivo de Santiago del Estero.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            
            {/* Type selector */}
            <div className="grid grid-cols-2 gap-3 bg-slate-100 p-1.5 rounded-2xl">
              <button
                type="button"
                onClick={() => setIsVenue(false)}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  !isVenue ? 'bg-white text-blue-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>Evento Fechado (Fiesta/Recital)</span>
              </button>
              <button
                type="button"
                onClick={() => setIsVenue(true)}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isVenue ? 'bg-white text-blue-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-4 h-4 text-purple-600" />
                <span>Lugar Fijo (Boliche / Restó / Museo)</span>
              </button>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Título del {isVenue ? 'Lugar' : 'Evento'} *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={isVenue ? "ej: Studio Club Boliche La Banda" : "ej: Gran Peña Folclórica de Invierno"}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium"
              />
            </div>

            {/* Category & Capacity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Categoría *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as EventCategory)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium bg-white"
                >
                  {EVENT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Capacidad Estimada (Personas)
                </label>
                <div className="relative">
                  <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Presets Locations in Santiago */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Ubicaciones Frecuentes en Santiago (Click para Autocompletar)
              </label>
              <div className="flex flex-wrap gap-2">
                {PRESET_LOCATIONS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleSelectPresetLocation(preset)}
                    className="text-[11px] font-semibold bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <MapPin className="w-3 h-3 text-blue-500" />
                    <span>{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Location details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nombre del Establecimiento / Lugar *
                </label>
                <input
                  type="text"
                  required
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="ej: Forum Santiago del Estero"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Dirección Exacta
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="ej: Av. Roca y Perú"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Ciudad
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium bg-white"
                >
                  <option value="Santiago del Estero">Santiago del Estero (Capital)</option>
                  <option value="La Banda">La Banda</option>
                  <option value="Termas de Río Hondo">Termas de Río Hondo</option>
                  <option value="Frías">Frías</option>
                  <option value="Añatuya">Añatuya</option>
                  <option value="Clodomira">Clodomira</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Barrio / Zona
                </label>
                <input
                  type="text"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="ej: Centro, Parque Aguirre, Costanera"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium"
                />
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {!isVenue ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Fecha del Evento *
                  </label>
                  <input
                    type="date"
                    required={!isVenue}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium"
                  />
                </div>
              ) : null}

              <div className={isVenue ? 'sm:col-span-2' : ''}>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Horario {isVenue ? 'de Apertura / Atención' : 'de Inicio'} *
                </label>
                <input
                  type="text"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder={isVenue ? "ej: Jueves a Sábados desde las 00:00 hs" : "ej: 21:30 hs"}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium"
                />
              </div>
            </div>

            {/* Pricing & Tickets */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Ticket className="w-4 h-4 text-emerald-600" />
                  Entradas y Costo de Acceso
                </span>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFree}
                    onChange={(e) => setIsFree(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-xs font-bold text-emerald-700">Entrada Libre y Gratuita</span>
                </label>
              </div>

              {!isFree && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Precio por Entrada (ARS $)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    placeholder="ej: 3500"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-bold text-slate-900 bg-white"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    * Los usuarios podrán comprar sus entradas directamente en la plataforma con Protección Escrow.
                  </p>
                </div>
              )}
            </div>

            {/* Image URL & Preview */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Imagen Promocional (URL o Usar Predeterminada)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://o-deja-en-blanco-para-imagen-tematica..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-medium"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Si dejás la URL vacía, se asignará automáticamente una fotografía profesional según la categoría {category}.
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Descripción Detallada *
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detallá artistas invitados, grilla de horarios, promociones en barra, menú gastronómico, código de vestimenta o requerimientos de ingreso..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium"
              />
            </div>

            {/* Social & Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Instagram / Redes
                </label>
                <div className="relative">
                  <Instagram className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="@tu.evento.sde"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Teléfono de Contacto
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+54 385 ..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Submit button */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white text-xs font-black shadow-lg shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Publicar Evento Ahora</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
