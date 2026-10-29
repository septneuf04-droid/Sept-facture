import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export interface GeneratePdfOptions {
  elementId?: string;
  filename?: string;
}

/**
 * Génère et télécharge un fichier PDF haute définition à partir d'un élément du DOM.
 */
export async function downloadInvoicePdf(
  elementId: string = "invoice-document",
  filename: string = "facture.pdf"
): Promise<boolean> {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Élément #${elementId} introuvable pour la génération PDF`);
      return false;
    }

    // Capture haute résolution (scale: 2 pour netteté d'impression Retina)
    const canvas = await (html2canvas as any)(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#FFFFFF",
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    const imgData = canvas.toDataURL("image/png");

    // Format A4 : 210 x 297 mm
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const pageWidth = 210;
    const pageHeight = 297;

    // Calcul des proportions pour ajuster à la largeur A4 avec marge esthétique de 10mm
    const margin = 10;
    const contentWidth = pageWidth - margin * 2;
    const contentHeight = (canvas.height * contentWidth) / canvas.width;

    if (contentHeight <= pageHeight - margin * 2) {
      // Tient sur une seule page
      pdf.addImage(imgData, "PNG", margin, margin, contentWidth, contentHeight);
    } else {
      // Découpage automatique multi-pages si facture longue
      let heightLeft = contentHeight;
      let position = margin;

      pdf.addImage(imgData, "PNG", margin, position, contentWidth, contentHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - contentHeight + margin;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", margin, position, contentWidth, contentHeight);
        heightLeft -= pageHeight;
      }
    }

    const cleanFilename = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
    pdf.save(cleanFilename);
    return true;
  } catch (error) {
    console.error("Erreur lors de la création du PDF:", error);
    return false;
  }
}
