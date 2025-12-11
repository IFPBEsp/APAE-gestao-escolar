'use client'
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { UserCircle, Search } from "lucide-react";
import { useRouter } from "next/navigation";

interface AvaliacoesAdminProps {
  onNavigate?: (page: string, id?: number) => void;
}

const mockAlunos = [
  {
    id: 1,
    nome: "Ana Silva",
    turma: "Alfabetização 2025 - Manhã",
    presenca: 92,
    ultimaAvaliacao: "05/11/2025",
  },
  {
    id: 2,
    nome: "Bruno Costa",
    turma: "Alfabetização 2025 - Manhã",
    presenca: 88,
    ultimaAvaliacao: "04/11/2025",
  },
  {
    id: 3,
    nome: "Carlos Oliveira",
    turma: "Alfabetização 2025 - Manhã",
    presenca: 95,
    ultimaAvaliacao: "05/11/2025",
  },
  {
    id: 4,
    nome: "Diana Santos",
    turma: "Alfabetização 2025 - Manhã",
    presenca: 85,
    ultimaAvaliacao: "03/11/2025",
  },
  {
    id: 5,
    nome: "Eduardo Ferreira",
    turma: "Estimulação 2025 - Tarde",
    presenca: 90,
    ultimaAvaliacao: "05/11/2025",
  },
  {
    id: 6,
    nome: "Fernanda Lima",
    turma: "Estimulação 2025 - Tarde",
    presenca: 87,
    ultimaAvaliacao: "04/11/2025",
  },
  {
    id: 7,
    nome: "Gustavo Pereira",
    turma: "Matemática Básica 2025 - Manhã",
    presenca: 94,
    ultimaAvaliacao: "05/11/2025",
  },
  {
    id: 8,
    nome: "Helena Rodrigues",
    turma: "Matemática Básica 2025 - Manhã",
    presenca: 91,
    ultimaAvaliacao: "04/11/2025",
  },
];

export default function AvaliacoesAdmin({ onNavigate }: AvaliacoesAdminProps) {
  const [alunos] = useState(mockAlunos);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const filteredAlunos = alunos.filter((aluno) =>
    aluno.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPresencaColor = (presenca: number) => {
    if (presenca >= 90) return "text-green-600";
    if (presenca >= 85) return "text-yellow-600";
    return "text-orange-600";
  };

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
        {filteredAlunos.map((aluno) => (
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
                  <p className="text-[#222222] text-sm">{aluno.turma}</p>
                </div>
              </div>

              {/* Informações de Presença e Última Avaliação */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[#222222]">Presença:</span>
                  <span className={`font-bold ${getPresencaColor(aluno.presenca)}`}>
                    {aluno.presenca}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#222222]">Última Avaliação:</span>
                  <span className="text-[#222222] font-medium">{aluno.ultimaAvaliacao}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
