"use client";

import { useState, useEffect } from "react";
import { Mail, CheckCircle2, ArrowRight, X } from "lucide-react";
import { supabase } from "@/src/lib/infrastructure/supabase-client";

export default function MarketingSplash() {
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({ 
    firstName: "", 
    lastName: "",
    phone: "",
    email: "",
    birthDate: "",
    website: "" // Honeypot field
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Check if the user already subscribed
    const hasSubscribed = localStorage.getItem("oha_subscriber");
    const hasDismissed = sessionStorage.getItem("oha_dismissed");
    
    if (!hasSubscribed && !hasDismissed) {
      // Show splash after a small delay for better UX
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setShow(false);
    // Usamos sessionStorage para que vuelva a aparecer si recarga la página en una nueva sesión,
    // pero no moleste mientras navega ahora.
    sessionStorage.setItem("oha_dismissed", "true");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Honeypot check: if filled, it's a bot.
    if (formData.website) {
      console.warn("Spam detected");
      setSubmitted(true);
      setTimeout(() => setShow(false), 2000);
      return;
    }

    if (!formData.firstName.trim() || !formData.email.trim() || !formData.lastName.trim() || !formData.phone.trim() || !formData.birthDate) return;

    setIsSubmitting(true);
    
    // Save to Supabase subscribers table
    const { error } = await supabase
      .from('subscribers')
      .insert([
        { 
          first_name: formData.firstName.trim(), 
          last_name: formData.lastName.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          birth_date: formData.birthDate
        }
      ]);
      
    // Even if there's a unique constraint error (they already subscribed), we let them through.
    if (error && error.code !== '23505') {
       console.error("Error saving subscriber", error);
    }

    setIsSubmitting(false);
    setSubmitted(true);
    localStorage.setItem("oha_subscriber", "true");
    
    // Hide splash after a short success message delay
    setTimeout(() => {
      setShow(false);
    }, 2000);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-onyx/95 backdrop-blur-xl flex items-center justify-center px-6 animate-fade-in overflow-y-auto pt-10 pb-10">
      <div className="max-w-xl w-full bg-onyx border border-celeste-oh/30 p-8 sm:p-12 rounded-3xl shadow-2xl relative overflow-hidden text-center my-auto">
        
        {/* Botón Cerrar */}
        <button 
          onClick={handleClose}
          className="absolute top-6 right-6 p-2 text-alabaster/40 hover:text-white transition-colors z-[20]"
          aria-label="Cerrar"
        >
          <X className="w-6 h-6" />
        </button>
        
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-celeste-oh/20 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="h-14 w-14 mb-6 border border-celeste-oh/30 rounded-full flex items-center justify-center bg-onyx/80 backdrop-blur-md shadow-inner shadow-celeste-oh/10">
            <Mail className="h-5 w-5 text-celeste-oh" />
          </div>

          <h2 className="text-3xl font-serif text-white mb-2">
            Comunidad <span className="text-celeste-oh italic font-light">Exclusiva</span>
          </h2>
          
          <p className="text-alabaster/60 text-sm font-sans mb-8 leading-relaxed">
            Ingresa a nuestra lista de invitados para acceder y mantenerte informado de beneficios y promociones en Oh! Buenos Aires.
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="w-full space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="text-left">
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-alabaster/40 font-bold mb-1 ml-2">Nombre</label>
                  <input 
                    type="text" 
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-alabaster/10 rounded-xl px-4 py-3 text-sm font-sans text-alabaster focus:outline-none focus:border-celeste-oh transition-colors placeholder:text-alabaster/20"
                    placeholder="Tu nombre"
                  />
                </div>
                <div className="text-left">
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-alabaster/40 font-bold mb-1 ml-2">Apellido</label>
                  <input 
                    type="text" 
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-alabaster/10 rounded-xl px-4 py-3 text-sm font-sans text-alabaster focus:outline-none focus:border-celeste-oh transition-colors placeholder:text-alabaster/20"
                    placeholder="Tu apellido"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="text-left">
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-alabaster/40 font-bold mb-1 ml-2">Celular</label>
                  <input 
                    type="tel" 
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-alabaster/10 rounded-xl px-4 py-3 text-sm font-sans text-alabaster focus:outline-none focus:border-celeste-oh transition-colors placeholder:text-alabaster/20"
                    placeholder="+54 11 0000 0000"
                  />
                </div>
                <div className="text-left">
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-alabaster/40 font-bold mb-1 ml-2">Fecha de Nacimiento</label>
                  <input 
                    type="date" 
                    name="birthDate"
                    required
                    value={formData.birthDate}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-alabaster/10 rounded-xl px-4 py-3 text-sm font-sans text-alabaster focus:outline-none focus:border-celeste-oh transition-colors placeholder:text-alabaster/20 [color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="text-left">
                <label className="block text-[10px] uppercase tracking-[0.2em] text-alabaster/40 font-bold mb-1 ml-2">Correo Electrónico</label>
                <input 
                  type="email" 
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-alabaster/10 rounded-xl px-4 py-3 text-sm font-sans text-alabaster focus:outline-none focus:border-celeste-oh transition-colors placeholder:text-alabaster/20"
                  placeholder="ejemplo@correo.com"
                />
              </div>

              {/* Honeypot field - Hidden from users */}
              <div className="hidden" aria-hidden="true">
                <input 
                  type="text" 
                  name="website" 
                  tabIndex={-1}
                  value={formData.website}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>
              
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 mt-6 bg-brand-accent text-white font-bold uppercase tracking-[0.3em] text-[10px] rounded-xl flex items-center justify-center gap-3 hover:opacity-90 transition-colors disabled:opacity-70 group"
              >
                {isSubmitting ? (
                  <div className="h-4 w-4 rounded-full border-2 border-onyx/30 border-t-current animate-spin" />
                ) : (
                  <>
                    Suscribirme para Acceder
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="w-full h-48 flex flex-col items-center justify-center animate-fade-in">
              <CheckCircle2 className="h-16 w-16 text-emerald-400 mb-6" />
              <p className="text-emerald-400 font-medium tracking-wide">¡Gracias por unirte!</p>
              <p className="text-alabaster/40 text-xs mt-2">Accediendo a Oh! Buenos Aires...</p>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
