'use client' // Importante para usar hooks de navegação

import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Header() {
<<<<<<< HEAD
  return (
<<<<<<< HEAD
    <header className="flex h-16 md:h-20 items-center justify-center bg-[#0D4F97] px-4 md:px-6 w-full" >
=======
    <header className="flex h-16 md:h-20 items-center justify-center bg-[#0D4F97] px-4 md:px-6 w-full z-30" >
>>>>>>> af227ef8d450f9f14ad0abb3348b35831f1b5297
      <div className="flex items-center gap-2 md:gap-3">
=======
  const pathname = usePathname();
>>>>>>> 49ee4bc4e3f261d3e43b0162834dd07eb20dfb7c

  if (pathname === '/' || pathname === '/login') return null;

  return (
    <header className="flex h-16 md:h-20 items-center justify-center bg-[#0D4F97] px-4 md:px-6 fixed top-0 w-full z-30">
      <div className="flex items-center gap-2 md:gap-3">
        <Image
          src="/apae-logo.png"
          alt="Logotipo da APAE - Flor e Mãos"
          width={40}
          height={40}
          className="rounded-full bg-white/10 p-1 object-contain md:w-12 md:h-12"
        />
        <h1 className="text-white text-lg md:text-2xl font-bold">Sistema APAE</h1>
      </div>
    </header>
  );
}