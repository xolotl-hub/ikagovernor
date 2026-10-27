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

/**
 * Crea un chip de recurso <span.res-chip> con imagen y cantidad.
 * Reemplaza los fragmentos innerHTML de recursos en toda la app.
 * @param {string} asset - ruta a la imagen (ej. "assets/resources/wood.png")
 * @param {string} alt   - texto alternativo de la imagen
 * @param {number} amount - cantidad numérica
 * @param {string} [cssClass] - clase extra opcional (ej. "res-chip-mini" o "discounted")
 * @returns {HTMLElement}
 */
export function makeResChip(asset, alt, amount, cssClass = '') {
  const span = document.createElement('span');
  span.className = ('res-chip ' + cssClass).trim();
  span.title = `${alt}: ${amount.toLocaleString()}`;

  const img = document.createElement('img');
  img.src = asset;
  img.alt = alt;

  const num = document.createElement('span');
  num.textContent = formatResNum(amount);

  span.appendChild(img);
  span.appendChild(num);
  return span;
}
