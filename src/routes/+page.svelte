<script lang="ts">
  import "../app.css";
  import { transitionStore } from "$lib/stores/transition.svelte";
  import Map from "$lib/components/Map.svelte";
  import PopupMenu from "$lib/components/PopupMenu.svelte";
  import DeviceInfo from "$lib/components/DeviceInfo.svelte";
  import { deviceStore } from "$lib/stores/device.svelte";
  import Transition from "$lib/components/Transition.svelte";
  import Settings from "./settings/+page.svelte";
  import Devices from "./devices/+page.svelte";
    import { appStore } from "$lib/stores/app.svelte";

  let isMenuOpen: boolean = $state(false);

  const closeMenu = (): void => {
    deviceStore.unselectAll();
    isMenuOpen = false;
  };
</script>

<div class="view-container">
  <div
    class="map-container"
    style:transform={transitionStore.currentOrientation === "left"
      ? "translateX(400px)"
      : transitionStore.currentOrientation === "right"
        ? "translateX(-400px)"
        : "translateX(0)"}
    style:transition="transform 350ms cubic-bezier(1, 1, 0, 0)"
  >
    <Map />
    <PopupMenu isOpen={Boolean(deviceStore.selected)} onClose={closeMenu}>
      {#if deviceStore.selected}
        <DeviceInfo device={deviceStore.selected} onClose={closeMenu} />
      {/if}
    </PopupMenu>
  </div>

  <Transition anchor="left" width={350} visible={appStore.isDevicesOpen}>
    <Devices />
  </Transition>

  <Transition anchor="right" width={400} visible={appStore.isSettingsOpen}>
    <Settings />
  </Transition>
</div>

<style>
  .map-container {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .view-container {
    position: relative;
    flex-grow: 1;
  }
</style>
