<script lang="ts">
  import { deviceStore } from "$lib/stores/device.svelte";
  import DeviceCard from "./components/device-card.svelte";
</script>

<div class="container">
  {#each deviceStore.devices as device}
    <DeviceCard device={device} />
  {/each}
</div>

<style>
  .container {
    padding-top: env(safe-area-inset-top);
    position: absolute;
    top: 0;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background: #f9f9f9;
  }
</style>
