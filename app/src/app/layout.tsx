import "../styles/globals.css";
import { ToasterProvider } from "@/components/ToasterProvider";
import Header from "@/components/Header/Header";

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-[#E5E5E5]">
        <Header />
        <main className="min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)] mt-16 md:mt-20">
          {children}
        </main>
        <ToasterProvider />
      </body>
    </html>
  );
}
