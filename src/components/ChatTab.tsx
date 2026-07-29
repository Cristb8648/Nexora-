import React, { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  Send,
  ShieldCheck,
  MapPin,
  Calendar,
  DollarSign,
  CheckCircle2,
  X,
  Sparkles,
  ChevronRight,
  Handshake,
  Star,
  PhoneCall,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Conversation, Message, UserProfile, DealAgreement, ProductStatus, NegotiationStage, Listing, EscrowPayment } from '../types';
import {
  getConversations,
  getMessages,
  sendMessage,
  setDealAgreement,
  updateNegotiationStage,
  getCurrentUser,
  getListings,
  getEscrowPaymentByListing
} from '../services/storage';
import { SAFE_MEETUP_SPOTS } from '../data/mockData';
import { SecurePaymentModal } from './SecurePaymentModal';

interface ChatTabProps {
  currentUser: UserProfile;
  activeConversationId?: string;
  onSelectConversation?: (id: string) => void;
}

export const ChatTab: React.FC<ChatTabProps> = ({
  currentUser,
  activeConversationId,
  onSelectConversation
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(activeConversationId || null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  // Deal Agreement Modal
  const [showDealModal, setShowDealModal] = useState(false);
  const [agreedPrice, setAgreedPrice] = useState<number>(0);
  const [meetupSpot, setMeetupSpot] = useState<string>(SAFE_MEETUP_SPOTS[0].name);
  const [meetupTime, setMeetupDateTime] = useState<string>('Mañana 18:00 hs');

  // Secure Payment Modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [activePayment, setActivePayment] = useState<EscrowPayment | null>(null);

  // Rating Modal
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingStars, setRatingStars] = useState<number>(5);
  const [ratingComment, setRatingComment] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConvs();
  }, []);

  useEffect(() => {
    if (activeConversationId) {
      setSelectedConvId(activeConversationId);
    }
  }, [activeConversationId]);

  useEffect(() => {
    if (selectedConvId) {
      const msgs = getMessages(selectedConvId);
      setMessages(msgs);
      const conv = conversations.find(c => c.id === selectedConvId);
      if (conv) {
        setAgreedPrice(conv.dealAgreement?.agreedPrice || conv.listingPrice);
        const esc = getEscrowPaymentByListing(conv.listingId);
        setActivePayment(esc || null);
      }
    }
  }, [selectedConvId, conversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConvs = () => {
    const list = getConversations();
    setConversations(list);
    if (!selectedConvId && list.length > 0) {
      setSelectedConvId(list[0].id);
    }
  };

  const currentConv = conversations.find(c => c.id === selectedConvId);

  const handleSendMessage = (textToSend?: string) => {
    const msgText = textToSend || inputMessage;
    if (!msgText.trim() || !selectedConvId) return;

    sendMessage(selectedConvId, msgText);
    setInputMessage('');
    setMessages(getMessages(selectedConvId));
    loadConvs();
  };

  const handleCreateDealAgreement = () => {
    if (!selectedConvId || !agreedPrice) return;

    const agreement: DealAgreement = {
      agreedPrice,
      meetupLocation: meetupSpot,
      meetupDateTime: meetupTime,
      deliveryMode: 'Retiro en persona',
      confirmedByBuyer: true,
      confirmedBySeller: true
    };

    setDealAgreement(selectedConvId, agreement);
    setShowDealModal(false);
    setMessages(getMessages(selectedConvId));
    loadConvs();
  };

  const handleStageChange = (newStage: NegotiationStage) => {
    if (!selectedConvId) return;
    updateNegotiationStage(selectedConvId, newStage);
    if (newStage === 'Operación concretada') {
      setShowRatingModal(true);
    }
    loadConvs();
  };

  const handleSubmitRating = () => {
    alert("¡Muchas gracias! Tu calificación ha sido registrada en el Índice de Confianza NEXORA.");
    setShowRatingModal(false);
  };

  return (
    <div className="h-[calc(100vh-220px)] min-h-[460px] max-w-6xl mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden flex flex-col md:flex-row mb-6">
      {/* Conversations List Sidebar */}
      <div className={`w-full md:w-80 border-r border-slate-200 flex flex-col ${selectedConvId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h2 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-blue-600" />
            <span>Mensajes ({conversations.length})</span>
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {conversations.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs">
              No tenés conversaciones abiertas aún.
            </div>
          ) : (
            conversations.map((conv) => {
              const isSelected = conv.id === selectedConvId;
              const otherAvatar = currentUser.id === conv.buyerId ? conv.sellerAvatar : conv.buyerAvatar;
              const otherName = currentUser.id === conv.buyerId ? conv.sellerName : conv.buyerName;

              return (
                <button
                  key={conv.id}
                  onClick={() => {
                    setSelectedConvId(conv.id);
                    if (onSelectConversation) onSelectConversation(conv.id);
                  }}
                  className={`w-full p-3.5 text-left transition-colors flex items-start gap-3 cursor-pointer ${
                    isSelected ? 'bg-blue-50/80 border-l-4 border-blue-600' : 'hover:bg-slate-50'
                  }`}
                >
                  <img src={conv.listingImage} alt="" className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold text-xs text-slate-900 truncate">{otherName}</span>
                      <span className="text-[10px] text-slate-400">{conv.lastMessageTime}</span>
                    </div>
                    <p className="text-[11px] font-semibold text-blue-700 truncate">{conv.listingTitle}</p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{conv.lastMessageText}</p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Window */}
      {currentConv ? (
        <div className={`flex-1 flex flex-col bg-slate-50 ${selectedConvId ? 'flex' : 'hidden md:flex'}`}>
          {/* Listing Banner Top Bar */}
          <div className="p-3 bg-white border-b border-slate-200 flex items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                onClick={() => setSelectedConvId(null)}
                className="md:hidden p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg shrink-0 cursor-pointer font-bold text-xs flex items-center gap-1"
                title="Volver a lista de chats"
              >
                <span>←</span>
                <span className="sr-only sm:not-sr-only">Volver</span>
              </button>
              <img src={currentConv.listingImage} alt="" className="w-9 h-9 rounded-lg object-cover shrink-0" />
              <div className="min-w-0">
                <h3 className="font-bold text-xs text-slate-900 truncate">{currentConv.listingTitle}</h3>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className="font-black text-blue-700">${currentConv.listingPrice.toLocaleString('es-AR')}</span>
                  <span className="text-slate-400">•</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                    {currentConv.stage}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action: Create "Acuerdo Seguro" and "Pagar con Custodia" */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setShowPaymentModal(true)}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <ShieldCheck className="w-4 h-4 text-amber-300" />
                <span>Pagar con Custodia 🛡️</span>
              </button>

              <button
                type="button"
                onClick={() => setShowDealModal(true)}
                className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Handshake className="w-4 h-4 text-sky-400" />
                <span className="hidden sm:inline">Acuerdo Seguro</span>
              </button>
            </div>
          </div>

          {/* Active Escrow Status Card in Chat */}
          {activePayment && (
            <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white px-4 py-3 border-b border-blue-500/30 flex items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs">Pago Seguro NEXORA Activo</span>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[9px] font-black px-2 py-0.2 rounded-full">
                      ${activePayment.amount.toLocaleString('es-AR')} • {activePayment.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    PIN Secreto de Entrega: <span className="font-mono font-black text-amber-300">{activePayment.deliveryPin}</span> (Liberación automática en 48hs tras entrega).
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPaymentModal(true)}
                className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-3 py-1.5 rounded-xl border border-white/20 cursor-pointer whitespace-nowrap shrink-0"
              >
                Ver Detalle / Liberar
              </button>
            </div>
          )}

          {/* Chat Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((msg) => {
              const isMe = msg.senderId === currentUser.id;

              if (msg.isDealAgreementCard) {
                return (
                  <div key={msg.id} className="max-w-md mx-auto my-3 bg-gradient-to-r from-slate-900 to-blue-950 text-white p-4 rounded-2xl border border-blue-500/30 shadow-lg space-y-2 text-xs">
                    <div className="flex items-center gap-2 font-bold text-emerald-400">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      <span>🤝 Acuerdo Seguro NEXORA Registrado</span>
                    </div>
                    <p className="text-slate-200 whitespace-pre-line leading-relaxed">{msg.text}</p>
                    <div className="text-[10px] text-slate-400 text-right pt-1">
                      Punto seguro verificado en Santiago del Estero
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs md:max-w-md p-3 rounded-2xl text-xs space-y-1 ${
                      isMe
                        ? 'bg-blue-600 text-white rounded-br-none shadow-xs'
                        : 'bg-white text-slate-900 border border-slate-200 rounded-bl-none shadow-2xs'
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                    <div className={`text-[9px] text-right ${isMe ? 'text-blue-200' : 'text-slate-400'}`}>
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Reply Chips */}
          <div className="p-2 bg-white border-t border-slate-200 flex gap-2 overflow-x-auto text-[11px]">
            {[
              "¿Sigue disponible?",
              "¿Aceptás Mercado Pago?",
              "¿Coordinamos encuentro en Plaza Libertad?",
              "¿Último precio al contado?"
            ].map(chip => (
              <button
                key={chip}
                onClick={() => handleSendMessage(chip)}
                className="bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-medium px-3 py-1 rounded-full whitespace-nowrap cursor-pointer transition-colors border border-slate-200"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Message Input Bar */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Escribí un mensaje seguro..."
              className="flex-1 bg-slate-100 p-2.5 rounded-full text-xs text-slate-900 border border-slate-200 focus:bg-white focus:border-blue-500 outline-hidden"
            />
            <button
              onClick={() => handleSendMessage()}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-full cursor-pointer transition-colors shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-3">
          <MessageCircle className="w-12 h-12 text-slate-300" />
          <p className="font-bold text-slate-700 text-sm">Seleccioná un chat para comenzar a negociar</p>
        </div>
      )}

      {/* Acuerdo Seguro Modal */}
      {showDealModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2 text-emerald-700 font-black text-base">
                <Handshake className="w-5 h-5" />
                <span>Registrar Acuerdo Seguro NEXORA</span>
              </div>
              <button onClick={() => setShowDealModal(false)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Precio Acordado (ARS)</label>
                <input
                  type="number"
                  value={agreedPrice}
                  onChange={(e) => setAgreedPrice(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-black text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Punto Seguro de Encuentro</label>
                <select
                  value={meetupSpot}
                  onChange={(e) => setMeetupSpot(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-medium"
                >
                  {SAFE_MEETUP_SPOTS.map(spot => (
                    <option key={spot.name} value={spot.name}>
                      {spot.name} ({spot.neighborhood})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Fecha y Hora Estimada</label>
                <input
                  type="text"
                  value={meetupTime}
                  onChange={(e) => setMeetupDateTime(e.target.value)}
                  placeholder="Ej: Hoy 18:30 hs"
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-medium"
                />
              </div>
            </div>

            <button
              onClick={handleCreateDealAgreement}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-3 rounded-xl cursor-pointer shadow-md"
            >
              Confirmar & Enviar Acuerdo Seguro
            </button>
          </div>
        </div>
      )}

      {/* Rating / Review Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
              <Star className="w-6 h-6 fill-amber-500" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">¡Operación Concretada!</h3>
            <p className="text-xs text-slate-500">
              Calificá tu experiencia para fortalecer el Índice de Confianza NEXORA.
            </p>

            <div className="flex justify-center gap-2 my-3">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setRatingStars(star)}
                  className="text-2xl cursor-pointer"
                >
                  <Star className={`w-8 h-8 ${star <= ratingStars ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              value={ratingComment}
              onChange={(e) => setRatingComment(e.target.value)}
              placeholder="Escribí tu comentario sobre la atención y el producto..."
              className="w-full p-3 border border-slate-200 rounded-xl text-xs outline-hidden"
            />

            <button
              onClick={handleSubmitRating}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer shadow-md"
            >
              Guardar Calificación
            </button>
          </div>
        </div>
      )}

      {/* Secure Payment Modal */}
      {currentConv && (
        <SecurePaymentModal
          listing={getListings().find(l => l.id === currentConv.listingId) || {
            id: currentConv.listingId,
            sellerId: currentConv.sellerId,
            sellerName: currentConv.sellerName,
            sellerAvatar: currentConv.sellerAvatar,
            sellerTrustLevel: 'Oro',
            sellerStars: 4.8,
            title: currentConv.listingTitle,
            description: 'Producto negociado en el chat de NEXORA.',
            price: currentConv.dealAgreement?.agreedPrice || currentConv.listingPrice,
            currency: 'ARS',
            category: 'Tecnología',
            condition: 'Usado',
            images: [currentConv.listingImage],
            city: 'Santiago del Estero',
            neighborhood: 'Centro',
            distanceKm: 2.5,
            lat: -27.7833,
            lng: -64.2667,
            createdAt: new Date().toISOString(),
            status: 'Disponible',
            qualityScore: 95,
            viewsCount: 120,
            favoritesCount: 15,
            queriesCount: 8,
            deliveryOption: 'Ambas opciones',
            acceptedPaymentMethods: ['Tarjeta de Crédito / Débito', 'Mercado Pago', 'Transferencia CVU / CBU']
          }}
          currentUser={currentUser}
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          conversationId={currentConv.id}
          onPaymentComplete={(payment) => {
            setActivePayment(payment);
            handleSendMessage(`🛡️ He realizado el Pago Seguro en Custodia por $${payment.amount.toLocaleString('es-AR')}. Mi PIN de entrega ha sido generado.`);
          }}
        />
      )}
    </div>
  );
};
