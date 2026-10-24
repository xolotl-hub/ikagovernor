import { BUILDING_COSTS } from '../constants.js';
import { state } from '../state.js';

export function getBuildingUpgradeCost(buildingName, curLvl, city) {
  const cfg = BUILDING_COSTS[buildingName];
  if (!cfg) return null;
  const targetLvl = curLvl + 1;
  const rawWood = Math.floor(cfg.baseWood * Math.pow(cfg.factorWood, targetLvl - 1));
  let rawMarble = 0;
  if (targetLvl >= (cfg.marbleStartLvl || 1)) {
    const marbleExp = targetLvl - (cfg.marbleStartLvl || 1);
    rawMarble = Math.floor(cfg.baseMarble * Math.pow(cfg.factorMarble, marbleExp));
  }
  
  const carpLevel = Math.min(50, state.appData[city]?.["Carpintería"] || 0);
  const archLevel = Math.min(50, state.appData[city]?.["Oficina del Arquitecto"] || 0);
  
  const finalWood = Math.round(rawWood * (1 - carpLevel / 100));
  const finalMarble = Math.round(rawMarble * (1 - archLevel / 100));
  
  return {
    wood: finalWood,
    marble: finalMarble,
    woodDiscount: carpLevel,
    marbleDiscount: archLevel
  };
}

export function getUnitCostInCity(unit, city) {
  const carp = Math.min(50, state.appData[city]?.["Carpintería"] || 0);
  const winePress = Math.min(50, state.appData[city]?.["Prensa de Vino"] || 0);
  const optician = Math.min(50, state.appData[city]?.["Óptica"] || 0);
  const fireworks = Math.min(50, state.appData[city]?.["Área de Pruebas Pirotécnicas"] || 0);

  const wood = unit.wood ? Math.round(unit.wood * (1 - carp / 100)) : 0;
  const wine = unit.wine ? Math.round(unit.wine * (1 - winePress / 100)) : 0;
  const crystal = unit.crystal ? Math.round(unit.crystal * (1 - optician / 100)) : 0;
  const sulfur = unit.sulfur ? Math.round(unit.sulfur * (1 - fireworks / 100)) : 0;

  return { wood, wine, crystal, sulfur };
}

export function getLevelClass(level, config) {
  if (level >= config.meta6) return "lvl-meta6";
  if (level >= config.meta5) return "lvl-meta5";
  if (level >= config.meta4) return "lvl-meta4";
  if (level >= config.meta3) return "lvl-meta3";
  if (level >= config.meta2) return "lvl-meta2";
  if (level >= config.meta1) return "lvl-meta1";
  return "lvl-default";
}

export function getBuildingLowestAchievedClass(building) {
  if (!state.cities || state.cities.length === 0) return "lvl-default";
  const metaKeys = ["meta1", "meta2", "meta3", "meta4", "meta5", "meta6"];
  const classNames = ["lvl-meta1", "lvl-meta2", "lvl-meta3", "lvl-meta4", "lvl-meta5", "lvl-meta6"];
  
  let highestMet = -1;
  for (let i = 0; i < metaKeys.length; i++) {
    const targetValue = building[metaKeys[i]];
    if (!targetValue) continue;
    const allMeet = state.cities.every(city => {
      const val = state.appData[city]?.[building.name];
      if (building.isMulti && Array.isArray(val)) {
        if (val.length === 0) return false;
        return val.every(l => (l || 0) >= targetValue);
      }
      return (val || 0) >= targetValue;
    });
    if (allMeet) {
      highestMet = i;
    } else {
      break;
    }
  }
  return highestMet >= 0 ? classNames[highestMet] : "lvl-default";
}

export function getActiveTargetIndex(building = state.currentBuilding) {
  if (!building) return 0;
  const metaKeys = ["meta1", "meta2", "meta3", "meta4", "meta5", "meta6"];
  for (let i = 0; i < metaKeys.length; i++) {
    const target = building[metaKeys[i]];
    if (!target) continue;
    const allReach = state.cities.every(city => {
      const val = state.appData[city]?.[building.name];
      if (building.isMulti && Array.isArray(val)) {
        return val.every(l => (l || 0) >= target);
      }
      return (val || 0) >= target;
    });
    if (!allReach) return i;
  }
  return 5;
}
