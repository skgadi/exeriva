<template>
  <div class="useful-width q-pa-md">
    <div class="q-gutter-md row justify-center">
      <q-input
        class="col-4"
        v-model="questionToDraft.title"
        label="Title"
        outlined
        rounded
        dense
        clearable
        autofocus
        :rules="[val => !!val || 'A title is required']"
      />
      <q-input
        class="col-3"
        v-model="questionToDraft.shortTitle"
        label="Short title"
        outlined
        rounded
        dense
        clearable
        :rules="[val => !!val || 'A short title is required']"
      />
      <div>
        <q-btn
          dense
          round
          no-caps
          class="q-px-md q-mr-sm"
          color="primary"
          title="Save"
          icon="mdi-content-save-outline"
          @click="saveDraft"
          :disable="
            questionsStore.isDraftSaved(questionToDraft.id, questionToDraft)
          "
        />
        <q-btn
          dense
          round
          no-caps
          class="q-px-md q-mr-sm"
          color="secondary"
          title="Download"
          icon="mdi-download-outline"
        />
        <q-btn
          dense
          round
          no-caps
          class="q-px-md q-mr-sm"
          color="negative"
          title="Discard"
          icon="mdi-close"
          to="/questions/"
        />
        <q-btn
          dense
          round
          class="q-px-md"
          color="negative"
          title="Delete"
          icon="mdi-delete-outline"
          @click="questionsStore.deleteQuestionPaperDraft(questionToDraft.id)"
        />
      </div>
    </div>
    <draft-main v-model="questionToDraft" />
  </div>
</template>
<script setup lang="ts">
import type { GSK_QUESTION_PAPER_DRAFT } from "@/library/types/questions";

const props = defineProps<{
  questionPaperDraft?: GSK_QUESTION_PAPER_DRAFT | null;
}>();

import DraftMain from "@/components/QuestionsDraft/DraftMain.vue";

import { onBeforeUnmount, ref, watch } from "vue";
import { useQuestionsStore } from "@/stores/questions";
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRouter } from "vue-router";
import { Dialog } from "quasar";

const questionsStore = useQuestionsStore();
const router = useRouter();

const questionToDraft = ref<GSK_QUESTION_PAPER_DRAFT>(
  questionsStore.getCopyOrCreateNewDraft(props.questionPaperDraft?.id || null)
);

watch(
  () => props.questionPaperDraft,
  newDraft => {
    questionToDraft.value = questionsStore.getCopyOrCreateNewDraft(
      newDraft?.id || null
    );
  },
  { immediate: true }
);

const saveDraft = () => {
  questionsStore.saveQuestionPaperDraft(questionToDraft.value);
  if (!props.questionPaperDraft) {
    const newId = questionToDraft.value.id;
    router.push(`/questions/${newId}`);
  }
};

// Check helper
const hasUnsavedChanges = () =>
  !questionsStore.isDraftSaved(questionToDraft.value.id, questionToDraft.value);

// Reusable Quasar Confirmation Dialog
const confirmNavigation = () => {
  return new Promise<boolean>(resolve => {
    Dialog.create({
      title: "Unsaved Changes",
      message:
        "You have unsaved edits in your draft. Are you sure you want to discard them and switch?",
      cancel: {
        label: "Stay Here",
        flat: true,
        color: "primary",
        noCaps: true
      },
      ok: {
        label: "Discard & Switch",
        color: "negative",
        unelevated: true,
        noCaps: true
      },
      persistent: true
    })
      .onOk(() => resolve(true))
      .onCancel(() => resolve(false));
  });
};

/**
 * VECTOR 1 & 2: In-App Clicks, Sidebar Selection, AND Browser Back/Forward Buttons
 * Vue Router handles the browser history navigation stack changes automatically using these guards.
 */
onBeforeRouteLeave(async () => {
  if (hasUnsavedChanges()) {
    return await confirmNavigation();
  }
  return true;
});

onBeforeRouteUpdate(async () => {
  if (hasUnsavedChanges()) {
    return await confirmNavigation();
  }
  return true;
});

/**
 * VECTOR 3: Browser Refresh, Tab Closure, or Closing the Browser window entirely
 * This forces the browser's native security dialog to interrupt execution.
 */
const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  if (hasUnsavedChanges()) {
    event.preventDefault();
    event.returnValue = ""; // Crucial configuration step for modern Chrome/Firefox/Safari spec
  }
};

window.addEventListener("beforeunload", handleBeforeUnload);
onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", handleBeforeUnload);
});
</script>
