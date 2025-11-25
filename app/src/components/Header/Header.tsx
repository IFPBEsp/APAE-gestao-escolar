import Image from "next/image";

export default function Header() {
  return (
    <header className="flex h-20 items-center justify-center bg-[#0D4F97] px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full overflow-hidden p-1 bg-white">
          <Image 
            src="/logo.APAE.jpg" 
            alt="Logo APAE" 
            width={48}
            height={48}
            className="h-full w-full object-contain"
          />
        </div>
        <h1 className="text-white text-xl font-semibold">Sistema APAE</h1>
      </div>
    </header>
  );
}