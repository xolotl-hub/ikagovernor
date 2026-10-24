export const DEFAULT_CITIES = ["city_1"];

export const DEFAULT_CITY_LABELS = {
  "city_1": { name: "Ciudad 1", abbr: "C1" }
};

export const DEFAULT_ACCOUNT = {
  id: "acc_1",
  name: "Cuenta 1",
  world: "",
  createdAt: 1700000000000
};

export const DEFAULT_BUILDINGS = [
  { name: "Intendencia", meta1: 18, meta2: 28, meta3: 36, meta4: 42, meta5: 47, meta6: 49 },
  { 
    name: "Depósito", 
    isMulti: true, 
    instPrefix: "D",
    meta1: 14, meta2: 25, meta3: 35, meta4: 40, meta5: 45, meta6: 48 
  },
  { name: "Oficina del Arquitecto", meta1: 16, meta2: 32, meta3: 50, meta4: 50, meta5: 50, meta6: 50 },
  { name: "Carpintería", meta1: 16, meta2: 32, meta3: 50, meta4: 50, meta5: 50, meta6: 50 },
  { name: "Materia Especial", meta1: 12, meta2: 24, meta3: 35, meta4: 40, meta5: 45, meta6: 48 },
  { name: "Prensa de Vino", meta1: 15, meta2: 30, meta3: 40, meta4: 45, meta5: 50, meta6: 50 },
  { name: "Aserradero", meta1: 15, meta2: 28, meta3: 35, meta4: 40, meta5: 45, meta6: 50 },
  { name: "Taberna", meta1: 12, meta2: 22, meta3: 32, meta4: 36, meta5: 40, meta6: 40 },
  { 
    name: "Almacén", 
    isMulti: true, 
    instPrefix: "A",
    meta1: 14, meta2: 25, meta3: 35, meta4: 40, meta5: 45, meta6: 48 
  },
  { name: "Cronoforja", meta1: 10, meta2: 20, meta3: 30, meta4: 40, meta5: 50, meta6: 60 },
  { name: "Muralla", meta1: 15, meta2: 28, meta3: 40, meta4: 50, meta5: 60, meta6: 65 },
  { name: "Museo", meta1: 10, meta2: 25, meta3: 40, meta4: 45, meta5: 50, meta6: 50 }
];

export const BUILDING_COSTS = {
  "Intendencia": { baseWood: 82, factorWood: 1.29, baseMarble: 0, factorMarble: 1, marbleStartLvl: 99 },
  "Depósito": { baseWood: 40, factorWood: 1.33, baseMarble: 32, factorMarble: 1.33, marbleStartLvl: 4 },
  "Oficina del Arquitecto": { baseWood: 91, factorWood: 1.17, baseMarble: 60, factorMarble: 1.17, marbleStartLvl: 1 },
  "Carpintería": { baseWood: 66, factorWood: 1.17, baseMarble: 29, factorMarble: 1.17, marbleStartLvl: 1 },
  "Materia Especial": { baseWood: 101, factorWood: 1.17, baseMarble: 43, factorMarble: 1.17, marbleStartLvl: 1 },
  "Prensa de Vino": { baseWood: 89, factorWood: 1.17, baseMarble: 40, factorMarble: 1.17, marbleStartLvl: 1 },
  "Aserradero": { baseWood: 206, factorWood: 1.17, baseMarble: 118, factorMarble: 1.17, marbleStartLvl: 1 },
  "Taberna": { baseWood: 75, factorWood: 1.25, baseMarble: 12, factorMarble: 1.25, marbleStartLvl: 3 },
  "Almacén": { baseWood: 480, factorWood: 1.28, baseMarble: 240, factorMarble: 1.28, marbleStartLvl: 1 },
  "Cronoforja": { baseWood: 250, factorWood: 1.25, baseMarble: 180, factorMarble: 1.25, marbleStartLvl: 1 },
  "Muralla": { baseWood: 60, factorWood: 1.25, baseMarble: 80, factorMarble: 1.25, marbleStartLvl: 1 },
  "Museo": { baseWood: 300, factorWood: 1.35, baseMarble: 200, factorMarble: 1.35, marbleStartLvl: 1 }
};

export const TROOP_DEFINITIONS = {
  units: [
    { id: "hoplita", name: "Hoplita", icon: "assets/units/hoplita.png", wood: 40, sulfur: 30 },
    { id: "gigante", name: "Gigante a vapor", icon: "assets/units/gigante.png", wood: 130, sulfur: 180 },
    { id: "lancero", name: "Lancero", icon: "assets/units/lancero.png", wood: 30, sulfur: 0 },
    { id: "espadachin", name: "Espadachín", icon: "assets/units/espadachin.png", wood: 60, sulfur: 30 },
    { id: "fusilero", name: "Fusilero", icon: "assets/units/fusilero.png", wood: 50, sulfur: 150 },
    { id: "arquero", name: "Arquero", icon: "assets/units/arquero.png", wood: 40, sulfur: 0 },
    { id: "hondero", name: "Hondero", icon: "assets/units/hondero.png", wood: 20, sulfur: 0 },
    { id: "girocoptero", name: "Girocóptero", icon: "assets/units/girocoptero.png", wood: 100, sulfur: 25 },
    { id: "bombardero", name: "Globo bombardero", icon: "assets/units/bombardero.png", wood: 100, sulfur: 250 },
    { id: "ariete", name: "Ariete", icon: "assets/units/ariete.png", wood: 220, sulfur: 0 },
    { id: "catapulta", name: "Catapulta", icon: "assets/units/catapulta.png", wood: 260, sulfur: 300 },
    { id: "mortero", name: "Mortero", icon: "assets/units/mortero.png", wood: 300, sulfur: 1250 },
    { id: "cocinero", name: "Cocinero", icon: "assets/units/cocinero.png", wood: 50, wine: 150 },
    { id: "medico", name: "Médico", icon: "assets/units/medico.png", wood: 50, crystal: 450 }
  ],
  ships: [
    { id: "espolon", name: "Barco espolón", icon: "assets/ships/espolon.png", wood: 250, sulfur: 0 },
    { id: "llamas", name: "Barco lanzallamas", icon: "assets/ships/llamas.png", wood: 80, sulfur: 230 },
    { id: "catapulta_barco", name: "Barco catapulta", icon: "assets/ships/catapulta.png", wood: 180, sulfur: 160 },
    { id: "ballesta", name: "Barco ballesta", icon: "assets/ships/ballesta.png", wood: 180, sulfur: 160 },
    { id: "mortero_barco", name: "Barco mortero", icon: "assets/ships/mortero.png", wood: 160, sulfur: 700 },
    { id: "submarino", name: "Submarino", icon: "assets/ships/submarino.png", wood: 160, sulfur: 750, crystal: 100 },
    { id: "vapor", name: "Espolón a vapor", icon: "assets/ships/vapor.png", wood: 400, sulfur: 800 },
    { id: "palas", name: "Rueda de palas", icon: "assets/ships/palas.png", wood: 400, sulfur: 800 },
    { id: "misiles", name: "Barco lanzamisiles", icon: "assets/ships/misiles.png", wood: 200, sulfur: 1200 },
    { id: "portaglobos", name: "Portaglobos", icon: "assets/ships/portaglobos.png", wood: 700, sulfur: 700 },
    { id: "auxiliar", name: "Barco auxiliar", icon: "assets/ships/auxiliar.png", wood: 1200, wine: 800 }
  ]
};
