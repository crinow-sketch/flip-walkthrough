// ══════════════════════════════════════════════════════════
// Flip Walkthrough — Main App Controller
// ══════════════════════════════════════════════════════════

let currentProperty = null;
let currentRoomIdx = 0;
let saveTimer = null;

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
  setupTierToggle();
  loadHome();
});

// ── NAVIGATION ──
let currentTab = 'home';

function showTab(name) {
  // Save property info ONLY when leaving the Info tab
  if (currentTab === 'property' && currentProperty) {
    readPropertyForm();
    autoSave();
  }

  currentTab = name;
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.tab-bar button').forEach(b => b.classList.remove('active'));
  document.getElementById('screen-' + name).classList.add('active');
  document.getElementById('tab-' + name).classList.add('active');

  const btn = document.getElementById('headerBtn');
  const title = document.getElementById('headerTitle');
  if (name === 'home') {
    btn.style.display = 'none';
    title.textContent = 'Flip Walkthrough';
  } else {
    btn.style.display = '';
    if (currentProperty) {
      title.textContent = currentProperty.address || 'New Property';
    }
  }

  if (name === 'walkthrough' && currentProperty) renderWalkthrough();
  if (name === 'summary' && currentProperty) renderSummary();
}

function goHome() {
  autoSave();
  showTab('home');
  loadHome();
}

// ── HOME SCREEN ──
async function loadHome() {
  const props = await listProperties();
  const list = document.getElementById('propList');

  if (props.length === 0) {
    list.innerHTML = '<div class="empty-state"><div class="icon">&#128736;</div><p>No walkthroughs yet.<br>Tap below to start your first one.</p></div>';
    return;
  }

  props.sort((a, b) => (b.updated || 0) - (a.updated || 0));
  list.innerHTML = props.map(p => {
    const total = calcGrandTotal(p);
    return `<div class="prop-card" onclick="openProperty('${p.id}')">
      <div>
        <div class="addr">${p.address || 'No address'}</div>
        <div class="meta">${p.date || ''} &middot; ${fmt(p.sqft || 0)} sq ft</div>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <div class="total">${fmtMoney(total)}</div>
        <button class="del-btn" onclick="event.stopPropagation();delProp('${p.id}')">&times;</button>
      </div>
    </div>`;
  }).join('');
}

async function delProp(id) {
  if (confirm('Delete this walkthrough?')) {
    await deleteProperty(id);
    loadHome();
  }
}

// ── NEW PROPERTY ──
function newProperty() {
  currentProperty = {
    id: generateId(),
    address: '',
    sqft: 0,
    purchasePrice: 0,
    arv: 0,
    costTier: 'mid',
    ceilingHeight: 8,
    date: new Date().toLocaleDateString('en-US'),
    holdingCosts: 0,
    closingBuy: 0,
    closingSell: 0,
    rooms: createBlankPropertyData(),
    updated: Date.now()
  };
  populatePropertyForm();
  showTab('property');
}

async function openProperty(id) {
  currentProperty = await loadProperty(id);
  if (!currentProperty) return;
  populatePropertyForm();
  showTab('property');
}

function populatePropertyForm() {
  const p = currentProperty;
  document.getElementById('propAddress').value = p.address || '';
  document.getElementById('propSqft').value = p.sqft || '';
  document.getElementById('propCeiling').value = p.ceilingHeight || 8;
  document.getElementById('propPurchase').value = p.purchasePrice || '';
  document.getElementById('propARV').value = p.arv || '';
  document.getElementById('dealHolding').value = p.holdingCosts || 0;
  document.getElementById('dealCloseBuy').value = p.closingBuy || 0;
  document.getElementById('dealCloseSell').value = p.closingSell || 0;
  setTier(p.costTier || 'mid');
}

function readPropertyForm() {
  if (!currentProperty) return;
  currentProperty.address = document.getElementById('propAddress').value;
  currentProperty.sqft = parseFloat(document.getElementById('propSqft').value) || 0;
  currentProperty.ceilingHeight = parseFloat(document.getElementById('propCeiling').value) || 8;
  currentProperty.purchasePrice = parseFloat(document.getElementById('propPurchase').value) || 0;
  currentProperty.arv = parseFloat(document.getElementById('propARV').value) || 0;
  currentProperty.updated = Date.now();
}

// Called on every keystroke in property form fields
function onPropFieldChange() {
  if (!currentProperty) return;
  readPropertyForm();
  scheduleAutoSave();
}

function startWalkthrough() {
  readPropertyForm();
  autoSave();
  currentRoomIdx = 0;
  showTab('walkthrough');
}

// ── TIER TOGGLE ──
function setupTierToggle() {
  document.querySelectorAll('#tierToggle button').forEach(btn => {
    btn.addEventListener('click', () => {
      setTier(btn.dataset.tier);
      if (currentProperty) {
        currentProperty.costTier = btn.dataset.tier;
        autoSave();
        if (document.getElementById('screen-walkthrough').classList.contains('active')) {
          renderWalkthrough();
        }
      }
    });
  });
}

function setTier(tier) {
  document.querySelectorAll('#tierToggle button').forEach(b => {
    b.classList.toggle('active', b.dataset.tier === tier);
  });
}

// ── WALKTHROUGH RENDERING ──
function renderWalkthrough() {
  if (!currentProperty) return;
  renderWalkTierToggle();
  renderRoomPills();
  renderRoom(currentRoomIdx);
  updateGrandTotal();
}

function renderRoomPills() {
  const pills = document.getElementById('roomPills');
  pills.innerHTML = ROOMS.map((r, i) => {
    const cost = calcRoomTotal(currentProperty, r.name);
    const progress = getRoomProgress(r, currentProperty.rooms[r.name]);
    const isDone = progress.done === progress.total;
    return `<button class="room-pill ${i === currentRoomIdx ? 'active' : ''}" onclick="selectRoom(${i})">
      ${r.name}${isDone ? ' <span class="pill-check">&#10003;</span>' : ''}
      ${cost > 0 ? `<span class="pill-cost">${fmtMoney(cost)}</span>` :
        (progress.done > 0 ? `<span class="pill-progress">${progress.done}/${progress.total}</span>` : '')}
    </button>`;
  }).join('');

  const active = pills.querySelector('.active');
  if (active) active.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
}

function getRoomProgress(roomDef, rData) {
  let done = 0;
  const total = roomDef.categories.length;
  if (!rData || !rData.items) return { done: 0, total };
  roomDef.categories.forEach(catDef => {
    const item = rData.items[catDef.cat];
    if (item && item.action && item.action !== '') done++;
  });
  return { done, total };
}

function selectRoom(idx) {
  saveCurrentRoom();
  currentRoomIdx = idx;
  renderRoomPills();
  renderRoom(idx);
}

function renderRoom(idx) {
  const room = ROOMS[idx];
  const rData = currentProperty.rooms[room.name] || { length: 0, width: 0, items: {} };
  const tier = currentProperty.costTier || 'mid';
  const ch = currentProperty.ceilingHeight || 8;
  const container = document.getElementById('roomContent');

  // Check if this room has dimension-based categories
  const hasDims = room.categories.some(c => needsDimensions(c.calc));

  let html = '';

  // Room dimensions card (if needed)
  if (hasDims) {
    html += `<div class="form-card">
      <h3>Room Dimensions</h3>
      <div class="dim-row">
        <div class="form-group">
          <label>Length (ft)</label>
          <input type="number" id="roomLength" value="${rData.length || ''}" inputmode="decimal"
                 placeholder="0" onchange="onRoomDimChange()">
        </div>
        <span class="dim-x">&times;</span>
        <div class="form-group">
          <label>Width (ft)</label>
          <input type="number" id="roomWidth" value="${rData.width || ''}" inputmode="decimal"
                 placeholder="0" onchange="onRoomDimChange()">
        </div>
        <div class="dim-result" id="roomSqft">${rData.length && rData.width ? fmt(rData.length * rData.width) + ' sf' : ''}</div>
      </div>
    </div>`;
  }

  // Find first unanswered category index (for smart-open)
  const firstUnansweredIdx = room.categories.findIndex(catDef => {
    const item = (rData.items && rData.items[catDef.cat]) || {};
    return !item.action || item.action === '';
  });

  // Category cards
  room.categories.forEach((catDef, ci) => {
    const item = (rData.items && rData.items[catDef.cat]) || {};
    const hasAction = item.action && item.action !== 'Keep' && item.action !== '';
    const isKeep = item.action === 'Keep';

    // Calculate cost for this item
    let qty = 0;
    if (needsDimensions(catDef.calc)) {
      qty = calcQty(catDef.calc, rData.length, rData.width, ch);
    } else if (catDef.calc === 'linft') {
      qty = parseFloat(item.dim1) || 0;
    } else {
      qty = parseFloat(item.dim2) || (parseFloat(item.dim1) || 0);
    }
    const unitCost = getCost(catDef.cat, item.type, item.action, tier);
    const totalCost = qty * unitCost;

    const labels = dimLabels(catDef.calc);
    const isOpen = ci === firstUnansweredIdx;
    const escapedCat = catDef.cat.replace(/'/g, "\\'");

    html += `<div class="cat-card ${isOpen ? 'open' : ''}" data-cat="${catDef.cat}" data-idx="${ci}">
      <div class="cat-header ${hasAction ? 'has-action' : ''} ${isKeep ? 'keep-action' : ''}" onclick="toggleCard(this)">
        <span class="cat-name">${catDef.cat}</span>
        <button class="quick-keep" onclick="event.stopPropagation();quickKeep('${escapedCat}')">Keep &#10003;</button>
        <span class="cat-cost">${totalCost > 0 ? fmtMoney(totalCost) : (isKeep ? 'Keep' : '')}</span>
      </div>
      <div class="cat-body">
        <div class="form-row">
          <div class="form-group">
            <label>Type</label>
            <select data-field="type" onchange="onCatChange(this)">
              <option value="">-- Select --</option>
              ${catDef.types.map(t => `<option value="${t}" ${item.type === t ? 'selected' : ''}>${t}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Condition</label>
            <select data-field="condition" onchange="onCatChange(this)">
              <option value="">-- Select --</option>
              ${CONDITIONS.map(c => `<option value="${c}" ${item.condition === c ? 'selected' : ''}>${c}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Action</label>
            <select data-field="action" onchange="onCatChange(this)">
              <option value="">-- Select --</option>
              ${ACTIONS.map(a => `<option value="${a}" ${item.action === a ? 'selected' : ''}>${a}</option>`).join('')}
            </select>
          </div>
        </div>
        ${!needsDimensions(catDef.calc) ? `
        <div class="form-row">
          ${labels.dim1 ? `<div class="form-group">
            <label>${labels.dim1}</label>
            <input type="number" data-field="dim1" value="${item.dim1 || ''}" inputmode="decimal" placeholder="0" onchange="onCatChange(this)">
          </div>` : ''}
          ${labels.dim2 ? `<div class="form-group">
            <label>${labels.dim2}</label>
            <input type="number" data-field="dim2" value="${item.dim2 || ''}" inputmode="decimal" placeholder="0" onchange="onCatChange(this)">
          </div>` : ''}
        </div>` : ''}
        ${totalCost > 0 ? `<div style="display:flex;justify-content:space-between;padding:8px 0;font-size:13px;color:var(--text-light)">
          <span>${fmt(qty)} ${getCostUnit(catDef.cat, item.type, item.action)} &times; ${fmtMoney(unitCost)}</span>
          <span style="font-weight:700;color:var(--green-dk)">${fmtMoney(totalCost)}</span>
        </div>` : ''}
      </div>
    </div>`;
  });

  // Room subtotal
  const roomTotal = calcRoomTotal(currentProperty, room.name);
  html += `<div class="room-subtotal">
    <span class="label">${room.name} Total</span>
    <span class="amount">${fmtMoney(roomTotal)}</span>
  </div>`;

  // Next Room banner (when all categories answered)
  const progress = getRoomProgress(room, rData);
  if (progress.done === progress.total) {
    if (currentRoomIdx < ROOMS.length - 1) {
      const nextRoom = ROOMS[currentRoomIdx + 1];
      html += `<div class="next-room-banner" onclick="advanceToNextRoom()">Next: ${nextRoom.name} &#8594;</div>`;
    } else {
      html += `<div class="next-room-banner summary-banner" onclick="showTab('summary')">View Summary &#8594;</div>`;
    }
  }

  container.innerHTML = html;
}

function toggleCard(header) {
  header.closest('.cat-card').classList.toggle('open');
}

function quickKeep(catName) {
  if (!currentProperty) return;
  const room = ROOMS[currentRoomIdx];
  const rData = currentProperty.rooms[room.name];
  if (!rData.items[catName]) rData.items[catName] = {};
  rData.items[catName].action = 'Keep';

  renderRoom(currentRoomIdx);
  renderRoomPills();
  updateGrandTotal();
  scheduleAutoSave();
  scrollToOpenCard();
}

function scrollToOpenCard() {
  setTimeout(() => {
    const openCard = document.querySelector('#roomContent .cat-card.open');
    if (openCard) {
      openCard.classList.add('just-opened');
      openCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => openCard.classList.remove('just-opened'), 600);
    } else {
      const banner = document.querySelector('.next-room-banner');
      if (banner) banner.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 50);
}

function advanceToNextRoom() {
  if (currentRoomIdx < ROOMS.length - 1) {
    saveCurrentRoom();
    currentRoomIdx++;
    renderRoomPills();
    renderRoom(currentRoomIdx);
    document.getElementById('roomContent').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function onRoomDimChange() {
  if (!currentProperty) return;
  const room = ROOMS[currentRoomIdx];
  const rData = currentProperty.rooms[room.name];
  rData.length = parseFloat(document.getElementById('roomLength').value) || 0;
  rData.width = parseFloat(document.getElementById('roomWidth').value) || 0;

  const sqftEl = document.getElementById('roomSqft');
  if (sqftEl) {
    sqftEl.textContent = rData.length && rData.width ? fmt(rData.length * rData.width) + ' sf' : '';
  }

  renderRoom(currentRoomIdx);
  renderRoomPills();
  updateGrandTotal();
  scheduleAutoSave();
}

function onCatChange(el) {
  if (!currentProperty) return;
  const card = el.closest('.cat-card');
  const catName = card.dataset.cat;
  const room = ROOMS[currentRoomIdx];
  const rData = currentProperty.rooms[room.name];
  if (!rData.items[catName]) rData.items[catName] = {};

  const field = el.dataset.field;
  rData.items[catName][field] = el.value;

  renderRoom(currentRoomIdx);
  renderRoomPills();
  updateGrandTotal();
  scheduleAutoSave();

  // Auto-advance when Action is selected
  if (field === 'action' && el.value !== '') {
    scrollToOpenCard();
  }
}

function saveCurrentRoom() {
  // Data is already saved in onCatChange/onRoomDimChange
}

// ── COST CALCULATIONS ──
function calcRoomTotal(prop, roomName) {
  const rData = prop.rooms[roomName];
  if (!rData) return 0;
  const tier = prop.costTier || 'mid';
  const ch = prop.ceilingHeight || 8;
  const roomDef = ROOMS.find(r => r.name === roomName);
  if (!roomDef) return 0;

  let total = 0;
  roomDef.categories.forEach(catDef => {
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
    total += qty * getCost(catDef.cat, item.type, item.action, tier);
  });
  return total;
}

function calcGrandTotal(prop) {
  let total = 0;
  ROOMS.forEach(r => { total += calcRoomTotal(prop, r.name); });
  return total;
}

function updateGrandTotal() {
  if (!currentProperty) return;
  document.getElementById('grandTotal').textContent = fmtMoney(calcGrandTotal(currentProperty));
}

// ── SUMMARY SCREEN ──
function renderSummary() {
  if (!currentProperty) return;
  const p = currentProperty;
  const tier = p.costTier || 'mid';

  // Room-by-room summary table
  let rows = '<tr><th>Room</th><th style="text-align:right">Est. Cost</th></tr>';
  let grandTotal = 0;

  ROOMS.forEach(r => {
    const roomCost = calcRoomTotal(p, r.name);
    if (roomCost > 0) {
      rows += `<tr><td>${r.name}</td><td>${fmtMoney(roomCost)}</td></tr>`;
    }
    grandTotal += roomCost;
  });

  const contingency = grandTotal * 0.15;
  rows += `<tr><td>Contingency (15%)</td><td>${fmtMoney(contingency)}</td></tr>`;
  rows += `<tr class="total-row"><td>Total Rehab Budget</td><td>${fmtMoney(grandTotal + contingency)}</td></tr>`;

  document.getElementById('summaryTable').innerHTML = rows;

  updateDeal();
}

function updateDeal() {
  if (!currentProperty) return;
  const p = currentProperty;
  const grandTotal = calcGrandTotal(p);
  const contingency = grandTotal * 0.15;
  const rehab = grandTotal + contingency;

  const holding = parseFloat(document.getElementById('dealHolding').value) || 0;
  const closeBuy = parseFloat(document.getElementById('dealCloseBuy').value) || 0;
  const closeSell = parseFloat(document.getElementById('dealCloseSell').value) || 0;

  p.holdingCosts = holding;
  p.closingBuy = closeBuy;
  p.closingSell = closeSell;
  scheduleAutoSave();

  const purchase = p.purchasePrice || 0;
  const arv = p.arv || 0;
  const allIn = purchase + rehab + holding + closeBuy + closeSell;
  const profit = arv - allIn;
  const roi = allIn > 0 ? (profit / allIn * 100) : 0;
  const isNeg = profit < 0;

  document.getElementById('dealRows').innerHTML = `
    <div class="deal-row"><span>Purchase Price</span><span class="val">${fmtMoney(purchase)}</span></div>
    <div class="deal-row"><span>Rehab (${p.costTier || 'mid'} + 15% contingency)</span><span class="val">${fmtMoney(rehab)}</span></div>
    <div class="deal-row"><span>Holding Costs</span><span class="val">${fmtMoney(holding)}</span></div>
    <div class="deal-row"><span>Closing (Buy)</span><span class="val">${fmtMoney(closeBuy)}</span></div>
    <div class="deal-row"><span>Closing (Sell)</span><span class="val">${fmtMoney(closeSell)}</span></div>
    <div class="deal-row" style="font-weight:700"><span>Total All-In</span><span class="val">${fmtMoney(allIn)}</span></div>
    <div class="deal-row" style="font-weight:700"><span>ARV</span><span class="val">${fmtMoney(arv)}</span></div>
    <div class="deal-row profit ${isNeg ? 'negative' : ''}">
      <span>Estimated Profit</span>
      <span class="val">${fmtMoney(profit)} (${roi.toFixed(1)}% ROI)</span>
    </div>
  `;
}

// ── WALK SCREEN TIER TOGGLE ──
function renderWalkTierToggle() {
  let tierEl = document.getElementById('walkTierToggle');
  if (!tierEl) {
    const container = document.getElementById('screen-walkthrough');
    const pills = document.getElementById('roomPills');
    tierEl = document.createElement('div');
    tierEl.id = 'walkTierToggle';
    tierEl.className = 'walk-tier-toggle';
    tierEl.innerHTML = `
      <button data-tier="low" onclick="setWalkTier('low')">Low</button>
      <button data-tier="mid" onclick="setWalkTier('mid')">Mid</button>
      <button data-tier="high" onclick="setWalkTier('high')">High</button>
    `;
    container.insertBefore(tierEl, pills);
  }
  const tier = currentProperty.costTier || 'mid';
  tierEl.querySelectorAll('button').forEach(b => {
    b.classList.toggle('active', b.dataset.tier === tier);
  });
}

function setWalkTier(tier) {
  if (!currentProperty) return;
  currentProperty.costTier = tier;
  setTier(tier);
  renderWalkTierToggle();
  renderRoom(currentRoomIdx);
  renderRoomPills();
  updateGrandTotal();
  autoSave();
}

// ── AUTO-SAVE ──
function scheduleAutoSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(autoSave, 800);
}

function autoSave() {
  if (!currentProperty) return;
  currentProperty.updated = Date.now();
  saveProperty(currentProperty).catch(() => {});
}

// ── FORMAT HELPERS ──
function fmtMoney(n) {
  if (n === 0) return '$0';
  const neg = n < 0;
  const abs = Math.abs(Math.round(n));
  const str = abs.toLocaleString('en-US');
  return neg ? `($${str})` : `$${str}`;
}

function fmt(n) {
  return Math.round(n).toLocaleString('en-US');
}

