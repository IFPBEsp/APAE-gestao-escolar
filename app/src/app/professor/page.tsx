'use client'

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, ClipboardCheck, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

//  MOCK DATA
const mockProfessorData = {
  name: "Prof. Maria Silva",
  turmas: [
    {
      id: 1,
      name: "Alfabetização 2025 - Manhã",
      students: 8,
      schedule: "Segunda a Sexta - 08:00 às 12:00",
      nextClass: "Hoje - 08:00",
    },
    {
      id: 2,
      name: "Estimulação 2025 - Tarde",
      students: 6,
      schedule: "Segunda a Sexta - 14:00 às 18:00",
      nextClass: "Hoje - 14:00",
    },
  ],
};

export default function ProfessorDashboardPage() {
  const [professorData] = useState(mockProfessorData);
  const router = useRouter();

  const handleLogout = () => {
    console.log("Logout realizado");
    router.push("/");
  };

  const handleFazerChamada = (turmaId: number, turmaNome: string) => {
    router.push(`/professor/chamada/${turmaId}`);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#E5E5E5] p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header com Logout */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-[#0D4F97]">Painel do Professor</h1>
            <p className="text-[#222222]">Bem-vindo, {professorData.name}!</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg border-2 border-[#B2D7EC] bg-white px-4 py-2 text-[#0D4F97] transition-all hover:bg-red-50 hover:border-red-200 hover:text-red-600"
          >
            <LogOut className="h-5 w-5" />
            <span>Sair</span>
          </button>
        </div>

        {/* Minhas Turmas */}
        <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#B2D7EC]/20">
                <Users className="h-6 w-6 text-[#0D4F97]" />
              </div>
              <div>
                <CardTitle className="text-[#0D4F97]">Minhas Turmas</CardTitle>
                <CardDescription className="text-[#222222]">
                  {professorData.turmas.length} turmas ativas
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {professorData.turmas.map((turma) => (
                <div
                  key={turma.id}
                  className="rounded-xl border-2 border-[#B2D7EC] bg-white p-4 transition-all hover:border-[#0D4F97] hover:shadow-sm"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-[#0D4F97]">{turma.name}</h3>
                    <span className="rounded-full bg-[#B2D7EC] px-3 py-1 text-[#0D4F97]">
                      {turma.students} alunos
                    </span>
                  </div>
                  <div className="mb-3 space-y-1 text-[#222222]">
                    <p>
                      <strong>Horário:</strong> {turma.schedule}
                    </p>
                    <p>
                      <strong>Próxima aula:</strong> {turma.nextClass}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleFazerChamada(turma.id, turma.name)}
                    className="flex h-12 w-full items-center justify-center rounded-lg bg-[#0D4F97] px-4 text-center text-white transition-all hover:bg-[#FFD000] hover:text-[#0D4F97]" // ✅ CORES CORRETAS
                  >
                    <ClipboardCheck className="mr-2 h-5 w-5" />
                    Fazer Chamada
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}