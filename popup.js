const DEFAULT_CITIES = [
  "Tenochtitlan-m1", "Tenochtitlan-m2", "Tenochtitlan-a1", "Tenochtitlan-v1", 
  "Tenochtitlan-c1", "Tenochtitlan-m3", "Tenochtitlan-m4", "Tenochtitlan-a2", 
  "Tenochtitlan-v2", "Tenochtitlan-c2", "Tenochtitlan-c3", "Tenochtitlan-c4", 
  "Tenochtitlan-v3"
];

let cities = [...DEFAULT_CITIES];

const DEFAULT_BUILDINGS = [
  { name: "Intendencia", meta1: 18, meta2: 28, meta3: 36, meta4: 42, meta5: 47, meta6: 49 },
  { 
    name: "Depósito", 
    isMulti: true, 
    instances: ["Depósito 1", "Depósito 2"], 
    meta1: 14, meta2: 25, meta3: 35, meta4: 40, meta5: 45, meta6: 48 
  },
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
  "Depósito": { baseWood: 40, factorWood: 1.33, baseMarble: 32, factorMarble: 1.33, marbleStartLvl: 4 },
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
let currentBuilding = null;
let isEditing = false;
let isReorderingBuildings = false;
let currentView = "construction"; // "summary" | "construction" | "troops" | "settings"

let troopsData = {
  activeTroopCity: null,
  cities: {}
};

let cityToDelete = null;

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

function getInitialData() {
  const data = {};
  cities.forEach(city => {
    data[city] = {};
    buildingsConfig.forEach(b => {
      data[city][b.name] = b.isMulti ? b.instances.map(() => 0) : 0;
    });
  });
  return data;
}

function loadData(callback) {
  chrome.storage.local.get(['ikariamLevels', 'ikariamBuildings', 'ikariamCityLabels', 'ikariamCitiesList', 'ikariamCityCount', 'ikariamTroops'], (result) => {
    let updated = false;

    // Cargar lista de ciudades
    if (result.ikariamCitiesList && Array.isArray(result.ikariamCitiesList) && result.ikariamCitiesList.length > 0) {
      cities = result.ikariamCitiesList;
    } else if (result.ikariamCityCount && result.ikariamCityCount >= 1) {
      cities = DEFAULT_CITIES.slice(0, result.ikariamCityCount);
      saveCitiesList();
    } else {
      cities = [...DEFAULT_CITIES];
      saveCitiesList();
    }

    if (result.ikariamCityLabels) {
      cityLabels = result.ikariamCityLabels;
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

      // Sincronizar conservando el orden guardado por el usuario
      const syncedBuildings = [];
      loadedBuildings.forEach(b => {
        const defB = DEFAULT_BUILDINGS.find(d => d.name === b.name);
        if (defB) {
          syncedBuildings.push({ ...defB, ...b });
        }
      });

      // Añadir edificios por defecto que falten
      DEFAULT_BUILDINGS.forEach(defB => {
        if (!syncedBuildings.some(b => b.name === defB.name)) {
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

        // Migración a Depósito: [d1, d2]
        if (appData[city]["Deposito 1"] !== undefined || appData[city]["Deposito 2"] !== undefined) {
          const d1 = appData[city]["Deposito 1"] || 0;
          const d2 = appData[city]["Deposito 2"] || 0;
          if (!Array.isArray(appData[city]["Depósito"])) {
            appData[city]["Depósito"] = [d1, d2];
          }
          delete appData[city]["Deposito 1"];
          delete appData[city]["Deposito 2"];
          updated = true;
        }

        buildingsConfig.forEach(b => {
          if (appData[city][b.name] === undefined) {
            appData[city][b.name] = b.isMulti ? b.instances.map(() => 0) : 0;
            updated = true;
          } else if (b.isMulti && !Array.isArray(appData[city][b.name])) {
            appData[city][b.name] = [appData[city][b.name] || 0, 0];
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
      if (!troopsData.cities) troopsData.cities = {};
      if (!troopsData.activeTroopCity || !cities.includes(troopsData.activeTroopCity)) {
        troopsData.activeTroopCity = cities[0] || null;
      }
    } else {
      troopsData = {
        activeTroopCity: cities[0] || null,
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
    ikariamBuildings: buildingsConfig,
    ikariamCitiesList: cities
  });
}

function saveCitiesList() {
  chrome.storage.local.set({ ikariamCitiesList: cities });
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
  
  let draggedBuildingIndex = null;

  buildingsConfig.forEach((b, idx) => {
    const tab = document.createElement('div');
    const isActive = b.name === currentBuilding.name;
    tab.className = `tab ${isActive ? 'active' : ''}`;
    tab.textContent = b.name;
    tab.title = isReorderingBuildings ? `Arrastra para mover: ${b.name}` : b.name;

    if (isReorderingBuildings) {
      tab.draggable = true;
      tab.classList.add('reorder-mode');

      tab.addEventListener('dragstart', (e) => {
        draggedBuildingIndex = idx;
        tab.classList.add('is-dragging');
        e.dataTransfer.setData('text/plain', idx);
      });
      tab.addEventListener('dragover', (e) => {
        e.preventDefault();
      });
      tab.addEventListener('drop', (e) => {
        e.preventDefault();
        const targetIndex = idx;
        if (draggedBuildingIndex !== null && draggedBuildingIndex !== targetIndex) {
          const moved = buildingsConfig.splice(draggedBuildingIndex, 1)[0];
          buildingsConfig.splice(targetIndex, 0, moved);
          saveData();
          renderTabs();
          renderSummary();
        }
      });
      tab.addEventListener('dragend', () => {
        tab.classList.remove('is-dragging');
      });
    } else {
      tab.onclick = () => {
        if (isEditing) return;
        if (currentBuilding.name !== b.name) {
          currentBuilding = b;
          renderTabs();
          renderMetaSummary();
          renderContent();
        }
      };
    }
    
    tabsContainer.appendChild(tab);
    
    if (!isReorderingBuildings && isActive && idx > 1 && b.name !== "Muralla" && b.name !== "Museo") {
      setTimeout(() => {
        tab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }, 50);
    }
  });
}

function setupReorderBuildingsButton() {
  const btn = document.getElementById('btn-reorder-buildings');
  btn.onclick = () => {
    isReorderingBuildings = !isReorderingBuildings;
    if (isReorderingBuildings) {
      btn.textContent = '✔️';
      btn.classList.add('active');
      btn.title = 'Guardar y salir del modo reordenar';
    } else {
      btn.textContent = '↔️';
      btn.classList.remove('active');
      btn.title = 'Reordenar pestañas de edificios';
      saveData();
      renderSummary();
    }
    renderTabs();
  };
}

function getActiveTargetIndex(building = currentBuilding) {
  const metaKeys = ["meta1", "meta2", "meta3", "meta4", "meta5", "meta6"];
  for (let i = 0; i < metaKeys.length; i++) {
    const targetValue = building[metaKeys[i]];
    const allMeetTarget = cities.every(city => {
      const val = appData[city]?.[building.name];
      if (building.isMulti && Array.isArray(val)) {
        return val.every(l => l >= targetValue);
      }
      return (val || 0) >= targetValue;
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
  
  cities.forEach((city) => {
    const row = document.createElement('div');
    const label = cityLabels[city];
    const shortCode = (label && label.abbr) ? label.abbr : city.replace('Tenochtitlan-', '');
    const fullName = (label && label.name) ? label.name : city;

    if (currentBuilding.isMulti) {
      row.className = 'city-row multi-instance';

      const nameContainer = document.createElement('div');
      nameContainer.className = 'city-name-container';
      const nameSpan = document.createElement('span');
      nameSpan.className = 'city-name';
      nameSpan.textContent = shortCode;
      nameSpan.title = fullName;
      nameContainer.appendChild(nameSpan);
      row.appendChild(nameContainer);

      const instancesList = document.createElement('div');
      instancesList.className = 'city-instances-list';

      const levels = appData[city]?.[currentBuilding.name] || [0, 0];

      currentBuilding.instances.forEach((instName, instIdx) => {
        const instRow = document.createElement('div');
        instRow.className = 'city-instance-row';

        const instLabel = document.createElement('span');
        instLabel.className = 'instance-label';
        instLabel.textContent = instIdx === 0 ? 'D1' : 'D2';
        instRow.appendChild(instLabel);

        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';
        
        const progressFill = document.createElement('div');
        const level = levels[instIdx] || 0;
        const lvlClass = getLevelClass(level, currentBuilding);
        progressFill.className = `progress-fill ${lvlClass}`;
        const pct = Math.min(100, (level / maxGoal) * 100);
        progressFill.style.width = `${pct}%`;
        progressContainer.appendChild(progressFill);
        instRow.appendChild(progressContainer);

        const cost = getBuildingUpgradeCost(currentBuilding.name, level, city);
        let costEl = null;
        if (cost) {
          costEl = document.createElement('div');
          costEl.className = 'building-cost-tag';
          costEl.innerHTML = `
            <span class="res-chip ${cost.woodDiscount > 0 ? 'discounted' : ''}" title="Madera: ${cost.wood.toLocaleString()}">
              <img src="assets/resources/wood.png" alt="Madera">
              <span>${formatResNum(cost.wood)}</span>
            </span>
          `;
          if (cost.marble > 0) {
            costEl.innerHTML += `
              <span class="res-chip ${cost.marbleDiscount > 0 ? 'discounted' : ''}" title="Mármol: ${cost.marble.toLocaleString()}">
                <img src="assets/resources/marble.png" alt="Mármol">
                <span>${formatResNum(cost.marble)}</span>
              </span>
            `;
          }
          instRow.appendChild(costEl);
        }

        const controls = document.createElement('div');
        controls.className = 'controls';

        if (isEditing) {
          const input = document.createElement('input');
          input.type = 'number';
          input.className = 'level-input';
          input.min = '0';
          input.value = level;
          input.setAttribute('data-city', city);
          input.setAttribute('data-inst-idx', instIdx);
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

          const updateMultiUI = (newLevel) => {
            levels[instIdx] = newLevel;
            appData[city][currentBuilding.name] = levels;
            badge.textContent = newLevel;
            const newLvlClass = getLevelClass(newLevel, currentBuilding);
            badge.className = `level-badge ${newLvlClass}`;
            progressFill.className = `progress-fill ${newLvlClass}`;
            progressFill.style.width = `${Math.min(100, (newLevel / maxGoal) * 100)}%`;
            saveData();
            renderMetaSummary();
            if (costEl) {
              const uCost = getBuildingUpgradeCost(currentBuilding.name, newLevel, city);
              if (uCost) {
                costEl.innerHTML = `
                  <span class="res-chip ${uCost.woodDiscount > 0 ? 'discounted' : ''}" title="Madera: ${uCost.wood.toLocaleString()}">
                    <img src="assets/resources/wood.png" alt="Madera">
                    <span>${formatResNum(uCost.wood)}</span>
                  </span>
                `;
                if (uCost.marble > 0) {
                  costEl.innerHTML += `
                    <span class="res-chip ${uCost.marbleDiscount > 0 ? 'discounted' : ''}" title="Mármol: ${uCost.marble.toLocaleString()}">
                      <img src="assets/resources/marble.png" alt="Mármol">
                      <span>${formatResNum(uCost.marble)}</span>
                    </span>
                  `;
                }
              }
            }
          };

          minusBtn.onclick = () => {
            if (levels[instIdx] > 0) updateMultiUI(levels[instIdx] - 1);
          };
          plusBtn.onclick = () => {
            updateMultiUI(levels[instIdx] + 1);
          };

          controls.appendChild(minusBtn);
          controls.appendChild(badge);
          controls.appendChild(plusBtn);
        }

        instRow.appendChild(controls);
        instancesList.appendChild(instRow);
      });

      row.appendChild(instancesList);
    } else {
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
      
      const cost = getBuildingUpgradeCost(currentBuilding.name, level, city);
      let costEl = null;
      if (cost) {
        costEl = document.createElement('div');
        costEl.className = 'building-cost-tag';
        costEl.innerHTML = `
          <span class="res-chip ${cost.woodDiscount > 0 ? 'discounted' : ''}" title="Madera: ${cost.wood.toLocaleString()}">
            <img src="assets/resources/wood.png" alt="Madera">
            <span>${formatResNum(cost.wood)}</span>
          </span>
        `;
        if (cost.marble > 0) {
          costEl.innerHTML += `
            <span class="res-chip ${cost.marbleDiscount > 0 ? 'discounted' : ''}" title="Mármol: ${cost.marble.toLocaleString()}">
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
    }
    
    newContent.appendChild(row);
  });
  
  content.parentNode.replaceChild(newContent, content);
}

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
        const instIdxAttr = input.getAttribute('data-inst-idx');

        if (instIdxAttr !== null) {
          const instIdx = parseInt(instIdxAttr, 10);
          if (!Array.isArray(appData[city][currentBuilding.name])) {
            appData[city][currentBuilding.name] = [0, 0];
          }
          appData[city][currentBuilding.name][instIdx] = cleanVal;
        } else {
          appData[city][currentBuilding.name] = cleanVal;
        }
      });
      
      isEditing = false;
      btnEdit.textContent = '✏️';
      btnEdit.className = 'floating-btn edit-mode-off';
      btnEdit.title = 'Editar niveles y checkpoints';
      
      saveData();
      renderMetaSummary();
      renderContent();
      renderSummary();
    }
  };
}

// ========================================================
// VISTA: RESUMEN (6 CONSTRUCCIONES Y TOP 6 TROPAS FALTANTES)
// ========================================================
function renderSummary() {
  // 1. Próximas 6 Construcciones
  const bContainer = document.getElementById('summary-cards-container');
  bContainer.innerHTML = '';

  const metaKeys = ["meta1", "meta2", "meta3", "meta4", "meta5", "meta6"];
  const candidateTasks = [];

  // Excluye Intendencia y sigue el orden de buildingsConfig
  const priorityBuildings = buildingsConfig.filter(b => b.name !== "Intendencia");

  for (const building of priorityBuildings) {
    const targetIdx = getActiveTargetIndex(building);
    const targetKey = metaKeys[targetIdx];
    const targetValue = building[targetKey];

    for (let cIdx = 0; cIdx < cities.length; cIdx++) {
      const city = cities[cIdx];
      const val = appData[city]?.[building.name];

      if (building.isMulti && Array.isArray(val)) {
        val.forEach((instLvl, instIdx) => {
          if (instLvl < targetValue) {
            candidateTasks.push({
              buildingName: `${building.name} (D${instIdx + 1})`,
              rawBuildingName: building.name,
              city: city,
              currentLevel: instLvl,
              targetLevel: targetValue,
              cost: getBuildingUpgradeCost(building.name, instLvl, city)
            });
          }
        });
      } else {
        const curLvl = val || 0;
        if (curLvl < targetValue) {
          candidateTasks.push({
            buildingName: building.name,
            rawBuildingName: building.name,
            city: city,
            currentLevel: curLvl,
            targetLevel: targetValue,
            cost: getBuildingUpgradeCost(building.name, curLvl, city)
          });
        }
      }

      if (candidateTasks.length >= 6) break;
    }
    if (candidateTasks.length >= 6) break;
  }

  if (candidateTasks.length === 0) {
    bContainer.innerHTML = `
      <div class="no-troops-msg">
        <p>🎉 ¡Todas las ciudades han alcanzado las metas actuales en los edificios prioritarios!</p>
      </div>
    `;
  } else {
    candidateTasks.forEach((task, idx) => {
      const card = document.createElement('div');
      card.className = 'summary-card-item';

      const label = cityLabels[task.city];
      const cityCode = (label && label.abbr) ? label.abbr : task.city.replace('Tenochtitlan-', '');
      const cityName = (label && label.name) ? label.name : task.city;

      const left = document.createElement('div');
      left.className = 'summary-card-left';
      left.innerHTML = `
        <div>
          <span class="summary-rank-badge">#${idx + 1}</span>
          <span class="summary-b-name">${task.buildingName}</span>
        </div>
        <div class="summary-city-name">${cityCode} (${cityName})</div>
      `;

      const right = document.createElement('div');
      right.className = 'summary-card-right';
      
      let costHtml = '';
      if (task.cost) {
        costHtml = `
          <div class="building-cost-tag">
            <span class="res-chip ${task.cost.woodDiscount > 0 ? 'discounted' : ''}" title="Madera: ${task.cost.wood.toLocaleString()}">
              <img src="assets/resources/wood.png" alt="Madera">
              <span>${formatResNum(task.cost.wood)}</span>
            </span>
            ${task.cost.marble > 0 ? `
              <span class="res-chip ${task.cost.marbleDiscount > 0 ? 'discounted' : ''}" title="Mármol: ${task.cost.marble.toLocaleString()}">
                <img src="assets/resources/marble.png" alt="Mármol">
                <span>${formatResNum(task.cost.marble)}</span>
              </span>
            ` : ''}
          </div>
        `;
      }

      right.innerHTML = `
        <div class="summary-levels">Nivel ${task.currentLevel} ➔ ${task.targetLevel}</div>
        ${costHtml}
      `;

      card.appendChild(left);
      card.appendChild(right);
      bContainer.appendChild(card);
    });
  }

  // 2. Top 6 Ciudades con más tropas faltantes
  const troopsContainer = document.getElementById('summary-troops-container');
  troopsContainer.innerHTML = '';

  const troopDeficits = [];

  cities.forEach(city => {
    const cityTroops = troopsData.cities[city] || {};
    const unitsMap = cityTroops.units || {};
    const shipsMap = cityTroops.ships || {};

    let totalDeficit = 0;
    let missingWood = 0;
    let missingSulfur = 0;
    let missingCrystal = 0;
    let missingWine = 0;

    const calcDeficit = (list, map) => {
      list.forEach(item => {
        const u = map[item.id];
        if (u) {
          const diff = Math.max(0, (u.desired || 0) - (u.actual || 0));
          if (diff > 0) {
            totalDeficit += diff;
            const cost = getUnitCostInCity(item, city);
            missingWood += diff * cost.wood;
            missingSulfur += diff * cost.sulfur;
            missingCrystal += diff * cost.crystal;
            missingWine += diff * cost.wine;
          }
        }
      });
    };

    calcDeficit(TROOP_DEFINITIONS.units, unitsMap);
    calcDeficit(TROOP_DEFINITIONS.ships, shipsMap);

    if (totalDeficit > 0) {
      troopDeficits.push({
        city,
        totalDeficit,
        wood: missingWood,
        sulfur: missingSulfur,
        crystal: missingCrystal,
        wine: missingWine
      });
    }
  });

  troopDeficits.sort((a, b) => b.totalDeficit - a.totalDeficit);
  const top6Troops = troopDeficits.slice(0, 6);

  if (top6Troops.length === 0) {
    troopsContainer.innerHTML = `
      <div class="no-troops-msg">
        <p>🎉 ¡Todas las ciudades tienen sus metas de tropas y barcos al 100%!</p>
      </div>
    `;
  } else {
    top6Troops.forEach((item, idx) => {
      const card = document.createElement('div');
      card.className = 'summary-card-item';

      const label = cityLabels[item.city];
      const cityCode = (label && label.abbr) ? label.abbr : item.city.replace('Tenochtitlan-', '');
      const cityName = (label && label.name) ? label.name : item.city;

      const left = document.createElement('div');
      left.className = 'summary-card-left';
      left.innerHTML = `
        <div>
          <span class="summary-rank-badge">#${idx + 1}</span>
          <span class="summary-b-name">${cityCode} (${cityName})</span>
        </div>
        <div class="summary-troop-deficit">Faltan ${item.totalDeficit.toLocaleString()} unidades</div>
      `;

      const right = document.createElement('div');
      right.className = 'summary-card-right';
      right.innerHTML = `
        <div class="building-cost-tag">
          ${item.wood > 0 ? `
            <span class="res-chip" title="Madera: ${item.wood.toLocaleString()}">
              <img src="assets/resources/wood.png" alt="Madera">
              <span>${formatResNum(item.wood)}</span>
            </span>
          ` : ''}
          ${item.sulfur > 0 ? `
            <span class="res-chip" title="Azufre: ${item.sulfur.toLocaleString()}">
              <img src="assets/resources/sulfur.png" alt="Azufre">
              <span>${formatResNum(item.sulfur)}</span>
            </span>
          ` : ''}
          ${item.crystal > 0 ? `
            <span class="res-chip" title="Cristal: ${item.crystal.toLocaleString()}">
              <img src="assets/resources/glass.png" alt="Cristal">
              <span>${formatResNum(item.crystal)}</span>
            </span>
          ` : ''}
          ${item.wine > 0 ? `
            <span class="res-chip" title="Vino: ${item.wine.toLocaleString()}">
              <img src="assets/resources/wine.png" alt="Vino">
              <span>${formatResNum(item.wine)}</span>
            </span>
          ` : ''}
        </div>
      `;

      card.appendChild(left);
      card.appendChild(right);
      troopsContainer.appendChild(card);
    });
  }
}

// ========================================================
// VISTA: TROPAS (CIUDADES AUTOMÁTICAS Y AMBAS SECCIONES)
// ========================================================
function renderTroopCityTabs() {
  const container = document.getElementById('troops-city-tabs');
  container.innerHTML = '';

  if (cities.length === 0) {
    container.style.display = 'none';
    return;
  }
  container.style.display = 'flex';

  if (!troopsData.activeTroopCity || !cities.includes(troopsData.activeTroopCity)) {
    troopsData.activeTroopCity = cities[0];
  }

  cities.forEach(city => {
    const tab = document.createElement('div');
    const isActive = city === troopsData.activeTroopCity;
    tab.className = `troop-city-tab ${isActive ? 'active' : ''}`;
    
    const label = cityLabels[city];
    const shortCode = (label && label.abbr) ? label.abbr : city.replace('Tenochtitlan-', '');
    const fullName = (label && label.name) ? label.name : city;

    tab.textContent = shortCode;
    tab.title = fullName;

    tab.onclick = () => {
      if (troopsData.activeTroopCity !== city) {
        troopsData.activeTroopCity = city;
        renderTroopCityTabs();
        renderTroopsContent();
      }
    };

    container.appendChild(tab);
  });
}

function renderTroopsContent() {
  const container = document.getElementById('troops-content');
  container.innerHTML = '';

  const city = troopsData.activeTroopCity;
  if (!city || !cities.includes(city)) {
    container.innerHTML = `
      <div class="no-troops-msg">
        <p>No hay ciudades configuradas. Ve a la pestaña Configuración para añadir una.</p>
      </div>
    `;
    return;
  }

  if (!troopsData.cities[city]) {
    troopsData.cities[city] = { units: {}, ships: {} };
  }
  if (!troopsData.cities[city].units) troopsData.cities[city].units = {};
  if (!troopsData.cities[city].ships) troopsData.cities[city].ships = {};

  const unitsMap = troopsData.cities[city].units;
  const shipsMap = troopsData.cities[city].ships;

  // Cálculo de totales combinados
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

  // Tarjeta de resumen general
  const summaryCard = document.createElement('div');
  summaryCard.className = 'troop-summary-card';
  const label = cityLabels[city];
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

  // Función para renderizar sección militar
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

      // Columna 1: Imagen 2x + Nombre
      const colIdentity = document.createElement('div');
      colIdentity.className = 'troop-col-identity';
      colIdentity.innerHTML = `
        <div class="troop-icon-container">
          <img src="${item.icon}" alt="${item.name}">
        </div>
        <span class="troop-name" title="${item.name}">${item.name}</span>
      `;

      // Columna 2: Inputs Real y Meta
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
        renderSummary();
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
        renderSummary();
      };
      rowMeta.appendChild(inputMeta);

      colInputs.appendChild(rowReal);
      colInputs.appendChild(rowMeta);

      // Columna 3: Materiales en pila vertical
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

// Modal: Añadir Tropas / Barcos
function openAddTroopsModal(categoryKey = "units") {
  const city = troopsData.activeTroopCity;
  if (!city) return;

  const modal = document.getElementById('modal-add-troops');
  const title = document.getElementById('modal-add-troops-title');
  const container = document.getElementById('add-troops-catalog-list');
  container.innerHTML = '';

  const isUnits = categoryKey === "units";
  title.textContent = isUnits ? "Añadir Tropas Terrestres" : "Añadir Barcos de Guerra";

  const list = TROOP_DEFINITIONS[categoryKey] || [];
  if (!troopsData.cities[city]) troopsData.cities[city] = { units: {}, ships: {} };
  if (!troopsData.cities[city][categoryKey]) troopsData.cities[city][categoryKey] = {};
  const cityMap = troopsData.cities[city][categoryKey];

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
    renderTroopsContent();
    renderSummary();
    modal.classList.add('hidden');
  };

  modal.classList.remove('hidden');
}

// Modal: Actualizar Tropas / Barcos
function openUpdateTroopsModal(categoryKey = "units") {
  const city = troopsData.activeTroopCity;
  if (!city) return;

  const modal = document.getElementById('modal-update-troops');
  const title = document.getElementById('modal-update-troops-title');
  const container = document.getElementById('update-troops-active-list');
  container.innerHTML = '';

  const isUnits = categoryKey === "units";
  const catName = isUnits ? "Tropas" : "Barcos";
  title.textContent = `Actualizar ${catName} en ${cityLabels[city]?.name || city}`;

  const list = TROOP_DEFINITIONS[categoryKey] || [];
  const cityMap = troopsData.cities[city]?.[categoryKey] || {};

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
    renderTroopsContent();
    renderSummary();
    modal.classList.add('hidden');
  };

  modal.classList.remove('hidden');
}

// Modal: Confirmar eliminación de ciudad
function openDeleteConfirmModal(cityId, cityName) {
  cityToDelete = cityId;
  const modal = document.getElementById('modal-confirm-delete');
  const text = document.getElementById('delete-confirm-text');
  text.textContent = `¿Eliminar "${cityName}"?`;
  modal.classList.remove('hidden');
}

// ========================================================
// VISTA: CONFIGURACIÓN (GESTIÓN Y ARRASTRE DE CIUDADES)
// ========================================================
function populateCityRenameList() {
  const container = document.getElementById('city-rename-list');
  container.innerHTML = '';

  let draggedCityIndex = null;

  cities.forEach((city, idx) => {
    const item = document.createElement('div');
    item.className = 'city-rename-item';
    item.draggable = true;
    item.dataset.index = idx;

    const label = cityLabels[city] || {};
    const existingName = label.name || '';
    const existingAbbr = label.abbr || '';

    item.innerHTML = `
      <span class="city-drag-handle" title="Arrastra para reordenar">☰</span>
      <span class="city-rename-index">${idx + 1}</span>
      <input type="text" class="city-rename-input name-input" placeholder="Nombre..." maxlength="30" value="${existingName}">
      <input type="text" class="city-rename-input abbr-input" placeholder="Abrev" maxlength="6" value="${existingAbbr}">
      <button class="city-delete-btn" title="Eliminar ciudad">🗑️</button>
    `;

    const nameInput = item.querySelector('.name-input');
    const abbrInput = item.querySelector('.abbr-input');

    const updateLabel = () => {
      const nVal = nameInput.value.trim();
      const aVal = abbrInput.value.trim();
      if (nVal || aVal) {
        cityLabels[city] = { name: nVal, abbr: aVal };
      } else {
        delete cityLabels[city];
      }
    };
    nameInput.addEventListener('input', updateLabel);
    abbrInput.addEventListener('input', updateLabel);

    item.querySelector('.city-delete-btn').onclick = () => {
      openDeleteConfirmModal(city, existingName || city);
    };

    // Drag and drop para reordenar ciudades
    item.addEventListener('dragstart', (e) => {
      draggedCityIndex = idx;
      item.classList.add('is-dragging');
      e.dataTransfer.setData('text/plain', idx);
    });

    item.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    item.addEventListener('drop', (e) => {
      e.preventDefault();
      const targetIndex = idx;
      if (draggedCityIndex !== null && draggedCityIndex !== targetIndex) {
        const movedCity = cities.splice(draggedCityIndex, 1)[0];
        cities.splice(targetIndex, 0, movedCity);
        saveCitiesList();
        saveData();
        populateCityRenameList();
        renderTabs();
        renderMetaSummary();
        renderContent();
        renderTroopCityTabs();
        renderTroopsContent();
        renderSummary();
      }
    });

    item.addEventListener('dragend', () => {
      item.classList.remove('is-dragging');
    });

    container.appendChild(item);
  });
}

function setupSettingsHandlers() {
  const btnExport = document.getElementById('btn-export');
  const btnImport = document.getElementById('btn-import');
  const txtBackup = document.getElementById('txt-backup');
  const backupStatus = document.getElementById('backup-status');

  // Añadir nueva ciudad
  document.getElementById('btn-add-new-city').onclick = () => {
    const newNum = cities.length + 1;
    const newCityId = "city_" + Date.now();
    cities.push(newCityId);

    appData[newCityId] = {};
    buildingsConfig.forEach(b => {
      appData[newCityId][b.name] = b.isMulti ? b.instances.map(() => 0) : 0;
    });

    cityLabels[newCityId] = {
      name: "Ciudad " + newNum,
      abbr: "C" + newNum
    };

    saveCitiesList();
    saveCityLabels();
    saveData();

    populateCityRenameList();
    renderTabs();
    renderMetaSummary();
    renderContent();
    renderTroopCityTabs();
    renderTroopsContent();
    renderSummary();
  };

  // Guardar nombres explícitamente
  document.getElementById('btn-save-cities').onclick = () => {
    saveCityLabels();
    renderContent();
    renderTroopCityTabs();
    renderTroopsContent();
    renderSummary();
    showBackupStatus("¡Ciudades guardadas con éxito!", true);
  };

  // Modal eliminar ciudad
  document.getElementById('btn-confirm-delete').onclick = () => {
    if (cityToDelete) {
      cities = cities.filter(c => c !== cityToDelete);
      delete appData[cityToDelete];
      delete cityLabels[cityToDelete];
      if (troopsData.cities) delete troopsData.cities[cityToDelete];
      if (troopsData.activeTroopCity === cityToDelete) {
        troopsData.activeTroopCity = cities[0] || null;
      }
      saveCitiesList();
      saveCityLabels();
      saveData();
      saveTroopsData();

      populateCityRenameList();
      renderTabs();
      renderMetaSummary();
      renderContent();
      renderTroopCityTabs();
      renderTroopsContent();
      renderSummary();

      cityToDelete = null;
      document.getElementById('modal-confirm-delete').classList.add('hidden');
    }
  };

  document.getElementById('btn-cancel-delete').onclick = () => {
    cityToDelete = null;
    document.getElementById('modal-confirm-delete').classList.add('hidden');
  };
  document.getElementById('btn-close-delete-modal').onclick = () => {
    cityToDelete = null;
    document.getElementById('modal-confirm-delete').classList.add('hidden');
  };
  
  // Backup Export/Import
  btnExport.onclick = () => {
    const dataToExport = {
      ikariamLevels: appData,
      ikariamBuildings: buildingsConfig,
      ikariamCityLabels: cityLabels,
      ikariamCitiesList: cities,
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
      if (parsed.ikariamCitiesList && Array.isArray(parsed.ikariamCitiesList)) {
        cities = parsed.ikariamCitiesList;
      }
      cityLabels = parsed.ikariamCityLabels || {};
      if (parsed.ikariamTroops) {
        troopsData = parsed.ikariamTroops;
      }
      
      saveData();
      saveCitiesList();
      saveCityLabels();
      saveTroopsData();
      
      loadData(() => {
        renderTabs();
        renderMetaSummary();
        renderContent();
        renderTroopCityTabs();
        renderTroopsContent();
        renderSummary();
        populateCityRenameList();
        showBackupStatus("¡Datos importados con éxito!", true);
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

// Configurar navegación superior de 4 pestañas
function setupNavigation() {
  const navSummary = document.getElementById('nav-btn-summary');
  const navConstruction = document.getElementById('nav-btn-construction');
  const navTroops = document.getElementById('nav-btn-troops');
  const navSettings = document.getElementById('nav-btn-settings');

  const viewSummary = document.getElementById('view-summary');
  const viewConstruction = document.getElementById('view-construction');
  const viewTroops = document.getElementById('view-troops');
  const viewSettings = document.getElementById('view-settings');
  const btnEdit = document.getElementById('btn-edit');

  const switchView = (targetView) => {
    currentView = targetView;
    [navSummary, navConstruction, navTroops, navSettings].forEach(b => b.classList.remove('active'));
    [viewSummary, viewConstruction, viewTroops, viewSettings].forEach(v => v.classList.add('hidden'));

    btnEdit.style.display = (targetView === 'construction') ? 'flex' : 'none';

    if (targetView === 'summary') {
      navSummary.classList.add('active');
      viewSummary.classList.remove('hidden');
      renderSummary();
    } else if (targetView === 'construction') {
      navConstruction.classList.add('active');
      viewConstruction.classList.remove('hidden');
      renderTabs();
      renderMetaSummary();
      renderContent();
    } else if (targetView === 'troops') {
      navTroops.classList.add('active');
      viewTroops.classList.remove('hidden');
      renderTroopCityTabs();
      renderTroopsContent();
    } else if (targetView === 'settings') {
      navSettings.classList.add('active');
      viewSettings.classList.remove('hidden');
      populateCityRenameList();
    }
  };

  navSummary.onclick = () => switchView('summary');
  navConstruction.onclick = () => switchView('construction');
  navTroops.onclick = () => switchView('troops');
  navSettings.onclick = () => switchView('settings');

  // Modales
  document.getElementById('btn-close-add-troops-modal').onclick = () => {
    document.getElementById('modal-add-troops').classList.add('hidden');
  };
  document.getElementById('btn-close-update-troops-modal').onclick = () => {
    document.getElementById('modal-update-troops').classList.add('hidden');
  };
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
    setupNavigation();
    setupEditButton();
    setupReorderBuildingsButton();
    setupSettingsHandlers();
    renderTabs();
    renderMetaSummary();
    renderContent();
  });
});
