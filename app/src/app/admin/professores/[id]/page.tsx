'use client'

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Edit,
  Power,
  UserCircle,
  BookOpen,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  Users,
  FileText,
  MapPin,
  CalendarDays,
} from "lucide-react";
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
import { format, isValid, parseISO } from "date-fns";
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
  const [isSubmittingToggle, setIsSubmittingToggle] = useState(false);

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
      setIsSubmittingToggle(true);
      const endpoint = professor.ativo
        ? `/professores/${professor.id}/inativar`
        : `/professores/${professor.id}/ativar`;

      const response = await api.patch(endpoint);
      setProfessor(response.data);
      setIsAlertOpen(false);

      toast.success(
        `Professor ${professor.ativo ? "inativado" : "ativado"} com sucesso!`
      );
    } catch (error: any) {
      console.error("Erro ao alterar status:", error);
      toast.error(error.message || "Erro ao alterar status do professor");
    } finally {
      setIsSubmittingToggle(false);
    }
  };

  const formatDate = (dateString: string) => {

      const date = parseISO(dateString);
      if (!isValid(date)) return dateString;
      return format(date, "dd/MM/yyyy", { locale: ptBR });

  };

  const activateButtonStyles = "bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700";

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
    <div className="w-full min-h-screen bg-[#E5E5E5]">
      <div className="p-4 md:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#0D4F97] mb-2">
                Detalhes do Professor
              </h1>
              <p className="text-[#222222]">
                Visualize e gerencie as informações do professor
              </p>
            </div>
            <Button
              onClick={() => router.push("/admin/professores")}
              variant="outline"
              className="w-full md:w-auto"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Voltar
            </Button>
          </div>

          {/* Card Principal com Informações */}
          <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
            <CardContent className="p-8">
              {/* Nome do Professor e Status */}
              <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-4">
                <div className="flex items-center gap-3 w-full">
                  <div className="h-10 w-10 shrink-0 flex items-center justify-center">
                    <UserCircle className="h-10 w-10 text-[#0D4F97]" />
                  </div>
                  <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3 flex-1 min-w-0">
                    <h2 className="text-2xl font-bold text-[#0D4F97] truncate">
                      {professor.nome}
                    </h2>
                    <span
                      className={`inline-block rounded-full px-3 py-1 font-medium text-xs lg:text-sm w-fit ${professor.ativo
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                        }`}
                    >
                      {professor.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Grid de Informações */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-6 gap-x-8">
                {/* CPF */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#E8F3FF] rounded-md text-[#0D4F97]">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      CPF
                    </p>
                    <p className="text-[#222222]">
                      {professor.cpf || "—"}
                    </p>
                  </div>
                </div>

                {/* E-mail */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#E8F3FF] rounded-md text-[#0D4F97]">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      E-mail
                    </p>
                    <p className="text-[#222222]">
                      {professor.email || "—"}
                    </p>
                  </div>
                </div>

                {/* Telefone */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#E8F3FF] rounded-md text-[#0D4F97]">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Telefone
                    </p>
                    <p className="text-[#222222]">
                      {professor.telefone || "—"}
                    </p>
                  </div>
                </div>

                {/* Formação */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#E8F3FF] rounded-md text-[#0D4F97]">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Formação
                    </p>
                    <p className="text-[#222222]">
                      {professor.formacao || "—"}
                    </p>
                  </div>
                </div>

                {/* Data de Contratação */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#E8F3FF] rounded-md text-[#0D4F97]">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Data de Contratação
                    </p>
                    <p className="text-[#222222]">
                      {professor.dataContratacao
                        ? formatDate(professor.dataContratacao)
                        : "—"}
                    </p>
                  </div>
                </div>

                {/* Data de Nascimento */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#E8F3FF] rounded-md text-[#0D4F97]">
                    <CalendarDays className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Data de Nascimento
                    </p>
                    <p className="text-[#222222]">
                      {professor.dataNascimento
                        ? formatDate(professor.dataNascimento)
                        : "—"}
                    </p>
                  </div>
                </div>

                {/* Endereço */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#E8F3FF] rounded-md text-[#0D4F97]">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Endereço
                    </p>
                    <p className="text-[#222222]">
                      {professor.endereco || "—"}
                    </p>
                  </div>
                </div>

                {/* Número de Turmas */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#E8F3FF] rounded-md text-[#0D4F97]">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Número de Turmas
                    </p>
                    <p className="text-[#222222]">
                      {professor.turmas?.length || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Turmas que Leciona */}
              <div className="mt-6 border-t border-[#E2E8F0] pt-6">
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
              <div className="mt-8 flex flex-col gap-3 border-t border-[#E2E8F0] pt-6 md:flex-row">
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
                  className={`w-full flex-1 ${!professor.ativo ? activateButtonStyles : ""}`}
                  disabled={isSubmittingToggle}
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
                  <Button variant="outline" disabled={isSubmittingToggle}>
                    Cancelar
                  </Button>
                </AlertDialogCancel>

                <AlertDialogAction asChild>
                  <Button
                    variant={professor.ativo ? "danger" : "primary"}
                    className={!professor.ativo ? activateButtonStyles : ""}
                    onClick={handleToggleStatus}
                    disabled={isSubmittingToggle}
                  >
                    {isSubmittingToggle ? "Processando..." : "Confirmar"}
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
  );
}
