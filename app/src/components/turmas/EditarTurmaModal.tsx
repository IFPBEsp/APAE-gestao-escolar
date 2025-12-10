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
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface EditarTurmaModalProps {
    isOpen: boolean;
    onClose: () => void;
    turmaData?: any; // Em um caso real, tipar corretamente
}

export function EditarTurmaModal({ isOpen, onClose, turmaData }: EditarTurmaModalProps) {
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
                            <Label className="text-[#0D4F97]">Tipo de Turma *</Label>
                            <Select defaultValue="alfabetizacao">
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o tipo de turma" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="alfabetizacao">Alfabetização</SelectItem>
                                    <SelectItem value="estimulacao">Estimulação</SelectItem>
                                    <SelectItem value="matematica">Matemática Básica</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[#0D4F97]">Ano de Criação *</Label>
                                <Select defaultValue="2025">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o ano" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="2024">2024</SelectItem>
                                        <SelectItem value="2025">2025</SelectItem>
                                        <SelectItem value="2026">2026</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[#0D4F97]">Turno *</Label>
                                <Select defaultValue="manha">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o turno" />
                                    </SelectTrigger>
                                    <SelectContent>
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
                                defaultValue="Alfabetização 2025 - 2025 - Manhã"
                                disabled
                                className="bg-gray-50"
                            />
                            <p className="text-xs text-[#0D4F97]">
                                Este campo é gerado automaticamente a partir do Tipo, Ano e Turno selecionados.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[#0D4F97]">Horário *</Label>
                            <Input defaultValue="Segunda a Sexta - 08:00 às 12:00" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-[#0D4F97] font-medium border-b border-[#B2D7EC] pb-2 flex items-center gap-2">
                            Alterar Professor Responsável *
                        </h3>
                        <div className="bg-[#E8F3FF] p-4 rounded-lg border border-[#B2D7EC]">
                            <Label className="text-[#0D4F97] mb-1 block">Professor Atual:</Label>
                            <div className="flex items-center gap-2 text-[#0D4F97] font-medium">
                                <span>Prof. Maria Silva</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[#0D4F97]">Buscar Novo Professor</Label>
                            <Input placeholder="Digite o nome do professor..." />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-[#0D4F97] font-medium border-b border-[#B2D7EC] pb-2">Gerenciar Alunos na Turma</h3>

                        <div className="space-y-2">
                            <Label className="text-[#0D4F97]">Adicionar Aluno (Nome ou Matrícula)</Label>
                            <Input placeholder="Digite o nome ou matrícula do aluno..." />
                        </div>

                        <div className="border border-[#B2D7EC] rounded-lg p-4">
                            <Label className="text-[#0D4F97] mb-2 block">Alunos na Turma (8)</Label>
                            <div className="max-h-40 overflow-y-auto space-y-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex justify-between items-center bg-gray-50 p-2 rounded border border-gray-100">
                                        <div>
                                            <p className="text-sm font-medium text-[#222222]">Ana Silva</p>
                                            <p className="text-xs text-gray-500">Matrícula: 202500{i}</p>
                                        </div>
                                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                            X
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-[#E5E5E5]">
                    <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                        Inativar Turma
                    </Button>

                    <div className="flex gap-3">
                        <Button variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button className="bg-[#0D4F97] hover:bg-[#0B3E78] text-white">
                            Salvar Turma
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
