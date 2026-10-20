<template>
  <div class="q-pa-md">
    <q-card>
      <q-splitter :model-value="70" unit="px" :limits="[70, 80]" style="">
        <template #before>
          <div class="text-center text-h6 q-py-sm">
            {{ questionIndex + 1 }}/{{ questionsLength }}
          </div>
          <q-tabs v-model="innerTab" vertical class="text-teal">
            <q-tab
              name="problem"
              icon="mdi-math-integral"
              label="Problem"
              dense
              no-caps
            />
            <q-tab
              name="solution"
              icon="mdi-math-compass"
              label="Solution"
              dense
              no-caps
            />
          </q-tabs>
          <div class="text-center q-py-xs">
            <q-btn
              dense
              round
              push
              icon="mdi-chevron-up"
              @click="emits('move-up', questionIndex)"
              :disable="questionIndex === 0"
            />
          </div>
          <div class="text-center q-pb-xs">
            <q-btn
              dense
              round
              push
              icon="mdi-chevron-down"
              @click="emits('move-down', questionIndex)"
              :disable="questionIndex === questionsLength - 1"
            />
          </div>
          <div class="text-center q-pb-xs">
            <q-btn
              dense
              round
              push
              color="negative"
              icon="mdi-delete"
              @click="emits('delete', questionIndex)"
            />
          </div>
        </template>

        <template #after>
          <q-tab-panels
            v-model="innerTab"
            animated
            transition-prev="slide-down"
            transition-next="slide-up"
          >
            <q-tab-panel name="problem" class="q-pa-none">
              <draft-element section="question" v-model="question.question" />
            </q-tab-panel>
            <q-tab-panel name="solution" class="q-pa-none">
              <draft-element section="solution" v-model="question.solution" />
            </q-tab-panel>
          </q-tab-panels>
        </template>
      </q-splitter>
    </q-card>
  </div>
</template>
<script setup lang="ts">
const question = defineModel({
  type: Object as () => GSK_QUESTION_PAPER_DRAFT["questions"][number],
  required: true
});

const props = defineProps({
  questionIndex: {
    type: Number,
    required: true
  },
  questionsLength: {
    type: Number,
    required: true
  }
});

const emits = defineEmits(["move-up", "move-down", "delete"]);

import DraftElement from "@/components/QuestionsDraft/DraftElement.vue";

import type { GSK_QUESTION_PAPER_DRAFT } from "@/library/types/questions";

import { ref } from "vue";

const innerTab = ref("problem");
</script>
