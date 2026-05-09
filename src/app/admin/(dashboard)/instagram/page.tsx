"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/infrastructure/supabase-client";
import { Plus, Trash2, Edit, XCircle, CheckCircle2, Save, X, Link as LinkIcon, Sparkles, RefreshCw } from "lucide-react";
import { InstagramIcon } from "@/src/components/Icons";

export default function InstagramAdmin() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  // Form State
  const [linkUrl, setLinkUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("instagram_posts").select("*").order("order_index", { ascending: true });
    if (error) console.error("Error fetching instagram posts:", error);
    if (data) setPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Effect to automatically generate preview from URL
  useEffect(() => {
    const extractMediaUrl = (url: string) => {
      const regex = /instagram\.com\/(?:p|reels|reel)\/([^/?#&]+)/;
      const match = url.match(regex);
      if (match && match[1]) {
        // Use a proxy to avoid CORS and Instagram referer blocks
        return `https://images.weserv.nl/?url=https://www.instagram.com/p/${match[1]}/media/?size=l&default=https://via.placeholder.com/600x600?text=Instagram+Post`;
      }
      return "";
    };

    if (linkUrl && !file) {
      const media = extractMediaUrl(linkUrl);
      setPreviewUrl(media);
    }
  }, [linkUrl, file]);

  // Handle file preview
  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [file]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewUrl && !file) {
      alert("Por favor ingresa un link o sube una imagen");
      return;
    }
    setUploading(true);
    
    try {
      let image_url = previewUrl;

      // If a file was uploaded, use it instead of the auto-detected one
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('instagram').upload(fileName, file);
        if (uploadError) throw uploadError;
        const { data: publicData } = supabase.storage.from('instagram').getPublicUrl(fileName);
        image_url = publicData.publicUrl;
      }

      const { error: dbError } = await supabase.from("instagram_posts").insert([
        { 
          link_url: linkUrl, 
          image_url, 
          active: true, 
          order_index: posts.length 
        }
      ]);

      if (dbError) throw dbError;
      
      setLinkUrl("");
      setPreviewUrl("");
      fetchPosts();
      alert("Post de Instagram vinculado correctamente");
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !previewUrl) return;
    setUploading(true);

    try {
      let image_url = previewUrl;

      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        await supabase.storage.from('instagram').upload(fileName, file);
        const { data: publicData } = supabase.storage.from('instagram').getPublicUrl(fileName);
        image_url = publicData.publicUrl;
      }

      const { error } = await supabase.from("instagram_posts").update({
        link_url: linkUrl,
        image_url
      }).eq("id", editingId);
      
      if (error) throw error;

      setEditingId(null);
      setLinkUrl("");
      setPreviewUrl("");
      setFile(null);
      fetchPosts();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    const { error } = await supabase.from("instagram_posts").update({ active: !current }).eq("id", id);
    if (error) alert("Error: " + error.message);
    fetchPosts();
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
      const { error } = await supabase.from("instagram_posts").delete().eq("id", id);
      if (error) throw error;
      fetchPosts();
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="pb-20">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-pink-500/20 rounded-2xl border border-pink-500/30">
          <InstagramIcon className="w-6 h-6 text-pink-500" />
        </div>
        <div>
          <h2 className="text-3xl font-serif text-white">Instagram Feed Dinámico</h2>
          <p className="text-alabaster/60 font-sans text-sm">Pegá el link del post o reel y el sistema detectará la imagen automáticamente.</p>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-xl mb-12">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-xl text-white font-serif">
            {editingId ? "Editar Vinculación" : "Vincular Nuevo Contenido"}
          </h3>
          {editingId && (
            <button onClick={() => { setEditingId(null); setLinkUrl(""); }} className="text-alabaster/40 hover:text-white flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest">
              <X className="w-4 h-4" /> Cancelar Edición
            </button>
          )}
        </div>

        <form onSubmit={editingId ? handleUpdate : handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-alabaster/40 font-bold mb-3">Opción A: Link de Instagram (Auto-detectar)</label>
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input 
                    type="text" 
                    value={linkUrl} 
                    onChange={e => { setLinkUrl(e.target.value); setFile(null); }} 
                    placeholder="https://www.instagram.com/p/..." 
                    className="w-full bg-onyx/50 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-pink-500 transition-all text-sm" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-alabaster/40 font-bold mb-3">Opción B: Subir Manualmente (Si falla el link)</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={e => { setFile(e.target.files?.[0] || null); setLinkUrl(""); }} 
                  className="w-full text-xs file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-[10px] file:uppercase file:bg-white/5 file:text-white text-alabaster/40 border border-white/5 rounded-2xl p-2 bg-white/[0.02]" 
                />
              </div>
            </div>
            
            <button 
              disabled={uploading || (!previewUrl && !file)} 
              type="submit" 
              className="px-10 py-4 bg-pink-600 text-white rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-pink-500 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-30 disabled:hover:scale-100"
            >
              {uploading ? (
                <><RefreshCw className="w-4 h-4 animate-spin" /> Procesando...</>
              ) : (
                <><Save className="w-4 h-4" /> {editingId ? "Actualizar Vinculación" : "Publicar en la Home"}</>
              )}
            </button>
          </div>

          <div className="relative">
            <label className="block text-[10px] uppercase tracking-[0.2em] text-alabaster/40 font-bold mb-3 text-center">Vista Previa Automática</label>
            <div className="aspect-square rounded-2xl border-2 border-dashed border-white/10 overflow-hidden bg-white/5 flex items-center justify-center relative group">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" referrerPolicy="no-referrer" className="w-full h-full object-cover animate-in fade-in zoom-in duration-500" />
              ) : (
                <div className="text-center p-6">
                  <InstagramIcon className="w-8 h-8 text-white/10 mx-auto mb-2" />
                  <p className="text-[9px] uppercase tracking-widest text-white/20">Esperando link...</p>
                </div>
              )}
              {previewUrl && (
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Sparkles className="text-pink-400 w-8 h-8 animate-pulse" />
                </div>
              )}
            </div>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center"><RefreshCw className="w-8 h-8 text-white/20 animate-spin mx-auto" /></div>
        ) : posts.map(post => (
          <div key={post.id} className={`group relative aspect-square rounded-2xl overflow-hidden border transition-all ${post.active ? 'border-white/10 shadow-lg shadow-black/40' : 'border-red-500/20 grayscale opacity-40'}`}>
            <img src={post.image_url} alt="Instagram" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            
            {/* Overlay Actions */}
            <div className="absolute inset-0 bg-onyx/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
              <div className="flex gap-2">
                <button onClick={() => toggleActive(post.id, post.active)} className={`p-2.5 rounded-xl border transition-all ${post.active ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : 'border-amber-500/30 text-amber-400 bg-amber-500/10'}`}>
                  {post.active ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                </button>
                <button onClick={() => { setEditingId(post.id); setLinkUrl(post.link_url || ""); }} className="p-2.5 rounded-xl border border-white/10 text-white bg-white/5 hover:bg-white/10">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(post.id)} className={`p-2.5 rounded-xl border transition-all ${confirmId === post.id ? 'bg-red-600 border-red-500 text-white' : 'border-red-500/30 text-red-400 hover:bg-red-500/10'}`}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <a href={post.link_url} target="_blank" className="text-[8px] font-bold uppercase tracking-widest text-alabaster/40 hover:text-celeste-oh transition-colors">Abrir en Instagram &↗</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
