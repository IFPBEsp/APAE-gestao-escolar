'use client'

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, ClipboardCheck, FileText, BookOpen, UserCircle, BarChart3, Eye, Grid3x3, List, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProfessorSidebar from "@/components/Sidebar/ProfessorSidebar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CalendarIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import ChamadaCalendar from "@/components/ChamadaCalendar";
import { useRouter } from "next/navigation";

export default function ProfessorDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("inicio");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchAluno, setSearchAluno] = useState("");
  const [selectedPeriodo, setSelectedPeriodo] = useState("mes-atual");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [chamadaData, setChamadaData] = useState<{ turmaId: number; turmaNome: string }>({ turmaId: 0, turmaNome: "" });
  const [descricaoChamada, setDescricaoChamada] = useState("");
  const [dataChamada, setDataChamada] = useState<Date>(new Date());
  const [turmaAlunosSelecionada, setTurmaAlunosSelecionada] = useState<string>("");

  const professorData = {
    nome: "Maria Santos",
    turmas: [
      {
        id: 1,
        name: "Alfabetização 2025 - Manhã",
        students: 8,
        schedule: "Segunda a Sexta - 08:00 às 12:00",
        nextClass: "Segunda-feira às 08:00",
      },
      {
        id: 2,
        name: "Estimulação 2025 - Tarde",
        students: 6,
        schedule: "Segunda a Sexta - 14:00 às 18:00",
        nextClass: "Segunda-feira às 14:00",
      },
    ],
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

  const handleOpenChamadaDialog = (turmaId: number, turmaNome: string) => {
    setChamadaData({ turmaId, turmaNome });
    setDescricaoChamada("");
    setDataChamada(new Date());
    setIsDialogOpen(true);
  };

  const handleCriarChamada = () => {
    if (!descricaoChamada.trim()) {
      toast.error("Por favor, preencha a descrição da aula!");
      return;
    }
    
    setIsDialogOpen(false);
    
    // Redirecionar para página de chamada COM os dados
    router.push(`/professor/turmas/${chamadaData.turmaId}/chamada?data=${dataChamada.toISOString()}&descricao=${encodeURIComponent(descricaoChamada)}`);
    
    toast.success("Chamada criada com sucesso! Redirecionando...");
  };

  const alunosData = [
    { id: 1, nome: "Ana Silva", turma: "Alfabetização 2025 - Manhã", presenca: 92, ultimaAvaliacao: "05/11/2025" },
    { id: 2, nome: "Bruno Costa", turma: "Alfabetização 2025 - Manhã", presenca: 88, ultimaAvaliacao: "04/11/2025" },
    { id: 3, nome: "Carlos Oliveira", turma: "Alfabetização 2025 - Manhã", presenca: 95, ultimaAvaliacao: "05/11/2025" },
    { id: 4, nome: "Diana Santos", turma: "Alfabetização 2025 - Manhã", presenca: 85, ultimaAvaliacao: "03/11/2025" },
    { id: 5, nome: "Eduardo Ferreira", turma: "Alfabetização 2025 - Manhã", presenca: 90, ultimaAvaliacao: "05/11/2025" },
    { id: 6, nome: "Fernanda Lima", turma: "Alfabetização 2025 - Manhã", presenca: 87, ultimaAvaliacao: "04/11/2025" },
    { id: 7, nome: "Gustavo Pereira", turma: "Alfabetização 2025 - Manhã", presenca: 94, ultimaAvaliacao: "05/11/2025" },
    { id: 8, nome: "Helena Rodrigues", turma: "Alfabetização 2025 - Manhã", presenca: 91, ultimaAvaliacao: "04/11/2025" },
    { id: 9, nome: "Igor Martins", turma: "Estimulação 2025 - Tarde", presenca: 93, ultimaAvaliacao: "04/11/2025" },
    { id: 10, nome: "Julia Almeida", turma: "Estimulação 2025 - Tarde", presenca: 89, ultimaAvaliacao: "03/11/2025" },
    { id: 11, nome: "Lucas Mendes", turma: "Estimulação 2025 - Tarde", presenca: 92, ultimaAvaliacao: "05/11/2025" },
    { id: 12, nome: "Marina Souza", turma: "Estimulação 2025 - Tarde", presenca: 86, ultimaAvaliacao: "04/11/2025" },
    { id: 13, nome: "Nicolas Cardoso", turma: "Estimulação 2025 - Tarde", presenca: 95, ultimaAvaliacao: "05/11/2025" },
    { id: 14, nome: "Olivia Barbosa", turma: "Estimulação 2025 - Tarde", presenca: 88, ultimaAvaliacao: "03/11/2025" },
  ];

  const getPresencaColor = (presenca: number) => {
    if (presenca >= 90) return "text-green-600";
    if (presenca >= 85) return "text-yellow-600";
    return "text-orange-600";
  };

  const handleVerAlunos = (turmaNome: string) => {
    setTurmaAlunosSelecionada(turmaNome);
    setActiveTab("alunos");
  };

  const handleVerAvaliacoes = (alunoId: number) => {
    // Encontrar a turma do aluno
    const aluno = alunosData.find(a => a.id === alunoId);
    if (aluno) {
      const turma = professorData.turmas.find(t => t.name === aluno.turma);
      if (turma) {
        router.push(`/professor/turmas/${turma.id}/alunos/${alunoId}/avaliacoes`);
      }
    }
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
      <main className={`flex-1 overflow-y-auto transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <div className="p-4 md:p-8">
          <div className="mx-auto max-w-6xl">
            {/* Tab: Início */}
            {activeTab === "inicio" && (
              <div className="space-y-6">
                {/* Header com Bem-vindo */}
                <div className="mb-6">
                  <h1 className="text-[#0D4F97] text-2xl font-bold">Painel do Professor</h1>
                  <p className="text-[#222222]">Bem-vindo, {professorData.nome}!</p>
                </div>

                {/* Resumo Rápido */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-center gap-3"> 
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#B2D7EC]/20">
                          <BookOpen className="h-5 w-5 text-[#0D4F97]" />
                        </div>
                        <div className="text-center"> 
                          <p className="text-[#222222] text-sm">Turmas Ativas</p>
                          <p className="text-[#0D4F97] text-lg font-semibold">{professorData.turmas.length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-center gap-3"> 
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#B2D7EC]/20">
                          <Users className="h-5 w-5 text-[#0D4F97]" />
                        </div>
                        <div className="text-center"> 
                          <p className="text-[#222222] text-sm">Total de Alunos</p>
                          <p className="text-[#0D4F97] text-lg font-semibold">
                            {professorData.turmas.reduce((sum, t) => sum + t.students, 0)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* AÇÃO RÁPIDA - ACESSAR TURMAS */}
                <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
                  <CardHeader>
                    <CardTitle className="text-[#0D4F97]">Acesso Rápido</CardTitle>
                    <CardDescription className="text-[#222222]">
                      Acesse suas turmas e funcionalidades
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <Button
                        onClick={() => handleTabChange("turmas")}
                        className="h-20 flex-col gap-2 bg-white border-2 border-[#0D4F97] text-[#0D4F97] hover:bg-[#0D4F97] hover:text-white"
                      >
                        <BookOpen className="h-6 w-6" />
                        <span>Ver Minhas Turmas</span>
                      </Button>
                      <Button
                        onClick={() => handleTabChange("relatorios")}
                        className="h-20 flex-col gap-2 bg-white border-2 border-[#0D4F97] text-[#0D4F97] hover:bg-[#0D4F97] hover:text-white"
                      >
                        <BarChart3 className="h-6 w-6" />
                        <span>Relatórios</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Tab: Turmas */}
            {activeTab === "turmas" && (
              <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#B2D7EC]/20">
                      <BookOpen className="h-6 w-6 text-[#0D4F97]" />
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
                          <h3 className="text-[#0D4F97] font-semibold">{turma.name}</h3>
                          <span className="rounded-full bg-[#B2D7EC] px-3 py-1 text-[#0D4F97]">
                            {turma.students} alunos
                          </span>
                        </div>
                        <div className="mb-4 space-y-1 text-[#222222]">
                          <p>
                            <strong>Horário:</strong> {turma.schedule}
                          </p>
                          <p>
                            <strong>Próxima aula:</strong> {turma.nextClass}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleVerAlunos(turma.name)}
                            className="h-12 flex-1 justify-center bg-white border-2 border-[#0D4F97] px-4 text-[#0D4F97] hover:bg-[#0D4F97] hover:text-white"
                          >
                            <Users className="mr-2 h-5 w-5" />
                            Fazer Avaliação
                          </Button>
                          <Button
                            onClick={() => handleOpenChamadaDialog(turma.id, turma.name)}
                            className="h-12 flex-1 justify-center bg-[#0D4F97] px-4 text-white hover:bg-[#FFD000] hover:text-[#0D4F97]"
                          >
                            <ClipboardCheck className="mr-2 h-5 w-5" />
                            Fazer Chamada
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tab: Alunos */}
            {activeTab === "alunos" && (
              <div className="space-y-6">
                {/* Botão Voltar */}
                <Button
                  onClick={() => handleTabChange("turmas")}
                  variant="outline"
                  className="mb-6 h-12 justify-center border-2 border-[#B2D7EC] px-4 text-[#0D4F97] hover:bg-[#B2D7EC]/20"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Voltar
                </Button>

                {/* Header */}
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0D4F97]/10">
                    <FileText className="h-6 w-6 text-[#0D4F97]" />
                  </div>
                  <div>
                    <h2 className="text-[#0D4F97] text-2xl font-bold">Acompanhe seus Alunos - {turmaAlunosSelecionada}</h2>
                    <p className="text-[#222222]">Visualize o desempenho dos alunos da turma</p>
                  </div>
                </div>

                {/* Filtros */}
                <Card className="rounded-xl border-2 border-[#B2D7EC] bg-white shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="mb-4 text-[#0D4F97] font-semibold">Filtros</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      {/* Buscar Aluno */}
                      <div>
                        <label className="mb-2 block text-[#0D4F97]">Buscar Aluno</label>
                        <Input
                          value={searchAluno}
                          onChange={(e) => setSearchAluno(e.target.value)}
                          placeholder="Digite o nome do aluno"
                          className="h-12 border-2 border-[#B2D7EC] bg-white"
                        />
                      </div>

                      {/* Período */}
                      <div>
                        <label className="mb-2 block text-[#0D4F97]">Período</label>
                        <Select value={selectedPeriodo} onValueChange={setSelectedPeriodo}>
                          <SelectTrigger className="h-12 w-full border-2 border-[#B2D7EC] bg-white">
                            <SelectValue placeholder="Mês Atual" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mes-atual">Mês Atual</SelectItem>
                            <SelectItem value="ano-atual">Ano Atual</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Visualização */}
                      <div>
                        <label className="mb-2 block text-[#0D4F97]">Visualização</label>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setViewMode("grid")}
                            className={`flex h-12 flex-1 items-center justify-center rounded-lg border-2 transition-all ${
                              viewMode === "grid"
                                ? "border-[#0D4F97] bg-[#0D4F97] text-white"
                                : "border-[#B2D7EC] bg-white text-[#0D4F97] hover:bg-[#B2D7EC]/20"
                            }`}
                          >
                            <Grid3x3 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => setViewMode("list")}
                            className={`flex h-12 flex-1 items-center justify-center rounded-lg border-2 transition-all ${
                              viewMode === "list"
                                ? "border-[#0D4F97] bg-[#0D4F97] text-white"
                                : "border-[#B2D7EC] bg-white text-[#0D4F97] hover:bg-[#B2D7EC]/20"
                            }`}
                          >
                            <List className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Grid de Alunos */}
                {viewMode === "grid" && (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {alunosData
                      .filter((aluno) => aluno.turma === turmaAlunosSelecionada)
                      .filter((aluno) =>
                        aluno.nome.toLowerCase().includes(searchAluno.toLowerCase())
                      )
                      .map((aluno) => (
                        <Card
                          key={aluno.id}
                          className="rounded-xl border-2 border-[#B2D7EC] shadow-md transition-all hover:border-[#0D4F97] hover:shadow-lg"
                        >
                          <CardContent className="p-6">
                            <div className="mb-4 flex items-start gap-3">
                              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#B2D7EC]/20">
                                <UserCircle className="h-7 w-7 text-[#0D4F97]" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="text-[#0D4F97] font-semibold">{aluno.nome}</h3>
                                <p className="text-[#222222] text-sm">{aluno.turma}</p>
                              </div>
                            </div>

                            <div className="mb-4 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[#222222]">Presença:</span>
                                <span className={`font-semibold ${getPresencaColor(aluno.presenca)}`}>
                                  {aluno.presenca}%
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-[#222222]">Última Avaliação:</span>
                                <span className="text-[#222222]">{aluno.ultimaAvaliacao}</span>
                              </div>
                            </div>

                            <Button
                              onClick={() => handleVerAvaliacoes(aluno.id)}
                              className="h-12 w-full justify-center bg-[#0D4F97] text-white hover:bg-[#FFD000] hover:text-[#0D4F97] font-semibold"
                            >
                              <Eye className="mr-2 h-5 w-5" />
                              Fazer Avaliação
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                )}

                {/* Lista de Alunos */}
                {viewMode === "list" && (
                  <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
                    <CardContent className="p-0">
                      {/* Header da Tabela */}
                      <div className="hidden border-b-2 border-[#B2D7EC] bg-[#B2D7EC]/20 md:grid md:grid-cols-12 md:gap-4 md:p-4">
                        <div className="col-span-4 text-[#0D4F97] font-semibold">Nome do Aluno</div>
                        <div className="col-span-3 text-[#0D4F97] font-semibold">Turma</div>
                        <div className="col-span-2 text-[#0D4F97] font-semibold">Presença</div>
                        <div className="col-span-2 text-[#0D4F97] font-semibold">Última Avaliação</div>
                        <div className="col-span-1 text-[#0D4F97] font-semibold">Ações</div>
                      </div>

                      {/* Linhas da Tabela */}
                      <div className="divide-y-2 divide-[#B2D7EC]">
                        {alunosData
                          .filter((aluno) => aluno.turma === turmaAlunosSelecionada)
                          .filter((aluno) =>
                            aluno.nome.toLowerCase().includes(searchAluno.toLowerCase())
                          )
                          .map((aluno) => (
                            <div
                              key={aluno.id}
                              className="grid grid-cols-1 gap-4 p-4 transition-all hover:bg-[#B2D7EC]/10 md:grid-cols-12 md:items-center"
                            >
                              {/* Nome do Aluno */}
                              <div className="col-span-1 md:col-span-4">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#B2D7EC]/20">
                                    <UserCircle className="h-6 w-6 text-[#0D4F97]" />
                                  </div>
                                  <div>
                                    <p className="text-[#0D4F97] md:hidden font-semibold">Nome:</p>
                                    <p className="text-[#0D4F97] font-medium">{aluno.nome}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Turma */}
                              <div className="col-span-1 md:col-span-3">
                                <p className="text-[#0D4F97] md:hidden font-semibold">Turma:</p>
                                <p className="text-[#222222]">{aluno.turma}</p>
                              </div>

                              {/* Presença */}
                              <div className="col-span-1 md:col-span-2">
                                <p className="text-[#0D4F97] md:hidden font-semibold">Presença:</p>
                                <span className={`font-medium ${getPresencaColor(aluno.presenca)}`}>
                                  {aluno.presenca}%
                                </span>
                              </div>

                              {/* Última Avaliação */}
                              <div className="col-span-1 md:col-span-2">
                                <p className="text-[#0D4F97] md:hidden font-semibold">Última Avaliação:</p>
                                <p className="text-[#222222]">{aluno.ultimaAvaliacao}</p>
                              </div>

                              {/* Ações */}
                              <div className="col-span-1 md:col-span-1">
                                <Button
                                  onClick={() => handleVerAvaliacoes(aluno.id)}
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-full justify-center text-[#0D4F97] hover:bg-[#B2D7EC]/20 hover:text-[#0D4F97] md:w-8 md:p-0"
                                  title="Fazer Avaliação"
                                >
                                  <Eye className="h-4 w-4 md:mr-0" />
                                  <span className="ml-2 md:hidden">Fazer Avaliação</span>
                                </Button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Tab: Relatórios */}
            {activeTab === "relatorios" && (
              <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#B2D7EC]/20">
                      <BarChart3 className="h-6 w-6 text-[#0D4F97]" />
                    </div>
                    <div>
                      <CardTitle className="text-[#0D4F97]">Relatórios</CardTitle>
                      <CardDescription className="text-[#222222]">
                        Visualize dados e estatísticas
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <button
                    onClick={() => router.push("/professor/relatorios")}
                    className="flex w-full items-center gap-4 rounded-xl border-2 border-[#B2D7EC] bg-white p-6 text-left transition-all hover:border-[#0D4F97] hover:shadow-md"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#B2D7EC]/20">
                      <FileText className="h-7 w-7 text-[#0D4F97]" />
                    </div>
                    <div>
                      <h3 className="text-[#0D4F97] font-semibold">Relatórios dos Alunos</h3>
                      <p className="text-[#222222]">
                        Visualize e avalie o desempenho dos alunos
                      </p>
                    </div>
                  </button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Dialog para Fazer Chamada */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#0D4F97]">Fazer Chamada</DialogTitle>
            <DialogDescription>
              Preencha os detalhes para registrar a chamada da turma {chamadaData.turmaNome}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-4">
              <CalendarIcon className="h-5 w-5 text-[#0D4F97]" />
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-12 justify-start border-2 border-[#B2D7EC] text-left hover:bg-[#B2D7EC]/20"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(dataChamada, "dd/MM/yyyy", { locale: ptBR })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <ChamadaCalendar
                    selected={dataChamada}
                    onSelect={(date) => date && setDataChamada(date)}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label className="mb-2 block text-[#0D4F97]">
                Descrição da Aula <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={descricaoChamada}
                onChange={(e) => setDescricaoChamada(e.target.value)}
                placeholder="Adicione uma descrição para a aula"
                className="h-24 border-2 border-[#B2D7EC] bg-white"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleCriarChamada}
              className="h-12 bg-[#0D4F97] px-6 text-white hover:bg-[#FFD000] hover:text-[#0D4F97] font-semibold"
            >
              Continuar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}