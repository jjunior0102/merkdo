import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ShoppingBasket, Clock, MapPin, Search, MessageCircle, ArrowRight } from "lucide-react";

interface HomeProps {
  searchParams: Promise<{ categoria?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const categoriaSelecionada = params.categoria;

  const categorias = ["Hortifrúti", "Açougue", "Padaria", "Mercearia", "Adega", "Limpeza"];

  const produtos = await prisma.produto.findMany({
    where: categoriaSelecionada ? { categoria: categoriaSelecionada } : undefined,
    include: { fornecedor: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-stone-50 text-slate-900 font-sans">
      {/* HEADER SIMPLES */}
      <header className="w-full py-4 px-4 sm:px-8 flex justify-between items-center max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#3A4D28]">Merkdo.</h1>
        <Link 
          href="/admin" 
          className="text-xs sm:text-sm font-medium text-[#3A4D28] hover:text-[#D96B43] transition-colors min-h-[44px] flex items-center"
        >
          Área do Lojista
        </Link>
      </header>

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-20 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-emerald-100 text-[#3A4D28] text-xs sm:text-sm font-medium border border-emerald-200">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Aberto hoje até as 21h
        </div>

        <h2 className="text-3xl sm:text-6xl font-serif font-bold text-slate-900 leading-tight max-w-3xl mb-4">
          O mercado do seu bairro com <span className="text-[#D96B43]">produtos frescos</span> todos os dias.
        </h2>
        
        <p className="text-sm sm:text-lg text-slate-600 max-w-xl mb-8 font-sans">
          Artesanal, selecionado e pertinho de você. Explore nossas prateleiras digitais e receba no conforto de casa.
        </p>

        {/* BARRA DE PESQUISA RÁPIDA (URL SearchParams) */}
        <form action="/busca" method="GET" className="w-full max-w-lg flex gap-2 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            <input
              name="q"
              placeholder="O que você procura hoje? (Ex: Café, Pão)"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#3A4D28] bg-white shadow-sm"
              required
            />
          </div>
          <button type="submit" className="bg-[#3A4D28] text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-emerald-900 transition-all min-h-[44px]">
            Buscar
          </button>
        </form>

        {/* FEATURES BADGES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-stone-200 pt-8 w-full max-w-xl">
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-700">
            <Clock className="w-4 h-4 text-[#D96B43]" />
            <span>Entrega rápida em até 45 min</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-700">
            <MapPin className="w-4 h-4 text-[#D96B43]" />
            <span>Produtores locais parceiros</span>
          </div>
        </div>
      </section>

      {/* CATÁLOGO / FOLHETO DIGITAL */}
      <section id="catalogo" className="max-w-7xl mx-auto px-4 sm:px-8 py-12 border-t border-stone-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h3 className="text-2xl font-serif font-bold text-slate-900">Catálogo de Produtos</h3>
            <p className="text-xs sm:text-sm text-slate-600">Escolha uma categoria abaixo ou navegue por nossas ofertas.</p>
          </div>

          {/* FILTROS POR CATEGORIA */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            <Link
              href="/"
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap min-h-[44px] flex items-center transition-all ${
                !categoriaSelecionada ? "bg-[#3A4D28] text-white shadow-sm" : "bg-white border border-stone-300 text-slate-700 hover:bg-stone-100"
              }`}
            >
              Todos
            </Link>
            {categorias.map((cat) => (
              <Link
                key={cat}
                href={`/?categoria=${encodeURIComponent(cat)}`}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap min-h-[44px] flex items-center transition-all ${
                  categoriaSelecionada === cat ? "bg-[#3A4D28] text-white shadow-sm" : "bg-white border border-stone-300 text-slate-700 hover:bg-stone-100"
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>

        {/* GRID DE PRODUTOS */}
        {produtos.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-stone-200 text-center">
            <p className="text-slate-600 font-medium mb-2">Nenhum produto cadastrado nesta categoria ainda.</p>
            <Link href="/" className="text-xs text-[#3A4D28] underline font-medium">Ver todos os produtos</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {produtos.map((p) => {
              const whatsappMessage = encodeURIComponent(`Olá! Gostaria de encomendar o produto: ${p.nome} por R$ ${p.preco.toFixed(2)}.`);
              return (
                <div 
                  key={p.id} 
                  className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <div>
                    <div className="relative h-48 w-full bg-stone-100">
                      <Image src={p.imagemUrl} alt={p.nome} fill className="object-cover" />
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#3A4D28] text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
                        {p.categoria}
                      </span>
                    </div>

                    <div className="p-4 sm:p-5">
                      <h4 className="font-serif font-bold text-slate-900 text-lg mb-1">{p.nome}</h4>
                      <p className="text-xs text-slate-500 mb-4">Produtor: {p.fornecedor.empresa}</p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-serif font-bold text-[#D96B43]">
                          R$ {p.preco.toFixed(2)}
                        </span>
                        <span className="text-xs text-slate-500 bg-stone-100 px-2 py-1 rounded-lg">
                          Estoque: {p.estoqueAtual}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 pt-0">
                    <a
                      href={`https://wa.me/5527999999999?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-[#3A4D28] text-white py-3 rounded-xl text-xs sm:text-sm font-medium hover:bg-emerald-900 transition-all flex items-center justify-center gap-2 min-h-[44px]"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-400" /> Pedir via WhatsApp
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* BOTÃO WHATSAPP FLUTUANTE */}
      <a 
        href="https://wa.me/5527999999999?text=Olá!%20Gostaria%20de%20fazer%20um%20pedido%20no%20Merkdo." 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-[#3A4D28] text-white p-4 rounded-full shadow-xl hover:bg-[#D96B43] hover:-translate-y-1 transition-all duration-300 z-50 flex items-center justify-center min-h-[44px] min-w-[44px]"
        aria-label="Fazer pedido pelo WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    </main>
  );
}