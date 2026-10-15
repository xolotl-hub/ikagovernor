const cities = [
  "Tenochtitlan-m1", "Tenochtitlan-m2", "Tenochtitlan-a1", "Tenochtitlan-v1", 
  "Tenochtitlan-c1", "Tenochtitlan-m3", "Tenochtitlan-m4", "Tenochtitlan-a2", 
  "Tenochtitlan-v2", "Tenochtitlan-c2", "Tenochtitlan-c3", "Tenochtitlan-c4", 
  "Tenochtitlan-v3"
];

const DEFAULT_BUILDINGS = [
  { name: "Intendencia", meta1: 18, meta2: 28, meta3: 36, meta4: 42, meta5: 47, meta6: 49 },
  { name: "Deposito 1", meta1: 14, meta2: 25, meta3: 35, meta4: 40, meta5: 45, meta6: 48 },
  { name: "Deposito 2", meta1: 14, meta2: 25, meta3: 35, meta4: 40, meta5: 45, meta6: 48 },
  { name: "Oficina del Arquitecto", meta1: 16, meta2: 32, meta3: 50, meta4: 50, meta5: 50, meta6: 50 },
  { name: "Carpintería", meta1: 16, meta2: 32, meta3: 50, meta4: 50, meta5: 50, meta6: 50 },
  { name: "Materia Especial", meta1: 12, meta2: 24, meta3: 35, meta4: 40, meta5: 45, meta6: 48 },
  { name: "Prensa de Vino", meta1: 15, meta2: 30, meta3: 40, meta4: 45, meta5: 50, meta6: 50 },
  { name: "Aserradero", meta1: 15, meta2: 28, meta3: 35, meta4: 40, meta5: 45, meta6: 50 },
  { name: "Taberna", meta1: 12, meta2: 22, meta3: 32, meta4: 36, meta5: 40, meta6: 40 },
  { name: "Almacén", meta1: 14, meta2: 25, meta3: 35, meta4: 40, meta5: 45, meta6: 48 },
  { name: "Muralla", meta1: 15, meta2: 28, meta3: 40, meta4: 50, meta5: 60, meta6: 65 },
  { name: "Museo", meta1: 10, meta2: 25, meta3: 40, meta4: 45, meta5: 50, meta6: 50 }
];

const BUILDING_COSTS = {
  "Intendencia": { baseWood: 40, factorWood: 1.28, baseMarble: 32, factorMarble: 1.28, marbleStartLvl: 5 },
  "Deposito 1": { baseWood: 40, factorWood: 1.33, baseMarble: 32, factorMarble: 1.33, marbleStartLvl: 4 },
  "Deposito 2": { baseWood: 40, factorWood: 1.33, baseMarble: 32, factorMarble: 1.33, marbleStartLvl: 4 },
  "Oficina del Arquitecto": { baseWood: 91, factorWood: 1.17, baseMarble: 60, factorMarble: 1.17, marbleStartLvl: 1 },
  "Carpintería": { baseWood: 66, factorWood: 1.17, baseMarble: 29, factorMarble: 1.17, marbleStartLvl: 1 },
  "Materia Especial": { baseWood: 101, factorWood: 1.17, baseMarble: 43, factorMarble: 1.17, marbleStartLvl: 1 },
  "Prensa de Vino": { baseWood: 89, factorWood: 1.17, baseMarble: 40, factorMarble: 1.17, marbleStartLvl: 1 },
  "Aserradero": { baseWood: 206, factorWood: 1.17, baseMarble: 118, factorMarble: 1.17, marbleStartLvl: 1 },
  "Taberna": { baseWood: 75, factorWood: 1.25, baseMarble: 12, factorMarble: 1.25, marbleStartLvl: 3 },
  "Almacén": { baseWood: 480, factorWood: 1.28, baseMarble: 240, factorMarble: 1.28, marbleStartLvl: 1 },
  "Muralla": { baseWood: 60, factorWood: 1.25, baseMarble: 80, factorMarble: 1.25, marbleStartLvl: 1 },
  "Museo": { baseWood: 300, factorWood: 1.35, baseMarble: 200, factorMarble: 1.35, marbleStartLvl: 1 }
};

const TROOP_DEFINITIONS = {
  units: [
    { id: "hoplita", name: "Hoplita", icon: "assets/units/hoplita.png", wood: 40, sulfur: 30 },
    { id: "gigante", name: "Gigante a vapor", icon: "assets/units/gigante.png", wood: 130, sulfur: 180 },
    { id: "espadachin", name: "Espadachín", icon: "assets/units/espadachin.png", wood: 30, sulfur: 30 },
    { id: "lancero", name: "Lancero", icon: "assets/units/lancero.png", wood: 30 },
    { id: "hondero", name: "Hondero", icon: "assets/units/hondero.png", wood: 20 },
    { id: "arquero", name: "Arquero", icon: "assets/units/arquero.png", wood: 30, sulfur: 25 },
    { id: "fusilero", name: "Fusilero", icon: "assets/units/fusilero.png", wood: 50, sulfur: 150 },
    { id: "ariete", name: "Ariete", icon: "assets/units/ariete.png", wood: 220 },
    { id: "catapulta", name: "Catapulta", icon: "assets/units/catapulta.png", wood: 260, sulfur: 300 },
    { id: "mortero", name: "Mortero", icon: "assets/units/mortero.png", wood: 300, sulfur: 1250 },
    { id: "girocoptero", name: "Girocóptero", icon: "assets/units/girocoptero.png", wood: 25, sulfur: 100 },
    { id: "globo", name: "Globo bombardero", icon: "assets/units/globo.png", wood: 40, sulfur: 250 },
    { id: "cocinero", name: "Cocinero", icon: "assets/units/cocinero.png", wood: 50, wine: 150 },
    { id: "medico", name: "Médico", icon: "assets/units/medico.png", wood: 50, crystal: 450 },
    { id: "espartano", name: "Espartano", icon: "assets/units/espartano.png", wood: 0 }
  ],
  ships: [
    { id: "espolon", name: "Barco espolón", icon: "assets/ships/espolon.png", wood: 250 },
    { id: "lanzallamas", name: "Barco lanzallamas", icon: "assets/ships/lanzallamas.png", wood: 80, sulfur: 210 },
    { id: "espolon_vapor", name: "Barco espolón a vapor", icon: "assets/ships/espolon_vapor.png", wood: 700, sulfur: 800 },
    { id: "ballesta", name: "Barco ballesta", icon: "assets/ships/ballesta.png", wood: 180, sulfur: 160 },
    { id: "catapulta", name: "Barco catapulta", icon: "assets/ships/catapulta.png", wood: 180, sulfur: 140 },
    { id: "mortero", name: "Barco mortero", icon: "assets/ships/mortero.png", wood: 220, sulfur: 900 },
    { id: "submarino", name: "Submarino", icon: "assets/ships/submarino.png", wood: 160, crystal: 750, sulfur: 100 },
    { id: "lancha", name: "Lancha de palas", icon: "assets/ships/lancha.png", wood: 40, sulfur: 280 },
    { id: "misiles", name: "Barco lanzamisiles", icon: "assets/ships/misiles.png", wood: 200, sulfur: 1200 },
    { id: "portaglobos", name: "Portaglobos", icon: "assets/ships/portaglobos.png", wood: 700, sulfur: 700 },
    { id: "auxiliar", name: "Barco auxiliar", icon: "assets/ships/auxiliar.png", wood: 1200, wine: 800 }
  ]
};

let buildingsConfig = JSON.parse(JSON.stringify(DEFAULT_BUILDINGS));
let appData = {};
let cityLabels = {};
let activeCityCount = 13;
let currentBuilding = null;
let isEditing = false;
let currentView = "construction"; // "construction" | "troops"

// Datos de tropas
let troopsData = {
  selectedCities: [],
  activeTroopCity: null,
  activeTroopType: "units", // "units" | "ships"
  cities: {}
};

function formatResNum(num) {
  if (!num || num <= 0) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return num.toLocaleString();
}

function getBuildingUpgradeCost(buildingName, curLvl, city) {
  const cfg = BUILDING_COSTS[buildingName];
  if (!cfg) return null;
  const targetLvl = curLvl + 1;
  const rawWood = Math.floor(cfg.baseWood * Math.pow(cfg.factorWood, targetLvl - 1));
  let rawMarble = 0;
  if (targetLvl >= (cfg.marbleStartLvl || 1)) {
    const marbleExp = targetLvl - (cfg.marbleStartLvl || 1);
    rawMarble = Math.floor(cfg.baseMarble * Math.pow(cfg.factorMarble, marbleExp));
  }
  
  // Niveles de edificios ahorradores en esa ciudad
  const carpLevel = Math.min(50, appData[city]?.["Carpintería"] || 0);
  const archLevel = Math.min(50, appData[city]?.["Oficina del Arquitecto"] || 0);
  
  const finalWood = Math.round(rawWood * (1 - carpLevel / 100));
  const finalMarble = Math.round(rawMarble * (1 - archLevel / 100));
  
  return {
    wood: finalWood,
    marble: finalMarble,
    woodDiscount: carpLevel,
    marbleDiscount: archLevel
  };
}

function getUnitCostInCity(unit, city) {
  const carp = Math.min(50, appData[city]?.["Carpintería"] || 0);
  const winePress = Math.min(50, appData[city]?.["Prensa de Vino"] || 0);
  const pyrotech = Math.min(50, appData[city]?.["Materia Especial"] || 0);
  
  return {
    wood: unit.wood ? Math.round(unit.wood * (1 - carp / 100)) : 0,
    sulfur: unit.sulfur ? Math.round(unit.sulfur * (1 - pyrotech / 100)) : 0,
    wine: unit.wine ? Math.round(unit.wine * (1 - winePress / 100)) : 0,
    crystal: unit.crystal || 0
  };
}

// Iniciar con la estructura por defecto si no hay datos guardados
function getInitialData() {
  const data = {};
  cities.forEach(city => {
    data[city] = {};
    buildingsConfig.forEach(b => {
      data[city][b.name] = 0;
    });
  });
  return data;
}

function loadData(callback) {
  chrome.storage.local.get(['ikariamLevels', 'ikariamBuildings', 'ikariamCityLabels', 'ikariamCityCount', 'ikariamTroops'], (result) => {
    let updated = false;

    activeCityCount = (result.ikariamCityCount && result.ikariamCityCount >= 1)
      ? Math.min(result.ikariamCityCount, cities.length)
      : cities.length;

    if (result.ikariamCityLabels) {
      cityLabels = result.ikariamCityLabels;
      let needsSave = false;
      Object.keys(cityLabels).forEach(city => {
        if (typeof cityLabels[city] === 'string') {
          delete cityLabels[city];
          needsSave = true;
        }
      });
      if (needsSave) saveCityLabels();
    } else {
      cityLabels = {};
    }

    if (result.ikariamBuildings) {
      const loadedBuildings = [];
      result.ikariamBuildings.forEach(b => {
        if (b.name) {
          b.name = b.name.normalize('NFC');
        }
        loadedBuildings.push(b);
      });

      const syncedBuildings = [];
      DEFAULT_BUILDINGS.forEach(defB => {
        const found = loadedBuildings.find(b => b.name === defB.name);
        if (found) {
          syncedBuildings.push(found);
        } else {
          syncedBuildings.push({ ...defB });
          updated = true;
        }
      });

      buildingsConfig = syncedBuildings;
    } else {
      buildingsConfig = JSON.parse(JSON.stringify(DEFAULT_BUILDINGS));
    }
    
    currentBuilding = buildingsConfig[0];
    
    if (result.ikariamLevels) {
      appData = result.ikariamLevels;
      cities.forEach(city => {
        if (!appData[city]) {
          appData[city] = {};
          updated = true;
        }
        buildingsConfig.forEach(b => {
          if (appData[city][b.name] === undefined) {
            appData[city][b.name] = 0;
            updated = true;
          } else if (Array.isArray(appData[city][b.name])) {
            appData[city][b.name] = appData[city][b.name][0] || 0;
            updated = true;
          }
        });
      });
      if (updated) saveData();
    } else {
      appData = getInitialData();
      saveData();
    }

    // Cargar tropas
    if (result.ikariamTroops) {
      troopsData = result.ikariamTroops;
      if (!troopsData.selectedCities) troopsData.selectedCities = [];
      if (!troopsData.cities) troopsData.cities = {};
      if (!troopsData.activeTroopType) troopsData.activeTroopType = "units";
      if (!troopsData.activeTroopCity && troopsData.selectedCities.length > 0) {
        troopsData.activeTroopCity = troopsData.selectedCities[0];
      }
    } else {
      // Inicializar con la primera ciudad activa
      troopsData = {
        selectedCities: [cities[0]],
        activeTroopCity: cities[0],
        activeTroopType: "units",
        cities: {}
      };
      saveTroopsData();
    }

    callback();
  });
}

function saveData() {
  chrome.storage.local.set({ 
    ikariamLevels: appData,
    ikariamBuildings: buildingsConfig
  });
}

function saveTroopsData() {
  chrome.storage.local.set({ ikariamTroops: troopsData });
}

function saveCityLabels() {
  chrome.storage.local.set({ ikariamCityLabels: cityLabels });
}

function getLevelClass(level, config) {
  if (level >= config.meta6) return "lvl-meta6";
  if (level >= config.meta5) return "lvl-meta5";
  if (level >= config.meta4) return "lvl-meta4";
  if (level >= config.meta3) return "lvl-meta3";
  if (level >= config.meta2) return "lvl-meta2";
  if (level >= config.meta1) return "lvl-meta1";
  return "lvl-default";
}

function renderTabs() {
  const tabsContainer = document.getElementById('tabs');
  tabsContainer.innerHTML = '';
  
  buildingsConfig.forEach(b => {
    const tab = document.createElement('div');
    const isActive = b.name === currentBuilding.name;
    tab.className = `tab ${isActive ? 'active' : ''}`;
    tab.textContent = b.name;
    tab.title = b.name;
    
    tab.onclick = () => {
      if (isEditing) return;
      if (currentBuilding.name !== b.name) {
        currentBuilding = b;
        renderTabs();
        renderMetaSummary();
        renderContent();
      }
    };
    
    tabsContainer.appendChild(tab);
    
    const tabIndex = buildingsConfig.findIndex(x => x.name === b.name);
    if (isActive && tabIndex > 1 && b.name !== "Muralla" && b.name !== "Museo") {
      setTimeout(() => {
        tab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }, 50);
    }
  });
}

function getActiveTargetIndex() {
  const metaKeys = ["meta1", "meta2", "meta3", "meta4", "meta5", "meta6"];
  for (let i = 0; i < metaKeys.length; i++) {
    const targetValue = currentBuilding[metaKeys[i]];
    const allMeetTarget = cities.slice(0, activeCityCount).every(city => {
      const level = appData[city]?.[currentBuilding.name] || 0;
      return level >= targetValue;
    });
    if (!allMeetTarget) {
      return i;
    }
  }
  return metaKeys.length - 1;
}

function renderMetaSummary() {
  const summaryContainer = document.getElementById('meta-summary');
  summaryContainer.innerHTML = '';
  
  const activeTargetIndex = getActiveTargetIndex();
  
  const metas = [
    { label: "Madera", value: currentBuilding.meta1, key: "meta1", class: "dot-wood" },
    { label: "Cobre", value: currentBuilding.meta2, key: "meta2", class: "dot-copper" },
    { label: "Verde", value: currentBuilding.meta3, key: "meta3", class: "dot-green" },
    { label: "Azul", value: currentBuilding.meta4, key: "meta4", class: "dot-blue" },
    { label: "Dorado", value: currentBuilding.meta5, key: "meta5", class: "dot-gold" },
    { label: "Platino", value: currentBuilding.meta6, key: "meta6", class: "dot-platinum" }
  ];
  
  metas.forEach((meta, index) => {
    const item = document.createElement('span');
    item.className = 'meta-item';
    if (index === activeTargetIndex && !isEditing) {
      item.classList.add('target-highlight');
    }
    item.title = `Meta: ${meta.label}`;
    
    const dot = document.createElement('span');
    dot.className = `dot ${meta.class}`;
    item.appendChild(dot);
    
    if (isEditing) {
      const input = document.createElement('input');
      input.type = 'number';
      input.className = 'meta-input';
      input.min = '0';
      input.value = meta.value;
      input.setAttribute('data-meta-key', meta.key);
      item.appendChild(input);
    } else {
      const text = document.createTextNode(` ${meta.value}`);
      item.appendChild(text);
    }
    
    summaryContainer.appendChild(item);
  });
}

function renderContent() {
  const content = document.getElementById('content');
  content.innerHTML = '';
  
  const newContent = content.cloneNode(false);
  const maxGoal = currentBuilding.meta6 || 1;
  
  cities.slice(0, activeCityCount).forEach((city) => {
    const row = document.createElement('div');
    const label = cityLabels[city];
    const shortCode = (label && label.abbr) ? label.abbr : '';
    const fullName = (label && label.name) ? label.name : city;
    
    row.className = 'city-row';
    
    const cityInfo = document.createElement('div');
    cityInfo.className = 'city-info';
    
    const nameSpan = document.createElement('span');
    nameSpan.className = 'city-name';
    nameSpan.textContent = shortCode;
    nameSpan.title = fullName;
    
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';
    
    const progressFill = document.createElement('div');
    const level = appData[city]?.[currentBuilding.name] || 0;
    const lvlClass = getLevelClass(level, currentBuilding);
    progressFill.className = `progress-fill ${lvlClass}`;
    
    const percentage = Math.min(100, (level / maxGoal) * 100);
    progressFill.style.width = `${percentage}%`;
    progressContainer.appendChild(progressFill);
    
    // Costes para el siguiente nivel con ahorradores
    const cost = getBuildingUpgradeCost(currentBuilding.name, level, city);
    let costEl = null;
    if (cost) {
      costEl = document.createElement('div');
      costEl.className = 'building-cost-tag';
      
      const woodTitle = `Madera: ${cost.wood.toLocaleString()}${cost.woodDiscount > 0 ? ` (-${cost.woodDiscount}% Carpintería)` : ''}`;
      costEl.innerHTML = `
        <span class="res-chip ${cost.woodDiscount > 0 ? 'discounted' : ''}" title="${woodTitle}">
          <img src="assets/resources/wood.png" alt="Madera">
          <span>${formatResNum(cost.wood)}</span>
        </span>
      `;
      
      if (cost.marble > 0) {
        const marbleTitle = `Mármol: ${cost.marble.toLocaleString()}${cost.marbleDiscount > 0 ? ` (-${cost.marbleDiscount}% Arquitecto)` : ''}`;
        costEl.innerHTML += `
          <span class="res-chip ${cost.marbleDiscount > 0 ? 'discounted' : ''}" title="${marbleTitle}">
            <img src="assets/resources/marble.png" alt="Mármol">
            <span>${formatResNum(cost.marble)}</span>
          </span>
        `;
      }
    }
    
    cityInfo.appendChild(nameSpan);
    cityInfo.appendChild(progressContainer);
    if (costEl) cityInfo.appendChild(costEl);
    
    const controls = document.createElement('div');
    controls.className = 'controls';
    
    if (isEditing) {
      const input = document.createElement('input');
      input.type = 'number';
      input.className = 'level-input';
      input.min = '0';
      input.value = level;
      input.setAttribute('data-city', city);
      controls.appendChild(input);
    } else {
      const minusBtn = document.createElement('button');
      minusBtn.className = 'btn';
      minusBtn.textContent = '-';
      
      const badge = document.createElement('div');
      badge.className = `level-badge ${lvlClass}`;
      badge.textContent = level;
      
      const plusBtn = document.createElement('button');
      plusBtn.className = 'btn';
      plusBtn.textContent = '+';
      
      const updateUI = (newLevel) => {
        appData[city][currentBuilding.name] = newLevel;
        badge.textContent = newLevel;
        
        const newLvlClass = getLevelClass(newLevel, currentBuilding);
        badge.className = `level-badge ${newLvlClass}`;
        
        progressFill.className = `progress-fill ${newLvlClass}`;
        const pct = Math.min(100, (newLevel / maxGoal) * 100);
        progressFill.style.width = `${pct}%`;
        
        saveData();
        renderMetaSummary();
        // Actualizar etiqueta de coste
        if (costEl) {
          const updatedCost = getBuildingUpgradeCost(currentBuilding.name, newLevel, city);
          if (updatedCost) {
            costEl.innerHTML = `
              <span class="res-chip ${updatedCost.woodDiscount > 0 ? 'discounted' : ''}" title="Madera: ${updatedCost.wood.toLocaleString()}">
                <img src="assets/resources/wood.png" alt="Madera">
                <span>${formatResNum(updatedCost.wood)}</span>
              </span>
            `;
            if (updatedCost.marble > 0) {
              costEl.innerHTML += `
                <span class="res-chip ${updatedCost.marbleDiscount > 0 ? 'discounted' : ''}" title="Mármol: ${updatedCost.marble.toLocaleString()}">
                  <img src="assets/resources/marble.png" alt="Mármol">
                  <span>${formatResNum(updatedCost.marble)}</span>
                </span>
              `;
            }
          }
        }
      };
      
      minusBtn.onclick = () => {
        let currentLvl = appData[city][currentBuilding.name] || 0;
        if (currentLvl > 0) updateUI(currentLvl - 1);
      };
      
      plusBtn.onclick = () => {
        let currentLvl = appData[city][currentBuilding.name] || 0;
        updateUI(currentLvl + 1);
      };
      
      controls.appendChild(minusBtn);
      controls.appendChild(badge);
      controls.appendChild(plusBtn);
    }
    
    row.appendChild(cityInfo);
    row.appendChild(controls);
    
    newContent.appendChild(row);
  });
  
  content.parentNode.replaceChild(newContent, content);
}

// Configuración del botón flotante de edición
function setupEditButton() {
  const btnEdit = document.getElementById('btn-edit');
  
  btnEdit.onclick = () => {
    if (!isEditing) {
      isEditing = true;
      btnEdit.textContent = '✔️';
      btnEdit.className = 'floating-btn edit-mode-on';
      btnEdit.title = 'Confirmar y guardar cambios';
      
      renderMetaSummary();
      renderContent();
    } else {
      const metaInputs = document.querySelectorAll('.meta-input');
      metaInputs.forEach(input => {
        const key = input.getAttribute('data-meta-key');
        const val = parseInt(input.value, 10);
        currentBuilding[key] = isNaN(val) ? 0 : Math.max(0, val);
      });
      
      const levelInputs = document.querySelectorAll('.level-input');
      levelInputs.forEach(input => {
        const city = input.getAttribute('data-city');
        const val = parseInt(input.value, 10);
        const cleanVal = isNaN(val) ? 0 : Math.max(0, val);
        appData[city][currentBuilding.name] = cleanVal;
      });
      
      isEditing = false;
      btnEdit.textContent = '✏️';
      btnEdit.className = 'floating-btn edit-mode-off';
      btnEdit.title = 'Editar niveles y checkpoints';
      
      saveData();
      renderMetaSummary();
      renderContent();
    }
  };
}

// ========================================================
// LÓGICA DE TROPAS
// ========================================================
function renderTroopCityTabs() {
  const container = document.getElementById('troops-city-tabs');
  container.innerHTML = '';

  if (troopsData.selectedCities.length === 0) {
    container.style.display = 'none';
    return;
  }
  container.style.display = 'flex';

  troopsData.selectedCities.forEach(city => {
    const tab = document.createElement('div');
    const isActive = city === troopsData.activeTroopCity;
    tab.className = `troop-city-tab ${isActive ? 'active' : ''}`;
    
    const label = cityLabels[city];
    const shortCode = (label && label.abbr) ? label.abbr : city.replace('Tenochtitlan-', '');
    const fullName = (label && label.name) ? label.name : city;

    tab.textContent = shortCode;
    tab.title = fullName;

    // Botón para desvincular ciudad de vista de tropas
    const closeBtn = document.createElement('span');
    closeBtn.className = 'troop-city-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.title = 'Quitar de la vista de tropas';
    closeBtn.onclick = (e) => {
      e.stopPropagation();
      troopsData.selectedCities = troopsData.selectedCities.filter(c => c !== city);
      if (troopsData.activeTroopCity === city) {
        troopsData.activeTroopCity = troopsData.selectedCities[0] || null;
      }
      saveTroopsData();
      renderTroopCityTabs();
      renderTroopsContent();
    };

    tab.onclick = () => {
      if (troopsData.activeTroopCity !== city) {
        troopsData.activeTroopCity = city;
        renderTroopCityTabs();
        renderTroopsContent();
      }
    };

    tab.appendChild(closeBtn);
    container.appendChild(tab);
  });
}

function renderTroopsContent() {
  const container = document.getElementById('troops-content');
  container.innerHTML = '';

  const city = troopsData.activeTroopCity;
  if (!city || !troopsData.selectedCities.includes(city)) {
    container.innerHTML = `
      <div class="no-troops-msg">
        <p>No hay ninguna ciudad seleccionada en Tropas.</p>
        <button id="btn-add-first-troop-city" class="btn-action primary" style="max-width:180px;margin:10px auto;">+ Añadir Ciudad</button>
      </div>
    `;
    const btn = document.getElementById('btn-add-first-troop-city');
    if (btn) btn.onclick = openTroopCityModal;
    return;
  }

  const list = TROOP_DEFINITIONS[troopsData.activeTroopType] || [];
  if (!troopsData.cities[city]) {
    troopsData.cities[city] = { units: {}, ships: {} };
  }
  const typeKey = troopsData.activeTroopType;
  if (!troopsData.cities[city][typeKey]) {
    troopsData.cities[city][typeKey] = {};
  }
  const cityTroops = troopsData.cities[city][typeKey];

  // Cálculo de totales necesarios para la ciudad
  let totalMissingWood = 0;
  let totalMissingSulfur = 0;
  let totalMissingCrystal = 0;
  let totalMissingWine = 0;

  list.forEach(unit => {
    const data = cityTroops[unit.id] || { actual: 0, desired: 0 };
    const missing = Math.max(0, (data.desired || 0) - (data.actual || 0));
    if (missing > 0) {
      const cost = getUnitCostInCity(unit, city);
      totalMissingWood += missing * cost.wood;
      totalMissingSulfur += missing * cost.sulfur;
      totalMissingCrystal += missing * cost.crystal;
      totalMissingWine += missing * cost.wine;
    }
  });

  // Tarjeta de resumen de materiales faltantes
  const summaryCard = document.createElement('div');
  summaryCard.className = 'troop-summary-card';
  const label = cityLabels[city];
  const cityName = (label && label.name) ? label.name : city;

  summaryCard.innerHTML = `
    <div class="troop-summary-title">
      <span>Materiales requeridos para objetivo en <strong>${cityName}</strong>:</span>
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

  // Lista de Tropas / Barcos
  const grid = document.createElement('div');
  grid.className = 'troop-grid';

  list.forEach(unit => {
    if (!cityTroops[unit.id]) {
      cityTroops[unit.id] = { actual: 0, desired: 0 };
    }
    const unitData = cityTroops[unit.id];
    const cost = getUnitCostInCity(unit, city);
    const missing = Math.max(0, (unitData.desired || 0) - (unitData.actual || 0));

    const card = document.createElement('div');
    card.className = 'troop-card';

    // Icono
    const iconContainer = document.createElement('div');
    iconContainer.className = 'troop-icon-container';
    const img = document.createElement('img');
    img.src = unit.icon;
    img.alt = unit.name;
    iconContainer.appendChild(img);

    // Detalles
    const details = document.createElement('div');
    details.className = 'troop-details';

    // Fila superior: Nombre de la tropa
    const titleRow = document.createElement('div');
    titleRow.className = 'troop-title-row';
    const nameEl = document.createElement('span');
    nameEl.className = 'troop-name';
    nameEl.textContent = unit.name;
    titleRow.appendChild(nameEl);

    // Fila de controles: Actual, Cola (+), Deseado
    const inputsRow = document.createElement('div');
    inputsRow.className = 'troop-inputs-row';

    // Actual
    const actualGroup = document.createElement('div');
    actualGroup.className = 'troop-group';
    actualGroup.innerHTML = `<span class="troop-group-label">Real:</span>`;
    
    const minusBtn = document.createElement('button');
    minusBtn.className = 'troop-btn-tiny';
    minusBtn.textContent = '-';
    
    const actualInput = document.createElement('input');
    actualInput.type = 'number';
    actualInput.className = 'troop-input-num';
    actualInput.min = '0';
    actualInput.value = unitData.actual;

    const plusBtn = document.createElement('button');
    plusBtn.className = 'troop-btn-tiny';
    plusBtn.textContent = '+';

    const saveAndRefresh = () => {
      saveTroopsData();
      renderTroopsContent();
    };

    minusBtn.onclick = () => {
      if (unitData.actual > 0) {
        unitData.actual--;
        saveAndRefresh();
      }
    };
    plusBtn.onclick = () => {
      unitData.actual++;
      saveAndRefresh();
    };
    actualInput.onchange = () => {
      const val = parseInt(actualInput.value, 10);
      unitData.actual = isNaN(val) ? 0 : Math.max(0, val);
      saveAndRefresh();
    };

    actualGroup.appendChild(minusBtn);
    actualGroup.appendChild(actualInput);
    actualGroup.appendChild(plusBtn);

    // Botón Agregar cola (+ entrenar)
    const queueBox = document.createElement('div');
    queueBox.className = 'troop-queue-box';
    queueBox.title = 'Agregar tropas que están entrenando en cuartel/astillero';
    
    const queueInput = document.createElement('input');
    queueInput.type = 'number';
    queueInput.className = 'troop-queue-input';
    queueInput.placeholder = '+cola';
    queueInput.min = '1';

    const queueAddBtn = document.createElement('button');
    queueAddBtn.className = 'troop-btn-tiny';
    queueAddBtn.textContent = '+';
    queueAddBtn.title = 'Sumar a las reales';

    const applyQueue = () => {
      const addVal = parseInt(queueInput.value, 10);
      if (!isNaN(addVal) && addVal > 0) {
        unitData.actual += addVal;
        queueInput.value = '';
        saveAndRefresh();
      }
    };

    queueAddBtn.onclick = applyQueue;
    queueInput.onkeydown = (e) => {
      if (e.key === 'Enter') applyQueue();
    };

    queueBox.appendChild(queueInput);
    queueBox.appendChild(queueAddBtn);

    // Deseado
    const desiredGroup = document.createElement('div');
    desiredGroup.className = 'troop-group';
    desiredGroup.innerHTML = `<span class="troop-group-label">Meta:</span>`;

    const desiredInput = document.createElement('input');
    desiredInput.type = 'number';
    desiredInput.className = 'troop-input-num';
    desiredInput.min = '0';
    desiredInput.value = unitData.desired;
    desiredInput.onchange = () => {
      const val = parseInt(desiredInput.value, 10);
      unitData.desired = isNaN(val) ? 0 : Math.max(0, val);
      saveAndRefresh();
    };

    desiredGroup.appendChild(desiredInput);

    inputsRow.appendChild(actualGroup);
    inputsRow.appendChild(queueBox);
    inputsRow.appendChild(desiredGroup);

    // Fila de recursos faltantes para esta unidad
    const neededResRow = document.createElement('div');
    neededResRow.className = 'troop-needed-res';

    if (missing > 0) {
      const mWood = missing * cost.wood;
      const mSulfur = missing * cost.sulfur;
      const mCrystal = missing * cost.crystal;
      const mWine = missing * cost.wine;

      neededResRow.innerHTML = `
        <span class="res-chip" title="Falta ${mWood.toLocaleString()} madera">
          <img src="assets/resources/wood.png" alt="Madera">
          <span>${formatResNum(mWood)}</span>
        </span>
      `;
      if (mSulfur > 0) {
        neededResRow.innerHTML += `
          <span class="res-chip" title="Falta ${mSulfur.toLocaleString()} azufre">
            <img src="assets/resources/sulfur.png" alt="Azufre">
            <span>${formatResNum(mSulfur)}</span>
          </span>
        `;
      }
      if (mCrystal > 0) {
        neededResRow.innerHTML += `
          <span class="res-chip" title="Falta ${mCrystal.toLocaleString()} cristal">
            <img src="assets/resources/glass.png" alt="Cristal">
            <span>${formatResNum(mCrystal)}</span>
          </span>
        `;
      }
      if (mWine > 0) {
        neededResRow.innerHTML += `
          <span class="res-chip" title="Falta ${mWine.toLocaleString()} vino">
            <img src="assets/resources/wine.png" alt="Vino">
            <span>${formatResNum(mWine)}</span>
          </span>
        `;
      }
    } else {
      neededResRow.innerHTML = `<span style="color:#2e7d32;font-size:10px;font-weight:bold;">✔️ Objetivo completado</span>`;
    }

    details.appendChild(titleRow);
    details.appendChild(inputsRow);
    details.appendChild(neededResRow);

    card.appendChild(iconContainer);
    card.appendChild(details);
    grid.appendChild(card);
  });

  container.appendChild(grid);
}

function openTroopCityModal() {
  const modal = document.getElementById('troop-city-modal');
  const listContainer = document.getElementById('available-troop-cities-list');
  listContainer.innerHTML = '';

  const activeCitiesList = cities.slice(0, activeCityCount);
  activeCitiesList.forEach((city, idx) => {
    const item = document.createElement('div');
    item.className = 'city-rename-item';
    item.style.cursor = 'pointer';

    const label = cityLabels[city];
    const shortCode = (label && label.abbr) ? label.abbr : city.replace('Tenochtitlan-', '');
    const fullName = (label && label.name) ? label.name : city;
    const isAlreadyAdded = troopsData.selectedCities.includes(city);

    item.innerHTML = `
      <span class="city-rename-index">${idx + 1}</span>
      <span style="flex-grow:1;font-weight:bold;font-size:11px;">${shortCode} - ${fullName}</span>
      <span style="font-size:11px;font-weight:bold;color:${isAlreadyAdded ? '#2e7d32' : '#b14329'};">
        ${isAlreadyAdded ? 'Añadida ✔️' : '+ Añadir'}
      </span>
    `;

    item.onclick = () => {
      if (!isAlreadyAdded) {
        troopsData.selectedCities.push(city);
        troopsData.activeTroopCity = city;
        saveTroopsData();
        renderTroopCityTabs();
        renderTroopsContent();
        modal.classList.add('hidden');
      } else {
        troopsData.activeTroopCity = city;
        saveTroopsData();
        renderTroopCityTabs();
        renderTroopsContent();
        modal.classList.add('hidden');
      }
    };

    listContainer.appendChild(item);
  });

  modal.classList.remove('hidden');
}

function setupTroopsNavigation() {
  // Pestañas principales (Construcción / Tropas)
  const navConstruction = document.getElementById('nav-btn-construction');
  const navTroops = document.getElementById('nav-btn-troops');
  const viewConstruction = document.getElementById('view-construction');
  const viewTroops = document.getElementById('view-troops');
  const btnEdit = document.getElementById('btn-edit');

  navConstruction.onclick = () => {
    currentView = "construction";
    navConstruction.classList.add('active');
    navTroops.classList.remove('active');
    viewConstruction.classList.remove('hidden');
    viewTroops.classList.add('hidden');
    btnEdit.style.display = 'flex';
  };

  navTroops.onclick = () => {
    currentView = "troops";
    navTroops.classList.add('active');
    navConstruction.classList.remove('active');
    viewTroops.classList.remove('hidden');
    viewConstruction.classList.add('hidden');
    btnEdit.style.display = 'none'; // El lápiz es para niveles de edificios
    renderTroopCityTabs();
    renderTroopsContent();
  };

  // Subpestañas Tropas (Unidades / Barcos)
  const subtabUnits = document.getElementById('troops-subtab-units');
  const subtabShips = document.getElementById('troops-subtab-ships');

  subtabUnits.onclick = () => {
    troopsData.activeTroopType = "units";
    subtabUnits.classList.add('active');
    subtabShips.classList.remove('active');
    saveTroopsData();
    renderTroopsContent();
  };

  subtabShips.onclick = () => {
    troopsData.activeTroopType = "ships";
    subtabShips.classList.add('active');
    subtabUnits.classList.remove('active');
    saveTroopsData();
    renderTroopsContent();
  };

  // Botón + Ciudad modal
  document.getElementById('btn-add-troop-city').onclick = openTroopCityModal;
  document.getElementById('btn-close-troop-city-modal').onclick = () => {
    document.getElementById('troop-city-modal').classList.add('hidden');
  };
}

// Configuración general
function populateCityRenameList() {
  const container = document.getElementById('city-rename-list');
  container.innerHTML = '';
  
  cities.slice(0, activeCityCount).forEach((city, idx) => {
    const item = document.createElement('div');
    item.className = 'city-rename-item';
    
    const indexSpan = document.createElement('span');
    indexSpan.className = 'city-rename-index';
    indexSpan.textContent = idx + 1;
    indexSpan.title = city;
    
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className = 'city-rename-input name-input';
    nameInput.maxLength = 30;
    nameInput.placeholder = 'Nombre...';
    const existingLabel = cityLabels[city];
    nameInput.value = (existingLabel && existingLabel.name) ? existingLabel.name : '';
    
    const abbrInput = document.createElement('input');
    abbrInput.type = 'text';
    abbrInput.className = 'city-rename-input abbr-input';
    abbrInput.maxLength = 6;
    abbrInput.placeholder = 'Abrev.';
    abbrInput.value = (existingLabel && existingLabel.abbr) ? existingLabel.abbr : '';
    
    const saveLabel = () => {
      const nameVal = nameInput.value.trim();
      const abbrVal = abbrInput.value.trim();
      if (nameVal || abbrVal) {
        cityLabels[city] = { name: nameVal, abbr: abbrVal };
      } else {
        delete cityLabels[city];
      }
    };
    
    nameInput.addEventListener('input', saveLabel);
    abbrInput.addEventListener('input', saveLabel);
    
    item.appendChild(indexSpan);
    item.appendChild(nameInput);
    item.appendChild(abbrInput);
    container.appendChild(item);
  });
}

function setupSettingsButton() {
  const btnSettings = document.getElementById('btn-settings');
  const overlay = document.getElementById('settings-overlay');
  const btnClose = document.getElementById('btn-close-settings');
  const btnExport = document.getElementById('btn-export');
  const btnImport = document.getElementById('btn-import');
  const txtBackup = document.getElementById('txt-backup');
  const backupStatus = document.getElementById('backup-status');
  
  btnSettings.onclick = () => {
    overlay.classList.remove('hidden');
    document.getElementById('input-city-count').value = activeCityCount;
    populateCityRenameList();
    txtBackup.classList.add('hidden');
    txtBackup.value = '';
    backupStatus.textContent = '';
    backupStatus.className = 'status-msg';
  };
  
  document.getElementById('btn-apply-city-count').onclick = () => {
    const input = document.getElementById('input-city-count');
    const val = parseInt(input.value, 10);
    if (!isNaN(val) && val >= 1 && val <= cities.length) {
      activeCityCount = val;
      chrome.storage.local.set({ ikariamCityCount: val });
      populateCityRenameList();
      renderTabs();
      renderMetaSummary();
      renderContent();
      renderTroopCityTabs();
    }
  };

  const applyAndClose = () => {
    saveCityLabels();
    renderContent();
    renderTroopCityTabs();
    renderTroopsContent();
    overlay.classList.add('hidden');
  };

  btnClose.onclick = applyAndClose;
  document.getElementById('btn-save-cities').onclick = applyAndClose;
  
  btnExport.onclick = () => {
    const dataToExport = {
      ikariamLevels: appData,
      ikariamBuildings: buildingsConfig,
      ikariamCityLabels: cityLabels,
      ikariamTroops: troopsData
    };
    const jsonStr = JSON.stringify(dataToExport, null, 2);
    txtBackup.value = jsonStr;
    txtBackup.classList.remove('hidden');
    txtBackup.select();
    
    navigator.clipboard.writeText(jsonStr)
      .then(() => {
        showBackupStatus("¡Copia de seguridad copiada al portapapeles!", true);
      })
      .catch(() => {
        showBackupStatus("Exportado. Copia el texto del recuadro.", true);
      });
  };
  
  btnImport.onclick = () => {
    if (txtBackup.classList.contains('hidden')) {
      txtBackup.classList.remove('hidden');
      txtBackup.value = '';
      showBackupStatus("Pega el JSON en el recuadro y presiona 'Importar' de nuevo.", false);
      return;
    }
    
    const inputStr = txtBackup.value.trim();
    if (!inputStr) {
      showBackupStatus("El recuadro está vacío.", false);
      return;
    }
    
    try {
      const parsed = JSON.parse(inputStr);
      if (!parsed.ikariamLevels) {
        throw new Error("Falta la clave 'ikariamLevels'");
      }
      
      appData = parsed.ikariamLevels;
      if (parsed.ikariamBuildings) {
        buildingsConfig = parsed.ikariamBuildings;
      }
      cityLabels = parsed.ikariamCityLabels || {};
      if (parsed.ikariamTroops) {
        troopsData = parsed.ikariamTroops;
      }
      
      saveData();
      saveCityLabels();
      saveTroopsData();
      
      loadData(() => {
        renderTabs();
        renderMetaSummary();
        renderContent();
        renderTroopCityTabs();
        renderTroopsContent();
        showBackupStatus("¡Datos importados con éxito!", true);
        setTimeout(() => {
          overlay.classList.add('hidden');
        }, 1500);
      });
      
    } catch (err) {
      showBackupStatus("JSON inválido: " + err.message, false);
    }
  };
  
  function showBackupStatus(msg, isSuccess) {
    backupStatus.textContent = msg;
    backupStatus.className = `status-msg ${isSuccess ? 'success' : 'error'}`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const tabsContainer = document.getElementById('tabs');
  if (tabsContainer) {
    tabsContainer.addEventListener('wheel', (evt) => {
      evt.preventDefault();
      tabsContainer.scrollLeft += evt.deltaY;
    }, { passive: false });
  }

  loadData(() => {
    renderTabs();
    renderMetaSummary();
    renderContent();
    setupEditButton();
    setupSettingsButton();
    setupTroopsNavigation();
  });
});
