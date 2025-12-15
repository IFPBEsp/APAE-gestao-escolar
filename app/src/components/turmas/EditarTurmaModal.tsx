"use client";

import {
  atualizarTurma,
  adicionarAlunosATurma, 
} from "@/services/TurmaService"; 
import { listarProfessores } from "@/services/ProfessorService";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";

interface Aluno {
    id: number;
    nome: string;
}

interface Professor {
    id: number;
    nome: string;
}

interface TurmaAPIData {
    id: number;
    tipo: string;
    anoCriacao: number;
    turno: string;
    nome: string;
    professor: Professor;
    alunos: Aluno[];
    isAtiva: boolean;
}

interface EditarTurmaModalProps {
    isOpen: boolean;
    onClose: () => void;
    turmaData?: TurmaAPIData;
    onSave?: (turma: TurmaAPIData) => void;
}

export function EditarTurmaModal({ isOpen, onClose, turmaData, onSave }: EditarTurmaModalProps) {
    // --- Dados do Formulário (Valores Mutáveis) ---
    const [tipo, setTipo] = useState("");
    const [turno, setTurno] = useState("");
    
    // --- Gerenciamento de Professor ---
    const [buscaProfessor, setBuscaProfessor] = useState("");
    const [professoresEncontrados, setProfessoresEncontrados] = useState<Professor[]>([]);
    const [professorSelecionado, setProfessorSelecionado] = useState<Professor | null>(null); 
    
    // --- Gerenciamento de Alunos ---
    const [buscaAluno, setBuscaAluno] = useState("");
    const [alunosEncontrados, setAlunosEncontrados] = useState<Aluno[]>([]);
    const [alunosNaTurma, setAlunosNaTurma] = useState<Aluno[]>([]);

    // Gerar nome automaticamente (para exibição)
    const nomeTurma = `${tipo ? formatTipo(tipo) : ""} ${turmaData?.anoCriacao || ""} - ${turno ? formatTurno(turno) : ""}`;

    // Funções auxiliares (reutilizadas)
    function formatTipo(val: string) {
        if (val === 'ALFABETIZACAO' || val === 'alfabetizacao') return 'Alfabetização';
        if (val === 'ESTIMULACAO' || val === 'estimulacao') return 'Estimulação';
        return val;
    }

    function formatTurno(val: string) {
        if (val === 'MANHA' || val === 'manha') return 'Manhã';
        if (val === 'TARDE' || val === 'tarde') return 'Tarde';
        if (val === 'INTEGRAL' || val === 'integral') return 'Integral';
        return val;
    }

    // --- Hooks de Inicialização ---

    // Inicializa o estado do modal com os dados da turmaData
    useEffect(() => {
        if (turmaData && isOpen) {
            setTipo(turmaData.tipo);
            setTurno(turmaData.turno);
            
            setProfessorSelecionado(turmaData.professor);
            setAlunosNaTurma(turmaData.alunos || []);
            
            setBuscaProfessor("");
            setBuscaAluno("");
        }
    }, [turmaData, isOpen]);


    // --- Lógica de Busca de Professor ---

    useEffect(() => {
        if (buscaProfessor.length > 0) {
            const delayDebounceFn = setTimeout(() => {
                fetchProfessores(buscaProfessor);
            }, 300); 
            return () => clearTimeout(delayDebounceFn);
        } else {
            setProfessoresEncontrados([]);
        }
    }, [buscaProfessor]);

    async function fetchProfessores(nome: string) {
        try {
            const data = await listarProfessores(nome, true); 
            setProfessoresEncontrados(data);
        } catch (error: any) {
            toast.error(error.message || "Erro ao buscar professores");
            setProfessoresEncontrados([]);
        }
    }

    function selecionarNovoProfessor(prof: Professor) {
        setProfessorSelecionado(prof); 
        setBuscaProfessor(""); 
        setProfessoresEncontrados([]); 
    }
    
    // --- Lógica de Alunos (Mantida do código anterior) ---
    
    useEffect(() => {
        if (buscaAluno.length > 0) { 
            const delayDebounceFn = setTimeout(() => {
                fetchAlunos(buscaAluno);
            }, 300);
            return () => clearTimeout(delayDebounceFn);
        } else {
            setAlunosEncontrados([]);
        }
    }, [buscaAluno]);
    
    const mockAlunos: Aluno[] = [ 
        { id: 101, nome: "Ana Silva" },
        { id: 102, nome: "Beatriz Costa" },
        { id: 103, nome: "Carlos Oliveira" },
        { id: 104, nome: "Daniela Souza" },
        { id: 105, nome: "Eduardo Lima" },
    ]; 
    
    async function fetchAlunos(nome: string) {
        try {
            const response = await fetch(`http://localhost:8080/api/alunos?nome=${nome}`); 
            if (response.ok) {
                const data = await response.json();
                setAlunosEncontrados(data.filter((a: Aluno) => !alunosNaTurma.some(naTurma => naTurma.id === a.id)));
                return;
            }
            throw new Error("Failed to fetch");
        } catch (error) {
            const filtered = mockAlunos.filter(a => a.nome.toLowerCase().includes(nome.toLowerCase()));
            setAlunosEncontrados(filtered.filter(a => !alunosNaTurma.some(naTurma => naTurma.id === a.id)));
        }
    }
    
    function adicionarAluno(aluno: Aluno) {
        if (!alunosNaTurma.find(a => a.id === aluno.id)) {
            setAlunosNaTurma([...alunosNaTurma, aluno]);
        }
        setBuscaAluno("");
        setAlunosEncontrados([]);
    }

    function removerAluno(id: number) {
        setAlunosNaTurma(alunosNaTurma.filter(a => a.id !== id));
    }


    // --- Lógica de Salvamento (API) ---

    async function handleSave() {
        if (!turmaData || !professorSelecionado) {
            toast.error("Erro: Dados da turma ou professor ausentes.");
            return;
        }

        const idTurma = turmaData.id;

        // CORREÇÃO APLICADA AQUI: INCLUSÃO DE 'anoCriacao' para satisfazer o DTO do Spring Boot.
        const dadosAtualizados = {
            tipo: tipo.toUpperCase(),       
            turno: turno.toUpperCase(),
            isAtiva: turmaData.isAtiva, 
            professorId: professorSelecionado.id, 
            // CAMPO CORRIGIDO: Inclui o valor original, que é exigido pelo backend.
            anoCriacao: turmaData.anoCriacao,
        };

        try {
            // 1. Atualização dos dados básicos (incluindo o professor e anoCriacao)
            const turmaAtualizada = await atualizarTurma(idTurma, dadosAtualizados);

            // 2. Gerencia Alunos (Substituição da lista completa)
            await adicionarAlunosATurma(idTurma, alunosNaTurma.map(a => a.id));

            toast.success(`Turma ${turmaData.nome} atualizada com sucesso!`);

            if (onSave) {
                onSave({
                    ...turmaAtualizada, 
                    professor: professorSelecionado,
                    alunos: alunosNaTurma,
                });
            }
            onClose();

        } catch (error: any) {
            toast.error(error.message || "Erro ao salvar alterações da turma");
        }
    }

    if (!turmaData) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-[#0D4F97] text-xl">Editar Informações da Turma</DialogTitle>
                    <p className="text-gray-500 text-sm">
                        Atualize os detalhes da turma conforme necessário.
                    </p>
                </DialogHeader>

                <div className="space-y-6 py-4">

                    <div className="space-y-4">
                        <h3 className="text-[#0D4F97] font-medium border-b border-[#B2D7EC] pb-2">Informações Básicas</h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[#0D4F97]">Tipo de Turma</Label>
                                <Select onValueChange={setTipo} defaultValue={turmaData.tipo}>
                                    <SelectTrigger className="bg-white border-[#B2D7EC]">
                                        <SelectValue placeholder={formatTipo(tipo)} /> 
                                    </SelectTrigger>
                                    <SelectContent className="bg-white">
                                        <SelectItem value="ALFABETIZACAO">Alfabetização</SelectItem>
                                        <SelectItem value="ESTIMULACAO">Estimulação</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[#0D4F97]">Turno</Label>
                                <Select onValueChange={setTurno} defaultValue={turmaData.turno}>
                                    <SelectTrigger className="bg-white border-[#B2D7EC]">
                                        <SelectValue placeholder={formatTurno(turno)} />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white">
                                        <SelectItem value="MANHA">Manhã</SelectItem>
                                        <SelectItem value="TARDE">Tarde</SelectItem>
                                        <SelectItem value="INTEGRAL">Integral</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[#0D4F97]">Nome da Turma</Label>
                            <Input
                                value={nomeTurma}
                                disabled
                                className="bg-gray-50 border-[#B2D7EC]"
                            />
                            <p className="text-xs text-[#0D4F97]">
                                O nome da turma é gerado a partir do Tipo, Ano ({turmaData.anoCriacao}) e Turno.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-[#0D4F97] font-medium border-b border-[#B2D7EC] pb-2 flex items-center gap-2">
                            Alterar Professor Responsável
                        </h3>
                        <div className="bg-[#E8F3FF] p-4 rounded-lg border border-[#B2D7EC]">
                            <Label className="text-[#0D4F97] mb-1 block">Professor Atual/Selecionado:</Label>
                            <div className="flex items-center gap-2 text-[#0D4F97] font-medium">
                                <span>{professorSelecionado?.nome || "N/A"}</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[#0D4F97]">Buscar Novo Professor</Label>
                            <div className="relative">
                                <Input
                                    placeholder="Digite o nome do professor para buscar..."
                                    value={buscaProfessor}
                                    onChange={(e) => setBuscaProfessor(e.target.value)}
                                    className="bg-white border-[#B2D7EC]"
                                />
                                {professoresEncontrados.length > 0 && (
                                    <div className="absolute z-10 w-full border rounded-md max-h-40 overflow-y-auto bg-white shadow-lg mt-1">
                                        {professoresEncontrados.map(prof => (
                                            <div
                                                key={prof.id}
                                                className="p-2 hover:bg-gray-50 cursor-pointer text-sm"
                                                onClick={() => selecionarNovoProfessor(prof)}
                                            >
                                                {prof.nome}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-[#0D4F97] font-medium border-b border-[#B2D7EC] pb-2">Gerenciar Alunos na Turma</h3>

                        <div className="space-y-2">
                            <Label className="text-[#0D4F97]">Adicionar Aluno</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                <Input
                                    placeholder="Buscar aluno por nome..."
                                    className="pl-10 bg-white border-[#B2D7EC]"
                                    value={buscaAluno}
                                    onChange={(e) => setBuscaAluno(e.target.value)}
                                />
                            </div>
                            {alunosEncontrados.length > 0 && (
                                <div className="border rounded-md max-h-40 overflow-y-auto bg-white shadow-sm mt-1">
                                    {alunosEncontrados.map(aluno => (
                                        <div
                                            key={aluno.id}
                                            className="p-2 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                                            onClick={() => adicionarAluno(aluno)}
                                        >
                                            <span className="text-sm font-medium">{aluno.nome}</span>
                                            <span className="text-xs text-gray-500">Adicionar</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="border border-[#B2D7EC] rounded-lg p-4 bg-white">
                            <Label className="text-[#0D4F97] mb-2 block font-medium">Alunos na Turma ({alunosNaTurma.length})</Label>
                            <div className="max-h-60 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                                {alunosNaTurma.length === 0 && <p className="text-sm text-gray-400 italic text-center py-4">Nenhum aluno vinculado.</p>}
                                {alunosNaTurma.map(aluno => (
                                    <div key={aluno.id} className="flex justify-between items-center bg-white p-3 rounded-lg border border-[#B2D7EC] shadow-sm hover:shadow transition-shadow">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 bg-[#E8F3FF] rounded-full flex items-center justify-center text-[#0D4F97]">
                                                {/* Ícone de Usuário Simples */}
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 0 0 0-4-4H9a4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-[#0D4F97]">{aluno.nome}</p>
                                                <p className="text-xs text-gray-500">Matrícula: {2025000 + aluno.id}</p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 h-8 w-8 rounded-full"
                                            onClick={() => removerAluno(aluno.id)}
                                        >
                                            <X size={16} />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E5E5]">
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button
                        className="bg-[#0D4F97] hover:bg-[#0B3E78] text-white"
                        onClick={handleSave}
                        disabled={!professorSelecionado} 
                    >
                        Salvar Alterações
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}