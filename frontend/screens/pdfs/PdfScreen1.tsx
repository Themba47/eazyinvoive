import React, { useEffect, useState } from 'react';
import { Button, View } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { Buffer } from 'buffer';

// Ensure Buffer is globally available
global.Buffer = global.Buffer || Buffer;

const generateInvoicePdx = async ({ route, navigation }) => {
  // Create a new PDF Document
  const [pdfPath, setPdfPath] = useState('');
  const { data } = route.params;
  const pdfDoc = await PDFDocument.create();

  // Add a page
  const page = pdfDoc.addPage([595, 842]); // A4 size in points (width x height)

  // Embed Fonts
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  // Add Text and Design
  const { height } = page.getSize();
  const margin = 50;

  // Header
  page.drawText('Accelerit Technologies (PTY) LTD', {
    x: margin,
    y: height - 50,
    size: 14,
    font: timesRomanBoldFont,
  });

  page.drawText('35A Rietfontein Road, Edenburg, Rivonia, 2198', {
    x: margin,
    y: height - 70,
    size: 10,
    font: timesRomanFont,
  });

  page.drawText('Email: info@accelerit.co.za | Tel: +27(0)105000220', {
    x: margin,
    y: height - 90,
    size: 10,
    font: timesRomanFont,
  });

  page.drawText('Company Reg: 2011/110345/07 | Vat Reg Number: 4690267804', {
    x: margin,
    y: height - 110,
    size: 10,
    font: timesRomanFont,
  });

  page.drawText('Icasa Registration: 0377/CECNS/JUNE/2013', {
    x: margin,
    y: height - 130,
    size: 10,
    font: timesRomanFont,
  });

  // Invoice Info
  page.drawText('Invoice #653710', { x: margin, y: height - 180, size: 12, font: timesRomanBoldFont });
  page.drawText('Invoice Date: Tuesday, December 17th, 2024', { x: margin, y: height - 200, size: 10, font: timesRomanFont });
  page.drawText('Due Date: Wednesday, January 1st, 2025', { x: margin, y: height - 220, size: 10, font: timesRomanFont });

  // Invoiced To
  page.drawText('Invoiced To', { x: margin, y: height - 270, size: 12, font: timesRomanBoldFont });
  page.drawText('Themba Sishuba', { x: margin, y: height - 290, size: 10, font: timesRomanFont });
  page.drawText('210 Bellefield Avenue, Mondeor, Johannesburg, South Africa', {
    x: margin,
    y: height - 310,
    size: 10,
    font: timesRomanFont,
  });

  // Table (simplified for description)
  page.drawText('Description', { x: margin, y: height - 370, size: 12, font: timesRomanBoldFont });
  page.drawText('Total', { x: 400, y: height - 370, size: 12, font: timesRomanBoldFont });

  page.drawText('Accelerit/Vuma Uncapped 50/50mbps (01/01/2025 - 31/01/2025)', {
    x: margin,
    y: height - 390,
    size: 10,
    font: timesRomanFont,
  });
  page.drawText('R733.00', { x: 400, y: height - 390, size: 10, font: timesRomanFont });

  // Sub Total
  page.drawText('Sub Total', { x: margin, y: height - 430, size: 10, font: timesRomanFont });
  page.drawText('R637.39', { x: 400, y: height - 430, size: 10, font: timesRomanFont });

  page.drawText('15.00% ZAR VAT', { x: margin, y: height - 450, size: 10, font: timesRomanFont });
  page.drawText('R95.61', { x: 400, y: height - 450, size: 10, font: timesRomanFont });

  page.drawText('Total', { x: margin, y: height - 470, size: 10, font: timesRomanBoldFont });
  page.drawText('R733.00', { x: 400, y: height - 470, size: 10, font: timesRomanBoldFont });

  // Footer
  page.drawText('Balance: R733.00', { x: margin, y: height - 530, size: 12, font: timesRomanBoldFont });
  page.drawText('PDF Generated on Tuesday, December 17th, 2024', {
    x: margin,
    y: height - 550,
    size: 10,
    font: timesRomanFont,
  });

  // Save the PDF
  const pdfBytes = await pdfDoc.save();

	// Convert bytes to base64
	const pdfBase64 = Buffer.from(pdfBytes).toString('base64');

	// Save the PDF file using expo-file-system
	const filePath = `${FileSystem.documentDirectory}example.pdf`;
	await FileSystem.writeAsStringAsync(filePath, pdfBase64, {
	encoding: FileSystem.EncodingType.Base64,
	});

	// Set the path for the generated PDF
	setPdfPath(filePath);
	console.log(filePath)
};

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Generate Invoice PDF" onPress={generateInvoicePdf} />
    </View>
  );
}
