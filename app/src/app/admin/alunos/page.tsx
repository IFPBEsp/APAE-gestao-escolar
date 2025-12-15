'use client'
import { useState, useEffect, useCallback } from "react"; 
import { Card, CardContent } from "@/components/ui/card";
import { UserCircle, Search, Loader2 } from "lucide-react"; 
import { useRouter } from "next/navigation";
import { listarAlunos } from "@/services/AlunoService";

interface AvaliacoesAdminProps {
  onNavigate?: (page: string, id?: number) => void;
}

interface AlunoResponseDTO {
    id: number;
    nome: string;
    dataNascimento: string; 
    deficiencia: string;
    telefoneResponsavel: string;
    nomeResponsavel: string;
    nomeTurmaAtual: string | null;
    turnoTurmaAtual: string | null;
}

export default function AvaliacoesAdmin({ onNavigate }: AvaliacoesAdminProps) {
  const [alunos, setAlunos] = useState<AlunoResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const fetchAlunos = useCallback(async (nome: string) => {
    setLoading(true);
    try {
      const data = await listarAlunos(nome);
      setAlunos(data);
    } catch (error) {
      console.error("Falha ao carregar alunos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchAlunos(searchTerm);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchAlunos]);


  if (loading) {
    return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-[#0D4F97]" />
            <span className="ml-2 text-[#0D4F97]">Carregando alunos...</span>
        </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#0D4F97] mb-2">Avaliações dos Alunos</h1>
        <p className="text-sm md:text-base text-[#222222]">Visualize e gerencie as avaliações de todos os alunos</p>
      </div>

      {/* Filtros */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-[#0D4F97]">Filtros de Alunos</h2>
        <div className="relative">
          <label htmlFor="search-aluno" className="mb-2 block text-sm font-medium text-gray-700">
            Buscar Aluno
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              id="search-aluno"
              type="text"
              placeholder="Digite o nome do aluno..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:border-[#0D4F97] focus:outline-none focus:ring-1 focus:ring-[#0D4F97]"
            />
          </div>
        </div>
      </div>

      {/* Grid de Cards de Alunos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {alunos.map((aluno) => (
          <Card
            key={aluno.id}
            className="rounded-xl border-2 border-[#B2D7EC] shadow-md transition-all hover:border-[#0D4F97] hover:shadow-lg"
          >
            <CardContent className="p-4 md:p-6">
              {/* Header do Card com Avatar e Nome */}
              <div className="mb-3 md:mb-4 flex items-start gap-2 md:gap-3">
                <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#B2D7EC]/20">
                  <UserCircle className="h-6 w-6 md:h-7 md:w-7 text-[#0D4F97]" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm md:text-base font-semibold text-[#0D4F97] mb-1">{aluno.nome}</h3>
                  <p className="text-xs md:text-sm text-[#222222] line-clamp-2">{aluno.turma}</p>
                </div>
              </div>

              {/* Informações de Presença e Última Avaliação */}
              <div className="mb-3 md:mb-4 space-y-1.5 md:space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm text-[#222222]">Presença:</span>
                  <span className={`text-xs md:text-sm font-medium ${getPresencaColor(aluno.presenca)}`}>
                    {aluno.presenca}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm text-[#222222]">Última Avaliação:</span>
                  <span className="text-xs md:text-sm text-[#222222]">{aluno.ultimaAvaliacao}</span>
                </div>
              </div>

              {/* Botões de Ação */}
              <div>
                <button
                  onClick={() => router.push(`/admin/alunos/detalhes/${aluno.id}`)}
                  className="flex h-10 md:h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#0D4F97] text-white text-sm md:text-base transition-all hover:bg-[#FFD000] hover:text-[#0D4F97]"
                  title="Ver Detalhes do Aluno"
                >
                  <Eye className="h-4 w-4 md:h-5 md:w-5" />
                  <span>Ver Detalhes</span>
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
