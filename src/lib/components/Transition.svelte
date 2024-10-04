<script module lang="ts">
  import { type Snippet } from "svelte";

  type Props = {
    children?: Snippet;
    anchor: 'left' | 'right' | 'top' | 'bottom';
    visible?: boolean;
  } & (
    {
      fullscreen: true
      width?: number;
    } |
    {
      fullscreen?: false;
      width: number;
    }
  )
</script>

<script lang="ts">
  let { children, anchor, fullscreen, width = 600, visible = $bindable(true) }: Props = $props();

  function getTransform() {
    switch (anchor) {
      case 'left': return 'translateX(-100%)';
      case 'right': return 'translateX(100%)';
      case 'top': return 'translateY(-100%)';
      case 'bottom': return 'translateY(100%)';
    }
  }
</script>

<div 
  class="transition-container" 
  class:fullscreen
  style:width={fullscreen ? '100%' : `${width}px`}
  style:left={anchor === 'left' ? 0 : undefined}
  style:right={anchor === 'right' ? 0 : undefined}
  style:top={anchor === 'top' ? 0 : undefined}
  style:bottom={anchor === 'bottom' ? 0 : undefined}
  style:transform={visible ? 'none' : getTransform()}
>
  {@render children?.()}
</div>

<style>
  .transition-container {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    height: 100%;
    overflow: auto;
    transition: transform 350ms cubic-bezier(0.25, 0.1, 0.25, 1);
    z-index: 10;
  }

  .fullscreen {
    width: 100% !important;
    height: 100% !important;
  }
</style>
