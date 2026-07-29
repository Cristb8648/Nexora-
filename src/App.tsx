import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DailyQuote } from './components/DailyQuote';
import { HomeTab } from './components/HomeTab';
import { SearchAndMapTab } from './components/SearchAndMapTab';
import { ChatTab } from './components/ChatTab';
import { ShopsTab } from './components/ShopsTab';
import { PublishModal } from './components/PublishModal';
import { ListingDetailModal } from './components/ListingDetailModal';
import { TrustCenterModal } from './components/TrustCenterModal';
import { AIAssistantModal } from './components/AIAssistantModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { NotificationsModal } from './components/NotificationsModal';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { AlertsModal } from './components/AlertsModal';
import { ReportModal } from './components/ReportModal';
import { InstallAppModal } from './components/InstallAppModal';
import { LegalCenterModal } from './components/LegalCenterModal';
import { EventsTab } from './components/EventsTab';
import { SecurePaymentModal } from './components/SecurePaymentModal';
import { NavbarBottom } from './components/NavbarBottom';

import {
  Listing,
  Shop,
  UserProfile,
  ProductCategory,
  AppNotification,
  PriceAlert,
  LocalEvent
} from './types';

import {
  initStorage,
  getListings,
  getShops,
  getCurrentUser,
  getFavorites,
  toggleFavorite,
  getNotifications,
  getAlerts,
  addListing,
  startOrGetConversation,
  sendMessage
} from './services/storage';

export default function App() {
  // Initialization
  useEffect(() => {
    initStorage();
  }, []);

  const [listings, setListings] = useState<Listing[]>(() => getListings());
  const [shops, setShops] = useState<Shop[]>(() => getShops());
  const [user, setUser] = useState<UserProfile>(() => getCurrentUser());
  const [favorites, setFavorites] = useState<string[]>(() => getFavorites());
  const [notifications, setNotifications] = useState<AppNotification[]>(() => getNotifications());
  const [alerts, setAlerts] = useState<PriceAlert[]>(() => getAlerts());

  // Active Main Navigation Tab
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedCity, setSelectedCity] = useState<string>('Santiago del Estero');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active Modals & Overlay Drawers
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [selectedListingDetail, setSelectedListingDetail] = useState<Listing | null>(null);
  const [showTrustModal, setShowTrustModal] = useState(false);
  const [showAIAssistantModal, setShowAIAssistantModal] = useState(false);
  const [showAdminPanelModal, setShowAdminPanelModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showFavoritesDrawer, setShowFavoritesDrawer] = useState(false);
  const [showAlertsModal, setShowAlertsModal] = useState(false);
  const [showInstallAppModal, setShowInstallAppModal] = useState(false);
  const [showLegalCenterModal, setShowLegalCenterModal] = useState(false);
  const [reportingListing, setReportingListing] = useState<Listing | null>(null);
  const [eventListingForPayment, setEventListingForPayment] = useState<Listing | null>(null);

  const [activeConversationId, setActiveConversationId] = useState<string | undefined>();

  // Event Ticket Purchase Handler
  const handleBuyTicketForEvent = (event: LocalEvent) => {
    const tempListing: Listing = {
      id: `ticket_${event.id}`,
      sellerId: event.organizerId,
      sellerName: event.organizerName,
      sellerAvatar: event.organizerAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      sellerTrustLevel: event.organizerTrustLevel || "Platino",
      sellerStars: 5.0,
      title: `Entrada Oficial: ${event.title}`,
      description: `Ticket de acceso digital para ${event.title} en ${event.locationName} (${event.date} - ${event.time}). Válido para 1 persona con código PIN único. Protegido por Custodia Escrow NEXORA Argentina.`,
      price: event.price,
      currency: 'ARS',
      category: 'Servicios',
      condition: 'Nuevo',
      city: event.city || 'Santiago del Estero',
      neighborhood: event.neighborhood || 'Centro',
      distanceKm: 2,
      lat: event.lat || -27.7877,
      lng: event.lng || -64.2597,
      images: event.images,
      status: 'Disponible',
      createdAt: new Date().toISOString(),
      viewsCount: 1,
      favoritesCount: 1,
      queriesCount: 1,
      qualityScore: 100,
      deliveryOption: 'Retiro en persona',
      acceptedPaymentMethods: ['Tarjeta de Crédito / Débito', 'Mercado Pago', 'Transferencia CVU / CBU']
    };
    setEventListingForPayment(tempListing);
  };

  const handleContactOrganizer = (event: LocalEvent) => {
    const tempListing: Listing = {
      id: `evt_chat_${event.id}`,
      sellerId: event.organizerId,
      sellerName: event.organizerName,
      sellerAvatar: event.organizerAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      sellerTrustLevel: event.organizerTrustLevel || "Platino",
      sellerStars: 5.0,
      title: `Consulta Evento: ${event.title}`,
      description: event.description,
      price: event.price,
      currency: 'ARS',
      category: 'Servicios',
      condition: 'Nuevo',
      city: event.city || 'Santiago del Estero',
      neighborhood: event.neighborhood || 'Centro',
      distanceKm: 2,
      lat: event.lat || -27.7877,
      lng: event.lng || -64.2597,
      images: event.images,
      status: 'Disponible',
      createdAt: new Date().toISOString(),
      viewsCount: 1,
      favoritesCount: 1,
      queriesCount: 1,
      qualityScore: 100,
      deliveryOption: 'Retiro en persona',
      acceptedPaymentMethods: ['Tarjeta de Crédito / Débito', 'Mercado Pago', 'Transferencia CVU / CBU']
    };
    handleStartChatWithSeller(tempListing, `👋 Hola! Quisiera consultar sobre el evento "${event.title}" en ${event.locationName}.`);
  };



  // Handlers
  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = toggleFavorite(id);
    setFavorites(updated);
    setListings(getListings());
  };

  const handleSelectCategory = (cat: ProductCategory) => {
    setSearchQuery(cat);
    setActiveTab('search');
  };

  const handleGlobalSearch = (query: string) => {
    setSearchQuery(query);
    setActiveTab('search');
  };

  const handleOpenSearchAndMap = (initialQuery?: string) => {
    if (initialQuery) setSearchQuery(initialQuery);
    setActiveTab('search');
  };

  const handlePublishSuccess = (
    newListingData: Omit<Listing, 'id' | 'createdAt' | 'viewsCount' | 'favoritesCount' | 'queriesCount'>
  ) => {
    const created = addListing(newListingData);
    setListings(getListings());
    setUser(getCurrentUser());
    alert("🎉 ¡Tu publicación ya está disponible en Santiago del Estero!");
  };

  const handleStartChatWithSeller = (listing: Listing, presetMessage?: string) => {
    setSelectedListingDetail(null);
    const conv = startOrGetConversation(listing);
    setActiveConversationId(conv.id);
    if (presetMessage) {
      sendMessage(conv.id, presetMessage);
    }
    setActiveTab('messages');
  };

  const unreadNotifsCount = notifications.filter(n => !n.read).length;
  const favoriteListings = listings.filter(l => favorites.includes(l.id));

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans antialiased flex flex-col selection:bg-blue-200">
      {/* Top Header */}
      <Header
        user={user}
        selectedCity={selectedCity}
        onSelectCity={setSelectedCity}
        unreadNotifsCount={unreadNotifsCount}
        onOpenNotifs={() => setShowNotificationsModal(true)}
        onOpenFavorites={() => setShowFavoritesDrawer(true)}
        onOpenTrustCenter={() => setShowTrustModal(true)}
        onOpenAIAssistant={() => setShowAIAssistantModal(true)}
        onOpenAdminPanel={() => setShowAdminPanelModal(true)}
        onOpenLegalCenter={() => setShowLegalCenterModal(true)}
        onOpenEventsTab={() => setActiveTab('events')}
        onSearchSubmit={handleGlobalSearch}
        activeTab={activeTab}
      />

      {/* Daily Inspirational Quote Bar */}
      <DailyQuote />

      {/* Main View Router Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 pt-4 pb-24">
        {activeTab === 'home' && (
          <HomeTab
            listings={listings}
            shops={shops}
            favorites={favorites}
            onSelectCategory={handleSelectCategory}
            onSelectListing={setSelectedListingDetail}
            onToggleFavorite={handleToggleFavorite}
            onOpenPublish={() => setShowPublishModal(true)}
            onOpenShopsTab={() => setActiveTab('shops')}
            onOpenSearchAndMap={handleOpenSearchAndMap}
          />
        )}

        {activeTab === 'search' && (
          <SearchAndMapTab
            listings={listings}
            favorites={favorites}
            initialSearchQuery={searchQuery}
            onSelectListing={setSelectedListingDetail}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {activeTab === 'events' && (
          <EventsTab
            currentUser={user}
            onOpenSecurePaymentForTicket={handleBuyTicketForEvent}
            onContactOrganizer={handleContactOrganizer}
          />
        )}

        {activeTab === 'messages' && (
          <ChatTab
            currentUser={user}
            activeConversationId={activeConversationId}
            onSelectConversation={setActiveConversationId}
          />
        )}

        {activeTab === 'shops' && (
          <ShopsTab
            shops={shops}
            listings={listings}
            currentUser={user}
            onSelectListing={setSelectedListingDetail}
            onStartChatWithSeller={handleStartChatWithSeller}
          />
        )}

        {activeTab === 'trust' && (
          <div className="max-w-2xl mx-auto py-8">
            <button
              onClick={() => setShowTrustModal(true)}
              className="w-full bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950 text-white p-8 rounded-3xl shadow-2xl text-center space-y-4 hover:scale-[1.01] transition-transform cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center justify-center mx-auto text-2xl font-black">
                {user.trustIndex.score}
              </div>
              <h2 className="text-xl font-black">Nivel de Confianza NEXORA: {user.trustIndex.level}</h2>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Tocá para ver tus verificaciones, reputación, operaciones concretadas e insignias otorgadas por la comunidad.
              </p>
            </button>
          </div>
        )}
      </main>

      {/* Modals & Overlays */}
      <PublishModal
        user={user}
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        onPublishSuccess={handlePublishSuccess}
      />

      <ListingDetailModal
        listing={selectedListingDetail}
        currentUser={user}
        isFavorite={selectedListingDetail ? favorites.includes(selectedListingDetail.id) : false}
        onClose={() => setSelectedListingDetail(null)}
        onToggleFavorite={handleToggleFavorite}
        onStartChatWithSeller={handleStartChatWithSeller}
        onReportListing={(l) => setReportingListing(l)}
      />

      <TrustCenterModal
        user={user}
        isOpen={showTrustModal}
        onClose={() => setShowTrustModal(false)}
      />

      <AIAssistantModal
        isOpen={showAIAssistantModal}
        onClose={() => setShowAIAssistantModal(false)}
      />

      <AdminPanelModal
        isOpen={showAdminPanelModal}
        onClose={() => setShowAdminPanelModal(false)}
        listings={listings}
        currentUser={user}
      />

      <NotificationsModal
        isOpen={showNotificationsModal}
        onClose={() => setShowNotificationsModal(false)}
        notifications={notifications}
      />

      <FavoritesDrawer
        isOpen={showFavoritesDrawer}
        onClose={() => setShowFavoritesDrawer(false)}
        favoritesListings={favoriteListings}
        onSelectListing={(l) => {
          setSelectedListingDetail(l);
          setShowFavoritesDrawer(false);
        }}
        onRemoveFavorite={handleToggleFavorite}
      />

      <AlertsModal
        isOpen={showAlertsModal}
        onClose={() => setShowAlertsModal(false)}
        alerts={alerts}
        onRefreshAlerts={() => setAlerts(getAlerts())}
      />

      <ReportModal
        listing={reportingListing}
        isOpen={!!reportingListing}
        onClose={() => setReportingListing(null)}
      />

      <InstallAppModal
        isOpen={showInstallAppModal}
        onClose={() => setShowInstallAppModal(false)}
      />

      <LegalCenterModal
        isOpen={showLegalCenterModal}
        onClose={() => setShowLegalCenterModal(false)}
        currentUser={user}
      />

      {eventListingForPayment && (
        <SecurePaymentModal
          listing={eventListingForPayment}
          currentUser={user}
          isOpen={!!eventListingForPayment}
          onClose={() => setEventListingForPayment(null)}
          onPaymentComplete={() => {
            alert("🎟️ ¡Felicidades! Tu entrada oficial para el evento ha sido emitida con Custodia Escrow NEXORA. Guardá tu código PIN de acceso.");
            setEventListingForPayment(null);
          }}
        />
      )}

      {/* Footer Legal & Regulatory Compliance Argentina */}

      <footer className="bg-slate-900 text-slate-400 text-xs py-8 px-4 mt-12 mb-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-lg">
                N
              </div>
              <div>
                <span className="text-white font-black text-sm">NEXORA Argentina</span>
                <p className="text-[11px] text-slate-400">Plataforma de Intermediación y Pago Seguro Escrow en Santiago del Estero</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <button
                type="button"
                onClick={() => setShowLegalCenterModal(true)}
                className="hover:text-white transition-colors cursor-pointer underline underline-offset-2"
              >
                Términos y Condiciones
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setShowLegalCenterModal(true)}
                className="hover:text-white transition-colors cursor-pointer underline underline-offset-2"
              >
                Protección de Datos (Ley 25.326)
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setShowLegalCenterModal(true)}
                className="text-rose-400 hover:text-rose-300 font-bold transition-colors cursor-pointer underline underline-offset-2"
              >
                ↩️ Botón de Arrepentimiento (Res. 272/20)
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setShowLegalCenterModal(true)}
                className="hover:text-white transition-colors cursor-pointer underline underline-offset-2"
              >
                AFIP / ARCA F.960/D
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
            <p>© 2026 NEXORA S.R.L. CUIT 30-71894201-9. Todos los derechos reservados. Santiago del Estero, República Argentina.</p>
            <p>Conformidad Ley de Defensa del Consumidor N° 24.240 y Res. Sec. Comercio Interior N° 272/2020.</p>
          </div>
        </div>
      </footer>

      {/* Bottom Floating Navigation */}
      <NavbarBottom
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === 'publish') {
            setShowPublishModal(true);
          } else if (tab === 'trust') {
            setShowTrustModal(true);
          } else {
            setActiveTab(tab);
          }
        }}
        unreadMessagesCount={1}
      />
    </div>
  );
}
