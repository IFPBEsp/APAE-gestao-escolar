'use client'

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Power, UserCircle, BookOpen } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import api from "@/services/api";
import ModalEditarProfessor from "@/components/ModalEditarProfessor";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Professor } from "@/types/professor";

export default function DetalhesProfessor() {
  const router = useRouter();
  const params = useParams();
  const professorId = params?.id ? Number(params.id) : null;

  const [professor, setProfessor] = useState<Professor | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isModalEditarOpen, setIsModalEditarOpen] = useState(false);

  useEffect(() => {
    if (professorId) {
      loadProfessor();
    }
  }, [professorId]);

  const loadProfessor = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/professores/${professorId}`);
      setProfessor(response.data);
    } catch (error) {
      console.error("Erro ao carregar professor:", error);
      toast.error("Erro ao carregar dados do professor");
      router.push("/admin/professores");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!professor) return;

    try {
      const endpoint = professor.ativo
        ? `/professores/${professor.id}/inativar`
        : `/professores/${professor.id}/ativar`;

      const response = await api.patch(endpoint);
      setProfessor(response.data);
      setIsAlertOpen(false);

      toast.success(
        `Professor ${professor.ativo ? "inativado" : "ativado"} com sucesso!`
      );
    } catch (error) {
      console.error("Erro ao alterar status:", error);
      toast.error("Erro ao alterar status do professor");
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd/MM/yyyy", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-[#0D4F97]">Carregando...</p>
      </div>
    );
  }

  if (!professor) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-[#222222]">Professor não encontrado</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="space-y-6">
          {/* Header com Botão Voltar */}
          <Button
            onClick={() => router.push("/admin/professores")}
            variant="outline"
            className="mb-6 justify-center"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Voltar
          </Button>

          {/* Título */}
          <div>
            <h1 className="text-3xl font-bold text-[#0D4F97] mb-2">
              Detalhes do Professor
            </h1>
            <p className="text-[#222222]">
              Visualize e gerencie as informações do professor
            </p>
          </div>

          {/* Card Principal com Informações */}
          <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
            <CardContent className="p-8">
              {/* Nome do Professor e Status */}
              <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center mt-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#B2D7EC]/20">
                    <UserCircle className="h-10 w-10 text-[#0D4F97]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#0D4F97]">
                      {professor.nome}
                    </h2>
                    <span
                      className={`mt-1 inline-block rounded-full px-3 py-1 ${professor.ativo
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                        }`}
                    >
                      {professor.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Grid de Informações */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Email */}
                <div>
                  <p className="text-sm font-semibold text-[#0D4F97] mb-1">
                    E-mail
                  </p>
                  <p className="text-[#222222]">{professor.email || "—"}</p>
                </div>

                {/* Telefone */}
                <div>
                  <p className="text-sm font-semibold text-[#0D4F97] mb-1">
                    Telefone
                  </p>
                  <p className="text-[#222222]">{professor.telefone || "—"}</p>
                </div>

                {/* Formação */}
                <div>
                  <p className="text-sm font-semibold text-[#0D4F97] mb-1">
                    Formação
                  </p>
                  <p className="text-[#222222]">{professor.formacao || "—"}</p>
                </div>

                {/* Data de Contratação */}
                <div>
                  <p className="text-sm font-semibold text-[#0D4F97] mb-1">
                    Data de Contratação
                  </p>
                  <p className="text-[#222222]">
                    {professor.dataContratacao
                      ? formatDate(professor.dataContratacao)
                      : "—"}
                  </p>
                </div>

                {/* Número de Turmas */}
                <div>
                  <p className="text-sm font-semibold text-[#0D4F97] mb-1">
                    Número de Turmas
                  </p>
                  <p className="text-[#222222]">
                    {professor.turmas?.length || 0}
                  </p>
                </div>
              </div>

              {/* Turmas que Leciona */}
              <div className="mt-6 border-t-2 border-[#B2D7EC] pt-6">
                <div className="mb-3 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-[#0D4F97]" />
                  <h3 className="text-lg font-semibold text-[#0D4F97]">
                    Turmas que Leciona
                  </h3>
                </div>
                {professor.turmas && professor.turmas.length > 0 ? (
                  <div className="space-y-2">
                    {professor.turmas.map((turmaNome, index) => (
                      <div
                        key={index}
                        className="rounded-lg border-2 border-[#B2D7EC] bg-white p-3 text-[#222222]"
                      >
                        {turmaNome}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#222222]">Nenhuma turma vinculada</p>
                )}
              </div>

              {/* Botões de Ação */}
              <div className="mt-8 flex flex-col gap-3 border-t-2 border-[#B2D7EC] pt-6 md:flex-row">
                <Button
                  variant="primary"
                  onClick={() => setIsModalEditarOpen(true)}
                  className="w-full flex-1"
                >
                  <Edit className="mr-2 h-5 w-5" />
                  Editar Professor
                </Button>
                
                <Button
                  variant={professor.ativo ? "danger" : "primary"}
                  onClick={() => setIsAlertOpen(true)}
                  className="w-full flex-1"
                >
                  <Power className="mr-2 h-5 w-5" />
                  {professor.ativo ? "Inativar Professor" : "Ativar Professor"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Alert Dialog de Confirmação */}
          <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {professor.ativo ? "Inativar" : "Ativar"} Professor?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {professor.ativo
                    ? "Ao inativar este professor, ele não poderá mais acessar o sistema. Você poderá reativá-lo posteriormente."
                    : "Ao ativar este professor, ele voltará a ter acesso ao sistema."}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel asChild>
                  <Button variant="outline">
                    Cancelar
                  </Button>
                </AlertDialogCancel>

                <AlertDialogAction asChild>
                  <Button
                    variant={professor.ativo ? "danger" : "primary"}
                    onClick={handleToggleStatus}
                  >
                    Confirmar
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Modal de Edição de Professor */}
          <ModalEditarProfessor
            isOpen={isModalEditarOpen}
            onClose={() => setIsModalEditarOpen(false)}
            professor={professor}
            onUpdate={loadProfessor}
          />
        </div>
      </div>
    </div>
  );
}
