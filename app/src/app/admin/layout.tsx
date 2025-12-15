"use client"

import type React from "react"
import { useRouter, usePathname } from "next/navigation"
import { Home, Users, UserCog, GraduationCap, LogOut, Menu, X } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const menu = [
    { label: "Início", icon: Home, route: "/admin" },
    { label: "Turmas", icon: Users, route: "/admin/turmas" },
    { label: "Professores", icon: GraduationCap, route: "/admin/professores" },
    { label: "Alunos", icon: UserCog, route: "/admin/alunos" },
  ]

  return (
    <div className="min-h-screen bg-[#E5E5E5]">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed left-4 top-4 z-40 rounded-lg bg-[#0D4F97] p-2 text-white md:hidden"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Desktop & Mobile */}
      <aside className={`
        fixed top-0 left-0 h-screen bg-[#B2D7EC] z-50 flex flex-col justify-between py-6 shadow-xl rounded-r-md
        transition-transform duration-300 ease-in-out
        w-64
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div>
          {/* Close button for mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute right-4 top-4 text-[#0D4F97] md:hidden"
          >
            <X size={24} />
          </button>

          <div className="flex flex-col items-center mb-8 mt-8 md:mt-0">
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
                  onClick={() => {
                    router.push(item.route)
                    setSidebarOpen(false)
                  }}
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
          onClick={() => {
            router.push("/")
            setSidebarOpen(false)
          }}
          className="flex items-center gap-2 mx-4 px-4 py-2 rounded-lg text-[#0D4F97] border border-[#0D4F97]/30 hover:bg-red-100 hover:text-red-600 transition"
        >
          <LogOut size={18} />
          Sair
        </button>
      </aside>

      <main className="md:ml-64 min-h-screen p-4 md:p-8 pt-16 md:pt-8">
        {children}
      </main>

    </div>
  )
}
