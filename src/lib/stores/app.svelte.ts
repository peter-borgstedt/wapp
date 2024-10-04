export interface AppState {
  currentView?: string;
}

function createAppStore() {
  let state = $state<AppState>({});

  return {
    get isDevicesOpen() { return state.currentView === 'devices' },
    get isSettingsOpen() { return state.currentView === 'settings' },
    get isAllClosed() { return !state.currentView },

    openDevicesView: () => {
      state.currentView = 'devices';
    },
    openSettingsView: () => {
      state.currentView = 'settings';
    },
    closeAll: () => {
      state.currentView = undefined;
    }
  };
}

export const appStore = createAppStore();
