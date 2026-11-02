<template></template>
<script setup lang="ts">
const answerSheet = defineModel({
  type: Object as PropType<GSK_ANSWER_TO_QUESTION_PAPER>,
  required: true
});

import type { GSK_ANSWER_TO_QUESTION_PAPER } from "@/library/types/answers";
import type { PropType } from "vue";
import { onBeforeRouteLeave, onBeforeRouteUpdate } from "vue-router";
import { onBeforeUnmount } from "vue";

import { Dialog } from "quasar";
import { submitAnswerSheet } from "@/services/app-utils/variables/submission";

// Check helper
const isFreeNavigationBlocked = () =>
  answerSheet.value.questionPaper.settings.finishInOneSession &&
  !answerSheet.value.state.isSubmitted;

// Reusable Quasar Confirmation Dialog
const confirmNavigation = () => {
  return new Promise<boolean>(resolve => {
    Dialog.create({
      title: "Only one session allowed",
      message:
        "You are not allowed to leave this page or refresh the page because this answer sheet is configured to be completed in one session only. If you leave this page, your answer will be submitted automatically.",
      cancel: {
        label: "Stay Here",
        flat: true,
        color: "primary",
        noCaps: true
      },
      ok: {
        label: "Submit and Leave",
        color: "negative",
        unelevated: true,
        noCaps: true
      },
      persistent: true
    })
      .onOk(() => {
        submitAnswerSheet(answerSheet.value);
        resolve(true);
      })
      .onCancel(() => resolve(false));
  });
};

/**
 * VECTOR 1 & 2: In-App Clicks, Sidebar Selection, AND Browser Back/Forward Buttons
 * Vue Router handles the browser history navigation stack changes automatically using these guards.
 */
onBeforeRouteLeave(async () => {
  if (isFreeNavigationBlocked()) {
    return await confirmNavigation();
  }
  return true;
});

onBeforeRouteUpdate(async () => {
  if (isFreeNavigationBlocked()) {
    return await confirmNavigation();
  }
  return true;
});

/**
 * VECTOR 3: Browser Refresh, Tab Closure, or Closing the Browser window entirely
 * This forces the browser's native security dialog to interrupt execution.
 */
const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  if (isFreeNavigationBlocked()) {
    event.preventDefault();
    event.returnValue = ""; // Crucial configuration step for modern Chrome/Firefox/Safari spec
  }
};

window.addEventListener("beforeunload", handleBeforeUnload);
onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", handleBeforeUnload);
});
</script>
