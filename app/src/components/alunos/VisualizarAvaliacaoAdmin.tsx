import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, FileText } from "lucide-react";

interface VisualizarAvaliacaoAdminProps {
    avaliacao: any;
    onBack: () => void;
}

export default function VisualizarAvaliacaoAdmin({
    avaliacao,
    onBack,
}: VisualizarAvaliacaoAdminProps) {

    const handleImprimir = () => {
        window.print();
    };

    return (
        <>
            <style>{`
        @media print {
          /* Ocultar elementos não necessários na impressão */
          .no-print, aside {
             display: none !important;
          }

           /* Resetar margem do layout principal */
           main {
             margin-left: 0 !important;
             padding: 0 !important;
           }

          /* Ajustar o layout para impressão */
          body {
            background: white !important;
          }
          
          .print-container {
            margin: 0;
            padding: 20px;
            max-width: 100%;
          }
          
          /* Ajustar card para impressão */
          .print-card {
            border: 2px solid #0D4F97 !important;
            box-shadow: none !important;
            page-break-inside: avoid;
          }
          
          /* Garantir que títulos não quebrem */
          h1, h2, h3 {
            page-break-after: avoid;
          }
          
          /* Ajustar cores para impressão */
          .print-title {
            color: #0D4F97 !important;
          }
          
          .print-text {
            color: #222222 !important;
          }
          
          /* Ajustar seções para impressão */
          .print-section {
            page-break-inside: avoid;
          }
          
          /* Ocultar labels dos campos */
          .print-label {
            display: block !important;
            margin-bottom: 8px;
          }
        }
      `}</style>

            <div className="flex flex-col min-h-screen bg-[#E5E5E5] w-full print-container">

                {/* Header Fixo - Não imprimir */}
                <div className="h-20 border-b-2 border-[#B2D7EC] bg-[#0D4F97] px-8 shadow-md no-print flex items-center -mx-8 -mt-8 mb-8">
                    <div className="flex h-full items-center">
                        <h1 className="text-white text-xl font-bold">Visualizar Avaliação</h1>
                    </div>
                </div>

                {/* Conteúdo da Página */}
                <div className="">
                    <div className="mx-auto max-w-4xl space-y-6">
                        {/* Botão Voltar - Não imprimir */}
                        <Button
                            onClick={onBack}
                            variant="outline"
                            className="h-12 justify-center border-2 border-[#B2D7EC] px-4 text-[#0D4F97] hover:bg-[#B2D7EC]/20 no-print"
                        >
                            <ArrowLeft className="mr-2 h-5 w-5" />
                            Voltar
                        </Button>

                        {/* Cabeçalho da Página */}
                        <div className="flex items-start gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0D4F97]/10 no-print">
                                <FileText className="h-6 w-6 text-[#0D4F97]" />
                            </div>
                            <div>
                                <h2 className="text-[#0D4F97] print-title text-2xl font-bold">Avaliação - {(avaliacao.aluno || "Aluno")}</h2>
                                <p className="text-[#222222] print-text text-lg">Visualize as informações da avaliação</p>
                            </div>
                        </div>

                        {/* Card de Formulário */}
                        <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md print-card">
                            <CardContent className="space-y-6 p-6">
                                {/* Data da Avaliação */}
                                <div className="space-y-2">
                                    <label className="text-[#0D4F97] print-label font-semibold">
                                        Data da Avaliação
                                    </label>
                                    <div className="flex h-12 items-center rounded-lg border-2 border-[#B2D7EC] bg-[#F8FCFF] px-4 text-[#222222]">
                                        {avaliacao.data}
                                    </div>
                                </div>

                                {/* Professor */}
                                <div className="space-y-2">
                                    <label className="text-[#0D4F97] print-label font-semibold">
                                        Professor Responsável
                                    </label>
                                    <div className="flex h-12 items-center rounded-lg border-2 border-[#B2D7EC] bg-[#F8FCFF] px-4 text-[#222222]">
                                        {avaliacao.professor}
                                    </div>
                                </div>

                                {/* Turma */}
                                <div className="space-y-2">
                                    <label className="text-[#0D4F97] print-label font-semibold">
                                        Turma
                                    </label>
                                    <div className="flex h-12 items-center rounded-lg border-2 border-[#B2D7EC] bg-[#F8FCFF] px-4 text-[#222222]">
                                        {avaliacao.turma}
                                    </div>
                                </div>

                                {/* Descrição */}
                                <div className="space-y-2">
                                    <label className="text-[#0D4F97] print-label font-semibold">
                                        Descrição da Avaliação
                                    </label>
                                    <div className="min-h-[120px] rounded-lg border-2 border-[#B2D7EC] bg-[#F8FCFF] p-4 text-[#222222] whitespace-pre-wrap text-justify">
                                        {avaliacao.descricao}
                                    </div>
                                </div>

                                {/* Detalhes Específicos (Cognitivo, etc) */}
                                {/* Caso o objeto venha com os campos detalhados, mostramos também */}
                                {avaliacao.desenvolvimentoCognitivo && (
                                    <div className="space-y-2">
                                        <label className="text-[#0D4F97] print-label font-semibold">Desenvolvimento Cognitivo</label>
                                        <div className="min-h-[80px] rounded-lg border-2 border-[#B2D7EC] bg-[#F8FCFF] p-4 text-[#222222] whitespace-pre-wrap text-justify">
                                            {avaliacao.desenvolvimentoCognitivo}
                                        </div>
                                    </div>
                                )}

                                {avaliacao.desenvolvimentoMotor && (
                                    <div className="space-y-2">
                                        <label className="text-[#0D4F97] print-label font-semibold">Desenvolvimento Motor</label>
                                        <div className="min-h-[80px] rounded-lg border-2 border-[#B2D7EC] bg-[#F8FCFF] p-4 text-[#222222] whitespace-pre-wrap text-justify">
                                            {avaliacao.desenvolvimentoMotor}
                                        </div>
                                    </div>
                                )}

                                {avaliacao.desenvolvimentoSocial && (
                                    <div className="space-y-2">
                                        <label className="text-[#0D4F97] print-label font-semibold">Desenvolvimento Social</label>
                                        <div className="min-h-[80px] rounded-lg border-2 border-[#B2D7EC] bg-[#F8FCFF] p-4 text-[#222222] whitespace-pre-wrap text-justify">
                                            {avaliacao.desenvolvimentoSocial}
                                        </div>
                                    </div>
                                )}

                                {avaliacao.autonomia && (
                                    <div className="space-y-2">
                                        <label className="text-[#0D4F97] print-label font-semibold">Autonomia</label>
                                        <div className="min-h-[80px] rounded-lg border-2 border-[#B2D7EC] bg-[#F8FCFF] p-4 text-[#222222] whitespace-pre-wrap text-justify">
                                            {avaliacao.autonomia}
                                        </div>
                                    </div>
                                )}

                                {/* Habilidades Avaliadas (Se houver array) */}
                                {avaliacao.habilidades && Array.isArray(avaliacao.habilidades) && (
                                    <div className="space-y-2">
                                        <label className="text-[#0D4F97] print-label font-semibold">
                                            Habilidades Avaliadas
                                        </label>
                                        <div className="rounded-lg border-2 border-[#B2D7EC] bg-[#F8FCFF] p-4">
                                            <div className="flex flex-wrap gap-2">
                                                {avaliacao.habilidades.map((habilidade: string, index: number) => (
                                                    <span
                                                        key={index}
                                                        className="px-4 py-2 bg-[#B2D7EC]/20 text-[#0D4F97] rounded-lg border border-[#B2D7EC]"
                                                    >
                                                        {habilidade}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Observações (Se houver) */}
                                {avaliacao.observacoes && (
                                    <div className="space-y-2">
                                        <label className="text-[#0D4F97] print-label font-semibold">
                                            Observações e Recomendações
                                        </label>
                                        <div className="min-h-[120px] rounded-lg border-2 border-[#B2D7EC] bg-[#F8FCFF] p-4 text-[#222222] whitespace-pre-wrap text-justify">
                                            {avaliacao.observacoes}
                                        </div>
                                    </div>
                                )}

                                {/* Botões - Não imprimir */}
                                <div className="flex justify-end gap-3 border-t-2 border-[#B2D7EC] pt-6 no-print">
                                    <Button
                                        onClick={handleImprimir}
                                        variant="outline"
                                        className="h-12 justify-center border-2 border-[#B2D7EC] px-6 text-[#0D4F97] hover:bg-[#B2D7EC]/20"
                                    >
                                        <Printer className="mr-2 h-5 w-5" />
                                        Imprimir
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Seção de Assinatura - Apenas na impressão */}
                        <div className="hidden print:block mt-12 space-y-8">
                            <div className="border-t-2 border-[#0D4F97] pt-12">
                                <div className="grid grid-cols-2 gap-12">
                                    <div className="text-center">
                                        <div className="border-t-2 border-[#0D4F97] pt-2">
                                            <p className="text-[#0D4F97] print-title">Professor(a) Responsável</p>
                                            <p className="text-[#222222] print-text">{avaliacao.professor}</p>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="border-t-2 border-[#0D4F97] pt-2">
                                            <p className="text-[#0D4F97] print-title">Data</p>
                                            <p className="text-[#222222] print-text">{avaliacao.data}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
