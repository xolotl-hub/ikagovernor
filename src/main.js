import { state } from './state.js';
import { loadAccountData } from './storage.js';
import { initAccounts, setupAccountModals } from './views/accounts.js';
import { renderTabs, renderMetaSummary, renderContent, setupEditButton, setupReorderBuildingsButton, setOnSummaryRefresh } from './views/construction.js';
import { renderTroopCityTabs, renderTroopsContent, setOnSummaryRefreshForTroops } from './views/troops.js';
import { setupGlobalMetaPanel, setOnTroopsChanged } from './views/troops_meta.js';
import { renderSummary } from './views/summary.js';
import { setupSettingsHandlers, populateCityRenameList, setOnAllRefresh } from './views/settings.js';

// ── Router de Vistas ──────────────────────────────────────
export function switchView(targetView) {
  state.currentView = targetView;
  const views = {
    summary: document.getElementById('view-summary'),
    construction: document.getElementById('view-construction'),
    troops: document.getElementById('view-troops'),
    settings: document.getElementById('view-settings')
  };
  const navBtns = {
    summary: document.getElementById('nav-btn-summary'),
    construction: document.getElementById('nav-btn-construction'),
    troops: document.getElementById('nav-btn-troops'),
    settings: document.getElementById('nav-btn-settings')
  };

  Object.values(navBtns).forEach(b => b && b.classList.remove('active'));
  Object.values(views).forEach(v => v && v.classList.add('hidden'));

  const btnEdit = document.getElementById('btn-edit');
  if (btnEdit) {
    const isVisible = (targetView === 'construction' && !!state.currentAccount);
    btnEdit.style.display = isVisible ? 'flex' : 'none';
    btnEdit.classList.toggle('hidden', !isVisible);
  }

  if (targetView !== 'troops' && state.isMetaPanelOpen) {
    import('./views/troops_meta.js').then(m => m.closeMetaPanel(renderTroopCityTabs));
  }

  if (targetView === 'summary') {
    navBtns.summary?.classList.add('active');
    views.summary?.classList.remove('hidden');
    renderSummary();
  } else if (targetView === 'construction') {
    navBtns.construction?.classList.add('active');
    views.construction?.classList.remove('hidden');
    renderTabs();
    renderMetaSummary();
    renderContent();
  } else if (targetView === 'troops') {
    navBtns.troops?.classList.add('active');
    views.troops?.classList.remove('hidden');
    renderTroopCityTabs();
    if (state.isMetaPanelOpen) {
      import('./views/troops_meta.js').then(m => m.renderMetaPanel());
    } else {
      renderTroopsContent();
    }
  } else if (targetView === 'settings') {
    navBtns.settings?.classList.add('active');
    views.settings?.classList.remove('hidden');
    populateCityRenameList();
  }
}

// ── Callback de refresco global ───────────────────────────
function refreshAllViews() {
  if (state.currentView === 'construction') {
    renderTabs(); renderMetaSummary(); renderContent();
  } else if (state.currentView === 'troops') {
    renderTroopCityTabs(); renderTroopsContent();
  } else if (state.currentView === 'summary') {
    renderSummary();
  }
}

function onAccountSelected() {
  switchView('construction');
  renderTabs(); renderMetaSummary(); renderContent();
  renderTroopCityTabs(); renderTroopsContent();
  renderSummary(); populateCityRenameList();
}

// ── Bootstrap ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Scroll horizontal en tabs con rueda del ratón
  const tabsContainer = document.getElementById('tabs');
  if (tabsContainer) {
    tabsContainer.addEventListener('wheel', (evt) => {
      evt.preventDefault();
      tabsContainer.scrollLeft += evt.deltaY;
    }, { passive: false });
  }

  // Registrar callbacks cross-módulo
  setOnSummaryRefresh(renderSummary);
  setOnSummaryRefreshForTroops(renderSummary);
  setOnTroopsChanged(() => { renderTroopsContent(); renderSummary(); });
  setOnAllRefresh(() => {
    renderTabs(); renderMetaSummary(); renderContent();
    renderTroopCityTabs(); renderTroopsContent(); renderSummary();
  });

  // Navegación
  document.getElementById('nav-btn-summary')?.addEventListener('click', () => switchView('summary'));
  document.getElementById('nav-btn-construction')?.addEventListener('click', () => switchView('construction'));
  document.getElementById('nav-btn-troops')?.addEventListener('click', () => switchView('troops'));
  document.getElementById('nav-btn-settings')?.addEventListener('click', () => switchView('settings'));

  // Botones de modales de tropas
  document.getElementById('btn-close-add-troops-modal')?.addEventListener('click', () => {
    document.getElementById('modal-add-troops')?.classList.add('hidden');
  });
  document.getElementById('btn-close-update-troops-modal')?.addEventListener('click', () => {
    document.getElementById('modal-update-troops')?.classList.add('hidden');
  });

  // Setup de módulos
  setupEditButton();
  setupReorderBuildingsButton();
  setupSettingsHandlers();
  setupGlobalMetaPanel(renderTroopCityTabs);
  setupAccountModals(onAccountSelected);

  // Inicializar cuentas
  initAccounts(onAccountSelected);
});
