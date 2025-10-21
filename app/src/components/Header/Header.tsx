export default function Header() {
  return (
    <header className="flex h-20 items-center justify-center bg-[#0D4F97] px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
          <span className="text-white">APAE</span>
        </div>
        <h1 className="text-white">Sistema APAE</h1>
      </div>
    <header className="p-4 bg-blue-600 text-white text-center flex items-center justify-center gap-3">
      <img 
        src="/logo.APAE.jpg" 
        alt="APAE" 
        className="w-16 h-16 md:w-18 md:h-18" 
      />
      <h1 className="text-lg md:text-xl font-bold">Gestão Escolar</h1>
    </header>
  );
}
