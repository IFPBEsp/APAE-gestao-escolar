import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ModalVisualizarRelatorioProps {
    isOpen: boolean;
    onClose: () => void;
    relatorio: any;
    alunoNome?: string;
    alunoDataNascimento?: string;
}

export default function ModalVisualizarRelatorio({
    isOpen,
    onClose,
    relatorio,
    alunoNome,
    alunoDataNascimento,
}: ModalVisualizarRelatorioProps) {
    if (!relatorio) return null;

    const handleImprimir = () => {
        window.print();
    };

    const dataRelatorio = relatorio?.data
        ? new Date(relatorio.data.split('/').reverse().join('-'))
        : new Date();

    const nomeAluno = alunoNome || relatorio.aluno || "Aluno";
    const nascimentoMock = alunoDataNascimento || "15/03/2013";
    const turmaMock = relatorio.turma || "Alfabetização 2025 - Manhã";

    const visualizationContent = (
        <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <p className="text-xs font-semibold text-[#0D4F97] uppercase">Data</p>
                    <p className="text-gray-700">{relatorio.data}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <p className="text-xs font-semibold text-[#0D4F97] uppercase">Professor</p>
                    <p className="text-gray-700">{relatorio.professor}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <p className="text-xs font-semibold text-[#0D4F97] uppercase">Turma</p>
                    <p className="text-gray-700">{relatorio.turma || turmaMock}</p>
                </div>
            </div>

            <div>
                <h4 className="font-semibold text-[#0D4F97] mb-2">Atividades</h4>
                <div className="bg-gray-50 p-4 rounded-lg border text-gray-700 whitespace-pre-wrap text-justify">
                    {relatorio.atividades || relatorio.atividade}
                </div>
            </div>

            {relatorio.habilidades && (
                <div>
                    <h4 className="font-semibold text-[#0D4F97] mb-2">Habilidades</h4>
                    <div className="bg-gray-50 p-4 rounded-lg border text-gray-700 whitespace-pre-wrap text-justify">
                        {relatorio.habilidades}
                    </div>
                </div>
            )}

            {relatorio.estrategias && (
                <div>
                    <h4 className="font-semibold text-[#0D4F97] mb-2">Estratégias</h4>
                    <div className="bg-gray-50 p-4 rounded-lg border text-gray-700 whitespace-pre-wrap text-justify">
                        {relatorio.estrategias}
                    </div>
                </div>
            )}

            {relatorio.recursos && (
                <div>
                    <h4 className="font-semibold text-[#0D4F97] mb-2">Recursos</h4>
                    <div className="bg-gray-50 p-4 rounded-lg border text-gray-700 whitespace-pre-wrap text-justify">
                        {relatorio.recursos}
                    </div>
                </div>
            )}
        </div>
    );

    const printContent = (
        <div className="bg-white p-8">
            {/* Cabeçalho APAE */}
            <div className="border-b-2 border-gray-300 pb-6 text-center">
                <div className="mb-4">
                    <h1 className="text-lg font-bold text-black">ASSOCIAÇÃO DE PAIS E AMIGOS DOS EXCEPCIONAIS</h1>
                    <p className="text-sm">CNPJ: 01.180.414/0001-02</p>
                    <p className="text-sm">ENDEREÇO: SANTO ANTÔNIO, 491</p>
                    <p className="text-sm">CEP: 58.135-000 / ESPERANÇA-PB FUNDADA 14 DE OUTUBRO DE 1995</p>
                    <p className="text-sm">RECONHECIDO DE UTILIDADE PÚBLICA</p>
                </div>
                <h2 className="mt-4 font-bold text-xl text-black">RELATÓRIO INDIVIDUAL DAS AULAS PRESENCIAIS</h2>
            </div>

            {/* Informações do Aluno */}
            <div className="space-y-2 uppercase text-sm font-medium mt-6">
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
                    <span className="border-b border-black px-2 font-bold">{nomeAluno}</span>
                </div>

                <div className="mt-2">
                    <span>DATA DE NASCIMENTO: </span>
                    <span className="border-b border-black px-2">{nascimentoMock}</span>
                </div>

                <div className="mt-2">
                    <span>TURMA: </span>
                    <span className="border-b border-black px-2">{turmaMock}</span>
                    <span className="ml-4"> ANO: </span>
                    <span className="border-b border-black px-2">{format(dataRelatorio, "yyyy", { locale: ptBR })}</span>
                </div>
            </div>

            {/* Campos do Relatório */}
            <div className="space-y-6 mt-8">
                <div>
                    <p className="mb-1 font-bold text-black">ATIVIDADES:</p>
                    <div className="min-h-[60px] border-b border-gray-400 pb-2">
                        <p className="whitespace-pre-wrap text-sm text-justify leading-relaxed">
                            {relatorio.atividades || relatorio.atividade}
                        </p>
                    </div>
                </div>

                <div>
                    <p className="mb-1 font-bold text-black">HABILIDADES:</p>
                    <div className="min-h-[60px] border-b border-gray-400 pb-2">
                        <p className="whitespace-pre-wrap text-sm text-justify leading-relaxed">
                            {relatorio.habilidades || "Não informado"}
                        </p>
                    </div>
                </div>

                <div>
                    <p className="mb-1 font-bold text-black">ESTRATÉGIAS:</p>
                    <div className="min-h-[60px] border-b border-gray-400 pb-2">
                        <p className="whitespace-pre-wrap text-sm text-justify leading-relaxed">
                            {relatorio.estrategias || "Não informado"}
                        </p>
                    </div>
                </div>

                <div>
                    <p className="mb-1 font-bold text-black">RECURSOS:</p>
                    <div className="min-h-[60px] border-b border-gray-400 pb-2">
                        <p className="whitespace-pre-wrap text-sm text-justify leading-relaxed">
                            {relatorio.recursos || "Não informado"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Assinaturas */}
            <div className="mt-16 grid grid-cols-2 gap-12 pt-8">
                <div className="text-center">
                    <div className="mb-2 border-t-2 border-black pt-2 mx-4">
                        <p className="font-bold text-sm">{relatorio.professor}</p>
                        <p className="text-xs">PROFESSOR(A)</p>
                    </div>
                </div>
                <div className="text-center">
                    <div className="mb-2 border-t-2 border-black pt-2 mx-4">
                        <p className="font-bold text-sm">COORDENADORA</p>
                        <p className="text-xs">COORDENADORA PEDAGÓGICA</p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            {/* O backdrop do Dialog precisa de uma classe para ser ocultado na impressão */}
            <div className="fixed inset-0 z-40 bg-black/80 dialog-backdrop" />
            
            <style>{`
                @media print {
                    /* 1. Ocultar o backdrop do Dialog */
                    .dialog-backdrop {
                        display: none !important;
                    }

                    /* 2. Transformar o Dialog (Portal) em um container de impressão */
                    div[role="dialog"] {
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 100% !important;
                        height: auto !important;
                        min-height: 100vh !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        transform: none !important;
                        box-shadow: none !important;
                        background: white !important;
                        z-index: 9999 !important;
                    }
                    
                    /* 3. Ocultar o cabeçalho, botões e elementos de visualização */
                    .dialog-header, 
                    .dialog-header *,
                    .dialog-header button,
                    .dialog-header button * {
                        display: none !important;
                        visibility: hidden !important;
                    }

                    /* 4. Garantir que o DialogContent ocupe o fluxo de impressão */
                    .dialog-content {
                        width: 100% !important;
                        max-width: none !important;
                        min-height: 100vh !important;
                        overflow: visible !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        box-shadow: none !important;
                        border: none !important;
                    }

                    /* 5. Forçar o reset de visibilidade para todo o corpo, depois tornar o Dialog visível */
                    body * {
                        visibility: hidden;
                    }

                    div[role="dialog"], 
                    div[role="dialog"] *,
                    .dialog-content,
                    .dialog-content * {
                        visibility: visible !important;
                    }
                    
                    /* Garantir que o background do body seja branco na impressão */
                    body {
                        background-color: white !important;
                    }
                }
            `}</style>
            
            <DialogContent 
                className="dialog-content max-w-4xl max-h-[90vh] overflow-y-auto print:max-w-none print:max-h-none print:overflow-visible"
            >
                <DialogHeader className="dialog-header flex flex-row items-center justify-between space-y-0 pb-4 border-b">
                    <div>
                        <DialogTitle className="text-[#0D4F97]">Visualizar Relatório Individual</DialogTitle>
                        <DialogDescription className="dialog-description">Detalhes do relatório de {nomeAluno}</DialogDescription>
                    </div>
                    <Button
                        onClick={handleImprimir}
                        variant="outline"
                        className="text-[#0D4F97] border-[#0D4F97] hover:bg-[#0D4F97] hover:text-white"
                    >
                        <Printer className="mr-2 h-4 w-4" />
                        Imprimir
                    </Button>
                </DialogHeader>

                <div className="py-4">
                    {/* Conteúdo para Visualização (Visível no Ecrã, Oculto na Impressão) */}
                    <div className="block print:hidden">
                        {visualizationContent}
                    </div>

                    {/* Conteúdo para Impressão (Oculto no Ecrã, Visível na Impressão) */}
                    <div className="hidden print:block">
                        {printContent}
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    );
}
