<template>
  <select-number-type v-model="type.type" v-if="showType" />
  <select-number-display-type v-model="type.showFormat" />
  <select-round-to
    v-model="type.roundTo"
    :type="type.type"
    v-if="showRoundTo"
  />
  <select-numerator-digits
    v-model="type.fractionNumeratorDigits"
    :type="type.type"
    v-if="showNumeratorDigits"
  />
  <select-display-round-to
    v-model="type.displayRoundTo"
    :show-format="type.showFormat"
  />
</template>
<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: ""
  },
  showRoundTo: {
    type: Boolean,
    default: true
  },
  showNumeratorDigits: {
    type: Boolean,
    default: true
  },
  showType: {
    type: Boolean,
    default: true
  }
});

const type = defineModel({
  type: Object as () => GSK_NUMBER_TYPE,
  required: true
});

import SelectNumberType from "@/components/QuestionsDraft/Variables/SelectNumberType.vue";
import SelectNumberDisplayType from "@/components/QuestionsDraft/Variables/SelectNumberDisplayType.vue";
import SelectRoundTo from "@/components/QuestionsDraft/Variables/SelectRoundTo.vue";
import SelectNumeratorDigits from "@/components/QuestionsDraft/Variables/SelectNumeratorDigits.vue";
import SelectDisplayRoundTo from "@/components/QuestionsDraft/Variables/SelectDisplayRoundTo.vue";

import type { GSK_NUMBER_TYPE } from "@/library/types/variables";
</script>
