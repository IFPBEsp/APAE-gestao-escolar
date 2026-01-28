'use client'

import { usePathname } from 'next/navigation';

export default function LayoutClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/' || pathname === '/login';
  
  return (
    <main className={`min-h-screen ${!isLoginPage ? 'mt-16 md:mt-20' : ''}`}>
      {children}
    </main>
  );
}
