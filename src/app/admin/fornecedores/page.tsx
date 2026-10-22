import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Building2, Phone, Mail } from "lucide-react";
import { revalidatePath } from "next/cache";

async function criarFornecedor(formData: FormData) {
  "use server";
  const empresa = formData.get("empresa") as string;
  const telefone = formData.get("telefone") as string;
  const email = formData.get("email") as string;

  if (!empresa) return;

  await prisma.fornecedor.create({
    data: { empresa, telefone, email },
  });

  revalidatePath("/admin/fornecedores");
}

async function excluirFornecedor(id: string) {
  "use server";
  await prisma.fornecedor.delete({
    where: { id },
  });

  revalidatePath("/admin/fornecedores");
}

export default async function FornecedoresPage() {
  const fornecedores = await prisma.fornecedor.findMany({
    orderBy: { empresa: "asc" },
    include: { _count: { select: { produtos: true } } },
  });

  return (
    <main className="min-h-screen bg-stone-50 text-slate-950 font-sans pb-16">
      <header className="bg-white border-b border-stone-200 py-4 px-8 mb-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-[#3A4D28]">
            <ArrowLeft className="w-4 h-4" /> Voltar ao Painel
          </Link>
          <h1 className="text-xl font-serif font-bold text-[#3A4D28]">Gestão de Fornecedores</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm h-fit">
          <h2 className="text-lg font-serif font-bold mb-4 flex items-center gap-2 text-[#3A4D28]">
            <Plus className="w-5 h-5 text-[#D96B43]" /> Novo Fornecedor
          </h2>

          <form action={criarFornecedor} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Nome da Empresa / Produtor</label>
              <input
                name="empresa"
                required
                placeholder="Ex: Hortifrúti Verde Vida"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#3A4D28]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Telefone / WhatsApp</label>
              <input
                name="telefone"
                placeholder="(27) 99999-9999"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#3A4D28]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">E-mail</label>
              <input
                name="email"
                type="email"
                placeholder="contato@verdevida.com"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#3A4D28]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#3A4D28] text-white py-3 rounded-xl font-medium hover:bg-emerald-900 transition-all text-sm min-h-[44px]"
            >
              Cadastrar Fornecedor
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-serif font-bold text-slate-900">Fornecedores Cadastrados ({fornecedores.length})</h2>

          {fornecedores.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-stone-200 text-center text-slate-500">
              Nenhum fornecedor cadastrado ainda.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fornecedores.map((f: any) => (
                <div key={f.id} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-emerald-50 rounded-xl text-[#3A4D28]">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-slate-900 text-base">{f.empresa}</h3>
                        <span className="text-xs text-slate-500">{f._count.produtos} produto(s) vinculado(s)</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 mb-4 bg-stone-50 p-3 rounded-xl">
                      {f.telefone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-[#D96B43]" />
                          <span>Tel: {f.telefone}</span>
                        </div>
                      )}
                      {f.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-[#D96B43]" />
                          <span>E-mail: {f.email}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <form
                    action={async () => {
                      "use server";
                      await excluirFornecedor(f.id);
                    }}
                  >
                    <button className="w-full flex items-center justify-center gap-1.5 text-xs text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 py-2 rounded-xl transition-colors font-medium min-h-[44px]">
                      <Trash2 className="w-3.5 h-3.5" /> Remover Fornecedor
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}