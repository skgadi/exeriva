<template>
  <div class="q-gutter-md">
    <viewer-box
      :draft-text="questionElement.text"
      v-model="questionElement.variables"
      :inert="readOnly"
    />
  </div>
</template>
<script setup lang="ts">
const questionElement = defineModel({
  type: Object as PropType<GSK_DRAFT_ELEMENT>,
  required: true
});

const props = defineProps({
  readOnly: {
    type: Boolean,
    default: true
  }
});
import ViewerBox from "@/components/QuestionsDraft/ViewerBox.vue";

import type { GSK_DRAFT_ELEMENT } from "@/library/types/questions";
import { PropType } from "vue";
</script>
