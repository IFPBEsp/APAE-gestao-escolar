"use client";

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

    // Estados do Professor
    const [buscaProfessor, setBuscaProfessor] = useState("");
    const [professoresEncontrados, setProfessoresEncontrados] = useState<Professor[]>([]);
    const [professorSelecionado, setProfessorSelecionado] = useState<Professor | null>(null);

    // Estados dos Alunos
    const [buscaAluno, setBuscaAluno] = useState("");
    const [alunosEncontrados, setAlunosEncontrados] = useState<Aluno[]>([]);
    const [alunosSelecionados, setAlunosSelecionados] = useState<Aluno[]>([]);

    // Gerar nome automaticamente
    const nomeTurma = `${tipo ? formatTipo(tipo) : ""} ${ano} - ${turno ? formatTurno(turno) : ""}`;

    function formatTipo(val: string) {
        if (val === 'alfabetizacao') return 'Alfabetização';
        if (val === 'estimulacao') return 'Estimulação';
        if (val === 'matematica') return 'Matemática';
        return val;
    }

    function formatTurno(val: string) {
        if (val === 'manha') return 'Manhã';
        if (val === 'tarde') return 'Tarde';
        if (val === 'integral') return 'Integral';
        return val;
    }

    // Dados Mock para Fallback
    const mockProfessores: Professor[] = [
        { id: 91, nome: "Prof. Maria Silva" },
        { id: 92, nome: "Prof. João Santos" },
        { id: 93, nome: "Prof. Ana Costa" },
        { id: 94, nome: "Prof. Carlos Lima" }
    ];

    const mockAlunos: Aluno[] = [
        { id: 101, nome: "Ana Silva", deficiencia: "Nenhuma" },
        { id: 102, nome: "Beatriz Costa", deficiencia: "Auditiva" },
        { id: 103, nome: "Carlos Oliveira", deficiencia: "Visual" },
        { id: 104, nome: "Daniela Souza", deficiencia: "Nenhuma" },
        { id: 105, nome: "Eduardo Lima", deficiencia: "Motora" },
    ];

    // Buscar Professores
    useEffect(() => {
        if (buscaProfessor.length > 0 && !professorSelecionado) {
            // Removendo atraso para melhor UX com dados mock
            const delayDebounceFn = setTimeout(() => {
                fetchProfessores(buscaProfessor);
            }, 300); // Atraso reduzido
            return () => clearTimeout(delayDebounceFn);
        } else {
            setProfessoresEncontrados([]);
        }
    }, [buscaProfessor, professorSelecionado]);

    async function fetchProfessores(nome: string) {
        try {
            const response = await fetch(`http://localhost:8080/api/professores?nome=${nome}`);
            if (response.ok) {
                const data = await response.json();
                setProfessoresEncontrados(data);
                return;
            }
            throw new Error("Failed to fetch");
        } catch (error) {
            console.log("Backend offline, using mock data for professors");
            const filtered = mockProfessores.filter(p => p.nome.toLowerCase().includes(nome.toLowerCase()));
            setProfessoresEncontrados(filtered);
        }
    }

    function selecionarProfessor(prof: Professor) {
        setProfessorSelecionado(prof);
        setBuscaProfessor(prof.nome);
        setProfessoresEncontrados([]);
    }

    // Buscar Alunos
    useEffect(() => {
        if (buscaAluno.length > 0) { // Permitir busca com apenas 1 caractere para teste fácil
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
            const response = await fetch(`http://localhost:8080/api/alunos?nome=${nome}`);
            if (response.ok) {
                const data = await response.json();
                setAlunosEncontrados(data);
                return;
            }
            throw new Error("Failed to fetch");
        } catch (error) {
            console.log("Backend offline, using mock data for students");
            const filtered = mockAlunos.filter(a => a.nome.toLowerCase().includes(nome.toLowerCase()));
            setAlunosEncontrados(filtered);
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

    function handleSave() {
        const newTurma = {
            id: Math.floor(Math.random() * 1000) + 10,
            name: nomeTurma,
            students: alunosSelecionados.length,
            teacher: professorSelecionado?.nome || "Sem Professor",
            schedule: turno === 'manha' ? "Segunda a Sexta - 07:30 às 11:00" : "Segunda a Sexta - 13:30 às 17:00",
            turno: formatTurno(turno),
            status: "Ativa",
            ano,
            alunos: alunosSelecionados
        };

        if (onSave) {
            onSave(newTurma);
        }
        onClose();

        // Resetar formulário
        setTipo("");
        setAno("2025");
        setTurno("");
        setProfessorSelecionado(null);
        setBuscaProfessor("");
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
                                <SelectItem value="alfabetizacao">Alfabetização</SelectItem>
                                <SelectItem value="estimulacao">Estimulação</SelectItem>
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
                                    <SelectItem value="manha">Manhã</SelectItem>
                                    <SelectItem value="tarde">Tarde</SelectItem>
                                    <SelectItem value="integral">Integral</SelectItem>
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

                    <div className="space-y-2">
                        <Label className="text-[#0D4F97]">Alunos</Label>
                        <p className="text-sm font-medium text-[#0D4F97]">Buscar Aluno (Nome)</p>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <Input
                                placeholder="Buscar aluno por nome..."
                                className="pl-10 bg-white border-[#B2D7EC]"
                                value={buscaAluno}
                                onChange={(e) => setBuscaAluno(e.target.value)}
                            />
                        </div>

                        {/* Resultados da Busca */}
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

                        {/* Alunos Selecionados */}
                        {alunosSelecionados.length > 0 && (
                            <div className="mt-4 space-y-2">
                                <Label className="text-xs font-semibold text-gray-500 uppercase">Alunos Selecionados ({alunosSelecionados.length})</Label>
                                <div className="border border-[#B2D7EC] rounded-lg p-2 max-h-40 overflow-y-auto space-y-2">
                                    {alunosSelecionados.map(aluno => (
                                        <div key={aluno.id} className="flex justify-between items-center bg-gray-50 p-2 rounded border border-gray-100">
                                            <span className="text-sm font-medium text-[#222222]">{aluno.nome}</span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => removerAluno(aluno.id)}
                                            >
                                                <X size={14} />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
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
