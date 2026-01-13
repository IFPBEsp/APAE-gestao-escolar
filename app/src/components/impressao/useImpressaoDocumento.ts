import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

export function useImpressaoDocumento() {
  const refImpressao = useRef<HTMLDivElement>(null);

  const imprimir = useReactToPrint({
    contentRef: refImpressao, 
    documentTitle: "Documento_APAE",
    pageStyle: `
      @page {
        size: A4;
        margin: 20mm;
      }

      @media print {
        body {
          font-family: "Times New Roman", serif;
          font-size: 12pt;
          color: black;
        }

        .page-break {
          page-break-after: always;
        }
      }
    `,
  });

  return {
    refImpressao,
    imprimir,
  };
}
