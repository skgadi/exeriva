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

import { ref, watch } from "vue";
import { useQuestionsStore } from "@/stores/questions";
import { useRouter } from "vue-router";

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
  // if it is a new page, then we need to update the route to the new id
  if (!props.questionPaperDraft) {
    const newId = questionToDraft.value.id;
    router.push(`/questions/${newId}`);
  }
};
</script>
