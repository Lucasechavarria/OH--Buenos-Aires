"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/infrastructure/supabase-client";
import { Plus, Trash2, Edit, ImageIcon, Eye, EyeOff, Calendar, MapPin, Clock } from "lucide-react";

export default function AgendaAdmin() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [eventTime, setEventTime] = useState("");
  const [location, setLocation] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true });
    if (data) setEvents(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !eventDate) return;
    setUploading(true);
    
    try {
      let image_url = null;

      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('events')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: publicData } = supabase.storage.from('events').getPublicUrl(fileName);
        image_url = publicData.publicUrl;
      }

      const eventData: any = {
        title,
        description,
        category,
        event_date: eventDate,
        event_time: eventTime,
        location,
      };

      if (image_url) eventData.image_url = image_url;

      if (editingId) {
        const { error } = await supabase
          .from("events")
          .update(eventData)
          .eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("events")
          .insert([eventData]);
        if (error) throw error;
      }
      
      resetForm();
      fetchEvents();
      alert(editingId ? "Evento actualizado" : "Evento creado");
    } catch (err: any) {
      console.error(err);
      alert("Error: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("events")
        .update({ active: !currentStatus })
        .eq("id", id);
      if (error) throw error;
      fetchEvents();
    } catch (err: any) {
      alert("Error al cambiar estado: " + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este evento?")) return;
    try {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) throw error;
      fetchEvents();
    } catch (err: any) {
      alert("Error al eliminar: " + err.message);
    }
  };

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setTitle(item.title);
    setDescription(item.description || "");
    setCategory(item.category || "");
    setEventDate(item.event_date);
    setEventTime(item.event_time || "");
    setLocation(item.location || "");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setCategory("");
    setEventDate(new Date().toISOString().split('T')[0]);
    setEventTime("");
    setLocation("");
    setFile(null);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-serif text-white mb-2">Agenda (OH! Experience)</h2>
        <p className="text-alabaster/60 font-sans">Gestiona los eventos exclusivos y experiencias en el shopping.</p>
      </div>

      <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-celeste-oh/20 shadow-xl">
        <h3 className="font-bold text-xl text-white mb-6">{editingId ? "Editar Evento" : "Nuevo Evento"}</h3>
        <form onSubmit={handleCreateOrUpdate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-alabaster/40 font-bold mb-2">Título del Evento</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full bg-onyx/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-celeste-oh transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-alabaster/40 font-bold mb-2">Descripción</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-onyx/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-celeste-oh transition-colors h-24" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-alabaster/40 font-bold mb-2">Categoría</label>
                  <input type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="Ej: Música, Moda" className="w-full bg-onyx/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-celeste-oh transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-alabaster/40 font-bold mb-2">Fecha</label>
                  <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} required className="w-full bg-onyx/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-celeste-oh transition-colors" />
                </div>
              </div>
            </div>
            <div className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-alabaster/40 font-bold mb-2">Horario</label>
                    <input type="text" value={eventTime} onChange={e => setEventTime(e.target.value)} placeholder="Ej: 19:00 HS" className="w-full bg-onyx/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-celeste-oh transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-alabaster/40 font-bold mb-2">Ubicación</label>
                    <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Ej: Rooftop Piso 3" className="w-full bg-onyx/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-celeste-oh transition-colors" />
                  </div>
               </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-alabaster/40 font-bold mb-2">Imagen del Evento</label>
                <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:uppercase file:tracking-widest file:font-semibold file:bg-celeste-oh/10 file:text-celeste-oh text-alabaster/60" />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button disabled={uploading} type="submit" className="px-10 py-4 bg-celeste-oh text-onyx rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white transition-all disabled:opacity-50">
              {uploading ? "Procesando..." : editingId ? "Guardar Cambios" : "Crear Evento"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="px-10 py-4 border border-white/10 text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white/5 transition-all">
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? <p className="text-white/40 animate-pulse">Cargando agenda...</p> : events.map(item => (
          <div key={item.id} className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-celeste-oh/30 transition-all group">
            <div className="flex gap-6">
                <div className="h-32 w-24 rounded-xl overflow-hidden bg-onyx flex-shrink-0 relative">
                  {item.image_url ? (
                    <img src={item.image_url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/10"><Calendar className="w-8 h-8" /></div>
                  )}
                  {!item.active && <div className="absolute inset-0 bg-onyx/80 flex items-center justify-center"><span className="text-[8px] font-bold uppercase text-red-400 rotate-12 border border-red-400 p-1">Suspendido</span></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded bg-white/10 text-white/60 text-[8px] font-bold uppercase tracking-widest">{item.category}</span>
                  </div>
                  <h4 className="text-xl font-serif text-white truncate mb-3">{item.title}</h4>
                  
                  <div className="space-y-1.5">
                     <div className="flex items-center gap-2 text-[10px] text-white/40">
                        <Calendar className="w-3 h-3 text-celeste-oh" /> {item.event_date}
                     </div>
                     <div className="flex items-center gap-2 text-[10px] text-white/40">
                        <Clock className="w-3 h-3 text-celeste-oh" /> {item.event_time}
                     </div>
                     <div className="flex items-center gap-2 text-[10px] text-white/40">
                        <MapPin className="w-3 h-3 text-celeste-oh" /> {item.location}
                     </div>
                  </div>
                </div>
            </div>
            
            <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-white/5">
              <button onClick={() => toggleActive(item.id, item.active)} title={item.active ? "Suspender" : "Activar"} className={`p-2 rounded-lg transition-all ${item.active ? 'text-white/40 hover:text-white hover:bg-white/5' : 'text-celeste-oh bg-celeste-oh/10'}`}>
                {item.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button onClick={() => startEdit(item)} className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                <Edit className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(item.id)} className="p-2 text-red-400/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {!loading && events.length === 0 && <p className="text-center py-20 text-white/20 font-serif italic text-xl border border-dashed border-white/10 rounded-3xl col-span-full">No hay eventos en agenda.</p>}
      </div>
    </div>
  );
}
