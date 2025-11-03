'use client'

import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Users, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

// Mock data for students
const studentsByClass: Record<string, Array<{ id: number; name: string }>> = {
  "1": [
    { id: 1, name: "Ana Silva" },
    { id: 2, name: "Bruno Costa" },
    { id: 3, name: "Carlos Oliveira" },
    { id: 4, name: "Diana Santos" },
    { id: 5, name: "Eduardo Ferreira" },
    { id: 6, name: "Fernanda Lima" },
    { id: 7, name: "Gabriel Souza" },
    { id: 8, name: "Helena Rodrigues" },
  ],
  "2": [
    { id: 9, name: "Igor Martins" },
    { id: 10, name: "Juliana Alves" },
    { id: 11, name: "Lucas Pereira" },
    { id: 12, name: "Maria Cardoso" },
    { id: 13, name: "Nicolas Ribeiro" },
    { id: 14, name: "Olivia Gomes" },
  ],
};

const turmaNames: Record<string, string> = {
  "1": "Alfabetização",
  "2": "Estimulação",
};

interface ChamadaPageProps {
  params: {
    turmaId: string;
  };
}

export default function ChamadaPage({ params }: ChamadaPageProps) {
  const { turmaId } = params;
  const router = useRouter();
  
  const [attendance, setAttendance] = useState<Record<number, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");

  // Generate list of previous dates (last 7 days including today)
  const generateDateOptions = (): string[] => {
    const dates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const formatted = `${String(date.getDate()).padStart(2, "0")}/${String(
        date.getMonth() + 1
      ).padStart(2, "0")}/${date.getFullYear()}`;
      dates.push(formatted);
    }
    return dates;
  };

  const dateOptions = generateDateOptions();

  // Initialize with today's date
  useEffect(() => {
    if (!selectedDate && dateOptions.length > 0) {
      setSelectedDate(dateOptions[0]);
    }
  }, []);

  // Initialize all students as present when component mounts
  useEffect(() => {
    const students = studentsByClass[turmaId];
    if (students) {
      const initialAttendance: Record<number, boolean> = {};
      students.forEach((student) => {
        initialAttendance[student.id] = true;
      });
      setAttendance(initialAttendance);
    }
  }, [turmaId]);

  const handleAttendanceChange = (studentId: number, checked: boolean) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: checked,
    }));
  };

  const handleSaveChamada = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsSaving(false);
    toast.success("Chamada salva com sucesso!");
  };

  const students = studentsByClass[turmaId] || [];
  const presentCount = Object.values(attendance).filter((isPresent) => isPresent).length;
  const totalCount = students.length;
  const turmaNome = turmaNames[turmaId] || "Turma";

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

        {/* Card Principal */}
        <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <CardTitle className="text-[#0D4F97]">Chamada - {turmaNome}</CardTitle>
                <CardDescription className="text-[#222222]">
                  Registre a presença dos alunos
                </CardDescription>
              </div>
              
              {/* Select de Data - Estilo personalizado */}
              <div className="space-y-2">
                <label className="text-[#0D4F97] font-medium block">
                  Data da Chamada
                </label>
                <div className="rounded-xl border-2 border-[#B2D7EC] bg-white p-2 hover:border-[#0D4F97] transition-colors">
                  <Select value={selectedDate} onValueChange={setSelectedDate}>
                    <SelectTrigger className="border-0 focus:ring-0 focus:ring-offset-0">
                      <SelectValue placeholder="Selecione a data" />
                    </SelectTrigger>
                    <SelectContent>
                      {dateOptions.map((date) => (
                        <SelectItem key={date} value={date}>
                          {date}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Informação da Turma */}
            <div className="rounded-lg bg-[#B2D7EC]/20 p-4 border-2 border-[#B2D7EC]">
              <p className="text-[#0D4F97] font-medium">
                <strong>Turma:</strong> {turmaNome}
              </p>
            </div>

            {/* Lista de Alunos */}
            {students.length > 0 ? (
              <>
                {/* Contador de Presentes */}
                <div className="rounded-xl border-2 border-[#B2D7EC] bg-[#B2D7EC]/20 p-4">
                  <div className="flex items-center justify-center gap-2">
                    <Users className="h-5 w-5 text-[#0D4F97]" />
                    <span className="text-[#0D4F97] font-medium">
                      <strong>{presentCount}</strong> de <strong>{totalCount}</strong> alunos presentes
                    </span>
                  </div>
                </div>

                {/* Lista de Alunos com Checkboxes */}
                <div className="space-y-3">
                  <div className="space-y-2">
                    {students.map((student) => {
                      const isPresent = attendance[student.id] ?? true;
                      
                      return (
                        <label
                          key={student.id}
                          htmlFor={`student-${student.id}`}
                          className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-[#B2D7EC] bg-white p-4 transition-all hover:border-[#0D4F97] hover:shadow-sm"
                        >
                          <span className="flex-1 text-[#222222] font-medium">
                            {student.name}
                          </span>
                          <span className={`font-medium ${isPresent ? 'text-[#0D4F97]' : 'text-red-600'}`}>
                            {isPresent ? "Presente" : "Ausente"}
                          </span>
                          <Checkbox
                            id={`student-${student.id}`}
                            checked={isPresent}
                            onCheckedChange={(checked) =>
                              handleAttendanceChange(student.id, checked as boolean)
                            }
                            className="h-5 w-5 border-2 border-[#0D4F97] data-[state=checked]:bg-[#0D4F97] data-[state=checked]:text-white"
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Botão Salvar */}
                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleSaveChamada}
                    disabled={isSaving}
                    className="h-12 min-w-[200px] justify-center bg-[#0D4F97] text-white hover:bg-[#FFD000] hover:text-[#0D4F97] border-2 border-transparent hover:border-[#0D4F97] transition-all"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      "Salvar Chamada"
                    )}
                  </Button>
                </div>
              </>
            ) : (
              <div className="py-12 text-center text-[#222222]">
                Nenhum aluno encontrado para esta turma
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}