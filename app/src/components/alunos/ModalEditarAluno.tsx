"use client";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BookOpen, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { atualizarTurmaAluno } from "@/services/AlunoService"; 
import { listarTodasTurmas } from "@/services/TurmaService"; 

interface TurmaDTO {
    id: number;
    nome: string; 
    turno: string; 
}

interface AlunoModalProps {
    id: number;
    nome: string;
    nomeTurmaAtual: string | null; 
    turnoTurmaAtual: string | null; 
    turmaIdAtiva: number | null | undefined; 
}

interface ModalEditarAlunoProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (alunoAtualizado: any) => void; 
    aluno: AlunoModalProps | null; 
}

export default function ModalEditarAluno({ isOpen, onClose, onSave, aluno }: ModalEditarAlunoProps) {
    
    const [turmasDisponiveis, setTurmasDisponiveis] = useState<TurmaDTO[]>([]);
    const [loadingTurmas, setLoadingTurmas] = useState(true);

    const [turmaId, setTurmaId] = useState(aluno?.turmaIdAtiva?.toString() ?? "");
    
    useEffect(() => {
        if (aluno && aluno.turmaIdAtiva !== undefined) {
            setTurmaId(aluno.turmaIdAtiva?.toString() ?? "");
        }
    }, [aluno]);

    useEffect(() => {
        const fetchTurmas = async () => {
            setLoadingTurmas(true);
            try {
                const data = await listarTodasTurmas();
                setTurmasDisponiveis(data);
            } catch (error) {
                toast.error("Erro ao carregar lista de turmas.");
                console.error("Erro ao buscar turmas:", error);
            } finally {
                setLoadingTurmas(false);
            }
        };

        if (isOpen) {
            fetchTurmas();
        }
    }, [isOpen]);


    if (!aluno) {
        return null;
    }

    const handleSalvar = async () => {
        if (!turmaId) {
            toast.error("Selecione uma turma!");
            return;
        }

        const novaTurmaId = parseInt(turmaId);
        
        if (aluno.turmaIdAtiva === novaTurmaId) {
            toast.info("A turma selecionada é a mesma que a atual.");
            onClose();
            return;
        }

        try {
            const alunoAtualizado = await atualizarTurmaAluno(aluno.id, novaTurmaId);
            
            onSave(alunoAtualizado); 
            toast.success(`Turma alterada para ${alunoAtualizado.nomeTurmaAtual} com sucesso!`);
            onClose();

        } catch (error) {
            toast.error("Falha ao atualizar a turma do aluno. Verifique o console.");
            console.error(error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto rounded-xl border-2 border-[#B2D7EC]">
                <DialogHeader>
                    <DialogTitle className="text-[#0D4F97]">Editar Informações Acadêmicas</DialogTitle>
                    <DialogDescription className="text-[#222222]">
                        Atualize a turma do aluno {aluno.nome}.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Informações Acadêmicas */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-[#0D4F97]" />
                            <h3 className="text-[#0D4F97]">Informações Acadêmicas</h3>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="turma" className="text-[#0D4F97] font-medium">
                                Turma Atual <span className="text-red-500">*</span>
                            </label>
                            
                            {loadingTurmas ? (
                                <div className="flex h-12 items-center justify-center border-2 border-[#B2D7EC] rounded-md">
                                    <Loader2 className="h-4 w-4 animate-spin text-[#0D4F97]" />
                                    <span className="ml-2 text-sm text-[#0D4F97]">Carregando turmas...</span>
                                </div>
                            ) : (
                                <Select value={turmaId} onValueChange={setTurmaId}>
                                    <SelectTrigger className="h-12 border-2 border-[#B2D7EC] focus:border-[#0D4F97] focus:ring-[#0D4F97] cursor-pointer">
                                        <SelectValue placeholder="Selecione uma turma" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white">
                                        {turmasDisponiveis.map((turma) => (
                                            <SelectItem key={turma.id} value={turma.id.toString()} className="cursor-pointer">
                                                {turma.nome} - {turma.turno}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}

                            <p className="text-sm text-[#666666]">
                                Selecione a turma em que o aluno está matriculado atualmente
                            </p>
                        </div>
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex flex-col gap-3 border-t-2 border-[#B2D7EC] pt-6 md:flex-row md:justify-end">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="h-12 justify-center border-2 border-[#B2D7EC] px-8 text-[#0D4F97] hover:bg-[#B2D7EC]/20"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSalvar}
                            disabled={loadingTurmas}
                            className="h-12 justify-center bg-[#0D4F97] px-8 text-white hover:bg-[#FFD000] hover:text-[#0D4F97] disabled:opacity-50"
                        >
                            Salvar Alterações
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
