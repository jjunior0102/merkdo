import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { Package, Building2, ShoppingBag, ArrowRight, ShieldCheck, LogOut } from "lucide-react";

export default async function AdminDashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <main className="min-h-screen bg-stone-50 text-slate-950 font-sans pb-16">
      <header className="bg-white border-b border-stone-200 py-4 px-8 mb-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-serif font-bold text-[#3A4D28]">Merkdo Admin</h1>
            <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-[#3A4D28] px-2.5 py-1 rounded-full font-medium border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" /> Autenticado
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-slate-600 font-medium">{session?.user?.email ?? "Administrador"}</span>
            <Link
              href="/api/auth/sign-out"
              className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 font-medium px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sair
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-serif font-bold text-slate-900">Painel de Controle</h2>
          <p className="text-slate-600 text-sm mt-1">Gerencie produtos, estoque, fornecedores e pedidos do seu mercadinho.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between hover:border-[#3A4D28] transition-all">
            <div>
              <div className="p-3 bg-emerald-50 rounded-xl text-[#3A4D28] w-fit mb-4">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-slate-900 mb-2">Gerenciar Produtos</h3>
              <p className="text-slate-600 text-sm mb-6">
                Cadastre novos itens, controle o catálogo e vincule aos fornecedores cadastrados.
              </p>
            </div>
            <Link
              href="/admin/produtos"
              className="inline-flex items-center justify-center gap-2 bg-[#3A4D28] text-white py-3 px-4 rounded-xl font-medium hover:bg-emerald-900 transition-all text-sm min-h-[44px]"
            >
              Acessar Produtos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between hover:border-[#3A4D28] transition-all">
            <div>
              <div className="p-3 bg-emerald-50 rounded-xl text-[#3A4D28] w-fit mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-slate-900 mb-2">Gerenciar Fornecedores</h3>
              <p className="text-slate-600 text-sm mb-6">
                Cadastre empresas parceiras, telefones e e-mails para vincular diretamente aos produtos.
              </p>
            </div>
            <Link
              href="/admin/fornecedores"
              className="inline-flex items-center justify-center gap-2 bg-[#3A4D28] text-white py-3 px-4 rounded-xl font-medium hover:bg-emerald-900 transition-all text-sm min-h-[44px]"
            >
              Acessar Fornecedores <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between hover:border-[#3A4D28] transition-all">
            <div>
              <div className="p-3 bg-emerald-50 rounded-xl text-[#3A4D28] w-fit mb-4">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-slate-900 mb-2">Controle de Pedidos</h3>
              <p className="text-slate-600 text-sm mb-6">
                Acompanhe em tempo real todos os pedidos feitos pelos clientes, visualize os itens e atualize o status.
              </p>
            </div>
            <Link
              href="/admin/pedidos"
              className="inline-flex items-center justify-center gap-2 bg-[#3A4D28] text-white py-3 px-4 rounded-xl font-medium hover:bg-emerald-900 transition-all text-sm min-h-[44px]"
            >
              Acessar Pedidos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}