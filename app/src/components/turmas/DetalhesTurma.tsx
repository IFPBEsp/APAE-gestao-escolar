import { ArrowLeft, Clock, Calendar, Users, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { useState } from "react";

interface DetalhesTurmaProps {
    turmaId?: number;
    turmaData?: any;
    onBack: () => void;
    onNavigate: (screen: string, turmaId?: number) => void;
    onEdit: () => void;
    onInactivate: () => void;
}

export function DetalhesTurma({ turmaId, turmaData, onBack, onNavigate, onEdit, onInactivate }: DetalhesTurmaProps) {
    const turma = turmaData;
    const [isInativarDialogOpen, setIsInativarDialogOpen] = useState(false);

    if (!turma) {
        return <div>Turma não encontrada.</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <Button
                    variant="ghost"
                    onClick={onBack}
                    className="text-[#0D4F97] hover:bg-[#E8F3FF] pl-0 gap-2 mb-4"
                >
                    <ArrowLeft size={20} />
                    Voltar
                </Button>

                <h1 className="text-2xl font-bold text-[#0D4F97]">Detalhes da Turma</h1>
                <p className="text-gray-500">Visualize e gerencie as informações da turma</p>
            </div>

            <Card className="border border-[#E2E8F0] shadow-sm rounded-xl overflow-hidden">
                <CardContent className="p-8 space-y-8">
                    {/* Seção de Cabeçalho */}
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-[#E8F3FF] rounded-full flex items-center justify-center text-[#0D4F97]">
                                    <Users size={20} />
                                </div>
                                <h2 className="text-xl font-semibold text-[#0D4F97]">{turma.name}</h2>
                            </div>
                            <div className="pl-[52px]">
                                <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">
                                    {turma.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-[#E8F3FF] rounded-md text-[#0D4F97]">
                                <Briefcase size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Professor Responsável</p>
                                <p className="text-[#0D4F97] font-medium">{turma.teacher}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-[#E8F3FF] rounded-md text-[#0D4F97]">
                                <Calendar size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Ano de Criação</p>
                                <p className="text-[#0D4F97] font-medium">{turma.ano}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-[#E8F3FF] rounded-md text-[#0D4F97]">
                                <Clock size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Turno</p>
                                <p className="text-[#0D4F97] font-medium">{turma.turno}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-[#E8F3FF] rounded-md text-[#0D4F97]">
                                <Clock size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Horário</p>
                                <p className="text-[#0D4F97] font-medium">{turma.schedule}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-[#E8F3FF] rounded-md text-[#0D4F97]">
                                <Users size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Quantidade de Alunos</p>
                                <p className="text-[#0D4F97] font-medium">{turma.students || turma.studentsCount || 0}</p>
                            </div>
                        </div>
                    </div>

                    {/* Lista de Alunos removida conforme solicitação */}

                    <div className="pt-6 border-t border-gray-100 flex gap-4">
                        <Button
                            onClick={onEdit}
                            className="flex-1 bg-[#0D4F97] hover:bg-[#0B3E78] text-white flex items-center justify-center gap-2"
                        >
                            <Briefcase size={16} /> {/* Usando Briefcase como ícone de edição genérico se necessário */}
                            Editar Turma
                        </Button>
                        <Button
                            variant="outline"
                            className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center justify-center gap-2"
                            onClick={() => setIsInativarDialogOpen(true)}
                        >
                            <Users size={16} /> {/* Ícone de placeholder */}
                            Inativar Turma
                        </Button>
                    </div>

                    <Dialog open={isInativarDialogOpen} onOpenChange={setIsInativarDialogOpen}>
                        <DialogContent className="max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Inativar Turma?</DialogTitle>
                                <DialogDescription>
                                    Ao inativar esta turma, ela não aparecerá mais nas listagens ativas. Você poderá reativá-la posteriormente.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsInativarDialogOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                    onClick={() => {
                                        onInactivate();
                                        setIsInativarDialogOpen(false);
                                    }}
                                >
                                    Confirmar
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                </CardContent>
            </Card>
        </div>
    );
}
