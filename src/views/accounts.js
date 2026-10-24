import { DEFAULT_ACCOUNT, DEFAULT_CITIES, DEFAULT_CITY_LABELS, DEFAULT_BUILDINGS } from '../constants.js';
import { state, getInitialData } from '../state.js';
import { loadAccountData, saveCurrentAccountBundle, findLegacyDataInStorage } from '../storage.js';

export function renderAccountsList(onAccountSelected) {
  const container = document.getElementById('accounts-list');
  if (!container) return;
  container.innerHTML = '';

  if (!state.accounts || state.accounts.length === 0) {
    container.innerHTML = `
      <div class="accounts-empty-state">
        <p>No tienes cuentas registradas.</p>
        <p style="margin-top: 6px; font-size: 11px;">Haz clic en <strong>"+ Agregar Cuenta"</strong> para comenzar a planificar tus ciudades.</p>
      </div>
    `;
    return;
  }

  state.accounts.forEach(acc => {
    const card = document.createElement('div');
    card.className = 'account-card';
    card.title = `Abrir cuenta: ${acc.name}`;

    const left = document.createElement('div');
    left.className = 'account-card-left';

    const avatar = document.createElement('div');
    avatar.className = 'account-avatar';
    avatar.textContent = '🏛️';

    const info = document.createElement('div');
    info.className = 'account-info';

    const nameEl = document.createElement('span');
    nameEl.className = 'account-name';
    nameEl.textContent = acc.name;
    info.appendChild(nameEl);

    if (acc.world && acc.world.trim()) {
      const worldEl = document.createElement('span');
      worldEl.className = 'account-world-tag';
      worldEl.textContent = '🌍 ' + acc.world.trim();
      info.appendChild(worldEl);
    }

    left.appendChild(avatar);
    left.appendChild(info);

    const right = document.createElement('div');
    right.className = 'account-card-right';

    const enterBtn = document.createElement('button');
    enterBtn.className = 'btn-enter-account';
    enterBtn.innerHTML = 'Entrar &#10148;';
    enterBtn.title = 'Acceder a ' + acc.name;
    enterBtn.onclick = (e) => {
      e.stopPropagation();
      selectAccount(acc, onAccountSelected);
    };

    const delBtn = document.createElement('button');
    delBtn.className = 'btn-delete-account';
    delBtn.textContent = '🗑️';
    delBtn.title = 'Eliminar cuenta';
    delBtn.onclick = (e) => {
      e.stopPropagation();
      state.accountToDelete = acc;
      document.getElementById('delete-account-confirm-text').textContent = `¿Seguro que deseas eliminar la cuenta "${acc.name}"?`;
      document.getElementById('modal-confirm-delete-account').classList.remove('hidden');
    };

    right.appendChild(enterBtn);
    right.appendChild(delBtn);

    card.appendChild(left);
    card.appendChild(right);

    card.onclick = () => {
      selectAccount(acc, onAccountSelected);
    };

    container.appendChild(card);
  });
}

export function selectAccount(account, onAccountSelected) {
  state.currentAccount = account;
  document.getElementById('session-user-display').textContent = account.name;
  const worldBadge = document.getElementById('session-world-display');
  if (account.world && account.world.trim()) {
    worldBadge.textContent = '🌍 ' + account.world.trim();
    worldBadge.classList.remove('hidden');
  } else {
    worldBadge.textContent = '';
    worldBadge.classList.add('hidden');
  }

  document.getElementById('view-accounts').classList.add('hidden');
  document.getElementById('app-main-container').classList.remove('hidden');

  loadAccountData(account.id, () => {
    if (onAccountSelected) onAccountSelected();
  });
}

export function setupAccountModals(onAccountSelected) {
  const modalAdd = document.getElementById('modal-add-account');
  const btnOpenAdd = document.getElementById('btn-open-add-account');
  const btnCloseAdd = document.getElementById('btn-close-add-account');
  const btnCancelAdd = document.getElementById('btn-cancel-add-account');
  const btnConfirmAdd = document.getElementById('btn-confirm-add-account');
  const inputName = document.getElementById('input-account-name');
  const inputWorld = document.getElementById('input-account-world');

  const modalDelete = document.getElementById('modal-confirm-delete-account');
  const btnCloseDel = document.getElementById('btn-close-delete-account-modal');
  const btnCancelDel = document.getElementById('btn-cancel-delete-account');
  const btnConfirmDel = document.getElementById('btn-confirm-delete-account');
  const btnSwitch = document.getElementById('btn-switch-account');

  if (btnOpenAdd) {
    btnOpenAdd.onclick = () => {
      inputName.value = '';
      inputWorld.value = '';
      modalAdd.classList.remove('hidden');
      inputName.focus();
    };
  }

  const closeAddModal = () => {
    if (modalAdd) modalAdd.classList.add('hidden');
  };
  if (btnCloseAdd) btnCloseAdd.onclick = closeAddModal;
  if (btnCancelAdd) btnCancelAdd.onclick = closeAddModal;

  if (btnConfirmAdd) {
    btnConfirmAdd.onclick = () => {
      const nameVal = inputName.value.trim();
      const worldVal = inputWorld.value.trim();

      if (!nameVal) {
        inputName.focus();
        inputName.style.borderColor = '#c62828';
        setTimeout(() => { inputName.style.borderColor = '#c2b58b'; }, 1500);
        return;
      }

      const newAcc = {
        id: "acc_" + Date.now(),
        name: nameVal,
        world: worldVal,
        createdAt: Date.now()
      };

      state.accounts.push(newAcc);
      const freshBundle = {
        levels: getInitialData(),
        buildings: JSON.parse(JSON.stringify(DEFAULT_BUILDINGS)),
        cities: [...DEFAULT_CITIES],
        cityLabels: { ...DEFAULT_CITY_LABELS },
        troops: { activeTroopCity: DEFAULT_CITIES[0], cities: {} }
      };

      chrome.storage.local.set({
        ikariamAccounts: state.accounts,
        ['ikariam_acc_data_' + newAcc.id]: freshBundle
      }, () => {
        closeAddModal();
        renderAccountsList(onAccountSelected);
      });
    };
  }

  if (inputName) {
    inputName.onkeydown = (e) => {
      if (e.key === 'Enter') btnConfirmAdd.click();
    };
  }
  if (inputWorld) {
    inputWorld.onkeydown = (e) => {
      if (e.key === 'Enter') btnConfirmAdd.click();
    };
  }

  const closeDeleteModal = () => {
    state.accountToDelete = null;
    if (modalDelete) modalDelete.classList.add('hidden');
  };
  if (btnCloseDel) btnCloseDel.onclick = closeDeleteModal;
  if (btnCancelDel) btnCancelDel.onclick = closeDeleteModal;

  if (btnConfirmDel) {
    btnConfirmDel.onclick = () => {
      if (!state.accountToDelete) return;
      const accId = state.accountToDelete.id;
      state.accounts = state.accounts.filter(a => a.id !== accId);

      chrome.storage.local.remove('ikariam_acc_data_' + accId, () => {
        chrome.storage.local.set({ ikariamAccounts: state.accounts }, () => {
          closeDeleteModal();
          renderAccountsList(onAccountSelected);
        });
      });
    };
  }

  if (btnSwitch) {
    btnSwitch.onclick = () => {
      saveCurrentAccountBundle();
      state.currentAccount = null;
      document.getElementById('app-main-container').classList.add('hidden');
      document.getElementById('btn-edit').classList.add('hidden');
      document.getElementById('view-accounts').classList.remove('hidden');
      renderAccountsList(onAccountSelected);
    };
  }
}

export function initAccounts(onAccountSelected) {
  renderAccountsList(onAccountSelected);

  chrome.storage.local.get(null, (result) => {
    if (result && Array.isArray(result.ikariamAccounts) && result.ikariamAccounts.length > 0) {
      state.accounts = result.ikariamAccounts;
      renderAccountsList(onAccountSelected);
      return;
    }

    const legacy = findLegacyDataInStorage(result);
    if (legacy) {
      state.accounts = [DEFAULT_ACCOUNT];
      chrome.storage.local.set({
        ikariamAccounts: state.accounts,
        ['ikariam_acc_data_' + DEFAULT_ACCOUNT.id]: legacy
      }, () => {
        renderAccountsList(onAccountSelected);
      });
      return;
    }

    state.accounts = [DEFAULT_ACCOUNT];
    const freshBundle = {
      levels: getInitialData(),
      buildings: JSON.parse(JSON.stringify(DEFAULT_BUILDINGS)),
      cities: [...DEFAULT_CITIES],
      cityLabels: { ...DEFAULT_CITY_LABELS },
      troops: { activeTroopCity: DEFAULT_CITIES[0], cities: {} }
    };
    chrome.storage.local.set({
      ikariamAccounts: state.accounts,
      ['ikariam_acc_data_' + DEFAULT_ACCOUNT.id]: freshBundle
    }, () => {
      renderAccountsList(onAccountSelected);
    });
  });
}
