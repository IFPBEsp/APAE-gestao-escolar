'use client'

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft, Loader2, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { registerProfessor } from "@/services/ProfessorService";

export default function CadastrarProfessorPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    endereco: "",
    dataNascimento: "",
    formacao: "",
    dataContratacao: "",
  });
  const [errors, setErrors] = useState({
    cpf: "",
    endereco: "",
  });

  const router = useRouter();

  // 🧮 Máscara de CPF
  const applyCPFMask = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9)
      return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(
      6,
      9
    )}-${numbers.slice(9, 11)}`;
  };

  // ✅ Validação de CPF
  const validateCPF = (cpf: string) => {
    const numbers = cpf.replace(/\D/g, "");
    if (numbers.length !== 11 || /^(\d)\1+$/.test(numbers)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(numbers[i]) * (10 - i);
    let remainder = (sum * 10) % 11;
    if (remainder === 10) remainder = 0;
    if (remainder !== parseInt(numbers[9])) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(numbers[i]) * (11 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10) remainder = 0;
    return remainder === parseInt(numbers[10]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "cpf") {
      const masked = applyCPFMask(value);
      setFormData((prev) => ({ ...prev, cpf: masked }));
      if (errors.cpf) setErrors((prev) => ({ ...prev, cpf: "" }));
    } else if (name === "endereco") {
      setFormData((prev) => ({ ...prev, endereco: value }));
      if (errors.endereco) setErrors((prev) => ({ ...prev, endereco: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🧩 Validação frontend
    if (!validateCPF(formData.cpf)) {
      setErrors((prev) => ({ ...prev, cpf: "CPF inválido" }));
      toast.error("Por favor, corrija o CPF antes de enviar.");
      return;
    }
    if (!formData.endereco.trim()) {
      setErrors((prev) => ({ ...prev, endereco: "Endereço é obrigatório" }));
      toast.error("Por favor, preencha o endereço.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await registerProfessor(formData);
      console.log("Professor cadastrado (API):", response);

      toast.success("Professor cadastrado com sucesso!");
      setFormData({
        nome: "",
        cpf: "",
        email: "",
        telefone: "",
        endereco: "",
        dataNascimento: "",
        formacao: "",
        dataContratacao: "",
      });
      setErrors({ cpf: "", endereco: "" });
      router.push("/admin/professores");
    } catch (error: any) {
      console.error("Erro no cadastro:", error);
      toast.error(error.message || "Erro ao cadastrar o professor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#E5E5E5] p-4 md:p-8">
      <div className="mx-auto max-w-2xl">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-[#0D4F97] transition-colors hover:text-[#FFD000]"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Voltar</span>
        </button>

        <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#B2D7EC]/20">
                <User className="h-6 w-6 text-[#0D4F97]" />
              </div>
              <div>
                <CardTitle className="text-[#0D4F97]">Cadastrar Professor</CardTitle>
                <CardDescription className="text-[#222222]">
                  Adicione um novo professor ao sistema
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-[#0D4F97]">Nome Completo *</Label>
                <Input
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  placeholder="Digite o nome do professor"
                  className="border-2 border-[#B2D7EC] focus:border-[#0D4F97] focus:ring-[#0D4F97]"
                />
              </div>

              {/* CPF */}
              <div className="space-y-2">
                <Label htmlFor="cpf" className="text-[#0D4F97]">CPF *</Label>
                <Input
                  id="cpf"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  required
                  maxLength={14}
                  placeholder="000.000.000-00"
                  className={`border-2 ${
                    errors.cpf
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-[#B2D7EC] focus:border-[#0D4F97] focus:ring-[#0D4F97]"
                  }`}
                />
                {errors.cpf && <p className="text-red-500">{errors.cpf}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#0D4F97]">E-mail *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="exemplo@email.com"
                  className="border-2 border-[#B2D7EC] focus:border-[#0D4F97] focus:ring-[#0D4F97]"
                />
              </div>

              {/* Telefone */}
              <div className="space-y-2">
                <Label htmlFor="telefone" className="text-[#0D4F97]">Telefone *</Label>
                <Input
                  id="telefone"
                  name="telefone"
                  type="tel"
                  value={formData.telefone}
                  onChange={handleChange}
                  required
                  placeholder="(00) 00000-0000"
                  className="border-2 border-[#B2D7EC] focus:border-[#0D4F97] focus:ring-[#0D4F97]"
                />
              </div>

              {/* Endereço */}
              <div className="space-y-2">
                <Label htmlFor="endereco" className="text-[#0D4F97]">Endereço *</Label>
                <Input
                  id="endereco"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleChange}
                  required
                  placeholder="Digite o endereço completo"
                  className={`border-2 ${
                    errors.endereco
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-[#B2D7EC] focus:border-[#0D4F97] focus:ring-[#0D4F97]"
                  }`}
                />
                {errors.endereco && <p className="text-red-500">{errors.endereco}</p>}
              </div>

              {/* Data de Nascimento */}
              <div className="space-y-2">
                <Label htmlFor="dataNascimento" className="text-[#0D4F97]">Data de Nascimento *</Label>
                <Input
                  id="dataNascimento"
                  name="dataNascimento"
                  type="date"
                  value={formData.dataNascimento}
                  onChange={handleChange}
                  required
                  className="border-2 border-[#B2D7EC] focus:border-[#0D4F97] focus:ring-[#0D4F97]"
                />
              </div>

              {/* Formação */}
              <div className="space-y-2">
                <Label htmlFor="formacao" className="text-[#0D4F97]">Formação *</Label>
                <Input
                  id="formacao"
                  name="formacao"
                  value={formData.formacao}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Licenciatura em Educação Especial"
                  className="border-2 border-[#B2D7EC] focus:border-[#0D4F97] focus:ring-[#0D4F97]"
                />
              </div>

              {/* Data de Contratação */}
              <div className="space-y-2">
                <Label htmlFor="dataContratacao" className="text-[#0D4F97]">Data de Contratação *</Label>
                <Input
                  id="dataContratacao"
                  name="dataContratacao"
                  type="date"
                  value={formData.dataContratacao}
                  onChange={handleChange}
                  required
                  className="border-2 border-[#B2D7EC] focus:border-[#0D4F97] focus:ring-[#0D4F97]"
                />
              </div>

              {/* Botões */}
              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="h-12 justify-center border-2 border-[#B2D7EC] px-4 text-[#0D4F97] hover:bg-[#B2D7EC]/20"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 min-w-[150px] justify-center bg-[#0D4F97] px-4 text-white hover:bg-[#FFD000] hover:text-[#0D4F97]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Cadastrando...
                    </>
                  ) : (
                    "Cadastrar"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
