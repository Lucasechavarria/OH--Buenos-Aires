"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/src/lib/infrastructure/supabase-client";
import { LogOut, Image as ImageIcon, Tag, Store, LayoutDashboard, Mail } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/banners", label: "Banners", icon: ImageIcon },
  { href: "/admin/brands", label: "Marcas", icon: Store },
  { href: "/admin/categories", label: "Categorías", icon: Tag },
  { href: "/admin/promotions", label: "Promociones", icon: Tag },
  { href: "/admin/subscribers", label: "Suscriptores", icon: Mail },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="w-64 bg-onyx border-r border-celeste-oh/10 h-screen sticky top-0 flex flex-col hidden md:flex">
      <div className="h-20 flex items-center px-8 border-b border-celeste-oh/10">
        <h1 className="text-xl font-serif text-white">
          OH! <span className="text-celeste-oh italic font-light">Admin</span>
        </h1>
      </div>

      <nav className="flex-1 py-8 px-4 flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-sans text-sm ${isActive ? 'bg-celeste-oh/10 text-celeste-oh font-medium' : 'text-alabaster/60 hover:text-alabaster hover:bg-white/5'}`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-celeste-oh/10">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-sans text-sm text-red-400 hover:bg-red-500/10 w-full text-left"
        >
          <LogOut className="w-4 h-4" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
