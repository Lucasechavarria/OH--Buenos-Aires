"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/infrastructure/supabase-client";
import { Plus, Trash2, Edit, XCircle, CheckCircle2, Save, X, Link as LinkIcon } from "lucide-react";
import { InstagramIcon } from "@/src/components/Icons";

export default function InstagramAdmin() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  // Form State
  const [linkUrl, setLinkUrl] = useState("");
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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      let image_url = "";
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('instagram').upload(fileName, file);
        if (uploadError) throw uploadError;
        const { data: publicData } = supabase.storage.from('instagram').getPublicUrl(fileName);
        image_url = publicData.publicUrl;
      }

      const { error: dbError } = await supabase.from("instagram_posts").insert([
        { link_url: linkUrl, image_url, active: true, order_index: posts.length }
      ]);

      if (dbError) throw dbError;
      
      setLinkUrl("");
      setFile(null);
      fetchPosts();
      alert("Post de Instagram añadido");
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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setUploading(true);

    try {
      const updateData: any = { link_url: linkUrl };
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        await supabase.storage.from('instagram').upload(fileName, file);
        const { data: publicData } = supabase.storage.from('instagram').getPublicUrl(fileName);
        updateData.image_url = publicData.publicUrl;
      }

      const { error } = await supabase.from("instagram_posts").update(updateData).eq("id", editingId);
      if (error) throw error;

      setEditingId(null);
      setLinkUrl("");
      setFile(null);
      fetchPosts();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="pb-20">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-pink-500/20 rounded-2xl border border-pink-500/30">
          <InstagramIcon className="w-6 h-6 text-pink-500" />
        </div>
        <div>
          <h2 className="text-3xl font-serif text-white">Instagram Feed</h2>
          <p className="text-alabaster/60 font-sans text-sm">Gestiona las fotos que aparecen en el carrusel de Instagram de la Home.</p>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-xl mb-12">
        <h3 className="font-bold text-xl text-white font-serif mb-6">
          {editingId ? "Editar Post" : "Nuevo Post de Instagram"}
        </h3>
        <form onSubmit={editingId ? handleUpdate : handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-alabaster/40 font-bold mb-2">Link a la Publicación</label>
              <div className="relative">
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input type="text" value={linkUrl} onChange={e => setLinkUrl(e.target.value)} placeholder="https://instagram.com/p/..." className="w-full bg-onyx/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-alabaster/40 font-bold mb-2">Imagen (Cuadrada recomendada)</label>
              <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} required={!editingId} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:uppercase file:bg-pink-500/10 file:text-pink-500 text-alabaster/40" />
            </div>
          </div>
          <div className="flex items-end">
            <button disabled={uploading} type="submit" className="px-8 py-4 bg-pink-500 text-white rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-lg w-full md:w-fit">
              {uploading ? "Subiendo..." : editingId ? "Guardar Cambios" : "Publicar en Feed"}
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {loading ? <p className="text-white/40">Cargando...</p> : posts.map(post => (
          <div key={post.id} className={`group relative aspect-square rounded-2xl overflow-hidden border transition-all ${post.active ? 'border-white/10 shadow-lg' : 'border-red-500/20 grayscale opacity-50'}`}>
            <img src={post.image_url} alt="Instagram" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button onClick={() => toggleActive(post.id, post.active)} className="p-2 rounded-full bg-white text-onyx hover:bg-celeste-oh transition-colors">
                {post.active ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              </button>
              <button onClick={() => { setEditingId(post.id); setLinkUrl(post.link_url || ""); }} className="p-2 rounded-full bg-white text-onyx hover:bg-celeste-oh transition-colors">
                <Edit className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(post.id)} className={`p-2 rounded-full bg-white text-onyx transition-colors ${confirmId === post.id ? 'bg-red-500 text-white' : 'hover:bg-red-500 hover:text-white'}`}>
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
