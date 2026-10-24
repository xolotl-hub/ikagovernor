import { DEFAULT_CITIES, DEFAULT_CITY_LABELS, DEFAULT_BUILDINGS, DEFAULT_ACCOUNT } from './constants.js';

export const state = {
  accounts: [DEFAULT_ACCOUNT],
  currentAccount: null,
  accountToDelete: null,

  cities: [...DEFAULT_CITIES],
  cityLabels: { ...DEFAULT_CITY_LABELS },
  buildingsConfig: JSON.parse(JSON.stringify(DEFAULT_BUILDINGS)),
  currentBuilding: null,
  appData: {},
  troopsData: {
    activeTroopCity: DEFAULT_CITIES[0],
    cities: {}
  },

  currentView: "construction",
  isEditing: false,
  isReorderingBuildings: false,

  isMetaPanelOpen: false,
  metaPanelInputs: { units: {}, ships: {} },
  selectedMetaCities: new Set()
};

export function getInitialData(citiesList = state.cities, buildingsList = state.buildingsConfig) {
  const data = {};
  citiesList.forEach(city => {
    data[city] = {};
    buildingsList.forEach(b => {
      data[city][b.name] = b.isMulti ? (b.name === "Depósito" ? [0, 0] : [0]) : 0;
    });
  });
  return data;
}

export function formatResNum(num) {
  if (num === null || num === undefined) return "0";
  return num.toLocaleString();
}
