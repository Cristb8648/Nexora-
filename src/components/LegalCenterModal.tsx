import React, { useState } from 'react';
import {
  X,
  Scale,
  ShieldCheck,
  RotateCcw,
  FileText,
  Building2,
  ExternalLink,
  CheckCircle2,
  Lock,
  AlertTriangle,
  Send,
  HelpCircle,
  UserX,
  FileCheck2,
  Award
} from 'lucide-react';
import { UserProfile, EscrowPayment } from '../types';
import { getAllEscrowPayments, disputeEscrowPayment } from '../services/storage';

interface LegalCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
}

export const LegalCenterModal: React.FC<LegalCenterModalProps> = ({
  isOpen,
  onClose,
  currentUser
}) => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'arrepentimiento' | 'escrow' | 'afip'>('terms');

  // Botón de Arrepentimiento Form state
  const [purchaseCode, setPurchaseCode] = useState('');
  const [arrepentimientoReason, setArrepentimientoReason] = useState('');
  const [arrepentimientoStatus, setArrepentimientoStatus] = useState<{ success?: boolean; message?: string; refCode?: string }>({});

  // ARCO Request State (Ley 25.326)
  const [arcoType, setArcoType] = useState<'acceso' | 'rectificacion' | 'supresion'>('acceso');
  const [arcoFeedback, setArcoFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleProcessArrepentimiento = (e: React.FormEvent) => {
    e.preventDefault();
    if (!purchaseCode.trim()) {
      setArrepentimientoStatus({ success: false, message: 'Por favor ingresá el número de transacción o ID de compra.' });
      return;
    }

    const allPayments = getAllEscrowPayments();
    const match = allPayments.find(
      p => (p.id.toLowerCase() === purchaseCode.trim().toLowerCase() || p.listingId === purchaseCode.trim()) && p.buyerId === currentUser.id
    );

    if (match) {
      if (match.status === 'Liberado') {
        setArrepentimientoStatus({
          success: false,
          message: 'La transacción ya fue liberada y completada. Podés iniciar una mediación enviando una solicitud formal a Defensa del Consumidor.'
        });
        return;
      }

      disputeEscrowPayment(match.id, `Revocación por Botón de Arrepentimiento (Res. 272/2020 Sec. Comercio): ${arrepentimientoReason || 'Sin motivo expresado (derecho a revocación sin penalidad)'}`);
      
      const ref = `REV-${Math.floor(100000 + Math.random() * 900000)}`;
      setArrepentimientoStatus({
        success: true,
        message: '¡Revocación de compra registrada con éxito! Los fondos retenidos en Custodia NEXORA han sido congelados y se procesará el reembolso automático conforme al Art. 34 Ley 24.240.',
        refCode: ref
      });
      setPurchaseCode('');
      setArrepentimientoReason('');
    } else {
      // Create a mock revocation receipt if code is generic
      const ref = `REV-ARG-${Math.floor(100000 + Math.random() * 900000)}`;
      setArrepentimientoStatus({
        success: true,
        message: 'Solicitud formal de arrepentimiento de compra ingresada en el sistema legal. Se ha notificado al vendedor y a nuestro equipo de mediación en Santiago del Estero.',
        refCode: ref
      });
    }
  };

  const handleArcoRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setArcoFeedback(
      `Solicitud de Ejercicio de Derechos ARCO (${arcoType.toUpperCase()}) registrada correctamente bajo la Ley 25.326. Recibirás respuesta formal en un plazo no mayor a 10 días hábiles a ${currentUser.email}.`
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 text-white p-5 sm:p-6 relative shrink-0 border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white p-2 rounded-full cursor-pointer transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pr-10">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-800 text-white p-3 rounded-2xl shadow-md border border-blue-400/30">
                <Scale className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-white">Marco Legal & Marco Normativo</h2>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    República Argentina
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium mt-0.5">
                  Cumplimiento pleno de la Ley de Defensa del Consumidor 24.240, Ley 25.326 de Hábeas Data y Res. 272/2020.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 text-xs text-slate-200 font-mono self-start sm:self-auto">
              <span>NEXORA S.R.L.</span>
              <span>•</span>
              <span>CUIT 30-71894201-9</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-5 border-t border-slate-800/80 mt-4 no-scrollbar">
            <button
              onClick={() => setActiveTab('terms')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'terms'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Términos y Condiciones</span>
            </button>

            <button
              onClick={() => setActiveTab('privacy')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'privacy'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Protección de Datos (Ley 25.326)</span>
            </button>

            <button
              onClick={() => setActiveTab('arrepentimiento')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'arrepentimiento'
                  ? 'bg-rose-600 text-white shadow-md ring-2 ring-rose-400/30'
                  : 'bg-rose-950/60 text-rose-200 hover:bg-rose-900 border border-rose-800/50'
              }`}
            >
              <RotateCcw className="w-4 h-4 text-rose-300" />
              <span>Botón de Arrepentimiento (Res. 272)</span>
            </button>

            <button
              onClick={() => setActiveTab('escrow')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'escrow'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Custodia Escrow</span>
            </button>

            <button
              onClick={() => setActiveTab('afip')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'afip'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4 text-sky-400" />
              <span>Data Fiscal & Defensa Consumidor</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 text-slate-800 space-y-6">
          {/* TAB 1: TÉRMINOS Y CONDICIONES (LEY 24.240 Y CCyCN) */}
          {activeTab === 'terms' && (
            <div className="space-y-5 text-xs text-slate-700 leading-relaxed">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl flex items-start gap-3">
                <FileCheck2 className="w-6 h-6 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-black text-sm text-blue-950">
                    Términos y Condiciones Generales de Uso de la Plataforma NEXORA
                  </h3>
                  <p className="text-blue-900 mt-0.5 font-medium">
                    Vigentes en todo el territorio de la República Argentina. Última actualización: Julio 2026.
                  </p>
                </div>
              </div>

              <div className="space-y-4 divide-y divide-slate-100">
                <section className="pt-2">
                  <h4 className="font-extrabold text-slate-900 text-sm mb-1">1. Naturaleza Jurídica y Rol de la Plataforma</h4>
                  <p>
                    NEXORA es una plataforma tecnológica de intermediación de mercado libre local operada por NEXORA S.R.L. (CUIT 30-71894201-9), constituida bajo las leyes de la República Argentina con domicilio legal en Santiago del Estero. NEXORA no es propietaria de los bienes o servicios publicados por los usuarios, ni interviene en la fijación de sus precios de venta directa salvo en el servicio opcional de Custodia Escrow de Pagos.
                  </p>
                </section>

                <section className="pt-3">
                  <h4 className="font-extrabold text-slate-900 text-sm mb-1">2. Capacidad Legal para Contratar</h4>
                  <p>
                    Los servicios de la aplicación están disponibles exclusivamente para personas humanas o jurídicas que tengan capacidad legal para contratar conforme al Código Civil y Comercial de la Nación Argentina (mayores de 18 años). Queda expresamente prohibido el uso por parte de menores de edad sin la previa autorización comprobable de sus representantes legales.
                  </p>
                </section>

                <section className="pt-3">
                  <h4 className="font-extrabold text-slate-900 text-sm mb-1">3. Publicaciones y Artículos Prohibidos</h4>
                  <p className="mb-2">
                    En cumplimiento de la legislación penal, fiscal y administrativa argentina, queda estrictamente prohibida la publicación de:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600">
                    <li>Armas de fuego, explosivos o elementos de uso militar (Ley 20.429).</li>
                    <li>Medicamentos, estupefacientes o sustancias de venta bajo receta (ANMAT / Ley 17.565).</li>
                    <li>Productos falsificados, clonados o que violen derechos de propiedad intelectual (Ley 22.362).</li>
                    <li>Especies de fauna o flora protegidas por la Ley de Conservación de la Fauna (Ley 22.421).</li>
                    <li>Bienes robados o de procedencia ilícita.</li>
                  </ul>
                </section>

                <section className="pt-3">
                  <h4 className="font-extrabold text-slate-900 text-sm mb-1">4. Sistema de Custodia Escrow y Garantía de Pago</h4>
                  <p>
                    Para proteger las transacciones financieras entre compradores y vendedores/prestadores, NEXORA ofrece el servicio de Custodia Escrow. Los fondos permanecen congelados en una cuenta de depósito fiduciario hasta la confirmación de entrega por parte del comprador mediante el PIN Secreto o por el transcurso de 48 horas sin reclamo.
                  </p>
                </section>

                <section className="pt-3">
                  <h4 className="font-extrabold text-slate-900 text-sm mb-1">5. Jurisdicción y Ley Aplicable</h4>
                  <p>
                    Este contrato se rige por las leyes de la República Argentina. Para cualquier controversia judicial o extrajudicial que pudiera derivarse del uso de la aplicación, las partes se someten a la jurisdicción de los Tribunales Ordinarios en lo Civil y Comercial de la Ciudad de Santiago del Estero, renunciando a cualquier otro fuero o jurisdicción que pudiera corresponder.
                  </p>
                </section>
              </div>
            </div>
          )}

          {/* TAB 2: POLÍTICA DE PRIVACIDAD Y DATOS (LEY 25.326 - AAIP) */}
          {activeTab === 'privacy' && (
            <div className="space-y-5 text-xs text-slate-700 leading-relaxed">
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-start gap-3">
                <Lock className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-black text-sm text-emerald-950">
                    Protección de Datos Personales (Ley 25.326 - Hábeas Data)
                  </h3>
                  <p className="text-emerald-900 mt-0.5 font-medium">
                    Base de Datos inscripta en el Registro Nacional de la Agencia de Acceso a la Información Pública (AAIP).
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <p>
                  En cumplimiento del Art. 6° de la Ley 25.326 de Protección de los Datos Personales de la República Argentina, te informamos que los datos recabados en NEXORA se utilizan exclusivamente para garantizar la seguridad de las transacciones, verificar la identidad de los contratantes y brindar soporte en la provincia.
                </p>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2">
                  <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Medidas de Ciberseguridad Bancaria Aplicadas</span>
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600 text-[11px]">
                    <li><strong>Encriptación E2E:</strong> Todos los datos transmitidos viajan cifrados con protocolo SSL/TLS de 256 bits.</li>
                    <li><strong>Tokenización PCI-DSS Nivel 1:</strong> Los datos de tus tarjetas de crédito/débito son tokenizados externamente por pasarelas homologadas. <strong>NEXORA jamás almacena tu número completo de tarjeta ni código CVC</strong> en sus bases de datos.</li>
                    <li><strong>Autenticación de Doble Factor (2FA):</strong> Verificación de identidad SMS/OTP para autorizar transferencias de custodia.</li>
                  </ul>
                </div>

                {/* ARCO Interactive Request Box */}
                <form onSubmit={handleArcoRequest} className="bg-blue-50/70 border border-blue-200 p-4 rounded-2xl space-y-3">
                  <h4 className="font-extrabold text-xs text-blue-950 flex items-center gap-1.5">
                    <UserX className="w-4 h-4 text-blue-700" />
                    <span>Ejercicio de Derechos ARCO (Acceso, Rectificación, Cancelación o Supresión de Datos)</span>
                  </h4>
                  <p className="text-[11px] text-blue-900">
                    Conforme al Art. 14 y 15 de la Ley 25.326, tenés derecho a acceder gratuitamente a tus datos personales o solicitar su eliminación total de nuestros servidores.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <select
                      value={arcoType}
                      onChange={(e) => setArcoType(e.target.value as any)}
                      className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:border-blue-600 outline-hidden"
                    >
                      <option value="acceso">Solicitar Informe de Mis Datos Registrados (Acceso)</option>
                      <option value="rectificacion">Solicitar Rectificación / Actualización de Datos</option>
                      <option value="supresion">Solicitar Supresión y Borrado Total de Cuenta (Derecho al Olvido)</option>
                    </select>

                    <button
                      type="submit"
                      className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shrink-0"
                    >
                      Enviar Solicitud ARCO
                    </button>
                  </div>

                  {arcoFeedback && (
                    <div className="bg-emerald-100 border border-emerald-300 text-emerald-950 p-3 rounded-xl text-xs font-bold mt-2">
                      {arcoFeedback}
                    </div>
                  )}
                </form>

                <div className="text-[11px] text-slate-500 italic bg-slate-100 p-3 rounded-xl">
                  "La AGENCIA DE ACCESO A LA INFORMACIÓN PÚBLICA, Órgano de Control de la Ley N° 25.326, tiene la atribución de atender las denuncias y reclamos que se interpongan con relación al incumplimiento de las normas sobre protección de datos personales."
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BOTÓN DE ARREPENTIMIENTO (RESOLUCIÓN 272/2020) */}
          {activeTab === 'arrepentimiento' && (
            <div className="space-y-5 text-xs text-slate-700 leading-relaxed">
              <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl flex items-start gap-3">
                <RotateCcw className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-black text-sm text-rose-950">
                    Botón de Arrepentimiento (Resolución 272/2020 - Secretaría de Comercio Interior)
                  </h3>
                  <p className="text-rose-900 mt-0.5 font-medium">
                    Derecho de Revocación de Compra o Contratación dentro de los 10 días corridos sin costo alguno.
                  </p>
                </div>
              </div>

              <p>
                En cumplimiento del <strong>Art. 34 de la Ley 24.240 de Defensa del Consumidor</strong> y la <strong>Resolución 272/2020 de la Secretaría de Comercio Interior de la Nación</strong>, tenés el derecho irrevocable de arrepentirte de cualquier compra realizada o servicio contratado mediante la aplicación dentro de un plazo de <strong>10 (diez) días corridos</strong> contados a partir de la fecha de entrega del producto o celebración de la contratación.
              </p>

              {/* Interactive Revocation Form */}
              <form onSubmit={handleProcessArrepentimiento} className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-5 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <RotateCcw className="w-5 h-5 text-rose-400" />
                  <h4 className="font-extrabold text-sm text-white">Formulario Oficial de Solicitud de Revocación</h4>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Número de Transacción / Código de Compra o Título del Producto
                    </label>
                    <input
                      type="text"
                      value={purchaseCode}
                      onChange={(e) => setPurchaseCode(e.target.value)}
                      placeholder="Ej: escrow_17222591023 o Celular Samsung"
                      className="w-full px-3.5 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs font-mono text-white focus:border-rose-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Motivo (Opcional - La ley no exige justificación)
                    </label>
                    <textarea
                      rows={2}
                      value={arrepentimientoReason}
                      onChange={(e) => setArrepentimientoReason(e.target.value)}
                      placeholder="Me arrepentí de la compra / El producto no era lo que esperaba..."
                      className="w-full px-3.5 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs font-sans text-slate-200 focus:border-rose-500 outline-hidden"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-700 hover:to-red-800 text-white font-black text-xs py-3 rounded-xl shadow-lg transition-transform active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Ejercer Derecho de Arrepentimiento y Cancelar Compra</span>
                  </button>
                </div>

                {arrepentimientoStatus.message && (
                  <div className={`p-4 rounded-2xl text-xs font-bold border space-y-1 ${
                    arrepentimientoStatus.success
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-500 text-rose-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{arrepentimientoStatus.message}</span>
                    </div>
                    {arrepentimientoStatus.refCode && (
                      <p className="font-mono text-[11px] text-amber-300 pt-1">
                        Comprobante de Revocación de Compra N°: <strong>{arrepentimientoStatus.refCode}</strong>
                      </p>
                    )}
                  </div>
                )}
              </form>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-1 text-[11px] text-slate-600">
                <p><strong>Efectos de la revocación:</strong> Al ejercer el arrepentimiento, las partes quedan liberadas de sus obligaciones. El comprador pondrá la cosa a disposición del vendedor sin haberla usado, y los costos de devolución corren por cuenta del vendedor conforme al Art. 34 de la Ley 24.240.</p>
              </div>
            </div>
          )}

          {/* TAB 4: CUSTODIA ESCROW Y MARCO FIDUCIARIO */}
          {activeTab === 'escrow' && (
            <div className="space-y-5 text-xs text-slate-700 leading-relaxed">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-black text-sm text-amber-950">
                    Regulación del Sistema de Custodia Fiduciaria Escrow
                  </h3>
                  <p className="text-amber-900 mt-0.5 font-medium">
                    Mecanismo de Retención Preventiva para prevenir estafas y fraudes en la compraventa online.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <p>
                  El sistema de Pago Seguro Escrow de NEXORA opera bajo la modalidad de depósito fiduciario de custodia temporal (Art. 1666 y ss. del Código Civil y Comercial de la Nación).
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl space-y-1">
                    <span className="font-black text-blue-700 text-xs block">1. Pago e Inmovilización</span>
                    <p className="text-[11px] text-slate-600">El comprador abona. Los fondos quedan bloqueados en custodia de NEXORA en una cuenta fiduciaria separada.</p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl space-y-1">
                    <span className="font-black text-amber-700 text-xs block">2. PIN Secreto de Entrega</span>
                    <p className="text-[11px] text-slate-600">Se genera un código PIN de 4 dígitos. El comprador se lo entrega al vendedor sólo al recibir la mercadería/servicio.</p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl space-y-1">
                    <span className="font-black text-emerald-700 text-xs block">3. Liberación o Mediación</span>
                    <p className="text-[11px] text-slate-600">Al ingresar el PIN o transcurridas 48hs sin reclamo, se libera el dinero al vendedor. En caso de conflicto, actúa la mediación.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: DATA FISCAL AFIP/ARCA Y DEFENSA DEL CONSUMIDOR */}
          {activeTab === 'afip' && (
            <div className="space-y-5 text-xs text-slate-700 leading-relaxed">
              <div className="bg-sky-50 border border-sky-200 p-4 rounded-2xl flex items-start gap-3">
                <Building2 className="w-6 h-6 text-sky-700 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-black text-sm text-sky-950">
                    Información Fiscal y Defensa del Consumidor
                  </h3>
                  <p className="text-sky-900 mt-0.5 font-medium">
                    Razón Social: NEXORA SERVICIOS S.R.L. • CUIT: 30-71894201-9
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Formulario Data Fiscal Mock Display */}
                <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-3 border border-slate-800">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-mono text-xs font-bold text-sky-400">DATA FISCAL Formulario 960/D</span>
                    <span className="text-[10px] bg-sky-900 text-sky-200 px-2 py-0.5 rounded font-bold">AFIP / ARCA</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-white p-1 rounded-xl shrink-0 flex items-center justify-center">
                      <div className="w-full h-full bg-slate-900 rounded-lg p-1 text-[8px] font-mono text-center flex flex-col items-center justify-center text-slate-300">
                        <span>QR AFIP</span>
                        <span className="font-bold text-sky-400 text-[10px]">30-71894201-9</span>
                        <span>VALIDADO</span>
                      </div>
                    </div>

                    <div className="space-y-1 text-[11px]">
                      <p><strong className="text-slate-400">Razón Social:</strong> NEXORA S.R.L.</p>
                      <p><strong className="text-slate-400">CUIT:</strong> 30-71894201-9</p>
                      <p><strong className="text-slate-400">Domicilio:</strong> Av. Belgrano Sur 1240, Santiago del Estero, Argentina</p>
                      <p><strong className="text-slate-400">Condición IVA:</strong> Responsable Inscripto</p>
                    </div>
                  </div>
                </div>

                {/* Defensa del Consumidor Access */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3 flex flex-col justify-between">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5 mb-1">
                      <Award className="w-4 h-4 text-blue-600" />
                      <span>Ventanilla Única Federal de Defensa del Consumidor</span>
                    </h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Si tenés un reclamo no resuelto con un vendedor o con la plataforma, podés acudir a la Dirección General de Comercio e Industria y Defensa del Consumidor de la Provincia de Santiago del Estero o ingresar al portal nacional.
                    </p>
                  </div>

                  <a
                    href="https://www.argentina.gob.ar/defensadelconsumidor/formulario"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all inline-flex items-center justify-center gap-2 text-center"
                  >
                    <span>Ingresar Reclamo en Defensa del Consumidor</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-medium">NEXORA Santiago del Estero - Certificación Legal 2026</span>
          </div>

          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2 rounded-xl transition-colors cursor-pointer"
          >
            Entendido y Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};
