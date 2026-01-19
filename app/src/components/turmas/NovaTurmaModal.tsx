"use client";

import {
  criarTurma,
  adicionarAlunosATurma
} from "@/services/TurmaService";
import { toast } from "sonner";
import { listarAlunos } from "@/services/AlunoService";
import { useState, useEffect } from "react";
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
import { listarProfessores } from "@/services/ProfessorService";


interface Aluno {
    id: number;
    nome: string;
    deficiencia?: string;
}

interface Professor {
    id: number;
    nome: string;
}

interface NovaTurmaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave?: (turma: any) => void;
}

export function NovaTurmaModal({ isOpen, onClose, onSave }: NovaTurmaModalProps) {
    const [tipo, setTipo] = useState("");
    const [ano, setAno] = useState("2025");
    const [turno, setTurno] = useState("");

    const [buscaProfessor, setBuscaProfessor] = useState("");
    const [professoresEncontrados, setProfessoresEncontrados] = useState<Professor[]>([]);
    const [professorSelecionado, setProfessorSelecionado] = useState<Professor | null>(null);

    const [buscaAluno, setBuscaAluno] = useState("");
    const [alunosEncontrados, setAlunosEncontrados] = useState<Aluno[]>([]);
    const [alunosSelecionados, setAlunosSelecionados] = useState<Aluno[]>([]);

    const nomeTurma = `${tipo ? formatTipo(tipo) : ""} ${ano} - ${turno ? formatTurno(turno) : ""}`;

    function formatTipo(val: string) {
        if (val === 'alfabetizacao') return 'Alfabetização';
        if (val === 'matematica') return 'Matemática';
        return val;
    }

    function formatTurno(val: string) {
        if (val === 'manha') return 'Manhã';
        if (val === 'tarde') return 'Tarde';
        return val;
    }

    useEffect(() => {
        if (buscaProfessor.length > 0 && !professorSelecionado) {
            const delayDebounceFn = setTimeout(() => {
                fetchProfessores(buscaProfessor);
            }, 300); 
            return () => clearTimeout(delayDebounceFn);
        } else {
            setProfessoresEncontrados([]);
        }
    }, [buscaProfessor, professorSelecionado]);

    async function fetchProfessores(nome: string) {
        try {
            const data = await listarProfessores(nome, true);
            setProfessoresEncontrados(data);
        } catch (error: any) {
            toast.error(error.message || "Erro ao buscar professores");
            setProfessoresEncontrados([]);
        }
    }


    function selecionarProfessor(prof: Professor) {
        setProfessorSelecionado(prof);
        setBuscaProfessor(prof.nome);
        setProfessoresEncontrados([]);
    }

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

    async function fetchAlunos(nome: string) {
        try {
            const page = await listarAlunos(nome);
            setAlunosEncontrados(page.content ?? []);
        } catch (error) {
            console.log("Erro ao buscar alunos, usando lista vazia");
            setAlunosEncontrados([]);
        }
    }

    function adicionarAluno(aluno: Aluno) {
        if (!alunosSelecionados.find(a => a.id === aluno.id)) {
            setAlunosSelecionados([...alunosSelecionados, aluno]);
        }
        setBuscaAluno("");
        setAlunosEncontrados([]);
    }

    function removerAluno(id: number) {
        setAlunosSelecionados(alunosSelecionados.filter(a => a.id !== id));
    }

    async function handleSave() {
        if (!tipo || !ano || !turno) {
            toast.error("Preencha todos os campos obrigatórios");
            return;
        }

        if (!professorSelecionado) {
            toast.error("Selecione um professor responsável");
            return;
        }

        const dadosNovaTurma = {
            tipo: tipo.toUpperCase(),
            anoCriacao: Number(ano),
            turno: turno.toUpperCase(),
            professorId: professorSelecionado.id,
            isAtiva: true,
        };

        try {
            const turmaCriada = await criarTurma(dadosNovaTurma);
            if (alunosSelecionados.length > 0) {
                await adicionarAlunosATurma(
                    turmaCriada.id,
                    alunosSelecionados.map(a => a.id)
                );
            }

            toast.success("Turma criada com sucesso!");

            if (onSave) {
                onSave({
                    ...turmaCriada,
                    professor: professorSelecionado,
                    alunos: alunosSelecionados,
                });
            }

            onClose();
            resetForm();

        } catch (error: any) {
            toast.error(error.message || "Erro ao criar turma");
        }
    }



    function resetForm() {
        setTipo("");
        setAno("2025");
        setTurno("");
        setBuscaProfessor("");
        setProfessorSelecionado(null);
        setProfessoresEncontrados([]);
        setBuscaAluno("");
        setAlunosEncontrados([]);
        setAlunosSelecionados([]);
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-[#0D4F97] text-xl">Nova Turma</DialogTitle>
                    <p className="text-gray-500 text-sm">
                        Cadastre uma nova turma no sistema
                    </p>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label className="text-[#0D4F97]">Tipo de Turma *</Label>
                        <Select onValueChange={setTipo}>
                            <SelectTrigger className="bg-white border-[#B2D7EC]">
                                <SelectValue placeholder="Selecione o tipo de turma" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                                <SelectItem 
                                    value="alfabetizacao"
                                    className="cursor-pointer hover:bg-[#D0E7FA] focus:bg-[#D0E7FA] transition-colors"
                                >
                                    Alfabetização
                                </SelectItem>
                                <SelectItem
                                    value="Estimulação"
                                    className="cursor-pointer hover:bg-[#D0E7FA] focus:bg-[#D0E7FA] transition-colors"
                                >
                                    Estimulação
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[#0D4F97]">Ano de Criação *</Label>
                            <Input
                                value={ano}
                                onChange={(e) => setAno(e.target.value)}
                                placeholder="Digite o ano (ex: 2025)"
                                className="bg-white border-[#B2D7EC]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[#0D4F97]">Turno *</Label>
                            <Select onValueChange={setTurno}>
                                <SelectTrigger className="bg-white border-[#B2D7EC]">
                                    <SelectValue placeholder="Selecione o turno" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    <SelectItem
                                        value="manha"
                                        className="cursor-pointer hover:bg-[#D0E7FA] focus:bg-[#D0E7FA] transition-colors"
                                    >
                                        Manhã
                                    </SelectItem>
                                    <SelectItem 
                                        value="tarde"
                                        className="cursor-pointer hover:bg-[#D0E7FA] focus:bg-[#D0E7FA] transition-colors"
                                    >
                                        Tarde
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[#0D4F97]">Nome da Turma *</Label>
                        <Input
                            value={nomeTurma}
                            disabled
                            className="bg-gray-50 border-[#B2D7EC]"
                        />
                        <p className="text-xs text-[#0D4F97]">
                            Este campo é gerado automaticamente a partir do Tipo, Ano e Turno selecionados.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[#0D4F97]">Professor Responsável *</Label>
                        <div className="relative">
                            <Input
                                placeholder="Digite o nome do professor..."
                                value={buscaProfessor}
                                onChange={(e) => {
                                    setBuscaProfessor(e.target.value);
                                    setProfessorSelecionado(null);
                                }}
                                className="bg-white border-[#B2D7EC]"
                            />
                            {professoresEncontrados.length > 0 && (
                                <div className="absolute z-10 w-full border rounded-md max-h-40 overflow-y-auto bg-white shadow-lg mt-1">
                                    {professoresEncontrados.map(prof => (
                                        <div
                                            key={prof.id}
                                            className="p-2 hover:bg-gray-50 cursor-pointer text-sm"
                                            onClick={() => selecionarProfessor(prof)}
                                        >
                                            {prof.nome}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Label className="text-[#0D4F97] font-medium border-b border-[#B2D7EC] pb-2 block">Gerenciar Alunos na Turma</Label>

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
                            <Label className="text-[#0D4F97] mb-2 block font-medium">Alunos na Turma ({alunosSelecionados.length})</Label>
                            <div className="max-h-60 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                                {alunosSelecionados.length === 0 && <p className="text-sm text-gray-400 italic text-center py-4">Nenhum aluno vinculado.</p>}
                                {alunosSelecionados.map(aluno => (
                                    <div key={aluno.id} className="flex justify-between items-center bg-white p-3 rounded-lg border border-[#B2D7EC] shadow-sm hover:shadow transition-shadow">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 bg-[#E8F3FF] rounded-full flex items-center justify-center text-[#0D4F97]">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-[#0D4F97]">{aluno.nome}</p>
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

                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button
                        className="bg-[#0D4F97] hover:bg-[#0B3E78] text-white"
                        onClick={handleSave}
                    >
                        Salvar Turma
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
