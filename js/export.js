// PDF Export using jsPDF
function exportPDF() {
  if (!currentProperty) return alert('No property loaded');
  const p = currentProperty;
  const tier = p.costTier || 'mid';
  const ch = p.ceilingHeight || 8;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const margin = 15;
  const cw = W - margin * 2;
  let y = margin;

  // Colors
  const navy = [31, 56, 100];
  const blue = [47, 84, 150];
  const green = [84, 130, 53];
  const lightBlue = [214, 228, 240];
  const lightGreen = [198, 239, 206];
  const white = [255, 255, 255];
  const black = [0, 0, 0];

  function checkPage(needed) {
    if (y + needed > H - 20) {
      doc.addPage();
      y = margin;
      return true;
    }
    return false;
  }

  // ── HEADER ──
  doc.setFillColor(...navy);
  doc.rect(0, 0, W, 28, 'F');
  doc.setTextColor(...white);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('FLIP WALKTHROUGH REPORT', W / 2, 12, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Buffalo, NY Market', W / 2, 19, { align: 'center' });
  doc.setFontSize(8);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-US')}`, W / 2, 25, { align: 'center' });
  y = 35;

  // ── PROPERTY INFO ──
  doc.setFillColor(...lightBlue);
  doc.rect(margin, y, cw, 20, 'F');
  doc.setTextColor(...navy);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(p.address || 'No Address', margin + 4, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`${fmt(p.sqft)} sq ft  |  Purchase: ${fmtMoney(p.purchasePrice)}  |  ARV: ${fmtMoney(p.arv)}  |  Tier: ${tier.toUpperCase()}`, margin + 4, y + 15);
  y += 26;

  // ── ROOM-BY-ROOM DETAIL ──
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...navy);
  doc.text('ROOM-BY-ROOM BREAKDOWN', margin, y);
  y += 6;

  let grandTotal = 0;

  ROOMS.forEach(roomDef => {
    const rData = p.rooms[roomDef.name];
    if (!rData) return;
    const roomCost = calcRoomTotal(p, roomDef.name);
    if (roomCost === 0) return;

    checkPage(24);

    // Room header
    doc.setFillColor(...blue);
    doc.rect(margin, y, cw, 7, 'F');
    doc.setTextColor(...white);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(roomDef.name, margin + 3, y + 5);
    doc.text(fmtMoney(roomCost), margin + cw - 3, y + 5, { align: 'right' });
    y += 9;

    // Column headers
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, y, cw, 5, 'F');
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text('Category', margin + 2, y + 3.5);
    doc.text('Type', margin + 42, y + 3.5);
    doc.text('Action', margin + 72, y + 3.5);
    doc.text('Qty', margin + 100, y + 3.5);
    doc.text('Unit Cost', margin + 120, y + 3.5);
    doc.text('Total', margin + cw - 2, y + 3.5, { align: 'right' });
    y += 6;

    // Items
    roomDef.categories.forEach(catDef => {
      if (catDef.multiRow) {
        // Multi-row category (Trim, Lights and Devices)
        const rows = Array.isArray(rData.items[catDef.cat]) ? rData.items[catDef.cat] : [];
        rows.forEach(row => {
          if (!row.action || row.action === 'Keep') return;
          let qty;
          if (needsDimensions(catDef.calc)) {
            qty = calcQty(catDef.calc, rData.length, rData.width, ch);
          } else {
            qty = parseFloat(row.dim2) || (parseFloat(row.dim1) || 0);
          }
          const uc = getCost(catDef.cat, row.type, row.action, tier);
          const tc = qty * uc;
          if (tc === 0) return;

          checkPage(6);
          doc.setTextColor(...black);
          doc.setFontSize(8);
          doc.setFont('helvetica', 'normal');
          doc.text(catDef.cat, margin + 2, y + 3.5);
          doc.text(row.type || '', margin + 42, y + 3.5);
          doc.text(row.action || '', margin + 72, y + 3.5);
          doc.text(fmt(qty), margin + 100, y + 3.5);
          doc.text(fmtMoney(uc), margin + 120, y + 3.5);
          doc.setFont('helvetica', 'bold');
          doc.text(fmtMoney(tc), margin + cw - 2, y + 3.5, { align: 'right' });
          y += 5;
        });
      } else {
        // Single-row category
        const item = rData.items[catDef.cat];
        if (!item || !item.action || item.action === 'Keep') return;

        let qty;
        if (needsDimensions(catDef.calc)) {
          qty = calcQty(catDef.calc, rData.length, rData.width, ch);
        } else if (catDef.calc === 'linft') {
          qty = parseFloat(item.dim1) || 0;
        } else {
          qty = parseFloat(item.dim2) || (parseFloat(item.dim1) || 0);
        }
        const uc = getCost(catDef.cat, item.type, item.action, tier);
        const tc = qty * uc;
        if (tc === 0) return;

        checkPage(6);
        doc.setTextColor(...black);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(catDef.cat, margin + 2, y + 3.5);
        doc.text(item.type || '', margin + 42, y + 3.5);
        doc.text(item.action || '', margin + 72, y + 3.5);
        doc.text(fmt(qty), margin + 100, y + 3.5);
        doc.text(fmtMoney(uc), margin + 120, y + 3.5);
        doc.setFont('helvetica', 'bold');
        doc.text(fmtMoney(tc), margin + cw - 2, y + 3.5, { align: 'right' });
        y += 5;
      }
    });

    y += 3;
    grandTotal += roomCost;
  });

  // ── BUDGET SUMMARY ──
  checkPage(40);
  y += 4;
  doc.setFillColor(...navy);
  doc.rect(margin, y, cw, 7, 'F');
  doc.setTextColor(...white);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('BUDGET SUMMARY', margin + 3, y + 5);
  y += 9;

  const contingency = grandTotal * 0.15;
  const rehab = grandTotal + contingency;

  const summaryRows = [
    ['Rehab Subtotal', fmtMoney(grandTotal)],
    ['Contingency (15%)', fmtMoney(contingency)],
  ];
  summaryRows.forEach(([label, val]) => {
    doc.setTextColor(...black);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(label, margin + 4, y + 4);
    doc.text(val, margin + cw - 4, y + 4, { align: 'right' });
    y += 6;
  });

  // Total line
  doc.setFillColor(...lightGreen);
  doc.rect(margin, y, cw, 7, 'F');
  doc.setTextColor(0, 97, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL REHAB BUDGET', margin + 4, y + 5);
  doc.text(fmtMoney(rehab), margin + cw - 4, y + 5, { align: 'right' });
  y += 12;

  // ── DEAL ANALYSIS ──
  checkPage(50);
  doc.setFillColor(...green);
  doc.rect(margin, y, cw, 7, 'F');
  doc.setTextColor(...white);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('DEAL ANALYSIS', margin + 3, y + 5);
  y += 9;

  const holding = p.holdingCosts || 0;
  const closeBuy = p.closingBuy || 0;
  const closeSell = p.closingSell || 0;
  const purchase = p.purchasePrice || 0;
  const arv = p.arv || 0;
  const allIn = purchase + rehab + holding + closeBuy + closeSell;
  const profit = arv - allIn;
  const roi = allIn > 0 ? (profit / allIn * 100) : 0;

  const dealRows = [
    ['Purchase Price', fmtMoney(purchase)],
    [`Rehab (${tier} + 15% contingency)`, fmtMoney(rehab)],
    ['Holding Costs', fmtMoney(holding)],
    ['Closing Costs (Buy)', fmtMoney(closeBuy)],
    ['Closing Costs (Sell)', fmtMoney(closeSell)],
    ['Total All-In Cost', fmtMoney(allIn)],
    ['ARV', fmtMoney(arv)],
  ];

  dealRows.forEach(([label, val], i) => {
    const isBold = i >= 5;
    doc.setTextColor(...black);
    doc.setFontSize(9);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.text(label, margin + 4, y + 4);
    doc.text(val, margin + cw - 4, y + 4, { align: 'right' });
    doc.setDrawColor(220, 220, 220);
    doc.line(margin, y + 6, margin + cw, y + 6);
    y += 7;
  });

  // Profit line
  const profitColor = profit >= 0 ? [0, 97, 0] : [192, 0, 0];
  const profitBg = profit >= 0 ? lightGreen : [252, 228, 236];
  doc.setFillColor(...profitBg);
  doc.rect(margin, y, cw, 8, 'F');
  doc.setTextColor(...profitColor);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Estimated Profit', margin + 4, y + 6);
  doc.text(`${fmtMoney(profit)}  (${roi.toFixed(1)}% ROI)`, margin + cw - 4, y + 6, { align: 'right' });
  y += 14;

  // ── FOOTER ──
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('Generated by Flip Walkthrough | Buffalo, NY Cost Database | Prices are estimates only', W / 2, H - 8, { align: 'center' });

  // Save
  const filename = (p.address || 'property').replace(/[^a-zA-Z0-9]/g, '_') + '_walkthrough.pdf';
  doc.save(filename);
}
