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
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-4 mt-4">
                        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-[#B2D7EC]/20">
                            <UserCircle className="h-10 w-10 text-[#0D4F97]" />
                        </div>
                        <div>
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="h-6 w-6 animate-spin text-[#0D4F97]" />
                                    <span className="text-[#0D4F97]">Carregando dados...</span>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-[#0D4F97] text-xl font-bold">{nome}</h2>
                                    <p className="text-[#222222]">
                                        {turma}
                                        {turno && !turma.includes(turno) && ` - ${turno}`}
                                    </p>
                                    {/* IDs removidos conforme solicitado */}
                                </>
                            )}
                        </div>
                    </div>
                    {action && <div className="mt-4 md:mt-0">{action}</div>}
                </div>
            </CardContent>
        </Card>
    );
}
