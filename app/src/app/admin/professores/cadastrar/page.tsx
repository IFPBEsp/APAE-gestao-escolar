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

export default function CadastrarProfessorPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    birthDate: "",
    specialization: "",
    hireDate: "",
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    toast.success("Professor cadastrado com sucesso!");
    setFormData({
      name: "",
      email: "",
      phone: "",
      birthDate: "",
      specialization: "",
      hireDate: "",
    });
    
    router.push("/admin/professores");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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

        {/* ✅ AQUI ESTÁ FALTANDO O CARD COM O FORMULÁRIO! */}
        <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#B2D7EC]/20">
                <User className="h-6 w-6 text-[#0D4F97]" />
              </div>
              <div>
                <CardTitle className="text-[#0D4F97]">
                  Cadastrar Professor
                </CardTitle>
                <CardDescription className="text-[#222222]">
                  Adicione um novo professor ao sistema
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#0D4F97]">
                  Nome Completo
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Digite o nome do professor"
                  className="border-2 border-[#B2D7EC] focus:border-[#0D4F97] focus:ring-[#0D4F97]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#0D4F97]">
                  E-mail
                </Label>
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

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[#0D4F97]">
                  Telefone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="(00) 00000-0000"
                  className="border-2 border-[#B2D7EC] focus:border-[#0D4F97] focus:ring-[#0D4F97]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate" className="text-[#0D4F97]">
                  Data de Nascimento
                </Label>
                <Input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={handleChange}
                  required
                  className="border-2 border-[#B2D7EC] focus:border-[#0D4F97] focus:ring-[#0D4F97]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialization" className="text-[#0D4F97]">
                  Especialidade
                </Label>
                <Input
                  id="specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Educação Especial"
                  className="border-2 border-[#B2D7EC] focus:border-[#0D4F97] focus:ring-[#0D4F97]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hireDate" className="text-[#0D4F97]">
                  Data de Contratação
                </Label>
                <Input
                  id="hireDate"
                  name="hireDate"
                  type="date"
                  value={formData.hireDate}
                  onChange={handleChange}
                  required
                  className="border-2 border-[#B2D7EC] focus:border-[#0D4F97] focus:ring-[#0D4F97]"
                />
              </div>

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
        {/* ✅ FIM DO CARD QUE ESTAVA FALTANDO */}
      </div>
    </div>
  );
}