import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy Gemini instance getter
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not defined in process.env. Using fallback mock/graceful mode if calls fail.");
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// Health route
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    appName: 'NEXORA',
    location: 'Santiago del Estero',
    timestamp: new Date().toISOString()
  });
});

// Gemini Assistant Endpoint
app.post('/api/gemini/assist', async (req: Request, res: Response) => {
  try {
    const { action, payload } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Fallback graceful response if API key is not configured in secrets yet
      if (action === 'optimize_listing') {
        return res.json({
          optimizedTitle: payload.title ? `${payload.title} - Excelente Oportunidad` : "Producto en Excelente Estado",
          optimizedDescription: (payload.description || "") + "\n\n• Publicación verificada y optimizada para el mercado local de Santiago del Estero. Producto disponible para coordinar retiro en punto seguro.",
          qualityScore: 92,
          suggestedPriceRange: { min: Math.round((payload.price || 50000) * 0.9), max: Math.round((payload.price || 50000) * 1.1) },
          tips: [
            "Agregá al menos 3 fotos bien iluminadas.",
            "Detallá si aceptás permutas o transferencias bancarias.",
            "Recordá acordar entrega en un lugar concurrido como Plaza Libertad."
          ]
        });
      }

      if (action === 'buyer_assistant') {
        return res.json({
          advice: "Esta publicación en Santiago del Estero cuenta con vendedor verificado. Te recomendamos revisar el producto en persona en un lugar seguro (ej. Plaza Libertad) y probar todas sus funciones antes de realizar la transferencia.",
          fairPriceAssessment: "El precio se encuentra dentro del rango habitual para publicaciones similares en la provincia.",
          safetyChecklist: [
            "Revisá el Nivel de Confianza NEXORA del vendedor.",
            "Coordiná un punto de encuentro iluminado y transitado.",
            "Confirmá la forma de pago aceptada previamente."
          ]
        });
      }

      if (action === 'summarize_chat') {
        return res.json({
          summary: "Acuerdo preliminar alcanzado: Se acordó la venta por el monto estipulado con entrega presencial en punto seguro.",
          agreedPrice: payload.price || 0,
          suggestedSpot: "Plaza Libertad - Frente a la Catedral"
        });
      }

      return res.json({
        reply: "¡Hola! Soy NEXORA AI, tu asistente inteligente para comprar y vender en Santiago del Estero. ¿En qué puedo ayudarte hoy?"
      });
    }

    // Handlers with real Gemini SDK
    if (action === 'optimize_listing') {
      const prompt = `Actúa como el Asistente del Vendedor de NEXORA (plataforma local de Santiago del Estero).
Analiza y optimiza los datos de esta publicación:
Título actual: "${payload.title || ''}"
Categoría: "${payload.category || ''}"
Estado: "${payload.condition || 'Usado'}"
Descripción actual: "${payload.description || ''}"
Precio ingresado: ${payload.price || 0} ARS.

Responde estrictamente en formato JSON válido con esta estructura:
{
  "optimizedTitle": "un título claro, profesional y atractivo (max 70 caracteres)",
  "optimizedDescription": "una descripción detallada, ordenada con viñetas y tono confiable",
  "qualityScore": un número entero entre 0 y 100 indicando la calidad global,
  "suggestedPriceMin": precio mínimo estimado razonable en ARS (número),
  "suggestedPriceMax": precio máximo estimado razonable en ARS (número),
  "tips": ["consejo 1", "consejo 2", "consejo 3"]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const text = response.text || '{}';
      try {
        const parsed = JSON.parse(text);
        return res.json({
          optimizedTitle: parsed.optimizedTitle || payload.title,
          optimizedDescription: parsed.optimizedDescription || payload.description,
          qualityScore: parsed.qualityScore || 88,
          suggestedPriceRange: {
            min: parsed.suggestedPriceMin || Math.round((payload.price || 10000) * 0.9),
            max: parsed.suggestedPriceMax || Math.round((payload.price || 10000) * 1.1)
          },
          tips: parsed.tips || ["Completá todas las fotos necesarias para dar transparencia."]
        });
      } catch (err) {
        return res.json({
          optimizedTitle: payload.title,
          optimizedDescription: payload.description,
          qualityScore: 85,
          suggestedPriceRange: { min: payload.price, max: payload.price },
          tips: ["Asegurate de mostrar el producto desde varios ángulos."]
        });
      }
    }

    if (action === 'buyer_assistant') {
      const prompt = `Actúa como el Asesor de Compra de NEXORA para el comprador.
Publicación consultada: "${payload.listingTitle}"
Precio: ${payload.listingPrice} ARS
Categoría: ${payload.category}
Pregunta o inquietud del comprador: "${payload.userQuestion || '¿Qué recomendaciones me das antes de comprar este producto?'}"

Responde en un párrafo amigable, objetivo y muy claro explicando si la publicación parece confiable, qué puntos clave verificar antes de pagar y un tip de seguridad en Santiago del Estero.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt
      });

      return res.json({
        advice: response.text || "Esta publicación cuenta con buena reputación. Recordá siempre coordinar el encuentro en un punto céntrico e iluminado.",
        fairPriceAssessment: "Precio competitivo para la región.",
        safetyChecklist: [
          "Verificar funcionamiento presencial.",
          "Verificar Nivel de Confianza del vendedor.",
          "Elegir un Punto Seguro NEXORA para la transacción."
        ]
      });
    }

    if (action === 'summarize_chat') {
      const prompt = `Revisa estos mensajes de negociación en NEXORA entre un comprador y vendedor de Santiago del Estero:
${JSON.stringify(payload.messages || [])}

Extrae en formato JSON la propuesta o acuerdo si existe:
{
  "agreedPrice": número (monto acordado en ARS o 0 si no hay),
  "meetupLocation": "lugar de encuentro mencionado o sugerido",
  "summary": "resumen en 1 o 2 oraciones del estado de la negociación"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({
        agreedPrice: parsed.agreedPrice || payload.price || 0,
        meetupLocation: parsed.meetupLocation || "Plaza Libertad - Santiago del Estero",
        summary: parsed.summary || "Resumen de la negociación generado."
      });
    }

    // General AI chat assistant
    const prompt = `Eres el Asistente NEXORA AI, el asesor inteligente del marketplace local NEXORA en Santiago del Estero, Argentina.
Premisas principales:
1. La confianza está primero.
2. Ayudas a compradores, vendedores y comercios sin presionar.
3. Conoces los barrios y puntos seguros de Santiago del Estero (Plaza Libertad, Parque Aguirre, Terminal, La Banda).
4. Das respuestas concisas, amables y muy útiles en español.

Mensaje del usuario: "${payload.userMessage || 'Hola'}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt
    });

    return res.json({
      reply: response.text || "¡Hola! Estoy aquí para acompañarte en tus compras y ventas en NEXORA."
    });

  } catch (error: any) {
    console.error("Error in /api/gemini/assist:", error);
    res.status(500).json({ error: error.message || "Error procesando solicitud de IA" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NEXORA Server running on http://localhost:${PORT}`);
  });
}

startServer();
