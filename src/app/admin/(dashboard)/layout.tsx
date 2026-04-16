import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/src/lib/infrastructure/supabase-server";
import AdminSidebar from "./components/Sidebar";

export const metadata = {
  title: "Oh! Admin Dashboard",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient();
  
  // Protect admin route
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-onyx text-alabaster selection:bg-gold-leaf selection:text-midnight-blue">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto bg-onyx relative border-l border-gold-heritage/10">
        <div className="absolute inset-0 bg-gradient-to-br from-gold-heritage/5 via-transparent to-transparent opacity-30 pointer-events-none" />
        <div className="p-8 md:p-12 max-w-7xl mx-auto min-h-full relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
