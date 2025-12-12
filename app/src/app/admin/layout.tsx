"use client"

import type React from "react"
import { useRouter, usePathname } from "next/navigation"
import { Home, Users, UserCog, GraduationCap, LogOut } from "lucide-react"
import Image from "next/image"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  const menu = [
    { label: "Início", icon: Home, route: "/admin" },
    { label: "Turmas", icon: Users, route: "/admin/turmas" },
    { label: "Professores", icon: GraduationCap, route: "/admin/professores" },
    { label: "Alunos", icon: UserCog, route: "/admin/alunos" },
  ]

  return (
    <div className="h-screen bg-[#E5E5E5]">

      <aside className="fixed top-0 left-0 w-64 h-screen bg-[#B2D7EC] z-[9999] flex flex-col justify-between py-6 shadow-xl rounded-r-md">
        <div>
          <div className="flex flex-col items-center mb-8">
            <Image src="/apae-logo.png" alt="Logo APAE" width={60} height={60} className="mb-2" />
            <p className="font-semibold text-[#0D4F97]">APAE Esperança</p>
            <p className="text-xs text-[#0D4F97]/70">Painel do Administrador</p>
          </div>

          <nav className="flex flex-col gap-1 px-4">
            {menu.map((item) => {
              const Icon = item.icon
              const active = pathname === item.route

              return (
                <button
                  key={item.route}
                  onClick={() => router.push(item.route)}
                  className={`
                    flex items-center gap-3 px-4 py-2 rounded-lg text-left transition
                    ${active ? "bg-[#0D4F97] text-white" : "text-[#0D4F97] hover:bg-[#0D4F97]/20"}
                  `}
                >
                  <Icon size={18} strokeWidth={2} />
                  {item.label}
                </button>
              )
            })}
          </nav>
        </div>

        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 mx-4 px-4 py-2 rounded-lg text-[#0D4F97] border border-[#0D4F97]/30 hover:bg-red-100 hover:text-red-600 transition"
        >
          <LogOut size={18} />
          Sair
        </button>
      </aside>

      <main className="ml-64 h-screen p-8">
        {children}
      </main>

    </div>
  )
}
