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
    turmaData?: any;
    onBack: () => void;
    onNavigate: (screen: string, turmaId?: number) => void;
    onEdit: () => void;
    onInactivate?: (turmaAtualizada?: any) => void;
}

export function DetalhesTurma({
    turmaId,
    turmaData,
    onBack,
    onNavigate,
    onEdit,
    onInactivate
}: DetalhesTurmaProps) {

    const router = useRouter();

    const [turma, setTurma] = useState<any>(turmaData || null);
    const [alunosFrequencia, setAlunosFrequencia] = useState<any[]>([]);
    const [estatisticas, setEstatisticas] = useState<any[]>([]);
    const [totalAulasRealizadas, setTotalAulasRealizadas] = useState(0);
    const [loading, setLoading] = useState(!turmaData);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmittingToggle, setIsSubmittingToggle] = useState(false);
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

              if (turmaData) {
                setTurma(turmaData);
              } else {
                const data = await buscarTurmaPorId(turmaId);
                setTurma(data);
              }

              const [
                alunosFrequenciaResult,
                estatisticasResult,
                totalAulasResult,
              ] = await Promise.allSettled([
                getAlunosComFrequencia(turmaId),
                getEstatisticasTurma(turmaId),
                contarAulasRealizadas(turmaId)
              ]);

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
    }, [turmaId, turmaData]);

    async function handleToggleTurma() {
        try {
            setIsSubmittingToggle(true);
            if (turma.isAtiva) {
                await desativarTurma(turmaId);
                toast.success("Turma inativada com sucesso");
            } else {
                await ativarTurma(turmaId);
                toast.success("Turma reativada com sucesso");
            }

            const turmaAtualizada = await buscarTurmaPorId(turmaId);
            setTurma(turmaAtualizada);

            if (onInactivate) {
                onInactivate(turmaAtualizada);
            }
            
            setIsDialogOpen(false);
        } catch (error: any) {
            toast.error(error.message || "Erro ao alterar status da turma");
        } finally {
            setIsSubmittingToggle(false);
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
        <div className="w-full min-h-screen bg-[#E5E5E5]">
            <div className="p-4 md:p-8 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-[#0D4F97] mb-2">
                            Detalhes da Turma
                        </h1>
                        <p className="text-[#222222]">
                            Visualize e gerencie as informações da turma
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={onBack}
                    >
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        Voltar
                    </Button>
                </div>

                {/* CARD PRINCIPAL ÚNICO */}
                <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
                    <CardContent className="p-8">

                        {/* Nome da Turma e Status */}
                        <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-4">
                            <div className="flex items-center gap-3 w-full">
                                <div className="h-10 w-10 bg-[#E8F3FF] rounded-full flex items-center justify-center text-[#0D4F97] shrink-0 ">
                                    <Users className="h-6 w-6 text-[#0D4F97]"/>
                                </div>
                                <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3 flex-1 min-w-0">
                                    <h2 className="text-2xl font-bold text-[#0D4F97] truncate">
                                        {turma.nome || turma.name}
                                    </h2>
                                    <span
                                        className={`inline-block rounded-full px-3 py-1 font-medium text-xs lg:text-sm w-fit
                                        ${turma.isAtiva
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {turma.isAtiva ? "Ativa" : "Inativa"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Grid de Informações */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-6 gap-x-8 mt-6 md:mt-10">
                            {/* Professor Responsável */}
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-[#E8F3FF] rounded-md text-[#0D4F97]">
                                    <Briefcase className="h-5 w-5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-gray-500 mb-1 truncate">
                                        Professor Responsável
                                    </p>
                                    <p className="text-[#0D4F97] font-medium break-words">
                                        {turma.professorNome || "—"}
                                    </p>
                                </div>
                            </div>

                            {/* Ano de Criação */}
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-[#E8F3FF] rounded-md text-[#0D4F97]">
                                    <Calendar className="h-5 w-5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-gray-500 mb-1 truncate">
                                        Ano de Criação
                                    </p>
                                    <p className="text-[#0D4F97] font-medium break-words">
                                        {turma.anoCriacao || "—"}
                                    </p>
                                </div>
                            </div>

                            {/* Turno */}
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-[#E8F3FF] rounded-md text-[#0D4F97]">
                                    <Clock className="h-5 w-5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-gray-500 mb-1 truncate">
                                        Turno
                                    </p>
                                    <p className="text-[#0D4F97] font-medium break-words">
                                        {turma.turno || "—"}
                                    </p>
                                </div>
                            </div>

                            {/* Quantidade de Alunos */}
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-[#E8F3FF] rounded-md text-[#0D4F97]">
                                    <Users className="h-5 w-5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-gray-500 mb-1 truncate">
                                        Quantidade de Alunos
                                    </p>
                                    <p className="text-[#0D4F97] font-medium break-words">
                                        {turma.totalAlunosAtivos || 0} ativos de {turma.totalAlunos || 0}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* HISTÓRICO DE FREQUÊNCIA */}
                        <div className="mt-10 border-t border-[#E2E8F0] pt-8">
                            <h2 className="text-xl font-bold text-[#0D4F97] mb-2">Histórico de Frequência</h2>
                            <p className="text-gray-500 mb-6">Estatísticas e registros de presença da turma</p>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mt-4 sm:mt-6">
                                <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
                                    <CardContent className="p-4 sm:p-6 pt-8 sm:pt-12 text-center flex flex-col items-center justify-start h-full">
                                        <p className="text-[#0D4F97] text-2xl font-bold">{mediaFrequencia}%</p>
                                        <p className="text-[#222222] text-sm mt-1">
                                            Frequência média anual da turma
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="rounded-xl border-2 border-orange-200 shadow-md">
                                    <CardContent className="p-4 sm:p-6 pt-8 sm:pt-12 text-center flex flex-col items-center justify-start h-full">
                                        <p className="text-orange-600 text-2xl font-bold">
                                            {alunosEmAlerta} Alunos
                                        </p>
                                        <p className="text-[#222222] text-sm mt-1">
                                            Com frequência abaixo de 75%
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
                                    <CardContent className="p-4 sm:p-6 pt-8 sm:pt-12 text-center flex flex-col items-center justify-start h-full">
                                        <p className="text-[#0D4F97] text-2xl font-bold">
                                            {aulasRegistradas} / {totalDiasLetivos}
                                        </p>
                                        <p className="text-[#222222] text-sm mt-1">
                                            {aulasRegistradas} chamadas de {totalDiasLetivos} dias letivos
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="space-y-4 mt-8">
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

                            <div className="overflow-x-auto w-full rounded-lg border-2 border-[#B2D7EC] mt-8">
                                <Table className="min-w-[400px]">
                                    <TableHeader>
                                        <TableRow className="bg-[#B2D7EC]/20 hover:bg-[#B2D7EC]/20">
                                            <TableHead className="text-[#0D4F97] font-semibold pl-4 sm:pl-6">
                                                Nome do Aluno
                                            </TableHead>
                                            <TableHead className="text-[#0D4F97] font-semibold pl-4 sm:pl-6 text-center">
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
                                                        <TableCell className="font-medium text-[#222222] pl-4 sm:pl-6">
                                                            <div className="flex items-center gap-2">
                                                                {isAlert && (
                                                                    <AlertTriangle className="h-4 w-4 text-orange-600 flex-shrink-0" />
                                                                )}
                                                                <span className="truncate max-w-[120px] sm:max-w-[200px] md:max-w-none text-[#0D4F97]">
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
                        </div>

                        {/* Botões de Ação */}
                        <div className="mt-8 flex flex-col gap-3 border-t border-[#E2E8F0] pt-6 md:flex-row">
                            <Button
                                variant="primary"
                                onClick={onEdit}
                                className="w-full flex-1"
                            >
                                <Edit className="mr-2 h-5 w-5" />
                                Editar Turma
                            </Button>

                            <Button
                                variant={turma.isAtiva ? "danger" : "primary"}
                                className={`w-full flex-1 ${!turma.isAtiva ? "bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700" : ""}`}
                                onClick={() => setIsDialogOpen(true)}
                            >
                                <Power className="mr-2 h-5 w-5" />
                                {turma.isAtiva ? "Inativar Turma" : "Reativar Turma"}
                            </Button>
                        </div>

                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogContent className="max-w-[95vw] sm:max-w-[425px] w-full">
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
                                        disabled={isSubmittingToggle}
                                        onClick={() => setIsDialogOpen(false)}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        variant={turma.isAtiva ? "danger" : "primary"}
                                        className={!turma.isAtiva ? "bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700" : ""}
                                        disabled={isSubmittingToggle}
                                        onClick={handleToggleTurma}
                                    >
                                        {isSubmittingToggle ? "Processando..." : "Confirmar"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Dialog open={isHistoricoOpen} onOpenChange={setIsHistoricoOpen}>
                            <DialogContent className="max-w-[95vw] sm:max-w-xl w-full">
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
                                    <Button variant="outline" 
                                    onClick={() => setIsHistoricoOpen(false)}
                                    >
                                        Fechar
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default DetalhesTurma;