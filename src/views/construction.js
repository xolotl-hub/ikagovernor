import { state, formatResNum, makeResChip } from '../state.js';
import { saveData } from '../storage.js';
import { getBuildingUpgradeCost, getLevelClass, getBuildingLowestAchievedClass, getActiveTargetIndex } from './construction_calc.js';

let onSummaryRefresh = null;
export function setOnSummaryRefresh(fn) {
  onSummaryRefresh = fn;
}

export function renderTabs() {
  const tabsContainer = document.getElementById('tabs');
  if (!tabsContainer || !state.currentBuilding) return;
  tabsContainer.replaceChildren();
  
  let draggedBuildingIndex = null;
  const metaLabels = ["Madera (Meta 1)", "Cobre (Meta 2)", "Verde (Meta 3)", "Azul (Meta 4)", "Dorado (Meta 5)", "Platino (Meta 6)"];
  const classNames = ["lvl-meta1", "lvl-meta2", "lvl-meta3", "lvl-meta4", "lvl-meta5", "lvl-meta6"];

  state.buildingsConfig.forEach((b, idx) => {
    const tab = document.createElement('div');
    const isActive = b.name === state.currentBuilding.name;
    const lowestClass = getBuildingLowestAchievedClass(b);
    tab.className = `tab ${isActive ? 'active' : ''} tab-${lowestClass}`;

    const labelSpan = document.createElement('span');
    labelSpan.className = 'tab-label';
    labelSpan.textContent = b.name;
    tab.appendChild(labelSpan);

    const stripe = document.createElement('div');
    stripe.className = `tab-checkpoint-stripe ${lowestClass}`;
    tab.appendChild(stripe);

    const lowestIdx = classNames.indexOf(lowestClass);
    const statusText = lowestIdx >= 0 ? `Completado: ${metaLabels[lowestIdx]}` : 'Sin meta completada';
    tab.title = state.isReorderingBuildings ? `Arrastra para mover: ${b.name}` : `${b.name} (${statusText})`;

    if (state.isReorderingBuildings) {
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
          const moved = state.buildingsConfig.splice(draggedBuildingIndex, 1)[0];
          state.buildingsConfig.splice(targetIndex, 0, moved);
          saveData();
          renderTabs();
          if (onSummaryRefresh) onSummaryRefresh();
        }
      });
      tab.addEventListener('dragend', () => {
        tab.classList.remove('is-dragging');
      });
    } else {
      tab.onclick = () => {
        if (state.isEditing) return;
        if (state.currentBuilding.name !== b.name) {
          state.currentBuilding = b;
          renderTabs();
          renderMetaSummary();
          renderContent();
        }
      };
    }
    
    tabsContainer.appendChild(tab);
    
    if (!state.isReorderingBuildings && isActive && idx > 1 && b.name !== "Muralla" && b.name !== "Museo") {
      setTimeout(() => {
        tab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }, 50);
    }
  });
}

export function renderMetaSummary() {
  const summaryContainer = document.getElementById('meta-summary');
  if (!summaryContainer || !state.currentBuilding) return;
  summaryContainer.replaceChildren();
  
  const activeTargetIndex = getActiveTargetIndex();
  
  const metas = [
    { label: "Madera", value: state.currentBuilding.meta1, key: "meta1", class: "dot-wood" },
    { label: "Cobre", value: state.currentBuilding.meta2, key: "meta2", class: "dot-copper" },
    { label: "Verde", value: state.currentBuilding.meta3, key: "meta3", class: "dot-green" },
    { label: "Azul", value: state.currentBuilding.meta4, key: "meta4", class: "dot-blue" },
    { label: "Dorado", value: state.currentBuilding.meta5, key: "meta5", class: "dot-gold" },
    { label: "Platino", value: state.currentBuilding.meta6, key: "meta6", class: "dot-platinum" }
  ];
  
  metas.forEach((meta, index) => {
    const item = document.createElement('span');
    item.className = 'meta-item';
    if (index === activeTargetIndex && !state.isEditing) {
      item.classList.add('target-highlight');
    }
    item.title = `Meta: ${meta.label}`;
    
    const dot = document.createElement('span');
    dot.className = `dot ${meta.class}`;
    item.appendChild(dot);
    
    if (state.isEditing) {
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

export function syncEditInputsToData() {
  if (!state.currentBuilding) return;
  const metaInputs = document.querySelectorAll('.meta-input');
  metaInputs.forEach(input => {
    const key = input.getAttribute('data-meta-key');
    const val = parseInt(input.value, 10);
    state.currentBuilding[key] = isNaN(val) ? 0 : Math.max(0, val);
  });
  
  const levelInputs = document.querySelectorAll('.level-input');
  const newMultiLevels = {};
  levelInputs.forEach(input => {
    const city = input.getAttribute('data-city');
    const val = parseInt(input.value, 10);
    const cleanVal = isNaN(val) ? 0 : Math.max(0, val);
    const instIdxAttr = input.getAttribute('data-inst-idx');

    if (instIdxAttr !== null) {
      const instIdx = parseInt(instIdxAttr, 10);
      if (!newMultiLevels[city]) newMultiLevels[city] = [];
      newMultiLevels[city][instIdx] = cleanVal;
    } else {
      state.appData[city][state.currentBuilding.name] = cleanVal;
    }
  });

  for (const city in newMultiLevels) {
    state.appData[city][state.currentBuilding.name] = newMultiLevels[city];
  }
}

export function renderContent() {
  const content = document.getElementById('content');
  if (!content || !state.currentBuilding) return;
  content.replaceChildren();
  
  const newContent = content.cloneNode(false);
  const maxGoal = state.currentBuilding.meta6 || 1;
  
  state.cities.forEach((city) => {
    const row = document.createElement('div');
    const label = state.cityLabels[city];
    const shortCode = (label && label.abbr) ? label.abbr : city;
    const fullName = (label && label.name) ? label.name : city;

    if (state.currentBuilding.isMulti) {
      row.className = 'city-row multi-instance';

      const nameContainer = document.createElement('div');
      nameContainer.className = 'city-name-container';
      const nameSpan = document.createElement('span');
      nameSpan.className = 'city-name';
      nameSpan.textContent = shortCode;
      nameSpan.title = fullName;
      nameContainer.appendChild(nameSpan);

      if (state.isEditing && (state.currentBuilding.name === "Depósito" || state.currentBuilding.name === "Almacén")) {
        const addInstBtn = document.createElement('button');
        addInstBtn.type = 'button';
        addInstBtn.className = 'btn-add-inst';
        addInstBtn.textContent = '+';
        addInstBtn.title = 'Añadir otro edificio a esta ciudad';
        addInstBtn.onclick = () => {
          syncEditInputsToData();
          let arr = state.appData[city][state.currentBuilding.name];
          if (!Array.isArray(arr)) arr = [arr || 0];
          arr.push(0);
          state.appData[city][state.currentBuilding.name] = arr;
          renderContent();
        };
        nameContainer.appendChild(addInstBtn);
      }

      row.appendChild(nameContainer);

      const instancesList = document.createElement('div');
      instancesList.className = 'city-instances-list';

      const rawLevels = state.appData[city]?.[state.currentBuilding.name];
      let levels = Array.isArray(rawLevels) ? [...rawLevels] : [rawLevels || 0];
      if (levels.length === 0) levels = [0];

      const prefix = state.currentBuilding.instPrefix || (state.currentBuilding.name === 'Almacén' ? 'A' : 'D');

      levels.forEach((level, instIdx) => {
        const instRow = document.createElement('div');
        instRow.className = 'city-instance-row';

        const instLabel = document.createElement('span');
        instLabel.className = 'instance-label';
        instLabel.textContent = `${prefix}${instIdx + 1}`;
        instRow.appendChild(instLabel);

        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';
        
        const progressFill = document.createElement('div');
        const lvlClass = getLevelClass(level, state.currentBuilding);
        progressFill.className = `progress-fill ${lvlClass}`;
        const pct = Math.min(100, (level / maxGoal) * 100);
        progressFill.style.width = `${pct}%`;
        progressContainer.appendChild(progressFill);
        instRow.appendChild(progressContainer);

        const cost = getBuildingUpgradeCost(state.currentBuilding.name, level, city);
        let costEl = null;
        if (cost) {
          costEl = document.createElement('div');
          costEl.className = 'building-cost-tag';
          costEl.appendChild(makeResChip('assets/resources/wood.png', 'Madera', cost.wood, cost.woodDiscount > 0 ? 'discounted' : ''));
          if (cost.marble > 0) {
            costEl.appendChild(makeResChip('assets/resources/marble.png', 'Mármol', cost.marble, cost.marbleDiscount > 0 ? 'discounted' : ''));
          }
          instRow.appendChild(costEl);
        }

        const controls = document.createElement('div');
        controls.className = 'controls';

        if (state.isEditing) {
          const input = document.createElement('input');
          input.type = 'number';
          input.className = 'level-input';
          input.min = '0';
          input.value = level;
          input.setAttribute('data-city', city);
          input.setAttribute('data-inst-idx', instIdx);
          controls.appendChild(input);

          if (levels.length > 1 && (state.currentBuilding.name === "Depósito" || state.currentBuilding.name === "Almacén")) {
            const delBtn = document.createElement('button');
            delBtn.type = 'button';
            delBtn.className = 'btn-del-inst';
            delBtn.textContent = '✕';
            delBtn.title = 'Eliminar este edificio';
            delBtn.onclick = () => {
              syncEditInputsToData();
              let curArr = state.appData[city][state.currentBuilding.name];
              if (Array.isArray(curArr) && curArr.length > 1) {
                curArr.splice(instIdx, 1);
                state.appData[city][state.currentBuilding.name] = curArr;
                renderContent();
              }
            };
            controls.appendChild(delBtn);
          }
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
            state.appData[city][state.currentBuilding.name] = levels;
            badge.textContent = newLevel;
            const newLvlClass = getLevelClass(newLevel, state.currentBuilding);
            badge.className = `level-badge ${newLvlClass}`;
            progressFill.className = `progress-fill ${newLvlClass}`;
            progressFill.style.width = `${Math.min(100, (newLevel / maxGoal) * 100)}%`;
            saveData();
            renderMetaSummary();
            renderTabs();
            if (costEl) {
              const uCost = getBuildingUpgradeCost(state.currentBuilding.name, newLevel, city);
              if (uCost) {
                costEl.replaceChildren(
                  makeResChip('assets/resources/wood.png', 'Madera', uCost.wood, uCost.woodDiscount > 0 ? 'discounted' : '')
                );
                if (uCost.marble > 0) {
                  costEl.appendChild(makeResChip('assets/resources/marble.png', 'Mármol', uCost.marble, uCost.marbleDiscount > 0 ? 'discounted' : ''));
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
      const level = state.appData[city]?.[state.currentBuilding.name] || 0;
      const lvlClass = getLevelClass(level, state.currentBuilding);
      progressFill.className = `progress-fill ${lvlClass}`;
      
      const percentage = Math.min(100, (level / maxGoal) * 100);
      progressFill.style.width = `${percentage}%`;
      progressContainer.appendChild(progressFill);
      
      const cost = getBuildingUpgradeCost(state.currentBuilding.name, level, city);
      let costEl = null;
      if (cost) {
        costEl = document.createElement('div');
        costEl.className = 'building-cost-tag';
        costEl.appendChild(makeResChip('assets/resources/wood.png', 'Madera', cost.wood, cost.woodDiscount > 0 ? 'discounted' : ''));
        if (cost.marble > 0) {
          costEl.appendChild(makeResChip('assets/resources/marble.png', 'Mármol', cost.marble, cost.marbleDiscount > 0 ? 'discounted' : ''));
        }
      }
      
      cityInfo.appendChild(nameSpan);
      cityInfo.appendChild(progressContainer);
      if (costEl) cityInfo.appendChild(costEl);
      
      const controls = document.createElement('div');
      controls.className = 'controls';
      
      if (state.isEditing) {
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
          state.appData[city][state.currentBuilding.name] = newLevel;
          badge.textContent = newLevel;
          
          const newLvlClass = getLevelClass(newLevel, state.currentBuilding);
          badge.className = `level-badge ${newLvlClass}`;
          
          progressFill.className = `progress-fill ${newLvlClass}`;
          const pct = Math.min(100, (newLevel / maxGoal) * 100);
          progressFill.style.width = `${pct}%`;
          
          saveData();
          renderMetaSummary();
          renderTabs();
          if (costEl) {
            const updatedCost = getBuildingUpgradeCost(state.currentBuilding.name, newLevel, city);
            if (updatedCost) {
              costEl.replaceChildren(
                makeResChip('assets/resources/wood.png', 'Madera', updatedCost.wood, updatedCost.woodDiscount > 0 ? 'discounted' : '')
              );
              if (updatedCost.marble > 0) {
                costEl.appendChild(makeResChip('assets/resources/marble.png', 'Mármol', updatedCost.marble, updatedCost.marbleDiscount > 0 ? 'discounted' : ''));
              }
            }
          }
        };
        
        minusBtn.onclick = () => {
          let currentLvl = state.appData[city][state.currentBuilding.name] || 0;
          if (currentLvl > 0) updateUI(currentLvl - 1);
        };
        
        plusBtn.onclick = () => {
          let currentLvl = state.appData[city][state.currentBuilding.name] || 0;
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

export function setupEditButton() {
  const btnEdit = document.getElementById('btn-edit');
  if (!btnEdit) return;
  
  btnEdit.onclick = () => {
    if (!state.isEditing) {
      state.isEditing = true;
      btnEdit.textContent = '✔️';
      btnEdit.className = 'floating-btn edit-mode-on';
      btnEdit.title = 'Confirmar y guardar cambios';
      
      renderMetaSummary();
      renderContent();
    } else {
      syncEditInputsToData();
      
      state.isEditing = false;
      btnEdit.textContent = '✏️';
      btnEdit.className = 'floating-btn edit-mode-off';
      btnEdit.title = 'Editar niveles y checkpoints';
      
      saveData();
      renderMetaSummary();
      renderTabs();
      renderContent();
      if (onSummaryRefresh) onSummaryRefresh();
    }
  };
}

export function setupReorderBuildingsButton() {
  const btn = document.getElementById('btn-reorder-buildings');
  if (!btn) return;
  btn.onclick = () => {
    state.isReorderingBuildings = !state.isReorderingBuildings;
    if (state.isReorderingBuildings) {
      btn.textContent = '✔️';
      btn.classList.add('active');
      btn.title = 'Guardar y salir del modo reordenar';
    } else {
      btn.textContent = '↔️';
      btn.classList.remove('active');
      btn.title = 'Reordenar pestañas de edificios';
      saveData();
      if (onSummaryRefresh) onSummaryRefresh();
    }
    renderTabs();
  };
}
