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
  if(data.selectedOption == 'UNPAID') {
    drawText(data.selectedOption, 500, height - 50, 16, rgb(1, 0, 0));
  }
  if(data.selectedOption == 'PAID') {
    drawText(data.selectedOption, 500, height - 50, 16, rgb(0, 1, 0));
  }
  if(data.selectedOption == 'QUOTE') {
    drawText(data.selectedOption, 500, height - 50, 16, rgb(0, 0, 0));
  }
  drawText('Accelerit Technologies (PTY) LTD', 350, height - 80, 12);
  drawText('35A Rietfontein Road', 350, height - 100);
  drawText('Edenburg, Rivonia, 2198', 350, height - 120);
  drawText('Email: info@accelerit.co.za', 350, height - 140);
  drawText('Tel: +27(0)105000220', 350, height - 160);
  drawText('Company Reg: 2011/110345/07', 350, height - 180);
  drawText('Vat Reg Number: 4690267804', 350, height - 200);
  drawText('Icasa Registration: 0377/CECNS/JUNE/2013', 350, height - 220);

  // Invoice details
  drawText(`Invoice #${data.invoiceNumber}`, 50, height - 240, 14);
  drawText(`Invoice Date: ${data.currentDate}`, 50, height - 260);
  if (data.isDueDate) {
  drawText(`Due Date: ${data.duedate}`, 50, height - 280);
  }

  // Invoiced To
  drawText('Invoiced To:', 50, height - 310, 14);
  for(let i = 0, pos=330; i < 4; i++, pos+=20) {
    drawText(data.selectedClientDetail[i], 50, height - pos);
  }
  // drawText('210 Bellefield Avenue', 50, height - 350);
  // drawText('Mondeor, Johannesburg, South Africa', 50, height - 370);

  // Table Headers with background
  drawRectangle(50, height - 440, 495, 20, rgb(0.8, 0.8, 0.8));
  drawText('Description', 60, height - 435, 14);
  drawText('Total', 400, height - 435, 14);

  // Table Content with alternating background
  let items_height = [480, 475]
  data.selectedJob.forEach(element => {
    console.log(items_height)
    drawRectangle(50, height - items_height[0], 495, 20, rgb(0.95, 0.95, 0.95));
    drawText(element.description, 60, height - items_height[1]);
    if(data.quantityEnabled) {
      drawText(element.quantity, 200, height - items_height[1]);
    }
    drawText(`${data.currency} ${element.price}`, 400, height - items_height[1]);
    items_height[0] += 20
    items_height[1] += 20
  })

  items_height[0] += 20
  items_height[1] += 20

  // Totals Section with background
  drawRectangle(50, height - items_height[0], 495, 20, rgb(0.95, 0.95, 0.95));
  if(data.isTaxIncluded) {
    drawText('Sub Total:', 60, height - items_height[1]);
    drawText(`${data.currency}${data.subtotal}`, 400, height - items_height[1]);
    items_height[0] += 20
    items_height[1] += 20
    drawText(`${data.taxpercentage}% ZAR VAT:`, 60, height - items_height[1]);
    drawText(`${data.currency}${data.taxamount}`, 400, height - items_height[1]);
  }
  items_height[0] += 20
  items_height[1] += 20
  drawText('Total:', 60, height - items_height[1], 14);
  drawText(`R${data.total}`, 400, height - items_height[1], 14);

  // Transactions with background
  // drawRectangle(50, height - 590, 535, 20, rgb(0.8, 0.8, 0.8));
  // drawText('Transactions', 60, height - 585, 14);
  // drawText('Transaction Date', 60, height - 610);
  // drawText('Gateway', 200, height - 610);
  // drawText('Transaction ID', 300, height - 610);
  // drawText('Amount', 450, height - 610);
  // drawText('No Related Transactions Found', 60, height - 630);

  // Footer
  drawText('Balance: R733.00', 50, height - 670, 14);
  drawText(data.notes, 60, height - 690);
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