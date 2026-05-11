import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import { Brand, Promotion } from "@/src/lib/domain/entities";
import { supabase } from "@/src/lib/infrastructure/supabase-client";

const getBase64FromUrl = async (url: string): Promise<string> => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const generateCouponPDF = async (brand: Brand, promotion: Promotion) => {
  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a6", // Pequeño y práctico para llevar en el cel o imprimir
    });

    const now = new Date();
    const generationDate = now.toLocaleString();
    
    // 1. Crear registro de redención única en la base de datos
    let redemptionId = promotion.id; // Fallback
    try {
      const { data, error } = await supabase
        .from('coupon_redemptions')
        .insert([{ 
          promotion_id: promotion.id, 
          brand_id: brand.id 
        }])
        .select()
        .single();
      
      if (!error && data) {
        redemptionId = data.id;
      }
    } catch (e) {
      console.warn("Could not create unique redemption. Falling back to promotion ID.");
    }
    
    // Configuración estética (Quiet Luxury 2026)
    const celesteColor = [135, 206, 235]; // #87CEEB - Celeste OH!
    const onyxColor = [24, 24, 24]; // #181818
    const whiteColor = [255, 255, 255];

    // Fondo y Bordes
    doc.setFillColor(whiteColor[0], whiteColor[1], whiteColor[2]);
    doc.rect(0, 0, 105, 148, "F");
    
    // Borde sutil celeste
    doc.setDrawColor(celesteColor[0], celesteColor[1], celesteColor[2]);
    doc.setLineWidth(0.5);
    doc.rect(5, 5, 95, 138, "S");

    // Elemento decorativo superior (línea gruesa celeste)
    doc.setFillColor(celesteColor[0], celesteColor[1], celesteColor[2]);
    doc.rect(0, 0, 105, 4, "F");

    // Logos y Encabezado
    try {
      const logoOHBase64 = await getBase64FromUrl(`${window.location.origin}/OH-Buenos-Aires-Logo-Negro.png`);
      doc.addImage(logoOHBase64, "PNG", 37.5, 10, 30, 15);
    } catch (e) {
      // Fallback a texto si falla el logo
      doc.setTextColor(onyxColor[0], onyxColor[1], onyxColor[2]);
      doc.setFont("serif", "bold");
      doc.setFontSize(18);
      doc.text("OH! BUENOS AIRES", 52.5, 20, { align: "center" });
    }
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(celesteColor[0], celesteColor[1], celesteColor[2]);
    doc.text("CUPÓN EXCLUSIVO", 52.5, 30, { align: "center" });

    // Línea divisoria superior
    doc.setDrawColor(celesteColor[0], celesteColor[1], celesteColor[2], 0.2);
    doc.line(20, 33, 85, 33);

    // Espacio para Logo con fondo blanco circular
    if (brand.logoUrl) {
      try {
        const logoBase64 = await getBase64FromUrl(brand.logoUrl);
        // Círculo blanco de fondo
        doc.setFillColor(whiteColor[0], whiteColor[1], whiteColor[2]);
        doc.circle(52.5, 48, 12, "F");
        
        // El logo encima
        doc.addImage(logoBase64, "PNG", 44.5, 40, 16, 16);
      } catch (e) {
        console.warn("Could not add logo to PDF", e);
      }
    }

    // Información de la Marca
    doc.setTextColor(onyxColor[0], onyxColor[1], onyxColor[2]);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(brand.name.toUpperCase(), 52.5, 68, { align: "center" });

    // La Promoción
    doc.setFontSize(20);
    doc.setTextColor(onyxColor[0], onyxColor[1], onyxColor[2]);
    doc.text(promotion.title, 52.5, 80, { align: "center" });

    // QR Code con URL de Validación para la tienda
    // Usamos el redemptionId único para asegurar que solo se use una vez
    const validationUrl = `${window.location.origin}/v?rid=${redemptionId}&b=${encodeURIComponent(brand.name)}&p=${encodeURIComponent(promotion.title)}&exp=${promotion.validUntil ? encodeURIComponent(promotion.validUntil.toString()) : 'no'}`;

    const qrDataUrl = await QRCode.toDataURL(validationUrl, {
      margin: 1,
      width: 200,
      color: {
        dark: "#181818",
        light: "#FFFFFF"
      }
    });

    // Fondo para el QR para que resalte
    doc.setFillColor(celesteColor[0], celesteColor[1], celesteColor[2], 0.05);
    doc.roundedRect(33, 88, 39, 39, 3, 3, "F");
    
    doc.addImage(qrDataUrl, "PNG", 35, 90, 35, 35);

    // Pie de página con fecha (Movido para evitar superposición)
    doc.setTextColor(onyxColor[0], onyxColor[1], onyxColor[2], 0.3);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(`ID: ${redemptionId.slice(0, 8).toUpperCase()}`, 52.5, 130, { align: "center" });
    doc.text(`Generado el: ${generationDate}`, 52.5, 134, { align: "center" });
    
    if (promotion.validUntil) {
        const until = new Date(promotion.validUntil).toLocaleDateString();
        doc.text(`Válido hasta: ${until}`, 52.5, 138, { align: "center" });
    }

    doc.setTextColor(celesteColor[0], celesteColor[1], celesteColor[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("RECOLETA, BUENOS AIRES", 52.5, 144, { align: "center" });

    // Descargar
    doc.save(`Cupon_${brand.name.replace(/\s+/g, '_')}_${promotion.id}.pdf`);

  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};
