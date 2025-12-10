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

interface NovaTurmaModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function NovaTurmaModal({ isOpen, onClose }: NovaTurmaModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-[#0D4F97] text-xl">Nova Turma</DialogTitle>
                    <p className="text-gray-500 text-sm">
                        Cadastre uma nova turma no sistema
                    </p>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label className="text-[#0D4F97]">Tipo de Turma *</Label>
                        <Select>
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
                            <Select>
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
                        <Input placeholder="Nome da turma será gerado aqui..." disabled className="bg-gray-50" />
                        <p className="text-xs text-[#0D4F97]">
                            Este campo é gerado automaticamente a partir do Tipo, Ano e Turno selecionados.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[#0D4F97]">Horário *</Label>
                        <Input placeholder="Ex: Segunda a Sexta - 08:00 às 12:00" />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[#0D4F97]">Professores *</Label>
                        <p className="text-sm font-medium text-[#0D4F97]">Buscar Professor</p>
                        <Input placeholder="Digite o nome do professor..." />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[#0D4F97]">Alunos (Opcional)</Label>
                        <p className="text-sm font-medium text-[#0D4F97]">Buscar Aluno (Nome ou Matrícula)</p>
                        <Input placeholder="Digite o nome ou matrícula do aluno..." />
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button className="bg-[#0D4F97] hover:bg-[#0B3E78] text-white">
                        Salvar Turma
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
