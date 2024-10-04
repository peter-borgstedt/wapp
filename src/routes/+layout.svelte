<script module lang="ts">
  import { type Snippet } from "svelte";

  interface Props {
    children?: Snippet;
  }
</script>

<script lang="ts">
  import { info } from '@tauri-apps/plugin-log';
  import BottomNavbar from "$lib/components/BottomNavbar.svelte";
  import { deviceStore } from "$lib/stores/device.svelte";
  import { untrack } from "svelte";

  deviceStore.setDevices([
    {
      id: 1,
      name: "Alice",
      imageUrl: "/panda.png",
      battery: 80,
      lastSeen: "5 minutes ago",
      location: { latitude: 59.6367, longitude: 17.0754 },
    },
    {
      id: 2,
      name: "Bob",
      imageUrl: "/panda.png",
      battery: 65,
      lastSeen: "2 hours ago",
      location: { latitude: 59.6385, longitude: 17.0772 },
    },
  ]);

  const { children }: Props = $props();

  $effect(() => {
    untrack(() => {
      info('testar');
    });
  });
</script>

<main>
  {@render children?.()}
  <BottomNavbar />
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100vw;
    _padding-top: env(safe-area-inset-top);
  }
</style>
