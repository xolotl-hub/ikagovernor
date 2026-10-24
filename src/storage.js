import { DEFAULT_CITIES, DEFAULT_BUILDINGS } from './constants.js';
import { state, getInitialData } from './state.js';

export function saveCurrentAccountBundle() {
  if (!state.currentAccount) return;
  const bundle = {
    levels: state.appData,
    buildings: state.buildingsConfig,
    cities: state.cities,
    cityLabels: state.cityLabels,
    troops: state.troopsData
  };
  chrome.storage.local.set({
    ['ikariam_acc_data_' + state.currentAccount.id]: bundle
  });
}

export function saveData() {
  saveCurrentAccountBundle();
}

export function saveCitiesList() {
  saveCurrentAccountBundle();
}

export function saveTroopsData() {
  saveCurrentAccountBundle();
}

export function saveCityLabels() {
  saveCurrentAccountBundle();
}

export function loadAccountData(accId, callback) {
  const dataKey = 'ikariam_acc_data_' + accId;
  chrome.storage.local.get([dataKey], (res) => {
    const bundle = res[dataKey] || {};
    let updated = false;

    // 1. Ciudades
    if (bundle.cities && Array.isArray(bundle.cities) && bundle.cities.length > 0) {
      state.cities = bundle.cities;
    } else {
      state.cities = [...DEFAULT_CITIES];
      updated = true;
    }

    // 2. City Labels
    state.cityLabels = bundle.cityLabels || {};

    // 3. Edificios
    if (bundle.buildings && Array.isArray(bundle.buildings) && bundle.buildings.length > 0) {
      const loadedBuildings = [];
      bundle.buildings.forEach(b => {
        if (b.name) b.name = b.name.normalize('NFC');
        loadedBuildings.push(b);
      });

      const syncedBuildings = [];
      loadedBuildings.forEach(b => {
        const defB = DEFAULT_BUILDINGS.find(d => d.name === b.name);
        if (defB) syncedBuildings.push({ ...defB, ...b });
      });

      DEFAULT_BUILDINGS.forEach(defB => {
        if (!syncedBuildings.some(b => b.name === defB.name)) {
          syncedBuildings.push({ ...defB });
          updated = true;
        }
      });
      state.buildingsConfig = syncedBuildings;
    } else {
      state.buildingsConfig = JSON.parse(JSON.stringify(DEFAULT_BUILDINGS));
      updated = true;
    }

    state.currentBuilding = state.buildingsConfig[0];

    // 4. Niveles
    if (bundle.levels) {
      state.appData = bundle.levels;
      state.cities.forEach(city => {
        if (!state.appData[city]) {
          state.appData[city] = {};
          updated = true;
        }

        // Migración Depósito legacy
        if (state.appData[city]["Deposito 1"] !== undefined || state.appData[city]["Deposito 2"] !== undefined) {
          const d1 = state.appData[city]["Deposito 1"] || 0;
          const d2 = state.appData[city]["Deposito 2"] || 0;
          if (!Array.isArray(state.appData[city]["Depósito"])) {
            state.appData[city]["Depósito"] = [d1, d2];
          }
          delete state.appData[city]["Deposito 1"];
          delete state.appData[city]["Deposito 2"];
          updated = true;
        }

        state.buildingsConfig.forEach(b => {
          if (state.appData[city][b.name] === undefined) {
            state.appData[city][b.name] = b.isMulti ? (b.name === "Depósito" ? [0, 0] : [0]) : 0;
            updated = true;
          } else if (b.isMulti && !Array.isArray(state.appData[city][b.name])) {
            state.appData[city][b.name] = [state.appData[city][b.name] || 0];
            updated = true;
          }
        });
      });
    } else {
      state.appData = getInitialData();
      updated = true;
    }

    // 5. Tropas
    if (bundle.troops) {
      state.troopsData = bundle.troops;
      if (!state.troopsData.cities) state.troopsData.cities = {};
      if (!state.troopsData.activeTroopCity || !state.cities.includes(state.troopsData.activeTroopCity)) {
        state.troopsData.activeTroopCity = state.cities[0] || null;
      }
    } else {
      state.troopsData = {
        activeTroopCity: state.cities[0] || null,
        cities: {}
      };
      updated = true;
    }

    if (updated) {
      saveCurrentAccountBundle();
    }

    if (callback) callback();
  });
}

export function findLegacyDataInStorage(allStorage) {
  if (!allStorage || typeof allStorage !== 'object') return null;

  if (allStorage.ikariamLevels && typeof allStorage.ikariamLevels === 'object' && Object.keys(allStorage.ikariamLevels).length > 0) {
    return {
      levels: allStorage.ikariamLevels,
      buildings: allStorage.ikariamBuildings || null,
      cities: allStorage.ikariamCitiesList || Object.keys(allStorage.ikariamLevels),
      cityLabels: allStorage.ikariamCityLabels || null,
      troops: allStorage.ikariamTroops || null
    };
  }

  if (allStorage.ikariamCitiesList && Array.isArray(allStorage.ikariamCitiesList) && allStorage.ikariamCitiesList.length > 0) {
    return {
      levels: allStorage.ikariamLevels || null,
      buildings: allStorage.ikariamBuildings || null,
      cities: allStorage.ikariamCitiesList,
      cityLabels: allStorage.ikariamCityLabels || null,
      troops: allStorage.ikariamTroops || null
    };
  }

  for (const k of Object.keys(allStorage)) {
    if (k.startsWith('ikariam_acc_data_')) continue;
    const val = allStorage[k];
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      const subVals = Object.values(val);
      if (subVals.length > 0 && typeof subVals[0] === 'object' && subVals[0] !== null) {
        if (subVals[0]["Intendencia"] !== undefined || subVals[0]["Depósito"] !== undefined || subVals[0]["Almacén"] !== undefined) {
          return {
            levels: val,
            buildings: allStorage.ikariamBuildings || null,
            cities: Object.keys(val),
            cityLabels: allStorage.ikariamCityLabels || null,
            troops: allStorage.ikariamTroops || null
          };
        }
      }
    }
  }

  return null;
}
