<template>
  <q-drawer
    v-model="showDrawer"
    :width="drawerWidth"
    :class="props.class"
    :breakpoint="0"
    bordered
    :side="props.side"
    :overlay="props.overlay"
  >
    <slot />
    <div
      v-if="props.side === 'left'"
      v-touch-pan.preserveCursor.prevent.mouse.horizontal="resizeDrawer"
      class="q-drawer__resizer q-drawer__resizer__left"
    />
    <div
      v-else
      v-touch-pan.preserveCursor.prevent.mouse.horizontal="resizeDrawer"
      class="q-drawer__resizer q-drawer__resizer__right"
    />
  </q-drawer>
</template>

<script setup lang="ts">
const props = defineProps({
  class: {
    type: String,
    default: ""
  },
  side: {
    type: String as () => "left" | "right",
    default: "right"
  },
  overlay: {
    type: Boolean,
    default: false
  }
});

const drawerWidth = defineModel("drawerWidth", {
  type: Number,
  required: true
});

const showDrawer = defineModel("showDrawer", {
  type: Boolean,
  required: true
});

const resizeDrawer = (event: any) => {
  const deltaX = event.delta.x;
  if (props.side === "right") {
    drawerWidth.value -= deltaX;
  } else {
    drawerWidth.value += deltaX;
  }
};
</script>

<style scoped lang="sass">
.q-drawer__resizer
  position: absolute
  top: 0
  bottom: 0
  width: 4px
  background-color: gray(0, 0.1)
  cursor: ew-resize

.q-drawer__resizer__left
  right: -2px

.q-drawer__resizer__right
  left: -2px
</style>
