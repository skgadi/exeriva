<template>
  <q-page class="scratchpad-page bg-grey-2">
    <!-- Normal scratchpad canvas -->
    <div class="canvas-host">
      <canvas
        ref="normalCanvas"
        class="canvas-element"
        @pointerdown="startDrawing"
        @pointermove="draw"
        @pointerup="stopDrawing"
        @pointercancel="stopDrawing"
        @lostpointercapture="stopDrawing"
        @contextmenu.prevent
      />
    </div>

    <!-- Normal mode controls -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <div class="row q-gutter-sm">
        <q-btn
          fab
          outline
          dense
          padding="xs"
          icon="mdi-trash-can-outline"
          color="negative"
          aria-label="Clear scratchpad"
          @click="clearCanvas"
        >
          <q-tooltip>Clear canvas</q-tooltip>
        </q-btn>
        <q-btn
          fab
          outline
          padding="xs"
          icon="mdi-arrow-expand-all"
          color="secondary"
          aria-label="Expand canvas"
          @click="openExpanded"
        >
          <q-tooltip>Expand canvas</q-tooltip>
        </q-btn>
      </div>
    </q-page-sticky>

    <!-- Expanded drawing workspace -->
    <q-dialog
      v-model="isExpanded"
      maximized
      transition-show="fade"
      transition-hide="fade"
      @show="onDialogShow"
      @hide="onDialogHide"
    >
      <q-card class="expanded-card column no-wrap">
        <!-- Expanded toolbar -->
        <q-card-section
          class="row items-center justify-between bg-primary text-white q-py-sm"
        >
          <div class="row items-center q-gutter-sm">
            <q-icon name="edit" size="sm" />
            <div class="text-subtitle1">Scratchpad</div>
          </div>

          <div class="row items-center q-gutter-sm">
            <q-btn
              flat
              round
              dense
              icon="mdi-trash-can-outline"
              aria-label="Clear scratchpad"
              @click="clearCanvas"
            >
              <q-tooltip>Clear canvas</q-tooltip>
            </q-btn>

            <q-btn
              flat
              round
              dense
              icon="mdi-arrow-collapse-all"
              aria-label="Close expanded canvas"
              @click="closeExpanded"
            >
              <q-tooltip>Return to page</q-tooltip>
            </q-btn>
          </div>
        </q-card-section>

        <!-- Expanded canvas -->
        <div class="canvas-host expanded-canvas-host col">
          <canvas
            ref="expandedCanvas"
            class="canvas-element"
            @pointerdown="startDrawing"
            @pointermove="draw"
            @pointerup="stopDrawing"
            @pointercancel="stopDrawing"
            @lostpointercapture="stopDrawing"
            @contextmenu.prevent
          />
        </div>

        <q-card-section
          class="bg-grey-3 text-caption text-grey-7 text-center q-py-xs"
        >
          Mouse, touch and stylus supported. Changes are temporary.
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onBeforeUnmount } from "vue";

interface Point {
  x: number;
  y: number;
}

const normalCanvas = ref<HTMLCanvasElement | null>(null);
const expandedCanvas = ref<HTMLCanvasElement | null>(null);
const isExpanded = ref(false);

// One persistent drawing buffer shared by both visible canvases.
// Coordinates in this buffer are CSS pixels, scaled for device pixel ratio.
const drawingCanvas = document.createElement("canvas");
let drawingCtx: CanvasRenderingContext2D | null =
  drawingCanvas.getContext("2d");

let bufferCssWidth = 0;
let bufferCssHeight = 0;
let bufferDpr = 0;

let resizeObserver: ResizeObserver | null = null;
let animationFrame = 0;

let isDrawing = false;
let activePointerId: number | null = null;
let lastX = 0;
let lastY = 0;

const getDpr = (): number => window.devicePixelRatio || 1;

const getVisibleCanvases = (): HTMLCanvasElement[] => {
  return [normalCanvas.value, expandedCanvas.value].filter(
    (canvas): canvas is HTMLCanvasElement => canvas !== null
  );
};

// Grow the drawing buffer when required. Never shrink it during this
// component's lifetime, and never stretch the old drawing when resizing.
const ensureDrawingBuffer = (
  width: number,
  height: number,
  dpr: number
): void => {
  const newCssWidth = Math.max(bufferCssWidth, width);
  const newCssHeight = Math.max(bufferCssHeight, height);

  const pixelWidth = Math.max(1, Math.round(newCssWidth * dpr));
  const pixelHeight = Math.max(1, Math.round(newCssHeight * dpr));

  if (
    drawingCanvas.width === pixelWidth &&
    drawingCanvas.height === pixelHeight &&
    bufferDpr === dpr
  ) {
    return;
  }

  // Preserve the existing buffer before changing its dimensions.
  let snapshot: HTMLCanvasElement | null = null;

  if (drawingCanvas.width > 0 && drawingCanvas.height > 0) {
    snapshot = document.createElement("canvas");
    snapshot.width = drawingCanvas.width;
    snapshot.height = drawingCanvas.height;

    const snapshotCtx = snapshot.getContext("2d");

    if (snapshotCtx) {
      snapshotCtx.drawImage(drawingCanvas, 0, 0);
    } else {
      snapshot = null;
    }
  }

  const oldCssWidth = bufferCssWidth;
  const oldCssHeight = bufferCssHeight;

  // Resizing a canvas clears it, so the snapshot above is essential.
  drawingCanvas.width = pixelWidth;
  drawingCanvas.height = pixelHeight;

  drawingCtx = drawingCanvas.getContext("2d");
  if (!drawingCtx) return;

  drawingCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  drawingCtx.strokeStyle = "#263238";
  drawingCtx.fillStyle = "#263238";
  drawingCtx.lineJoin = "round";
  drawingCtx.lineCap = "round";

  if (snapshot && oldCssWidth > 0 && oldCssHeight > 0) {
    // Restore at exactly the old CSS dimensions. No aspect-ratio scaling.
    drawingCtx.drawImage(
      snapshot,
      0,
      0,
      snapshot.width,
      snapshot.height,
      0,
      0,
      oldCssWidth,
      oldCssHeight
    );
  }

  bufferCssWidth = newCssWidth;
  bufferCssHeight = newCssHeight;
  bufferDpr = dpr;
};

// Display the persistent buffer in a visible canvas.
const renderCanvas = (canvas: HTMLCanvasElement): void => {
  const rect = canvas.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return;

  const dpr = getDpr();
  const pixelWidth = Math.max(1, Math.round(rect.width * dpr));
  const pixelHeight = Math.max(1, Math.round(rect.height * dpr));

  // Set backing dimensions only when they actually need to change.
  if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
  }

  const visibleCtx = canvas.getContext("2d");
  if (!visibleCtx) return;

  visibleCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  visibleCtx.clearRect(0, 0, rect.width, rect.height);

  if (
    drawingCanvas.width > 0 &&
    drawingCanvas.height > 0 &&
    bufferCssWidth > 0 &&
    bufferCssHeight > 0
  ) {
    // Draw at the buffer's original CSS dimensions.
    // Anything outside this viewport is clipped, not distorted.
    visibleCtx.drawImage(
      drawingCanvas,
      0,
      0,
      drawingCanvas.width,
      drawingCanvas.height,
      0,
      0,
      bufferCssWidth,
      bufferCssHeight
    );
  }
};

const renderAllCanvases = (): void => {
  for (const canvas of getVisibleCanvases()) {
    renderCanvas(canvas);
  }
};

// Initialize or resize a visible canvas.
const initCanvas = (canvas: HTMLCanvasElement | null): void => {
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return;

  ensureDrawingBuffer(rect.width, rect.height, getDpr());
  renderCanvas(canvas);
};

const scheduleRender = (): void => {
  cancelAnimationFrame(animationFrame);

  animationFrame = requestAnimationFrame(() => {
    // Ensure the buffer can accommodate the largest visible workspace.
    for (const canvas of getVisibleCanvases()) {
      const rect = canvas.getBoundingClientRect();

      if (rect.width > 0 && rect.height > 0) {
        ensureDrawingBuffer(rect.width, rect.height, getDpr());
      }
    }

    renderAllCanvases();
  });
};

const getCoordinates = (
  event: PointerEvent,
  canvas: HTMLCanvasElement
): Point => {
  const rect = canvas.getBoundingClientRect();

  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
};

const getPressure = (event: PointerEvent): number => {
  if (event.pointerType === "mouse") return 0.5;

  return event.pressure > 0 ? event.pressure : 0.5;
};

const startDrawing = (event: PointerEvent): void => {
  const canvas = event.currentTarget as HTMLCanvasElement;

  if (!drawingCtx || isDrawing) return;

  const rect = canvas.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return;

  event.preventDefault();

  ensureDrawingBuffer(rect.width, rect.height, getDpr());

  isDrawing = true;
  activePointerId = event.pointerId;

  canvas.setPointerCapture(event.pointerId);

  const { x, y } = getCoordinates(event, canvas);

  lastX = x;
  lastY = y;

  // Draw a dot for a simple tap.
  drawingCtx.lineWidth = 1 + getPressure(event) * 2;
  drawingCtx.beginPath();
  drawingCtx.arc(x, y, drawingCtx.lineWidth / 2, 0, Math.PI * 2);
  drawingCtx.fill();

  renderAllCanvases();
};

const draw = (event: PointerEvent): void => {
  if (!isDrawing || !drawingCtx) return;
  if (event.pointerId !== activePointerId) return;

  event.preventDefault();

  const canvas = event.currentTarget as HTMLCanvasElement;
  const events = event.getCoalescedEvents?.() ?? [event];

  for (const pointEvent of events) {
    const { x, y } = getCoordinates(pointEvent, canvas);

    drawingCtx.lineWidth = 1 + getPressure(pointEvent) * 2;
    drawingCtx.beginPath();
    drawingCtx.moveTo(lastX, lastY);
    drawingCtx.lineTo(x, y);
    drawingCtx.stroke();

    lastX = x;
    lastY = y;
  }

  renderAllCanvases();
};

const stopDrawing = (event?: PointerEvent): void => {
  if (
    event &&
    activePointerId !== null &&
    event.pointerId !== activePointerId
  ) {
    return;
  }

  isDrawing = false;
  activePointerId = null;

  drawingCtx?.beginPath();
};

const clearCanvas = (): void => {
  if (!drawingCtx) return;

  drawingCtx.save();
  drawingCtx.setTransform(1, 0, 0, 1, 0, 0);
  drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
  drawingCtx.restore();

  drawingCtx.beginPath();
  renderAllCanvases();
};

const openExpanded = async (): Promise<void> => {
  stopDrawing();

  isExpanded.value = true;

  // QDialog creates/shows its contents asynchronously.
  await nextTick();
};

const closeExpanded = (): void => {
  stopDrawing();
  isExpanded.value = false;
};

const onDialogShow = async (): Promise<void> => {
  await nextTick();

  const canvas = expandedCanvas.value;
  if (!canvas) return;

  initCanvas(canvas);

  // Observe the expanded canvas while the dialog is open.
  resizeObserver?.observe(canvas);
};

const onDialogHide = (): void => {
  stopDrawing();

  if (expandedCanvas.value) {
    resizeObserver?.unobserve(expandedCanvas.value);
  }

  // The normal canvas is still backed by the same persistent buffer.
  scheduleRender();
};

onMounted(async () => {
  await nextTick();

  const normal = normalCanvas.value;
  if (!normal) return;

  initCanvas(normal);

  resizeObserver = new ResizeObserver(() => {
    scheduleRender();
  });

  resizeObserver.observe(normal);

  window.addEventListener("resize", scheduleRender);
});

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrame);

  resizeObserver?.disconnect();
  resizeObserver = null;

  window.removeEventListener("resize", scheduleRender);

  isDrawing = false;
  activePointerId = null;
  drawingCtx = null;
});
</script>

<style scoped>
.scratchpad-page {
  position: relative;
  min-height: 300px;
  overflow: hidden;
}

/* Shared canvas container */
.canvas-host {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: white;
}

/* The canvas fills its container. */
.canvas-element {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  cursor: crosshair;
}

/* Full-screen dialog workspace */
.expanded-card {
  width: 100%;
  height: 100%;
  max-height: 100%;
  border-radius: 0;
  overflow: hidden;
}

.expanded-canvas-host {
  position: relative;
  min-height: 0;
  flex: 1 1 auto;
}
</style>
