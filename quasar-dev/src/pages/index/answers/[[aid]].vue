<template>
  <template v-if="answerSheet">
    <main-window :answer-sheet="answerSheet" />
  </template>
  <template v-else>
    <div class="q-pa-md">
      <h3 class="text-center"
        >Do you want to view your answer sheet, continue answering or start a
        new one?</h3
      >
      <q-banner
        v-if="usersStore.selectedUser === null"
        class="q-mt-md text-left bg-blue-1 rounded-borders"
        rounded
      >
        <template #avatar>
          <q-icon name="person_add" color="primary" />
        </template>
        <div class="text-subtitle1 text-weight-medium">
          Select or add a user
        </div>
        <p class="q-mb-sm">
          Choose an existing user, or add a new one before continuing:
        </p>
        <ol class="q-pl-lg q-mb-none">
          <li>Open the sidebar using the menu button.</li>
          <li>Click the arrow below the avatar to open the user menu.</li>
          <li>Search for the user's name.</li>
          <li>
            If the user isn't listed, enter their name and click the plus button
            beside the search box.
          </li>
          <li>Select the user and click the check button to confirm.</li>
        </ol>
      </q-banner>
      <div class="q-mt-md text-center">
        <q-btn-group rounded>
          <q-btn-dropdown
            color="primary"
            outline
            rounded
            no-caps
            dense
            icon="mdi-gesture-tap"
            label="View submitted answer sheet"
          >
            <template
              v-for="(answerSheet, index) in answersStore.submittedAnswers"
              :key="index"
            >
              <answer-list-element
                :answer-sheet="answerSheet"
                @click="openAnswerSheet(answerSheet)"
              />
            </template>
          </q-btn-dropdown>
          <q-btn-dropdown
            color="secondary"
            outline
            rounded
            no-caps
            dense
            icon="mdi-gesture-tap"
            label="Continue answering"
          >
            <template
              v-for="(answerSheet, index) in answersStore.unSubmittedAnswers"
              :key="index"
            >
              <answer-list-element
                :answer-sheet="answerSheet"
                @click="openAnswerSheet(answerSheet)"
              />
            </template>
          </q-btn-dropdown>
          <q-btn-dropdown
            color="accent"
            outline
            rounded
            no-caps
            dense
            icon="mdi-gesture-tap"
            label="Start a new answer sheet"
            :disabled="
              questionsStore.questionPaperDrafts.length === 0 ||
              usersStore.selectedUser === null
            "
          >
            <template
              v-for="(
                questionPaper, index
              ) in questionsStore.questionPaperDrafts"
              :key="index"
            >
              <question-list-element
                :question="questionPaper"
                @click="createANewAnswerSheet(questionPaper.id)"
              />
            </template>
          </q-btn-dropdown>
        </q-btn-group>
      </div>
    </div>
  </template>
</template>
<script setup lang="ts">
import MainWindow from "@/components/AnswerSheet/MainWindow.vue";
import AnswerListElement from "@/components/AnswerSheet/AnswerListElement.vue";
import QuestionListElement from "@/components/QuestionsDraft/QuestionListElement.vue";

import type { GSK_ANSWER_TO_QUESTION_PAPER } from "@/library/types/answers";

import { ref, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { useAnswersStore } from "@/stores/answers";
import { useQuestionsStore } from "@/stores/questions";
import { useUsersStore } from "@/stores/users-settings";
import { useRouter } from "vue-router";

const route = useRoute();
const answersStore = useAnswersStore();
const questionsStore = useQuestionsStore();
const usersStore = useUsersStore();
const router = useRouter();

const aid = ref<string | null>(null);

watch(
  () => route.params,
  newParams => {
    const aidParam = (newParams as { aid: string }).aid;
    if (Array.isArray(aidParam)) {
      aid.value = aidParam[0];
    } else {
      aid.value = aidParam;
    }
  },
  { immediate: true }
);

const answerSheet = computed(() => {
  if (!aid.value) {
    return null;
  }
  return answersStore.loadAnswerSheetFromId(aid.value);
});

const createANewAnswerSheet = (questionPaperId: string) => {
  if (!usersStore.selectedUser) {
    return;
  }
  const questionPaper = questionsStore.getCopyOfDraft(questionPaperId);
  if (!questionPaper) {
    return;
  }
  const newAnswerSheet = answersStore.prepareANewAnswerForQuestionPaper(
    questionPaper,
    usersStore.selectedUser
  );
  router.push(`/answers/${newAnswerSheet.id}`);
};

const openAnswerSheet = (answerSheet: GSK_ANSWER_TO_QUESTION_PAPER) => {
  router.push(`/answers/${answerSheet.id}`);
};
</script>
