'use client';

import { ArrowLeft, Clock, Calendar, Users, Briefcase, Edit, Power } from "lucide-react";
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
import { useEffect, useState } from "react";
import {
    buscarTurmaPorId,
    desativarTurma,
    ativarTurma,
} from "@/services/TurmaService";
import { toast } from "sonner";

interface DetalhesTurmaProps {
    turmaId: number;
    onBack: () => void;
    onNavigate: (screen: string, turmaId?: number) => void;
    onEdit: () => void;
    onInactivate?: () => void;
}

export function DetalhesTurma({
    turmaId,
    onBack,
    onNavigate,
    onEdit,
    onInactivate
}: DetalhesTurmaProps) {

    const [turma, setTurma] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        async function carregarTurma() {
            try {
              setLoading(true);

              const data = await buscarTurmaPorId(turmaId);
              setTurma(data);

            } catch (error: any) {
              toast.error(error.message || "Erro ao carregar turma");
            } finally {
              setLoading(false);
            }
          }

        carregarTurma();
    }, [turmaId]);

    async function handleToggleTurma() {
        try {
            if (turma.isAtiva) {
                await desativarTurma(turmaId);
                toast.success("Turma inativada com sucesso");
            } else {
                await ativarTurma(turmaId);
                toast.success("Turma reativada com sucesso");
            }

            setTurma((prev: any) => ({
                ...prev,
                isAtiva: !prev.isAtiva
            }));

            if (onInactivate) {
                onInactivate();
            }
        } catch (error: any) {
            toast.error(error.message || "Erro ao alterar status da turma");
        }
    }

    if (loading) {
        return <div className="text-gray-500">Carregando dados da turma...</div>;
    }

    if (!turma) {
        return <div>Turma não encontrada.</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <Button
                    variant="outline"
                    onClick={onBack}
                    className="gap-2 mb-4"
                >
                    <ArrowLeft size={18} />
                    Voltar
                </Button>

                <h1 className="text-2xl font-bold text-[#0D4F97]">Detalhes da Turma</h1>
                <p className="text-gray-500">Visualize e gerencie as informações da turma</p>
            </div>

            <Card className="border border-[#E2E8F0] shadow-sm rounded-xl overflow-hidden">
                <CardContent className="p-8 space-y-8">

                    {/* Cabeçalho */}
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-[#E8F3FF] rounded-full flex items-center justify-center text-[#0D4F97]">
                                    <Users size={20} />
                                </div>
                                <h2 className="text-xl font-semibold text-[#0D4F97]">
                                    {turma.nome || turma.name}
                                </h2>
                            </div>
                            <div className="pl-[52px]">
                                <span
                                    className={`text-xs px-2 py-0.5 rounded-full font-medium
                                    ${turma.isAtiva
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-100 text-gray-700"
                                        }`}
                                >
                                    {turma.isAtiva ? "Ativa" : "Inativa"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Informações */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">

                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-[#E8F3FF] rounded-md text-[#0D4F97]">
                                <Briefcase size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">
                                    Professor Responsável
                                </p>
                                <p className="text-[#0D4F97] font-medium">
                                    {turma.professorNome || "Não informado"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-[#E8F3FF] rounded-md text-[#0D4F97]">
                                <Calendar size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">
                                    Ano de Criação
                                </p>
                                <p className="text-[#0D4F97] font-medium">
                                    {turma.anoCriacao}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-[#E8F3FF] rounded-md text-[#0D4F97]">
                                <Clock size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">
                                    Turno
                                </p>
                                <p className="text-[#0D4F97] font-medium">
                                    {turma.turno}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-[#E8F3FF] rounded-md text-[#0D4F97]">
                                <Users size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">
                                    Quantidade de Alunos
                                </p>
                                <p className="text-[#0D4F97] font-medium">
                                    {turma.totalAlunosAtivos} ativos de {turma.totalAlunos}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Ações */}
                    <div className="pt-6 border-t border-gray-100 flex gap-4">
                        <Button
                            onClick={onEdit}
                            variant="primary"
                            className="flex-1"
                        >
                            <Edit className="mr-2 h-5 w-5" />
                            Editar Turma
                        </Button>

                        <Button
                            variant={turma.isAtiva ? "danger" : "primary"}
                            className="flex-1"
                            onClick={() => setIsDialogOpen(true)}
                        >
                            <Power className="mr-2 h-5 w-5"  />
                            {turma.isAtiva ? "Inativar Turma" : "Reativar Turma"}
                        </Button>
                    </div>

                    {/* Dialog */}
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogContent className="max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>
                                    {turma.isAtiva ? "Inativar Turma?" : "Reativar Turma?"}
                                </DialogTitle>
                                <DialogDescription>
                                    {turma.isAtiva
                                        ? "Ao inativar esta turma, ela não aparecerá mais nas listagens ativas."
                                        : "Ao reativar esta turma, ela voltará a aparecer nas listagens ativas."
                                    }
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsDialogOpen(false)}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    variant={turma.isAtiva ? "danger" : "primary"}
                                    onClick={() => {
                                        handleToggleTurma();
                                        setIsDialogOpen(false);
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