import { TROOP_DEFINITIONS } from '../constants.js';
import { state, formatResNum, makeResChip } from '../state.js';
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
  container.replaceChildren();

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
  container.replaceChildren();

  const city = state.troopsData.activeTroopCity;
  if (!city || !state.cities.includes(city)) {
    const msg = document.createElement('div');
    msg.className = 'no-troops-msg';
    const p = document.createElement('p');
    p.textContent = 'No hay ciudades configuradas. Ve a la pestaña Configuración para añadir una.';
    msg.appendChild(p);
    container.appendChild(msg);
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

  const titleDiv = document.createElement('div');
  titleDiv.className = 'troop-summary-title';
  const titleSpan = document.createElement('span');
  const strong = document.createElement('strong');
  strong.textContent = cityName;
  titleSpan.append('Materiales requeridos en ', strong, ' (Tropas y Barcos):');
  titleDiv.appendChild(titleSpan);
  summaryCard.appendChild(titleDiv);

  const resRow = document.createElement('div');
  resRow.className = 'troop-summary-resources';
  resRow.appendChild(makeResChip('assets/resources/wood.png', 'Madera faltante', totalMissingWood));
  if (totalMissingSulfur > 0)  resRow.appendChild(makeResChip('assets/resources/sulfur.png', 'Azufre faltante', totalMissingSulfur));
  if (totalMissingCrystal > 0) resRow.appendChild(makeResChip('assets/resources/glass.png',  'Cristal faltante', totalMissingCrystal));
  if (totalMissingWine > 0)    resRow.appendChild(makeResChip('assets/resources/wine.png',   'Vino faltante', totalMissingWine));
  summaryCard.appendChild(resRow);
  container.appendChild(summaryCard);

  const renderMilitarySection = (title, categoryKey, list, map) => {
    const secHeader = document.createElement('div');
    secHeader.className = 'military-section-header';
    const secTitle = document.createElement('span');
    secTitle.className = 'military-section-title';
    secTitle.textContent = title;
    const actions = document.createElement('div');
    actions.className = 'military-header-actions';
    const btnAdd = document.createElement('button');
    btnAdd.className = 'btn-action primary btn-mini btn-sec-add';
    btnAdd.textContent = '+ Añadir';
    const btnUpd = document.createElement('button');
    btnUpd.className = 'btn-action btn-mini btn-sec-update';
    btnUpd.textContent = '⚡ Actualizar';
    actions.appendChild(btnAdd);
    actions.appendChild(btnUpd);
    secHeader.appendChild(secTitle);
    secHeader.appendChild(actions);
    container.appendChild(secHeader);

    const visibleItems = list.filter(item => {
      const data = map[item.id];
      return data && ((data.actual && data.actual > 0) || (data.desired && data.desired > 0));
    });

    if (visibleItems.length === 0) {
      const emptyBox = document.createElement('div');
      emptyBox.className = 'no-troops-msg';
      emptyBox.style.padding = '8px 5px';
      const emptyMsg = document.createElement('span');
      emptyMsg.style.fontSize = '11px';
      emptyMsg.textContent = 'No hay registros en esta sección.';
      const btnEmpty = document.createElement('button');
      btnEmpty.className = 'btn-action primary btn-mini';
      btnEmpty.style.marginLeft = '6px';
      btnEmpty.textContent = '+ Añadir';
      btnEmpty.onclick = () => openAddTroopsModal(categoryKey);
      emptyBox.appendChild(emptyMsg);
      emptyBox.appendChild(btnEmpty);
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
      const iconWrap = document.createElement('div');
      iconWrap.className = 'troop-icon-container';
      const img = document.createElement('img');
      img.src = item.icon;
      img.alt = item.name;
      iconWrap.appendChild(img);
      const nameSpan = document.createElement('span');
      nameSpan.className = 'troop-name';
      nameSpan.title = item.name;
      nameSpan.textContent = item.name;
      colIdentity.appendChild(iconWrap);
      colIdentity.appendChild(nameSpan);

      const colInputs = document.createElement('div');
      colInputs.className = 'troop-col-inputs';

      const rowReal = document.createElement('div');
      rowReal.className = 'troop-field-row';
      const lblReal = document.createElement('label');
      lblReal.title = 'Cantidad real';
      lblReal.textContent = 'R:';
      rowReal.appendChild(lblReal);
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
      const lblMeta = document.createElement('label');
      lblMeta.title = 'Cantidad deseada';
      lblMeta.textContent = 'M:';
      rowMeta.appendChild(lblMeta);
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
        colMats.appendChild(makeResChip('assets/resources/wood.png', 'Madera', mWood, 'res-chip-mini'.replace('res-chip ','')));
        if (mSulfur > 0)  colMats.appendChild(makeResChip('assets/resources/sulfur.png', 'Azufre',  mSulfur,  'res-chip-mini'.replace('res-chip ','')));
        if (mCrystal > 0) colMats.appendChild(makeResChip('assets/resources/glass.png',  'Cristal', mCrystal, 'res-chip-mini'.replace('res-chip ','')));
        if (mWine > 0)    colMats.appendChild(makeResChip('assets/resources/wine.png',   'Vino',    mWine,    'res-chip-mini'.replace('res-chip ','')));
      } else {
        const doneSpan = document.createElement('span');
        doneSpan.className = 'res-chip-done';
        doneSpan.title = 'Meta alcanzada';
        doneSpan.textContent = '✔️';
        colMats.appendChild(doneSpan);
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
