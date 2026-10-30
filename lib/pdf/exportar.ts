const LARGURA = 794;
const ALTURA = 1123;
const SELETOR_PAGINAS = ".print-scaler .doc-page, .print-scaler .fatura-page";

export function nomeArquivoPdf(...partes: string[]) {
  const nome = partes
    .map((p) => (p || "").trim())
    .filter(Boolean)
    .join(" - ")
    .replace(/[\\/:*?"<>|\r\n]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return (nome || "BR Solar") + ".pdf";
}

function imagensCarregadas(raiz: ParentNode) {
  const imgs = Array.from(raiz.querySelectorAll("img"));
  return Promise.all(
    imgs.map((img) =>
      img.complete
        ? Promise.resolve()
        : new Promise<void>((ok) => {
            img.addEventListener("load", () => ok(), { once: true });
            img.addEventListener("error", () => ok(), { once: true });
          }),
    ),
  );
}

/**
 * Gera um PDF A4 com uma imagem por página (.doc-page / .fatura-page) e baixa o arquivo.
 * Cada página é clonada para fora da tela, sem o scale() da prévia e sem display:none
 * (abas inativas, prévia fechada no celular), então o resultado não depende do aparelho.
 */
export async function baixarPdf(nomeArquivo: string) {
  const paginas = Array.from(document.querySelectorAll<HTMLElement>(SELETOR_PAGINAS));
  if (!paginas.length) throw new Error("Nenhuma página para exportar.");

  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import("html2canvas-pro"),
    import("jspdf"),
  ]);

  await document.fonts.ready;

  const palco = document.createElement("div");
  palco.className = "exportando-pdf";
  palco.style.cssText = `position:fixed;left:-10000px;top:0;width:${LARGURA}px;pointer-events:none;`;
  for (const pg of paginas) {
    const clone = pg.cloneNode(true) as HTMLElement;
    clone.style.boxShadow = "none";
    clone.style.borderRadius = "0";
    clone.style.margin = "0";
    clone.style.position = "relative";
    clone.style.left = "0";
    clone.style.top = "0";
    palco.appendChild(clone);
  }
  document.body.appendChild(palco);

  try {
    await imagensCarregadas(palco);
    await document.fonts.ready;

    const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait", compress: true });
    const clones = Array.from(palco.children) as HTMLElement[];
    for (let i = 0; i < clones.length; i++) {
      const canvas = await html2canvas(clones[i], {
        scale: 2,
        width: LARGURA,
        height: ALTURA,
        windowWidth: LARGURA,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false,
      });
      if (i > 0) pdf.addPage();
      pdf.addImage(canvas.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, 210, 297);
      // libera a memória do canvas antes da próxima página (importante no iPhone)
      canvas.width = 0;
      canvas.height = 0;
    }
    pdf.save(nomeArquivo);
  } finally {
    palco.remove();
  }
}
