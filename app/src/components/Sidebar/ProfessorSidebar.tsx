'use client'

import { Home, BookOpen, LogOut, Menu, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface ProfessorSidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onLogout?: () => void;
  showMobileMenu?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  staticPosition?: boolean;
}

export default function ProfessorSidebar({
  activeTab, // Mantido, mas a ativação usa a rota
  onTabChange,
  onLogout,
  showMobileMenu = true,
  isCollapsed = false,
  onToggleCollapse,
  staticPosition = false
}: ProfessorSidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const activePath = pathname ?? "";

  const menuItems = [
    {
      id: "inicio",
      label: "Início",
      icon: Home,
      href: "/professor"
    },
    {
      id: "turmas",
      label: "Turmas",
      icon: BookOpen,
      href: "/professor/turmas"
    },
  ];

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      router.push("/");
    }
    // Fecha o menu móvel se estiver aberto
    setSidebarOpen(false);
  };

  // Esta função é usada no desktop (Link)
  const handleNavigation = (id: string) => {
    if (onTabChange) onTabChange(id);
    // Não fecha o sidebar desktop (pois ele sempre está visível)
  };

  // Esta função é usada no mobile (Link)
  const handleMobileNavigation = (id: string) => {
    if (onTabChange) onTabChange(id);
    setSidebarOpen(false); // Fecha o sidebar mobile após a navegação
  };

  // Lógica de ativação baseada na rota
  const isActive = (href: string) => {
    if (href === "/professor") {
      return activePath === href || activePath === `${href}/`;
    }

    return activePath === href || activePath.startsWith(`${href}/`);
  };

  return (
    <>
      {/* Mobile Menu Button - FIXO NO CANTO SUPERIOR ESQUERDO */}
      {showMobileMenu && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed left-4 top-4 z-40 rounded-lg bg-[#0D4F97] p-2 text-white md:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>
      )}

      {/* Sidebar Desktop */}
      <aside
        className={`hidden md:flex md:flex-col bg-[#B2D7EC] rounded-r-3xl z-40 transition-all duration-300 ${staticPosition
          ? 'relative min-h-screen h-auto -mt-16 md:-mt-20'
          : 'fixed left-0 top-0 bottom-0 overflow-y-auto'
          } ${isCollapsed ? 'w-20' : 'w-64'
          }`}
      >
        {/* Toggle Button - NO CANTO SUPERIOR ESQUERDO */}
        <div className="absolute left-4 top-4 z-40">
          <button
            onClick={onToggleCollapse}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-black hover:bg-black/10 transition-all"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Logo e Nome no Topo */}
        <div className="border-b-2 border-[#0D4F97]/20 p-6 mt-16">
          {!isCollapsed ? (
            <div className="flex flex-col items-center gap-3 mb-2">
              <div className="flex items-center justify-center">
                <Image
                  src="/apae-logo.png"
                  alt="Logo APAE"
                  width={60}
                  height={60}
                  className="object-contain"
                />
              </div>
              <div className="text-center">
                <h2 className="text-[#0D4F97] font-bold">APAE Esperança</h2>
                <p className="text-[#0D4F97]/70 text-sm">Painel do Professor</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <Image
                src="/apae-logo.png"
                alt="Logo APAE"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
          )}
        </div>

        {/* Menu Items */}
        <nav className="flex-1 space-y-2 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => handleNavigation(item.id)} // Desktop navigation
                className={`flex w-full items-center ${isCollapsed ? 'justify-center' : 'gap-3'
                  } rounded-3xl px-4 py-3 transition-all ${active
                    ? "bg-[#0D4F97] text-white shadow-md"
                    : "bg-transparent text-[#0D4F97] hover:bg-[#0D4F97] hover:text-white"
                  }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="border-t-2 border-[#0D4F97]/20 p-4">
          <button
            onClick={handleLogout}
            className={`flex w-full items-center ${isCollapsed ? 'justify-center' : 'gap-3'
              } rounded-3xl bg-transparent px-4 py-3 text-[#0D4F97] transition-all hover:bg-white/40`}
            title={isCollapsed ? "Sair" : undefined}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">Sair</span>}
          </button>
        </div>
      </aside>

      {/* Sidebar Mobile */}
      {sidebarOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Sidebar Mobile */}
          <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-[#B2D7EC] rounded-r-3xl md:hidden overflow-y-auto">
            <div className="flex h-full flex-col">
              {/* Header Mobile - COM "X" NO CANTO SUPERIOR DIREITO */}
              <div className="relative border-b-2 border-[#0D4F97]/20 p-4 mt-8">
                {/* Botão de fechar no canto superior direito */}
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="absolute right-4 top-4 text-[#0D4F97]"
                >
                  <X className="h-6 w-6" />
                </button>

                {/* Logo e título centralizados */}
                <div className="flex flex-col items-center gap-3 pt-4">
                  <Image
                    src="/apae-logo.png"
                    alt="Logo APAE"
                    width={60}
                    height={60}
                    className="object-contain"
                  />
                  <h2 className="text-[#0D4F97] font-bold">APAE Esperança</h2>
                  <p className="text-[#0D4F97]/70 text-sm">Painel do Professor</p>
                </div>
              </div>

              {/* Menu Items Mobile (AGORA USANDO LINK PARA NAVEGAÇÃO CORRETA) */}
              <div className="flex-1 space-y-2 p-4">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => handleMobileNavigation(item.id)}
                      className={`flex w-full items-center gap-3 rounded-3xl px-4 py-3 text-left transition-all ${active
                        ? "bg-[#0D4F97] text-white shadow-md"
                        : "bg-transparent text-[#0D4F97] hover:bg-[#0D4F97] hover:text-white"
                        }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Logout Mobile */}
              <div className="border-t-2 border-[#0D4F97]/20 p-4">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-3xl bg-transparent px-4 py-3 text-[#0D4F97] transition-all hover:bg-white/40"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Sair</span>
                </button>
              </div>
            </div>
          </aside>
        </>
      )}
    </>
  );
}