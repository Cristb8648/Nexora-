import React, { useState, useRef } from 'react';
import {
  X,
  Sparkles,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Upload,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Tag,
  DollarSign,
  MapPin,
  Navigation,
  Loader2,
  Image as ImageIcon,
  Compass,
  Plus,
  Trash2,
  Briefcase,
  Layers,
  Wrench,
  Package,
  Store,
  Check
} from 'lucide-react';
import { Listing, ProductCategory, UserProfile, ServicePackage } from '../types';
import { callGeminiOptimizeListing, OptimizeListingResponse } from '../services/gemini';
import { MapLocationPickerModal } from './MapLocationPickerModal';
import { calculateDistanceKm, DEFAULT_BUYER_LAT, DEFAULT_BUYER_LNG } from '../utils/distance';

interface PublishModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onPublishSuccess: (newListing: Omit<Listing, 'id' | 'createdAt' | 'viewsCount' | 'favoritesCount' | 'queriesCount'>) => void;
}

export const PublishModal: React.FC<PublishModalProps> = ({
  user,
  isOpen,
  onClose,
  onPublishSuccess
}) => {
  // Mode selection: null (selection screen), 'product', or 'service'
  const [publishType, setPublishType] = useState<'product' | 'service' | null>(null);
  const [step, setStep] = useState<number>(1);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // General Form State
  const [category, setCategory] = useState<ProductCategory>('Tecnología');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [condition, setCondition] = useState<'Nuevo' | 'Usado' | 'Reacondicionado'>('Usado');

  // Service specific state
  const [serviceProfession, setServiceProfession] = useState('Electricista / Mantenimiento');
  const [subServices, setSubServices] = useState<ServicePackage[]>([
    {
      id: 'sub-1',
      title: 'Diagnóstico e Inspección Técnica',
      price: 15000,
      description: 'Revisión técnica en el domicilio para determinar falla o requerimientos.',
      imageUrl: ''
    }
  ]);

  // Location & Payment
  const [neighborhood, setNeighborhood] = useState('Centro (Plaza Libertad)');
  const [lat, setLat] = useState<number>(-27.7877);
  const [lng, setLng] = useState<number>(-64.2597);
  const [distanceKm, setDistanceKm] = useState<number>(1.2);
  const [showMapPickerModal, setShowMapPickerModal] = useState<boolean>(false);
  const [deliveryOption, setDeliveryOption] = useState<'Retiro en persona' | 'Entrega a domicilio' | 'Ambas opciones'>('Ambas opciones');
  const [paymentMethods, setPaymentMethods] = useState<string[]>(['Efectivo', 'Transferencia bancaria', 'Mercado Pago']);
  
  // Custom uploaded images from device or PC for main gallery
  const [images, setImages] = useState<string[]>([]);

  // AI Optimization Result State
  const [aiResult, setAiResult] = useState<OptimizeListingResponse | null>(null);

  // Profession preset pills
  const professionPresets = [
    '⚡ Electricista Matriculado',
    '🚰 Plomero y Gasista',
    '💻 Técnico de PC y Celulares',
    '🎨 Pintor Profesional',
    '🧱 Albañil y Remodelaciones',
    '❄️ Aire Acondicionado / Refrigeración',
    '🚚 Fletes y Mudanzas',
    '🌿 Jardinero y Desmalezado',
    '✂️ Peluquero / Barbería a Domicilio',
    '🧹 Servicio de Limpieza',
    '📚 Clases Particulares'
  ];

  if (!isOpen) return null;

  const handleSelectPublishType = (type: 'product' | 'service') => {
    setPublishType(type);
    setStep(1);
    if (type === 'service') {
      setCategory('Servicios');
    } else {
      setCategory('Tecnología');
    }
  };

  const handleAddSubService = () => {
    const newSub: ServicePackage = {
      id: `sub-${Date.now()}`,
      title: 'Nuevo Trabajo / Servicio',
      price: 20000,
      description: '',
      imageUrl: ''
    };
    setSubServices((prev) => [...prev, newSub]);
  };

  const handleRemoveSubService = (id: string) => {
    setSubServices((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSubServiceChange = (id: string, field: keyof ServicePackage, value: any) => {
    setSubServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleSubServiceImageUpload = (id: string, file: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        handleSubServiceChange(id, 'imageUrl', e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Format price helper
  const formatPriceDisplay = (val: number): string => {
    if (!val || val === 0) return '';
    return new Intl.NumberFormat('es-AR').format(val);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawDigits = e.target.value.replace(/\D/g, '');
    if (!rawDigits) {
      setPrice(0);
    } else {
      const parsed = parseInt(rawDigits.slice(0, 11), 10);
      setPrice(isNaN(parsed) ? 0 : parsed);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setImages((prev) => [...prev, event.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
    e.target.value = '';
  };

  const handleAddSamplePhoto = () => {
    const samples = [
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80"
    ];
    const nextImg = samples[images.length % samples.length];
    setImages([...images, nextImg]);
  };

  const handleAIOptimize = async () => {
    if (!title) {
      alert("Ingresá un título inicial para que NEXORA AI pueda optimizarlo.");
      return;
    }
    setIsOptimizing(true);
    try {
      const result = await callGeminiOptimizeListing({
        title,
        description,
        category,
        price,
        condition
      });
      setAiResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsOptimizing(false);
    }
  };

  const applyAIOptimization = () => {
    if (aiResult) {
      setTitle(aiResult.optimizedTitle);
      setDescription(aiResult.optimizedDescription);
    }
  };

  const handleFinalPublish = () => {
    let finalTitle = title.trim();
    let finalDescription = description.trim();
    let finalPrice = price;
    let finalImages = [...images];

    if (publishType === 'service') {
      if (!finalTitle) {
        finalTitle = serviceProfession ? `Servicio de ${serviceProfession}` : 'Servicios Profesionales';
      }

      if (subServices.length > 0) {
        const lowestSubPrice = Math.min(...subServices.map((s) => s.price || 0));
        if (finalPrice === 0) {
          finalPrice = lowestSubPrice;
        }

        if (!finalDescription) {
          const serviceListText = subServices
            .map((s) => `• ${s.title}: $${s.price.toLocaleString('es-AR')}${s.description ? ` (${s.description})` : ''}`)
            .join('\n');
          finalDescription = `Servicio profesional de ${serviceProfession}.\n\nCatálogo de trabajos y tarifas:\n${serviceListText}`;
        }

        if (finalImages.length === 0) {
          const subImages = subServices.map((s) => s.imageUrl).filter(Boolean) as string[];
          if (subImages.length > 0) {
            finalImages = subImages;
          } else {
            // Default placeholder image if no photo uploaded
            finalImages = ["https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&auto=format&fit=crop&q=80"];
          }
        }
      }
    } else {
      if (!finalTitle || !finalDescription) {
        alert("Por favor completá el título y la descripción de tu producto.");
        return;
      }
      if (finalImages.length === 0) {
        finalImages = ["https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80"];
      }
    }

    onPublishSuccess({
      sellerId: user.id,
      sellerName: user.name,
      sellerAvatar: user.avatarUrl,
      sellerTrustLevel: user.trustIndex.level,
      sellerStars: user.trustIndex.stars,
      title: finalTitle,
      description: finalDescription,
      price: finalPrice,
      currency: 'ARS',
      category: publishType === 'service' ? 'Servicios' : category,
      condition: publishType === 'service' ? 'Nuevo' : condition,
      images: finalImages,
      city: 'Santiago del Estero',
      neighborhood,
      distanceKm: distanceKm || calculateDistanceKm(lat, lng),
      lat,
      lng,
      status: 'Disponible',
      qualityScore: aiResult ? aiResult.qualityScore : 92,
      deliveryOption: publishType === 'service' ? 'Entrega a domicilio' : deliveryOption,
      acceptedPaymentMethods: paymentMethods,
      suggestedPriceRange: aiResult?.suggestedPriceRange || { min: Math.round(finalPrice * 0.9), max: Math.round(finalPrice * 1.1) },
      serviceProfession: publishType === 'service' ? serviceProfession : undefined,
      subServices: publishType === 'service' ? subServices : undefined,
      aiAnalysis: {
        completeDescription: finalDescription.length > 20,
        goodPhotos: finalImages.length >= 1,
        fairPrice: true,
        quickSeller: true,
        tips: aiResult?.tips || ["Publicación verificada por NEXORA AI."]
      }
    });

    onClose();
  };

  const productCategories: ProductCategory[] = [
    'Tecnología', 'Vehículos', 'Hogar', 'Moda', 'Deportes', 'Mascotas', 'Inmuebles', 'Herramientas'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-sm text-white shadow-md">
              ➕
            </div>
            <div>
              <h2 className="font-extrabold text-base">
                {publishType === 'service'
                  ? 'Publicar un Servicio'
                  : publishType === 'product'
                  ? 'Publicar un Producto'
                  : '¿Qué querés publicar hoy?'}
              </h2>
              <p className="text-xs text-slate-400">
                {publishType ? `Paso ${step} de 4 • Santiago del Estero` : 'Elegí el tipo de publicación para empezar'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {publishType && (
              <button
                type="button"
                onClick={() => setPublishType(null)}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg font-bold border border-slate-700 cursor-pointer transition-colors"
              >
                Cambiar Modo
              </button>
            )}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-full cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Progress Indicator (Only if type selected) */}
        {publishType && (
          <div className="bg-slate-100 h-1.5 w-full flex shrink-0">
            <div
              className="bg-blue-600 h-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
        )}

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6 text-slate-800">
          
          {/* INITIAL SCREEN: SELECT PRODUCT OR SERVICE */}
          {!publishType && (
            <div className="space-y-6 py-4">
              <div className="text-center max-w-md mx-auto space-y-2">
                <span className="bg-blue-100 text-blue-800 text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  NEXORA Santiago del Estero
                </span>
                <h3 className="text-xl font-black text-slate-900">Elegí la opción que mejor se adapte</h3>
                <p className="text-xs text-slate-500">
                  Definimos los campos ideales para que tu producto o servicio resalte y reciba consultas al instante.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* CHOICE 1: PUBLICAR PRODUCTO */}
                <button
                  type="button"
                  onClick={() => handleSelectPublishType('product')}
                  className="group relative bg-gradient-to-b from-white to-slate-50 hover:to-blue-50/50 border-2 border-slate-200 hover:border-blue-600 rounded-3xl p-6 text-left transition-all duration-200 shadow-md hover:shadow-xl cursor-pointer flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                      <Package className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-lg text-slate-900 group-hover:text-blue-700 transition-colors">
                        📦 Publicar Producto
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1">
                        Para vender artículos físicos: celulares, ropa, muebles, vehículos, repuestos, inmuebles y más.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                    <span>Continuar como Producto</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>

                {/* CHOICE 2: PUBLICAR SERVICIO */}
                <button
                  type="button"
                  onClick={() => handleSelectPublishType('service')}
                  className="group relative bg-gradient-to-b from-slate-900 to-slate-950 text-white border-2 border-slate-800 hover:border-blue-500 rounded-3xl p-6 text-left transition-all duration-200 shadow-xl hover:shadow-2xl cursor-pointer flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-blue-600/30 text-blue-400 border border-blue-400/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                      <Wrench className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1 bg-amber-400/20 text-amber-300 font-extrabold text-[10px] px-2 py-0.5 rounded border border-amber-400/30 mb-1.5">
                        ✨ Tarifario & Oficio Profesional
                      </div>
                      <h4 className="font-extrabold text-lg text-white group-hover:text-blue-400 transition-colors">
                        🛠️ Publicar Servicio
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed mt-1">
                        Para profesionales y oficios: electricidad, plomería, mantenimiento, fletes, barbería, clases y más.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-blue-400 group-hover:translate-x-1 transition-transform">
                    <span>Cargar Oficio y Tarifas</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* FLOW A: PUBLICAR SERVICIO WIZARD                           */}
          {/* ========================================================= */}
          {publishType === 'service' && (
            <>
              {/* STEP 1: Oficio & Catálogo de Trabajos con Fotos */}
              {step === 1 && (
                <div className="space-y-5 text-xs">
                  <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-4 border border-slate-800 shadow-md">
                    <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
                      <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-400">
                        <Briefcase className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-white">1. Tu Oficio y Profesión</h4>
                        <p className="text-[11px] text-slate-300">
                          Escribí tu título profesional e ingresá la lista de servicios con sus precios y fotos.
                        </p>
                      </div>
                    </div>

                    {/* Oficio Input */}
                    <div>
                      <label className="block font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                        <Wrench className="w-3.5 h-3.5 text-blue-400" />
                        <span>Oficio / Especialidad del Prestador</span>
                      </label>
                      <input
                        type="text"
                        value={serviceProfession}
                        onChange={(e) => setServiceProfession(e.target.value)}
                        placeholder="Ej: Electricista Matriculado / Plomero y Gasista"
                        className="w-full p-3 bg-slate-950 border border-slate-700 text-white rounded-xl focus:border-blue-500 outline-hidden font-bold text-xs"
                      />

                      {/* Presets */}
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {professionPresets.map((preset) => (
                          <button
                            type="button"
                            key={preset}
                            onClick={() => setServiceProfession(preset.replace(/^[^\w\s]+/, '').trim())}
                            className="bg-slate-800 hover:bg-blue-600/40 text-slate-200 hover:text-white border border-slate-700 rounded-lg px-2.5 py-1 text-[10px] font-semibold transition-colors cursor-pointer"
                          >
                            {preset}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sub-Services Catalog */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                        <Layers className="w-4 h-4 text-blue-600" />
                        <span>2. Catálogo de Trabajos y Tarifas ({subServices.length})</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleAddSubService}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-3 py-1.5 rounded-xl text-[11px] flex items-center gap-1 shadow-xs cursor-pointer active:scale-95 transition-transform"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Agregar Trabajo</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {subServices.map((sub, idx) => (
                        <div key={sub.id} className="bg-slate-900 text-white border border-slate-800 p-4 rounded-2xl space-y-3 shadow-md relative">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 bg-blue-900/50 px-2 py-0.5 rounded border border-blue-700/50">
                              Trabajo / Opción #{idx + 1}
                            </span>
                            {subServices.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveSubService(sub.id)}
                                className="text-slate-400 hover:text-rose-400 p-1 cursor-pointer transition-colors"
                                title="Eliminar este trabajo"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            <div className="sm:col-span-2">
                              <label className="text-[10px] text-slate-300 font-bold block mb-0.5">Título del Trabajo / Tarea</label>
                              <input
                                type="text"
                                value={sub.title}
                                onChange={(e) => handleSubServiceChange(sub.id, 'title', e.target.value)}
                                placeholder="Ej: Instalación de Aire Acondicionado Split"
                                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold text-xs"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-300 font-bold block mb-0.5">Monto / Tarifa (ARS)</label>
                              <input
                                type="text"
                                inputMode="numeric"
                                value={sub.price ? sub.price.toLocaleString('es-AR') : ''}
                                onChange={(e) => {
                                  const raw = e.target.value.replace(/\D/g, '');
                                  handleSubServiceChange(sub.id, 'price', raw ? parseInt(raw, 10) : 0);
                                }}
                                placeholder="Ej: 35.000"
                                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-emerald-400 font-extrabold text-xs"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-300 font-bold block mb-0.5">Detalles / Qué incluye este monto</label>
                            <input
                              type="text"
                              value={sub.description || ''}
                              onChange={(e) => handleSubServiceChange(sub.id, 'description', e.target.value)}
                              placeholder="Ej: Incluye prueba de vacío, cañería hasta 3m e insumos."
                              className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 text-[11px]"
                            />
                          </div>

                          {/* Image Upload specifically for this SubService */}
                          <div>
                            <label className="text-[10px] text-slate-300 font-bold block mb-1">
                              Foto ilustrativa de este trabajo (desde Galería / Celular o PC)
                            </label>
                            <div className="flex flex-wrap items-center gap-2">
                              {sub.imageUrl ? (
                                <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-slate-700 shrink-0 bg-slate-950 shadow-xs">
                                  <img src={sub.imageUrl} alt="" className="w-full h-full object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => handleSubServiceChange(sub.id, 'imageUrl', '')}
                                    className="absolute top-0.5 right-0.5 bg-rose-600 text-white p-0.5 rounded-full cursor-pointer"
                                    title="Quitar foto"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ) : null}

                              <label className="bg-blue-600 hover:bg-blue-500 text-white border border-blue-400/40 rounded-xl px-3.5 py-2 text-[11px] font-extrabold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs">
                                <Camera className="w-4 h-4 text-blue-200" />
                                <span>{sub.imageUrl ? 'Cambiar Foto (Galería/PC)' : 'Subir Foto desde Celular o PC'}</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleSubServiceImageUpload(sub.id, file);
                                  }}
                                />
                              </label>

                              <input
                                type="text"
                                value={sub.imageUrl && !sub.imageUrl.startsWith('data:') ? sub.imageUrl : ''}
                                onChange={(e) => handleSubServiceChange(sub.id, 'imageUrl', e.target.value)}
                                placeholder="o pegar enlace de foto..."
                                className="flex-1 min-w-[130px] p-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 text-[10px] font-mono outline-hidden"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Zonas de Cobertura y Medios de Pago */}
              {step === 2 && (
                <div className="space-y-4 text-xs">
                  <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl flex items-center gap-2 text-blue-900 text-xs font-semibold">
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Zonas de cobertura y formas de cobrar por tus trabajos en Santiago del Estero.</span>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Barrio o Zona Base de Salida</label>
                    <input
                      type="text"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      placeholder="Ej: Barrio Autonomía, Centro, La Banda"
                      className="w-full p-3 border border-slate-200 rounded-xl focus:border-blue-500 outline-hidden font-medium text-xs"
                    />
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-800">Ubicación en el Mapa de Santiago del Estero</div>
                      <div className="text-[11px] text-slate-500">
                        Lat: {typeof lat === 'number' ? lat.toFixed(4) : '-27.7877'}, Lng: {typeof lng === 'number' ? lng.toFixed(4) : '-64.2597'} ({typeof distanceKm === 'number' ? distanceKm : 1.2} km del centro)
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowMapPickerModal(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-xl text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>Cambiar en Mapa</span>
                    </button>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-2">Medios de Pago Aceptados</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {['Efectivo', 'Transferencia bancaria', 'Mercado Pago', 'Tarjetas de Crédito/Débito', 'A convenir'].map((method) => {
                        const isChecked = paymentMethods.includes(method);
                        return (
                          <button
                            type="button"
                            key={method}
                            onClick={() => {
                              if (isChecked) {
                                setPaymentMethods(paymentMethods.filter((m) => m !== method));
                              } else {
                                setPaymentMethods([...paymentMethods, method]);
                              }
                            }}
                            className={`p-2.5 rounded-xl border text-left font-bold text-[11px] flex items-center justify-between transition-colors cursor-pointer ${
                              isChecked ? 'bg-blue-50 border-blue-600 text-blue-800' : 'bg-white border-slate-200 text-slate-600'
                            }`}
                          >
                            <span>{method}</span>
                            {isChecked && <Check className="w-3.5 h-3.5 text-blue-600" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Fotos Generales del Prestador y Texto Adicional */}
              {step === 3 && (
                <div className="space-y-4 text-xs">
                  <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-3 border border-slate-800">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                      <h4 className="font-extrabold text-sm">3. Información General (Se auto-completa)</h4>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Como ya cargaste tu oficio y catálogo de precios, el título y descripción se arman automáticamente. Si querés, podés personalizarlos abajo.
                    </p>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Título de la Publicación (Opcional)</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={`Dejá en blanco para usar: "Servicio de ${serviceProfession}"`}
                      className="w-full p-3 border border-slate-200 rounded-xl focus:border-blue-500 outline-hidden font-medium text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Comentarios Adicionales (Opcional)</label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Garantía, años de experiencia, horarios de atención..."
                      className="w-full p-3 border border-slate-200 rounded-xl focus:border-blue-500 outline-hidden font-normal text-slate-800 text-xs"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                        Fotos generales de tu taller / herramientas / trabajos ({images.length})
                      </label>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-3 py-1.5 rounded-xl text-[11px] flex items-center gap-1 cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Subir desde Galería/PC</span>
                      </button>
                    </div>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      multiple
                      className="hidden"
                    />

                    {images.length > 0 && (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {images.map((img, i) => (
                          <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                            <img src={img} alt="" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                              className="absolute top-1 right-1 bg-rose-600 text-white p-0.5 rounded-full cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 4: Vista Previa y Confirmar Servicio */}
              {step === 4 && (
                <div className="space-y-4 text-xs">
                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center gap-2 text-emerald-900 font-semibold">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>¡Todo listo! Así verán tu publicación los clientes de Santiago del Estero.</span>
                  </div>

                  <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-4 border border-slate-800 shadow-xl">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="inline-flex items-center gap-1 bg-blue-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-md mb-1.5">
                          🛠️ {serviceProfession}
                        </div>
                        <h3 className="font-extrabold text-base text-white">
                          {title || `Servicio de ${serviceProfession}`}
                        </h3>
                        <p className="text-xs text-slate-300 flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-blue-400" />
                          {neighborhood}, Santiago del Estero
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xl font-black text-emerald-400">
                          ${(price || (subServices.length > 0 ? Math.min(...subServices.map(s => s.price || 0)) : 0)).toLocaleString('es-AR')}
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold">Desde / Tarifa Base</span>
                      </div>
                    </div>

                    {/* SubServices Tariff Display */}
                    <div className="border-t border-slate-800 pt-3 space-y-2">
                      <div className="font-bold text-blue-400 flex items-center gap-1.5 text-xs">
                        <Layers className="w-4 h-4" />
                        <span>Catálogo de Trabajos Ofrecidos ({subServices.length}):</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {subServices.map((sub, i) => (
                          <div key={i} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                            {sub.imageUrl && (
                              <div className="w-full h-24 rounded-lg overflow-hidden bg-slate-900 mb-1">
                                <img src={sub.imageUrl} alt="" className="w-full h-full object-cover" />
                              </div>
                            )}
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-white text-xs">{sub.title}</span>
                              <span className="font-black text-emerald-400 text-xs">${sub.price.toLocaleString('es-AR')}</span>
                            </div>
                            {sub.description && (
                              <p className="text-[10px] text-slate-400 leading-tight">{sub.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-slate-800 pt-3 text-[11px] text-slate-300">
                      <strong>Medios de cobro:</strong> {paymentMethods.join(', ')}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ========================================================= */}
          {/* FLOW B: PUBLICAR PRODUCTO WIZARD                          */}
          {/* ========================================================= */}
          {publishType === 'product' && (
            <>
              {/* STEP 1: Categoría & Fotos */}
              {step === 1 && (
                <div className="space-y-6 text-xs">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      1. Categoría del Producto
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {productCategories.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setCategory(cat)}
                          className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                            category === cat
                              ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold shadow-xs'
                              : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        2. Fotografías del Producto ({images.length}/10)
                      </label>
                      <span className="text-xs text-slate-500">Subí fotos desde tu celular o PC</span>
                    </div>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      multiple
                      className="hidden"
                    />

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {images.map((imgUrl, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group shadow-2xs">
                          <img src={imgUrl} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                          {idx === 0 && (
                            <span className="absolute bottom-1 left-1 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                              Portada
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => setImages(images.filter((_, i) => i !== idx))}
                            className="absolute top-1 right-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full p-1 cursor-pointer shadow-xs"
                            title="Eliminar foto"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square rounded-xl border-2 border-dashed border-blue-400 hover:border-blue-600 bg-blue-50/60 hover:bg-blue-100/60 flex flex-col items-center justify-center text-blue-700 transition-all cursor-pointer p-3 text-center group"
                      >
                        <Upload className="w-7 h-7 mb-1 text-blue-600 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-extrabold text-blue-900">Buscar en Celular / PC</span>
                        <span className="text-[10px] text-blue-600 mt-0.5">Elegir de galería</span>
                      </button>
                    </div>

                    {images.length === 0 && (
                      <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs text-slate-600">
                        <div className="flex items-center gap-2">
                          <Camera className="w-4 h-4 text-blue-600 shrink-0" />
                          <span>¿Preferís probar con fotos de ejemplo?</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleAddSamplePhoto}
                          className="shrink-0 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-2.5 py-1 rounded-lg text-[11px] cursor-pointer"
                        >
                          + Ejemplo
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 2: Información del Producto */}
              {step === 2 && (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Título del Producto</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ej: Bicicleta Rodado 29 Shimano en excelente estado"
                      className="w-full p-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                        <span>Precio (ARS)</span>
                        {price > 0 && (
                          <span className="text-[10px] font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                            $ {price.toLocaleString('es-AR')}
                          </span>
                        )}
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 text-slate-400 font-bold text-sm">$</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={formatPriceDisplay(price)}
                          onChange={handlePriceChange}
                          placeholder="Ej: 45.000"
                          className="w-full p-3 pl-8 border-2 border-slate-200 focus:border-blue-600 rounded-xl outline-hidden font-extrabold text-slate-900 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Estado del Producto</label>
                      <select
                        value={condition}
                        onChange={(e) => setCondition(e.target.value as any)}
                        className="w-full p-3 border border-slate-200 rounded-xl focus:border-blue-500 outline-hidden font-medium bg-white"
                      >
                        <option value="Usado">Usado</option>
                        <option value="Nuevo">Nuevo</option>
                        <option value="Reacondicionado">Reacondicionado</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Descripción Detallada</label>
                    <textarea
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Escribí los detalles principales, años de uso, si incluye caja o accesorios..."
                      className="w-full p-3 border border-slate-200 rounded-xl focus:border-blue-500 outline-hidden font-normal text-slate-800"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: Entrega, Pago e Inteligencia NEXORA AI */}
              {step === 3 && (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Barrio o Zona en Santiago del Estero</label>
                    <input
                      type="text"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-xl font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-2">Forma de Entrega</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Retiro en persona', 'Entrega a domicilio', 'Ambas opciones'].map((opt) => (
                        <button
                          type="button"
                          key={opt}
                          onClick={() => setDeliveryOption(opt as any)}
                          className={`p-2.5 rounded-xl border font-bold text-[11px] text-center transition-colors cursor-pointer ${
                            deliveryOption === opt ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-white border-slate-200 text-slate-600'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* AI Optimization Assistant */}
                  <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white p-4 rounded-2xl space-y-3 shadow-md border border-slate-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-sky-400" />
                        <span className="font-extrabold text-sm">Optimizador Inteligente NEXORA AI</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleAIOptimize}
                        disabled={isOptimizing}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        {isOptimizing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                        <span>Optimizar Texto</span>
                      </button>
                    </div>

                    {aiResult && (
                      <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-2">
                        <div className="text-[11px] font-bold text-emerald-400">
                          Puntuación estimada: {aiResult.qualityScore}/100
                        </div>
                        <p className="text-[11px] text-slate-300">
                          <strong>Sugerencia de Título:</strong> {aiResult.optimizedTitle}
                        </p>
                        <button
                          type="button"
                          onClick={applyAIOptimization}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1 rounded-lg text-[10px] cursor-pointer"
                        >
                          Aplicar Mejoras Sugeridas
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 4: Vista Previa y Confirmar Producto */}
              {step === 4 && (
                <div className="space-y-4 text-xs">
                  <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl flex items-center gap-2 text-blue-900 font-semibold">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                    <span>¡Casi listo! Revisá cómo verán tu producto los compradores.</span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-200">
                      {images.length > 0 ? (
                        <img src={images[0]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-400 h-full">
                          <ImageIcon className="w-8 h-8" />
                          <span>Sin imagen seleccionada</span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-start">
                      <div>
                        <span className="bg-blue-100 text-blue-800 font-bold text-[10px] px-2 py-0.5 rounded-full">
                          {category}
                        </span>
                        <h3 className="font-bold text-sm text-slate-900 mt-1">{title}</h3>
                        <p className="text-xs text-slate-500">{neighborhood}, Santiago del Estero</p>
                      </div>
                      <div className="text-lg font-black text-slate-900">
                        ${price.toLocaleString('es-AR')}
                      </div>
                    </div>

                    <p className="text-slate-700 whitespace-pre-line text-xs bg-white p-3 rounded-xl border border-slate-200">
                      {description}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

        </div>

        {/* Footer Navigation Controls */}
        {publishType && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-300 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Anterior
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setPublishType(null)}
                className="bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-300 flex items-center gap-1.5 cursor-pointer"
              >
                Volver a Elección
              </button>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                Siguiente <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalPublish}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-6 py-3 rounded-xl flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{publishType === 'service' ? 'Publicar Servicio Ahora' : 'Publicar Producto Ahora'}</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Map Location Picker Modal */}
      <MapLocationPickerModal
        isOpen={showMapPickerModal}
        initialLat={typeof lat === 'number' ? lat : -27.7877}
        initialLng={typeof lng === 'number' ? lng : -64.2597}
        initialNeighborhood={neighborhood}
        onClose={() => setShowMapPickerModal(false)}
        onConfirmLocation={(location) => {
          setLat(location.lat);
          setLng(location.lng);
          setNeighborhood(location.neighborhood);
          setDistanceKm(location.distanceKm);
          setShowMapPickerModal(false);
        }}
      />
    </div>
  );
};
