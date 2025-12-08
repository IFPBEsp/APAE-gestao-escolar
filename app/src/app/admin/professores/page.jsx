'use client'

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, UserCircle, BookOpen, Search } from "lucide-react";
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
      // Não filtrar por status por padrão - mostrar todos
      
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
    }, 300); // Debounce de 300ms

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleCardClick = (professorId) => {
    router.push(`/admin/professores/${professorId}`);
  };

  return (
    <main className="p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#0D4F97] mb-2">
              Gerenciar Professores
            </h1>
            <p className="text-[#222222]">Visualize e edite a lista de professores</p>
          </div>

          <Button
            onClick={() => router.push("/admin/professores/cadastrar")}
            className="h-12 justify-center bg-[#0D4F97] px-6 text-white hover:bg-[#FFD000] hover:text-[#0D4F97]"
          >
            <UserPlus className="mr-2 h-5 w-5" />
            Cadastrar Professor
          </Button>
        </div>

        {/* Campo de Busca */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#0D4F97]" />
            <Input
              type="text"
              placeholder="Buscar professor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12 pl-10 border-2 border-[#B2D7EC] bg-white text-[#222222] placeholder:text-gray-400 focus:border-[#0D4F97]"
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
            <p className="text-[#222222] text-lg font-medium">
              {searchTerm ? "Nenhum professor encontrado." : "Nenhum professor cadastrado."}
            </p>
            {error ? (
              <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg max-w-md">
                <p className="text-red-700 font-semibold">Erro de Conexão</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
                <p className="text-red-500 text-xs mt-2">
                  💡 Dica: Verifique se o backend Spring Boot está rodando na porta 8080
                </p>
              </div>
            ) : !searchTerm ? (
              <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg max-w-md text-center">
                <p className="text-blue-700 text-sm">
                  Verifique se o backend está rodando e se o mock foi executado.
                </p>
                <p className="text-blue-600 text-xs mt-2">
                  Teste: <code className="bg-blue-100 px-2 py-1 rounded">http://localhost:8080/api/professores</code>
                </p>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {professores.map((professor) => (
              <Card
                key={professor.id}
                onClick={() => handleCardClick(professor.id)}
                className="rounded-xl border-2 border-[#B2D7EC] bg-white shadow-md transition-all hover:border-[#0D4F97] hover:shadow-lg cursor-pointer"
              >
              <CardContent className="p-6">
                <div className="mb-4 flex items-start gap-3">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#B2D7EC]/20">
                    <UserCircle className="h-7 w-7 text-[#0D4F97]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-semibold text-[#0D4F97] mb-1">
                      {professor.nome}
                    </h3>
                    <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
                      professor.ativo 
                        ? "bg-green-100 text-green-700" 
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {professor.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="mb-2 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-[#0D4F97]" />
                    <span className="text-sm font-medium text-[#0D4F97]">Turmas</span>
                  </div>
                  {professor.turmas && professor.turmas.length > 0 ? (
                    <ul className="space-y-1">
                      {professor.turmas.slice(0, 2).map((turma, index) => (
                        <li key={index} className="text-sm text-[#222222]">
                          • {typeof turma === 'object' ? turma.nome || turma.name : turma}
                        </li>
                      ))}
                      {professor.turmas.length > 2 && (
                        <li className="text-sm text-[#0D4F97] font-medium">
                          +{professor.turmas.length - 2} mais
                        </li>
                      )}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-400">Nenhuma turma vinculada</p>
                  )}
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


