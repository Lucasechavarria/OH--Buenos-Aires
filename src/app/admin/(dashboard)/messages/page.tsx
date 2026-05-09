"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/infrastructure/supabase-client";
import { Mail, Trash2, Search, Calendar, User, MessageSquare, CheckCircle2, Clock, Inbox, HelpCircle, Phone } from "lucide-react";
import HelpTooltip from "../components/HelpTooltip";

export default function MessagesAdmin() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) setMessages(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("contact_messages")
      .update({ status: newStatus })
      .eq("id", id);
    if (!error) fetchMessages();
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("¿Eliminar este mensaje permanentemente?")) return;
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (!error) fetchMessages();
  };

  const filteredMessages = messages.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" ? true : m.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-serif text-white mb-2 flex items-center gap-2">
            Bandeja de Entrada
            <HelpTooltip text="Los mensajes nuevos aparecen como 'Pendientes' con un borde celeste. Una vez atendidos, puedes marcarlos como 'Leídos' o 'Archivados' para mantener limpia tu bandeja." />
          </h2>
          <p className="text-alabaster/60 font-sans text-sm">Gestiona las consultas recibidas desde el formulario de contacto.</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
          {["all", "pending", "read", "archived"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${statusFilter === status ? 'bg-celeste-oh text-onyx' : 'text-alabaster/40 hover:text-white'}`}
            >
              {status === "all" ? "Todos" : status === "pending" ? "Pendientes" : status === "read" ? "Leídos" : "Archivados"}
            </button>
          ))}
        </div>
      </div>

      <div className="relative mb-10">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-alabaster/40" />
        <input 
          type="text" 
          placeholder="Buscar en mensajes..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-onyx/50 border border-celeste-oh/20 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-celeste-oh transition-all placeholder:text-alabaster/20"
        />
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-20 animate-pulse text-alabaster/40 uppercase tracking-widest text-xs">Cargando mensajes...</div>
        ) : filteredMessages.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
            <Inbox className="w-12 h-12 text-white/5 mx-auto mb-4" />
            <p className="text-sm text-alabaster/20 uppercase tracking-[0.4em]">No hay mensajes para mostrar</p>
          </div>
        ) : filteredMessages.map((m) => (
          <div key={m.id} className={`bg-white/5 backdrop-blur-md rounded-3xl border transition-all p-8 group ${m.status === 'pending' ? 'border-celeste-oh/30 bg-celeste-oh/5 shadow-lg shadow-celeste-oh/5' : 'border-white/10'}`}>
            <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
              <div className="flex gap-4">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 ${m.status === 'pending' ? 'bg-celeste-oh text-onyx' : 'bg-white/10 text-white/40'}`}>
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xl font-serif text-white mb-1">{m.name}</h4>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-alabaster/40">
                    <a href={`mailto:${m.email}`} className="flex items-center gap-2 hover:text-celeste-oh transition-colors">
                      <Mail className="w-3.5 h-3.5" /> {m.email}
                    </a>
                    {m.phone && (
                      <div className="flex items-center gap-2">
                         <Phone className="w-3.5 h-3.5" /> {m.phone}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-alabaster/40">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" /> {new Date(m.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" /> {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                {m.phone && (
                  <a 
                    href={`https://wa.me/${m.phone.replace(/\D/g, '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-full text-[9px] font-bold uppercase tracking-widest hover:bg-emerald-500/20 transition-all border border-emerald-500/20"
                  >
                    Contactar por WhatsApp
                  </a>
                )}
              </div>
            </div>

            <div className="bg-onyx/40 p-6 rounded-2xl border border-white/5 text-alabaster/80 leading-relaxed font-sans mb-6">
               <MessageSquare className="w-4 h-4 text-celeste-oh/30 mb-4" />
               {m.message}
            </div>

            <div className="flex items-center justify-between border-t border-white/5 pt-6">
               <div className="flex gap-3">
                  {m.status !== 'read' && (
                    <button 
                      onClick={() => updateStatus(m.id, 'read')}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-500/20 transition-all border border-emerald-500/20"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Marcar Leído
                    </button>
                  )}
                  {m.status !== 'archived' && (
                    <button 
                      onClick={() => updateStatus(m.id, 'archived')}
                      className="flex items-center gap-2 px-4 py-2 bg-white/5 text-alabaster/40 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all border border-white/10"
                    >
                      Archivar
                    </button>
                  )}
                  {m.status !== 'pending' && (
                    <button 
                      onClick={() => updateStatus(m.id, 'pending')}
                      className="flex items-center gap-2 px-4 py-2 bg-celeste-oh/10 text-celeste-oh rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-celeste-oh/20 transition-all border border-celeste-oh/20"
                    >
                      Reabrir
                    </button>
                  )}
               </div>
               
               <button 
                 onClick={() => deleteMessage(m.id)}
                 className="p-3 text-red-400/40 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
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
