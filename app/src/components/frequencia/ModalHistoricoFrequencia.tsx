'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  alunoNome: string;
  historico: any[];
  loading: boolean;
  turma?: any;
}

export default function ModalHistoricoFrequencia({
  isOpen,
  onClose,
  alunoNome,
  historico,
  loading,
  turma
}: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-xl w-full pt-10 sm:pt-6">
        <DialogHeader>
  <DialogTitle>
    Histórico de Frequência - {alunoNome || ""}
    {turma && (
      <span className="block text-sm font-normal text-gray-500 mt-1">
        Turma: {turma.tipo || "—"} - {turma.ano} ({turma.turno})
      </span>
    )}
  </DialogTitle>
  <DialogDescription>
    Registros individuais de presença do aluno.
  </DialogDescription>
</DialogHeader>

        {loading ? (
          <div className="py-6 text-center text-[#0D4F97]">
            Carregando histórico...
          </div>
        ) : historico.length === 0 ? (
          <div className="py-6 text-center text-[#222222]">
            Nenhum registro encontrado.
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto mt-4 space-y-2">
            {historico.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b py-2"
              >
                <div>
                  <p className="font-medium text-[#0D4F97]">{item.data}</p>
                  <p className="text-sm text-[#222222]">
                    {item.descricao || "Sem descrição"}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    item.status === "Presente"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        )}

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}