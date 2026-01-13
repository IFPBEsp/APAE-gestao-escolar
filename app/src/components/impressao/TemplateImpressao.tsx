import React, { forwardRef } from "react";
import CabecalhoInstitucional from "./CabecalhoInstitucional";
import Assinaturas from "./Assinaturas";

interface TemplateImpressaoProps {
  titulo: string;
  children: React.ReactNode;
  assinaturas?: {
    esquerda: {
      nome: string;
      cargo: string;
    };
    direita: {
      nome: string;
      cargo: string;
    };
  };
}

const TemplateImpressao = forwardRef<HTMLDivElement, TemplateImpressaoProps>(
  ({ titulo, children, assinaturas }, ref) => {
    return (
      <div ref={ref} className="impressao-area">
        <div className="impressao-pagina">
          <CabecalhoInstitucional titulo={titulo} />

          <main>{children}</main>

          {assinaturas && (
            <Assinaturas
              esquerda={assinaturas.esquerda}
              direita={assinaturas.direita}
            />
          )}
        </div>
      </div>
    );
  }
);

TemplateImpressao.displayName = "TemplateImpressao";

export default TemplateImpressao;
