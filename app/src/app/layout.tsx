import type { Metadata } from 'next';
import '../styles/globals.css';
import Header from '@components/Header/Header';

export const metadata: Metadata = {
  title: 'APAE - Gestão Escolar',
  description: 'Sistema de gestão escolar',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
