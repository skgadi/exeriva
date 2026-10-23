<template>
  <template v-if="isEditPasswordCorrect">
    <div class="useful-width q-pa-md">
      <div class="text-mono text-center q-mb-md text-h5">
        <q-icon name="mdi-identifier" />:
        <span
          class="text-purple-14 bg-orange-1 q-px-sm q-py-xs rounded-borders"
          >{{ questionToDraft.id }}</span
        >
        <copy-button
          :text-to-copy="questionToDraft.id"
          size="xs"
          class="q-ml-sm bg-grey-2 text-grey-9"
        />
      </div>
      <div class="q-gutter-md row justify-center">
        <q-input
          class="col-4"
          v-model="questionToDraft.title"
          label="Title"
          outlined
          rounded
          dense
          autofocus
        />
        <q-input
          class="col-3"
          v-model="questionToDraft.shortTitle"
          label="Short title"
          outlined
          rounded
          dense
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
              questionToDraft.title.trim() === '' ||
              questionToDraft.shortTitle.trim() === '' ||
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
            @click="downloadQuestionPaperNow"
          />
          <q-btn
            dense
            round
            no-caps
            class="q-px-md q-mr-sm"
            color="negative"
            title="Discard changes"
            icon="mdi-close"
            to="/questions/"
          />
          <q-btn
            dense
            round
            class="q-px-md q-mr-sm"
            color="negative"
            title="Delete the question paper"
            icon="mdi-delete-outline"
            @click="confirmDelete"
          />
          <q-btn
            dense
            round
            class="q-px-md"
            color="accent"
            title="Change passwords"
            icon="mdi-lock-outline"
          >
            <q-menu>
              <q-list>
                <q-item>
                  <q-item-section>
                    <password-input
                      v-model="questionToDraft.access.editPassword"
                      label="Password to edit"
                      icon="mdi-pencil-lock-outline"
                    />
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <password-input
                      v-model="questionToDraft.access.answerPassword"
                      label="Password to view and answer"
                      icon="mdi-eye-lock-outline"
                    />
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <password-input
                      v-model="questionToDraft.access.solutionPassword"
                      label="Password to view solutions"
                      icon="mdi-sort-variant-lock"
                    />
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <password-input
                      v-model="questionToDraft.access.showAnswersPassword"
                      label="Password to view answers"
                      icon="mdi-lock-percent-outline"
                    />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </div>
      <draft-main v-model="questionToDraft" />
    </div>
  </template>
  <template v-else>
    <div class="useful-width q-px-md q-pt-xl q-pb-lg">
      <div class="q-gutter-md row justify-center">
        <password-input
          v-model="enteredPasswordToEdit"
          label="Enter password to edit"
          icon="mdi-lock-outline"
        />
      </div>
    </div>
  </template>
</template>
<script setup lang="ts">
import type { GSK_QUESTION_PAPER_DRAFT } from "@/library/types/questions";

const props = defineProps<{
  questionPaperDraft?: GSK_QUESTION_PAPER_DRAFT | null;
}>();

import DraftMain from "@/components/QuestionsDraft/DraftMain.vue";
import PasswordInput from "@/components/ExtrasForQuasar/PasswordInput.vue";
import CopyButton from "@/components/ExtrasForQuasar/CopyButton.vue";

import { onBeforeUnmount, ref, watch, computed } from "vue";
import { useQuestionsStore } from "@/stores/questions";
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRouter } from "vue-router";
import { Dialog } from "quasar";
import { downloadQuestionPaper } from "@/services/app-utils/variables/questions";

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

// confirm to delete the question paper
const confirmDelete = () => {
  Dialog.create({
    title: "Delete Question Paper",
    message:
      "Are you sure you want to delete this question paper?<br>This action cannot be undone.",
    html: true,
    cancel: {
      label: "Cancel",
      flat: true,
      color: "primary",
      noCaps: true
    },
    ok: {
      label: "Delete",
      color: "negative",
      unelevated: true,
      noCaps: true
    },
    persistent: true
  })
    .onOk(() => {
      questionsStore.deleteQuestionPaperDraft(questionToDraft.value.id);
      router.push("/questions/");
    })
    .onCancel(() => {
      // Do nothing, user canceled the deletion
    });
};

const enteredPasswordToEdit = ref("");
const isEditPasswordCorrect = computed(() => {
  const passwords = questionsStore.getAccessPasswords(questionToDraft.value.id);
  if (!passwords) {
    return true; // If no passwords are set, allow editing without a password
  }
  if (passwords.editPassword === "") {
    return true; // If the edit password is empty, allow editing without a password
  }
  return enteredPasswordToEdit.value === passwords.editPassword;
});

const downloadQuestionPaperNow = async () => {
  await downloadQuestionPaper(questionToDraft.value);
};
</script>
