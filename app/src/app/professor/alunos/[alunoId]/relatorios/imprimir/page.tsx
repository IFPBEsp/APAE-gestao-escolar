'use client'

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useRouter, useParams, useSearchParams } from "next/navigation";

interface RelatorioData {
  alunoId: string;
  alunoNome: string;
  data: string;
  dataRelatorio: string;
  atividades: string;
  habilidades: string;
  estrategias: string;
  recursos: string;
  turmaId?: string;
  turmaNome: string;
  dataNascimento: string;
  professor: string;
  turma: string;
}

export default function ImprimirRelatorioPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  const alunoId = params?.alunoId ? String(params.alunoId) : null;
  const turmaId = searchParams?.get('turmaId');
  
  const [relatorio, setRelatorio] = useState<RelatorioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Buscar dados do localStorage
    const dadosSalvos = localStorage.getItem('relatorioParaImprimir');
    
    if (dadosSalvos) {
      try {
        const parsedData = JSON.parse(dadosSalvos);
        setRelatorio(parsedData);
      } catch (error) {
        console.error("Erro ao parsear dados do relatório:", error);
      }
    }
    
    setIsLoading(false);
  }, []);

  const handleVoltar = () => {
    if (alunoId) {
      const query = turmaId ? `?turmaId=${turmaId}` : '';
      router.push(`/professor/alunos/${alunoId}/relatorios/criarRelatorio${query}`);
    } else {
      router.push("/professor/turmas");
    }
  };

  const handleImprimir = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#0D4F97] border-t-transparent"></div>
          <p className="text-[#0D4F97]">Carregando relatório...</p>
        </div>
      </div>
    );
  }

  if (!relatorio) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Relatório não encontrado</p>
          <Button
            onClick={handleVoltar}
            variant="outline"
            className="border-2 border-[#0D4F97] text-[#0D4F97] hover:bg-[#0D4F97] hover:text-white"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  const dataRelatorioObj = relatorio.dataRelatorio 
    ? new Date(relatorio.dataRelatorio) 
    : new Date();

  return (
    <div className="min-h-screen bg-white">
      {/* Botões (ocultos na impressão) */}
      <div className="no-print p-4 bg-gray-100 border-b">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Button
            onClick={handleVoltar}
            variant="outline"
            className="border-2 border-[#0D4F97] text-[#0D4F97] hover:bg-[#0D4F97] hover:text-white"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Voltar
          </Button>
          <Button
            onClick={handleImprimir}
            className="bg-[#0D4F97] text-white hover:bg-[#FFD000] hover:text-[#0D4F97]"
          >
            <Printer className="mr-2 h-5 w-5" />
            Imprimir Agora
          </Button>
        </div>
      </div>

      {/* Conteúdo para Impressão */}
      <div className="max-w-4xl mx-auto p-8">
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
              <span className="border-b border-black px-2">{format(dataRelatorioObj, "dd", { locale: ptBR })}</span>
              <span> / </span>
              <span className="border-b border-black px-2">{format(dataRelatorioObj, "MM", { locale: ptBR })}</span>
              <span> / </span>
              <span className="border-b border-black px-2">{format(dataRelatorioObj, "yyyy", { locale: ptBR })}</span>
            </div>
          </div>

          <div className="mt-4">
            <span>NOME DO ALUNO: </span>
            <span className="border-b border-black px-2 font-bold">{relatorio.alunoNome}</span>
          </div>

          <div className="mt-2">
            <span>DATA DE NASCIMENTO: </span>
            <span className="border-b border-black px-2">{relatorio.dataNascimento}</span>
          </div>

          <div className="mt-2">
            <span>TURMA: </span>
            <span className="border-b border-black px-2">{relatorio.turmaNome}</span>
            <span className="ml-4"> ANO: </span>
            <span className="border-b border-black px-2">{format(dataRelatorioObj, "yyyy", { locale: ptBR })}</span>
          </div>
        </div>

        {/* Campos do Relatório */}
        <div className="space-y-6 mt-8">
          <div>
            <p className="mb-1 font-bold text-black">ATIVIDADES:</p>
            <div className="min-h-[60px] border-b border-gray-400 pb-2">
              <p className="whitespace-pre-wrap text-sm text-justify leading-relaxed">
                {relatorio.atividades}
              </p>
            </div>
          </div>

          <div>
            <p className="mb-1 font-bold text-black">HABILIDADES:</p>
            <div className="min-h-[60px] border-b border-gray-400 pb-2">
              <p className="whitespace-pre-wrap text-sm text-justify leading-relaxed">
                {relatorio.habilidades}
              </p>
            </div>
          </div>

          <div>
            <p className="mb-1 font-bold text-black">ESTRATÉGIAS:</p>
            <div className="min-h-[60px] border-b border-gray-400 pb-2">
              <p className="whitespace-pre-wrap text-sm text-justify leading-relaxed">
                {relatorio.estrategias}
              </p>
            </div>
          </div>

          <div>
            <p className="mb-1 font-bold text-black">RECURSOS:</p>
            <div className="min-h-[60px] border-b border-gray-400 pb-2">
              <p className="whitespace-pre-wrap text-sm text-justify leading-relaxed">
                {relatorio.recursos}
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

      {/* Estilos para Impressão */}
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }
          
          html, body {
            height: 100% !important;
            overflow: visible !important;
          }
        }
      `}</style>
    </div>
  );
}