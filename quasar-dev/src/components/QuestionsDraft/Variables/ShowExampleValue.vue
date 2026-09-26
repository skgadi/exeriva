<template>
  <div>
    <div
      class="bg-grey-2"
      style="min-width: 200px; border: 1px solid #ccc; border-radius: 8px"
    >
      <div
        class="row items-center"
        style="height: 40px; border-bottom: 1px solid #ccc"
      >
        <div class="col text-center">
          <q-btn
            v-if="displayRefreshButton"
            flat
            round
            size="sm"
            icon="mdi-refresh"
            @click="emit('refresh')"
          />
          Example value
        </div>
      </div>
      <div class="q-px-xs">
        <display-tex :tex-content="`$$${valueToDisplay}$$`" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  valueToDisplay: {
    type: String,
    required: true
  },
  displayRefreshButton: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits<{
  (e: "refresh"): void;
}>();

import DisplayTex from "@/components/ExtrasForQuasar/DisplayTex.vue";
</script>
