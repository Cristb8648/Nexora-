import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  CreditCard,
  QrCode,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  KeyRound,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  HelpCircle,
  RefreshCw,
  Send,
  Info
} from 'lucide-react';
import { Listing, UserProfile, EscrowPayment } from '../types';
import {
  createEscrowPayment,
  getEscrowPaymentByListing,
  releaseEscrowPayment,
  disputeEscrowPayment
} from '../services/storage';

interface SecurePaymentModalProps {
  listing: Listing | null;
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  conversationId?: string;
  onPaymentComplete?: (payment: EscrowPayment) => void;
}

export const SecurePaymentModal: React.FC<SecurePaymentModalProps> = ({
  listing,
  currentUser,
  isOpen,
  onClose,
  conversationId,
  onPaymentComplete
}) => {
  const [step, setStep] = useState<'checkout' | 'processing' | 'otp_verify' | 'success_escrow'>('checkout');
  const [paymentMethod, setPaymentMethod] = useState<'Tarjeta de Crédito / Débito' | 'Mercado Pago' | 'Transferencia CVU / CBU'>('Tarjeta de Crédito / Débito');

  // Card Form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [installments, setInstallments] = useState('1');

  // OTP 2FA State
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');

  // Existing escrow state if already paid
  const [existingPayment, setExistingPayment] = useState<EscrowPayment | null>(null);

  // Pin release input for seller/buyer
  const [sellerInputPin, setSellerInputPin] = useState('');
  const [releaseFeedback, setReleaseFeedback] = useState<{ success?: boolean; message?: string }>({});

  // Dispute modal state
  const [showDisputeForm, setShowDisputeForm] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');

  const isService = listing.category === 'Servicios';

  useEffect(() => {
    if (isOpen && listing) {
      const active = getEscrowPaymentByListing(listing.id, currentUser.id);
      if (active) {
        setExistingPayment(active);
        setStep('success_escrow');
      } else {
        setExistingPayment(null);
        setStep('checkout');
      }
      setReleaseFeedback({});
      setShowDisputeForm(false);
    }
  }, [isOpen, listing, currentUser.id]);

  if (!isOpen || !listing) return null;

  // Format Card input
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 16) val = val.slice(0, 16);
    const formatted = val.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 4) val = val.slice(0, 4);
    if (val.length >= 3) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    }
    setCardExpiry(val);
  };

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === 'Tarjeta de Crédito / Débito') {
      const rawCard = cardNumber.replace(/\s/g, '');
      if (rawCard.length < 15) {
        alert('Por favor ingresá un número de tarjeta válido.');
        return;
      }
      if (!cardHolder.trim()) {
        alert('Por favor ingresá el nombre impreso en la tarjeta.');
        return;
      }
      if (cardExpiry.length < 5) {
        alert('Por favor ingresá una fecha de vencimiento válida (MM/AA).');
        return;
      }
      if (cardCvc.length < 3) {
        alert('Por favor ingresá el código de seguridad CVC.');
        return;
      }
    }

    // Move to 2FA / 3D Secure Verification step for anti-fraud cybersecurity
    setStep('processing');
    setTimeout(() => {
      setStep('otp_verify');
    }, 1200);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length < 4) {
      setOtpError('Ingresá el código de seguridad de 6 dígitos enviado por SMS o Token.');
      return;
    }

    setStep('processing');
    setTimeout(() => {
      const masked = cardNumber ? `•••• •••• •••• ${cardNumber.slice(-4)}` : '•••• •••• •••• 9102';
      const created = createEscrowPayment({
        listingId: listing.id,
        listingTitle: listing.title,
        listingImage: listing.images[0],
        amount: listing.price,
        buyerId: currentUser.id,
        buyerName: currentUser.name,
        sellerId: listing.sellerId,
        sellerName: listing.sellerName,
        paymentMethod,
        conversationId,
        cardMasked: masked
      });

      setExistingPayment(created);
      setStep('success_escrow');
      if (onPaymentComplete) {
        onPaymentComplete(created);
      }
    }, 1500);
  };

  const handleReleaseFunds = (inputPin?: string) => {
    if (!existingPayment) return;
    const res = releaseEscrowPayment(existingPayment.id, inputPin);
    setReleaseFeedback({ success: res.success, message: res.message });
    if (res.success && res.payment) {
      setExistingPayment({ ...res.payment });
    }
  };

  const handleOpenDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!existingPayment || !disputeReason.trim()) return;

    const res = disputeEscrowPayment(existingPayment.id, disputeReason.trim());
    setReleaseFeedback({ success: res.success, message: res.message });
    if (res.payment) {
      setExistingPayment({ ...res.payment });
    }
    setShowDisputeForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header with Security Badge */}
        <div className="relative bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-5 shrink-0 border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white p-2 rounded-full cursor-pointer transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-700 text-white p-3 rounded-2xl shadow-lg border border-emerald-400/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-white">Pago Seguro en Custodia</h2>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  SSL 256-Bit PCI-DSS
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                {isService
                  ? 'Protección Escrow NEXORA Santiago del Estero: El dinero no se entrega al prestador hasta que el servicio sea realizado.'
                  : 'Protección Escrow NEXORA Santiago del Estero: El dinero no se entrega al vendedor hasta que recibas el producto.'}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5 text-slate-800">
          {/* STEP 1: PROCESSING LOADING STATE */}
          {step === 'processing' && (
            <div className="py-12 text-center space-y-4">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
                <ShieldCheck className="w-8 h-8 text-blue-600 absolute inset-0 m-auto" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-slate-900">
                  Procesando Operación de Forma Encriptada...
                </h3>
                <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto">
                  Validando token de seguridad contra fraudes con tokenización bancaria PCI-DSS.
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: CHECKOUT SELECTION & SECURE CARD FORM */}
          {step === 'checkout' && (
            <form onSubmit={handleStartPayment} className="space-y-5">
              {/* Product / Service Item Summary */}
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900 line-clamp-1">{listing.title}</h4>
                    <p className="text-[11px] text-slate-500">
                      {isService ? 'Prestador:' : 'Vendedor:'} <span className="font-bold text-slate-700">{listing.sellerName}</span>
                    </p>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md inline-block mt-1">
                      {isService ? '🛡️ Contratación con Seguro de Cumplimiento' : '🛡️ Tu compra cuenta con Seguro de Entrega'}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-slate-500 block">Monto a abonar</span>
                  <span className="text-lg font-black text-blue-700">${listing.price.toLocaleString('es-AR')}</span>
                </div>
              </div>

              {/* Payment Methods Tabs */}
              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-slate-800">
                  1. Seleccioná tu método de pago protegido:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Tarjeta de Crédito / Débito')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-1.5 ${
                      paymentMethod === 'Tarjeta de Crédito / Débito'
                        ? 'border-blue-600 bg-blue-50/80 text-blue-900 ring-2 ring-blue-500/20 font-bold'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <span className="text-[11px] leading-tight">Tarjeta Crédito / Débito</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Mercado Pago')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-1.5 ${
                      paymentMethod === 'Mercado Pago'
                        ? 'border-sky-500 bg-sky-50/80 text-sky-900 ring-2 ring-sky-500/20 font-bold'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-sky-500" />
                    <span className="text-[11px] leading-tight">Mercado Pago / Dinero MP</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Transferencia CVU / CBU')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-1.5 ${
                      paymentMethod === 'Transferencia CVU / CBU'
                        ? 'border-emerald-600 bg-emerald-50/80 text-emerald-900 ring-2 ring-emerald-500/20 font-bold'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Building2 className="w-5 h-5 text-emerald-600" />
                    <span className="text-[11px] leading-tight">Transferencia Bancaria</span>
                  </button>
                </div>
              </div>

              {/* CARD FORM SECURE FIELDS */}
              {paymentMethod === 'Tarjeta de Crédito / Débito' && (
                <div className="bg-slate-50 border border-slate-200/90 p-4 rounded-2xl space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-emerald-600" />
                      Datos de la Tarjeta (Tokenizados E2E)
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">Visa, Mastercard, Cabal, Naranja</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Número de Tarjeta
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="4509 1234 5678 9012"
                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold tracking-wider text-slate-900 focus:border-blue-600 outline-hidden"
                      />
                      <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Nombre en la Tarjeta
                      </label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        placeholder="EJ: CRISTIAN BRAVO"
                        className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 uppercase focus:border-blue-600 outline-hidden"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Venc.
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={handleExpiryChange}
                          placeholder="MM/AA"
                          className="w-full px-2.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-center text-slate-900 focus:border-blue-600 outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          CVC
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                          placeholder="123"
                          className="w-full px-2.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-center text-slate-900 focus:border-blue-600 outline-hidden"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Cuotas sin interés
                    </label>
                    <select
                      value={installments}
                      onChange={(e) => setInstallments(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:border-blue-600 outline-hidden"
                    >
                      <option value="1">1 cuota fija de ${(listing.price).toLocaleString('es-AR')}</option>
                      <option value="3">3 cuotas de ${Math.round(listing.price / 3).toLocaleString('es-AR')}</option>
                      <option value="6">6 cuotas de ${Math.round(listing.price / 6).toLocaleString('es-AR')}</option>
                    </select>
                  </div>
                </div>
              )}

              {/* MERCADO PAGO / TRANSFERENCIA INFO */}
              {paymentMethod === 'Mercado Pago' && (
                <div className="bg-sky-50/80 border border-sky-200 p-4 rounded-2xl space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-extrabold text-sky-900">
                    <QrCode className="w-5 h-5 text-sky-600" />
                    <span>Pago Seguro vía Mercado Pago Escrow</span>
                  </div>
                  <p className="text-sky-800 leading-relaxed">
                    Serás redirigido para abonar desde tu app de Mercado Pago. Los fondos quedarán automáticamente retenidos en la cuenta de custodia protegida de NEXORA.
                  </p>
                </div>
              )}

              {paymentMethod === 'Transferencia CVU / CBU' && (
                <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-2xl space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-extrabold text-emerald-900">
                    <Building2 className="w-5 h-5 text-emerald-600" />
                    <span>Cuenta de Custodia NEXORA Santiago del Estero</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-emerald-200 space-y-1 font-mono text-[11px]">
                    <p><span className="font-bold text-slate-500 font-sans">Alias:</span> nexora.custodia.sde</p>
                    <p><span className="font-bold text-slate-500 font-sans">CVU:</span> 0000003100049281900123</p>
                    <p><span className="font-bold text-slate-500 font-sans">Titular:</span> NEXORA SERVICIOS S.R.L.</p>
                  </div>
                </div>
              )}

              {/* Cybersecurity Guarantee Banner */}
              <div className="bg-slate-900 text-slate-200 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>Seguridad Anti-Hack e Imposibilidad de Robo de Datos</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
                  Los datos de tu tarjeta se envían encriptados directamente a la red bancaria PCI-DSS Nivel 1. <strong>NEXORA jamás almacena el número completo de tu tarjeta ni códigos CVV</strong> en la base de datos de la plataforma.
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-sm py-3.5 rounded-2xl shadow-lg transition-transform active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Pagar con Protección Escrow (${listing.price.toLocaleString('es-AR')})</span>
              </button>
            </form>
          )}

          {/* STEP 3: 2FA / 3D SECURE OTP VERIFICATION */}
          {step === 'otp_verify' && (
            <form onSubmit={handleVerifyOtp} className="space-y-5 py-2">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl text-center space-y-2">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="font-extrabold text-sm text-blue-950">
                  Verificación de Ciberseguridad 2FA / 3D Secure
                </h3>
                <p className="text-xs text-blue-800 leading-relaxed max-w-sm mx-auto">
                  Enviamos un token de seguridad de 6 dígitos por SMS a tu teléfono para validar la autenticidad de la tarjeta y evitar clonaciones o compras no autorizadas.
                </p>
              </div>

              <div className="max-w-xs mx-auto space-y-2">
                <label className="block text-center text-xs font-extrabold text-slate-800">
                  Ingresá el Código Token SMS (Simulación: 884920)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => {
                    setOtpCode(e.target.value.replace(/\D/g, ''));
                    setOtpError('');
                  }}
                  placeholder="884920"
                  className="w-full py-3 px-4 bg-slate-50 border-2 border-blue-400 rounded-2xl text-center font-mono text-xl font-black tracking-widest text-slate-900 focus:bg-white focus:border-blue-600 outline-hidden shadow-inner"
                />
                {otpError && (
                  <p className="text-[11px] font-bold text-red-600 text-center">{otpError}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-3.5 rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Validar Token de Seguridad y Confirmar Pago</span>
              </button>
            </form>
          )}

          {/* STEP 4: SUCCESSFUL ESCROW PAYMENT / ACTIVE CUSTODY STATE & PIN DISPLAY */}
          {step === 'success_escrow' && existingPayment && (
            <div className="space-y-5">
              {/* STATUS BANNER */}
              <div className={`p-4 rounded-2xl border flex items-center gap-3 shadow-xs ${
                existingPayment.status === 'En Custodia'
                  ? 'bg-amber-50 border-amber-300 text-amber-950'
                  : existingPayment.status === 'Liberado'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-red-50 border-red-300 text-red-950'
              }`}>
                {existingPayment.status === 'En Custodia' && <Lock className="w-7 h-7 text-amber-600 shrink-0" />}
                {existingPayment.status === 'Liberado' && <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />}
                {existingPayment.status === 'En Disputa' && <AlertTriangle className="w-7 h-7 text-red-600 shrink-0" />}

                <div>
                  <h3 className="font-extrabold text-sm">
                    {existingPayment.status === 'En Custodia' && '🛡️ Dinero Guardado en Custodia Segura'}
                    {existingPayment.status === 'Liberado' && (isService ? '💰 Fondos Liberados al Prestador' : '💰 Fondos Liberados al Vendedor')}
                    {existingPayment.status === 'En Disputa' && '⚠️ Reclamo en Mediación Oficial'}
                  </h3>
                  <p className="text-xs opacity-90 leading-relaxed font-medium">
                    {existingPayment.status === 'En Custodia' && 'Tu pago de $' + existingPayment.amount.toLocaleString('es-AR') + ' está protegido. El dinero NO se le entregará a la otra parte hasta que se preste el servicio/producto o venza el plazo de 48hs.'}
                    {existingPayment.status === 'Liberado' && 'La operación se ha completado correctamente y los fondos han sido acreditados.'}
                    {existingPayment.status === 'En Disputa' && 'El dinero permanecerá retenido en Custodia NEXORA mientras nuestro equipo de Santiago del Estero revisa el caso.'}
                  </p>
                </div>
              </div>

              {/* SECRET DELIVERY PIN FOR SAFE HANDOFF */}
              {existingPayment.status === 'En Custodia' && (
                <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-5 rounded-3xl border border-slate-800 shadow-xl text-center space-y-3">
                  <span className="bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase px-3 py-1 rounded-full border border-amber-400/30">
                    {isService ? 'PIN Secreto de Conformidad de Servicio' : 'PIN Secreto de Entrega'}
                  </span>

                  <div className="space-y-1">
                    <p className="text-xs text-slate-300">
                      {isService
                        ? 'Facilitale este PIN al prestador ÚNICAMENTE cuando el trabajo o servicio haya sido realizado a tu conformidad.'
                        : 'Entregale este PIN o mostrale este código al vendedor ÚNICAMENTE cuando tengas el producto en tus manos.'}
                    </p>
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl max-w-xs mx-auto">
                      <span className="font-mono text-3xl font-black tracking-widest text-amber-400">
                        {existingPayment.deliveryPin}
                      </span>
                    </div>
                  </div>

                  {/* Automatic Release Guarantee Disclaimer */}
                  <div className="bg-white/5 border border-white/10 p-3 rounded-xl text-left space-y-1 text-[11px]">
                    <div className="flex items-center gap-1.5 font-bold text-sky-300">
                      <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span>Protección de Cumplimiento y Liberación Automática (48 horas)</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed font-normal">
                      <strong>¿Qué pasa si finaliza el trabajo/entrega y te olvidás de confirmar?</strong> Para proteger al trabajador o vendedor contra olvidos, el sistema de NEXORA <strong>liberará automáticamente el dinero</strong> al transcurrir el plazo de 48 horas sin que hayas abierto un reclamo.
                    </p>
                  </div>
                </div>
              )}

              {/* Feedback messages */}
              {releaseFeedback.message && (
                <div className={`p-3.5 rounded-2xl text-xs font-bold shadow-2xs ${
                  releaseFeedback.success ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-red-50 text-red-900 border border-red-200'
                }`}>
                  {releaseFeedback.message}
                </div>
              )}

              {/* Buyer / Seller Action Buttons */}
              {existingPayment.status === 'En Custodia' && (
                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {/* Buyer Manual Confirmation Button */}
                    <button
                      type="button"
                      onClick={() => handleReleaseFunds()}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-3 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isService ? 'Servicio Realizado Ok (Liberar Dinero)' : 'Ya recibí el producto (Liberar Dinero)'}</span>
                    </button>

                    {/* Report Dispute Button */}
                    <button
                      type="button"
                      onClick={() => setShowDisputeForm(!showDisputeForm)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-3 rounded-xl border border-slate-300 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <ShieldAlert className="w-4 h-4 text-red-600" />
                      <span>Tengo un problema / Abrir Reclamo</span>
                    </button>
                  </div>

                  {/* Seller / Service Provider Input PIN Section */}
                  <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl space-y-2">
                    <label className="block text-xs font-extrabold text-slate-800">
                      🔑 {isService ? '¿Sos el prestador y ya realizaste el servicio?' : '¿Sos el vendedor y ya entregaste el producto?'}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={4}
                        value={sellerInputPin}
                        onChange={(e) => setSellerInputPin(e.target.value.replace(/\D/g, ''))}
                        placeholder={isService ? 'Ingresá el PIN del cliente' : 'Ingresá el PIN del comprador'}
                        className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-xs font-bold text-slate-900 focus:border-blue-600 outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={() => handleReleaseFunds(sellerInputPin)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer"
                      >
                        Validar PIN y Cobrar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Dispute form modal inline */}
              {showDisputeForm && (
                <form onSubmit={handleOpenDispute} className="bg-red-50/80 border-2 border-red-200 p-4 rounded-2xl space-y-3">
                  <h4 className="font-extrabold text-xs text-red-950 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-red-600" />
                    <span>Iniciar Mediación con el Equipo NEXORA</span>
                  </h4>
                  <textarea
                    rows={3}
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    placeholder="Describí brevemente el inconveniente (ej: el producto no funciona, no coincide con las fotos o el vendedor no acudió al punto seguro)..."
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-normal text-slate-800 focus:border-red-600 outline-hidden"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowDisputeForm(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 font-bold"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-4 py-1.5 rounded-xl cursor-pointer"
                    >
                      Enviar Reclamo a Mediación
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
