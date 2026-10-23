"use client";

import { useState } from "react";
import { ShoppingBag, Plus, Minus, Trash2, CheckCircle2, Store, Search, Phone, User, X } from "lucide-react";
import { criarPedidoCliente } from "@/actions/pedido";

export default function VitrineClient({ produtos }: { produtos: any[] }) {
  const [cart, setCart] = useState<{ produto: any; quantidade: number }[]>([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  const [busca, setBusca] = useState("");
  const [cliente, setCliente] = useState("");
  const [telefone, setTelefone] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const categorias = ["Todos", "Padaria", "Hortifrúti", "Mercearia", "Bebidas", "Limpeza"];

  const produtosFiltrados = produtos.filter((p) => {
    const matchCat = categoriaAtiva === "Todos" || p.categoria === categoriaAtiva;
    const matchBusca = p.nome.toLowerCase().includes(busca.toLowerCase());
    return matchCat && matchBusca;
  });

  const adicionarAoCarrinho = (produto: any) => {
    setCart((prev) => {
      const existe = prev.find((item) => item.produto.id === produto.id);
      if (existe) {
        return prev.map((item) =>
          item.produto.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item
        );
      }
      return [...prev, { produto, quantidade: 1 }];
    });
    setCartOpen(true);
  };

  const alterarQuantidade = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.produto.id === id) {
            const novaQtd = item.quantidade + delta;
            return novaQtd > 0 ? { ...item, quantidade: novaQtd } : null;
          }
          return item;
        })
        .filter(Boolean) as any
    );
  };

  const totalCarrinho = cart.reduce((acc, item) => acc + item.produto.preco * item.quantidade, 0);

  const finalizarPedido = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliente || cart.length === 0) return;

    setEnviando(true);

    const itensResumo = cart
      .map((item) => `${item.quantidade}x ${item.produto.nome} (R$ ${(item.produto.preco * item.quantidade).toFixed(2)})`)
      .join("\n");

    const res = await criarPedidoCliente({
      cliente,
      telefone,
      itens: itensResumo,
      total: totalCarrinho,
    });

    setEnviando(false);

    if (res.success) {
      setSucesso(true);
      setCart([]);
    } else {
      alert("Erro ao enviar pedido. Tente novamente.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
      {/* Listagem de Produtos */}
      <div className="lg:col-span-2 space-y-6">
        {/* Barra de Pesquisa e Filtros */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Pesquisar produtos..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#3A4D28]"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {categorias.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoriaAtiva(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                  categoriaAtiva === cat
                    ? "bg-[#3A4D28] text-white shadow-sm"
                    : "bg-stone-100 text-slate-600 hover:bg-stone-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de Produtos */}
        {produtosFiltrados.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-stone-200 text-center text-slate-500 shadow-sm">
            <Store className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="text-base font-medium">Nenhum produto encontrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {produtosFiltrados.map((produto: any) => (
              <div key={produto.id} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between hover:border-[#3A4D28] transition-all">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-medium bg-emerald-50 text-[#3A4D28] px-2.5 py-1 rounded-full">
                      {produto.categoria}
                    </span>
                    <span className="font-bold text-[#3A4D28] text-lg">
                      R$ {produto.preco.toFixed(2)}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-slate-900 text-base mb-1">{produto.nome}</h3>
                  {produto.fornecedor && (
                    <p className="text-xs text-slate-500 mb-4">Fornecedor: {produto.fornecedor.empresa || produto.fornecedor.nome}</p>
                  )}
                </div>

                <button
                  onClick={() => adicionarAoCarrinho(produto)}
                  className="w-full bg-[#3A4D28] hover:bg-emerald-900 text-white text-xs py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-1.5 min-h-[40px]"
                >
                  <Plus className="w-4 h-4" /> Adicionar ao Carrinho
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Carrinho / Finalizar Pedido */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm h-fit sticky top-24 space-y-6">
        <div className="flex justify-between items-center border-b border-stone-100 pb-4">
          <h2 className="text-lg font-serif font-bold text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#3A4D28]" /> Seu Carrinho
          </h2>
          <span className="text-xs bg-stone-100 text-slate-700 font-semibold px-2.5 py-1 rounded-full">
            {cart.reduce((acc, item) => acc + item.quantidade, 0)} itens
          </span>
        </div>

        {sucesso ? (
          <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-[#3A4D28] mx-auto" />
            <h3 className="font-serif font-bold text-[#3A4D28] text-lg">Pedido Realizado!</h3>
            <p className="text-xs text-slate-600">O seu pedido foi enviado com sucesso para o nosso painel administrativo. Obrigado pela preferência!</p>
            <button
              onClick={() => { setSucesso(false); setCliente(""); setTelefone(""); }}
              className="w-full bg-[#3A4D28] text-white py-2 rounded-xl text-xs font-medium hover:bg-emerald-900 transition-colors mt-2"
            >
              Fazer Novo Pedido
            </button>
          </div>
        ) : cart.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm">
            O carrinho está vazio. Adicione produtos para começar.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="divide-y divide-stone-100 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.produto.id} className="py-3 flex justify-between items-center text-sm">
                  <div>
                    <p className="font-medium text-slate-900">{item.produto.nome}</p>
                    <p className="text-xs text-slate-500">R$ {item.produto.preco.toFixed(2)} un.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => alterarQuantidade(item.produto.id, -1)}
                      className="p-1 bg-stone-100 hover:bg-stone-200 rounded-lg text-slate-700"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-semibold w-5 text-center">{item.quantidade}</span>
                    <button
                      onClick={() => alterarQuantidade(item.produto.id, 1)}
                      className="p-1 bg-stone-100 hover:bg-stone-200 rounded-lg text-slate-700"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-stone-100 flex justify-between items-center font-bold text-base text-slate-900">
              <span>Total:</span>
              <span className="text-[#3A4D28]">R$ {totalCarrinho.toFixed(2)}</span>
            </div>

            <form onSubmit={finalizarPedido} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Seu Nome *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Valli"
                  value={cliente}
                  onChange={(e) => setCliente(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#3A4D28]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Telefone / WhatsApp</label>
                <input
                  type="text"
                  placeholder="(28) 99999-9999"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#3A4D28]"
                />
              </div>

              <button
                type="submit"
                disabled={enviando}
                className="w-full bg-[#3A4D28] hover:bg-emerald-900 text-white py-3 rounded-xl font-medium transition-all text-sm shadow-sm flex items-center justify-center gap-2 min-h-[44px]"
              >
                {enviando ? "A processar..." : "Finalizar Pedido pelo Site"} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}