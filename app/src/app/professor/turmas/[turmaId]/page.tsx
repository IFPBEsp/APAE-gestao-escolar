'use client'

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Users, UserCircle, FileText } from "lucide-react";
import ProfessorSidebar from "@/components/Sidebar/ProfessorSidebar";
import { useRouter, useParams } from "next/navigation";

interface Aluno {
    id: number;
    name: string;
}

interface Turma {
    nome: string;
    periodo: string;
    alunos: Aluno[];
}

const turmaData: Record<string, Turma> = {
    "1": {
        nome: "Alfabetização 2025 - Manhã",
        periodo: "Manhã",
        alunos: [
            { id: 1, name: "Ana Silva" },
            { id: 2, name: "Bruno Costa" },
            { id: 3, name: "Carlos Oliveira" },
            { id: 4, name: "Diana Santos" },
            { id: 5, name: "Eduardo Ferreira" },
            { id: 6, name: "Fernanda Lima" },
            { id: 7, name: "Gabriel Souza" },
            { id: 8, name: "Helena Rodrigues" },
        ]
    },
    "2": {
        nome: "Estimulação 2025 - Tarde",
        periodo: "Tarde",
        alunos: [
            { id: 9, name: "Igor Martins" },
            { id: 10, name: "Juliana Alves" },
            { id: 11, name: "Lucas Pereira" },
            { id: 12, name: "Maria Cardoso" },
            { id: 13, name: "Nicolas Ribeiro" },
            { id: 14, name: "Olivia Gomes" },
        ]
    }
};

export default function TurmaDetalhesPage() {
    const router = useRouter();
    const params = useParams();
    const turmaId = params?.turmaId ? String(params.turmaId) : null;
    
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const turma: Turma = turmaData[turmaId || ""] || { nome: "Turma não encontrada", periodo: "", alunos: [] };

    const handleLogout = () => {
        router.push("/");
    };

    const handleToggleCollapse = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    const handleVerAvaliacoes = (alunoId: number) => {
        router.push(`/professor/alunos/${alunoId}/avaliacoes`);
    };

    const handleFazerChamada = () => {
        router.push(`/professor/turmas/${turmaId}/chamada`);
    };

    if (!turmaId || turma.nome === "Turma não encontrada") {
        return (
            <div className="flex min-h-screen bg-[#E5E5E5] items-center justify-center">
                <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md p-8">
                    <CardContent className="text-center">
                        <h2 className="text-[#0D4F97] text-2xl font-bold mb-4">Turma não encontrada</h2>
                        <p className="text-[#222222] mb-6">O ID de turma é inválido ou não foi fornecido.</p>
                        <Button
                            onClick={() => router.push("/professor/turmas")}
                            className="h-12 bg-[#0D4F97] px-6 text-white hover:bg-[#FFD000] hover:text-[#0D4F97]"
                        >
                            Voltar para Turmas
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#E5E5E5]">
            {/* Sidebar - Fixado em 'turmas' para contexto */}
            <ProfessorSidebar
                activeTab="turmas" 
                onTabChange={(tab) => router.push(`/professor/${tab === 'inicio' ? '' : tab}`)}
                onLogout={handleLogout}
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={handleToggleCollapse}
            />

            {/* Main Content */}
            <main className={`flex-1 overflow-y-auto transition-all duration-300 ${
                isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
            }`}>
                <div className="p-4 md:p-8">
                    <div className="mx-auto max-w-6xl">
                        
                        {/* Header com Botões */}
                        <div className="flex items-center justify-between mb-6">
                            <Button
                                onClick={() => router.push("/professor/turmas")}
                                variant="outline"
                                className="h-12 justify-center border-2 border-[#0D4F97] px-4 text-[#0D4F97] hover:bg-[#B2D7EC]/20 font-bold"
                            >
                                <ArrowLeft className="mr-2 h-5 w-5" />
                                Voltar para Turmas
                            </Button>

                            <Button
                                onClick={handleFazerChamada}
                                className="h-12 bg-[#0D4F97] px-6 text-white font-bold hover:bg-[#FFD000] hover:text-[#0D4F97]"
                            >
                                Fazer Chamada
                            </Button>
                        </div>

                        {/* Info da Turma - Card principal com detalhes */}
                        <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md mb-8 bg-white">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-6">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#B2D7EC]/30 flex-shrink-0">
                                        <BookOpen className="h-9 w-9 text-[#0D4F97]" />
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold text-[#0D4F97] mb-1">{turma.nome}</h1>
                                        <div className="flex flex-wrap items-center gap-6 mt-2 text-[#222222] font-medium">
                                            <div className="flex items-center gap-2">
                                                <Users className="h-5 w-5 text-[#0D4F97]" />
                                                <span className="text-lg">{turma.alunos.length} alunos</span>
                                            </div>
                                            <div className="text-lg">
                                                Período: <strong className="text-[#0D4F97]">{turma.periodo}</strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Lista de Alunos - Segundo Card */}
                        <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md bg-white">
                            <CardContent className="p-0">
                                <div className="p-6 border-b border-[#B2D7EC]">
                                    <h2 className="text-xl font-bold text-[#0D4F97]">Alunos da Turma</h2>
                                </div>

                                <div className="divide-y divide-[#B2D7EC]">
                                    {turma.alunos.map((aluno: Aluno) => (
                                        <div key={aluno.id} className="p-4 md:p-6 hover:bg-[#B2D7EC]/10 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#B2D7EC]/20 flex-shrink-0">
                                                        <UserCircle className="h-6 w-6 text-[#0D4F97]" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-[#0D4F97] font-semibold text-lg">{aluno.name}</h3>
                                                        <p className="text-[#222222] text-sm">{turma.nome.split(" - ")[0]}</p>
                                                    </div>
                                                </div>

                                                <Button
                                                    onClick={() => handleVerAvaliacoes(aluno.id)}
                                                    variant="outline"
                                                    className="border-2 border-[#0D4F97] text-[#0D4F97] font-bold hover:bg-[#0D4F97] hover:text-white transition-colors"
                                                >
                                                    <FileText className="h-4 w-4 mr-2" />
                                                    Ver Avaliações
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}