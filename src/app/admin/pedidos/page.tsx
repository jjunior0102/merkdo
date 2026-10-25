import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Trash2, CheckCircle2, Clock, Phone, User, Activity } from "lucide-react";
import { revalidatePath } from "next/cache";

async function atualizarStatusPedido(id: string, novoStatus: string) {
  "use server";
  try { await prisma.pedido.update({ where: { id }, data: { status: novoStatus } }); } catch (error) {}
  revalidatePath("/admin/pedidos");
}
async function excluirPedido(id: string) {
  "use server";
  try { await prisma.pedido.delete({ where: { id } }); } catch (error) {}
  revalidatePath("/admin/pedidos");
}

export default async function PedidosPage() {
  const pedidos = await prisma.pedido.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <main className="min-h-screen bg-[#09090b] text-zinc-300 font-sans pb-16 selection:bg-emerald-500/30">
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
            <h1 className="text-base font-medium text-zinc-200 tracking-tight">Fila de Pedidos</h1>
          </div>
          <Link href="/admin" className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors border border-white/5">
            <ArrowLeft className="w-3.5 h-3.5" /> Voltar
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8">
        {pedidos.length === 0 ? (
          <div className="border border-dashed border-white/10 rounded-2xl p-12 flex flex-col items-center justify-center text-center bg-white/[0.01]">
            <ShoppingBag className="w-10 h-10 text-zinc-700 mb-4" />
            <p className="text-sm font-medium text-zinc-300">Nenhum pedido na fila.</p>
            <p className="text-xs text-zinc-600 mt-1">Aguardando compras dos clientes...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {pedidos.map((pedido: any) => {
              const isConcluido = pedido.status === "Concluído";
              return (
                <div key={pedido.id} className={`group relative rounded-2xl p-5 border backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 ${
                  isConcluido ? "bg-emerald-950/10 border-emerald-900/30" : "bg-zinc-900/40 border-white/5 hover:border-white/10"
                }`}>
                  <div className="flex justify-between items-start mb-4">
                    <span className={`inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-md ${
                      isConcluido ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                    }`}>
                      {isConcluido ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {pedido.status}
                    </span>
                    <span className="text-[10px] text-zinc-600 font-mono">
                      {new Date(pedido.createdAt).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="space-y-1 mb-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
                      <User className="w-3.5 h-3.5 text-zinc-500" /> {pedido.cliente}
                    </div>
                    {pedido.telefone && (
                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <Phone className="w-3.5 h-3.5" /> {pedido.telefone}
                      </div>
                    )}
                  </div>

                  <div className="bg-black/30 p-3 rounded-lg text-xs text-zinc-400 mb-4 font-mono leading-relaxed border border-white/[0.02]">
                    <p className="whitespace-pre-line">{pedido.itens}</p>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-white/5">
                    <span className="text-lg font-bold text-zinc-100 tracking-tight">R$ {pedido.total.toFixed(2)}</span>
                    <div className="flex gap-2">
                      <form action={async () => { "use server"; await atualizarStatusPedido(pedido.id, isConcluido ? "Pendente" : "Concluído"); }}>
                        <button className={`p-2 rounded-lg transition-colors ${
                          isConcluido ? "bg-zinc-800 text-zinc-400 hover:text-white" : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                        }`}>
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      </form>
                      <form action={async () => { "use server"; await excluirPedido(pedido.id); }}>
                        <button className="p-2 rounded-lg bg-red-500/5 text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}