"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAuthClient } from "better-auth/react";
import Link from "next/link";
import { Lock, Mail, ArrowRight } from "lucide-react";

const authClient = createAuthClient();

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result.error) {
        setError(result.error.message || "Erro ao fazer login. Verifique suas credenciais.");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("Ocorreu um erro inesperado ao tentar entrar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-stone-50 flex items-center justify-center px-4 font-sans">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-md border border-stone-200">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-serif font-bold text-[#3A4D28]">
            Merkdo.
          </Link>
          <p className="text-sm text-slate-600 mt-2">Área Restrita do Lojista</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3A4D28] text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3A4D28] text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3A4D28] text-white py-3 rounded-xl font-medium hover:bg-emerald-900 transition-all flex items-center justify-center gap-2 min-h-[44px]"
          >
            {loading ? "Entrando..." : "Acessar Painel"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-xs text-slate-500 hover:text-[#3A4D28]">
            ← Voltar para a loja pública
          </Link>
        </div>
      </div>
    </main>
  );
}