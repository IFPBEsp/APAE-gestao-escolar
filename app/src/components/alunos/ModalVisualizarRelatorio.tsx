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

    // Dados com fallback
    const dataRelatorio = relatorio?.data
        ? new Date(relatorio.data.split('/').reverse().join('-'))
        : new Date();

    const nomeAluno = alunoNome || relatorio.aluno || "Aluno";
    const nascimentoMock = alunoDataNascimento || "15/03/2013";
    const turmaMock = relatorio.turma || "Alfabetização 2025 - Manhã";

    // Conteúdo unificado para visualização e impressão
    const relatorioContent = (
        <div className="bg-white p-8 border border-gray-100 shadow-sm print:shadow-none print:border-none">
            {/* Cabeçalho APAE */}
            <div className="border-b-2 border-gray-300 pb-6 text-center">
                <div className="mb-4">
                    <h1 className="text-lg font-bold text-[#0D4F97] print:text-black">ASSOCIAÇÃO DE PAIS E AMIGOS DOS EXCEPCIONAIS</h1>
                    <p className="text-sm">CNPJ: 01.180.414/0001-02</p>
                    <p className="text-sm">ENDEREÇO: SANTO ANTÔNIO, 491</p>
                    <p className="text-sm">CEP: 58.135-000 / ESPERANÇA-PB FUNDADA 14 DE OUTUBRO DE 1995</p>
                    <p className="text-sm">RECONHECIDO DE UTILIDADE PÚBLICA</p>
                </div>
                <h2 className="mt-4 font-bold text-xl text-[#0D4F97] print:text-black">RELATÓRIO INDIVIDUAL DAS AULAS PRESENCIAIS</h2>
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
                    <p className="mb-1 font-bold text-[#0D4F97] print:text-black">ATIVIDADES:</p>
                    <div className="min-h-[60px] border-b border-gray-400 pb-2">
                        <p className="whitespace-pre-wrap text-sm text-justify leading-relaxed">
                            {relatorio.atividades || relatorio.atividade}
                        </p>
                    </div>
                </div>

                <div>
                    <p className="mb-1 font-bold text-[#0D4F97] print:text-black">HABILIDADES:</p>
                    <div className="min-h-[60px] border-b border-gray-400 pb-2">
                        <p className="whitespace-pre-wrap text-sm text-justify leading-relaxed">
                            {relatorio.habilidades || "Não informado"}
                        </p>
                    </div>
                </div>

                <div>
                    <p className="mb-1 font-bold text-[#0D4F97] print:text-black">ESTRATÉGIAS:</p>
                    <div className="min-h-[60px] border-b border-gray-400 pb-2">
                        <p className="whitespace-pre-wrap text-sm text-justify leading-relaxed">
                            {relatorio.estrategias || "Não informado"}
                        </p>
                    </div>
                </div>

                <div>
                    <p className="mb-1 font-bold text-[#0D4F97] print:text-black">RECURSOS:</p>
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
            <style>{`
        @media print {
            /* Ocultar tudo */
            body > * {
                visibility: hidden;
            }
            
            /* Exceto o modal e seu conteúdo */
            div[role="dialog"], div[role="dialog"] * {
                visibility: visible;
            }

            /* Posicionar o dialog no topo */
            div[role="dialog"] {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                margin: 0;
                padding: 0;
                box-shadow: none;
                border: none;
            }

            /* Ocultar botões e scrollbars na impressão */
            button, .close-button {
                display: none !important;
            }

            /* Garantir reset de cores */
            * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
        }
        `}</style>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto print:max-w-none print:max-h-none print:overflow-visible">
                <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
                    <div>
                        <DialogTitle className="text-[#0D4F97]">Visualizar Relatório Individual</DialogTitle>
                        <DialogDescription>Detalhes do relatório de {nomeAluno}</DialogDescription>
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
                    {relatorioContent}
                </div>

            </DialogContent>
        </Dialog>
    );
}
