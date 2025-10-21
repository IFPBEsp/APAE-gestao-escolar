import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Pencil, Trash2, ClipboardCheck, UserPlus, UserMinus } from "lucide-react";

interface GerenciarTurmasProps {
  onBack: () => void;
  onFazerChamada: (turmaId: number, turmaNome: string) => void;
}

const mockTurmas = [
  {
    id: 1,
    name: "Alfabetização",
    students: 8,
    teacher: "Prof. Maria Silva",
    schedule: "Segunda a Sexta - 08:00 às 12:00",
  },
  {
    id: 2,
    name: "Estimulação",
    students: 6,
    teacher: "Prof. João Santos",
    schedule: "Segunda a Sexta - 14:00 às 18:00",
  },
];

export default function GerenciarTurmas({ onBack, onFazerChamada }: GerenciarTurmasProps) {
  const [turmas] = useState(mockTurmas);

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#E5E5E5] p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <button
          onClick={onBack}
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
              <Button className="h-12 justify-center bg-[#0D4F97] px-4 text-white hover:bg-[#FFD000] hover:text-[#0D4F97]">
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
                  <div className="space-y-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#B2D7EC]/20">
                            <Users className="h-6 w-6 text-[#0D4F97]" />
                          </div>
                          <h3 className="text-[#0D4F97]">{turma.name}</h3>
                        </div>
                        <div className="space-y-1 pl-13 text-[#222222]">
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
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 justify-center border-2 border-[#B2D7EC] text-[#0D4F97] hover:bg-[#B2D7EC]/20"
                        >
                          <Pencil className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 justify-center border-2 border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-3 border-t-2 border-[#B2D7EC] pt-4 sm:flex-row sm:justify-between">
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <Button
                          variant="outline"
                          className="h-12 justify-center border-2 border-[#B2D7EC] px-4 text-[#0D4F97] hover:bg-[#B2D7EC]/20"
                        >
                          <UserPlus className="mr-2 h-5 w-5" />
                          Adicionar Aluno
                        </Button>
                        <Button
                          variant="outline"
                          className="h-12 justify-center border-2 border-red-200 px-4 text-red-600 hover:bg-red-50"
                        >
                          <UserMinus className="mr-2 h-5 w-5" />
                          Remover Aluno
                        </Button>
                      </div>
                      <Button
                        onClick={() => onFazerChamada(turma.id, turma.name)}
                        className="h-12 justify-center bg-[#0D4F97] px-4 text-white hover:bg-[#FFD000] hover:text-[#0D4F97]"
                      >
                        <ClipboardCheck className="mr-2 h-5 w-5" />
                        Fazer Chamada
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
