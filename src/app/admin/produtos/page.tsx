import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Package, Building2 } from "lucide-react";
import { revalidatePath } from "next/cache";

async function criarProduto(formData: FormData) {
  "use server";
  const nome = formData.get("nome") as string;
  const categoria = formData.get("categoria") as string;
  const precoStr = formData.get("preco") as string;
  const preco = precoStr ? parseFloat(precoStr.replace(",", ".")) : 0;
  const estoqueMinimoVal = parseInt(formData.get("estoqueMinimo") as string, 10);
  const fornecedorIdRaw = formData.get("fornecedorId") as string | null;
  const fornecedorId = fornecedorIdRaw && fornecedorIdRaw !== "" ? fornecedorIdRaw : null;
  const imagem = (formData.get("imagem") as string) || "";

  if (!nome || isNaN(preco)) return;

  try {
    await prisma.produto.create({
      data: {
        nome,
        categoria,
        preco,
        estoqueMinimo: isNaN(estoqueMinimoVal) ? 5 : estoqueMinimoVal,
        imagem,
        ...(fornecedorId ? { fornecedorId } : {}),
      } as any,
    });
  } catch (error) {
    console.error("Erro ao criar produto:", error);
  }

  revalidatePath("/admin/produtos");
}

async function excluirProduto(id: string) {
  "use server";
  try {
    await prisma.produto.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Erro ao excluir produto:", error);
  }

  revalidatePath("/admin/produtos");
}

export default async function ProdutosPage() {
  const [produtos, fornecedores] = await Promise.all([
    prisma.produto.findMany({
      orderBy: { nome: "asc" },
      include: { fornecedor: true },
    }),
    prisma.fornecedor.findMany({
      orderBy: { nome: "asc" },
    }),
  ]);

  return (
    <main className="min-h-screen bg-stone-50 text-slate-950 font-sans pb-16">
      <header className="bg-white border-b border-stone-200 py-4 px-8 mb-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-[#3A4D28]">
            <ArrowLeft className="w-4 h-4" /> Voltar ao Painel
          </Link>
          <h1 className="text-xl font-serif font-bold text-[#3A4D28]">Gestão de Produtos e Estoque</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm h-fit">
          <h2 className="text-lg font-serif font-bold mb-4 flex items-center gap-2 text-[#3A4D28]">
            <Plus className="w-5 h-5 text-[#D96B43]" /> Novo Produto
          </h2>

          <form action={criarProduto} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Nome do Produto</label>
              <input
                name="nome"
                required
                placeholder="Ex: Café Orgânico"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#3A4D28]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Categoria</label>
              <select
                name="categoria"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#3A4D28] bg-white"
              >
                <option value="Padaria">Padaria</option>
                <option value="Hortifrúti">Hortifrúti</option>
                <option value="Mercearia">Mercearia</option>
                <option value="Bebidas">Bebidas</option>
                <option value="Limpeza">Limpeza</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Preço (R$)</label>
                <input
                  name="preco"
                  type="text"
                  required
                  placeholder="14.90"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#3A4D28]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Estoque Mín.</label>
                <input
                  name="estoqueMinimo"
                  type="number"
                  defaultValue="5"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#3A4D28]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Fornecedor</label>
              <select
                name="fornecedorId"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#3A4D28] bg-white"
              >
                <option value="">Selecione...</option>
                {fornecedores.map((f: any) => (
                  <option key={f.id} value={f.id}>
                    {f.empresa || f.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">URL da Imagem (Opcional)</label>
              <input
                name="imagem"
                placeholder="https://exemplo.com/foto.jpg"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#3A4D28]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#3A4D28] text-white py-3 rounded-xl font-medium hover:bg-emerald-900 transition-all text-sm min-h-[44px]"
            >
              Cadastrar Produto
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-serif font-bold text-slate-900">Catálogo de Produtos ({produtos.length})</h2>

          {produtos.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-stone-200 text-center text-slate-500">
              Nenhum produto cadastrado ainda.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {produtos.map((p: any) => (
                <div key={p.id} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="text-xs font-medium bg-emerald-50 text-[#3A4D28] px-2.5 py-1 rounded-full">
                          {p.categoria}
                        </span>
                        <h3 className="font-serif font-bold text-slate-900 text-base mt-2">{p.nome}</h3>
                      </div>
                      <span className="font-bold text-[#3A4D28] text-lg">
                        R$ {typeof p.preco === "number" ? p.preco.toFixed(2) : p.preco}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 mb-4 bg-stone-50 p-3 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Package className="w-3.5 h-3.5 text-[#D96B43]" />
                        <span>Estoque Mín: {p.estoqueMinimo} un.</span>
                      </div>
                      {p.fornecedor && (
                        <div className="flex items-center gap-2">
                          <Building2 className="w-3.5 h-3.5 text-[#D96B43]" />
                          <span>Fornecedor: {p.fornecedor.empresa || p.fornecedor.nome}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <form
                    action={async () => {
                      "use server";
                      await excluirProduto(p.id);
                    }}
                  >
                    <button className="w-full flex items-center justify-center gap-1.5 text-xs text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 py-2 rounded-xl transition-colors font-medium min-h-[44px]">
                      <Trash2 className="w-3.5 h-3.5" /> Remover Produto
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