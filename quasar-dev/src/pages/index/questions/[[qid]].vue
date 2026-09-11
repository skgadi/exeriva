<template>
  <template v-if="questionPaperDraft">
    <main-window :question-paper-draft="questionPaperDraft" />
  </template>
  <template v-else>
    <div class="q-pa-md">
      <h3 class="text-center">Question paper draft not found</h3>
    </div>
  </template>
</template>

<script setup lang="ts">
import MainWindow from "@/components/QuestionsDraft/MainWindow.vue";

import { ref, computed, watch } from "vue";

import { useRoute } from "vue-router";
import { useQuestionsStore } from "@/stores/questions";

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
