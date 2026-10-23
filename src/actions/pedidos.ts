"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function criarPedidoCliente(data: {
  cliente: string;
  telefone: string;
  itens: string;
  total: number;
}) {
  try {
    await prisma.pedido.create({
      data: {
        cliente: data.cliente,
        telefone: data.telefone,
        itens: data.itens,
        total: data.total,
        status: "Pendente",
      },
    });
    revalidatePath("/admin/pedidos");
    return { success: true };
  } catch (error) {
    console.error("Erro ao criar pedido pelo site:", error);
    return { success: false, error: "Erro ao processar pedido" };
  }
}