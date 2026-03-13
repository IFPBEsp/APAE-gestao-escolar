'use client';

import { ArrowLeft, Clock, Calendar, Users, Briefcase, Edit, Power, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { useEffect, useRef, useState } from "react";
import {
    buscarTurmaPorId,
    desativarTurma,
    ativarTurma,
} from "@/services/TurmaService";
import { getAlunosComFrequencia } from "@/services/FrequenciaService";
import { getEstatisticasTurma, contarAulasRealizadas, getHistoricoAluno } from "@/services/ChamadaService";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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

    const router = useRouter();

    const [turma, setTurma] = useState<any>(null);
    const [alunosFrequencia, setAlunosFrequencia] = useState<any[]>([]);
    const [estatisticas, setEstatisticas] = useState<any[]>([]);
    const [totalAulasRealizadas, setTotalAulasRealizadas] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isHistoricoOpen, setIsHistoricoOpen] = useState(false);
    const [historicoAluno, setHistoricoAluno] = useState<any[]>([]);
    const [alunoSelecionado, setAlunoSelecionado] = useState<any | null>(null);
    const [loadingHistorico, setLoadingHistorico] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAlertsOnly, setShowAlertsOnly] = useState(false);
    const historicoRequestIdRef = useRef(0);

    useEffect(() => {
        async function carregarTurma() {
            try {
              setLoading(true);

              const [turmaData] = await Promise.all([
                buscarTurmaPorId(turmaId)
              ]);

              const [
                alunosFrequenciaResult,
                estatisticasResult,
                totalAulasResult,
              ] = await Promise.allSettled([
                getAlunosComFrequencia(turmaId),
                getEstatisticasTurma(turmaId),
                contarAulasRealizadas(turmaId)
              ]);

              setTurma(turmaData);
              setAlunosFrequencia(
                alunosFrequenciaResult.status === "fulfilled" ? alunosFrequenciaResult.value || [] : []
              );
              setEstatisticas(
                estatisticasResult.status === "fulfilled" && Array.isArray(estatisticasResult.value)
                  ? estatisticasResult.value
                  : []
              );
              setTotalAulasRealizadas(
                totalAulasResult.status === "fulfilled" ? totalAulasResult.value || 0 : 0
              );

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

    async function handleAbrirHistoricoAluno(aluno: any) {
        if (!aluno?.id) {
            toast.error("Erro: Identificador do aluno não encontrado.");
            return;
        }

        const currentRequestId = ++historicoRequestIdRef.current;

        try {
            setAlunoSelecionado(aluno);
            setIsHistoricoOpen(true);
            setLoadingHistorico(true);
            setHistoricoAluno([]);

            const historico = await getHistoricoAluno(turmaId, aluno.id);

            if (historicoRequestIdRef.current === currentRequestId) {
                setHistoricoAluno(historico);
            }
        } catch (error: any) {
            console.error("Erro ao carregar histórico do aluno:", error);
            toast.error(error.message || "Erro ao carregar histórico do aluno.");
        } finally {
            if (historicoRequestIdRef.current === currentRequestId) {
                setLoadingHistorico(false);
            }
        }
    }

    if (loading) {
        return <div className="text-gray-500">Carregando dados da turma...</div>;
    }

    if (!turma) {
        return <div>Turma não encontrada.</div>;
    }

    const alunosComFrequencia = alunosFrequencia.map((aluno) => {
        const stat = estatisticas.find(
            (s: any) => String(s.alunoId) === String(aluno.id)
        );

        return {
            ...aluno,
            frequencia: stat?.frequencia || aluno.frequencia || aluno.percentualFrequencia || 0,
            totalAulas: stat?.totalAulas || aluno.totalAulas || 0,
            totalPresencas: stat?.totalPresencas || aluno.totalPresencas || 0,
        };
    });

    const mediaFrequencia =
        alunosComFrequencia.length > 0
            ? Math.round(
                alunosComFrequencia.reduce(
                    (sum, a) => sum + (a.frequencia || 0),
                    0
                ) / alunosComFrequencia.length
            )
            : 0;

    const alunosEmAlerta = alunosComFrequencia.filter(
        (a) => (a.frequencia || 0) < 75
    ).length;
    const aulasRegistradas = totalAulasRealizadas;
    const totalDiasLetivos = 200;

    const filteredAlunos = alunosComFrequencia.filter((aluno) => {
        const matchSearch = aluno.nome
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        let matchAlert = true;
        if (showAlertsOnly) {
            matchAlert = (aluno.frequencia || 0) < 75;
        }
        return matchSearch && matchAlert;
    });

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
                    <div className="flex items-start justify-between pt-6">
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

            <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md bg-white">
                <CardHeader className="bg-[#F8F9FA] border-b-2 border-[#B2D7EC]">
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-[#0D4F97]">Histórico de Frequência</CardTitle>
                            <CardDescription className="text-[#222222]">
                                Estatísticas e registros de presença da turma
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mt-6">
                        <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
                            <CardContent className="p-6 pt-12 text-center flex flex-col items-center justify-start h-full">
                                <p className="text-[#0D4F97] text-2xl font-bold">{mediaFrequencia}%</p>
                                <p className="text-[#222222] text-sm mt-1">
                                    Frequência média anual da turma
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="rounded-xl border-2 border-orange-200 shadow-md">
                            <CardContent className="p-6 pt-12 text-center flex flex-col items-center justify-start h-full">
                                <p className="text-orange-600 text-2xl font-bold">
                                    {alunosEmAlerta} Alunos
                                </p>
                                <p className="text-[#222222] text-sm mt-1">
                                    Com frequência abaixo de 75%
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
                            <CardContent className="p-6 pt-12 text-center flex flex-col items-center justify-start h-full">
                                <p className="text-[#0D4F97] text-2xl font-bold">
                                    {aulasRegistradas} / {totalDiasLetivos}
                                </p>
                                <p className="text-[#222222] text-sm mt-1">
                                    {aulasRegistradas} chamadas de {totalDiasLetivos} dias letivos
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-4">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex-1">
                                <Input
                                    placeholder="Buscar por nome do aluno..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="border-2 border-[#B2D7EC]"
                                />
                            </div>
                            <button
                                onClick={() => setShowAlertsOnly(!showAlertsOnly)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all duration-200 shadow-sm hover:shadow ${showAlertsOnly
                                    ? "bg-orange-50 border-orange-200 text-orange-700 shadow-orange-200/50"
                                    : "bg-gray-100 border-gray-300 text-gray-800 hover:bg-gray-200 shadow-gray-300/50"
                                    }`}
                            >
                                <span className="text-sm font-medium">Apenas Alertas</span>
                                <div className="relative inline-flex items-center h-5 rounded-full w-10 bg-gray-200">
                                    <span
                                        className={`absolute flex items-center justify-center w-5 h-5 rounded-full transition-all duration-200 ${showAlertsOnly ? "left-5 bg-orange-500" : "left-0 bg-white"
                                            }`}
                                    >
                                        <AlertTriangle
                                            className={`h-3 w-3 ${showAlertsOnly ? "text-white" : "text-gray-400"
                                                }`}
                                        />
                                    </span>
                                </div>
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-lg border-2 border-[#B2D7EC]">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-[#B2D7EC]/20 hover:bg-[#B2D7EC]/20">
                                    <TableHead className="text-[#0D4F97] font-semibold pl-6">
                                        Nome do Aluno
                                    </TableHead>
                                    <TableHead className="text-[#0D4F97] font-semibold pl-4">
                                        Status
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredAlunos.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={2}
                                            className="text-center text-[#222222] py-8"
                                        >
                                            Nenhum aluno encontrado
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredAlunos.map((aluno) => {
                                        const frequencia = aluno.frequencia || 0;
                                        const isAlert = frequencia < 75;

                                        return (
                                            <TableRow
                                                key={aluno.id}
                                                className={`transition-all hover:bg-[#B2D7EC]/10 cursor-pointer ${isAlert ? "bg-orange-50/30" : ""
                                                    }`}
                                                onClick={() => handleAbrirHistoricoAluno(aluno)}
                                            >
                                                <TableCell className="font-medium text-[#222222] pl-6">
                                                    <div className="flex items-center gap-2">
                                                        {isAlert && (
                                                            <AlertTriangle className="h-4 w-4 text-orange-600 flex-shrink-0" />
                                                        )}
                                                        <span className="whitespace-nowrap overflow-hidden text-ellipsis underline text-[#0D4F97]">
                                                            {aluno.nome}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div
                                                        className={`font-semibold ${isAlert ? "text-orange-600" : "text-[#0D4F97]"
                                                            }`}
                                                    >
                                                        {frequencia}%
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {frequencia >= 75 ? "Presente" : "Ausente"}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <Dialog open={isHistoricoOpen} onOpenChange={setIsHistoricoOpen}>
                        <DialogContent className="max-w-xl">
                            <DialogHeader>
                                <DialogTitle>
                                    Histórico de Frequência - {alunoSelecionado?.nome || ""}
                                </DialogTitle>
                                <DialogDescription>
                                    Registros individuais de presença do aluno na turma.
                                </DialogDescription>
                            </DialogHeader>

                            {loadingHistorico ? (
                                <div className="py-6 text-center text-[#0D4F97]">
                                    Carregando histórico...
                                </div>
                            ) : historicoAluno.length === 0 ? (
                                <div className="py-6 text-center text-[#222222]">
                                    Nenhum registro de frequência encontrado para este aluno.
                                </div>
                            ) : (
                                <div className="max-h-80 overflow-y-auto mt-4 space-y-2">
                                    {historicoAluno.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between border-b border-[#E2E8F0] py-2"
                                        >
                                            <div>
                                                <p className="font-medium text-[#0D4F97]">{item.data}</p>
                                                <p className="text-sm text-[#222222]">
                                                    {item.descricao || "Sem descrição"}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${item.status === "Presente"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700"
                                                        }`}
                                                >
                                                    {item.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <DialogFooter className="mt-4">
                                <Button variant="outline" onClick={() => setIsHistoricoOpen(false)}>
                                    Fechar
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>
        </div>
    );
}