"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/infrastructure/supabase-client";
import { Save, Settings, Phone, MapPin, Mail, Globe, ShieldCheck, Plus, Trash2, Edit } from "lucide-react";
import { InstagramIcon, LinkedinIcon } from "@/src/components/Icons";

export default function SettingsAdmin() {
  const [settings, setSettings] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states for settings
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  const fetchData = async () => {
    setLoading(true);
    const [settingsRes, servicesRes] = await Promise.all([
      supabase.from("site_settings").select("*"),
      supabase.from("site_services").select("*").order("order_index", { ascending: true })
    ]);

    if (settingsRes.data) {
      setSettings(settingsRes.data);
      const values: Record<string, string> = {};
      settingsRes.data.forEach(s => {
        values[s.key] = s.value;
      });
      setFormValues(values);
    }
    if (servicesRes.data) setServices(servicesRes.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSettingChange = (key: string, value: string) => {
    setFormValues(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(formValues).map(([key, value]) => ({
        key,
        value
      }));

      for (const update of updates) {
        await supabase.from("site_settings").update({ value: update.value }).eq("key", update.key);
      }
      
      alert("Configuración guardada correctamente");
    } catch (err: any) {
      alert("Error al guardar: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pb-20">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gold-heritage/20 rounded-2xl border border-gold-heritage/30">
            <Settings className="w-6 h-6 text-gold-heritage" />
          </div>
          <div>
            <h2 className="text-3xl font-serif text-white">Configuración Global</h2>
            <p className="text-alabaster/60 font-sans text-sm">Gestiona la información de contacto, redes sociales y SEO del sitio.</p>
          </div>
        </div>
        <button 
          onClick={saveSettings} 
          disabled={saving}
          className="px-8 py-4 bg-gold-metallic text-onyx rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-gold-shine transition-all shadow-lg flex items-center gap-2"
        >
          {saving ? "Guardando..." : <><Save className="w-4 h-4"/> Guardar Cambios</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contacto & Redes */}
        <div className="space-y-8">
          <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-xl">
            <h3 className="text-xl font-serif text-white mb-6 flex items-center gap-2">
              <Phone className="w-5 h-5 text-celeste-oh" /> Información de Contacto
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-alabaster/40 font-bold mb-2">Teléfono</label>
                <input type="text" value={formValues['contact_phone'] || ""} onChange={e => handleSettingChange('contact_phone', e.target.value)} className="w-full bg-onyx/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-celeste-oh transition-all" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-alabaster/40 font-bold mb-2">Email</label>
                <input type="email" value={formValues['contact_email'] || ""} onChange={e => handleSettingChange('contact_email', e.target.value)} className="w-full bg-onyx/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-celeste-oh transition-all" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-alabaster/40 font-bold mb-2">Dirección</label>
                <input type="text" value={formValues['contact_address'] || ""} onChange={e => handleSettingChange('contact_address', e.target.value)} className="w-full bg-onyx/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-celeste-oh transition-all" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-alabaster/40 font-bold mb-2">Link WhatsApp</label>
                <input type="text" value={formValues['contact_whatsapp'] || ""} onChange={e => handleSettingChange('contact_whatsapp', e.target.value)} className="w-full bg-onyx/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-celeste-oh transition-all" />
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-xl">
            <h3 className="text-xl font-serif text-white mb-6 flex items-center gap-2">
              <InstagramIcon className="w-5 h-5 text-celeste-oh" /> Redes Sociales
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-alabaster/40 font-bold mb-2">Instagram URL</label>
                <input type="text" value={formValues['social_instagram'] || ""} onChange={e => handleSettingChange('social_instagram', e.target.value)} className="w-full bg-onyx/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-celeste-oh transition-all" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-alabaster/40 font-bold mb-2">LinkedIn URL</label>
                <input type="text" value={formValues['social_linkedin'] || ""} onChange={e => handleSettingChange('social_linkedin', e.target.value)} className="w-full bg-onyx/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-celeste-oh transition-all" />
              </div>
            </div>
          </div>
        </div>

        {/* SEO & Servicios */}
        <div className="space-y-8">
          <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-xl">
            <h3 className="text-xl font-serif text-white mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5 text-celeste-oh" /> SEO Global
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-alabaster/40 font-bold mb-2">Meta Título (Home)</label>
                <input type="text" value={formValues['site_title'] || ""} onChange={e => handleSettingChange('site_title', e.target.value)} className="w-full bg-onyx/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-celeste-oh transition-all" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-alabaster/40 font-bold mb-2">Meta Descripción (Home)</label>
                <textarea value={formValues['site_description'] || ""} onChange={e => handleSettingChange('site_description', e.target.value)} rows={4} className="w-full bg-onyx/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-celeste-oh transition-all resize-none" />
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-xl opacity-60">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-serif text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-celeste-oh" /> Servicios (Visita)
                </h3>
                <span className="text-[8px] font-bold uppercase tracking-widest text-alabaster/40 bg-white/5 px-2 py-1 rounded">Próximamente</span>
             </div>
             <p className="text-sm text-alabaster/40 italic">La gestión detallada de servicios por cada local se activará en la siguiente fase.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
