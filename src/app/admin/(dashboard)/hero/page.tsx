"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/infrastructure/supabase-client";
import { Plus, Trash2, Edit, XCircle, CheckCircle2, Image as ImageIcon, Save, X, Sparkles } from "lucide-react";

export default function HeroAdmin() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchHeroImages = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("hero_images").select("*").order("order_index", { ascending: true });
    if (error) console.error("Error fetching hero images:", error);
    if (data) setImages(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchHeroImages();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      let image_url = "";
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('hero').upload(fileName, file);
        if (uploadError) throw uploadError;
        const { data: publicData } = supabase.storage.from('hero').getPublicUrl(fileName);
        image_url = publicData.publicUrl;
      }

      const { error: dbError } = await supabase.from("hero_images").insert([
        { title, image_url, active: true, order_index: images.length }
      ]);

      if (dbError) throw dbError;
      
      setTitle("");
      setFile(null);
      fetchHeroImages();
      alert("Imagen de Hero añadida");
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    const { error } = await supabase.from("hero_images").update({ active: !current }).eq("id", id);
    if (error) alert("Error: " + error.message);
    fetchHeroImages();
  };

  const handleDelete = async (id: string) => {
    if (confirmId !== id) {
      setConfirmId(id);
      setTimeout(() => setConfirmId(prev => prev === id ? null : prev), 3000);
      return;
    }
    setConfirmId(null);
    setDeletingId(id);
    
    try {
      const { error } = await supabase.from("hero_images").delete().eq("id", id);
      if (error) throw error;
      fetchHeroImages();
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setUploading(true);

    try {
      const updateData: any = { title };
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        await supabase.storage.from('hero').upload(fileName, file);
        const { data: publicData } = supabase.storage.from('hero').getPublicUrl(fileName);
        updateData.image_url = publicData.publicUrl;
      }

      const { error } = await supabase.from("hero_images").update(updateData).eq("id", editingId);
      if (error) throw error;

      setEditingId(null);
      setTitle("");
      setFile(null);
      fetchHeroImages();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="pb-20">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-celeste-oh/20 rounded-2xl border border-celeste-oh/30">
          <Sparkles className="w-6 h-6 text-celeste-oh" />
        </div>
        <div>
          <h2 className="text-3xl font-serif text-white">Carrusel Hero</h2>
          <p className="text-alabaster/60 font-sans text-sm">Gestiona las imágenes de portada inmersivas de la Home.</p>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-xl mb-12">
        <h3 className="font-bold text-xl text-white font-serif mb-6">
          {editingId ? "Editar Imagen Hero" : "Nueva Imagen Hero"}
        </h3>
        <form onSubmit={editingId ? handleUpdate : handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-alabaster/40 font-bold mb-2">Etiqueta/Título (Opcional)</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Ej: Nueva Temporada" className="w-full bg-onyx/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-celeste-oh transition-all" />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-alabaster/40 font-bold mb-2">Imagen (1920x1080 recomendado)</label>
              <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} required={!editingId} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:uppercase file:bg-celeste-oh/10 file:text-celeste-oh text-alabaster/40" />
            </div>
          </div>
          <div className="flex items-end">
            <button disabled={uploading} type="submit" className="px-8 py-4 bg-celeste-oh text-onyx rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-lg w-full md:w-fit">
              {uploading ? "Subiendo..." : editingId ? "Guardar Cambios" : "Agregar al Hero"}
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? <p className="text-white/40">Cargando...</p> : images.map(img => (
          <div key={img.id} className={`group relative rounded-3xl overflow-hidden border transition-all ${img.active ? 'border-white/10' : 'border-red-500/20 grayscale opacity-50'}`}>
            <div className="aspect-video relative">
              <img src={img.image_url} alt={img.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-onyx/80 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="text-white font-serif">{img.title || "Sin título"}</p>
              </div>
            </div>
            <div className="p-6 bg-white/5 backdrop-blur-md flex items-center justify-between">
              <div className="flex gap-2">
                <button onClick={() => toggleActive(img.id, img.active)} className={`p-2 rounded-lg border transition-all ${img.active ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : 'border-amber-500/30 text-amber-400 bg-amber-500/10'}`}>
                  {img.active ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                </button>
                <button onClick={() => { setEditingId(img.id); setTitle(img.title || ""); }} className="p-2 rounded-lg border border-white/10 text-white hover:bg-white/10">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              <button 
                onClick={() => handleDelete(img.id)}
                className={`p-2 rounded-lg border transition-all ${confirmId === img.id ? 'bg-red-600 border-red-500 text-white' : 'border-red-500/30 text-red-400 hover:bg-red-500/10'}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
