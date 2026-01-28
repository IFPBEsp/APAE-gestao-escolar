import "../styles/globals.css";
import "@/components/impressao/impressao.css";
import { ToasterProvider } from "@/components/ToasterProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header/Header";
import LayoutClientWrapper from "@/components/LayoutClientWrapper";

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-[#E5E5E5]">
        <AuthProvider>
          <Header />
          <LayoutClientWrapper>
            {children}
          </LayoutClientWrapper>
          <ToasterProvider />
        </AuthProvider>
      </body>
    </html>
  );
}