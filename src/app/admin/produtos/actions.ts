"use server";

import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const produtoSchema = z.object({
  nome: z.string().min(2, "O nome do produto deve ter pelo menos 2 caracteres."),
  categoria: z.string().min(2, "Selecione ou informe uma categoria."),
  preco: z.coerce.number().positive("O preço deve ser um valor positivo."),
  estoqueAtual: z.coerce.number().int().nonnegative("O estoque atual não pode ser negativo."),
  estoqueMinimo: z.coerce.number().int().nonnegative("O estoque mínimo não pode ser negativo."),
  fornecedorId: z.string().min(1, "Selecione um fornecedor válido."),
});

export async function criarProduto(prevState: any, formData: FormData) {
  const imageFile = formData.get("imagem") as File;

  if (!imageFile || imageFile.size === 0) {
    return { success: false, error: "A imagem do produto é obrigatória." };
  }

  // Validação de tamanho máximo de 2MB solicitada no requisito
  if (imageFile.size > 2 * 1024 * 1024) {
    return { success: false, error: "A imagem excede o limite máximo de 2MB." };
  }

  const result = produtoSchema.safeParse({
    nome: formData.get("nome"),
    categoria: formData.get("categoria"),
    preco: formData.get("preco"),
    estoqueAtual: formData.get("estoqueAtual"),
    estoqueMinimo: formData.get("estoqueMinimo"),
    fornecedorId: formData.get("fornecedorId"),
  });

  if (!result.success) {
    return { success: false, error: result.error.errors[0].message };
  }

  try {
    // Upload da imagem real para o Vercel Blob
    const blob = await put(`produtos/${Date.now()}-${imageFile.name}`, imageFile, {
      access: "public",
    });

    await prisma.produto.create({
      data: {
        ...result.data,
        imagemUrl: blob.url,
      },
    });

    revalidatePath("/admin/produtos");
    revalidatePath("/");
    return { success: true, error: null };
  } catch (e) {
    return { success: false, error: "Erro ao fazer upload da imagem ou salvar o produto." };
  }
}

export async function excluirProduto(id: string) {
  try {
    await prisma.produto.delete({
      where: { id },
    });
    revalidatePath("/admin/produtos");
    revalidatePath("/");
    return { success: true };
  } catch (e) {
    return { success: false, error: "Erro ao excluir o produto." };
  }
}