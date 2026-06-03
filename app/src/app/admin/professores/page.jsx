'use client'

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, UserCircle, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/services/api";

export default function Professores() {
  const router = useRouter();
  const [professores, setProfessores] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProfessores();
  }, []);

  const loadProfessores = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (searchTerm.trim()) {
        params.append('nome', searchTerm.trim());
      }


      const url = `/professores${params.toString() ? `?${params.toString()}` : ''}`;
      console.log('🔍 Buscando professores:', url);

      const response = await api.get(url);
      console.log('✅ Resposta da API:', response.data);
      console.log('📊 Total de professores:', response.data?.length || 0);

      setProfessores(response.data || []);
    } catch (error) {
      console.error("❌ Erro ao carregar professores:", error);
      console.error("📋 Detalhes do erro:", {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
        baseURL: error.config?.baseURL
      });

      setProfessores([]);

      // Determinar tipo de erro
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        setError('Backend não está acessível. Verifique se está rodando na porta 8080.');
      } else if (error.response?.status === 404) {
        setError('Endpoint não encontrado. Verifique a configuração da API.');
      } else if (error.response?.status >= 500) {
        setError('Erro no servidor. Verifique os logs do backend.');
      } else {
        setError(`Erro ao carregar professores: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadProfessores();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleCardClick = (professorId) => {
    router.push(`/admin/professores/${professorId}`);
  };

  return (
    <main className="p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 md:mb-6 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#0D4F97] mb-2">
              Gerenciar Professores
            </h1>
            <p className="text-sm md:text-base text-[#222222]">
              Visualize e edite a lista de professores
            </p>
          </div>

          <Button
            variant="primary"
            onClick={() => router.push("/admin/professores/cadastrar")}
          >
            <UserPlus className="mr-2 h-5 w-5" />
            Cadastrar Professor
          </Button>
        </div>

        {/* Campo de Busca */}
        <div className="mb-4 md:mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#0D4F97]" />

            <Input
              type="text"
              placeholder="Buscar Professor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-11 md:h-12 pl-10 border-2 border-[#B2D7EC] bg-white text-[#222222] placeholder:text-gray-400 focus:border-[#0D4F97]"
            />
          </div>
        </div>

        {/* Grid de Cards de Professores */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-[#0D4F97]">Carregando professores...</p>
          </div>
        ) : professores.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-2">
            {!error && (
              <p className="text-[#222222] text-base md:text-lg font-medium text-center px-4">
                {searchTerm ? "Nenhum professor encontrado." : "Nenhum professor cadastrado."}
              </p>
            )}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg max-w-md mx-4">
                <p className="text-red-700 font-semibold">Erro de Conexão</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {professores.map((professor) => (
              <Card
                key={professor.id}
                onClick={() => handleCardClick(professor.id)}
                className="rounded-xl border-2 border-[#B2D7EC] bg-white shadow-md transition-all hover:border-[#0D4F97] hover:shadow-lg cursor-pointer"
              >
                <CardContent className="pt-4 md:pt-6 pb-4 md:pb-6 px-4 md:px-6">
                  <div className="mb-3 md:mb-4 flex items-start gap-2 md:gap-3">
                    <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#B2D7EC]/20">
                      <UserCircle className="h-6 w-6 md:h-7 md:w-7 text-[#0D4F97]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base md:text-lg font-semibold text-[#0D4F97] mb-1 truncate">
                        {professor.nome}
                      </h3>
                      <span className={`inline-block rounded-full px-2 md:px-3 py-1 text-xs md:text-sm font-medium ${professor.ativo
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                        }`}>
                        {professor.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 md:mt-4 text-xs md:text-sm text-[#222222] space-y-1">
                    <p className="truncate">{professor.email}</p>
                    {professor.formacao && <p className="truncate">{professor.formacao}</p>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

