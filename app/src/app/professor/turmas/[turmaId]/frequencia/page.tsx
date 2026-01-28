'use client'

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2, Users, CalendarIcon, AlertCircle, AlertTriangle, LayoutGrid, List, User } from "lucide-react";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { format, isSameDay, isPast, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { buscarTurmaPorId, listarAlunos } from "@/services/TurmaService";
import { registrarChamada, getEstatisticasTurma, contarAulasRealizadas } from "@/services/ChamadaService";

export default function FrequenciaPage() {
    const router = useRouter();
    const params = useParams();
    const turmaId = params?.turmaId ? Number(params.turmaId) : 0;

    const [turma, setTurma] = useState<any>(null);
    const [alunos, setAlunos] = useState<any[]>([]);
    const [estatisticas, setEstatisticas] = useState<any[]>([]);
    const [totalAulas, setTotalAulas] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function carregarDados() {
            if (!turmaId) return;
            try {
                setLoading(true);
                const [turmaData, alunosData, estatisticasData, aulasCount] = await Promise.all([
                    buscarTurmaPorId(turmaId),
                    listarAlunos(turmaId),
                    getEstatisticasTurma(turmaId),
                    contarAulasRealizadas(turmaId)
                ]);
                setTurma(turmaData);
                setAlunos(alunosData);
                setEstatisticas(Array.isArray(estatisticasData) ? estatisticasData : []);
                setTotalAulas(aulasCount);
            } catch (error) {
                toast.error("Erro ao carregar dados da turma.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        carregarDados();
    }, [turmaId]);

    const handleNovaChamada = () => {
        const chamadaSection = document.getElementById('secao-chamada');
        if (chamadaSection) {
            chamadaSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleSalvarChamada = async (chamadas: { aluno: string; status: string }[], data: string, descricao: string) => {
        console.log("Saving attendance:", chamadas, data, descricao);
        if (turmaId) {
            getEstatisticasTurma(turmaId).then(stats => {
                if (Array.isArray(stats)) setEstatisticas(stats);
            }).catch(err => console.error("Error refreshing stats:", err));

            contarAulasRealizadas(turmaId).then(count => {
                setTotalAulas(count);
            }).catch(err => console.error("Error refreshing class count:", err));
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#0D4F97]" />
            </div>
        );
    }

    return (
        <>
            <div className="mx-auto max-w-7xl space-y-6">
                <Button
                    onClick={() => router.back()}
                    variant="outline"
                >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Voltar
                </Button>

                <div className="mb-6">
                    <h1 className="text-[#0D4F97] text-2xl md:text-3xl font-bold mb-2">
                        Gestão de Frequência - {turma?.nome}
                    </h1>
                    <p className="text-[#222222]">
                        Registre chamadas e consulte o histórico de presença
                    </p>
                </div>

                <div id="secao-chamada">
                <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md bg-white">
                    <CardHeader className="bg-[#F8F9FA] border-b-2 border-[#B2D7EC]">
                        <CardTitle className="text-[#0D4F97]">
                            Registrar Chamada
                        </CardTitle>
                    <CardDescription className="text-[#222222]">
                        Marque a presença dos alunos
                    </CardDescription>
                        </CardHeader>

                        <CardContent className="p-6">
                    <ChamadaContent
                        turmaId={turmaId}
                        alunos={alunos}
                        onSalvarChamada={handleSalvarChamada}
                    />
                    </CardContent>
                </Card>
                </div>

                <div id="secao-historico">
                <HistoricoContent
                    turmaNome={turma?.nome || ""}
                    alunos={alunos}
                    estatisticas={estatisticas}
                    onViewAlunoHistorico={(alunoId) =>
                    router.push(`/professor/turmas/${turmaId}/frequencia/${alunoId}`)
                    }
                    onNovaChamada={handleNovaChamada}
                    totalAulasRealizadas={totalAulas}
                />
                </div>
            </div>
            </>

    );
}

function ChamadaContent({
    turmaId,
    alunos,
    onSalvarChamada,
    data,
    descricao,
}: {
    turmaId: number;
    alunos: any[];
    onSalvarChamada?: (chamadas: { aluno: string; status: string }[], data: string, descricao: string) => void;
    data?: Date;
    descricao?: string;
}) {
    const [selectedDate, setSelectedDate] = useState<Date>(data || new Date());
    const [attendance, setAttendance] = useState<Record<number, boolean>>({});
    const [descricaoAula, setDescricaoAula] = useState(descricao || "");
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const todayStart = startOfDay(new Date());
    const selectedDateStart = startOfDay(selectedDate);
    const isSelectedDateInPast = selectedDateStart < todayStart;
    const isEditingPastDate = isEditing && isSelectedDateInPast;

    const toggleAttendance = (studentId: string | number) => {
        setAttendance((prev) => {
            const current = prev[studentId] ?? true;
            return {
                ...prev,
                [studentId]: !current,
            };
        });
    };

    const handleSave = async () => {
        if (!descricaoAula.trim()) {
            toast.error("Por favor, adicione uma descrição para a aula.");
            return;
        }

        setIsSaving(true);

        try {
            const dataFormatada = format(selectedDate, "yyyy-MM-dd");
            const dataDisplay = format(selectedDate, "dd/MM/yyyy");

            const chamadas = alunos.map((student) => ({
                aluno: student.nome,
                status: (attendance[student.id] ?? true) ? "Presente" : "Ausente",
            }));

            const chamadaRequest = {
                descricao: descricaoAula,
                presencas: alunos.map((a, index) => {
                    const studentId = a.id || a._id || a.alunoId || `temp-${index}`;
                    const isPresent = attendance[studentId] ?? true;

                    return {
                        alunoId: studentId,
                        status: isPresent ? 'PRESENTE' : 'FALTA'
                    };
                })
            };

            await registrarChamada(turmaId, dataFormatada, chamadaRequest);

            if (onSalvarChamada) {
                onSalvarChamada(chamadas, dataDisplay, descricaoAula);
            }
            toast.success("Chamada salva com sucesso!");
        } catch (err: any) {
            toast.error("Erro ao salvar chamada: " + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const totalCount = alunos.length;
    const presentCount = alunos.reduce((acc, a, index) => {
        const studentId = a.id || a._id || a.alunoId || `temp-${index}`;
        return acc + ((attendance[studentId] ?? true) ? 1 : 0);
    }, 0);

    return (
        <div className="space-y-6">
            {isEditingPastDate && (
                <div className="rounded-xl border-2 border-[#FFD000] bg-[#FFD000]/20 p-4">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 flex-shrink-0 text-[#0D4F97] mt-0.5" />
                        <div>
                            <p className="text-[#0D4F97]">
                                <strong>Atenção:</strong> Você está editando o registro de frequência do dia{" "}
                                <strong>{format(selectedDate, "dd/MM/yyyy", { locale: ptBR })}</strong>.
                            </p>
                            <p className="mt-1 text-[#222222]">
                                As alterações serão salvas para esta data específica.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-xl border-2 border-[#B2D7EC] bg-white p-4">
                    <div className="mb-2 flex items-center gap-2 text-[#0D4F97]">
                        <CalendarIcon className="h-5 w-5" />
                        <span className="font-medium">Data da Chamada</span>
                    </div>
                    <Popover>
                        <PopoverTrigger asChild>
                            <button
                                type="button"
                                className="flex h-12 w-full items-center justify-start rounded-lg border-2 border-[#B2D7EC] bg-white px-4 text-[#222222] transition-colors hover:bg-[#B2D7EC]/20 focus:outline-none focus:ring-2 focus:ring-[#0D4F97] focus:ring-offset-2"
                            >
                                {format(selectedDate, "dd/MM/yyyy", { locale: ptBR })}
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={(date) => date && setSelectedDate(date)}
                                locale={ptBR}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="rounded-xl border-2 border-[#B2D7EC] bg-white p-4">
                    <div className="mb-2 flex items-center gap-2 text-[#0D4F97]">
                        <span className="font-medium">Descrição da Aula</span>
                    </div>
                    <Textarea
                        placeholder="Descrição da aula *"
                        className="min-h-[100px]"
                        value={descricaoAula}
                        onChange={(e) => setDescricaoAula(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-xl border-2 border-[#B2D7EC] bg-[#B2D7EC]/20 p-4">
                <div className="flex items-center justify-center gap-2">
                    <Users className="h-5 w-5 text-[#0D4F97]" />
                    <span className="text-[#0D4F97] font-medium">
                        <strong>{presentCount}</strong> de <strong>{totalCount}</strong> alunos presentes
                    </span>
                </div>
            </div>

            <div className="rounded-xl border-2 border-[#B2D7EC] bg-white overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-[#B2D7EC]/20 hover:bg-[#B2D7EC]/20">
                            <TableHead className="text-[#0D4F97] font-semibold pl-6">Nome do Aluno(a)</TableHead>
                            <TableHead className="text-center text-[#0D4F97] font-semibold pr-6">Presença</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {alunos.map((student, index) => {
                            const studentId = student.id || student._id || student.alunoId || `temp-${index}`;
                            const isPresent = attendance[studentId] ?? true;

                            return (
                                <TableRow
                                    key={studentId}
                                    className="transition-colors hover:bg-[#B2D7EC]/10"
                                >
                                    <TableCell className="text-[#222222] font-medium pl-6">{student.nome}</TableCell>
                                    <TableCell className="text-center pr-6">
                                        <div className="flex justify-center">
                                            <Switch
                                                id={`student-${studentId}`}
                                                checked={isPresent}
                                                onCheckedChange={() => toggleAttendance(studentId)}
                                                className={`h-6 w-11 ${isPresent
                                                    ? "data-[state=checked]:bg-[#4ade80]"
                                                    : "data-[state=unchecked]:bg-[#ef4444]"
                                                    }`}
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            <Button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-[#0D4F97] hover:bg-[#FFD000] hover:text-[#0D4F97] text-white font-medium h-12 transition-colors"
            >
                {isSaving ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Salvando...
                    </>
                ) : (
                    "Salvar Chamada"
                )}
            </Button>
        </div>
    );
}

function HistoricoContent({
    turmaNome,
    alunos,
    estatisticas = [],
    onViewAlunoHistorico,
    onNovaChamada,
    totalAulasRealizadas = 0
}: {
    turmaNome: string;
    alunos: any[];
    estatisticas?: any[];
    onViewAlunoHistorico: (alunoId: number) => void;
    onNovaChamada?: () => void;
    totalAulasRealizadas?: number;
}) {
    const params = useParams();
    const router = useRouter();
    const turmaId = params?.turmaId ? Number(params.turmaId) : 0;

    const [searchTerm, setSearchTerm] = useState("");
    const [showAlertsOnly, setShowAlertsOnly] = useState(false);

    const alunosComFrequencia = alunos.map(a => {
        const stat = estatisticas.find(s => String(s.alunoId) === String(a.id || a._id || a.alunoId));
        const realFrequencia = stat?.frequencia ?? stat?.percentual ?? 0;

        return {
            ...a,
            frequencia: stat ? realFrequencia : (a.frequencia ?? 0)
        };
    });

    const mediaFrequencia = alunosComFrequencia.length > 0
        ? Math.round(alunosComFrequencia.reduce((sum, a) => sum + (a.frequencia || 0), 0) / alunosComFrequencia.length)
        : 0;

    const alunosEmAlerta = alunosComFrequencia.filter((a) => (a.frequencia || 0) < 75).length;
    const aulasRegistradas = totalAulasRealizadas;
    const totalDiasLetivos = 200;

    const filteredAlunos = alunosComFrequencia.filter((aluno) => {
        const matchSearch = aluno.nome.toLowerCase().includes(searchTerm.toLowerCase());
        let matchAlert = true;
        if (showAlertsOnly) {
            matchAlert = (aluno.frequencia || 0) < 75;
        }
        return matchSearch && matchAlert;
    });


    return (
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
                            <p className="text-[#222222] text-sm mt-1">Frequência média anual da turma</p>
                        </CardContent>
                    </Card>

                    <Card className="rounded-xl border-2 border-orange-200 shadow-md">
                        <CardContent className="p-6 pt-12 text-center flex flex-col items-center justify-start h-full">
                            <p className="text-orange-600 text-2xl font-bold">{alunosEmAlerta} Alunos</p>
                            <p className="text-[#222222] text-sm mt-1">Com frequência abaixo de 75%</p>
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
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all duration-200 shadow-sm hover:shadow ${
                                showAlertsOnly 
                                    ? 'bg-orange-50 border-orange-200 text-orange-700 shadow-orange-200/50' 
                                    : 'bg-gray-100 border-gray-300 text-gray-800 hover:bg-gray-200 shadow-gray-300/50'
                            }`}
                        >
                            <span className="text-sm font-medium">Apenas Alertas</span>
                            <div className="relative inline-flex items-center h-5 rounded-full w-10 bg-gray-200">
                                <span 
                                    className={`absolute flex items-center justify-center w-5 h-5 rounded-full transition-all duration-200 ${
                                        showAlertsOnly 
                                            ? 'left-5 bg-orange-500' 
                                            : 'left-0 bg-white'
                                    }`}
                                >
                                    <AlertTriangle 
                                        className={`h-3 w-3 ${
                                            showAlertsOnly ? 'text-white' : 'text-gray-400'
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
                                <TableHead className="text-[#0D4F97] font-semibold pl-6">Nome do Aluno</TableHead>
                                <TableHead className="text-[#0D4F97] font-semibold pl-4">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAlunos.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={2} className="text-center text-[#222222] py-8">
                                        Nenhum aluno encontrado
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredAlunos.map((aluno, index) => {
                                    const frequencia = aluno.frequencia || 0;
                                    const isAlert = frequencia < 75;
                                    const studentId = aluno.id || aluno._id || aluno.alunoId;

                                    return (
                                        <TableRow
                                            key={studentId || index}
                                            className={`transition-all hover:bg-[#B2D7EC]/10 cursor-pointer ${isAlert ? "bg-orange-50/30" : ""}`}
                                            onClick={() => {
                                                if (studentId) {
                                                    router.push(`/professor/turmas/${turmaId}/frequencia/${studentId}`);
                                                } else {
                                                    toast.error("Erro: Identificador do aluno não encontrado.");
                                                }
                                            }}
                                        >
                                            <TableCell className="font-medium text-[#222222] pl-6">
                                                <div className="flex items-center gap-2">
                                                    {isAlert && <AlertTriangle className="h-4 w-4 text-orange-600 flex-shrink-0" />}
                                                    <Link
                                                        href={studentId ? `/professor/turmas/${turmaId}/frequencia/${studentId}` : "#"}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="text-[#0D4F97] underline hover:text-[#0D4F97]/80 whitespace-nowrap overflow-hidden text-ellipsis"
                                                    >
                                                        {aluno.nome}
                                                    </Link>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className={`font-semibold ${isAlert ? "text-orange-600" : "text-[#0D4F97]"}`}>
                                                    {frequencia}%
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {frequencia >= 75 ? 'Presente' : 'Ausente'}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>

            </CardContent>
        </Card>
    );
}