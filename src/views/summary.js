import { TROOP_DEFINITIONS } from '../constants.js';
import { state, formatResNum, makeResChip } from '../state.js';
import { getBuildingUpgradeCost, getUnitCostInCity, getActiveTargetIndex } from './construction_calc.js';

export function renderSummary() {
  // 1. Próximas 6 Construcciones
  const bContainer = document.getElementById('summary-cards-container');
  if (!bContainer) return;
  bContainer.replaceChildren();

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
    const msg = document.createElement('div');
    msg.className = 'no-troops-msg';
    const p = document.createElement('p');
    p.textContent = '🎉 ¡Todas las ciudades han alcanzado las metas actuales en los edificios prioritarios!';
    msg.appendChild(p);
    bContainer.appendChild(msg);
  } else {
    candidateTasks.forEach((task, idx) => {
      const card = document.createElement('div');
      card.className = 'summary-card-item';
      const label = state.cityLabels[task.city];
      const cityCode = (label && label.abbr) ? label.abbr : task.city;
      const cityName = (label && label.name) ? label.name : task.city;
      const left = document.createElement('div');
      left.className = 'summary-card-left';
      const topRow = document.createElement('div');
      const badge = document.createElement('span');
      badge.className = 'summary-rank-badge';
      badge.textContent = `#${idx + 1}`;
      const bName = document.createElement('span');
      bName.className = 'summary-b-name';
      bName.textContent = task.buildingName;
      topRow.appendChild(badge);
      topRow.appendChild(bName);
      const cityDiv = document.createElement('div');
      cityDiv.className = 'summary-city-name';
      cityDiv.textContent = `${cityCode} (${cityName})`;
      left.appendChild(topRow);
      left.appendChild(cityDiv);
      const right = document.createElement('div');
      right.className = 'summary-card-right';
      const lvlDiv = document.createElement('div');
      lvlDiv.className = 'summary-levels';
      lvlDiv.textContent = `Nivel ${task.currentLevel} ➤ ${task.targetLevel}`;
      right.appendChild(lvlDiv);
      if (task.cost) {
        const costTag = document.createElement('div');
        costTag.className = 'building-cost-tag';
        costTag.appendChild(makeResChip('assets/resources/wood.png', 'Madera', task.cost.wood, task.cost.woodDiscount > 0 ? 'discounted' : ''));
        if (task.cost.marble > 0) {
          costTag.appendChild(makeResChip('assets/resources/marble.png', 'Mármol', task.cost.marble, task.cost.marbleDiscount > 0 ? 'discounted' : ''));
        }
        right.appendChild(costTag);
      }
      card.appendChild(left);
      card.appendChild(right);
      bContainer.appendChild(card);
    });
  }

  // 2. Top 6 Ciudades con más tropas faltantes
  const troopsContainer = document.getElementById('summary-troops-container');
  if (!troopsContainer) return;
  troopsContainer.replaceChildren();

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
    const msg = document.createElement('div');
    msg.className = 'no-troops-msg';
    const p = document.createElement('p');
    p.textContent = '🎉 ¡Todas las ciudades tienen sus metas de tropas y barcos al 100%!';
    msg.appendChild(p);
    troopsContainer.appendChild(msg);
  } else {
    top6.forEach((item, idx) => {
      const card = document.createElement('div');
      card.className = 'summary-card-item';
      const label = state.cityLabels[item.city];
      const cityCode = (label && label.abbr) ? label.abbr : item.city;
      const cityName = (label && label.name) ? label.name : item.city;
      const left = document.createElement('div');
      left.className = 'summary-card-left';
      const topRow = document.createElement('div');
      const badge = document.createElement('span');
      badge.className = 'summary-rank-badge';
      badge.textContent = `#${idx + 1}`;
      const bName = document.createElement('span');
      bName.className = 'summary-b-name';
      bName.textContent = `${cityCode} (${cityName})`;
      topRow.appendChild(badge);
      topRow.appendChild(bName);
      const defDiv = document.createElement('div');
      defDiv.className = 'summary-troop-deficit';
      defDiv.textContent = `Faltan ${item.totalDeficit.toLocaleString()} unidades`;
      left.appendChild(topRow);
      left.appendChild(defDiv);
      const right = document.createElement('div');
      right.className = 'summary-card-right';
      const costTag = document.createElement('div');
      costTag.className = 'building-cost-tag';
      if (item.wood > 0)    costTag.appendChild(makeResChip('assets/resources/wood.png',   'Madera', item.wood));
      if (item.sulfur > 0)  costTag.appendChild(makeResChip('assets/resources/sulfur.png', 'Azufre', item.sulfur));
      if (item.crystal > 0) costTag.appendChild(makeResChip('assets/resources/glass.png',  'Cristal', item.crystal));
      if (item.wine > 0)    costTag.appendChild(makeResChip('assets/resources/wine.png',   'Vino', item.wine));
      right.appendChild(costTag);
      card.appendChild(left);
      card.appendChild(right);
      troopsContainer.appendChild(card);
    });
  }
}
