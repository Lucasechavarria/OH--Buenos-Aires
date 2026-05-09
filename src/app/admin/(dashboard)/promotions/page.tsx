
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/infrastructure/supabase-client";
import { Plus, Trash2, CheckCircle2, XCircle, Tag, Edit } from "lucide-react";

export default function PromotionsAdmin() {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [brandId, setBrandId] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [externalUrl, setExternalUrl] = useState("");

  const fetchData = async () => {
    setLoading(true);
    const [promosRes, brandsRes] = await Promise.all([
      supabase.from("promotions").select("*, brands(name)").order("created_at", { ascending: false }),
      supabase.from("brands").select("id, name").order("name")
    ]);
    if (promosRes.data) setPromotions(promosRes.data);
    if (brandsRes.data) setBrands(brandsRes.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !brandId) return;

    await supabase.from("promotions").insert([
      { 
        title, 
        description, 
        brand_id: brandId, 
        active: true,
        valid_from: validFrom || null,
        valid_until: validUntil || null,
        external_url: externalUrl || null
      }
    ]);
    
    setTitle("");
    setDescription("");
    setBrandId("");
    setValidFrom("");
    setValidUntil("");
    setExternalUrl("");
    fetchData();
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from("promotions").update({ active: !current }).eq("id", id);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    // Sistema de confirmación de dos pasos sin window.confirm
    if (confirmId !== id) {
      setConfirmId(id);
      setTimeout(() => setConfirmId(prev => prev === id ? null : prev), 3000);
      return;
    }

    setConfirmId(null);
    setDeletingId(id);
    
    try {
      console.log("[Admin] Llamando API para borrar promoción:", id);
      const response = await fetch(`/api/v1/admin/promotions/${id}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Error al eliminar en el servidor");
      }
      
      fetchData();
    } catch (error: any) {
      console.error("[Admin Error]", error);
      alert("ERROR AL ELIMINAR:\n" + error.message);
    } finally {
      setDeletingId(null);
    }
  };

  const startEdit = (promo: any) => {
    setEditingId(promo.id);
    setTitle(promo.title);
    setDescription(promo.description || "");
    setBrandId(promo.brand_id);
    setValidFrom(promo.valid_from ? new Date(promo.valid_from).toISOString().slice(0, 16) : "");
    setValidUntil(promo.valid_until ? new Date(promo.valid_until).toISOString().slice(0, 16) : "");
    setExternalUrl(promo.external_url || "");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setBrandId("");
    setValidFrom("");
    setValidUntil("");
    setExternalUrl("");
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !title || !brandId) return;

    try {
      const { error } = await supabase.from("promotions").update({
        title,
        description,
        brand_id: brandId,
        valid_from: validFrom || null,
        valid_until: validUntil || null,
        external_url: externalUrl || null
      }).eq("id", editingId);

      if (error) throw error;

      cancelEdit();
      fetchData();
      alert("Promoción actualizada con éxito");
    } catch (err: any) {
      alert("Error al actualizar: " + err.message);
    }
  };

  return (
    <div className="pb-20">
      <div className="flex items-center gap-4 mb-2">
        <div className="p-3 bg-gold-heritage/20 rounded-2xl border border-gold-heritage/30">
          <Tag className="w-6 h-6 text-gold-heritage" />
        </div>
        <div>
          <h2 className="text-3xl font-serif text-white">Promociones y Cupones</h2>
          <p className="text-alabaster/60 font-sans text-sm">Administra los beneficios exclusivos por marca.</p>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-gold-heritage/20 shadow-xl mb-12 mt-10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-xl text-white font-serif">{editingId ? "Editar Promoción" : "Crear Nueva Promoción"}</h3>
          {editingId && (
            <button onClick={cancelEdit} className="text-[10px] font-bold uppercase tracking-widest text-alabaster/40 hover:text-white transition-colors">
              Cancelar Edición
            </button>
          )}
        </div>
        <form onSubmit={editingId ? handleUpdate : handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-alabaster/40 font-bold mb-2">Marca Asociada</label>
              <select value={brandId} onChange={e => setBrandId(e.target.value)} required className="w-full bg-onyx/50 border border-gold-heritage/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-heritage transition-all">
                <option value="" disabled className="text-onyx">Selecciona una marca...</option>
                {brands.map(b => <option key={b.id} value={b.id} className="text-white bg-onyx">{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-alabaster/40 font-bold mb-2">Título (Ej: 20% OFF)</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="Nombre de la oferta" className="w-full bg-onyx/50 border border-gold-heritage/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-heritage transition-all placeholder:text-white/10" />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-alabaster/40 font-bold mb-2">Descripción Detallada</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Explica el beneficio..." className="w-full bg-onyx/50 border border-gold-heritage/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-heritage transition-all placeholder:text-white/10" />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-alabaster/40 font-bold mb-2">URL Externa (Opcional - Redirige en lugar de Cupón)</label>
              <input type="url" value={externalUrl} onChange={e => setExternalUrl(e.target.value)} placeholder="https://marca.com/promo" className="w-full bg-onyx/50 border border-gold-heritage/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-heritage transition-all placeholder:text-white/10" />
            </div>
          </div>
          
          <div className="space-y-4 flex flex-col">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-alabaster/40 font-bold mb-2">Inicia (Opcional)</label>
                <input type="datetime-local" value={validFrom} onChange={e => setValidFrom(e.target.value)} className="w-full bg-onyx/50 border border-gold-heritage/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-heritage transition-all" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-alabaster/40 font-bold mb-2">Finaliza (Opcional)</label>
                <input type="datetime-local" value={validUntil} onChange={e => setValidUntil(e.target.value)} className="w-full bg-onyx/50 border border-gold-heritage/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-heritage transition-all" />
              </div>
            </div>
            
            <div className="flex-1 flex items-end">
              <button type="submit" className={`px-8 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-lg w-full md:w-fit mt-4 ${editingId ? 'bg-emerald-500 text-onyx hover:bg-emerald-400' : 'bg-gold-metallic text-onyx hover:bg-gold-shine'}`}>
                {editingId ? "Guardar Cambios" : <><Plus className="w-5 h-5"/> Crear Promoción</>}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="space-y-6">
        <h3 className="text-alabaster/40 text-[10px] font-bold uppercase tracking-[0.3em] mb-4">Promociones Activas e Historial</h3>
        {loading ? <p className="text-alabaster/60">Cargando beneficios...</p> : promotions.map(p => (
          <div key={p.id} className={`group flex flex-col sm:flex-row items-center gap-6 p-6 rounded-3xl border transition-all backdrop-blur-md ${p.active ? 'bg-white/5 border-gold-heritage/30 shadow-2xl' : 'bg-onyx/40 border-onyx/20 opacity-60 grayscale'}`}>
            <div className="flex-1 w-full">
              <div className="flex items-center gap-3 mb-2">
                <div className={`h-2 w-2 rounded-full ${p.active ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
                <h4 className="font-bold text-xl text-white font-serif">{p.title}</h4>
              </div>
              <p className="text-alabaster/60 text-sm mb-4 leading-relaxed">{p.description}</p>
              
              <div className="flex flex-wrap gap-4 items-center">
                 <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold-heritage/10 border border-gold-heritage/20 text-gold-heritage text-[10px] font-bold uppercase tracking-widest rounded-full">
                   {p.brands?.name}
                 </div>
                 {p.valid_until && (
                  <div className="text-[10px] text-alabaster/40 font-bold uppercase tracking-widest flex items-center gap-2">
                    <XCircle className="w-3 h-3" />
                    Vence: {new Date(p.valid_until).toLocaleDateString()}
                  </div>
                 )}
              </div>
            </div>
            
            <div className="flex flex-row sm:flex-col items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-white/5 shrink-0">
              <button 
                onClick={() => startEdit(p)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest px-6 py-3 bg-white/5 text-white hover:bg-white/10 border border-white/10 rounded-xl transition-all"
              >
                <Edit className="w-4 h-4" /> Editar
              </button>
              
              <button 
                onClick={() => toggleActive(p.id, p.active)}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest px-6 py-3 rounded-xl transition-all ${p.active ? 'text-amber-400 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/20' : 'text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20'}`}
              >
                {p.active ? <><XCircle className="w-4 h-4"/> Suspender</> : <><CheckCircle2 className="w-4 h-4" /> Reactivar</>}
              </button>
              
              <button 
                onClick={() => handleDelete(p.id)} 
                disabled={deletingId === p.id}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 font-bold uppercase tracking-[0.1em] text-[10px] border ${
                  deletingId === p.id 
                    ? 'bg-white/5 text-white/20 border-white/5' 
                    : confirmId === p.id 
                      ? 'bg-red-600 text-white border-red-400 animate-pulse shadow-lg shadow-red-900/40' 
                      : 'text-red-400 border-red-500/20 hover:bg-red-500/10 hover:border-red-500'
                }`}
              >
                {confirmId === p.id ? "¿BORRAR?" : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Eliminar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
        {!loading && promotions.length === 0 && (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
            <p className="text-sm text-alabaster/20 uppercase tracking-[0.4em]">No hay promociones registradas</p>
          </div>
        )}
      </div>
    </div>
  );
}
