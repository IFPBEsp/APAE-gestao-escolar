import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

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

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <style>{`
        @media print {
            body > * {
                visibility: hidden;
            }
            div[role="dialog"], div[role="dialog"] * {
                visibility: visible;
            }
            div[role="dialog"] {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
            }
            button {
                display: none !important;
            }
        }
        `}</style>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
                    <div>
                        <DialogTitle className="text-[#0D4F97]">Visualizar Avaliação</DialogTitle>
                        <DialogDescription>Avaliação de {alunoNome}</DialogDescription>
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

                <div className="space-y-6 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                            <p className="text-xs font-semibold text-[#0D4F97] uppercase">Data</p>
                            <p className="text-gray-700">{avaliacao.data}</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                            <p className="text-xs font-semibold text-[#0D4F97] uppercase">Professor</p>
                            <p className="text-gray-700">{avaliacao.professor}</p>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-[#0D4F97] mb-2">Descrição Geral</h4>
                        <div className="bg-gray-50 p-4 rounded-lg border text-gray-700 whitespace-pre-wrap text-justify">
                            {avaliacao.descricao}
                        </div>
                    </div>

                    {(avaliacao.desenvolvimentoCognitivo || avaliacao.desenvolvimentoMotor) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {avaliacao.desenvolvimentoCognitivo && (
                                <div>
                                    <h4 className="font-semibold text-[#0D4F97] mb-2">Desenvolvimento Cognitivo</h4>
                                    <div className="bg-gray-50 p-3 rounded-lg border text-sm text-gray-700 text-justify">
                                        {avaliacao.desenvolvimentoCognitivo}
                                    </div>
                                </div>
                            )}
                            {avaliacao.desenvolvimentoMotor && (
                                <div>
                                    <h4 className="font-semibold text-[#0D4F97] mb-2">Desenvolvimento Motor</h4>
                                    <div className="bg-gray-50 p-3 rounded-lg border text-sm text-gray-700 text-justify">
                                        {avaliacao.desenvolvimentoMotor}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {(avaliacao.desenvolvimentoSocial || avaliacao.autonomia) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {avaliacao.desenvolvimentoSocial && (
                                <div>
                                    <h4 className="font-semibold text-[#0D4F97] mb-2">Desenvolvimento Social</h4>
                                    <div className="bg-gray-50 p-3 rounded-lg border text-sm text-gray-700 text-justify">
                                        {avaliacao.desenvolvimentoSocial}
                                    </div>
                                </div>
                            )}
                            {avaliacao.autonomia && (
                                <div>
                                    <h4 className="font-semibold text-[#0D4F97] mb-2">Autonomia</h4>
                                    <div className="bg-gray-50 p-3 rounded-lg border text-sm text-gray-700 text-justify">
                                        {avaliacao.autonomia}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {avaliacao.observacoes && (
                        <div>
                            <h4 className="font-semibold text-[#0D4F97] mb-2">Observações</h4>
                            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 text-gray-700 text-sm text-justify">
                                {avaliacao.observacoes}
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
