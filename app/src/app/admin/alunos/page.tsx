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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[#0D4F97] text-2xl font-bold">Gerenciamento de Alunos</h1>
        <p className="text-[#222222]">Visualize e gerencie as avaliações de todos os alunos</p>
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {alunos.length === 0 && !loading ? (
            <p className="col-span-full text-center text-gray-500">Nenhum aluno encontrado.</p>
        ) : (
            alunos.map((aluno) => {
                const turmaCompleta = aluno.nomeTurmaAtual 
                    ? `${aluno.nomeTurmaAtual} - ${aluno.turnoTurmaAtual}`
                    : 'Sem Turma Ativa';

                return (
                    <Card
                        key={aluno.id}
                        onClick={() => router.push(`/admin/alunos/detalhes/${aluno.id}`)}
                        className="cursor-pointer rounded-xl border-2 border-[#B2D7EC] shadow-md transition-all hover:border-[#0D4F97] hover:shadow-lg"
                    >
                        <CardContent className="p-6">
                            {/* Header do Card com Avatar e Nome */}
                            <div className="mb-4 flex items-start gap-3">
                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#B2D7EC]/20">
                                    <UserCircle className="h-7 w-7 text-[#0D4F97]" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-[#0D4F97] font-semibold">{aluno.nome}</h3>
                                    <p className="text-[#222222] text-sm truncate" title={aluno.deficiencia}>{aluno.deficiencia}</p> 
                                </div>
                            </div>

                            {/* Informações da Turma Atual e Responsável */}
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-[#222222]">Turma Atual:</span>
                                    <span className="font-bold text-[#0D4F97]">{turmaCompleta}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[#222222]">Responsável:</span>
                                    <span className="text-[#222222] font-medium truncate" title={aluno.nomeResponsavel}>{aluno.nomeResponsavel}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })
        )}
      </div>
    </div>
  );
}
