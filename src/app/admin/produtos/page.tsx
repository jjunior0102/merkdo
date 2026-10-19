import { prisma } from "@/lib/prisma";
import { criarProduto, excluirProduto } from "./actions";
import Link from "next/link";
import Image from "next/image";
import { Package, ArrowLeft, Trash2, Plus, AlertTriangle, Tag, DollarSign, Layers } from "lucide-react";

export default async function ProdutosPage() {
  const produtos = await prisma.produto.findMany({
    orderBy: { createdAt: "desc" },
    include: { fornecedor: true },
  });

  const fornecedores = await prisma.fornecedor.findMany({
    orderBy: { empresa: "asc" },
  });

  const categorias = ["Hortifrúti", "Açougue", "Padaria", "Mercearia", "Adega", "Limpeza"];

  return (
    <main className="min-h-screen bg-stone-50 text-slate-900 font-sans pb-16">
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

          <form
            action={async (formData) => {
              "use server";
              await criarProduto(null, formData);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Nome do Produto</label>
              <input
                name="nome"
                required
                placeholder="Ex: Café Orgânico Artesanal"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#3A4D28]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Categoria</label>
              <select
                name="categoria"
                required
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#3A4D28] bg-white"
              >
                <option value="">Selecione uma categoria...</option>
                {categorias.map((cat: string) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Preço (R$)</label>
                <input
                  name="preco"
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  placeholder="14.90"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#3A4D28]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Fornecedor</label>
                <select
                  name="fornecedorId"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#3A4D28] bg-white"
                >
                  <option value="">Fornecedor...</option>
                  {fornecedores.map((f: any) => (
                    <option key={f.id} value={f.id}>{f.empresa}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Estoque Atual</label>
                <input
                  name="estoqueAtual"
                  type="number"
                  min="0"
                  required
                  placeholder="25"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#3A4D28]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Estoque Mínimo</label>
                <input
                  name="estoqueMinimo"
                  type="number"
                  min="0"
                  required
                  placeholder="5"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#3A4D28]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Imagem do Produto (Máx 2MB)</label>
              <input
                name="imagem"
                type="file"
                accept="image/*"
                required
                className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-[#3A4D28] hover:file:bg-emerald-100 cursor-pointer"
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
              {produtos.map((p: any) => {
                const emAlertaEstoque = p.estoqueAtual <= p.estoqueMinimo;

                return (
                  <div key={p.id} className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex flex-col justify-between">
                    <div>
                      <div className="relative h-40 w-full bg-stone-100">
                        <Image src={p.imagemUrl} alt={p.nome} fill className="object-cover" />
                        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#3A4D28] text-xs font-medium px-2.5 py-1 rounded-full">
                          {p.categoria}
                        </span>
                        {emAlertaEstoque && (
                          <span className="absolute top-3 right-3 bg-red-100 text-red-700 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" /> Estoque Baixo
                          </span>
                        )}
                      </div>

                      <div className="p-5">
                        <h3 className="font-serif font-bold text-slate-900 text-lg mb-1">{p.nome}</h3>
                        <p className="text-xs text-slate-500 mb-4">Fornecedor: {p.fornecedor.empresa}</p>

                        <div className="grid grid-cols-2 gap-2 text-xs mb-4 bg-stone-50 p-3 rounded-xl">
                          <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                            <DollarSign className="w-4 h-4 text-[#D96B43]" />
                            R$ {p.preco.toFixed(2)}
                          </div>
                          <div className={`flex items-center gap-1.5 font-medium ${emAlertaEstoque ? 'text-red-600' : 'text-slate-700'}`}>
                            <Layers className="w-4 h-4 text-[#D96B43]" />
                            Estoque: {p.estoqueAtual} (Mín: {p.estoqueMinimo})
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="px-5 pb-5">
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
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}