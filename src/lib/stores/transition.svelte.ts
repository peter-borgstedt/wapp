export interface StoreState {
  currentOrientation: 'left' | 'right' | null;
  previousOrientation: 'left' | 'right' | null;
}

function createTransitionStore() {
  const state = $state<StoreState>({
    currentOrientation: null,
    previousOrientation: null,
  });

  return {
    get currentOrientation() { return state.currentOrientation },
    get previousOrientation() { return state.previousOrientation },
    setOrientation(orientation: 'left' | 'right' | null) {
      console.log('setOrientation', orientation);
      state.previousOrientation = state.currentOrientation;
      state.currentOrientation = orientation;
    },
    reset() {
      state.currentOrientation = null;
      state.previousOrientation = null;
    },
  };
}

export const transitionStore = createTransitionStore();
