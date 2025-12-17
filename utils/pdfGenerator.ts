import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { House } from '../types';

export const generateHousePDF = (selectedHouse: House, includeIva: boolean): void => {
    const doc = new jsPDF();
    const primaryColor = "#39b54a";
    const darkColor = "#1a1a1a";

    // Price formatting helper
    const formatPrice = (price: number) => {
        const finalPrice = includeIva ? price * 1.10 : price;
        return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(finalPrice);
    };

    // Header
    doc.setFillColor(darkColor);
    doc.rect(0, 0, 210, 30, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text("RESIDENCIAL", 14, 12);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(primaryColor);
    doc.text("HUERTOS", 14, 19);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("DE LA CAÑADA", 42, 19);

    // Title
    doc.setTextColor(darkColor);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(`Informe de Superficies`, 14, 45);
    doc.setTextColor(primaryColor);
    doc.text(selectedHouse.name, 14, 55);

    // Main Info Box
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(14, 65, 182, 35, 3, 3, 'FD');

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    
    // Column 1
    doc.text("Identificador:", 20, 75);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(darkColor);
    doc.text(selectedHouse.id, 20, 80);
    
    // Column 2
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Tipología:", 60, 75);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(darkColor);
    doc.text(selectedHouse.type, 60, 80);

    // Column 3
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Orientación:", 100, 75);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(darkColor);
    doc.text(selectedHouse.orientation || "-", 100, 80);

    // Column 4
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(`Precio (${includeIva ? 'Con' : 'Sin'} IVA):`, 140, 75);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(primaryColor);
    doc.setFontSize(12);
    doc.text(formatPrice(selectedHouse.price), 140, 80);

    // Row 2 Info
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Parcela Aprox:", 20, 90);
    doc.setTextColor(darkColor);
    doc.text(`${selectedHouse.parcelArea} m²`, 45, 90);
    
    doc.setTextColor(100, 100, 100);
    doc.text("Sup. Total (Const+Ext):", 100, 90);
    doc.setTextColor(darkColor);
    doc.text(`${selectedHouse.totalConstructedArea} m²`, 138, 90);

    let finalY = 110;

    // Iterate Floors
    selectedHouse.floors.forEach((floor) => {
        // Floor Header
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(primaryColor);
        doc.text(floor.name.toUpperCase(), 14, finalY);
        doc.line(14, finalY + 2, 196, finalY + 2); // Underline

        // Data for Table
        const tableData = floor.rooms.map(room => [room.name, `${room.area.toFixed(2)} m²`]);
        
        // Add Summary Row
        if(floor.outdoorArea && floor.outdoorArea > 0) {
             tableData.push(["TOTAL ÚTIL INTERIOR", `${floor.totalUsefulArea.toFixed(2)} m²`]);
             tableData.push(["ZONAS EXTERIORES", `${floor.outdoorArea.toFixed(2)} m²`]);
        } else {
             tableData.push(["TOTAL ÚTIL", `${floor.totalUsefulArea.toFixed(2)} m²`]);
        }

        autoTable(doc, {
            startY: finalY + 5,
            head: [['Estancia', 'Superficie']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [57, 181, 74], textColor: 255, fontStyle: 'bold' },
            columnStyles: {
                0: { cellWidth: 'auto' },
                1: { cellWidth: 40, halign: 'right', fontStyle: 'bold' },
            },
            styles: { fontSize: 9, cellPadding: 2 },
            footStyles: { fillColor: [240, 240, 240], textColor: 0, fontStyle: 'bold' },
            didParseCell: function(data) {
                // Style Summary Rows differently
                if (data.row.raw[0].toString().includes("TOTAL") || data.row.raw[0].toString().includes("ZONAS EXTERIORES")) {
                    data.cell.styles.fontStyle = 'bold';
                    data.cell.styles.textColor = [0, 0, 0];
                    data.cell.styles.fillColor = [245, 245, 245];
                }
            }
        });

        // @ts-ignore
        finalY = doc.lastAutoTable.finalY + 15;
        
        // Check for page break
        if (finalY > 250) {
            doc.addPage();
            finalY = 20;
        }
    });

    // Disclaimer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.setFont("helvetica", "normal");
    const disclaimer = "Nota: El presente documento tiene carácter informativo. Las superficies indicadas son útiles y pueden sufrir ligeras variaciones por exigencias técnicas durante la ejecución de la obra. El mobiliario es meramente decorativo. La superficie total incluye partes proporcionales de zonas comunes y exteriores según normativa aplicable.";
    const splitDisclaimer = doc.splitTextToSize(disclaimer, 180);
    doc.text(splitDisclaimer, 14, 280);

    // Save
    doc.save(`Informe_${selectedHouse.id}_HuertosDeLaCanada.pdf`);
};
