"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FornecedoresPage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro("");
    setSucesso(false);

    try {
      const response = await fetch("/api/admin/fornecedores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          // Se o campo empresa estiver vazio, usamos o próprio nome para satisfazer a exigência do banco de dados
          empresa: empresa.trim() !== "" ? empresa : nome,
          telefone,
          email,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao cadastrar fornecedor. Verifique os dados.");
      }

      setSucesso(true);
      setNome("");
      setEmpresa("");
      setTelefone("");
      setEmail("");
      router.refresh(); // Atualiza os dados na tela
    } catch (err: any) {
      setErro(err.message || "Ocorreu um erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: "600px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>
        Gerenciamento de Fornecedores
      </h1>

      {erro && (
        <div style={{ padding: "12px", backgroundColor: "#ffe6e6", color: "#cc0000", marginBottom: "16px", borderRadius: "4px" }}>
          {erro}
        </div>
      )}

      {sucesso && (
        <div style={{ padding: "12px", backgroundColor: "#e6ffe6", color: "#006600", marginBottom: "16px", borderRadius: "4px" }}>
          Fornecedor cadastrado com sucesso!
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "4px", fontWeight: "600" }}>Nome:</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            placeholder="Nome do fornecedor"
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "4px", fontWeight: "600" }}>Empresa:</label>
          <input
            type="text"
            value={empresa}
            onChange={(e) => setEmpresa(e.target.value)}
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            placeholder="Nome da empresa (opcional)"
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "4px", fontWeight: "600" }}>Telefone:</label>
          <input
            type="text"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            placeholder="(00) 00000-0000"
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "4px", fontWeight: "600" }}>E-mail:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            placeholder="email@exemplo.com"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px",
            backgroundColor: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            fontWeight: "bold",
            cursor: "pointer",
            marginTop: "8px",
          }}
        >
          {loading ? "Cadastrando..." : "Cadastrar Fornecedor"}
        </button>
      </form>
    </div>
  );
}