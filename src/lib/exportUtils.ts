// Export utilities for docx, pdf, txt

export async function saveAsTxt(html: string, filename: string) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  const text = tmp.innerText || tmp.textContent || "";
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  downloadBlob(blob, `${filename}.txt`);
}

export async function saveAsPdf(element: HTMLElement, filename: string) {
  const { default: jsPDF } = await import("jspdf");
  const { default: html2canvas } = await import("html2canvas");

  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
  const imgX = (pdfWidth - imgWidth * ratio) / 2;

  let heightLeft = imgHeight * ratio;
  let position = 10;
  const pageHeight = pdfHeight - 20;

  pdf.addImage(
    imgData,
    "PNG",
    imgX,
    position,
    imgWidth * ratio,
    imgHeight * ratio
  );
  heightLeft -= pageHeight;

  while (heightLeft >= 0) {
    position = heightLeft - imgHeight * ratio + 10;
    pdf.addPage();
    pdf.addImage(
      imgData,
      "PNG",
      imgX,
      position,
      imgWidth * ratio,
      imgHeight * ratio
    );
    heightLeft -= pageHeight;
  }

  pdf.save(`${filename}.pdf`);
}

export async function saveAsDocx(html: string, filename: string) {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import("docx");
  const { saveAs } = await import("file-saver");

  const tmp = document.createElement("div");
  tmp.innerHTML = html;

  const paragraphs: Paragraph[] = [];

  const processNode = (node: Node): TextRun[] => {
    const runs: TextRun[] = [];
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || "";
      if (text) runs.push(new TextRun({ text }));
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tag = el.tagName.toLowerCase();
      const isBold =
        tag === "b" ||
        tag === "strong" ||
        el.style.fontWeight === "bold" ||
        el.style.fontWeight === "700";
      const isItalic = tag === "i" || tag === "em" || el.style.fontStyle === "italic";
      const isUnderline =
        tag === "u" || el.style.textDecoration?.includes("underline");
      const fontSize = el.style.fontSize
        ? parseInt(el.style.fontSize) * 2
        : undefined;

      node.childNodes.forEach((child) => {
        const childRuns = processNode(child);
        childRuns.forEach((run) => {
          const props: ConstructorParameters<typeof TextRun>[0] =
            typeof run === "string" ? { text: run } : { ...run };
          if (isBold) (props as Record<string, unknown>).bold = true;
          if (isItalic) (props as Record<string, unknown>).italics = true;
          if (isUnderline)
            (props as Record<string, unknown>).underline = {};
          if (fontSize)
            (props as Record<string, unknown>).size = fontSize;
          runs.push(new TextRun(props as ConstructorParameters<typeof TextRun>[0]));
        });
      });
    }
    return runs;
  };

  tmp.childNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tag = el.tagName.toLowerCase();
      let heading: (typeof HeadingLevel)[keyof typeof HeadingLevel] | undefined;
      if (tag === "h1") heading = HeadingLevel.HEADING_1;
      else if (tag === "h2") heading = HeadingLevel.HEADING_2;

      const runs = processNode(el);
      paragraphs.push(
        new Paragraph({
          children: runs,
          heading,
        })
      );
    } else if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
      paragraphs.push(new Paragraph({ children: [new TextRun(node.textContent)] }));
    }
  });

  if (paragraphs.length === 0) {
    paragraphs.push(new Paragraph({ children: [new TextRun("")] }));
  }

  const doc = new Document({
    sections: [{ properties: {}, children: paragraphs }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${filename}.docx`);
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
