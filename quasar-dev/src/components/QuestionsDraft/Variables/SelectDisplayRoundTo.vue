<template>
  <q-select
    v-model="roundTo"
    v-if="!['fraction', 'mixed-fraction'].includes(showFormat)"
    :options="Array.from({ length: 31 }, (_, i) => i)"
    label="Display round to"
    style="min-width: 150px"
    dense
    outlined
    emit-value
    map-options
  />
</template>
<script setup lang="ts">
const roundTo = defineModel({
  type: Number as () => GSK_NUMBER_TYPE["displayRoundTo"],
  required: true
});

const props = defineProps({
  showFormat: {
    type: String as () => GSK_NUMBER_TYPE["showFormat"],
    required: true
  }
});

import type { GSK_NUMBER_TYPE } from "@/library/types/variables";

import { computed } from "vue";
</script>
