'use client'

import { useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { login as loginService } from "@/services/authService";
import { useAuth } from "@/contexts/AuthContext";

interface LoginProps {
  tipoPredefinido?: string | null;
}

export default function LoginComponent({ tipoPredefinido }: LoginProps) {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const data = await loginService(email, senha);
      const { token, role, id } = data;

      //  Salva no localStorage (ainda necessário para token)
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      //  Salva no contexto (que também salva usuarioLogado no localStorage)
      login({ id, email, role });

      // Cookies
      document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Strict`;
      document.cookie = `role=${role}; path=/; max-age=86400; SameSite=Strict`;

      // Redirecionamento
      if (role === "ADMIN") {
        window.location.href = "/admin";
      } else if (role === "TEACHER") {
        window.location.href = "/professor";
      }

    } catch (err: any) {
      console.log(err.response);

      const message = err.response?.data?.message;

      if (message && message.includes("PRIMEIRO_ACESSO")) {
        router.push(`/primeiro-acesso?email=${email}`);
      } else {
        setErro("E-mail ou senha inválidos.");
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      {/* Background */}
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
              {tipoPredefinido === 'admin' ? 'Painel do Administrador' :
               tipoPredefinido === 'professor' ? 'Painel do Professor' :
               'Gestão Escolar'}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D4F97]"
                placeholder="exemplo@apae.org.br"
                required
                disabled={carregando}
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  type={mostrarSenha ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full px-5 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D4F97] pr-14"
                  placeholder="Sua senha"
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
                  <LogIn size={24} /> Entrar
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