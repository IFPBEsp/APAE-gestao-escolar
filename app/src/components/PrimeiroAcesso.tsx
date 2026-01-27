'use client';

import { useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { primeiroAcesso } from "@/services/authService";

export default function PrimeiroAcessoComponent() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") || "";

  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    setCarregando(true);

    try {
      await primeiroAcesso(email, senha);
      alert("Senha cadastrada com sucesso!");
      router.push("/login?tipo=professor");
    } catch {
      setErro("Erro ao cadastrar a senha.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      {/* Background igual ao login */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/apae-background.png')" }}
      >
        <div className="absolute inset-0 bg-[#0D4F97] opacity-75"></div>
      </div>

      <div className="relative z-10 w-full max-w-3xl mx-6">
        <div className="bg-white rounded-2xl shadow-2xl p-10 md:p-16">
          <div className="text-center mb-10">
            <div className="mb-4">
              <h1 className="text-6xl md:text-7xl font-bold text-[#0D4F97] mb-2">APAE</h1>
              <div className="h-1.5 w-32 bg-[#FFD000] mx-auto rounded-full"></div>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
              Primeiro acesso do Professor
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Campo 1: Nova senha */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Nova senha
              </label>
              <div className="relative">
                <input
                  type={mostrarSenha ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full px-5 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D4F97] pr-14"
                  placeholder="Digite sua nova senha"
                  required
                  disabled={carregando}
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {mostrarSenha ? <EyeOff size={24} /> : <Eye size={24} />}
                </button>
              </div>
            </div>

            {/* Campo 2: Confirmar senha */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Confirmar senha
              </label>
              <input
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                className="w-full px-5 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D4F97]"
                placeholder="Confirme sua senha"
                required
                disabled={carregando}
              />
            </div>

            {erro && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="w-full bg-[#0D4F97] text-white py-4 text-xl rounded-lg font-bold hover:bg-[#FFD000] hover:text-[#0D4F97] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {carregando ? (
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn size={24} /> Cadastrar senha
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-white text-lg mt-8 font-medium">
          © 2026 APAE - Todos os direitos reservados
        </p>
      </div>
    </div>
  );
}
