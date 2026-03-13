'use client'

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Loader2, User, CheckCircle, XCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { buscarAlunoPorId } from "@/services/AlunoService";
import { buscarTurmaPorId } from "@/services/TurmaService";
import { getHistoricoAluno } from "@/services/ChamadaService";

export default function HistoricoAlunoPage() {
    const router = useRouter();
    const params = useParams();
    const turmaId = params?.turmaId ? Number(params.turmaId) : 0;
    const alunoId = params?.alunoId ? Number(params.alunoId) : 0;

    const [aluno, setAluno] = useState<any>(null);
    const [turma, setTurma] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Mock History Data
    // In a real implementation, we would fetch this from an API endpoint like /api/alunos/{id}/frequencia
    // Mock History Data - Generated deterministically based on ID to match the list page
    const [historico, setHistorico] = useState<any[]>([]);

    useEffect(() => {
        async function carregarDados() {
            if (!alunoId || !turmaId) return;
            try {
                setLoading(true);
                const [alunoData, turmaData, historicoData] = await Promise.all([
                    buscarAlunoPorId(alunoId),
                    buscarTurmaPorId(turmaId),
                    getHistoricoAluno(turmaId, alunoId)
                ]);
                setAluno(alunoData);
                setTurma(turmaData);
                setHistorico(Array.isArray(historicoData) ? historicoData : []);
            } catch (error) {
                toast.error("Erro ao carregar dados do aluno.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        carregarDados();
    }, [alunoId, turmaId]);

    const calcularFrequenciaTotal = () => {
        if (historico.length === 0) return 0;
        const presentes = historico.filter(h => h.status === "Presente").length;
        return Math.round((presentes / historico.length) * 100);
    };

    const frequenciaTotal = calcularFrequenciaTotal();
    const isAlert = frequenciaTotal < 75;

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#0D4F97]" />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8">
            <div className="mx-auto max-w-5xl space-y-6">
            {/* Botão Voltar */}
            <Button
                onClick={() => router.back()}
                variant="outline"
            >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Voltar
            </Button>

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-[#0D4F97] text-2xl md:text-3xl font-bold mb-1">
                Histórico Individual: {aluno?.nome}
                </h1>
                <p className="text-[#222222] font-medium opacity-80">{turma?.nome}</p>
            </div>

            {/* Card Principal do Aluno */}
            <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md bg-white">
                <CardContent className="p-8 pt-12 flex items-center gap-6 justify-start h-full">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#B2D7EC]/20">
                    <User className="h-10 w-10 text-[#0D4F97]" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-[#0D4F97]">{aluno?.nome}</h2>
                    <div className="mt-2 text-lg font-medium text-[#222222]">
                    Frequência Total:{" "}
                    <span className={isAlert ? "text-red-500 font-bold" : "text-[#0D4F97] font-bold"}>
                        {frequenciaTotal}%
                    </span>
                    </div>
                </div>
                </CardContent>
            </Card>

            {/* Tabela de Registros */}
            <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md bg-white">
                <div className="p-6 border-b border-[#B2D7EC]/30">
                <h3 className="text-[#0D4F97] font-bold text-lg">Histórico de Chamadas</h3>
                <p className="text-[#222222] text-sm">Registros completos da frequência individual</p>
                </div>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-[#B2D7EC]/20 hover:bg-[#B2D7EC]/20">
                                <TableHead className="w-1/3 text-[#0D4F97] font-semibold text-center">Data</TableHead>
                                <TableHead className="w-1/3 text-[#0D4F97] font-semibold text-center">Descrição da Aula</TableHead>
                                <TableHead className="w-1/3 text-[#0D4F97] font-semibold text-center">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {historico.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center py-8 text-[#222222]">
                                        Nenhum registro encontrado.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                historico.map((registro, index) => (
                                    <TableRow key={index} className="hover:bg-[#B2D7EC]/10">
                                        <TableCell className="text-center font-medium text-[#222222] whitespace-nowrap">
                                            {registro.data}
                                        </TableCell>
                                        <TableCell className="text-[#222222] text-center">
                                            {registro.descricao}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge
                                                className={`
                                                    px-4 py-1.5 font-semibold text-sm border
                                                    ${registro.status === 'Presente'
                                                        ? 'bg-[#E6F4EA] text-[#1E7E34] border-[#1E7E34]/20 hover:bg-[#E6F4EA]'
                                                        : 'bg-[#FCE8E6] text-[#D93025] border-[#D93025]/20 hover:bg-[#FCE8E6]'
                                                    }
                                                `}
                                            >
                                                {registro.status === 'Presente' && <CheckCircle className="w-4 h-4 mr-1.5 inline-block" />}
                                                {registro.status === 'Ausente' && <XCircle className="w-4 h-4 mr-1.5 inline-block" />}
                                                {registro.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                    <div className="p-4 border-t border-[#B2D7EC]/30 text-sm text-[#222222]">
                        Total de {historico.length} registros
                    </div>
                </CardContent>
            </Card>
            </div>
        </div>
    );
}