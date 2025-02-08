import React, { useEffect, useState } from 'react';
import { Button, View } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { Buffer } from 'buffer';
import { backendApp, getPaperSize } from '../utils';

export const generateInvoicePdf = async (onSavePath, data) => {
  const pdfDoc = await PDFDocument.create();

  // Add a page
  const papersize = getPaperSize('A4')
  const page = pdfDoc.addPage(papersize);

  // Embed Fonts
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  // Add Text and Design
  const { width, height } = page.getSize();
  const margin = 50;

  const drawText = (text, x, y, size = 12, color = rgb(0, 0, 0)) => {
    page.drawText(text, { x, y, size, timesRomanFont, color });
  };

  const drawRectangle = (x, y, w, h, color = rgb(0.9, 0.9, 0.9)) => {
      page.drawRectangle({ x, y, width: w, height: h, color });
  };

  // Header
  drawText('UNPAID', 50, height - 50, 16, rgb(1, 0, 0));
  drawText('Accelerit Technologies (PTY) LTD', 350, height - 80, 12);
  drawText('35A Rietfontein Road', 350, height - 100);
  drawText('Edenburg, Rivonia, 2198', 350, height - 120);
  drawText('Email: info@accelerit.co.za', 350, height - 140);
  drawText('Tel: +27(0)105000220', 350, height - 160);
  drawText('Company Reg: 2011/110345/07', 350, height - 180);
  drawText('Vat Reg Number: 4690267804', 350, height - 200);
  drawText('Icasa Registration: 0377/CECNS/JUNE/2013', 350, height - 220);

  // Invoice details
  drawText('Invoice #664036', 50, height - 240, 14);
  drawText('Invoice Date: Friday, January 17th, 2025', 50, height - 260);
  drawText('Due Date: Saturday, February 1st, 2025', 50, height - 280);

  // Invoiced To
  drawText('Invoiced To:', 50, height - 310, 14);
  drawText('Themba Sishuba', 50, height - 330);
  drawText('210 Bellefield Avenue', 50, height - 350);
  drawText('Mondeor, Johannesburg, South Africa', 50, height - 370);

  // Table Headers with background
  drawRectangle(50, height - 420, 495, 20, rgb(0.8, 0.8, 0.8));
  drawText('Description', 60, height - 415, 14);
  drawText('Total', 400, height - 415, 14);

  // Table Content with alternating background
  drawRectangle(50, height - 440, 495, 20, rgb(0.95, 0.95, 0.95));
  drawText('Accelerit/Vuma Uncapped 50/50mbps (01/02/2025 - 28/02/2025)', 60, height - 435);
  drawText('R733.00', 400, height - 435);

  // Totals Section with background
  drawRectangle(50, height - 490, 495, 20, rgb(0.95, 0.95, 0.95));
  drawText('Sub Total:', 60, height - 485);
  drawText('R637.39', 400, height - 485);
  drawText('15.00% ZAR VAT:', 60, height - 505);
  drawText('R95.61', 400, height - 505);
  drawText('Credit:', 60, height - 525);
  drawText('R0.00', 400, height - 525);
  drawText('Total:', 60, height - 545, 14);
  drawText('R733.00', 400, height - 545, 14);

  // Transactions with background
  drawRectangle(50, height - 590, 535, 20, rgb(0.8, 0.8, 0.8));
  drawText('Transactions', 60, height - 585, 14);
  drawText('Transaction Date', 60, height - 610);
  drawText('Gateway', 200, height - 610);
  drawText('Transaction ID', 300, height - 610);
  drawText('Amount', 450, height - 610);
  drawText('No Related Transactions Found', 60, height - 630);

  // Footer
  drawText('Balance: R733.00', 50, height - 670, 14);
  drawText('PDF Generated on Friday, January 17th, 2025', 50, height - 690);
  drawText('Powered by TCPDF (www.tcpdf.org)', 50, height - 710, 10);
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
	onSavePath(filePath);
	console.log(filePath)
};