import "../styles/globals.css";
import { ToasterProvider } from "@/components/ToasterProvider"; // ✅ Corrigido
import Header from "@/components/Header/Header"; // ✅ Corrigido

export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <html lang="pt-BR">
      <body>
        <Header />
        {children}
        <ToasterProvider />
      </body>
    </html>
  );
}