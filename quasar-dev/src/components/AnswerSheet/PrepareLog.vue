<template></template>
<script setup lang="ts">
import type { GSK_ANSWER_TO_QUESTION_PAPER } from "@/library/types/answers";
import { watch, ref } from "vue";
import { useRoute } from "vue-router";
import { useAnswersStore } from "@/stores/answers";

const route = useRoute();
const answersStore = useAnswersStore();

const answerSheet = ref<GSK_ANSWER_TO_QUESTION_PAPER | null>(null);

/**
 * A new session is started in the following conditions:
 * 1. When answerID of route changes. (including if the answerID is same but the route is hard reloaded by refreshing the page)
 * 2. The viewingQuestionIndex should be 0 or more. If it is less than 0, we consider that the answer sheet is not yet started and hence no session is started.
 *
 * Also it is required to end the previous session if it is still ongoing. (i.e. endTime is -1)
 *
 */
watch(
  () => ({
    aid: (route.params as { aid?: string }).aid,
    qIdx: answerSheet?.value?.state.displayingQuestionIndex
  }),
  (newValues, oldValues) => {
    answerSheet.value =
      answersStore.loadAnswerSheetFromId(newValues.aid as string) || null;
    console.log("Route params changed", newValues, oldValues);
    if (newValues.aid === undefined) {
      if (oldValues?.aid !== undefined) {
        answersStore.closeASession(oldValues.aid);
      }
      return;
    }
    if (oldValues?.aid === undefined) {
      if (newValues?.aid !== undefined) {
        if (newValues.qIdx === undefined) return;
        if (newValues.qIdx < 0) return;
        answersStore.startASession(newValues.aid);
      }
      return;
    }

    if (newValues.aid !== oldValues.aid) {
      answersStore.closeASession(oldValues.aid);
      if (newValues?.qIdx === undefined) return;
      if (newValues.qIdx < 0) return;

      answersStore.startASession(newValues.aid);
      return;
    }
    if (newValues.qIdx === undefined) return;
    if (oldValues?.qIdx === undefined) return;
    if (newValues.qIdx < 0) return;
    if (oldValues?.qIdx < 0) {
      answersStore.startASession(newValues.aid);
      return;
    }
  },
  { immediate: true }
);
</script>
