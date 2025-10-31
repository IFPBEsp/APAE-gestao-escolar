'use client'

import { ArrowLeft, Users, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

// ✅ COLE AQUI O mockTurmaData COMPLETO:
const mockTurmaData = {
  1: {
    name: "Alfabetização",
    alunos: [
      { id: 1, name: "Ana Silva", faltas: 2, presenca: 95, status: "ativo" },
      { id: 2, name: "Bruno Santos", faltas: 5, presenca: 87.5, status: "ativo" },
      { id: 3, name: "Carlos Oliveira", faltas: 1, presenca: 97.5, status: "ativo" },
      { id: 4, name: "Diana Costa", faltas: 3, presenca: 92.5, status: "inativo" },
      { id: 5, name: "Eduardo Souza", faltas: 0, presenca: 100, status: "ativo" },
      { id: 6, name: "Fernanda Lima", faltas: 4, presenca: 90, status: "ativo" },
      { id: 7, name: "Gabriel Pereira", faltas: 2, presenca: 95, status: "ativo" },
      { id: 8, name: "Helena Rodrigues", faltas: 1, presenca: 97.5, status: "ativo" },
    ],
  },
  2: {
    name: "Estimulação", 
    alunos: [
      { id: 1, name: "Igor Martins", faltas: 1, presenca: 97.5, status: "ativo" },
      { id: 2, name: "Julia Alves", faltas: 3, presenca: 92.5, status: "ativo" },
      { id: 3, name: "Kevin Ferreira", faltas: 0, presenca: 100, status: "ativo" },
      { id: 4, name: "Laura Gomes", faltas: 2, presenca: 95, status: "inativo" },
      { id: 5, name: "Marcos Silva", faltas: 4, presenca: 90, status: "ativo" },
      { id: 6, name: "Natalia Costa", faltas: 1, presenca: 97.5, status: "ativo" },
    ],
  },
};

interface VerInformacoesTurmaPageProps {
  params: {
    id: string;
  };
}

export default function VerInformacoesTurmaPage({ params }: VerInformacoesTurmaPageProps) {
  const router = useRouter();
  const turmaId = parseInt(params.id);
  const turmaData = mockTurmaData[turmaId as keyof typeof mockTurmaData];
  
  if (!turmaData) {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-[#E5E5E5] p-4 md:p-8">
        <div className="mx-auto max-w-6xl">
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-[#0D4F97] transition-colors hover:text-[#FFD000]"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Voltar</span>
          </button>
          <div className="text-center text-[#222222]">Turma não encontrada</div>
        </div>
      </div>
    );
  }

  const mediaPresenca = (
    turmaData.alunos.reduce((acc, aluno) => acc + aluno.presenca, 0) / turmaData.alunos.length
  ).toFixed(1);

  const totalFaltas = turmaData.alunos.reduce((acc, aluno) => acc + aluno.faltas, 0);
  const alunosAtivos = turmaData.alunos.filter((aluno) => aluno.status === "ativo").length;

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#E5E5E5] p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-[#0D4F97] transition-colors hover:text-[#FFD000]"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Voltar</span>
        </button>

        <div className="mb-6">
          <h1 className="mb-2 text-[#0D4F97]">{turmaData.name}</h1>
          <p className="text-[#222222]">Informações detalhadas da turma</p>
        </div>

        {/* Cards de Resumo */}
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
          <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#B2D7EC]/20">
                  <Users className="h-6 w-6 text-[#0D4F97]" />
                </div>
                <div>
                  <p className="text-[#222222]">Total de Alunos</p>
                  <p className="text-[#0D4F97]">{turmaData.alunos.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-[#222222]">Alunos Ativos</p>
                  <p className="text-green-600">{alunosAtivos}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-[#222222]">Média de Presença</p>
                  <p className="text-green-600">{mediaPresenca}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <TrendingDown className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-[#222222]">Total de Faltas</p>
                  <p className="text-red-600">{totalFaltas}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Alunos */}
        <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
          <CardHeader>
            <CardTitle className="text-[#0D4F97]">Desempenho Individual dos Alunos</CardTitle>
            <CardDescription className="text-[#222222]">
              Informações detalhadas de cada aluno
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-[#B2D7EC]">
                    <th className="p-3 text-left text-[#0D4F97]">Aluno</th>
                    <th className="p-3 text-center text-[#0D4F97]">Faltas</th>
                    <th className="p-3 text-center text-[#0D4F97]">Presença (%)</th>
                    <th className="p-3 text-center text-[#0D4F97]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {turmaData.alunos.map((aluno) => (
                    <tr
                      key={aluno.id}
                      className="border-b border-[#B2D7EC] transition-colors hover:bg-[#B2D7EC]/10"
                    >
                      <td className="p-3 text-[#222222]">{aluno.name}</td>
                      <td className="p-3 text-center">
                        <span
                          className={`rounded-full px-3 py-1 ${
                            aluno.faltas === 0
                              ? "bg-green-100 text-green-700"
                              : aluno.faltas <= 2
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {aluno.faltas}
                        </span>
                      </td>
                      <td className="p-3 text-center text-[#222222]">{aluno.presenca}%</td>
                      <td className="p-3 text-center">
                        {aluno.status === "ativo" ? (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-green-700">
                            Ativo
                          </span>
                        ) : (
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700">
                            Inativo
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}