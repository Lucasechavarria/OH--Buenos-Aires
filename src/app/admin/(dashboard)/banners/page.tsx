
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/infrastructure/supabase-client";
import { Plus, Trash2, Edit, XCircle, CheckCircle2, Image as ImageIcon, Link as LinkIcon, Save, X } from "lucide-react";

export default function BannersAdmin() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchBanners = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("banners").select("*").order("created_at", { ascending: false });
    if (error) {
        console.error("Error fetching banners:", error);
    }
    if (data) setBanners(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    setUploading(true);
    
    try {
      let image_url = "";

      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('banners')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: publicData } = supabase.storage.from('banners').getPublicUrl(filePath);
        image_url = publicData.publicUrl;
      }

      const { error: dbError } = await supabase.from("banners").insert([
        { title, image_url, link_url: linkUrl, active: true }
      ]);

      if (dbError) throw dbError;
      
      setTitle("");
      setLinkUrl("");
      setFile(null);
      fetchBanners();
      alert("Banner creado con éxito");
    } catch (err: any) {
      console.error(err);
      alert("Error al crear el banner: " + err.message + "\n\nTip: Asegúrate de tener la tabla 'banners' y el bucket 'banners' configurados en Supabase.");
    } finally {
      setUploading(false);
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    const { error } = await supabase.from("banners").update({ active: !current }).eq("id", id);
    if (error) alert("Error al actualizar: " + error.message);
    fetchBanners();
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
      const response = await fetch(`/api/v1/admin/banners/${id}`, {
        method: "DELETE",
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      
      fetchBanners();
    } catch (error: any) {
      alert("Error al eliminar: " + error.message);
    } finally {
      setDeletingId(null);
    }
  };

  const startEdit = (banner: any) => {
    setEditingId(banner.id);
    setTitle(banner.title);
    setLinkUrl(banner.link_url || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setLinkUrl("");
    setFile(null);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setUploading(true);

    try {
      const updateData: any = { title, link_url: linkUrl };

      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('banners')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: publicData } = supabase.storage.from('banners').getPublicUrl(fileName);
        updateData.image_url = publicData.publicUrl;
      }

      const { error } = await supabase.from("banners").update(updateData).eq("id", editingId);
      if (error) throw error;

      cancelEdit();
      fetchBanners();
      alert("Banner actualizado");
    } catch (err: any) {
      alert("Error al actualizar: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="pb-20">
      <div className="flex items-center gap-4 mb-2">
        <div className="p-3 bg-gold-heritage/20 rounded-2xl border border-gold-heritage/30">
          <ImageIcon className="w-6 h-6 text-gold-heritage" />
        </div>
        <div>
          <h2 className="text-3xl font-serif text-white">Banners Promocionales</h2>
          <p className="text-alabaster/60 font-sans text-sm">Gestiona las imágenes rotativas de la pantalla principal.</p>
        </div>
      </div>

      {/* Formulario de Creación / Edición */}
      <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-gold-heritage/20 shadow-xl mb-12 mt-10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-xl text-white font-serif">
            {editingId ? "Editar Banner" : "Crear Nuevo Banner"}
          </h3>
          {editingId && (
            <button onClick={cancelEdit} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-alabaster/40 hover:text-white transition-colors">
              <X className="w-4 h-4" /> Cancelar Edición
            </button>
          )}
        </div>
        
        <form onSubmit={editingId ? handleUpdate : handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-alabaster/40 font-bold mb-2">Título del Banner</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="Ej: Nueva Colección Otoño" className="w-full bg-onyx/50 border border-gold-heritage/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-heritage transition-all" />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-alabaster/40 font-bold mb-2">Enlace de Destino (Opcional)</label>
              <div className="relative">
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-alabaster/20" />
                <input type="text" value={linkUrl} onChange={e => setLinkUrl(e.target.value)} placeholder="/promociones o https://..." className="w-full bg-onyx/50 border border-gold-heritage/20 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-gold-heritage transition-all" />
              </div>
            </div>
          </div>
          
          <div className="space-y-4 flex flex-col justify-between">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-alabaster/40 font-bold mb-2">
                {editingId ? "Cambiar Imagen (Dejar vacío para mantener)" : "Imagen del Banner (1920x600 aprox)"}
              </label>
              <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} required={!editingId} className="w-full text-sm file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-[10px] file:uppercase file:tracking-widest file:font-semibold file:bg-gold-heritage/10 file:text-gold-heritage text-alabaster/40" />
            </div>
            
            <button disabled={uploading} type="submit" className={`px-8 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-lg w-full md:w-fit self-end ${editingId ? 'bg-emerald-500 text-onyx hover:bg-emerald-400' : 'bg-gold-metallic text-onyx hover:bg-gold-shine'}`}>
              {uploading ? "Procesando..." : editingId ? <><Save className="w-5 h-5"/> Guardar Cambios</> : <><Plus className="w-5 h-5"/> Publicar Banner</>}
            </button>
          </div>
        </form>
      </div>

      {/* Lista de Banners */}
      <div className="grid grid-cols-1 gap-6">
        <h3 className="text-alabaster/40 text-[10px] font-bold uppercase tracking-[0.3em]">Banners en Rotación</h3>
        {loading ? <p className="text-alabaster/60">Cargando banners...</p> : banners.map(b => (
          <div key={b.id} className={`group flex flex-col md:flex-row items-center gap-6 p-6 rounded-3xl border transition-all backdrop-blur-md ${b.active ? 'bg-white/5 border-gold-heritage/30 shadow-2xl' : 'bg-onyx/40 border-onyx/20 opacity-60 grayscale'}`}>
            <div className="relative w-full md:w-64 h-32 rounded-2xl overflow-hidden border border-white/10 shrink-0">
               <img src={b.image_url} alt={b.title} className="w-full h-full object-cover" />
               {!b.active && <div className="absolute inset-0 bg-onyx/60 flex items-center justify-center text-[10px] font-bold uppercase tracking-widest text-white">Inactivo</div>}
            </div>

            <div className="flex-1 w-full text-center md:text-left">
              <h4 className="font-bold text-xl text-white font-serif mb-2">{b.title}</h4>
              <p className="text-alabaster/40 text-[10px] font-bold uppercase tracking-widest mb-4 truncate max-w-xs mx-auto md:mx-0">
                {b.link_url || "Sin enlace de destino"}
              </p>
              <div className="flex items-center justify-center md:justify-start gap-4">
                 <button onClick={() => toggleActive(b.id, b.active)} className={`flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest px-4 py-2 rounded-full transition-all ${b.active ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20' : 'bg-amber-400/10 text-amber-400 border border-amber-400/20'}`}>
                    {b.active ? <><CheckCircle2 className="w-3 h-3" /> Activo</> : <><XCircle className="w-3 h-3" /> Suspendido</>}
                 </button>
              </div>
            </div>
            
            <div className="flex flex-row md:flex-col items-center gap-3 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
              <button 
                onClick={() => startEdit(b)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest px-6 py-3 bg-white/5 text-white hover:bg-white/10 border border-white/10 rounded-xl transition-all"
              >
                <Edit className="w-4 h-4" /> Editar
              </button>
              
              <button 
                onClick={() => handleDelete(b.id)} 
                disabled={deletingId === b.id}
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 font-bold uppercase tracking-[0.1em] text-[10px] border ${
                  deletingId === b.id 
                    ? 'bg-white/5 text-white/20 border-white/5' 
                    : confirmId === b.id 
                      ? 'bg-red-600 text-white border-red-400 animate-pulse' 
                      : 'text-red-400 border-red-500/20 hover:bg-red-500/10 hover:border-red-500'
                }`}
              >
                {confirmId === b.id ? "¿BORRAR?" : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Eliminar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
        {!loading && banners.length === 0 && (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
            <p className="text-sm text-alabaster/20 uppercase tracking-[0.4em]">No hay banners registrados</p>
          </div>
        )}
      </div>
    </div>
  );
}
