'use client'

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft, FileText, Loader2, Calendar } from "lucide-react";
import ProfessorSidebar from "@/components/Sidebar/ProfessorSidebar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useRouter, useParams } from "next/navigation";

export default function NovaAvaliacaoPage() {
  const params = useParams();
  const turmaId = params.turmaId as string;
  const alunoId = parseInt(params.alunoId as string);
  const router = useRouter();
  
  const [isSaving, setIsSaving] = useState(false);
  const [dataAvaliacao, setDataAvaliacao] = useState<Date>(new Date());
  const [descricaoAvaliacao, setDescricaoAvaliacao] = useState("");
  
  const [activeTab, setActiveTab] = useState("turmas");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Mock data para aluno
  const mockAlunoData: Record<number, any> = {
    1: { name: "Ana Silva", turma: "Alfabetização 2025 - Manhã" },
    2: { name: "Bruno Costa", turma: "Alfabetização 2025 - Manhã" },
  };

  const alunoData = mockAlunoData[alunoId] || {
    name: "Aluno",
    turma: "Alfabetização 2025 - Manhã",
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleLogout = () => {
    router.push("/");
  };

  const handleToggleCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleSalvarAvaliacao = async () => {
    // Validação
    if (!descricaoAvaliacao.trim()) {
      toast.error("Por favor, preencha a descrição da avaliação!");
      return;
    }

    setIsSaving(true);

    // Simular API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const novaAvaliacao = {
      id: Date.now(),
      data: dataAvaliacao,
      descricao: descricaoAvaliacao,
      alunoId: alunoId,
      alunoNome: alunoData.name
    };

    // Aqui você faria a chamada API para salvar
    console.log("Avaliação salva:", novaAvaliacao);
    
    setIsSaving(false);
    toast.success("Avaliação salva com sucesso!");
    
    // Voltar para lista de avaliações após salvar
    setTimeout(() => {
      router.push(`/professor/turmas/${turmaId}/alunos/${alunoId}/avaliacoes`);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen bg-[#E5E5E5]">
      {/* Sidebar */}
      <ProfessorSidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onLogout={handleLogout}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      {/* Main Content */}
      <main className={`flex-1 overflow-y-auto transition-all duration-300 ${
        isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
      }`}>
        <div className="p-4 md:p-8">
          <div className="mx-auto max-w-4xl">
            {/* Botão Voltar */}
            <Button
              onClick={() => router.push(`/professor/turmas/${turmaId}/alunos/${alunoId}/avaliacoes`)}
              variant="outline"
              className="mb-6 h-12 justify-center border-2 border-[#B2D7EC] px-4 text-[#0D4F97] hover:bg-[#B2D7EC]/20"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Voltar
            </Button>

            {/* Header - Igual ao Figma */}
            <div className="mb-6 flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0D4F97]/10">
                <FileText className="h-6 w-6 text-[#0D4F97]" />
              </div>
              <div>
                <h2 className="text-[#0D4F97] text-2xl font-bold">Adicionar Avaliação</h2>
                <p className="text-[#222222]">Registre uma nova avaliação do aluno</p>
              </div>
            </div>

            {/* Formulário - Simplificado igual ao Figma */}
            <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Data da Avaliação - Estilo igual Figma */}
                  <div>
                    <label className="mb-2 block text-[#0D4F97] font-semibold">
                      Data da Avaliação *
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full h-12 justify-start border-2 border-[#B2D7EC] text-left font-normal hover:bg-[#B2D7EC]/20"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {format(dataAvaliacao, "dd/MM/yyyy", { locale: ptBR })}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-xl border-2 border-[#B2D7EC]" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={dataAvaliacao}
                          onSelect={(date) => date && setDataAvaliacao(date)}
                          initialFocus
                          locale={ptBR}
                          className="rounded-xl"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Descrição da Avaliação - Único campo igual Figma */}
                  <div>
                    <label className="mb-2 block text-[#0D4F97] font-semibold">
                      Descrição da Avaliação *
                    </label>
                    <Textarea
                      value={descricaoAvaliacao}
                      onChange={(e) => setDescricaoAvaliacao(e.target.value)}
                      placeholder="Descreva a avaliação do aluno..."
                      className="min-h-[120px] border-2 border-[#B2D7EC] bg-white focus:border-[#0D4F97] focus:ring-1 focus:ring-[#0D4F97] resize-none"
                    />
                  </div>

                  {/* Botão Salvar */}
                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={handleSalvarAvaliacao}
                      disabled={isSaving}
                      className="h-12 min-w-[200px] bg-[#0D4F97] px-6 text-white hover:bg-[#FFD000] hover:text-[#0D4F97] font-semibold border-2 border-transparent hover:border-[#0D4F97] transition-all"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        "Salvar Avaliação"
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}