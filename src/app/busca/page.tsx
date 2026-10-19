import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag, ArrowLeft, MessageCircle } from "lucide-react";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function BuscaPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || "";

  const produtos = await prisma.produto.findMany({
    where: {
      OR: [
        { nome: { contains: query, mode: "insensitive" } },
        { categoria: { contains: query, mode: "insensitive" } },
      ],
    },
    include: { fornecedor: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-stone-50 text-slate-900 font-sans pb-16">
      <header className="bg-white border-b border-stone-200 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-[#3A4D28]">
            <ArrowLeft className="w-4 h-4" /> Voltar à Vitrine
          </Link>
          
          <form action="/busca" method="GET" className="w-full sm:w-96 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                name="q"
                defaultValue={query}
                placeholder="Buscar produtos ou categorias..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#3A4D28]"
              />
            </div>
            <button type="submit" className="bg-[#3A4D28] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-emerald-900">
              Buscar
            </button>
          </form>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mb-2">
          Resultados para: &ldquo;{query}&rdquo;
        </h1>
        <p className="text-sm text-slate-600 mb-8">{produtos.length} produto(s) encontrado(s).</p>

        {produtos.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-stone-200 text-center">
            <p className="text-slate-600 font-medium mb-2">Nenhum produto encontrado com esse termo.</p>
            <Link href="/" className="inline-block bg-[#3A4D28] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-900">
              Ver Todos os Produtos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {produtos.map((p: any) => {
              const whatsappMessage = encodeURIComponent(`Olá! Gostaria de encomendar o produto: ${p.nome} por R$ ${p.preco.toFixed(2)}.`);
              return (
                <div key={p.id} className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all">
                  <div>
                    <div className="relative h-44 w-full bg-stone-100">
                      <Image src={p.imagemUrl} alt={p.nome} fill className="object-cover" />
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#3A4D28] text-xs font-medium px-2.5 py-1 rounded-full">
                        {p.categoria}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-serif font-bold text-slate-900 text-base mb-1">{p.nome}</h3>
                      <p className="text-xs text-slate-500 mb-3">Produtor: {p.fornecedor.empresa}</p>
                      <div className="text-lg font-serif font-bold text-[#D96B43]">
                        R$ {p.preco.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 pt-0">
                    <a
                      href={`https://wa.me/5527999999999?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-[#3A4D28] text-white py-2.5 rounded-xl text-xs font-medium hover:bg-emerald-900 transition-all flex items-center justify-center gap-1.5 min-h-[44px]"
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
    </main>
  );
}