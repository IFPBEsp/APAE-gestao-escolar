import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Printer, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import TemplateImpressao from "@/components/impressao/TemplateImpressao";
import DadosAlunoImpressao from "@/components/impressao/DadosAlunoImpressao";
import { RelatorioIndividualConteudo } from "@/components/relatorios/RelatorioIndividualConteudo";
import { useImpressaoDocumento } from "@/components/impressao/useImpressaoDocumento";



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
  turmaNome = "Alfabetização 2025 - Manhã",
}: VisualizarRelatorioAdminProps) {

  const { refImpressao, imprimir } = useImpressaoDocumento();

  const dataRelatorio = relatorio?.data
    ? new Date(relatorio.data.split("/").reverse().join("-"))
    : new Date();

  const atividades = relatorio?.atividades || "";
  const habilidades = relatorio?.habilidades || "";
  const estrategias = relatorio?.estrategias || "";
  const recursos = relatorio?.recursos || "";
  const professor = relatorio?.professor || "Professor Responsável";

  const nomeAlunoFinal = alunoNome || relatorio?.aluno || "Aluno";
  const dataNascimentoFinal = alunoDataNascimento || "—";

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#E5E5E5]">

      {/* HEADER - NÃO IMPRIME */}
      <div className="h-20 border-b-2 border-[#B2D7EC] bg-[#0D4F97] px-8 shadow-md flex items-center mb-8 nao-imprimir">
        <h1 className="text-white text-xl font-bold">
          Visualizar Relatório Individual
        </h1>
      </div>

      <div className="flex-1 p-8 pt-4">
        <div className="mx-auto max-w-5xl space-y-6">

          {/* VOLTAR */}
          <Button
            onClick={onBack}
            variant="outline"
            className="mb-6 h-12 border-2 border-[#B2D7EC] text-[#0D4F97] nao-imprimir"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Voltar
          </Button>

          {/* TÍTULO */}
          <div className="flex items-start gap-3 nao-imprimir">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0D4F97]/10">
              <FileText className="h-6 w-6 text-[#0D4F97]" />
            </div>
            <div>
              <h2 className="text-[#0D4F97] text-2xl font-bold">
                Relatório – {nomeAlunoFinal}
              </h2>
              <p className="text-lg">Visualize as informações do relatório</p>
            </div>
          </div>

          {/* CARD DE VISUALIZAÇÃO */}
          <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md nao-imprimir">
            <CardContent className="p-6 space-y-6">

              <div>
                <label className="font-semibold">Data do Relatório</label>
                <div className="flex items-center h-12 border-2 rounded-md px-3">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(dataRelatorio, "dd/MM/yyyy", { locale: ptBR })}
                </div>
              </div>

              <div>
                <label className="font-semibold">Atividades</label>
                <div className="min-h-[120px] border-2 rounded-md p-3 whitespace-pre-wrap text-justify">
                  {atividades}
                </div>
              </div>

              <div>
                <label className="font-semibold">Habilidades</label>
                <div className="min-h-[120px] border-2 rounded-md p-3 whitespace-pre-wrap text-justify">
                  {habilidades}
                </div>
              </div>

              <div>
                <label className="font-semibold">Estratégias</label>
                <div className="min-h-[120px] border-2 rounded-md p-3 whitespace-pre-wrap text-justify">
                  {estrategias}
                </div>
              </div>

              <div>
                <label className="font-semibold">Recursos</label>
                <div className="min-h-[120px] border-2 rounded-md p-3 whitespace-pre-wrap text-justify">
                  {recursos}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button onClick={imprimir} className="h-12 px-8">
                  <Printer className="mr-2 h-5 w-5" />
                  Imprimir Relatório
                </Button>
              </div>

            </CardContent>
          </Card>

        </div>
      </div>

      {/* ===== TEMPLATE DE IMPRESSÃO (ÚNICO) ===== */}
      <TemplateImpressao
        ref={refImpressao}
        titulo="Relatório Individual das Aulas Presenciais"
        assinaturas={{
          esquerda: { nome: professor, cargo: "PROFESSOR(A)" },
          direita: { nome: "COORDENADORA", cargo: "COORDENADORA PEDAGÓGICA" },
        }}
      >
        <DadosAlunoImpressao
          cidade="Esperança"
          dataRelatorio={format(dataRelatorio, "dd/MM/yyyy")}
          nome={nomeAlunoFinal}
          nascimento={dataNascimentoFinal}
          turma={turmaNome}
          ano={format(dataRelatorio, "yyyy")}
        />

        <RelatorioIndividualConteudo
          atividades={atividades}
          habilidades={habilidades}
          estrategias={estrategias}
          recursos={recursos}
        />
      </TemplateImpressao>

    </div>
  );
}
