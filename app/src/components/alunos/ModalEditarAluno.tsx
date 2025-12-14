import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ModalEditarAlunoProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (alunoAtualizado: any) => void;
    aluno: {
        id: number;
        nome: string;
        turmaAtual: string;
        turmaId: number;
    };
}

// Dados simulados para turmas disponíveis
const mockTurmasDisponiveis = [
    { id: 1, nome: "Alfabetização 2025 - Manhã" },
    { id: 2, nome: "Alfabetização 2025 - Tarde" },
    { id: 3, nome: "Estimulação 2025 - Manhã" },
    { id: 4, nome: "Estimulação 2025 - Tarde" },

];

export default function ModalEditarAluno({ isOpen, onClose, onSave, aluno }: ModalEditarAlunoProps) {
    // Estado para a turma
    const [turmaId, setTurmaId] = useState(aluno.turmaId.toString());

    const handleSalvar = () => {
        // Validação
        if (!turmaId) {
            toast.error("Selecione uma turma!");
            return;
        }

        // Preparar objeto atualizado
        const alunoAtualizado = {
            ...aluno,
            turmaId: parseInt(turmaId),
            turmaAtual: mockTurmasDisponiveis.find(t => t.id === parseInt(turmaId))?.nome || ""
        };

        onSave(alunoAtualizado);
        toast.success("Turma atualizada com sucesso!");
        onClose();
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
                            <Select value={turmaId} onValueChange={setTurmaId}>
                                <SelectTrigger className="h-12 border-2 border-[#B2D7EC] focus:border-[#0D4F97] focus:ring-[#0D4F97] cursor-pointer">
                                    <SelectValue placeholder="Selecione uma turma" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    {mockTurmasDisponiveis.map((turma) => (
                                        <SelectItem key={turma.id} value={turma.id.toString()} className="cursor-pointer">
                                            {turma.nome}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                            className="h-12 justify-center bg-[#0D4F97] px-8 text-white hover:bg-[#FFD000] hover:text-[#0D4F97]"
                        >
                            Salvar Alterações
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
