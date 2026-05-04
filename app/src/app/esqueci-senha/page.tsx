'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EsqueciSenhaPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    if (!email || !cpf) {
      setErro("Preencha todos os campos.");
      return;
    }

    setCarregando(true);

    setTimeout(() => {
      router.push(`/primeiro-acesso?mode=reset&email=${email}`);
    }, 600);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/apae-background.png')" }}
      >
        <div className="absolute inset-0 bg-[#0D4F97] opacity-75"></div>
      </div>

      <div className="relative z-10 w-full max-w-xl mx-6">
        <div className="bg-white rounded-2xl shadow-2xl p-10">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-[#0D4F97] mb-2">APAE</h1>
            <div className="h-1 w-24 bg-[#FFD000] mx-auto rounded-full mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800">
              Recuperar senha
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Confirme seus dados para continuar
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-gray-700 mb-1">E-mail</label>
              <input
                type="email"
                placeholder="exemplo@apae.org.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0D4F97]"
                disabled={carregando}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">CPF</label>
              <input
                type="text"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0D4F97]"
                disabled={carregando}
              />
            </div>

            {erro && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded">
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="w-full bg-[#0D4F97] text-white py-3 rounded-lg font-bold hover:bg-[#FFD000] hover:text-[#0D4F97] transition-all"
            >
              {carregando ? "Validando..." : "Continuar"}
            </button>

          </form>

          {/* Voltar */}
          <div className="text-center mt-6">
            <button
              onClick={() => router.push("/login")}
              className="text-sm text-[#0D4F97] hover:text-[#FFD000]"
            >
              Voltar para login
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}