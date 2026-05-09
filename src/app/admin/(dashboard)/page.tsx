"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/infrastructure/supabase-client";
import { 
  Sparkles, 
  ImageIcon, 
  Store, 
  Tag, 
  Ticket, 
  Newspaper, 
  Calendar, 
  Settings, 
  Users,
  LayoutDashboard,
  Bell
} from "lucide-react";
import { InstagramIcon } from "@/src/components/Icons";
import HelpTooltip from "./components/HelpTooltip";

const DASHBOARD_CARDS = [
  { 
    id: "hero",
    title: "Carrusel Hero", 
    desc: "Imágenes de gran formato en la portada.", 
    href: "/admin/hero", 
    icon: Sparkles,
    color: "text-celeste-oh",
    help: "Sube imágenes de alta resolución (preferentemente 1920x1080) para el slider principal de la página de inicio."
  },
  { 
    id: "banners",
    title: "Banners Promos", 
    desc: "Publicidad y promociones rotativas.", 
    href: "/admin/banners", 
    icon: ImageIcon,
    color: "text-emerald-400",
    help: "Gestiona los banners publicitarios que aparecen entre secciones. Ideales para eventos de temporada."
  },
  { 
    id: "brands",
    title: "Marcas", 
    desc: "Gestión de tiendas y locales.", 
    href: "/admin/brands", 
    icon: Store,
    color: "text-amber-400",
    help: "Añade o edita los locales comerciales, sus logos, teléfonos y ubicación exacta en el shopping."
  },
  { 
    id: "categories",
    title: "Categorías", 
    desc: "Clasificación de marcas y locales.", 
    href: "/admin/categories", 
    icon: Tag,
    color: "text-purple-400",
    help: "Define las categorías (Moda, Joyería, etc.) para filtrar las marcas en el catálogo."
  },
  { 
    id: "promotions",
    title: "Promociones", 
    desc: "Ofertas y beneficios activos.", 
    href: "/admin/promotions", 
    icon: Ticket,
    color: "text-rose-400",
    help: "Crea descuentos y beneficios exclusivos vinculados a las marcas registradas."
  },
  { 
    id: "news",
    title: "Noticias", 
    desc: "Artículos y novedades del shopping.", 
    href: "/admin/news", 
    icon: Newspaper,
    color: "text-blue-400",
    help: "Publica artículos sobre lanzamientos, eventos pasados o tendencias. Aparecen en la sección Novedades."
  },
  { 
    id: "agenda",
    title: "Agenda", 
    desc: "Eventos y fechas especiales.", 
    href: "/admin/agenda", 
    icon: Calendar,
    color: "text-orange-400",
    help: "Programa eventos futuros. Los usuarios verán qué está pasando en el shopping hoy y mañana."
  },
  { 
    id: "instagram",
    title: "Instagram Feed", 
    desc: "Curaduría del feed social.", 
    href: "/admin/instagram", 
    icon: InstagramIcon,
    color: "text-pink-500",
    help: "Selecciona qué publicaciones o Reels de Instagram quieres destacar en la página principal."
  },
  { 
    id: "settings",
    title: "Configuración", 
    desc: "Datos de contacto, redes y SEO.", 
    href: "/admin/settings", 
    icon: Settings,
    color: "text-slate-400",
    help: "Modifica el teléfono, email, dirección, links sociales y los servicios (Wi-Fi, Parking) del shopping."
  },
  { 
    id: "subscribers",
    title: "Suscriptores", 
    desc: "Base de datos del newsletter.", 
    href: "/admin/subscribers", 
    icon: Users,
    color: "text-indigo-400",
    help: "Visualiza la lista de personas que se han suscrito al newsletter del shopping para marketing."
  },
  { 
    id: "messages",
    title: "Mensajes", 
    desc: "Consultas del formulario de contacto.", 
    href: "/admin/messages", 
    icon: Newspaper,
    color: "text-emerald-400",
    help: "Bandeja de entrada para las consultas enviadas por los usuarios desde la web."
  },
];

export default function DashboardHome() {
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const fetchPending = async () => {
      const { count } = await supabase
        .from("contact_messages")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");
      
      setPendingCount(count || 0);
    };

    fetchPending();
  }, []);

  return (
    <div className="pb-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-celeste-oh/20 rounded-2xl border border-celeste-oh/30">
            <LayoutDashboard className="w-6 h-6 text-celeste-oh" />
          </div>
          <div>
            <h2 className="text-3xl font-serif text-white">Panel Principal</h2>
            <p className="text-alabaster/60 font-sans text-sm">Gestión integral de contenidos y configuración.</p>
          </div>
        </div>
        
        {pendingCount > 0 && (
          <div className="flex items-center gap-3 px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-full animate-pulse">
            <Bell className="w-4 h-4 text-rose-500" />
            <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">
              {pendingCount} Mensajes Pendientes
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {DASHBOARD_CARDS.map((card) => (
          <div key={card.href} className="relative group">
            <a 
              href={card.href}
              className="block bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-xl transition-all hover:border-celeste-oh/40 hover:bg-white/[0.08] h-full flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-6">
                  <div className={`p-3 rounded-2xl bg-white/5 w-fit group-hover:scale-110 transition-transform ${card.color}`}>
                    <card.icon className="w-6 h-6" />
                  </div>
                  {card.id === 'messages' && pendingCount > 0 && (
                    <div className="h-3 w-3 bg-rose-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.6)]" />
                  )}
                </div>
                <div className="flex items-center gap-1 mb-2">
                  <h3 className="font-serif text-xl text-white group-hover:text-celeste-oh transition-colors">{card.title}</h3>
                  <HelpTooltip text={card.help} />
                </div>
                <p className="text-sm text-alabaster/40 leading-relaxed font-sans mb-6">{card.desc}</p>
              </div>
              
              <div className="flex items-center gap-2 text-celeste-oh text-[10px] font-bold uppercase tracking-[0.2em] group-hover:gap-4 transition-all">
                <span>Gestionar</span>
                <span className="text-lg leading-none">&rarr;</span>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
