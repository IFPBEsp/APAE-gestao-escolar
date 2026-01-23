'use client'

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

import TemplateImpressao from "@/components/impressao/TemplateImpressao";
import DadosAlunoImpressao from "@/components/impressao/DadosAlunoImpressao";
import { RelatorioIndividualConteudo } from "@/components/relatorios/RelatorioIndividualConteudo";
import { useImpressaoDocumento } from "@/components/impressao/useImpressaoDocumento";

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

  const { refImpressao, imprimir } = useImpressaoDocumento();

  const dataRelatorio = relatorio?.data
    ? new Date(relatorio.data.split('/').reverse().join('-'))
    : new Date();

  const nomeAluno = alunoNome || relatorio.aluno || "Aluno";
  const turmaDisplay = relatorio.turma || "Alfabetização 2025 - Manhã";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between pb-4 border-b">
          <div>
            <DialogTitle className="text-[#0D4F97]">
              Visualizar Relatório Individual
            </DialogTitle>
            <DialogDescription>
              Detalhes do relatório de <strong>{nomeAluno}</strong>
            </DialogDescription>
          </div>

          <Button
            onClick={imprimir}
            variant="outline"
            className="text-[#0D4F97] border-[#0D4F97]"
          >
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
        </DialogHeader>

        {/* ===== VISUALIZAÇÃO EM TELA (mantida como está) ===== */}
        <div className="py-4 space-y-6">
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

        {/* ===== ÁREA DE IMPRESSÃO (PADRÃO ÚNICO DO SISTEMA) ===== */}
        <div style={{ display: "none" }}>
          <TemplateImpressao
            ref={refImpressao}
            titulo="Relatório Individual das Aulas Presenciais"
            assinaturas={{
              esquerda: {
                nome: relatorio.professor || "Professor(a)",
                cargo: "PROFESSOR(A)",
              },
              direita: {
                nome: "COORDENADORA",
                cargo: "COORDENADORA PEDAGÓGICA",
              },
            }}
          >
            <DadosAlunoImpressao
              cidade="Esperança"
              dataRelatorio={format(dataRelatorio, "dd/MM/yyyy")}
              nome={nomeAluno}
              nascimento={alunoDataNascimento || "—"}
              turma={turmaDisplay}
              ano={format(dataRelatorio, "yyyy")}
            />

            <RelatorioIndividualConteudo
              atividades={relatorio.atividades || relatorio.atividade}
              habilidades={relatorio.habilidades}
              estrategias={relatorio.estrategias}
              recursos={relatorio.recursos}
            />
          </TemplateImpressao>
        </div>
      </DialogContent>
    </Dialog>
  );
}
