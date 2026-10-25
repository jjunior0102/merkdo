import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Building2, Plus, Trash2, Mail, Phone, Edit3, Activity, X } from "lucide-react";
import { revalidatePath } from "next/cache";

async function salvarFornecedor(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const nome = formData.get("nome") as string;
  const empresa = formData.get("empresa") as string;
  const telefone = formData.get("telefone") as string;
  const email = formData.get("email") as string;

  if (!nome) return;

  try {
    if (id) {
      await prisma.fornecedor.update({
        where: { id },
        data: { nome, empresa, telefone, email },
      });
    } else {
      await prisma.fornecedor.create({
        data: { nome, empresa, telefone, email },
      });
    }
  } catch (error) {}
  revalidatePath("/admin/fornecedores");
}

async function excluirFornecedor(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  if (!id) return;

  try {
    await prisma.produto.deleteMany({ where: { fornecedorId: id } });
    await prisma.fornecedor.delete({ where: { id } });
  } catch (error) {}
  revalidatePath("/admin/fornecedores");
}

export default async function FornecedoresPage({
  searchParams,
}: {
  searchParams: Promise<{ editId?: string }>;
}) {
  const resolvedParams = await searchParams;
  const editId = resolvedParams?.editId;

  const [fornecedores, fornecedorEmEdicao] = await Promise.all([
    prisma.fornecedor.findMany({ orderBy: { nome: "asc" } }),
    editId ? prisma.fornecedor.findUnique({ where: { id: editId } }) : null,
  ]);

  return (
    <main className="min-h-screen bg-[#09090b] text-zinc-300 font-sans pb-16">
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#09090b]/80 border-b border-white/5 py-4 px-8 mb-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center gap-2 hover:opacity-80 transition-all">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <Activity className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-base font-semibold text-zinc-100 tracking-tight hidden sm:block">Merkdo</span>
            </Link>
            <span className="text-zinc-700 text-lg font-light hidden sm:block">/</span>
            <h1 className="text-base font-medium text-zinc-200 tracking-tight">Fornecedores & Parceiros</h1>
          </div>
          <Link href="/admin" className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors border border-white/5">
            <ArrowLeft className="w-3.5 h-3.5" /> Voltar
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Painel Esquerdo: Formulário */}
        <div className="lg:col-span-4">
          <div className="bg-zinc-900/40 border border-white/5 p-6 rounded-2xl sticky top-28 shadow-2xl backdrop-blur-sm">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                {fornecedorEmEdicao ? <Edit3 className="w-4 h-4 text-amber-400" /> : <Plus className="w-4 h-4 text-emerald-400" />}
                {fornecedorEmEdicao ? "Editar Parceiro" : "Novo Parceiro"}
              </h2>
              {fornecedorEmEdicao && (
                <Link href="/admin/fornecedores" className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1">
                  <X className="w-3.5 h-3.5" /> Cancelar
                </Link>
              )}
            </div>

            <form action={salvarFornecedor} className="space-y-3">
              <input type="hidden" name="id" value={fornecedorEmEdicao?.id || ""} />

              <input
                name="empresa"
                required
                defaultValue={fornecedorEmEdicao?.empresa || ""}
                placeholder="Nome da Empresa"
                className="w-full px-3 py-2 bg-black/50 border border-white/5 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-zinc-600"
              />
              <input
                name="nome"
                required
                defaultValue={fornecedorEmEdicao?.nome || ""}
                placeholder="Nome do Contato"
                className="w-full px-3 py-2 bg-black/50 border border-white/5 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-zinc-600"
              />
              
              <div className="grid grid-cols-2 gap-3">
                <input
                  name="telefone"
                  defaultValue={fornecedorEmEdicao?.telefone || ""}
                  placeholder="Telefone"
                  className="w-full px-3 py-2 bg-black/50 border border-white/5 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-zinc-600"
                />
                <input
                  name="email"
                  type="email"
                  defaultValue={fornecedorEmEdicao?.email || ""}
                  placeholder="E-mail"
                  className="w-full px-3 py-2 bg-black/50 border border-white/5 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-zinc-600"
                />
              </div>

              <button
                type="submit"
                className={`w-full mt-6 py-2.5 rounded-lg text-sm font-medium transition-all text-white shadow-lg ${
                  fornecedorEmEdicao
                    ? "bg-amber-600 hover:bg-amber-500 shadow-[0_0_15px_rgba(217,119,6,0.2)]"
                    : "bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                }`}
              >
                {fornecedorEmEdicao ? "Atualizar Fornecedor" : "Salvar Fornecedor"}
              </button>
            </form>
          </div>
        </div>

        {/* Painel Direito: Listagem */}
        <div className="lg:col-span-8">
          <div className="flex justify-between items-end mb-6">
            <h3 className="text-sm font-medium text-zinc-400">Lista Registrada ({fornecedores.length})</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fornecedores.map((f: any) => (
              <div key={f.id} className="group flex flex-col justify-between bg-zinc-900/20 border border-white/5 p-5 rounded-2xl hover:bg-zinc-900/40 transition-all duration-300">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-zinc-800/50 border border-white/5 flex items-center justify-center mb-4">
                    <Building2 className="w-5 h-5 text-zinc-500" />
                  </div>
                  <h4 className="text-base font-medium text-zinc-100 mb-1">{f.empresa}</h4>
                  <p className="text-sm text-zinc-400 mb-4">{f.nome}</p>
                  
                  <div className="space-y-1.5 mb-4">
                    {f.telefone && <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono"><Phone className="w-3.5 h-3.5" /> {f.telefone}</div>}
                    {f.email && <div className="flex items-center gap-2 text-xs text-zinc-500"><Mail className="w-3.5 h-3.5" /> {f.email}</div>}
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <Link
                    href={`/admin/fornecedores?editId=${f.id}`}
                    className="flex items-center gap-1.5 text-xs text-amber-400/80 hover:text-amber-400 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Editar
                  </Link>

                  <form action={excluirFornecedor}>
                    <input type="hidden" name="id" value={f.id} />
                    <button type="submit" className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-red-400 transition-colors cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" /> Remover
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}