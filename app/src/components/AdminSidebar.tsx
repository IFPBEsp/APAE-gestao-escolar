'use client'

import { Home, BookOpen, Users, GraduationCap, LogOut, Menu, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  showMobileMenu?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function AdminSidebar({ 
  activeTab, 
  onTabChange, 
  onLogout, 
  showMobileMenu = true, 
  isCollapsed = false, 
  onToggleCollapse 
}: AdminSidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: "inicio" as const, label: "Início", icon: Home },
    { id: "turmas" as const, label: "Turmas", icon: BookOpen },
    { id: "professores" as const, label: "Professores", icon: Users },
    { id: "alunos" as const, label: "Alunos", icon: GraduationCap },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      {showMobileMenu && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed left-4 top-24 z-40 rounded-lg bg-[#0D4F97] p-2 text-white md:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>
      )}

      {/* Sidebar Desktop */}
      <aside 
        className={`hidden md:flex md:flex-col bg-[#B2D7EC] rounded-r-3xl fixed left-0 top-20 bottom-0 z-30 overflow-y-auto transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Toggle Button - Inside Sidebar */}
        <div className="absolute left-4 top-6 z-40">
          <button
            onClick={onToggleCollapse}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-black hover:bg-black/10 transition-all"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Logo e Nome no Topo */}
        <div className="border-b-2 border-[#0D4F97]/20 p-6">
          {!isCollapsed ? (
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full overflow-hidden p-1 flex-shrink-0">
                <Image 
                  src="/apae-logo.png" 
                  alt="Logo APAE" 
                  width={48}
                  height={48}
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <h2 className="text-[#0D4F97]">APAE Esperança</h2>
                <p className="text-[#0D4F97]/70 text-sm">Administrador</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full overflow-hidden p-1">
                <Image 
                  src="/apae-logo.png" 
                  alt="Logo APAE" 
                  width={48}
                  height={48}
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 space-y-2 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex w-full items-center ${isCollapsed ? 'justify-center' : 'gap-3'} rounded-3xl px-4 py-3 transition-all ${
                  isActive
                    ? "bg-[#0D4F97] text-white"
                    : "bg-transparent text-[#0D4F97] hover:bg-[#0D4F97] hover:text-white"
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </div>
        
        <div className="border-t-2 border-[#0D4F97]/20 p-4">
          <button
            onClick={onLogout}
            className={`flex w-full items-center ${isCollapsed ? 'justify-center' : 'gap-3'} rounded-3xl bg-transparent px-4 py-3 text-[#0D4F97] transition-all hover:bg-white/40`}
            title={isCollapsed ? "Sair" : undefined}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span>Sair</span>}
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

          {/* Sidebar */}
          <aside className="fixed top-20 bottom-0 left-0 z-50 w-64 bg-[#B2D7EC] rounded-r-3xl md:hidden overflow-y-auto">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b-2 border-[#0D4F97]/20 p-4">
                <h2 className="text-[#0D4F97]">Menu</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="rounded-lg bg-transparent p-2 text-[#0D4F97] transition-all hover:bg-white/40"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 space-y-2 p-4">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onTabChange(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 rounded-3xl px-4 py-3 text-left transition-all ${
                        isActive
                          ? "bg-[#0D4F97] text-white"
                          : "bg-transparent text-[#0D4F97] hover:bg-[#0D4F97] hover:text-white"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="border-t-2 border-[#0D4F97]/20 p-4">
                <button
                  onClick={onLogout}
                  className="flex w-full items-center gap-3 rounded-3xl bg-transparent px-4 py-3 text-[#0D4F97] transition-all hover:bg-white/40"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sair</span>
                </button>
              </div>
            </div>
          </aside>
        </>
      )}
    </>
  );
}

