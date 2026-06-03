'use client'

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { atualizarProfessor, ativarProfessorporId } from "@/services/ProfessorService";
import { Professor } from "@/types/professor";

interface ModalEditarProfessorProps {
  isOpen: boolean;
  onClose: () => void;
  professor: Professor;
  onUpdate?: () => void;
}

export default function ModalEditarProfessor({
  isOpen,
  onClose,
  professor,
  onUpdate,
}: ModalEditarProfessorProps) {
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    endereco: "",
    dataNascimento: "",
    formacao: "",
    dataContratacao: "",
    ativo: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const extrairData = (dataString?: string) => dataString ? dataString.split("T")[0] : "";

  useEffect(() => {
    if (!professor || !isOpen) return;
    setFormData({
      nome: professor.nome || "",
      cpf: professor.cpf || "",
      email: professor.email || "",
      telefone: professor.telefone || "",
      endereco: professor.endereco || "",
      dataNascimento: extrairData(professor.dataNascimento),
      formacao: professor.formacao || "",
      dataContratacao: extrairData(professor.dataContratacao),
      ativo: professor.ativo,
    });
  }, [professor, isOpen]);

  const applyCPFMask = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "cpf" ? applyCPFMask(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        dataNascimento: formData.dataNascimento || null,
        dataContratacao: formData.dataContratacao || null,
        telefone: formData.telefone || null,
        endereco: formData.endereco || null,
        formacao: formData.formacao || null,
      };

      await atualizarProfessor(professor.id, payload);
      toast.success("Professor atualizado com sucesso!");
      onUpdate?.();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Erro ao atualizar professor");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReativar = async () => {
    setIsSubmitting(true);
    try {
      await ativarProfessorporId(professor.id);
      toast.success("Professor reativado com sucesso!");
      onUpdate?.();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Erro ao reativar professor");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#0D4F97] text-xl">
            Editar Professor
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input name="nome" value={formData.nome} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>CPF</Label>
              <Input name="cpf" value={formData.cpf} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input name="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input name="telefone" value={formData.telefone} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>Data de nascimento</Label>
              <Input type="date" name="dataNascimento" value={formData.dataNascimento} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>Data de contratação</Label>
              <Input type="date" name="dataContratacao" value={formData.dataContratacao} onChange={handleChange} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Formação</Label>
              <Input name="formacao" value={formData.formacao} onChange={handleChange} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Endereço</Label>
              <Input name="endereco" value={formData.endereco} onChange={handleChange} />
            </div>
          </div>

          <DialogFooter className="gap-2">
            {!professor.ativo && (
              <Button type="button" variant="outline" onClick={handleReativar} disabled={isSubmitting}>
                Reativar Professor
              </Button>
            )}
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
