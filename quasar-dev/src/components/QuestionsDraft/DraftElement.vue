<template>
  <q-expansion-item
    class="shadow-1 overflow-hidden"
    style="border-radius: 30px"
    :icon="colorLabelLookup[props.section]?.icon || 'mdi-help'"
    :label="colorLabelLookup[props.section]?.label || 'Unknown'"
    :header-class="
      colorLabelLookup[props.section]?.headerClass || 'bg-grey-3 text-black'
    "
    expand-icon-class="text-white"
    default-opened
  >
    <q-splitter v-model="splitterModel">
      <template v-slot:before>
        <editor-box v-model="draftElement.text" />
      </template>
      <template v-slot:after>
        <viewer-box :draft-text="draftElement.text" />
      </template>
    </q-splitter>
  </q-expansion-item>
</template>

<script setup lang="ts">
const props = defineProps({
  section: {
    type: String as () => "header" | "question" | "answer" | "footer",
    required: true
  }
});

const draftElement = defineModel({
  type: Object as () => GSK_DRAFT_ELEMENT,
  required: true
});

import EditorBox from "@/components/QuestionsDraft/EditorBox.vue";
import viewerBox from "@/components/QuestionsDraft/ViewerBox.vue";

import { ref } from "vue";
import type { GSK_DRAFT_ELEMENT } from "@/library/types/questions";

const splitterModel = ref(50);

const colorLabelLookup = {
  header: {
    headerClass: "bg-primary text-white",
    label: "Header",
    icon: "mdi-page-layout-header"
  },
  question: {
    headerClass: "bg-secondary text-white",
    label: "Question",
    icon: "mdi-help"
  },
  answer: {
    headerClass: "bg-accent text-white",
    label: "Answer",
    icon: "mdi-message-reply-text-outline"
  },
  footer: {
    headerClass: "bg-negative text-white",
    label: "Footer",
    icon: "mdi-page-layout-footer"
  }
};
</script>
