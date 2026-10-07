'use client'

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { atualizarProfessor, ativarProfessorporId } from "@/services/ProfessorService";
import { Endereco, Professor } from "@/types/professor";

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
  const enderecoVazio: Endereco = {
    cidade: "",
    cep: "",
    estado: "",
    bairro: "",
    rua: "",
    numero: "",
    complemento: "",
  };

  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    endereco: enderecoVazio,
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
      endereco: {
        cidade: professor.endereco?.cidade || "",
        cep: professor.endereco?.cep || "",
        estado: professor.endereco?.estado || "",
        bairro: professor.endereco?.bairro || "",
        rua: professor.endereco?.rua || "",
        numero: professor.endereco?.numero || "",
        complemento: professor.endereco?.complemento || "",
      },
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

  const handleEnderecoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      endereco: {
        ...prev.endereco,
        [name]: value,
      },
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
        endereco: formData.endereco,
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
          <DialogTitle className="text-2xl font-bold text-[#0D4F97]">
            Editar Professor
          </DialogTitle>
          <DialogDescription className="text-[#222222]">
            Atualize as informações do professor conforme necessário.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Pessoais e de Contato */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#0D4F97]">
              Informações Pessoais e de Contato
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="nome" className="text-[#0D4F97]">
                  Nome <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  className="h-12 border-2 border-[#B2D7EC]"
                />
              </div>

              <div>
                <Label htmlFor="cpf" className="text-[#0D4F97]">
                  CPF <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="cpf"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  required
                  maxLength={14}
                  placeholder="123.456.789-00"
                  className="h-12 border-2 border-[#B2D7EC]"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-[#0D4F97]">
                  E-mail <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="h-12 border-2 border-[#B2D7EC]"
                />
              </div>

              <div>
                <Label htmlFor="telefone" className="text-[#0D4F97]">
                  Telefone
                </Label>
                <Input
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  placeholder="(11) 98765-4321"
                  className="h-12 border-2 border-[#B2D7EC]"
                />
              </div>

              <div>
                <Label htmlFor="dataNascimento" className="text-[#0D4F97]">
                  Data de Nascimento
                </Label>
                <Input
                  id="dataNascimento"
                  type="date"
                  name="dataNascimento"
                  value={formData.dataNascimento}
                  onChange={handleChange}
                  className="h-12 border-2 border-[#B2D7EC]"
                />
              </div>

              <div>
                <Label htmlFor="dataContratacao" className="text-[#0D4F97]">
                  Data de Contratação
                </Label>
                <Input
                  id="dataContratacao"
                  type="date"
                  name="dataContratacao"
                  value={formData.dataContratacao}
                  onChange={handleChange}
                  className="h-12 border-2 border-[#B2D7EC]"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="formacao" className="text-[#0D4F97]">
                  Formação
                </Label>
                <Input
                  id="formacao"
                  name="formacao"
                  value={formData.formacao}
                  onChange={handleChange}
                  placeholder="Pedagogia Especial"
                  className="h-12 border-2 border-[#B2D7EC]"
                />
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#0D4F97]">
              Endereço
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="cep" className="text-[#0D4F97]">
                  CEP <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="cep"
                  name="cep"
                  value={formData.endereco.cep}
                  onChange={handleEnderecoChange}
                  required
                  className="h-12 border-2 border-[#B2D7EC]"
                />
              </div>

              <div>
                <Label htmlFor="estado" className="text-[#0D4F97]">
                  Estado <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="estado"
                  name="estado"
                  value={formData.endereco.estado}
                  onChange={handleEnderecoChange}
                  required
                  className="h-12 border-2 border-[#B2D7EC]"
                />
              </div>

              <div>
                <Label htmlFor="cidade" className="text-[#0D4F97]">
                  Cidade <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="cidade"
                  name="cidade"
                  value={formData.endereco.cidade}
                  onChange={handleEnderecoChange}
                  required
                  className="h-12 border-2 border-[#B2D7EC]"
                />
              </div>

              <div>
                <Label htmlFor="bairro" className="text-[#0D4F97]">
                  Bairro <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="bairro"
                  name="bairro"
                  value={formData.endereco.bairro}
                  onChange={handleEnderecoChange}
                  required
                  className="h-12 border-2 border-[#B2D7EC]"
                />
              </div>

              <div>
                <Label htmlFor="rua" className="text-[#0D4F97]">
                  Rua <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="rua"
                  name="rua"
                  value={formData.endereco.rua}
                  onChange={handleEnderecoChange}
                  required
                  className="h-12 border-2 border-[#B2D7EC]"
                />
              </div>

              <div>
                <Label htmlFor="numero" className="text-[#0D4F97]">
                  Número <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="numero"
                  name="numero"
                  value={formData.endereco.numero}
                  onChange={handleEnderecoChange}
                  required
                  className="h-12 border-2 border-[#B2D7EC]"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="complemento" className="text-[#0D4F97]">
                  Complemento
                </Label>
                <Input
                  id="complemento"
                  name="complemento"
                  value={formData.endereco.complemento || ""}
                  onChange={handleEnderecoChange}
                  className="h-12 border-2 border-[#B2D7EC]"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-3">
            {!professor.ativo && (
              <Button
                type="button"
                variant="outline"
                onClick={handleReativar}
                disabled={isSubmitting}
                className="h-12"
              >
                Reativar Professor
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-12"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="h-12"
            >
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}