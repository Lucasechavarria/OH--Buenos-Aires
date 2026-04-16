"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/infrastructure/supabase-client";
import { Plus, Trash2, Store } from "lucide-react";

export default function BrandsAdmin() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [floor, setFloor] = useState("");
  const [localNumber, setLocalNumber] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const fetchBrands = async () => {
    setLoading(true);
    const { data } = await supabase.from("brands").select("*, locations(floor, local_number)").order("name", { ascending: true });
    if (data) setBrands(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    setUploading(true);
    
    try {
      let logo_url = null;

      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('brand-logos')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: publicData } = supabase.storage.from('brand-logos').getPublicUrl(fileName);
        logo_url = publicData.publicUrl;
      }
      const finalPhone = phone.trim() !== "" ? phone : "+54 11 0000-0000";

      const { data: locData, error: locError } = await supabase
        .from("locations")
        .insert([{ floor, local_number: localNumber }])
        .select()
        .single();

      if (locError) throw locError;

      const { error: insertError } = await supabase.from("brands").insert([
        { 
          name, 
          phone: finalPhone, 
          logo_url, 
          google_maps_url: "https://maps.app.goo.gl/ohbuenosaires",
          location_id: locData.id
        }
      ]);
      
      if (insertError) throw insertError;
      
      setName("");
      setPhone("");
      setFloor("");
      setLocalNumber("");
      setFile(null);
      fetchBrands();
    } catch (err: any) {
      console.error(err);
      alert("Error al crear la marca: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    // Si es el primer clic, solo pedimos confirmación visual
    if (confirmId !== id) {
      setConfirmId(id);
      // Auto-cancelar después de 3 segundos si no confirma
      setTimeout(() => setConfirmId(prev => prev === id ? null : prev), 3000);
      return;
    }

    console.log("CONFIRMADO: Iniciando borrado de ID:", id);
    setConfirmId(null);
    setDeletingId(id);
    
    try {
      console.log("Llamando al túnel de API para borrar...");
      const response = await fetch(`/api/v1/admin/brands/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json();
      console.log("Respuesta del servidor:", result);

      if (!response.ok) {
        throw new Error(result.error || "Fallo en el servidor");
      }

      console.log("Borrado exitoso. Recargando lista...");
      await fetchBrands();
    } catch (err: any) {
      console.error("ERROR CRÍTICO EN BORRADO:", err);
      alert("ERROR DE BORRADO:\n" + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-serif text-white mb-2">Marcas</h2>
      <p className="text-alabaster/60 font-sans mb-8">Sube, edita o elimina las "Cards" de marcas del catálogo.</p>

      <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-gold-heritage/20 shadow-xl mb-10">
        <h3 className="font-bold text-lg mb-4 text-white">Añadir Marca</h3>
        <form onSubmit={handleCreate} className="space-y-4 max-w-xl">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-alabaster/40 font-bold mb-2">Nombre Comercial</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-onyx/50 border border-gold-heritage/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-heritage transition-colors" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-alabaster/40 font-bold mb-2">Piso</label>
              <input type="text" value={floor} onChange={e => setFloor(e.target.value)} placeholder="Ej: PB, Piso 1" className="w-full bg-onyx/50 border border-gold-heritage/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-heritage transition-colors" />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-alabaster/40 font-bold mb-2">Local Nro</label>
              <input type="text" value={localNumber} onChange={e => setLocalNumber(e.target.value)} placeholder="Ej: L01, L105" className="w-full bg-onyx/50 border border-gold-heritage/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-heritage transition-colors" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-alabaster/40 font-bold mb-2">Teléfono / WhatsApp</label>
            <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-onyx/50 border border-gold-heritage/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-heritage transition-colors" />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-alabaster/40 font-bold mb-2">Logo de la Boutique (Recomendado SVG o PNG sin fondo)</label>
            <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:uppercase file:tracking-widest file:font-semibold file:bg-gold-heritage/10 file:text-gold-heritage text-alabaster/60" />
          </div>
          <button disabled={uploading} type="submit" className="bg-gold-metallic text-onyx px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-gold-shine transition-colors disabled:opacity-50 mt-4">
            {uploading ? "Añadiendo..." : <><Plus className="w-4 h-4"/> Añadir Marca</>}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? <p className="text-alabaster/60">Cargando...</p> : brands.map(b => (
          <div key={b.id} className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-gold-heritage/10 shadow-sm transition-all hover:border-gold-heritage/30 backdrop-blur-md">
            <div className="h-20 w-20 bg-rosa-viejo border border-gold-heritage/30 rounded-full flex items-center justify-center p-3 shadow-xl ring-2 ring-white/10 group overflow-hidden">
              {b.logo_url ? (
                <img 
                  src={b.logo_url} 
                  alt={b.name} 
                  className={`max-h-full max-w-full object-contain filter transition-transform group-hover:scale-110 
                    ${b.name.toLowerCase().includes('stella') || b.name.toLowerCase().includes('smart') ? 'scale-[1.45]' : ''} 
                    ${b.name.toLowerCase().includes('smart') || b.name.toLowerCase().includes('natura') ? 'drop-shadow-[0_0_1px_rgba(0,0,0,0.8)]' : 'drop-shadow-sm'}`} 
                  onError={(e) => {
                    // Fallback si la imagen no carga
                    (e.target as any).src = "https://ui-avatars.com/api/?name=" + b.name + "&background=C8A564&color=fff";
                  }}
                />
              ) : (
                <Store className="text-gold-heritage w-8 h-8" />
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-white flex items-center gap-2">{b.name}</h4>
              <div className="flex flex-col gap-0.5 mt-1">
                {b.locations && <p className="text-[10px] text-gold-heritage uppercase tracking-wider font-bold">{b.locations.floor} • Local {b.locations.local_number}</p>}
                {b.phone && <p className="text-[10px] text-alabaster/40">{b.phone}</p>}
              </div>
            </div>
            <button 
              onClick={() => handleDelete(b.id)} 
              disabled={deletingId === b.id}
              className={`px-4 py-2 rounded-xl transition-all duration-300 font-bold uppercase tracking-[0.1em] text-[10px] flex items-center gap-2 ${
                deletingId === b.id 
                  ? 'bg-white/10 text-alabaster/20' 
                  : confirmId === b.id 
                    ? 'bg-red-600 text-white shadow-lg shadow-red-900/40 ring-2 ring-red-400 animate-pulse' 
                    : 'text-red-400 hover:bg-red-500/20 hover:text-red-300'
              }`}
            >
              {confirmId === b.id ? "¿BORRAR?" : <Trash2 className={`w-5 h-5 ${deletingId === b.id ? 'animate-pulse' : ''}`} />}
            </button>
          </div>
        ))}
        {!loading && brands.length === 0 && <p className="text-sm text-alabaster/40 py-10 col-span-full tracking-widest uppercase">No hay marcas registradas.</p>}
      </div>
    </div>
  );
}
