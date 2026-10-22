<template>
  <div class="q-pa-md">
    <q-card>
      <q-splitter :model-value="70" unit="px" :limits="[70, 80]" style="">
        <template #before>
          <div class="text-center text-h6 q-py-sm">
            {{ questionIndex + 1 }}/{{ questionsLength }}
          </div>
          <q-tabs v-model="innerTab" vertical class="text-blue" dense>
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
            <table class="q-mx-auto">
              <tbody>
                <tr title="Credits per question">
                  <td class="text-overline">₢</td>
                  <td>:</td>
                  <td class="text-weight-bold text-subtitle text-right">{{
                    getCreditsPerQuestion(question.question)
                  }}</td>
                </tr>
                <tr title="Expected time per question">
                  <td class="text-overline">⏱</td>
                  <td>:</td>
                  <td class="text-weight-bold text-subtitle text-right">{{
                    getExpectedTimePerQuestion(question.question)
                  }}</td>
                </tr>
                <tr title="Repeat count for this question">
                  <td class="text-overline">⟳</td>
                  <td>:</td>
                  <td class="text-weight-bold text-subtitle text-right">
                    <div class="row items-center justify-end q-gutter-sm">
                      <div class="col-auto">
                        {{ question.question.numberOfRepeats }}
                      </div>
                      <div class="col-auto">
                        <div class="column">
                          <div class="col">
                            <q-icon
                              dense
                              class="cursor-pointer"
                              name="mdi-chevron-up"
                              @click="question.question.numberOfRepeats++"
                            />
                          </div>
                          <div class="col">
                            <q-icon
                              dense
                              class="cursor-pointer"
                              name="mdi-chevron-down"
                              @click="
                                question.question.numberOfRepeats > 1
                                  ? question.question.numberOfRepeats--
                                  : null
                              "
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="text-center q-py-xs">
            <q-btn
              dense
              round
              push
              title="Move question up"
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
              title="Move question down"
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
              title="Delete question"
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
import { ref, watch } from "vue";
import { updateSolutionVariables } from "@/services/app-utils/variables/handle-variable-manipulation";
import {
  getCreditsPerQuestion,
  getExpectedTimePerQuestion
} from "@/services/app-utils/variables/questions";

const innerTab = ref("problem");

watch(
  () => [question.value.question.variables, question.value.solution.variables],
  () => {
    const updatedVariables = updateSolutionVariables(
      question.value.question.variables,
      question.value.solution.variables
    );

    if (
      JSON.stringify(updatedVariables) ===
      JSON.stringify(question.value.solution.variables)
    ) {
      return;
    }

    question.value.solution.variables = updatedVariables;
    console.log(
      "Updated solution variables based on question variables:",
      question.value.solution.variables.map(v => v.name).join(", ")
    );
  },
  { deep: true }
);
</script>
