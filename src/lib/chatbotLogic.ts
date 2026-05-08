import { Brand } from "@/src/lib/domain/entities";
import { Promotion } from "@/src/features/catalog/services/promotionService";
import { Event } from "@/src/features/catalog/services/agendaService";

interface BotContext {
  pathname: string;
  brands: Brand[];
  promotions: Promotion[];
  events: Event[];
}

// Simple fuzzy search helper
const isFuzzyMatch = (input: string, target: string): boolean => {
  if (input.length < 3) return target.includes(input);
  
  // Basic distance check (very simplified for performance)
  let matches = 0;
  const lowerTarget = target.toLowerCase();
  const lowerInput = input.toLowerCase();
  
  if (lowerTarget.includes(lowerInput)) return true;
  
  // Check if at least 70% of characters match in sequence
  for (let i = 0; i < lowerInput.length; i++) {
    if (lowerTarget.indexOf(lowerInput[i]) !== -1) matches++;
  }
  
  return (matches / lowerInput.length) > 0.8;
};

export const getBotResponse = (input: string, context: BotContext): string => {
  const query = input.toLowerCase();
  const { brands, promotions, events, pathname } = context;

  // 0. Contextual Greeting (if it's the first message or specific intent)
  if (query === "hola" || query === "hi") {
    if (pathname.includes("/gastronomia")) {
      return "¡Hola! Bienvenido al sector Gastronómico de OH!. ¿Buscás alguna mesa en especial o querés ver las opciones de hoy?";
    }
    if (pathname.includes("/marcas")) {
      return "¡Hola! Estoy aquí para ayudarte a encontrar tus marcas favoritas. ¿Buscás alguna en particular?";
    }
    return "Bienvenido a OH! Buenos Aires. Soy tu asistente de Luxury Shopping. ¿En qué puedo ayudarte hoy?";
  }

  // 1. Ubicación y Cómo Llegar
  if (query.includes("llegar") || query.includes("ubicacion") || query.includes("donde") || query.includes("direccion") || isFuzzyMatch(query, "como llego")) {
    return "Estamos ubicados en Av. Pueyrredón y Azcuénaga, Recoleta. Podés venir en el Subte H (Estación Las Heras) o varias líneas de colectivo (60, 41, 118). [Ver en Google Maps](https://maps.app.goo.gl/8Z1QYSy1anWy5jY96)";
  }

  // 2. Horarios
  if (query.includes("horario") || query.includes("abren") || query.includes("cierra")) {
    return "Nuestros locales comerciales abren de 10:00 a 22:00 hs. El área gastronómica y los rooftops extienden su horario hasta las 00:00 hs de lunes a jueves, y hasta las 02:00 hs los fines de semana.";
  }

  // 3. Estacionamiento
  if (query.includes("estacionamiento") || query.includes("auto") || query.includes("parking") || query.includes("valet")) {
    return "Contamos con 3 niveles de estacionamiento subterráneo y servicio de Valet Parking en la entrada de Av. Pueyrredón. El costo es de $3500 la hora o estadía bonificada con compras superiores a $50.000.";
  }

  // 4. Promociones
  if (query.includes("promo") || query.includes("descuento") || query.includes("oferta") || query.includes("banco")) {
    if (promotions.length > 0) {
      const promoList = promotions.slice(0, 2).map(p => `- ${p.title}: ${p.description}`).join("\n");
      return `¡Tenemos promociones exclusivas! \n${promoList}\n[Ver todas las promociones](/promociones)`;
    }
    return "Podés consultar todas nuestras promociones bancarias y beneficios exclusivos aquí: [Sección Promociones](/promociones)";
  }

  // 5. Agenda / Eventos
  if (query.includes("evento") || query.includes("agenda") || query.includes("hacer") || query.includes("finde") || query.includes("hoy")) {
    if (events.length > 0) {
      const eventList = events.slice(0, 3).map(e => `- ${e.title} (${e.date}) en ${e.location}`).join("\n");
      return `Esto es lo que está pasando en OH!: \n${eventList}\n[Ver agenda completa](/agenda)`;
    }
    return "Siempre hay algo pasando en OH!. Consultá nuestra agenda de eventos aquí: [Agenda OH!](/agenda)";
  }

  // 6. Intenciones de Negocio
  if (query.includes("alquilar") || query.includes("comercial") || query.includes("local")) {
    return "Para consultas sobre alquiler de locales y espacios comerciales, por favor contactate con nuestro departamento comercial en comercial@ohbuenosaires.com.";
  }
  if (query.includes("trabajar") || query.includes("empleo") || query.includes("cv") || query.includes("trabajo")) {
    return "¡Nos encantaría que te sumes al equipo! Podés enviarnos tu CV a talento@ohbuenosaires.com o seguir nuestras búsquedas en LinkedIn.";
  }
  if (query.includes("prensa") || query.includes("periodista") || query.includes("comunicacion")) {
    return "Para consultas de prensa y comunicación, por favor escribinos a prensa@ohbuenosaires.com.";
  }

  // 7. Infraestructura (ATM, EV, Moneda)
  if (query.includes("cajero") || query.includes("atm") || query.includes("efectivo")) {
    return "Contamos con cajeros automáticos en el nivel PB, cerca del acceso principal por Av. Pueyrredón.";
  }
  if (query.includes("electrico") || query.includes("carga") || query.includes("tesla") || query.includes("ev")) {
    return "Sí, contamos con estaciones de carga para vehículos eléctricos en el primer subsuelo del estacionamiento.";
  }
  if (query.includes("moneda") || query.includes("cambio") || query.includes("dolar") || query.includes("euro")) {
    return "Por el momento no contamos con casa de cambio dentro del complejo, pero podés encontrar varias opciones sobre la Av. Las Heras a pocos metros.";
  }

  // 8. Pet Friendly
  if (query.includes("perro") || query.includes("mascota") || query.includes("pet") || query.includes("animal")) {
    return "¡Somos Pet Friendly! Tus mascotas son bienvenidas en las áreas comunes. Recordá llevarlas con correa y consultar en cada local si permiten el ingreso a su interior.";
  }

  // 11. Objetos Perdidos
  if (query.includes("perdi") || query.includes("encontre") || query.includes("objetos perdidos")) {
    return "Si perdiste o encontraste algo, por favor acercate al Concierge de Planta Baja o contactate con Seguridad. Guardamos los objetos encontrados por un período de 30 días.";
  }

  // 12. Filtro de Seguridad / Lenguaje Inadecuado (Ejemplos básicos)
  const inappropriateWords = ["insulto1", "insulto2", "estupido", "tonto"]; // Placeholder para lista real
  if (inappropriateWords.some(word => query.includes(word))) {
    return "Por favor, mantengamos un lenguaje cordial para que pueda asistirte de la mejor manera con tu experiencia en OH! Buenos Aires.";
  }

  // 13. Búsqueda de Marcas y Recomendaciones
  const mentionedBrand = brands.find(b => query.includes(b.name?.toLowerCase() || "") || isFuzzyMatch(query, b.name));
  if (mentionedBrand) {
    const categoryBrands = brands.filter(b => 
      b.category?.slug === mentionedBrand.category?.slug && b.id !== mentionedBrand.id
    );
    let resp = `${mentionedBrand.name} se encuentra en el ${mentionedBrand.location?.floor || "PB"}. `;
    if (categoryBrands.length > 0) {
      resp += `Al ser una marca de ${mentionedBrand.category?.name || "su rubro"}, también te podrían interesar: ${categoryBrands.slice(0, 3).map(b => b.name).join(", ")}.`;
    }
    return resp;
  }

  // 14. Búsqueda por Categoría
  if (query.includes("moda") || query.includes("ropa") || query.includes("vestir") || query.includes("hombre") || query.includes("mujer")) {
    const modaBrands = brands.filter(b => b.category?.slug === "moda");
    if (modaBrands.length > 0) {
      return `Contamos con excelentes opciones de moda: ${modaBrands.slice(0, 5).map(b => b.name).join(", ")} y más. ¿Buscabas alguna marca en especial?`;
    }
  }

  if (query.includes("comer") || query.includes("hambre") || query.includes("gastronomia") || query.includes("restaurante") || query.includes("cafe")) {
    const gastroBrands = brands.filter(b => b.category?.slug === "gastronomia");
    if (gastroBrands.length > 0) {
      return `Nuestra oferta gastronómica incluye: ${gastroBrands.slice(0, 5).map(b => b.name).join(", ")}. También tenemos rooftops con vistas increíbles.`;
    }
  }

  // Default / Fallback Robusto
  return "No estoy seguro de haber entendido tu consulta. Si buscás algo muy específico, puedo derivarte con nuestro equipo de [Concierge humano](mailto:concierge@ohbuenosaires.com) o podés consultarme sobre Marcas, Promociones o cómo llegar.";
};
