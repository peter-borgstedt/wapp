<script lang="ts">
    import type { Device } from "$lib/stores/device.svelte";

  export let device: Device;
  export let onClick: (device: Device) => void;
</script>

<button 
  class="device-icon" 
  onclick={() => onClick(device)}
  aria-label={`View details for ${device.name}`}
>
  <div>
    hejsan
  </div>
  <img src={device.imageUrl} alt="" />
</button>

<style>
  .device-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;
    padding: 0;
    border: none;
    background: none;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>