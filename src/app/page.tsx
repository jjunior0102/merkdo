import { prisma } from "@/lib/prisma";
import VitrineClient from "@/components/VitrineClient";
import Link from "next/link";
import { Store, ShieldCheck } from "lucide-react";

export default async function HomePage() {
  const produtos = await prisma.produto.findMany({
    orderBy: { nome: "asc" },
    include: { fornecedor: true },
  });

  return (
    <main className="min-h-screen bg-[#09090b] text-zinc-300 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 pb-16 relative overflow-hidden">
      {/* Glow de fundo - Efeito Vercel */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none -z-10" />

      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#09090b]/70 border-b border-white/5 py-4 px-8 mb-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Store className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-zinc-100 tracking-tight">Merkdo</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg transition-colors border border-white/5 shadow-sm"
            >
              <ShieldCheck className="w-4 h-4" /> Acesso Restrito
            </Link>
          </div>
        </div>
      </header>

      <VitrineClient produtos={produtos} />
    </main>
  );
}