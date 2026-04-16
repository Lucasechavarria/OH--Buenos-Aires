
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/infrastructure/supabase-client";
import { Mail, Download, Search, Cake, Phone, Calendar } from "lucide-react";

export default function SubscribersAdmin() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBirthday, setFilterBirthday] = useState(false);

  const fetchSubscribers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("subscribers")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) setSubscribers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const filteredSubscribers = subscribers.filter(s => {
    const matchesSearch = s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.last_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBirthday = filterBirthday ? isBirthdayThisMonth(s.birth_date) : true;
    
    return matchesSearch && matchesBirthday;
  });

  const sendEmail = (email: string, firstName: string) => {
    const subject = encodeURIComponent("¡Feliz Cumpleaños de parte de Oh! Buenos Aires!");
    const body = encodeURIComponent(`Hola ${firstName},\n\n¡Queremos celebrar tu cumpleaños con un beneficio exclusivo! ...`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  const exportToCSV = () => {
    const headers = ["Nombre", "Apellido", "Email", "Telefono", "Fecha Nacimiento", "Suscrito En"];
    const rows = subscribers.map(s => [
      s.first_name,
      s.last_name,
      s.email,
      s.phone,
      s.birth_date,
      new Date(s.created_at).toLocaleDateString()
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `subscriptores_oh_buenos_aires_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper to check if birthday is this month
  const isBirthdayThisMonth = (dateString: string) => {
    if (!dateString) return false;
    const birthDate = new Date(dateString);
    const today = new Date();
    return birthDate.getMonth() === today.getMonth();
  };

  return (
    <div className="pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-serif text-white mb-2">Suscriptores</h2>
          <p className="text-alabaster/60 font-sans text-sm">Gestiona la base de datos de marketing recolectada en el Splash inicial.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={exportToCSV}
            className="bg-white/5 text-white border border-white/10 px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
          >
            <Download className="w-4 h-4" /> CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <p className="text-[10px] uppercase tracking-widest text-gold-heritage font-bold mb-1">Total Comunidad</p>
          <p className="text-3xl font-serif text-white">{subscribers.length}</p>
        </div>
        <div className="bg-gold-heritage/10 border border-gold-heritage/20 p-6 rounded-2xl relative overflow-hidden">
          <Cake className="absolute right-[-10px] bottom-[-10px] w-24 h-24 text-gold-heritage/10 rotate-12" />
          <p className="text-[10px] uppercase tracking-widest text-gold-heritage font-bold mb-1">Cumpleaños del Mes</p>
          <p className="text-3xl font-serif text-white">{subscribers.filter(s => isBirthdayThisMonth(s.birth_date)).length}</p>
        </div>
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <p className="text-[10px] uppercase tracking-widest text-gold-heritage font-bold mb-1">Nuevos (Últ. 30 días)</p>
          <p className="text-3xl font-serif text-white">
            {subscribers.filter(s => {
              const date = new Date(s.created_at);
              const thirtyDaysAgo = new Date();
              thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
              return date > thirtyDaysAgo;
            }).length}
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-alabaster/40" />
          <input 
            type="text" 
            placeholder="Buscar por nombre o email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-onyx/50 border border-gold-heritage/20 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-gold-heritage transition-all placeholder:text-alabaster/20"
          />
        </div>
        <button
          onClick={() => setFilterBirthday(!filterBirthday)}
          className={`px-6 py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all border ${filterBirthday ? 'bg-gold-heritage text-onyx border-gold-heritage' : 'bg-white/5 text-alabaster/60 border-white/10 hover:bg-white/10'}`}
        >
          <Cake className="w-4 h-4" />
          {filterBirthday ? 'Viendo Cumpleañeros' : 'Filtrar Cumpleaños'}
        </button>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md">
        <table className="w-full text-left font-sans text-sm">
          <thead>
            <tr className="border-b border-white/10 text-[10px] uppercase tracking-widest text-gold-heritage font-bold">
              <th className="px-6 py-5">Suscrito</th>
              <th className="px-6 py-5">Nombre Completo</th>
              <th className="px-6 py-5">Email</th>
              <th className="px-6 py-5">Contacto</th>
              <th className="px-6 py-5 text-center">Birthday</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-10 text-center text-alabaster/40 uppercase tracking-widest text-xs">Cargando base de datos...</td></tr>
            ) : filteredSubscribers.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-10 text-center text-alabaster/40 uppercase tracking-widest text-xs">No se encontraron suscriptores</td></tr>
            ) : filteredSubscribers.map((s) => (
              <tr key={s.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4 text-alabaster/40 text-[10px]">
                  {new Date(s.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <p className="text-white font-medium">{s.first_name} {s.last_name}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-alabaster/60 group-hover:text-white transition-colors">
                    <Mail className="w-3.5 h-3.5 text-gold-heritage/40" />
                    {s.email}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-alabaster/60">
                    <Phone className="w-3.5 h-3.5 text-gold-heritage/40" />
                    {s.phone}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-2 text-[11px] text-alabaster/60">
                      <Calendar className="w-3.5 h-3.5 text-gold-heritage/40" />
                      {s.birth_date}
                    </div>
                    {isBirthdayThisMonth(s.birth_date) && (
                      <span className="flex items-center gap-1.5 px-2 py-0.5 bg-pink-500/10 border border-pink-500/20 rounded-full text-[9px] text-pink-400 font-bold uppercase tracking-widest animate-pulse">
                        <Cake className="w-2.5 h-2.5" /> Mes de Cumple
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => sendEmail(s.email, s.first_name)}
                    className="p-3 text-gold-heritage hover:bg-gold-heritage/10 rounded-full transition-all group/btn flex items-center gap-2 ml-auto"
                    title="Enviar Email Directo"
                  >
                    <Mail className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap">Contactar</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-gold-heritage/5 border border-gold-heritage/10 rounded-2xl">
          <h4 className="flex items-center gap-2 text-gold-heritage text-[10px] font-bold uppercase tracking-widest mb-4">
            <Mail className="w-4 h-4" /> Marketing Automation
          </h4>
          <p className="text-sm text-alabaster/60 leading-relaxed">
            Puedes exportar la lista a CSV e importarla en herramientas como <strong>Mailchimp, Klaviyo o Sendinblue</strong> para enviar campañas personalizadas de email o SMS a tus clientes.
          </p>
        </div>
        <div className="p-6 bg-gold-heritage/5 border border-gold-heritage/10 rounded-2xl">
          <h4 className="flex items-center gap-2 text-gold-heritage text-[10px] font-bold uppercase tracking-widest mb-4">
            <Cake className="w-4 h-4" /> Fidelización por Cumpleaños
          </h4>
          <p className="text-sm text-alabaster/60 leading-relaxed">
            El sistema detecta automáticamente los cumpleaños del mes actual. Puedes usar esta información para enviar beneficios exclusivos ("Regalo de Cumpleaños") y aumentar la recurrencia al shopping.
          </p>
        </div>
      </div>
    </div>
  );
}
