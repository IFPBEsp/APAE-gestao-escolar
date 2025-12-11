"use client";

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

interface EditarTurmaModalProps {
    isOpen: boolean;
    onClose: () => void;
    turmaData?: any; // Em um caso real, tipar corretamente
    onSave?: (turma: any) => void;
}

export function EditarTurmaModal({ isOpen, onClose, turmaData, onSave }: EditarTurmaModalProps) {
    const [buscaAluno, setBuscaAluno] = useState("");
    const [alunosEncontrados, setAlunosEncontrados] = useState<Aluno[]>([]);
    const [alunosNaTurma, setAlunosNaTurma] = useState<Aluno[]>([]);

    // Estados do Professor
    const [buscaProfessor, setBuscaProfessor] = useState("");
    const [professoresEncontrados, setProfessoresEncontrados] = useState<Professor[]>([]);
    const [professorAtual, setProfessorAtual] = useState<string>("");

    useEffect(() => {
        if (turmaData) {
            setProfessorAtual(turmaData.teacher);
            // Em uma app real, popular alunosNaTurma da lista turmaData.students
            // Por enquanto iniciamos vazio ou mock
            setBuscaProfessor("");
        }
    }, [turmaData, isOpen]);

    // Dados Mock para Fallback
    const mockProfessores: Professor[] = [
        { id: 91, nome: "Prof. Maria Silva" },
        { id: 92, nome: "Prof. João Santos" },
        { id: 93, nome: "Prof. Ana Costa" },
        { id: 94, nome: "Prof. Carlos Lima" }
    ];

    const mockAlunos: Aluno[] = [
        { id: 101, nome: "Ana Silva" },
        { id: 102, nome: "Beatriz Costa" },
        { id: 103, nome: "Carlos Oliveira" },
        { id: 104, nome: "Daniela Souza" },
        { id: 105, nome: "Eduardo Lima" },
    ];

    // Buscar Alunos
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

    // Buscar Professores
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

    function selecionarNovoProfessor(prof: Professor) {
        setProfessorAtual(prof.nome);
        setBuscaProfessor("");
        setProfessoresEncontrados([]);
    }

    function handleSave() {
        if (!turmaData || !onSave) return;

        const updated = {
            ...turmaData,
            teacher: professorAtual,
            studentsCount: (turmaData.studentsCount || 0) + alunosNaTurma.length
        };
        onSave(updated);
        onClose();
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

                        <div className="space-y-2">
                            <Label className="text-[#0D4F97]">Nome da Turma</Label>
                            <Input
                                defaultValue={turmaData.name}
                                disabled
                                className="bg-gray-50 border-[#B2D7EC]"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-[#0D4F97] font-medium border-b border-[#B2D7EC] pb-2 flex items-center gap-2">
                            Alterar Professor Responsável *
                        </h3>
                        <div className="bg-[#E8F3FF] p-4 rounded-lg border border-[#B2D7EC]">
                            <Label className="text-[#0D4F97] mb-1 block">Professor Atual:</Label>
                            <div className="flex items-center gap-2 text-[#0D4F97] font-medium">
                                <span>{professorAtual}</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[#0D4F97]">Buscar Novo Professor</Label>
                            <div className="relative">
                                <Input
                                    placeholder="Digite o nome do professor..."
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

                        <div className="border border-[#B2D7EC] rounded-lg p-4">
                            <Label className="text-[#0D4F97] mb-2 block">Novos Alunos Adicionados ({alunosNaTurma.length})</Label>
                            <div className="max-h-40 overflow-y-auto space-y-2">
                                {alunosNaTurma.length === 0 && <p className="text-sm text-gray-500">Nenhum aluno adicionado nesta sessão.</p>}
                                {alunosNaTurma.map(aluno => (
                                    <div key={aluno.id} className="flex justify-between items-center bg-gray-50 p-2 rounded border border-gray-100">
                                        <div>
                                            <p className="text-sm font-medium text-[#222222]">{aluno.nome}</p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-0 w-6 h-6"
                                            onClick={() => removerAluno(aluno.id)}
                                        >
                                            <X size={14} />
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
                    >
                        Salvar Alterações
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
