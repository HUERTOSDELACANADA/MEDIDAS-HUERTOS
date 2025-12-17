import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { House } from '../types';

export const generateHousePDF = (selectedHouse: House, includeIva: boolean, showConstructed: boolean): void => {
    const doc = new jsPDF();
    const primaryColor = "#39b54a";
    const darkColor = "#1a1a1a";
    const lightGray = "#f3f4f6";

    // Helper: Determine area value based on mode
    const getAreaValue = (area: number, constructed?: number) => {
        if (showConstructed) {
            return constructed || (area * 1.25);
        }
        return area;
    };

    // Helper: Determine floor total based on mode
    const getFloorTotal = (floor: any) => {
        if (showConstructed) {
            return floor.totalConstructedArea || (floor.totalUsefulArea * 1.15);
        }
        return floor.totalUsefulArea;
    };

    // Price formatting helper
    const formatPrice = (price: number) => {
        const finalPrice = includeIva ? price * 1.10 : price;
        return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(finalPrice);
    };

    // --- HEADER ---
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

    // --- TITLE ---
    const reportType = showConstructed ? "Superficies Construidas" : "Superficies Útiles";
    doc.setTextColor(darkColor);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(`Informe de ${reportType}`, 14, 45);
    doc.setTextColor(primaryColor);
    doc.text(selectedHouse.name, 14, 55);

    // --- MAIN INFO BOX ---
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(14, 65, 182, 35, 3, 3, 'FD');

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    
    // Info Columns
    doc.text("Identificador:", 20, 75);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(darkColor);
    doc.text(selectedHouse.id, 20, 80);
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Tipología:", 60, 75);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(darkColor);
    doc.text(selectedHouse.type, 60, 80);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Orientación:", 100, 75);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(darkColor);
    doc.text(selectedHouse.orientation || "-", 100, 80);

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

    // --- VARIABLES FOR SUMMARY TOTALS ---
    let grandTotalInterior = 0;
    let grandTotalExterior = 0;

    // --- ITERATE FLOORS ---
    selectedHouse.floors.forEach((floor) => {
        // Floor Header
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(primaryColor);
        doc.text(floor.name.toUpperCase(), 14, finalY);
        doc.line(14, finalY + 2, 196, finalY + 2); // Underline

        // Data for Table
        const tableData = floor.rooms.map(room => {
            const val = getAreaValue(room.area, room.constructedArea);
            return [room.name, `${val.toFixed(2)} m²`];
        });
        
        // Calculate Floor Totals
        const floorInterior = getFloorTotal(floor);
        const floorExterior = floor.outdoorArea || 0;

        // Add to Grand Totals
        grandTotalInterior += floorInterior;
        grandTotalExterior += floorExterior;

        // Add Summary Rows to Table
        const totalLabel = showConstructed ? "TOTAL CONSTRUIDO INTERIOR" : "TOTAL ÚTIL INTERIOR";
        
        if(floor.outdoorArea && floor.outdoorArea > 0) {
             tableData.push([totalLabel, `${floorInterior.toFixed(2)} m²`]);
             tableData.push(["ZONAS EXTERIORES", `${floorExterior.toFixed(2)} m²`]);
        } else {
             tableData.push([showConstructed ? "TOTAL CONSTRUIDO" : "TOTAL ÚTIL", `${floorInterior.toFixed(2)} m²`]);
        }

        autoTable(doc, {
            startY: finalY + 5,
            head: [['Estancia', `Superficie (${showConstructed ? 'Const.' : 'Útil'})`]],
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
        if (finalY > 230) {
            doc.addPage();
            finalY = 20;
        }
    });

    // --- EXECUTIVE SUMMARY & CHART ---
    
    // Ensure we have space for the summary
    if (finalY > 180) {
        doc.addPage();
        finalY = 20;
    }

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(darkColor);
    doc.text("RESUMEN DE SUPERFICIES Y GRÁFICA", 14, finalY);
    doc.setDrawColor(primaryColor);
    doc.line(14, finalY + 2, 196, finalY + 2);
    
    finalY += 10;

    const grandTotal = grandTotalInterior + grandTotalExterior;
    const pctInterior = (grandTotalInterior / grandTotal) * 100;
    const pctExterior = (grandTotalExterior / grandTotal) * 100;

    // 1. Summary Table
    autoTable(doc, {
        startY: finalY,
        head: [['CONCEPTO', 'SUPERFICIE TOTAL', 'PORCENTAJE']],
        body: [
            ['Espacios Interiores', `${grandTotalInterior.toFixed(2)} m²`, `${pctInterior.toFixed(1)}%`],
            ['Espacios Exteriores', `${grandTotalExterior.toFixed(2)} m²`, `${pctExterior.toFixed(1)}%`],
            ['TOTAL VIVIENDA', `${grandTotal.toFixed(2)} m²`, '100%']
        ],
        theme: 'striped',
        headStyles: { fillColor: [26, 26, 26], textColor: 255, fontStyle: 'bold', halign: 'center' }, // Dark header
        columnStyles: {
            0: { fontStyle: 'bold' },
            1: { halign: 'center' },
            2: { halign: 'center' }
        },
        styles: { fontSize: 10, cellPadding: 3 }
    });

    // @ts-ignore
    finalY = doc.lastAutoTable.finalY + 15;

    // 2. Visual Graph (Stacked Bar)
    // Draw Background Bar
    const graphWidth = 180;
    const graphHeight = 15;
    const graphX = 14;
    
    // Label for Graph
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Distribución Visual de Espacios:", graphX, finalY - 3);

    // Interior Bar (Green)
    const interiorWidth = (graphWidth * pctInterior) / 100;
    doc.setFillColor(primaryColor); 
    doc.rect(graphX, finalY, interiorWidth, graphHeight, 'F');

    // Exterior Bar (Dark Gray)
    const exteriorWidth = graphWidth - interiorWidth;
    doc.setFillColor(darkColor);
    doc.rect(graphX + interiorWidth, finalY, exteriorWidth, graphHeight, 'F');

    // Add Legend/Labels below graph
    const legendY = finalY + graphHeight + 6;
    
    // Interior Legend
    doc.setFillColor(primaryColor);
    doc.circle(graphX + 2, legendY - 1, 1.5, 'F');
    doc.setTextColor(darkColor);
    doc.setFontSize(9);
    doc.text(`Interior (${pctInterior.toFixed(0)}%)`, graphX + 6, legendY);

    // Exterior Legend
    doc.setFillColor(darkColor);
    doc.circle(graphX + 40, legendY - 1, 1.5, 'F');
    doc.text(`Exterior (${pctExterior.toFixed(0)}%)`, graphX + 44, legendY);

    // Disclaimer Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.setFont("helvetica", "normal");
    const disclaimer = `Nota: El presente documento tiene carácter informativo. Las superficies indicadas son ${showConstructed ? 'construidas' : 'útiles'} y pueden sufrir variaciones por exigencias técnicas. El mobiliario es decorativo. La superficie total incluye partes proporcionales de zonas comunes y exteriores según normativa aplicable.`;
    const splitDisclaimer = doc.splitTextToSize(disclaimer, 180);
    
    // Place disclaimer at bottom of page
    const pageHeight = doc.internal.pageSize.height;
    doc.text(splitDisclaimer, 14, pageHeight - 20);

    // Save
    const suffix = showConstructed ? "Construidas" : "Utiles";
    doc.save(`Informe_${selectedHouse.id}_HuertosDeLaCanada_${suffix}.pdf`);
};