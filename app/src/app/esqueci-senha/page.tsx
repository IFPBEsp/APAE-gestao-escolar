'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { redefinirSenha } from '@services/authService';
import { assetPath } from "@/utils/constants";

export default function EsqueciSenhaPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const applyCPFMask = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6)
      return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9)
      return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(
      6,
      9
    )}-${numbers.slice(9, 11)}`;
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = applyCPFMask(e.target.value);
    setCpf(masked);
  };

  const handleSubmit =  async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    if (!email || !cpf) {
      setErro("Preencha todos os campos.");
      return;
    }

    setCarregando(true);

    try{
      await redefinirSenha(email, cpf);
      router.push(`/primeiro-acesso?&email=${email}`);
    }catch (error: any){
      const mensagemErro =
      error.response?.data?.message || 'Erro ao validar os dados. Tente novamente.';
      setErro(mensagemErro);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${assetPath('/apae-background.png')}')` }}
      >
        <div className="absolute inset-0 bg-[#0D4F97] opacity-75"></div>
      </div>

      <div className="relative z-10 w-full max-w-3xl mx-6">
        <div className="bg-white rounded-2xl shadow-2xl p-10 md:p-16">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-6xl md:text-7xl font-bold text-[#0D4F97] mb-2">APAE</h1>
            <div className="h-1 w-24 bg-[#FFD000] mx-auto rounded-full mb-4"></div>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">Recuperar senha</h2>
            <p className="text-lg text-gray-500 mt-2">Confirme seus dados para continuar</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">E-mail</label>
              <input
                type="email"
                placeholder="exemplo@apae.org.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D4F97]"
                disabled={carregando}
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">CPF</label>
              <input
                type="text"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={handleCpfChange}
                maxLength={14}
                className="w-full px-5 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D4F97]"
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
              {carregando ? 'Validando...' : 'Continuar'}
            </button>
          </form>

          {/* Voltar */}
          <div className="text-center mt-6">
            <button
              onClick={() => router.push('/login')}
              className="text-lg text-[#0D4F97] hover:text-[#FFD000] transition-colors font-medium"
            >
              Voltar para login
            </button>
          </div>
        </div>
        <p className="text-center text-white text-lg mt-8 font-medium">
          © 2026 APAE - Todos os direitos reservados
        </p>
      </div>
    </div>
  );
}