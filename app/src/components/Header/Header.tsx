import Image from 'next/image';

export default function Header() {
  return (
    <header className="flex h-20 items-center justify-center bg-[#0D4F97] px-6 fixed top-0 w-screen" >
      <div className="flex items-center gap-3">
        
        <Image
          src="/apae-logo.png" 
          alt="Logotipo da APAE - Flor e Mãos"
          width={48} 
          height={48} 
          className="rounded-full bg-white/10 p-1 object-contain"
        />
        
        <h1 className="text-white">Sistema APAE</h1>
      </div>
    </header>
  );
}	