import "../styles/globals.css";
import { ToasterProvider } from "../components/ToasterProvider";
import Header from "../components/Header/Header";

export default function RootLayout({ children }) {
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
