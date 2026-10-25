import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Package, Search, Activity } from "lucide-react";
import { revalidatePath } from "next/cache";

async function criarProduto(formData: FormData) {
  "use server";
  const nome = formData.get("nome") as string;
  const categoria = formData.get("categoria") as string;
  const precoStr = formData.get("preco") as string;
  const preco = precoStr ? parseFloat(precoStr.replace(",", ".")) : 0;
  const estoqueAtualVal = parseInt(formData.get("estoqueAtual") as string, 10);
  const estoqueMinimoVal = parseInt(formData.get("estoqueMinimo") as string, 10);
  const fornecedorId = formData.get("fornecedorId") as string;
  const imagemUrl = (formData.get("imagemUrl") as string) || "";

  if (!nome || isNaN(preco) || !fornecedorId) return;

  try {
    await prisma.produto.create({
      data: {
        nome, categoria, preco,
        estoqueAtual: isNaN(estoqueAtualVal) ? 25 : estoqueAtualVal,
        estoqueMinimo: isNaN(estoqueMinimoVal) ? 5 : estoqueMinimoVal,
        imagemUrl, fornecedorId,
      },
    });
  } catch (error) {}
  revalidatePath("/admin/produtos");
}

async function excluirProduto(id: string) {
  "use server";
  try { await prisma.produto.delete({ where: { id } }); } catch (error) {}
  revalidatePath("/admin/produtos");
}

export default async function ProdutosPage() {
  const [produtos, fornecedores] = await Promise.all([
    prisma.produto.findMany({ orderBy: { nome: "asc" }, include: { fornecedor: true } }),
    prisma.fornecedor.findMany({ orderBy: { nome: "asc" } }),
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
            <h1 className="text-base font-medium text-zinc-200 tracking-tight">Produtos & Catálogo</h1>
          </div>
          <Link href="/admin" className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors border border-white/5">
            <ArrowLeft className="w-3.5 h-3.5" /> Voltar
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <div className="bg-zinc-900/40 border border-white/5 p-6 rounded-2xl sticky top-28 shadow-2xl backdrop-blur-sm">
            <h2 className="text-sm font-semibold text-zinc-100 mb-5 flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" /> Adicionar Produto
            </h2>
            <form action={criarProduto} className="space-y-4">
              <div className="space-y-3">
                <input name="nome" required placeholder="Nome do Produto" className="w-full px-3 py-2 bg-black/50 border border-white/5 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-zinc-600" />
                <select name="categoria" className="w-full px-3 py-2 bg-black/50 border border-white/5 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50 transition-all appearance-none">
                  <option value="Padaria">Padaria</option>
                  <option value="Hortifrúti">Hortifrúti</option>
                  <option value="Mercearia">Mercearia</option>
                  <option value="Bebidas">Bebidas</option>
                  <option value="Limpeza">Limpeza</option>
                </select>
                <div className="grid grid-cols-2 gap-3">
                  <input name="preco" type="text" required placeholder="Preço (R$)" className="w-full px-3 py-2 bg-black/50 border border-white/5 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-zinc-600" />
                  <input name="estoqueMinimo" type="number" placeholder="Estoque Mín." className="w-full px-3 py-2 bg-black/50 border border-white/5 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-zinc-600" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input name="estoqueAtual" type="number" placeholder="Est. Atual" className="w-full px-3 py-2 bg-black/50 border border-white/5 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-zinc-600" />
                  <select name="fornecedorId" required className="w-full px-3 py-2 bg-black/50 border border-white/5 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50 transition-all appearance-none">
                    <option value="">Fornecedor...</option>
                    {fornecedores.map((f: any) => (
                      <option key={f.id} value={f.id}>{f.empresa || f.nome}</option>
                    ))}
                  </select>
                </div>
                <input name="imagemUrl" placeholder="URL da Imagem" className="w-full px-3 py-2 bg-black/50 border border-white/5 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-zinc-600" />
              </div>
              <button type="submit" className="w-full mt-6 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-lg text-sm font-medium transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.3)]">
                Salvar Produto
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="flex justify-between items-end mb-6">
            <h3 className="text-sm font-medium text-zinc-400">Catálogo ({produtos.length} itens)</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {produtos.map((p: any) => (
              <div key={p.id} className="group flex flex-col justify-between bg-zinc-900/20 border border-white/5 p-5 rounded-2xl hover:bg-zinc-900/40 transition-all duration-300">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-mono text-zinc-500 border border-white/10 px-2 py-0.5 rounded uppercase">{p.categoria}</span>
                    <span className="font-semibold text-zinc-200">R$ {p.preco.toFixed(2)}</span>
                  </div>
                  <h4 className="text-base font-medium text-zinc-100 mb-1">{p.nome}</h4>
                  <div className="flex items-center gap-2 text-xs text-zinc-500 mb-4">
                    <Package className="w-3.5 h-3.5 text-zinc-600" /> Estoque: {p.estoqueAtual} (Min: {p.estoqueMinimo})
                  </div>
                </div>
                <form action={async () => { "use server"; await excluirProduto(p.id); }} className="mt-4 pt-4 border-t border-white/5">
                  <button className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-red-400 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" /> Excluir
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}