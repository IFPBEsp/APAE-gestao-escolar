'use client'

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

const mockTurmas = [
  {
    id: 1,
    name: "Alfabetização 2025 - Manhã",
    students: 8,
    teacher: "Prof. Maria Silva",
    schedule: "Segunda a Sexta - 08:00 às 12:00",
  },
  {
    id: 2,
    name: "Estimulação 2025 - Manhã",
    students: 6,
    teacher: "Prof. João Santos",
    schedule: "Segunda a Sexta - 14:00 às 18:00",
  },
];

export default function GerenciarTurmasPage() {
  const [turmas] = useState(mockTurmas);
  const router = useRouter();

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#E5E5E5] p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Botão Voltar */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-[#0D4F97] transition-colors hover:text-[#FFD000]"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Voltar</span>
        </button>

        <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="text-[#0D4F97]">Gerenciar Turmas</CardTitle>
                <CardDescription className="text-[#222222]">
                  Visualize e administre todas as turmas
                </CardDescription>
              </div>

              {/* Botão Nova Turma */}
              <Button
                className="h-12 justify-center bg-[#0D4F97] px-4 text-white hover:bg-[#FFD000] hover:text-[#0D4F97]"
                onClick={() => router.push("/admin/turmas/nova")}
              >
                Nova Turma
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {turmas.map((turma) => (
                <div
                  key={turma.id}
                  className="rounded-xl border-2 border-[#B2D7EC] bg-white p-6 transition-all hover:border-[#0D4F97] hover:shadow-sm"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#B2D7EC]/20">
                        <Users className="h-6 w-6 text-[#0D4F97]" />
                      </div>
                      <h3 className="text-[#0D4F97]">{turma.name}</h3>
                    </div>

                    <div className="space-y-1 text-[#222222]">
                      <p>
                        <strong>Professor:</strong> {turma.teacher}
                      </p>
                      <p>
                        <strong>Alunos:</strong> {turma.students}
                      </p>
                      <p>
                        <strong>Horário:</strong> {turma.schedule}
                      </p>
                    </div>

                    {/* Botão Ver Informações */}
                    <div className="flex justify-end pt-2">
                      <Button
                        onClick={() => router.push(`/admin/turmas/${turma.id}`)}
                        className="h-12 justify-center bg-[#0D4F97] px-4 text-white hover:bg-[#FFD000] hover:text-[#0D4F97]"
                      >
                        <Eye className="mr-2 h-5 w-5" />
                        Ver Informações
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
