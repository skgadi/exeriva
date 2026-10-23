<template>Answer main window</template>
<script setup lang="ts">
const props = defineProps({
  answerSheet: {
    type: Object as PropType<GSK_ANSWER_TO_QUESTION_PAPER>,
    required: true
  }
});

import type { GSK_ANSWER_TO_QUESTION_PAPER } from "@/library/types/answers";

import { PropType } from "vue";
</script>
