import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Printer, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface VisualizarRelatorioAdminProps {
    relatorio: any;
    onBack: () => void;
    alunoNome?: string;
    alunoDataNascimento?: string;
    turmaNome?: string;
}

export default function VisualizarRelatorioAdmin({
    relatorio,
    onBack,
    alunoNome,
    alunoDataNascimento,
    turmaNome = "Alfabetização 2025 - Manhã"
}: VisualizarRelatorioAdminProps) {

    // Dados vindo do relatório ou padrões (para evitar erros)
    const dataRelatorio = relatorio?.data
        ? new Date(relatorio.data.split('/').reverse().join('-'))
        : new Date();

    const atividades = relatorio?.atividades || relatorio?.atividade || "";
    const habilidades = relatorio?.habilidades || "";
    const estrategias = relatorio?.estrategias || "";
    const recursos = relatorio?.recursos || "";
    const professor = relatorio?.professor || "Professor Responsável";

    // Nome do aluno pode vir de props externa ou do objeto relatorio
    const nomeAlunoFinal = alunoNome || relatorio?.aluno || "Aluno";
    const dataNascimentoFinal = alunoDataNascimento || "Data não informada";

    const handleImprimir = () => {
        window.print();
    };

    return (
        <div className="flex flex-col min-h-screen w-full bg-[#E5E5E5]">
            <style>{`
        @media print {
          /* Ocultar elementos não necessários na impressão */
          .no-print, aside, nav, header {
            display: none !important;
          }

          /* Resetar margem do layout principal */
           main {
             margin-left: 0 !important;
             padding: 0 !important;
             width: 100% !important;
           }

           body {
            background: white !important;
           }

          .print-only {
            display: block !important;
          }
        }
        
        .print-only {
          display: none;
        }
      `}</style>

            {/* Header Fixo - Não imprimir */}
            <div className="h-20 border-b-2 border-[#B2D7EC] bg-[#0D4F97] px-8 shadow-md no-print flex items-center mb-8">
                <div className="flex h-full items-center">
                    <h1 className="text-white text-xl font-bold">Visualizar Relatório Individual</h1>
                </div>
            </div>

            <div className="flex-1 p-8 pt-4">
                <div className="mx-auto max-w-5xl space-y-6">
                    {/* Botão Voltar - Oculto na impressão */}
                    <Button
                        onClick={onBack}
                        variant="outline"
                        className="no-print mb-6 h-12 justify-center border-2 border-[#B2D7EC] px-4 text-[#0D4F97] hover:bg-[#B2D7EC]/20"
                    >
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        Voltar
                    </Button>

                    {/* Título Principal da Página - Oculto na impressão */}
                    <div className="no-print flex items-start gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0D4F97]/10">
                            <FileText className="h-6 w-6 text-[#0D4F97]" />
                        </div>
                        <div>
                            <h2 className="text-[#0D4F97] text-2xl font-bold">
                                Relatório - {nomeAlunoFinal}
                            </h2>
                            <p className="text-[#222222] text-lg">
                                Visualize as informações do relatório
                            </p>
                        </div>
                    </div>

                    {/* Layout de Impressão - Visível apenas na impressão */}
                    <div className="print-only">
                        <div className="space-y-6 bg-white p-8">
                            {/* Cabeçalho APAE */}
                            <div className="border-b-2 border-gray-300 pb-6 text-center">
                                <div className="mb-4">
                                    <h1 className="text-lg font-bold">ASSOCIAÇÃO DE PAIS E AMIGOS DOS EXCEPCIONAIS</h1>
                                    <p className="text-sm">CNPJ: 01.180.414/0001-02</p>
                                    <p className="text-sm">ENDEREÇO: SANTO ANTÔNIO, 491</p>
                                    <p className="text-sm">CEP: 58.135-000 / ESPERANÇA-PB FUNDADA 14 DE OUTUBRO DE 1995</p>
                                    <p className="text-sm">RECONHECIDO DE UTILIDADE PÚBLICA</p>
                                </div>
                                <h2 className="mt-4 font-bold text-xl">RELATÓRIO INDIVIDUAL DAS AULAS PRESENCIAIS</h2>
                            </div>

                            {/* Informações do Aluno */}
                            <div className="space-y-2 uppercase text-sm font-medium">
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <span>ESPERANÇA, </span>
                                        <span className="border-b border-black px-2">{format(dataRelatorio, "dd", { locale: ptBR })}</span>
                                        <span> / </span>
                                        <span className="border-b border-black px-2">{format(dataRelatorio, "MM", { locale: ptBR })}</span>
                                        <span> / </span>
                                        <span className="border-b border-black px-2">{format(dataRelatorio, "yyyy", { locale: ptBR })}</span>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <span>NOME DO ALUNO: </span>
                                    <span className="border-b border-black px-2 font-bold">{nomeAlunoFinal}</span>
                                </div>

                                <div className="mt-2">
                                    <span>DATA DE NASCIMENTO: </span>
                                    <span className="border-b border-black px-2">{dataNascimentoFinal}</span>
                                </div>

                                <div className="mt-2">
                                    <span>TURMA: </span>
                                    <span className="border-b border-black px-2">{turmaNome}</span>
                                    <span className="ml-4"> ANO: </span>
                                    <span className="border-b border-black px-2">{format(dataRelatorio, "yyyy", { locale: ptBR })}</span>
                                </div>
                            </div>

                            {/* Campos do Relatório */}
                            <div className="space-y-4 mt-8">
                                <div>
                                    <p className="mb-1 font-bold">ATIVIDADES:</p>
                                    <div className="min-h-[100px] border-b border-gray-400 pb-2">
                                        <p className="whitespace-pre-wrap text-sm text-justify leading-relaxed">{atividades}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="mb-1 font-bold">HABILIDADES:</p>
                                    <div className="min-h-[100px] border-b border-gray-400 pb-2">
                                        <p className="whitespace-pre-wrap text-sm text-justify leading-relaxed">{habilidades}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="mb-1 font-bold">ESTRATÉGIAS:</p>
                                    <div className="min-h-[100px] border-b border-gray-400 pb-2">
                                        <p className="whitespace-pre-wrap text-sm text-justify leading-relaxed">{estrategias}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="mb-1 font-bold">RECURSOS:</p>
                                    <div className="min-h-[100px] border-b border-gray-400 pb-2">
                                        <p className="whitespace-pre-wrap text-sm text-justify leading-relaxed">{recursos}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Assinaturas */}
                            <div className="mt-24 grid grid-cols-2 gap-12 pt-8">
                                <div className="text-center">
                                    <div className="mb-2 border-t-2 border-black pt-2 mx-8">
                                        <p className="font-bold">{professor}</p>
                                        <p className="text-xs">PROFESSOR(A)</p>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="mb-2 border-t-2 border-black pt-2 mx-8">
                                        <p className="font-bold">COORDENADORA</p>
                                        <p className="text-xs">COORDENADORA PEDAGÓGICA</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Formulário Visualização - Oculto na impressão */}
                    <Card className="no-print rounded-xl border-2 border-[#B2D7EC] shadow-md">
                        <CardContent className="p-6">
                            <div className="space-y-6">
                                {/* Data do Relatório */}
                                <div>
                                    <label className="mb-2 block text-[#0D4F97] font-semibold">Data do Relatório</label>
                                    <div className="flex items-center h-12 w-full rounded-md border-2 border-[#B2D7EC] bg-slate-50 px-3 py-2 text-sm text-[#222222]">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {format(dataRelatorio, "dd/MM/yyyy", { locale: ptBR })}
                                    </div>
                                </div>

                                {/* Atividades */}
                                <div>
                                    <label className="mb-2 block text-[#0D4F97] font-semibold">Atividades</label>
                                    <div className="min-h-[120px] rounded-md border-2 border-[#B2D7EC] bg-slate-50 px-3 py-2 text-sm text-[#222222] whitespace-pre-wrap text-justify leading-relaxed">
                                        {atividades}
                                    </div>
                                </div>

                                {/* Habilidades */}
                                <div>
                                    <label className="mb-2 block text-[#0D4F97] font-semibold">Habilidades</label>
                                    <div className="min-h-[120px] rounded-md border-2 border-[#B2D7EC] bg-slate-50 px-3 py-2 text-sm text-[#222222] whitespace-pre-wrap text-justify leading-relaxed">
                                        {habilidades}
                                    </div>
                                </div>

                                {/* Estratégias */}
                                <div>
                                    <label className="mb-2 block text-[#0D4F97] font-semibold">Estratégias</label>
                                    <div className="min-h-[120px] rounded-md border-2 border-[#B2D7EC] bg-slate-50 px-3 py-2 text-sm text-[#222222] whitespace-pre-wrap text-justify leading-relaxed">
                                        {estrategias}
                                    </div>
                                </div>

                                {/* Recursos */}
                                <div>
                                    <label className="mb-2 block text-[#0D4F97] font-semibold">Recursos</label>
                                    <div className="min-h-[120px] rounded-md border-2 border-[#B2D7EC] bg-slate-50 px-3 py-2 text-sm text-[#222222] whitespace-pre-wrap text-justify leading-relaxed">
                                        {recursos}
                                    </div>
                                </div>

                                {/* Botões de Ação */}
                                <div className="flex flex-col gap-3 md:flex-row md:justify-end pt-4 border-t border-gray-100">
                                    <Button
                                        onClick={handleImprimir}
                                        className="h-12 bg-[#0D4F97] text-white hover:bg-[#FFD000] hover:text-[#0D4F97] px-8"
                                    >
                                        <Printer className="mr-2 h-5 w-5" />
                                        Imprimir Relatório
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
