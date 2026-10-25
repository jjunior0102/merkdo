import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { Package, Building2, ShoppingBag, ArrowRight, LogOut, Activity, BarChart3 } from "lucide-react";

export default async function AdminDashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <main className="min-h-screen bg-[#09090b] text-zinc-300 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 pb-20 relative overflow-hidden">
      {/* Glow de fundo - Vercel Style */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Header Glassmorphism */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#09090b]/70 border-b border-white/5 py-4 px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* Logo agora é clicável e tem efeito hover */}
          <Link href="/admin" className="flex items-center gap-3 hover:opacity-80 transition-all cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-semibold text-zinc-100 tracking-tight">Merkdo<span className="text-zinc-500 font-normal ml-1">Workspace</span></h1>
          </Link>

          <div className="flex items-center gap-4 text-sm">
            <span className="text-zinc-500 font-mono text-xs border border-white/5 bg-white/[0.02] px-3 py-1.5 rounded-full hidden sm:block">
              {session?.user?.email ?? "Administrador"}
            </span>
            <Link
              href="/api/auth/sign-out"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Sair
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 pt-12 space-y-6">
        
        {/* Banner Status */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-bold text-zinc-100 tracking-tight">Visão Geral</h2>
            <p className="text-zinc-500 text-sm mt-1">Sua central de comando de operações e estoque.</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Sistema Online
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Módulo Principal: Pedidos */}
          <div className="lg:col-span-2 group relative rounded-2xl p-8 bg-zinc-900/40 border border-white/5 shadow-2xl hover:bg-zinc-900/60 hover:border-emerald-500/30 transition-all duration-500 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div>
              <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 w-fit mb-6 ring-1 ring-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-zinc-100 mb-2 tracking-tight">Fila de Pedidos</h3>
              <p className="text-zinc-400 text-sm max-w-md leading-relaxed">
                Gestão em tempo real das compras realizadas pelos clientes. Altere status, verifique itens e organize entregas.
              </p>
            </div>
            <div className="mt-8 flex items-center justify-between">
              <Link href="/admin/pedidos" className="inline-flex items-center gap-2 bg-white text-black hover:bg-zinc-200 py-2.5 px-5 rounded-full font-medium transition-all text-sm">
                Abrir Central de Pedidos
              </Link>
              <BarChart3 className="w-24 h-12 text-zinc-800 opacity-50" />
            </div>
          </div>

          <div className="space-y-6 flex flex-col">
            {/* Módulo Secundário: Produtos */}
            <Link href="/admin/produtos" className="group flex-1 rounded-2xl p-6 bg-zinc-900/40 border border-white/5 hover:border-white/10 hover:bg-zinc-900/60 transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
              <div>
                <Package className="w-5 h-5 text-zinc-400 mb-4 group-hover:text-emerald-400 transition-colors" />
                <h3 className="text-base font-semibold text-zinc-100">Produtos & Estoque</h3>
                <p className="text-zinc-500 text-xs mt-1">Cadastro, precificação e alertas de estoque baixo.</p>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs font-medium text-emerald-400 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all">
                Acessar Catálogo <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            {/* Módulo Secundário: Fornecedores */}
            <Link href="/admin/fornecedores" className="group flex-1 rounded-2xl p-6 bg-zinc-900/40 border border-white/5 hover:border-white/10 hover:bg-zinc-900/60 transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
              <div>
                <Building2 className="w-5 h-5 text-zinc-400 mb-4 group-hover:text-emerald-400 transition-colors" />
                <h3 className="text-base font-semibold text-zinc-100">Fornecedores</h3>
                <p className="text-zinc-500 text-xs mt-1">Gestão de contatos e parcerias comerciais.</p>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs font-medium text-emerald-400 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all">
                Acessar Parceiros <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}