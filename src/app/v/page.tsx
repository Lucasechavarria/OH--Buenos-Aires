
"use client";

import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, Clock, Store, Tag, Calendar, AlertTriangle, Loader2 } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { supabase } from "@/src/lib/infrastructure/supabase-client";

function ValidationContent() {
  const searchParams = useSearchParams();
  
  const brand = searchParams.get("b");
  const promo = searchParams.get("p");
  const exp = searchParams.get("exp");
  const rid = searchParams.get("rid");

  const [redemptionData, setRedemptionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);

  useEffect(() => {
    async function checkRedemption() {
      if (!rid) {
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('coupon_redemptions')
        .select('*')
        .eq('id', rid)
        .maybeSingle();
      
      if (data) setRedemptionData(data);
      setLoading(false);
    }
    checkRedemption();
  }, [rid]);

  const handleRedeem = async () => {
    if (!rid || redeeming) return;
    setRedeeming(true);
    
    const { error } = await supabase
      .from('coupon_redemptions')
      .update({ redeemed_at: new Date().toISOString() })
      .eq('id', rid);
    
    if (!error) {
      setRedemptionData({ ...redemptionData, redeemed_at: new Date().toISOString() });
    } else {
      alert("Error al canjear el cupón.");
    }
    setRedeeming(false);
  };

  const isExpired = exp && exp !== "no" ? new Date(exp) < new Date() : false;
  const isAlreadyRedeemed = redemptionData?.redeemed_at != null;
  const isValid = brand && promo && rid && !isExpired && !isAlreadyRedeemed;

  if (loading) {
    return (
      <div className="min-h-screen bg-onyx flex flex-col items-center justify-center text-white gap-4">
        <Loader2 className="w-8 h-8 text-celeste-oh animate-spin" />
        <p className="text-[10px] uppercase tracking-[0.3em] text-celeste-oh">Verificando Integridad...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-onyx flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white/5 backdrop-blur-xl border border-celeste-oh/20 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
        {/* Decorativo */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-celeste-oh/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10 text-center">
          <div className="flex justify-center mb-8">
            {isValid ? (
              <div className="h-24 w-24 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30 shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="h-12 w-12 text-emerald-400" />
              </div>
            ) : isAlreadyRedeemed ? (
              <div className="h-24 w-24 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/30 shadow-lg shadow-amber-500/20">
                <AlertTriangle className="h-12 w-12 text-amber-400" />
              </div>
            ) : (
              <div className="h-24 w-24 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/30 shadow-lg shadow-red-500/20">
                <XCircle className="h-12 w-12 text-red-400" />
              </div>
            )}
          </div>

          <h1 className="text-3xl font-serif text-white mb-2 uppercase tracking-tight">
            {isValid ? "Cupón Válido" : isAlreadyRedeemed ? "Cupón Ya Usado" : "Cupón Inválido"}
          </h1>
          <p className="text-celeste-oh text-[10px] font-bold uppercase tracking-[0.4em] mb-10">
            Oh! Buenos Aires • Verificación
          </p>

          <div className="space-y-6 text-left">
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
              <Store className="w-5 h-5 text-celeste-oh" />
              <div>
                <p className="text-[9px] uppercase tracking-widest text-alabaster/40 font-bold mb-0.5">Tienda</p>
                <p className="text-white font-serif">{brand || "Desconocida"}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
              <Tag className="w-5 h-5 text-celeste-oh" />
              <div>
                <p className="text-[9px] uppercase tracking-widest text-alabaster/40 font-bold mb-0.5">Beneficio</p>
                <p className="text-white font-medium">{promo || "No especificado"}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
              <Calendar className="w-5 h-5 text-celeste-oh" />
              <div>
                <p className="text-[9px] uppercase tracking-widest text-alabaster/40 font-bold mb-0.5">Estado / Vigencia</p>
                <p className={`font-bold ${isExpired ? 'text-red-400' : isAlreadyRedeemed ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {isAlreadyRedeemed ? `Usado el ${new Date(redemptionData.redeemed_at).toLocaleString()}` : isExpired ? 'Expirado' : 'Vigente'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center gap-6">
            {isValid && (
              <button
                onClick={handleRedeem}
                disabled={redeeming}
                className="w-full h-16 bg-brand-accent text-white text-shadow-hero font-bold uppercase tracking-[0.3em] text-[11px] rounded-2xl shadow-xl shadow-celeste-oh/20 hover:scale-105 transition-all flex items-center justify-center gap-3 disabled:opacity-50 btn-liquid"
              >
                {redeeming ? "Procesando..." : "Marcar como Canjeado"}
              </button>
            )}

            <div className="text-[9px] text-alabaster/20 uppercase tracking-[0.3em] font-bold">
              ID Único: {rid?.slice(0, 8) || "S/N"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ValidationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-onyx flex items-center justify-center text-white">Cargando...</div>}>
      <ValidationContent />
    </Suspense>
  );
}
