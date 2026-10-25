<template>
  <q-layout view="lHR Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          :icon="appSettings.isSideBarOpen ? 'mdi-menu-open' : 'mdi-menu'"
          aria-label="Menu"
          @click="appSettings.toggleSideBar"
        />

        <q-btn flat dense round :to="'/'" aria-label="Home">
          <q-avatar
            v-if="usersStore.selectedUser"
            size="32px"
            color="white"
            text-color="primary"
          >
            <q-img :src="appLogo" />
          </q-avatar>
          <q-icon v-else name="mdi-account-off-outline" />
        </q-btn>

        <q-toolbar-title>Exeriva</q-toolbar-title>

        <q-btn
          flat
          dense
          round
          :icon="
            appSettings.isScratchpadOpen
              ? 'mdi-note-minus-outline'
              : 'mdi-note-plus-outline'
          "
          aria-label="Toggle scratchpad"
          @click="appSettings.isScratchpadOpen = !appSettings.isScratchpadOpen"
        />
      </q-toolbar>
    </q-header>

    <!-- Left sidebar -->
    <q-drawer
      v-model="appSettings.isSideBarOpen"
      bordered
      :width="appSettings.sidebarWidth"
    >
      <div class="resizable-drawer-content">
        <main-side-bar />

        <div
          class="drawer-resize-handle drawer-resize-handle--right"
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize sidebar"
          title="Drag to resize sidebar"
          @pointerdown="startResize('left', $event)"
          @pointermove="resizeDrawer"
          @pointerup="stopResize"
          @pointercancel="stopResize"
          @lostpointercapture="stopResize"
        >
          <span class="drawer-resize-grip"></span>
        </div>
      </div>
    </q-drawer>

    <!-- Right scratchpad drawer -->
    <q-drawer
      v-model="appSettings.isScratchpadOpen"
      bordered
      side="right"
      :width="appSettings.scratchpadWidth"
    >
      <div class="resizable-drawer-content">
        <q-layout view="hHh lpR fFf">
          <q-page-container>
            <scratch-pad />
          </q-page-container>
        </q-layout>

        <div
          class="drawer-resize-handle drawer-resize-handle--left"
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize scratchpad"
          title="Drag to resize scratchpad"
          @pointerdown="startResize('right', $event)"
          @pointermove="resizeDrawer"
          @pointerup="stopResize"
          @pointercancel="stopResize"
          @lostpointercapture="stopResize"
        >
          <span class="drawer-resize-grip"></span>
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from "vue";

import MainSideBar from "@/components/SideBar/MainComponent.vue";
import PickUser from "@/components/SideBar/UserPicker.vue";
import ScratchPad from "@/components/ExtrasForQuasar/ScratchPad.vue";

import appLogo from "@/assets/app-icon.png";

import { useAppSettingsStore } from "@/stores/app-settings";
import { useUsersStore } from "@/stores/users-settings";

const appSettings = useAppSettingsStore();
const usersStore = useUsersStore();

// Resize limits.
const SIDEBAR_MIN = 220;
const SIDEBAR_MAX = 520;

const SCRATCHPAD_MIN = 280;
const SCRATCHPAD_MAX = 800;

type DrawerSide = "left" | "right";

interface ResizeState {
  side: DrawerSide;
  startX: number;
  startWidth: number;
  pointerId: number;
  target: HTMLElement;
}

let resizeState: ResizeState | null = null;

function startResize(side: DrawerSide, event: PointerEvent): void {
  // Only use the primary mouse button, but allow touch input.
  if (event.pointerType === "mouse" && event.button !== 0) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  const target = event.currentTarget as HTMLElement;

  resizeState = {
    side,
    startX: event.clientX,
    startWidth:
      side === "left" ? appSettings.sidebarWidth : appSettings.scratchpadWidth,
    pointerId: event.pointerId,
    target
  };

  // Continue receiving pointer events if the finger leaves the handle.
  target.setPointerCapture(event.pointerId);

  document.body.classList.add("drawer-is-resizing");
}

function resizeDrawer(event: PointerEvent): void {
  if (!resizeState) {
    return;
  }

  if (event.pointerId !== resizeState.pointerId) {
    return;
  }

  event.preventDefault();

  const deltaX = event.clientX - resizeState.startX;

  if (resizeState.side === "left") {
    // Left drawer: dragging right makes it wider.
    const maxWidth = Math.min(
      SIDEBAR_MAX,
      Math.max(SIDEBAR_MIN, window.innerWidth * 0.8)
    );

    appSettings.sidebarWidth = clamp(
      resizeState.startWidth + deltaX,
      Math.min(SIDEBAR_MIN, maxWidth),
      maxWidth
    );
  } else {
    // Right drawer: dragging left makes it wider.
    const maxWidth = Math.min(
      SCRATCHPAD_MAX,
      Math.max(SCRATCHPAD_MIN, window.innerWidth * 0.8)
    );

    appSettings.scratchpadWidth = clamp(
      resizeState.startWidth - deltaX,
      Math.min(SCRATCHPAD_MIN, maxWidth),
      maxWidth
    );
  }
}

function stopResize(event?: PointerEvent): void {
  if (!resizeState) {
    return;
  }

  const state = resizeState;

  // Ignore events belonging to another pointer.
  if (event && event.pointerId !== state.pointerId) {
    return;
  }

  resizeState = null;

  document.body.classList.remove("drawer-is-resizing");

  // lostpointercapture can also trigger this function.
  // Avoid attempting to release a pointer twice.
  if (event?.type === "lostpointercapture") {
    return;
  }

  if (state.target.hasPointerCapture(state.pointerId)) {
    state.target.releasePointerCapture(state.pointerId);
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

// Clean up if the component is unmounted during a drag.
onBeforeUnmount(() => {
  resizeState = null;
  document.body.classList.remove("drawer-is-resizing");
});
</script>

<style>
/*
 * The drawer content establishes the positioning context
 * for the resize handle.
 */
.resizable-drawer-content {
  position: relative;
  width: 100%;
  height: 100%;
  min-width: 0;
}

/*
 * Keep the handle inside the drawer boundary.
 * The wide transparent area makes it easier to grab on tablets.
 */
.drawer-resize-handle {
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 6000;

  width: 14px;
  display: flex;
  align-items: center;
  justify-content: center;

  cursor: col-resize;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;

  background: transparent;
}

/* Sidebar handle is on its right edge. */
.drawer-resize-handle--right {
  right: 0;
}

/* Scratchpad handle is on its left edge. */
.drawer-resize-handle--left {
  left: 0;
}

/* Visible grip in the center of the handle. */
.drawer-resize-grip {
  width: 4px;
  height: 42px;
  border-radius: 4px;

  background: #9e9e9e;
  opacity: 0.65;

  transition:
    opacity 0.15s ease,
    background-color 0.15s ease;
}

.drawer-resize-handle:hover .drawer-resize-grip {
  background: var(--q-primary);
  opacity: 1;
}

/* Prevent text selection while dragging. */
body.drawer-is-resizing {
  cursor: col-resize !important;
  user-select: none !important;
  -webkit-user-select: none !important;
}

/* Do not animate the drawer width during pointer movement. */
.q-drawer {
  transition: none !important;
}
</style>
