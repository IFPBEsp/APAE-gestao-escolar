import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { UserCircle, Loader2 } from "lucide-react";

interface EstudanteCardProps {
    nome: string;
    turma: string;
    turno?: string;
    turmaId?: string | number | null;
    alunoId?: string | number | null;
    loading?: boolean;
    action?: React.ReactNode;
}

export function EstudanteCard({
    nome,
    turma,
    turno,
    turmaId,
    alunoId,
    loading = false,
    action,
}: EstudanteCardProps) {
    return (
        <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md mb-6">
            <CardContent className="p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between w-full">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-[#B2D7EC]/20">
                            <UserCircle className="h-10 w-10 text-[#0D4F97]" />
                        </div>
                        <div className="min-w-0 flex-1">
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="h-6 w-6 animate-spin text-[#0D4F97]" />
                                    <span className="text-[#0D4F97]">Carregando dados...</span>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-[#0D4F97] text-xl font-bold break-words">{nome}</h2>
                                    <p className="text-[#222222] break-words">
                                        {turma}
                                        {turno && !turma.includes(turno) && ` - ${turno}`}
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                    
                    {action && (
                        <div className="flex-shrink-0">
                            {action}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
