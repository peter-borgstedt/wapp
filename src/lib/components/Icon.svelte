<script module lang="ts">
  export interface IconProps {
    name: string;
    type: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';
    size?: number | string;
    color?: string;
    children?: Snippet;
  }
</script>

<script lang="ts">
  import { untrack, type Snippet } from "svelte";

  const { name, type, size = 'md', color, children }: IconProps = $props();
  let container: HTMLSpanElement;
  $effect(() => {
    untrack(async () => {
      var xhr = new XMLHttpRequest;
      xhr.open('get',`/phosphor/${type}/${name}.svg`,true);

      xhr.onreadystatechange = function(){
        if (xhr.readyState != 4) return;
        const loadedSvg = xhr.responseXML?.documentElement;
        if (loadedSvg) {
          container.insertBefore(loadedSvg, container.firstChild);
        }
      };
      xhr.send();
    });
  });
</script>

<span
  bind:this={container}
  class={"icon" + (typeof size === 'string' ? ` ${size}` : '')}
  style={
    (typeof size === 'number' ? `width: ${size}px; height: ${size}px;` : '') +
    (color ? `color: ${color};` : 'currentColor')
  }
>
</span>

<style>
  .icon {
    display: block;
    pointer-events: none;
  }

  .xs {
    width: 12px;
    height: 12px;
  }

  .sm {
    width: 16px;
    height: 16px;
  }
  .md {
    width: 24px;
    height: 24px;
  }
  .md-lg {
    width: 28px;
    height: 28px;
  }
  .lg {
    width: 32px;
    height: 32px;
  }
</style>
