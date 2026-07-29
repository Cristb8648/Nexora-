import { Listing, Shop, UserProfile, SafeMeetupSpot, AppNotification, PriceAlert, Review, LocalEvent } from '../types';


export const INSPIRATIONAL_QUOTES = [
  "Hoy puede haber una oportunidad cerca de vos en Santiago del Estero.",
  "Miles de productos te están esperando. Apoyá al comercio de tu ciudad.",
  "Encontrá lo que necesitás sin ir lejos con el respaldo de la comunidad.",
  "La confianza no se compra: se construye con cada buena decisión.",
  "Conectando personas y comercios locales con tecnología humana e inteligente."
];

export const SAFE_MEETUP_SPOTS: SafeMeetupSpot[] = [
  {
    name: "Plaza Libertad - Frente a la Catedral",
    address: "24 de Septiembre y Avellaneda",
    neighborhood: "Centro",
    description: "Zona muy transitada con iluminación de alta potencia y presencia policial permanente.",
    lat: -27.7877,
    lng: -64.2597
  },
  {
    name: "Parque Aguirre - Zona Polideportivo",
    address: "Av. Costanera y Salta",
    neighborhood: "Parque",
    description: "Espacio abierto con monitoreo de cámaras urbanas y amplio estacionamiento.",
    lat: -27.7812,
    lng: -64.2505
  },
  {
    name: "Terminal de Ómnibus Santiago del Estero",
    address: "Chaco y Av. Roca",
    neighborhood: "Alberdi",
    description: "Área con seguridad privada 24hs, buena iluminación y constante flujo de personas.",
    lat: -27.7845,
    lng: -64.2662
  },
  {
    name: "Plaza Belgrano - La Banda",
    address: "Av. Belgrano y Soler",
    neighborhood: "Centro La Banda",
    description: "Punto Neurálgico accesible en La Banda con cámaras de seguridad municipales.",
    lat: -27.7341,
    lng: -64.2411
  }
];

export const CURRENT_USER: UserProfile = {
  id: "user_cristian_1",
  name: "Cristian Bravo",
  username: "cristianbravo",
  email: "cristianbravo5266@gmail.com",
  phone: "+54 385 412 8900",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  city: "Santiago del Estero",
  neighborhood: "Centro",
  bio: "Fundador de NEXORA. Apasionado por conectar comercios y emprendedores en Santiago del Estero.",
  registrationDate: "2026-07-21",
  trustIndex: {
    score: 98,
    level: "Platino",
    stars: 4.9,
    totalSales: 24,
    totalPurchases: 18,
    completedOpsRate: 100,
    avgResponseTimeMin: 12,
    accountAgeMonths: 12,
    verifiedPhone: true,
    verifiedEmail: true,
    verifiedIdentity: true,
    reportsCount: 0
  },
  badges: ["Usuario Fundador", "Cuenta Verificada", "Vendedor Destacado", "Responde Rápido", "Comercio Aliado"],
  isShopOwner: true,
  shopId: "shop_nexora_official"
};

export const MOCK_USERS: Record<string, UserProfile> = {
  "user_cristian_1": CURRENT_USER,
  "user_2": {
    id: "user_2",
    name: "Mariana Gómez",
    username: "marianag",
    email: "mariana.gomez@gmail.com",
    phone: "+54 385 588 1234",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    city: "Santiago del Estero",
    neighborhood: "B° Autonomía",
    bio: "Amante de la fotografía y el deporte. Vendo artículos en excelente estado.",
    registrationDate: "2026-02-10",
    trustIndex: {
      score: 92,
      level: "Oro",
      stars: 4.8,
      totalSales: 15,
      totalPurchases: 9,
      completedOpsRate: 96,
      avgResponseTimeMin: 25,
      accountAgeMonths: 5,
      verifiedPhone: true,
      verifiedEmail: true,
      verifiedIdentity: true,
      reportsCount: 0
    },
    badges: ["Cuenta Verificada", "Vendedor Destacado", "Responde Rápido"]
  },
  "user_3": {
    id: "user_3",
    name: "Esteban Peralta",
    username: "esteban_tech",
    email: "esteban.peralta@gmail.com",
    phone: "+54 385 601 4422",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    city: "La Banda",
    neighborhood: "Centro La Banda",
    bio: "Técnico informático y comerciante. Ofrezco garantía y atención personalizada.",
    registrationDate: "2026-01-15",
    trustIndex: {
      score: 86,
      level: "Plata",
      stars: 4.7,
      totalSales: 38,
      totalPurchases: 12,
      completedOpsRate: 94,
      avgResponseTimeMin: 18,
      accountAgeMonths: 6,
      verifiedPhone: true,
      verifiedEmail: true,
      verifiedIdentity: false,
      reportsCount: 0
    },
    badges: ["Comercio Aliado", "Responde Rápido"]
  },
  "user_4": {
    id: "user_4",
    name: "Roberto Rossi",
    username: "muebles_rossi",
    email: "contacto@mueblesrossi.com.ar",
    phone: "+54 385 422 9988",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    city: "Santiago del Estero",
    neighborhood: "B° Belgrano",
    bio: "Fabricación y venta de muebles artesanales de algarrobo y pino de primera calidad.",
    registrationDate: "2025-11-20",
    trustIndex: {
      score: 95,
      level: "Platino",
      stars: 4.9,
      totalSales: 72,
      totalPurchases: 5,
      completedOpsRate: 99,
      avgResponseTimeMin: 15,
      accountAgeMonths: 8,
      verifiedPhone: true,
      verifiedEmail: true,
      verifiedIdentity: true,
      reportsCount: 0
    },
    badges: ["Comercio Aliado NEXORA", "Cuenta Verificada", "Vendedor Destacado"]
  }
};

export const MOCK_SHOPS: Shop[] = [
  {
    id: "shop_nexora_official",
    ownerId: "user_cristian_1",
    name: "NEXORA Tech Store & Servicios",
    logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
    coverUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
    category: "Tecnología & Servicios",
    description: "Tienda Oficial NEXORA en Santiago del Estero. Venta de accesorios tecnológicos, equipos seleccionados y asistencia técnica con garantía.",
    address: "Av. Belgrano Sur 1420",
    neighborhood: "Centro",
    city: "Santiago del Estero",
    hours: "Lunes a Sábado: 8:30 a 12:30 y 17:30 a 21:30 hs",
    phone: "+54 385 412 8900",
    whatsapp: "3854128900",
    isAliadoNexora: true,
    stars: 4.9,
    yearsInNexora: 1,
    catalogCount: 14
  },
  {
    id: "shop_muebles_rossi",
    ownerId: "user_4",
    name: "Mueblería Rossi Santiago",
    logoUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=150&auto=format&fit=crop&q=80",
    coverUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80",
    category: "Hogar & Muebles",
    description: "Especialistas en algarrobo, pino seleccionado y equipamiento integral para el hogar. Envíos gratis en Santiago del Estero y La Banda.",
    address: "Av. Moreno Norte 850",
    neighborhood: "B° Belgrano",
    city: "Santiago del Estero",
    hours: "Lunes a Viernes: 9:00 a 13:00 y 17:00 a 21:00 hs",
    phone: "+54 385 422 9988",
    whatsapp: "3854229988",
    isAliadoNexora: true,
    stars: 4.9,
    yearsInNexora: 1,
    catalogCount: 22
  },
  {
    id: "shop_esteban_tech",
    ownerId: "user_3",
    name: "Peralta Computación La Banda",
    logoUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=150&auto=format&fit=crop&q=80",
    coverUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
    category: "Tecnología",
    description: "Armado de PCs Gamer, repuestos de notebooks, reparación en el día y venta de insumos en La Banda.",
    address: "España 320",
    neighborhood: "Centro La Banda",
    city: "La Banda",
    hours: "Lunes a Sábado: 8:30 a 12:30 y 17:00 a 21:00 hs",
    phone: "+54 385 601 4422",
    whatsapp: "3856014422",
    isAliadoNexora: true,
    stars: 4.7,
    yearsInNexora: 1,
    catalogCount: 18
  }
];

export const INITIAL_LISTINGS: Listing[] = [
  {
    id: "prod_1",
    sellerId: "user_2",
    sellerName: "Mariana Gómez",
    sellerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    sellerTrustLevel: "Oro",
    sellerStars: 4.8,
    title: "Bicicleta Mountain Bike Rodado 29 Shimano - Impecable",
    description: "Bicicleta rodado 29 de aluminio con freno a disco mecánico, 21 velocidades Shimano Tourney. Cuadro talle M. Service completo realizado la semana pasada en taller especializado. Ideal para uso urbano o cicloturismo por el Parque Aguirre.",
    price: 345000,
    currency: "ARS",
    category: "Deportes",
    condition: "Usado",
    images: [
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=800&auto=format&fit=crop&q=80"
    ],
    city: "Santiago del Estero",
    neighborhood: "B° Autonomía",
    distanceKm: 1.8,
    lat: -27.792,
    lng: -64.275,
    createdAt: "2026-07-26T14:30:00Z",
    status: "Disponible",
    qualityScore: 94,
    viewsCount: 184,
    favoritesCount: 22,
    queriesCount: 6,
    featured: true,
    deliveryOption: "Ambas opciones",
    acceptedPaymentMethods: ["Efectivo", "Transferencia bancaria", "Mercado Pago"],
    suggestedPriceRange: { min: 320000, max: 370000 },
    aiAnalysis: {
      completeDescription: true,
      goodPhotos: true,
      fairPrice: true,
      quickSeller: true,
      tips: [
        "Probar cambios y frenos durante el encuentro en un área abierta.",
        "Recomenda el punto seguro Plaza Libertad para la entrega."
      ]
    }
  },
  {
    id: "prod_2",
    sellerId: "user_3",
    sellerName: "Esteban Peralta",
    sellerAvatar: "https://images.unsplash.com/photo-150703211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    sellerTrustLevel: "Plata",
    sellerStars: 4.7,
    title: "Notebook Lenovo IdeaPad 3 Core i5 8GB SSD 256GB",
    description: "Notebook ideal para estudio, trabajo o administración. Pantalla 15.6' Full HD, procesador Intel Core i5 de 11ma generación, 8GB RAM DDR4 y SSD NVMe de 256GB. Batería con 5 horas de autonomía comprobada. Incluye cargador original y funda de regalo.",
    price: 680000,
    currency: "ARS",
    category: "Tecnología",
    condition: "Usado",
    images: [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80"
    ],
    city: "La Banda",
    neighborhood: "Centro La Banda",
    distanceKm: 5.2,
    lat: -27.734,
    lng: -64.241,
    createdAt: "2026-07-27T10:15:00Z",
    status: "Disponible",
    qualityScore: 91,
    viewsCount: 245,
    favoritesCount: 31,
    queriesCount: 9,
    featured: true,
    deliveryOption: "Ambas opciones",
    acceptedPaymentMethods: ["Efectivo", "Transferencia bancaria", "Mercado Pago"],
    suggestedPriceRange: { min: 650000, max: 720000 },
    aiAnalysis: {
      completeDescription: true,
      goodPhotos: true,
      fairPrice: true,
      quickSeller: true,
      tips: [
        "Verificar estado de batería e informe CrystalDisk en el encuentro.",
        "Excelente vendedor verificado con comercio físico en La Banda."
      ]
    }
  },
  {
    id: "prod_3",
    sellerId: "user_4",
    sellerName: "Roberto Rossi",
    sellerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    sellerTrustLevel: "Platino",
    sellerStars: 4.9,
    title: "Juego de Comedor Macizo en Algarrobo (Mesa + 6 Sillas)",
    description: "Mesa rectangular de algarrobo macizo de 1.80m x 0.90m procesado y lustrado a cera natural, con 6 sillas anatómicas de estructura súper reforzada. Fabricación propia Mueblería Rossi. Garantía de 2 años por fallas de estructura. Envío sin cargo en Santiago y La Banda.",
    price: 890000,
    currency: "ARS",
    category: "Hogar",
    condition: "Nuevo",
    images: [
      "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=800&auto=format&fit=crop&q=80"
    ],
    city: "Santiago del Estero",
    neighborhood: "B° Belgrano",
    distanceKm: 2.1,
    lat: -27.78,
    lng: -64.26,
    createdAt: "2026-07-25T18:00:00Z",
    status: "Disponible",
    qualityScore: 98,
    viewsCount: 412,
    favoritesCount: 54,
    queriesCount: 14,
    featured: true,
    deliveryOption: "Entrega a domicilio",
    acceptedPaymentMethods: ["Efectivo", "Transferencia bancaria", "Mercado Pago"],
    suggestedPriceRange: { min: 850000, max: 950000 },
    aiAnalysis: {
      completeDescription: true,
      goodPhotos: true,
      fairPrice: true,
      quickSeller: true,
      tips: ["Comercio Aliado NEXORA verificado con garantía directa."]
    }
  },
  {
    id: "prod_4",
    sellerId: "user_cristian_1",
    sellerName: "Cristian Bravo",
    sellerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    sellerTrustLevel: "Platino",
    sellerStars: 4.9,
    title: "Moto Honda Wave 110cc 2023 - 4.500 km Excelente Estado",
    description: "Honda Wave 110s año 2023 con solo 4.500 km reales. Titular al día, radicada en Santiago del Estero, lista para transferir sin deudas. Service recién hecho en concesionario oficial (cambio de aceite y filtro). Incluye casco reglamentario de regalo.",
    price: 2450000,
    currency: "ARS",
    category: "Vehículos",
    condition: "Usado",
    images: [
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&auto=format&fit=crop&q=80"
    ],
    city: "Santiago del Estero",
    neighborhood: "Centro",
    distanceKm: 0.5,
    lat: -27.787,
    lng: -64.259,
    createdAt: "2026-07-28T09:00:00Z",
    status: "Disponible",
    qualityScore: 96,
    viewsCount: 310,
    favoritesCount: 48,
    queriesCount: 11,
    featured: true,
    deliveryOption: "Retiro en persona",
    acceptedPaymentMethods: ["Efectivo", "Transferencia bancaria"],
    suggestedPriceRange: { min: 2300000, max: 2600000 },
    aiAnalysis: {
      completeDescription: true,
      goodPhotos: true,
      fairPrice: true,
      quickSeller: true,
      tips: [
        "Verificar formulario 08 y verificación policial del motor antes del pago.",
        "Probar la moto en las inmediaciones del Parque Aguirre."
      ]
    }
  },
  {
    id: "prod_5",
    sellerId: "user_2",
    sellerName: "Mariana Gómez",
    sellerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    sellerTrustLevel: "Oro",
    sellerStars: 4.8,
    title: "Heladera Patrick 360L No Frost con Freezer Inox",
    description: "Heladera marca Patrick No Frost en acero inoxidable, capacidad de 360 litros. En perfecto funcionamiento de motor y sistema de enfriamiento rápido. Se vende por mudanza a departamento más chico. Se puede probar en domicilio.",
    price: 520000,
    currency: "ARS",
    category: "Hogar",
    condition: "Usado",
    images: [
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&auto=format&fit=crop&q=80"
    ],
    city: "Santiago del Estero",
    neighborhood: "B° Autonomía",
    distanceKm: 2.3,
    lat: -27.791,
    lng: -64.274,
    createdAt: "2026-07-24T16:20:00Z",
    status: "Disponible",
    qualityScore: 89,
    viewsCount: 198,
    favoritesCount: 19,
    queriesCount: 5,
    featured: false,
    deliveryOption: "Retiro en persona",
    acceptedPaymentMethods: ["Efectivo", "Transferencia bancaria", "Mercado Pago"],
    suggestedPriceRange: { min: 490000, max: 550000 },
    aiAnalysis: {
      completeDescription: true,
      goodPhotos: true,
      fairPrice: true,
      quickSeller: true,
      tips: ["Solicitar demostración de enfriamiento en marcha."]
    }
  },
  {
    id: "prod_6",
    sellerId: "user_3",
    sellerName: "Esteban Peralta",
    sellerAvatar: "https://images.unsplash.com/photo-150703211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    sellerTrustLevel: "Plata",
    sellerStars: 4.7,
    title: "Servicio Técnico Informático & Mantenimiento PC / Laptop",
    description: "Servicio matriculado de reparación de computadoras, formateo, instalación de SSD, limpieza de ventilación y pasta térmica, eliminación de virus. Atención a domicilio en Santiago del Estero y La Banda. Presupuesto sin cargo.",
    price: 15000,
    currency: "ARS",
    category: "Servicios",
    condition: "Nuevo",
    images: [
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=80"
    ],
    city: "La Banda",
    neighborhood: "Centro La Banda",
    distanceKm: 5.0,
    lat: -27.734,
    lng: -64.241,
    createdAt: "2026-07-22T11:00:00Z",
    status: "Disponible",
    qualityScore: 95,
    viewsCount: 520,
    favoritesCount: 65,
    queriesCount: 28,
    featured: true,
    deliveryOption: "Entrega a domicilio",
    acceptedPaymentMethods: ["Efectivo", "Transferencia bancaria", "Mercado Pago"],
    suggestedPriceRange: { min: 12000, max: 20000 },
    serviceProfession: "Técnico de PC y Celulares Matriculado",
    subServices: [
      {
        id: "sub_101",
        title: "Diagnóstico e Inspección Técnica General",
        price: 15000,
        description: "Revisión completa de hardware/software en el domicilio o taller con informe en el día.",
        imageUrl: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=80"
      },
      {
        id: "sub_102",
        title: "Formateo e Instalación de SSD M.2 NVMe + Windows 11",
        price: 28000,
        description: "Incluye clonación de datos, drivers actualizados y programas esenciales para optimizar la velocidad.",
        imageUrl: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&auto=format&fit=crop&q=80"
      },
      {
        id: "sub_103",
        title: "Limpieza Interna + Pasta Térmica Arctic MX-4",
        price: 22000,
        description: "Mantenimiento preventivo anti-recalentamiento para notebooks y PCs de escritorio.",
        imageUrl: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80"
      }
    ],
    aiAnalysis: {
      completeDescription: true,
      goodPhotos: true,
      fairPrice: true,
      quickSeller: true,
      tips: ["Servicio calificado con excelente reputación técnica."]
    }
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif_1",
    userId: "user_cristian_1",
    title: "🎉 ¡Bienvenido a NEXORA!",
    message: "Tu cuenta ha sido configurada con Nivel de Confianza Platino. Disfrutá la experiencia local en Santiago del Estero.",
    type: "system",
    read: false,
    createdAt: "2026-07-28T10:00:00Z"
  },
  {
    id: "notif_2",
    userId: "user_cristian_1",
    title: "📉 Bajada de Precio en Favorito",
    message: "La Bicicleta MTB Rodado 29 de Mariana Gómez bajó un 10% su precio.",
    type: "price_drop",
    read: false,
    createdAt: "2026-07-27T18:30:00Z"
  },
  {
    id: "notif_3",
    userId: "user_cristian_1",
    title: "🔔 Alerta de Búsqueda Activa",
    message: "Se encontraron 2 nuevas publicaciones para 'Notebook Core i5' cerca tuyo.",
    type: "alert_match",
    read: true,
    createdAt: "2026-07-27T12:00:00Z"
  }
];

export const INITIAL_ALERTS: PriceAlert[] = [
  {
    id: "alert_1",
    userId: "user_cristian_1",
    keyword: "Bicicleta Rodado 29",
    category: "Deportes",
    maxPrice: 400000,
    maxDistanceKm: 10,
    createdAt: "2026-07-21T15:00:00Z",
    active: true,
    matchesCount: 3
  },
  {
    id: "alert_2",
    userId: "user_cristian_1",
    keyword: "Notebook",
    category: "Tecnología",
    maxPrice: 750000,
    maxDistanceKm: 15,
    createdAt: "2026-07-22T09:30:00Z",
    active: true,
    matchesCount: 2
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev_1",
    buyerId: "user_cristian_1",
    buyerName: "Cristian Bravo",
    buyerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    sellerId: "user_2",
    listingId: "prod_1",
    listingTitle: "Bicicleta Mountain Bike Rodado 29 Shimano",
    rating: 5,
    comment: "Excelente atención y cordialidad. La bicicleta estaba impecable tal cual las fotos y Mariana me esperó en Plaza Libertad a la hora pautada. ¡Muy recomendable!",
    date: "2026-07-26",
    verifiedPurchase: true
  },
  {
    id: "rev_2",
    buyerId: "user_buyer_2",
    buyerName: "Carlos Rodríguez",
    buyerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    sellerId: "user_2",
    listingId: "prod_1",
    listingTitle: "Bicicleta Rodado 29",
    rating: 5,
    comment: "Respondió súper rápido mis preguntas. La transacción fue impecable y el producto impecable.",
    date: "2026-07-20",
    verifiedPurchase: true
  },
  {
    id: "rev_3",
    buyerId: "user_buyer_3",
    buyerName: "Andrea Morales",
    buyerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    sellerId: "user_3",
    listingId: "prod_100",
    listingTitle: "Servicio Técnico de PC y Celulares Matriculado",
    rating: 5,
    comment: "Excelente servicio profesional. Me arregló la notebook en el día y le instaló disco SSD. Quedó rapidísima y me entregó garantía por escrito.",
    date: "2026-07-24",
    verifiedPurchase: true
  },
  {
    id: "rev_4",
    buyerId: "user_buyer_4",
    buyerName: "Luis A. Gómez",
    buyerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    sellerId: "user_3",
    listingId: "prod_100",
    listingTitle: "Servicio Técnico de PC y Celulares Matriculado",
    rating: 5,
    comment: "Atención impecable en La Banda. Muy honesto con el presupuesto y usó repuestos originales.",
    date: "2026-07-18",
    verifiedPurchase: true
  },
  {
    id: "rev_5",
    buyerId: "user_buyer_5",
    buyerName: "Martín Benítez",
    buyerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    sellerId: "user_4",
    listingId: "prod_2",
    listingTitle: "Mesa de Algarrobo Maciza",
    rating: 5,
    comment: "Mueble de algarrobo macizo de altísima calidad. La entrega a domicilio en Santiago fue en el día y sin ningún costo extra. Totalmente recomendado.",
    date: "2026-07-22",
    verifiedPurchase: true
  },
  {
    id: "rev_6",
    buyerId: "user_buyer_6",
    buyerName: "Sofía Torres",
    buyerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    sellerId: "user_cristian_1",
    listingId: "prod_4",
    listingTitle: "Sillón Gamer Ergonómico Reclinable",
    rating: 5,
    comment: "Súper confiable. El producto vino nuevo en caja sellada y Cristian me asesoró excelente sobre la entrega en el centro.",
    date: "2026-07-25",
    verifiedPurchase: true
  }
];

export const INITIAL_EVENTS: LocalEvent[] = [
  {
    id: "evt_1",
    title: "Gran Peña Folclórica de Invierno Santiago",
    description: "Una noche inolvidable con la presentación de conjuntos en vivo, danza chacarera, empanadas santiagueñas, tamales y locro patrio. Estarán presentes músicos locales e invitados de La Banda y Termas.",
    category: "Peñas y Folclore",
    organizerId: "org_forum_sde",
    organizerName: "Productores Folclóricos SDE",
    organizerAvatar: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=80",
    organizerTrustLevel: "Platino",
    locationName: "Forum Santiago del Estero - Centro de Convenciones",
    address: "Av. Perú y Av. Roca",
    city: "Santiago del Estero",
    neighborhood: "Centro",
    lat: -27.7801,
    lng: -64.2628,
    date: "2026-08-01",
    time: "21:30 hs",
    price: 3500,
    isFree: false,
    images: [
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80"
    ],
    capacity: 1200,
    availableTickets: 340,
    instagramOrWebsite: "@penas.santiagueñas.oficial",
    createdAt: "2026-07-25",
    featured: true,
    contactPhone: "+54 385 411 9900"
  },
  {
    id: "evt_2",
    title: "Muestra Inmersiva y Noche de Museos en el CCB",
    description: "El Centro Cultural del Bicentenario abre sus puertas con paseos guiados, espectáculos visuales 3D, muestras arqueológicas de la cultura Chaco-Santiagueña y música acústica en los patios.",
    category: "Teatro y Cultura",
    organizerId: "org_ccb",
    organizerName: "Centro Cultural del Bicentenario",
    organizerAvatar: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=150&auto=format&fit=crop&q=80",
    organizerTrustLevel: "Platino",
    locationName: "Centro Cultural del Bicentenario (CCB)",
    address: "Pellegrini 149 (Frente a Plaza Libertad)",
    city: "Santiago del Estero",
    neighborhood: "Centro",
    lat: -27.7877,
    lng: -64.2597,
    date: "Permanente",
    time: "Martes a Domingos de 09:00 a 21:00 hs",
    price: 0,
    isFree: true,
    images: [
      "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&auto=format&fit=crop&q=80"
    ],
    capacity: 2000,
    instagramOrWebsite: "@ccb_santiago",
    createdAt: "2026-07-20",
    featured: true,
    isVenue: true,
    venueOpeningHours: "Martes a Domingos de 09:00 a 21:00 hs"
  },
  {
    id: "evt_3",
    title: "Copa Santiago: Torneo Nocturno de Fútbol en Estadio Madre de Ciudades",
    description: "Gran definición de la Copa Regional Santiago con transmisión en vivo. Patio gastronómico de foodtrucks en la explanada del estadio, DJ en vivo y sorteos para los espectadores.",
    category: "Deportes",
    organizerId: "org_liga_santiago",
    organizerName: "Liga Santiagueña de Fútbol",
    organizerAvatar: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150&auto=format&fit=crop&q=80",
    organizerTrustLevel: "Oro",
    locationName: "Estadio Único Madre de Ciudades",
    address: "Av. Costanera Norte y Diego Armando Maradona",
    city: "Santiago del Estero",
    neighborhood: "Costanera",
    lat: -27.7698,
    lng: -64.2530,
    date: "2026-08-08",
    time: "20:00 hs",
    price: 5500,
    isFree: false,
    images: [
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&auto=format&fit=crop&q=80"
    ],
    capacity: 30000,
    availableTickets: 1200,
    instagramOrWebsite: "@estadiomadredeciudades",
    createdAt: "2026-07-22",
    featured: true,
    contactPhone: "+54 385 422 1010"
  },
  {
    id: "evt_4",
    title: "Fiesta Studio Club La Banda - Cumbia & RKT",
    description: "La fiesta más convocante de La Banda con 2 pistas, sector VIP, barras con promociones exclusivas y la presentación estelar de DJs residentes. Seguridad privada y estacionamiento custodiado.",
    category: "Boliches y Fiesta",
    organizerId: "org_studioclub",
    organizerName: "Studio Club Night",
    organizerAvatar: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=150&auto=format&fit=crop&q=80",
    organizerTrustLevel: "Oro",
    locationName: "Studio Club Boliche",
    address: "Av. Besares 850",
    city: "La Banda",
    neighborhood: "Centro La Banda",
    lat: -27.7325,
    lng: -64.2438,
    date: "2026-08-02",
    time: "01:00 hs",
    price: 4000,
    isFree: false,
    images: [
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80"
    ],
    capacity: 1500,
    availableTickets: 210,
    instagramOrWebsite: "@studioclub.labanda",
    createdAt: "2026-07-24",
    isVenue: true,
    venueOpeningHours: "Viernes y Sábados desde las 01:00 hs"
  },
  {
    id: "evt_5",
    title: "Expo Tecnología, Robótica e Innovación en Nodo Tecnológico",
    description: "Feria tecnológica orientada a familias, jóvenes e inventores. Muestras de robótica, videojuegos retro, drones en vivo, talleres de programación gratuita y patio de comidas al aire libre.",
    category: "Exposiciones y Nodos",
    organizerId: "org_nodo",
    organizerName: "Secretaría de Ciencia y Tecnología SDE",
    organizerAvatar: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=150&auto=format&fit=crop&q=80",
    organizerTrustLevel: "Platino",
    locationName: "Nodo Tecnológico Santiago del Estero",
    address: "Av. Los Molinos y Industria (Parque Industrial La Banda)",
    city: "La Banda",
    neighborhood: "Parque Industrial",
    lat: -27.7450,
    lng: -64.2280,
    date: "2026-08-15",
    time: "14:00 a 21:00 hs",
    price: 0,
    isFree: true,
    images: [
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80"
    ],
    capacity: 5000,
    instagramOrWebsite: "@nodotecnologico.sde",
    createdAt: "2026-07-21"
  },
  {
    id: "evt_6",
    title: "Feria Gastronómica de Artesanos y Cerveza Artesanal",
    description: "Edición especial en el Parque Aguirre con más de 40 puestos de comida regional, cervecerías artesanales de la zona, juegos inflables para chicos y bandas tributo en vivo.",
    category: "Gastronomía y Ferias",
    organizerId: "org_ferias_sde",
    organizerName: "Asociación de Emprendedores Santiagueños",
    organizerAvatar: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150&auto=format&fit=crop&q=80",
    organizerTrustLevel: "Platino",
    locationName: "Parque Aguirre - Sector El Robledal",
    address: "Av. Costanera y Salta",
    city: "Santiago del Estero",
    neighborhood: "Parque Aguirre",
    lat: -27.7812,
    lng: -64.2505,
    date: "2026-08-02",
    time: "16:00 a 23:30 hs",
    price: 0,
    isFree: true,
    images: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop&q=80"
    ],
    capacity: 4000,
    instagramOrWebsite: "@saboresdesantiago",
    createdAt: "2026-07-23"
  }
];

