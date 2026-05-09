"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/infrastructure/supabase-client";
import { Plus, Trash2, Edit, ImageIcon, Eye, EyeOff } from "lucide-react";

export default function NewsAdmin() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchNews = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("news")
      .select("*")
      .order("date", { ascending: false });
    if (data) setNews(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    setUploading(true);
    
    try {
      let image_url = null;

      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('news')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: publicData } = supabase.storage.from('news').getPublicUrl(fileName);
        image_url = publicData.publicUrl;
      }

      const newsData: any = {
        title,
        excerpt,
        content,
        category,
        date,
      };

      if (image_url) newsData.image_url = image_url;

      if (editingId) {
        const { error } = await supabase
          .from("news")
          .update(newsData)
          .eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("news")
          .insert([newsData]);
        if (error) throw error;
      }
      
      resetForm();
      fetchNews();
      alert(editingId ? "Noticia actualizada" : "Noticia creada");
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
        .from("news")
        .update({ active: !currentStatus })
        .eq("id", id);
      if (error) throw error;
      fetchNews();
    } catch (err: any) {
      alert("Error al cambiar estado: " + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta noticia?")) return;
    try {
      const { error } = await supabase.from("news").delete().eq("id", id);
      if (error) throw error;
      fetchNews();
    } catch (err: any) {
      alert("Error al eliminar: " + err.message);
    }
  };

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setTitle(item.title);
    setExcerpt(item.excerpt || "");
    setContent(item.content || "");
    setCategory(item.category || "");
    setDate(item.date || new Date().toISOString().split('T')[0]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setExcerpt("");
    setContent("");
    setCategory("");
    setDate(new Date().toISOString().split('T')[0]);
    setFile(null);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-serif text-white mb-2">Noticias (Oh! News)</h2>
        <p className="text-alabaster/60 font-sans">Gestiona las crónicas, novedades y anuncios del shopping.</p>
      </div>

      <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-celeste-oh/20 shadow-xl">
        <h3 className="font-bold text-xl text-white mb-6">{editingId ? "Editar Noticia" : "Nueva Noticia"}</h3>
        <form onSubmit={handleCreateOrUpdate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-alabaster/40 font-bold mb-2">Título de la Noticia</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full bg-onyx/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-celeste-oh transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-alabaster/40 font-bold mb-2">Resumen (Excerpt)</label>
                <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} className="w-full bg-onyx/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-celeste-oh transition-colors h-24" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-alabaster/40 font-bold mb-2">Categoría</label>
                  <input type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="Ej: RETAIL, EVENTOS" className="w-full bg-onyx/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-celeste-oh transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-alabaster/40 font-bold mb-2">Fecha de Publicación</label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-onyx/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-celeste-oh transition-colors" />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-alabaster/40 font-bold mb-2">Contenido (HTML permitido)</label>
                <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full bg-onyx/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-celeste-oh transition-colors h-[210px] font-mono text-xs" placeholder="<p>Texto aquí...</p>" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-alabaster/40 font-bold mb-2">Imagen de Portada</label>
                <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:uppercase file:tracking-widest file:font-semibold file:bg-celeste-oh/10 file:text-celeste-oh text-alabaster/60" />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button disabled={uploading} type="submit" className="px-10 py-4 bg-celeste-oh text-onyx rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white transition-all disabled:opacity-50">
              {uploading ? "Procesando..." : editingId ? "Guardar Cambios" : "Publicar Noticia"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="px-10 py-4 border border-white/10 text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white/5 transition-all">
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? <p className="text-white/40 animate-pulse">Cargando crónicas...</p> : news.map(item => (
          <div key={item.id} className="flex items-center gap-6 bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-celeste-oh/30 transition-all group">
            <div className="h-24 w-40 rounded-xl overflow-hidden bg-onyx flex-shrink-0">
              {item.image_url ? (
                <img src={item.image_url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/10"><ImageIcon className="w-8 h-8" /></div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2 py-0.5 rounded bg-celeste-oh/10 text-celeste-oh text-[8px] font-bold uppercase tracking-widest">{item.category}</span>
                <span className="text-[10px] text-white/20 font-bold">{item.date}</span>
                {!item.active && <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 text-[8px] font-bold uppercase tracking-widest">Suspendida</span>}
              </div>
              <h4 className="text-xl font-serif text-white truncate mb-1">{item.title}</h4>
              <p className="text-sm text-white/40 line-clamp-1">{item.excerpt}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => toggleActive(item.id, item.active)} title={item.active ? "Suspender" : "Activar"} className={`p-3 rounded-full transition-all ${item.active ? 'text-white/40 hover:text-white hover:bg-white/5' : 'text-celeste-oh bg-celeste-oh/10'}`}>
                {item.active ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
              <button onClick={() => startEdit(item)} className="p-3 text-white/40 hover:text-white hover:bg-white/5 rounded-full transition-all">
                <Edit className="w-5 h-5" />
              </button>
              <button onClick={() => handleDelete(item.id)} className="p-3 text-red-400/40 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-all">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
        {!loading && news.length === 0 && <p className="text-center py-20 text-white/20 font-serif italic text-xl border border-dashed border-white/10 rounded-3xl">No hay noticias redactadas todavía.</p>}
      </div>
    </div>
  );
}
