"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/infrastructure/supabase-client";
import { Plus, Trash2, Tag, Edit, Save, X } from "lucide-react";

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });
    if (data) setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);

    try {
      const slug = generateSlug(name);

      if (editingId) {
        const { error } = await supabase
          .from("categories")
          .update({ name, slug })
          .eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("categories")
          .insert([{ name, slug }]);
        if (error) throw error;
      }

      setName("");
      setEditingId(null);
      fetchCategories();
    } catch (err: any) {
      console.error(err);
      alert("Error al guardar la categoría: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirmId !== id) {
      setConfirmId(id);
      setTimeout(() => setConfirmId(prev => prev === id ? null : prev), 3000);
      return;
    }

    setDeletingId(id);
    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
      fetchCategories();
    } catch (err: any) {
      console.error(err);
      alert("Error al eliminar la categoría: " + err.message);
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  const startEdit = (cat: any) => {
    setEditingId(cat.id);
    setName(cat.name);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName("");
  };

  return (
    <div className="max-w-4xl">
      <h2 className="text-3xl font-serif text-white mb-2">Categorías</h2>
      <p className="text-alabaster/60 font-sans mb-8">Gestiona los filtros que se asignan a las marcas.</p>

      <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-gold-heritage/20 shadow-xl mb-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-white">{editingId ? "Editar Categoría" : "Nueva Categoría"}</h3>
          {editingId && (
            <button onClick={cancelEdit} className="text-[10px] font-bold uppercase tracking-widest text-alabaster/40 hover:text-white transition-colors flex items-center gap-1">
              <X className="w-3 h-3" /> Cancelar
            </button>
          )}
        </div>
        <form onSubmit={handleSubmit} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-[10px] uppercase tracking-[0.2em] text-alabaster/40 font-bold mb-2">Nombre de la Categoría</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="Ej: Deporte, Moda, Relojería"
              required 
              className="w-full bg-onyx/50 border border-gold-heritage/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-heritage transition-colors" 
            />
          </div>
          <button 
            disabled={saving} 
            type="submit" 
            className={`px-8 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-colors disabled:opacity-50 ${editingId ? 'bg-emerald-500 text-onyx' : 'bg-gold-metallic text-onyx hover:bg-gold-shine'}`}
          >
            {saving ? "..." : editingId ? <><Save className="w-4 h-4"/> Guardar</> : <><Plus className="w-4 h-4"/> Crear</>}
          </button>
        </form>
      </div>

      <div className="space-y-3">
        {loading ? (
          <p className="text-alabaster/60">Cargando categorías...</p>
        ) : categories.length === 0 ? (
          <p className="text-sm text-alabaster/40 py-10 text-center tracking-widest uppercase border border-dashed border-white/10 rounded-2xl">No hay categorías registradas.</p>
        ) : (
          categories.map(cat => (
            <div key={cat.id} className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-gold-heritage/10 hover:border-gold-heritage/30 transition-all backdrop-blur-sm group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gold-heritage/10 flex items-center justify-center text-gold-heritage">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white">{cat.name}</h4>
                  <p className="text-[10px] text-alabaster/40 font-mono">slug: {cat.slug}</p>
                </div>
              </div>
              
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => startEdit(cat)}
                  className="p-2 text-gold-heritage hover:bg-gold-heritage/10 rounded-lg transition-all"
                  title="Editar"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(cat.id)} 
                  disabled={deletingId === cat.id}
                  className={`p-2 rounded-lg transition-all duration-300 flex items-center justify-center ${
                    deletingId === cat.id 
                      ? 'text-alabaster/20' 
                      : confirmId === cat.id 
                        ? 'bg-red-600 text-white animate-pulse' 
                        : 'text-red-400 hover:bg-red-500/10'
                  }`}
                >
                  {confirmId === cat.id ? <span className="text-[8px] font-bold uppercase">Confirmar</span> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
