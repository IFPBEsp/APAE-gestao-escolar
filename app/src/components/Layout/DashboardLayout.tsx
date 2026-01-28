'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, LogOut, ChevronLeft, ChevronRight, type LucideIcon } from 'lucide-react';

export interface MenuItem {
    label: string;
    icon: LucideIcon;
    href: string; // Changed from 'route' to 'href' to match Next.js conventions
}

interface DashboardLayoutProps {
    children: React.ReactNode;
    menuItems: MenuItem[];
    title?: string;
    subtitle?: string;
    onLogout?: () => void;
}

export default function DashboardLayout({
    children,
    menuItems,
    title = "APAE Esperança",
    subtitle = "Painel",
    onLogout
}: DashboardLayoutProps) {
    const router = useRouter();
    const pathname = usePathname();

    // Sidebar state
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

    // Helper to check active route
    const isActive = (href: string) => {
        if (!pathname) return false;
        const depth = href.split('/').filter(Boolean).length;
        // Root sections like "/admin" or "/professor" should only match exactly
        if (depth <= 1) {
            return pathname === href || pathname === `${href}/`;
        }
        // Nested sections can match exact or deeper paths
        return pathname === href || pathname.startsWith(`${href}/`);
    };

    const handleLogout = () => {
        if (onLogout) {
            onLogout();
        } else {
            router.push('/');
        }
    };

    // Shared Menu Content
    const MenuContent = ({ collapsed = false }: { collapsed?: boolean }) => (
        <div className="flex h-full flex-col">
            {/* Header */}
            <div className={`
        relative border-b-2 border-[#0D4F97]/20 p-4 transition-all duration-300
        ${collapsed ? "items-center justify-center p-2" : "mt-8"}
      `}>
                {/* Mobile Close Button (Only visible on mobile sidebar) */}
                {!collapsed && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMobileOpen(false)}
                        className="fixed right-4 top-4 z-40"
                    >
                        <X className="h-4 w-4" strokeWidth={1.75} />
                    </Button>
                )}

                <div className={`flex flex-col items-center gap-3 ${!collapsed ? "pt-4" : ""}`}>
                    <Image
                        src="/apae-logo.png"
                        alt="Logo APAE"
                        width={collapsed ? 40 : 60}
                        height={collapsed ? 40 : 60}
                        className="object-contain"
                    />
                    {!collapsed && (
                        <div className="text-center">
                            <h2 className="text-[#0D4F97] font-bold">{title}</h2>
                            <p className="text-[#0D4F97]/70 text-sm">{subtitle}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2 p-4 overflow-y-auto">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMobileOpen(false)} // Close mobile menu on click
                            className={`
                flex items-center rounded-3xl transition-all duration-200
                ${collapsed ? "justify-center px-0 py-3" : "gap-3 px-4 py-3"}
                ${active
                                    ? "bg-[#0D4F97] text-white shadow-md"
                                    : "bg-transparent text-[#0D4F97] hover:bg-[#0D4F97] hover:text-white"
                                }
              `}
                            title={collapsed ? item.label : undefined}
                        >
                            <Icon className="h-5 w-5 flex-shrink-0" strokeWidth={1.75} />
                            {!collapsed && <span className="font-medium">{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / Logout */}
            <div className="border-t-2 border-[#0D4F97]/20 p-4">
                <Button
                    variant="outline"
                    onClick={handleLogout}
                    className={`w-full ${collapsed ? "justify-center" : "justify-start"}`}
                >
                    <LogOut className="h-5 w-5" strokeWidth={1.75} />
                    {!collapsed && <span>Sair</span>}
                </Button>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-[#E5E5E5]">
            {/* Mobile Menu Button (Fixed Top-Left) */}
            <Button
                variant="primary"
                size="icon"
                onClick={() => setIsMobileOpen(true)}
                className="fixed left-4 top-4 z-40 md:hidden shadow-lg"
            >
                <Menu className="h-6 w-6" strokeWidth={1.75} />
            </Button>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden animate-in fade-in"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Mobile Sidebar (Slide-in) */}
            <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#B2D7EC] rounded-r-3xl md:hidden overflow-hidden shadow-2xl transition-transform duration-300
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <MenuContent collapsed={false} />
            </aside>

            {/* Desktop Sidebar (Static/Collapsible) */}
            <aside className={`
        hidden md:flex flex-col fixed left-0 top-0 bottom-0 z-30 bg-[#B2D7EC] rounded-r-3xl overflow-hidden transition-all duration-300 shadow-xl
        ${isDesktopCollapsed ? 'w-20' : 'w-64'}
      `}>
                {/* Toggle Button */}
                <div className="absolute left-4 top-4 z-40">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
                    >
                    {isDesktopCollapsed
                        ? <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
                        : <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
                    }
                    </Button>
                </div>

                {/* Adjust margin to account for the toggle button being absolute */}
                <div className="mt-8 flex-1 flex flex-col overflow-hidden">
                    <MenuContent collapsed={isDesktopCollapsed} />
                </div>
            </aside>

            {/* Main Content Area */}
            <main className={`
        flex-1 min-h-screen transition-all duration-300
        ${isDesktopCollapsed ? 'md:ml-20' : 'md:ml-64'}
      `}>
                <div className="p-4 md:p-8 pt-20 md:pt-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
