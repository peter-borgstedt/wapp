<script lang="ts">
  import Icon from './Icon.svelte';
  import { page } from '$app/stores';
  import { appStore } from '$lib/stores/app.svelte';

  let path = $state($page.url.pathname);

  $effect(() => {
    path = $page.url.pathname;
  });

  const track = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log("success", position);
    }, (error) => {
      console.log('failure', error);
    });
  }
</script>

<nav>
  <button 
    onclick={() => track()} 
    class="action-button"
  >
    <Icon type="regular" name="map-pin-simple-area" size="md-lg" />
  </button>


  <button 
    onclick={() => appStore.openDevicesView()} 
    class="action-button"
    class:active={appStore.isDevicesOpen}
  >
    <Icon type="regular" name="list" size="md-lg" />
  </button>

  <button 
    onclick={() => {
      appStore.closeAll()
    }} 
    class="action-button"
    class:active={appStore.isAllClosed}
  >
    <Icon type="regular" name="compass-rose" size="md-lg" />
  </button>

  <button 
    onclick={() => appStore.openSettingsView()} 
    class="action-button"
    class:active={appStore.isSettingsOpen}
  >
    <Icon type="regular" name="gear" size="md-lg" />
  </button>
</nav>

<style>
  nav {
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 20px 20px 0 0;
    height: 75px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 50;
    box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.1);
    padding-bottom: max(env(safe-area-inset-bottom), 20px);
  }

  .action-button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #f0f0f0;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .action-button:hover {
    background-color: #e0e0e0;
    transform: scale(1.05);
  }

  .active {
    background-color: #ff7f50;
    color: white;
  }

  .active:hover {
    background-color: #ff6347;

  }

  :global(.action-button svg) {
    transition: transform 0.3s ease;
  }

  .action-button:hover :global(svg) {
    transform: scale(1.1);
  }
</style>
