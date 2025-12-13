'use client'
import { useState } from "react";
import { Card, CardContent } from "@components/ui/card";
import { UserCircle, Eye } from "lucide-react";
import router from "next/router";

interface AvaliacoesAdminProps {
  onNavigate: (page: string, id?: number) => void;
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

  const getPresencaColor = (presenca: number) => {
    if (presenca >= 90) return "text-green-600";
    if (presenca >= 85) return "text-yellow-600";
    return "text-orange-600";
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#0D4F97] mb-2">Avaliações dos Alunos</h1>
        <p className="text-sm md:text-base text-[#222222]">Visualize e gerencie as avaliações de todos os alunos</p>
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