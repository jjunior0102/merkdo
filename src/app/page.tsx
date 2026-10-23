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
    <main className="min-h-screen bg-stone-50 text-slate-950 font-sans pb-16">
      <header className="bg-white border-b border-stone-200 py-4 px-8 mb-8 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 rounded-xl text-[#3A4D28]">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold text-[#3A4D28]">Merkdo</h1>
              <p className="text-xs text-slate-500">O seu mercadinho de bairro na web</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-[#3A4D28] bg-stone-100 hover:bg-stone-200 px-3.5 py-2 rounded-xl transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-[#3A4D28]" /> Painel Admin
            </Link>
          </div>
        </div>
      </header>

      <VitrineClient produtos={produtos} />
    </main>
  );
}