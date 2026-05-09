"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/lib/infrastructure/supabase-client";
import { Lock } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // Auto-create demo users on the fly if they don't exist
    if (authError && authError.message.includes("Invalid login credentials") && 
       (email === "echavarrialucas1986@gmail.com" || email === "admin@ohbuenosaires.com")) {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (!signUpError) {
         authError = null; // Clear error if signup succeeds
      }
    }

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-onyx flex items-center justify-center p-6 text-alabaster selection:bg-celeste-oh selection:text-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-gradient-to-br from-celeste-oh/5 via-transparent to-transparent opacity-50" />
      
      <form onSubmit={handleLogin} className="max-w-sm w-full bg-onyx/80 backdrop-blur-md border border-celeste-oh/20 p-8 rounded-2xl shadow-2xl relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 border border-celeste-oh/30 rounded-full flex items-center justify-center mb-4 bg-onyx shadow-inner shadow-celeste-oh/10">
            <Lock className="w-5 h-5 text-celeste-oh" />
          </div>
          <h1 className="text-2xl font-serif text-white">Acceso <span className="text-celeste-oh italic font-light">Admin</span></h1>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-md mb-6 font-sans">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-alabaster/40 font-bold mb-2">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-alabaster/10 rounded-xl px-4 py-3 text-sm font-sans focus:outline-none focus:border-celeste-oh transition-colors"
              required 
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-alabaster/40 font-bold mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-alabaster/10 rounded-xl px-4 py-3 text-sm font-sans focus:outline-none focus:border-celeste-oh transition-colors"
              required 
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full mt-8 bg-brand-accent text-white text-shadow-hero font-bold uppercase tracking-[0.3em] text-[10px] py-4 rounded-xl hover:opacity-90 transition-colors flex justify-center items-center h-12"
        >
          {loading ? <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-current animate-spin" /> : "Ingresar"}
        </button>

        {/* Demo Fast Access */}
        <div className="mt-8 pt-6 border-t border-alabaster/10">
          <p className="text-[10px] text-alabaster/40 text-center mb-4 uppercase tracking-[0.2em] font-bold">Modo Demostración</p>
          <div className="flex flex-col gap-2">
            <button 
              type="button" 
              onClick={() => { setEmail('echavarrialucas1986@gmail.com'); setPassword('Anfaso12@'); }}
              className="w-full text-[11px] font-sans bg-onyx/50 border border-celeste-oh/20 py-2.5 rounded-lg hover:bg-celeste-oh/10 transition-colors text-alabaster shadow-sm"
            >
              Autocompletar Lucas
            </button>
            <button 
              type="button" 
              onClick={() => { setEmail('admin@ohbuenosaires.com'); setPassword('OhAdmin2026!'); }}
              className="w-full text-[11px] font-sans bg-onyx/50 border border-celeste-oh/20 py-2.5 rounded-lg hover:bg-celeste-oh/10 transition-colors text-alabaster shadow-sm"
            >
              Autocompletar Admin Genérico
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
