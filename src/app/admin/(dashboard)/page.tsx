export default function DashboardHome() {
  return (
    <div>
      <h2 className="text-3xl font-serif text-white mb-2">Panel Principal</h2>
      <p className="text-alabaster/60 font-sans mb-8">Gestión de contenido de Oh! Buenos Aires</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-gold-heritage/20 shadow-xl transition-all hover:border-gold-heritage/40">
          <h3 className="font-bold text-lg mb-2 text-white">Banners Activos</h3>
          <p className="text-sm text-alabaster/60 mb-4">Administra los banners promocionales del inicio.</p>
          <a href="/admin/banners" className="text-gold-metallic text-[10px] font-bold uppercase tracking-[0.2em] hover:text-gold-shine flex items-center gap-1">Gestionar &rarr;</a>
        </div>
        
        <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-gold-heritage/20 shadow-xl transition-all hover:border-gold-heritage/40">
          <h3 className="font-bold text-lg mb-2 text-white">Marcas (Boutiques)</h3>
          <p className="text-sm text-alabaster/60 mb-4">Añade o edita las tarjetas de las marcas del shopping.</p>
          <a href="/admin/brands" className="text-gold-metallic text-[10px] font-bold uppercase tracking-[0.2em] hover:text-gold-shine flex items-center gap-1">Gestionar &rarr;</a>
        </div>

        <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-gold-heritage/20 shadow-xl transition-all hover:border-gold-heritage/40">
          <h3 className="font-bold text-lg mb-2 text-white">Promociones</h3>
          <p className="text-sm text-alabaster/60 mb-4">Crea cupones y ofertas activas.</p>
          <a href="/admin/promotions" className="text-gold-metallic text-[10px] font-bold uppercase tracking-[0.2em] hover:text-gold-shine flex items-center gap-1">Gestionar &rarr;</a>
        </div>
      </div>
    </div>
  );
}
