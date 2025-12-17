'use client'

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Plus, 
  Eye, 
  Trash2, 
  UserCircle, 
  FileText 
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import ProfessorSidebar from "@/components/Sidebar/ProfessorSidebar";
import { format } from "date-fns";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import ModalVisualizarEditarRelatorio from "@/components/ModalVisualizarEditarRelatorio";

import { 
  listarRelatorios, 
  criarRelatorio, 
  atualizarRelatorio, 
  deletarRelatorio 
} from "@/services/RelatorioService";

export default function RelatoriosAlunoListaPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  const alunoIdFromUrl = params?.alunoId ? String(params.alunoId) : null;
  const turmaId = searchParams?.get('turmaId');

  const [relatorios, setRelatorios] = useState<any[]>([]);
  const [isExcluirDialogOpen, setIsExcluirDialogOpen] = useState(false);
  const [relatorioExcluindo, setRelatorioExcluindo] = useState<any | null>(null);
  const [isModalRelatorioOpen, setIsModalRelatorioOpen] = useState(false);
  const [relatorioSelecionado, setRelatorioSelecionado] = useState<any | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const carregarRelatorios = useCallback(async () => {
    if (!alunoIdFromUrl) return;
    try {
        const dados = await listarRelatorios();
        const filtrados = dados.filter((r: any) => 
            Number(r.alunoId) === Number(alunoIdFromUrl)
        );
        setRelatorios(filtrados);
    } catch (error) {
        toast.error("Erro ao carregar relatórios.");
    }
  }, [alunoIdFromUrl]);

  useEffect(() => {
    carregarRelatorios();
  }, [carregarRelatorios]);

  const handleSalvarRelatorio = async (dadosDoModal: any) => {
    try {
      const isNovo = !dadosDoModal.id || 
                     dadosDoModal.id === 0 || 
                     Number(dadosDoModal.id) > 999999;

      const payload = {
        atividades: dadosDoModal.atividades,
        habilidades: dadosDoModal.habilidades,
        estrategias: dadosDoModal.estrategias,
        recursos: dadosDoModal.recursos,
        alunoId: Number(alunoIdFromUrl),
        turmaId: Number(turmaId) || 1,
        professorId: 1 
      };

      if (isNovo) {
        await criarRelatorio(payload);
        toast.success("Relatório criado com sucesso!");
      } else {
        await atualizarRelatorio(dadosDoModal.id, payload);
        toast.success("Relatório atualizado com sucesso!");
      }

      setIsModalRelatorioOpen(false);
      setRelatorioSelecionado(null);
      
      setTimeout(() => carregarRelatorios(), 400);
    } catch (error: any) {
        const mensagemErro = error.response?.data?.message || error.message;
        toast.error("Erro ao processar: " + mensagemErro);
    }
  };

  const handleExcluirRelatorio = async () => {
    if (!relatorioExcluindo) return;
    try {
        await deletarRelatorio(relatorioExcluindo.id);
        toast.success("Relatório excluído.");
        setIsExcluirDialogOpen(false);
        carregarRelatorios();
    } catch (error) {
        toast.error("Erro ao excluir.");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#E5E5E5]">
      <ProfessorSidebar
        activeTab="alunos"
        onTabChange={(tab) => tab === "inicio" ? router.push("/professor") : router.push("/professor/turmas")}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <main className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <div className="p-4 md:p-8">
          <div className="mx-auto max-w-5xl space-y-6">
            <Button onClick={() => router.back()} variant="outline" className="border-2 border-[#B2D7EC] text-[#0D4F97]">
              <ArrowLeft className="mr-2 h-5 w-5" /> Voltar
            </Button>

            <header className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-[#0D4F97]" />
                <h1 className="text-2xl font-bold text-[#0D4F97]">Relatórios Individuais</h1>
              </div>
              <Button 
                onClick={() => { 
                    setRelatorioSelecionado({ id: 0 }); 
                    setIsModalRelatorioOpen(true); 
                }} 
                className="bg-[#0D4F97] hover:bg-[#FFD000] hover:text-[#0D4F97]"
              >
                <Plus className="mr-2 h-5 w-5" /> Novo Relatório
              </Button>
            </header>

            <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-[#B2D7EC]/20 text-[#0D4F97] font-bold">
                      <tr>
                        <th className="p-4">Data</th>
                        <th className="p-4">Atividades</th>
                        <th className="p-4">Habilidades</th>
                        <th className="p-4 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#B2D7EC]">
                      {relatorios.length === 0 ? (
                        <tr><td colSpan={4} className="p-8 text-center text-gray-500">Nenhum relatório encontrado.</td></tr>
                      ) : (
                        relatorios.map((rel) => (
                          <tr key={rel.id} className="hover:bg-white transition-colors">
                            <td className="p-4 font-medium">
                                {rel.createdAt ? format(new Date(rel.createdAt), "dd/MM/yyyy") : "---"}
                            </td>
                            <td className="p-4 text-sm max-w-[200px] truncate">{rel.atividades}</td>
                            <td className="p-4 text-sm max-w-[200px] truncate">{rel.habilidades}</td>
                            <td className="p-4 flex justify-center gap-2">
                              <Button 
                                onClick={() => { 
                                    setRelatorioSelecionado(rel); 
                                    setIsModalRelatorioOpen(true); 
                                }} 
                                variant="ghost" size="sm" className="text-[#0D4F97]"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                onClick={() => { 
                                    setRelatorioExcluindo(rel); 
                                    setIsExcluirDialogOpen(true); 
                                }} 
                                variant="ghost" size="sm" className="text-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {isModalRelatorioOpen && (
        <ModalVisualizarEditarRelatorio
          isOpen={isModalRelatorioOpen}
          onClose={() => {
              setIsModalRelatorioOpen(false);
              setRelatorioSelecionado(null);
          }}
          relatorio={relatorioSelecionado}
          onSalvar={handleSalvarRelatorio}
        />
      )}

      <Dialog open={isExcluirDialogOpen} onOpenChange={setIsExcluirDialogOpen}>
        <DialogContent>
          <DialogTitle>Excluir Relatório</DialogTitle>
          <DialogDescription>Deseja realmente excluir este registro?</DialogDescription>
          <div className="flex justify-end gap-3 mt-4">
            <Button onClick={() => setIsExcluirDialogOpen(false)} variant="outline">Cancelar</Button>
            <Button onClick={handleExcluirRelatorio} className="bg-red-600 text-white">Excluir</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}