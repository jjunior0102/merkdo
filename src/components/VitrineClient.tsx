"use client";

import { useState, useRef } from "react";
import { ShoppingBag, Plus, Minus, Trash2, CheckCircle2, Store, Search, ArrowRight, Package } from "lucide-react";
import { criarPedidoCliente } from "@/actions/pedido";

export default function VitrineClient({ produtos }: { produtos: any[] }) {
  const [cart, setCart] = useState<{ produto: any; quantidade: number }[]>([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  const [busca, setBusca] = useState("");
  const [cliente, setCliente] = useState("");
  const [telefone, setTelefone] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  // Lógica para Arrastar (Drag-to-Scroll) nas Categorias
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const onMouseLeave = () => setIsDragging(false);
  const onMouseUp = () => setIsDragging(false);

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Velocidade do arraste
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

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
      alert("Erro ao processar pedido. Tente novamente.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
      
      {/* Coluna Esquerda: Vitrine de Produtos */}
      <div className="lg:col-span-8 space-y-8">
        
        {/* Busca e Filtros Modernos */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center w-full">
          <div className="relative w-full sm:w-80 shrink-0 group">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
            <input
              type="text"
              placeholder="Pesquisar produtos..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/40 border border-white/5 rounded-xl text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-zinc-600 backdrop-blur-sm"
            />
          </div>

          {/* Container das Categorias com Drag-to-Scroll */}
          <div
            ref={scrollRef}
            onMouseDown={onMouseDown}
            onMouseLeave={onMouseLeave}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
            className="flex-1 min-w-0 w-full flex gap-2 overflow-x-auto pb-2 sm:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] cursor-grab active:cursor-grabbing select-none"
          >
            {categorias.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoriaAtiva(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap border ${
                  categoriaAtiva === cat
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                    : "bg-zinc-900/40 text-zinc-400 border-white/5 hover:bg-zinc-800 hover:text-zinc-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de Produtos */}
        {produtosFiltrados.length === 0 ? (
          <div className="border border-dashed border-white/10 rounded-3xl p-16 flex flex-col items-center justify-center text-center bg-zinc-900/20 backdrop-blur-sm">
            <Store className="w-12 h-12 text-zinc-700 mb-4" />
            <p className="text-base font-semibold text-zinc-300">Nenhum produto encontrado.</p>
            <p className="text-sm text-zinc-600 mt-1">Tente ajustar a sua busca ou categoria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {produtosFiltrados.map((produto: any) => (
              <div key={produto.id} className="group flex flex-col justify-between bg-zinc-900/30 border border-white/5 p-5 rounded-2xl hover:bg-zinc-900/60 hover:-translate-y-1 hover:border-white/10 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-mono font-medium text-zinc-500 border border-white/10 px-2 py-0.5 rounded uppercase">
                      {produto.categoria}
                    </span>
                    <span className="font-bold text-zinc-100 tracking-tight">
                      R$ {produto.preco.toFixed(2)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-zinc-200 text-sm mb-1">{produto.nome}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-6">
                    <Package className="w-3.5 h-3.5" /> <span>{produto.estoqueAtual} em estoque</span>
                  </div>
                </div>

                <button
                  onClick={() => adicionarAoCarrinho(produto)}
                  className="relative z-10 w-full bg-white/5 hover:bg-emerald-600 text-zinc-300 hover:text-white text-xs py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 border border-white/5 hover:border-transparent hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                >
                  <Plus className="w-3.5 h-3.5" /> Adicionar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Coluna Direita: Carrinho Sticky */}
      <div className="lg:col-span-4">
        <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 shadow-2xl backdrop-blur-md sticky top-28 flex flex-col max-h-[calc(100vh-8rem)]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-400" /> O seu Carrinho
            </h2>
            <span className="text-xs font-mono bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-full border border-white/5">
              {cart.reduce((acc, item) => acc + item.quantidade, 0)} itens
            </span>
          </div>

          {sucesso ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4 ring-1 ring-emerald-500/30">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="font-semibold text-zinc-100 mb-2">Pedido Enviado!</h3>
              <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                A nossa equipa já recebeu o seu pedido e vai prepará-lo em breve.
              </p>
              <button
                onClick={() => { setSucesso(false); setCliente(""); setTelefone(""); }}
                className="w-full bg-white/5 hover:bg-white/10 text-zinc-300 py-2.5 rounded-xl text-xs font-medium transition-colors border border-white/5"
              >
                Fazer Nova Encomenda
              </button>
            </div>
          ) : cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
              <ShoppingBag className="w-10 h-10 text-zinc-800 mb-3" />
              <p className="text-sm text-zinc-500 font-medium">O carrinho está vazio.</p>
            </div>
          ) : (
            <>
              {/* Lista de Itens */}
              <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {cart.map((item) => (
                  <div key={item.produto.id} className="flex justify-between items-center group">
                    <div>
                      <p className="text-sm font-medium text-zinc-200">{item.produto.nome}</p>
                      <p className="text-xs text-zinc-500 font-mono">R$ {item.produto.preco.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-3 bg-black/40 border border-white/5 rounded-lg p-1">
                      <button onClick={() => alterarQuantidade(item.produto.id, -1)} className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-colors">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-mono font-medium text-zinc-200 w-4 text-center">{item.quantidade}</span>
                      <button onClick={() => alterarQuantidade(item.produto.id, 1)} className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-colors">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total e Checkout */}
              <div className="pt-4 border-t border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-400">Total a Pagar</span>
                  <span className="text-lg font-bold text-zinc-100 tracking-tight">R$ {totalCarrinho.toFixed(2)}</span>
                </div>

                <form onSubmit={finalizarPedido} className="space-y-3">
                  <input
                    type="text" required placeholder="O seu Nome *"
                    value={cliente} onChange={(e) => setCliente(e.target.value)}
                    className="w-full px-3 py-2.5 bg-black/50 border border-white/5 rounded-xl text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-zinc-600"
                  />
                  <input
                    type="text" placeholder="Telefone / WhatsApp"
                    value={telefone} onChange={(e) => setTelefone(e.target.value)}
                    className="w-full px-3 py-2.5 bg-black/50 border border-white/5 rounded-xl text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-zinc-600"
                  />
                  <button
                    type="submit" disabled={enviando}
                    className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-medium transition-all text-sm shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {enviando ? "A processar..." : "Finalizar Pedido"} <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
      
    </div>
  );
}