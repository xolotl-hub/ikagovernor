import { state } from '../state.js';
import { saveData, saveCitiesList, saveCityLabels, saveTroopsData } from '../storage.js';

let cityToDelete = null;
let onAllRefresh = null;
export function setOnAllRefresh(fn) { onAllRefresh = fn; }

export function openDeleteConfirmModal(cityId, cityName) {
  cityToDelete = cityId;
  const modal = document.getElementById('modal-confirm-delete');
  const text = document.getElementById('delete-confirm-text');
  text.textContent = `¿Eliminar "${cityName}"?`;
  modal.classList.remove('hidden');
}

export function populateCityRenameList() {
  const container = document.getElementById('city-rename-list');
  if (!container) return;
  container.innerHTML = '';

  let draggedCityIndex = null;

  state.cities.forEach((city, idx) => {
    const item = document.createElement('div');
    item.className = 'city-rename-item';
    item.draggable = true;
    item.dataset.index = idx;

    const label = state.cityLabels[city] || {};
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
      if (nVal || aVal) { state.cityLabels[city] = { name: nVal, abbr: aVal }; }
      else { delete state.cityLabels[city]; }
    };
    nameInput.addEventListener('input', updateLabel);
    abbrInput.addEventListener('input', updateLabel);

    item.querySelector('.city-delete-btn').onclick = () => openDeleteConfirmModal(city, existingName || city);

    item.addEventListener('dragstart', (e) => {
      draggedCityIndex = idx;
      item.classList.add('is-dragging');
      e.dataTransfer.setData('text/plain', idx);
    });
    item.addEventListener('dragover', (e) => e.preventDefault());
    item.addEventListener('drop', (e) => {
      e.preventDefault();
      const targetIndex = idx;
      if (draggedCityIndex !== null && draggedCityIndex !== targetIndex) {
        const movedCity = state.cities.splice(draggedCityIndex, 1)[0];
        state.cities.splice(targetIndex, 0, movedCity);
        saveCitiesList(); saveData();
        if (onAllRefresh) onAllRefresh();
        populateCityRenameList();
      }
    });
    item.addEventListener('dragend', () => item.classList.remove('is-dragging'));

    container.appendChild(item);
  });
}

export function setupSettingsHandlers() {
  const btnExportFile = document.getElementById('btn-export-file');
  const btnImportFile = document.getElementById('btn-import-file');
  const inputImportFile = document.getElementById('input-import-file');
  const btnToggleManual = document.getElementById('btn-toggle-manual');
  const manualBackupContainer = document.getElementById('manual-backup-container');
  const btnExport = document.getElementById('btn-export');
  const btnImport = document.getElementById('btn-import');
  const txtBackup = document.getElementById('txt-backup');
  const backupStatus = document.getElementById('backup-status');

  const showBackupStatus = (msg, isSuccess) => {
    if (!backupStatus) return;
    backupStatus.textContent = msg;
    backupStatus.className = `status-msg ${isSuccess ? 'success' : 'error'}`;
  };

  const generateBackupData = () => ({
    ikariamLevels: state.appData,
    ikariamBuildings: state.buildingsConfig,
    ikariamCityLabels: state.cityLabels,
    ikariamCitiesList: state.cities,
    ikariamTroops: state.troopsData
  });

  const processBackupImport = (parsed, sourceLabel = "") => {
    if (!parsed || typeof parsed !== 'object') throw new Error("El archivo no contiene un JSON válido.");
    if (!parsed.ikariamLevels) throw new Error("Formato no válido: falta la clave 'ikariamLevels'");

    state.appData = parsed.ikariamLevels;
    if (parsed.ikariamBuildings) state.buildingsConfig = parsed.ikariamBuildings;
    if (parsed.ikariamCitiesList && Array.isArray(parsed.ikariamCitiesList)) state.cities = parsed.ikariamCitiesList;
    state.cityLabels = parsed.ikariamCityLabels || {};
    if (parsed.ikariamTroops) state.troopsData = parsed.ikariamTroops;

    saveData(); saveCitiesList(); saveCityLabels(); saveTroopsData();
    if (onAllRefresh) onAllRefresh();
    populateCityRenameList();
    const origin = sourceLabel ? ` (${sourceLabel})` : "";
    showBackupStatus(`¡Datos importados con éxito${origin}!`, true);
  };

  // Añadir nueva ciudad
  document.getElementById('btn-add-new-city').onclick = () => {
    const newNum = state.cities.length + 1;
    const newCityId = "city_" + Date.now();
    state.cities.push(newCityId);
    state.appData[newCityId] = {};
    state.buildingsConfig.forEach(b => {
      state.appData[newCityId][b.name] = b.isMulti ? (b.name === "Depósito" ? [0, 0] : [0]) : 0;
    });
    state.cityLabels[newCityId] = { name: "Ciudad " + newNum, abbr: "C" + newNum };
    saveCitiesList(); saveCityLabels(); saveData();
    if (onAllRefresh) onAllRefresh();
    populateCityRenameList();
  };

  // Guardar nombres
  document.getElementById('btn-save-cities').onclick = () => {
    saveCityLabels();
    if (onAllRefresh) onAllRefresh();
    showBackupStatus("¡Ciudades guardadas con éxito!", true);
  };

  // Modal eliminar ciudad
  document.getElementById('btn-confirm-delete').onclick = () => {
    if (cityToDelete) {
      state.cities = state.cities.filter(c => c !== cityToDelete);
      delete state.appData[cityToDelete];
      delete state.cityLabels[cityToDelete];
      if (state.troopsData.cities) delete state.troopsData.cities[cityToDelete];
      if (state.troopsData.activeTroopCity === cityToDelete) {
        state.troopsData.activeTroopCity = state.cities[0] || null;
      }
      saveCitiesList(); saveCityLabels(); saveData(); saveTroopsData();
      if (onAllRefresh) onAllRefresh();
      populateCityRenameList();
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

  // Exportar archivo JSON
  if (btnExportFile) {
    btnExportFile.onclick = () => {
      const dataToExport = generateBackupData();
      const jsonStr = JSON.stringify(dataToExport, null, 2);
      const now = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      const safeName = state.currentAccount ? state.currentAccount.name.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' : '';
      const filename = `ikagovernor_backup_${safeName}${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}.json`;
      const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = filename;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      showBackupStatus(`¡Archivo descargado: ${filename}!`, true);
    };
  }

  // Importar archivo JSON
  if (btnImportFile && inputImportFile) {
    btnImportFile.onclick = () => { inputImportFile.value = ''; inputImportFile.click(); };
    inputImportFile.onchange = (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try { processBackupImport(JSON.parse(event.target.result), file.name); }
        catch (err) { showBackupStatus("Error al procesar el archivo: " + err.message, false); }
      };
      reader.onerror = () => showBackupStatus("No se pudo leer el archivo seleccionado.", false);
      reader.readAsText(file, "UTF-8");
    };
  }

  // Modo texto
  if (btnToggleManual && manualBackupContainer) {
    btnToggleManual.onclick = () => manualBackupContainer.classList.toggle('hidden');
  }

  // Copiar portapapeles
  if (btnExport) {
    btnExport.onclick = () => {
      const jsonStr = JSON.stringify(generateBackupData(), null, 2);
      if (txtBackup) { txtBackup.value = jsonStr; txtBackup.select(); }
      navigator.clipboard.writeText(jsonStr)
        .then(() => showBackupStatus("¡Copia de seguridad copiada al portapapeles!", true))
        .catch(() => showBackupStatus("Exportado al recuadro de texto.", true));
    };
  }

  // Importar texto pegado
  if (btnImport) {
    btnImport.onclick = () => {
      if (!txtBackup) return;
      const inputStr = txtBackup.value.trim();
      if (!inputStr) { showBackupStatus("El recuadro está vacío.", false); return; }
      try { processBackupImport(JSON.parse(inputStr), "texto"); }
      catch (err) { showBackupStatus("JSON inválido: " + err.message, false); }
    };
  }
}
