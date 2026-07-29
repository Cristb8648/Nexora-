export type TrustLevel = 'Bronce' | 'Plata' | 'Oro' | 'Platino';

export type ProductStatus = 'Disponible' | 'Reservado' | 'Vendido' | 'Pausado';

export type ProductCategory = 
  | 'Tecnología'
  | 'Vehículos'
  | 'Hogar'
  | 'Servicios'
  | 'Moda'
  | 'Deportes'
  | 'Mascotas'
  | 'Inmuebles'
  | 'Herramientas';

export interface TrustIndex {
  score: number; // 0-100
  level: TrustLevel;
  stars: number; // 1.0 - 5.0
  totalSales: number;
  totalPurchases: number;
  completedOpsRate: number; // percentage
  avgResponseTimeMin: number;
  accountAgeMonths: number;
  verifiedPhone: boolean;
  verifiedEmail: boolean;
  verifiedIdentity: boolean;
  reportsCount: number;
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  avatarUrl: string;
  city: string; // Default: 'Santiago del Estero'
  neighborhood?: string;
  bio?: string;
  registrationDate: string;
  trustIndex: TrustIndex;
  badges: string[]; // e.g., 'Usuario Fundador', 'Cuenta Verificada', 'Vendedor Destacado', 'Responde Rápido'
  isShopOwner?: boolean;
  shopId?: string;
}

export interface ServicePackage {
  id: string;
  title: string;
  price: number;
  description?: string;
  imageUrl?: string;
}

export interface Listing {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  sellerTrustLevel: TrustLevel;
  sellerStars: number;
  title: string;
  description: string;
  price: number;
  currency: 'ARS';
  category: ProductCategory;
  condition: 'Nuevo' | 'Usado' | 'Reacondicionado';
  images: string[];
  city: string;
  neighborhood: string;
  distanceKm: number;
  lat: number;
  lng: number;
  createdAt: string;
  updatedAt?: string;
  status: ProductStatus;
  qualityScore: number; // 0-100
  viewsCount: number;
  favoritesCount: number;
  queriesCount: number;
  featured?: boolean;
  deliveryOption: 'Retiro en persona' | 'Entrega a domicilio' | 'Ambas opciones';
  acceptedPaymentMethods: string[];
  suggestedPriceRange?: { min: number; max: number };
  serviceProfession?: string; // Oficio/Profesión (ej: "Electricista Matriculado", "Pintor & Plomero")
  subServices?: ServicePackage[];
  aiAnalysis?: {
    completeDescription: boolean;
    goodPhotos: boolean;
    fairPrice: boolean;
    quickSeller: boolean;
    tips: string[];
  };
}

export interface Shop {
  id: string;
  ownerId: string;
  name: string;
  logoUrl: string;
  coverUrl: string;
  category: string;
  description: string;
  address: string;
  neighborhood: string;
  city: string;
  hours: string;
  phone: string;
  whatsapp: string;
  isAliadoNexora: boolean;
  stars: number;
  yearsInNexora: number;
  catalogCount: number;
}

export interface DealAgreement {
  agreedPrice: number;
  meetupLocation: string; // e.g., 'Plaza Libertad - Frente a la Catedral (Lugar Seguro)'
  meetupDateTime: string;
  deliveryMode: string;
  confirmedByBuyer: boolean;
  confirmedBySeller: boolean;
  notes?: string;
}

export type NegotiationStage = 
  | 'Consulta' 
  | 'En conversación' 
  | 'Oferta realizada' 
  | 'Oferta aceptada' 
  | 'Encuentro programado' 
  | 'Operación concretada' 
  | 'Cancelada';

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  imageAttachment?: string;
  isDealAgreementCard?: boolean;
}

export interface Conversation {
  id: string;
  listingId: string;
  listingTitle: string;
  listingPrice: number;
  listingImage: string;
  listingStatus: ProductStatus;
  buyerId: string;
  buyerName: string;
  buyerAvatar: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  stage: NegotiationStage;
  dealAgreement?: DealAgreement;
  lastMessageText: string;
  lastMessageTime: string;
  unreadCountBuyer: number;
  unreadCountSeller: number;
}

export interface Review {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerAvatar: string;
  sellerId: string;
  listingId?: string;
  listingTitle?: string;
  rating: number; // 1-5
  comment: string;
  date: string;
  verifiedPurchase?: boolean;
}

export type EscrowStatus = 
  | 'Pendiente'
  | 'En Custodia'
  | 'Liberado'
  | 'En Disputa'
  | 'Reembolsado';

export interface EscrowPayment {
  id: string;
  conversationId?: string;
  listingId: string;
  listingTitle: string;
  listingImage?: string;
  amount: number;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  paymentMethod: 'Tarjeta de Crédito / Débito' | 'Mercado Pago' | 'Transferencia CVU / CBU';
  status: EscrowStatus;
  deliveryPin: string; // 4-digit secret PIN generated for delivery
  createdAt: string;
  autoReleaseAt: string; // 48h deadline
  releasedAt?: string;
  cardMasked?: string;
  disputeReason?: string;
  securityTokenVerified?: boolean;
}

export interface PriceAlert {
  id: string;
  userId: string;
  keyword: string;
  category?: ProductCategory;
  maxPrice?: number;
  maxDistanceKm?: number;
  createdAt: string;
  active: boolean;
  matchesCount: number;
}

export interface ReportItem {
  id: string;
  reporterId: string;
  reporterName: string;
  reportedUserId?: string;
  reportedListingId?: string;
  reportedListingTitle?: string;
  reason: string;
  details: string;
  status: 'Pendiente' | 'En revisión' | 'Resuelto';
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'message' | 'price_drop' | 'alert_match' | 'trust_update' | 'system';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface SafeMeetupSpot {
  name: string;
  address: string;
  neighborhood: string;
  description: string;
  lat: number;
  lng: number;
}

export type EventCategory = 
  | 'Conciertos y Música'
  | 'Peñas y Folclore'
  | 'Boliches y Fiesta'
  | 'Teatro y Cultura'
  | 'Gastronomía y Ferias'
  | 'Deportes'
  | 'Infantil y Familia'
  | 'Exposiciones y Nodos'
  | 'Bares y Restó';

export interface LocalEvent {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  organizerId: string;
  organizerName: string;
  organizerAvatar?: string;
  organizerTrustLevel?: TrustLevel;
  locationName: string; // e.g., "Forum Santiago del Estero", "Estadio Madre de Ciudades", "Finca La María"
  address: string;
  city: string; // "Santiago del Estero", "La Banda", "Termas de Río Hondo", etc.
  neighborhood?: string;
  lat: number;
  lng: number;
  date: string; // YYYY-MM-DD or 'Permanente' for fixed venues
  time: string; // e.g. "21:30 hs" or "Jueves a Domingos de 20:00 hs"
  price: number; // 0 if free
  isFree: boolean;
  images: string[];
  capacity?: number;
  availableTickets?: number;
  instagramOrWebsite?: string;
  createdAt: string;
  featured?: boolean;
  isVenue?: boolean; // true if it's a fixed entertainment venue
  venueOpeningHours?: string;
  contactPhone?: string;
}
