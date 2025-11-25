"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockTurmas = [
  {
    id: 1,
    name: "Alfabetização 2025 - Manhã",
    students: 8,
    teacher: "Prof. Maria Silva",
    schedule: "Segunda a Sexta - 08:00 às 12:00",
    turno: "Manhã",
  },
  {
    id: 2,
    name: "Estimulação 2025 - Tarde",
    students: 6,
    teacher: "Prof. João Santos",
    schedule: "Segunda a Sexta - 14:00 às 18:00",
    turno: "Tarde",
  },
  
];

export default function GerenciarTurmasPage() {
  const [turmas] = useState(mockTurmas);
  const router = useRouter();

  return (
    <div className="p-6 md:p-10 bg-[#F1F5F9] min-h-screen">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-semibold text-[#0D4F97]">Gerenciar Turmas</h1>
          <p className="text-gray-700">Visualize e administre todas as turmas</p>
        </div>

        <Button
          className="bg-[#0D4F97] hover:bg-[#0B3E78] text-white flex items-center gap-2"
          onClick={() => router.push("/admin/turmas/nova")}
        >
          <Plus size={18} />
          Nova Turma
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {turmas.map((turma) => (
          <div
            key={turma.id}
            className="border border-[#B2D7EC] bg-white rounded-xl shadow-sm p-6 relative"
          >
            <div className="absolute right-4 top-4 bg-[#E8F3FF] text-[#0D4F97] px-4 py-1 rounded-full text-sm font-medium">
              {turma.students} alunos
            </div>

            <h2 className="text-lg font-semibold text-[#0D4F97] mb-3">
              {turma.name}
            </h2>

            <div className="text-gray-700 space-y-1 mb-5">
              <p>
                <strong>Professor:</strong> {turma.teacher}
              </p>
              <p>
                <strong>Turno:</strong> {turma.turno}
              </p>
              <p>
                <strong>Horário:</strong> {turma.schedule}
              </p>
            </div>

            <Button
              className="w-full bg-[#0D4F97] hover:bg-[#0B3E78] text-white flex items-center justify-center gap-2"
              onClick={() => router.push(`/admin/turmas/${turma.id}`)}
            >
              <Eye className="w-5 h-5" />
              Ver Detalhes
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
