"use client";

import Header from "@/src/features/catalog/components/Header";
import { motion } from "framer-motion";
import { Clock, MapPin, Car, Wifi, Dog, ShieldCheck, Phone, Mail, ChevronRight } from "lucide-react";
import ContactSection from "@/src/components/ContactSection";

const SERVICES = [
  { icon: Car, title: "Estacionamiento", desc: "Servicio de Valet Parking y 3 niveles de parking subterráneo." },
  { icon: Wifi, title: "Wi-Fi High Speed", desc: "Conectividad total en todas las áreas comunes y terrazas." },
  { icon: Dog, title: "Pet Friendly", desc: "Tus compañeros de cuatro patas son bienvenidos en nuestro shopping." },
  { icon: ShieldCheck, title: "Seguridad 24/7", desc: "Personal de seguridad y monitoreo constante para tu tranquilidad." },
];

export default function VisitaPage() {
  return (
    <main className="min-h-screen bg-alabaster selection:bg-celeste-oh selection:text-white">
      <Header />
      
      {/* Hero Sección Visita */}
      <section className="relative pt-40 pb-24 px-6 bg-onyx text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 space-y-10">
            <h1 className="text-4xl md:text-7xl font-serif leading-tight">
              Planificá <br />
              <span className="text-celeste-oh">tu Visita</span>
            </h1>
            <p className="text-alabaster/60 text-lg md:text-xl font-medium leading-relaxed font-sans max-w-lg">
              Estamos ubicados en el corazón de Recoleta, diseñados para ofrecerte una experiencia de confort desde el momento en que llegás.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-4 py-2 border border-white/10 rounded-full">
                <Clock className="w-4 h-4 text-celeste-oh" />
                <span>Locales: 10 a 22hs</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-4 py-2 border border-white/10 rounded-full">
                <Utensils className="w-4 h-4 text-celeste-oh" />
                <span>Gastronomía: 10 a 00hs</span>
              </div>
            </div>
          </div>
          <div className="flex-1 relative aspect-square w-full max-w-md">
            <div className="absolute inset-0 border-2 border-celeste-oh/30 rounded-full animate-[spin_20s_linear_infinite]" />
            <div className="absolute inset-4 overflow-hidden rounded-full shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?auto=format&fit=crop&q=80&w=800" 
                alt="OH! Buenos Aires Exterior" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Horarios & Ubicación */}
      <section className="py-24 px-6 lg:px-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-serif text-onyx mb-8">Ubicación Estratégica</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-celeste-oh shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-bold uppercase tracking-widest text-onyx/40 mb-1">Dirección</p>
                    <p className="text-lg text-onyx font-medium">Av Pueyrredón y Azcuénaga, Recoleta</p>
                    <p className="text-sm text-onyx/60">Ciudad Autónoma de Buenos Aires, Argentina</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-celeste-oh shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-bold uppercase tracking-widest text-onyx/40 mb-1">Contacto</p>
                    <p className="text-lg text-onyx font-medium">+54 11 4000 0000</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-celeste-oh shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-bold uppercase tracking-widest text-onyx/40 mb-1">Email</p>
                    <p className="text-lg text-onyx font-medium">info@ohbuenosaires.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-10 rounded-3xl bg-celeste-oh/5 border border-celeste-oh/10">
              <h3 className="text-xl font-serif text-onyx mb-6">¿Cómo llegar?</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-sm text-onyx/60 font-medium">
                  <ChevronRight className="w-4 h-4 text-celeste-oh" />
                  <span>Subte Línea H: Estación Las Heras</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-onyx/60 font-medium">
                  <ChevronRight className="w-4 h-4 text-celeste-oh" />
                  <span>Líneas de Colectivo: 60, 41, 118, 93, 10, 37</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-onyx/60 font-medium">
                  <ChevronRight className="w-4 h-4 text-celeste-oh" />
                  <span>Bicicleta: Estación Ecobici Recoleta</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-onyx/5">
             <iframe 
               src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.814298150419!2d-58.3973!3d-34.585!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcca9806637b77%3A0x6b49e6f2f2164d4b!2sOH!%20Buenos%20Aires!5e0!3m2!1ses-419!2sar!4v1714500000000!5m2!1ses-419!2sar" 
               width="100%" 
               height="100%" 
               style={{ border: 0, filter: 'grayscale(0.5) contrast(1.1)' }} 
               allowFullScreen={true} 
               loading="lazy"
               referrerPolicy="no-referrer-when-downgrade"
             />
          </div>
        </div>
      </section>

      {/* Servicios Premium */}
      <section className="py-24 bg-onyx text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-24">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-serif mb-6">Servicios de Clase Mundial</h2>
            <p className="text-alabaster/40 text-lg">
              Diseñamos cada detalle para que tu estancia sea placentera, segura y totalmente conectada.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {SERVICES.map((svc, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-celeste-oh/50 transition-all group"
              >
                <div className="h-14 w-14 rounded-2xl bg-celeste-oh/10 flex items-center justify-center mb-6 group-hover:bg-celeste-oh/20 transition-colors">
                  <svc.icon className="h-6 w-6 text-celeste-oh" />
                </div>
                <h4 className="text-lg font-serif mb-3">{svc.title}</h4>
                <p className="text-alabaster/40 text-sm leading-relaxed">{svc.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ContactSection />
      
      <footer className="py-10 px-6 border-t border-onyx/5 text-center">
        <p className="text-onyx/40 text-[9px] font-bold uppercase tracking-[0.2em]">
          © 2026 OH! BUENOS AIRES EXPERIENCE. TODOS LOS DERECHOS RESERVADOS.
        </p>
      </footer>
    </main>
  );
}

// Sub-component needed
const Utensils = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
    <path d="M7 2v20"/>
    <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
  </svg>
);
