"use client";

import { useState, useEffect } from "react";
import { Mail, Send, Phone, MapPin, AlertCircle, CheckCircle2 } from "lucide-react";
import { supabase } from "@/src/lib/infrastructure/supabase-client";
import { useSettings } from "@/src/hooks/useSettings";

export default function ContactSection() {
  const { data: settings = {} } = useSettings();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "", subject: "" });
  const [errors, setErrors] = useState({ name: false, email: false, message: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (errors[id as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [id]: false }));
    }
  };

  const validate = () => {
    const newErrors = {
      name: formData.name.trim() === "",
      email: !/^\S+@\S+\.\S+$/.test(formData.email.trim()),
      message: formData.message.trim() === ""
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check
    if (formData.subject) {
      console.warn("Spam blocked");
      setSubmitted(true);
      return;
    }

    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from("contact_messages")
        .insert([
          { 
            name: formData.name.trim(), 
            email: formData.email.trim(), 
            phone: formData.phone.trim(),
            message: formData.message.trim() 
          }
        ]);

      if (error) throw error;

      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "", subject: "" });
      setTimeout(() => setSubmitted(false), 8000);
    } catch (err: any) {
      console.error("Error sending message:", err);
      alert("Hubo un problema al enviar tu mensaje. Por favor intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="relative py-24 px-6 sm:px-12 lg:px-24 flex items-center justify-center overflow-hidden bg-onyx text-alabaster lg:min-h-[85vh]">
      {/* Background blend just like Hero to ensure UI layers correctly */}
      <div className="absolute inset-0 ornament-bg mix-blend-soft-light opacity-40 animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-onyx/40 to-onyx" />

      <div className="max-w-7xl w-full mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Info Side */}
          <div className="flex-1 lg:max-w-md flex flex-col justify-center">
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-6 leading-tight">
              Atención <span className="text-celeste-oh font-light italic">Personalizada</span>
            </h2>
            
            <p className="text-alabaster/60 font-sans text-sm md:text-base leading-relaxed mb-12">
              Estamos a entera disposición para acompañarte. Dejanos tus datos y nuestro equipo se comunicará a la brevedad para brindarte una asistencia exclusiva.
            </p>

            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-5 group">
                <div className="h-12 w-12 rounded-full border border-celeste-oh/20 bg-onyx overflow-hidden relative flex items-center justify-center shadow-sm">
                  <div className="absolute inset-0 bg-celeste-oh/10 -translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <Phone className="h-4 w-4 text-celeste-oh relative z-10" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-alabaster/40 font-bold mb-1">Teléfono</p>
                  <p className="text-sm md:text-base font-medium tracking-wide group-hover:text-celeste-oh transition-colors">{settings.contact_phone || "+54 11 4000 0000"}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-5 group">
                <div className="h-12 w-12 rounded-full border border-celeste-oh/20 bg-onyx overflow-hidden relative flex items-center justify-center shadow-sm">
                  <div className="absolute inset-0 bg-celeste-oh/10 -translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <MapPin className="h-4 w-4 text-celeste-oh relative z-10" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-alabaster/40 font-bold mb-1">Ubicación</p>
                  <p className="text-sm md:text-base font-medium tracking-wide group-hover:text-celeste-oh transition-colors">{settings.contact_address || "Av Pueyrredon y Azcuenaga"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="flex-1 flex items-center justify-center">
            <form onSubmit={handleSubmit} noValidate className="w-full max-w-lg space-y-8 bg-white/[0.02] backdrop-blur-md p-8 sm:p-12 border border-white/5 rounded-2xl relative overflow-hidden group shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-celeste-oh/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex justify-center mb-10">
                  <div className="h-14 w-14 flex items-center justify-center border border-celeste-oh/30 rounded-full shadow-inner shadow-celeste-oh/10 bg-onyx/80 backdrop-blur-md">
                    <Mail className="h-6 w-6 text-celeste-oh" />
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="group/input relative">
                    <label htmlFor="name" className={`block text-[10px] uppercase tracking-[0.2em] font-bold mb-2 transition-colors ${errors.name ? 'text-red-500' : 'text-alabaster/40 group-focus-within/input:text-celeste-oh'}`}>
                      Nombre Completo
                    </label>
                    <input 
                      type="text" 
                      id="name" 
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full bg-transparent border-b py-3 text-sm focus:outline-none transition-colors font-sans text-alabaster ${errors.name ? 'border-red-500/50 placeholder:text-red-500/30' : 'border-alabaster/20 focus:border-celeste-oh placeholder:text-alabaster/10'}`}
                      placeholder="Ej. María Pérez"
                    />
                    {errors.name && <AlertCircle className="absolute right-0 bottom-3 w-4 h-4 text-red-500" />}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group/input relative">
                      <label htmlFor="email" className={`block text-[10px] uppercase tracking-[0.2em] font-bold mb-2 transition-colors ${errors.email ? 'text-red-500' : 'text-alabaster/40 group-focus-within/input:text-celeste-oh'}`}>
                        Correo Electrónico
                      </label>
                      <input 
                        type="email" 
                        id="email" 
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full bg-transparent border-b py-3 text-sm focus:outline-none transition-colors font-sans text-alabaster ${errors.email ? 'border-red-500/50 placeholder:text-red-500/30' : 'border-alabaster/20 focus:border-celeste-oh placeholder:text-alabaster/10'}`}
                        placeholder="maria@ejemplo.com"
                      />
                      {errors.email && <AlertCircle className="absolute right-0 bottom-3 w-4 h-4 text-red-500" />}
                    </div>
                    <div className="group/input relative">
                      <label htmlFor="phone" className="block text-[10px] uppercase tracking-[0.2em] font-bold mb-2 text-alabaster/40 group-focus-within/input:text-celeste-oh transition-colors">
                        Teléfono (Opcional)
                      </label>
                      <input 
                        type="tel" 
                        id="phone" 
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b py-3 text-sm focus:outline-none transition-colors font-sans text-alabaster border-alabaster/20 focus:border-celeste-oh placeholder:text-alabaster/10"
                        placeholder="+54 11 ..."
                      />
                    </div>
                  </div>

                  <div className="group/input relative">
                    <label htmlFor="message" className={`block text-[10px] uppercase tracking-[0.2em] font-bold mb-2 transition-colors ${errors.message ? 'text-red-500' : 'text-alabaster/40 group-focus-within/input:text-celeste-oh'}`}>
                      Mensaje
                    </label>
                    <textarea 
                      id="message" 
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      className={`w-full bg-transparent border-b py-3 text-sm focus:outline-none transition-colors resize-none font-sans text-alabaster ${errors.message ? 'border-red-500/50 placeholder:text-red-500/30' : 'border-alabaster/20 focus:border-celeste-oh placeholder:text-alabaster/10'}`}
                      placeholder="En qué le podemos ayudar..."
                    />
                    {errors.message && <AlertCircle className="absolute right-2 bottom-4 w-4 h-4 text-red-500" />}
                  </div>

                  {/* Honeypot field */}
                  <div className="hidden" aria-hidden="true">
                    <input 
                      type="text" 
                      id="subject" 
                      tabIndex={-1}
                      value={formData.subject}
                      onChange={handleChange}
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div className="mt-10">
                  <button 
                    type="submit" 
                    disabled={isSubmitting || submitted}
                    className={`w-full h-14 text-[11px] font-bold uppercase tracking-[0.4em] flex items-center justify-center gap-3 transition-all duration-300 group/btn overflow-hidden relative shadow-lg ${submitted ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 cursor-default' : 'bg-brand-accent text-white text-shadow-hero hover:opacity-90 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 btn-liquid'}`}
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      {isSubmitting ? (
                        <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                      ) : submitted ? (
                        <>
                          Mensaje Enviado
                          <CheckCircle2 className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          Enviar Consulta
                          <Send className="w-3.5 h-3.5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                        </>
                      )}
                    </span>
                  </button>
                  
                  <div className={`mt-4 font-medium text-xs text-center text-alabaster/70 transition-all duration-500 overflow-hidden ${submitted ? "max-h-10 opacity-100 transform translate-y-0" : "max-h-0 opacity-0 transform translate-y-2"}`}>
                    Gracias por contactarnos. Nuestro concierge se comunicará a la brevedad.
                  </div>
                </div>
              </div>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
