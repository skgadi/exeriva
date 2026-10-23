<template>
  <q-expansion-item
    expand-separator
    default-opened
    icon="mdi-check-decagram-outline"
    label="My answers"
    caption="View your answers to the question papers"
  >
    <q-list dense separator bordered>
      <q-item v-if="answersStore.unSubmittedAnswers.length !== 0">
        <q-item-label header class="text-bold">Continue answering</q-item-label>
      </q-item>
      <answers-list-element
        v-for="answerSheet in answersStore.unSubmittedAnswers"
        :key="answerSheet.id"
        :answer-sheet="answerSheet"
        @click="openAnswerSheet(answerSheet)"
      />
      <q-item v-if="answersStore.submittedAnswers.length !== 0">
        <q-item-label header class="text-bold"
          >View submitted answer sheets</q-item-label
        >
      </q-item>
      <answers-list-element
        v-for="answerSheet in answersStore.submittedAnswers"
        :key="answerSheet.id"
        :answer-sheet="answerSheet"
        @click="openAnswerSheet(answerSheet)"
      />
    </q-list>
  </q-expansion-item>
</template>
<script setup lang="ts">
import AnswersListElement from "@/components/AnswerSheet/AnswerListElement.vue";

import { useAnswersStore } from "@/stores/answers";
import { useRouter } from "vue-router";
import type { GSK_ANSWER_TO_QUESTION_PAPER } from "@/library/types/answers";

const answersStore = useAnswersStore();
const router = useRouter();

const openAnswerSheet = (answerSheet: GSK_ANSWER_TO_QUESTION_PAPER) => {
  router.push(`/answers/${answerSheet.id}`);
};
</script>
