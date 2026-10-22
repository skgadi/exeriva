<template>
  <q-expansion-item
    expand-separator
    icon="mdi-tooltip-question-outline"
    label="Question papers"
    caption="Draft your questions here"
  >
    <q-list bordered separator>
      <q-item>
        <q-item-section>
          <q-input
            rounded
            dense
            outlined
            clearable
            v-model="filter"
            placeholder="Search questions..."
          >
            <template v-slot:prepend>
              <q-icon class="q-ml-xs" name="mdi-magnify" slot="prepend" />
            </template>
          </q-input>
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item clickable v-ripple to="/questions/new-question">
        <q-item-section avatar>
          <q-icon name="mdi-new-box" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Draft</q-item-label>
          <q-item-label caption>Create a new question paper</q-item-label>
        </q-item-section>
      </q-item>
      <q-item clickable v-ripple @click="uploadQuestionPaper">
        <q-item-section avatar>
          <q-icon name="mdi-upload-box-outline" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Upload</q-item-label>
          <q-item-label caption>Upload a question paper</q-item-label>
        </q-item-section>
      </q-item>

      <template
        v-for="(question, index) in filteredQuestions"
        :key="question.id"
      >
        <q-item clickable v-ripple :to="'/questions/' + question.id">
          <q-item-section>
            <q-item-label>{{ question.shortTitle }}</q-item-label>
            <q-item-label caption>{{ question.title }}</q-item-label>
            <q-item-label class="text-mono" caption style="font-size: 0.7rem">
              <q-icon name="mdi-identifier" />:<span>{{ question.id }}</span>
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-list>
  </q-expansion-item>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useQuestionsStore } from "@/stores/questions";
import { uploadQuestionPaper } from "@/services/app-utils/variables/questions";

const questionsStore = useQuestionsStore();

const filter = ref("");
const filteredQuestions = computed(() => {
  if (!filter.value) {
    return questionsStore.questionPaperDrafts;
  }
  return questionsStore.questionPaperDrafts.filter(
    q =>
      q.shortTitle.toLowerCase().includes(filter.value.toLowerCase()) ||
      q.title.toLowerCase().includes(filter.value.toLowerCase())
  );
});
</script>
