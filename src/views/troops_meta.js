import { TROOP_DEFINITIONS } from '../constants.js';
import { state } from '../state.js';
import { saveTroopsData } from '../storage.js';

let onTroopsChanged = null;
export function setOnTroopsChanged(fn) {
  onTroopsChanged = fn;
}

export function openMetaPanel(renderTroopCityTabsFn) {
  state.isMetaPanelOpen = true;
  const panel = document.getElementById('troops-meta-panel');
  const content = document.getElementById('troops-content');
  const btn = document.getElementById('btn-global-meta');
  
  if (panel) panel.classList.remove('hidden');
  if (content) content.classList.add('hidden');
  if (btn) btn.classList.add('active');

  if (state.selectedMetaCities.size === 0) {
    state.cities.forEach(c => state.selectedMetaCities.add(c));
  }

  if (renderTroopCityTabsFn) renderTroopCityTabsFn();
  renderMetaPanel();
}

export function closeMetaPanel(renderTroopCityTabsFn) {
  state.isMetaPanelOpen = false;
  const panel = document.getElementById('troops-meta-panel');
  const content = document.getElementById('troops-content');
  const btn = document.getElementById('btn-global-meta');
  
  if (panel) panel.classList.add('hidden');
  if (content) content.classList.remove('hidden');
  if (btn) btn.classList.remove('active');

  if (renderTroopCityTabsFn) renderTroopCityTabsFn();
}

export function renderMetaPanel() {
  const chipsContainer = document.getElementById('meta-city-chips');
  if (chipsContainer) {
    chipsContainer.innerHTML = '';

    const toggleAllBtn = document.createElement('span');
    toggleAllBtn.className = 'meta-city-chip toggle-all';
    const allSelected = state.cities.length > 0 && state.cities.every(c => state.selectedMetaCities.has(c));
    toggleAllBtn.textContent = allSelected ? '✖ Desmarcar todas' : '✓ Marcar todas';
    toggleAllBtn.onclick = () => {
      if (allSelected) {
        state.selectedMetaCities.clear();
      } else {
        state.cities.forEach(c => state.selectedMetaCities.add(c));
      }
      renderMetaPanel();
    };
    chipsContainer.appendChild(toggleAllBtn);

    state.cities.forEach(city => {
      const chip = document.createElement('span');
      const isSelected = state.selectedMetaCities.has(city);
      chip.className = `meta-city-chip ${isSelected ? 'selected' : ''}`;
      
      const label = state.cityLabels[city];
      const shortCode = (label && label.abbr) ? label.abbr : city;
      const fullName = (label && label.name) ? label.name : city;
      chip.textContent = shortCode;
      chip.title = fullName;

      chip.onclick = () => {
        if (state.selectedMetaCities.has(city)) {
          state.selectedMetaCities.delete(city);
        } else {
          state.selectedMetaCities.add(city);
        }
        renderMetaPanel();
      };
      chipsContainer.appendChild(chip);
    });
  }

  const renderCatalogGrid = (containerId, categoryKey, list) => {
    const grid = document.getElementById(containerId);
    if (!grid) return;
    grid.innerHTML = '';

    list.forEach(item => {
      const card = document.createElement('div');
      card.className = 'meta-grid-card';

      const existingVal = (state.metaPanelInputs[categoryKey] && state.metaPanelInputs[categoryKey][item.id] !== undefined)
        ? state.metaPanelInputs[categoryKey][item.id]
        : '';

      card.innerHTML = `
        <div class="meta-card-icon-wrap" title="${item.name}">
          <img src="${item.icon}" alt="${item.name}">
        </div>
        <span class="meta-card-name" title="${item.name}">${item.name}</span>
        <div class="meta-card-input-row">
          <label>Meta:</label>
          <input type="number" min="0" placeholder="0" class="troop-input-num" value="${existingVal}">
        </div>
      `;

      const input = card.querySelector('input');
      input.addEventListener('input', () => {
        const val = input.value.trim();
        if (!state.metaPanelInputs[categoryKey]) state.metaPanelInputs[categoryKey] = {};
        state.metaPanelInputs[categoryKey][item.id] = val;
      });

      grid.appendChild(card);
    });
  };

  renderCatalogGrid('meta-units-grid', 'units', TROOP_DEFINITIONS.units);
  renderCatalogGrid('meta-ships-grid', 'ships', TROOP_DEFINITIONS.ships);
}

export function applyGlobalMeta(renderTroopCityTabsFn) {
  if (state.selectedMetaCities.size === 0) {
    alert('Por favor selecciona al menos una ciudad para aplicar las metas.');
    return;
  }

  state.selectedMetaCities.forEach(cityId => {
    if (!state.troopsData.cities[cityId]) {
      state.troopsData.cities[cityId] = { units: {}, ships: {} };
    }
    if (!state.troopsData.cities[cityId].units) state.troopsData.cities[cityId].units = {};
    if (!state.troopsData.cities[cityId].ships) state.troopsData.cities[cityId].ships = {};

    TROOP_DEFINITIONS.units.forEach(unit => {
      const valStr = state.metaPanelInputs.units ? state.metaPanelInputs.units[unit.id] : undefined;
      if (valStr !== undefined && valStr !== '') {
        const num = Math.max(0, parseInt(valStr, 10) || 0);
        if (!state.troopsData.cities[cityId].units[unit.id]) {
          state.troopsData.cities[cityId].units[unit.id] = { actual: 0, desired: num };
        } else {
          state.troopsData.cities[cityId].units[unit.id].desired = num;
        }
      }
    });

    TROOP_DEFINITIONS.ships.forEach(ship => {
      const valStr = state.metaPanelInputs.ships ? state.metaPanelInputs.ships[ship.id] : undefined;
      if (valStr !== undefined && valStr !== '') {
        const num = Math.max(0, parseInt(valStr, 10) || 0);
        if (!state.troopsData.cities[cityId].ships[ship.id]) {
          state.troopsData.cities[cityId].ships[ship.id] = { actual: 0, desired: num };
        } else {
          state.troopsData.cities[cityId].ships[ship.id].desired = num;
        }
      }
    });
  });

  saveTroopsData();
  closeMetaPanel(renderTroopCityTabsFn);
  if (onTroopsChanged) onTroopsChanged();
}

export function setupGlobalMetaPanel(renderTroopCityTabsFn) {
  const btn = document.getElementById('btn-global-meta');
  if (btn) {
    btn.onclick = () => {
      if (state.isMetaPanelOpen) {
        closeMetaPanel(renderTroopCityTabsFn);
      } else {
        openMetaPanel(renderTroopCityTabsFn);
      }
    };
  }

  const btnApply = document.getElementById('btn-apply-meta');
  if (btnApply) {
    btnApply.onclick = () => applyGlobalMeta(renderTroopCityTabsFn);
  }
}

export function openAddTroopsModal(categoryKey = "units") {
  const city = state.troopsData.activeTroopCity;
  if (!city) return;

  const modal = document.getElementById('modal-add-troops');
  const title = document.getElementById('modal-add-troops-title');
  const container = document.getElementById('add-troops-catalog-list');
  container.innerHTML = '';

  const isUnits = categoryKey === "units";
  title.textContent = isUnits ? "Añadir Tropas Terrestres" : "Añadir Barcos de Guerra";

  const list = TROOP_DEFINITIONS[categoryKey] || [];
  if (!state.troopsData.cities[city]) state.troopsData.cities[city] = { units: {}, ships: {} };
  if (!state.troopsData.cities[city][categoryKey]) state.troopsData.cities[city][categoryKey] = {};
  const cityMap = state.troopsData.cities[city][categoryKey];

  const tempInputs = {};

  list.forEach(item => {
    const existing = cityMap[item.id] || { actual: 0, desired: 0 };
    const row = document.createElement('div');
    row.className = 'troop-modal-row';

    row.innerHTML = `
      <div class="troop-modal-row-left">
        <img src="${item.icon}" alt="${item.name}">
        <span>${item.name}</span>
      </div>
    `;

    const inputsDiv = document.createElement('div');
    inputsDiv.className = 'troop-modal-inputs';

    inputsDiv.innerHTML = `<label>Real:</label>`;
    const actInp = document.createElement('input');
    actInp.type = 'number';
    actInp.className = 'troop-input-num';
    actInp.min = '0';
    actInp.value = existing.actual || 0;

    inputsDiv.innerHTML += `<label style="margin-left:4px;">Meta:</label>`;
    const desInp = document.createElement('input');
    desInp.type = 'number';
    desInp.className = 'troop-input-num';
    desInp.min = '0';
    desInp.value = existing.desired || 0;

    inputsDiv.appendChild(actInp);
    inputsDiv.appendChild(desInp);
    row.appendChild(inputsDiv);
    container.appendChild(row);

    tempInputs[item.id] = { actInp, desInp };
  });

  document.getElementById('btn-save-add-troops').onclick = () => {
    list.forEach(item => {
      const actVal = parseInt(tempInputs[item.id].actInp.value, 10);
      const desVal = parseInt(tempInputs[item.id].desInp.value, 10);
      cityMap[item.id] = {
        actual: isNaN(actVal) ? 0 : Math.max(0, actVal),
        desired: isNaN(desVal) ? 0 : Math.max(0, desVal)
      };
    });

    saveTroopsData();
    modal.classList.add('hidden');
    if (onTroopsChanged) onTroopsChanged();
  };

  modal.classList.remove('hidden');
}

export function openUpdateTroopsModal(categoryKey = "units") {
  const city = state.troopsData.activeTroopCity;
  if (!city) return;

  const modal = document.getElementById('modal-update-troops');
  const title = document.getElementById('modal-update-troops-title');
  const container = document.getElementById('update-troops-active-list');
  container.innerHTML = '';

  const isUnits = categoryKey === "units";
  const catName = isUnits ? "Tropas" : "Barcos";
  title.textContent = `Actualizar ${catName} en ${state.cityLabels[city]?.name || city}`;

  const list = TROOP_DEFINITIONS[categoryKey] || [];
  const cityMap = state.troopsData.cities[city]?.[categoryKey] || {};

  const activeList = list.filter(u => cityMap[u.id] && ((cityMap[u.id].actual > 0) || (cityMap[u.id].desired > 0)));

  if (activeList.length === 0) {
    container.innerHTML = `<p style="padding:10px;text-align:center;font-size:11px;color:#666;">No hay ${catName.toLowerCase()} registrados en esta ciudad aún. Usa "+ Añadir" primero.</p>`;
  }

  const tempInputs = {};

  activeList.forEach(item => {
    const existing = cityMap[item.id] || { actual: 0, desired: 0 };
    const row = document.createElement('div');
    row.className = 'troop-modal-row';

    row.innerHTML = `
      <div class="troop-modal-row-left">
        <img src="${item.icon}" alt="${item.name}">
        <span>${item.name}</span>
      </div>
    `;

    const inputsDiv = document.createElement('div');
    inputsDiv.className = 'troop-modal-inputs';
    inputsDiv.innerHTML = `<label>Quedan:</label>`;

    const actInp = document.createElement('input');
    actInp.type = 'number';
    actInp.className = 'troop-input-num';
    actInp.min = '0';
    actInp.value = existing.actual || 0;

    inputsDiv.appendChild(actInp);
    row.appendChild(inputsDiv);
    container.appendChild(row);

    tempInputs[item.id] = actInp;
  });

  document.getElementById('btn-save-update-troops').onclick = () => {
    activeList.forEach(item => {
      const actVal = parseInt(tempInputs[item.id].value, 10);
      cityMap[item.id].actual = isNaN(actVal) ? 0 : Math.max(0, actVal);
    });

    saveTroopsData();
    modal.classList.add('hidden');
    if (onTroopsChanged) onTroopsChanged();
  };

  modal.classList.remove('hidden');
}
