<template>
  <template v-for="(question, index) in filteredQuestions" :key="question.id">
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
</template>
<script setup lang="ts">
const props = defineProps({
  filter: {
    type: String,
    required: false,
    default: ""
  }
});

import { computed } from "vue";
import { useQuestionsStore } from "@/stores/questions";

const questionsStore = useQuestionsStore();

const filteredQuestions = computed(() => {
  if (!props.filter) {
    return questionsStore.questionPaperDrafts;
  }
  return questionsStore.questionPaperDrafts.filter(
    q =>
      q.shortTitle.toLowerCase().includes(props.filter.toLowerCase()) ||
      q.title.toLowerCase().includes(props.filter.toLowerCase())
  );
});
</script>
