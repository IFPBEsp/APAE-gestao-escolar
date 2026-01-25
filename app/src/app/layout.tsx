import "../styles/globals.css";
import { ToasterProvider } from "@/components/ToasterProvider";
import Header from "@/components/Header/Header";
import "@/components/impressao/impressao.css";
import LayoutClientWrapper from "@/components/LayoutClientWrapper"; 

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-[#E5E5E5]">
        <Header />
        {/* Usamos um wrapper para controlar a margem dinamicamente */}
        <LayoutClientWrapper>
          {children}
        </LayoutClientWrapper>
        <ToasterProvider />
      </body>
    </html>
  );
}