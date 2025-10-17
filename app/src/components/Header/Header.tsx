export default function Header() {
  return (
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
