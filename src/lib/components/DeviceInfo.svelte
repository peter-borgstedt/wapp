<script lang="ts">
  import type { Device } from "$lib/stores/device.svelte";

  const { device, onClose }: { device: Device; onClose: () => void } = $props();

  function handleVoiceMessage() {
    // Implement voice message functionality
    console.log('Send voice message to', device.name);
  }

  function handleTracking() {
    // Implement real-time tracking
    console.log('Start real-time tracking for', device.name);
  }

  function handleEditImage() {
    // Implement image editing functionality
    console.log('Edit image for', device.name);
  }
</script>

<div class="device-info">
  <h2>{device.name}</h2>
  <div class="image-container">
    <img src={device.imageUrl} alt={device.name} />
    <button class="edit-image-button" onclick={handleEditImage}>Edit</button>
  </div>
  <p>Battery: {device.battery}%</p>
  <p>Last seen: {device.lastSeen}</p>

  <button onclick={handleVoiceMessage}>Send Voice Message</button>
  <button onclick={handleTracking}>Start Tracking</button>
  <button onclick={onClose}>Close</button>
</div>

<style>
  .device-info {
    background-color: white;
    padding: 1rem;
    border-radius: 8px;
  }

  .image-container {
    position: relative;
    display: inline-block;
  }

  img {
    width: 100px;
    height: 100px;
    object-fit: cover;
  }

  .edit-image-button {
    position: absolute;
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    border-radius: 4px;
    padding: 2px 5px;
    font-size: 0.8rem;
    cursor: pointer;
  }

  button {
    margin-top: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
</style>