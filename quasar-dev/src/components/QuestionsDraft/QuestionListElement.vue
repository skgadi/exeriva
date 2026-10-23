<template>
  <q-item @click="emits('click', props.question.id)" clickable v-ripple>
    <q-item-section>
      <div class="text-h6"> {{ props.question.shortTitle }} </div>
      <div class="text-subtitle2"> {{ props.question.title }} </div>
    </q-item-section>
  </q-item>
</template>
<script setup lang="ts">
const props = defineProps({
  question: {
    type: Object as () => GSK_QUESTION_PAPER_DRAFT,
    required: true
  }
});

const emits = defineEmits({
  click: (questionId: string) => true
});

import type { GSK_QUESTION_PAPER_DRAFT } from "@/library/types/questions";
</script>
