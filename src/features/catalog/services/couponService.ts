
import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import { Brand, Promotion } from "@/src/lib/domain/entities";

export const generateCouponPDF = async (brand: Brand, promotion: Promotion) => {
  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a6", // Pequeño y práctico para llevar en el cel o imprimir
    });

    const now = new Date();
    const generationDate = now.toLocaleString();
    
    // Configuración estética
    const goldColor = [200, 165, 100]; // #C8A564
    const onyxColor = [24, 24, 24]; // #181818

    // Fondo y Bordes
    doc.setFillColor(onyxColor[0], onyxColor[1], onyxColor[2]);
    doc.rect(0, 0, 105, 148, "F");
    
    doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.setLineWidth(1);
    doc.rect(5, 5, 95, 138, "S");

    // Título / Marca
    doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.setFont("serif", "bold");
    doc.setFontSize(22);
    doc.text("OH! BUENOS AIRES", 52.5, 25, { align: "center" });
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("CUPÓN EXCLUSIVO", 52.5, 35, { align: "center" });

    // Línea divisoria
    doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2], 0.3);
    doc.line(20, 40, 85, 40);

    // Información de la Marca
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(brand.name.toUpperCase(), 52.5, 55, { align: "center" });

    // La Promoción
    doc.setFontSize(24);
    doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.text(promotion.title, 52.5, 75, { align: "center" });

    // QR Code
    // El QR contiene: Marca, Promo, Fecha de Gen, y un ID único (opcional)
    const qrData = JSON.stringify({
      b: brand.name,
      p: promotion.title,
      dt: generationDate,
      id: promotion.id
    });

    const qrDataUrl = await QRCode.toDataURL(qrData, {
      margin: 1,
      color: {
        dark: "#C8A564",
        light: "#181818"
      }
    });

    doc.addImage(qrDataUrl, "PNG", 32.5, 85, 40, 40);

    // Pie de página con fecha
    doc.setTextColor(255, 255, 255, 0.5);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(`Generado el: ${generationDate}`, 52.5, 130, { align: "center" });
    
    if (promotion.validUntil) {
        const until = new Date(promotion.validUntil).toLocaleDateString();
        doc.text(`Válido hasta: ${until}`, 52.5, 135, { align: "center" });
    }

    doc.text("RECOLETA, BUENOS AIRES", 52.5, 142, { align: "center" });

    // Descargar
    doc.save(`Cupon_${brand.name.replace(/\s+/g, '_')}_${promotion.id}.pdf`);

  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};
