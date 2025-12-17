'use client'

import { useState, useEffect, useRef } from "react";
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
            <h4 className="font-semibold text-[#0D4F97] mb-3 text-base">{titulo}</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-gray-700 whitespace-pre-wrap text-justify text-sm leading-relaxed">
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

    // Usando react-to-print para imprimir
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error("Permita pop-ups para imprimir!");
      return;
    }

    const nomeAluno = alunoNome || relatorio.aluno || "Aluno";
    const nascimentoDisplay = alunoDataNascimento || "15/03/2013"; 
    const turmaDisplay = relatorio.turma || "Alfabetização 2025 - Manhã";

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Relatório - ${nomeAluno}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 20mm 25mm 25mm 25mm;
            }
            body {
              font-family: "Times New Roman", Times, serif;
              font-size: 12pt;
              line-height: 1.5;
              margin: 0;
              padding: 0;
              background: white;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              text-align: justify;
            }
            .print-container {
              width: 100%;
              max-width: 210mm;
              margin: 0 auto;
              padding: 0;
            }
            .header {
              text-align: center;
              margin-bottom: 20pt;
              line-height: 1.2;
            }
            .header h1 {
              font-size: 14pt;
              font-weight: bold;
              margin: 0 0 4pt 0;
              text-transform: uppercase;
            }
            .header p {
              font-size: 10pt;
              margin: 2pt 0;
            }
            .header h2 {
              font-size: 13pt;
              font-weight: bold;
              margin: 12pt 0 0 0;
              text-transform: uppercase;
            }
            .student-info {
              margin-bottom: 20pt;
              font-size: 12pt;
              line-height: 1.8;
            }
            .info-line {
              margin-bottom: 6pt;
            }
            .info-label {
              font-weight: bold;
            }
            .underline {
              display: inline-block;
              min-width: 150pt;
              border-bottom: 1px solid #000;
              margin-left: 5pt;
            }
            .section {
              margin-bottom: 10pt;
            }
            .section-title {
              font-weight: bold;
              font-size: 12pt;
              margin: 0 0 4pt 0;
              text-transform: uppercase;
            }
            .section-content {
              padding: 6pt;
              min-height: 35pt;
              font-size: 12pt;
              line-height: 1.5;
              text-align: justify;
              border: none;
              text-indent: 20pt;
            }
            .signatures {
              display: flex;
              justify-content: space-between;
              margin-top: 40pt;
              padding-top: 20pt;
              border-top: none;
            }
            .signature-box {
              width: 45%;
              text-align: center;
            }
            .signature-line {
              border-top: 1px solid #000;
              padding-top: 8pt;
              margin: 0 15pt;
            }
            .signature-name {
              font-weight: bold;
              font-size: 12pt;
              margin: 8pt 0 0 0;
            }
            .signature-role {
              font-size: 10pt;
              margin: 2pt 0 0 0;
            }
            .page-break {
              page-break-before: always;
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <div class="header">
              <h1>ASSOCIAÇÃO DE PAIS E AMIGOS DOS EXCEPCIONAIS</h1>
              <p>CNPJ: 01.180.414/0001-02</p>
              <p>ENDEREÇO: SANTO ANTÔNIO, 491</p>
              <p>CEP: 58.135-000 / ESPERANÇA-PB FUNDADA 14 DE OUTUBRO DE 1995</p>
              <p>RECONHECIDO DE UTILIDADE PÚBLICA</p>
              <h2>RELATÓRIO INDIVIDUAL DAS AULAS PRESENCIAIS</h2>
            </div>

            <div class="student-info">
              <div class="info-line">
                <span class="info-label">ESPERANÇA, </span>
                <span class="underline">${format(formData.data, "dd/MM/yyyy", { locale: ptBR })}</span>
              </div>
              
              <div class="info-line">
                <span class="info-label">NOME DO ALUNO: </span>
                <span class="underline" style="font-weight: bold">${nomeAluno}</span>
              </div>
              
              <div class="info-line">
                <span class="info-label">DATA DE NASCIMENTO: </span>
                <span class="underline">${nascimentoDisplay}</span>
              </div>
              
              <div class="info-line">
                <span class="info-label">TURMA: </span>
                <span class="underline">${turmaDisplay}</span>
                <span class="info-label" style="margin-left: 20pt">ANO: </span>
                <span class="underline">${format(formData.data, "yyyy", { locale: ptBR })}</span>
              </div>
            </div>

            <div>
              <div class="section">
                <p class="section-title">ATIVIDADES:</p>
                <div class="section-content">
                  ${formData.atividades || "Não informado"}
                </div>
              </div>
              
              <div class="section">
                <p class="section-title">HABILIDADES:</p>
                <div class="section-content">
                  ${formData.habilidades || "Não informado"}
                </div>
              </div>
              
              <div class="section">
                <p class="section-title">ESTRATÉGIAS:</p>
                <div class="section-content">
                  ${formData.estrategias || "Não informado"}
                </div>
              </div>
              
              <div class="section">
                <p class="section-title">RECURSOS:</p>
                <div class="section-content">
                  ${formData.recursos || "Não informado"}
                </div>
              </div>
            </div>

            <div class="signatures">
              <div class="signature-box">
                <div class="signature-line">
                  <p class="signature-name">${formData.professor}</p>
                  <p class="signature-role">PROFESSOR(A)</p>
                </div>
              </div>
              <div class="signature-box">
                <div class="signature-line">
                  <p class="signature-name">COORDENADORA</p>
                  <p class="signature-role">COORDENADORA PEDAGÓGICA</p>
                </div>
              </div>
            </div>
          </div>
          
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => {
                window.close();
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
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
        <h4 className="font-semibold text-[#0D4F97] mb-3 text-base">{titulo}</h4>
        <Textarea
          value={valor}
          onChange={(e) => setFormData({...formData, [campo]: e.target.value})}
          className="min-h-[120px] resize-y border-2 border-[#B2D7EC] focus:border-[#0D4F97] focus-visible:ring-0 text-sm leading-relaxed"
          disabled={isLoading}
          placeholder={placeholder}
        />
      </div>
    );
  }

  const visualizationContent = (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <p className="text-sm font-semibold text-[#0D4F97] uppercase mb-2">Data</p>
          <p className="text-gray-700 text-base">{format(formData.data, "dd/MM/yyyy", { locale: ptBR })}</p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <p className="text-sm font-semibold text-[#0D4F97] uppercase mb-2">Professor</p>
          <p className="text-gray-700 text-base">{formData.professor}</p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <p className="text-sm font-semibold text-[#0D4F97] uppercase mb-2">Turma</p>
          <p className="text-gray-700 text-base">{turmaDisplay}</p>
        </div>
      </div>

      {renderCampoVisualizacao("Atividades", formData.atividades)}
      {renderCampoVisualizacao("Habilidades", formData.habilidades)}
      {renderCampoVisualizacao("Estratégias", formData.estrategias)}
      {renderCampoVisualizacao("Recursos", formData.recursos)}
    </div>
  );

  const edicaoContent = (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <p className="text-sm font-semibold text-[#0D4F97] uppercase mb-2">Data</p>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start border-0 p-0 h-auto text-left font-normal bg-transparent hover:bg-transparent text-base"
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
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <p className="text-sm font-semibold text-[#0D4F97] uppercase mb-2">Professor</p>
          <input
            type="text"
            value={formData.professor}
            onChange={(e) => setFormData({...formData, professor: e.target.value})}
            className="w-full border-0 bg-transparent p-0 text-gray-700 focus:outline-none focus:ring-0 text-base"
            disabled={isLoading}
          />
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <p className="text-sm font-semibold text-[#0D4F97] uppercase mb-2">Turma</p>
          <p className="text-gray-700 text-base">{turmaDisplay}</p>
        </div>
      </div>

      {renderCampoEdicao("Atividades", "atividades", formData.atividades, "Descreva as atividades realizadas...")}
      {renderCampoEdicao("Habilidades", "habilidades", formData.habilidades, "Descreva as habilidades observadas...")}
      {renderCampoEdicao("Estratégias", "estrategias", formData.estrategias, "Descreva as estratégias utilizadas...")}
      {renderCampoEdicao("Recursos", "recursos", formData.recursos, "Descreva os recursos utilizados...")}
    </div>
  );

  return (
    <Dialog open={isOpen}
    onOpenChange={(open) => {
      if (!open) {
        handleCancelar();
        onClose();
      }
    }}
  >
      <div className="fixed inset-0 z-40 bg-black/80" />
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-b">
          <div>
            <DialogTitle className="text-2xl font-bold text-[#0D4F97]">
              {isEditando ? "Editando Relatório" : "Visualizando Relatório"}
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-base mt-2">
              {isEditando ? "Edite e salve o relatório de" : "Detalhes do relatório de"} <span className="font-semibold">{nomeAluno}</span>
            </DialogDescription>
          </div>
        
        </DialogHeader>

        <div className="py-6">
          <div className="px-4 sm:px-6">
            {isEditando ? edicaoContent : visualizationContent}
          </div>
        </div>
        
        <div className="flex justify-end gap-4 pt-6 border-t px-6 pb-6">
            {!isEditando ? (
                <>
                    <Button
                        onClick={() => setIsEditando(true)}
                        variant="outline"
                        className="text-[#0D4F97] border-[#0D4F97] hover:bg-[#0D4F97] hover:text-white text-base px-6"
                        disabled={isLoading}
                    >
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                    </Button>
                    <Button
                        onClick={handleImprimir}
                        className="bg-[#0D4F97] text-white hover:bg-[#FFD000] hover:text-[#0D4F97] text-base px-6"
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
                        className="border-gray-300 text-base px-6"
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSalvar}
                        className="bg-[#0D4F97] text-white hover:bg-[#FFD000] hover:text-[#0D4F97] text-base px-6"
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