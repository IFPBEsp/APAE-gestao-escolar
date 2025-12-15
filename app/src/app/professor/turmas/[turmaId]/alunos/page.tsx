'use client'

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  BookOpen, 
  Users, 
  UserCircle, 
  Search,
  Grid3x3,
  List,
  FileText,
  Calendar,
  BarChart3
} from "lucide-react";
import ProfessorSidebar from "@/components/Sidebar/ProfessorSidebar";
import { useRouter, useParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function TurmaDetalhesPage() {
  const params = useParams();
  const turmaId = params?.turmaId ? String(params.turmaId) : null;
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState("turmas");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedPeriodo, setSelectedPeriodo] = useState("mes-atual");

  // Mock data atualizada
  const turmaData: Record<string, any> = {
    "1": {
      nome: "Alfabetização 2025 - Manhã",
      periodo: "Manhã",
      descricao: "Visualize o desempenho dos alunos da turma",
      alunos: [
        { id: 1, nome: "Ana Silva", matricula: "2024001", presenca: 92, ultimaAvaliacao: "05/11/2025", nota: 8.5 },
        { id: 2, nome: "Bruno Costa", matricula: "2024002", presenca: 88, ultimaAvaliacao: "04/11/2025", nota: 9.0 },
        { id: 3, nome: "Carlos Oliveira", matricula: "2024003", presenca: 95, ultimaAvaliacao: "05/11/2025", nota: 7.5 },
        { id: 4, nome: "Diana Santos", matricula: "2024004", presenca: 85, ultimaAvaliacao: "03/11/2025", nota: 9.5 },
        { id: 5, nome: "Eduardo Ferreira", matricula: "2024005", presenca: 90, ultimaAvaliacao: "05/11/2025", nota: 7.0 },
        { id: 6, nome: "Fernanda Lima", matricula: "2024006", presenca: 87, ultimaAvaliacao: "04/11/2025", nota: 8.0 },
        { id: 7, nome: "Gabriel Souza", matricula: "2024007", presenca: 94, ultimaAvaliacao: "05/11/2025", nota: 8.8 },
        { id: 8, nome: "Helena Rodrigues", matricula: "2024008", presenca: 91, ultimaAvaliacao: "04/11/2025", nota: 7.2 },
      ]
    },
    "2": {
      nome: "Estimulação 2025 - Tarde",
      periodo: "Tarde",
      descricao: "Visualize o desempenho dos alunos da turma",
      alunos: [
        { id: 9, nome: "Igor Martins", matricula: "2024009", presenca: 93, ultimaAvaliacao: "04/11/2025", nota: 8.5 },
        { id: 10, nome: "Juliana Alves", matricula: "2024010", presenca: 89, ultimaAvaliacao: "03/11/2025", nota: 9.0 },
        { id: 11, nome: "Lucas Pereira", matricula: "2024011", presenca: 92, ultimaAvaliacao: "05/11/2025", nota: 7.8 },
        { id: 12, nome: "Maria Cardoso", matricula: "2024012", presenca: 86, ultimaAvaliacao: "04/11/2025", nota: 8.2 },
        { id: 13, nome: "Nicolas Ribeiro", matricula: "2024013", presenca: 95, ultimaAvaliacao: "05/11/2025", nota: 9.5 },
        { id: 14, nome: "Olivia Gomes", matricula: "2024014", presenca: 88, ultimaAvaliacao: "03/11/2025", nota: 7.5 },
      ]
    }
  };

  if (!turmaId) {
    return (
      <div className="flex min-h-screen bg-[#E5E5E5] items-center justify-center">
        <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md p-8">
          <CardContent className="text-center">
            <h2 className="text-[#0D4F97] text-2xl font-bold mb-4">Turma não encontrada</h2>
            <p className="text-[#222222] mb-6">Não foi possível identificar a turma.</p>
            <Button
              onClick={() => router.push("/professor/turmas")}
              className="h-12 bg-[#0D4F97] px-6 text-white hover:bg-[#FFD000] hover:text-[#0D4F97]"
            >
              Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const turma = turmaData[turmaId] || { 
    nome: "Turma não encontrada", 
    descricao: "",
    alunos: [] 
  };

  // Filtrar alunos
  const filteredAlunos = turma.alunos.filter((aluno: any) =>
    aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    aluno.matricula.includes(searchTerm)
  );

  // Funções auxiliares
  const getPresencaColor = (presenca: number) => {
    if (presenca >= 90) return "text-green-600";
    if (presenca >= 85) return "text-yellow-600";
    return "text-orange-600";
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

  const handleAvaliacoes = (alunoId: number) => {
    // Navega para a página de avaliações do aluno
    router.push(`/professor/alunos/${alunoId}/avaliacoes?turmaId=${turmaId}`);
  };

  const handleRelatorios = (alunoId: number) => {
    // Navega para a página de relatórios do aluno (passa turmaId como query parameter)
    router.push(`/professor/alunos/${alunoId}/relatorios?turmaId=${turmaId}`);
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
          <div className="mx-auto max-w-7xl">
            {/* Botão Voltar - ÚNICO botão no header */}
            <div className="mb-6">
              <Button
                onClick={() => router.push("/professor/turmas")}
                variant="outline"
                className="h-12 justify-center border-2 border-[#B2D7EC] px-4 text-[#0D4F97] hover:bg-[#B2D7EC]/20"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Voltar
              </Button>
            </div>

            {/* Título Principal */}
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-[#0D4F97] mb-2">
                Acompanhe seus Alunos - {turma.nome}
              </h1>
              <p className="text-[#222222] text-lg">
                {turma.descricao}
              </p>
            </div>

            {/* Info da Turma */}
            <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#0D4F97]/10">
                      <BookOpen className="h-8 w-8 text-[#0D4F97]" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-[#0D4F97]">{turma.nome}</h2>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-2 text-[#222222]">
                          <Users className="h-5 w-5" />
                          <span>{turma.alunos.length} alunos</span>
                        </div>
                        <div className="text-[#222222]">
                          Período: {turma.periodo}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Status da Turma</div>
                    <div className="text-green-600 font-semibold">Ativa</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FILTROS */}
            <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md mb-6">
              <CardContent className="p-6">
                <h3 className="text-[#0D4F97] font-semibold text-lg mb-4">Filtros</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Buscar Aluno */}
                  <div>
                    <label className="block text-[#0D4F97] font-medium mb-2">Buscar Aluno</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Digite o nome do aluno"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-12 border-2 border-[#B2D7EC] bg-white"
                      />
                    </div>
                  </div>

                  {/* Período */}
                  <div>
                    <label className="block text-[#0D4F97] font-medium mb-2">Período</label>
                    <Select value={selectedPeriodo} onValueChange={setSelectedPeriodo}>
                      <SelectTrigger className="h-12 w-full border-2 border-[#B2D7EC] bg-white">
                        <SelectValue placeholder="Mês Atual" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mes-atual">Mês Atual</SelectItem>
                        <SelectItem value="ano-atual">Ano Atual</SelectItem>
                        <SelectItem value="semestre">Último Semestre</SelectItem>
                        <SelectItem value="trimestre">Último Trimestre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Visualização */}
                  <div>
                    <label className="block text-[#0D4F97] font-medium mb-2">Visualização</label>
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

            {/* Grid de Alunos - NOVO FORMATO COM CARDS */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {filteredAlunos.map((aluno: any) => (
                  <Card
                    key={aluno.id}
                    className="rounded-xl border-2 border-[#B2D7EC] shadow-md transition-all hover:border-[#0D4F97] hover:shadow-lg"
                  >
                    <CardContent className="p-4">
                      {/* Informações do Aluno */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-12 w-12 rounded-full bg-[#B2D7EC]/20 flex items-center justify-center">
                          <UserCircle className="h-6 w-6 text-[#0D4F97]" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#0D4F97]">{aluno.nome}</h3>
                          <p className="text-sm text-gray-500">{turma.nome}</p>
                        </div>
                      </div>

                      {/* Estatísticas */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-blue-600" />
                            <span className="text-gray-700">Presença:</span>
                          </div>
                          <span className={`font-bold ${getPresencaColor(aluno.presenca)}`}>
                            {aluno.presenca}%
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4 text-green-600" />
                            <span className="text-gray-700">Última Avaliação:</span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-green-600">{aluno.ultimaAvaliacao}</div>
                            <div className="text-xs text-gray-500">Nota: {aluno.nota}</div>
                          </div>
                        </div>
                      </div>

                      {/* Botões de Ação */}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleAvaliacoes(aluno.id)}
                          className="flex-1 bg-[#0D4F97] text-white hover:bg-[#FFD000] hover:text-[#0D4F97]"
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          Avaliações
                        </Button>
                        <Button
                          onClick={() => handleRelatorios(aluno.id)}
                          variant="outline"
                          className="flex-1 border-2 border-[#0D4F97] text-[#0D4F97] hover:bg-[#0D4F97]/10"
                        >
                          Relatórios
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Modo Lista (mantendo formato original) */}
            {viewMode === "list" && (
              <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
                <CardContent className="p-0">
                  <div className="p-6 border-b-2 border-[#B2D7EC]">
                    <h2 className="text-xl font-semibold text-[#0D4F97]">Alunos da Turma</h2>
                    <p className="text-gray-500 text-sm">{filteredAlunos.length} alunos encontrados</p>
                  </div>

                  <div className="divide-y-2 divide-[#B2D7EC]">
                    {filteredAlunos.map((aluno: any) => (
                      <div key={aluno.id} className="p-6 hover:bg-[#B2D7EC]/10 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#B2D7EC]/20">
                              <UserCircle className="h-6 w-6 text-[#0D4F97]" />
                            </div>
                            <div>
                              <h3 className="text-[#0D4F97] font-semibold">{aluno.nome}</h3>
                              <p className="text-[#222222] text-sm">Matrícula: {aluno.matricula}</p>
                              <div className="flex gap-4 mt-1">
                                <span className="text-sm text-blue-600">
                                  Presença: {aluno.presenca}%
                                </span>
                                <span className="text-sm text-green-600">
                                  Última: {aluno.ultimaAvaliacao}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleAvaliacoes(aluno.id)}
                              variant="outline"
                              className="border-2 border-[#B2D7EC] text-[#0D4F97] hover:bg-[#B2D7EC]/20"
                            >
                              Avaliações
                            </Button>
                            <Button
                              onClick={() => handleRelatorios(aluno.id)}
                              variant="outline"
                              className="border-2 border-[#0D4F97] text-[#0D4F97] hover:bg-[#0D4F97]/10"
                            >
                              Relatórios
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Mensagem vazia */}
            {filteredAlunos.length === 0 && (
              <Card className="p-8 text-center border-2 border-[#B2D7EC]">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum aluno encontrado
                </h3>
                <p className="text-gray-500">
                  {searchTerm 
                    ? `Nenhum resultado para "${searchTerm}"`
                    : 'Esta turma ainda não tem alunos matriculados'}
                </p>
              </Card>
            )}

            {/* Contador */}
            <div className="mt-6 text-center text-gray-500 text-sm">
              Mostrando {filteredAlunos.length} de {turma.alunos.length} alunos
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}