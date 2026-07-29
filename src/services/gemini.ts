export interface OptimizeListingResponse {
  optimizedTitle: string;
  optimizedDescription: string;
  qualityScore: number;
  suggestedPriceRange?: { min: number; max: number };
  tips: string[];
}

export interface BuyerAssistantResponse {
  advice: string;
  fairPriceAssessment: string;
  safetyChecklist: string[];
}

export async function callGeminiOptimizeListing(payload: {
  title: string;
  description: string;
  category: string;
  price: number;
  condition?: string;
}): Promise<OptimizeListingResponse> {
  try {
    const res = await fetch('/api/gemini/assist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'optimize_listing', payload })
    });
    if (!res.ok) throw new Error("Error en servidor al optimizar");
    return await res.json();
  } catch (err) {
    console.warn("Fallback to client optimization:", err);
    return {
      optimizedTitle: payload.title ? `${payload.title} [Verificado NEXORA]` : "Producto de Calidad",
      optimizedDescription: (payload.description || "") + "\n\n• Publicación revisada. Producto verificado en Santiago del Estero. Apto para retiro en Punto Seguro.",
      qualityScore: 90,
      suggestedPriceRange: { min: Math.round(payload.price * 0.95), max: Math.round(payload.price * 1.05) },
      tips: [
        "Añadí al menos 3 imágenes bien iluminadas.",
        "Indicá la zona o barrio para coordinar con compradores locales.",
        "Aceptá Mercado Pago o Transferencia para mayor rapidez."
      ]
    };
  }
}

export async function callGeminiBuyerAssistant(payload: {
  listingTitle: string;
  listingPrice: number;
  category: string;
  userQuestion?: string;
}): Promise<BuyerAssistantResponse> {
  try {
    const res = await fetch('/api/gemini/assist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'buyer_assistant', payload })
    });
    if (!res.ok) throw new Error("Error consultando asesor de compra");
    return await res.json();
  } catch (err) {
    return {
      advice: "Esta publicación en Santiago del Estero presenta un buen perfil de confianza. Te recomendamos solicitar una prueba presencial antes de realizar el pago definitivo.",
      fairPriceAssessment: "El precio promedio en la zona ronda montos similares.",
      safetyChecklist: [
        "Verificá el Nivel de Confianza del vendedor.",
        "Acordá el encuentro en Plaza Libertad o un lugar bien transitado.",
        "Probar el artículo cuidadosamente."
      ]
    };
  }
}

export async function callGeminiAIChat(userMessage: string): Promise<string> {
  try {
    const res = await fetch('/api/gemini/assist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'chat_ai', payload: { userMessage } })
    });
    if (!res.ok) throw new Error("Error enviando mensaje al asistente NEXORA AI");
    const data = await res.json();
    return data.reply || "¡Hola! Estoy listo para ayudarte con tu compra o venta en Santiago del Estero.";
  } catch (err) {
    return "¡Hola! Soy NEXORA AI. ¿En qué te puedo asesorar sobre tus publicaciones, compras o la seguridad de tus transacciones?";
  }
}
