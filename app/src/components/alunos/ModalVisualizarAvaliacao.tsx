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

interface ModalVisualizarAvaliacaoProps {
    isOpen: boolean;
    onClose: () => void;
    avaliacao: any;
    alunoNome: string;
}

export default function ModalVisualizarAvaliacao({
    isOpen,
    onClose,
    avaliacao,
    alunoNome,
}: ModalVisualizarAvaliacaoProps) {
    if (!avaliacao) return null;

    const handleImprimir = () => {
        window.print();
    };

    const dataAvaliacao = avaliacao?.data
        ? new Date(avaliacao.data.split('/').reverse().join('-'))
        : new Date();

    const nomeAluno = alunoNome;
    const turmaMock = avaliacao.turma || "Não informada";
    
    const visualizationContent = (
        <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <p className="text-xs font-semibold text-[#0D4F97] uppercase">Data</p>
                    <p className="text-gray-700">{avaliacao.data}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <p className="text-xs font-semibold text-[#0D4F97] uppercase">Professor</p>
                    <p className="text-gray-700">{avaliacao.professor}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <p className="text-xs font-semibold text-[#0D4F97] uppercase">Turma</p>
                    <p className="text-gray-700">{avaliacao.turma || "Não informada"}</p>
                </div>
            </div>

            <div>
                <h4 className="font-semibold text-[#0D4F97] mb-2">Descrição Geral</h4>
                <div className="bg-gray-50 p-4 rounded-lg border text-gray-700 whitespace-pre-wrap text-justify">
                    {avaliacao.descricao}
                </div>
            </div>
        </div>
    );

    const printContent = (
        <div className="bg-white p-8">
            {/* Cabeçalho APAE (Reutilizando a estrutura do Relatório para consistência) */}
            <div className="border-b-2 border-gray-300 pb-6 text-center">
                <div className="mb-4">
                    <h1 className="text-lg font-bold text-black">ASSOCIAÇÃO DE PAIS E AMIGOS DOS EXCEPCIONAIS</h1>
                    <p className="text-sm">CNPJ: 01.180.414/0001-02</p>
                    <p className="text-sm">ENDEREÇO: SANTO ANTÔNIO, 491</p>
                    <p className="text-sm">CEP: 58.135-000 / ESPERANÇA-PB</p>
                </div>
                <h2 className="mt-4 font-bold text-xl text-black">FICHA DE AVALIAÇÃO INDIVIDUAL</h2>
            </div>

            {/* Informações da Avaliação e Aluno */}
            <div className="space-y-2 uppercase text-sm font-medium mt-6">
                <div className="mt-4">
                    <span>NOME DO ALUNO: </span>
                    <span className="border-b border-black px-2 font-bold">{nomeAluno}</span>
                </div>

                <div className="mt-2">
                    <span>TURMA: </span>
                    <span className="border-b border-black px-2">{turmaMock}</span>
                </div>

                <div className="flex gap-4 mt-2">
                    <div className="flex-1">
                        <span>PROFESSOR: </span>
                        <span className="border-b border-black px-2">{avaliacao.professor}</span>
                    </div>
                    <div className="flex-1">
                        <span>DATA DA AVALIAÇÃO: </span>
                        <span className="border-b border-black px-2">{avaliacao.data}</span>
                    </div>
                </div>
            </div>

            {/* Campos da Avaliação */}
            <div className="space-y-6 mt-8">
                <div>
                    <p className="mb-1 font-bold text-black">DESCRIÇÃO GERAL DA AVALIAÇÃO:</p>
                    <div className="min-h-[150px] border border-gray-400 p-2">
                        <p className="whitespace-pre-wrap text-sm text-justify leading-relaxed">
                            {avaliacao.descricao || "Descrição não preenchida."}
                        </p>
                    </div>
                </div>
            </div>

            {/* Assinaturas */}
            <div className="mt-16 grid grid-cols-2 gap-12 pt-8">
                <div className="text-center">
                    <div className="mb-2 border-t-2 border-black pt-2 mx-4">
                        <p className="font-bold text-sm">{avaliacao.professor}</p>
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
            {/* Adiciona o backdrop para o CSS de impressão poder ocultá-lo */}
            <div className="fixed inset-0 z-40 bg-black/80 dialog-backdrop" />
            
            {/* CSS de Impressão (Reutilizado do Relatório) */}
            <style>{`
                @media print {
                    /* Ocultar o backdrop */
                    .dialog-backdrop {
                        display: none !important;
                    }

                    /* Forçar o Dialog (Portal) para o layout de impressão */
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
                    
                    /* Ocultar cabeçalho, botões e elementos de visualização */
                    .dialog-header, 
                    .dialog-header *,
                    .dialog-header button,
                    .dialog-header button * {
                        display: none !important;
                        visibility: hidden !important;
                    }

                    /* Garantir que o DialogContent ocupe o fluxo de impressão */
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

                    /* Resetar visibilidade e tornar o Dialog visível */
                    body * {
                        visibility: hidden;
                    }

                    div[role="dialog"], 
                    div[role="dialog"] *,
                    .dialog-content,
                    .dialog-content * {
                        visibility: visible !important;
                    }
                    
                    body {
                        background-color: white !important;
                    }
                }
            `}</style>
            
            <DialogContent 
                className="dialog-content max-w-3xl max-h-[90vh] overflow-y-auto print:max-w-none print:max-h-none print:overflow-visible"
            >
                <DialogHeader className="dialog-header flex flex-row items-center justify-between space-y-0 pb-4 border-b">
                    <div>
                        <DialogTitle className="text-[#0D4F97]">Visualizar Avaliação</DialogTitle>
                        <DialogDescription className="dialog-description">Avaliação de {alunoNome}</DialogDescription>
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

                {/* Conteúdo da Modal */}
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