import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { Package, Building2, ShoppingBag, ArrowRight, ShieldCheck, LogOut, Sparkles, TrendingUp } from "lucide-react";

export default async function AdminDashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <main className="min-h-screen bg-[#0f1410] text-stone-100 font-sans selection:bg-[#3A4D28] selection:text-white pb-20 relative overflow-hidden">
      {/* Gradiente de fundo ultra-suave estilo Vercel/Linear */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-emerald-950/40 via-[#3A4D28]/10 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Header com Glassmorphism */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#0f1410]/80 border-b border-stone-800/60 py-4 px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#3A4D28] to-emerald-800 flex items-center justify-center shadow-inner shadow-emerald-400/20">
              <Sparkles className="w-4 h-4 text-emerald-200" />
            </div>
            <div>
              <h1 className="text-lg font-serif font-bold text-stone-100 tracking-tight">Merkdo <span className="text-emerald-400 font-sans text-xs px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800/50 ml-1">Workspace</span></h1>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <span className="text-stone-400 text-xs hidden sm:inline-block font-mono bg-stone-900/80 px-3 py-1.5 rounded-lg border border-stone-800">
              {session?.user?.email ?? "Administrador"}
            </span>
            <Link
              href="/api/auth/sign-out"
              className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-medium px-3.5 py-2 rounded-xl bg-rose-950/30 hover:bg-rose-950/50 border border-rose-900/40 transition-all shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" /> Sair
            </Link>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal em Bento Grid */}
      <div className="max-w-7xl mx-auto px-8 pt-10 space-y-8">
        
        {/* Banner de Boas-vindas Imersivo */}
        <div className="relative rounded-3xl p-8 bg-gradient-to-r from-stone-900/90 via-stone-900/50 to-[#141c14] border border-stone-800/80 shadow-2xl overflow-hidden backdrop-blur-xl">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 mb-3 px-3 py-1 rounded-full bg-emerald-950/50 border border-emerald-800/40">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Sistema Operacional Ativo
              </div>
              <h2 className="text-3xl font-serif font-bold text-stone-50 tracking-tight">Painel de Gestão</h2>
              <p className="text-stone-400 text-sm mt-1 max-w-xl">
                Acompanhe os pedidos em tempo real, gira o seu inventário de produtos e mantenha os parceiros conectados num só lugar.
              </p>
            </div>
            
            <div className="flex items-center gap-3 bg-stone-950/60 p-2.5 rounded-2xl border border-stone-800">
              <div className="p-2.5 bg-emerald-900/30 rounded-xl text-emerald-400 border border-emerald-800/30">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="pr-3">
                <p className="text-[10px] uppercase font-mono text-stone-400 tracking-wider">Status da Loja</p>
                <p className="text-xs font-semibold text-emerald-300">Operação Normalizada</p>
              </div>
            </div>
          </div>
        </div>

        {/* Grid Modular (Bento Grid Assimétrica) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Bloco de Maior Destaque: Controle de Pedidos (Ocupa 2 colunas) */}
          <div className="lg:col-span-2 group relative rounded-3xl p-8 bg-gradient-to-br from-stone-900/80 via-stone-900/40 to-[#121912] border border-stone-800/80 shadow-xl hover:border-emerald-700/50 transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="p-3.5 bg-emerald-950/60 rounded-2xl text-emerald-400 border border-emerald-800/50 shadow-inner">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono text-emerald-400/80 bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-900/50">
                  Operação Crítica
                </span>
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-100 mb-2 group-hover:text-emerald-300 transition-colors">
                Controle de Pedidos
              </h3>
              <p className="text-stone-400 text-sm max-w-lg mb-8 leading-relaxed">
                Acompanhe o fluxo de vendas do dia em tempo real, visualize os itens detalhados de cada cliente, altere status de entrega e otimize o atendimento do mercadinho.
              </p>
            </div>

            <Link
              href="/admin/pedidos"
              className="inline-flex items-center justify-between bg-emerald-900/30 hover:bg-emerald-900/50 text-emerald-200 border border-emerald-700/40 py-3.5 px-5 rounded-2xl font-medium transition-all duration-300 text-sm group-hover:translate-x-1"
            >
              <span>Acessar Painel de Pedidos</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </Link>
          </div>

          {/* Coluna Lateral: Gerenciar Produtos & Fornecedores */}
          <div className="space-y-6 flex flex-col justify-between">
            
            {/* Bloco de Produtos */}
            <div className="group relative rounded-3xl p-6 bg-stone-900/60 border border-stone-800/80 shadow-xl hover:border-stone-700 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="p-3 bg-stone-800/80 rounded-xl text-stone-200 border border-stone-700/50">
                    <Package className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-base font-serif font-bold text-stone-100 mb-1">Gerenciar Produtos</h3>
                <p className="text-stone-400 text-xs mb-4">
                  Controlo de inventário, preços e categorias do catálogo.
                </p>
              </div>
              <Link
                href="/admin/produtos"
                className="inline-flex items-center justify-between text-xs font-medium text-stone-300 hover:text-white bg-stone-800/50 hover:bg-stone-800 py-2.5 px-4 rounded-xl border border-stone-700/60 transition-all"
              >
                <span>Catálogo de Produtos</span>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
              </Link>
            </div>

            {/* Bloco de Fornecedores */}
            <div className="group relative rounded-3xl p-6 bg-stone-900/60 border border-stone-800/80 shadow-xl hover:border-stone-700 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="p-3 bg-stone-800/80 rounded-xl text-stone-200 border border-stone-700/50">
                    <Building2 className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-base font-serif font-bold text-stone-100 mb-1">Gerenciar Fornecedores</h3>
                <p className="text-stone-400 text-xs mb-4">
                  Registo e contactos de parceiros comerciais.
                </p>
              </div>
              <Link
                href="/admin/fornecedores"
                className="inline-flex items-center justify-between text-xs font-medium text-stone-300 hover:text-white bg-stone-800/50 hover:bg-stone-800 py-2.5 px-4 rounded-xl border border-stone-700/60 transition-all"
              >
                <span>Lista de Parceiros</span>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
              </Link>
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}