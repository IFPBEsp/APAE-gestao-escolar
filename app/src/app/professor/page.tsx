'use client'

import { BookOpen, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import ProfessorSidebar from "@/components/Sidebar/ProfessorSidebar";
import { useState } from "react";

export default function ProfessorDashboardPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const professorData = {
    nome: "Maria Santos",
    turmas: [
      {
        id: 1,
        name: "Alfabetização 2025 - Manhã",
        students: 8,
      },
      {
        id: 2,
        name: "Estimulação 2025 - Tarde",
        students: 6,
      },
    ],
  };

  const handleToggleCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex min-h-screen bg-[#E5E5E5]">
      <ProfessorSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      {/* Main Content */}
      <main className={`flex-1 overflow-y-auto transition-all duration-300 pt-16 md:pt-0 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <div className="p-4 md:p-8">
          <div className="mx-auto max-w-6xl">
            {/* Tab: Início */}
            {activeTab === "inicio" && (
              <div className="space-y-4 md:space-y-6">
                {/* Header com Bem-vindo */}
                <div className="mb-4 md:mb-6">
                  <h1 className="text-[#0D4F97] text-xl md:text-2xl font-bold">Painel do Professor</h1>
                  <p className="text-[#222222] text-sm md:text-base">Bem-vindo, {professorData.nome}!</p>
                </div>

                {/* Resumo Rápido */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#B2D7EC]/20 mt-4 md:mt-6">
                          <BookOpen className="h-5 w-5 text-[#0D4F97]" />
                        </div>

                        <p className="text-[#222222] text-xs md:text-sm text-center mt-2 md:mt-3">Turmas Ativas</p>
                        <p className="text-[#0D4F97] text-base md:text-lg font-semibold text-center">
                          {professorData.turmas.length}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#B2D7EC]/20 mt-4 md:mt-6">
                          <Users className="h-5 w-5 text-[#0D4F97]" />
                        </div>

                        <p className="text-[#222222] text-xs md:text-sm text-center mt-2 md:mt-3">Total de Alunos</p>
                        <p className="text-[#0D4F97] text-base md:text-lg font-semibold text-center">
                          {professorData.turmas.reduce((sum, t) => sum + t.students, 0)}
                        </p>
                      </div>

                    </CardContent>
                  </Card>
                </div>

                {/* AÇÃO RÁPIDA - ACESSAR TURMAS */}
                <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
                  <CardHeader className="p-4 md:p-6">
                    <CardTitle className="text-[#0D4F97] text-base md:text-lg">Acesso Rápido</CardTitle>
                    <CardDescription className="text-[#222222] text-sm md:text-base">
                      Acesse suas turmas e funcionalidades
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 pt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                      <Button
                        onClick={() => handleTabChange("turmas")}
                        className="h-16 md:h-20 flex-col gap-2 bg-white border-2 border-[#0D4F97] text-[#0D4F97] hover:bg-[#0D4F97] hover:text-white text-sm md:text-base"
                      >
                        <BookOpen className="h-5 w-5 md:h-6 md:w-6" />
                        <span>Ver Minhas Turmas</span>
                      </Button>
                      <Button
                        onClick={() => handleTabChange("relatorios")}
                        className="h-16 md:h-20 flex-col gap-2 bg-white border-2 border-[#0D4F97] text-[#0D4F97] hover:bg-[#0D4F97] hover:text-white text-sm md:text-base"
                      >
                        <BarChart3 className="h-5 w-5 md:h-6 md:w-6" />
                        <span>Relatórios</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
                <CardHeader className="p-4 md:p-6">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-[#B2D7EC]/20">
                      <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-[#0D4F97]" />
                    </div>
                    <div>
                      <CardTitle className="text-[#0D4F97] text-base md:text-lg">Minhas Turmas</CardTitle>
                      <CardDescription className="text-[#222222] text-xs md:text-sm">
                        {professorData.turmas.length} turmas ativas
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                    {professorData.turmas.map((turma) => (
                      <div
                        key={turma.id}
                        className="rounded-xl border-2 border-[#B2D7EC] bg-white p-4 transition-all hover:border-[#0D4F97] hover:shadow-sm"
                      >
                        <div className="mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <h3 className="text-[#0D4F97] font-semibold text-sm md:text-base">{turma.name}</h3>
                          <span className="rounded-full bg-[#B2D7EC] px-3 py-1 text-[#0D4F97] text-xs md:text-sm w-fit">
                            {turma.students} alunos
                          </span>
                        </div>
                        <div className="mb-4 space-y-1 text-[#222222] text-xs md:text-sm">
                          <p className="break-words">
                            <strong>Horário:</strong> {turma.schedule}
                          </p>
                          <p>
                            <strong>Próxima aula:</strong> {turma.nextClass}
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button
                            onClick={() => handleVerAlunos(turma.name)}
                            className="h-10 md:h-12 flex-1 justify-center bg-white border-2 border-[#0D4F97] px-4 text-[#0D4F97] hover:bg-[#0D4F97] hover:text-white text-xs md:text-sm"
                          >
                            <Users className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                            Fazer Avaliação
                          </Button>
                          <Button
                            onClick={() => handleOpenChamadaDialog(turma.id, turma.name)}
                            className="h-10 md:h-12 flex-1 justify-center bg-[#0D4F97] px-4 text-white hover:bg-[#FFD000] hover:text-[#0D4F97] text-xs md:text-sm"
                          >
                            <ClipboardCheck className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                            Fazer Chamada
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

            {/* Tab: Alunos */}
            {activeTab === "alunos" && (
              <div className="space-y-4 md:space-y-6">
                {/* Botão Voltar */}
                <Button
                  onClick={() => handleTabChange("turmas")}
                  variant="outline"
                  className="mb-4 md:mb-6 h-10 md:h-12 justify-center border-2 border-[#B2D7EC] px-4 text-[#0D4F97] hover:bg-[#B2D7EC]/20 text-sm md:text-base"
                >
                  <ArrowLeft className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                  Voltar
                </Button>

                {/* Header */}
                <div className="flex items-start gap-2 md:gap-3">
                  <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#0D4F97]/10">
                    <FileText className="h-5 w-5 md:h-6 md:w-6 text-[#0D4F97]" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-[#0D4F97] text-lg md:text-2xl font-bold break-words">Acompanhe seus Alunos - {turmaAlunosSelecionada}</h2>
                    <p className="text-[#222222] text-xs md:text-base">Visualize o desempenho dos alunos da turma</p>
                  </div>
                </div>

                {/* Filtros */}
                <Card className="rounded-xl border-2 border-[#B2D7EC] bg-white shadow-sm">
                  <CardContent className="p-4 md:p-6">
                    <h3 className="mb-3 md:mb-4 text-[#0D4F97] font-semibold text-sm md:text-base">Filtros</h3>
                    <div className="grid grid-cols-1 gap-3 md:gap-4 lg:grid-cols-3">
                      {/* Buscar Aluno */}
                      <div>
                        <label className="mb-2 block text-[#0D4F97] text-xs md:text-sm">Buscar Aluno</label>
                        <Input
                          value={searchAluno}
                          onChange={(e) => setSearchAluno(e.target.value)}
                          placeholder="Digite o nome do aluno"
                          className="h-10 md:h-12 border-2 border-[#B2D7EC] bg-white text-sm md:text-base"
                        />
                      </div>

                      {/* Período */}
                      <div>
                        <label className="mb-2 block text-[#0D4F97] text-xs md:text-sm">Período</label>
                        <Select value={selectedPeriodo} onValueChange={setSelectedPeriodo}>
                          <SelectTrigger className="h-10 md:h-12 w-full border-2 border-[#B2D7EC] bg-white text-sm md:text-base">
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
                        <label className="mb-2 block text-[#0D4F97] text-xs md:text-sm">Visualização</label>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setViewMode("grid")}
                            className={`flex h-10 md:h-12 flex-1 items-center justify-center rounded-lg border-2 transition-all ${
                              viewMode === "grid"
                                ? "border-[#0D4F97] bg-[#0D4F97] text-white"
                                : "border-[#B2D7EC] bg-white text-[#0D4F97] hover:bg-[#B2D7EC]/20"
                            }`}
                          >
                            <Grid3x3 className="h-4 w-4 md:h-5 md:w-5" />
                          </button>
                          <button
                            onClick={() => setViewMode("list")}
                            className={`flex h-10 md:h-12 flex-1 items-center justify-center rounded-lg border-2 transition-all ${
                              viewMode === "list"
                                ? "border-[#0D4F97] bg-[#0D4F97] text-white"
                                : "border-[#B2D7EC] bg-white text-[#0D4F97] hover:bg-[#B2D7EC]/20"
                            }`}
                          >
                            <List className="h-4 w-4 md:h-5 md:w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Grid de Alunos */}
                {viewMode === "grid" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
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
                          <CardContent className="p-4 md:p-6">
                            <div className="mb-3 md:mb-4 flex items-start gap-2 md:gap-3">
                              <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#B2D7EC]/20">
                                <UserCircle className="h-6 w-6 md:h-7 md:w-7 text-[#0D4F97]" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="text-[#0D4F97] font-semibold text-sm md:text-base truncate">{aluno.nome}</h3>
                                <p className="text-[#222222] text-xs md:text-sm truncate">{aluno.turma}</p>
                              </div>
                            </div>

                            <div className="mb-3 md:mb-4 space-y-1.5 md:space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[#222222] text-xs md:text-sm">Presença:</span>
                                <span className={`font-semibold text-xs md:text-sm ${getPresencaColor(aluno.presenca)}`}>
                                  {aluno.presenca}%
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-[#222222] text-xs md:text-sm">Última Avaliação:</span>
                                <span className="text-[#222222] text-xs md:text-sm">{aluno.ultimaAvaliacao}</span>
                              </div>
                            </div>

                            <Button
                              onClick={() => handleVerAvaliacoes(aluno.id)}
                              className="h-10 md:h-12 w-full justify-center bg-[#0D4F97] text-white hover:bg-[#FFD000] hover:text-[#0D4F97] font-semibold text-xs md:text-sm"
                            >
                              <Eye className="mr-2 h-4 w-4 md:h-5 md:w-5" />
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
                      <div className="hidden border-b-2 border-[#B2D7EC] bg-[#B2D7EC]/20 lg:grid lg:grid-cols-12 lg:gap-4 lg:p-4">
                        <div className="col-span-4 text-[#0D4F97] font-semibold text-sm">Nome do Aluno</div>
                        <div className="col-span-3 text-[#0D4F97] font-semibold text-sm">Turma</div>
                        <div className="col-span-2 text-[#0D4F97] font-semibold text-sm">Presença</div>
                        <div className="col-span-2 text-[#0D4F97] font-semibold text-sm">Última Avaliação</div>
                        <div className="col-span-1 text-[#0D4F97] font-semibold text-sm">Ações</div>
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
                              className="grid grid-cols-1 gap-3 p-3 md:p-4 transition-all hover:bg-[#B2D7EC]/10 lg:grid-cols-12 lg:items-center lg:gap-4"
                            >
                              {/* Nome do Aluno */}
                              <div className="col-span-1 lg:col-span-4">
                                <div className="flex items-center gap-2 md:gap-3">
                                  <div className="flex h-8 w-8 md:h-10 md:w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#B2D7EC]/20">
                                    <UserCircle className="h-5 w-5 md:h-6 md:w-6 text-[#0D4F97]" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-[#0D4F97] lg:hidden font-semibold text-xs md:text-sm">Nome:</p>
                                    <p className="text-[#0D4F97] font-medium text-sm md:text-base truncate">{aluno.nome}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Turma */}
                              <div className="col-span-1 lg:col-span-3">
                                <p className="text-[#0D4F97] lg:hidden font-semibold text-xs md:text-sm">Turma:</p>
                                <p className="text-[#222222] text-xs md:text-sm break-words">{aluno.turma}</p>
                              </div>

                              {/* Presença */}
                              <div className="col-span-1 lg:col-span-2">
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
                <CardHeader className="p-4 md:p-6">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-[#B2D7EC]/20">
                      <BarChart3 className="h-5 w-5 md:h-6 md:w-6 text-[#0D4F97]" />
                    </div>
                    <div>
                      <CardTitle className="text-[#0D4F97] text-base md:text-lg">Relatórios</CardTitle>
                      <CardDescription className="text-[#222222] text-xs md:text-sm">
                        Visualize dados e estatísticas
                      </CardDescription>
                    </div>
                    <p className="text-[#222222] mb-2">Total de Alunos</p>
                    <p className="text-[#0D4F97] text-3xl font-bold">
                      {professorData.turmas.reduce((sum, t) => sum + t.students, 0)}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-0">
                  <button
                    onClick={() => router.push("/professor/relatorios")}
                    className="flex w-full items-center gap-3 md:gap-4 rounded-xl border-2 border-[#B2D7EC] bg-white p-4 md:p-6 text-left transition-all hover:border-[#0D4F97] hover:shadow-md"
                  >
                    <div className="flex h-12 w-12 md:h-14 md:w-14 flex-shrink-0 items-center justify-center rounded-full bg-[#B2D7EC]/20">
                      <FileText className="h-6 w-6 md:h-7 md:w-7 text-[#0D4F97]" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-[#0D4F97] font-semibold text-sm md:text-base">Relatórios dos Alunos</h3>
                      <p className="text-[#222222] text-xs md:text-sm">
                        Visualize e avalie o desempenho dos alunos
                      </p>
                    </div>
                  </button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Dialog para Fazer Chamada */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#0D4F97] text-lg md:text-xl">Fazer Chamada</DialogTitle>
            <DialogDescription className="text-sm md:text-base">
              Preencha os detalhes para registrar a chamada da turma {chamadaData.turmaNome}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 md:gap-4">
            <div className="flex items-center gap-3 md:gap-4">
              <CalendarIcon className="h-4 w-4 md:h-5 md:w-5 text-[#0D4F97]" />
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-10 md:h-12 justify-start border-2 border-[#B2D7EC] text-left hover:bg-[#B2D7EC]/20 text-sm md:text-base"
                  >
                    <CalendarIcon className="mr-2 h-3 w-3 md:h-4 md:w-4" />
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
              <label className="mb-2 block text-[#0D4F97] text-sm md:text-base">
                Descrição da Aula <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={descricaoChamada}
                onChange={(e) => setDescricaoChamada(e.target.value)}
                placeholder="Adicione uma descrição para a aula"
                className="h-20 md:h-24 border-2 border-[#B2D7EC] bg-white text-sm md:text-base"
              />
            </div>
          </div>
          <div className="mt-4 md:mt-6 flex justify-end">
            <Button
              onClick={handleCriarChamada}
              className="h-10 md:h-12 w-full md:w-auto bg-[#0D4F97] px-6 text-white hover:bg-[#FFD000] hover:text-[#0D4F97] font-semibold text-sm md:text-base"
            >
              Continuar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}