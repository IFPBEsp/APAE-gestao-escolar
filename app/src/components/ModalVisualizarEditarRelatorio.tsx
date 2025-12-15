'use client'

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Printer, Save, CalendarIcon, X, Edit } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface Relatorio {
  id: number | string;
  data: string | Date;
  alunoId?: number; 
  professorId?: number; 
  atividades?: string;
  habilidades?: string;
  estrategias?: string;
  recursos?: string;
  professor?: string;
  turma?: string;
  atividade?: string; 
  aluno?: string; 
}

interface ModalVisualizarEditarRelatorioProps {
  isOpen: boolean;
  onClose: () => void;
  relatorio: Relatorio | null; 
  alunoNome?: string;
  alunoDataNascimento?: string;
  onSalvar?: (relatorioAtualizado: Relatorio) => void;
}


function renderCampoVisualizacao(titulo: string, valor: string) {
    return (
        <div>
            <h4 className="font-semibold text-[#0D4F97] mb-2">{titulo}</h4>
            <div className="bg-gray-50 p-4 rounded-lg border text-gray-700 whitespace-pre-wrap text-justify">
                {valor || <span className="text-gray-400">Não informado</span>}
            </div>
        </div>
    );
}

const parseDate = (dateString: any): Date => {
  if (!dateString) return new Date();
  
  if (dateString instanceof Date) {
    return dateString;
  }
  
  if (typeof dateString === 'string') {
    if (dateString.includes('-')) {
      return new Date(dateString);
    }
    if (dateString.includes('/')) {
      const [day, month, year] = dateString.split('/').map(Number);
      if (year && month && day) {
        return new Date(year, month - 1, day);
      }
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
  const [formData, setFormData] = useState({
    data: new Date(),
    atividades: "",
    habilidades: "",
    estrategias: "",
    recursos: "",
    professor: "",
  });

  if (!relatorio) {
      if (isOpen) {
          toast.error("Erro: O relatório não pôde ser carregado.");
          onClose();
      }
      return null;
  }

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

  useEffect(() => {
    if (!isOpen) {
      setIsLoading(false);
    }
  }, [isOpen]);


  const handleImprimir = () => {
    if (!isEditando && (!formData.atividades.trim() || !formData.habilidades.trim() ||
        !formData.estrategias.trim() || !formData.recursos.trim())) {
      toast.error("Por favor, preencha todos os campos antes de imprimir!");
      return;
    }

    window.print();
  };

  const handleSalvar = async () => {
    if (!formData.atividades.trim() || !formData.habilidades.trim() ||
        !formData.estrategias.trim() || !formData.recursos.trim()) {
      toast.error("Por favor, preencha todos os campos!");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      
      const relatorioAtualizado: Relatorio = {
        ...relatorio,
        id: relatorio.id || Date.now(), 
        data: format(formData.data, "yyyy-MM-dd"), 
        atividades: formData.atividades,
        habilidades: formData.habilidades,
        estrategias: formData.estrategias,
        recursos: formData.recursos,
        professor: formData.professor,
      };

      if (onSalvar) {
        onSalvar(relatorioAtualizado);
      }

      toast.success("Relatório salvo com sucesso!");
      setIsEditando(false); 
      
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error("Erro ao salvar relatório.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelar = () => {
    if (relatorio && relatorio.id && relatorio.id !== 0 && relatorio.id !== 'novo') {
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


  const nomeAluno = alunoNome || relatorio.aluno || "Aluno";
  const nascimentoDisplay = alunoDataNascimento || "15/03/2013"; 
  const turmaDisplay = relatorio.turma || "Alfabetização 2025 - Manhã"; 



  function renderCampoEdicao(titulo: string, campo: keyof typeof formData, valor: string, placeholder: string) {
    return (
      <div>
        <h4 className="font-semibold text-[#0D4F97] mb-2">{titulo}</h4>
        <Textarea
          value={valor}
          onChange={(e) => setFormData({...formData, [campo]: e.target.value})}
          className="min-h-[100px] resize-y border-2 border-[#B2D7EC] focus:border-[#0D4F97] focus-visible:ring-0"
          disabled={isLoading}
          placeholder={placeholder}
        />
      </div>
    );
  }

  const visualizationContent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
          <p className="text-xs font-semibold text-[#0D4F97] uppercase">Data</p>
          <p className="text-gray-700">{format(formData.data, "dd/MM/yyyy", { locale: ptBR })}</p>
        </div>
        
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
          <p className="text-xs font-semibold text-[#0D4F97] uppercase">Professor</p>
          <p className="text-gray-700">{formData.professor}</p>
        </div>
        
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
          <p className="text-xs font-semibold text-[#0D4F97] uppercase">Turma</p>
          <p className="text-gray-700">{turmaDisplay}</p>
        </div>
      </div>

      {renderCampoVisualizacao("Atividades", formData.atividades)}
      {renderCampoVisualizacao("Habilidades", formData.habilidades)}
      {renderCampoVisualizacao("Estratégias", formData.estrategias)}
      {renderCampoVisualizacao("Recursos", formData.recursos)}
    </div>
  );

  const edicaoContent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
          <p className="text-xs font-semibold text-[#0D4F97] uppercase">Data</p>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start border-0 p-0 h-auto text-left font-normal bg-transparent hover:bg-transparent"
                disabled={isLoading}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(formData.data, "dd/MM/yyyy", { locale: ptBR })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.data}
                onSelect={(date) => date && setFormData({...formData, data: date})}
                initialFocus
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
          <p className="text-xs font-semibold text-[#0D4F97] uppercase">Professor</p>
          <input
            type="text"
            value={formData.professor}
            onChange={(e) => setFormData({...formData, professor: e.target.value})}
            className="w-full border-0 bg-transparent p-0 text-gray-700 focus:outline-none focus:ring-0"
            disabled={isLoading}
          />
        </div>
        
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
          <p className="text-xs font-semibold text-[#0D4F97] uppercase">Turma</p>
          <p className="text-gray-700">{turmaDisplay}</p>
        </div>
      </div>

      {renderCampoEdicao("Atividades", "atividades", formData.atividades, "Descreva as atividades realizadas...")}
      {renderCampoEdicao("Habilidades", "habilidades", formData.habilidades, "Descreva as habilidades observadas...")}
      {renderCampoEdicao("Estratégias", "estrategias", formData.estrategias, "Descreva as estratégias utilizadas...")}
      {renderCampoEdicao("Recursos", "recursos", formData.recursos, "Descreva os recursos utilizados...")}
    </div>
  );

  const printContent = (
    <div className="print-page">
      <div className="border-b-2 border-gray-300 pb-6 text-center print-avoid-break"> 
        <div className="mb-4">
          <h1 className="text-lg font-bold text-black">ASSOCIAÇÃO DE PAIS E AMIGOS DOS EXCEPCIONAIS</h1>
          <p className="text-sm">CNPJ: 01.180.414/0001-02</p>
          <p className="text-sm">ENDEREÇO: SANTO ANTÔNIO, 491</p>
          <p className="text-sm">CEP: 58.135-000 / ESPERANÇA-PB FUNDADA 14 DE OUTUBRO DE 1995</p>
          <p className="text-sm">RECONHECIDO DE UTILIDADE PÚBLICA</p>
        </div>
        <h2 className="mt-4 font-bold text-xl text-black">RELATÓRIO INDIVIDUAL DAS AULAS PRESENCIAIS</h2>
      </div>

      <div className="space-y-2 uppercase text-sm font-medium mt-6 print-avoid-break"> 
        <div className="flex gap-4">
          <div className="flex-1">
            <span>ESPERANÇA, </span>
            <span className="border-b border-black px-2">{format(formData.data, "dd", { locale: ptBR })}</span>
            <span> / </span>
            <span className="border-b border-black px-2">{format(formData.data, "MM", { locale: ptBR })}</span>
            <span> / </span>
            <span className="border-b border-black px-2">{format(formData.data, "yyyy", { locale: ptBR })}</span>
          </div>
        </div>

        <div className="mt-4">
          <span>NOME DO ALUNO: </span>
          <span className="border-b border-black px-2 font-bold">{nomeAluno}</span>
        </div>

        <div className="mt-2">
          <span>DATA DE NASCIMENTO: </span>
          <span className="border-b border-black px-2">{nascimentoDisplay}</span>
        </div>

        <div className="mt-2">
          <span>TURMA: </span>
          <span className="border-b border-black px-2">{turmaDisplay}</span>
          <span className="ml-4"> ANO: </span>
          <span className="border-b border-black px-2">{format(formData.data, "yyyy", { locale: ptBR })}</span>
        </div>
      </div>

      <div className="space-y-6 mt-8">
        <div className="print-avoid-break-small"> 
          <p className="mb-1 font-bold text-black">ATIVIDADES:</p>
          <div className="min-h-[60px] border-b border-gray-400 pb-2">
            <p className="whitespace-pre-wrap text-sm text-justify leading-relaxed">
              {formData.atividades || "Não informado"}
            </p>
          </div>
        </div>

        <div className="print-avoid-break-small"> 
          <p className="mb-1 font-bold text-black">HABILIDADES:</p>
          <div className="min-h-[60px] border-b border-gray-400 pb-2">
            <p className="whitespace-pre-wrap text-sm text-justify leading-relaxed">
              {formData.habilidades || "Não informado"}
            </p>
          </div>
        </div>

        <div className="print-avoid-break-small"> 
          <p className="mb-1 font-bold text-black">ESTRATÉGIAS:</p>
          <div className="min-h-[60px] border-b border-gray-400 pb-2">
            <p className="whitespace-pre-wrap text-sm text-justify leading-relaxed">
              {formData.estrategias || "Não informado"}
            </p>
          </div>
        </div>

        <div className="print-avoid-break-small print-avoid-break-after-this"> 
          <p className="mb-1 font-bold text-black">RECURSOS:</p>
          <div className="min-h-[60px] border-b border-gray-400 pb-2">
            <p className="whitespace-pre-wrap text-sm text-justify leading-relaxed">
              {formData.recursos || "Não informado"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-12 pt-8 print-signatures-block"> 
        <div className="text-center">
          <div className="mb-2 border-t-2 border-black pt-2 mx-4">
            <p className="font-bold text-sm">{formData.professor}</p>
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancelar()}>
      <div className="fixed inset-0 z-40 bg-black/80 dialog-backdrop print:hidden" />
      
      <style jsx global>{`
          @media print {
              /* 0. Configurações gerais da página */
              @page {
                  /* Reduzimos a margem superior/inferior para otimizar o espaço */
                  margin: 1cm 1.5cm 1cm 1.5cm; 
              }
              
              /* 1. Ocultar TUDO no corpo por padrão */
              body * {
                  visibility: hidden;
              }

              /* 2. Tornar o container do Dialog visível e ajustado para impressão */
              div[role="dialog"] {
                  visibility: visible !important;
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
                  overflow: visible !important; 
              }
              
              /* 3. Garantir que o DialogContent e o conteúdo de impressão sejam visíveis */
              .dialog-content {
                  visibility: visible !important;
                  width: 100% !important;
                  max-width: none !important;
                  min-height: 100vh !important;
                  overflow: visible !important;
                  padding: 0 !important;
                  margin: 0 !important;
                  box-shadow: none !important;
                  border: none !important;
              }

              /* 4. Tornar APENAS o conteúdo de impressão e seus filhos visíveis */
              .print-page,
              .print-page * {
                  visibility: visible !important;
                  box-shadow: none !important;
                  border: none !important;
                  background: white !important;
              }

              /* 5. Ocultar elementos de controle de tela */
              .dialog-header,
              .dialog-footer,
              .dialog-backdrop,
              .print\\:hidden,
              button {
                  display: none !important;
              }

              /* 6. Estilo da página impressa */
              .print-page {
                  padding: 0 !important; 
                  margin: 0 !important;
              }
              
              
              
              /* Evita quebras em blocos importantes, como cabeçalho ou informações do aluno */
              .print-avoid-break {
                  page-break-inside: avoid !important;
                  break-inside: avoid !important;
              }
              
              /* Força o último elemento relevante a não ter uma quebra de página logo depois */
              .print-avoid-break-after-this {
                  page-break-after: avoid !important;
                  break-after: avoid !important;
              }

              /* Evita que o bloco de assinaturas seja separado do conteúdo acima */
              .print-signatures-block {
                  page-break-before: avoid !important; /* Não quebrar a página antes deste bloco */
                  break-before: avoid !important;
                  page-break-inside: avoid !important; /* Não quebrar a página dentro deste bloco */
                  break-inside: avoid !important;
                  margin-top: 1.5cm !important; /* Força uma margem menor para subir mais */
              }

              /* Para campos de relatório individuais */
              .print-avoid-break-small {
                  page-break-inside: avoid !important;
                  break-inside: avoid !important;
              }
              
              /* Fim do media print */
          }
      `}</style>
      
      <DialogContent 
        className="dialog-content max-w-4xl max-h-[90vh] overflow-y-auto print:max-w-none print:max-h-none print:overflow-visible print:p-0 print:m-0"
      >
        <DialogHeader className="dialog-header flex flex-row items-center justify-between space-y-0 pb-4 border-b">
          <div>
            <DialogTitle className="text-2xl font-bold text-[#0D4F97]">
              {isEditando ? "Editando Relatório" : "Visualizando Relatório"}
            </DialogTitle>
            <DialogDescription className="dialog-description text-gray-600">
              {isEditando ? "Edite e salve o relatório de" : "Detalhes do relatório de"} **{nomeAluno}**
            </DialogDescription>
          </div>
          
          <div className="flex gap-3">
             <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
             >
                <X className="h-4 w-4" />
             </Button>
          </div>
        </DialogHeader>

        <div className="py-4 overflow-y-auto max-h-[calc(90vh-160px)] print:overflow-visible print:max-h-none print:p-0">
          <div className="block print:hidden px-2 sm:px-4">
            {isEditando ? edicaoContent : visualizationContent}
          </div>

          <div className="hidden print:block">
            {printContent}
          </div>
        </div>
        
        <div className="flex justify-end gap-3 pt-4 border-t px-6 pb-4 dialog-footer print:hidden">
            {!isEditando ? (
                <>
                    <Button
                        onClick={() => setIsEditando(true)}
                        variant="outline"
                        className="text-[#0D4F97] border-[#0D4F97] hover:bg-[#0D4F97] hover:text-white"
                        disabled={isLoading}
                    >
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                    </Button>
                    <Button
                        onClick={handleImprimir}
                        className="bg-[#0D4F97] text-white hover:bg-[#FFD000] hover:text-[#0D4F97]"
                        disabled={isLoading}
                    >
                        <Printer className="mr-2 h-4 w-4" />
                        Imprimir
                    </Button>
                </>
            ) : (
                <>
                    <Button
                        onClick={handleCancelar}
                        variant="outline"
                        className="border-gray-300"
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSalvar}
                        className="bg-[#0D4F97] text-white hover:bg-[#FFD000] hover:text-[#0D4F97]"
                        disabled={isLoading}
                    >
                        <Save className="mr-2 h-4 w-4" />
                        {isLoading ? "Salvando..." : "Salvar"}
                    </Button>
                </>
            )}
        </div>

      </DialogContent>
    </Dialog>
  );
}