<template>
  <div class="q-pa-md">
    <div class="text-h6 q-mb-md"> Questions </div>

    <q-btn
      dense
      round
      no-caps
      class="q-px-md q-mr-sm"
      color="primary"
      title="Add a question"
      icon="mdi-text-box-plus-outline"
      @click="addAQuestion"
    />
    <template v-for="(question, index) in questions" :key="index">
      <draft-question
        v-model="questions[index]!"
        :question-index="index"
        :questions-length="questions.length"
        @move-up="moveQuestionUp"
        @move-down="moveQuestionDown"
        @delete="removeAQuestion"
      />
    </template>
  </div>
</template>
<script setup lang="ts">
const questions = defineModel({
  type: Object as () => GSK_QUESTION_PAPER_DRAFT["questions"],
  required: true
});

import DraftQuestion from "@/components/QuestionsDraft/DraftQuestion.vue";

import type { GSK_QUESTION_PAPER_DRAFT } from "@/library/types/questions";

const addAQuestion = () => {
  questions.value.push({
    question: {
      text: "",
      variables: []
    },
    solution: {
      text: "",
      variables: []
    }
  });
};

const removeAQuestion = (index: number) => {
  const confirmation = window.confirm(
    "Are you sure you want to delete this question?"
  );
  if (!confirmation) return;
  questions.value.splice(index, 1);
};

const moveQuestionUp = (index: number) => {
  if (index > 0) {
    const temp = questions.value[index];
    questions.value[index] = questions.value[index - 1]!;
    questions.value[index - 1] = temp!;
  }
};

const moveQuestionDown = (index: number) => {
  if (index < questions.value.length - 1) {
    const temp = questions.value[index];
    questions.value[index] = questions.value[index + 1]!;
    questions.value[index + 1] = temp!;
  }
};
</script>
