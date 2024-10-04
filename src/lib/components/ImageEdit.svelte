<script lang="ts">
  import { onMount, createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let fileInput: HTMLInputElement;
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let image: HTMLImageElement;
  let isDragging = $state(false);
  let startX = $state(0);
  let startY = $state(0);
  let offsetX = $state(0);
  let offsetY = $state(0);
  let scale = $state(1);

  const canvasSize = 300;
  const circleRadius = 100;
  const scaleSpeed = 0.001; // Adjust this value to control the scaling speed
  const moveSpeed = 1; // Adjust this value to control the movement speed

  $effect(() => {
    if (canvas) {
      ctx = canvas.getContext("2d")!;
      drawCanvas();
    }
  });

  const handleFileSelect = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        image = new Image();
        image.onload = () => {
          resetImagePosition();
          drawCanvas();
        };
        image.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const resetImagePosition = () => {
    offsetX = (canvasSize - image.width) / 2;
    offsetY = (canvasSize - image.height) / 2;
    scale = 1;
  };

  const drawCanvas = () => {
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    // Draw the scaled and translated image
    if (image) {
      ctx.save();
      ctx.translate(canvasSize / 2, canvasSize / 2);
      ctx.scale(scale, scale);
      ctx.translate(-canvasSize / 2, -canvasSize / 2);
      ctx.drawImage(image, offsetX, offsetY);
      ctx.restore();
    }

    // Draw the overlay
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // Clear the circle
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(canvasSize / 2, canvasSize / 2, circleRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";

    // Draw the circular image
    if (image) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(canvasSize / 2, canvasSize / 2, circleRadius, 0, Math.PI * 2);
      ctx.clip();
      ctx.translate(canvasSize / 2, canvasSize / 2);
      ctx.scale(scale, scale);
      ctx.translate(-canvasSize / 2, -canvasSize / 2);
      ctx.drawImage(image, offsetX, offsetY);
      ctx.restore();
    }
  };

  const handleMouseDown = (event: MouseEvent) => {
    if (image) {
      isDragging = true;
      startX = event.clientX;
      startY = event.clientY;
    }
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (isDragging) {
      const dx = (event.clientX - startX) * moveSpeed / scale;
      const dy = (event.clientY - startY) * moveSpeed / scale;
      offsetX += dx;
      offsetY += dy;
      startX = event.clientX;
      startY = event.clientY;
      drawCanvas();
    }
  };

  const handleMouseUp = () => {
    isDragging = false;
  };

  const handleWheel = (event: WheelEvent) => {
    event.preventDefault();
    const delta = -event.deltaY * scaleSpeed;
    scale *= 1 + delta;
    scale = Math.max(0.1, Math.min(scale, 5)); // Limit scale between 0.1 and 5
    drawCanvas();
  };

  const handleSave = async () => {
    if (image) {
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = circleRadius * 2;
      tempCanvas.height = circleRadius * 2;
      const tempCtx = tempCanvas.getContext("2d")!;

      tempCtx.beginPath();
      tempCtx.arc(circleRadius, circleRadius, circleRadius, 0, Math.PI * 2);
      tempCtx.clip();
      tempCtx.drawImage(
        canvas,
        canvasSize / 2 - circleRadius,
        canvasSize / 2 - circleRadius,
        circleRadius * 2,
        circleRadius * 2,
        0,
        0,
        circleRadius * 2,
        circleRadius * 2,
      );

      const croppedImageDataUrl = tempCanvas.toDataURL("image/png");
      // Convert the data URL to a Blob
      const response = await fetch(croppedImageDataUrl);
      const blob = await response.blob();

      // Create a download link
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = 'cropped_image.png';

      // Append the link to the body, click it, and remove it
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      // Clean up the object URL
      URL.revokeObjectURL(downloadLink.href);
      // dispatch("save", { imageDataUrl: croppedImageDataUrl });
    }
  };

  const handleCancel = () => {
    dispatch("cancel");
  };
</script>

<div class="image-edit-dialog">
  <h2>Edit Image</h2>
  <input
    type="file"
    accept="image/*"
    bind:this={fileInput}
    onchange={handleFileSelect}
  />
  <div class="canvas-container" style="--canvas-size: {canvasSize}px;">
    <canvas
      bind:this={canvas}
      width={canvasSize}
      height={canvasSize}
      onmousedown={handleMouseDown}
      onmousemove={handleMouseMove}
      onmouseup={handleMouseUp}
      onmouseleave={handleMouseUp}
      onwheel={handleWheel}
    ></canvas>
  </div>
  <div class="button-container">
    <button onclick={handleSave}>Save</button>
    <button onclick={handleCancel}>Cancel</button>
  </div>
</div>

<style>
  .image-edit-dialog {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .canvas-container {
    position: relative;
    width: var(--canvas-size);
    height: var(--canvas-size);
    margin: 20px 0;
    background-image: linear-gradient(45deg, #ccc 25%, transparent 25%),
      linear-gradient(-45deg, #ccc 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #ccc 75%),
      linear-gradient(-45deg, transparent 75%, #ccc 75%);
    background-size: 20px 20px;
    background-position:
      0 0,
      0 10px,
      10px -10px,
      -10px 0px;
  }

  canvas {
    position: absolute;
    top: 0;
    left: 0;
    border: 1px solid #ccc;
  }

  .button-container {
    display: flex;
    gap: 10px;
  }

  button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
</style>
