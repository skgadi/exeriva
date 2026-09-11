<template>
  <draft-element section="header" v-model="draftQuestionPaper.header" />
</template>

<script setup lang="ts">
const draftQuestionPaper = defineModel({
  type: Object as () => GSK_QUESTION_PAPER_DRAFT,
  required: true
});

import DraftElement from "@/components/QuestionsDraft/DraftElement.vue";

import type { GSK_QUESTION_PAPER_DRAFT } from "@/library/types/questions";
</script>
