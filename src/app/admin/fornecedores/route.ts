import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, empresa, telefone, email } = body;

    if (!nome) {
      return NextResponse.json({ error: "O nome é obrigatório." }, { status: 400 });
    }

    const novoFornecedor = await prisma.fornecedor.create({
      data: {
        nome,
        // Garante que o campo 'empresa' obrigatório receba um valor válido
        empresa: empresa && empresa.trim() !== "" ? empresa : nome,
        telefone: telefone || "",
        email: email || "",
      },
    });

    return NextResponse.json(novoFornecedor, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar fornecedor:", error);
    return NextResponse.json({ error: "Erro interno ao salvar no banco." }, { status: 500 });
  }
}