// Takbiran - salin/bagikan hasil dan export ke PDF, Excel, serta Markdown.

// ===== SALIN & BAGIKAN =====
function salinShare(target) {
  closeModal('salin-modal');
  if (!state.resultText) return;
  const encoded = encodeURIComponent(state.resultText);
  if (target === 'telegram') {
    window.open('https://t.me/share/url?url=%20&text=' + encoded, '_blank');
  } else if (target === 'whatsapp') {
    window.open('https://wa.me/?text=' + encoded, '_blank');
  } else if (target === 'copy') {
    copyToClipboard(state.resultText)
      .then(() => showToast('Disalin ke clipboard'))
      .catch(() => showToast('Gagal menyalin'));
  }
}

function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text).catch(() => legacyCopy(text));
  }
  return legacyCopy(text);
}

function legacyCopy(text) {
  return new Promise((resolve, reject) => {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    ta.remove();
    ok ? resolve() : reject(new Error('copy failed'));
  });
}

// ===== EXPORT =====
function openExportModal() {
  if (state.resultData) openModal('export-modal');
}

function exportAs(fmt) {
  closeModal('export-modal');
  exportAndShare(fmt);
}

async function exportAndShare(fmt) {
  if (!state.resultData) return;
  const filename = getFilenameBase();
  let file;
  try {
    if (fmt === 'pdf') {
      showToast('Membuat PDF...');
      file = new File([await buildPdfBlob()], filename + '.pdf', { type: 'application/pdf' });
    } else if (fmt === 'xlsx') {
      showToast('Membuat Excel...');
      file = new File([await buildXlsxBlob()], filename + '.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
    } else if (fmt === 'md') {
      file = new File([buildMarkdownText()], filename + '.md', { type: 'text/markdown' });
    } else {
      return;
    }
  } catch (err) {
    console.error(err);
    showToast('Gagal membuat file');
    return;
  }

  // Cek canShare dulu supaya tidak memicu share yang pasti gagal di desktop.
  if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: filename });
      showToast('File berhasil dibagikan');
      return;
    } catch (err) {
      if (err && err.name === 'AbortError') return;
      console.log('Share fallback:', err);
    }
  }
  downloadFile(file);
  showToast(fmt.toUpperCase() + ' berhasil di-download');
}

function downloadFile(file) {
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function slug(str) {
  return String(str).trim().replace(/\s+/g, '-').replace(/[^A-Za-z0-9\-_]/g, '');
}

function getFilenameBase() {
  const d = state.resultData;
  const dateStr = state.tanggal ? state.tanggal.replace(/-/g, '') : '';
  if (!d) return 'Penilaian_' + dateStr;
  let title;
  if (d.type === 'scoring') {
    title = d.jenis === '7langkah' ? '7-Langkah-Pelayanan' : 'Double-Check-Order';
  } else if (d.isAll) {
    title = 'Kebersihan-Semua';
  } else {
    title = 'Kebersihan-' + d.areaResults.map(ar => slug(ar.label)).join('-');
  }
  return `${title}_${slug(state.tokoSelected)}_${dateStr}`;
}

// ===== PDF =====
async function buildPdfBlob() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const marginX = 15;
  const marginTop = 15;
  const marginBottom = 15;
  const contentW = pageW - marginX * 2;
  let y = marginTop;

  const ensureSpace = h => {
    if (y + h > pageH - marginBottom) { pdf.addPage(); y = marginTop; }
  };

  const writeText = (text, opts = {}) => {
    const size = opts.size || 10;
    const color = opts.color || [31, 41, 55];
    const indent = opts.indent || 0;
    pdf.setFont('helvetica', opts.style || 'normal');
    pdf.setFontSize(size);
    pdf.setTextColor(color[0], color[1], color[2]);
    const lineH = size * 0.45;
    pdf.splitTextToSize(text, contentW - indent).forEach(line => {
      ensureSpace(lineH);
      pdf.text(line, marginX + indent, y + lineH * 0.75);
      y += lineH;
    });
  };

  const writeGap = h => { y += h; };

  const writeRule = () => {
    ensureSpace(3);
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.2);
    pdf.line(marginX, y, pageW - marginX, y);
    y += 3;
  };

  const writeKeyVal = (key, val) => {
    const size = 10;
    const lineH = size * 0.45;
    pdf.setFontSize(size);
    pdf.setFont('helvetica', 'normal');
    const keyW = pdf.getTextWidth(key + ': ');
    pdf.splitTextToSize(String(val), contentW - keyW).forEach((line, i) => {
      ensureSpace(lineH);
      if (i === 0) {
        pdf.setTextColor(107, 114, 128);
        pdf.setFont('helvetica', 'normal');
        pdf.text(key + ': ', marginX, y + lineH * 0.75);
      }
      pdf.setTextColor(31, 41, 55);
      pdf.setFont('helvetica', 'bold');
      pdf.text(line, marginX + keyW, y + lineH * 0.75);
      y += lineH;
    });
    y += 1;
  };

  const loadImg = src => new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });

  // Foto disusun mengalir ke samping, pindah baris saat lebar habis.
  const addPhotoStrip = async (list) => {
    const cellW = 42;
    const cellH = 32;
    const gap = 3;
    const startX = marginX + 4;
    const perRow = Math.max(1, Math.floor((contentW - 4 + gap) / (cellW + gap)));
    for (let i = 0; i < list.length; i += perRow) {
      const chunk = list.slice(i, i + perRow);
      ensureSpace(cellH + gap);
      for (let c = 0; c < chunk.length; c++) {
        const img = await loadImg(chunk[c]);
        if (!img) continue;
        let w = cellW;
        let h = (img.height / img.width) * w;
        if (h > cellH) { h = cellH; w = (img.width / img.height) * h; }
        try {
          pdf.addImage(chunk[c], 'JPEG', startX + c * (cellW + gap), y, w, h);
        } catch (e) { console.error('PDF img err', e); }
      }
      y += cellH + gap;
    }
  };

  const d = state.resultData;

  if (d.type === 'scoring') {
    writeText(d.jenis === '7langkah' ? 'PENILAIAN 7 LANGKAH PELAYANAN' : 'PENILAIAN DOUBLE CHECK ORDER',
      { size: 14, style: 'bold', color: [234, 88, 12] });
    writeGap(2);
    writeRule();
    writeKeyVal('Nama Toko', state.tokoSelected);
    writeKeyVal(d.kasirLabel, state.kasir);
    writeKeyVal('Hari/Tanggal', formatTanggal(state.tanggal));
    writeKeyVal('Jam', state.jam);
    writeRule();
    d.sections.forEach(sec => {
      writeGap(2);
      writeText(sec.section, { size: 11, style: 'bold', color: [234, 88, 12] });
      sec.items.forEach(it => {
        writeText(`- ${it.name} : ${it.skor}`, { size: 10, indent: 2 });
        if (it.ket) writeText(`"${it.ket}"`, { size: 9, style: 'italic', color: [107, 114, 128], indent: 6 });
      });
    });
    writeGap(3);
    writeRule();
    writeKeyVal('POIN', d.pctDisplay);
    writeKeyVal('KATEGORI', d.kategori);
  } else {
    writeText('PENILAIAN KEBERSIHAN', { size: 14, style: 'bold', color: [234, 88, 12] });
    writeGap(2);
    writeRule();
    writeKeyVal('Nama Toko', state.tokoSelected);
    writeKeyVal('Nama Auditor', state.kasir);
    writeKeyVal('Hari/Tanggal', formatTanggal(state.tanggal));
    writeKeyVal('Jam', state.jam);
    writeKeyVal('Area', d.areaLabelJoined);
    writeRule();
    for (const ar of d.areaResults) {
      writeGap(2);
      writeText(ar.label.toUpperCase(), { size: 11, style: 'bold', color: [234, 88, 12] });
      for (const it of ar.items) {
        // Helvetica bawaan jsPDF tidak punya glyph emoji, jadi pakai [v] / [x].
        const mark = it.val === 'yes' ? '[v]' : '[x]';
        writeText(`${mark} ${it.name}`, {
          size: 10, indent: 2,
          color: it.val === 'yes' ? [22, 163, 74] : [220, 38, 38]
        });
        if (it.ket) writeText(`"${it.ket}"`, { size: 9, style: 'italic', color: [107, 114, 128], indent: 6 });
        if (it.photos.length) await addPhotoStrip(it.photos);
      }
    }
    writeGap(3);
    writeRule();
    writeKeyVal('POIN', d.pctDisplay);
    writeKeyVal('KATEGORI', d.kategori);
  }

  return pdf.output('blob');
}

// ===== EXCEL =====
async function buildXlsxBlob() {
  const d = state.resultData;
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Takbiran';
  workbook.created = new Date();
  const ws = workbook.addWorksheet('Hasil');

  // Kolom foto dibuat sebanyak foto terbanyak pada satu item.
  const maxPhotos = d.type === 'checklist'
    ? d.areaResults.reduce((m, ar) => Math.max(m, ...ar.items.map(i => i.photos.length)), 0)
    : 0;
  const photoCols = Math.max(maxPhotos, d.type === 'checklist' ? 1 : 0);
  const lastCol = 4 + photoCols;

  ws.getColumn(1).width = 6;
  ws.getColumn(2).width = 55;
  ws.getColumn(3).width = 10;
  ws.getColumn(4).width = 40;
  for (let c = 5; c <= lastCol; c++) ws.getColumn(c).width = 22;

  const thinBorder = {
    top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
    left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
    bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
    right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
  };

  let rowIdx = 1;
  const applyBorderRow = r => {
    for (let c = 1; c <= lastCol; c++) ws.getCell(r, c).border = thinBorder;
  };

  const judul = d.type === 'scoring'
    ? (d.jenis === '7langkah' ? 'PENILAIAN 7 LANGKAH PELAYANAN' : 'PENILAIAN DOUBLE CHECK ORDER')
    : 'PENILAIAN KEBERSIHAN';
  ws.mergeCells(rowIdx, 1, rowIdx, lastCol);
  const titleCell = ws.getCell(rowIdx, 1);
  titleCell.value = judul;
  titleCell.font = { bold: true, size: 14, color: { argb: 'FFEA580C' } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  ws.getRow(rowIdx).height = 24;
  rowIdx += 2;

  const infoRows = [
    ['Nama Toko', state.tokoSelected],
    [d.kasirLabel, state.kasir],
    ['Hari/Tanggal', formatTanggal(state.tanggal)],
    ['Jam', state.jam],
  ];
  if (d.type === 'checklist') infoRows.push(['Area', d.areaLabelJoined]);
  infoRows.forEach(([k, v]) => {
    ws.getCell(rowIdx, 1).value = k;
    ws.getCell(rowIdx, 1).font = { bold: true };
    ws.mergeCells(rowIdx, 2, rowIdx, lastCol);
    ws.getCell(rowIdx, 2).value = v;
    applyBorderRow(rowIdx);
    rowIdx++;
  });
  rowIdx++;

  const headers = d.type === 'checklist'
    ? ['No', 'Item Penilaian', 'Hasil', 'Keterangan', ...Array.from({ length: photoCols }, (_, i) => 'Foto ' + (i + 1))]
    : ['No', 'Item Penilaian', 'Nilai', 'Keterangan'];
  headers.forEach((h, i) => {
    const c = ws.getCell(rowIdx, i + 1);
    c.value = h;
    c.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEA580C' } };
    c.alignment = { horizontal: 'center', vertical: 'middle' };
    c.border = thinBorder;
  });
  rowIdx++;

  const writeGroupHeader = text => {
    ws.mergeCells(rowIdx, 1, rowIdx, lastCol);
    const cell = ws.getCell(rowIdx, 1);
    cell.value = text;
    cell.font = { bold: true, color: { argb: 'FFEA580C' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF7ED' } };
    applyBorderRow(rowIdx);
    rowIdx++;
  };

  const writeSummaryRow = (label, value) => {
    ws.getCell(rowIdx, 1).value = label;
    ws.getCell(rowIdx, 1).font = { bold: true };
    ws.mergeCells(rowIdx, 2, rowIdx, lastCol);
    ws.getCell(rowIdx, 2).value = value;
    ws.getCell(rowIdx, 2).font = { bold: true, color: { argb: 'FFEA580C' } };
    applyBorderRow(rowIdx);
    rowIdx++;
  };

  if (d.type === 'scoring') {
    d.sections.forEach(sec => {
      writeGroupHeader(sec.section);
      sec.items.forEach((it, i) => {
        ws.getCell(rowIdx, 1).value = i + 1;
        ws.getCell(rowIdx, 2).value = it.name;
        ws.getCell(rowIdx, 3).value = it.skor;
        ws.getCell(rowIdx, 4).value = it.ket || '';
        ws.getCell(rowIdx, 1).alignment = { horizontal: 'center' };
        ws.getCell(rowIdx, 3).alignment = { horizontal: 'center' };
        ws.getCell(rowIdx, 2).alignment = { wrapText: true, vertical: 'top' };
        ws.getCell(rowIdx, 4).alignment = { wrapText: true, vertical: 'top' };
        applyBorderRow(rowIdx);
        rowIdx++;
      });
    });
  } else {
    for (const ar of d.areaResults) {
      writeGroupHeader(ar.label.toUpperCase());
      for (let i = 0; i < ar.items.length; i++) {
        const it = ar.items[i];
        ws.getCell(rowIdx, 1).value = i + 1;
        ws.getCell(rowIdx, 2).value = it.name;
        const hasil = ws.getCell(rowIdx, 3);
        hasil.value = it.val === 'yes' ? '✔' : '✘';
        hasil.font = { bold: true, size: 14, color: { argb: it.val === 'yes' ? 'FF16A34A' : 'FFDC2626' } };
        hasil.alignment = { horizontal: 'center', vertical: 'middle' };
        ws.getCell(rowIdx, 4).value = it.ket || '';
        ws.getCell(rowIdx, 1).alignment = { horizontal: 'center', vertical: 'middle' };
        ws.getCell(rowIdx, 2).alignment = { wrapText: true, vertical: 'top' };
        ws.getCell(rowIdx, 4).alignment = { wrapText: true, vertical: 'top' };
        applyBorderRow(rowIdx);

        if (it.photos.length) {
          ws.getRow(rowIdx).height = 90;
          it.photos.forEach((src, p) => {
            try {
              const imgId = workbook.addImage({ base64: src.split(',')[1], extension: 'jpeg' });
              ws.addImage(imgId, {
                tl: { col: 4 + p, row: rowIdx - 1 },
                ext: { width: 140, height: 110 },
                editAs: 'oneCell'
              });
            } catch (e) { console.error('xlsx img err', e); }
          });
        }
        rowIdx++;
      }
    }
  }

  rowIdx++;
  writeSummaryRow('POIN', d.pctDisplay);
  writeSummaryRow('KATEGORI', d.kategori);

  const buffer = await workbook.xlsx.writeBuffer();
  return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

// ===== MARKDOWN =====
function buildMarkdownText() {
  const d = state.resultData;
  let md = '';

  if (d.type === 'scoring') {
    md += `# Penilaian ${d.jenis === '7langkah' ? '7 Langkah Pelayanan' : 'Double Check Order'}\n\n`;
    md += `- **Nama Toko:** ${state.tokoSelected}\n`;
    md += `- **${d.kasirLabel}:** ${state.kasir}\n`;
    md += `- **Hari/Tanggal:** ${formatTanggal(state.tanggal)}\n`;
    md += `- **Jam:** ${state.jam}\n\n`;
    d.sections.forEach(sec => {
      md += `## ${sec.section}\n\n`;
      sec.items.forEach(it => {
        md += `- ${it.name} — **${it.skor}**\n`;
        if (it.ket) md += `  > "${it.ket}"\n`;
      });
      md += '\n';
    });
  } else {
    md += `# Penilaian Kebersihan\n\n`;
    md += `- **Nama Toko:** ${state.tokoSelected}\n`;
    md += `- **Nama Auditor:** ${state.kasir}\n`;
    md += `- **Hari/Tanggal:** ${formatTanggal(state.tanggal)}\n`;
    md += `- **Jam:** ${state.jam}\n`;
    md += `- **Area:** ${d.areaLabelJoined}\n\n`;
    d.areaResults.forEach(ar => {
      md += `## ${ar.label.toUpperCase()}\n\n`;
      ar.items.forEach(it => {
        md += `- ${it.val === 'yes' ? '✅' : '❌'} ${it.name}\n`;
        if (it.ket) md += `  > "${it.ket}"\n`;
        if (it.photos.length) md += `  > _${it.photos.length} foto terlampir_\n`;
      });
      md += '\n';
    });
  }
  md += `---\n\n**POIN:** ${d.pctDisplay}  \n**KATEGORI:** ${d.kategori}\n`;
  return md;
}
