"use client";

import { useRouter } from "next/navigation";
import CadastrarProfessor from "../../components/CadastrarProfessor";

export default function ProfessoresPage() {
    const router = useRouter();
    return <CadastrarProfessor onBack={() => router.back()} />;
}
