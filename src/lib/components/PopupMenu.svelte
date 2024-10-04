<script module lang="ts">
  import type { Snippet } from 'svelte';

  export type PopupMenuProps = {
    isOpen: boolean;
    onClose: () => void;
    children?: Snippet;
  };
</script>

<script lang="ts">
  import { fade, slide } from 'svelte/transition';
  const { isOpen = false, onClose, children }: PopupMenuProps = $props();
</script>

{#if isOpen}
<button id="popup-menu-overlay" type="button" class="popup-overlay" onclick={onClose} transition:fade>
  <div
    id="popup-menu"
    role="dialog"
    class="popup-content" 
    transition:slide={{ axis: 'y' }}
  >
    {@render children?.()}
  </div>
</button>
{/if}

<style>
  .popup-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0;
    padding: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: flex-end;
    border: none;
    z-index: 100;
  }

  .popup-content {
    background-color: white;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    width: 100%;
    max-height: 80vh;
    overflow-y: auto;
    z-index: 100;
  }
</style>
