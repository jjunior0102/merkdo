import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { Package, Truck, LogOut, ShieldCheck } from "lucide-react";

export default async function AdminDashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-stone-50 text-slate-900 font-sans">
      {/* HEADER ADMIN */}
      <header className="bg-white border-b border-stone-200 py-4 px-8 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-serif font-bold text-[#3A4D28]">Merkdo Admin</h1>
          <span className="bg-emerald-100 text-[#3A4D28] text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Autenticado
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-600 hidden sm:inline">{session.user.email}</span>
          <form
            action={async () => {
              "use server";
              // Ação de logout simplificada
              redirect("/admin/login");
            }}
          >
            <button className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 font-medium px-3 py-2 rounded-lg hover:bg-red-50 transition-colors">
              <LogOut className="w-4 h-4" /> Sair
            </button>
          </form>
        </div>
      </header>

      {/* PAINEL CONTEÚDO */}
      <section className="max-w-7xl mx-auto px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-serif font-bold text-slate-900">Painel de Controle</h2>
          <p className="text-slate-600 text-sm mt-1">Gerencie produtos, estoque mínimo e fornecedores do seu mercadinho.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CARD PRODUTOS */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-[#3A4D28] mb-4">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-bold mb-2">Gerenciar Produtos</h3>
            <p className="text-sm text-slate-600 mb-6">Cadastre novos itens, controle o estoque atual, defina o estoque mínimo e adicione imagens via Vercel Blob.</p>
            <Link
              href="/admin/produtos"
              className="inline-flex items-center gap-2 bg-[#3A4D28] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-900 transition-all min-h-[44px]"
            >
              Acessar Produtos
            </Link>
          </div>

          {/* CARD FORNECEDORES */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-[#D96B43] mb-4">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-bold mb-2">Gerenciar Fornecedores</h3>
            <p className="text-sm text-slate-600 mb-6">Cadastre empresas parceiras, telefones e e-mails para vincular diretamente aos produtos do catálogo.</p>
            <Link
              href="/admin/fornecedores"
              className="inline-flex items-center gap-2 bg-[#3A4D28] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-900 transition-all min-h-[44px]"
            >
              Acessar Fornecedores
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}