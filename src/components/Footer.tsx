"use client";

import { useSettings } from "@/src/hooks/useSettings";

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.51"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

export default function Footer() {
  const { data: settings = {} } = useSettings();

  return (
    <footer className="py-20 px-6 border-t border-onyx/5 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-12">
        {/* Dirección / Google Maps */}
        <a 
          href={settings.social_google_maps || "https://maps.app.goo.gl/8Z1QYSy1anWy5jY96"} 
          target="_blank" 
          rel="noopener noreferrer"
          className="group flex flex-col sm:flex-row items-center justify-center gap-3 text-onyx/60 hover:text-celeste-oh transition-colors text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.4em] sm:tracking-[0.6em] mb-4 font-sans relative"
        >
          <div className="bg-celeste-oh/10 p-2 rounded-full group-hover:bg-celeste-oh/20 transition-all duration-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          </div>
          <span className="mt-1">{settings.contact_address || "Av Pueyrredon y Azcuenaga, Buenos Aires"}</span>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-celeste-oh group-hover:w-full transition-all duration-700" />
        </a>

        {/* Redes Sociales */}
        <div className="flex gap-12 md:gap-20">
          <a 
            href={settings.social_instagram || "https://instagram.com/ohbuenosaires"} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-3 transition-all"
          >
            <div className="h-14 w-14 rounded-full border border-celeste-oh/20 flex items-center justify-center group-hover:border-celeste-oh group-hover:bg-brand-accent transition-all shadow-sm">
              <InstagramIcon />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-onyx/40 group-hover:text-onyx transition-colors">Instagram</span>
          </a>

          <a 
            href={settings.social_linkedin || "https://www.linkedin.com/company/ohbuenosaires"} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-3 transition-all"
          >
            <div className="h-14 w-14 rounded-full border border-celeste-oh/20 flex items-center justify-center group-hover:border-celeste-oh group-hover:bg-brand-accent transition-all shadow-sm">
              <LinkedinIcon />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-onyx/40 group-hover:text-onyx transition-colors">LinkedIn</span>
          </a>
        </div>
        
        {/* LDE-System Signature Block */}
        <div className="w-full max-w-4xl pt-10 border-t border-onyx/5 flex justify-center">
           <a 
             href="https://lde-system.vercel.app/" 
             target="_blank" 
             rel="noopener noreferrer"
             className="text-[10px] font-bold uppercase tracking-[0.4em] text-onyx/40 hover:text-onyx transition-all duration-300 font-sans group"
           >
             Diseñado y Desarrollado por <span className="text-celeste-oh group-hover:text-brand-accent group-hover:drop-shadow-sm transition-all ml-1">LDE-System</span>
           </a>
        </div>
        
        <p className="text-onyx/60 text-[11px] font-bold tracking-[0.2em] text-center uppercase">
          © 2026 OH! BUENOS AIRES EXPERIENCE. TODOS LOS DERECHOS RESERVADOS.
        </p>
      </div>
    </footer>
  );
}
