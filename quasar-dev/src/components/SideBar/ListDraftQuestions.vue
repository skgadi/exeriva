<template>
  <q-expansion-item
    expand-separator
    icon="mdi-tooltip-question-outline"
    label="Question papers"
    caption="Draft your questions here"
    :to="`/questions`"
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
      <list-questions-element :filter="filter" />
    </q-list>
  </q-expansion-item>
</template>

<script setup lang="ts">
import ListQuestionsElement from "@/components/SideBar/ListQuestionsElement.vue";

import { ref } from "vue";
import { uploadQuestionPaper } from "@/services/app-utils/variables/questions";

const filter = ref("");
</script>
