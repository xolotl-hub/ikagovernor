import { TROOP_DEFINITIONS } from '../constants.js';
import { state, formatResNum } from '../state.js';
import { getBuildingUpgradeCost, getUnitCostInCity, getActiveTargetIndex } from './construction_calc.js';

export function renderSummary() {
  // 1. Próximas 6 Construcciones
  const bContainer = document.getElementById('summary-cards-container');
  if (!bContainer) return;
  bContainer.innerHTML = '';

  const metaKeys = ["meta1", "meta2", "meta3", "meta4", "meta5", "meta6"];
  const candidateTasks = [];
  const priorityBuildings = state.buildingsConfig.filter(b => b.name !== "Intendencia");

  for (const building of priorityBuildings) {
    const targetIdx = getActiveTargetIndex(building);
    const targetKey = metaKeys[targetIdx];
    const targetValue = building[targetKey];

    for (let cIdx = 0; cIdx < state.cities.length; cIdx++) {
      const city = state.cities[cIdx];
      const val = state.appData[city]?.[building.name];

      if (building.isMulti && Array.isArray(val)) {
        const pfx = building.instPrefix || (building.name === 'Almacén' ? 'A' : 'D');
        val.forEach((instLvl, instIdx) => {
          if (instLvl < targetValue) {
            candidateTasks.push({
              buildingName: `${building.name} (${pfx}${instIdx + 1})`,
              rawBuildingName: building.name,
              city, currentLevel: instLvl, targetLevel: targetValue,
              cost: getBuildingUpgradeCost(building.name, instLvl, city)
            });
          }
        });
      } else {
        const curLvl = val || 0;
        if (curLvl < targetValue) {
          candidateTasks.push({
            buildingName: building.name, rawBuildingName: building.name,
            city, currentLevel: curLvl, targetLevel: targetValue,
            cost: getBuildingUpgradeCost(building.name, curLvl, city)
          });
        }
      }
      if (candidateTasks.length >= 6) break;
    }
    if (candidateTasks.length >= 6) break;
  }

  if (candidateTasks.length === 0) {
    bContainer.innerHTML = `<div class="no-troops-msg"><p>🎉 ¡Todas las ciudades han alcanzado las metas actuales en los edificios prioritarios!</p></div>`;
  } else {
    candidateTasks.forEach((task, idx) => {
      const card = document.createElement('div');
      card.className = 'summary-card-item';
      const label = state.cityLabels[task.city];
      const cityCode = (label && label.abbr) ? label.abbr : task.city;
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
      right.innerHTML = `<div class="summary-levels">Nivel ${task.currentLevel} ➔ ${task.targetLevel}</div>${costHtml}`;
      card.appendChild(left);
      card.appendChild(right);
      bContainer.appendChild(card);
    });
  }

  // 2. Top 6 Ciudades con más tropas faltantes
  const troopsContainer = document.getElementById('summary-troops-container');
  if (!troopsContainer) return;
  troopsContainer.innerHTML = '';

  const troopDeficits = [];
  state.cities.forEach(city => {
    const cityTroops = state.troopsData.cities[city] || {};
    const unitsMap = cityTroops.units || {};
    const shipsMap = cityTroops.ships || {};
    let totalDeficit = 0, missingWood = 0, missingSulfur = 0, missingCrystal = 0, missingWine = 0;

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
      troopDeficits.push({ city, totalDeficit, wood: missingWood, sulfur: missingSulfur, crystal: missingCrystal, wine: missingWine });
    }
  });

  troopDeficits.sort((a, b) => b.totalDeficit - a.totalDeficit);
  const top6 = troopDeficits.slice(0, 6);

  if (top6.length === 0) {
    troopsContainer.innerHTML = `<div class="no-troops-msg"><p>🎉 ¡Todas las ciudades tienen sus metas de tropas y barcos al 100%!</p></div>`;
  } else {
    top6.forEach((item, idx) => {
      const card = document.createElement('div');
      card.className = 'summary-card-item';
      const label = state.cityLabels[item.city];
      const cityCode = (label && label.abbr) ? label.abbr : item.city;
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
          ${item.wood > 0 ? `<span class="res-chip" title="Madera: ${item.wood.toLocaleString()}"><img src="assets/resources/wood.png" alt="Madera"><span>${formatResNum(item.wood)}</span></span>` : ''}
          ${item.sulfur > 0 ? `<span class="res-chip" title="Azufre: ${item.sulfur.toLocaleString()}"><img src="assets/resources/sulfur.png" alt="Azufre"><span>${formatResNum(item.sulfur)}</span></span>` : ''}
          ${item.crystal > 0 ? `<span class="res-chip" title="Cristal: ${item.crystal.toLocaleString()}"><img src="assets/resources/glass.png" alt="Cristal"><span>${formatResNum(item.crystal)}</span></span>` : ''}
          ${item.wine > 0 ? `<span class="res-chip" title="Vino: ${item.wine.toLocaleString()}"><img src="assets/resources/wine.png" alt="Vino"><span>${formatResNum(item.wine)}</span></span>` : ''}
        </div>
      `;
      card.appendChild(left);
      card.appendChild(right);
      troopsContainer.appendChild(card);
    });
  }
}
