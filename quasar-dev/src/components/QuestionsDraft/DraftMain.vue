<template>
  <draft-element section="header" v-model="draftQuestionPaper.header" />
  <draft-element section="footer" v-model="draftQuestionPaper.footer" />
  <draft-questions v-model="draftQuestionPaper.questions" />
</template>

<script setup lang="ts">
const draftQuestionPaper = defineModel({
  type: Object as () => GSK_QUESTION_PAPER_DRAFT,
  required: true
});

import DraftElement from "@/components/QuestionsDraft/DraftElement.vue";
import DraftQuestions from "@/components/QuestionsDraft/DraftQuestions.vue";

import type { GSK_QUESTION_PAPER_DRAFT } from "@/library/types/questions";
</script>
