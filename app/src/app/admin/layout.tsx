"use client"

import DashboardLayout, { MenuItem } from "@/components/Layout/DashboardLayout"
import { Home, Users, User, GraduationCap } from "lucide-react"

const adminMenu: MenuItem[] = [
  { label: "Início", icon: Home, href: "/admin" },
  { label: "Turmas", icon: Users, href: "/admin/turmas" },
  { label: "Professores", icon: GraduationCap, href: "/admin/professores" },
  { label: "Alunos", icon: User, href: "/admin/alunos" },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout
      menuItems={adminMenu}
      title="APAE Esperança"
      subtitle="Painel do Administrador"
    >
      {children}
    </DashboardLayout>
  )
}
