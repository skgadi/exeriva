<template>
  <template v-if="questionPaperDraft">
    <main-window :question-paper-draft="questionPaperDraft" />
  </template>
  <template v-else>
    <div class="q-pa-md">
      <h3 class="text-center"
        >Do you want to create or edit a question paper?</h3
      >
      <div class="q-mt-md text-center">
        <q-btn-group rounded>
          <q-btn
            color="primary"
            outline
            rounded
            no-caps
            dense
            icon="mdi-new-box"
            label="Create a new question paper"
            to="/questions/new-question"
          />
          <q-btn
            color="secondary"
            outline
            rounded
            no-caps
            dense
            icon="mdi-upload-box-outline"
            label="Upload a question paper to edit"
            @click="uploadQuestionPaper()"
          />
          <q-btn-dropdown
            color="accent"
            outline
            rounded
            no-caps
            dense
            icon="mdi-gesture-tap"
            label="View existing question papers"
          >
            <q-list bordered separator>
              <list-questions-element />
            </q-list>
          </q-btn-dropdown>
        </q-btn-group>
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import MainWindow from "@/components/QuestionsDraft/MainWindow.vue";
import ListQuestionsElement from "@/components/SideBar/ListQuestionsElement.vue";

import { ref, computed, watch } from "vue";

import { useRoute } from "vue-router";
import { useQuestionsStore } from "@/stores/questions";
import { uploadQuestionPaper } from "@/services/app-utils/variables/questions";

const route = useRoute();
const questionsStore = useQuestionsStore();

const qid = ref<string | null>(null);

watch(
  () => route.params,
  newParams => {
    const qidParam = (newParams as { qid: string }).qid;
    if (Array.isArray(qidParam)) {
      qid.value = qidParam[0];
    } else {
      qid.value = qidParam;
    }
  },
  { immediate: true }
);

const questionPaperDraft = computed(() => {
  if (!qid.value) {
    return null;
  }
  return questionsStore.getDraftById(qid.value);
});
</script>
