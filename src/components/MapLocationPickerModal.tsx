import React, { useState, useEffect, useRef } from 'react';
import { X, MapPin, Navigation, Check, Search, AlertCircle, ZoomIn, ZoomOut, Compass, Loader2 } from 'lucide-react';
import L from 'leaflet';
import { calculateDistanceKm, findClosestZone, DEFAULT_BUYER_LAT, DEFAULT_BUYER_LNG } from '../utils/distance';

interface MapLocationPickerModalProps {
  isOpen: boolean;
  initialLat?: number;
  initialLng?: number;
  initialNeighborhood?: string;
  onClose: () => void;
  onConfirmLocation: (location: { lat: number; lng: number; neighborhood: string; distanceKm: number }) => void;
}

export const MapLocationPickerModal: React.FC<MapLocationPickerModalProps> = ({
  isOpen,
  initialLat = -27.7877,
  initialLng = -64.2597,
  initialNeighborhood = 'Centro (Plaza Libertad)',
  onClose,
  onConfirmLocation
}) => {
  const [lat, setLat] = useState<number>(initialLat);
  const [lng, setLng] = useState<number>(initialLng);
  const [neighborhood, setNeighborhood] = useState<string>(initialNeighborhood);
  const [isLocatingGPS, setIsLocatingGPS] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  
  // Address search inside Santiago del Estero
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Helper to create clean custom HTML pin icon
  const createMarkerIcon = (label: string) => {
    return L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div style="transform: translate(-50%, -100%); display: flex; flex-direction: column; align-items: center; cursor: grab;">
          <div style="background-color: #1e293b; color: #ffffff; font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); border: 2px solid #3b82f6; white-space: nowrap; margin-bottom: 3px; font-family: sans-serif;">
            📍 ${label || 'Ubicación Vendedor'}
          </div>
          <div style="width: 36px; height: 36px; background: rgba(37, 99, 235, 0.25); border: 2px solid #2563eb; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#e11d48" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3" fill="#ffffff"></circle>
            </svg>
          </div>
        </div>
      `,
      iconSize: [0, 0],
      iconAnchor: [0, 0]
    });
  };

  // Initialize Leaflet Map when modal opens
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    // Cleanup existing instance if re-opening
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const initialCenter: [number, number] = [lat || -27.7877, lng || -64.2597];

    // Create Leaflet Map centered on Santiago del Estero
    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 15,
      minZoom: 11,
      maxZoom: 19,
      zoomControl: false // Custom styled zoom controls added in UI
    });

    // Add OpenStreetMap Tile Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19
    }).addTo(map);

    // Create Draggable Marker
    const marker = L.marker(initialCenter, {
      draggable: true,
      icon: createMarkerIcon(neighborhood)
    }).addTo(map);

    markerRef.current = marker;
    mapInstanceRef.current = map;

    // Handle map click to place pin
    map.on('click', (e: L.LeafletMouseEvent) => {
      const newLat = Math.round(e.latlng.lat * 10000) / 10000;
      const newLng = Math.round(e.latlng.lng * 10000) / 10000;
      
      setLat(newLat);
      setLng(newLng);

      const closest = findClosestZone(newLat, newLng);
      setNeighborhood(closest.name);

      marker.setLatLng([newLat, newLng]);
      marker.setIcon(createMarkerIcon(closest.name));
    });

    // Handle marker drag end
    marker.on('dragend', () => {
      const position = marker.getLatLng();
      const newLat = Math.round(position.lat * 10000) / 10000;
      const newLng = Math.round(position.lng * 10000) / 10000;

      setLat(newLat);
      setLng(newLng);

      const closest = findClosestZone(newLat, newLng);
      setNeighborhood(closest.name);

      marker.setIcon(createMarkerIcon(closest.name));
    });

    // Trigger Leaflet resize calculation after animation/render
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen]);

  // Update marker position and label when state changes
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
      markerRef.current.setIcon(createMarkerIcon(neighborhood));
    }
  }, [lat, lng, neighborhood]);

  if (!isOpen) return null;

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  const handleGetCurrentGPS = () => {
    setIsLocatingGPS(true);
    setGpsError(null);

    if (!navigator.geolocation) {
      setGpsError("Tu navegador no soporta geolocalización GPS.");
      setIsLocatingGPS(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = Math.round(position.coords.latitude * 10000) / 10000;
        const userLng = Math.round(position.coords.longitude * 10000) / 10000;

        setLat(userLat);
        setLng(userLng);

        const closest = findClosestZone(userLat, userLng);
        setNeighborhood(closest.name);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([userLat, userLng], 16);
        }

        setIsLocatingGPS(false);
      },
      (error) => {
        console.warn("GPS error:", error);
        setGpsError("No pudimos obtener tu GPS. Tocá en el mapa para ubicar manualmente.");
        setIsLocatingGPS(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Search address or place via Nominatim OpenStreetMap API
  const handleSearchPlace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchError(null);

    try {
      const formattedQuery = `${searchQuery}, Santiago del Estero, Argentina`;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formattedQuery)}&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const resultLat = parseFloat(data[0].lat);
        const resultLng = parseFloat(data[0].lon);

        const roundLat = Math.round(resultLat * 10000) / 10000;
        const roundLng = Math.round(resultLng * 10000) / 10000;

        setLat(roundLat);
        setLng(roundLng);

        const extractedName = searchQuery.trim();
        setNeighborhood(extractedName);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([roundLat, roundLng], 16);
        }
      } else {
        setSearchError("No se encontró esa dirección. Probá con otra calle o barrio.");
      }
    } catch (err) {
      console.error("Error searching address:", err);
      setSearchError("Error al buscar dirección. Podés ubicar haciendo clic directo en el mapa.");
    } finally {
      setIsSearching(false);
    }
  };

  const distanceKm = calculateDistanceKm(lat, lng, DEFAULT_BUYER_LAT, DEFAULT_BUYER_LNG);

  const handleConfirm = () => {
    onConfirmLocation({
      lat,
      lng,
      neighborhood: neighborhood || 'Santiago del Estero',
      distanceKm
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col space-y-0 text-slate-800 my-auto">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9.5 h-9.5 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
              <MapPin className="w-5 h-5 text-white animate-bounce" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white leading-tight">
                Mapa Real de Santiago del Estero
              </h3>
              <p className="text-[11px] text-slate-300">
                Hacé zoom o arrastrá el pin para ubicar tu casa, negocio o calle exacta
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Address Search Bar & GPS Button */}
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 space-y-2.5">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {/* Search Street / Neighborhood Input */}
            <form onSubmit={handleSearchPlace} className="flex-1 flex items-center gap-1.5 relative">
              <div className="relative flex-1 flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar calle o barrio (Ej: Av. Belgrano, B° Autonomía...)"
                  className="w-full bg-white text-slate-900 text-xs font-semibold rounded-xl pl-9 pr-8 py-2.5 border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden shadow-2xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 text-xs text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full w-5 h-5 flex items-center justify-center font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl shrink-0 cursor-pointer transition-transform active:scale-95 disabled:opacity-50 flex items-center gap-1"
              >
                {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Buscar</span>}
              </button>
            </form>

            {/* GPS Auto-Location Button */}
            <button
              onClick={handleGetCurrentGPS}
              disabled={isLocatingGPS}
              className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-2.5 px-3.5 rounded-xl flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer transition-transform active:scale-95 disabled:opacity-50 shrink-0"
            >
              <Navigation className={`w-4 h-4 ${isLocatingGPS ? 'animate-spin' : ''}`} />
              <span>{isLocatingGPS ? 'GPS...' : '🎯 Mi GPS'}</span>
            </button>
          </div>

          {/* Feedback messages */}
          {gpsError && (
            <div className="bg-amber-50 border border-amber-200 text-amber-900 p-2 rounded-xl text-[11px] flex items-center gap-1.5 font-medium">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{gpsError}</span>
            </div>
          )}

          {searchError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-900 p-2 rounded-xl text-[11px] flex items-center gap-1.5 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{searchError}</span>
            </div>
          )}
        </div>

        {/* Real Leaflet Map Viewport */}
        <div className="relative w-full h-[320px] sm:h-[380px] bg-slate-100">
          <div ref={mapContainerRef} className="w-full h-full z-10" />

          {/* Floating Zoom Controls (+ / -) */}
          <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5 bg-white/95 backdrop-blur-xs p-1 rounded-2xl shadow-lg border border-slate-200">
            <button
              onClick={handleZoomIn}
              className="p-2 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Acercar (Zoom In)"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <div className="h-px bg-slate-200 mx-1"></div>
            <button
              onClick={handleZoomOut}
              className="p-2 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Alejar (Zoom Out)"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
          </div>

          {/* Instructions Overlay pill */}
          <div className="absolute bottom-3 left-3 z-20 bg-slate-900/85 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1.5 rounded-full shadow-lg border border-slate-700 flex items-center gap-1.5 pointer-events-none">
            <Compass className="w-3.5 h-3.5 text-blue-400" />
            <span>Usá dos dedos o la rueda del mouse para hacer zoom y arrastrá el marcador</span>
          </div>
        </div>

        {/* Selected Location Summary & Confirm */}
        <div className="p-4 bg-white border-t border-slate-200 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nombre del Barrio / Zona para mostrar</label>
              <input
                type="text"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder="Ej: B° Belgrano, Centro, etc."
                className="w-full p-2.5 border-2 border-slate-200 focus:border-blue-600 rounded-xl outline-hidden font-extrabold text-slate-900 bg-slate-50 text-xs"
              />
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex flex-col justify-center">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Distancia para los compradores</div>
              <div className="flex items-center justify-between mt-1">
                <span className="font-mono text-[11px] text-slate-600">
                  Lat: {lat.toFixed(4)}, Lng: {lng.toFixed(4)}
                </span>
                <span className="font-extrabold text-blue-800 text-xs bg-blue-100 px-2.5 py-0.5 rounded-full border border-blue-200">
                  📍 A ~{distanceKm} km del Centro
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={onClose}
              className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 rounded-xl cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              className="w-2/3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-3 rounded-xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
            >
              <Check className="w-4 h-4" />
              <span>Confirmar Ubicación Exacta</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
