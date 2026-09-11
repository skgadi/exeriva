<template>
  <q-expansion-item
    expand-separator
    default-opened
    icon="mdi-tooltip-question-outline"
    label="Questions"
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
            <template v-slot:before>
              <q-icon class="q-ml-xs" name="mdi-magnify" slot="prepend" />
            </template>
            <template v-slot:after>
              <q-btn
                class="q-mr-xs"
                flat
                round
                dense
                icon="mdi-plus"
                to="/questions/new-question"
              />
            </template>
          </q-input>
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
          </q-item-section>
        </q-item>
      </template>
    </q-list>
  </q-expansion-item>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useQuestionsStore } from "@/stores/questions";

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
