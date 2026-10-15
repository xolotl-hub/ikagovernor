const cities = [
  "Tenochtitlan-m1", "Tenochtitlan-m2", "Tenochtitlan-a1", "Tenochtitlan-v1", 
  "Tenochtitlan-c1", "Tenochtitlan-m3", "Tenochtitlan-m4", "Tenochtitlan-a2", 
  "Tenochtitlan-v2", "Tenochtitlan-c2", "Tenochtitlan-c3", "Tenochtitlan-c4", 
  "Tenochtitlan-v3"
];

const DEFAULT_BUILDINGS = [
  { name: "Intendencia", meta1: 18, meta2: 28, meta3: 36, meta4: 42, meta5: 47, meta6: 49 },
  { 
    name: "Depósitos", 
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

let buildingsConfig = JSON.parse(JSON.stringify(DEFAULT_BUILDINGS));

let appData = {};
let cityLabels = {};
let activeCityCount = 13;
let currentBuilding = null;
let isEditing = false;

// Iniciar con la estructura por defecto si no hay datos guardados
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
  chrome.storage.local.get(['ikariamLevels', 'ikariamBuildings', 'ikariamCityLabels', 'ikariamCityCount'], (result) => {
    let updated = false;

    activeCityCount = (result.ikariamCityCount && result.ikariamCityCount >= 1)
      ? Math.min(result.ikariamCityCount, cities.length)
      : cities.length;

    if (result.ikariamCityLabels) {
      cityLabels = result.ikariamCityLabels;
      // Si hay entradas en formato antiguo (string), limpiarlas
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
      // Reemplazar la configuración por defecto por la configuración guardada del usuario
      const loadedBuildings = [];
      result.ikariamBuildings.forEach(b => {
        if (b.name) {
          b.name = b.name.normalize('NFC');
        }
        loadedBuildings.push(b);
      });

      // Sincronizar con DEFAULT_BUILDINGS para asegurar que ningún edificio nuevo falte
      const syncedBuildings = [];
      DEFAULT_BUILDINGS.forEach(defB => {
        const found = loadedBuildings.find(b => b.name === defB.name);
        if (found) {
          if (defB.isMulti) {
            found.isMulti = true;
            found.instances = defB.instances;
          }
          syncedBuildings.push(found);
        } else {
          syncedBuildings.push({ ...defB });
          updated = true;
        }
      });

      // Detectar si el orden cambió con respecto a los cargados para forzar el guardado
      const orderChanged = loadedBuildings.length !== syncedBuildings.length ||
                           loadedBuildings.some((b, idx) => b.name !== syncedBuildings[idx].name);
      if (orderChanged) {
        updated = true;
      }

      buildingsConfig = syncedBuildings;
    }
    
    // Inicializar el edificio activo actual
    currentBuilding = buildingsConfig[0];
    
    if (result.ikariamLevels) {
      appData = result.ikariamLevels;
      // Normalizar claves de niveles a NFC y migrar "Almacén"/"Depósito" a la ficha unificada "Depósitos"
      cities.forEach(city => {
        if (appData[city]) {
          // Primero normalizar todas las claves existentes a NFC
          Object.keys(appData[city]).forEach(key => {
            const normalizedKey = key.normalize('NFC');
            if (normalizedKey !== key) {
              appData[city][normalizedKey] = appData[city][key];
              delete appData[city][key];
              updated = true;
            }
          });

          // Migrar antiguos Deposito 1 y Deposito 2 / Depósito 1 y Depósito 2 a la ficha única "Depósitos"
          const oldDep1 = appData[city]["Deposito 1"] !== undefined ? appData[city]["Deposito 1"] : appData[city]["Depósito 1"];
          const oldDep2 = appData[city]["Deposito 2"] !== undefined ? appData[city]["Deposito 2"] : appData[city]["Depósito 2"];
          
          if (oldDep1 !== undefined || oldDep2 !== undefined) {
            const currentDeps = appData[city]["Depósitos"];
            const isUninitialized = !currentDeps || (Array.isArray(currentDeps) && currentDeps.every(v => v === 0));
            if (isUninitialized) {
              appData[city]["Depósitos"] = [
                typeof oldDep1 === 'number' ? oldDep1 : (Array.isArray(oldDep1) ? (oldDep1[0] || 0) : 0),
                typeof oldDep2 === 'number' ? oldDep2 : (Array.isArray(oldDep2) ? (oldDep2[0] || 0) : 0)
              ];
              updated = true;
            }
          }

          // También migrar claves muy viejas como "Almacén", "Depósito", "Deposito"
          const migrateOldUninstanced = (oldName) => {
            if (appData[city][oldName] !== undefined) {
              const val = appData[city][oldName];
              const levelVal = Array.isArray(val) ? (val[0] || 0) : (typeof val === 'number' ? val : 0);
              if (levelVal > 0) {
                if (!appData[city]["Depósitos"]) {
                  appData[city]["Depósitos"] = [levelVal, 0];
                  updated = true;
                } else if (Array.isArray(appData[city]["Depósitos"]) && appData[city]["Depósitos"][0] === 0) {
                  appData[city]["Depósitos"][0] = levelVal;
                  updated = true;
                }
              }
            }
          };
          migrateOldUninstanced("Almacén");
          migrateOldUninstanced("Depósito");
          migrateOldUninstanced("Deposito");

          // Eliminar claves viejas que ya no estén en la configuración
          const obsoleteKeys = ["Deposito 1", "Deposito 2", "Depósito 1", "Depósito 2", "Almacén", "Depósito", "Deposito"];
          obsoleteKeys.forEach(oldName => {
            if (appData[city][oldName] !== undefined && !buildingsConfig.some(b => b.name === oldName)) {
              delete appData[city][oldName];
              updated = true;
            }
          });
        }
      });

      // Asegurarse de que cualquier ciudad/edificio faltante se corrija
      cities.forEach(city => {
        if (!appData[city]) {
          appData[city] = {};
          updated = true;
        }
        buildingsConfig.forEach(b => {
          if (appData[city][b.name] === undefined) {
            appData[city][b.name] = b.isMulti ? b.instances.map(() => 0) : 0;
            updated = true;
          } else if (b.isMulti && !Array.isArray(appData[city][b.name])) {
            const val = appData[city][b.name];
            appData[city][b.name] = b.instances.map((_, idx) => (idx === 0 ? val : 0));
            updated = true;
          } else if (!b.isMulti && Array.isArray(appData[city][b.name])) {
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
    callback();
  });
}

function saveData() {
  chrome.storage.local.set({ 
    ikariamLevels: appData,
    ikariamBuildings: buildingsConfig
  });
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
      // Bloquear cambio de pestaña durante la edición para evitar pérdida de datos contextuales
      if (isEditing) return;
      
      if (currentBuilding.name !== b.name) {
        currentBuilding = b;
        renderTabs();
        renderMetaSummary();
        renderContent();
      }
    };
    
    tabsContainer.appendChild(tab);
    
    // Evitar scrollIntoView en los primeros elementos (índices 0 y 1) para evitar que comience desplazado,
    // y en los últimos ("Muralla" y "Museo") para evitar rebotes molestos
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
      const val = appData[city][currentBuilding.name];
      if (Array.isArray(val)) {
        return val.every(level => level >= targetValue);
      }
      const level = val || 0;
      return level >= targetValue;
    });
    if (!allMeetTarget) {
      return i;
    }
  }
  return metaKeys.length - 1; // Destaque de la última meta si todo se cumplió
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
      // Renderizar input de checkpoint en modo de edición
      const input = document.createElement('input');
      input.type = 'number';
      input.className = 'meta-input';
      input.min = '0';
      input.value = meta.value;
      input.setAttribute('data-meta-key', meta.key);
      item.appendChild(input);
    } else {
      // Renderizar texto estático en modo de visualización
      const text = document.createTextNode(` ${meta.value}`);
      item.appendChild(text);
    }
    
    summaryContainer.appendChild(item);
  });
}

function renderContent() {
  const content = document.getElementById('content');
  content.innerHTML = '';
  
  // Clonar para forzar reiniciar la animación de "slide por la derecha"
  const newContent = content.cloneNode(false);
  
  const maxGoal = currentBuilding.meta6 || 1;
  
  cities.slice(0, activeCityCount).forEach((city, cityIdx) => {
    const row = document.createElement('div');
    const label = cityLabels[city];
    const shortCode = (label && label.abbr) ? label.abbr : '';
    
    if (currentBuilding.isMulti) {
      row.className = 'city-row multi-instance';
      
      const nameContainer = document.createElement('div');
      nameContainer.className = 'city-name-container';
      
      const nameSpan = document.createElement('span');
      nameSpan.className = 'city-name';
      nameSpan.textContent = shortCode;
      nameSpan.title = (label && label.name) ? label.name : city;
      nameContainer.appendChild(nameSpan);
      row.appendChild(nameContainer);
      
      const instancesList = document.createElement('div');
      instancesList.className = 'city-instances-list';
      
      currentBuilding.instances.forEach((instName, instIdx) => {
        const instRow = document.createElement('div');
        instRow.className = 'city-instance-row';
        
        const instLabel = document.createElement('span');
        instLabel.className = 'instance-label';
        instLabel.textContent = instName.includes('1') ? 'D1' : instName.includes('2') ? 'D2' : instName;
        instRow.appendChild(instLabel);
        
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';
        
        const progressFill = document.createElement('div');
        const levels = appData[city][currentBuilding.name] || [];
        const level = levels[instIdx] || 0;
        const lvlClass = getLevelClass(level, currentBuilding);
        progressFill.className = `progress-fill ${lvlClass}`;
        
        const percentage = Math.min(100, (level / maxGoal) * 100);
        progressFill.style.width = `${percentage}%`;
        progressContainer.appendChild(progressFill);
        instRow.appendChild(progressContainer);
        
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
          
          const updateUI = (newLevel) => {
            const currentLevels = appData[city][currentBuilding.name] || [];
            currentLevels[instIdx] = newLevel;
            appData[city][currentBuilding.name] = currentLevels;
            badge.textContent = newLevel;
            
            const newLvlClass = getLevelClass(newLevel, currentBuilding);
            badge.className = `level-badge ${newLvlClass}`;
            
            progressFill.className = `progress-fill ${newLvlClass}`;
            const pct = Math.min(100, (newLevel / maxGoal) * 100);
            progressFill.style.width = `${pct}%`;
            
            saveData();
            renderMetaSummary();
          };
          
          minusBtn.onclick = () => {
            const currentLevels = appData[city][currentBuilding.name] || [];
            let currentLvl = currentLevels[instIdx] || 0;
            if (currentLvl > 0) updateUI(currentLvl - 1);
          };
          
          plusBtn.onclick = () => {
            const currentLevels = appData[city][currentBuilding.name] || [];
            let currentLvl = currentLevels[instIdx] || 0;
            updateUI(currentLvl + 1);
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
      nameSpan.title = (label && label.name) ? label.name : city;
      
      const progressContainer = document.createElement('div');
      progressContainer.className = 'progress-container';
      
      const progressFill = document.createElement('div');
      const level = appData[city][currentBuilding.name] || 0;
      const lvlClass = getLevelClass(level, currentBuilding);
      progressFill.className = `progress-fill ${lvlClass}`;
      
      const percentage = Math.min(100, (level / maxGoal) * 100);
      progressFill.style.width = `${percentage}%`;
      
      progressContainer.appendChild(progressFill);
      cityInfo.appendChild(nameSpan);
      cityInfo.appendChild(progressContainer);
      
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

// Configuración del botón flotante de edición
function setupEditButton() {
  const btnEdit = document.getElementById('btn-edit');
  
  btnEdit.onclick = () => {
    if (!isEditing) {
      // Activar modo edición
      isEditing = true;
      btnEdit.textContent = '✔️';
      btnEdit.className = 'floating-btn edit-mode-on';
      btnEdit.title = 'Confirmar y guardar cambios';
      
      renderMetaSummary();
      renderContent();
    } else {
      // Guardar cambios y desactivar modo edición
      
      // 1. Guardar checkpoints del edificio activo
      const metaInputs = document.querySelectorAll('.meta-input');
      metaInputs.forEach(input => {
        const key = input.getAttribute('data-meta-key');
        const val = parseInt(input.value, 10);
        currentBuilding[key] = isNaN(val) ? 0 : Math.max(0, val);
      });
      
      // 2. Guardar niveles de las ciudades
      const levelInputs = document.querySelectorAll('.level-input');
      levelInputs.forEach(input => {
        const city = input.getAttribute('data-city');
        const val = parseInt(input.value, 10);
        const cleanVal = isNaN(val) ? 0 : Math.max(0, val);
        
        const instIdxAttr = input.getAttribute('data-inst-idx');
        if (instIdxAttr !== null) {
          const instIdx = parseInt(instIdxAttr, 10);
          if (!Array.isArray(appData[city][currentBuilding.name])) {
            appData[city][currentBuilding.name] = [];
          }
          appData[city][currentBuilding.name][instIdx] = cleanVal;
        } else {
          appData[city][currentBuilding.name] = cleanVal;
        }
      });
      
      // Desactivar modo edición
      isEditing = false;
      btnEdit.textContent = '✏️';
      btnEdit.className = 'floating-btn edit-mode-off';
      btnEdit.title = 'Editar niveles y checkpoints';
      
      // Persistir y renderizar
      saveData();
      renderMetaSummary();
      renderContent();
    }
  };
}

function saveCityLabels() {
  chrome.storage.local.set({ ikariamCityLabels: cityLabels });
}

function populateCityRenameList() {
  const container = document.getElementById('city-rename-list');
  container.innerHTML = '';
  
  cities.slice(0, activeCityCount).forEach((city, idx) => {
    const item = document.createElement('div');
    item.className = 'city-rename-item';
    
    // Número de ciudad
    const indexSpan = document.createElement('span');
    indexSpan.className = 'city-rename-index';
    indexSpan.textContent = idx + 1;
    indexSpan.title = city;
    
    // Campo: Nombre completo
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className = 'city-rename-input name-input';
    nameInput.maxLength = 30;
    nameInput.placeholder = 'Nombre...';
    const existingLabel = cityLabels[city];
    nameInput.value = (existingLabel && existingLabel.name) ? existingLabel.name : '';
    
    // Campo: Abreviatura
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
        cityLabels[city] = {
          name: nameVal,
          abbr: abbrVal
        };
      } else {
        delete cityLabels[city];
      }
      // Solo actualiza memoria, no guarda ni re-renderiza hasta presionar Guardar
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
    // Cargar valor actual en el input
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
      // Refrescar la lista de nombres para mostrar solo las activas
      populateCityRenameList();
      renderTabs();
      renderMetaSummary();
      renderContent();
    }
  };

  const applyAndClose = () => {
    saveCityLabels();
    renderContent();
    overlay.classList.add('hidden');
  };

  btnClose.onclick = applyAndClose;

  document.getElementById('btn-save-cities').onclick = applyAndClose;
  
  btnExport.onclick = () => {
    const dataToExport = {
      ikariamLevels: appData,
      ikariamBuildings: buildingsConfig,
      ikariamCityLabels: cityLabels
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
      
      saveData();
      saveCityLabels();
      
      loadData(() => {
        renderTabs();
        renderMetaSummary();
        renderContent();
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
  });
});
