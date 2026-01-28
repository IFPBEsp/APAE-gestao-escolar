'use client';

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface BotaoVoltarProps {
  to?: string;
}

export default function BotaoVoltar({ to = "/" }: BotaoVoltarProps) {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      onClick={() => router.push(to)}
      className="flex items-center gap-2"
    >
      <ArrowLeft size={20} />
      Voltar
    </Button>
  );
}
