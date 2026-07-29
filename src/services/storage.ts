import {
  Listing,
  Shop,
  UserProfile,
  Conversation,
  Message,
  DealAgreement,
  PriceAlert,
  ReportItem,
  AppNotification,
  Review,
  TrustLevel,
  EscrowPayment,
  EscrowStatus,
  LocalEvent
} from '../types';
import {
  INITIAL_LISTINGS,
  MOCK_SHOPS,
  MOCK_USERS,
  CURRENT_USER,
  INITIAL_NOTIFICATIONS,
  INITIAL_ALERTS,
  INITIAL_REVIEWS,
  INITIAL_EVENTS
} from '../data/mockData';

const STORAGE_KEYS = {
  LISTINGS: 'nexora_listings_v1',
  SHOPS: 'nexora_shops_v1',
  USER: 'nexora_current_user_v1',
  CONVERSATIONS: 'nexora_conversations_v1',
  MESSAGES: 'nexora_messages_v1',
  FAVORITES: 'nexora_favorites_v1',
  ALERTS: 'nexora_alerts_v1',
  REPORTS: 'nexora_reports_v1',
  NOTIFICATIONS: 'nexora_notifications_v1',
  REVIEWS: 'nexora_reviews_v1',
  ESCROW_PAYMENTS: 'nexora_escrow_payments_v1',
  EVENTS: 'nexora_events_v1'
};


// Seeding helper
export function initStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.LISTINGS)) {
    localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(INITIAL_LISTINGS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SHOPS)) {
    localStorage.setItem(STORAGE_KEYS.SHOPS, JSON.stringify(MOCK_SHOPS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USER)) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(CURRENT_USER));
  }
  if (!localStorage.getItem(STORAGE_KEYS.FAVORITES)) {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(['prod_1', 'prod_4']));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ALERTS)) {
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(INITIAL_ALERTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CONVERSATIONS)) {
    // Initial sample conversation
    const sampleConv: Conversation[] = [
      {
        id: "conv_1",
        listingId: "prod_1",
        listingTitle: "Bicicleta Mountain Bike Rodado 29 Shimano - Impecable",
        listingPrice: 345000,
        listingImage: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&auto=format&fit=crop&q=80",
        listingStatus: "Disponible",
        buyerId: "user_cristian_1",
        buyerName: "Cristian Bravo",
        buyerAvatar: CURRENT_USER.avatarUrl,
        sellerId: "user_2",
        sellerName: "Mariana Gómez",
        sellerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        stage: "Encuentro programado",
        dealAgreement: {
          agreedPrice: 330000,
          meetupLocation: "Plaza Libertad - Frente a la Catedral (Punto Seguro)",
          meetupDateTime: "Mañana 18:30 hs",
          deliveryMode: "Retiro en persona",
          confirmedByBuyer: true,
          confirmedBySeller: true,
          notes: "Se probó el cambio de marchas y se ajustó el valor por pago al contado."
        },
        lastMessageText: "🤝 Acuerdo Seguro confirmado por ambas partes para mañana a las 18:30 hs en Plaza Libertad.",
        lastMessageTime: "Hoy 17:45",
        unreadCountBuyer: 0,
        unreadCountSeller: 0
      }
    ];
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(sampleConv));
  }
  if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) {
    const sampleMessages: Record<string, Message[]> = {
      "conv_1": [
        {
          id: "m1",
          senderId: "user_cristian_1",
          receiverId: "user_2",
          text: "¡Hola Mariana! ¿Sigue disponible la bicicleta Rodado 29?",
          timestamp: "Ayer 16:10",
          isRead: true
        },
        {
          id: "m2",
          senderId: "user_2",
          receiverId: "user_cristian_1",
          text: "¡Hola Cristian! Sí, sigue disponible. Tiene service recién hecho.",
          timestamp: "Ayer 16:15",
          isRead: true
        },
        {
          id: "m3",
          senderId: "user_cristian_1",
          receiverId: "user_2",
          text: "¿Te sirven $330.000 si la busco mañana por el centro?",
          timestamp: "Hoy 15:00",
          isRead: true
        },
        {
          id: "m4",
          senderId: "user_2",
          receiverId: "user_cristian_1",
          text: "Dale, acepto la oferta. Coordinemos en Plaza Libertad que es Punto Seguro.",
          timestamp: "Hoy 17:30",
          isRead: true
        },
        {
          id: "m5",
          senderId: "user_cristian_1",
          receiverId: "user_2",
          text: "🤝 Acuerdo Seguro confirmado por ambas partes para mañana a las 18:30 hs en Plaza Libertad.",
          timestamp: "Hoy 17:45",
          isRead: true,
          isDealAgreementCard: true
        }
      ]
    };
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(sampleMessages));
  }
}

// Data Getters
export function getListings(): Listing[] {
  initStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.LISTINGS) || '[]');
  } catch (e) {
    return INITIAL_LISTINGS;
  }
}

export function saveListings(listings: Listing[]) {
  localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(listings));
}

export function getCurrentUser(): UserProfile {
  initStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || JSON.stringify(CURRENT_USER));
  } catch (e) {
    return CURRENT_USER;
  }
}

export function saveCurrentUser(user: UserProfile) {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

export function getShops(): Shop[] {
  initStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SHOPS) || '[]');
  } catch (e) {
    return MOCK_SHOPS;
  }
}

export function getFavorites(): string[] {
  initStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES) || '[]');
  } catch (e) {
    return [];
  }
}

export function toggleFavorite(listingId: string): string[] {
  const favs = getFavorites();
  const exists = favs.includes(listingId);
  const updated = exists ? favs.filter(id => id !== listingId) : [...favs, listingId];
  localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));

  // Update favorites count on listing
  const listings = getListings();
  const index = listings.findIndex(l => l.id === listingId);
  if (index >= 0) {
    listings[index].favoritesCount += exists ? -1 : 1;
    saveListings(listings);
  }
  return updated;
}

export function getConversations(): Conversation[] {
  initStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CONVERSATIONS) || '[]');
  } catch (e) {
    return [];
  }
}

export function getMessages(conversationId: string): Message[] {
  initStorage();
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES) || '{}');
    return all[conversationId] || [];
  } catch (e) {
    return [];
  }
}

export function sendMessage(conversationId: string, text: string, imageAttachment?: string, isDealCard?: boolean): Message {
  const user = getCurrentUser();
  const conversations = getConversations();
  const convIndex = conversations.findIndex(c => c.id === conversationId);
  
  if (convIndex === -1) throw new Error("Conversación no encontrada");
  const conv = conversations[convIndex];
  const receiverId = conv.buyerId === user.id ? conv.sellerId : conv.buyerId;

  const newMessage: Message = {
    id: `msg_${Date.now()}`,
    senderId: user.id,
    receiverId,
    text,
    timestamp: "Hace un instante",
    isRead: false,
    imageAttachment,
    isDealAgreementCard: isDealCard
  };

  const allMessages = JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES) || '{}');
  const list = allMessages[conversationId] || [];
  list.push(newMessage);
  allMessages[conversationId] = list;
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(allMessages));

  // Update last message in conv
  conv.lastMessageText = text;
  conv.lastMessageTime = "Hace un instante";
  if (user.id === conv.buyerId) {
    conv.unreadCountSeller += 1;
  } else {
    conv.unreadCountBuyer += 1;
  }
  conversations[convIndex] = conv;
  localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));

  return newMessage;
}

export function startOrGetConversation(listing: Listing): Conversation {
  const user = getCurrentUser();
  const conversations = getConversations();
  const existing = conversations.find(c => c.listingId === listing.id && c.buyerId === user.id);

  if (existing) return existing;

  const newConv: Conversation = {
    id: `conv_${Date.now()}`,
    listingId: listing.id,
    listingTitle: listing.title,
    listingPrice: listing.price,
    listingImage: listing.images[0] || '',
    listingStatus: listing.status,
    buyerId: user.id,
    buyerName: user.name,
    buyerAvatar: user.avatarUrl,
    sellerId: listing.sellerId,
    sellerName: listing.sellerName,
    sellerAvatar: listing.sellerAvatar,
    stage: 'Consulta',
    lastMessageText: 'Consulta iniciada...',
    lastMessageTime: 'Ahora',
    unreadCountBuyer: 0,
    unreadCountSeller: 0
  };

  conversations.unshift(newConv);
  localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
  
  // Increment query count on listing
  const listings = getListings();
  const idx = listings.findIndex(l => l.id === listing.id);
  if (idx >= 0) {
    listings[idx].queriesCount += 1;
    saveListings(listings);
  }

  return newConv;
}

export function setDealAgreement(conversationId: string, agreement: DealAgreement) {
  const conversations = getConversations();
  const idx = conversations.findIndex(c => c.id === conversationId);
  if (idx >= 0) {
    conversations[idx].dealAgreement = agreement;
    conversations[idx].stage = 'Encuentro programado';
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));

    // Post automated deal message
    const msgText = `🤝 Acuerdo Seguro Registrado:\n• Precio: $${agreement.agreedPrice.toLocaleString('es-AR')} ARS\n• Punto Seguro: ${agreement.meetupLocation}\n• Fecha/Hora: ${agreement.meetupDateTime}`;
    sendMessage(conversationId, msgText, undefined, true);
  }
}

export function updateNegotiationStage(conversationId: string, stage: Conversation['stage']) {
  const conversations = getConversations();
  const idx = conversations.findIndex(c => c.id === conversationId);
  if (idx >= 0) {
    conversations[idx].stage = stage;
    if (stage === 'Operación concretada') {
      // Mark associated product as Sold
      const listingId = conversations[idx].listingId;
      const listings = getListings();
      const lIdx = listings.findIndex(l => l.id === listingId);
      if (lIdx >= 0) {
        listings[lIdx].status = 'Vendido';
        saveListings(listings);
      }
      conversations[idx].listingStatus = 'Vendido';
    }
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
  }
}

export function addListing(newListingData: Omit<Listing, 'id' | 'createdAt' | 'viewsCount' | 'favoritesCount' | 'queriesCount'>): Listing {
  const listings = getListings();
  const newListing: Listing = {
    ...newListingData,
    id: `prod_${Date.now()}`,
    createdAt: new Date().toISOString(),
    viewsCount: 1,
    favoritesCount: 0,
    queriesCount: 0
  };
  listings.unshift(newListing);
  saveListings(listings);

  // Update user stats
  const user = getCurrentUser();
  user.trustIndex.totalSales += 1;
  saveCurrentUser(user);

  return newListing;
}

export function getNotifications(): AppNotification[] {
  initStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]');
  } catch (e) {
    return INITIAL_NOTIFICATIONS;
  }
}

export function getAlerts(): PriceAlert[] {
  initStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ALERTS) || '[]');
  } catch (e) {
    return INITIAL_ALERTS;
  }
}

export function addPriceAlert(keyword: string, category?: PriceAlert['category'], maxPrice?: number): PriceAlert {
  const alerts = getAlerts();
  const user = getCurrentUser();
  const newAlert: PriceAlert = {
    id: `alert_${Date.now()}`,
    userId: user.id,
    keyword,
    category,
    maxPrice,
    maxDistanceKm: 15,
    createdAt: new Date().toISOString(),
    active: true,
    matchesCount: 1
  };
  alerts.unshift(newAlert);
  localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
  return newAlert;
}

export function getReports(): ReportItem[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.REPORTS) || '[]');
  } catch (e) {
    return [];
  }
}

export function addReport(reason: string, details: string, listingId?: string, listingTitle?: string): ReportItem {
  const reports = getReports();
  const user = getCurrentUser();
  const newReport: ReportItem = {
    id: `rep_${Date.now()}`,
    reporterId: user.id,
    reporterName: user.name,
    reportedListingId: listingId,
    reportedListingTitle: listingTitle,
    reason,
    details,
    status: 'Pendiente',
    createdAt: new Date().toISOString()
  };
  reports.unshift(newReport);
  localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  return newReport;
}

// Calculate Trust Level from Trust Score 0-100
export function calculateTrustLevel(score: number): TrustLevel {
  if (score >= 95) return 'Platino';
  if (score >= 88) return 'Oro';
  if (score >= 75) return 'Plata';
  return 'Bronce';
}

// Review functions
export function getAllReviews(): Review[] {
  initStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || '[]');
  } catch (e) {
    return INITIAL_REVIEWS;
  }
}

export function getReviewsForSeller(sellerId: string): Review[] {
  const all = getAllReviews();
  return all.filter(r => r.sellerId === sellerId);
}

export function addReviewForSeller(reviewData: Omit<Review, 'id' | 'date'>): Review {
  const reviews = getAllReviews();
  const today = new Date().toISOString().split('T')[0];
  const newReview: Review = {
    ...reviewData,
    id: `rev_${Date.now()}`,
    date: today
  };
  reviews.unshift(newReview);
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  return newReview;
}

export function getSellerProfile(sellerId: string, fallbackName?: string, fallbackAvatar?: string, fallbackTrustLevel?: TrustLevel, fallbackStars?: number): UserProfile {
  if (MOCK_USERS[sellerId]) {
    return MOCK_USERS[sellerId];
  }
  const currUser = getCurrentUser();
  if (sellerId === currUser.id) {
    return currUser;
  }
  
  // Return fallback synthetic UserProfile if not in MOCK_USERS
  return {
    id: sellerId,
    name: fallbackName || 'Vendedor Verificado',
    username: (fallbackName || 'vendedor').toLowerCase().replace(/\s+/g, '_'),
    email: 'contacto.vendedor@nexora.com',
    phone: '+54 385 400 1234',
    avatarUrl: fallbackAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    city: 'Santiago del Estero',
    neighborhood: 'Centro',
    bio: 'Prestador / Vendedor registrado en NEXORA Santiago del Estero. Comprometido con la atención transparente y veloz.',
    registrationDate: '2026-03-10',
    trustIndex: {
      score: 92,
      level: fallbackTrustLevel || 'Oro',
      stars: fallbackStars || 4.8,
      totalSales: 18,
      totalPurchases: 6,
      completedOpsRate: 98,
      avgResponseTimeMin: 15,
      accountAgeMonths: 6,
      verifiedPhone: true,
      verifiedEmail: true,
      verifiedIdentity: true,
      reportsCount: 0
    },
    badges: ['Cuenta Verificada', 'Vendedor Destacado', 'Responde Rápido']
  };
}

// ==========================================
// ESCROW & PAGO SEGURO MANAGEMENT
// ==========================================

export function getAllEscrowPayments(): EscrowPayment[] {
  initStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ESCROW_PAYMENTS);
    if (!raw) return [];
    const list: EscrowPayment[] = JSON.parse(raw);
    
    // Auto-release check for expired escrow periods
    const now = new Date().getTime();
    let updated = false;
    const processed = list.map(item => {
      if (item.status === 'En Custodia' && item.autoReleaseAt) {
        const releaseTime = new Date(item.autoReleaseAt).getTime();
        if (now >= releaseTime) {
          updated = true;
          return {
            ...item,
            status: 'Liberado' as EscrowStatus,
            releasedAt: new Date().toISOString().split('T')[0]
          };
        }
      }
      return item;
    });

    if (updated) {
      localStorage.setItem(STORAGE_KEYS.ESCROW_PAYMENTS, JSON.stringify(processed));
    }
    return processed;
  } catch (e) {
    return [];
  }
}

export function getEscrowPaymentByListing(listingId: string, buyerId?: string): EscrowPayment | undefined {
  const all = getAllEscrowPayments();
  return all.find(p => p.listingId === listingId && (!buyerId || p.buyerId === buyerId));
}

export function getEscrowPaymentByConversation(conversationId: string): EscrowPayment | undefined {
  const all = getAllEscrowPayments();
  return all.find(p => p.conversationId === conversationId);
}

export function createEscrowPayment(data: {
  listingId: string;
  listingTitle: string;
  listingImage?: string;
  amount: number;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  paymentMethod: 'Tarjeta de Crédito / Débito' | 'Mercado Pago' | 'Transferencia CVU / CBU';
  conversationId?: string;
  cardMasked?: string;
}): EscrowPayment {
  const all = getAllEscrowPayments();
  
  // Generate a secret 4-digit PIN for safe delivery handoff
  const pin = Math.floor(1000 + Math.random() * 9000).toString();
  
  // Auto release date: 48 hours from now
  const autoReleaseDate = new Date();
  autoReleaseDate.setHours(autoReleaseDate.getHours() + 48);

  const newPayment: EscrowPayment = {
    id: `escrow_${Date.now()}`,
    conversationId: data.conversationId,
    listingId: data.listingId,
    listingTitle: data.listingTitle,
    listingImage: data.listingImage,
    amount: data.amount,
    buyerId: data.buyerId,
    buyerName: data.buyerName,
    sellerId: data.sellerId,
    sellerName: data.sellerName,
    paymentMethod: data.paymentMethod,
    status: 'En Custodia',
    deliveryPin: pin,
    createdAt: new Date().toISOString(),
    autoReleaseAt: autoReleaseDate.toISOString(),
    cardMasked: data.cardMasked || '•••• •••• •••• 4892',
    securityTokenVerified: true
  };

  all.unshift(newPayment);
  localStorage.setItem(STORAGE_KEYS.ESCROW_PAYMENTS, JSON.stringify(all));

  // Also send an app notification to seller
  const notificationsRaw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]';
  try {
    const notifications: AppNotification[] = JSON.parse(notificationsRaw);
    notifications.unshift({
      id: `notif_${Date.now()}`,
      userId: data.sellerId,
      title: '¡Pago Seguro en Custodia Recibido! 🔒',
      message: `${data.buyerName} pagó $${data.amount.toLocaleString('es-AR')} por "${data.listingTitle}". Los fondos están retenidos en Custodia NEXORA hasta la entrega.`,
      type: 'trust_update',
      read: false,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  } catch (e) {
    // ignore
  }

  return newPayment;
}

export function releaseEscrowPayment(paymentId: string, inputPin?: string): { success: boolean; message: string; payment?: EscrowPayment } {
  const all = getAllEscrowPayments();
  const index = all.findIndex(p => p.id === paymentId);
  if (index === -1) {
    return { success: false, message: 'No se encontró la transacción de custodia.' };
  }

  const payment = all[index];
  if (payment.status !== 'En Custodia') {
    return { success: false, message: `La transacción ya se encuentra en estado "${payment.status}".` };
  }

  if (inputPin && inputPin.trim() !== payment.deliveryPin) {
    return { success: false, message: 'El PIN de entrega ingresado es incorrecto. Solicitáselo al comprador al momento de entregar el producto.' };
  }

  payment.status = 'Liberado';
  payment.releasedAt = new Date().toISOString().split('T')[0];
  all[index] = payment;
  localStorage.setItem(STORAGE_KEYS.ESCROW_PAYMENTS, JSON.stringify(all));

  // Send notification to both
  try {
    const notificationsRaw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]';
    const notifications: AppNotification[] = JSON.parse(notificationsRaw);
    notifications.unshift({
      id: `notif_${Date.now()}_sel`,
      userId: payment.sellerId,
      title: '¡Dinero Liberado! 💰',
      message: `Los $${payment.amount.toLocaleString('es-AR')} de "${payment.listingTitle}" han sido acreditados en tu cuenta.`,
      type: 'system',
      read: false,
      createdAt: new Date().toISOString()
    });
    notifications.unshift({
      id: `notif_${Date.now()}_buy`,
      userId: payment.buyerId,
      title: 'Entrega Confirmada 📦',
      message: `Has liberado los fondos de "${payment.listingTitle}". Gracias por usar Pago Seguro NEXORA.`,
      type: 'system',
      read: false,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  } catch (e) {
    // ignore
  }

  return { success: true, message: '¡Fondos liberados exitosamente! El dinero ha sido transferido al vendedor.', payment };
}

export function disputeEscrowPayment(paymentId: string, reason: string): { success: boolean; message: string; payment?: EscrowPayment } {
  const all = getAllEscrowPayments();
  const index = all.findIndex(p => p.id === paymentId);
  if (index === -1) {
    return { success: false, message: 'No se encontró la transacción.' };
  }

  const payment = all[index];
  payment.status = 'En Disputa';
  payment.disputeReason = reason;
  all[index] = payment;
  localStorage.setItem(STORAGE_KEYS.ESCROW_PAYMENTS, JSON.stringify(all));

  return { success: true, message: 'Reclamo abierto. El dinero permanecerá congelado en Custodia NEXORA mientras nuestro equipo de mediación en Santiago del Estero revisa el caso.', payment };
}

// EVENTS MANAGEMENT
export function getEvents(): LocalEvent[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (!data) return INITIAL_EVENTS;
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_EVENTS;
  }
}

export function saveEvents(events: LocalEvent[]) {
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
}

export function addEvent(newEvent: Omit<LocalEvent, 'id' | 'createdAt'>): LocalEvent {
  const events = getEvents();
  const event: LocalEvent = {
    ...newEvent,
    id: `evt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date().toISOString()
  };
  events.unshift(event);
  saveEvents(events);
  return event;
}

