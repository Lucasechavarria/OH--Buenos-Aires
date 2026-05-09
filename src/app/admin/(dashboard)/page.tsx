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
  LayoutDashboard
} from "lucide-react";
import { InstagramIcon } from "@/src/components/Icons";

const DASHBOARD_CARDS = [
  { 
    title: "Carrusel Hero", 
    desc: "Imágenes de gran formato en la portada.", 
    href: "/admin/hero", 
    icon: Sparkles,
    color: "text-celeste-oh"
  },
  { 
    title: "Banners Promos", 
    desc: "Publicidad y promociones rotativas.", 
    href: "/admin/banners", 
    icon: ImageIcon,
    color: "text-emerald-400"
  },
  { 
    title: "Marcas", 
    desc: "Gestión de tiendas y locales.", 
    href: "/admin/brands", 
    icon: Store,
    color: "text-amber-400"
  },
  { 
    title: "Categorías", 
    desc: "Clasificación de marcas y locales.", 
    href: "/admin/categories", 
    icon: Tag,
    color: "text-purple-400"
  },
  { 
    title: "Promociones", 
    desc: "Ofertas y beneficios activos.", 
    href: "/admin/promotions", 
    icon: Ticket,
    color: "text-rose-400"
  },
  { 
    title: "Noticias", 
    desc: "Artículos y novedades del shopping.", 
    href: "/admin/news", 
    icon: Newspaper,
    color: "text-blue-400"
  },
  { 
    title: "Agenda", 
    desc: "Eventos y fechas especiales.", 
    href: "/admin/agenda", 
    icon: Calendar,
    color: "text-orange-400"
  },
  { 
    title: "Instagram Feed", 
    desc: "Curaduría del feed social.", 
    href: "/admin/instagram", 
    icon: InstagramIcon,
    color: "text-pink-500"
  },
  { 
    title: "Configuración", 
    desc: "Datos de contacto, redes y SEO.", 
    href: "/admin/settings", 
    icon: Settings,
    color: "text-slate-400"
  },
  { 
    title: "Suscriptores", 
    desc: "Base de datos del newsletter.", 
    href: "/admin/subscribers", 
    icon: Users,
    color: "text-indigo-400"
  },
];

export default function DashboardHome() {
  return (
    <div className="pb-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-celeste-oh/20 rounded-2xl border border-celeste-oh/30">
          <LayoutDashboard className="w-6 h-6 text-celeste-oh" />
        </div>
        <div>
          <h2 className="text-3xl font-serif text-white">Panel Principal</h2>
          <p className="text-alabaster/60 font-sans text-sm">Gestión integral de contenidos y configuración.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {DASHBOARD_CARDS.map((card, idx) => (
          <a 
            key={card.href}
            href={card.href}
            className="group bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-xl transition-all hover:border-celeste-oh/40 hover:bg-white/[0.08] flex flex-col justify-between"
          >
            <div>
              <div className={`p-3 rounded-2xl bg-white/5 w-fit mb-6 group-hover:scale-110 transition-transform ${card.color}`}>
                <card.icon className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl mb-2 text-white group-hover:text-celeste-oh transition-colors">{card.title}</h3>
              <p className="text-sm text-alabaster/40 leading-relaxed font-sans mb-6">{card.desc}</p>
            </div>
            
            <div className="flex items-center gap-2 text-celeste-oh text-[10px] font-bold uppercase tracking-[0.2em] group-hover:gap-4 transition-all">
              <span>Gestionar</span>
              <span className="text-lg leading-none">&rarr;</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
