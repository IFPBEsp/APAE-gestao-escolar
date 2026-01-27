'use client';

import DashboardLayout, { MenuItem } from "@/components/Layout/DashboardLayout";
import { Home, BookOpen } from "lucide-react";

const professorMenu: MenuItem[] = [
    {
        label: "Início",
        icon: Home,
        href: "/professor"
    },
    {
        label: "Turmas",
        icon: BookOpen,
        href: "/professor/turmas"
    },
];

export default function ProfessorLayout({ children }: { children: React.ReactNode }) {
    return (
        <DashboardLayout
            menuItems={professorMenu}
            title="APAE Esperança"
            subtitle="Painel do Professor"
        >
            {children}
        </DashboardLayout>
    );
}
