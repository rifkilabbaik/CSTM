// Takbiran - navigasi, form, penilaian, dan penyusunan hasil.
// Data master ada di js/data.js; export ke PDF/Excel/Markdown ada di js/export.js.

// ===== UTIL =====
// Semua teks dari user di-escape sebelum masuk ke innerHTML.
function esc(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const ICON_CHECK = '<svg class="mark mark-yes" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
const ICON_CROSS = '<svg class="mark mark-no" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

// ===== STATE =====
function blankState() {
  return {
    currentScreen: 'main',
    jenisSelected: null,
    subSelected: [],
    tokoSelected: '',
    kasir: '',
    tanggal: '',
    jam: '',
    scores: {},            // `item_N` -> 1..5
    keterangan: {},
    builtScoringJenis: null,
    checklist: {},         // `${area}__chk_${idx}` -> 'yes' | 'no'
    checkKeterangan: {},
    photos: {},            // `${area}__chk_${idx}` -> array dataURL (tanpa batas)
    resultText: '',
    resultData: null,
  };
}
let state = blankState();

// ===== KATEGORI =====
function getKategori(pct) {
  if (pct >= 100) return 'Sempurna';
  if (pct >= 90) return 'Sangat Baik';
  if (pct >= 80) return 'Baik';
  if (pct >= 75) return 'Cukup';
  return 'Buruk';
}

// ===== MODAL =====
function openModal(id) { document.getElementById(id).classList.add('show'); }
function closeModal(id) { document.getElementById(id).classList.remove('show'); }

// ===== NAVIGATION =====
const SCREEN_IDS = {
  'main': 'screen-main',
  'menu-pilihan': 'screen-menu-pilihan',
  'sub-kebersihan': 'screen-sub-kebersihan',
  'form': 'screen-form',
  'scoring': 'screen-scoring',
  'checklist': 'screen-checklist',
  'hasil': 'screen-hasil',
};

function goTo(screen) {
  const current = document.querySelector('.screen.active');
  const next = document.getElementById(SCREEN_IDS[screen]);
  if (!next || current === next) return;

  current.classList.add('exit-left');
  current.classList.remove('active');
  next.style.transform = 'translateX(30px)';
  next.style.opacity = '0';
  next.classList.add('active');

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      next.style.transform = '';
      next.style.opacity = '';
    });
  });
  setTimeout(() => current.classList.remove('exit-left'), 350);

  state.currentScreen = screen;

  if (screen === 'form') { updateFormLabels(); fillDateTime(false); }
  if (screen === 'scoring') { buildScoringUI(); scrollScreenTop('screen-scoring'); }
  if (screen === 'checklist') { buildChecklistUI(); scrollScreenTop('screen-checklist'); }
  if (screen === 'hasil') scrollScreenTop('screen-hasil');
}

function scrollScreenTop(id) {
  requestAnimationFrame(() => {
    const el = document.getElementById(id);
    if (el) el.scrollTop = 0;
    const content = el && el.querySelector('.page-content');
    if (content) content.scrollTop = 0;
  });
}

// Hanya dipanggil saat user menutup sesi penilaian dari halaman hasil.
function selesai() {
  goTo('main');
  resetAll();
}

function resetAll() {
  state = blankState();
  document.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
  document.getElementById('btn-lanjut-jenis').disabled = true;
  document.getElementById('btn-lanjut-sub-keb').disabled = true;
  document.getElementById('toko-input').value = '';
  document.getElementById('kasir-input').value = '';
  document.getElementById('scoring-content').innerHTML = '';
  document.getElementById('checklist-content').innerHTML = '';
  fillDateTime(true);
  closeDropdown();
}

// ===== MENU PILIHAN =====
function selectJenis(jenis) {
  state.jenisSelected = jenis;
  document.querySelectorAll('#screen-menu-pilihan .card').forEach(c => c.classList.remove('selected'));
  document.getElementById('card-' + jenis).classList.add('selected');
  document.getElementById('btn-lanjut-jenis').disabled = false;
}

function lanjutJenis() {
  if (!state.jenisSelected) return;
  goTo(state.jenisSelected === 'kebersihan' ? 'sub-kebersihan' : 'form');
}

function buildSubKebersihanCards() {
  const check = '<div class="card-check"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div>';
  let html = `<div class="card card-wide" id="sub-semua" onclick="selectSub('semua')">
      <div class="card-title">Semua Area</div>${check}
    </div>`;
  AREA_ORDER.forEach(key => {
    html += `<div class="card" id="sub-${key}" onclick="selectSub('${key}')">
      <div class="card-title">${esc(DATA_KEBERSIHAN[key].label)}</div>${check}
    </div>`;
  });
  document.getElementById('sub-kebersihan-cards').innerHTML = html;
}

function selectSub(sub) {
  if (sub === 'semua') {
    const isAll = AREA_ORDER.every(a => state.subSelected.includes(a));
    state.subSelected = isAll ? [] : [...AREA_ORDER];
  } else if (state.subSelected.includes(sub)) {
    state.subSelected = state.subSelected.filter(s => s !== sub);
  } else {
    state.subSelected.push(sub);
  }
  state.subSelected.sort((a, b) => AREA_ORDER.indexOf(a) - AREA_ORDER.indexOf(b));
  updateSubUI();
}

function updateSubUI() {
  AREA_ORDER.forEach(a => {
    const el = document.getElementById('sub-' + a);
    if (el) el.classList.toggle('selected', state.subSelected.includes(a));
  });
  const semuaEl = document.getElementById('sub-semua');
  if (semuaEl) semuaEl.classList.toggle('selected', state.subSelected.length === AREA_ORDER.length);
  document.getElementById('btn-lanjut-sub-keb').disabled = state.subSelected.length === 0;
}

function lanjutSub() {
  if (state.subSelected.length) goTo('form');
}

function backFromForm() {
  goTo(state.jenisSelected === 'kebersihan' ? 'sub-kebersihan' : 'menu-pilihan');
}

function kasirLabelFor(jenis) {
  if (jenis === 'doublecheck') return 'Nama Kasir/Server';
  if (jenis === 'kebersihan') return 'Nama Auditor';
  return 'Nama Kasir';
}

function areaLabelJoined() {
  if (state.subSelected.length === AREA_ORDER.length) return 'Semua Area';
  return state.subSelected.map(a => DATA_KEBERSIHAN[a].label).join(', ');
}

function updateFormLabels() {
  const label = kasirLabelFor(state.jenisSelected);
  document.getElementById('kasir-label').textContent = label;
  document.getElementById('kasir-input').placeholder = 'Masukkan ' + label.toLowerCase().replace('nama ', 'nama ');
  document.getElementById('form-step').textContent =
    state.jenisSelected === '7langkah' ? '7 Langkah Pelayanan'
    : state.jenisSelected === 'doublecheck' ? 'Double Check Order'
    : state.subSelected.length ? 'Kebersihan - ' + areaLabelJoined() : 'Kebersihan';
}

// ===== DROPDOWN TOKO =====
let dropdownOpen = false;

function renderDropdownList(filter) {
  const q = String(filter).toLowerCase();
  const html = TOKO_LIST
    .map((t, i) => ({ t, i }))
    .filter(o => o.t.toLowerCase().includes(q))
    .map(o => `<div class="dropdown-item${o.t === state.tokoSelected ? ' selected' : ''}" data-idx="${o.i}">${esc(o.t)}</div>`)
    .join('');
  document.getElementById('toko-list').innerHTML = html || '<div class="dropdown-empty">Tidak ditemukan</div>';
}
function openDropdown() {
  dropdownOpen = true;
  document.getElementById('toko-list').classList.add('open');
  document.getElementById('toko-arrow').classList.add('open');
  renderDropdownList(document.getElementById('toko-input').value);
}
function closeDropdown() {
  dropdownOpen = false;
  const list = document.getElementById('toko-list');
  const arrow = document.getElementById('toko-arrow');
  if (list) list.classList.remove('open');
  if (arrow) arrow.classList.remove('open');
  const input = document.getElementById('toko-input');
  if (input && state.tokoSelected && input.value !== state.tokoSelected) input.value = state.tokoSelected;
}
function filterToko(val) {
  if (!dropdownOpen) openDropdown();
  renderDropdownList(val);
}
function selectToko(name) {
  state.tokoSelected = name;
  document.getElementById('toko-input').value = name;
  closeDropdown();
}

// ===== FORM =====
function fillDateTime(force) {
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  const t = document.getElementById('tanggal-input');
  const j = document.getElementById('jam-input');
  if (force || !t.value) t.value = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  if (force || !j.value) j.value = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

function resetForm() {
  state.tokoSelected = '';
  document.getElementById('toko-input').value = '';
  document.getElementById('kasir-input').value = '';
  fillDateTime(true);
  closeDropdown();
  showToast('Data dikosongkan');
}

function lanjutForm() {
  const toko = state.tokoSelected || document.getElementById('toko-input').value.trim();
  const kasir = document.getElementById('kasir-input').value.trim();
  const tanggal = document.getElementById('tanggal-input').value;
  const jam = document.getElementById('jam-input').value;
  if (!toko || !TOKO_LIST.includes(toko)) { showToast('Pilih nama toko dari daftar'); return; }
  if (!kasir || !tanggal || !jam) { showToast('Isi data terlebih dahulu'); return; }
  Object.assign(state, { tokoSelected: toko, kasir, tanggal, jam });
  goTo(state.jenisSelected === 'kebersihan' ? 'checklist' : 'scoring');
}

// ===== SCORING (7 langkah / double check) =====
function getDataForJenis() {
  if (state.jenisSelected === '7langkah') return DATA_7LANGKAH;
  return DATA_DOUBLECHECK.map(s => ({
    section: s.section,
    items: s.items.map(it => ({ ...it, bobot: DC_BOBOT }))
  }));
}
function scoringItemCount() {
  return getDataForJenis().reduce((n, s) => n + s.items.length, 0);
}

// Membangun ulang UI tanpa menghapus isian; state hanya direset bila jenis berganti.
function buildScoringUI() {
  if (state.builtScoringJenis !== state.jenisSelected) {
    state.scores = {};
    state.keterangan = {};
    state.builtScoringJenis = state.jenisSelected;
  }
  document.getElementById('scoring-title').textContent =
    state.jenisSelected === '7langkah' ? '7 Langkah Pelayanan' : 'Double Check Order';

  let html = '';
  let idx = 0;
  getDataForJenis().forEach(sec => {
    html += `<div class="section-block"><div class="section-title">${esc(sec.section)}</div><div class="item-grid">`;
    sec.items.forEach(item => {
      const key = 'item_' + idx;
      const cur = state.scores[key];
      const hasInfo = !!item.kriteria;
      const label = hasInfo
        ? `<div class="score-item-label has-info" onclick="openKriteria(${idx})" title="Lihat kriteria penilaian"><span>${esc(item.name)}</span><span class="info-badge">i</span></div>`
        : `<div class="score-item-label">${esc(item.name)}</div>`;
      html += `<div class="score-item" id="wrap_${key}">
        ${label}
        <div class="score-select-wrap">
          ${[1,2,3,4,5].map(v => `<button type="button" class="score-btn${cur === v ? ' selected' : ''}" data-key="${key}" data-val="${v}" onclick="setScore('${key}',${v})">${v}</button>`).join('')}
        </div>
        <textarea class="score-keterangan" placeholder="Keterangan opsional..." rows="1" oninput="setKet('${key}',this.value)">${esc(state.keterangan[key] || '')}</textarea>
      </div>`;
      idx++;
    });
    html += '</div></div>';
  });
  document.getElementById('scoring-content').innerHTML = html;
}

// Modal kriteria: menjelaskan arti tiap nilai 1-5 untuk satu item.
function openKriteria(flatIdx) {
  const items = getDataForJenis().flatMap(s => s.items);
  const item = items[flatIdx];
  if (!item || !item.kriteria) return;
  document.getElementById('kriteria-title').textContent = item.name;
  document.getElementById('kriteria-body').innerHTML = [5,4,3,2,1].map(n => `
    <div class="kriteria-row">
      <div class="kriteria-nilai">${n}</div>
      <div class="kriteria-teks">${esc(item.kriteria[n] || '-')}</div>
    </div>`).join('');
  openModal('kriteria-modal');
}

// Nilai wajib 1-5: menekan tombol yang sama tidak mengosongkan nilai.
function setScore(key, val) {
  state.scores[key] = val;
  document.querySelectorAll(`.score-btn[data-key="${key}"]`).forEach(btn => {
    btn.classList.toggle('selected', parseInt(btn.dataset.val, 10) === val);
  });
  const wrap = document.getElementById('wrap_' + key);
  if (wrap) wrap.classList.remove('missing');
}
function setKet(key, val) { state.keterangan[key] = val; }

function resetScoring() {
  state.scores = {};
  state.keterangan = {};
  buildScoringUI();
  showToast('Semua nilai dikosongkan');
}

function lanjutScoring() {
  const total = scoringItemCount();
  for (let i = 0; i < total; i++) {
    if (!state.scores['item_' + i]) { flagMissing('item_' + i); return; }
  }
  buildResultsScoring();
  goTo('hasil');
}

function flagMissing(key) {
  showToast('Isi semua nilai terlebih dahulu');
  const wrap = document.getElementById('wrap_' + key);
  if (wrap) {
    wrap.classList.add('missing');
    wrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// ===== CHECKLIST KEBERSIHAN =====
function buildChecklistUI() {
  let html = '';
  state.subSelected.forEach(areaKey => {
    const area = DATA_KEBERSIHAN[areaKey];
    html += `<div class="section-block"><div class="section-title">${esc(area.label.toUpperCase())}</div><div class="item-grid">`;
    area.items.forEach((item, idx) => {
      const key = `${areaKey}__chk_${idx}`;
      const cur = state.checklist[key];
      html += `<div class="score-item" id="wrap_${key}">
        <div class="score-item-label">${esc(item.name)}</div>
        <div class="check-wrap">
          <button type="button" class="check-btn check-yes${cur === 'yes' ? ' selected' : ''}" data-key="${key}" data-val="yes" onclick="setCheck('${key}','yes')">Ya</button>
          <button type="button" class="check-btn check-no${cur === 'no' ? ' selected' : ''}" data-key="${key}" data-val="no" onclick="setCheck('${key}','no')">Tidak</button>
        </div>
        <div class="photo-row" id="photorow_${key}"></div>
        <div class="ket-row">
          <textarea class="score-keterangan" placeholder="Keterangan opsional..." rows="1" oninput="setCheckKet('${key}',this.value)">${esc(state.checkKeterangan[key] || '')}</textarea>
        </div>
        <input type="file" class="photo-hidden-input" accept="image/*" multiple id="photoinput_${key}" onchange="handlePhotoSelect(event,'${key}')">
      </div>`;
    });
    html += '</div></div>';
  });
  document.getElementById('checklist-content').innerHTML = html;

  state.subSelected.forEach(areaKey => {
    DATA_KEBERSIHAN[areaKey].items.forEach((_, idx) => renderPhotoRow(`${areaKey}__chk_${idx}`));
  });
}

function setCheck(key, val) {
  state.checklist[key] = val;
  document.querySelectorAll(`.check-btn[data-key="${key}"]`).forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.val === val);
  });
  const wrap = document.getElementById('wrap_' + key);
  if (wrap) wrap.classList.remove('missing');
}
function setCheckKet(key, val) { state.checkKeterangan[key] = val; }

function resetChecklist() {
  state.checklist = {};
  state.checkKeterangan = {};
  state.photos = {};
  buildChecklistUI();
  showToast('Semua nilai dikosongkan');
}

function lanjutChecklist() {
  for (const areaKey of state.subSelected) {
    const area = DATA_KEBERSIHAN[areaKey];
    for (let idx = 0; idx < area.items.length; idx++) {
      const key = `${areaKey}__chk_${idx}`;
      if (!state.checklist[key]) { flagMissing(key); return; }
    }
  }
  buildResultsChecklist();
  goTo('hasil');
}

// ===== FOTO (banyak per item, tanpa batas) =====
let pendingPhotoKey = null;

function openPhotoModal(key) {
  pendingPhotoKey = key;
  openModal('photo-source-modal');
}

function pickPhotoSource(source) {
  const key = pendingPhotoKey;
  pendingPhotoKey = null;
  closeModal('photo-source-modal');
  if (!key) return;
  const input = document.getElementById('photoinput_' + key);
  if (!input) return;
  // Kamera hanya bisa satu foto sekali jepret; galeri boleh pilih banyak sekaligus.
  if (source === 'camera') {
    input.setAttribute('capture', 'environment');
    input.removeAttribute('multiple');
  } else {
    input.removeAttribute('capture');
    input.setAttribute('multiple', '');
  }
  input.click();
}

function handlePhotoSelect(event, key) {
  const files = Array.from(event.target.files || []);
  event.target.value = '';
  const images = files.filter(f => f.type.startsWith('image/'));
  if (!images.length) {
    if (files.length) showToast('File harus berupa gambar');
    return;
  }
  if (images.length < files.length) showToast('Sebagian file dilewati karena bukan gambar');

  Promise.all(images.map(f => compressImage(f, 1280, 0.75).catch(() => null)))
    .then(results => {
      const ok = results.filter(Boolean);
      if (!ok.length) { showToast('Gagal memproses foto'); return; }
      if (!state.photos[key]) state.photos[key] = [];
      state.photos[key].push(...ok);
      renderPhotoRow(key);
      if (ok.length < images.length) showToast('Sebagian foto gagal diproses');
      else showToast(ok.length > 1 ? `${ok.length} foto ditambahkan` : 'Foto ditambahkan');
    });
}

function renderPhotoRow(key) {
  const row = document.getElementById('photorow_' + key);
  if (!row) return;
  const list = state.photos[key] || [];
  let html = list.map((src, i) => `
    <div class="photo-thumb-wrap">
      <img class="photo-thumb" src="${src}" alt="Foto ${i + 1}">
      <button type="button" class="photo-remove" onclick="removePhoto('${key}',${i})" aria-label="Hapus foto">&times;</button>
    </div>`).join('');
  html += `<button type="button" class="photo-icon-btn" onclick="openPhotoModal('${key}')" aria-label="Tambah foto">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
    </button>`;
  if (list.length) html += `<span class="photo-count">${list.length} foto</span>`;
  row.innerHTML = html;
}

function removePhoto(key, index) {
  const list = state.photos[key];
  if (!list) return;
  list.splice(index, 1);
  if (!list.length) delete state.photos[key];
  renderPhotoRow(key);
}

function compressImage(file, maxDim, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > height) {
          if (width > maxDim) { height = Math.round(height * maxDim / width); width = maxDim; }
        } else if (height > maxDim) {
          width = Math.round(width * maxDim / height); height = maxDim;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ===== HASIL =====
const HARI = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
const BULAN = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

function formatTanggal(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return `${HARI[d.getDay()]}, ${String(d.getDate()).padStart(2,'0')}/${BULAN[d.getMonth()]}/${d.getFullYear()}`;
}
function fmtPct(val) {
  const r = Math.round(val * 100) / 100;
  return Number.isInteger(r) ? r + '%' : r.toFixed(2) + '%';
}

function summaryHtml(rows) {
  return `<div class="result-summary">${rows.map(([k, v]) =>
    `<div class="result-summary-row"><span class="result-summary-key">${esc(k)}</span><span class="result-summary-val">${esc(v)}</span></div>`
  ).join('')}</div>`;
}

// ---- Hasil scoring: nilai ditampilkan sebagai angka tunggal, tanpa total per bagian ----
function buildResultsScoring() {
  let idx = 0;
  let grandTotal = 0;
  const sections = [];

  getDataForJenis().forEach(sec => {
    const items = sec.items.map(item => {
      const key = 'item_' + idx++;
      const skor = state.scores[key];
      grandTotal += (skor / 5) * item.bobot;
      return { name: item.name, skor, bobot: item.bobot, ket: state.keterangan[key] || '' };
    });
    sections.push({ section: sec.section, items });
  });

  const pctDisplay = fmtPct(grandTotal);
  const kategori = getKategori(grandTotal);
  const kasirLabel = kasirLabelFor(state.jenisSelected);

  document.getElementById('result-pct').textContent = pctDisplay;
  document.getElementById('result-label').textContent = kategori;
  document.getElementById('result-subtitle').textContent =
    state.jenisSelected === '7langkah' ? '7 Langkah Pelayanan' : 'Double Check Order';

  let html = summaryHtml([
    ['Nama Toko', state.tokoSelected],
    [kasirLabel, state.kasir],
    ['Hari/Tanggal', formatTanggal(state.tanggal)],
    ['Jam', state.jam],
  ]);

  html += '<div class="result-sections">';
  sections.forEach(sec => {
    html += `<div class="result-section">
      <div class="result-section-header"><span class="result-section-title">${esc(sec.section)}</span></div>
      <div class="result-section-items">`;
    sec.items.forEach(item => {
      html += `<div class="result-item">
        <div class="result-item-row">
          <span class="result-item-name">- ${esc(item.name)}</span>
          <span class="result-item-score">${item.skor}</span>
        </div>`;
      if (item.ket) html += `<div class="result-item-ket">"${esc(item.ket)}"</div>`;
      html += `</div>`;
    });
    html += `</div></div>`;
  });
  html += '</div>';
  document.getElementById('result-body').innerHTML = html;

  state.resultData = { type: 'scoring', jenis: state.jenisSelected, sections, pctDisplay, kategori, kasirLabel };
  state.resultText = buildPlainTextScoring(sections, pctDisplay, kategori, kasirLabel);
}

function buildPlainTextScoring(sections, pctDisplay, kategori, kasirLabel) {
  const judul = state.jenisSelected === '7langkah' ? '7 LANGKAH PELAYANAN' : 'DOUBLE CHECK ORDER';
  let txt = `PENILAIAN ${judul}\n\n`;
  txt += `Nama Toko    : ${state.tokoSelected}\n`;
  txt += `${kasirLabel.padEnd(13)}: ${state.kasir}\n`;
  txt += `Hari/Tanggal : ${formatTanggal(state.tanggal)}\n`;
  txt += `Jam          : ${state.jam}\n`;
  sections.forEach(sec => {
    txt += `\n${sec.section}\n`;
    sec.items.forEach(item => {
      txt += `- ${item.name} : ${item.skor}\n`;
      if (item.ket) txt += `"${item.ket}"\n`;
    });
  });
  txt += `\n\nPOIN      : ${pctDisplay}\nKATEGORI  : ${kategori}`;
  return txt;
}

// ---- Hasil kebersihan: hanya ceklis/cakra, tanpa angka per item maupun per area ----
function buildResultsChecklist() {
  let grandSkor = 0;
  let grandMax = 0;
  const areaResults = [];

  state.subSelected.forEach(areaKey => {
    const area = DATA_KEBERSIHAN[areaKey];
    const items = area.items.map((item, idx) => {
      const key = `${areaKey}__chk_${idx}`;
      const val = state.checklist[key];
      if (val === 'yes') grandSkor += item.bobot;
      grandMax += item.bobot;
      return {
        name: item.name,
        val,
        ket: state.checkKeterangan[key] || '',
        photos: state.photos[key] || []
      };
    });
    areaResults.push({ areaKey, label: area.label, items });
  });

  const grandPct = grandMax > 0 ? (grandSkor / grandMax) * 100 : 0;
  const pctDisplay = fmtPct(grandPct);
  const kategori = getKategori(grandPct);
  const labelJoined = areaLabelJoined();

  document.getElementById('result-pct').textContent = pctDisplay;
  document.getElementById('result-label').textContent = kategori;
  document.getElementById('result-subtitle').textContent = 'Kebersihan - ' + labelJoined;

  let html = summaryHtml([
    ['Nama Toko', state.tokoSelected],
    ['Nama Auditor', state.kasir],
    ['Hari/Tanggal', formatTanggal(state.tanggal)],
    ['Jam', state.jam],
    ['Area', labelJoined],
  ]);

  html += '<div class="result-sections">';
  areaResults.forEach(ar => {
    html += `<div class="result-area-block">
      <div class="result-area-header"><span class="result-area-title">${esc(ar.label)}</span></div>
      <div class="result-section"><div class="result-section-items">`;
    ar.items.forEach(it => {
      html += `<div class="result-item">
        <div class="result-item-row">
          <span class="result-item-name with-mark">${it.val === 'yes' ? ICON_CHECK : ICON_CROSS}<span>${esc(it.name)}</span></span>
        </div>`;
      if (it.ket) html += `<div class="result-item-ket">"${esc(it.ket)}"</div>`;
      if (it.photos.length) {
        html += `<div class="result-photos">${it.photos.map((p, i) => `<img src="${p}" alt="Foto ${i + 1}">`).join('')}</div>`;
      }
      html += `</div>`;
    });
    html += `</div></div></div>`;
  });
  html += '</div>';
  document.getElementById('result-body').innerHTML = html;

  state.resultData = {
    type: 'checklist', jenis: 'kebersihan', areaResults,
    pctDisplay, kategori, areaLabelJoined: labelJoined,
    isAll: state.subSelected.length === AREA_ORDER.length,
    kasirLabel: kasirLabelFor('kebersihan')
  };
  state.resultText = buildPlainTextChecklist(areaResults, pctDisplay, kategori, labelJoined);
}

function buildPlainTextChecklist(areaResults, pctDisplay, kategori, labelJoined) {
  let txt = `PENILAIAN KEBERSIHAN\n\n`;
  txt += `Nama Toko    : ${state.tokoSelected}\n`;
  txt += `Nama Auditor : ${state.kasir}\n`;
  txt += `Hari/Tanggal : ${formatTanggal(state.tanggal)}\n`;
  txt += `Jam          : ${state.jam}\n`;
  txt += `Area         : ${labelJoined}\n`;
  areaResults.forEach(ar => {
    txt += `\n${ar.label.toUpperCase()}\n`;
    ar.items.forEach(it => {
      txt += `${it.val === 'yes' ? '✅' : '❌'} ${it.name}\n`;
      if (it.ket) txt += `"${it.ket}"\n`;
    });
  });
  txt += `\n\nPOIN      : ${pctDisplay}\nKATEGORI  : ${kategori}`;
  return txt;
}

// ===== TOAST =====
function showToast(msg) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  container.appendChild(toast);
  requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('show')));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// ===== EVENT GLOBAL =====
// Pilihan toko lewat event delegation, bukan disisipkan ke atribut onclick.
document.getElementById('toko-list').addEventListener('click', e => {
  const item = e.target.closest('.dropdown-item');
  if (!item) return;
  const idx = parseInt(item.dataset.idx, 10);
  if (!Number.isNaN(idx)) selectToko(TOKO_LIST[idx]);
});

document.addEventListener('click', e => {
  const wrap = document.getElementById('toko-dropdown-wrap');
  if (wrap && !wrap.contains(e.target)) closeDropdown();
});

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', function(e) {
    if (e.target === this) this.classList.remove('show');
  });
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') document.querySelectorAll('.modal-overlay.show').forEach(m => m.classList.remove('show'));
});

// ===== SERVICE WORKER =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => {
        reg.update();
        reg.addEventListener('updatefound', () => {
          const newSW = reg.installing;
          if (!newSW) return;
          newSW.addEventListener('statechange', () => {
            if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
              newSW.postMessage({ type: 'SKIP_WAITING' });
            }
          });
        });
      })
      .catch(err => console.log('SW gagal:', err));

    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  });
}

// ===== INIT =====
buildSubKebersihanCards();
fillDateTime(true);
renderDropdownList('');
