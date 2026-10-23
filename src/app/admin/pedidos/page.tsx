import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Trash2, CheckCircle2, Clock, Phone, User, DollarSign } from "lucide-react";
import { revalidatePath } from "next/cache";

async function atualizarStatusPedido(id: string, novoStatus: string) {
  "use server";
  try {
    await prisma.pedido.update({
      where: { id },
      data: { status: novoStatus },
    });
  } catch (error) {
    console.error("Erro ao atualizar pedido:", error);
  }
  revalidatePath("/admin/pedidos");
}

async function excluirPedido(id: string) {
  "use server";
  try {
    await prisma.pedido.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Erro ao excluir pedido:", error);
  }
  revalidatePath("/admin/pedidos");
}

export default async function PedidosPage() {
  const pedidos = await prisma.pedido.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-stone-50 text-slate-950 font-sans pb-16">
      <header className="bg-white border-b border-stone-200 py-4 px-8 mb-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-[#3A4D28]">
            <ArrowLeft className="w-4 h-4" /> Voltar ao Painel
          </Link>
          <h1 className="text-xl font-serif font-bold text-[#3A4D28]">Controle de Pedidos</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-serif font-bold text-slate-900">
            Histórico de Pedidos ({pedidos.length})
          </h2>
        </div>

        {pedidos.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-stone-200 text-center text-slate-500 shadow-sm">
            <ShoppingBag className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="text-base font-medium">Nenhum pedido registado ainda.</p>
            <p className="text-xs text-slate-400 mt-1">Os pedidos feitos pelos clientes aparecerão aqui automaticamente.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pedidos.map((pedido: any) => (
              <div 
                key={pedido.id} 
                className={`bg-white p-6 rounded-2xl border shadow-sm flex flex-col justify-between transition-all ${
                  pedido.status === "Concluído" ? "border-emerald-200 bg-emerald-50/20" : "border-stone-200"
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1 ${
                      pedido.status === "Concluído" 
                        ? "bg-emerald-100 text-emerald-800" 
                        : "bg-amber-100 text-amber-800"
                    }`}>
                      {pedido.status === "Concluído" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                      {pedido.status}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(pedido.createdAt).toLocaleDateString("pt-BR")} às {new Date(pedido.createdAt).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                      <User className="w-4 h-4 text-[#3A4D28]" />
                      <span>{pedido.cliente}</span>
                    </div>
                    {pedido.telefone && (
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Phone className="w-3.5 h-3.5 text-[#D96B43]" />
                        <span>{pedido.telefone}</span>
                      </div>
                    )}
                  </div>

                  <div className="bg-stone-50 p-3 rounded-xl text-xs text-slate-700 mb-4 space-y-1">
                    <span className="font-semibold text-slate-900 block mb-1">Itens do Pedido:</span>
                    <p className="whitespace-pre-line">{pedido.itens}</p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4 pt-3 border-t border-stone-100">
                    <span className="text-xs text-slate-500 font-medium">Total:</span>
                    <span className="text-base font-bold text-[#3A4D28]">
                      R$ {pedido.total.toFixed(2)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {pedido.status !== "Concluído" ? (
                      <form action={async () => { "use server"; await atualizarStatusPedido(pedido.id, "Concluído"); }}>
                        <button className="w-full bg-[#3A4D28] hover:bg-emerald-900 text-white text-xs py-2 rounded-xl font-medium transition-colors min-h-[38px]">
                          Concluir
                        </button>
                      </form>
                    ) : (
                      <form action={async () => { "use server"; await atualizarStatusPedido(pedido.id, "Pendente"); }}>
                        <button className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs py-2 rounded-xl font-medium transition-colors min-h-[38px]">
                          Reabrir
                        </button>
                      </form>
                    )}

                    <form action={async () => { "use server"; await excluirPedido(pedido.id); }}>
                      <button className="w-full bg-red-50 hover:bg-red-100 text-red-600 text-xs py-2 rounded-xl font-medium transition-colors flex items-center justify-center gap-1 min-h-[38px]">
                        <Trash2 className="w-3.5 h-3.5" /> Excluir
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}