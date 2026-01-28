'use client'

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Printer, Save, Edit } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import TemplateImpressao from "@/components/impressao/TemplateImpressao";
import { useImpressaoDocumento } from "@/components/impressao/useImpressaoDocumento";
import DadosAlunoImpressao from "@/components/impressao/DadosAlunoImpressao";
import { RelatorioIndividualConteudo } from "@/components/relatorios/RelatorioIndividualConteudo";
import { buscarAlunoPorId } from "@/services/AlunoService";

interface Relatorio {
  id: number | string;
  alunoId?: number | string;
  data: string | Date;
  aluno?: string;
  professor?: string;
  turma?: string;
  atividades?: string;
  habilidades?: string;
  estrategias?: string;
  recursos?: string;
  atividade?: string;
  aluno_nascimento?: string;
}

interface ModalVisualizarEditarRelatorioProps {
  isOpen: boolean;
  onClose: () => void;
  relatorio: Relatorio | null;
  alunoNome?: string;
  alunoDataNascimento?: string;
  onSalvar?: (relatorioAtualizado: Relatorio) => void;
}

const parseDate = (dateString: any): Date => {
  if (!dateString) return new Date();
  if (dateString instanceof Date) return dateString;
  if (typeof dateString === "string") {
    if (dateString.includes("-")) return new Date(dateString);
    if (dateString.includes("/")) {
      const [day, month, year] = dateString.split("/").map(Number);
      return new Date(year, month - 1, day);
    }
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) return date;
  }
  return new Date();
};

export default function ModalVisualizarEditarRelatorio({
  isOpen,
  onClose,
  relatorio,
  alunoNome,
  alunoDataNascimento,
  onSalvar,
}: ModalVisualizarEditarRelatorioProps) {
  const [isEditando, setIsEditando] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dadosAlunoCompleto, setDadosAlunoCompleto] = useState({
    nome: "",
    nascimento: "",
    turma: ""
  });

  const [formData, setFormData] = useState({
    data: new Date(),
    atividades: "",
    habilidades: "",
    estrategias: "",
    recursos: "",
    professor: "",
  });

  const { refImpressao, imprimir } = useImpressaoDocumento();

  useEffect(() => {
    async function carregarDadosAluno() {
      if (isOpen && relatorio) {
        const idParaBusca = relatorio.alunoId || relatorio.id;
        if (idParaBusca) {
          try {
            const aluno = await buscarAlunoPorId(idParaBusca);
            setDadosAlunoCompleto({
              nome: aluno.nome || alunoNome || relatorio.aluno || "Aluno",
              nascimento: aluno.dataNascimento || alunoDataNascimento || relatorio.aluno_nascimento || "—",
              turma: aluno.turma?.nome || relatorio.turma || "Alfabetização 2025 - Manhã"
            });
          } catch (error) {
            setDadosAlunoCompleto({
              nome: alunoNome || relatorio.aluno || "Aluno",
              nascimento: alunoDataNascimento || relatorio.aluno_nascimento || "—",
              turma: relatorio.turma || "Alfabetização 2025 - Manhã"
            });
          }
        } else {
          setDadosAlunoCompleto({
            nome: alunoNome || relatorio.aluno || "Aluno",
            nascimento: alunoDataNascimento || relatorio.aluno_nascimento || "—",
            turma: relatorio.turma || "Alfabetização 2025 - Manhã"
          });
        }
      }
    }
    carregarDadosAluno();
  }, [isOpen, relatorio, alunoNome, alunoDataNascimento]);

  useEffect(() => {
    if (relatorio && isOpen) {
      const isNew = !relatorio.id || relatorio.id === "novo" || relatorio.id === 0;
      setIsEditando(isNew);
      setFormData({
        data: parseDate(relatorio.data),
        atividades: relatorio.atividades || relatorio.atividade || "",
        habilidades: relatorio.habilidades || "",
        estrategias: relatorio.estrategias || "",
        recursos: relatorio.recursos || "",
        professor: relatorio.professor || "Professor(a)",
      });
    }
  }, [relatorio, isOpen]);

  const handleSalvar = async () => {
    if (!formData.atividades.trim() || !formData.habilidades.trim() ||
      !formData.estrategias.trim() || !formData.recursos.trim()) {
      toast.error("Por favor, preencha todos os campos!");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const relatorioAtualizado: Relatorio = {
        ...relatorio!,
        id: relatorio!.id || Date.now(),
        data: format(formData.data, "yyyy-MM-dd"),
        atividades: formData.atividades,
        habilidades: formData.habilidades,
        estrategias: formData.estrategias,
        recursos: formData.recursos,
        professor: formData.professor,
      };

      if (onSalvar) onSalvar(relatorioAtualizado);
      toast.success("Relatório salvo com sucesso!");
      setIsEditando(false);

    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar relatório.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelar = () => {
    if (relatorio && relatorio.id && relatorio.id !== "novo") {
      setFormData({
        data: parseDate(relatorio.data),
        atividades: relatorio.atividades || relatorio.atividade || "",
        habilidades: relatorio.habilidades || "",
        estrategias: relatorio.estrategias || "",
        recursos: relatorio.recursos || "",
        professor: relatorio.professor || "Professor(a)",
      });
      setIsEditando(false);
    } else {
      onClose();
    }
  };

  function renderCampoVisualizacao(titulo: string, valor: string) {
    return (
      <div>
        <h4 className="font-semibold text-[#0D4F97] mb-3 text-base">{titulo}</h4>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-gray-700 whitespace-pre-wrap text-justify text-sm leading-relaxed">
          {valor || <span className="text-gray-400">Não informado</span>}
        </div>
      </div>
    );
  }

  function renderCampoEdicao(titulo: string, campo: keyof typeof formData, valor: string, placeholder: string) {
    return (
      <div>
        <h4 className="font-semibold text-[#0D4F97] mb-3 text-base">{titulo}</h4>
        <Textarea
          value={valor}
          onChange={(e) => setFormData({ ...formData, [campo]: e.target.value })}
          className="min-h-[120px] resize-y border-2 border-[#B2D7EC] focus:border-[#0D4F97] focus-visible:ring-0 text-sm leading-relaxed"
          disabled={isLoading}
          placeholder={placeholder}
        />
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { handleCancelar(); onClose(); } }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-b">
          <div>
            <DialogTitle className="text-2xl font-bold text-[#0D4F97]">
              {isEditando ? "Editando Relatório" : "Visualizando Relatório"}
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-base mt-2">
              {isEditando ? "Edite o relatório de" : "Detalhes do relatório de"} <span className="font-semibold">{dadosAlunoCompleto.nome}</span>
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="py-6 px-4 sm:px-6">
          {isEditando ? (
            <div className="space-y-6">
              {renderCampoEdicao("Atividades", "atividades", formData.atividades, "Descreva as atividades...")}
              {renderCampoEdicao("Habilidades", "habilidades", formData.habilidades, "Descreva as habilidades...")}
              {renderCampoEdicao("Estratégias", "estrategias", formData.estrategias, "Descreva as estratégias...")}
              {renderCampoEdicao("Recursos", "recursos", formData.recursos, "Descreva os recursos...")}
            </div>
          ) : (
            <div className="space-y-6">
              {renderCampoVisualizacao("Atividades", formData.atividades)}
              {renderCampoVisualizacao("Habilidades", formData.habilidades)}
              {renderCampoVisualizacao("Estratégias", formData.estrategias)}
              {renderCampoVisualizacao("Recursos", formData.recursos)}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t px-6 pb-6">
          {!isEditando ? (
            <>
              <Button onClick={() => setIsEditando(true)} variant="outline">
                <Edit className="mr-2 h-4 w-4" /> Editar
              </Button>
              <Button onClick={imprimir} variant="primary">
                <Printer className="mr-2 h-4 w-4" /> Imprimir
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleCancelar} variant="outline">Cancelar</Button>
              <Button onClick={handleSalvar} variant="primary" disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" /> Salvar
              </Button>
            </>
          )}
        </div>

        <div style={{ display: "none", position: "absolute", left: "-9999px" }}>
          <TemplateImpressao
            ref={refImpressao}
            titulo="Relatório Individual das Aulas Presenciais"
            assinaturas={{
              esquerda: { nome: formData.professor || "Professor(a)", cargo: "PROFESSOR(A)" },
              direita: { nome: "COORDENADORA", cargo: "COORDENADORA PEDAGÓGICA" },
            }}
          >
            <DadosAlunoImpressao
              cidade="Esperança"
              dataRelatorio={format(formData.data, "dd/MM/yyyy")}
              nome={dadosAlunoCompleto.nome}
              nascimento={dadosAlunoCompleto.nascimento}
              turma={dadosAlunoCompleto.turma}
              ano={format(formData.data, "yyyy")}
            />
            <RelatorioIndividualConteudo
              atividades={formData.atividades}
              habilidades={formData.habilidades}
              estrategias={formData.estrategias}
              recursos={formData.recursos}
            />
          </TemplateImpressao>
        </div>
      </DialogContent>
    </Dialog>
  );
}
