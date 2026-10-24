import { TROOP_DEFINITIONS } from '../constants.js';
import { state, formatResNum } from '../state.js';
import { saveTroopsData } from '../storage.js';
import { getUnitCostInCity } from './construction_calc.js';
import { openAddTroopsModal, openUpdateTroopsModal, closeMetaPanel } from './troops_meta.js';

let onSummaryRefresh = null;
export function setOnSummaryRefreshForTroops(fn) {
  onSummaryRefresh = fn;
}

export function renderTroopCityTabs() {
  const container = document.getElementById('troops-city-tabs');
  if (!container) return;
  container.innerHTML = '';

  if (state.cities.length === 0) {
    container.style.display = 'none';
    return;
  }
  container.style.display = 'flex';

  if (!state.troopsData.activeTroopCity || !state.cities.includes(state.troopsData.activeTroopCity)) {
    state.troopsData.activeTroopCity = state.cities[0];
  }

  state.cities.forEach(city => {
    const tab = document.createElement('div');
    const isActive = !state.isMetaPanelOpen && (city === state.troopsData.activeTroopCity);
    tab.className = `troop-city-tab ${isActive ? 'active' : ''}`;
    
    const label = state.cityLabels[city];
    const shortCode = (label && label.abbr) ? label.abbr : city;
    const fullName = (label && label.name) ? label.name : city;

    tab.textContent = shortCode;
    tab.title = fullName;

    tab.onclick = () => {
      const wasOpen = state.isMetaPanelOpen;
      if (state.isMetaPanelOpen) {
        closeMetaPanel(renderTroopCityTabs);
      }
      if (state.troopsData.activeTroopCity !== city || wasOpen) {
        state.troopsData.activeTroopCity = city;
        renderTroopCityTabs();
        renderTroopsContent();
      }
    };

    container.appendChild(tab);
  });
}

export function renderTroopsContent() {
  const container = document.getElementById('troops-content');
  if (!container) return;
  container.innerHTML = '';

  const city = state.troopsData.activeTroopCity;
  if (!city || !state.cities.includes(city)) {
    container.innerHTML = `
      <div class="no-troops-msg">
        <p>No hay ciudades configuradas. Ve a la pestaña Configuración para añadir una.</p>
      </div>
    `;
    return;
  }

  if (!state.troopsData.cities[city]) {
    state.troopsData.cities[city] = { units: {}, ships: {} };
  }
  if (!state.troopsData.cities[city].units) state.troopsData.cities[city].units = {};
  if (!state.troopsData.cities[city].ships) state.troopsData.cities[city].ships = {};

  const unitsMap = state.troopsData.cities[city].units;
  const shipsMap = state.troopsData.cities[city].ships;

  let totalMissingWood = 0;
  let totalMissingSulfur = 0;
  let totalMissingCrystal = 0;
  let totalMissingWine = 0;

  const calculateTotals = (list, map) => {
    list.forEach(item => {
      const data = map[item.id];
      if (data) {
        const missing = Math.max(0, (data.desired || 0) - (data.actual || 0));
        if (missing > 0) {
          const cost = getUnitCostInCity(item, city);
          totalMissingWood += missing * cost.wood;
          totalMissingSulfur += missing * cost.sulfur;
          totalMissingCrystal += missing * cost.crystal;
          totalMissingWine += missing * cost.wine;
        }
      }
    });
  };

  calculateTotals(TROOP_DEFINITIONS.units, unitsMap);
  calculateTotals(TROOP_DEFINITIONS.ships, shipsMap);

  const summaryCard = document.createElement('div');
  summaryCard.className = 'troop-summary-card';
  const label = state.cityLabels[city];
  const cityName = (label && label.name) ? label.name : city;

  summaryCard.innerHTML = `
    <div class="troop-summary-title">
      <span>Materiales requeridos en <strong>${cityName}</strong> (Tropas y Barcos):</span>
    </div>
    <div class="troop-summary-resources">
      <span class="res-chip" title="Madera faltante: ${totalMissingWood.toLocaleString()}">
        <img src="assets/resources/wood.png" alt="Madera">
        <span>${formatResNum(totalMissingWood)}</span>
      </span>
      ${totalMissingSulfur > 0 ? `
        <span class="res-chip" title="Azufre faltante: ${totalMissingSulfur.toLocaleString()}">
          <img src="assets/resources/sulfur.png" alt="Azufre">
          <span>${formatResNum(totalMissingSulfur)}</span>
        </span>
      ` : ''}
      ${totalMissingCrystal > 0 ? `
        <span class="res-chip" title="Cristal faltante: ${totalMissingCrystal.toLocaleString()}">
          <img src="assets/resources/glass.png" alt="Cristal">
          <span>${formatResNum(totalMissingCrystal)}</span>
        </span>
      ` : ''}
      ${totalMissingWine > 0 ? `
        <span class="res-chip" title="Vino faltante: ${totalMissingWine.toLocaleString()}">
          <img src="assets/resources/wine.png" alt="Vino">
          <span>${formatResNum(totalMissingWine)}</span>
        </span>
      ` : ''}
    </div>
  `;
  container.appendChild(summaryCard);

  const renderMilitarySection = (title, categoryKey, list, map) => {
    const secHeader = document.createElement('div');
    secHeader.className = 'military-section-header';
    secHeader.innerHTML = `
      <span class="military-section-title">${title}</span>
      <div class="military-header-actions">
        <button class="btn-action primary btn-mini btn-sec-add">+ Añadir</button>
        <button class="btn-action btn-mini btn-sec-update">⚡ Actualizar</button>
      </div>
    `;

    secHeader.querySelector('.btn-sec-add').onclick = () => openAddTroopsModal(categoryKey);
    secHeader.querySelector('.btn-sec-update').onclick = () => openUpdateTroopsModal(categoryKey);
    container.appendChild(secHeader);

    const visibleItems = list.filter(item => {
      const data = map[item.id];
      return data && ((data.actual && data.actual > 0) || (data.desired && data.desired > 0));
    });

    if (visibleItems.length === 0) {
      const emptyBox = document.createElement('div');
      emptyBox.className = 'no-troops-msg';
      emptyBox.style.padding = '8px 5px';
      emptyBox.innerHTML = `
        <span style="font-size:11px;">No hay registros en esta sección.</span>
        <button class="btn-action primary btn-mini" style="margin-left:6px;">+ Añadir</button>
      `;
      emptyBox.querySelector('button').onclick = () => openAddTroopsModal(categoryKey);
      container.appendChild(emptyBox);
      return;
    }

    const grid = document.createElement('div');
    grid.className = 'troop-grid';

    visibleItems.forEach(item => {
      const itemData = map[item.id];
      const cost = getUnitCostInCity(item, city);
      const missing = Math.max(0, (itemData.desired || 0) - (itemData.actual || 0));

      const card = document.createElement('div');
      card.className = 'troop-card';

      const colIdentity = document.createElement('div');
      colIdentity.className = 'troop-col-identity';
      colIdentity.innerHTML = `
        <div class="troop-icon-container">
          <img src="${item.icon}" alt="${item.name}">
        </div>
        <span class="troop-name" title="${item.name}">${item.name}</span>
      `;

      const colInputs = document.createElement('div');
      colInputs.className = 'troop-col-inputs';

      const rowReal = document.createElement('div');
      rowReal.className = 'troop-field-row';
      rowReal.innerHTML = `<label title="Cantidad real">R:</label>`;
      const inputReal = document.createElement('input');
      inputReal.type = 'number';
      inputReal.className = 'troop-input-num';
      inputReal.min = '0';
      inputReal.value = itemData.actual || 0;
      inputReal.onchange = () => {
        const val = parseInt(inputReal.value, 10);
        itemData.actual = isNaN(val) ? 0 : Math.max(0, val);
        saveTroopsData();
        renderTroopsContent();
        if (onSummaryRefresh) onSummaryRefresh();
      };
      rowReal.appendChild(inputReal);

      const rowMeta = document.createElement('div');
      rowMeta.className = 'troop-field-row';
      rowMeta.innerHTML = `<label title="Cantidad deseada">M:</label>`;
      const inputMeta = document.createElement('input');
      inputMeta.type = 'number';
      inputMeta.className = 'troop-input-num';
      inputMeta.min = '0';
      inputMeta.value = itemData.desired || 0;
      inputMeta.onchange = () => {
        const val = parseInt(inputMeta.value, 10);
        itemData.desired = isNaN(val) ? 0 : Math.max(0, val);
        saveTroopsData();
        renderTroopsContent();
        if (onSummaryRefresh) onSummaryRefresh();
      };
      rowMeta.appendChild(inputMeta);

      colInputs.appendChild(rowReal);
      colInputs.appendChild(rowMeta);

      const colMats = document.createElement('div');
      colMats.className = 'troop-col-mats';

      if (missing > 0) {
        const mWood = missing * cost.wood;
        const mSulfur = missing * cost.sulfur;
        const mCrystal = missing * cost.crystal;
        const mWine = missing * cost.wine;

        colMats.innerHTML = `
          <span class="res-chip-mini" title="Madera: ${mWood.toLocaleString()}">
            <img src="assets/resources/wood.png" alt="Madera">
            <span>${formatResNum(mWood)}</span>
          </span>
        `;
        if (mSulfur > 0) {
          colMats.innerHTML += `
            <span class="res-chip-mini" title="Azufre: ${mSulfur.toLocaleString()}">
              <img src="assets/resources/sulfur.png" alt="Azufre">
              <span>${formatResNum(mSulfur)}</span>
            </span>
          `;
        }
        if (mCrystal > 0) {
          colMats.innerHTML += `
            <span class="res-chip-mini" title="Cristal: ${mCrystal.toLocaleString()}">
              <img src="assets/resources/glass.png" alt="Cristal">
              <span>${formatResNum(mCrystal)}</span>
            </span>
          `;
        }
        if (mWine > 0) {
          colMats.innerHTML += `
            <span class="res-chip-mini" title="Vino: ${mWine.toLocaleString()}">
              <img src="assets/resources/wine.png" alt="Vino">
              <span>${formatResNum(mWine)}</span>
            </span>
          `;
        }
      } else {
        colMats.innerHTML = `<span class="res-chip-done" title="Meta alcanzada">✔️</span>`;
      }

      card.appendChild(colIdentity);
      card.appendChild(colInputs);
      card.appendChild(colMats);
      grid.appendChild(card);
    });

    container.appendChild(grid);
  };

  renderMilitarySection("🛡️ Tropas Terrestres", "units", TROOP_DEFINITIONS.units, unitsMap);
  renderMilitarySection("⛵ Barcos de Guerra", "ships", TROOP_DEFINITIONS.ships, shipsMap);
}
