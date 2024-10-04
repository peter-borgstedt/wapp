<script module lang="ts">
  import type { Device } from "$lib/stores/device.svelte";
  import { BatteryMedium, Clock, ChatTeardropText, MapPin } from 'phosphor-svelte';

  interface Props {
    device: Device;
  }
</script>

<script lang="ts">
  const { device }: Props = $props();

  function handleMessage() {
    console.log('Send message to', device.name);
  }

  function handleTracking() {
    console.log('Start tracking', device.name);
  }
</script>

<div class="device-card">
  <div class="device-icon-wrapper">
    <img src={device.imageUrl} alt={device.name} class="device-icon" />
  </div>
  
  <div class="device-info">
    <h3 class="device-name">{device.name}</h3>
    <div class="device-details">
      <span class="battery">
        <BatteryMedium weight="fill" name="battery" />
        {device.battery}%
      </span>

      <span class="last-seen">
        <Clock weight="fill" name="clock" />
        {device.lastSeen}
      </span>
    </div>
  </div>

  <div class="action-buttons">
    <button class="action-button" onclick={handleMessage} aria-label="Send message">
      <ChatTeardropText weight="fill" name="chat-teardrop-text" />
    </button>
    <button class="action-button" onclick={handleTracking} aria-label="Start tracking">
      <MapPin weight="fill" name="map-pin" />
    </button>
  </div>
</div>

<style>
  .device-card {
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    background: white;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    border-bottom: 1px solid #eee;
  }

  .device-icon-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    margin-right: 1rem;
  }

  .device-icon {
    width: 30px;
    height: 30px;
    transition: transform 0.5s ease;
  }

  .device-card:hover .device-icon-wrapper::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 50%;
    border: 2px solid transparent;
    border-top-color: #B48CC8;
    animation: rotate .5s linear infinite;
    z-index: 100;
  }

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .device-card:hover .device-icon {
    transform: scale(1.1) rotate(10deg);
  }

  .device-info {
    flex-grow: 1;
  }

  .device-name {
    margin: 0;
    font-size: 1rem;
    color: #333;
  }

  .device-details {
    display: flex;
    flex-direction: column;
    font-size: 0.8rem;
    color: #666;
    margin-top: 0.5rem;
  }

  .battery, .last-seen {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .battery :global(svg), .last-seen :global(svg) {
    margin-right: 0.5rem;
    min-width: 1rem;
  }

  .action-buttons {
    display: flex;
    z-index: 10;
  }

  .action-button {
    background: rgba(255, 228, 196, 0.6);
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 0.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .action-button:hover {
    background: rgba(255, 228, 196, 0.8);
    box-shadow: 0 0 10px rgba(255, 127, 80, 0.5);
    transform: scale(1.1);
  }

  .action-button :global(svg) {
    color: #ff7f50;
    transition: color 0.3s ease;
  }

  .action-button:hover :global(svg) {
    color: #ff6347;
  }
</style>
